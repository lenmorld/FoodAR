/*
    singleton pattern for modular ES5 JS
    can avoid IIFE at the end, so it will become constructor
 */

var FoodHelperModule = function () {
// food item search
    function foodSearchSuccess(foodItemUri) {

        Utils.smartLog(["success: ", foodItemUri]);
        Utils.smartLog(["fetching nutrition info..."]);

        DEBUG_VIEW.innerHTML = "[food_search_success]" + foodItemUri;

        EdamamModule.nutrientsFetch(foodItemUri, NUTRIENTS_FOR_DISPLAY, nutrientsFetchSuccess, nutrientsFetchFailure);
    }

    function foodSearchFailure(msg) {
        Utils.smartLog(["failure: ", msg]);
        DEBUG_VIEW.innerHTML += "[food_search_failure]" + msg;
    }


// nutrient search
    function nutrientsFetchSuccess(nutrientsInfo) {

        Utils.smartLog(["success: ", nutrientsInfo]);
        DEBUG_VIEW.innerHTML = "[nutrient_fetch_success]";
        prepareNutrientsView(nutrientsInfo);
    }

    function nutrientsFetchFailure(failedKeyword, msg) {
        Utils.smartLog(["failure: ", failedKeyword, msg]);
        DEBUG_VIEW.innerHTML += "[nutrients_fetch_failure] " + failedKeyword + " " + msg;


        // call fallback method on integration module
        ClarifaiFoodModule.nutrientFetchFailureFallback(failedKeyword);

    }

    function renderNutritionAR(nutrientsObj) {

        var nutInfoStringList = [];

        Utils.smartLog(["rendering..."]);

        for (var key in nutrientsObj) {
            if (nutrientsObj.hasOwnProperty(key)) {
                Utils.smartLog([key, nutrientsObj[key]]);

                var item = nutrientsObj[key];
                nutInfoStringList.push([item.name, ": ", item.daily, " ", item.quantity].join(""));

                // html += ["<p>", item.name, ": ", item.daily, " ", item.quantity, "</p>"].join("");
            }
        }

        // SUCCESS!!! =D =D =D

        // NUTR_INFO_VIEW.innerHTML = html;
        ViewModule.updateFoodNutritionView(nutInfoStringList);

        DEBUG_VIEW.innerHTML = "=D";
        Utils.smartLog(["done! press analyze again..."]);

        // uncomment to enable Image capture on right hand side,
        // not needed when AR content
        /*
        IMAGE_CAPTURED_THUMB.attr('src', PREV_IMAGE_THUMBNAIL);

        IMAGE_CAPTURED.show();          // show top-right captured image
        */

        ANALYZE_BUTTON.prop('disabled', false);
    }


// process nutrients for display
    function prepareNutrientsView(nutrientsInfo) {

        Utils.smartLog(["preparing nutrients info for rendering"]);

        var nutrientsObj = {};

        try {
            var total_daily = nutrientsInfo.totalDaily;
            var total_quantity = nutrientsInfo.totalNutrients;

            // Utils.smartLog(total_daily);
            // Utils.smartLog(total_quantity);

            for(var i=0; i< NUTRIENTS_FOR_DISPLAY.length; i++) {
                var nutrient = NUTRIENTS_FOR_DISPLAY[i];

                // {label: "Carbs", quantity: 8.808626666666665, unit: "%"}
                // {label: "Carbs", quantity: 26.425879999999996, unit: "g"}

                if (total_quantity[nutrient]) {
                    var total_daily_nutrient = total_daily[nutrient];
                    var total_quantity_nutrient = total_quantity[nutrient];

                    if (!nutrientsObj[nutrient]) {
                        nutrientsObj[nutrient] = {};
                    }

                    var total_daily_string = [Utils.round(total_daily_nutrient.quantity), total_daily_nutrient.unit].join(" ");
                    var total_quantity_string = [Utils.round(total_quantity_nutrient.quantity), total_quantity_nutrient.unit].join(" ");

                    nutrientsObj[nutrient]["daily"] = total_daily_string;
                    nutrientsObj[nutrient]["quantity"] = total_quantity_string;
                    nutrientsObj[nutrient]["name"] = total_daily_nutrient.label;

                    // can also get official Food Item info from nutrientsInfo.nutrientsInfo.ingredients[0].parsed[0]
                    // Utils.smartLog(searchString);
                    // Utils.smartLog(total_daily_string);
                    // Utils.smartLog(total_quantity_string);
                } else {
                    // if certain nutrient not available, just skip
                    continue;
                }
            }
        }
        catch(err) {
            Utils.smartLog([err]);
        }
        finally {
            // Utils.smartLog(nutrientsObj);
            renderNutritionAR(nutrientsObj);
        }

    }

    // expose functions and objects here
    return {
        foodSearchSuccess: foodSearchSuccess,
        foodSearchFailure: foodSearchFailure,
        nutrientsFetchSuccess: nutrientsFetchSuccess,
        nutrientsFetchFailure: nutrientsFetchFailure,
        prepareNutrientsView: prepareNutrientsView,
        renderNutritionAR: renderNutritionAR
    }
}();