const pool = require("../services/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
/**
 * initTables.js
 * - Drops existing tables (in dependency-safe order)
 * - Recreates tables for the app
 * - Seeds sample data for testing/demo
 */

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
}
bcrypt.hash('1234', saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

    const SQLSTATEMENT = `
      -- RESET TABLES
DROP TABLE IF EXISTS UserPet;
DROP TABLE IF EXISTS UserBadge;
DROP TABLE IF EXISTS UserCompletion;
DROP TABLE IF EXISTS Pet;
DROP TABLE IF EXISTS Badge;
DROP TABLE IF EXISTS WellnessChallenge;
DROP TABLE IF EXISTS User;

-- PRIMARY TABLES
CREATE TABLE User (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  points INT DEFAULT 0
);

CREATE TABLE WellnessChallenge (
  challenge_id INT AUTO_INCREMENT PRIMARY KEY,
  creator_id INT NOT NULL,
  description TEXT NOT NULL,
  points INT NOT NULL
);

CREATE TABLE Badge (
  badge_id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  challenges_needed INT NOT NULL,
  requirement_type TEXT NOT NULL
);

CREATE TABLE Pet (
  pet_id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_points INT NOT NULL
);

-- RELATIONSHIP TABLES
CREATE TABLE UserCompletion (
  completion_id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id INT NOT NULL,
  user_id INT NOT NULL,
  details TEXT,
  completed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE UserBadge (
  user_id INT NOT NULL,
  badge_id INT NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE UserPet (
  user_id INT NOT NULL,
  pet_id INT NOT NULL,
  obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, pet_id)
);

-- SAMPLE DATA FOR CA
INSERT INTO User (user_id, username, email, password, points) VALUES
(1, 'Caden', 'abc@gmail.com', '${hash}',0),
(2, 'User2', 'abcd@gmail.com', '${hash}',0),
(3, 'User3', 'abcde@gmail.com', '${hash}',0);

INSERT INTO WellnessChallenge (creator_id, description, points) VALUES
(1, 'Sleep like a boss – Get 7+ hours of sleep', 10),
(1, 'Stairs over elevator? Respect. – Take the stairs today', 20),
(2, 'Digital detox (mini edition) – No phone for 1 hour', 10),
(2, 'Touch grass IRL – Take a 15-minute walk outside', 10),
(2, 'IRL > DMs – Talk to a friend face-to-face', 20),
(3, 'Declutter your chaos – Clean your desk or room', 20),
(3, 'Help a homie – Assist someone without being asked', 20);

INSERT INTO Badge (name, description, challenges_needed, requirement_type) VALUES
('Curious Companion', 'Help your pet explore by completing 3 different wellness activities', 3, 'distinct'),
('Balanced Caretaker', 'Maintain a balanced routine by completing 5 different wellness activities', 5, 'distinct'),
('All-Round Guardian', 'Show well-rounded care by completing 8 different wellness activities', 8, 'distinct'),
('First Feeding', 'Care for your pet by completing 5 wellness challenges in total', 5, 'cumulative'),
('Daily Caretaker', 'Keep your pet happy by completing 10 wellness challenges in total', 10, 'cumulative'),
('Elite Pet Guardian', 'Become an elite guardian by completing 20 wellness challenges in total', 20, 'cumulative');

INSERT INTO Pet (name, description, price_points) VALUES
('Pixel Cat', 'A playful digital cat that keeps you company during your wellness journey', 30),
('Zen Turtle', 'A calm turtle that reminds you to slow down and take care of yourself', 40),
('Star Bunny', 'A cheerful bunny that encourages positive habits and daily motivation', 50),
('Forest Deer', 'A gentle deer that thrives when you maintain a balanced wellness routine', 60),
('Nebula Fox', 'A mysterious fox said to appear only to dedicated guardians', 80),
('Aurora Owl', 'A wise owl that rewards consistency and mindful living', 90),
('Flame Wolf', 'A fierce wolf companion unlocked through persistent self-improvement', 110),
('Spark Dragon', 'A legendary dragon companion reserved for the most committed guardians', 120);
      `;

    pool.query(SQLSTATEMENT, callback);
  }
});