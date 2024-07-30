import actionRepo from "../repos/actionRepo.js"


class ActionService {
    async search(queryParams) {
        return actionRepo.find(queryParams)
    }

    async getActionById(actionId) {
        return actionRepo.getActionsById(actionId)

    }

    async update(actionId, body) {
        const {status} = body;
        return actionRepo.updateStatus(actionId, status)
    }

}

export default new ActionService();
