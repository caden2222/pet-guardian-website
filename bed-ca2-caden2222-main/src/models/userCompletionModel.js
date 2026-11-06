const pool = require("../services/db");

module.exports.postCompletionRecord = (data, callback) => {
  const SQLSTATMENT = `
    INSERT INTO UserCompletion(challenge_id, user_id, details)
VALUES (?, ?, ?)`;
  const VALUES = [data.challenge_id, data.user_id, data.details];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getChallengePoints = (data, callback) => {
  const SQLSTATMENT = `
    SELECT points from wellnesschallenge
    WHERE challenge_id = ?
`;
  const VALUES = [data.challenge_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getUserPoints = (data, callback) => {
  const SQLSTATMENT = `
  SELECT points from user 
  WHERE user_id = ?`;
  const VALUES = [data.user_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.updateUserPoints = (data, callback) => {
  const SQLSTATMENT = `
    UPDATE User
    SET points = ?
    WHERE user_id = ?
    `;
  const VALUES = [data.pointsUpdated, data.user_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getChallengeFromCompletion = (data, callback) => {
  const SQLSTATMENT = `
  SELECT * FROM UserCompletion
  WHERE completion_id = ?`;

  const VALUES = [data.completion_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getUserByChallenge = (data, callback) => {
  const SQLSTATMENT = `
    SELECT user_id,details FROM
    UserCompletion
    WHERE challenge_id = ?`;
  const VALUES = [data.challenge_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};
