import config from '../../config/appConfig.js';

const actionList = {
    "pullrequest:created": {
        type: "pr",
        comment: false,
        verb: "created"
    },
    "pullrequest:changes_request_create": {
        type: "pr",
        comment: false,
        verb: ""
    },
    "pullrequest:fulfilled": {
        type: "pr",
        comment: false,
        verb: "created"
    },
    "pullrequest:rejected": {
        type: "pr",
        comment: false,
        verb: "created"
    },
    "pullrequest:unapproved": {
        type: "pr",
        comment: false,
        verb: "created"
    },
}

export function mapPr(orgId, resp,repo,branchName,description,providerId) {
    return {
        fullName: `${repo.fullName}/pr/${resp.id}`,
        repoId: repo.id,
        ticketId: undefined,
        orgId: orgId,
        providerPrId: resp.id,
        name: resp.title,
        description: description,
        sourceBranch: branchName,
        targetBranch: resp?.targetBranch,
        status: resp.state,
        creator: config.appName(),
        link: resp.links?.html?.href,
        providerId: providerId,
        provider: "bitbucket",
        metadata: {},
        comments: []
    }
}


function getProviderIdsFromWebhookEvent(webhookEvent) {
    return {
        repoId: webhookEvent?.data?.repository?.full_name && `bitbucket/${webhookEvent.data.repository.full_name}`,
        repoFullName: webhookEvent?.data?.repository?.full_name && `${webhookEvent.data.repository.full_name}`,
        prFullName: webhookEvent?.data?.pullrequest?.id &&  `${webhookEvent.data.repository.full_name}/pr/${webhookEvent.data.pullrequest.id}`,
    }
}

export function mapWebhookCallToAction(provider, webhookEvent, organisation) {
    const {repoId, repoFullName, prFullName, ticketFullName} = getProviderIdsFromWebhookEvent(webhookEvent)
    return{
        orgId: organisation._id,
        action: actionList[webhookEvent.event] || {},
        provider,
        data:{
            actor: {
                providerId: webhookEvent?.data?.actor?.uuid,
                name: webhookEvent?.data?.actor?.display_name,
            },
            comment: webhookEvent?.data?.comment && {
                providerId: webhookEvent?.data?.comment?.id,
                comment: webhookEvent?.data?.comment?.content?.raw,
            },
            ticket: {},
            pr: webhookEvent?.data?.pullrequest && {
                providerId: webhookEvent?.data?.pullrequest?.id,
                title: webhookEvent?.data?.pullrequest?.title,
                description: webhookEvent?.data?.pullrequest?.description,
                status: webhookEvent?.data?.pullrequest?.state,
                sourceBranch: webhookEvent?.data?.pullrequest?.source?.branch?.name,
                targetBranch: webhookEvent?.data?.pullrequest?.destination?.branch?.name,
                link: webhookEvent?.data?.pullrequest?.links?.html?.href,
                fullName: prFullName
            },
            repo: {
                id: repoId,
                providerId: webhookEvent?.data?.repository?.uuid,
                name: webhookEvent?.data?.repository?.full_name,
                description: webhookEvent?.data?.repository?.description,
                link: webhookEvent?.data?.repository?.links?.html?.href,
                fullName: repoFullName,
            }
        }
    }
}

