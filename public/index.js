var videosArray;

var viewsOne;
var viewsTwo;

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

function updateLeaderboard(score) {
  var request = new XMLHttpRequest();
  request.open(
    "PUT",
    "/updateLeaderboardData?score=" + score.toString() + "&gamemode=subscribers"
  );
  request.send();
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
  image.src = channel.channelPhotoUrl;
  info = infoContainers[youtuberNum - 1].getElementsByTagName("p")[0]; // Get Youtuber name
  info.textContent = channel.name;

  if (youtuberNum == 1) {
    viewsOne = channel.numSubscribers;
    document.getElementById("youtuber-1-subs").innerText = "";
  } else {
    viewsTwo = channel.numSubscribers;
    document.getElementById("youtuber-2-subs").innerText = "";
  }
}

function newVideos() {
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
      viewsOne = channelOne.numSubscribers;
      document.getElementById("youtuber-1-subs").innerText = "";

      imageTwo = imageContainers[1].getElementsByTagName("img")[0]; // Get thumbnail
      imageTwo.src = channelTwo.channelPhotoUrl;
      infoTwo = infoContainers[1].getElementsByTagName("p")[0]; // Get Youtuber name
      infoTwo.textContent = channelTwo.name;
      viewsTwo = channelTwo.numSubscribers;
      document.getElementById("youtuber-2-subs").innerText = "";
    }
  };

  request.open("GET", "/getYoutubeChannels");
  request.send();
}

function fillChannelsArray() {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonObj = JSON.parse(this.responseText);
      videosArray = jsonObj;
    }
  };

  request.open("GET", "/getYoutubeChannels");
  request.send();
}

fillChannelsArray();
newVideos();

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
  newVideos(videosArray);
};

modalCloseButton.onclick = function modalClose(event) {
  modal.classList.add("hidden");
};

//youtuber buttons
var video1 = document.getElementById("youtuber-1");
var video2 = document.getElementById("youtuber-2");

var videos = document
  .getElementById("guess-section")
  .getElementsByClassName("youtuber");
console.log("youtubers", videos);

var video1Views = videos[0].getAttribute("subCount");
var video2Views = videos[1].getAttribute("subCount");

//leaderboard
getLeaderboardData();

video1.onclick = function modalDisplay(event) {
  console.log("youtuber 1 subs:", video1Views);
  console.log("streak:", answerStreak[0].textContent);

  if (parseInt(viewsOne) >= parseInt(viewsTwo)) {
    replaceYoutuber(videosArray, 2);
    document.getElementById("youtuber-1-subs").innerText =
      parseInt(viewsOne).toLocaleString("en-US");
    console.log("correct youtuber 1 has more subs streak increased");
    var streakValue = parseInt(answerStreak[0].textContent);
    streakValue = streakValue + 1;
    answerStreak[0].textContent = streakValue;
    answerStreak[1].textContent = streakValue;
  } else {
    console.log("== You lose...");
    updateLeaderboard(parseInt(answerStreak[0].textContent));
    document.getElementById("youtuber-1-subs").innerText =
      parseInt(viewsOne).toLocaleString("en-US");
    document.getElementById("youtuber-2-subs").innerText =
      parseInt(viewsTwo).toLocaleString("en-US");
    // Show losing screen
    if (modal.classList.contains("hidden")) {
      modal.classList.remove("hidden");
    }
  }
};

video2.onclick = function modalDisplay(event) {
  console.log("youtuber 2 subs:", video2Views);
  console.log("streak:", answerStreak[0].textContent);

  if (parseInt(viewsOne) <= parseInt(viewsTwo)) {
    replaceYoutuber(videosArray, 1);
    document.getElementById("youtuber-2-subs").innerText =
      parseInt(viewsTwo).toLocaleString("en-US");
    var streakValue = parseInt(answerStreak[0].textContent);
    streakValue = streakValue + 1;
    answerStreak[0].textContent = streakValue;
    answerStreak[1].textContent = streakValue;
  } else {
    console.log("== You lose...");
    updateLeaderboard(parseInt(answerStreak[0].textContent));
    document.getElementById("youtuber-1-subs").innerText =
      parseInt(viewsOne).toLocaleString("en-US");
    document.getElementById("youtuber-2-subs").innerText =
      parseInt(viewsTwo).toLocaleString("en-US");
    // Show losing screen
    if (modal.classList.contains("hidden")) {
      modal.classList.remove("hidden");
    }
  }
};
