import gitService from "../services/gitService.js";
import logger from "../utils/logger.js";
import generateTemplate from "../config/postInstallPageTmpl.js";

class GitController {

    async webhook(req, res, next){
        try {
            const provider = req.params.provider;
            const response = await gitService.webhook(provider,req.headers, req.body);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }
    async callback(req, res, next){
        try {
            const provider = req.params.provider;
            const response = await gitService.callback(provider,req.headers, req.body);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }
    async postInstallPage(req, res, next){
        try {
            logger.debug({
                body: req.body,
                headers: req.headers,
                queryParams: req.query,
            },"post install page");
            const response = generateTemplate(req.query?.jwt,req.query?.xdm_e);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

}

export default new GitController();
