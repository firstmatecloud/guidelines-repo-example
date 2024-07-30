import epicService from "../services/epicService.js";

class EpicController {

    async create(req, res, next) {
        try {
            const response = await epicService.create(req.body);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

    async get(req, res, next) {
        try {
            const epicId = req.params.epicId;
            const response = await epicService.get(epicId);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

    async updateMetaData(req, res, next) {
        try {
            const epicId = req.params.epicId;
            const response = await epicService.updateMetaData(epicId, req.body);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }



}

export default new EpicController();
