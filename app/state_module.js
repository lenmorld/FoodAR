var StateModule = function() {


    function analyzeButtonClicked() {
        // first and foremost, clear all ARcontent for garbage collection
        // ArWebModule.cleanARcontent();
        Utils.debug("capturing...");
        ArWebModule.setCaptureFoodItem(true);
    }

    function prepareCapture() {
        $("#btn-analyze").off();
        $("#btn-analyze").click(function() {
            if (!DEV_MODE) {
                analyzeButtonClicked();
                StateModule.duringCapture();
            } else {
                Utils.smartLog(['getUserMedia() is not supported in your browser']);
                Utils.debug('running app in desktop browser testing mode...');
                var image = 'http://cdn-image.myrecipes.com/sites/default/files/styles/4_3_horizontal_-_1200x900/public/potato-soup-oh-1000.jpg';
                var searchString = "soup";

                StateModule.duringCapture();
                ClarifaiModule.predictUsingWorkflow(image, 10, 0.90, ClarifaiFoodModule.processKeywords);
                // EdamamModule.foodSearch(searchString, FoodHelperModule.foodSearchSuccess, FoodHelperModule.foodSearchFailure);
            }
        });

        $("#btn-analyze").prop('disabled', false);       // analyze while processing

        $("#btn-roller").hide();
        $(".icono-leftArrow").hide();       // hide back button

        document.getElementById("background-top").style.display = "block";
        document.getElementById("background-right").style.display = "block";
        document.getElementById("background-bottom").style.display = "block";
        document.getElementById("background-left").style.display = "block";

        // #C8C8C8
        $("#btn-analyze").css("background-color", "lawngreen");       // style btn-analyze normally
    }

    function duringCapture() {
        $("#btn-roller").show();       // show spinners
        $("#btn-analyze").prop('disabled', true);       // analyze while processing
        $("#btn-analyze").css("background-color", "#C8C8C8");
    }

    function afterCapture() {

        $("#btn-analyze").off();
        $("#btn-analyze").click(function() {
            // first and foremost, clear all ARcontent for garbage collection
            ArWebModule.cleanARcontent();
            prepareCapture();
        });

        document.getElementById("background-top").style.display = "none";
        document.getElementById("background-right").style.display = "none";
        document.getElementById("background-bottom").style.display = "none";
        document.getElementById("background-left").style.display = "none";

        $("#btn-roller").hide();
        $("#btn-analyze").prop('disabled', false);       // analyze while processing
        $("#btn-analyze").css("background-color", "orange");        // orange
        $(".icono-leftArrow").show();
    }

    return {
        prepareCapture: prepareCapture,
        duringCapture: duringCapture,
        afterCapture: afterCapture
    }
}();


    /*
            // $("#btn-analyze").show();
        // $("#btn-analyze-spinner").hide().css("animation-play-state", "paused");

        // $("#btn-analyze").css("border-bottom-color", "transparent");

        // $("#btn-analyze").show();
        // $("#btn-roller").hide();
        // ROLLER.css("visibility", "hidden");



                // $(this).css("background-color", "blue");

            // $("#btn-analyze").hide();
            // $("#btn-analyze-spinner").show().css("animation-play-state", "running");

            // $("#btn-analyze").css("border-bottom-color", "lawngreen");
            // $("#btn-analyze").toggle().toggle();
            // $("#btn-analyze").hide();

            // $("#btn-roller").show();
            // ROLLER.css("visibility", "visible");
            // ROLLER.css("display", "block");
            // ROLLER.show();

            document.getElementById("btn-roller").style.display = "block";
     */