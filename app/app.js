var vrDisplay, vrControls, arView;
var canvas, camera, scene, renderer;
var BOX_DISTANCE = 1.5;
var BOX_SIZE = 0.25;
var BOX_QUANTITY = 6;
var boxesAdded = false;

var captureFoodItem = false;        // must press button on load

/*
DECLARE ALL HTML DOM ELEMENTS HERE TO BE
FILLED WITH CONTENT IN AR
 */

var KEYWORD_LIMIT = 5;
var PREV_IMAGE_THUMBNAIL = null;


var FOOD_ITEM_VIEW = document.getElementById('food_item');
var NUTR_INFO_VIEW = document.getElementById('nut_info');
var LOGS_VIEW = document.getElementById('logs');
var DEBUG_VIEW = document.getElementById('debug');

//////////////////////////////////////////////////////

/**
 * Use the `getARDisplay()` utility to leverage the WebVR API
 * to see if there are any AR-capable WebVR VRDisplays. Returns
 * a valid display if found. Otherwise, display the unsupported
 * browser message.
 */
THREE.ARUtils.getARDisplay().then(function (display) {
    if (display) {
        vrDisplay = display;
        init();
    } else {
        THREE.ARUtils.displayUnsupportedMessage();
    }
});

function init() {
    /*
    init UI elements
     */

    $("#img_captured").hide();

    $("#btn-analyze").prop('disabled', false);


    /*** simple button ****/
    // Initialize the dat.GUI.
//    var datGUI = new dat.GUI();
//    gui = new GUI();
//    datGUI.add(gui, "markerTypeString", ["AR", "QRCODE"]).onFinishChange(function(value) {
//        if (!vrDisplay) {
//            return;
//        }
//        if (value === "QRCODE") {
//            gui.markerType = vrDisplay.MARKER_TYPE_QRCODE;
//        }
//        else if (value === "AR") {
//            gui.markerType = vrDisplay.MARKER_TYPE_AR;
//        }
//    }).name("Marker type");

    /**********************/

    // Setup the three.js rendering environment
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    canvas = renderer.domElement;
    document.body.appendChild(canvas);
    scene = new THREE.Scene();

    // Creating the ARView, which is the object that handles
    // the rendering of the camera stream behind the three.js
    // scene
    arView = new THREE.ARView(vrDisplay, renderer);

    // The ARPerspectiveCamera is very similar to THREE.PerspectiveCamera,
    // except when using an AR-capable browser, the camera uses
    // the projection matrix provided from the device, so that the
    // perspective camera's depth planes and field of view matches
    // the physical camera on the device.
    camera = new THREE.ARPerspectiveCamera(
        vrDisplay,
        60,
        window.innerWidth / window.innerHeight,
        vrDisplay.depthNear,
        vrDisplay.depthFar
    );

    // VRControls is a utility from three.js that applies the device's
    // orientation/position to the perspective camera, keeping our
    // real world and virtual world in sync.
    vrControls = new THREE.VRControls(camera);

    // Bind our event handlers
    window.addEventListener('resize', onWindowResize, false);

    // Kick off the render loop!
    update();
}

/**
 * The render loop, called once per frame. Handles updating
 * our scene and rendering.
 */
function update() {
    // Clears color from the frame before rendering the camera (arView) or scene.
    renderer.clearColor();

    // Render the device's camera stream on screen first of all.
    // It allows to get the right pose synchronized with the right frame.
    arView.render();

    // Update our camera projection matrix in the event that
    // the near or far planes have updated
    camera.updateProjectionMatrix();

    // Update our perspective camera's positioning
    vrControls.update();

    // If we have not added boxes yet, and we have positional
    // information applied to our camera (it can take a few seconds),
    // and the camera's Y position is not undefined or 0, create boxes
    if (!boxesAdded && !camera.position.y) {
//    addBoxes();           // SUPPRESS THE BOXES FOR NOW
    }

    // Render our three.js virtual scene
    renderer.clearDepth();
    renderer.render(scene, camera);

    if (captureFoodItem) {
        analyzeObject(canvas);
    }

    // Kick off the requestAnimationFrame to call this function
    // when a new VRDisplay frame is rendered
    vrDisplay.requestAnimationFrame(update);
}

/**
 * On window resize, update the perspective camera's aspect ratio,
 * and call `updateProjectionMatrix` so that we can get the latest
 * projection matrix provided from the device
 */
function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Once we have position information applied to our camera,
 * create some boxes at the same height as the camera
 */
