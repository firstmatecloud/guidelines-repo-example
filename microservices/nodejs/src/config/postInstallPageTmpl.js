import config from "../config/appConfig.js"
export default function generateTemplate(jwt, url) {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <script src="https://connect-cdn.atl-paas.net/all.js"></script>
    <title>Redirecting...</title>
    <script >
        window.location = "${config.frontendRedirectUrl()}/git/provider/jira/redirect?jwt=${jwt}&url=${url}"
    </script>
</head>

<body>
<p>If you are not redirected, <a href="${config.frontendRedirectUrl()}/git/provider/jira/redirect?jwt=${jwt}&url=${url}">click here</a>.</p>
</body>

</html>
    `
}
