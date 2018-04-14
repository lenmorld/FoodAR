var StateModule = function() {

    var READY_TO_CAPTURE = true;


    function prepareCapture(exec) {

        READY_TO_CAPTURE = true;

        $("#btn-analyze").click(function() {
            if (READY_TO_CAPTURE) {
                exec();
                StateModule.duringCapture();
            } else {
                StateModule.prepareCapture();
            }
        });

        $("#btn-roller").hide();
        $(".icono-leftArrow").hide();       // hide back button

        document.getElementById("background-top").style.display = "block";
        document.getElementById("background-right").style.display = "block";
        document.getElementById("background-bottom").style.display = "block";
        document.getElementById("background-left").style.display = "block";

        $("#btn-analyze").css("background-color", "#C8C8C8");       // style btn-analyze normally
    }

    function duringCapture() {
        $("#btn-roller").show();       // show spinners
        $("#btn-analyze").prop('disabled', true);       // analyze while processing
    }


    function afterCapture() {

        READY_TO_CAPTURE = false;

        document.getElementById("background-top").style.display = "none";
        document.getElementById("background-right").style.display = "none";
        document.getElementById("background-bottom").style.display = "none";
        document.getElementById("background-left").style.display = "none";

        $("#btn-roller").hide();

        $("#btn-analyze").prop('disabled', false);       // analyze while processing
        $("#btn-analyze").css("background-color", "orange");
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