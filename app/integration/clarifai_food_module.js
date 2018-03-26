
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

        // get possible food_servings from both models
        var food_servings = Utils.getCategoryKeywords(words.food, FOOD_SERVINGS_LIST);
        food_servings.concat(Utils.getCategoryKeywords(words.general, FOOD_SERVINGS_LIST));

        // get possible recipe keywords from GENERAL model
        var recipe_keywords = Utils.getCategoryKeywords(words.general, RECIPES_KEYWORD_LIST);

        // TODO: look for common concepts (or know needed concepts and look for them)
        // to check for 'accuracy': var food_result_0 = results[0].name + "_" + results[0].value;

        /*
            3 cases for now

            1. if recipe keyword found in GENERAL model, get all ingredients from FOOD model
            2. if food serving keyword found in either of the models, search that food serving
            3. either get nutrients info of top item, or top 5 if decided multiple
                TODO: must decide algorithm on deciding if multiple, based on keywords or accuracy
         */


        if (recipe_keywords.length > 0) {
            // TODO: get recipe using Edamam API

            /*
                formulate request by getting (all 20 or just a few?) items from words.food
             */


            
        }
        else if (food_servings.length > 0) {
            Utils.smartLog(["food servings:", food_servings]);

            // e.g. 'fruit salad'
            // we don't want to individually get nutrition of strawberry, berry, etc.
            // if food serving is found, this is priority instead of individual food items
            // look this up

            // display first one (#1 result)
            var foodItemResult = food_servings[0].name;

            FOOD_ITEM_VIEW.innerHTML = foodItemResult;       // # display food item result
            var searchNutritionString = foodItemResult;          // # search for nutrition info

            // get nutrition info
            EdamamModule.foodSearch(searchNutritionString, FoodHelperModule.foodSearchSuccess, FoodHelperModule.foodSearchFailure);

        } else {
            // case 3

            var text = "";
            var searchNutritionString = '';

            for (var index = 0; index < KEYWORD_LIMIT; index++) {
                var food_result = words.food[index].name + ":" + words.food[index].value;
                // var food_result = words.food[index].name;
                text += food_result + " ";
            }

            DEBUG_VIEW.innerHTML = text;    // top 5

            // TODO: sum up top 5 nutrient info if decided multiple -> find condition to decide if multipl
            // else assume individual
            // TODO: must have a way to determine multiple food items in photo (to get each one)
            // or just one item that resulted to different concepts (to get only one)

            // FOR NOW: get first item

            if (words.food.length > 0) {
                var foodItemResult = words.food[0].name;
                FOOD_ITEM_VIEW.innerHTML = foodItemResult;        // # display food item result
                searchNutritionString = foodItemResult;          // # search for nutrition info
            }

            // get nutrition info
            EdamamModule.foodSearch(searchNutritionString, FoodHelperModule.foodSearchSuccess, FoodHelperModule.foodSearchFailure);
        }


    }


    return {
        processKeywords: processKeywords,
        nutrientFetchFailureFallback: nutrientFetchFailureFallback
    }
}();