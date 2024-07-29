import azureDevClient from '../../clients/azureDevClient.js';
import {mapAzureDevRepo} from "../mappers/providerResponseMapper.js";
import organisationRepo from "../../repos/organisationRepo.js";
import {
    mapWebhookCallToAction,
    mapPr
} from "../mappers/azureDevWebhookMapper.js";
import logger from "../../utils/logger.js";
import GitProviderInterface from "./interfaces/gitProviderInterface.js";
import TicketProviderInterface from "./interfaces/ticketProviderInterface.js";
import extendsProviderClasses from "../../utils/ExtendsClasses.js";

const webhookEvents =[
    "git.push",
    "git.pullrequest.created",
    "git.pullrequest.updated",
    "git.pullrequest.merged",
    "ms.vss-code.git-pullrequest-comment-event",
    "workitem.created",
    "workitem.updated",
    "workitem.commented",
    "build.complete",
    "ms.vss-pipelines.stage-state-changed-event",
    "ms.vss-pipelines.run-state-changed-event",
]

export class AzureDevService extends extendsProviderClasses(GitProviderInterface, TicketProviderInterface) {

    async handleWebhookEvent(provider, headers,webhookEvent){
        const apiKey = headers['authorization']
        const providerId = headers['provider-id']
        const organisation = await organisationRepo.getOrganisationByApiKey(apiKey)
        const webhookAction = mapWebhookCallToAction(provider, webhookEvent, organisation);
        const repoKeys= Object.keys(webhookAction.data.repo)
        if( repoKeys.length === 1 && repoKeys[0] === "providerId") {
            const repo = organisation.repos.find(repo => repo.metadata?.providerRepoId === webhookAction.data.repo.providerId);
            webhookAction.data.repo = {
                providerId: webhookAction.data.repo.providerId,
                id: repo?.id,
                name: repo?.name,
                fullName: repo?.fullName,
                link: repo?.link
            };
            webhookAction.data.pr = {
                providerId: webhookAction.data.pr.providerId,
                fullName: `${repo?.fullName}/pr/${webhookAction.data.pr.providerId}`,
            }
        }
        return {webhookAction, providerId};
    }

    async getCloneToken(provider){
        const token = await azureDevClient.getToken(provider.id)
        return token.accessToken
    }

    async initProviderAccessRight(accessRight, organisation){
        accessRight.id = `${accessRight.resourceDetails?.tenant}@${accessRight.resourceDetails.orgName}`;
        accessRight.created = true

        const projects = await azureDevClient.listProjects(accessRight.id);
        if(!accessRight?.resourceDetails?.manualPermissionCreation){
            for(const project of projects){
                const promises = webhookEvents.map(webhookEvent => azureDevClient.createSubscription(accessRight.id, project, webhookEvent, organisation.apiKey));
                await Promise.all(promises);
            }
        }

        return accessRight;
    }

    async listRepos(provider){
        const projects = await azureDevClient.listProjects(provider.id);
        const repos = []
        for(const project of projects){
            const projectRepos = await azureDevClient.listRepos(provider.id, project)
            for(const projectRepo of projectRepos){
                const repo = mapAzureDevRepo(provider.id, projectRepo);
                repos.push(repo);
            }
        }
        return repos;
    }

    async getFilePaths(providerId, repo){
        const files = await azureDevClient.listFilesInDirectory(providerId, repo, "/")
        return files.map(file => ({
            path: file.path,
        }))
    }


    async handleCallbackEvent(headers, body){
        logger.debug({headers, body}, "Callback event received for azuredev")
    }



    async createPullRequest(orgId, repo, branchName, description){
        const providerId = repo.providerId;
        const resp = await azureDevClient.createPullRequest(providerId, repo, branchName, description)
        return mapPr(orgId, resp, repo, branchName, description, providerId)
    }

    async createCommentOnTicket(ticket, body){
        const providerId = ticket.providerId;
        await azureDevClient.createCommentOnTicket(providerId, ticket, body.comment);
    }

    async createCommentOnPr(repo, pr, body) {
        const providerId = pr.providerId;
        await azureDevClient.createNewCommentOnPr(providerId, repo, pr, body.comment);
    }

}

export default new AzureDevService();
