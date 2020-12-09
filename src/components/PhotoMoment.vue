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
                
                    <!-- on stage images -->
                    <img class="prop-stage-image"
                         v-for="(prop, idx) in props_on_stage"
                         :key="'stage-prop-' + idx" 
                         :src="prop.src" 
                         />

                <!-- :style="{ left: prop.x + '%', top: prop.y + '%' }"/> -->
                </div>
            </div>
            <div class="column is-two-fifths sidebar">
                <h4>Drag A Prop onto the Stage</h4>
                <div class="prop-list">
                    <img v-for="(prop, idx) in prop_images" 
                         :key="'prop-' + idx" :src="prop" 
                         @dragstart="startPropDrag($event, prop)"
                         @dragend="stopPropDrag($event, prop)"
                         draggable="true"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// TODO: figure out how to distinguish image drops vs prop drops
// How to clear out the prop being dragged
export default {
    name: "PhotoMoment",
    data: function() {
        return {
            is_dragging: false,
            invalid_image_format: false,
            user_photo: null,
            prop_images: [
                './images/prop-1.png', './images/prop-2.png', 
                './images/prop-3.png', './images/prop-4.png'
            ], // the images that are dragged on top of the stage
            prop_being_dragged: null,
            props_on_stage: [
                // should be an array of dictionaries. { image_src/id, xpos, ypos, zindex?}
            ]
        }
    },
    methods: {
        startPropDrag(event, prop) {
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData("propSrc", "FART");

            this.prop_being_dragged = prop;

            console.log('startPropDrag');
            console.log(event.dataTransfer);
            console.log(event.dataTransfer.types);
            console.log(event.dataTransfer.items[0]);
            console.log('--------');
        },
        stopPropDrag(event, prop) {
            this.prop_being_dragged = null;
        },
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

            // For when a file background is dropped
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
            else if(this.prop_being_dragged) {
            
                // Check for dropping of props
                console.log(event);

                let stageProp = {};
                stageProp.x = event.clientX;
                stageProp.y = event.clientY;
    /*
                let propSrc = event.dataTransfer.getData("propSrc");
                stageProp.src = propSrc;
                */
                stageProp.src = this.prop_being_dragged;

                this.props_on_stage.push(stageProp);
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
            display: block;
        }
        img.bg-image {
            top: 0;
            left: 0;
            z-index: 0;
        }
    }
    .sidebar {
        h4 {
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }
    }
    .prop-list {
        border: 1px solid #999;
        padding: 1rem;
        img {
            display: block;
            margin-bottom: 0.5rem;
            width: 100px;
            &:hover {
                cursor: grabbing;
            }
        }
    }
</style>