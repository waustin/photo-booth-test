<template>
  <div class="modal"
       :class="{ 'is-active': show }">
    <div class="modal-background"></div>
    <div class="modal-content">
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