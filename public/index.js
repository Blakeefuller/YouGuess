var channelsArray;

var subsOne;
var subsTwo;

// sends request to server to attain high scores values and displays them in the leaderboard
function getLeaderboardData() {
  var leaderboardContainer = document.getElementsByClassName(
    "leaderboard-data-container"
  );

  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonObj = JSON.parse(this.responseText);
      leaderboardArray = jsonObj;

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

  request.open("GET", "/getLeaderboardData?gamemode=subscribers");
  request.send();
}

// sends a request server to potentially update high score
function updateLeaderboard(score) {
  var request = new XMLHttpRequest();
  request.open(
    "PUT",
    "/updateLeaderboardData?score=" + score.toString() + "&gamemode=subscribers"
  );
  request.send();
}

// gets a random youtube channel
function getRandYoutuber(channelsArray) {
  if (channelsArray.length == 0) {
    console.log("== We're out of YouTube channels.");
  }

  var randInt = Math.floor(Math.random() * channelsArray.length); // pick rand number from array length

  channel = channelsArray[randInt];
  channelsArray.splice(randInt, 1); // remove this channel from the array

  return channel;
}

// replaces one of the youtubers with another one
function replaceYoutuber(channelsArray, youtuberNum) {
  channel = getRandYoutuber(channelsArray);

  imageContainers = document.getElementsByClassName("youtuber-image-container");
  infoContainers = document.getElementsByClassName("youtuber-info-container");

  image = imageContainers[youtuberNum - 1].getElementsByTagName("img")[0]; // Get thumbnail, thumbnails are squares (800 x 800) but someone should really set a max height and width on them
  image.src = channel.channelPhotoUrl;
  info = infoContainers[youtuberNum - 1].getElementsByTagName("p")[0]; // Get Youtuber name
  info.textContent = channel.name;

  if (youtuberNum == 1) {
    subsOne = channel.numSubscribers;
    document.getElementById("youtuber-1-subs").innerText = "";
  } else {
    subsTwo = channel.numSubscribers;
    document.getElementById("youtuber-2-subs").innerText = "";
  }
}

// gets two channels and dispplays them
function newChannels() {
  console.log("== Getting new YouTubers now.");
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonObj = JSON.parse(this.responseText);
      channelOne = jsonObj[0];
      channelTwo = jsonObj[1];

      imageContainers = document.getElementsByClassName(
        "youtuber-image-container"
      );
      infoContainers = document.getElementsByClassName(
        "youtuber-info-container"
      );

      imageOne = imageContainers[0].getElementsByTagName("img")[0]; // Get thumbnail, thumbnails are squares (800 x 800) but someone should really set a max height and width on them
      imageOne.src = channelOne.channelPhotoUrl;
      infoOne = infoContainers[0].getElementsByTagName("p")[0]; // Get Youtuber name
      infoOne.textContent = channelOne.name;
      subsOne = channelOne.numSubscribers;
      document.getElementById("youtuber-1-subs").innerText = "";

      imageTwo = imageContainers[1].getElementsByTagName("img")[0]; // Get thumbnail
      imageTwo.src = channelTwo.channelPhotoUrl;
      infoTwo = infoContainers[1].getElementsByTagName("p")[0]; // Get Youtuber name
      infoTwo.textContent = channelTwo.name;
      subsTwo = channelTwo.numSubscribers;
      document.getElementById("youtuber-2-subs").innerText = "";
    }
  };

  request.open("GET", "/getYoutubeChannels");
  request.send();
}

// fills the channel array
function fillChannelsArray() {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonObj = JSON.parse(this.responseText);
      channelsArray = jsonObj;
    }
  };

  request.open("GET", "/getYoutubeChannels");
  request.send();
}

fillChannelsArray();
newChannels();

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
  newChannels(channelsArray);
};

modalCloseButton.onclick = function modalClose(event) {
  modal.classList.add("hidden");
};

//youtuber buttons
var channel1 = document.getElementById("youtuber-1");
var channel2 = document.getElementById("youtuber-2");

var channels = document
  .getElementById("guess-section")
  .getElementsByClassName("youtuber");
console.log("youtubers", channels);

var channel1Subs = channels[0].getAttribute("subCount");
var channel2Subs = channels[1].getAttribute("subCount");

//leaderboard
getLeaderboardData();

channel1.onclick = function modalDisplay(event) {
  console.log("youtuber 1 subs:", channel1Subs);
  console.log("streak:", answerStreak[0].textContent);

  if (parseInt(subsOne) >= parseInt(subsTwo)) {
    replaceYoutuber(channelsArray, 2);
    document.getElementById("youtuber-1-subs").innerText =
      parseInt(subsOne).toLocaleString("en-US");
    console.log("correct youtuber 1 has more subs streak increased");
    var streakValue = parseInt(answerStreak[0].textContent);
    streakValue = streakValue + 1;
    answerStreak[0].textContent = streakValue;
    answerStreak[1].textContent = streakValue;
  } else {
    console.log("== You lose...");
    updateLeaderboard(parseInt(answerStreak[0].textContent));
    document.getElementById("youtuber-1-subs").innerText =
      parseInt(subsOne).toLocaleString("en-US");
    document.getElementById("youtuber-2-subs").innerText =
      parseInt(subsTwo).toLocaleString("en-US");
    // Show losing screen
    if (modal.classList.contains("hidden")) {
      modal.classList.remove("hidden");
    }
  }
};

channel2.onclick = function modalDisplay(event) {
  console.log("youtuber 2 subs:", channel2Subs);
  console.log("streak:", answerStreak[0].textContent);

  if (parseInt(subsOne) <= parseInt(subsTwo)) {
    replaceYoutuber(channelsArray, 1);
    document.getElementById("youtuber-2-subs").innerText =
      parseInt(subsTwo).toLocaleString("en-US");
    var streakValue = parseInt(answerStreak[0].textContent);
    streakValue = streakValue + 1;
    answerStreak[0].textContent = streakValue;
    answerStreak[1].textContent = streakValue;
  } else {
    console.log("== You lose...");
    updateLeaderboard(parseInt(answerStreak[0].textContent));
    document.getElementById("youtuber-1-subs").innerText =
      parseInt(subsOne).toLocaleString("en-US");
    document.getElementById("youtuber-2-subs").innerText =
      parseInt(subsTwo).toLocaleString("en-US");
    // Show losing screen
    if (modal.classList.contains("hidden")) {
      modal.classList.remove("hidden");
    }
  }
};
