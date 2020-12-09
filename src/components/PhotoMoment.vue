<template>
    <div class="photo-moment">
        <h1>This is the photo moment</h1>
        <div class="columns">
            <div class="column">
                <div class="photo-bg stage" ref="stage" id="stage"
                    @dragover.prevent="dragOver"
                    @dragleave.prevent="dragLeave"
                    @drop.prevent="drop($event)">

                    <img class="bg-image" 
                        v-if="user_photo"
                        :src="user_photo" />

                    <h1 v-if="!user_photo && !is_dragging">Drop An Image</h1>
                    <h1 v-if="invalid_image_format">Invalid file type. That was not an Image.</h1>
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
            invalid_image_format: false,
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
            this.is_dragging = false;

            let files = event.dataTransfer.files;
            if(files.length == 1 ) {
                // Limit to one file
                let file = files[0];
                console.log(file.type)
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
        overflow: hidden;
        padding: 4px;
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        img {
            max-width: 100%;
            position: absolute;
        }
        img.bg-image {
            top: 0;
            left: 0;
        }
    }
</style>