function addBoxes () {
    // Create some cubes around the origin point
    for (var i = 0; i < BOX_QUANTITY; i++) {
        var angle = Math.PI * 2 * (i / BOX_QUANTITY);
        var geometry = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);
        var material = new THREE.MeshNormalMaterial();
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(Math.cos(angle) * BOX_DISTANCE, camera.position.y - 0.25, Math.sin(angle) * BOX_DISTANCE);
        scene.add(cube);
    }

    // Flip this switch so that we only perform this once
    boxesAdded = true;
}

/******* camera support ********/
function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
    // alert("AR is ready!");
    // Good to go!
} else {
    LOGS_VIEW.innerHTML = 'getUserMedia() is not supported in your browser';
}

/*******************************/

function buttonFunc() {
    captureFoodItem = true;

    $("#btn-analyze").prop('disabled', true);       // analyze while processing
}

function analyzeObject(canvasObj) {

    // convert webGL image to base64 representation
    var dataURL = canvasObj.toDataURL();
    var base64img = dataURL.split("base64,")[1];
    PREV_IMAGE_THUMBNAIL = dataURL;

    captureFoodItem = false;

    // predictUsingWorkflow(image, maxConcepts, minConfidence, successCallback)
    predictUsingWorkflow({base64: base64img}, 10, 0.90, processKeywords);

    // *** CLOUDINARY ***
    // upload to Cloudinary
// uploadFile(dataURL);
}

var food_serving = ['fruit salad', 'pasta'];

/************************************************************/
/**************** nutrition.js *******************************/

// food item search
function food_search_success(foodItemUri) {

    console.log("success: ", foodItemUri);
    console.log("invoking nutrients fetch ");


    DEBUG_VIEW.innerHTML = "[food_search_success]" + foodItemUri;
    LOGS_VIEW.innerHTML = "fetching nutrition info...";

    nutrients_fetch(foodItemUri, nutrients_fetch_success, nutrients_fetch_failure);
}

function food_search_failure(msg) {
    console.log("failure: ", msg);

    DEBUG_VIEW.innerHTML += "[food_search_failure]" + msg;
}


// nutrient search
function nutrients_fetch_success(nutrientsInfo) {

    console.log("success: ", nutrientsInfo);
    DEBUG_VIEW.innerHTML = "[nutrient_fetch_success]";
    prepareNutrientsView(nutrientsInfo);
}

function nutrients_fetch_failure(msg) {
    console.log("failure: ", msg);
    DEBUG_VIEW.innerHTML += "[nutrients_fetch_failure]" + msg;
}

function round(decimal) {
    return Math.round(decimal * 100) / 100;
}

function renderNutritionAR(nutrientsObj) {

    var html = "";

    LOGS_VIEW.innerHTML = "rendering...";

    for (var key in nutrientsObj) {
        if (nutrientsObj.hasOwnProperty(key)) {
            console.log(key, nutrientsObj[key]);

            var item = nutrientsObj[key];
            html += ["<p>", item.name, ": ", item.daily, " ", item.quantity, "</p>"].join("");
        }
    }

    // SUCCESS!!!

    NUTR_INFO_VIEW.innerHTML += html;
    DEBUG_VIEW.innerHTML = "=D";
    LOGS_VIEW.innerHTML = "done! press analyze again...";

    document.getElementById('img_captured_thumb')
        .setAttribute(
            'src', PREV_IMAGE_THUMBNAIL );

    $("#img_captured").show();

    // enable button again
    $("#btn-analyze").prop('disabled', false);

    // captureFoodItem = true;
    // PREV_IMAGE_THUMBNAIL = null;             // reset image
}

// process nutrients for display
function prepareNutrientsView(nutrientsInfo) {

    var nutrients_for_display = ['CHOCDF', 'ENERC_KCAL', 'FAT', 'FIBTG', 'PROCNT'];

    var total_daily = nutrientsInfo.totalDaily;
    var total_quantity = nutrientsInfo.totalNutrients;

    var nutrientsObj = {};

    for(var i=0; i< nutrients_for_display.length; i++) {
        var nutrient = nutrients_for_display[i];

        // {label: "Carbs", quantity: 8.808626666666665, unit: "%"}
        // {label: "Carbs", quantity: 26.425879999999996, unit: "g"}

        var total_daily_nutrient = total_daily[nutrient];
        var total_quantity_nutrient = total_quantity[nutrient];

        if (!nutrientsObj[nutrient]) {
            nutrientsObj[nutrient] = {};
        }

        var total_daily_string = [round(total_daily_nutrient.quantity), total_daily_nutrient.unit].join(" ");
        var total_quantity_string = [round(total_quantity_nutrient.quantity), total_quantity_nutrient.unit].join(" ");

        nutrientsObj[nutrient]["daily"] = total_daily_string;
        nutrientsObj[nutrient]["quantity"] = total_quantity_string;
        nutrientsObj[nutrient]["name"] = total_daily_nutrient.label;

        // can also get official Food Item info from nutrientsInfo.nutrientsInfo.ingredients[0].parsed[0]
        // console.log(searchString);
        // console.log(total_daily_string);
        // console.log(total_quantity_string);
    }

    console.log(nutrientsObj);

    renderNutritionAR(nutrientsObj);
}


