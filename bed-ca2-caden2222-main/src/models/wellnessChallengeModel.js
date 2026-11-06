const pool = require("../services/db");
module.exports.createWellnessChallenge = (data, callback) => {
  const SQLSTATMENT = `
    INSERT INTO WellnessChallenge (description, creator_id, points)
    VALUES (?,?,?)
    `;
  const VALUES = [data.description, data.user_id, data.points];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.showChallengeById = (data, callback) => {
  const SQLSTATMENT = `
    SELECT * FROM WellnessChallenge
    WHERE challenge_id = ?`;
  const VALUES = [data.challengeId];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getAllChallenges = (callback) => {
  const SQLSTATMENT = `
    SELECT * FROM WellnessChallenge`;
  pool.query(SQLSTATMENT, callback);
};

module.exports.deleteWellnessChallenge = (data, callback) => {
  const SQLSTATMENT = `
    DELETE FROM WellnessChallenge
    WHERE challenge_id = ?`;
  const VALUES = [data.challenge_id];

  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.checkCreatorId = (data, callback) => {
  const SQLSTATMENT = `
    SELECT * FROM WellnessChallenge
    WHERE challenge_id = ? `;
  const VALUES = [data.challengeId];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.updateWellnessChallenge = (data, callback) => {
  const SQLSTATMENT = `
    UPDATE WellnessChallenge
    SET description = ?, creator_id = ?, points = ?
    WHERE challenge_id = ?`;
  const VALUES = [
    data.description,
    data.creator_id,
    data.points,
    data.challengeId,
  ];
  pool.query(SQLSTATMENT, VALUES, callback);
};


