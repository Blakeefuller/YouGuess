const express = require("express");
const fs = require("fs");
const assert = require("assert");
const bodyParser = require("body-parser");

var youtubeChannels = require("./public/youtubeChannels.json");

/*
    SETUP
*/
// Express
var express = require("express"); // We are using the express library for the web server
var app = express(); // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(bodyParser.text());
app.use(express.static("public"));
PORT = 65234; // Set a port number at the top so it's easy to change in the future

// Database
var db = require("./db-connector");

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

// app.post("/updateLeaderboardData", function (req, res) {
//   console.log("== Post request recieved");
//   score = parseInt(req.body);

//   MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("CS290-Final-Project");
//     dbo.collection("data").findOne({}, function (err, result) {
//       if (err) throw err;

//       var leaderboard = result.leaderboard;

//       leaderboard.sort(function (a, b) {
//         return a - b;
//       });
//       var minValue = leaderboard[0];

//       if (score > minValue || leaderboard.length < 10) {
//         if (leaderboard.length >= 10) {
//           leaderboard.shift(); // removes the first element
//         }
//         leaderboard.push(score);
//         leaderboard.sort(function (a, b) {
//           return a - b;
//         });

//         var myobj = { dataType: "Leaderboard", leaderboard: leaderboard };
//         dbo
//           .collection("data")
//           .updateOne(
//             { dataType: "Leaderboard" },
//             { $set: myobj },
//             function (err, res) {
//               if (err) throw err;
//               console.log("1 document updated");
//               db.close();
//             }
//           );
//       } else {
//         db.close();
//       }
//     });
//   });
// });

// app.get("/getLeaderboardData", function (req, res) {
//   console.log("== GET request recieved");

//   MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("CS290-Final-Project");
//     dbo.collection("data").findOne({}, function (err, result) {
//       if (err) throw err;

//       res.send(result);
//     });
//   });
// });

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
