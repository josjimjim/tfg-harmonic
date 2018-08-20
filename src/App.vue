<template>

  <div id="app">
    <nav-bar></nav-bar>
    <section class="section">
      <router-view class="container"/>
    </section>
  </div>
</template>

<script>
import Navigation from './components/Navigation'

export default {
  name: 'App',
  components: {
    'nav-bar': Navigation
  }
}
</script>

<style lang="css">
    @import "../node_modules/bulma/css/bulma.css";
    @import "../node_modules/bulma-extensions/bulma-slider/dist/css/bulma-slider.min.css";
    @import "../node_modules/bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css";
</style>
