var express = require("express");
var app = express();
var request = require("request");
var db = require("./models");
var bodyParser = require("body-parser");
var session = require("express-session");
var methodOverride = require("method-override");

app.set("view engine", "ejs");

//this defines req.session
//this keeps track fo cookies
app.use(session({
	secret: "secretsecret",
	resave: false,
	save: {
		uninitiialize: true
	}
}));

app.use("/", function(req, res, next){
	req.login = function(user){
		req.session.userId = user.id;
	};
	req.currentUser = function(){
		return db.User.find(req.session.userId)
						 .then(function(dbUser){
						 	  req.user = dbUser;
						 		return dbUser;
						 });
	};
	req.logout = function(){
		req.session.userId = null;
		req.user = null;
	}
	next();
});

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
	res.render("index", {title : "My title"});
});



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
					res.render("search", {movies: jsonData.Search, noMovie: false});
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
			console.log("THIS IS JSON DATA", jsonData);
		res.render("movie", {movie : {movie : jsonData}});
		}
	})
})
//USER ROUTES

app.get("/login", function(req, res){
	req.currentUser().then(function(user){
		if(user){
			res.redirect("/profile");
		} else {
			res.render("user/login");
		}
	});
});
app.get("/signup", function(req, res){
	res.render("user/signup");
});

app.post("/login", function(req, res){
	var email = req.body.email;
	var password =req.body.password;
	db.User.authenticate(email, password)
	  .then(function(dbUser){
	  	if (dbUser){
	  		req.login(dbUser);
	  	  res.redirect("/profile");
	  	} else {
	  	  res.redirect("/login");
	  	}
	  });
});

app.post("/signup", function(req, res){
	var email = req.body.email;
	var password = req.body.password;
	db.User.createSecure(email, password)
	  .then(function(user){
	  	res.redirect("/login");
	  });
});

app.get("/profile", function(req, res){
	//res.render("user/profile");
	req.currentUser().then(function(dbUser){
		if(dbUser) {
			res.render("user/profile", {ejsUser : dbUser});
		} else {
			res.redirect('/login');
		}
	});
})
//adds movie to favorites page
app.post("/favorites", function(req, res){
	var imdbID = req.body.imdbID;
	var rating = req.body.rating;

	req.currentUser().then(function(dbUser){
		if(dbUser){
			dbUser.addToFaves(db, imdbID, rating)
			.then(function(movie){
				res.send("the movie was added", + movie.imdbID);

			})
		} else {
			res.redirect("/profile");
		}
	})
})

app.delete("/login", function(req, res){
	req.logout();
	res.redirect("/login");
});




app.listen(3000, function(){
	console.log("I'm listening");
});



