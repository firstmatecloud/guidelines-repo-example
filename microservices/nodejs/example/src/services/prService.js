import prRepo from "../repos/prRepo.js"
import organisationRepo from "../repos/organisationRepo.js";
import getProviderService from "../utils/getProviderService.js";
import config from "../config/appConfig.js";
import ticketService from "./ticketService.js";


class PrService {
    async search(queryParams){
        return prRepo.find(queryParams)
    }
    async getPrById(prId){
        return prRepo.getPrById(prId)
    }

    async create(body) {
        const {branch, description, orgId, repoId, ticketId} = body;
        const repo = await this.getRepoOfPr({orgId, repoId})
        const gitProviderService = getProviderService(repo.provider);
        const pr = await gitProviderService.createPullRequest(orgId, repo, branch, description);
        pr.ticketId = ticketId
        const {insertedId} = await prRepo.createPr(pr)
        pr._id = insertedId
        pr.comments = []
        pr.metadata = {}
        return pr
    }

    async addCommentOnPr(prId, body) {
        const pr = await prRepo.getPrById(prId);
        const repo = await this.getRepoOfPr(pr)
        const gitProviderService = getProviderService(repo.provider);
        await gitProviderService.createCommentOnPr(repo, pr, body);
        if(!pr.comments){
            pr.comments = [];
        }
        pr.comments.push({
            comment: body.comment,
            author: {
                name: config.appName()
            }
        });
        await prRepo.updateComments(prId, pr.comments);
    }

    async getAllPrsFromTicketId(ticketId){
        return prRepo.findPrWithTicketId(ticketId)
    }

    async createPrFromWebhookAction(webhookAction, provider, providerId){
        const pr = {
            name: webhookAction.data?.pr?.title,
            description: webhookAction.data?.pr?.description,
            status: webhookAction.data?.pr?.status,
            link:  webhookAction.data?.pr?.link,
            fullName: webhookAction.data?.pr?.fullName,
            branchName: webhookAction.data?.pr?.branchName,
            providerPrId: webhookAction?.data?.pr?.providerId,
            orgId: webhookAction.orgId,
            creator: webhookAction.data?.actor?.name,
            repoId: `${webhookAction.data?.repo?.id}`,
            provider,
            providerId,
            metadata: {},
            comments: []
        }
        if(webhookAction?.data?.ticket?.fullName){
            const ticket = ticketService.findTicketByProviderAndFullName(provider, webhookAction.data?.ticket?.fullName)
            pr.ticketId = ticket._id
            webhookAction.ticketId = ticket._id;
        }
        const {insertedId} = await prRepo.createPr(pr)
        webhookAction.prId = insertedId
    }
    async addPrCommentFromWebhook(webhookAction, provider){
        const pr = await prRepo.findPrByProviderAndFullName(provider, webhookAction.data.pr.fullName )
        webhookAction.data.pr = {
            pr: pr?._id,
            providerId: webhookAction.data.pr.providerId,
            title: pr?.name,
            description: pr?.description,
            status: pr?.status,
            fullName: webhookAction.data.pr.fullName
        };
        if(!pr.comments){
            pr.comments = [];
        }
        pr.comments.push({
            ...webhookAction.data.comment,
            author: webhookAction.data?.actor
        })
        await prRepo.updateComments(pr._id,  pr.comments)
    }

    async getRepoOfPr(pr){
        const org = await organisationRepo.getOrganisationById(pr.orgId)
        return org.repos.find(repo => repo.id === pr.repoId);
    }


}

export default new PrService();
