import actionService from "../services/actionService.js";

class ActionController {
    async search(req, res, next){
        try {
            const response = await actionService.search(req.query);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }
    async getActionById(req, res, next){
        try {
            const actionId = req.params.actionId;
            const response = await actionService.getActionById(actionId);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }
    async updateStatus(req, res, next){
        try {
            const actionId = req.params.actionId;
            const response = await actionService.update(actionId,  req.body);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

}

export default new ActionController();
