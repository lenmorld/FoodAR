var vrDisplay, vrControls, arView;
var canvas, camera, scene, renderer;
var BOX_DISTANCE = 1.5;
var BOX_SIZE = 0.25;
var BOX_QUANTITY = 6;
var boxesAdded = false;

var isUploaded = false;

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

    if (!isUploaded) {
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
    document.getElementById('nut_info').innerHTML = 'getUserMedia() is not supported in your browser';
}

/*******************************/

function buttonFunc() {
    isUploaded = false;
}

function analyzeObject(canvasObj) {

    // convert webGL image to base64 representation
    var dataURL = canvasObj.toDataURL();
    var base64img = dataURL.split("base64,")[1];

    // predictUsingWorkflow(image, maxConcepts, minConfidence, callback)
    predictUsingWorkflow({base64: base64img}, 10, 0.90, processKeywords);

    isUploaded = true;

    // *** CLOUDINARY ***
    // upload to Cloudinary
// uploadFile(dataURL);
}

var food_serving = ['fruit salad', 'pasta'];

//        const image = './food.jpg';       // THIS WONT WORK BECAUSE OF XSRF uploads,
var image = 'https://samples.clarifai.com/metro-north.jpg';
image = 'https://i.imgur.com/eTuCPxM.jpg';
image = 'https://i.imgur.com/r0xlLtK.jpg';          // apple
image = 'https://i.imgur.com/bQOombb.jpg';          // banana
image = 'http://del.h-cdn.co/assets/17/26/980x490/landscape-1498854508-delish-mimosa-fruit-salad-3.jpg';    // fruit salad
//    image = 'https://www.recipetineats.com/wp-content/uploads/2017/05/Bacon-Tomato-Pasta-3-landscape.jpg';  // pasta

function processKeywords(words) {
//        console.log("words:", words);

    document.getElementById('extra').innerHTML = 'Processing....';

    if (words.error) {
        document.getElementById('nut_info').innerHTML = words.error;
    }

    console.log("common:", getCommon(words.food, words.general, "name"));

    var food_servings = getFoodServings(words.food);
    food_servings.concat(getFoodServings(words.general));

    // Display in AR
    // TODO: look for common concepts (or know needed concepts and look for them)
    // to check for 'accuracy'
//                var food_result_0 = results[0].name + "_" + results[0].value;

    if (food_servings.length > 0) {
        console.log("food servings:", food_servings);

        // e.g. 'fruit salad'
        // we don't want to individually get nutrition of strawberry, berry, etc.
        // if food serving is found, this is priority instead of individual food items
        // look this up

        document.getElementById('nut_info').innerHTML = food_servings[0];

    } else {
        // look up food items, then sum up

        // TODO: determine which is better: words.food or words.general

        var text = "";
        for (index in words.food) {
            // var food_result = results[index].name + "_" + results[index].value;
            var food_result = results[index].name;
            text += food_result + "<br/>";
        }

        document.getElementById('nut_info').innerHTML = text;

        // TODO: must have a way to determine multiple food items in photo (to get each one)
        // or just one item that resulted to different concepts (to get only one)
    }
//        console.log("food servings:", getFoodServings(words.food));
//        console.log("food servings:", getFoodServings(words.general));
}

function getCommon(arr1, arr2, attr) {
    return arr1.filter(function(e) {return (arr2.filter(function(f) {return f[attr] === e[attr] }) ).length > 0 });
}

function getFoodServings(arr) {
    return arr.filter(function(e) {return food_serving.includes(e.name) });
}

// predictUsingWorkflow(image, 10, 0.90, logWords);