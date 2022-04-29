var channelsArray;

var subscribersOne;
var subscribersTwo;

function getLeaderboardData() {
  var leaderboardContainer = document.getElementsByClassName(
    "leaderboard-data-container"
  );

  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonObj = JSON.parse(this.responseText);
      leaderboardArray = jsonObj["leaderboard"];
      leaderboardArray.sort((a, b) => b - a);

      console.log(jsonObj["leaderboard"]);

      var list = document.createElement("ol");
      for (var i = 0; i < leaderboardArray.length; i++) {
        var item = document.createElement("li");
        item.appendChild(document.createTextNode(leaderboardArray[i]));
        list.appendChild(item);
      }

      leaderboardContainer[0].appendChild(list);
    }
  };

  request.open("GET", "/getLeaderboardData");
  request.send();
}

function updateLeaderboard(score) {
  var req = new XMLHttpRequest();
  req.open("POST", "/updateLeaderboardData"); // What method to use, where it's going
  req.setRequestHeader("Content-Type", "text/plain");
  req.send(score.toString()); // Sends to server side
}

function getRandYoutuber(channelsArray) {
  if (channelsArray.length == 0) {
    console.log("== We're out of YouTube channels.");
    // call api to get new channel
  }

  var randInt = Math.floor(Math.random() * channelsArray.length); // pick rand number from array length

  channel = channelsArray[randInt];
  channelsArray.splice(randInt, 1); // remove this channel from the array

  return channel;
}

function replaceYoutuber(channelsArray, youtuberNum) {
  channel = getRandYoutuber(channelsArray);

  imageContainers = document.getElementsByClassName("youtuber-image-container");
  infoContainers = document.getElementsByClassName("youtuber-info-container");

  image = imageContainers[youtuberNum - 1].getElementsByTagName("img")[0]; // Get thumbnail, thumbnails are squares (800 x 800) but someone should really set a max height and width on them
  image.src = channel.thumbnail;
  info = infoContainers[youtuberNum - 1].getElementsByTagName("p")[0]; // Get Youtuber name
  info.textContent = channel.name;

  if (youtuberNum == 1) {
    subscribersOne = channel.subscribers;
    document.getElementById("youtuber-1-subs").innerText = "";
  } else {
    subscribersTwo = channel.subscribers;
    document.getElementById("youtuber-2-subs").innerText = "";
  }
}

function newYoutubers(channelsArray) {
  console.log("== Getting new YouTubers now.");
  channelOne = getRandYoutuber(channelsArray);
  channelTwo = getRandYoutuber(channelsArray);

  imageContainers = document.getElementsByClassName("youtuber-image-container");
  infoContainers = document.getElementsByClassName("youtuber-info-container");

  console.log("== channelOne: ", channelOne);
  console.log("== channelTwo: ", channelTwo);

  imageOne = imageContainers[0].getElementsByTagName("img")[0]; // Get thumbnail, thumbnails are squares (800 x 800) but someone should really set a max height and width on them
  imageOne.src = channelOne.thumbnail;
  infoOne = infoContainers[0].getElementsByTagName("p")[0]; // Get Youtuber name
  infoOne.textContent = channelOne.name;
  subscribersOne = channelOne.subscribers;
  document.getElementById("youtuber-1-subs").innerText = "";

  imageTwo = imageContainers[1].getElementsByTagName("img")[0]; // Get thumbnail
  imageTwo.src = channelTwo.thumbnail;
  infoTwo = infoContainers[1].getElementsByTagName("p")[0]; // Get Youtuber name
  infoTwo.textContent = channelTwo.name;
  subscribersTwo = channelTwo.subscribers;
  document.getElementById("youtuber-2-subs").innerText = "";
}

fetch("youtubeChannels.json")
  .then((res) => res.json())
  .then((json) => (channelsArray = json))
  .then(function (channelsArray) {
    newYoutubers(channelsArray); // Start the game by getting new YouTubers
  });

//game over modal stuff
var modal = document.getElementById("game-over-modal");
var modalCloseButton = document.getElementById("modal-close");
var modalPlayAgainButton = document.getElementById("modal-play-again");
var answerStreak = document.getElementsByClassName("player-streak");

modalPlayAgainButton.onclick = function modalClose(event) {
  //start new game
  answerStreak[0].textContent = 0;
  answerStreak[1].textContent = 0;
  modal.classList.add("hidden");
  newYoutubers(channelsArray);
};

modalCloseButton.onclick = function modalClose(event) {
  modal.classList.add("hidden");
};

//youtuber buttons
var youtuber1 = document.getElementById("youtuber-1");
var youtuber2 = document.getElementById("youtuber-2");

var youtubers = document
  .getElementById("guess-section")
  .getElementsByClassName("youtuber");
console.log("youtubers", youtubers);

var youtuber1Subs = youtubers[0].getAttribute("subCount");
var youtuber2Subs = youtubers[1].getAttribute("subCount");

//leaderboard
getLeaderboardData();

youtuber1.onclick = function modalDisplay(event) {
  console.log("youtuber 1 subs:", youtuber1Subs);
  console.log("streak:", answerStreak[0].textContent);

  if (parseInt(subscribersOne) >= parseInt(subscribersTwo)) {
    replaceYoutuber(channelsArray, 2);
    document.getElementById("youtuber-1-subs").innerText =
      parseInt(subscribersOne).toLocaleString("en-US");
    console.log("correct youtuber 1 has more subs streak increased");
    var streakValue = parseInt(answerStreak[0].textContent);
    streakValue = streakValue + 1;
    answerStreak[0].textContent = streakValue;
    answerStreak[1].textContent = streakValue;
  } else {
    console.log("== You lose...");
    updateLeaderboard(parseInt(answerStreak[0].textContent));
    document.getElementById("youtuber-1-subs").innerText =
      parseInt(subscribersOne).toLocaleString("en-US");
    document.getElementById("youtuber-2-subs").innerText =
      parseInt(subscribersTwo).toLocaleString("en-US");
    // Show losing screen
    if (modal.classList.contains("hidden")) {
      modal.classList.remove("hidden");
    }
  }
};

youtuber2.onclick = function modalDisplay(event) {
  console.log("youtuber 2 subs:", youtuber2Subs);
  console.log("streak:", answerStreak[0].textContent);

  if (parseInt(subscribersOne) <= parseInt(subscribersTwo)) {
    replaceYoutuber(channelsArray, 1);
    document.getElementById("youtuber-2-subs").innerText =
      parseInt(subscribersTwo).toLocaleString("en-US");
    var streakValue = parseInt(answerStreak[0].textContent);
    streakValue = streakValue + 1;
    answerStreak[0].textContent = streakValue;
    answerStreak[1].textContent = streakValue;
  } else {
    console.log("== You lose...");
    updateLeaderboard(parseInt(answerStreak[0].textContent));
    document.getElementById("youtuber-1-subs").innerText =
      parseInt(subscribersOne).toLocaleString("en-US");
    document.getElementById("youtuber-2-subs").innerText =
      parseInt(subscribersTwo).toLocaleString("en-US");
    // Show losing screen
    if (modal.classList.contains("hidden")) {
      modal.classList.remove("hidden");
    }
  }
};