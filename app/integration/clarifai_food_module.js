
/*
    singleton pattern for modular ES5 JS
    can avoid IIFE at the end, so it will become constructor
 */

var ClarifaiFoodModule = function () {

    var PREVIOUS_CLARIFAI_KEYWORD_RESULTS = {};

    /*
        if nutrient fetch fails, fallback to next best keyword, and redo processing
     */
    function nutrientFetchFailureFallback(failedKeyword) {
        // filter PREVIOUS_CLARIFAI_KEYWORD_RESULTS
        // and remove keyword that failed nutrients processing

        // Utils.smartLog([PREVIOUS_CLARIFAI_KEYWORD_RESULTS]);

        var fallbackKeywordsFoodModel = PREVIOUS_CLARIFAI_KEYWORD_RESULTS.food.filter(function(e) { return e.name !== failedKeyword});
        var fallbackKeywordsGeneralModel = PREVIOUS_CLARIFAI_KEYWORD_RESULTS.general.filter(function(e) { return e.name !== failedKeyword});

        DEBUG_VIEW.innerHTML = "using fallback keyword set...";

        var fallbackKeywordSet = {
            general: fallbackKeywordsGeneralModel,
            food: fallbackKeywordsFoodModel
        };

        processKeywords(fallbackKeywordSet);
    }

    function processKeywords(words) {

        NUTR_INFO_VIEW.innerHTML = "";
        Utils.smartLog(["searching food item..."]);

        if (words.error) {
            Utils.smartLog([words.error]);
        }
        /*
            DEEP COPY {words} object here
         */
        PREVIOUS_CLARIFAI_KEYWORD_RESULTS = $.extend(true, {}, words);

        // Utils.smartLog("common:", Utils.getCommon(words.food, words.general, "name"));

        // get food_servings from both models
        var food_servings = Utils.getFoodServings(words.food);
        food_servings.concat(Utils.getFoodServings(words.general));

        // TODO: look for common concepts (or know needed concepts and look for them)
        // to check for 'accuracy': var food_result_0 = results[0].name + "_" + results[0].value;

        var searchNutritionString = "";

        if (food_servings.length > 0) {
            Utils.smartLog(["food servings:", food_servings]);

            // e.g. 'fruit salad'
            // we don't want to individually get nutrition of strawberry, berry, etc.
            // if food serving is found, this is priority instead of individual food items
            // look this up

            // display first one (#1 result)
            var foodItemResult = food_servings[0].name;

            FOOD_ITEM_VIEW.innerHTML = foodItemResult;       // # display food item result
            searchNutritionString = foodItemResult;          // # search for nutrition info

        } else {
            // look up food items, then sum up

            // TODO: determine which is better: words.food or words.general

            var text = "";

            for (var index = 0; index < KEYWORD_LIMIT; index++) {
                var food_result = words.food[index].name + ":" + words.food[index].value;
                // var food_result = words.food[index].name;
                text += food_result + " ";
            }

            DEBUG_VIEW.innerHTML = text;    // top 5

            // TODO: must have a way to determine multiple food items in photo (to get each one)
            // or just one item that resulted to different concepts (to get only one)

            // get first item for now

            if (words.food.length > 0) {
                var foodItemResult = words.food[0].name;
                FOOD_ITEM_VIEW.innerHTML = foodItemResult;        // # display food item result
                searchNutritionString = foodItemResult;          // # search for nutrition info
            }
        }

        /*
        once we use a keyword already,
        REMOVE it from the temp. memory CLARIFAI_KEYWORD_RESULTS
        so if it fails in Edamam,
        we do the same search but with next in list, and so on...
    =    */

        // get nutrition info
        EdamamModule.foodSearch(searchNutritionString, FoodHelperModule.foodSearchSuccess, FoodHelperModule.foodSearchFailure);

        // TODO: must find a condition to detect multiple food items, other than single and/or food_serving
        // then search them indiv. and sum up their nutrition

        // or when multiple just do recipe, not nutrition
    }


    return {
        processKeywords: processKeywords,
        nutrientFetchFailureFallback: nutrientFetchFailureFallback
    }
}();