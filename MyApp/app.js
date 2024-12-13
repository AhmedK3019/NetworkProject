var express = require('express');
var path = require('path');
var app = express();
var session = require('express-session');

//MongoDB connection
var { MongoClient } = require('mongodb');
var url = 'mongodb://127.0.0.1:27017';
var client = new MongoClient(url);
//added the database and collection here to make it easier to access, instead of having to write it in every app.post function
var db = client.db("myDB");
var collection = db.collection("myCollection");

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//session to store the user's username
app.use(session({
    secret: 'averylongrandomstring',
    resave: false,
    saveUninitialized: true
}));

//function for making sure the user is logged in before accessing any pages
function isLoggedIn(req, res, next) {
    if (req.session.loggedIn) {
        return next();
    }
    res.redirect('/');
}
});

app.listen(3000);