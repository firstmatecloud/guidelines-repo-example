import express from "express";
import actionController from "../controllers/actionController.js";
import {grantAccessByPermissionMiddleware} from "../middleware/permissionMiddleware.js";
import API_PERMISSIONS from "../config/permissionsConstants.js";

const router = express.Router();

router.route("/")
    .get(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), actionController.search)

router.route("/:actionId")
    .get(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), actionController.getActionById)

router.route("/:actionId")
    .put(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), actionController.updateStatus)



export default router;