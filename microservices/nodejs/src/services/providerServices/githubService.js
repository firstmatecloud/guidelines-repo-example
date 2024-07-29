import githubClient from '../../clients/githubClient.js';
import GitProviderInterface from "./interfaces/gitProviderInterface.js";
import {mapGithubRepo} from "../mappers/providerResponseMapper.js";
import organisationRepo from "../../repos/organisationRepo.js";
import {
    mapWebhookCallToAction,
    mapPr
} from "../mappers/githubWebhookMapper.js";
import TicketProviderInterface from "./interfaces/ticketProviderInterface.js";
import extendsProviderClasses from "../../utils/ExtendsClasses.js";

export class GithubService extends extendsProviderClasses(GitProviderInterface, TicketProviderInterface) {
    async handleWebhookEvent(provider, headers, webhookEvent) {
        const providerId = `${webhookEvent.installation.id}-github-app`;
        const organisation = await organisationRepo.findOrganisationByGitProviderAndProviderId(provider, providerId);
        const webhookAction = mapWebhookCallToAction(provider, webhookEvent, organisation);
        return {webhookAction, providerId};
    }


    async initProviderAccessRight(accessRight, organisation) {
        const installationDetails = await githubClient.getInstallationDetails(accessRight.resourceDetails.installation_id);
        accessRight.resourceDetails.installationId = accessRight.resourceDetails.installation_id;
        accessRight.resourceDetails.account = installationDetails.account.login
        accessRight.resourceDetails.type = installationDetails.account.type
        accessRight.id = `${accessRight.resourceDetails.installation_id}-github-app`;
        accessRight.created = true;
        accessRight.created = true
        return accessRight;
    }

    async listRepos(provider) {
        const githubReposResp = await githubClient.listRepos(provider.id);
        const repos = []
        for (const githubRepo of githubReposResp.repositories) {
            const repo = mapGithubRepo(githubRepo, provider.id);
            repos.push(repo);
        }
        return repos;
    }

    async getCloneToken(provider) {
        return githubClient.getToken(provider.id)
    }

    async getFilePaths(providerId, repo) {
        const files = await githubClient.listFilesInDirectory(providerId, repo, "/")
        return files.map(file => ({
            path: file.path,
        }))
    }

    async createPullRequest(orgId, repo, branchName, description) {
        const providerId = repo.providerId;
        const resp = await githubClient.createPullRequest(providerId, repo, branchName, description);
        return mapPr(orgId, resp, repo, branchName, description, providerId)
    }

    async createCommentOnTicket(ticket, body) {
        const providerId = ticket.providerId;
        await githubClient.createCommentOnTicket(providerId, ticket, body.comment);
    }
    async createCommentOnPr(repo, pr, body) {
        const providerId = pr.providerId;
        await githubClient.createCommentOnPr(providerId, repo, pr, body.comment);
    }
}
export default new GithubService();