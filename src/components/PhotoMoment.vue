<template>
    <div class="photo-moment">
        <h1>This is the photo moment</h1>
        <div class="columns">
            <div class="column">
                <div class="photo-bg stage" ref="stage" id="stage"
                    @dragover.stop.prevent="dragOverStage"
                    @dragleave.stop.prevent="dragLeaveStage"
                    @drop.stop.prevent="dropStage($event)">

                    <img class="bg-image" 
                        v-if="user_photo"
                        :src="user_photo" />

                    <h1 v-if="!user_photo && !is_dragging">Drop An Image From Your Computer</h1>
                    <h1 v-if="!user_photo && is_dragging">Drop Image Here</h1>
                    <h1 v-if="invalid_image_format">Invalid file type. That was not an Image.</h1>
                
                    <!-- on stage images -->
                    <img class="prop-stage-image"
                         v-for="(prop, idx) in props_on_stage"
                         :key="'stage-prop-' + idx" 
                         :src="prop.src" 
                         :style="{ left: prop.x + '%', top: prop.y + '%' }"
                         draggable="true"
                         @dragstart="startPropMoveDrag($event, prop, idx)"
                         @dragend="stopPropMoveDrag($event, prop, idx)" />
                </div>

                <div v-if="is_prop_move_dragging" class="has-background-danger-dark delete-spot" 
                    @dragover.stop.prevent="dragOverDelete"
                    @dragleave.stop.prevent="dragLeaveDelete"
                    @drop.stop.prevent="dropDelete($event)">
                    <h4>Drop Prop Here to Delete</h4>
                </div>

            </div>
            <div class="column is-two-fifths sidebar">
                <h4>Drag A Prop onto the Stage</h4>
                <div class="prop-list mb-2">
                    <img v-for="(prop, idx) in prop_images" 
                         :key="'prop-' + idx" :src="prop" 
                         @dragstart="startPropAddDrag($event, prop)"
                         @dragend="stopPropAddDrag($event, prop)"
                         draggable="true"/>
                </div>
                <button type="button" class="button is-primary"
                        @click="saveImage">Save</button>

                <hr>
                <div v-if="out_image" class="out-image-wrapper mt-2">
                    <img :src="out_image" />
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
            is_prop_add_dragging: false,
            is_prop_move_dragging: false,
            invalid_image_format: false,
            user_photo: null,
            prop_images: [
                './images/prop-1.png', './images/prop-2.png', 
                './images/prop-3.png', './images/prop-4.png'
            ], // the images that are dragged on top of the stage
            prop_being_dragged: null,
            props_on_stage: [
                // should be an array of dictionaries. { image_src/id, xpos, ypos, zindex?}
            ],
            out_image: null,
        }
    },
    methods: {
        // Adding a prop to the stage
        startPropAddDrag(event, prop) {
            this.is_prop_add_dragging = true;

            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData("propSrc", "FART");

            this.prop_being_dragged = {
                prop: prop,
                drag_type: 'ADD_PROP'
            };
        },
        stopPropAddDrag(event, prop) {
            this.is_prop_add_dragging = false;
            this.prop_being_dragged = null;
        },

        // Prop on Stage Drag Events
        startPropMoveDrag(event, prop, prop_id) {
            this.is_prop_move_dragging = true;
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData("propSrc", "FART");

            this.prop_being_dragged = {
                prop: prop,
                prop_id: prop_id,
                drag_type: 'MOVE_PROP'
            };
        },
        stopPropMoveDrag(event, prop) {
            this.is_prop_move_dragging = false;
            this.prop_being_dragged = null;
            console.log('stopPropMoveDrag()')
        },

        // Stage Drag events
        dragOverStage(event) {
          this.is_dragging = true;
        },
        dragLeaveStage(event) {
            console.log('dragLeaveStage');
            this.is_dragging = false;
        },
        dropStage(event){
            console.log('dropStage');
            this.is_dragging = false;

            // For when a file background is dropped
            let files = event.dataTransfer.files;
            if(files.length == 1 ) {
                // Limit to one file
                let file = files[0];
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
                if( this.prop_being_dragged.drag_type == 'ADD_PROP') {
                    let stageProp = {
                        x: (event.offsetX / event.target.offsetWidth) * 100, //(event.offsetX / event.target.width) * 100,
                        y: (event.offsetY / event.target.offsetHeight) * 100,
                        src: this.prop_being_dragged.prop, // event.dataTransfer.getData("propSrc");
                    };
                    this.props_on_stage.push(stageProp);
                } else if( this.prop_being_dragged.drag_type == 'MOVE_PROP') {
                    console.log('MOVE PROP');
                    // Find prop on list and change its x y
                    let prop = this.props_on_stage[this.prop_being_dragged.prop_id];
                    prop.x = (event.offsetX / event.target.offsetWidth) * 100;
                    prop.y = (event.offsetY / event.target.offsetHeight) * 100;
                }
            }
        },
        // Drop on parent is how we can delete an item
        dragOverDelete($event) {
            console.log('dragOverDelete');
        },
        dragLeaveDelete($event) {
            console.log('dragLeaveDelete');
        },
        dropDelete($event) {
            console.log('dropDelete');
            // If we are are moving a prop and it is dropped any where other than the stage, delete it
            if(this.prop_being_dragged && this.prop_being_dragged.drag_type == 'MOVE_PROP') {
                this.props_on_stage.splice(this.prop_being_dragged.prop_id, 1);
            }
        },
        // Try to save the image
        async saveImage() {
            const stageEl = this.$refs.stage;
            const options = {
                type: 'dataURL'
            };
            this.out_image = await this.$html2canvas(stageEl, options);
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
        img.prop-stage-image {
            width: 60px;
            transform: translate(-50%, -50%);
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
    .delete-spot {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
        h4 {
            text-align: center;
            color: white;
            text-transform: uppercase;
            margin-bottom: 0;
            line-height: 1;
            font-size: 1.2rem;
        }
    }
    .out-image-wrapper {
        padding: 4px;
        background-color: white;
        border: 2px solid #999;
    }
</style>