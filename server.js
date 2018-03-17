const express = require('express');
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const favicon = require('serve-favicon');

// serve all
const APP_DIR = path.join(__dirname, "app");

const router = express.Router();
const request = require('request');

const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(favicon(__dirname + '/favicon.ico'));

app.use(express.static(APP_DIR));


app.get('/', function (req, res) {
    // res.json('data": {"name": "lenny"}');

    // serve HTML files

    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/ar', function (req, res) {
    // res.json('data": {"name": "lenny"}');

    // serve HTML files

    res.sendFile(path.join(APP_DIR, "index2.html"));

    // res.sendFile(path.join(__dirname + '/index2.html'));
});

app.get('/food', function (req, res) {

    var EDAMAM_APP_ID = "2abaf7e9";
    var EDAMAM_APP_KEY = "46bc3f1de63bac5841f9a1c211cdec59";

    var search_query = "butter";

    // https://api.edamam.com/api/food-database/parser?ingr=butter&app_id=2abaf7e9&app_key=46bc3f1de63bac5841f9a1c211cdec59&page=0

    var food_search_URL = "https://api.edamam.com/api/food-database/parser?ingr=" + search_query +
        "&app_id="+ EDAMAM_APP_ID + "&app_key=" + EDAMAM_APP_KEY + "&page=0";


    var options = {
        url: food_search_URL,
        // headers: {
        //     'Authorization': 'Bearer ' + spotify.access_token
        // },
        json: true
    };

    request.get(options, function (error, response) {
        // res.json(JSON.stringify(response.body));
        res.json(response.body);
    });
});


// app.use('/edamam', require('./api/edamam'));

app.listen(port, function () {
    console.log("Node-express server is running at ", port);
});