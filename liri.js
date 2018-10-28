require('dotenv').config()
var moment = require('moment');
var Spotify = require('node-spotify-api');
var request = require('request');
var keys = require("./keys.js")
var fs = require('fs');


var searchItem = process.argv.slice(3).join("+");

var command = process.argv[2]

var spotify = new Spotify(keys.spotify);


var movieUrl = "http://www.omdbapi.com/?t=" + searchItem + "&y=&plot=short&apikey=trilogy";

var bandsUrl = "https://rest.bandsintown.com/artists/" + searchItem + "/events?app_id=codingbootcamp";

fs.appendFile('log.txt', "\r\n"+command+" "+searchItem, function (err) {
    if (err) throw err;
  });

var run = function(){
    switch(command){
        case `concert-this`:
            request(bandsUrl, function(error,response,body){
                if(!error && response.statusCode === 200){
                    console.log("\r\nVenue: "+JSON.parse(body)[0].venue.name)
                    console.log("Location: "+JSON.parse(body)[0].venue.city)
                    console.log("Date: "+moment(JSON.parse(body)[0].datetime).format("MM-DD-YYYY"))
                }else{
                    console.log("\r\nNo results found. Please try another search term")
                }
            })

            break;
        case `spotify-this-song`:
            spotify.search({ type: 'track', query: searchItem }, function(err, data) {
                if (err) {
                return console.log("\r\nNo results found. Please try another search term");
                }
            var results = data.tracks.items[0]
            // console.log(results)
            var a = ""
            for(i=0;i<results.artists.length;i++){
                a += (results.artists[i].name+" ")
            };
            console.log("\r\nArtist(s): "+a)
            console.log("Song Title: "+results.name)
            console.log("Link: "+results.preview_url) 
            console.log("Album: "+results.album.name)
            });

            break;
        case `movie-this`:
            request(movieUrl, function(error, response, body){
                if(!error && response.statusCode === 200){
                    console.log("\r\nTitle: " + JSON.parse(body).Title)
                    console.log("Year: " + JSON.parse(body).Year)
                    console.log("IMDB Rating: " + JSON.parse(body).imdbRating)
                    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value)
                    console.log("Country: " + JSON.parse(body).Country)
                    console.log("Plot: " + JSON.parse(body).Plot)
                    console.log("Actors: " + JSON.parse(body).Actors)
                }else{
                    console.log("\r\nNo results found. Please try another search term")
                }
            })    

            break;
        case `do-what-it-says`:
            fs.readFile('./random.txt','utf8', function(err, data) {
                if(err) throw err;
                var array = data.split(",");
                searchItem = array[1]
                command = array[0]
                run()
            });

            break;
        default:
            console.log("\r\nnot a valid command")
    }
}

run()