/*
    execute this when document ready
 */
$(function() {
    function testing() {

        DEV_MODE = true;

        Utils.smartLog(['getUserMedia() is not supported in your browser']);
        DEBUG_VIEW.innerHTML = 'running app in desktop browser testing mode...'

        var searchString = "beer";

        // add button listener
        ANALYZE_BUTTON.click(function() {
            EdamamModule.foodSearch(searchString, FoodHelperModule.foodSearchSuccess, FoodHelperModule.foodSearchFailure);
        });
    }

    function buttonFunc() {
        DEBUG_VIEW.innerHTML = "capture true";

        // captureFoodItem = true;
        ArWebModule.setCaptureFoodItem(true);
        ANALYZE_BUTTON.prop('disabled', true);       // analyze while processing
    }

    function analyzeObject(canvasObj) {

        // captureFoodItem = false;
        ArWebModule.setCaptureFoodItem(false);
        DEBUG_VIEW.innerHTML = "capture false";
        Utils.smartLog(["Capturing food item..."]);

        // convert webGL image to base64 representation
        var dataURL = canvasObj.toDataURL();
        var base64img = dataURL.split("base64,")[1];
        PREV_IMAGE_THUMBNAIL = dataURL;

        // predictUsingWorkflow(image, maxConcepts, minConfidence, successCallback)
        ClarifaiModule.predictUsingWorkflow({base64: base64img}, 10, 0.90, processKeywords);
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

        // Utils.smartLog("common:", Utils.getCommon(words.food, words.general, "name"));

        var food_servings = Utils.getFoodServings(words.food);
        food_servings.concat(Utils.getFoodServings(words.general));

        // Display in AR
        // TODO: look for common concepts (or know needed concepts and look for them)
        // to check for 'accuracy'
//                var food_result_0 = results[0].name + "_" + results[0].value;

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

    //####################################################

    // Utils.smartLog(FOOD_ITEM_VIEW);
    // Utils.smartLog(LOGS_VIEW);
    //
    // Utils.smartLog(Utils.round(12.34));
    // Utils.smartLog(EdamamModule);
    // Utils.smartLog(FoodHelperModule);

    FOOD_ITEM_VIEW.innerHTML = Utils.round(12.34);

    if (ArWebModule.checkArBrowser()) {
        ArWebModule.startAR(analyzeObject, testing);

        // add button listener
        ANALYZE_BUTTON.click(function() {
            buttonFunc();
        });

    } else {
        testing();
    }





});

