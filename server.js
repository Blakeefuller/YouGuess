const express = require("express");
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const bodyParser = require("body-parser");

var youtubeChannels = require("./public/youtubeChannels.json");

var app = express();

app.use(express.json());
app.use(bodyParser.text());

port = process.env.PORT || "3000";
const url =
  "mongodb+srv://John:YnjR44a9tOQqEckk@cluster0.iiqru.mongodb.net/CS290-Final-Project?retryWrites=true&w=majority";

app.use(express.static("public"));

app.listen(port, function () {
  console.log("server up and running at port: %s", port);
});

app.post("/updateLeaderboardData", function (req, res) {
  console.log("== Post request recieved");
  score = parseInt(req.body);

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("CS290-Final-Project");
    dbo.collection("data").findOne({}, function (err, result) {
      if (err) throw err;

      var leaderboard = result.leaderboard;

      leaderboard.sort(function (a, b) {
        return a - b;
      });
      var minValue = leaderboard[0];

      if (score > minValue || leaderboard.length < 10) {
        if (leaderboard.length >= 10) {
          leaderboard.shift(); // removes the first element
        }
        leaderboard.push(score);
        leaderboard.sort(function (a, b) {
          return a - b;
        });

        var myobj = { dataType: "Leaderboard", leaderboard: leaderboard };
        dbo
          .collection("data")
          .updateOne(
            { dataType: "Leaderboard" },
            { $set: myobj },
            function (err, res) {
              if (err) throw err;
              console.log("1 document updated");
              db.close();
            }
          );
      } else {
        db.close();
      }
    });
  });
});

app.get("/getLeaderboardData", function (req, res) {
  console.log("== GET request recieved");

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("CS290-Final-Project");
    dbo.collection("data").findOne({}, function (err, result) {
      if (err) throw err;

      res.send(result);
    });
  });
});

app.post("/getData", function (req, res) {
  console.log("== Post request recieved");

  youtubeChannels = youtubeChannels.concat(req.body);
  fs.writeFile(
    __dirname + "/public/youtubeChannels.json",
    JSON.stringify(youtubeChannels, null, 2),
    function (err) {
      if (!err) {
        res
          .status(200)
          .send("Data successfully written to youtubeChannels.json");
      } else {
        res.status(500).send("Error storing in database.");
      }
    }
  );
});
