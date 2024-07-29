import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const util = require('util')
const exec = util.promisify(require('child_process').exec);

import {ApplicationError} from "../utils/ApplicationError.js";

class GitClient {

    async updateGitConfig (path){
        let { error, stdout, stderr } = await exec(`git  -C ${path} config user.name "firstmatebot" && \\
            git -C ${path} config user.email firstmatebot@firstmate.cloud
        `);

        if(error){
            throw new ApplicationError()
        }
        return {stdout, stderr}
    }

    async createNewBranch(path, branchName){
        const { error, stdout, stderr } = await exec(`git -C ${path} checkout -b ${branchName}`);
        if(error){
            throw new ApplicationError()
        }
        return {stdout, stderr}
    }
    async gitCheckoutBranch(path, branchName) {
        const { error, stdout, stderr } = await exec(`git -C ${path} checkout ${branchName} `);
        if(error){
            throw new ApplicationError()
        }
        return {stdout, stderr}
    }
    async gitCommit(path, commitMessage) {
        const { error, stdout, stderr } = await exec(`git -C ${path} add . && git -C ${path} commit  -m "${commitMessage || "FirstMate improvement"}" --allow-empty `);
        if(error){
            throw new ApplicationError(error)
        }
        return {stdout, stderr}
    }
    async gitPush(path, branchName) {
        const { error, stdout, stderr } = await exec(`git -C ${path} push --set-upstream origin ${branchName}`);
        if(error){
            throw new ApplicationError()
        }
        return {stdout, stderr}
    }

    async cleanup(path){
        fs.rmdirSync(path, { recursive: true, force: true })
    }


}
export default new GitClient();
