const pool = require("../services/db");

module.exports.getAllBadges = (callback) => {
  const SQLSTATMENT = `
    SELECT * FROM Badge`;
  pool.query(SQLSTATMENT, callback);
};
