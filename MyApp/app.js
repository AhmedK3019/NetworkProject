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

//get and post for the login page
app.get('/', function (req, res) {
    res.render('login', { error: null });
});
//get and post for the regsitration page
app.get('/registration', function (req, res) {
    res.render('registration', { error: null });
});
//isLoggedIn added to make sure they are logged in before entering the pages below
app.get('/home', isLoggedIn, function (req, res) {
    res.render('home');
});

app.get('/annapurna', isLoggedIn, function (req, res) {
    res.render('annapurna', { message: null, success: null });
});

app.get('/bali', isLoggedIn, function (req, res) {
    res.render('bali', { message: null, success: null });
});

app.get('/cities', isLoggedIn, function (req, res) {
    res.render('cities');
});

app.get('/hiking', isLoggedIn, function (req, res) {
    res.render('hiking');
});

app.get('/inca', isLoggedIn, function (req, res) {
    res.render('inca', { message: null, success: null });
});

app.get('/islands', isLoggedIn, function (req, res) {
    res.render('islands');
});

app.get('/paris', isLoggedIn, function (req, res) {
    res.render('paris', { message: null, success: null });
});

app.get('/rome', isLoggedIn, function (req, res) {
    res.render('rome', { message: null, success: null });
});

app.get('/santorini', isLoggedIn, function (req, res) {
    res.render('santorini', { message: null, success: null });
});

app.get('/searchresults', isLoggedIn, function (req, res) {
    res.render('searchresults');
});

app.get('/wanttogo', isLoggedIn, function (req, res) {
    res.render('wanttogo');
});

});

app.listen(3000);