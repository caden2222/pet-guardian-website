const express = require("express");
const router = express.Router();

const controller = require("../controllers/userCompletionController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");
/*
POST Request to create a completion record for the user
- Verifies that you are the user first
- Retrieves the points awarded for the challenge while also checking for challenge existence
- Retrieve's the user's current points while also checking for user existence
- Create completion record inside user completion table
- Updates user's points after completion
- Returns user's completion record 
*/
router.post(
  "/:challenge_id",
  jwtMiddleware.verifyToken,
  controller.getChallengePoints,
  controller.getUserPoints,
  controller.postCompletionRecord,
  controller.updateUserPoints,
  controller.getChallengeFromCompletion
);
router.get("/:challenge_id", controller.getUserByChallenge);

module.exports = router;
