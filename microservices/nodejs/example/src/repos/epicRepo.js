import mongoDBClient from '../config/mongoConfig.js';
import {makeObjectId} from "./utils/mongoDbUtils.js";

class EpicRepo {

    async create(orgId, epic) {
        const collectionClient = await mongoDBClient.collection("epics")
        epic.orgId = makeObjectId(orgId);
        return collectionClient.insertOne(epic);
    }

    async get(epicId) {
        const collectionClient = await mongoDBClient.collection("epics")
        return collectionClient.findOne({
            _id: makeObjectId(epicId),
        });
    }


    async getByOrgId(orgId) {
        const collectionClient = await mongoDBClient.collection("epics")
        return collectionClient.find({
            orgId: makeObjectId(orgId),
        }).toArray();
    }


    async updateMetaData(epicId, data) {
        const collectionClient = await mongoDBClient.collection("epics")
        return collectionClient.updateOne(
            {_id: makeObjectId(epicId)},
            [
                {$set: {metadata: data}}
            ]);
    }


    async findSuggestionByOrgIdAndPrId(orgId, prId) {
        const collectionClient = await mongoDBClient.collection("suggestions")
        return collectionClient.findOne({
            orgId: makeObjectId(orgId),
            prs: {
                $elemMatch: {
                    id: prId
                }
            }
        });
    }


}

export default new EpicRepo();