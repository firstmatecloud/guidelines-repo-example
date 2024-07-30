import express from "express";
import organisationController from "../controllers/organisationController.js";
import {grantAccessByPermissionMiddleware} from "../middleware/permissionMiddleware.js";
import API_PERMISSIONS from "../config/permissionsConstants.js";

const router = express.Router();

router.route("/:orgId")
    .get(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]),organisationController.getOrg)

router.route("/:orgId/repo-refresh")
    .post(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]),organisationController.repoRefresh)

router.route("/:orgId/init-provider")
    .post(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]),organisationController.initProvider)

router.route("/:orgId/epics")
    .get(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]),organisationController.getOrgEpics)
    .post(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]),organisationController.createEpic)


export default router;