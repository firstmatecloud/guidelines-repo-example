import k8s from '@kubernetes/client-node';
import logger from "../utils/logger.js";
import config from "../config/appConfig.js";


const createJobBody = (k8Config, orgId, actionId) => {
    const name = `firstmate-python-ai-${actionId}`

    return {
    "apiVersion": "batch/v1",
    "kind": "Job",
    "metadata": {
        "labels": {
            "app": "firstmate-python-ai",
        },
        "name": name,
    },
    "spec": {
        backoffLimit: 0,
        "template": {
            "metadata": {
                "labels": {
                    "app": "firstmate-python-ai",
                }
            },
            "spec": {
                backoffLimit: 0,
                "containers": [
                    {
                        "env": [
                            {
                                name: "CHAT_SERVICE_KEY",
                                valueFrom: {
                                    secretKeyRef: {
                                        name: "openai-secrets",
                                        key: "serviceKey"
                                    }
                                }
                            },
                            {
                                name: "CHAT_SERVICE_URL",
                                valueFrom: {
                                    secretKeyRef: {
                                        name: "openai-secrets",
                                        key: "serviceUrl"
                                    }
                                }
                            },
                            {
                                "name": "ORG_ID",
                                "value": orgId
                            },
                            {
                                "name": "ACTION_ID",
                                "value": actionId
                            },
                            {
                                "name": "GIT_MANAGER_URL",
                                "value": "http://firstmate-git-manager-helm/api/v1"
                            },
                            {
                                "name": "REPO_PATH_PREFIX",
                                "value": "./repos"
                            }
                        ],
                        "name": name,
                        "image": `${k8Config.image}:${k8Config.imageTag}`,
                        "imagePullPolicy": "Always",
                        "resources": {
                            "limits": {
                                "cpu": "500m",
                                "memory": "500Mi"
                            },
                            "requests": {
                                "cpu": "100m",
                                "memory": "100Mi"
                            }
                        }
                    }
                ],
                "restartPolicy": "Never",
                "terminationGracePeriodSeconds": 30,
                "tolerations": [
                    {
                        "operator": "Exists"
                    }
                ]
            }
        }
    }
}};



class K8sClient{
    constructor() {
        try{
            const kc = new k8s.KubeConfig();
            kc.loadFromDefault();
            this.k8sBatchApi = kc.makeApiClient(k8s.BatchV1Api)
        }catch (e){
            logger.error({error: e} ,"Couldn't init k8sClient")
        }
    }

    async createJob(orgId, actionId){
        const kubernetesConfig = config.kubernetesConfig();
        await this.k8sBatchApi.createNamespacedJob(kubernetesConfig.namespace, createJobBody(kubernetesConfig, orgId, actionId));
    }

}

export default new K8sClient();