import {createMockImport} from 'mock-import';
import test, {stub} from 'supertape';
import fs from "fs";
import {mockBeforeEach} from "../testUtils.js";
import {prCreatedActionScheme} from "../fixtures/webhookActions.js";

const {
    mockImport,
    traceImport,
    reImport,
    stopAll,
} = createMockImport(import.meta.url);

const headers = {
    "authorization": "apikey",
    "provider-id": "provider-id"
}

test('azure dev webhook call: PR Created', async (t) => {
    const prCreated = JSON.parse(fs.readFileSync("./test/fixtures/azuredev/pr-created.json"))
    mockBeforeEach(mockImport)
    const {AzureDevService} = await reImport("../../src/services/providerServices/azureDevService.js")
    const azureDevService = new AzureDevService();
    const res = await azureDevService.handleWebhookEvent("azuredev", headers, prCreated)
    const errors = prCreatedActionScheme.validate(res.webhookAction)
    if(res.providerId !== "provider-id"){
        errors.push(`Wrong providerId: ${res.providerId}.`)
    }
    t.ok(errors.length === 0,`Results: \n - ${errors.join("\n -")}`);
    stopAll()
    t.end();
});
