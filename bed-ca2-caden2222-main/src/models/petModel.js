const pool = require("../services/db");

module.exports.getAllPets = (callback) => {
  const SQLSTATMENT = `
SELECT * FROM Pet
`;

  pool.query(SQLSTATMENT, callback);
};
