const model = require("../models/userCompletionModel");

module.exports.getChallengePoints = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length == 0) {
      return res.status(404).json({ message: "Challenge id does not exist" });
    }
    res.locals.challengePoints = results[0].points;
    next();
  };
  model.getChallengePoints(data, callback);
};

module.exports.getUserPoints = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
    challenge_points: res.locals.challengePoints,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length == 0) {
      return res.status(404).json({ message: "User id does not exist" });
    }
    res.locals.updatedPoints = data.challenge_points + results[0].points;
    next();
  };
  model.getUserPoints(data, callback);
};

module.exports.postCompletionRecord = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id,
    user_id: res.locals.userId,
    details: req.body.details,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.locals.completion_id = results.insertId;
    next();
  };
  model.postCompletionRecord(data, callback);
};

module.exports.updateUserPoints = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
    pointsUpdated: res.locals.updatedPoints,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    next();
  };
  model.updateUserPoints(data, callback);
};

module.exports.getChallengeFromCompletion = (req, res, next) => {
  const data = {
    completion_id: res.locals.completion_id,
    pointsUpdated: res.locals.updatedPoints
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(201).json({
  "message": "Challenge completed",
  "result": results,
  "updated_points": data.pointsUpdated
}
);
    }
  };
  model.getChallengeFromCompletion(data, callback);
};

module.exports.getUserByChallenge = (req, res, next) => {
  const data = {
    challenge_id: req.params.challenge_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length == 0) {
      res
        .status(404)
        .json({ message: "Requested challenge id does not have any attempts" });
    } else {
      res.status(200).json(results);
    }
  };
  model.getUserByChallenge(data, callback);
};
