class Configuration {

    serverPort() {
        return process.env.PORT || 8080;
    }
    logLevel(){
        return process.env.LOG_LEVEL || "info";
    }
    logPretty(){
        return process.env.LOG_PRETTY === "true";
    }
    githubAppId() {
        return process.env.GITHUB_APP_ID ;
    }
    azureDevAppId() {
        return process.env.AZURE_DEV_APP_ID || "9f7cba6e-88e1-4bb8-9f49-350da1a2baae";
    }
    repoPathPrefix() {
        return process.env.REPO_PATH_PREFIX || "./repos" ;
    }
    keyVaultName() {
        return process.env.KEYVAULT_NAME ;
    }
    aiServiceUrl() {
        return process.env.AI_SERVICE_URL || "http://firstmate-ai-helm";
    }
    getWebhookUrl(provider) {
        const webhookUrl = process.env.API_WEBHOOK_URL | "https://api.eu.firstmate.cloud";
        return `${webhookUrl}/api/v1/git/provider/${provider}/webhook`;
    }
    kubernetesConfig(){
        return {
            namespace: process.env.K8_NAMESPACE || "firstmate-prd",
            image: process.env.AI_IMAGE || "desyco/firstmate-ai",
            imageTag: process.env.AI_IMAGE_TAG || "0.0.17",
        }
    }
    appName(){
        return "FirstMateBot"
    }

    magicKeyWord(){
        return "@firstmate"
    }
    frontendRedirectUrl(){
        return process.env.FE_REDIRECT_URL || "https://console.firstmate.cloud"
    }
    jiraAppDescriptorKey(){
        return process.env.JIRA_APP_DESCRIPTOR_KEY || "firstmate-jira-bot"
    }
}

export default new Configuration()

