function getFriends(userID) {
  var friendsContainer = document.getElementsByClassName(
    "friendslist-data-container"
  );

  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      friends = JSON.parse(this.responseText);

      var list = document.createElement("ol");
      for (var i = 0; i < friends.length; i++) {
        var item = document.createElement("li");
        item.appendChild(document.createTextNode(friends[i]["username"]));

        const buttonElem = item.appendChild(document.createElement("button"));
        buttonElem.innerText = "delete";
        buttonElem.onclick = function () {
          // remove list item here
        };

        list.appendChild(item);
      }

      friendsContainer[0].appendChild(list);
    }
  };

  request.open("GET", "/getFriends?userID=" + userID);
  request.send();
}

function getItems() {
  var itemsContainer = document.getElementsByClassName("Items-data-container");

  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonObj = JSON.parse(this.responseText);
      items = jsonObj;

      console.log(items);

      //   var list = document.createElement("ol");
      //   for (var i = 0; i < leaderboardArray.length; i++) {
      //     var item = document.createElement("li");
      //     item.appendChild(document.createTextNode(leaderboardArray[i]));
      //     list.appendChild(item);
      //   }

      //   leaderboardContainer[0].appendChild(list);
    }
  };

  request.open("GET", "/getFriends", 0);
  request.send();
}

getFriends(0);
// getItems();
