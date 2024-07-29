import organisationRepo from "../repos/organisationRepo.js"
import cloneUrlsMappers from "./mappers/cloneUrlsMappers.js"
import getProviderService from "../utils/getProviderService.js";

class OrganisationService {
    async getOrganisation(orgId){
        const organisation = await organisationRepo.getOrganisationById(orgId);
        const tokens = {}
        for(const provider of organisation?.accessRights?.gitProviders){
            const gitProviderService = getProviderService(provider.provider);
            tokens[provider.provider] = await gitProviderService.getCloneToken(provider)
        }
        organisation.repos = organisation.repos.map(repo => {
            repo.cloneUrl = cloneUrlsMappers[repo.provider](repo, tokens[repo.provider]);
            return repo;
        })
        return organisation;
    }


}
export default new OrganisationService();
