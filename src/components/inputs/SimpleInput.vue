<template>
  <div>
    <generic-input label="Angle">
      <input v-model="status.pendulum.angle" @keyup="setStatus" class="input" placeholder="Angle">
    </generic-input>

    <generic-input label="Velocity">
      <input v-model="status.pendulum.velocity" @keyup="setStatus" class="input" placeholder="Velocity">
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
  name: 'simple-input',
  components: {
    'generic-input': GenericInput
  },
  data() {
    return {
      status: {
        pendulum :{
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
    console.log(this.status.pendulum.angle)
    this.setStatus()
  }
}
</script>
<style>

</style>
