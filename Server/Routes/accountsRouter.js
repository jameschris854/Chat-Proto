const express = require("express");
const authController = require('../Controller/authController')

const router = express.Router();

router.route("/login").post(authController.login)
router.route("/signup").post(authController.signUp)

module.exports = router;

