<template>
  <div>
    <generic-input label="Angle amplitude">
      <input type="range" min="0" max="360" step="1" v-model="status.pendulum.angleAmplitude"
      @change="setStatus" class="slider" placeholder="Angle amplitude">
      <span v-text="status.pendulum.angleAmplitude"></span>
    </generic-input>

    <generic-input label="Velocity amplitude">
      <input type="range" min="0" max="20" step="0.5" v-model="status.pendulum.velocityAmplitude"
      @change="setStatus" class="slider" placeholder="Velocity amplitude">
      <span v-text="status.pendulum.velocityAmplitude"></span>
    </generic-input>

    <generic-input label="Angle rotation">
      <input type="range" min="0" max="360" step="1" v-model="status.pendulum.angleRotation"
      @change="setStatus" class="slider" placeholder="Angle rotation">
      <span v-text="status.pendulum.angleRotation"></span>
    </generic-input>

    <generic-input label="Velocity rotation">
      <input type="range" min="0" max="20" step="0.5" v-model="status.pendulum.velocityRotation"
      @change="setStatus" class="slider" placeholder="Velocity rotation">
      <span v-text="status.pendulum.velocityRotation"></span>
    </generic-input>

    <generic-input label="Length">
      <input type="range" min="1" max="3" step="0.2" v-model="status.pendulum.length"
      @change="setStatus" class="slider" placeholder="Length">
      <span v-text="status.pendulum.length"></span>
    </generic-input>

    <generic-input label="Mass">
      <input type="range" min="0.5" max="5" step="0.5" v-model="status.pendulum.mass"
      @change="setStatus" class="slider" placeholder="Mass">
      <span v-text="status.pendulum.mass"></span>
    </generic-input>

    <generic-input label="Step">
      <input type="range" min="0.01" max="0.5" step="0.01" v-model="status.step"
      @change="setStatus" class="slider" placeholder="Step">
      <span v-text="status.step"></span>
    </generic-input>

    <generic-input label="">
      <input id="enableTrail" type="checkbox" name="enableTrail" @click="enableTrail" class="switch is-rtl is-small">
      <label for="enableTrail">Enable trail</label>
    </generic-input>

    <generic-input>
      <button v-model="clapper.animate" v-text="clapper.text" @click="setAnimation" class="button"></button>
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
          angleAmplitude: 45,
          velocityAmplitude: 0.0,
          angleRotation: 90,
          velocityRotation: 1.0,
          length: 2.0,
          mass: 2.0
        },
        trail: false,
        step: 0.01
      },
      clapper: {
        animate: false,
        text: 'Start'
      }
    }
  },
  methods: {
    setStatus(){
      this.$emit('setStatus', this.status)
    },
    setAnimation(){
      this.clapper.animate = !this.clapper.animate
      this.clapper.text = this.clapper.animate ? 'Stop' : 'Start'

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
