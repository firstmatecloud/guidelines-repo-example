import prService from "../services/prService.js";

class PrController {
    async search(req, res, next){
        try {
            const response = await prService.search(req.query);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }
    async getPrById(req, res, next){
        try {
            const prId = req.params.prId;
            const response = await prService.getPrById(prId);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next){
        try {
            const response = await prService.create(req.body);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }
    async comment(req, res, next){
        try {
            const prId = req.params.prId;
            const response = await prService.addCommentOnPr(prId, req.body);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }
}

export default new PrController();
