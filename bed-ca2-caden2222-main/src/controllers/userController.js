const model = require("../models/userModel");
// Validates username input and prevents creating duplicate users
module.exports.checkForAssociation = (req, res, next) => {
  if (req.body.username == undefined) {
    return res.status(400).json({ message: "Username is undefined" });
  }
  const data = {
    username: req.body.username,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else if (results.length >= 1) {
      return res.status(409).json({ message: "User already exists" });
    } else {
      next();
    }
  };
  model.checkForAssociation(data, callback);
};
module.exports.createNewUserByUsername = (req, res, next) => {
  const data = {
    username: req.body.username,
  };

  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      next();
    }
  };

  model.insertUserByUsername(data, callback);
};

module.exports.selectUserByUsername = (req, res, next) => {
  const data = {
    username: req.body.username,
  };

  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(201).json(results);
    }
  };
  model.checkForAssociation(data, callback);
};

module.exports.getAllUsers = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(200).json(results);
    }
  };
  model.getAllUsers(callback);
};

module.exports.getUserById = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length == 0) {
      return res.status(404).json({ message: "User ID cannot be found" });
    } else {
      return res.status(200).json(results);
    }
  };
  model.getUserById(data, callback);
};
// Checks if requested username is already used by another user (excluding current user)
module.exports.checkUsernameExists = (req, res, next) => {
  const data = {
    username: req.body.username,
    user_id: req.params.user_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (results.length == 0) {
      next();
    } else {
      return res
        .status(409)
        .json({ message: "Username already asssociated with another user" });
    }
  };
  model.checkUsernameExists(data, callback);
};

module.exports.updateUserById = (req, res, next) => {
  const data = {
    user_id: req.params.user_id,
    username: req.body.username,
    points: req.body.points,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      next();
    }
  };
  model.updateUserById(data, callback);
};
// Validates user existence and stores user points for later middleware
module.exports.checkForUser = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length == 0) {
      return res.status(404).json({ message: "User id does not exist" });
    } else {
      res.locals.points = results[0].points;
      next();
    }
  };
  model.getUserById(data, callback);
};
// Validates badge existence and loads badge redemption requirements
module.exports.checkBadgeRule = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
    badge_id: req.params.badge_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length == 0) {
      return res.status(404).json({ message: "Badge does not exist" });
    } else {
      res.locals.requirement_type = results[0].requirement_type;
      res.locals.challenges_needed = results[0].challenges_needed;
      next();
    }
  };
  model.checkBadgeRule(data, callback);
};

// Prevents user from redeeming the same badge more than once
module.exports.checkRelationship = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
    badge_id: req.params.badge_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length == 0) {
      next();
    } else {
      return res
        .status(409)
        .json({ message: "User tried to redeem a badge already obtained" });
    }
  };
  model.checkRelationship(data, callback);
};
// Checks if user meets badge requirements based on distinct/cumulative completion counts
module.exports.getCompletionCounts = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
    challenges_needed: res.locals.challenges_needed,
    requirement_type: res.locals.requirement_type,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (data.requirement_type == "distinct") {
      const challenges = results[0].unique_completed;
      if (challenges >= data.challenges_needed) {
        next();
      } else {
        return res.status(403).json({
          message:
            "You need to complete more different challenges to unlock this badge.",
        });
      }
    } else if (data.requirement_type == "cumulative") {
      const challenges = results[0].total_completed;
      if (challenges >= data.challenges_needed) {
        next();
      } else {
        return res.status(403).json({
          message:
            "You haven’t completed enough challenges yet to unlock this badge.",
        }); 
      }
    }
  };
  model.getCompletionCounts(data, callback);
};

module.exports.insertIntoUserBadge = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
    badge_id: req.params.badge_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(201).json({
      message:
        "User " + data.user_id + " redeemed badge number " + data.badge_id,
    });
  };
  model.insertIntoUserBadge(data, callback);
};

module.exports.getBadgesByUser = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
  };

  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json(results);
  };
  model.getBadgesByUser(data, callback);
};
// Retrieves user's completion stats for redeemable badge calculation
module.exports.getCompletionById = (req, res, next) => {
  const data = {
    user_id: req.params.user_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    res.locals.total_completed = results[0].total_completed;
    res.locals.unique_completed = results[0].unique_completed;
    next();
  };
  model.getCompletionCounts(data, callback);
};
module.exports.getRedeemableBadges = (req, res, next) => {
  const data = {
    total_completed: res.locals.total_completed,
    unique_completed: res.locals.unique_completed,
    user_id: req.params.user_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(200).json(results);
  };
  model.getRedeemableBadges(data, callback);
};

// Validates pet existence and loads pet price in points
module.exports.checkForPet = (req, res, next) => {
  const data = {
    pet_id: req.params.pet_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length == 0) {
      return res.status(404).json({ message: "Pet does not exist" });
    } else {
      res.locals.price_points = results[0].price_points;
      next();
    }
  };
  model.checkForPet(data, callback);
};

