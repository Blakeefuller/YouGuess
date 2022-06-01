const express = require("express");
const fs = require("fs");
const assert = require("assert");
const bodyParser = require("body-parser");

var youtubeChannels = require("./public/youtubeChannels.json");

/*
    SETUP
*/
// Express
var app = express(); // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(bodyParser.text());
app.use(express.static("public"));
PORT = 62334; // Set a port number at the top so it's easy to change in the future

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
        scores[i] = result[i].highScore;
      }

      res.status(200).send(JSON.stringify(scores));
    } else {
      res.status(500).send("Error storing in database.");
    }
  });
});

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

app.get("/", function (req, res) {
  // Define our queries
  query1 = "DROP TABLE IF EXISTS diagnostic;";
  query2 =
    "CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);";
  query3 = 'INSERT INTO diagnostic (text) VALUES ("MySQL is working!")';
  query4 = "SELECT * FROM diagnostic;";

  // Execute every query in an asynchronous manner, we want each query to finish before the next one starts

  // DROP TABLE...
  db.pool.query(query1, function (err, results, fields) {
    // CREATE TABLE...
    db.pool.query(query2, function (err, results, fields) {
      // INSERT INTO...
      db.pool.query(query3, function (err, results, fields) {
        // SELECT *...
        db.pool.query(query4, function (err, results, fields) {
          // Send the results to the browser
          let base = "<h1>MySQL Results:</h1>";
          res.send(base + JSON.stringify(results));
        });
      });
    });
  });
});

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

// app.post("/getData", function (req, res) {
//   console.log("== Post request recieved");

//   youtubeChannels = youtubeChannels.concat(req.body);
//   fs.writeFile(
//     __dirname + "/public/youtubeChannels.json",
//     JSON.stringify(youtubeChannels, null, 2),
//     function (err) {
//       if (!err) {
//         res
//           .status(200)
//           .send("Data successfully written to youtubeChannels.json");
//       } else {
//         res.status(500).send("Error storing in database.");
//       }
//     }
//   );
// });
