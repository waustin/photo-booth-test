<template>
  <div class="crop-test">
      <h1 class="title">Crop Test</h1>

      <section>
        <div class="column">
            <!--
            <img id="image" :src="`${publicPath}images/person.jpg`" />
            <hr/>
            -->
            <vue-cropper
                ref="cropper"
                :src="`${publicPath}images/person.jpg`"
                :guides="true"
                :aspectRatio="cropAspectRatio"
                :view-mode="2"
                drag-mode="crop"
                :auto-crop-area="0.5"
                min-container-width="250"
                :min-container-height="180"
                :background="true"
                :rotatable="true"
                alt="Source Image">
            </vue-cropper>
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
            cropAspectRatio: 1080/1350, // Insta dimensions 1080 x 1350
        }
    }
}
</script>

<style>

</style>