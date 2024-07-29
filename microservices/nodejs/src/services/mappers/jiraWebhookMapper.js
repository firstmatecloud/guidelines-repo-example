import {URL} from 'url';
const actionList = {
    "jira:issue_created": {
        type: "ticket",
        comment: false,
        verb: "created"
    },
    "comment_created": {
        type: "ticket",
        comment: true,
        verb: "created"
    }
}



function getProviderIdsFromWebhookEvent(webhookEvent) {
    const ticketUrl = new URL(webhookEvent?.issue?.self)
    const orgName = ticketUrl.host.replace(".atlassian.net", '')
    return {
        orgName,
        ticketFullName: orgName &&  `${orgName}/tickets/${webhookEvent?.issue?.key}`
    }
}

export function mapWebhookCallToAction(provider, webhookEvent, organisation) {
    const {ticketFullName,orgName} = getProviderIdsFromWebhookEvent(webhookEvent)
    const user = webhookEvent?.user || webhookEvent?.comment?.author
    return{
        orgId: organisation._id,
        action: actionList[webhookEvent.webhookEvent] || {},
        provider,
        data:{
            actor: {
                providerId: user?.accountId,
                name: user?.displayName,
            },
            comment: webhookEvent?.comment && {
                providerId: webhookEvent?.comment?.id,
                comment: webhookEvent?.comment?.body,
            },
            ticket: {
                providerId: webhookEvent?.issue?.key,
                title: webhookEvent?.issue?.fields?.summary,
                description: webhookEvent?.issue?.fields?.description,
                status: webhookEvent?.issue?.fields?.status?.name,
                url: `https://firstmatecloud.atlassian.net/browse/${webhookEvent?.issue?.key}`,
                metadata: {
                    orgName: orgName
                },
                fullName: ticketFullName
            },
            pr: {},
            repo: {},
            project: {
                providerId: webhookEvent?.issue?.fields?.project?.key,
                name: webhookEvent?.issue?.fields?.project?.name,
            }
        }
    }
}

