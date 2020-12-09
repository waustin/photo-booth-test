<template>
    <div class="photo-moment">
        <h1>This is the photo moment</h1>
        <div class="columns">
            <div class="column">
                <div class="photo-bg stage" ref="stage" id="stage"
                    @dragover.prevent="dragOver"
                    @dragleave.prevent="dragLeave"
                    @drop.prevent="drop($event)">
                </div>
            </div>
            <div class="column is-two-fifths">
                <p>Sidebar</p>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "PhotoMoment",
    data: function() {
        return {
            user_photo: null,
            draggable_images: [], // the images that are dragged on top of the stage
            drag_images_on_stage: [
                // should be an array of dictionaries. { image_src/id, xpos, ypos, zindex?}
            ]
        }
    },
    methods: {
        dragOver(event) {
          //  console.log('dragOver');
        },
        dragLeave(event) {
            console.log('dragLeave');
        },
        drop(event){
            console.log('drop');

            let files = event.dataTransfer.files;
            let file = files[0];

            let reader = new FileReader();
            reader.onload = (f) => {
                let src = f.target.result;
                console.log('File Loaded');
            }
            reader.readAsDataURL(file);
        }
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
  }
</style>