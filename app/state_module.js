var StateModule = function() {


    var  background_top =  $("#background-top");
    var  background_right =  $("#background-right");
    var  background_bottom =  $("#background-bottom");
    var  background_left =  $("#background-left");

    var btn_analyze = $("#btn-analyze");
    var btn_roller = $("#btn-roller");
    var left_arrow = $(".left-arrow");

    var heading_notes = $(".heading-notes");

    function analyzeButtonClicked() {
        // first and foremost, clear all ARcontent for garbage collection
        // ArWebModule.cleanARcontent();
        Utils.debug("capturing...");
        ArWebModule.setCaptureFoodItem(true);
    }

    function prepareCapture() {
        heading_notes.text("Capture food item...");
        btn_analyze.off();
        btn_analyze.click(function() {
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

        btn_analyze.prop('disabled', false);       // analyze while processing

        btn_roller.hide();
        left_arrow.hide();       // hide back button

        background_top.show();
        background_right.show();
        background_bottom.show();
        background_left.show();

        // #C8C8C8
        btn_analyze.css("background-color", "lawngreen");       // style btn-analyze normally
    }

    function duringCapture() {
        btn_roller.show();       // show spinners
        btn_analyze.prop('disabled', true);       // analyze while processing
        btn_analyze.css("background-color", "#C8C8C8");
    }

    function afterCapture() {
        heading_notes.text("* % Daily value | Nutrient amount");
        btn_analyze.off();
        btn_analyze.click(function() {
            // first and foremost, clear all ARcontent for garbage collection
            ArWebModule.cleanARcontent();
            prepareCapture();
        });

        background_top.hide();
        background_right.hide();
        background_bottom.hide();
        background_left.hide();

        btn_roller.hide();
        btn_analyze.prop('disabled', false);       // analyze while processing
        btn_analyze.css("background-color", "orange");        // orange

        left_arrow.show();
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