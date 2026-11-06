const express = require("express");
const router = express.Router();

const controller = require("../controllers/wellnessChallengeController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

/*
  =========================================================
  CHALLENGE ROUTES (used by frontend static JS)
  =========================================================
*/

/*
  GET /api/challenges
  - Returns all wellness challenges
  - Used to display the challenge list on the main challenges page
*/
router.get("/", controller.getAllChallenges);

/*
  POST /api/challenges
  - Creates a new wellness challenge
  - Only accessible to logged-in users
  - Returns the newly created challenge
  - Used when user submits the "Create Challenge" modal
*/
router.post(
  "/",
  jwtMiddleware.verifyToken,
  controller.createWellnessChallenge,
  controller.showChallengeById
);

/*
  PUT /api/challenges/:challenge_id
  - Updates an existing challenge
  - Only the creator of the challenge is allowed to edit
  - Returns updated challenge details
  - Used when creator clicks "Edit" on their own challenge
*/
router.put(
  "/:challenge_id",
  jwtMiddleware.verifyToken,
  controller.checkCreatorId,
  controller.updateWellnessChallenge,
  controller.getChallengeById
);

/*
  DELETE /api/challenges/:challenge_id
  - Deletes a challenge
  - Only the creator of the challenge is allowed to delete
  - Used when creator confirms "Delete" in the UI
*/
router.delete(
  "/:challenge_id",
  jwtMiddleware.verifyToken,
  controller.deleteWellnessChallenge
);

module.exports = router;
