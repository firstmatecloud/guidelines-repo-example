import axios from "axios";
import appConfig from "../config/appConfig.js";
import logger from "../utils/logger.js";

const api = axios.create({
    baseURL: appConfig.aiServiceUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

class AiServiceClient {
    async analyse(organisation, suggestions) {
        await api.post("/analyse", {
            organisation,
            suggestions
        })
    }


}
export default new AiServiceClient();
