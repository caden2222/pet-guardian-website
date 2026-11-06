const model = require("../models/wellnessChallengeModel");
// Creates a new wellness challenge and stores the generated challenge ID for the next middleware
module.exports.createWellnessChallenge = (req, res, next) => {
  if (req.body.description == undefined || res.locals.userId == undefined) {
    return res
      .status(400)
      .json({ message: "Description or user id are undefined" });
  }

  const data = {
    description: req.body.description,
    user_id: res.locals.userId,
    points: req.body.points,
  };

  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      res.locals.id = results.insertId;
      next();
    }
  };
  model.createWellnessChallenge(data, callback);
};

module.exports.showChallengeById = (req, res, next) => {
  const data = { challengeId: res.locals.id };

  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(201).json(results);
    }
  };
  model.showChallengeById(data, callback);
};

module.exports.getAllChallenges = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(200).json(results);
    }
  };
  model.getAllChallenges(callback);
};

module.exports.deleteWellnessChallenge = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.affectedRows == 0) {
      return res
        .status(404)
        .json({ message: "Challenge id cannot be found" });
    } else {
      return res.status(204).send();
    }
  };
  model.deleteWellnessChallenge(data, callback);
};
// Ensures only the challenge creator is allowed to update the challenge
module.exports.checkCreatorId = (req, res, next) => {
  if (
    res.locals.userId == undefined ||
    req.body.description == undefined ||
    req.body.points == undefined
  ) {
    return res
      .status(400)
      .json({ message: "Missing user id, description, or points" });
  }

  const data = {
    challengeId: req.params.challenge_id,
    creator_id: res.locals.userId,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length == 0) {
      return res.status(404).json({ message: "Challenge id does not exist" });
    } else if (results[0].creator_id != data.creator_id) {
      return res.status(403).json({ message: "Owner not correct" });
    } else {
      next();
    }
  };
  model.checkCreatorId(data, callback);
};

module.exports.updateWellnessChallenge = (req, res, next) => {
  const data = {
    challengeId: req.params.challenge_id,
    creator_id: res.locals.userId,
    description: req.body.description,
    points: req.body.points,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
    next();
  };
  model.updateWellnessChallenge(data, callback);
};

module.exports.getChallengeById = (req, res, next) => {
  const data = { challengeId: req.params.challenge_id };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json(results);
  };
  model.showChallengeById(data, callback);
};
