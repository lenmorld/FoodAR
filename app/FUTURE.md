       ## FUTURE_CLARIFAI_FOOD_MODULE

        // Utils.smartLog("common:", Utils.getCommon(words.food, words.general, "name"));

        // ### FOOD SERVINGS ###
        // get possible food_servings from both models
        // var food_servings = Utils.getCategoryKeywords(words.food, FOOD_SERVINGS_LIST);
        // food_servings.concat(Utils.getCategoryKeywords(words.general, FOOD_SERVINGS_LIST));

        // ### RECIPE ###
        // get possible recipe keywords from GENERAL model
        // var recipe_keywords = Utils.getCategoryKeywords(words.general, RECIPES_KEYWORD_LIST);

        /*
            first prototype: as simple as possible
            1 basic use case of food recognition
            try to get food serving keywords from Clarifai (limited list)
            and fetch nutrition, if fail try next keyword on list (nutrientFetchFailureFallback)
         */

        // if (food_servings.length > 0) {
        //     Utils.smartLog(["food servings:", food_servings]);
        //
        //     // e.g. 'fruit salad'
        //     // we don't want to individually get nutrition of strawberry, berry, etc.
        //     // if food serving is found, this is priority instead of individual food items
        //     // look this up
        //
        //     // display first one (#1 result)
        //     var foodItemResult = food_servings[0].name;
        //
        //     // FOOD_ITEM_VIEW.innerHTML = foodItemResult;       // # display food item result
        //     ViewModule.updateFoodItemNameView(foodItemResult);
        //
        //     var searchNutritionString = foodItemResult;          // # search for nutrition info
        //
        //     // get nutrition info
        //     EdamamModule.foodSearch(searchNutritionString, FoodHelperModule.foodSearchSuccess, FoodHelperModule.foodSearchFailure);
        //
        // } else

        // PROTOTYPE 1: basic use case, 1 single food item, no recipe, no food servings
        // Utils.smartLog(["regular single/multiple food item..."]);


        ## TESTING ##

                // Utils.smartLog(['getUserMedia() is not supported in your browser']);
                // DEBUG_VIEW.innerHTML = 'running app in desktop browser testing mode...';

                // var searchString = "tea";

                // var image = 'http://del.h-cdn.co/assets/17/26/980x490/landscape-1498854508-delish-mimosa-fruit-salad-3.jpg';

                //tea
                // image = 'https://img-new.cgtrader.com/items/35108/c57508cfd2/china-tea-cup-and-saucer-3d-model-obj.jpg';

                // var image = 'https://img-new.cgtrader.com/items/35108/c57508cfd2/china-tea-cup-and-saucer-3d-model-obj.jpg';
                // StateModule.duringCapture();
                // ClarifaiModule.predictUsingWorkflow(image, 10, 0.90, ClarifaiFoodModule.processKeywords);


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
                // $("#btn-analyze").click(function() {
                    // ClarifaiModule.predictUsingWorkflow(image, 10, 0.90, ClarifaiFoodModule.processKeywords);
                    // // EdamamModule.foodSearch(searchString, FoodHelperModule.foodSearchSuccess, FoodHelperModule.foodSearchFailure);
                // });