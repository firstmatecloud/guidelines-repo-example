import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import config from "../config/appConfig.js"
const credential = new DefaultAzureCredential();

// Build the URL to reach your key vault
const url = `https://${config.keyVaultName()}.vault.azure.net`;
const client = new SecretClient(url, credential);

const convertSecretName = (secretName)=>{
    return secretName.replace(":", "-")
}

export class AzureKeyvaultClient {
    async createNewSecret(secretName, secretValue){
        await client.setSecret(convertSecretName(secretName), JSON.stringify(secretValue));
    }
    async getSecret(secretName){
        const rawSecret = await client.getSecret(convertSecretName(secretName));
        try{
            return JSON.parse(rawSecret.value)
        }catch (e) {
            return rawSecret.value
        }
    }
    async deleteSecret(secretName){
        await client.beginDeleteSecret(convertSecretName(secretName));
    }
}
export default new AzureKeyvaultClient();