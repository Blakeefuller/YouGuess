function newVideos() {
  console.log("== Getting new videos now.");
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonObj = JSON.parse(this.responseText);
      videoOne = jsonObj[0];
      videoTwo = jsonObj[1];
      console.log(jsonObj);

      imageContainers = document.getElementsByClassName(
        "video-image-container"
      );
      infoContainers = document.getElementsByClassName("video-info-container");

      imageOne = imageContainers[0].getElementsByTagName("img")[0]; // Get thumbnail, thumbnails are squares (800 x 800) but someone should really set a max height and width on them
      imageOne.src = videoOne.thumbnailURL;
      infoOne = infoContainers[0].getElementsByTagName("p")[0]; // Get Youtuber name
      infoOne.textContent = videoOne.title;
      viewsOne = videoOne.numViews;
      //   document.getElementById("video-1-views").innerText = "";

      imageTwo = imageContainers[1].getElementsByTagName("img")[0]; // Get thumbnail
      imageTwo.src = videoTwo.thumbnailURL;
      infoTwo = infoContainers[1].getElementsByTagName("p")[0]; // Get Youtuber name
      infoTwo.textContent = videoTwo.title;
      viewsTwo = videoTwo.numViews;
      //   document.getElementById("video-2-views").innerText = "";
    }
  };

  request.open("GET", "/getYoutubeVideos");
  request.send();
}

newVideos();
