/*
    singleton pattern for modular ES5 JS
    can avoid IIFE at the end, so it will become constructor
 */

var FoodHelperModule = function () {
// food item search
    function foodSearchSuccess(foodItemUri) {

        Utils.smartLog(["success: ", foodItemUri]);
        Utils.smartLog(["fetching nutrition info..."]);

        Utils.debug("[edamam_food_search_success]" + foodItemUri);

        EdamamModule.nutrientsFetch(foodItemUri, nutrientsFetchSuccess, nutrientsFetchFailure);
    }

    function foodSearchFailure(failedKeyword, msg) {
        Utils.smartLog(["edamam_food_search_failure: ", msg]);
        Utils.errorHandler(4000);
        Utils.debug("[edamam_food_search_failure]" + msg);

        // call fallback method on integration module
        ClarifaiFoodModule.nutrientFetchFailureFallback(failedKeyword);
    }


// nutrient search
    function nutrientsFetchSuccess(nutrientsInfo) {
        Utils.smartLog(["success: ", nutrientsInfo]);
        Utils.debug("[nutrient_fetch_success]");
        prepareNutrientsView(nutrientsInfo);
    }

    function nutrientsFetchFailure(failedKeyword, msg) {
        Utils.smartLog(["[edamam_nutrients_fetch_failure]: ", failedKeyword, msg]);
        Utils.debug("[nutrients_fetch_failure] " + failedKeyword + " " + msg);
        Utils.errorHandler(4001);

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

        Utils.debug("=D");
        Utils.smartLog(["done! press analyze again..."]);

        ViewModule.updateNutritionInfoView(nutInfoStringList);

        // uncomment to enable Image capture on right hand side,
        // not needed when AR content
        /*
        IMAGE_CAPTURED_THUMB.attr('src', PREV_IMAGE_THUMBNAIL);
        IMAGE_CAPTURED.show();          // show top-right captured image
        */
    }


    function getCommonDesiredNutrientsList(desiredList, neededItems, totalDaily, totalQuantity) {

        var nutrientsObj = {};
        var collected = 0;

        for(var i=0; i< desiredList.length; i++) {
            var nutrient = desiredList[i];

            // {label: "Carbs", quantity: 8.808626666666665, unit: "%"}
            // {label: "Carbs", quantity: 26.425879999999996, unit: "g"}

            try {
                if (totalDaily[nutrient]) {     // totalDaily is more important since it's more useful to user
                    var total_daily_nutrient = totalDaily[nutrient];
                    var total_quantity_nutrient = totalQuantity[nutrient];

                    if (!nutrientsObj[nutrient]) {
                        nutrientsObj[nutrient] = {};
                    }

                    var dblDaily = Utils.round(total_daily_nutrient.quantity);
                    var dblQuantity = Utils.round(total_quantity_nutrient.quantity);

                    // if both 0, its like its not included, it shouldnt be displayed
                    // if (dblDaily === 0 && dblQuantity === 0) {
                    //     continue;
                    // }

                    var total_daily_string = [dblDaily, total_daily_nutrient.unit].join(" ");
                    var total_quantity_string = [dblQuantity, total_quantity_nutrient.unit].join(" ");

                    nutrientsObj[nutrient]["daily"] = total_daily_string;
                    nutrientsObj[nutrient]["quantity"] = total_quantity_string;
                    nutrientsObj[nutrient]["name"] = total_daily_nutrient.label;

                    collected++;

                    if (neededItems === collected) {
                        return nutrientsObj;
                    } else {

                    }

                    // can also get official Food Item info from nutrientsInfo.nutrientsInfo.ingredients[0].parsed[0]
                    // Utils.smartLog(searchString);
                    // Utils.smartLog(total_daily_string);
                    // Utils.smartLog(total_quantity_string);
                } else {
                    // if certain nutrient not available, just skip
                    continue;
                }
            }
            catch(err) {
                Utils.smartLog([err]);
                return nutrientsObj;            // dont stop when error, just return what's completed
            }
            // finally {
            //     // Utils.smartLog(nutrientsObj);
            //     // renderNutritionAR(nutrientsObj);
            // }
        }
        return nutrientsObj;
    }


// process nutrients for display
    function prepareNutrientsView(nutrientsInfo) {

        Utils.smartLog(["preparing nutrients info for rendering"]);

        var collectedNutrients = {};
        var collectedNutrientsSize;

        // var total_daily = nutrientsInfo.totalDaily;
        // var total_quantity = nutrientsInfo.totalNutrients;

        var core = getCommonDesiredNutrientsList(CORE_NUTRIENTS_FOR_DISPLAY, DESIRED_NUTRIENTS_LENGTH, nutrientsInfo.totalDaily, nutrientsInfo.totalNutrients);
        // collectedNutrients = collectedNutrients.concat(core);
        collectedNutrients = $.extend({}, collectedNutrients, core);
        collectedNutrientsSize = Object.keys(collectedNutrients).length;

        // if not enough, try adding secondary core
        if (collectedNutrientsSize < DESIRED_NUTRIENTS_LENGTH) {
            var other_core = getCommonDesiredNutrientsList(OTHER_CORE_NUTRIENTS_FOR_DISPLAY, DESIRED_NUTRIENTS_LENGTH - collectedNutrientsSize,  nutrientsInfo.totalDaily, nutrientsInfo.totalNutrients);
            // collectedNutrients = collectedNutrients.concat(other_core);
            collectedNutrients = $.extend({}, collectedNutrients, other_core);
            collectedNutrientsSize = Object.keys(collectedNutrients).length;
        }


        // if still not enough, add everything else that's there
        if (collectedNutrientsSize < DESIRED_NUTRIENTS_LENGTH) {
            var all_else = getCommonDesiredNutrientsList(ALL_ELSE, DESIRED_NUTRIENTS_LENGTH - collectedNutrientsSize  , nutrientsInfo.totalDaily, nutrientsInfo.totalNutrients);
            // collectedNutrients = collectedNutrients.concat(all_else);
            collectedNutrients = $.extend({}, collectedNutrients, all_else);
        }

        // if still not enough, not much we could do
        renderNutritionAR(collectedNutrients);
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