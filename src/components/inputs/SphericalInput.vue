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

        <generic-input label="Amplitud">
          <input type="range" min="0" max="360" step="1" v-model="status.pendulum.angleAmplitude"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum.angleAmplitude"></span>
        </generic-input>

        <!-- <generic-input label="Vel. amplitud">
          <input type="range" min="0" max="5" step="0.5" v-model="status.pendulum.velocityAmplitude"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum.velocityAmplitude"></span>
        </generic-input> -->


        <generic-input label="Rotación">
          <input type="range" min="0" max="360" step="1" v-model="status.pendulum.angleRotation"
          @change="setStatus" class="slider is-small" placeholder="Angle rotation">
          <span v-text="status.pendulum.angleRotation"></span>
        </generic-input>

      </div>
      <div class="column">

        <generic-input label="Vel. rotación">
          <input type="range" min="0" max="5" step="0.5" v-model="status.pendulum.velocityRotation"
          @change="setStatus" class="slider is-small" placeholder="Velocity rotation">
          <span v-text="status.pendulum.velocityRotation"></span>
        </generic-input>

        <generic-input label="Longitud">
          <input type="range" min="1" max="3" step="0.2" v-model="status.pendulum.length"
          @change="setStatus" class="slider is-small">
          <span v-text="status.pendulum.length"></span>
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
        step: 0.01,

        numericalMethodSelected: 'rungeKutta4'
      },
      clapper: {
        animate: false,
        text: 'Iniciar'
      },

      numericalMethods: NUMERICAL_METHODS
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
