<template>
    <div class="photo-moment">
        <h1 class="mb-2">Photo Moment Test</h1>
        <div class="columns">
            <div class="column">
                <div class="stage-nav is-flex felx-direction-row is-justify-content-center is-align-content-center mb-4">
                    <div class="mr-2">Drag a Photo <span class="sep"> OR </span></div>
                    <div class="file">
                        <label class="file-label">
                            <input class="file-input" type="file" @change="pickPhoto">
                            <span class="file-cta">
                            <span class="file-icon">
                                <i class="fas fa-upload"></i>
                            </span>
                            <span class="file-label">
                                Pick a Photo&hellip;
                            </span>
                            </span>
                        </label>
                    </div>
                    <div class="ml-2">
                        <span class="sep">OR</span> 
                        <button 
                            class="button"
                            :class="{ 'is-primary' : !is_camera_open, 'is-danger' : is_camera_open}"
                            @click="toggleCamera" type="button" >
                            <span v-if="!is_camera_open">Open Camera</span>
                            <span v-else>Close Camera</span>
                        </button>
                    </div>
                </div>

                <div class="camera-wrapper" v-show="is_camera_open">
                    <video 
                        class="camera"
                        ref="camera" autoplay
                        :width="cam.width" :height="cam.height">
                    </video>

                    <canvas 
                        v-show="show_canvas"
                        class="photo-taken-canvas"
                        id="photoTaken"
                        ref="canvas" :width="cam.width" :height="cam.height">
                    </canvas>

                    <button 
                        v-if="canTakePhoto"
                        class="button is-rounded is-info"
                        type="button"
                        @click="takePhoto">
                        <span class="icon"><i class="fas fa-camera"></i></span>    
                    </button>
                </div>

                <div class="photo-stage-wrapper" v-show="showPhotoStage">

                    <div class="photo-bg stage mb-4" ref="stage" id="stage"
                        @dragover.stop.prevent="dragOverStage"
                        @dragleave.stop.prevent="dragLeaveStage"
                        @drop.stop.prevent="dropStage($event)">

                        <img class="bg-image" v-if="user_photo" :src="user_photo" />

<!--
                        <h1 v-if="!user_photo && !is_dragging">Drop An Image From Your Computer</h1>
                        <h1 v-if="!user_photo && is_dragging">Drop Image Here</h1>
                        <h1 v-if="invalid_image_format">Invalid file type. That was not an Image.</h1>
                    -->
                        <!-- on stage images -->
                        <img class="prop-stage-image"
                            v-for="(prop, idx) in props_on_stage"
                            :key="'stage-prop-' + idx" 
                            :src="prop.src" 
                            :style="{ left: prop.x + '%', top: prop.y + '%' }"
                            draggable="true"
                            @dragstart="startPropMoveDrag($event, prop, idx)"
                            @dragend="stopPropMoveDrag($event, prop, idx)" />
                    </div>
                </div>

                <div v-if="is_prop_move_dragging" class="has-background-danger-dark delete-spot" 
                    @dragover.stop.prevent="dragOverDelete"
                    @dragleave.stop.prevent="dragLeaveDelete"
                    @drop.stop.prevent="dropDelete($event)">
                    <h4>Drop Prop Here to Delete</h4>
                </div>

            </div>
            <div class="column is-two-fifths sidebar">
                <h4>Drag A Prop onto the Stage</h4>
                <div class="prop-list mb-2">
                    <img v-for="(prop, idx) in prop_images" 
                         :key="'prop-' + idx" :src="prop" 
                         @dragstart="startPropAddDrag($event, prop)"
                         @dragend="stopPropAddDrag($event, prop)"
                         draggable="true"/>
                </div>
                
                <button type="button" class="button is-primary"
                        @click="saveImage">Save</button>

                <hr>
                <div v-if="out_image" class="out-image-wrapper mt-2">
                    <img :src="out_image" class="mb-3"/>
                    <a download="your-image.png" 
                        :href="out_image" class="button is-success">Download Image</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// TODO: figure out how to distinguish image drops vs prop drops
