<template>
    <div class="photo-moment">
        <h1 class="mb-2">Photo Moment Test</h1>
        <section class="section">
            <button type="button" @click="openCamera"
                    class="button is-info">Open Camera</button>
        </section>
        <div class="columns">
            <div class="column">
                <div class="stage-nav is-flex felx-direction-row is-justify-content-center is-align-content-center mb-4">
                    
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
                </div>

               

                <div class="photo-stage-wrapper" v-show="showPhotoStage">
                    <div class="photo-bg stage mb-4" ref="stage" id="stage"
                        @dragover.stop.prevent="dragOverStage"
                        @dragleave.stop.prevent="dragLeaveStage"
                        @drop.stop.prevent="dropStage($event)">

                        <img class="bg-image" v-if="userImage && !needsCrop" :src="userImage" />

                        <div class="crop-wrapper" 
                             v-show="userImage && needsCrop">
                                <vue-cropper
                                    class="bg-image bg-image-cropping"
                                    ref="cropper"
                                    :src="userImage"
                                    :guides=true
                                    :aspectRatio="cropAspectRatio"
                                    :background=true 
                                    :responsive=true
                                    :movable=true
                                    :rotatable=false
                                    :view-mode=2
                                    drag-mode="crop"
                                    :auto-crop-area=0.5
                                    :min-container-width=250
                                    :min-container-height=300>
                                </vue-cropper>

                                <button type="button" @click.prevent="onCropClick"
                                    class="button">Crop</button>
                        </div>


                        <div v-if="!userImage" class="instructions">
                            <h1>You can drop a photo here</h1>
                        </div>

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
                <div v-if="outImage" class="out-image-wrapper mt-2">
                    <img :src="outImage" class="mb-3"/>
                    <a download="your-image.png" 
                        :href="outImage" class="button is-success">Download Image</a>
                </div>
            </div>
        </div>
       
        <modal ref="modalCamera" :show="show_camera_modal" @close="show_camera_modal = false">
            <div class="box">
                 <camera ref="new_camera" 
                    @photoTaken="onPhotoTaken"
                    @cameraOpen="onCameraOpen"
                    @cameraClose="onCameraClose"
                    @cameraError="onCameraError">
                </camera>
            </div>
        </modal>
       
    </div>
</template>

<script>
// TODO: figure out how to distinguish image drops vs prop drops
// How to clear out the prop being dragged

import Camera from '../components/Camera.vue';
import Modal from '../components/Modal.vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
    name: "PhotoMoment",
    components: {
        Camera,
        Modal,
        VueCropper,
    },
    data: function() {
        return {
            app_state: 'INIT',

            is_camera_open: false,
            errors: null,

            needsCrop: false,

            userImage: null,
            croppedImage: null,
            outImage: null,

            cropWidth: 1080, // Insta dimensions 1080 x 1350
            cropHeight: 1350,

            is_dragging: false,
            is_prop_add_dragging: false,
            is_prop_move_dragging: false,
            invalid_image_format: false,


            // show camera modal,
            show_camera_modal: false,

            // Prop Stuff
            
            prop_images: [
                './images/prop-1.png', './images/prop-2.png', 
                './images/prop-3.png', './images/prop-4.png'
            ], // the images that are dragged on top of the stage
            prop_being_dragged: null,
            props_on_stage: [
                // should be an array of dictionaries. { image_src/id, xpos, ypos, zindex?}
            ],
            
        }
    },
    methods: {
        readUserFile(file) {
            if( file.type.startsWith('image/') ) {
                this.invalid_image_format = false;
                let reader = new FileReader();
                reader.onload = (f) => {
                    this.userImage = f.target.result;
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
            this.outImage = await this.$html2canvas(stageEl, options);
        },


        // Upload Photo from Device
        pickPhoto(event) {
            // pick a local photo to add to stage
            console.log('Pick Photo');

            let files = event.target.files;
            if( files.length > 0 ) {
                this.readUserFile(files[0]);
            }
        },

        // Webcam Methods and Events
        async openCamera() {
            await this.$refs.new_camera.openCamera();
        },
        onPhotoTaken(photo) {
            this.userImage = photo;
            this.needsCrop = true;
        },
        onCameraOpen() {
            this.is_camera_open = true;
            this.show_camera_modal = true;
        },
        onCameraClose() {
            this.is_camera_open = false;
            this.show_camera_modal = false;
        },
        onCameraError(err_msg) {
            this.errors = err_msg;
        },

        // Image Cropping
        onCropClick() {
            console.log('on crop click');
            this.croppedImage = this.$refs.cropper.getCroppedCanvas({
                width: this.cropWidth, height: this.cropHeight
            }).toDataURL();
        }, 
       
    },
    computed: {
        showPhotoStage() {
            return !this.is_camera_open
        },
        cropAspectRatio() {
            return this.cropWidth / this.cropHeight;
        }, 
        canCropPhoto() {
            return this.userImage && !this.croppedImage
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

        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
    
        img {
            max-width: 100%;
            display: block;
            width: 100%;
            height: auto;
        }
        
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
        .instructions {
           
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
    .camera-image-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 1rem;
        border: 1px solid #666;
        background-color: #222;
   
        .camera {
            display: block;
        }
    }
</style>