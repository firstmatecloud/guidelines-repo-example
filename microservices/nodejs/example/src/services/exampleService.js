import exampleRepo from "../repos/epicRepo.js"

class ExampleService {

    async create(orgId, body) {

        const epic = await exampleRepo.create(orgId, body)
        return {
            id: epic.insertedId,
        }
    }


}

export default new ExampleService();