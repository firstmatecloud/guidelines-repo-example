import axios from "axios";
import {ClientSecretCredential} from "@azure/identity";
import azureKeyvaultClient from "./azureKeyvaultClient.js";
import config from "../config/appConfig.js";
import logger from "../utils/logger.js";

const clientId = config.azureDevAppId()
const privateKeyBase64 = await azureKeyvaultClient.getSecret("azuredev-private-secret-base64")
const clientSecret = atob(privateKeyBase64)

class AzureDevClient {


    async getToken(providerId){
        try{
            const [tenantId, orgName] = providerId.split("@")
            const credential = new ClientSecretCredential(tenantId, clientId, clientSecret)
            const tokenResp = await credential.getToken("499b84ac-1321-427f-aa17-267ca6975798/.default");
            return {
                accessToken: tokenResp.token,
                tenantId,
                orgName: orgName,
            }
        }catch (e) {
            logger.error(e, "Couldn't get Token");
            throw e;
        }
    }


    async listProjects (providerId){
        try{
            const {accessToken, orgName} = await this.getToken(providerId)
            const resp = await axios.get(`https://dev.azure.com/${orgName}/_apis/projects?api-version=7.1-preview.4`, {
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            return resp.data.value
        }catch (e) {
            logger.error(e, "Couldn't list projects");
            throw e;
        }
    }
    async listRepos (providerId, project){
        try{
            const {accessToken, orgName} = await this.getToken(providerId)
            const url = `https://dev.azure.com/${orgName}/${project.id}/_apis/git/repositories?api-version=7.1-preview.1`
            const resp = await axios.get(url, {
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            return resp.data.value
        }catch (e) {
            logger.error(e, "Couldn't list repos");
            throw e;
        }
    }



    async listFilesInDirectory(providerId, repo, path="/"){
        try{
            const {accessToken, orgName} = await this.getToken(providerId)
            const url = `https://dev.azure.com/${orgName}/${repo.metadata.projectId}/_apis/git/repositories/${repo.metadata.providerRepoId}/items?scopePath=${path}&recursionLevel=10& api-version=7.2-preview.1`
            const resp = await axios.get(url,{
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            return resp.data.value
        }catch (e) {
            logger.error(e, "Couldn't list files in repo");
            throw e;
        }
    }

    async createSubscription(providerId, project, eventType, apiKey){
        try{
            const {accessToken, orgName} = await this.getToken(providerId)
            const url = `https://dev.azure.com/${orgName}/_apis/hooks/subscriptions?api-version=7.2-preview.1`
            const resp = await axios.post(url,{
                "publisherId": "tfs",
                "eventType": eventType,
                "resourceVersion": "1.0",
                "consumerId": "webHooks",
                "consumerActionId": "httpRequest",
                "publisherInputs": {
                    "projectId": project.id
                },
                "consumerInputs": {
                    "url": config.getWebhookUrl("azuredev"),
                    httpHeaders: `Authorization: ${apiKey}\nprovider-id: ${providerId}`
                }
            },{
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            return resp.data.value
        }catch (e) {
            logger.error(e, "Couldn't create webhook subscription");
            throw e;
        }
    }


    async createTicket(providerId, repo, title, description) {
        try{
            const {accessToken, orgName} = await this.getToken(providerId)
            const url = `https://dev.azure.com/${orgName}/${repo.metadata.projectName}/_apis/wit/workitems/task?api-version=7.2-preview.2`
            const resp = await axios.post(url, [
                {
                    "op": "add",
                    "path": "/fields/System.Title",
                    "from": null,
                    "value": title
                },
                {
                    "op": "add",
                    "path": "/fields/System.Description",
                    "from": null,
                    "value": description
                }
            ],{
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            return resp.data
        }catch (e) {
            logger.error(e, "Couldn't list repos");
            throw e;
        }
    }

    async createPullRequest(providerId, repo, branchName, body){
        try{
            const {accessToken, orgName} = await this.getToken(providerId)
            const url = `https://dev.azure.com/${orgName}/${repo.metadata.projectId}/_apis/git/repositories/${repo.metadata.providerRepoId}/pullrequests?api-version=7.2-preview.2`
            const resp = await axios.post(url, {
                "sourceRefName":`refs/heads/${branchName}`,
                "targetRefName": repo.metadata.defaultBranch,
                "title": branchName,
                "description": body,
            },{
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            return resp.data
        }catch (e) {
            logger.error(e, "Couldn't list repos");
            throw e;
        }
    }

    async createCommentOnTicket(providerId, ticket, comment){
        try{
            const {accessToken, orgName} = await this.getToken(providerId)
            const url = `https://dev.azure.com/${orgName}/${ticket.metadata.projectName}/_apis/wit/workItems/${ticket.providerTicketId}/comments?api-version=7.1-preview.4`
            const resp = await axios.post(url, {
                text: comment,
            },{
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            return resp.data
        }catch (e) {
            logger.error(e, "Couldn't list repos");
            throw e;
        }
    }

    async createNewCommentOnPr(providerId, repo, pr, comment) {
        try{
            const {accessToken, orgName} = await this.getToken(providerId)
            const url = `https://dev.azure.com/${orgName}/${repo.metadata.projectId}/_apis/git/repositories/${repo.metadata.providerRepoId}/pullRequests/${pr.providerPrId}/threads?api-version=7.1-preview.1`
            const resp = await axios.post(url, {
                comments: [
                    {
                        parentCommentId: 0,
                        content: comment,
                        commentType: 1
                    }
                ],
                status: 1
            },{
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            return resp.data
        }catch (e) {
            logger.error(e, "Couldn't list repos");
            throw e;
        }
    }

}

export default new AzureDevClient();

