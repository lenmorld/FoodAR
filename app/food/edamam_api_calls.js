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


function nutrients_fetch(foodItemURI, success_callback, failure_callback) {

    $.ajax({
        url: '/foodapi/nutrients',
        contentType: 'application/json',
        data: JSON.stringify({"food_item_uri": foodItemURI}),
        type: 'POST',
        success: function (data) {

            var json_data = JSON.parse(data);

            console.log("[edamam_api_calls]", json_data);

            // totalNutrients is what we need
            if (json_data.totalNutrients) {
                success_callback(json_data);
            } else {
                failure_callback("failed to get nutrients");
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