/*
    singleton pattern for modular ES5 JS
    can avoid IIFE at the end, so it will become constructor
 */

var ArWebModule = function () {
    var vrDisplay, vrFrameData, vrControls, arView;
    var canvas, camera, scene, renderer;
    var BOX_DISTANCE = 1.5;
    var BOX_SIZE = 0.25;
    var BOX_QUANTITY = 6;
    var boxesAdded = false;

    var canAddARObjectsAlready = false;

    // var group, textMesh1, textMesh2, textGeo, materials;    // textGeo
    // var font = undefined,
    //     fontName = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
    //     fontWeight = "bold";
    //
    // var fontMap = {
    //     "helvetiker": 0,
    //     "optimer": 1,
    //     "gentilis": 2,
    //     "droid/droid_sans": 3,
    //     "droid/droid_serif": 4
    // };
    //
    // var weightMap = {
    //     "regular": 0,
    //     "bold": 1
    // };
    //
    // var reverseFontMap = [];
    // var reverseWeightMap = [];
    //
    // for ( var i in fontMap ) reverseFontMap[ fontMap[i] ] = i;
    // for ( var i in weightMap ) reverseWeightMap[ weightMap[i] ] = i;

    //#########################################

    var analyzeObject = null;
    var captureFoodItem = false;        // must press button on load


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
            // alert("AR is ready!");
            // Good to go!
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

        // touchstart Event  https://developer.mozilla.org/en-US/docs/Web/API/Touch_events

        // USE THIS or ANALYZE_BUTTON?
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
            // addBoxes();           // SUPPRESS THE BOXES FOR NOW
            // addText();
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

    function addBoxes () {
        // Create some cubes around the origin point
        // for (var i = 0; i < BOX_QUANTITY; i++) {
        //     var angle = Math.PI * 2 * (i / BOX_QUANTITY);
        //     var geometry = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);
        //     var material = new THREE.MeshNormalMaterial();
        //     var cube = new THREE.Mesh(geometry, material);
        //     cube.position.set(Math.cos(angle) * BOX_DISTANCE, camera.position.y - 0.25, Math.sin(angle) * BOX_DISTANCE);
        //     scene.add(cube);
        // }
    }


    function addArText(ARtext, size, height, Yoffset) {

        // if scene and camera not ready yet
        if (!canAddARObjectsAlready) {
            return;
        }

        // y=0 for exact middle
        var x=-0.25, y= 0 + Yoffset, z=-1.0;

        var loader = new THREE.FontLoader();
        loader.load('AR/third_party/fonts/optimer_bold.typeface.json', function (font) {
            try {
                // var font = response;
                // refreshText();

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

                var dirMtx = new THREE.Matrix4();
                dirMtx.makeRotationFromQuaternion(ori);

                // var push = new THREE.Vector3(0, 0, -1.0);


                var push = new THREE.Vector3(x, y, z);
                // var push = new THREE.Vector3(-0.5, 0, -0.5);

                push.transformDirection(dirMtx);

                // 0.125
                var scale = 0.125;        // smaller -> inwards, bigger -> outwards  from camera
                pos.addScaledVector(push, scale);

                // Clone our cube object and place it at the camera's
                // current position
                // var clone = cube.clone();
                // scene.add(clone);
                // clone.position.copy(pos);
                // clone.quaternion.copy(ori);

                // size: 0.025,
                //     height: 0.025

                textGeo = new THREE.TextGeometry(ARtext, {
                    font: font,
                    size: size,
                    height: height
                });
                textGeo.computeBoundingBox();
                textGeo.computeVertexNormals();
                // textGeo.center();

                var material = new THREE.MeshNormalMaterial();
                var text3D = new THREE.Mesh(textGeo, material);

                //         var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
                //
                //         // textMesh1 = new THREE.Mesh(textGeo, materials);
                //
                // text3D.position.x = centerOffset;
                // text3D.position.y = Math.PI;
                // text3D.position.z = 0;

                // text3D.position.set(0, 90, 90);
                scene.add(text3D);

                // place geometry at camera's current position
                text3D.position.copy(pos);
                text3D.quaternion.copy(ori);


                // TODO: is it okay to do it more than once
                // Flip this switch so that we only perform this once
                // boxesAdded = true;
            } catch(err) {
                DEBUG_VIEW.innerHTML = err.message;
            }
        });
    }


    // expose functions and objects here
    return {
        startAR: startAR,
        checkArBrowser: checkArBrowser,
        setCaptureFoodItem: setCaptureFoodItemStatus,
        addArText: addArText
    };
}();