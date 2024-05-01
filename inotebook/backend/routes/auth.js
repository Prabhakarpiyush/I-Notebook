// const express = require("express");
// const User = require("../models/User");
// const router = express.Router();
// const { body, validationResult } = require("express-validator");
// const bcrypt = require("bcrypt");
// var jwt = require("jsonwebtoken");
// var fetchuser =require('../middleware/fetchuser');

// const JWT_SECRET = "PIYUSH$$GOODBOY";

// //  Route 1 : create a user using the post and  "api/auth/createUser". doesn't require auth
// router.post(
//   "/createuser",
//   [
//     body("name", "Enter a valid Name").isLength({ min: 3 }),
//     body("email", "Enter a valid Email id").isEmail(),
//     body("password", "Password must be at least 5 characters").isLength({
//       min: 5,
//     }),
//   ],
//   async (req, res) => {
//     let success =false;
//     // Make the route handler function asynchronous
//     // if there are errors, then return bad request and the errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ success , errors: errors.array() });
//     }

//     // check wheter the email exist already or not
//     try {
//       let user = await User.findOne({ email: req.body.email });
//       if (user) {
//         return res
//           .status(400)
//           .json({success, error: "Sorry these email already exist" });
//       }

//       const salt = await bcrypt.genSalt(10);
//       const secPass = await bcrypt.hash(req.body.password, salt);
//       user = await User.create({
//         name: req.body.name,
//         password: secPass,
//         email: req.body.email,
//       });
//       const data = {
//         user: {
//           id: user.id,
//         }
//       }
//       const authtoken = jwt.sign(data, JWT_SECRET);
//       success=true;
//       res.json({  success, authtoken });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   }
// );





// // Route 2: Authenticate a user using the post and  "api/auth/login". doesn't require auth
// router.post(
//   "/login",
//   [
//     body("email", "Enter a valid Email id").isEmail(),
//     body("password", "Password cannot be blank").exists(),
//   ],
//   async (req, res) => {
//     let success = false;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { email, password } = req.body;
//     try {
//       let user = await User.findOne({ email });
//       if (!user) {
//         success = false
//         return res
//           .status(400)
//           .json({ error: "Please  try to login with correct Credential" });
//       }
//       const passwordCompare = await bcrypt.compare(password, user.password);
//       if (!passwordCompare) {
//         return res
//           .status(400)
//           .json({ error: "Please try to login with correct Credential" });
//           success = false
//       return res.status(400).json({ success, error: "Please try to login with correct credentials" });
//       }
//       const data = {
//         user: {
//           id: user.id,
//         }
//       }
//       const authtoken = jwt.sign(data, JWT_SECRET);
//     res.json({ authtoken })
//     success = true;
//     res.json({ success, authtoken })

//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
//   }
// );



// // Route 3: Get loggedin User detail using the post and  "api/auth/getuser". Lopgin Required

// router.post(
//   "/getuser", fetchuser,
//   async (req, res) => {
//     try {
//       userId = req.user.id
//       const user = await User.findById(userId).select("-password")
//       res.send(user)

//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Internal server error" });
//     }

//   })

// module.exports = router;
const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "PIYUSH$$GOODBOY";

// Route 1: Create a user using the post and "api/auth/createUser". Doesn't require auth
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email id").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    // Make the route handler function asynchronous
    // if there are errors, then return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    // check whether the email exists already or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry, this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Route 2: Authenticate a user using the post and "api/auth/login". Doesn't require auth
router.post(
  "/login",
  [
    body("email", "Enter a valid Email id").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Get logged-in User detail using the post and "api/auth/getuser". Login Required
router.post(
  "/getuser",
  fetchuser,
  async (req, res) => {
    try {
      userId = req.user.id
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
