<template>
  <div>
    <generic-input label="Angle 1">
      <input v-model="status.pendulum1.angle" @keyup="setStatus" class="input" placeholder="Angle">
    </generic-input>

    <generic-input label="Velocity 1">
      <input v-model="status.pendulum1.velocity" @keyup="setStatus" class="input" placeholder="Velocity">
    </generic-input>

    <generic-input label="Length 1">
      <input v-model="status.pendulum1.length" @keyup="setStatus" class="input" placeholder="Length">
    </generic-input>

    <generic-input label="Mass 1">
      <input v-model="status.pendulum1.mass" @keyup="setStatus" class="input" placeholder="Mass">
    </generic-input>

    <generic-input label="Angle 2">
      <input v-model="status.pendulum2.angle" @keyup="setStatus" class="input" placeholder="Angle">
    </generic-input>

    <generic-input label="Velocity 2">
      <input v-model="status.pendulum2.velocity" @keyup="setStatus" class="input" placeholder="Velocity">
    </generic-input>

    <generic-input label="Length 2">
      <input v-model="status.pendulum2.length" @keyup="setStatus" class="input" placeholder="Length">
    </generic-input>

    <generic-input label="Mass 2">
      <input v-model="status.pendulum2.mass" @keyup="setStatus" class="input" placeholder="Mass">
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
  name: 'double-input',
  components: {
    'generic-input': GenericInput
  },
  data() {
    return {
      status: {
        pendulum1 :{
          angle: 45,
          velocity: 0.0,
          length: 1.0,
          mass: 2.0
        },
        pendulum2 :{
          angle: 45,
          velocity: 0.0,
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