function getCommon(arr1, arr2, attr) {
    return arr1.filter(function(e) {return (arr2.filter(function(f) {return f[attr] === e[attr] }) ).length > 0 });
}

function getFoodServings(arr) {
    return arr.filter(function(e) {return food_serving.includes(e.name) });
}



function processKeywords(words) {
//        console.log("words:", words);
    // EXTRA_VIEW.innerHTML = 'Processing....';

    NUTR_INFO_VIEW.innerHTML = "";
    LOGS_VIEW.innerHTML = "searching food item...";

    if (words.error) {
        LOGS_VIEW.innerHTML = words.error;
    }

    console.log("common:", getCommon(words.food, words.general, "name"));

    var food_servings = getFoodServings(words.food);
    food_servings.concat(getFoodServings(words.general));

    // Display in AR
    // TODO: look for common concepts (or know needed concepts and look for them)
    // to check for 'accuracy'
//                var food_result_0 = results[0].name + "_" + results[0].value;

    var searchNutritionString = "";

    if (food_servings.length > 0) {
        console.log("food servings:", food_servings);

        // e.g. 'fruit salad'
        // we don't want to individually get nutrition of strawberry, berry, etc.
        // if food serving is found, this is priority instead of individual food items
        // look this up

        // display first one (#1 result)
        var foodItemResult = food_servings[0].name;


        FOOD_ITEM_VIEW.innerHTML = foodItemResult;       // # display food item result
        searchNutritionString = foodItemResult;          // # search for nutrition info

    } else {
        // look up food items, then sum up

        // TODO: determine which is better: words.food or words.general

        var text = "";

        for (var index=0; index < KEYWORD_LIMIT; index++) {
            var food_result = words.food[index].name + ":" + words.food[index].value;
            // var food_result = words.food[index].name;
            text += food_result + " ";
        }

        DEBUG_VIEW.innerHTML = text;    // top 5

        // TODO: must have a way to determine multiple food items in photo (to get each one)
        // or just one item that resulted to different concepts (to get only one)

        // get first item for now

        if (words.food.length > 0) {
            var foodItemResult = food_servings[0].name;
            FOOD_ITEM_VIEW.innerHTML = foodItemResult;        // # display food item result
            searchNutritionString = foodItemResult;          // # search for nutrition info
        }
    }

    // get nutrition info
    food_search(searchNutritionString, food_search_success, food_search_failure);

    // TODO: must find a condition to detect multiple food items, other than single and/or food_serving
    // then search them indiv. and sum up their nutrition

    // or when multiple just do recipe, not nutrition

//        console.log("food servings:", getFoodServings(words.food));
//        console.log("food servings:", getFoodServings(words.general));
}


// $(document).ready(function(){
//     $("button").click(function(){
//         food_search(searchString, food_search_success, food_search_failure);
//     });
// });

/*************************************************************/
/**************************************************************/

// var searchString = "banana";

//        const image = './food.jpg';       // THIS WONT WORK BECAUSE OF XSRF uploads,
// var image = 'https://samples.clarifai.com/metro-north.jpg';
// image = 'https://i.imgur.com/eTuCPxM.jpg';
// image = 'https://i.imgur.com/r0xlLtK.jpg';          // apple
// image = 'https://i.imgur.com/bQOombb.jpg';          // banana
// image = 'http://del.h-cdn.co/assets/17/26/980x490/landscape-1498854508-delish-mimosa-fruit-salad-3.jpg';    // fruit salad
// //    image = 'https://www.recipetineats.com/wp-content/uploads/2017/05/Bacon-Tomato-Pasta-3-landscape.jpg';  // pasta
//


// predictUsingWorkflow(image, 10, 0.90, logWords);