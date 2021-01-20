<template>
    <div class="modal is-active" v-if="show">
        <div class="modal-background"></div>
            <div class="modal-content">
                <slot></slot>
            </div>
            <button class="modal-close is-large" aria-label="close"
                    @click="$emit('close')"></button>
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
    .modal {
        z-index: 1000;
    }
</style>