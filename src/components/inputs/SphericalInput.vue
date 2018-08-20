<template>
  <div>
    <generic-input label="Angle amplitude">
      <input v-model="status.pendulum.angleAmplitude" @keyup="setStatus" class="input" placeholder="Angle amplitude">
    </generic-input>

    <generic-input label="Velocity amplitude">
      <input v-model="status.pendulum.velocityAmplitude" @keyup="setStatus" class="input" placeholder="Velocity amplitude">
    </generic-input>

    <generic-input label="Angle rotation">
      <input v-model="status.pendulum.angleRotation" @keyup="setStatus" class="input" placeholder="Angle rotation">
    </generic-input>

    <generic-input label="Velocity rotation">
      <input v-model="status.pendulum.velocityRotation" @keyup="setStatus" class="input" placeholder="Velocity rotation">
    </generic-input>

    <generic-input label="Length">
      <input v-model="status.pendulum.length" @keyup="setStatus" class="input" placeholder="Length">
    </generic-input>

    <generic-input label="Mass">
      <input v-model="status.pendulum.mass" @keyup="setStatus" class="input" placeholder="Mass">
    </generic-input>

    <generic-input label="Step">
      <input v-model="status.step" @keyup="setStatus" class="input" placeholder="Step">
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
          angleRotation: 45,
          velocityRotation: 1.0,
          length: 1.0,
          mass: 2.0
        },
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
    }
  },
  created(){
    this.setStatus()
  }
}
</script>
<style>

</style>
