import ticketService from "../services/ticketService.js";

class TicketController {
    async search(req, res, next){
        try {
            const response = await ticketService.search(req.query);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }
    async getTicketById(req, res, next){
        try {
            const ticketId = req.params.ticketId;
            const response = await ticketService.getTicketById(ticketId);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next){
        try {
            const response = await ticketService.create(req.body);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }
    async comment(req, res, next){
        try {
            const ticketId = req.params.ticketId;
            const response = await ticketService.addCommentOnTicket(ticketId, req.body);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

    async getAllPrsFromTicket(req, res, next){
        try {
            const ticketId = req.params.ticketId;
            const response = await ticketService.getAllPrsFromTicketId(ticketId);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }
    async createPr(req, res, next){
        try {
            const ticketId = req.params.ticketId;
            const response = await ticketService.createPrOnTicket(ticketId, req.body);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

    async close(req, res, next) {
        try {
            const ticketId = req.params.ticketId;
            const response = await ticketService.closeTicket(ticketId);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }
}

export default new TicketController();
