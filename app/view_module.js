
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


    /*
        banana                      0.50
                                                0.15 3d text height - FoodItemName
        carbs = 10 % 100 g          0.35        0.10 3d text height - NutirionInfo
        ...                         0.25
        ...


     */

    var ARfoodItemNameYposition = 0.50;       // make it close to the top, to give space for the NutritionInfo
    // 0.25, a bit higher than middle, 0 is middle

    var ARfoodItemNameSize = 0.012;
    var ARfoodItemNameHeight = 0.012;

    var ARnutritionInfoYposition = ARfoodItemNameYposition - 0.15;      // start NutritionInfo at 0.35

    var ARnutritionInfoItemSize = 0.006;
    var ARnutritionInfoItemHeight = 0.006;
    var ARnutritionInfoItemYoffset = 0.10;              // give each item 0.10 space





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
        ArWebModule.addArText(foodItemName, ARfoodItemNameSize, ARfoodItemNameHeight, ARfoodItemNameYposition);
    }

    function updateFoodNutritionView(nutInfoStringList) {

        var nutritionInfoHTML = "";
        // AR 3d text must be renderd indiv. with proper offset Y so they would stack
        // up properly in screen

        for (var i=0; i < nutInfoStringList.length; i++) {
            // render for HTML
            nutritionInfoHTML += ["<p>", nutInfoStringList[i], "</p>"].join("");

            // FoodItemName is at 0.5, give
            // start at 0.35, then go down with 0.10 increments

            // calculate offset based on current index
            var Yoffset = ARnutritionInfoYposition - (i*ARnutritionInfoItemYoffset);
            ArWebModule.addArText(nutInfoStringList[i], ARnutritionInfoItemSize, ARnutritionInfoItemHeight, Yoffset);
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