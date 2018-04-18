var USDA_API_KEY = "7GC6yHh2yGElokGOBOqSkTq0GWA4Thr8yYaUBG4H";

var searh_query = "butter";
var sort = "r";         // r: relevance, n: name
//        var fg

function searchFoodNutritionBYKeyword(searh_query, callback) {

    var food_search_URL = "https://api.nal.usda.gov/ndb/search/?format=json&q=" +
        searh_query + "&sort=n&max=25&offset=0&api_key=" + USDA_API_KEY;

    $.get(food_search_URL,
        function(data, status){

            console.log(data);  // data.list.item array

            for (index in data.list.item) {
                var item = data.list.item[index];
                // $("#results").append("<p>" + item.name + "_" + item.ndbno + "</p>");

                console.log(item.name + "_" + item.ndbno);
            }

            //get first (or most relevant food item) and get nutrients

            var food_item = data.list.item[0];
            var FOOD_NDB = food_item.ndbno;

            // https://ndb.nal.usda.gov/ndb/doc/apilist/API-NUTRIENT-REPORT.md
            // group, subset, sr
            var nutrient_search_URL = "https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=" + USDA_API_KEY +
                "&nutrients=205&nutrients=204&nutrients=208&nutrients=269&ndbno=" + FOOD_NDB;

            $.get(nutrient_search_URL,
                function (data, status) {

                    // data.report.foods
                    var nutrition = data.report.foods[0];

                    var measure = nutrition.measure;

                    console.log(data.report);

                    var nutrients = nutrition.nutrients;

                    var text = "";
                    for (index in nutrients) {
                        var nut = nutrients[index];
                        text += nut.nutrient + ":" + nut.value + " " + nut.unit;
                        text += "<br/>";
                    }
                    console.log(text);

                    callback(measure + "<br>" + text);
                });
        });
}


