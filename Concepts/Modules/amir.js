var movies = require('./movies');

var amirMovies = movies();

amirMovies.favMovie = "Good Will Hunting";

console.log("amir's favorite movie is: " + amirMovies.favMovie);