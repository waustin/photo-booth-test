<template>
  <div class="crop-test">
      <h1 class="title">Crop Test</h1>

      <section>
          <div class="columns">
            <div class="column">
            
                <vue-cropper
                    class="mb-2"
                    ref="cropper"
                    :src="`${publicPath}images/person.jpg`"
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
                    :min-crop-box-height=100
                    @ready="cropperReady">
                </vue-cropper>
<!--
:min-container-height=400
    -->
                <button type="button" @click.prevent="onCropClick"
                    class="button">Crop</button>
            </div>
            <div class="column">
                    <h2>Output</h2>
                    <div v-if="croppedImage" class="cropped-img-wrapper">
                        <img class="cropped-img" :src="croppedImage" />
                    </div>
            </div>
          </div>
      </section>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
    name: "ImageCropTest",
    components: {
        VueCropper,
    },
    data: function() {
        return {
            publicPath: process.env.BASE_URL,
            cropWidth: 1080, // Insta dimensions 1080 x 1350
            cropHeight: 1350,
            
            croppedImage: null,
        }
    },
    methods: {
        onCropClick() {
            console.log('on crop click');
            this.croppedImage = this.$refs.cropper.getCroppedCanvas({
                width: this.cropWidth, height: this.cropHeight
            }).toDataURL();
        },   
        cropperReady() {
            console.log('cropper ready')
            //this.$refs.cropper.setCropBoxData(200, 300);
        }
    },
    computed: {
        cropAspectRatio() {
            return this.cropWidth / this.cropHeight;
        }, 
    }
}
</script>

<style>

</style>