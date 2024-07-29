import path from "path";
import _ from "lodash";

function getFileExtension(file){
    return path?.extname(file?.path)?.replace('.', "") || "None";
}

export function getFileExtensionList(files){
    return _.countBy(files.map(file => getFileExtension(file)))
}

export function listHelmCharts(files){
    return files
        .filter(file=> path.basename(file.path) === "Chart.yaml")
        .map(file => ({
            directory: path.dirname(file.path),
        }))
}

export function countGithubPipeline(files){
    return files.filter(file=>  file.path.includes(".github")).length
}
export function countJenkins(files){
    return files.filter(file=>  file.path.includes("Jenkinsfile") ).length
}
export function countBitbucket(files) {
    return files.filter(file => file.path.includes("bitbucket-pipelines")).length
}
export function listDockerFiles(files){
    return files.filter(file=>  file.path.includes("Dockerfile")).map(file => ({
        path: file.path
    }))
}
