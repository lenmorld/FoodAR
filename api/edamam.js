const express = require('express');
const router = express.Router();
const request = require('request');


router.get('/food', function (req, res) {


    // https://api.edamam.com/api/food-database/parser?ingr=butter&app_id=2abaf7e9&app_key=46bc3f1de63bac5841f9a1c211cdec59&page=0
    res.json({"data": "lenny" });

});

