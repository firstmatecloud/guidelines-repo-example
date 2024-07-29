import epicRepo from "../repos/epicRepo.js"
import ticketService from "../services/ticketService.js"

class EpicService {

    async create(orgId, body) {

        const epic = await epicRepo.create(orgId, body)
        return {
            id: epic.insertedId,
        }
    }

    async get(epicId) {
        let epic = await epicRepo.get(epicId)
        epic.tickets = await ticketService.getByEpicId(epicId)
        return epic
    }

    async getOrgEpics(orgId) {
        return await epicRepo.getByOrgId(orgId)

    }

    async updateMetaData(epicId, metaData) {
        await epicRepo.updateMetaData(epicId, metaData);
    }


}

export default new EpicService();
