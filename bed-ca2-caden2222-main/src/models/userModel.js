const pool = require("../services/db");

module.exports.checkForAssociation = (data, callback) => {
  const SQLSTATMENT = `
    SELECT * FROM User
    WHERE username = ?
  `;

  const VALUES = [data.username];

  pool.query(SQLSTATMENT, VALUES, callback);
};
module.exports.insertUserByUsername = (data, callback) => {
  const SQLSTATMENT = `
    INSERT INTO User (username)
    VALUES (?)
    `;

  const VALUES = [data.username];

  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getAllUsers = (callback) => {
  const SQLSTATMENT = `
  SELECT * FROM User
  `;
  pool.query(SQLSTATMENT, callback);
};

module.exports.getUserById = (data, callback) => {
  const SQLSTATMENT = `
  SELECT * FROM User
  WHERE user_id = ?
  `;
  const VALUES = [data.user_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.checkUsernameExists = (data, callback) => {
  const SQLSTATMENT = `
  SELECT * FROM User
  WHERE username = ?
  AND user_id != ?`;

  const VALUES = [data.username, data.user_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.updateUserById = (data, callback) => {
  const SQLSTATMENT = `
  UPDATE User
  SET username = ? , points = ?
  WHERE user_id = ? `;

  const VALUES = [data.username, data.points, data.user_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.checkRelationship = (data, callback) => {
  const SQLSTATMENT = `
  SELECT * FROM UserBadge
  WHERE user_id = ? AND
  badge_id = ?`;
  const VALUES = [data.user_id, data.badge_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.checkBadgeRule = (data, callback) => {
  const SQLSTATMENT = `
  SELECT requirement_type, challenges_needed FROM Badge
  WHERE badge_id = ?`;
  const VALUES = [data.badge_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getCompletionCounts = (data, callback) => {
  const SQLSTATMENT = `
  SELECT COUNT(challenge_id) as total_completed, COUNT(DISTINCT challenge_id) as unique_completed
  FROM UserCompletion
  WHERE user_id = ?`;
  const VALUES = [data.user_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.insertIntoUserBadge = (data, callback) => {
  const SQLSTATMENT = `
  INSERT INTO UserBadge(user_id,badge_id)
  VALUES(?,?)
  `;
  const VALUES = [data.user_id, data.badge_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getBadgesByUser = (data, callback) => {
  const SQLSTATMENT = `
  SELECT user_id, userbadge.badge_id, name, description,challenges_needed,requirement_type, earned_at FROM UserBadge
  INNER JOIN Badge
  ON Badge.badge_id = UserBadge.badge_id
  WHERE user_id = ?`;

  const VALUES = [data.user_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getRedeemableBadges = (data, callback) => {
  const SQLSTATMENT = `
  SELECT *
FROM Badge
WHERE 
  (requirement_type = 'distinct' AND challenges_needed <= ?)
  OR
  (requirement_type = 'cumulative' AND challenges_needed <= ?);
  `;

  const VALUES = [data.unique_completed, data.total_completed];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.checkForPet = (data, callback) => {
  const SQLSTATMENT = `
SELECT * FROM Pet
WHERE pet_id = ?`;

  const VALUES = [data.pet_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.checkPetOwnership = (data, callback) => {
  const SQLSTATMENT = `
  SELECT * FROM UserPet
  WHERE pet_id = ? AND
  user_id = ?`;

  const VALUES = [data.pet_id, data.user_id];

  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.minusPoints = (data, callback) => {
  const SQLSTATMENT = `
  UPDATE User
SET points = points - ?
WHERE user_id = ?
  AND points >= ?;
`;
  const VALUES = [data.petPoints, data.user_id, data.petPoints];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.buyPet = (data, callback) => {
  const SQLSTATMENT = `
  INSERT INTO UserPet(user_id,pet_id)
  VALUES(?,?)`;
  const VALUES = [data.user_id, data.pet_id];

  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getPetsByUser = (data, callback) => {
  const SQLSTATMENT = `
  SELECT Userpet.pet_id, Userpet.user_id, name, description, price_points,obtained_at FROM UserPet
  INNER JOIN Pet
  ON UserPet.pet_id = Pet.pet_id
  WHERE UserPet.user_id = ?`;

  const VALUES = [data.user_id];

  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.checkUsernameOrEmailExist = (data, callback) => {
  const SQLSTATMENT = `
  SELECT * FROM User 
  WHERE username = ?
  OR email = ?
  `;
  const VALUES = [data.username, data.email];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.register = (data, callback) => {
  const SQLSTATMENT = `
  INSERT INTO User (username,email,password)
  VALUES(?,?,?)
  `;
  const VALUES = [data.username, data.email, data.password];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.login = (data, callback) => {
  const SQLSTATMENT = `
  SELECT * FROM User
  WHERE username = ?
  `;
  const VALUES = [data.username];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getBadgesCountByUser = (data, callback) => {
  const SQLSTATMENT = `
  SELECT COUNT(*) as badge_count FROM UserBadge
  WHERE user_id = ?`;

  const VALUES = [data.user_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getPetsCountByUser = (data, callback) => {
  const SQLSTATMENT = `
  SELECT COUNT(*) as pet_count FROM UserPet
  WHERE user_id = ?`;
  const VALUES = [data.user_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getChallengesCountByUser = (data, callback) => {
  const SQLSTATMENT = `
  SELECT COUNT(*) as challenge_count FROM UserCompletion
  WHERE user_id = ?`;

  const VALUES = [data.user_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getDistinctChallengesCountByUser = (data,callback) => {
  const SQLSTATMENT = `
  SELECT COUNT(DISTINCT challenge_id) as challenge_count from UserCompletion
  WHERE user_id = ?`
  const VALUES = [data.user_id];
  pool.query(SQLSTATMENT,VALUES,callback)
}

module.exports.getChallengesByUser = (data, callback) => {
  const SQLSTATMENT = `
  select completion_id, wellnesschallenge.challenge_id, user_id, details, creator_id, description,completed_date, points from usercompletion
	  INNER JOIN wellnesschallenge
	  ON usercompletion.challenge_id = wellnesschallenge.challenge_id
		where user_id = ?
        ORDER BY completed_date desc`;
  const VALUES = [data.user_id];
  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.getBadgesByCreator = (data,callback) => {
  const SQLSTATMENT = `
  SELECT * FROM wellnesschallenge
  where creator_id = ?`
  const VALUES = [data.user_id]
  pool.query(SQLSTATMENT,VALUES,callback)
}

