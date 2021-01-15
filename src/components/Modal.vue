<template>
  <div class="modal" v-show="show">
    <div class="modal-background"></div>
    <div class="modal-content">
        <h1>In the modal</h1>
       <slot></slot>
    </div>
    <button class="modal-close is-large" aria-label="close"
            @class="$emit('close')"></button>
</div>
</template>

<script>
export default {
    name: "Modal", // A Bluma based modal
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false,
        }
    },
    data() {
        return {

        };
    },
    computed: {

    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>

</style>