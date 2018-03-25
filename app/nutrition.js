// var searchString = "banana";

var FOOD_ITEM_VIEW = document.getElementById('food_item');
var NUTR_INFO_VIEW = document.getElementById('nut_info');
var LOGS_VIEW = document.getElementById('logs');
var DEBUG_VIEW = document.getElementById('debug');


// food item search
function food_search_success(foodItemUri) {

    console.log("success: ", foodItemUri);
    console.log("invoking nutrients fetch ");


    DEBUG_VIEW.innerHTML = "[food_search_success]" + foodItemUri;
    LOGS_VIEW.innerHTML = "fetching nutrition info...";

    nutrients_fetch(foodItemUri, nutrients_fetch_success, nutrients_fetch_failure);
}

function food_search_failure(msg) {
    console.log("failure: ", msg);

    DEBUG_VIEW.innerHTML += "[food_search_failure]" + msg;
}


// nutrient search
function nutrients_fetch_success(nutrientsInfo) {

    console.log("success: ", nutrientsInfo);
    DEBUG_VIEW.innerHTML = "[nutrient_fetch_success]";
    prepareNutrientsView(nutrientsInfo);
}

function nutrients_fetch_failure(msg) {
    console.log("failure: ", msg);
    DEBUG_VIEW.innerHTML += "[nutrients_fetch_failure]" + msg;
}

function round(decimal) {
    return Math.round(decimal * 100) / 100;
}

function renderNutritionAR(nutrientsObj) {

    var html = "";

    LOGS_VIEW.innerHTML = "rendering...";

    for (var key in nutrientsObj) {
        if (nutrientsObj.hasOwnProperty(key)) {
            console.log(key, nutrientsObj[key]);

            var item = nutrientsObj[key];
            html += ["<p>", item.name, ": ", item.daily, " ", item.quantity, "</p>"].join("");
        }
    }

    // SUCCESS!!!

    NUTR_INFO_VIEW.innerHTML += html;
    DEBUG_VIEW.innerHTML = "=D";
    LOGS_VIEW.innerHTML = "done! press analyze again...";

    $("#img_captured").show();          // show top-right captured image
}


// process nutrients for display
function prepareNutrientsView(nutrientsInfo) {

    var nutrients_for_display = ['CHOCDF', 'ENERC_KCAL', 'FAT', 'FIBTG', 'PROCNT'];

    var total_daily = nutrientsInfo.totalDaily;
    var total_quantity = nutrientsInfo.totalNutrients;

    var nutrientsObj = {};

    for(var i=0; i< nutrients_for_display.length; i++) {
        var nutrient = nutrients_for_display[i];

        // {label: "Carbs", quantity: 8.808626666666665, unit: "%"}
        // {label: "Carbs", quantity: 26.425879999999996, unit: "g"}

        var total_daily_nutrient = total_daily[nutrient];
        var total_quantity_nutrient = total_quantity[nutrient];

        if (!nutrientsObj[nutrient]) {
            nutrientsObj[nutrient] = {};
        }

        var total_daily_string = [round(total_daily_nutrient.quantity), total_daily_nutrient.unit].join(" ");
        var total_quantity_string = [round(total_quantity_nutrient.quantity), total_quantity_nutrient.unit].join(" ");

        nutrientsObj[nutrient]["daily"] = total_daily_string;
        nutrientsObj[nutrient]["quantity"] = total_quantity_string;
        nutrientsObj[nutrient]["name"] = total_daily_nutrient.label;

        // can also get official Food Item info from nutrientsInfo.nutrientsInfo.ingredients[0].parsed[0]
        // console.log(searchString);
        // console.log(total_daily_string);
        // console.log(total_quantity_string);
    }

    console.log(nutrientsObj);

    renderNutritionAR(nutrientsObj);
}

// $(document).ready(function(){
//     $("button").click(function(){
//         food_search(searchString, food_search_success, food_search_failure);
//     });
// });