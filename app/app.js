/*
    execute this when document ready
 */
$(function() {
    function testing() {

        $("body").css("background-color", "green");
        DEV_MODE = true;

        // *** DOC: FUTURE.md > TESTING *** //
    }

    function analyzeObject(canvasObj) {
        // AR TEST
        // ArWebModule.addArText("lenny");

        // captureFoodItem = false;
        ArWebModule.setCaptureFoodItem(false);
        // DEBUG_VIEW.innerHTML = "capture false";
        Utils.smartLog(["Capturing food item..."]);

        // convert webGL image to base64 representation
        var dataURL = canvasObj.toDataURL();
        var base64img = dataURL.split("base64,")[1];
        // PREV_IMAGE_THUMBNAIL = dataURL;

        // predictUsingWorkflow(image, maxConcepts, minConfidence, successCallback)
        ClarifaiModule.predictUsingWorkflow({base64: base64img}, 10, 0.90, ClarifaiFoodModule.processKeywords);
    }


    Utils.smartLog(["press analyze..."]);

    //####################################################

    if (ArWebModule.checkArBrowser()) {
        StateModule.prepareCapture();
        ArWebModule.startAR(analyzeObject, testing);

        // load 3d font now while still waiting for user input
        ArWebModule.loadFont();

    } else {
        testing();

        StateModule.prepareCapture();
    }
});

