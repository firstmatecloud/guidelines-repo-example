import {createAppAuth} from "@octokit/auth-app";
import {App} from "@octokit/app";
import {Octokit} from "@octokit/core";
import config from "../config/appConfig.js";

import azureKeyvaultClient from "./azureKeyvaultClient.js";

const appId = config.githubAppId();
const privateKeyBase64 = await azureKeyvaultClient.getSecret("github-private-secret-base64")
const privateKey = atob(privateKeyBase64)

const app = new App({appId, privateKey})
class GithubClient {
    async getInstallationId(organisationName, repoName) {
        // First we need to get the installation id for the repo
        const { data: installation } = await app.octokit.request(
            `GET /repos/${organisationName}/${repoName}/installation`
        );
        return installation.id;
    }

    async getToken(providerId, type= "installation") {
        const installationId = providerId.replace("-github-app", "");
        const appId = config.githubAppId();
        const privateKeyBase64 = await azureKeyvaultClient.getSecret("github-private-secret-base64")
        const privateKey = atob(privateKeyBase64)
        const auth = createAppAuth({
            appId: appId,
            privateKey: privateKey,
            installationId: installationId
        });
        const appAuthentication = await auth({ type: type });
        return appAuthentication.token;
    }

    async getInstallationDetails(installationId) {
        const token = await this.getToken(installationId, "app");
        const octokit = new Octokit({
            auth: token,
        })
        const resp = await octokit.request('GET /app/installations/{installation_id}', {
            installation_id: installationId,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        return resp.data
    }
    async listRepos(providerId){
        const token = await this.getToken(providerId);

        const octokit = new Octokit({
            auth: token,
        })
        const resp = await octokit.request('GET /installation/repositories', {
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        return resp.data;
    }

    async listFilesInDirectory(providerId, repo,path){
        const token = await this.getToken(providerId);

        const octokit = new Octokit({
            auth: token,
        })
        const resp = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1', {
            owner: repo.orgName,
            repo: repo.name,
            tree_sha: repo.metadata.defaultBranch,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        return resp.data.tree.filter(item => item.type === "blob");
    }



    async createTicket(providerId, repo, title, description){
        const token = await this.getToken(providerId);
        const octokit = new Octokit({
            auth: token,
        })
        const resp = await octokit.request(`POST /repos/${repo.orgName}/${repo.name}/issues`, {
            owner: repo.orgName,
            repo: repo.name,
            title: title,
            body: description,
        });
        return resp.data;
    }

    async createPullRequest(providerId, repo, branchName, body){
        const token = await this.getToken(providerId);
        const octokit = new Octokit({
            auth: token,
        })

        const resp = await octokit.request(`POST /repos/${repo.orgName}/${repo.name}/pulls`, {
            mediaType: {
                previews: ["shadow-cat"],
            },
            owner: repo.orgName,
            repo: repo.name,
            body: body,
            title: branchName,
            base: "main", //todo: use repo main branch.
            head: branchName,
            draft: false,
        });
        return resp.data;
    }

    async createCommentOnTicket(providerId, ticket, comment){
        const token = await this.getToken(providerId);
        const octokit = new Octokit({
            auth: token,
        })
        const resp= await octokit.request(`POST /repos/${ticket.linkedRepo.orgName}/${ticket.linkedRepo.name}/issues/${ticket.providerTicketId}/comments`, {
            owner: ticket.linkedRepo.orgName,
            repo: ticket.linkedRepo.name,
            issue_number: ticket.providerTicketId,
            body: comment,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        return resp.data;
    }

    async createCommentOnPr(providerId, repo, pr, comment){
        const token = await this.getToken(providerId);
        const octokit = new Octokit({
            auth: token,
        })
        const resp= await octokit.request(`POST /repos/${repo.orgName}/${repo.name}/issues/${pr.providerPrId}/comments`, {
            owner: repo.orgName,
            repo: repo.name,
            issue_number: pr.providerPrId,
            body: comment,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        return resp.data;
    }
}
export default new GithubClient();
