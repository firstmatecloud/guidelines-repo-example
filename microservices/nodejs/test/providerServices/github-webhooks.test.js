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
    "host": "api.eu.firstmate.cloud",
    "x-request-id": "11a377b0e70b598d47a6003d1272b594",
    "x-real-ip": "140.82.115.38",
    "x-forwarded-for": "140.82.115.38",
    "x-forwarded-host": "api.eu.firstmate.cloud",
    "x-forwarded-port": "443",
    "x-forwarded-proto": "https",
    "x-forwarded-scheme": "https",
    "x-scheme": "https",
    "content-length": "9798",
    "user-agent": "GitHub-Hookshot/f22e2d9",
    "accept": "*/*",
    "content-type": "application/json",
    "x-github-delivery": "78d3f2b0-3d32-11ef-988d-818d63a7e7b9",
    "x-github-event": "issues",
    "x-github-hook-id": "483772475",
    "x-github-hook-installation-target-id": "919451",
    "x-github-hook-installation-target-type": "integration",
    "x-hub-signature": "sha1=e9e34515389bf3f9f0d244951e3ce72848d74a3b",
    "x-hub-signature-256": "sha256=cc4b2d8bfbd5d6b2c8252ff5ef63e8c73cca1f5a04c8b1370a11c0a2c07945be"
}


test('github webhook call: PR Created', async (t) => {
    const prCreated = JSON.parse(fs.readFileSync("./test/fixtures/github/pr-created.json"))
    mockBeforeEach(mockImport)
    const {GithubService} = await reImport("../../src/services/providerServices/githubService.js")
    const githubService = new GithubService();
    const res = await githubService.handleWebhookEvent("github", headers, prCreated)
    const errors = prCreatedActionScheme.validate(res.webhookAction)
    if(res.providerId !== "52347138-github-app"){
        errors.push(`Wrong providerId: ${res.providerId}.`)
    }
    t.ok(errors.length === 0,`Results: \n - ${errors.join("\n -")}`);
    stopAll()
    t.end();
});
