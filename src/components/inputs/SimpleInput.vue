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
        <generic-input label="Longitud">
          <input type="range" min="1" max="3" step="0.2" v-model="status.pendulum.length"
                @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum.length"></span>
        </generic-input>

        <generic-input label="Masa">
          <input type="range" min="0.5" max="5" step="0.5" v-model="status.pendulum.mass"
                @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum.mass"></span>
        </generic-input>
      </div>

      <div class="column">
        <generic-input label="Paso">
          <input type="range" min="0.01" max="0.1" step="0.01" v-model="status.step"
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
  name: 'simple-input',
  components: {
    'generic-input': GenericInput
  },
  data() {
    return {
      status: {
        pendulum :{
          angle: 45,
          velocity: 0,
          length: 1.0,
          mass: 2.0
        },
        damping: {
          value: 0.1,
          active: false
        },
        step: 0.01,

        numericalMethods: [],
        numericalMethodSelected: 'rungeKutta4'
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
    enableDamping(){
      this.status.damping.active = !this.status.damping.active
      this.$emit('enableDamping', this.status.damping.active)
    }
  },
  created(){
    this.numericalMethods = NUMERICAL_METHODS
    this.numericalMethods.push({method:'pendulumExact', name: 'Solución exacta'})
    this.setStatus()
  }
}
</script>
<style>

</style>
