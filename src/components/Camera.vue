<template>
    <div class="camera-wrapper" v-show="is_camera_open">
        <div class="camera-image-wrapper">
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
        </div>

        <button 
            v-if="canTakePhoto"
            class="button is-rounded is-info"
            type="button"
            @click="takePhoto">
            <span class="icon"><i class="fas fa-camera"></i></span>    
        </button>
    </div>
</template>

<script>
export default {
    name: "Camera",
    data: function() {
        return {
            is_camera_loading: false,
            is_camera_open: false,
            has_camera_taken_photo: false,
            show_canvas: false,

            error: null,

            cam: {
                width: 1000,
                height: 750,
            },
        }
    },
    methods: {
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

            try {
                let stream = await navigator.mediaDevices.getUserMedia(constraints);
                this.is_camera_loading = false;
                this.is_camera_open = true;
                this.$refs.camera.srcObject = stream;
            }
            catch(error){
                this.is_camera_loading = false;
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
            
            const context = this.$refs.canvas.getContext('2d');
            context.drawImage(this.$refs.camera, 0, 0, this.cam.width, this.cam.height);
            this.user_photo = this.$refs.canvas.toDataURL();

            this.closeCamera();
        }
    },
    computed: {
        canTakePhoto() {
            return this.is_camera_open && !this.is_camera_loading;
        }
    }
}
</script>

<style lang="scss" scoped>
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