const express = require("express");
const router = express.Router();

const controller = require("../controllers/userController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

/*
  =========================================================
  USER ROUTES (used by frontend static JS)
  =========================================================
*/

/*
  GET /api/users/badgescreator
  - Returns challenge IDs created by the logged-in user
  - Used to decide whether Edit/Delete buttons should be enabled in the UI
*/
router.get(
  "/badgescreator",
  jwtMiddleware.verifyToken,
  controller.getBadgesByCreator
);

/*
  GET /api/users/badges
  - Returns badges owned/earned by the logged-in user
  - Used in:
    - Badges page (disable "Redeem" if already redeemed)
    - Profile page (list owned badges)
*/
router.get(
  "/badges",
  jwtMiddleware.verifyToken,
  controller.checkForUser,
  controller.getBadgesByUser
);

/*
  GET /api/users/pets
  - Returns pets owned by the logged-in user
  - Used in:
    - Pets shop page (disable "Buy" if already owned)
    - Profile page (list owned pets)
*/
router.get(
  "/pets",
  jwtMiddleware.verifyToken,
  controller.checkForUser,
  controller.getPetsByUser
);

/*
  GET /api/users/petscount
  - Returns total number of pets owned by the logged-in user
  - Used for profile stats dashboard
*/
router.get(
  "/petscount",
  jwtMiddleware.verifyToken,
  controller.checkForUser,
  controller.getPetsCountByUser
);

/*
  GET /api/users/badgescount
  - Returns total number of badges earned by the logged-in user
  - Used for profile stats dashboard
*/
router.get(
  "/badgescount",
  jwtMiddleware.verifyToken,
  controller.checkForUser,
  controller.getBadgesCountByUser
);

/*
  GET /api/users/challengescount
  - Returns total number of challenges completed by the logged-in user
  - Used for profile stats dashboard
*/
router.get(
  "/challengescount",
  jwtMiddleware.verifyToken,
  controller.checkForUser,
  controller.getChallengesCountByUser
);
/*
  GET /api/users/challengesdistinctcount
  - Returns distinct number of challenges completed by the logged-in user
  - Used for profile stats dashboard
*/
router.get('/challengesdistinctcount',
  jwtMiddleware.verifyToken,
  controller.checkForUser,
  controller.getDistinctChallengesCountByUser
)
/*
  GET /api/users/me
  - Returns the logged-in user's profile info (including points)
  - Used in navbar to show current points
*/
router.get(
  "/me",
  jwtMiddleware.verifyToken,
  controller.getUserById
);

/*
  GET /api/users/challenges
  - Returns the logged-in user's challenge completion history
  - Used for activity feed on profile page
*/
router.get(
  "/challenges",
  jwtMiddleware.verifyToken,
  controller.getChallengesByUser
);

/*
  =========================================================
  BADGE ROUTES (used by frontend static JS)
  =========================================================
*/

/*
  POST /api/users/badges/:badge_id/redeem
  - Redeems a badge for the logged-in user
  - Backend checks:
    - user exists
    - badge rules (distinct vs total)
    - prevent duplicate redemption
    - user completed enough challenges
  - Used when user clicks "Redeem" badge button
*/
router.post(
  "/badges/:badge_id/redeem",
  jwtMiddleware.verifyToken,
  controller.checkForUser,
  controller.checkBadgeRule,
  controller.checkRelationship,
  controller.getCompletionCounts,
  controller.insertIntoUserBadge
);

/*
  =========================================================
  PET ROUTES (used by frontend static JS)
  =========================================================
*/

/*
  POST /api/users/:pet_id/buy
  - Buys a pet for the logged-in user
  - Backend checks:
    - user exists
    - pet exists
    - user does not already own pet
    - user has enough points (then deduct points)
    - assign pet to user
  - Used when user clicks "Buy" pet button
*/
router.post(
  "/:pet_id/buy",
  jwtMiddleware.verifyToken,
  controller.checkForUser,
  controller.checkForPet,
  controller.checkPetOwnership,
  controller.minusPoints,
  controller.getUserPoints,
  controller.buyPet
);

module.exports = router;
