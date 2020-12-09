<template>
    <div class="photo-moment">
        <h1>This is the photo moment</h1>
        <div class="columns">
            <div class="column">
                <div class="photo-bg stage" ref="stage" id="stage"
                    @dragover.prevent="dragOver"
                    @dragleave.prevent="dragLeave"
                    @drop.prevent="drop($event)">

                    <img class="bg-image" v-if="user_photo"/>
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
            is_dragging: false,
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
          this.is_dragging = true;
        },
        dragLeave(event) {
            console.log('dragLeave');
            this.is_dragging = false;
        },
        drop(event){
            console.log('drop');

            let files = event.dataTransfer.files;
            if(files.length == 1 ) {
                // Limit to one file
                let file = files[0];
                console.log(file.type)
                if(file.type.startsWith('image/')) {

                    let reader = new FileReader();
                    reader.onload = (f) => {
                        let src = f.target.result;
                        console.log('File Loaded');
                    }
                    reader.readAsDataURL(file);
                    
                } else {
                    // File is not an image, show an error
                }
            }
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