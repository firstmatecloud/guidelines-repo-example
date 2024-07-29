import axios from "axios";
import logger from "../utils/logger.js";
import config from "../config/appConfig.js";
import azureKeyvaultClient from "./azureKeyvaultClient.js";
import moment from "moment"
import * as jwt from 'atlassian-jwt';



class JiraClient {
    async performCall(providerId, orgName, method, path, body) {
        const jiraCreds = await azureKeyvaultClient.getSecret(providerId)
        const req= jwt.fromMethodAndUrl(method.toUpperCase(), path);
        const now = moment().utc();
        const tokenData = {
            "iss": config.jiraAppDescriptorKey(),
            "iat": now.unix(),                    // The time the token is generated
            "exp": now.add(3, 'minutes').unix(),  // Token expiry time (recommend 3 minutes after issuing)
            "qsh": jwt.createQueryStringHash(req) // [Query String Hash](https://developer.atlassian.com/cloud/jira/platform/understanding-jwt/#a-name-qsh-a-creating-a-query-string-hash)
        };
        const token = jwt.encodeSymmetric(tokenData, jiraCreds.sharedSecret);
        const url = `https://${orgName}.atlassian.net${path}`;
        let resp = {};
        if(method === "get"){
            resp = await axios[method](url, {
                headers: {
                    Authorization: `JWT ${token}`
                }
            })
        }else{
            resp = await axios[method](url, body, {
                headers: {
                    Authorization: `JWT ${token}`
                }
            })
        }
        return resp.data
    }

    async listIssues(providerId, orgName) {
        return this.performCall(providerId, orgName, "get", "/rest/api/3/project")
    }
    async addCommentOnTicket(providerId, orgName, ticket, comment) {
        const body = {
            "body": {
                "content": [
                    {
                        "content": [
                            {
                                "text": comment,
                                "type": "text"
                            }
                        ],
                        "type": "paragraph"
                    }
                ],
                "type": "doc",
                "version": 1
            }
        }
        return this.performCall(providerId, orgName, "post", `/rest/api/3/issue/${ticket.providerTicketId}/comment`, body)
    }
}

export default new JiraClient()