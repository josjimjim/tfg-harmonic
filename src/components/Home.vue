<template>
  <div>
    <h3 class="title is-3">Inicio</h3>
    <div class="columns">
      <div class="column">
        <documentation type="home"></documentation>
      </div>
    </div>
  </div>
</template>

<script>
import Documentation from './Documentation'

export default {
  name: 'Home',
  components: {
    'documentation': Documentation
  },
}
</script>
<style>

</style>
