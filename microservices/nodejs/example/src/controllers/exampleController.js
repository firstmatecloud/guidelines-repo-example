import exampleService from "../services/exampleService.js";

class ExampleController {

    async create(req, res, next) {
        try {
            const response = await exampleService.create(req.body);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

}

export default new ExampleController();