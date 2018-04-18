
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

    var FOOD_ITEM_NAME = null;

    function updateFoodItemNameLabelView(foodItemNameLabel) {
        if (DEV_MODE) {
            FOOD_ITEM_LABEL_VIEW.innerHTML = foodItemNameLabel;
        }
    }

    function updateNutritionLabelView(nutritionInfoLabel) {
        if (DEV_MODE) {
            NUTR_INFO_LABEL_VIEW.innerHTML = nutritionInfoLabel;
        }
    }

    function updateFoodItemNameView(foodItemName) {
        // can do further styling, render prep, here, etc

        // XXX remove for now in lieu of AR content
        if (DEV_MODE) {
            FOOD_ITEM_VIEW.innerHTML = foodItemName;
        }

        // render as AR Content to center of screen
        // ArWebModule.addArText(foodItemName, ARfoodItemNameSize, ARfoodItemNameHeight, ARfoodItemNameYposition);

        // UPDATE: delay rendering of FoodItemName since NutritionFetch might fail

        setFoodItemName(foodItemName);
    }

    function setFoodItemName(foodItemName) {
        FOOD_ITEM_NAME = foodItemName;
    }


    function updateNutritionInfoView(nutInfoStringList) {

        if (!nutInfoStringList.length || !FOOD_ITEM_NAME) {
            Utils.smartLog(["food item name or nutrition info not ready yet!"]);
            return;
        }

        // callback StateModule.afterCapture ->  after successful round, provide options for user to go back
        ArWebModule.render3dArText(FOOD_ITEM_NAME, nutInfoStringList, StateModule.afterCapture);

        if (DEV_MODE) {
            var nutritionInfoHTML = "";
            for (var i=0; i < nutInfoStringList.length; i++) {
                nutritionInfoHTML += ["<p>", nutInfoStringList[i], "</p>"].join("");
            }
            NUTR_INFO_VIEW.innerHTML = nutritionInfoHTML;
        }
    }


    return {
        updateFoodItemNameView: updateFoodItemNameView,
        updateNutritionInfoView: updateNutritionInfoView,
        updateFoodItemNameLabelView: updateFoodItemNameLabelView,
        updateNutritionLabelView: updateNutritionLabelView,
        setFoodItemName: setFoodItemName
    };
}();