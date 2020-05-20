const express = require("express");

const router = express.Router();

const auth = require("../../middleware/auth");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const config = require("config");

const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route  GET api/auth
// @desc   Test route
// @access Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("sever error");
  }
});

// @route  POST api/auth
// @desc   Authenticate user & get token (login)
// @access Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    // check validations
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // see if the user exist or not
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid cresentials" }] });
      }

      // check if password is right
      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid cresentials" }] });
      }

      // return jsonwebtoken

      const payload = {
        user: {
          id: user.id,
          name: user.name,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
