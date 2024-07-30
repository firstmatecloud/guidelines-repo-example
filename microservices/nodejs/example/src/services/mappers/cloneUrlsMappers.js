
export default{
    bitbucket: createBitbucketCloneUrl,
    github: createGithubCloneUrl,
    azuredev: createAzureDevCloneUrl
}

function createBitbucketCloneUrl(repo, accessToken) {
    return `https://x-token-auth:${accessToken}@bitbucket.org/${repo.orgName}/${repo.name}.git`
}
function createGithubCloneUrl(repo, accessToken) {
    return `https://firstmatebot:${accessToken}@github.com/${repo.orgName}/${repo.name}.git`
}
function createAzureDevCloneUrl(repo, accessToken) {
    return `https://${accessToken}@dev.azure.com/${repo.orgName}/${repo.metadata.project}/_git/${repo.name}`
}