<template>
    <div class="photo-moment background-remove">
        <h1>This is the Background Removal photo moment</h1>
        <div class="columns">
            <div class="column">
                


                <div  class="photo-bg stage mb-2" ref="stage" id="stage"
                    @dragover.stop.prevent="dragOverStage"
                    @dragleave.stop.prevent="dragLeaveStage"
                    @drop.stop.prevent="dropStage($event)">

                     <img class="bg-image" id="BgImage"
                        v-if="user_photo"
                        :src="user_photo" />


                    <h1 v-if="!user_photo && !is_dragging">Drop An Image From Your Computer</h1>
                    <h1 v-if="!user_photo && is_dragging">Drop Image Here</h1>
                    <h1 v-if="invalid_image_format">Invalid file type. That was not an Image.</h1>
                </div>

                <div class="mb-4">
                    <!--img id="image" :src="`${publicPath}images/person.jpg`" />-->
                    <canvas id="canvas"></canvas>
                </div>
        

            </div>
            <div class="column is-two-fifths sidebar">
                
                <div class="mb-2">
                    <button type="button" class="button is-info"
                        @click="doPersonSegment">Remove Photo Background</button>
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
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix'; 


let bodyPixNet = null;


export default {
    name: "BackgroundRemove",
    data: function() {
        return {
            publicPath: process.env.BASE_URL,
            is_dragging: false,
            invalid_image_format: false,
            user_photo: null,  
            out_image: null,
        }
    },
    created() {
        console.log('created');
        this.loadAndUseBodyPix();
    },
    methods: {
        async loadAndUseBodyPix() {
            tf.getBackend();
            console.log('Body Pix Load Start');
            bodyPixNet = await bodyPix.load();
            console.log( 'Body Pix Loaded');
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
                let file = files[0];
                if(file.type.startsWith('image/')) {
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
            } 
            else if(this.prop_being_dragged) {
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

        async doPersonSegment() {
            const outputStride = 16;
            const segmentationThreshold = 0.5;

            console.log('Body Pix: ');
            console.log(bodyPixNet);

            //const img = document.getElementById('image');
            //const img = this.user_photo;
            const img = document.getElementById('BgImage');

            console.log('image');
            console.log(img);

            const segmentation = await bodyPixNet.segmentPerson(
                                        img);

            console.log(segmentation);
            const coloredPartImage = bodyPix.toMask(segmentation);
            const opacity = 0.7;
            const flipHorizontal = false;
            const maskBlurAmount = 0;
            const canvas = document.getElementById('canvas');
            // Draw the mask image on top of the original image onto a canvas.
            // The colored part image will be drawn semi-transparent, with an opacity of
            // 0.7, allowing for the original image to be visible under.
            bodyPix.drawMask(
                canvas, img, coloredPartImage, opacity, maskBlurAmount,
                flipHorizontal);
            

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
    }
}
</script>

<style lang="scss" scoped>
    .photo-bg {
        width: 100%;
        height: 400px;
        display: block;
        border: 2px solid #666;
        background-color: #CCC;
        overflow: hidden;
        padding: 4px;
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        img {
            max-width: 100%;
            position: absolute;
            display: block;
        }
        img.bg-image {
            top: 0;
            left: 0;
            z-index: 0;
        }
        img.prop-stage-image {
            width: 60px;
            transform: translate(-50%, -50%);
        }
    }
    .sidebar {
        h4 {
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }
    }
   
    .out-image-wrapper {
        padding: 4px;
        background-color: white;
        border: 2px solid #999;
    }
</style>