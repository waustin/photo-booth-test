<template>
    <div class="photo-grabber">
        <camera ref="camera" 
            @photoTaken="onPhotoTaken"
            @cameraOpen="onCameraOpen"
            @cameraClose="onCameraClose"
            @cameraError="onCameraError">
        </camera>

        <div class="crop-wrapper" 
            v-if="cameraImage" key="cropWrapper">

            <vue-cropper
                class="image-cropper"
                ref="cropper"
                :src="cameraImage"
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
                :min-container-height=300
                :min-canvas-height=400
                :min-crop-box-height=100>
            </vue-cropper>
            
            <button type="button" @click.prevent="onCropClick"
                class="button is-primary">Crop</button>
        </div>
    </div>
</template>

<script>
import Camera from '../components/Camera.vue';

import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
    // A tool to let a user grab a photo and crop it
    name: "PhotoGrabber",
    components: {
        Camera,
        VueCropper,
    },  
    props: {
        cropWidth: {
            type: Number,
            required: true,
        },
        cropHeight: {
            type: Number,
            required: false,
        },
    },
    data() {
        return {
            is_camera_open: false,
            errors: null,
            cameraImage: null,
            croppedImage: null,
        }
    },
    computed: {
        cropAspectRatio() {
            return this.cropWidth / this.cropHeight;
        }, 
    },
    created() {
        this.is_camera_open = false;
        this.errors = null;
        this.cameraImage = null;
        this.croppedImage = null;
    },
    mounted() {
        this.$refs.camera.openCamera();
    },
    methods: {
        // Camera Events
        onPhotoTaken(photo) {
            this.cameraImage = photo;
            this.croppedImage = null;
            this.$emit('photoTaken', this.cameraImage);
        },
        onCameraOpen() {
            // the camera state events need to emit back
            this.is_camera_open = true;
        },
        onCameraClose() {
            this.is_camera_open = false;
        },
        onCameraError(err_msg) {
            this.errors = err_msg;
        },

        // Image Cropping
        onCropClick() {
            // this needs to emit back the final photo
            console.log('on crop click');
            this.croppedImage = this.$refs.cropper.getCroppedCanvas({
                width: this.cropWidth, height: this.cropHeight
            }).toDataURL();

            this.needsCrop = false;

            this.$emit('photoCropped', this.croppedImage);
        }, 
    }
}
</script>

<style scoped  lang="scss">
    .image-cropper {
        margin-bottom: 1rem;
    }
</style>