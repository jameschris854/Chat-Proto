import { Router } from "express";

import express from "express";
import userController from "../Controller/userController";
import messageController from "../Controller/messageController";
import conversationsController from "../Controller/conversationsController";

const router : Router = express.Router();

// chat routes
router.route("/").get(userController.getAllUsers)
router.route("/send-message").post(messageController.sendMessage)

// conversation routes
router.route("/conversations/:userId").get(conversationsController.getAllConversationsOfUser)
router.route("/conversation/:id").get(conversationsController.getConversationById)

// friends route
router.route("/add-friend").post(userController.addFriend)
router.route("/remove-friend").delete(userController.removeFriend)
router.route("/update-friend").patch(userController.updateFriend)

export default router