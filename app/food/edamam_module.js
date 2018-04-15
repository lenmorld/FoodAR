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
                Utils.smartLog(["[edamam_api_calls]", data]);

                if (data.parsed[0]) {
                    success_callback(data.parsed[0].food.uri);
                } else {
                    failure_callback(previousKeyword, "no nutrition info found on food [edamam 1]");
                }
            },
            error : function(xhr, status, exception){
                Utils.smartLog(["[edamam_api_calls]", status + " " + exception]);
                failure_callback(status + " " + exception);
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

                // Utils.smartLog("[edamam_api_calls]", json_data);

                // totalNutrients is what we need
                // check if at least one of the required nutrients is in the result object

                Utils.debug("[processing nutrient fetch json_data]");

                if (Object.keys(json_data.totalNutrients).length) {
                    // debugger;

                    Utils.debug("[checking total nutrients]");

                    /*
                        disable this check for now, its better to have the calling function decide
                        on which nutrients to display
                     */

                    // var requiredNutrientsReturned = Utils.getCommon(Object.keys(json_data.totalNutrients), nutrientsForDisplay);

                    // if (requiredNutrientsReturned.length) {
                        success_callback(json_data);
                    // } else {
                    //     failure_callback(previousKeyword, "No nutrient info found for food");
                    // }

                } else {
                    failure_callback(previousKeyword, "No match in nutrient database [edamam 2]");
                }
            },
            error : function(xhr, status, exception){
                Utils.smartLog(["[edamam_api_calls]", status + " " + exception]);
                failure_callback(previousKeyword, status + " " + exception);
            }
        });
    }

    // expose functions and objects here
    return {
        foodSearch: foodSearch,
        nutrientsFetch: nutrientsFetch
    }

}();


