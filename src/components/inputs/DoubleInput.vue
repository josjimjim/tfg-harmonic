<template>
  <div>
    <generic-input label="Angle 1">
      <input type="range" min="0" max="360" step="1" v-model="status.pendulum1.angle"
      @change="setStatus" class="slider" placeholder="Angle">
      <span v-text="status.pendulum1.angle"></span>
    </generic-input>

    <generic-input label="Velocity 1">
      <input type="range" min="0" max="20" step="0.5" v-model="status.pendulum1.velocity"
      @change="setStatus" class="slider" placeholder="Velocity">
      <span v-text="status.pendulum1.velocity"></span>
    </generic-input>

    <generic-input label="Length 1">
      <input type="range" min="1" max="3" step="0.2" v-model="status.pendulum1.length"
      @change="setStatus" class="slider" placeholder="Length">
      <span v-text="status.pendulum1.length"></span>
    </generic-input>

    <generic-input label="Mass 1">
      <input type="range" min="0.5" max="5" step="0.5" v-model="status.pendulum1.mass"
      @change="setStatus" class="slider" placeholder="Mass">
      <span v-text="status.pendulum1.mass"></span>
    </generic-input>

    <generic-input label="Angle 2">
      <input type="range" min="0" max="360" step="1" v-model="status.pendulum2.angle"
      @change="setStatus" class="slider" placeholder="Angle">
      <span v-text="status.pendulum2.angle"></span>
    </generic-input>

    <generic-input label="Velocity 2">
      <input type="range" min="0" max="20" step="0.5" v-model="status.pendulum2.velocity"
      @change="setStatus" class="slider" placeholder="Velocity">
      <span v-text="status.pendulum2.velocity"></span>
    </generic-input>

    <generic-input label="Length 2">
      <input type="range" min="1" max="3" step="0.2" v-model="status.pendulum2.length"
      @change="setStatus" class="slider" placeholder="Length">
      <span v-text="status.pendulum2.length"></span>
    </generic-input>

    <generic-input label="Mass 2">
      <input type="range" min="0.5" max="5" step="0.5" v-model="status.pendulum2.mass"
      @change="setStatus" class="slider" placeholder="Mass">
      <span v-text="status.pendulum2.mass"></span>
    </generic-input>

    <generic-input label="Step">
      <input type="range" min="0.01" max="0.5" step="0.01" v-model="status.step"
      @change="setStatus" class="slider" placeholder="Step">
      <span v-text="status.step"></span>
    </generic-input>

    <generic-input label="Damping">
      <input type="range" min="0.05" max="0.5" step="0.05" v-model="status.damping.value"
            @change="setStatus" class="slider" placeholder="Damping">
      <span v-text="status.damping.value"></span>
    </generic-input>

    <generic-input label="">
      <input id="enableDamping" type="checkbox" name="enableDamping" @click="enableDamping" class="switch is-rtl is-small">
      <label for="enableDamping">Enable damping</label>

      <input id="enableTrail" type="checkbox" name="enableTrail" @click="enableTrail" class="switch is-rtl is-small" checked="checked">
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
        damping: {
          value: 0.1,
          active: false
        },
        step: 0.01
      },
      trail: true,
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
    enableDamping(){
      this.status.damping.active = !this.status.damping.active
      this.$emit('enableDamping', this.status.damping.active)
    },
    enableTrail(){
      this.trail = !this.trail
      this.$emit('enableTrail', this.trail)
    }
  },
  created(){
    this.setStatus()
  }
}
</script>
<style>

</style>
