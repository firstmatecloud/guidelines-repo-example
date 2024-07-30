import mongoDBClient from '../config/mongoConfig.js';
import {convertParametersToMongoDbFilter, makeObjectId} from "./utils/mongoDbUtils.js";

class TicketsRepo {

    async find(queryParams) {
        const searchParams = convertParametersToMongoDbFilter(queryParams);
        const collectionClient = await mongoDBClient.collection("tickets")
        return collectionClient.find(searchParams?.criteria).toArray();
    }

    async createTicket(ticket) {
        const collectionClient = await mongoDBClient.collection("tickets")
        ticket.orgId = makeObjectId(ticket.orgId);
        ticket.epicId = makeObjectId(ticket.epicId);
        ticket.creationTimestamp = new Date();
        return collectionClient.insertOne(ticket);
    }

    async updateTicket(ticketId, ticket) {
        const collectionClient = await mongoDBClient.collection("tickets")
        ticket.orgId = makeObjectId(ticket.orgId);
        return collectionClient.updateOne(
            {_id: makeObjectId(ticketId)},
            ticket)
    }


    async getTicketById(id) {
        const collectionClient = await mongoDBClient.collection("tickets")
        return collectionClient.findOne({
            _id: makeObjectId(id),
        });
    }

    async getTicketsByEpic(epicId) {
        const collectionClient = await mongoDBClient.collection("tickets")
        return collectionClient.find({
            epicId: makeObjectId(epicId),
        }).toArray();
    }

    async updatePrOnTicket(ticketId, prs) {
        const collectionClient = await mongoDBClient.collection("tickets")
        return collectionClient.updateOne(
            {_id: makeObjectId(ticketId)},
            [
                {$set: {prs: prs}}
            ]);
    }


    async updateStatus(ticketId, status) {
        const collectionClient = await mongoDBClient.collection("tickets")
        return collectionClient.updateOne(
            {_id: makeObjectId(ticketId)},
            [
                {$set: {status: status}}
            ]);
    }

    async updateComments(ticketId, comments) {
        const collectionClient = await mongoDBClient.collection("tickets")
        return collectionClient.updateOne(
            {_id: makeObjectId(ticketId)},
            [
                {$set: {comments: comments}}
            ]);
    }

    async findTicketByProviderAndFullName(provider, fullName) {
        const collectionClient = await mongoDBClient.collection("tickets")
        return collectionClient.findOne({
            provider,
            fullName
        });
    }
}

export default new TicketsRepo();