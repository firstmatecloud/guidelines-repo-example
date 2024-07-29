import mongoDBClient from '../config/mongoConfig.js';
import {makeObjectId} from "./utils/mongoDbUtils.js";

class OrganisationRepo{

    async getOrganisationById(orgId){
        const collectionClient = await mongoDBClient.collection("organisations")
        return  await collectionClient.findOne({
            _id: makeObjectId(orgId)
        });
    }
    async getOrganisationByApiKey(apiKey){
        const collectionClient = await mongoDBClient.collection("organisations")
        return  await collectionClient.findOne({
            apiKey: apiKey
        });
    }
    async findOrganisationByGitProviderAndProviderId(provider, providerId){
        const collectionClient = await mongoDBClient.collection("organisations")
        return  collectionClient.findOne({
            "accessRights.gitProviders": {
                $elemMatch: {
                    id: providerId,
                    provider: provider
                }
            }
        });
    }
    async findOrganisationByTicketProviderAndProviderId(provider, providerId){
        const collectionClient = await mongoDBClient.collection("organisations")
        return  collectionClient.findOne({
            "accessRights.ticketProviders": {
                $elemMatch: {
                    id: providerId,
                    provider: provider
                }
            }
        });
    }

    async updateRepos(orgId, repos ) {
        const collectionClient = await mongoDBClient.collection("organisations")
        return collectionClient.updateOne(
            {_id: makeObjectId(orgId)},
            [
                {$set: {repos: repos}}
            ]);
    }



    async updateOrganisationAccessRights(orgId, accessRights) {
        const collectionClient = await mongoDBClient.collection("organisations")
        return collectionClient.updateOne(
            {_id: makeObjectId(orgId)},
            [
                {$set: {accessRights: accessRights}}
            ]);
    }
}

export default new OrganisationRepo();