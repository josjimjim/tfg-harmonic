<template>
  <div>

    <generic-input label="Método">
      <div class="select">
        <select v-model="status.numericalMethodSelected" @change="setStatus">
          <option v-for="(numMeth, index) in numericalMethods" :key="index" :value="numMeth.method">
            {{ numMeth.name }}
          </option>
        </select>
      </div>
    </generic-input>

    <div class="columns">

      <div class="column">
        <generic-input label="Ángulo">
          <input type="range" min="0" max="360" step="1" v-model="status.pendulum.angle"
                @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum.angle"></span>
        </generic-input>

        <generic-input label="Velocidad">
          <input type="range" min="0" max="5" step="0.5" v-model="status.pendulum.velocity"
                @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum.velocity"></span>
        </generic-input>
      </div>

      <div class="column">
        <generic-input label="Dureza">
          <input type="range" min="5" max="15" step="0.05" v-model="status.pendulum.stiffness"
                @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum.stiffness"></span>
        </generic-input>

        <generic-input label="Elongación">
          <input type="range" min="-4" max="10" step="0.1" v-model="status.pendulum.elongation"
                @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum.elongation"></span>
        </generic-input>
      </div>

      <div class="column">
        <generic-input label="Masa">
          <input type="range" min="0.5" max="5" step="0.5" v-model="status.pendulum.mass"
                @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum.mass"></span>
        </generic-input>

        <generic-input label="Paso">
          <input type="range" min="0.01" max="0.1" step="0.01" v-model="status.step"
                @change="setStatus" class="slider is-small">
          <span v-text="status.step"></span>
        </generic-input>
      </div>

      <div class="column">
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
          <input id="enableTrail" type="checkbox" name="enableTrail" @click="enableTrail" class="switch is-small">
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
import {NUMERICAL_METHODS} from '@/assets/js/math.js'

export default {
  name: 'spring-input',
  components: {
    'generic-input': GenericInput
  },
  data() {
    return {
      status: {
        pendulum :{
          stiffness: 8.82,
          angle: 45,
          velocity: 0.0,
          length: 1.0,
          elongation: 0.0,
          mass: 2.0
        },
        damping: {
          value: 0.1,
          active: false
        },
        step: 0.01,
        numericalMethodSelected: 'rungeKutta4',
      },
      trail: false,
      clapper: {
        animate: false,
        text: 'Start'
      },

      numericalMethods: NUMERICAL_METHODS,
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
    },
  },
  created(){
    this.setStatus()
  }
}
</script>
<style>

</style>
