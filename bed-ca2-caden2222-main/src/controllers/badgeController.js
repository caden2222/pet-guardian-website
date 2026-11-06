const model = require("../models/badgeModel");

module.exports.getAllBadges = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json(results);
  };
  model.getAllBadges(callback);
};
