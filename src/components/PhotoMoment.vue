<template>
    <div class="photo-moment">
        <h1>This is the photo moment</h1>
        <div class="columns">
            <div class="column">
                <div class="photo-bg">
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