<template>
  <div id="app">
      <div id="nav" v-show="true">
        <router-link :to="{ name: 'photo-moment' }">Photo Moment</router-link> |
        <router-link :to="{ name: 'webcam-demo' }">Webcam Demo</router-link> | 
        <router-link to="/background-remove">Background Test</router-link> | 
        <router-link :to="{ name: 'crop-test' }">Crop Test</router-link> | 

      </div>
      <section class="section">
          <router-view />
      </section>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
