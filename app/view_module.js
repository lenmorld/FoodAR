
/*
    singleton pattern for modular ES5 JS
    can avoid IIFE at the end, so it will become constructor
 */


/* all controller (and model) -> view updates should be done here
    AR, DOM
    this module then calls these other modules to render view updates

    exceptions: DEBUG and LOG
*/
var ViewModule = function () {

    var FOOD_ITEM_VIEW = document.getElementById('food_item');
    var NUTR_INFO_VIEW = document.getElementById('nut_info');

    var FOOD_ITEM_LABEL_VIEW = document.getElementById('food_item_label');
    var NUTR_INFO_LABEL_VIEW = document.getElementById('nut_info_label');


    function updateFoodItemNameLabelView(foodItemNameLabel) {
        FOOD_ITEM_LABEL_VIEW.innerHTML = foodItemNameLabel;
    }

    function updateNutritionLabelView(nutritionInfoLabel) {
        NUTR_INFO_LABEL_VIEW.innerHTML = nutritionInfoLabel;
    }

    function updateFoodItemNameView(foodItemName) {
        // can do further styling, render prep, here, etc
        FOOD_ITEM_VIEW.innerHTML = foodItemName;

        // render as AR Content to center of screen
        // 0.025, 0.025
        ArWebModule.addArText(foodItemName, 0.012, 0.012, 0.50);        // YOffset=0.25, a bit higher than middle
    }

    function updateFoodNutritionView(nutInfoStringList) {

        var nutritionInfoHTML = "";
        // AR 3d text must be renderd indiv. with proper offset Y so they would stack
        // up properly in screen

        for (var i=0; i < nutInfoStringList.length; i++) {
            // render for HTML
            nutritionInfoHTML += ["<p>", nutInfoStringList[i], "</p>"].join("");

            // start at 0.5, then go down with 0.10 increments

            // calculate offset based on current index
            var Yoffset = 0.4 - (i*0.10);     // +1 since 0 is reserved for the FoodItemName
            ArWebModule.addArText(nutInfoStringList[i], 0.006, 0.006, Yoffset);        // YOffset=0.25, a bit higher than middle
        }

        NUTR_INFO_VIEW.innerHTML = nutritionInfoHTML;

        // render as AR Content to center of screen, below the FoodItemName
    }


    return {
        updateFoodItemNameView: updateFoodItemNameView,
        updateFoodNutritionView: updateFoodNutritionView,
        updateFoodItemNameLabelView: updateFoodItemNameLabelView,
        updateNutritionLabelView: updateNutritionLabelView
    };
}();