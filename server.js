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


// app.get('/', function (req, res) {
//     // res.json('data": {"name": "lenny"}');
//
//     // serve HTML files
//
//     res.sendFile(path.join(__dirname + '/index.html'));
// });


app.get('/', function (req, res) {
    // res.json('data": {"name": "lenny"}');
    // serve HTML files
    res.sendFile(path.join(APP_DIR, "index2.html"));
});


app.get('/food', function (req, res) {
    // res.json('data": {"name": "lenny"}');
    // serve HTML files
    res.sendFile(path.join(APP_DIR, "index.html"));
});

// Edamam Food API
app.use('/foodapi', require('./api/edamam'));


app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});