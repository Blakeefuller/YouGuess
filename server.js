const express = require("express");
const fs = require("fs");
const assert = require("assert");
const bodyParser = require("body-parser");

/*
    SETUP
*/
// Express
var app = express(); // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(bodyParser.text());
app.use(express.static("public"));
PORT = 61691; // Set a port number at the top so it's easy to change in the future

// Database
var db = require("./public/db-connector.js");

/*
    LISTENER
*/
app.listen(PORT, function () {
  // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
  console.log(
    "Express started on http://localhost:" +
      PORT +
      "; press Ctrl-C to terminate."
  );
});

/*
    ROUTES
*/

// gets the 10 highest high scores
app.get("/getLeaderboardData", function (req, res) {
  console.log("== GET request recieved");
  gamemode = req.query.gamemode;

  query =
    "SELECT highScore FROM High_Scores WHERE gameMode='" +
    gamemode +
    "' ORDER BY highScore DESC LIMIT 10;";

  db.pool.query(query, function (err, results, fields) {
    if (!err) {
      const result = Object.values(JSON.parse(JSON.stringify(results)));

      let scores = [];
      for (let i = 0; i < result.length; i++) {
        //adds all high scores to the scores array
        scores[i] = result[i].highScore;
      }

      res.status(200).send(JSON.stringify(scores));
    } else {
      res.status(500).send("Error storing in database.");
    }
  });
});

// gets all youtube channels in the database in a random order
app.get("/getYoutubeChannels", function (req, res) {
  console.log("== GET request recieved");

  query = "SELECT * FROM YouTube_Channels ORDER BY RAND();";

  db.pool.query(query, function (err, results, fields) {
    if (!err) {
      const result = Object.values(JSON.parse(JSON.stringify(results)));

      res.status(200).send(result);
    } else {
      res.status(500).send("Error storing in database.");
    }
  });
});

// gets all youtube videos in the database in a random order
app.get("/getYoutubeVideos", function (req, res) {
  console.log("== GET request recieved");

  query = "SELECT * FROM YouTube_Videos ORDER BY RAND();";

  db.pool.query(query, function (err, results, fields) {
    if (!err) {
      const result = Object.values(JSON.parse(JSON.stringify(results)));
      console.log(result);

      res.status(200).send(result);
    } else {
      res.status(500).send("Error storing in database.");
    }
  });
});

// gets all friends of a user based on their userID
app.get("/getFriends", function (req, res) {
  console.log("== GET request recieved");
  userID = req.query.userID;
  userID = userID.toString();

  query =
    "SELECT Users.username FROM Users JOIN Friends_List ON Friends_List.friendID = Users.userID WHERE Friends_List.userID=" +
    userID +
    ";";

  db.pool.query(query, function (err, results, fields) {
    if (!err) {
      const result = Object.values(JSON.parse(JSON.stringify(results)));

      res.status(200).send(JSON.stringify(result));
    } else {
      res.status(500).send("Error storing in database.");
    }
  });
});

// gets all items quantites of a user based on their userID
app.get("/getItems", function (req, res) {
  console.log("== GET request recieved");

  userID = req.query.userID;
  userID = userID.toString();

  query =
    "SELECT skipQuantity, reviveQuantity FROM Items_List WHERE userID=" +
    userID +
    ";";

  db.pool.query(query, function (err, results, fields) {
    if (!err) {
      const result = Object.values(JSON.parse(JSON.stringify(results)));

      res.status(200).send(JSON.stringify(result));
    } else {
      res.status(500).send("Error storing in database.");
    }
  });
});

// deletes a friend of a user based on their userID's
app.delete("/deleteFriend", function (req, res) {
  friendName = req.query.friendName;

  userID = req.query.userID;
  userID = userID.toString();

  var query =
    "DELETE FROM Friends_List WHERE friendID=(SELECT userID FROM Users WHERE username='" +
    friendName +
    "') AND userID=" +
    userID +
    ";";

  db.pool.query(query, function (err, results, fields) {
    if (!err) {
      res.status(200);
      res.end();
    } else {
      res.status(500).send("Error storing in database.");
    }
  });
});

// updates the item quantities of a user if 2 values are provided
app.put("/updateItems", function (req, res) {
  skipQuantity = req.query.skipQuantity;
  reviveQuantity = req.query.reviveQuantity;

  if (parseInt(skipQuantity) > 0 && parseInt(reviveQuantity) > 0) {
    var query1 =
      "UPDATE Items_List SET skipQuantity=" +
      skipQuantity +
      " WHERE userID=" +
      "0" +
      ";";
    var query2 =
      "UPDATE Items_List SET reviveQuantity=" +
      reviveQuantity +
      " WHERE userID=" +
      "0" +
      ";";

    db.pool.query(query1, function (err, results, fields) {
      if (!err) {
        res.status(200);
        res.end();
      } else {
        res.status(500).send("Error storing in database.");
      }
    });

    db.pool.query(query2, function (err, results, fields) {
      if (!err) {
        res.status(200);
        res.end();
      } else {
        res.status(500).send("Error storing in database.");
      }
    });
  }
});

// adds a friend based on their userID's
app.post("/addFriend", function (req, res) {
  console.log("== POST request recieved");

  friendName = req.query.friendName;

  userID = req.query.userID;
  userID = userID.toString();

  query =
    "INSERT INTO Friends_List (userID, friendID) VALUES (" +
    userID +
    ", (SELECT userID FROM Users WHERE username= '" +
    friendName +
    "'));";

  db.pool.query(query, function (err, results, fields) {
    if (!err) {
      res.status(200);
      res.end();
    } else {
      res.status(500).send("Error storing in database.");
    }
  });
});

// updates leaderboard data by first getting the current high score of a user
// and then compares it to the score that was just attained
app.put("/updateLeaderboardData", function (req, res) {
  console.log("== Put request recieved");
  score = req.query.score;
  gamemode = req.query.gamemode;
  currentHighScore = 0;

  getQuery =
    "SELECT highScore FROM High_Scores WHERE userID = 0 AND gameMode = '" +
    gamemode +
    "';";

  updateQuery =
    "UPDATE High_Scores SET highScore = " +
    score +
    " WHERE userID = 0 AND gameMode = '" +
    gamemode +
    "';";

  db.pool.query(getQuery, function (err, results, fields) {
    if (!err) {
      const result = Object.values(JSON.parse(JSON.stringify(results)));
      currentHighScore = parseInt(result[0].highScore);

      if (score > currentHighScore) {
        db.pool.query(updateQuery, function (err, results, fields) {
          if (!err) {
            res.status(200);
            res.end();
          } else {
            res.status(500).send("Error storing in database.");
          }
        });
      }
      res.status(200);
      res.end();
    } else {
      res.status(500).send("Error storing in database.");
    }
  });
});
