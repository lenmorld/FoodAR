
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

        // NUTR_INFO_VIEW.innerHTML = "";
        ViewModule.updateNutritionInfoView("");

        Utils.smartLog(["searching food item..."]);

        if (words.error) {
            Utils.smartLog([words.error]);
        }

        // DEEP COPY {words} object here
        PREVIOUS_CLARIFAI_KEYWORD_RESULTS = $.extend(true, {}, words);

        // Utils.smartLog("common:", Utils.getCommon(words.food, words.general, "name"));

        // get possible food_servings from both models
        var food_servings = Utils.getCategoryKeywords(words.food, FOOD_SERVINGS_LIST);
        food_servings.concat(Utils.getCategoryKeywords(words.general, FOOD_SERVINGS_LIST));

        // get possible recipe keywords from GENERAL model
        var recipe_keywords = Utils.getCategoryKeywords(words.general, RECIPES_KEYWORD_LIST);

        // TODO: sett SIMPLE_TODO.md for details

        // if (recipe_keywords.length > 0) {
        //     Utils.smartLog(["recipe keywords..."]);
        //     // TODO: get recipe using Edamam API
        //         // formulate request by getting (all 20 or just a few?) items from words.food
        // } // else if


        /*
            first prototype: as simple as possible
            1 basic use case of food recognition
            try to get food serving keywords frmo Clarifai (limited list)
            and fetch nutrition, if fail try next keyword on list
         */

        if (food_servings.length > 0) {
            Utils.smartLog(["food servings:", food_servings]);

            // e.g. 'fruit salad'
            // we don't want to individually get nutrition of strawberry, berry, etc.
            // if food serving is found, this is priority instead of individual food items
            // look this up

            // display first one (#1 result)
            var foodItemResult = food_servings[0].name;

            // FOOD_ITEM_VIEW.innerHTML = foodItemResult;       // # display food item result
            ViewModule.updateFoodItemNameView(foodItemResult);

            var searchNutritionString = foodItemResult;          // # search for nutrition info

            // get nutrition info
            EdamamModule.foodSearch(searchNutritionString, FoodHelperModule.foodSearchSuccess, FoodHelperModule.foodSearchFailure);

        } else {
            // case 3

            Utils.smartLog(["regular single/multiple food item..."]);

            var text = "";
            var searchNutritionString = '';

            // get top 5
            for (var index = 0; index < KEYWORD_LIMIT; index++) {
                var food_result = words.food[index].name + ":" + words.food[index].value;
                // var food_result = words.food[index].name;
                text += food_result + " ";
            }

            DEBUG_VIEW.innerHTML = text;

            // get first item
            if (words.food.length > 0) {
                var foodItemResult = words.food[0].name;
                // FOOD_ITEM_VIEW.innerHTML = foodItemResult;        // # display food item result
                ViewModule.updateFoodItemNameView(foodItemResult);
                searchNutritionString = foodItemResult;          // # search for nutrition info


                // get nutrition info
                EdamamModule.foodSearch(searchNutritionString, FoodHelperModule.foodSearchSuccess, FoodHelperModule.foodSearchFailure);
            } else {
                ViewModule.updateNutritionLabelView("Try again!");
            }
        }
    }


    return {
        processKeywords: processKeywords,
        nutrientFetchFailureFallback: nutrientFetchFailureFallback
    }
}();