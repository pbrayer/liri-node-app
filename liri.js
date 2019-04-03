require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var song = ""
var artist = ""
var songLength = ""
var artistLength = ""
var movie = ""
var movieLength = ""

if(process.argv[2] == "concert-this"){
    for(i = 3; i < process.argv.length; i++){
        artistLength = artistLength + process.argv[i] + " "
}
   bandsInTownLiri(artistLength)
}

if(process.argv[2] == "spotify-this-song"){
    for(i = 3; i < process.argv.length; i++){
        songLength = songLength + process.argv[i] + " "
}
if (process.argv[3] == null){
    songLength = "The Sign"
    console.log("No track entered...")
}
   spotifyLiri(songLength)
}

if(process.argv[2] == "movie-this"){
    for(i = 3; i < process.argv.length; i++){
        movieLength = movieLength + process.argv[i] + " "
}
if (process.argv[3] == null){
    movieLength = "Mr. Nobody"
    console.log("\nNo movie entered...\n")
}
   omdbLiri(movieLength)
}

function omdbLiri (movieLength) {
    movie = movieLength
    var movieUrl = "http://www.omdbapi.com/?t=" + movie.trim() + "&y=&plot=short&apikey=trilogy";
    axios.get(movieUrl).then(
        function(response){
            console.log("The movie's rating is: " + response.data.Title);
            console.log("And it was released in: " + response.data.Released)
            console.log("The movie's IMDB rating is: " + response.data.imdbRating);
            console.log("The movie's RottenTomatoes rating is: " + response.data.Ratings[1].Value);
            console.log("Country filmed in: " + response.data.Country);
            console.log("Filmed in these language(s): " + response.data.Language);
            console.log("A general summation of the plot: " + response.data.Plot);
            console.log("And some notable actors: " + response.data.Actors);
        }
    )
}

function bandsInTownLiri (artistLength) {
    artist = artistLength
    var concertUrl = "https://rest.bandsintown.com/artists/" + artist.trim() + "/events?app_id=codingbootcamp";
    var count = 0;
    console.log("\nNow listing coming shows:\n")
    axios.get(concertUrl).then(
    function logResults(response){
        if(0 == response.data.length){
            console.log("This artist doesn't have any upcoming shows. Must not be very good! :p")
        }
        if(count < response.data.length){
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

function spotifyLiri(songLength) {
            song = songLength
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

if(process.argv[2] == "do-what-it-says"){
fs.readFile("random.txt", "utf8", function(error, data) {

  if (error) {
    return console.log(error);
  }

  var dataArr = data.split(",");

  if (dataArr[0] == "spotify-this-song"){
      var songLength = ""
      for(i = 1; i < dataArr.length; i++){
          songLength = songLength + dataArr[i]
  }
  spotifyLiri(songLength)
}

if (dataArr[0] == "concert-this"){
    var artistLength = ""
    for(i = 1; i < dataArr.length; i++){
        artistLength = artistLength + dataArr[i]
}
bandsInTownLiri(artistLength)
}

if (dataArr[0] == "movie-this"){
    var movieLength = ""
    for(i = 1; i < dataArr.length; i++){
        movieLength = movieLength + dataArr[i]
}
omdbLiri(movieLength)
}

});
}




 