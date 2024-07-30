import {ApplicationError, errorCodes} from "../../../utils/ApplicationError.js";


export default class TicketProviderInterface {

    async initProviderAccessRight(accessRight, organisation){
        throw new ApplicationError(errorCodes.F001)
    }

    async handleCallbackEvent(headers, body){
        throw new ApplicationError(errorCodes.F001)
    }
    async handleWebhookEvent(provider, headers,body){
        throw new ApplicationError(errorCodes.F001)
    }

    async createTicket(orgId, title, description){
        //todo decide on parameters.
        throw new ApplicationError(errorCodes.F001)
    }

    async createCommentOnTicket(ticket, body){
        throw new ApplicationError(errorCodes.F001)
    }
}
TicketProviderInterface.accessTypes = ["ticketProviders"]
