const express = require('express');
const router = express.Router();
const request = require('request');

const EDAMAM_APP_ID = "2abaf7e9";
const EDAMAM_APP_KEY = "46bc3f1de63bac5841f9a1c211cdec59";


router.post('/search', function (req, res) {
   const query = req.body.query;
   console.log("search: ", query);

    var food_search_URL = "https://api.edamam.com/api/food-database/parser?ingr=" + query +
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

router.post('/nutrients', function (req, res) {

    const food_item_uri = req.body.food_item_uri;
    console.log("food item: ", food_item_uri);


    // now, assuming one single food item, but could be a simple 'food serving' keyword like [fruit salad, pasta]
    // TODO: handle multiple ingredients  from multiple food items (multiple keywords from Clarifai)
    // or more complex recipe 'food serving' stuff like 'butter chicken'

    // e.g. 'butter chicken'
    // https://api.edamam.com/api/food-database/parser?ingr=butter+chicken&app_id=2abaf7e9&app_key=46bc3f1de63bac5841f9a1c211cdec59
    // results are 'butter'
    // cannot do 'recipe' to 'nutrients'
    // must go 'recipe' to [ingredient1, ingredient2, ...] to nutrients (then sum?)

    const food_items_request_body = {
        yield: 1,
        ingredients: [
            {
                quantity: 1,
                measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_unit",
                foodURI: food_item_uri
            }
        ]
    };

    console.log(JSON.stringify(food_items_request_body));

    var food_nutrients_URL = "https://api.edamam.com/api/food-database/nutrients?" +
        "&app_id="+ EDAMAM_APP_ID + "&app_key=" + EDAMAM_APP_KEY;


    console.log(food_nutrients_URL);

    // json: true  -> does not work

    var options = {
        body: JSON.stringify(food_items_request_body),
        url: food_nutrients_URL,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    request.post(options, function (error, response, body) {
        // console.log(body);   // body = response.body
        res.json(body);
    });

});


/*
{
	"yield": 1,
	"ingredients": [
		{
			"quantity": 1,
			"measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_unit",
			"foodURI": "http://www.edamam.com/ontologies/edamam.owl#Food_11529"
		}
	]
}
 */



// router.get('/foods', function (req, res) {
//
//     // res.json({"data": "lenny" });
//
//     var search_query = "butter";
//
//     // https://api.edamam.com/api/food-database/parser?ingr=butter&app_id=2abaf7e9&app_key=46bc3f1de63bac5841f9a1c211cdec59&page=0
//
//     var food_search_URL = "https://api.edamam.com/api/food-database/parser?ingr=" + search_query +
//         "&app_id="+ EDAMAM_APP_ID + "&app_key=" + EDAMAM_APP_KEY + "&page=0";
//
//     var options = {
//         url: food_search_URL,
//         // headers: {
//         //     'Authorization': 'Bearer ' + spotify.access_token
//         // },
//         json: true
//     };
//
//     request.get(options, function (error, response) {
//         // res.json(JSON.stringify(response.body));
//         res.json(response.body);
//     });
// });

module.exports = router;