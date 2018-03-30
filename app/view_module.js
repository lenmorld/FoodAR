
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

    function updateFoodItemView(foodItemName) {
        // can do further styling, render prep, here, etc
        FOOD_ITEM_VIEW.innerHTML = foodItemName;

        // render as AR Content to center of screen
        ArWebModule.addArText(foodItemName);
    }
    
    function updateFoodNutritionView(nutritionInfoText) {
        NUTR_INFO_VIEW.innerHTML = nutritionInfoText;
    }



    return {
        updateFoodItemView: updateFoodItemView,
        updateFoodNutritionView: updateFoodNutritionView
    };
}();