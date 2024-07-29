import simpleJwt from "jwt-simple";
import bitbucketClient from '../../clients/bitbucketClient.js';
import organisationRepo from '../../repos/organisationRepo.js';
import GitProviderInterface from "./interfaces/gitProviderInterface.js";
import {mapBitbucketRepo} from "../mappers/providerResponseMapper.js";
import {mapPr, mapWebhookCallToAction} from "../mappers/bitbucketWebhookMapper.js";
import azureKeyvaultClient from "../../clients/azureKeyvaultClient.js";
import extendsProviderClasses from "../../utils/ExtendsClasses.js";

export class BitbucketService extends extendsProviderClasses(GitProviderInterface) {

    async handleWebhookEvent(provider, headers,webhookEvent){
        const decoded = simpleJwt.decode(headers?.authorization?.replace("JWT ", ""), "", true);
        const providerId = `${decoded?.aud?.replace(":", "-")}-bitbucket-app`
        const organisation = await organisationRepo.findOrganisationByGitProviderAndProviderId(provider, providerId);
        const webhookAction = mapWebhookCallToAction(provider, webhookEvent, organisation);
        return {webhookAction, providerId};
    }

    async handleCallbackEvent(headers,body){
        //todo validate JWT token in headers
        if(body.eventType === "installed"){
            await azureKeyvaultClient.createNewSecret(`${body.clientKey}-bitbucket-app`, {
                clientKey: body.clientKey,
                sharedSecret: body.sharedSecret
            })
        }

        if(body.eventType === "uninstalled"){
            //todo remove secret and repo from Org
            await azureKeyvaultClient.deleteSecret(`${body.clientKey}-bitbucket-app`)
        }
    }
    async initProviderAccessRight(accessRight, organisation){
        const decoded = simpleJwt.decode(accessRight.resourceDetails.jwt, "", true);
        accessRight.resourceDetails.clientId = decoded.aud;
        accessRight.id =`${decoded?.aud?.replace(":", "-") }-bitbucket-app`;
        accessRight.created = true
        return accessRight;
    }

    async getCloneToken(provider){
        return bitbucketClient.getToken(provider.id)
    }

    async createPullRequest(orgId, repo, branchName, description){
        const providerId = repo.providerId;
        const resp = await bitbucketClient.createPullRequest(providerId, repo, branchName, body);
        return mapPr(orgId, resp, repo, branchName, description, providerId)
    }

    async listRepos(provider){
        const workSpaces = await bitbucketClient.listWorkspaces(provider.id);
        const repos = []
        for(const workSpace of workSpaces){
            const workSpaceRepos = await bitbucketClient.listRepos(provider.id, workSpace.name);
            for(const workSpaceRepo of workSpaceRepos){
                const repo = mapBitbucketRepo(workSpaceRepo, provider.id);
                repos.push(repo);
            }
        }
        return repos;
    }


    async getFilePaths(providerId, repo){
        const files = await bitbucketClient.listFilesInDirectory(providerId, repo, "/")
        return files.map(file => ({
            path: file.path,
        }))
    }

}

export default new BitbucketService();

