import config from "../../config/appConfig.js"
import _ from "lodash"

//todo validate with documentation.
const actionList = {
    "git.repo.created": {
        type: "repo",
        comment: false,
        verb: "created"
    },
    "git.pullrequest.created": {
        type: "pr",
        comment: false,
        verb: "created"
    },
    "git.pullrequest.updated": {
        type: "pr",
        comment: false,
        verb: "updated"
    },
    "git.pullrequest.merged": {
        type: "pr",
        comment: false,
        verb: "merged"
    },
    "git.pullrequest.rejected": {
        type: "pr",
        comment: false,
        verb: "closed"
    },
    "ms.vss-code.git-pullrequest-comment-event": {
        type: "pr",
        comment: true,
        verb: "created"
    },
    "workitem.created": {
        type: "ticket",
        comment: false,
        verb: "created"
    },
    "workitem.updated": {
        type: "ticket",
        comment: false,
        verb: "updated"
    },
    "workitem.commented": {
        type: "ticket",
        comment: true,
        verb: "created"
    },
}


export function mapPr(orgId, resp, repo,branchName,description,providerId) {
    return{
        fullName: `${repo.fullName}/pr/${resp.pullRequestId}`,
        repoId: repo.id,
        ticketId: undefined,
        orgId: orgId,
        providerPrId: resp.pullRequestId,
        name: resp.title,
        description: description,
        sourceBranch: branchName,
        targetBranch: resp?.targetRefName?.replace("refs/heads/",""),
        status: resp.status,
        creator: config.appName(),
        link: `${resp.repository?.webUrl}/pullrequest/${resp.pullRequestId}`,
        providerId: providerId,
        provider: "azuredev",
        metadata: {},
        comments: []
    }
}

//todo verify ticket Id
export function getProviderIdsFromWebhookEvent(webhookEvent) {
    const repoFullName = webhookEvent?.resource?.repository?.webUrl?.replace("https://dev.azure.com/","").replace("_git/","")
    return {
        repoId: `azuredev/${repoFullName}`,
        repoFullName: repoFullName,
        prFullName: webhookEvent?.resource?.pullRequestId &&  `${repoFullName}/pr/${webhookEvent?.resource?.pullRequestId}`,
        ticketFullName: `ticket/${webhookEvent.resource?.revision?.id || webhookEvent?.resource?.id}`,
    }
}

export function mapWebhookCallToAction(provider, webhookEvent, organisation) {
    const providerIds = getProviderIdsFromWebhookEvent(webhookEvent)
    const action = actionList[validateWebhookEventType(webhookEvent)] || {}
    let data = {}
    switch (true) {
        case action.type === "ticket" && !action.comment:
            data = mapWebhookForTicketData(webhookEvent, providerIds)
            break;
        case action.type === "pr" && !action.comment:
            data = mapWebhookForPrData(webhookEvent, providerIds)
            break;
        case action.type === "ticket" && action.comment:
            data = mapWebhookForTicketCommentData(webhookEvent, providerIds)
            break;
        case action.type === "pr" && action.comment:
            data = mapWebhookForPrCommentData(webhookEvent, providerIds)
            break;
        default:
            data = {
                actor: undefined,
                ticket: undefined,
                pr: undefined,
                repo: undefined,
                project: undefined
            }

    }

    return{
        orgId: organisation._id,
        action,
        provider,
        data
    }
}

function validateWebhookEventType(webhookEvent) {
    let evenType = webhookEvent.eventType
    if(evenType === "workitem.updated") {
        const fields = webhookEvent.resource.fields
        if( fields["System.CommentCount"] && fields["System.CommentCount"].oldValue < fields["System.CommentCount"].newValue) {
            return "workitem.commented"
        }
    }
    return evenType
}

function mapWebhookForTicketData  (webhookEvent, providerIds) {
    const data = webhookEvent.resource?.revision ? webhookEvent.resource?.revision : webhookEvent.resource
    return {
        actor: {
            name: _.get(data?.fields["System.CreatedBy"].split(" <"),0,""),
            providerId:  _.get(data?.fields["System.CreatedBy"].split(" <"),1,"").replace(/[<>]/g, '')
        },
        ticket: {
            providerId: data?.id,
            type: data?.fields["System.WorkItemType"],
            title: data?.fields["System.Title"],
            description: data?.fields["System.Description"],
            status: data?.fields["System.State"],
            link: data?._links?.html?.href,
            metadata: {},
            fullName: providerIds.ticketFullName
        },
        pr: {},
        repo: {},
        project: {
            name: data?.fields["System.TeamProject"]
        }
    }
}
function mapWebhookForTicketCommentData  (webhookEvent, providerIds) {
    const data = webhookEvent.resource?.revision ? webhookEvent.resource?.revision : webhookEvent.resource
    return {
        actor: {
            providerId: webhookEvent.resource?.revisedBy?.uniqueName,
            name: webhookEvent.resource?.revisedBy?.displayName
        },
        ticket: {
            providerId: webhookEvent?.resource?.workItemId,
            type: data?.fields["System.WorkItemType"],
            title: data?.fields["System.Title"],
            description: data?.fields["System.Description"],
            status: data?.fields["System.State"],
            metadata: {},
            fullName: providerIds.ticketFullName
        },
        pr: {},
        repo: {},
        comment: {
            providerId: webhookEvent.resource?.id,
            comment: data?.fields["System.History"],
        },
        project: {
            name: data?.fields["System.TeamProject"]
        }
    }
}

function mapWebhookForPrData  (webhookEvent, providerIds) {
    const data = webhookEvent.resource?.revision ? webhookEvent.resource?.revision : webhookEvent.resource
    return {
        actor: {
            providerId: data?.createdBy?.uniqueName,
            name: data?.createdBy?.displayName
        },
        ticket: {},
        pr: {
            providerId: data?.pullRequestId || data?.id,
            title: data?.title,
            description: data?.description,
            status: data?.status,
            sourceBranch: data?.sourceRefName?.replace("refs/heads/",""),
            targetBranch: data?.targetRefName?.replace("refs/heads/",""),
            link: data._links.web.href,
            fullName: providerIds.prFullName
        },
        repo: {
            id: providerIds.repoId,
            providerId: webhookEvent?.resource?.repository?.id,
            name: webhookEvent?.resource?.repository.name,
            description: webhookEvent?.resource?.repository?.description,
            link: webhookEvent?.resource?.repository?.webUrl,
            fullName: providerIds.repoFullName,
        },
        project: {
            name: data?.repository?.project?.name
        }
    }
}

function mapWebhookForPrCommentData  (webhookEvent, providerIds) {
    const data = webhookEvent.resource
    return {
        actor: {
            providerId: data?.author?.uniqueName,
            name: data?.author?.displayName
        },
        ticket: {},
        pr: {
            providerId: data?._links?.pullRequests?.href?.split("/").pop(),
        },
        repo: {
            providerId: data?._links?.repository?.href?.split("/").pop(),
        },
        comment: {
            providerId: data?.id,
            threadId: data?._links?.threads?.href?.split("/").pop(),
            comment: data?.content
        },
        project: {
            name: data?.repository?.project?.name
        }
    }
}