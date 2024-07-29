import ticketsRepo from "../repos/ticketsRepo.js"
import config from "../config/appConfig.js"
import getProviderService from "../utils/getProviderService.js";
import organisationRepo from "../repos/organisationRepo.js";
import prService from "./prService.js";
import {ApplicationError, errorCodes} from "../utils/ApplicationError.js";

class TicketService {
    async search(queryParams) {
        return ticketsRepo.find(queryParams)
    }

    async getTicketById(ticketId) {
        return ticketsRepo.getTicketById(ticketId)
    }

    async getByEpicId(epicId) {
        return ticketsRepo.getTicketsByEpic(epicId)
    }

    async create(ticket) {
        const {insertedId} = await ticketsRepo.createTicket(ticket)
        ticket._id = insertedId
        ticket.comments = []
        ticket.metadata = {}
        return ticket
    }

    async getAllPrsFromTicketId(ticketId) {
        return prService.getAllPrsFromTicketId(ticketId)
    }

    async createPrOnTicket(ticketId, body) {
        const {branch, description, repoId} = body;
        const ticket = await ticketsRepo.getTicketById(ticketId)
        return prService.create({
            branch: branch,
            description: description,
            orgId: ticket.orgId,
            repoId: repoId,
            ticketId: ticketId
        })
    }

    async addCommentOnTicket(ticketId, body) {
        const ticket = await ticketsRepo.getTicketById(ticketId);
        if(!ticket.provider){
            throw new ApplicationError(errorCodes.F002)
        }
        ticket.linkedRepo = await this.getLinkedRepoOfTicket(ticket);
        const gitProviderService = getProviderService(ticket.provider);
        await gitProviderService.createCommentOnTicket(ticket, body);
        if(!ticket.comments){
            ticket.comments = [];
        }
        ticket.comments.push({
            comment: body.comment,
            author: {
                name: config.appName()
            },
        });
        await ticketsRepo.updateComments(ticketId, ticket.comments);
    }

    async closeTicket(ticketId) {
        //todo implement close on gitproviders.
        await ticketsRepo.updateStatus(ticketId, "closed");
    }

    async createTicketFromWebhookAction(webhookAction, provider, providerId) {
        const {insertedId} = await ticketsRepo.createTicket({
            name: webhookAction.data?.ticket?.title,
            description: webhookAction.data?.ticket?.description,
            status: webhookAction.data?.ticket?.status,
            type: webhookAction.data?.ticket?.type,
            link: webhookAction.data?.ticket?.link,
            fullName: webhookAction.data?.ticket?.fullName,
            providerTicketId: webhookAction?.data?.ticket?.providerId,
            orgId: webhookAction.orgId,
            creator: webhookAction.data?.actor?.name,
            provider,
            providerId,
            metadata: {
                ...webhookAction.data?.ticket?.metadata,
                linkedRepoId: webhookAction.data?.repo?.id,
                projectName: webhookAction.data?.project?.name
            },
            comments: [],
        })
        webhookAction.ticketId = insertedId
    }

    async addTicketCommentFromWebhook(webhookAction, provider){
        const ticket = await this.findTicketByProviderAndFullName(provider, webhookAction.data?.ticket?.fullName )
        if(!ticket){
            throw new ApplicationError(errorCodes.F003)
        }
        if(!ticket.comments){
            ticket.comments = [];
        }

        ticket.comments.push({
            ...webhookAction.data.comment,
            author: webhookAction.data?.actor
        })
        await ticketsRepo.updateComments(ticket._id,  ticket.comments)
        webhookAction.ticketId = ticket._id
    }

    async findTicketByProviderAndFullName(provider, providerTicketId) {
        return ticketsRepo.findTicketByProviderAndFullName(provider, providerTicketId);
    }

    async getLinkedRepoOfTicket(ticket) {
        if(!ticket?.metadata?.linkedRepoId){
            return;
        }
        const org = await organisationRepo.getOrganisationById(ticket.orgId)
        return org.repos.find(repo => repo.id === ticket?.metadata?.linkedRepoId);
    }


}

export default new TicketService();
