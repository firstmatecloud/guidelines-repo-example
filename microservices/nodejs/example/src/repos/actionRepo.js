import mongoDBClient from '../config/mongoConfig.js';
import {convertParametersToMongoDbFilter, makeObjectId} from "./utils/mongoDbUtils.js";

class ActionsRepo {

    async find(queryParams) {
        const searchParams = convertParametersToMongoDbFilter(queryParams);
        const collectionClient = await mongoDBClient.collection("actions")
        return collectionClient.find(searchParams?.criteria).toArray();
    }

    async createAction(action) {
        const collectionClient = await mongoDBClient.collection("actions")
        action.orgId = makeObjectId(action.orgId);
        action.creationTimestamp = new Date();
        action.status = "created"
        return collectionClient.insertOne(action);
    }

    async updateStatus(actionId, status) {
        const collectionClient = await mongoDBClient.collection("actions")
        return collectionClient.updateOne(
            {_id: makeObjectId(actionId)},
            [
                {$set: {status: status}}
            ])
    }


    async getActionsById(id) {
        const collectionClient = await mongoDBClient.collection("actions")
        return collectionClient.findOne({
            _id: makeObjectId(id),
        });
    }


}

export default new ActionsRepo();