import organisationRepo from "../repos/organisationRepo.js"
import webhookActionsService from "./webhookActionsService.js";
import {
    countBitbucket,
    countGithubPipeline, countJenkins,
    getFileExtensionList,
    listDockerFiles,
    listHelmCharts
} from "./mappers/fileAnalysisMapper.js";
import getProviderService from "../utils/getProviderService.js";
import logger from "../utils/logger.js";


class GitService {
    async webhook(provider,headers,body){
        logger.debug({provider, headers, body },"Incoming webhook debug statement.");
        const providerService = getProviderService(provider);
        const {webhookAction, providerId} = await providerService.handleWebhookEvent(provider, headers, body);
        if(webhookAction){
            await webhookActionsService.handleWebhookAction(webhookAction, provider, providerId)
        }
    }
    async callback(provider,headers, body){
        logger.debug({provider, headers, body },"Incoming callback debug statement.");
        try{
            const providerService = getProviderService(provider);
            providerService.handleCallbackEvent(headers, body);
        }catch(err){
            logger.error( {
                err,
                provider,
                headers,
                body
            }, "Couldn't handle callback");
        }
    }

    async initProviderAccessRight(orgId, accessRight){
        const organisation = await organisationRepo.getOrganisationById(orgId);
        const providerService = getProviderService(accessRight.provider);
        const initialisedAccessRight = await providerService.initProviderAccessRight(accessRight, organisation);

        for(const type of providerService.accessTypes){
            if(!organisation.accessRights[type]){
                organisation.accessRights[type] = []
            }
            if(organisation.accessRights[type].find(accessRightItem => accessRightItem.id === accessRight.id)){
                continue;
            }
            organisation.accessRights[type].push(accessRight)
        }
        await organisationRepo.updateOrganisationAccessRights(organisation._id, organisation.accessRights);
        if(providerService.accessTypes.includes("gitProviders")){
            await this.updateRepos(organisation._id);
        }
        return {
            accessRight: initialisedAccessRight,
            accessTypes: providerService.accessTypes
        }
    }

    async updateRepos(orgId){
        const organisation = await organisationRepo.getOrganisationById(orgId);
        const newRepos = [];
        for(const gitProvider of organisation?.accessRights?.gitProviders){
            const gitProviderService = getProviderService(gitProvider.provider);
            const repos = await gitProviderService.listRepos(gitProvider);
            newRepos.push(...repos);
        }
        await organisationRepo.updateRepos(orgId, newRepos);
        this.analyseRepos(orgId).then();
    }


    async analyseRepos(orgId){
        const organisation = await organisationRepo.getOrganisationById(orgId);
        const repos = []
        for(const repo of organisation.repos){
            repos.push({
                ...repo,
                filesTypes: await this.getFileAnalysis(repo)
            });
        }
        await organisationRepo.updateRepos(orgId, repos);
    }

    async getFileAnalysis(repo){
        const gitProviderService = getProviderService(repo.provider);
        const files = await gitProviderService.getFilePaths(repo.providerId, repo, "/")
        return  {
            extensionList: getFileExtensionList(files),
            helmCharts: listHelmCharts(files),
            dockerfiles: listDockerFiles(files),
            pipelines: {
                github: countGithubPipeline(files),
                jenkins: countJenkins(files),
                bitbucket: countBitbucket(files)
            }
        }
    }
}
export default new GitService();
