import express from "express";
import epicController from "../controllers/epicController.js";
import {grantAccessByPermissionMiddleware} from "../middleware/permissionMiddleware.js";
import API_PERMISSIONS from "../config/permissionsConstants.js";

const router = express.Router();


router.route("/")
    .post(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), epicController.create)

router.route("/:epicId")
    .get(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), epicController.get)

router.route("/:epicId/metadata")
    .post(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), epicController.updateMetaData)


export default router;