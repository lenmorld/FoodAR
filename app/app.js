/*
    execute this when document ready
 */
$(function() {
    function testing() {

        // $("#btn-analyze").show();
        // $("#btn-analyze-spinner").hide().css("animation-play-state", "paused");

        $("#btn-analyze").css("animation-play-state", "paused").css("border-bottom-color", "transparent");
        $("#button-circle").show();

        DEV_MODE = true;

        Utils.smartLog(['getUserMedia() is not supported in your browser']);
        DEBUG_VIEW.innerHTML = 'running app in desktop browser testing mode...'

        // var searchString = "tea";

        // var image = 'http://del.h-cdn.co/assets/17/26/980x490/landscape-1498854508-delish-mimosa-fruit-salad-3.jpg';

        //tea
        image = 'https://img-new.cgtrader.com/items/35108/c57508cfd2/china-tea-cup-and-saucer-3d-model-obj.jpg';

        // image = 'https://blog.restaurantscanada.org/wp-content/uploads/2015/09/Barley-Pilaf-with-Fall-Vegetables-Chicken-ingredients.jpg';  // cooking
        // image = 'https://www.familyfreshmeals.com/wp-content/uploads/2014/06/Creamy-Ranch-Pasta-Salad-Ingredients-FamilyFreshMeals.com_.png'; // preparation
        // image = 'http://www.andyboy.com/wp-content/uploads/2014/08/pasta-ingredients.jpg';      // cooking
        // image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJk_nwRQ-w98xFfaF9XzewsmNfU431PEv7Bs3P-JtdHUMFMVKb';     // cooking
        //
        // // fridge with ingredients --> cooking!
        // image = 'https://media1.popsugar-assets.com/files/thumbor/akQEIgPpxD53iljH35b-q16Sdgg/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2017/04/12/985/n/42816840/6a7e5ef858eeac84566084.76358641_edit_img_cover_file_43423029_1492023907/i/Natural-Home-Beauty-Ingredients.jpg';

        // multiple food items, non-recipe non-food serving -> 'meal'
        // image = 'https://img.grouponcdn.com/deal/aneUsttzxMyem6Mg3ro5/YX-2048x1229/v1/c700x420.jpg';

        // multiple fruits -> 'fruit'
        // image = 'https://i.ytimg.com/vi/5wit1MJ6Ohk/maxresdefault.jpg';

        // butter chickecn -> 'meal','dinner','lunch', ['cooking']!
        // image ='http://goodtoknow.media.ipcdigital.co.uk/111/000016ef4/c0e9/Butter-chicken-recipe.jpg';

        // fries -> french fries, lunch
        // image = 'https://blog.qad.com/wp-content/uploads/2016/11/Blog_11.22.2016b.jpg';

        // burger
        // image = 'http://www.designindaba.com/sites/default/files/styles/scaledlarge/public/node/news/23566/sonic-burger.jpg';

        // add button listener
        ANALYZE_BUTTON.click(function() {
            ClarifaiModule.predictUsingWorkflow(image, 10, 0.90, ClarifaiFoodModule.processKeywords);
            // $(this).css("background-color", "blue");

            // $("#btn-analyze").hide();
            // $("#btn-analyze-spinner").show().css("animation-play-state", "running");

            $("#btn-analyze").css("animation-play-state", "running").css("border-bottom-color", "lawngreen");
            $("#button-circle").hide();

            // EdamamModule.foodSearch(searchString, FoodHelperModule.foodSearchSuccess, FoodHelperModule.foodSearchFailure);
        });
    }

    function analyzeButtonClicked() {
        // first and foremost, clear all ARcontent for garbage collection
        ArWebModule.cleanARcontent();

        DEBUG_VIEW.innerHTML = "capturing...";

        // captureFoodItem = true;
        ArWebModule.setCaptureFoodItem(true);
        $("#btn-analyze").prop('disabled', true);       // analyze while processing
    }

    function analyzeObject(canvasObj) {
        // AR TEST
        // ArWebModule.addArText("lenny");

        // captureFoodItem = false;
        ArWebModule.setCaptureFoodItem(false);
        // DEBUG_VIEW.innerHTML = "capture false";
        Utils.smartLog(["Capturing food item..."]);

        // convert webGL image to base64 representation
        var dataURL = canvasObj.toDataURL();
        var base64img = dataURL.split("base64,")[1];
        // PREV_IMAGE_THUMBNAIL = dataURL;

        // predictUsingWorkflow(image, maxConcepts, minConfidence, successCallback)
        ClarifaiModule.predictUsingWorkflow({base64: base64img}, 10, 0.90, ClarifaiFoodModule.processKeywords);
    }

    //####################################################


    // ViewModule.updateFoodItemNameLabelView("FoodAR gives the nutritional value of your food!");
    // ViewModule.updateNutritionLabelView("Capture food to start");

    ViewModule.updateFoodItemNameLabelView("Food item:");
    ViewModule.updateNutritionLabelView("Nutritional Info:");


    if (ArWebModule.checkArBrowser()) {
        ArWebModule.startAR(analyzeObject, testing);

        // add button listener
        ANALYZE_BUTTON.click(function() {
            analyzeButtonClicked();
        });

    } else {
        testing();
    }


});

