const express = require("express");
const router = express.Router();
const User = require("../modals/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecretKey = "MyNameisSumit";

router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name", "Name length should be atleast 3").isLength({ min: 3 }),
    body("password", "Password length should be atleast 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPwd = await bcrypt.hash(req.body.password, salt);

    try {
      User.create({
        name: req.body.name,
        password: hashPwd,
        email: req.body.email,
        location: req.body.location,
      });
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 3 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      return res.status(400).json({ errors: "All fields are mandetory!!" });
    }

    try {
      const email = req.body.email;
      const userData = await User.findOne({ email });
      if (!userData) {
        return res
          .status(400)
          .json({ errors: "User doesn't exist, Please Sign up!!" });
      }
      const correctPwd = await bcrypt.compare(
        req.body.password,
        userData.password
      ); //will return true/false
      if (!correctPwd) {
        return res
          .status(400)
          .json({ errors: "Invalid Credentials/wrong username or password!!" });
      }
      const payload = {
        user: {
          id: userData.id,
        },
      };
      const authToken = jwt.sign(payload, jwtSecretKey);
      return res.json({ success: true, authToken: authToken });
    } catch (error) {
      console.log(error);
      res.json({ success: false });
    }
  }
);

module.exports = router;
