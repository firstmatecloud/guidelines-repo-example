import simpleJwt from "jwt-simple";
import organisationRepo from '../../repos/organisationRepo.js';
import GitProviderInterface from "./interfaces/gitProviderInterface.js";
import {mapWebhookCallToAction} from "../mappers/jiraWebhookMapper.js";
import azureKeyvaultClient from "../../clients/azureKeyvaultClient.js";
import {ApplicationError, errorCodes} from "../../utils/ApplicationError.js";
import TicketProviderInterface from "./interfaces/ticketProviderInterface.js";
import extendsProviderClasses from "../../utils/ExtendsClasses.js";
import logger from "../../utils/logger.js";
import jiraClient from "../../clients/jiraClient.js";

class JiraService extends extendsProviderClasses(TicketProviderInterface) {

    async handleWebhookEvent(provider, headers,webhookEvent){
        const decoded = simpleJwt.decode(headers?.authorization?.replace("JWT ", ""), "", true);
        const providerId = `${decoded?.iss?.replace(":", "-")}-jira-app`
        const organisation = await organisationRepo.findOrganisationByTicketProviderAndProviderId(provider,providerId);
        const webhookAction = mapWebhookCallToAction(provider, webhookEvent, organisation);
        return {webhookAction, providerId};
    }

    async handleCallbackEvent(headers,body){
        //todo validate JWT token in headers
        if(body.eventType === "installed"){
            await azureKeyvaultClient.createNewSecret(`${body.clientKey}-jira-app`, {
                clientKey: body.clientKey,
                sharedSecret: body.sharedSecret
            })
        }

        if(body.eventType === "uninstalled"){
            //todo remove secret and repo from Org
            await azureKeyvaultClient.deleteSecret(`${body.clientKey}-jira-app`)
        }
    }
    async initProviderAccessRight(accessRight, organisation){
        const decoded = simpleJwt.decode(accessRight.resourceDetails.jwt, "", true);
        accessRight.resourceDetails.clientId = decoded.iss;
        accessRight.id =`${decoded?.iss}-jira-app`;
        accessRight.created = true
        return accessRight;
    }

    async createCommentOnTicket(ticket, body){
        await jiraClient.addCommentOnTicket(ticket.providerId, ticket.metadata.orgName, ticket,body.comment)
    }
}

export default new JiraService();

