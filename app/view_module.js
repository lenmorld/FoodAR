
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


    /*
        banana                      0.50
                                                0.15 3d text height - FoodItemName
                                                    a bit of space of margin between them
        carbs = 10 % 100 g          0.35        0.10 3d text height - NutirionInfo
        ...                         0.25
        ...


     */

    /*
    var ARfoodItemNameYposition = 0.50;       // make it close to the top, to give space for the NutritionInfo
    // 0.25, a bit higher than middle, 0 is middle

    var ARfoodItemNameSize = 0.012;
    var ARfoodItemNameHeight = 0.012;

    var ARnutritionInfoYposition = ARfoodItemNameYposition - 0.20;      // start NutritionInfo at 0.30

    var ARnutritionInfoItemSize = 0.006;
    var ARnutritionInfoItemHeight = 0.006;
    var ARnutritionInfoItemYoffset = 0.10;              // give each item 0.10 space

     */

    //
    // var ARfoodItemNameYposition = 0.45;       // make it close to the top, to give space for the NutritionInfo
    // // 0.25, a bit higher than middle, 0 is middle
    //
    // var ARfoodItemNameSize = 0.01;
    // var ARfoodItemNameHeight = 0.01;
    //
    // var ARnutritionInfoYposition = ARfoodItemNameYposition - 0.30;      // start NutritionInfo at 0.30
    //
    // var ARnutritionInfoItemSize = 0.005;
    // var ARnutritionInfoItemHeight = 0.005;
    // var ARnutritionInfoItemYoffset = 0.08;              // give each item 0.10 space


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

        // delay rendering of FoofItemName since NutritionFetch might fail

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

        // ArWebModule.render3DTextGroup(FOOD_ITEM_NAME, nutInfoStringList);

        ArWebModule.render3dArText(FOOD_ITEM_NAME, nutInfoStringList);

        // if (!nutInfoStringList.length) {
        //     return;
        // }
        //
        // // reaching this point means FoodItemName is good to go
        // // display it first, then NutritionInfo
        //
        // if (FOOD_ITEM_NAME) {
        //     ArWebModule.addArText(FOOD_ITEM_NAME, ARfoodItemNameSize, ARfoodItemNameHeight, ARfoodItemNameYposition);
        // }
        //
        // // render as AR Content to center of screen, below the FoodItemName
        //
        // // XXX remove for now in lieu of AR content
        // var nutritionInfoHTML = "";
        //
        // // AR 3d text must be renderd indiv. with proper offset Y so they would stack
        // // up properly in screen
        //
        // for (var i=0; i < nutInfoStringList.length; i++) {
        //     // XXX remove for now in lieu of AR content
        //     if (DEV_MODE) {
        //         nutritionInfoHTML += ["<p>", nutInfoStringList[i], "</p>"].join("");
        //     }
        //
        //     // FoodItemName is at 0.5, give
        //     // start at 0.35, then go down with 0.10 increments
        //
        //     // calculate offset based on current index
        //     var Yoffset = ARnutritionInfoYposition - (i*ARnutritionInfoItemYoffset);
        //     ArWebModule.addArText(nutInfoStringList[i], ARnutritionInfoItemSize, ARnutritionInfoItemHeight, Yoffset);
        // }
        //
        // // XXX remove for now in lieu of AR content
        // if (DEV_MODE) {
        //     NUTR_INFO_VIEW.innerHTML = nutritionInfoHTML;
        // }
    }


    return {
        updateFoodItemNameView: updateFoodItemNameView,
        updateNutritionInfoView: updateNutritionInfoView,
        updateFoodItemNameLabelView: updateFoodItemNameLabelView,
        updateNutritionLabelView: updateNutritionLabelView,
        setFoodItemName: setFoodItemName
    };
}();