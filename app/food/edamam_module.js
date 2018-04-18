/*
    singleton pattern for modular ES5 JS
    can avoid IIFE at the end, so it will become constructor
 */

var EdamamModule = function () {

    var previousKeyword = null;

    function foodSearch(searchString, success_callback, failure_callback) {

        previousKeyword = searchString;

        $.ajax({
            url: '/foodapi/search',
            contentType: 'application/json',
            data: JSON.stringify({"query": searchString}),
            type: 'POST',
            success: function (data) {
                if (data.parsed[0]) {
                    success_callback(data.parsed[0].food.uri);
                } else {
                    failure_callback(previousKeyword, "[edmamam_food_search_failure]", 4000);
                }
            },
            error : function(xhr, status, exception){
                failure_callback(previousKeyword, status + " " + exception, 2200);
            }
        });
    }

    function nutrientsFetch(foodItemURI, success_callback, failure_callback) {

        $.ajax({
            url: '/foodapi/nutrients',
            contentType: 'application/json',
            data: JSON.stringify({"food_item_uri": foodItemURI}),
            type: 'POST',
            success: function (data) {

                var json_data = JSON.parse(data);

                // totalNutrients is what we need, check if at least one nutrient

                if (Object.keys(json_data.totalNutrients).length) {
                    success_callback(json_data);
                } else {
                    failure_callback(previousKeyword, "[edmamam_nutrient_fetch_failure]", 4001);
                }
            },
            error : function(xhr, status, exception){
                failure_callback(previousKeyword, status + " " + exception, 2300);
            }
        });
    }

    // expose functions and objects here
    return {
        foodSearch: foodSearch,
        nutrientsFetch: nutrientsFetch
    }

}();


