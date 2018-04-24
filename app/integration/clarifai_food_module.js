
/*
    singleton pattern for modular ES5 JS
    can avoid IIFE at the end, so it will become constructor
 */

var ClarifaiFoodModule = function () {

    var PREVIOUS_CLARIFAI_KEYWORD_RESULTS = {};

    /*
        if edamam fails - food uri fetch or nutrient fetch, fallback to next best keyword, and redo processing
     */
    function nutrientFetchFailureFallback(failedKeyword) {
        // filter PREVIOUS_CLARIFAI_KEYWORD_RESULTS
        // and remove keyword that failed nutrients processing

        var fallbackKeywordsFoodModel = PREVIOUS_CLARIFAI_KEYWORD_RESULTS.food.filter(function(e) { return e.name !== failedKeyword});
        var fallbackKeywordsGeneralModel = PREVIOUS_CLARIFAI_KEYWORD_RESULTS.general.filter(function(e) { return e.name !== failedKeyword});

        Utils.debug("using fallback keyword set...");

        var fallbackKeywordSet = {
            general: fallbackKeywordsGeneralModel,
            food: fallbackKeywordsFoodModel
        };

        processKeywords(fallbackKeywordSet);
    }

    function processKeywords(words) {

        Utils.smartLog(["searching food item..."]);
        if (words.error) {
            Utils.errorHandler("Clarifai API error: " + words.error, 2000);
        }

        // DEEP COPY {words} object here
        PREVIOUS_CLARIFAI_KEYWORD_RESULTS = $.extend(true, {}, words);

        // *** DOC: FUTURE.md > CLARIFAI_FOOD_MODULE *** //

        if (DEV_MODE) {
            var text = "";

            // get top 5
            for (var index = 0; index < KEYWORD_LIMIT; index++) {
                var food_result = words.food[index].name + ":" + words.food[index].value;
                // var food_result = words.food[index].name;
                text += food_result + " ";
            }
            Utils.debug(text);
        }

        // get first item
        if (words.food.length > 0) {
            var searchNutritionString = words.food[0].name;

            // PATCH 4-23-2018
            if (GENERAL_TO_SPECIFIC.includes(searchNutritionString)) {
                // if general term like "vegetable" or "fruit", try next specific item
                nutrientFetchFailureFallback(searchNutritionString);
            } else {

                // food item specific enough
                ViewModule.updateFoodItemNameView(searchNutritionString);

                // get nutrition info
                EdamamModule.foodSearch(searchNutritionString, FoodHelperModule.foodSearchSuccess, FoodHelperModule.foodSearchFailure);
            }


        } else {
            Utils.errorHandler("Clarifai API Error words.food empty", 2001);
        }
    }


    return {
        processKeywords: processKeywords,
        nutrientFetchFailureFallback: nutrientFetchFailureFallback
    }
}();