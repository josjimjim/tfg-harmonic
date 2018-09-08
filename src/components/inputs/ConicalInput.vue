<template>
  <div>
    <generic-input label="Frecuencia">
      <input type="range" min="0" max="10" step="0.1" v-model="status.pendulum.frequency"
      @change="setStatus" class="slider is-small">
      <span v-text="status.pendulum.frequency"></span>
    </generic-input>

    <generic-input label="Longitud">
      <input type="range" min="1" max="3" step="0.5" v-model="status.pendulum.length"
      @change="setStatus" class="slider is-small">
      <span v-text="status.pendulum.length"></span>
    </generic-input>

    <generic-input label="Masa">
      <input type="range" min="1" max="5" step="1" v-model="status.pendulum.mass"
      @change="setStatus" class="slider is-small">
      <span v-text="status.pendulum.mass"></span>
    </generic-input>

    <generic-input label="">
      <input id="enableTrail" type="checkbox" name="enableTrail" @click="enableTrail" class="switch is-small">
      <label for="enableTrail">Activar traza</label>
    </generic-input>

    <generic-input>
      <button v-text="clapper.text" @click="setAnimation" class="button"></button>
    </generic-input>
  </div>
</template>

<script>
import GenericInput from './GenericInput'

export default {
  name: 'spherical-input',
  components: {
    'generic-input': GenericInput
  },
  data() {
    return {
      status: {
        pendulum :{
          frequency: 3,
          mass: 2.0,
          length: 2.0,
        },
        trail: false
      },
      clapper: {
        animate: false,
        text: 'Iniciar'
      }
    }
  },
  methods: {
    setStatus(){
      this.$emit('setStatus', this.status)
    },
    setAnimation(){
      this.clapper.animate = !this.clapper.animate
      this.clapper.text = this.clapper.animate ? 'Detener' : 'Iniciar'

      this.$emit('setAnimation', this.clapper.animate)
    },
    enableTrail(){
      this.trail = !this.trail
      this.$emit('enableTrail', this.trail)
    },
  },
  created(){
    this.setStatus()
  }
}
</script>
<style>

</style>
