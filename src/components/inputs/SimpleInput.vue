<template>
  <div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Angle</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="status.pendulum.angle" @keyup="setStatus" class="input" placeholder="Angle">
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Velocity</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="status.pendulum.velocity" @keyup="setStatus" class="input" placeholder="Velocity">
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Length</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="status.pendulum.length" @keyup="setStatus" class="input" placeholder="Length">
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Mass</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="status.pendulum.mass" @keyup="setStatus" class="input" placeholder="Mass">
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Step</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="status.step" @keyup="setStatus" class="input" placeholder="Step">
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label">
        <!-- Left empty for spacing -->
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <button v-model="clapper.animate" v-text="clapper.text" @click="setAnimation" class="button"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'simple-input',
  data() {
    return {
      status: {
        pendulum :{
          angle: 45,
          velocity: 0.0,
          length: 1.0,
          mass: 1.0
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
