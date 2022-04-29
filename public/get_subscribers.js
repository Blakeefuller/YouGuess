function Channel(id) {
    this.name;
    this.thumbnail;
    this.subscribers;

    var items = getThumbnailSubscribers(this, id) // this also pushes to the array of channels
    // We should actually be writing to the JSON file
}

var channels = []
var c;
var redoCount = 0;

function loadClient() {
    gapi.client.setApiKey("AIzaSyCOU2lNYryQnXL4L2dCVrYf_J3qaOHzUSI");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
function getThumbnailSubscribers(channelObj, id) {
    return gapi.client.youtube.channels.list({
      "part": [
        "snippet,statistics"
      ],
      "id": [
          id
      ]
    })
    .then(function(response) {
        return new Promise(function (resolve, reject){
            var channelInfo = response.result.items[0]
            
            if (channelInfo){
                channelObj.name = channelInfo.snippet.title
                channelObj.thumbnail = channelInfo.snippet.thumbnails.high.url
                channelObj.subscribers = channelInfo.statistics.subscriberCount
            }
            resolve(channelObj)
        })
        .then(function (channelObj){

            if (!channelObj.hiddenSubscriberCount && channelObj.subscribers >= 3000){
                channels.push(channelObj)
            }
            else {
                redoCount++ // get new channel
            }
            return channels
        })
        /*.then(function(channels) {
            if (redoCount > 0){
                getChannelInfo(redoCount)
                redoCount = 0
            }
            return channels
        })*/
        .then(writeToJson)
    },
    function(err) { console.error("Execute error", err); });
}

function createChannelArray(ids){
    ids.forEach(id => {
        new Channel(id)
    })
    return channels
}

function writeToJson(channels){ // where channels is an array of Channel objects
    //console.log("== Inside writeToJson, channels: ", channels)

    var req = new XMLHttpRequest()
    req.open('POST', "/getData") // What method to use, where it's going
    var reqBody = JSON.stringify(channels)

    req.setRequestHeader('Content-Type', 'application/json')
    req.send(reqBody) // Sends to server side
    console.log("== Request sent")
    // We want to append to this file
}

function getChannelInfo(n = 1){

    return gapi.client.youtube.search.list({
        // Just save the whole list
        "part": [
        "snippet"
      ],
        "maxResults": n, // set n to whatever number we want here
        "order": "viewCount",
        "q": "style",
        "relevanceLanguage": "en",
        "safeSearch": "moderate",
        "type": [
            "channel"
        ]
    })
    .then(function(response) {
        var channelIds = []
        return new Promise(function (resolve, reject){
            var results = response.result.items
            results.forEach(item => {
                channelIds.push(item.id.channelId)
                resolve(channelIds)
            })
        })
    },
    function(err) { console.error("Execute error", err); })
    .then(createChannelArray); // this will give us our channels array
    /*.then(function (response) {
        getChannelInfo(redoCount)
        return response
    })
    .then(function (response) {
        writeToJson(channels)
    });*/
}

function getRandChannelName(n){
    var searchTerms = []
    var names = []

    var link = "https://random-word-api.herokuapp.com/word?number=" + n
    console.log("== Inside getRandChannelName(n)")
    console.log("  -- link: ", link)

    var request = new XMLHttpRequest()

    request.open('GET', link, true)
    request.onload = function () {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response)
    
      if (request.status >= 200 && request.status < 400) {
        searchTerms.push(data)
        console.log("== searchTerms: ", searchTerms)
      } 
      else {
        console.log('error')
      }
    }
    
    request.send()

    for (var i = 0; i < n; i++){
        // get the channels
        // get some search terms
        // only get channels with more than 3000 subscribers
        names.push(getChannelInfo(searchTerms[i]))
    }

    return names
}

gapi.load("client:auth2", function() {
    loadClient()
});