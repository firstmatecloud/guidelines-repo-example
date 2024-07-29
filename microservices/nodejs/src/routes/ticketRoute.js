import express from "express";
import ticketController from "../controllers/ticketController.js";
import {grantAccessByPermissionMiddleware} from "../middleware/permissionMiddleware.js";
import API_PERMISSIONS from "../config/permissionsConstants.js";

const router = express.Router();

router.route("/")
    .get(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), ticketController.search)
    .post(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), ticketController.create)

router.route("/:ticketId")
    .get(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), ticketController.getTicketById)

router.route("/:ticketId/comment")
    .put(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), ticketController.comment)

router.route("/:ticketId/pr")
    .get(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), ticketController.getAllPrsFromTicket)
    .post(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), ticketController.createPr)


router.route("/:ticketId/close")
    .put(grantAccessByPermissionMiddleware([API_PERMISSIONS.PUBLIC_ENDPOINT]), ticketController.close)


export default router;