
const organisationRepo  = {
    getOrganisationByApiKey: async (key) => {
        return {
            _id: 1,
        }
    },
    findOrganisationByGitProviderAndProviderId: async (provider, providerId) => {
        return {
            _id: 1,
        }
    }
}

export function mockBeforeEach(mockImport){
    mockImport('../../src/repos/organisationRepo.js', organisationRepo);
    mockImport("../../src/clients/githubClient.js", {
        todo: "Setup stub to verify if called"
    });
    mockImport("../../src/clients/bitbucketClient.js", {
        todo: "Setup stub to verify if called"
    });
    mockImport("../../src/clients/azureDevClient.js", {
        todo: "Setup stub to verify if called"
    });
}

