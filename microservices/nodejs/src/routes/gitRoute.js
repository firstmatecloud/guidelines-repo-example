import express from "express";
import gitController from "../controllers/gitController.js";
import {grantAccessByPermissionMiddleware} from "../middleware/permissionMiddleware.js";
import API_PERMISSIONS from "../config/permissionsConstants.js";

const router = express.Router();

router.route("/provider/:provider/webhook")
    .post(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]),gitController.webhook)

router.route("/provider/:provider/callback")
    .post(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]),gitController.callback)

router.route("/provider/:provider/post-install-page")
    .get(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]),gitController.postInstallPage)


export default router;