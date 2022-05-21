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

  request.open("GET", "/getItems");
  request.send();
}

getItems();
