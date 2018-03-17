const generalModel = Clarifai.GENERAL_MODEL;
const foodModel = "bd367be194cf45149e75f01d59f77ba7";
var workflow = "foodandgeneral";         // workflow - combined food and general


// initialize with your api key. This will also work in your browser via http://browserify.org/
const app = new Clarifai.App({
    apiKey: 'bf2c869d10754199bdb948e07ca7ab63'
});


function predictUsingWorkflow(image, maxConcepts, minPredictionValue, callback ) {

    // response.results[0].outputs
    // [0][1],... one for each model in workflow
    // data.concepts

    // config only work for indiv. models, not workflow?
    var configObject = {
      maxConcepts: maxConcepts,
      minValue: minPredictionValue
    };

    // predict the contents of an image by passing in an image
    app.workflow.predict( workflow,
        image, configObject).then(
        function(response) {
            // console.log(response);

            var general_results = response.results[0].outputs[0].data.concepts;
            var food_results = response.results[0].outputs[1].data.concepts;

            // var results = response.outputs[0].data.concepts;

            // TODO: look for common concepts (or know needed concepts and look for them)
            // to check for 'accuracy'
//                var food_result_0 = results[0].name + "_" + results[0].value;

            var results = {
              general: general_results,
              food: food_results
            };

            // console.log("results:", results);
            // return results;

            // TEST
            document.getElementById('nut_info').innerHTML = food_results[0].name;
            // TEST

            callback(results);
        },
        function(err) {
            console.error(err);

            var results = {
                error: err
            };

            // document.getElementById('image_url_3').innerHTML = err;
            return results;
        }
    );
}






function predictUsingModel(image) {

    // response.outputs[0].data.concepts


      app.models.predict( foodModel,
        image).then(
        function(response) {
            console.log(response);
            var results = response.outputs[0].data.concepts;
//                var food_result_0 = results[0].name + "_" + results[0].value;

            var text = "";
            for (index in results) {
                var food_result = results[index].name + "_" + results[index].value;
                text += food_result + "<br/>";
            }

//                console.log(results[0].name + "_" + results[0].value);
            document.getElementById('image_url_3').innerHTML = text;

        },
        function(err) {
            console.error(err);
            document.getElementById('image_url_3').innerHTML = err;
        }
    );
}