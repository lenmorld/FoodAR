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
    var BOX_DISTANCE = 1.5;
    var BOX_SIZE = 0.25;
    var BOX_QUANTITY = 6;
    var boxesAdded = false;

    var removable_items = [];

    /* 3dtext stuff */

    // var pose = null, ori = null, pos = null;
    var ARfoodItemNameYposition = 0.45;       // make it close to the top, to give space for the NutritionInfo
    // 0.25, a bit higher than middle, 0 is middle

    // 3d text font sizes
    var ARfoodItemNameSize = 0.01;
    var ARfoodItemNameHeight = 0.01;

    var ARnutritionInfoYposition = ARfoodItemNameYposition - 0.20;      // start NutritionInfo at 0.30

    var ARnutritionInfoItemSize = 0.005;
    var ARnutritionInfoItemHeight = 0.005;
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



    var materialFront = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    var materialSide = new THREE.MeshBasicMaterial( { color: 0x000088 } );
    var materialArray = [ materialFront, materialSide ];


    function loadFont() {
        if (!font) {
            loader.load('AR/third_party/fonts/optimer_bold.typeface.json', function (_font) {
                font = _font;
            });
        }
    }


    var objectsToRender = 0;


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

        /*
        // +++ can add a touch even here, but is not very practical the way the spawned objects appear with the
        // food item to be captured
        // touchstart Event  https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
        // USE THIS or ANALYZE_BUTTON?
        // canvas.addEventListener('touchstart', addArText, false);
        */

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
        for (var i = 0; i < BOX_QUANTITY; i++) {
            var angle = Math.PI * 2 * (i / BOX_QUANTITY);
            var geometry = new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE);
            var material = new THREE.MeshNormalMaterial();
            var cube = new THREE.Mesh(geometry, material);
            cube.position.set(Math.cos(angle) * BOX_DISTANCE, camera.position.y - 0.25, Math.sin(angle) * BOX_DISTANCE);
            scene.add(cube);
            removable_items.push(cube);     // garbage collect 3d objects
        }
    }

    /*
        do this everytime there is an update of FoodItemName and NutritionInfo
     */
    function addArText(ARtext, size, height, Yoffset) {

        Utils.debug("rendering 3d " + ARtext);

        // if scene and camera not ready yet
        if (!canAddARObjectsAlready) {
            return;
        }

        // y=0 for exact middle, x=-0.25 and z=-1.0 very good center for Pixel
        var x=-0.25, y= 0 + Yoffset, z=-1.0;

        var loader = new THREE.FontLoader();
        loader.load('AR/third_party/fonts/optimer_bold.typeface.json', function (font) {
            Utils.debug("loading font");
            try {
                Utils.debug("font loaded");

                // var font = response;
                // refreshText();

                // TODO: pose data can be reused? since frame is same anyways and taken already

                if (!pose) {
                    // Fetch the pose data from the current frame
                    var pose = vrFrameData.pose;

                    // Convert the pose orientation and position into
                    // THREE.Quaternion and THREE.Vector3 respectively
                    ori = new THREE.Quaternion(
                        pose.orientation[0],
                        pose.orientation[1],
                        pose.orientation[2],
                        pose.orientation[3]
                    );
                    pos = new THREE.Vector3(
                        pose.position[0],
                        pose.position[1],
                        pose.position[2]
                    );
                } else {
                    // use old one
                }

                dirMtx.makeRotationFromQuaternion(ori);
                // var push = new THREE.Vector3(0, 0, -1.0);

                var push = new THREE.Vector3(x, y, z);
                // var push = new THREE.Vector3(-0.5, 0, -0.5);

                push.transformDirection(dirMtx);

                // var scale = 0.125
                var scale = 0.125;        // smaller -> inwards, bigger -> outwards  from camera
                pos.addScaledVector(push, scale);

                // Clone our cube object and place it at the camera's
                // current position
                // var clone = cube.clone();
                // scene.add(clone);
                // clone.position.copy(pos);
                // clone.quaternion.copy(ori);

                // size: 0.025, height: 0.025



                /*

                textGeo = new THREE.TextGeometry(ARtext, {
                    font: font,
                    size: size,
                    height: height
                });
                textGeo.computeBoundingBox();
                textGeo.computeVertexNormals();      // <<<

                // textGeo.center();

                Utils.debug("after computing vertex");

                var text3D = new THREE.Mesh(textGeo, textMaterial);
                */

                var textGeom = new THREE.TextGeometry( "Hello, World!",
                    {
                        size: 30, height: 4, curveSegments: 3,
                        font: font,
                        // weight: "bold",
                        // style: "normal",
                        bevelThickness: 1, bevelSize: 2, bevelEnabled: true,
                        material: 0, extrudeMaterial: 1
                    });

                var textMaterial = new THREE.MeshFaceMaterial(materialArray);
                var textMesh = new THREE.Mesh(textGeom, textMaterial );

                textGeom.computeBoundingBox();
                var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;

                textMesh.position.set( -0.5 * textWidth, 50, 100 );
                textMesh.rotation.x = -Math.PI / 4;

                // text3D.position.set(0, 90, 90);
                scene.add(textMesh);
                removable_items.push(textMesh);     // garbage collect 3d objects

                // place geometry at camera's current position
                // textMesh.position.copy(pos);
                // textMesh.quaternion.copy(ori);

            } catch(err) {
                Utils.debug(err.message);
            }
        });
    }


    function addAr3dText(ARtext, size, height, Yoffset) {

        Utils.debug("rendering 3d " + ARtext);

        // if scene and camera not ready yet
        if (!canAddARObjectsAlready) {
            return;
        }

        // y=0 for exact middle, x=-0.25 and z=-1.0 very good center for Pixel
        var x=-0.25, y= 0 + Yoffset, z=-1.0;

        // var font = response;
        // refreshText();

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

        dirMtx.makeRotationFromQuaternion(ori);
        // var push = new THREE.Vector3(0, 0, -1.0);

        var push = new THREE.Vector3(x, y, z);
        // var push = new THREE.Vector3(-0.5, 0, -0.5);

        push.transformDirection(dirMtx);
        pos.addScaledVector(push, scale);

        // Clone our cube object and place it at the camera's
        // current position
        // var clone = cube.clone();
        // scene.add(clone);
        // clone.position.copy(pos);
        // clone.quaternion.copy(ori);

        // size: 0.025, height: 0.025



        // textGeo = new THREE.TextGeometry(ARtext, {
        //     font: font,
        //     size: size,
        //     height: height
        // });
        // textGeo.computeBoundingBox();
        // textGeo.computeVertexNormals();
        // // textGeo.center();
        //
        // var text3D = new THREE.Mesh(textGeo, textMaterial);
        //
        // // text3D.position.set(0, 90, 90);
        // scene.add(text3D);
        // removable_items.push(text3D);     // garbage collect 3d objects
        //
        // // place geometry at camera's current position
        // text3D.position.copy(pos);
        // text3D.quaternion.copy(ori);

        // size: , height: 4, curveSegments: 3,


        try {
            var textGeom = new THREE.TextGeometry(ARtext,
                {
                    size: size, height: height,
                    font: font,
                    // weight: "bold",
                    // style: "normal",
                    bevelThickness: 1, bevelSize: 2, bevelEnabled: true,
                    material: 0, extrudeMaterial: 1
                });

            var textMaterial = new THREE.MeshFaceMaterial(materialArray);
            var textMesh = new THREE.Mesh(textGeom, textMaterial );

            textGeom.computeBoundingBox();
            // var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
            //
            // textMesh.position.set( -0.5 * textWidth, 50, 100 );
            // textMesh.rotation.x = -Math.PI / 4;

            // text3D.position.set(0, 90, 90);
            scene.add(textMesh);
            removable_items.push(textMesh);     // garbage collect 3d objects

            // place geometry at camera's current position
            textMesh.position.copy(pos);
            textMesh.quaternion.copy(ori);
        } catch(err) {
            Utils.debug(err.message);
        }


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


    function render3DTextGroup(food_name, nutr_list) {

        // loadFont();

        Utils.smartLog([food_name]);
        Utils.smartLog(nutr_list);

        Utils.debug("rendering 3d ");

        // if scene and camera not ready yet
        if (!canAddARObjectsAlready) {
            return;
        }

        // y=0 for exact middle, x=-0.25 and z=-1.0 very good center for Pixel
        // var x=-0.25, y= 0 + Yoffset, z=-1.0;
        var x=-0.25, z=-1.0;

        // get pose only if not set yet
        if (!pose) {
            Utils.smartLog(["pose not set"]);
            // Fetch the pose data from the current frame
            pose = vrFrameData.pose;

            // Convert the pose orientation and position into
            // THREE.Quaternion and THREE.Vector3 respectively
            ori = new THREE.Quaternion(
                pose.orientation[0],
                pose.orientation[1],
                pose.orientation[2],
                pose.orientation[3]
            );
            pos = new THREE.Vector3(
                pose.position[0],
                pose.position[1],
                pose.position[2]
            );

            dirMtx.makeRotationFromQuaternion(ori);
        } else {
            Utils.smartLog(["pose set"]);
        }

        // AR 3d text must be rendered indiv. with proper offset Y so they would stack
        // up properly in screen

        // render FOOD ITEM NAME


        // render NUTRITION_INFO

        for (var i=0; i < nutr_list.length; i++) {
            // FoodItemName is at 0.5, give
            // start at 0.35, then go down with 0.10 increments

            // calculate offset based on current index
            var Yoffset = ARnutritionInfoYposition - (i*ARnutritionInfoItemYoffset);
            var y= 0 + Yoffset;

            // ArWebModule.addArText(nutr_list[i], ARnutritionInfoItemSize, ARnutritionInfoItemHeight, Yoffset);

            var push = new THREE.Vector3(x, y, z);
            // var push = new THREE.Vector3(-0.5, 0, -0.5);
            // var push = new THREE.Vector3(0, 0, -1.0);

            push.transformDirection(dirMtx);
            pos.addScaledVector(push, scale);

            // Clone our cube object and place it at the camera's
            // current position
            // var clone = cube.clone();
            // scene.add(clone);
            // clone.position.copy(pos);
            // clone.quaternion.copy(ori);

            textGeo = new THREE.TextGeometry(nutr_list[i], {
                font: font,
                size: ARnutritionInfoItemSize,
                height: ARnutritionInfoItemHeight
            });
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();

            var text3D = new THREE.Mesh(textGeo, textMaterial);

            scene.add(text3D);
            removable_items.push(text3D);     // garbage collect 3d objects

            // place geometry at camera's current position
            text3D.position.copy(pos);
            text3D.quaternion.copy(ori);

            Utils.debug("finish this 3d text");
        }

        // reset vars
        pose = null;
        ori = null;
        pos = null;
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
        addArText: addArText,
        cleanARcontent: cleanARcontent,
        render3DTextGroup: render3DTextGroup,
        loadFont: loadFont,
        render3dArText: render3dArText
    };
}();