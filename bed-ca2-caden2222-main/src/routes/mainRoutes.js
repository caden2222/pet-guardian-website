const express = require("express");
const router = express.Router();

// Route modules
const userRoutes = require("./userRoutes");
const userCompletionRoutes = require("./userCompletionRoutes");
const wellnessChallengeRoutes = require("./wellnessChallengeRoutes");
const badgeRoutes = require("./badgeRoutes");
const petRoutes = require("./petRoutes");

// Middlewares
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware");
const userController = require("../controllers/userController");

/*
  =========================================================
  ROUTE MOUNTING (used by frontend static JS)
  =========================================================
*/

// /api/users/...
// Handles user-related actions such as:
// - profile data
// - owned pets & badges
// - user stats
router.use("/users", userRoutes);

// /api/challenges/...
// Handles challenge completion + challenge management
// (split into completion logic and challenge CRUD logic)
router.use("/challenges", userCompletionRoutes);
router.use("/challenges", wellnessChallengeRoutes);

// /api/badges/...
// Handles badge listing and badge redemption
router.use("/badges", badgeRoutes);

// /api/pets/...
// Handles pet listing and pet purchasing
router.use("/pets", petRoutes);

/*
  =========================================================
  AUTHENTICATION ROUTES (used directly by static JS)
  =========================================================
*/

/*
  POST /api/login
  - Finds user by username
  - Compares entered password with hashed password
  - Generates JWT token if valid
  - Sends token back to frontend
  - Used on login page (login.js)
*/
router.post(
  "/login",
  userController.login,
  bcryptMiddleware.comparePassword,
  jwtMiddleware.generateToken,
  jwtMiddleware.sendToken
);

/*
  POST /api/register
  - Checks if username or email already exists
  - Hashes password before saving
  - Creates new user account
  - Generates JWT token for auto-login
  - Used on register page (register.js)
*/
router.post(
  "/register",
  userController.checkUsernameOrEmailExist,
  bcryptMiddleware.hashPassword,
  userController.register,
  jwtMiddleware.generateToken,
  jwtMiddleware.sendToken
);

module.exports = router;
