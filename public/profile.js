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
        buttonElem.value = friends[i]["username"];
        buttonElem.onclick = function () {
          request.open(
            "DELETE",
            "/deleteFriend?userID=" + userID + "&friendName=" + buttonElem.value
          );
          request.send();
        };

        list.appendChild(item);
      }

      friendsContainer[0].appendChild(list);
    }
  };

  request.open("GET", "/getFriends?userID=" + userID);
  request.send();
}

function getItems(userID) {
  var itemsContainer = document.getElementsByClassName("Items-data-container");

  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      jsonObj = JSON.parse(this.responseText);
      items = jsonObj[0];

      var list = document.createElement("ul");
      for (var key in items) {
        var item = document.createElement("li");
        var text = key + ": " + items[key];
        item.appendChild(document.createTextNode(text));

        const inputElem = item.appendChild(document.createElement("input"));
        inputElem.placeholder = "Updated value";
        inputElem.className = "inputField";

        list.appendChild(item);
      }

      itemsContainer[0].appendChild(list);
    }
  };

  request.open("GET", "/getItems?userID=" + userID, 0);
  request.send();
}

function updateItems() {
  var itemsContainer = document.getElementsByClassName("Items-data-container");
  var list = itemsContainer[0].getElementsByTagName("li");
  var skipQuantity = list[0].getElementsByClassName("inputField")[0].value;
  var reviveQuantity = list[1].getElementsByClassName("inputField")[0].value;

  var request = new XMLHttpRequest();
  request.open(
    "PUT",
    "/updateItems?skipQuantity=" +
      skipQuantity +
      "&reviveQuantity=" +
      reviveQuantity
  );
  request.send();
}

getFriends(0);
getItems(0);
