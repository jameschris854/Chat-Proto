import { Router } from "express";

const express = require("express");
const userController = require("../Controller/userController")
const messageController = require("../Controller/messageController")
const conversationsController = require("../Controller/conversationsController")

const router : Router = express.Router();

router.route("/").get(userController.getAllUsers)
router.route("/message").post(messageController.sendMessage)
router.route("/conversations/:userId").get(conversationsController.getAllConversationsOfUser)
router.route("/conversation/:id").get(conversationsController.getConversationById)

export default router