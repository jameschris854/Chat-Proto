import { Router } from "express";

import express from "express";
import userController from "../Controller/userController";
import messageController from "../Controller/messageController";
import conversationsController from "../Controller/conversationsController";

const router : Router = express.Router();

router.route("/").get(userController.getAllUsers)
router.route("/message").post(messageController.sendMessage)
router.route("/conversations/:userId").get(conversationsController.getAllConversationsOfUser)
router.route("/conversation/:id").get(conversationsController.getConversationById)

export default router