/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
    singleton pattern for modular ES5 JS
    can avoid IIFE at the end, so it will become constructor
 */

var ArWebModule = function () {
    var vrDisplay, vrFrameData, vrControls, arView;
    var canvas, camera, scene, renderer;
    var boxesAdded = false;

    var removable_items = [];

    /* 3dtext stuff */

    /*
    banana                      0.50
                                            0.15 3d text height - FoodItemName
                                                a bit of space of margin between them
    carbs = 10 % 100 g          0.35        0.10 3d text height - NutirionInfo
    ...                         0.25
    ...

     */

    // var pose = null, ori = null, pos = null;
    var ARfoodItemNameYposition = 0.45;       // make it close to the top, to give space for the NutritionInfo
    // 0.25, a bit higher than middle, 0 is middle

    // 3d text font sizes
    var ARfoodItemNameSize = 0.01;
    var ARfoodItemNameHeight = 0.01;

    var ARnutritionInfoYposition = ARfoodItemNameYposition - 0.20;      // start NutritionInfo at 0.30

    var ARnutritionInfoItemSize = 0.005;
    var ARnutritionInfoItemHeight = 0.003;
    var ARnutritionInfoItemYoffset = 0.08;              // give each item 0.10 space

    var loader = new THREE.FontLoader();
    var font = null;

    var scale = 0.125;        // smaller -> inwards, bigger -> outwards  from camera
    /*****************/

    var canAddARObjectsAlready = false;

    var analyzeObject = null;
    var captureFoodItem = false;        // must press button on load

    // 3d text geometry
    var textMaterial = new THREE.MeshNormalMaterial();
    // var textMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );       // basic material is just flat, hard to read 3d
    var dirMtx = new THREE.Matrix4();


    function loadFont() {
        if (!font) {
            loader.load('AR/third_party/fonts/optimer_bold.typeface.json', function (_font) {
                font = _font;
            });
        }
    }


    function setCaptureFoodItemStatus(bool) {
        captureFoodItem = bool;
    }

    function startAR(analyzeObjectFunc, failureCallback) {
        /**
         * Use the `getARDisplay()` utility to leverage the WebVR API
         * to see if there are any AR-capable WebVR VRDisplays. Returns
         * a valid display if found. Otherwise, display the unsupported
         * browser message.
         */
        THREE.ARUtils.getARDisplay().then(function (display) {
            if (display) {
                vrFrameData = new VRFrameData();
                vrDisplay = display;
                analyzeObject = analyzeObjectFunc;
                init();
            } else {
                failureCallback();
                // THREE.ARUtils.displayUnsupportedMessage();
            }
        });
    }

    function hasGetUserMedia() {
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    function checkArBrowser() {
        if (hasGetUserMedia()) {
            return true;
        } else {
            return false;
        }
    }

    function init() {

        // $("#img_captured").hide();
        // $("#btn-analyze").prop('disabled', false);

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
        // canvas.addEventListener('touchstart', addArText, false);

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

        // From the WebVR API, populate `vrFrameData` with
        // updated information for the frame
        vrDisplay.getFrameData(vrFrameData);

        // Update our perspective camera's positioning
        vrControls.update();

        // If we have not added boxes yet, and we have positional
        // information applied to our camera (it can take a few seconds),
        // and the camera's Y position is not undefined or 0, create boxes
        if (!boxesAdded && !camera.position.y) {
            canAddARObjectsAlready = true;
        }

        // Render our three.js virtual scene
        renderer.clearDepth();
        renderer.render(scene, camera);

        // ############ ANALYZE button ##################
        if (captureFoodItem) {
            analyzeObject(canvas);
        }
        // ##########################################

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

    /*
        do this everytime there is an update of FoodItemName and NutritionInfo
     */

    var startTime, endTime;
    function start() {
        startTime = new Date();
    };

    function end() {
        endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        return timeDiff;
    }

    function addAr3dText(ARtext, size, height, Yoffset) {
        var timeLog = "";
        // Utils.debug("rendering 3d " + ARtext);
        start();
        // if scene and camera not ready yet
        if (!canAddARObjectsAlready) {
            return;
        }

        // y=0 for exact middle, x=-0.25 and z=-1.0 very good center for Pixel
        var x=-0.25, y= 0 + Yoffset, z=-1.0;

        // TODO: pose data can be reused? NO IT CANT
        // since frame is same anyways and taken already

        // Fetch the pose data from the current frame
        var pose = vrFrameData.pose;
        // Convert the pose orientation and position into
        // THREE.Quaternion and THREE.Vector3 respectively
        var ori = new THREE.Quaternion(
            pose.orientation[0],
            pose.orientation[1],
            pose.orientation[2],
            pose.orientation[3]
        );
        var pos = new THREE.Vector3(
            pose.position[0],
            pose.position[1],
            pose.position[2]
        );
        timeLog += end() + " [1] ";

        start();
        dirMtx.makeRotationFromQuaternion(ori);
        // var push = new THREE.Vector3(0, 0, -1.0);
        var push = new THREE.Vector3(x, y, z);
        // var push = new THREE.Vector3(-0.5, 0, -0.5);
        push.transformDirection(dirMtx);
        pos.addScaledVector(push, scale);
        timeLog += end() + " [2] ";


        start();
        // TextGeometry
        textGeo = new THREE.TextBufferGeometry(ARtext, {
            font: font,
            size: size,
            height: height
        });         // SLOWEST BLOCK >>> takes 1.2 seconds per line
        timeLog += end() + " [3.1] ";

        start();
        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();
        timeLog += end() + " [3.2] ";

        start();
        // textGeo.center();
        var text3D = new THREE.Mesh(textGeo, textMaterial);

        // text3D.position.set(0, 90, 90);
        scene.add(text3D);
        removable_items.push(text3D);     // garbage collect 3d objects

        // place geometry at camera's current position
        text3D.position.copy(pos);
        text3D.quaternion.copy(ori);
        timeLog += end() + " [4] ";

        Utils.debug(timeLog);
    }

    function render3dArText(food_name, nutr_list, done_callback) {

        addAr3dText(food_name, ARfoodItemNameSize, ARfoodItemNameHeight, ARfoodItemNameYposition);

        for (var i=0; i < nutr_list.length; i++) {

            // FoodItemName is at 0.5, give
            // start at 0.35, then go down with 0.10 increments

            // calculate offset based on current index
            var Yoffset = ARnutritionInfoYposition - (i*ARnutritionInfoItemYoffset);
            addAr3dText(nutr_list[i], ARnutritionInfoItemSize, ARnutritionInfoItemHeight, Yoffset);
        }

        // callback when done
        done_callback();
    }


    function cleanARcontent() {
        if (removable_items.length >0) {
            removable_items.forEach(function(v,i) {
               v.parent.remove(v);
            });
            removable_items = [];
        }
    }


    // expose functions and objects here
    return {
        startAR: startAR,
        checkArBrowser: checkArBrowser,
        setCaptureFoodItem: setCaptureFoodItemStatus,
        cleanARcontent: cleanARcontent,
        loadFont: loadFont,
        render3dArText: render3dArText
    };
}();