// Prevents user from buying a pet they already own
module.exports.checkPetOwnership = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
    pet_id: req.params.pet_id,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length == 0) {
      next();
    } else {
      return res.status(409).json({ message: "User already owns this pet" });
    }
  };
  model.checkPetOwnership(data, callback);
};
// Ensures user has enough points and deducts pet cost before purchase
module.exports.minusPoints = (req, res, next) => {
  const userPoints = res.locals.points;
  const petPoints = res.locals.price_points;

  if (userPoints < petPoints) {
    return res.status(403).json({
      message: "The user does not have enough points to get this pet",
    });
  }

  const data = {
    user_id: res.locals.userId,
    petPoints,
  };
const callback = (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    // IMPORTANT: if DB update didn't affect a row, stop chain
    // (covers race condition / double requests)
    if (!results || results.affectedRows === 0) {
      return res.status(403).json({
        message: "Not enough points (or request already processed)",
      });
    }

    return next();
  }
  model.minusPoints(data,callback);
};

module.exports.buyPet = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
    pet_id: req.params.pet_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(201).json({
      message: "User " + data.user_id + " obtained Pet " + data.pet_id,
      updated_points: res.locals.updatedPoints
    });
  };
  model.buyPet(data, callback);
};

module.exports.getPetsByUser = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json(results);
  };
  model.getPetsByUser(data, callback);
};

module.exports.register = (req, res, next) => {
  const data = {
    username: req.body.username,
    email: req.body.email,
    password: res.locals.hash,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.locals.userId = results.insertId;
      next();
    }
  };
  model.register(data, callback);
};

module.exports.login = (req, res, next) => {
  if (req.body.username == undefined || req.body.password == undefined) {
    return res.status(400).json({ message: "Missing username or password" });
  }
  const data = {
    username: req.body.username,
    password: req.body.password,
  };
  const callback = (error, results, fields) => {
    if(error){
      return res.status(500).json({message:"Internal Server Error"})
    }
    if (results.length == 0) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.locals.username = results[0].username;
      res.locals.userId = results[0].user_id;
      res.locals.hash = results[0].password;
      

      return next();
    }
  };
  model.login(data, callback);
};

module.exports.checkUsernameOrEmailExist = (req, res, next) => {
  const data = {
    username: req.body.username,
    email: req.body.email,
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (results.length >= 1) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    } else {
      return next();
    }
  };
  model.checkUsernameOrEmailExist(data, callback);
};

module.exports.getBadgesCountByUser = (req, res, next) => {
  const data = {
    user_id: res.locals.userId
  };
  const callback = (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error" });  
    } else {
      return res.status(200).json(results[0]);
    } 
  };
  model.getBadgesCountByUser(data, callback);
}

module.exports.getPetsCountByUser = (req, res, next) => {   
  const data = {
    user_id: res.locals.userId
  };  
  const callback = (error, results, fields) => {  
    if (error) {
      return res.status(500).json({ message: "Internal server error" });  
    } else {
      return res.status(200).json(results[0]);
    } 
  };
  model.getPetsCountByUser(data, callback);
}

module.exports.getChallengesCountByUser = (req, res, next) => {  
  const data = {
    user_id: res.locals.userId
  };  
  const callback = (error, results, fields) => {  
    if (error) {
      return res.status(500).json({ message: "Internal server error" });  
    } else {
      return res.status(200).json(results[0]);
    }
  };
  model.getChallengesCountByUser(data, callback);
}

module.exports.getDistinctChallengesCountByUser = (req,res,next) => {
  const data = {
    user_id :res.locals.userId
  }
  const callback = (error,results,fields) => {
    if(error){
      return res.status(500).json({message:"Internal Server Error"})
    }
    else{
      return res.status(200).json(results[0])
    }
  }
  model.getDistinctChallengesCountByUser(data,callback)
}

module.exports.getChallengesByUser = (req,res,next) => {
  const data = {user_id : res.locals.userId}
  const callback = (error,results,fields) => {
    if(error){
      return res.status(500).json({message:"Internal Server Error"});
    }
    else{
      return res.status(200).json(results)
    }
  }
  model.getChallengesByUser(data,callback)
}


module.exports.getBadgesByCreator = (req,res,next) => {
  const data = {
    user_id : res.locals.userId
  }
  const callback = (error,results,fields) => {
    if(error){
      return res.status(500).json({message:"Internal Server Error"})
    }
    else{
      return res.status(200).json(results)
    }
  }
  model.getBadgesByCreator(data,callback)
}

module.exports.getUserPoints = (req,res,next) => {
  const data = {user_id : res.locals.userId}

  const callback = (error,results,fields) => {
    if(error){
      return res.status(500).json({message:"Internal Server Error"})
    }
    else{
      res.locals.updatedPoints = results[0].points
      next()
    }
  }
  model.getUserById(data,callback)
}