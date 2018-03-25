function food_search(searchString, success_callback, failure_callback) {

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


function getCommon(arr1, arr2, attr) {
    return arr1.filter(function(e) {return (arr2.filter(function(f) {return f[attr] === e[attr] }) ).length > 0 });
}

function nutrients_fetch(foodItemURI, nutrientsForDisplay, success_callback, failure_callback) {

    $.ajax({
        url: '/foodapi/nutrients',
        contentType: 'application/json',
        data: JSON.stringify({"food_item_uri": foodItemURI}),
        type: 'POST',
        success: function (data) {

            var json_data = JSON.parse(data);

            console.log("[edamam_api_calls]", json_data);

            // totalNutrients is what we need
            // check if at least one of the required nutrients is in the result object


            if (json_data.totalNutrients) {

                var requriedNutrientsReturned = getCommon(Object.keys(json_data.totalNutrients), nutrientsForDisplay);

                if (requriedNutrientsReturned.length) {
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

//
// $.ajax({
//     url: '/foodapi/search',
//     contentType: 'application/json',
//     data: JSON.stringify({"query": searchString}),
//     type: 'POST',
//     success: function (data) {
//         console.log(data);
//
//         // data.parsed[0].food.uri
//
//         var foodItemURI = data.parsed[0].food.uri;
//
//         $.ajax({
//             url: '/foodapi/nutrients',
//             contentType: 'application/json',
//             data: JSON.stringify({"food_item_uri": foodItemURI}),
//             type: 'POST',
//             success: function (data) {
//                 console.log(JSON.parse(data));
//             },
//             error : function(httpReq,status,exception){
//                 console.log(status+" "+exception);
//             }
//         });
//
//     },
//     error : function(httpReq,status,exception){
//         console.log(status+" "+exception);
//     }
// });