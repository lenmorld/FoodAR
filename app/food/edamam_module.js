/*
    singleton pattern for modular ES5 JS
    can avoid IIFE at the end, so it will become constructor
 */

var EdamamModule = function () {
    function foodSearch(searchString, success_callback, failure_callback) {

        $.ajax({
            url: '/foodapi/search',
            contentType: 'application/json',
            data: JSON.stringify({"query": searchString}),
            type: 'POST',
            success: function (data) {
                console.log("[edamam_api_calls]", data);

                if (data.parsed[0]) {
                    success_callback(data.parsed[0].food.uri);
                } else {
                    failure_callback("unknown food item");
                }

            },
            error : function(xhr, status, exception){
                console.log("[edamam_api_calls]", status + " " + exception);
                failure_callback(status + " " + exception);
            }
        });
    }

    function nutrientsFetch(foodItemURI, nutrientsForDisplay, success_callback, failure_callback) {

        $.ajax({
            url: '/foodapi/nutrients',
            contentType: 'application/json',
            data: JSON.stringify({"food_item_uri": foodItemURI}),
            type: 'POST',
            success: function (data) {

                var json_data = JSON.parse(data);

                // console.log("[edamam_api_calls]", json_data);

                // totalNutrients is what we need
                // check if at least one of the required nutrients is in the result object

                DEBUG_VIEW.innerHTML = "[processing nutrient fetch json_data]";

                if (json_data.totalNutrients) {

                    DEBUG_VIEW.innerHTML = "[checking total nutrients]";

                    var requiredNutrientsReturned = Utils.getCommon(Object.keys(json_data.totalNutrients), nutrientsForDisplay);

                    if (requiredNutrientsReturned.length) {
                        success_callback(json_data);
                    } else {
                        failure_callback("No nutrient info found for food");
                    }

                } else {
                    failure_callback("No match in nutrient database");
                }

            },
            error : function(xhr, status, exception){
                console.log("[edamam_api_calls]", status + " " + exception);
                failure_callback(status + " " + exception);
            }
        });
    }

    // expose functions and objects here
    return {
        foodSearch: foodSearch,
        nutrientsFetch: nutrientsFetch
    }

}();


