/*
    singleton pattern for modular ES5 JS
    can avoid IIFE at the end, so it will become constructor
 */

var ClarifaiModule = function () {

    const generalModel = Clarifai.GENERAL_MODEL;
    const foodModel = "bd367be194cf45149e75f01d59f77ba7";
    var workflow = "foodandgeneral";         // workflow - combined food and general

    // initialize with your api key. This will also work in your browser via http://browserify.org/
    const app = new Clarifai.App({
        apiKey: 'bf2c869d10754199bdb948e07ca7ab63'
    });

    function predictUsingWorkflow(image, maxConcepts, minPredictionValue, successCallback) {
        var configObject = {
            maxConcepts: maxConcepts,
            minValue: minPredictionValue
        };

        // predict the contents of an image by passing in an image
        app.workflow.predict(workflow,
            image, configObject).then(
            function (response) {
                var general_results = response.results[0].outputs[0].data.concepts;
                var food_results = response.results[0].outputs[1].data.concepts;
                // TODO: look for common concepts (or know needed concepts and look for them)
                // to check for 'accuracy'
                var results = {
                    general: general_results,
                    food: food_results
                };
                successCallback(results);
            },
            function (err) {
                // console.error(err);
                var results = {
                    error: err
                };
                return results;
            }
        );
    }

    // expose functions and objects here
    return {
        predictUsingWorkflow: predictUsingWorkflow
    }
}();

