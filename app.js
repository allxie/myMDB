var express = require("express");
var app = express();
var request = require("request");

app.set("view engine", "ejs");


app.get("/", function(req, res){
	res.render("index", {title : "My title"});
});

app.use(express.static("public"));

//use either of these routes to execute search. 
//This one has single path, but onto that path will be 
//path: http://localhost:3000/movie?idmbID=<someid>
//this way is prefered...? other is slightly plageristic 
// app.get("/movie", function(req,res){
// 	var imdbID = req.query.imdbID;
// 	request(Put API request here for imdb, function(){
// 	})
// })
//this path would be http://localhost:3000/movie/<someimdbid>
// app.get("/movie/:imbdID", funciton(req,res){
// 	var imdbID = req.params.imdbID;
// 	request(API request using req.params.imdbID, function(req, res){

// 	})
// })

//renders search page, and then puts your search results on the page.
app.get("/search", function(req, res){
	var movieSearch = req.query.q;
	if (!movieSearch) {
		res.render("search", {movies: [], noMovie: true });
	} else {
		var url = "http://www.omdbapi.com?s="+movieSearch;
		request(url, function(err, resp, body) {
			if(!err && res.statusCode === 200) {
				var jsonData = JSON.parse(body);
				if (!jsonData.Search) {
					res.render("search", {movies: [], noMovie: true});
				} else {
					console.log("\n\n\n\n\n THIS JASON DATA", jsonData);
					res.render("search", {movies: jsonData.Search, noMovie: true});
				}
			}
		});
	}
	
});
//displays a specific movie
app.get("/movie", function(req, res){
	var imdbID = req.query.imdbID;
	var url = "http://www.omdbapi.com?i="+imdbID;
	request(url, function(err, resp,body){
		if(!err && res.statusCode ===200){
			var jsonData = JSON.parse(body);
		res.render("movie", {movie : {movie : jsonData}});
		}
	})
	
})
app.listen(3000, function(){
	console.log("I'm listening");
});



