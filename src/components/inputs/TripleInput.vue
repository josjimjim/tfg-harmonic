<template>
  <div>
    <div class="columns">
      
      <div class="column">
        <generic-input label="Áng. 1">
          <input type="range" min="0" max="360" step="1" v-model="status.pendulum1.angle"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum1.angle"></span>
        </generic-input>

        <generic-input label="Vel. 1">
          <input type="range" min="0" max="20" step="0.5" v-model="status.pendulum1.velocity"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum1.velocity"></span>
        </generic-input>

        <generic-input label="Long. 1">
          <input type="range" min="1" max="3" step="0.2" v-model="status.pendulum1.length"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum1.length"></span>
        </generic-input>

        <generic-input label="Masa 1">
          <input type="range" min="0.5" max="5" step="0.5" v-model="status.pendulum1.mass"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum1.mass"></span>
        </generic-input>
      </div>

      <div class="column">
        <generic-input label="Áng. 2">
          <input type="range" min="0" max="360" step="1" v-model="status.pendulum2.angle"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum2.angle"></span>
        </generic-input>

        <generic-input label="Vel. 2">
          <input type="range" min="0" max="20" step="0.5" v-model="status.pendulum2.velocity"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum2.velocity"></span>
        </generic-input>

        <generic-input label="Long 2">
          <input type="range" min="1" max="3" step="0.2" v-model="status.pendulum2.length"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum2.length"></span>
        </generic-input>

        <generic-input label="Masa 2">
          <input type="range" min="0.5" max="5" step="0.5" v-model="status.pendulum2.mass"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum2.mass"></span>
        </generic-input>
      </div>

      <div class="column">
        <generic-input label="Áng. 3">
          <input type="range" min="0" max="360" step="1" v-model="status.pendulum3.angle"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum3.angle"></span>
        </generic-input>

        <generic-input label="Vel. 3">
          <input type="range" min="0" max="20" step="0.5" v-model="status.pendulum3.velocity"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum3.velocity"></span>
        </generic-input>

        <generic-input label="Long 3">
          <input type="range" min="1" max="3" step="0.2" v-model="status.pendulum3.length"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum3.length"></span>
        </generic-input>

        <generic-input label="Masa 3">
          <input type="range" min="0.5" max="5" step="0.5" v-model="status.pendulum3.mass"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum3.mass"></span>
        </generic-input>
      </div>

      <div class="column">
        <generic-input label="Paso">
          <input type="range" min="0.001" max="0.03" step="0.001" v-model="status.step"
          @change="setStatus" class="slider is-small">
          <span v-text="status.step"></span>
        </generic-input>

        <generic-input label="Rozamiento">
          <input type="range" min="0.05" max="0.5" step="0.05" v-model="status.damping.value"
                @change="setStatus" class="slider is-small">
          <span v-text="status.damping.value"></span>
        </generic-input>

        <generic-input label="">
          <input id="enableDamping" type="checkbox" name="enableDamping" @click="enableDamping" class="switch is-small">
          <label for="enableDamping">Activar rozamiento</label>
        </generic-input>

        <generic-input label="">
          <input id="enableTrail" type="checkbox" name="enableTrail" @click="enableTrail" class="switch is-small" checked="checked">
          <label for="enableTrail">Activar traza</label>
        </generic-input>

        <generic-input>
          <button v-text="clapper.text" @click="setAnimation" class="button"></button>
        </generic-input>
      </div>
    </div>
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
        pendulum3 :{
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
