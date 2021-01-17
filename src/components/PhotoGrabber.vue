<template>
    <div class="photo-grabber">
        <camera ref="new_camera" 
            @photoTaken="onPhotoTaken"
            @cameraOpen="onCameraOpen"
            @cameraClose="onCameraClose"
            @cameraError="onCameraError">
        </camera>

        <div class="crop-wrapper" 
            v-if="userImage && needsCrop" key="cropWrapper">

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
                :min-container-height=300
                :min-canvas-height=400
                :min-crop-box-height=100>
            </vue-cropper>

            <button type="button" @click.prevent="onCropClick"
                class="button">Crop</button>
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
            camera_image: null,
            cropped_image: null,
        }
    },
    computed: {
        cropAspectRatio() {
            return this.cropWidth / this.cropHeight;
        }, 
    },
    methods: {
        // Camera Events
        onPhotoTaken(photo) {
            this.camera_image = photo;
            this.cropped_image = null;
        },
        onCameraOpen() {
            // the camera state events need to emit back
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
            // this needs to emit back the final photo
            console.log('on crop click');
            this.croppedImage = this.$refs.cropper.getCroppedCanvas({
                width: this.cropWidth, height: this.cropHeight
            }).toDataURL();

            this.userImage = this.croppedImage;
            this.needsCrop = false;
        }, 
    }
}
</script>

<style scoped  lang="scss">

</style>