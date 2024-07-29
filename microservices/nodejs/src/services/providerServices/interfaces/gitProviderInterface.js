import {ApplicationError, errorCodes} from "../../../utils/ApplicationError.js";

class GitProviderInterface {

    async getCloneToken(path, repo){
        throw new ApplicationError(errorCodes.F001)
    }

    async initProviderAccessRight(accessRight, organisation){
        throw new ApplicationError(errorCodes.F001)
    }

    async listRepos(gitProvider){
        throw new ApplicationError(errorCodes.F001)
    }

    async getFilePaths(providerId, repo){
        throw new ApplicationError(errorCodes.F001)

    }

    async handleCallbackEvent(headers, body){
        throw new ApplicationError(errorCodes.F001)

    }
    async handleWebhookEvent(provider, headers,body){
        throw new ApplicationError(errorCodes.F001)
    }

    async createPullRequest(orgId, repo, branchName, description){
        throw new ApplicationError(errorCodes.F001)
    }

    async createCommentOnPr(repo, pr, body){
        throw new ApplicationError(errorCodes.F001)
    }
}
GitProviderInterface.accessTypes = ["gitProviders"]
export default GitProviderInterface
