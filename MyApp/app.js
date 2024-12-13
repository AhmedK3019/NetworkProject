var express = require('express');
var path = require('path');

var app = express();

var { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';
var client = new MongoClient(url);
client.connect();
var db = client.db('myDB');
//insertion test



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('login');
});

app.listen(3000);