import logger from "../utils/logger.js";
import ticketService from "./ticketService.js";
import k8sClient from "../clients/k8sClient.js";
import actionRepo from "../repos/actionRepo.js";
import config from "../config/appConfig.js";
import prService from "./prService.js";
import getProviderService from "../utils/getProviderService.js";
import jiraClient from "../clients/jiraClient.js";

class WebhookActionsService {
    async handleWebhookAction(webhookAction, provider, providerId){
        logger.debug(webhookAction, "Mapped webhook action");
        const action = webhookAction.action;
        if(!action){
            return;
        }
        switch(true){
            case action.type === "ticket" && !action.comment && action.verb === "created":
                await this.handleTicketCreation(webhookAction, provider, providerId);
                break;
            case action.type === "ticket" && action.comment && action.verb === "created":
                await this.handleTicketCommentCreation(webhookAction, provider, providerId);
                break;
            case action.type === "pr" && !action.comment && action.verb === "created":
                await this.handlePrCreation(webhookAction, provider, providerId);
                break;
            case action.type === "pr" && action.comment && action.verb === "created":
                await this.handlePrCommentCreation(webhookAction, provider);
                break;
            default:
                logger.error(action, "Action not implemented yet.")
        }
        logger.debug(webhookAction, "Webhook action after handling");
        if(!webhookAction.actionRequired){
            return;
        }
        //save action and create job
        const {insertedId} = await actionRepo.createAction(
            webhookAction
        );
        await k8sClient.createJob(webhookAction.orgId, insertedId)
    }


    async handleTicketCreation(webhookAction,  provider, providerId){
        if(!webhookAction.data?.ticket?.description?.includes(config.magicKeyWord())){
            return;
        }
        webhookAction.actionRequired = true;
        await ticketService.createTicketFromWebhookAction(webhookAction, provider, providerId)
    }

    async handleTicketCommentCreation(webhookAction, provider, providerId){
        if(!webhookAction.data?.comment?.comment?.includes(config.magicKeyWord())){
            return;
        }
        try{
            await ticketService.addTicketCommentFromWebhook(webhookAction, provider);
            webhookAction.actionRequired = true;
        }catch (e) {
            const providerService = getProviderService(provider);
            const ticket = {
                ...webhookAction.data.ticket,
                providerTicketId: webhookAction?.data?.ticket?.providerId,
                providerId,
            }
            const body = {
                comment: `This ticket was not linked to FirstMate. Please update the ticket description with "${config.magicKeyWord()}" to link the ticket.`
            }
            providerService.createCommentOnTicket(ticket, body);
        }
    }

    async handlePrCreation(webhookAction, provider, providerId){
        if(!webhookAction.data?.pr?.description?.includes(config.magicKeyWord())){
            return;
        }
        webhookAction.actionRequired = true;
        await prService.createPrFromWebhookAction(webhookAction, provider, providerId);
    }

    async handlePrCommentCreation(webhookAction, provider){
        if(!webhookAction.data?.comment?.comment?.includes(config.magicKeyWord())){
            return;
        }
        webhookAction.actionRequired = true;
        await prService.addPrCommentFromWebhook(webhookAction, provider);
    }
}

export default new WebhookActionsService();