// How to clear out the prop being dragged
export default {
    name: "PhotoMoment",
    data: function() {
        return {
            is_camera_loading: false,
            is_camera_open: false,
            has_camera_taken_photo: false,
            show_canvas: false,

            cam: {
                width: 1000,
                height: 750,
                error: null,
            },

            is_dragging: false,
            is_prop_add_dragging: false,
            is_prop_move_dragging: false,
            invalid_image_format: false,
            user_photo: null,
            prop_images: [
                './images/prop-1.png', './images/prop-2.png', 
                './images/prop-3.png', './images/prop-4.png'
            ], // the images that are dragged on top of the stage
            prop_being_dragged: null,
            props_on_stage: [
                // should be an array of dictionaries. { image_src/id, xpos, ypos, zindex?}
            ],
            out_image: null,
        }
    },
    methods: {
        readUserFile(file) {
            if( file.type.startsWith('image/') ) {
                this.invalid_image_format = false;
                let reader = new FileReader();
                reader.onload = (f) => {
                    this.user_photo = f.target.result;
                    console.log('File Loaded');
                }
                reader.readAsDataURL(file);

            } else {
                // File is not an image, show an error
                this.invalid_image_format = true;
            }
        },
        // Adding a prop to the stage
        startPropAddDrag(event, prop) {
            this.is_prop_add_dragging = true;

            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData("propSrc", "FART");

            this.prop_being_dragged = {
                prop: prop,
                drag_type: 'ADD_PROP'
            };
        },
        stopPropAddDrag(event, prop) {
            this.is_prop_add_dragging = false;
            this.prop_being_dragged = null;
        },

        // Prop on Stage Drag Events
        startPropMoveDrag(event, prop, prop_id) {
            this.is_prop_move_dragging = true;
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData("propSrc", "FART");

            this.prop_being_dragged = {
                prop: prop,
                prop_id: prop_id,
                drag_type: 'MOVE_PROP'
            };
        },
        stopPropMoveDrag(event, prop) {
            this.is_prop_move_dragging = false;
            this.prop_being_dragged = null;
            console.log('stopPropMoveDrag()')
        },

        // Stage Drag events
        dragOverStage(event) {
          this.is_dragging = true;
        },
        dragLeaveStage(event) {
            console.log('dragLeaveStage');
            this.is_dragging = false;
        },
        dropStage(event){
            console.log('dropStage');
            this.is_dragging = false;

            // For when a file background is dropped
            let files = event.dataTransfer.files;
            if(files.length == 1 ) {
                // Limit to one file
                this.readUserFile(files[0]);
            } else if(this.prop_being_dragged) {
                // Check for dropping of props
                if( this.prop_being_dragged.drag_type == 'ADD_PROP') {
                    let stageProp = {
                        x: (event.offsetX / event.target.offsetWidth) * 100, //(event.offsetX / event.target.width) * 100,
                        y: (event.offsetY / event.target.offsetHeight) * 100,
                        src: this.prop_being_dragged.prop, // event.dataTransfer.getData("propSrc");
                    };
                    this.props_on_stage.push(stageProp);
                } else if( this.prop_being_dragged.drag_type == 'MOVE_PROP') {
                    console.log('MOVE PROP');
                    // Find prop on list and change its x y
                    let prop = this.props_on_stage[this.prop_being_dragged.prop_id];
                    prop.x = (event.offsetX / event.target.offsetWidth) * 100;
                    prop.y = (event.offsetY / event.target.offsetHeight) * 100;
                }
            }
        },
        // Drop on parent is how we can delete an item
        dragOverDelete($event) {
            console.log('dragOverDelete');
        },
        dragLeaveDelete($event) {
            console.log('dragLeaveDelete');
        },
        dropDelete($event) {
            console.log('dropDelete');
            // If we are are moving a prop and it is dropped any where other than the stage, delete it
            if(this.prop_being_dragged && this.prop_being_dragged.drag_type == 'MOVE_PROP') {
                this.props_on_stage.splice(this.prop_being_dragged.prop_id, 1);
            }
        },
        // Try to save the image
        async saveImage() {
            const stageEl = this.$refs.stage;
            const options = {
                type: 'dataURL',
                windowWidth: 1600,
                //windowHeight: 600,
            };
            this.out_image = await this.$html2canvas(stageEl, options);
        },


        pickPhoto(event) {
            // pick a local photo to add to stage
            console.log('Pick Photo');

            let files = event.target.files;
            if( files.length > 0 ) {
                this.readUserFile(files[0]);
            }
        },
        // Webcam stuff
        async toggleCamera() {
            if( this.is_camera_open ) {
                // Close the camera
                this.closeCamera();
            } else {
                // Open the camera
                this.openCamera();
            }
        },
        async openCamera() {
            console.log('open camera');

            this.cam.error = null; // clear camera errors;
            this.is_camera_loading = true;
            const constraints =  {
                audio: false,
                video: { facingMode: "user" }, // front facing camera on phones
            };

            try{
                let stream = await navigator.mediaDevices.getUserMedia(constraints);
                this.is_camera_loading = false;
                this.is_camera_open = true;
                this.$refs.camera.srcObject = stream;
            }
            catch(error){
                this.isLoading = false;
                let err_msg = "Error Opening Camera: "
                if(error.name == "NotFoundError" || error.name == "DevicesNotFoundError") {
                    // required track is missing 
                    err_msg += "No Camera Found";
                } else if (error.name == "NotReadableError" || error.name == "TrackStartError") {
                    // webcam or mic are already in use 
                    err_msg += "Camera Already In-Use";
                } else if (error.name == "OverconstrainedError" || error.name == "ConstraintNotSatisfiedError") {
                    // constraints can not be satisfied by avb. devices 
                    err_msg += "Camera unable to meet application requirement constraints";
                } else if (error.name == "NotAllowedError" || error.name == "PermissionDeniedError") {
                    // permission denied in browser 
                    err_msg += "Permission Denined";
                } else if (error.name == "TypeError" || error.name == "TypeError") {
                    // empty constraints object 
                    err_msg += "Empty Media Constraints";
                } else {
                    // other errors 
                    err_msg += "Unspecified Error";
                }
                
                console.log(err_msg);
                console.log(error.message);

                this.cam.error = err_msg;
                alert(err_msg);
            }
        },
        async closeCamera() {
            console.log('close camera');
            this.cam.error = null; // clear camera errors
            this.is_camera_loading = false;
            this.is_camera_open = false;

            let tracks = this.$refs.camera.srcObject.getTracks();
			tracks.forEach(track => {
				track.stop();
			});
        },
        takePhoto() {
            console.log('take photo');
            /*
            if(!this.isPhotoTaken) {
                this.isShotPhoto = true;

                const FLASH_TIMEOUT = 50;

                setTimeout(() => {
                    this.isShotPhoto = false;
                }, FLASH_TIMEOUT);
            }
            */

           const context = this.$refs.canvas.getContext('2d');
           context.drawImage(this.$refs.camera, 0, 0, this.cam.width, this.cam.height);
           this.user_photo = this.$refs.canvas.toDataURL();

           this.is_camera_open = false;
        }
    },
    computed: {
        showPhotoStage() {
            return !this.is_camera_open;
        },
        canTakePhoto() {
            return this.is_camera_open;
        }
    }
}
</script>

