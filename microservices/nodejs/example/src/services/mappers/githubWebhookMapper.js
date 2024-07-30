import config from '../../config/appConfig.js';
const actionList = {
    "issue.opened": {
        type: "ticket",
        comment: false,
        verb: "created"
    },
    "issue.comment.created": {
        type: "ticket",
        comment: true,
        verb: "created"
    },
    "issue.edited": {
        type: "ticket",
        comment: false,
        verb: "updated"
    },
    "pr.opened": {
        type: "pr",
        comment: false,
        verb: "created"
    },
    "pr.comment.created": {
        type: "pr",
        comment: true,
        verb: "created"
    },
    "pr.edited": {
        type: "pr",
        comment: false,
        verb: "updated"
    },
}

export function mapPr(orgId, pr,repo,branchName,description,providerId) {
    return {
        fullName: `${repo.fullName}/pr/${pr.number}`,
        repoId: repo.id,
        ticketId: undefined,
        orgId: orgId,
        providerPrId: pr.number,
        name: pr.title,
        description: description,
        sourceBranch: branchName,
        targetBranch: pr?.base?.ref,
        link: pr.html_url,
        status: pr.state,
        creator: config.appName(),
        providerId: providerId,
        provider: "github",
        metadata: [],
        comments: [],
    }
}

export function mapTicket(orgId, ticket, repo, title, description, providerId) {
    return {
        fullName: `${repo.fullName}/pr/${ticket.number}`,
        repoId: repo.id,
        ticketId: ticket?._id,
        orgId: orgId,
        providerTicketId: ticket.number,
        name: ticket.title,
        description: description,
        link: ticket.html_url,
        status: ticket.state,
        creator: config.appName(),
        providerId: providerId,
        provider: "github",
        metadata: [],
        comments: []
    }
}


export function getProviderIdsFromWebhookEvent(webhookEvent) {
    return {
        repoId: webhookEvent?.repository?.full_name && `github/${webhookEvent?.repository?.full_name}`,
        repoFullName: webhookEvent?.repository?.full_name && `${webhookEvent?.repository?.full_name}`,
        prFullName: webhookEvent?.pull_request?.number && `${webhookEvent?.repository?.full_name}/pr/${webhookEvent?.pull_request?.number}`,
        ticketFullName: webhookEvent?.issue?.number && `${webhookEvent?.repository?.full_name}/issues/${webhookEvent?.issue?.number}`
    }
}

export function mapWebhookCallToAction(provider, webhookEvent, organisation) {
    const objectKeys = Object.keys(webhookEvent);
    let action = webhookEvent.action;
    if(objectKeys.includes("comment")) {
        action = `comment.${action}`
    }
    if(objectKeys.includes("pull_request")) {
        action = `pr.${action}`
    }
    if(objectKeys.includes("issue")) {
        if(webhookEvent.issue.pull_request){
            action = `pr.${action}`
            webhookEvent.pull_request = webhookEvent.issue
        }else{
            action = `issue.${action}`
        }
    }
    const {repoId, repoFullName, prFullName, ticketFullName} = getProviderIdsFromWebhookEvent(webhookEvent)
    return{
        orgId: organisation._id,
        action: actionList[action] || {},
        provider,
        data:{
            actor: {
                providerId: webhookEvent?.sender?.id,
                name: webhookEvent?.sender?.login,
            },
            comment: webhookEvent?.comment && {
                providerId: webhookEvent?.comment?.id,
                comment: webhookEvent?.comment?.body,
            },
            ticket: webhookEvent?.issue && {
                providerId: webhookEvent?.issue?.number,
                title: webhookEvent?.issue?.title,
                description: webhookEvent?.issue?.body,
                status: webhookEvent?.issue?.state,
                link: webhookEvent?.issue?.html_url,
                fullName: ticketFullName,
                metadata: {}
            },
            pr: webhookEvent?.pull_request && {
                providerId: webhookEvent?.pull_request?.number,
                title: webhookEvent?.pull_request?.title,
                description: webhookEvent?.pull_request?.body,
                status: webhookEvent?.pull_request?.state,
                link: webhookEvent?.pull_request?.html_url,
                branchName: webhookEvent?.pull_request?.head?.ref,
                sourceBranch: webhookEvent?.pull_request?.head?.ref,
                targetBranch: webhookEvent?.pull_request?.base?.ref,
                fullName: prFullName
            },
            repo: {
                id: repoId,
                providerId: webhookEvent?.repository?.id,
                name: webhookEvent?.repository?.name,
                description: webhookEvent?.repository?.description,
                link: webhookEvent?.repository?.html_url,
                fullName: repoFullName
            },
        }
    }
}