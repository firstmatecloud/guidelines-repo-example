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
    "authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb25uZWN0aW9uOjUzNTU3NDEiLCJleHAiOjE3MTgyODQwNTAsImlhdCI6MTcxODI4MDQ1MCwicXNoIjoiNzE1ZTgxZjg4Y2I4YmY5MDdlYjFkYjU4ZjEwMzcxNjgxYjQ5MTY1NjQzNDgwNDI5NWVhZWE5NGQ5ZGE2NTg2ZCIsImF1ZCI6ImNvbm5lY3Rpb246NTM1NTc0MSJ9.elHPkNWFlyv3IUNMPduPEiGrh8fhlybLCTDeX7M8yWM"
}

test('bitbucket webhook call: PR Created', async (t) => {
    const prCreated = JSON.parse(fs.readFileSync("./test/fixtures/bitbucket/pr-created.json"))
    mockBeforeEach(mockImport)
    const {BitbucketService} = await reImport("../../src/services/providerServices/bitbucketService.js")
    const bitbucketService = new BitbucketService();
    const res = await bitbucketService.handleWebhookEvent("bitbucket", headers, prCreated)
    const errors = prCreatedActionScheme.validate(res.webhookAction)
    if(res.providerId !== "connection-5355741-bitbucket-app"){
        errors.push(`Wrong providerId: ${res.providerId}.`)
    }
    t.ok(errors.length === 0,`Results: \n - ${errors.join("\n -")}`);
    stopAll()
    t.end();
});
