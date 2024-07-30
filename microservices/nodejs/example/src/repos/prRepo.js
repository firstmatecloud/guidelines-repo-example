import mongoDBClient from '../config/mongoConfig.js';
import {convertParametersToMongoDbFilter, makeObjectId} from "./utils/mongoDbUtils.js";

class PrRepo {

    async find(queryParams){
        const searchParams = convertParametersToMongoDbFilter(queryParams);
        const collectionClient = await mongoDBClient.collection("prs")
        return collectionClient.find(searchParams?.criteria).toArray();
    }
    async getPrById(prId){
        const collectionClient = await mongoDBClient.collection("prs")
        return collectionClient.findOne({_id: makeObjectId(prId)});
    }

    async createPr(pr) {
        const collectionClient = await mongoDBClient.collection("prs")
        pr.orgId = makeObjectId(pr.orgId);
        pr.ticketId = makeObjectId(pr.ticketId);
        pr.creationTimestamp = new Date();
        return collectionClient.insertOne(pr);
    }

    async findPrWithTicketId(ticketId){
        const collectionClient = await mongoDBClient.collection("prs")
        return collectionClient.find({ticketId: makeObjectId(ticketId)}).toArray();
    }
    async findPrByProviderAndFullName(provider, fullName){
        const collectionClient = await mongoDBClient.collection("prs")
        return collectionClient.findOne({
            provider,
            fullName
        });
    }
    async findPrByRepoIdAndProviderPrId(repoId, providerPrId){
        const collectionClient = await mongoDBClient.collection("prs")
        return collectionClient.findOne({
            repoId: repoId,
            providerPrId: providerPrId
        });
    }

    async updateComments(prId, comments) {
        const collectionClient = await mongoDBClient.collection("prs")
        return collectionClient.updateOne(
            {_id: makeObjectId(prId)},
            [
                {$set: {comments: comments}}
            ]);
    }
}

export default new PrRepo();