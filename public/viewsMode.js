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

  request.open("GET", "/getLeaderboardData?gamemode=views");
  request.send();
}

function updateLeaderboard(score) {
  var request = new XMLHttpRequest();
  request.open(
    "PUT",
    "/updateLeaderboardData?score=" + score.toString() + "&gamemode=views"
  );
  request.send();
}

function getRandVideo(videosArray) {
  if (videosArray.length == 0) {
    console.log("== We're out of YouTube videos.");
    // call api to get new video
  }

  var randInt = Math.floor(Math.random() * videosArray.length); // pick rand number from array length

  video = videosArray[randInt];
  videosArray.splice(randInt, 1); // remove this video from the array

  return video;
}

function replaceVideo(videosArray, videoNum) {
  video = getRandVideo(videosArray);

  imageContainers = document.getElementsByClassName("video-image-container");
  infoContainers = document.getElementsByClassName("video-info-container");

  image = imageContainers[videoNum - 1].getElementsByTagName("img")[0]; // Get thumbnail, thumbnails are squares (800 x 800) but someone should really set a max height and width on them
  image.src = video.thumbnailURL;
  info = infoContainers[videoNum - 1].getElementsByTagName("p")[0]; // Get video name
  info.textContent = video.title;

  if (videoNum == 1) {
    viewsOne = video.numViews;
    document.getElementById("video-1-views").innerText = "";
  } else {
    viewsTwo = video.numViews;
    document.getElementById("video-2-views").innerText = "";
  }
}

function newVideos() {
  console.log("== Getting new videos now.");
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonObj = JSON.parse(this.responseText);
      videoOne = jsonObj[0];
      videoTwo = jsonObj[1];

      imageContainers = document.getElementsByClassName(
        "video-image-container"
      );
      infoContainers = document.getElementsByClassName("video-info-container");

      imageOne = imageContainers[0].getElementsByTagName("img")[0]; // Get thumbnail, thumbnails are squares (800 x 800) but someone should really set a max height and width on them
      imageOne.src = videoOne.thumbnailURL;
      infoOne = infoContainers[0].getElementsByTagName("p")[0]; // Get Youtuber name
      infoOne.textContent = videoOne.title;
      viewsOne = videoOne.numViews;
      document.getElementById("video-1-views").innerText = "";

      imageTwo = imageContainers[1].getElementsByTagName("img")[0]; // Get thumbnail
      imageTwo.src = videoTwo.thumbnailURL;
      infoTwo = infoContainers[1].getElementsByTagName("p")[0]; // Get Youtuber name
      infoTwo.textContent = videoTwo.title;
      viewsTwo = videoTwo.numViews;
      document.getElementById("video-2-views").innerText = "";
    }
  };

  request.open("GET", "/getYoutubeVideos");
  request.send();
}

function fillVideosArray() {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonObj = JSON.parse(this.responseText);
      videosArray = jsonObj;
    }
  };

  request.open("GET", "/getYoutubeVideos");
  request.send();
}

fillVideosArray();
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
var video1 = document.getElementById("video-1");
var video2 = document.getElementById("video-2");

var videos = document
  .getElementById("guess-section")
  .getElementsByClassName("video");
console.log("videos", videos);

var video1Views = videos[0].getAttribute("viewCount");
var video2Views = videos[1].getAttribute("viewCount");

//leaderboard
getLeaderboardData();

video1.onclick = function modalDisplay(event) {
  console.log("video 1 views:", video1Views);
  console.log("streak:", answerStreak[0].textContent);

  if (parseInt(viewsOne) >= parseInt(viewsTwo)) {
    replaceVideo(videosArray, 2);
    document.getElementById("video-1-views").innerText =
      parseInt(viewsOne).toLocaleString("en-US");
    console.log("correct video 1 has more views streak increased");
    var streakValue = parseInt(answerStreak[0].textContent);
    streakValue = streakValue + 1;
    answerStreak[0].textContent = streakValue;
    answerStreak[1].textContent = streakValue;
  } else {
    console.log("== You lose...");
    updateLeaderboard(parseInt(answerStreak[0].textContent));
    document.getElementById("video-1-views").innerText =
      parseInt(viewsOne).toLocaleString("en-US");
    document.getElementById("video-2-views").innerText =
      parseInt(viewsTwo).toLocaleString("en-US");
    // Show losing screen
    if (modal.classList.contains("hidden")) {
      modal.classList.remove("hidden");
    }
  }
};

video2.onclick = function modalDisplay(event) {
  console.log("video 2 views:", video2Views);
  console.log("streak:", answerStreak[0].textContent);

  if (parseInt(viewsOne) <= parseInt(viewsTwo)) {
    replaceVideo(videosArray, 1);
    document.getElementById("video-2-views").innerText =
      parseInt(viewsTwo).toLocaleString("en-US");
    var streakValue = parseInt(answerStreak[0].textContent);
    streakValue = streakValue + 1;
    answerStreak[0].textContent = streakValue;
    answerStreak[1].textContent = streakValue;
  } else {
    console.log("== You lose...");
    updateLeaderboard(parseInt(answerStreak[0].textContent));
    document.getElementById("video-1-views").innerText =
      parseInt(viewsOne).toLocaleString("en-US");
    document.getElementById("video-2-views").innerText =
      parseInt(viewsTwo).toLocaleString("en-US");
    // Show losing screen
    if (modal.classList.contains("hidden")) {
      modal.classList.remove("hidden");
    }
  }
};
