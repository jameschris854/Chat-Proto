import { Router } from "express";

import express from "express";
import userController from "../Controller/userController";
import messageController from "../Controller/messageController";
import conversationsController from "../Controller/conversationsController";
import authController from "../Controller/authController";

const router : Router = express.Router();
const {protect} = authController

// chat routes
router.route("/").get(userController.getAllUsers)
router.route("/send-message").post(protect,messageController.sendMessage)

// conversation routes
router.route("/conversations").get(protect,conversationsController.getAllConversationsOfUser)
router.route("/conversation/:id").get(protect,conversationsController.getConversationById)

// friends route
router.route("/add-friend").post(protect,userController.addFriend)
router.route("/remove-friend").delete(protect,userController.removeFriend)
router.route("/update-friend").patch(protect,userController.updateFriend)

export default router