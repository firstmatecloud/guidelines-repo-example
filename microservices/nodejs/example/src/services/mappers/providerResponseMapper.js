

export function mapBitbucketRepo(repo, providerId) {
    return{
        id:  `bitbucket/${repo?.workspace?.name}/${repo.name}`,
        name: repo.name,
        fullName:  `${repo?.workspace?.name}/${repo.name}`,
        orgName: repo?.workspace?.name,
        link: repo.links?.html?.href,
        avatar: repo.links?.avatar?.href,
        metadata: {
            language: repo.language,
            project: repo?.project?.name,
        },
        providerId: providerId,
        provider: "bitbucket",
        status: "connected"
    }
}
export function mapAzureDevRepo(providerId, repo) {
    const [tenantId, orgName] = providerId.split("@")
    return{
        id:  `azuredev/${orgName}/${repo?.project?.name}/${repo.name}`,
        name: repo.name,
        fullName: `${orgName}/${repo?.project?.name}/${repo.name}`,
        orgName: orgName,
        link: repo.webUrl,
        avatar: repo.avatarUrl,
        metadata: {
            project: repo?.project?.name,
            projectId: repo?.project?.id,
            providerRepoId: repo.id,
            defaultBranch: repo.defaultBranch,
            tenantId
        },
        providerId: providerId,
        provider: "azuredev",
        status: "connected"
    }
}

export function mapGithubRepo(repo, providerId) {
    return {
        id: `github/${repo?.owner?.login}/${repo.name}`,
        name: repo.name,
        fullName: `${repo?.owner?.login}/${repo.name}`,
        orgName: repo?.owner?.login,
        link: repo.html_url,
        avatar: repo.owner.avatar_url,
        metadata: {
            language: repo.language,
            orgType: repo?.owner?.type,
            defaultBranch: repo.default_branch
        },
        providerId: providerId,
        provider: "github",
        status: "connected"
    }
}




