const User = require("../model/user.js");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { ResultWithContextImpl } = require("express-validator/src/chain");
// login route
exports.login = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res
          .status(401)
          .json({ message: "User could not find. Please sign up first!" });
      }
      return bcrypt.compare(password, user.password).then((passwordMatch) => {
        console.log("matching => ");
        if (!passwordMatch) {
          return res
            .status(401)
            .json({ message: "You have entered wrong password" });
        }
        const token = jwt.sign({ user: user }, "my-jwt-token-secret", {
          expiresIn: "1h",
        });
        res
          .status(200)
          .json({
            token,
            message: "Hurrayy!! You are loggedIn.",
            userId: user._id,
            name: user.name,
          });
      });
    })
    .catch((error) => {
      res
        .status(500)
        .json({
          message: "Internal server error. Please try again in a while.",
        });
    });
};

// sign up request
// Signup route
exports.signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Invalid credentials! Please fix inputs" });
  }
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      cart: [],
    });
    const user = await newUser.save();

    res.status(201).json({ user, message: `welcome ${user.name}` });
  } catch (error) {
    res.status(500).json({ message: "Internal server error...." });
  }
};

// getting all users
exports.getUsers = async (req, res) => {
  User.find()
    .then((users) => res.send({ users: users }))
    .catch((err) => res.send({ err: "err fetching users" }));
};
