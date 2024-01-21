const express = require("express");
const { body } = require('express-validator');
const router = express.Router();
const authControllers = require("../controllers/auth");

router.get("/users", authControllers.getUsers);
router.post("/sign-up", body('name').notEmpty().withMessage('Name can not be empty'),body('email').isEmail().withMessage('Email is not valid'),body('password').notEmpty().withMessage('Password can not be empty'), authControllers.signUp);
router.post("/sign-in", authControllers.login);

module.exports = router;