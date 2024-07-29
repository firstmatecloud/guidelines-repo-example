import q2m from 'query-to-mongo'
import {ObjectId} from "mongodb";

export function convertParametersToMongoDbFilter(filterParameters){
    const searchParams = q2m(filterParameters);
    if(searchParams?.criteria?.orgId){
        searchParams.criteria.orgId = makeObjectId(searchParams.criteria.orgId)
    }
    if(searchParams?.criteria?.id){
        searchParams.criteria._id = makeObjectId(searchParams.criteria.id)
        delete searchParams.criteria.id
    }
    return searchParams;
}

export function makeObjectId(id){
    if(typeof id === 'string'){
        return new ObjectId(id)
    }
    return id;
}
