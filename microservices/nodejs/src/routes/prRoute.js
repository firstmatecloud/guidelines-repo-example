import express from "express";
import prController from "../controllers/prController.js";
import {grantAccessByPermissionMiddleware} from "../middleware/permissionMiddleware.js";
import API_PERMISSIONS from "../config/permissionsConstants.js";

const router = express.Router();

router.route("/")
    .get(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), prController.search)
    .post(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), prController.create)

router.route("/:prId")
    .get(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), prController.getPrById)

router.route("/:prId/comment")
    .put(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), prController.comment)



export default router;