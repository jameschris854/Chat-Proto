import { Router } from "express";

import express from "express";
import authController from '../Controller/authController';

const router : Router = express.Router();

router.route("/login").post(authController.login)
router.route("/signup").post(authController.signUp)

export default router
