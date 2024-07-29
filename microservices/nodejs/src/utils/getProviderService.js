import bitbucketService from "../services/providerServices/bitbucketService.js";
import githubService from "../services/providerServices/githubService.js";
import azureDevService from "../services/providerServices/azureDevService.js";
import {ApplicationError} from "./ApplicationError.js";
import jiraService from "../services/providerServices/jiraService.js";

const providerClientMap ={
    bitbucket: bitbucketService,
    jira: jiraService,
    github: githubService,
    azuredev: azureDevService,
    gitlab: undefined
}

export default function getProviderService (providerName){
    const client = providerClientMap[providerName];
    if(!client){
        throw new ApplicationError("No client provider found for this provider");
    }
    return client;
}