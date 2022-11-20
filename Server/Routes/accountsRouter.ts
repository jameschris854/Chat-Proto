import { Router } from "express";

const express = require("express");
const authController = require('../Controller/authController')

const router : Router = express.Router();

router.route("/login").post(authController.login)
router.route("/signup").post(authController.signUp)

export default router
