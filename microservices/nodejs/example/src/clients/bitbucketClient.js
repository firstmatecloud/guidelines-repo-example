import axios from "axios";
import qs from "querystring"
import moment from "moment"
import jwt from "jwt-simple"
import azureKeyvaultClient from "./azureKeyvaultClient.js";
import logger from "../utils/logger.js";

const bitbucket = axios.create({
    baseURL: "https://bitbucket.org",
    headers: {
        "Content-Type": "application/json",
    },
});
const bitbucketApi = axios.create({
    baseURL: "https://api.bitbucket.org",
    headers: {
        "Content-Type": "application/json",
    },
});


class BitbucketClient {
    async getToken(providerId) {
        const bitbucketCreds = await azureKeyvaultClient.getSecret(providerId)
        const payload = {
            iss: "firstmatecloud",
            sub: bitbucketCreds.clientKey,
            iat: moment().unix(),
            exp: moment().add(5, 'hours').unix()
        }


        const jwtToken = jwt.encode(payload, bitbucketCreds.sharedSecret);
        const accessTokenResp = await bitbucket.post("site/oauth2/access_token",
            qs.stringify({
                grant_type: 'urn:bitbucket:oauth2:jwt'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `JWT ${jwtToken}`,
                }
            })
        return accessTokenResp.data.access_token
    }

    async createPullRequest(providerId, repo, branchName, prBody) {
        const accessToken = await this.getToken(providerId);
        try {
            const resp = await bitbucketApi.post(`/2.0/repositories/${repo.orgName}/${repo.name}/pullrequests`, {
                title: branchName,
                "source": {
                    "branch": {
                        "name": branchName
                    }
                },
                description: prBody,
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            })
            return resp.data
        } catch (e) {
            logger.error(e, "Couldn't create PR");
            throw e;
        }
    }

    async listRepos(providerId, workspaceName) {
        const accessToken = await this.getToken(providerId);
        try {
            const resp = await bitbucketApi.get(`/2.0/repositories/${workspaceName}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            })
            return resp.data?.values
        } catch (e) {
            logger.error(e, "Couldn't list repositories")
            throw e;
        }
    }

    async listWorkspaces(providerId) {
        const accessToken = await this.getToken(providerId);
        try {
            const resp = await bitbucketApi.get(`/2.0/workspaces`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            })
            return resp.data?.values
        } catch (e) {
            logger.error(e, "Couldn't list bitbucket workspaces")
            throw e;
        }
    }

    async listFilesInDirectory(providerId, repo, path) {
        const accessToken = await this.getToken(providerId);
        try {
            const resp = await bitbucketApi.get(`/2.0/repositories/${repo.orgName}/${repo.name}/src${path === "/" ? "" : path}?pagelen=100&max_depth=1000&q=type="commit_file"`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            })
            //todo think of paging.
            return resp.data.values
        } catch (e) {
            logger.error(e, "Couldn't list bitbucket workspaces")
            throw e;
        }

    }
}
export default new BitbucketClient();
