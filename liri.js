require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);



if(process.argv[2] == "concert-this"){
    artist = process.argv[3]
    var concertUrl = "https://rest.bandsintown.com/artists/" + artist.trim() + "/events?app_id=codingbootcamp";
    var count = 0;
axios.get(concertUrl).then(
    function logResults(response){
        if (count < (response.data.length)){
          console.log(artist + "'s venue is: " + response.data[count].venue.name);
          console.log("Country: " + response.data[count].venue.country)
          console.log("State: " + response.data[count].venue.region)
          console.log("City: " + response.data[count].venue.city)
          console.log("Date of show: " + moment(response.data[count].datetime).format("MM/DD/YYYY")+"\n")
          count++
          logResults(response)
    }
    }
  );
}

var song = ""

if(process.argv[2] == "spotify-this-song"){
    if(process.argv[3] == null){
         song = "The Sign"
    }
    else{
        for (i = 3; i < process.argv.length; i++){
            song = song + process.argv[i] + " ";
            }
}
spotify.search({ type: 'track', query: song.trim(), limit: 1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log("\nGreat song choice with " + song.trim() + ".");
  console.log("Here is the artist according to Spotify: " + data.tracks.items[0].artists[0].name);
  console.log("And here is the name of the album: " + data.tracks.items[0].album.name);
 console.log("Here is a link to a sample of the song: " + data.tracks.items[0].preview_url)
  });
}





 