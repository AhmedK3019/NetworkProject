var express = require('express');
var path = require('path');
var app = express();
var session = require('express-session');

//MongoDB connection
var { MongoClient } = require('mongodb');
var url = 'mongodb://127.0.0.1:27017';
var client = new MongoClient(url);
//added the database and collection here to make it easier to access, instead of having to write it in every function
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
    var successMessage = req.session.successMessage; 
    res.render('login', { error: null, successMessage: successMessage });
});

app.post('/', async function (req, res) {
    const user = req.body.username;
    const pass = req.body.password;

    try {
        await client.connect();

        const result = await collection.findOne({ username: user, password: pass });

        if (result) {
            req.session.loggedIn = { username: user };
            res.redirect('/home');
        } else {
            res.render('login', { error: "Invalid username or password" });
        }
    } catch (err) {
        console.error("Error:", err);
        res.render('login', { error: "Internal Server Error" });
    } finally {
        await client.close();
    }
});

//get and post for the regsitration page
app.get('/registration', function (req, res) {
    res.render('registration', { error: null });
});

app.post('/register', async function (req, res) {
    const user = req.body.username;
    const pass = req.body.password;

    if (!user || !pass) {
        return res.render('registration', { error: "All fields are required" });
    }

    try {
        await client.connect();

        const existingUser = await collection.findOne({ username: user });
        if (existingUser) {
            return res.render('registration', { error: "Username is already taken" });
        }

        else {
            await collection.insertOne({ username: user, password: pass });
            req.session.successMessage = 'Registration successful! Please log in.';
            res.redirect('/');
        }

    } catch (err) {
        console.error("Error during registration:", err);
        res.render('registration', { error: "Internal Server Error" });
    } finally {
        await client.close();
    }
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
    res.render('searchresults', { error: null, theResult: [] });
});

var destinationss = [ { name: "Rome", link: "/rome" }, { name: "Bali Island", link: "/bali" }, { name: "Annapurna Circuit", link: "/annapurna" }, { name: "Inca Trail to Machu Picchu", link: "/inca" }, { name: "Paris", link: "/paris" }, { name: "Santorini Island", link: "/santorini" }, ];


app.post("/search", function(req, res)  {
    var searchKey = req.body.Search.toLowerCase(); 
    
    function includesSearchKey(destination) {
        return destination.name.toLowerCase().includes(searchKey.toLowerCase());
    }
    var results = destinationss.filter(includesSearchKey);
  
    if (results.length > 0) {
      res.render("searchresults", { error: null, theResult: results });
    } else {
      res.render("searchresults", { error: "No Destination Found", theResult: null });
    }
  });


//The want to go page to view the destinations the user has added in their list (The mongoDB database)
app.get('/wanttogo', isLoggedIn, async function (req, res) {
    var user = req.session.loggedIn.username;

    try {
        await client.connect();
        var Usercheck = await collection.findOne({ username: user });
        var destinations = [];
        
        if (Usercheck && Usercheck.destinations) {
            destinations = Usercheck.destinations;
        }

        if (destinations.length === 0) {
            res.render('wanttogo', { destinations: [], error: "You have no destinations in your list" });
        }
        else {
            res.render('wanttogo', { destinations: Usercheck.destinations, error: null });
        }
    } catch (err) {
        console.error("Error during search:", err);
        res.render('wanttogo', { destinations: [], error: "Internal Server Error" });
    }
    finally {
        await client.close();
    }
});

//Function of the Add to Want to Go List Button
app.post('/wanttogo', isLoggedIn, async function (req, res) {
    var entry = req.body.destination;
    var user = req.session.loggedIn.username;

    try {
        await client.connect();
        var exists = await collection.findOne({ username: user, destinations: entry });
        if (exists) {
            return res.render(entry.toLowerCase(), { message: "Destination has already been added before", success: null });
        }
        else {
            await collection.updateOne({ username: user }, { $addToSet: { destinations: entry } });
            res.render(entry.toLowerCase(), { message: null, success: "Destination added to your list" });
        }
    }
    catch (err) {
        console.error("Error during addition:", err);
        res.render(entry.toLowerCase(), { message: "Internal Server Error", success: null });
    }
    finally {
        await client.close();
    }

});

app.listen(3000);