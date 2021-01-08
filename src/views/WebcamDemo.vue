<template>
    <div class="webcam-demo">
        <h1 class="title">Webcam Demo</h1>

        <div class="columns">
            <div class="column">
                <button type="button" class="button" :class="{ 'is-primary' : !isCameraOpen, 'is-danger' : isCameraOpen}" @click="toggleCamera">
                    <span v-if="!isCameraOpen">Open Camera</span>
                    <span v-else>Close Camera</span>
                </button>
            </div>
        </div>

        <div class="columns">
            <div class="column">
                <h3 class="title is-3 mb-2">Camera</h3>
                
                <div v-show="isCameraOpen && isLoading" class="camera-loading">
                    <ul class="loader-circle">
                    <li></li>
                    <li></li>
                    <li></li>
                    </ul>
                </div>

                <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>

                <video 
                    v-show="!isPhotoTaken"
                    class="camera"
                    ref="camera" autoplay
                    :width="450" :height="337.5">
                </video>
            
                <canvas 
                    v-show="isPhotoTaken"
                    class="photo-taken-canvas"
                    id="photoTaken"
                    ref="canvas" :width="450" :height="337.5">
                </canvas>
            </div>
        </div>


        <button 
            v-if="isCameraOpen && !isLoading"
            class="button"
            type="button"
            @click="takePhoto">Take Photo</button>


    </div>
</template>

<script>
export default {
    name: "WebcamDemo",
    data() {
        return {
            isCameraOpen: false,
            isPhotoTaken: false,
            isShotPhoto: false,
            isLoading: false,
            link: '#'
        }
    },
    created() {
        console.log('webcam demo created');
    },
    mounted() {

    },
    methods: {
        toggleCamera() {
            if(this.isCameraOpen) {
                this.isCameraOpen = false;
                this.isPhotoTaken = false;
                this.isShotPhoto = false;
                this.stopCameraStream();
            } else {
                this.isCameraOpen = true;
                this.createCamera();
            }
        },
        createCamera() {
            this.isLoading = true;

            const constraints = (window.constraints = {
                audio: false,
                video: true
            })

            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    this.isLoading = false;
                    this.$refs.camera.srcObject = stream;
                })
                .catch(error => {
                    this.isLoading = false;
                    alert("Browser doese not support camera or there was an error");
                });
        },
        stopCameraStream() {
            let tracks = this.$refs.camera.srcObject.getTracks();
            tracks.forEach(track => { track.stop() });
        },
        takePhoto() {
            if(!this.isPhotoTaken) {
                this.isShotPhoto = true;

                const FLASH_TIMEOUT = 50;

                setTimeout(() => {
                    this.isShotPhoto = false;
                }, FLASH_TIMEOUT);
            }

            this.isPhotoTaken = !this.isPhotoTaken;

            const context = this.$refs.canvas.getContext('2d');
            context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
        },
    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>
    
    .camera-shutter {
        opacity: 0;
        width: 450px;
        height: 337.5px;
        background-color: #fff;
        position: absolute;
        
        &.flash {
            opacity: 1;
        }
    }
    
    .camera-loading {
        overflow: hidden;
        height: 100%;
        position: absolute;
        width: 100%;
        min-height: 150px;
        margin: 3rem 0 0 -1.2rem;
        
        ul {
        height: 100%;
        position: absolute;
        width: 100%;
        z-index: 999999;
        margin: 0;
        }
        
        .loader-circle {
        display: block;
        height: 14px;
        margin: 0 auto;
        top: 50%;
        left: 100%;
        transform: translateY(-50%);
        transform: translateX(-50%);
        position: absolute;
        width: 100%;
        padding: 0;
        
        li {
            display: block;
            float: left;
            width: 10px;
            height: 10px;
            line-height: 10px;
            padding: 0;
            position: relative;
            margin: 0 0 0 4px;
            background: #999;
            animation: preload 1s infinite;
            top: -50%;
            border-radius: 100%;
            
            &:nth-child(2) {
            animation-delay: .2s;
            }
            
            &:nth-child(3) {
            animation-delay: .4s;
            }
        }
        }
    }

    @keyframes preload {
        0% {
            opacity: 1
        }
        50% {
            opacity: .4
        }
        100% {
            opacity: 1
        }
    }
    
</style>