<style lang="scss" scoped>

    .photo-bg {
        position: relative;
        min-height: 400px;
        border: 2px solid #666;
        background-color: #CCC;
        overflow: hidden;
        /*
        width: 100%;
        min-height: 400px;
        height: 600px;
        display: block;
        border: 2px solid #666;
        background-color: #CCC;
        overflow: hidden;
        padding: 4px;
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        */
        img {
            max-width: 100%;
           // position: absolute;
            display: block;
            width: 100%;
            height: auto;
        }
        /*
        img.bg-image {
            top: 0;
            left: 0;
            z-index: 0;
        }*/
        img.prop-stage-image {
            position: absolute;
            height: auto;
            display: block;
            width: 60px;
            transform: translate(-50%, -50%);
            &:hover {
                cursor: grab;
            }
            &:active {
                cursor: grabbing;
            }
        }
    }
    .sidebar {
        h4 {
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }
    }
    .prop-list {
        border: 1px solid #999;
        padding: 1rem;
        img {
            display: block;
            margin-bottom: 0.5rem;
            width: 100px;
            &:hover {
                cursor: grab;
            }
            &:active {
                cursor: grabbing;
            }
        }
    }
    .delete-spot {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
        h4 {
            text-align: center;
            color: white;
            text-transform: uppercase;
            margin-bottom: 0;
            line-height: 1;
            font-size: 1.2rem;
        }
    }
    .out-image-wrapper {
        padding: 4px;
        background-color: white;
        border: 2px solid #999;
    }

    .overlays {
        .overlay {
            padding: 20px;
            display: flex;
            flex-direction: row;
            justify-content:  center;
            align-items: center;
            border: 1px solid #555;
            width: 80px;
            height: 80px;
            font-size: 0.9rem;
            &:hover {
                cursor: pointer;
            }
        }
    }

    .stage-overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 1000000;
    }

    .stage-nav {
        .sep {
            font-style: italic;
            color: #999;
            padding: 0 0.5rem;
        }
    }
    // Camera Stuff
    video {
        display: block;
    }
    .camera-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .camera {
        margin-bottom: 2rem;
        border: 2px solid #666;
        padding: 2px;
        background-color: #222;
    }
</style>