/*
    execute this when document ready
 */
$(function() {
    // $('h2').html("he");
    // ClarifaiModule.predictUsingWorkflow();
    // EdamamModule.foodSearch();

    console.log(FOOD_ITEM_VIEW);
    console.log(LOGS_VIEW);

    console.log(Utils.round(12.34));
    console.log(EdamamModule);
    console.log(FoodHelperModule);

    FOOD_ITEM_VIEW.innerHTML = Utils.round(12.34);

    ArWebModule.startAR();

});

