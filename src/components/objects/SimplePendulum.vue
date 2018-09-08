<template>
  <div>
    <h3 class="title is-3">Péndulo simple</h3>

    <div class="columns">
      <div class="column is-half">
        <div id="canvas"></div>
      </div>

      <div class="column is-half">   
        <div class="tabs">
          <ul>
            <li v-for="(chart, index) in ['Energia', 'Fase']" :key="index" :value="chart.type" 
                :class="{'is-active' : clicked == index}" @click="showChart(index)">
                <a >{{ chart }}</a>
            </li>
          </ul>
        </div>
        <div>
          <energy-chart :input="energy" v-if="clicked == 0"></energy-chart>
          <phase-chart :input="phase"  v-if="clicked == 1"></phase-chart>
        </div>
      </div>
    </div>

    <div class="columns">
      <simple-input class="column is-quarter" @setStatus="setStatus" @setAnimation="setAnimation"
      @enableDamping="enableDamping"></simple-input>
    </div>

    <div class="columns">
      <div class="column">
        <documentation type="simple-pendulum"></documentation>
      </div>
    </div>

  </div>
</template>

<script>
import * as THREE from 'three'
import SimpleInput from '../inputs/SimpleInput'
import Documentation from '../Documentation'
import {initContext, initAxis} from '@/assets/js/graphics.js'
import {simplePendulum, simEnergyP, simEnergyK} from '@/assets/js/models.js'
import {GRAVITY, numericalResolution, pendulumSimpleExact} from '@/assets/js/math.js'
import EnergyChart from '../charts/EnergyChart.vue'
import PhaseChart from '../charts/PhaseChart.vue'

const RADIUS_SCALE = 0.5
const LENGTH_SCALE = 5
const MAX_CHART_VALUES = 25

export default {
  name: 'simple-pendulum',
  components: {
    'simple-input': SimpleInput,
    'documentation': Documentation,
    "energy-chart": EnergyChart,
    "phase-chart": PhaseChart
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      canvas: null,
      circle: null,
      line: null,
      animFrameID: null,

      time: 0,
      step: 0,
      pendulum: {},
      damping: {},
      trail: false,

      numericalMethodSelected: '',
      nextStep: null,

      angle0: 0,
      velocity0: 0,

      // Charts variables
      clicked: 0,
      energy: {
        time: [],
        potential: [],
        kinetic: []
      },
      energyAux: {
        time: [],
        potential: [],
        kinetic: []
      },
      phase: [],
      phaseAux: []
    }
  },
  methods: {
    initContext(){
      let context = initContext()

      this.renderer = context.renderer
      this.camera = context.camera
      this.controls = context.controls
      this.canvas = context.cavas

    },
    initScene() {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color( 0xffffff )

      this.initAxis()
      this.initObject()

      this.renderer.render( this.scene, this.camera )
    },
    initAxis() {
      let axis = initAxis()

      this.scene.add(axis)
    },
    initObject() {

      let m = this.pendulum.mass
      let l = this.pendulum.length
      let x = this.pendulum.angle
      let v = this.pendulum.velocity

      var geometry_circle = new THREE.CircleGeometry( m * RADIUS_SCALE, 50 )
      var material_circle = new THREE.MeshBasicMaterial( { color: 0x2469ff } )
      this.circle = new THREE.Mesh( geometry_circle, material_circle )
      this.circle.position.x =  l * Math.sin(x)
      this.circle.position.y = -l * Math.cos(x)

      var material_line = new THREE.LineBasicMaterial( { color: 0x000000 } )
      var geometry_line = new THREE.Geometry()
      geometry_line.vertices.push(new THREE.Vector3( 0, 0, 0))
      geometry_line.vertices.push(new THREE.Vector3( this.circle.position.x, this.circle.position.y, 0))
      this.line = new THREE.Line( geometry_line, material_line )

      this.energy.time.push(this.time)
      this.energy.potential.push(simEnergyP(GRAVITY, m, l, x))
      this.energy.kinetic.push(simEnergyK(m, l, v))
      this.phase.push([x, v])

      this.scene.add(this.line)
      this.scene.add(this.circle)
    },
    enableDamping(active) {
      this.damping.active = active
    },
    showChart(index) {
      this.clicked = index
    },
    pendulumEq(t0, x0, v0){
      let g = GRAVITY
      let t = t0
      let d = this.damping.active ? this.damping.value : 0
      let m = this.pendulum.mass
      let l = this.pendulum.length
      let x = x0
      let v = v0

      return simplePendulum(g, t, d, m, l, x, v)
    },
    setStatus(status){
      this.pendulum.angle = parseFloat(status.pendulum.angle * Math.PI / 180)
      this.pendulum.velocity = parseFloat(status.pendulum.velocity)
      this.pendulum.length = parseFloat(status.pendulum.length) * 5
      this.pendulum.mass = parseFloat(status.pendulum.mass)

      this.damping.value = status.damping.value
      this.damping.active = status.damping.active

      this.time = 0
      this.step = parseFloat(status.step)

      this.numericalMethodSelected = status.numericalMethodSelected

      this.angle0 = this.pendulum.angle
      this.velocity0 = this.pendulum.velocity

      if(this.scene != null) {
        this.initScene()
      }
    },
    setAnimation(animate) {
      if(animate){ this.move() }else{ this.stop() }
    },
    move() {
      this.animFrameID = requestAnimationFrame( this.move )

      let m = this.pendulum.mass
      let l = this.pendulum.length
      let x = this.pendulum.angle
      let v = this.pendulum.velocity

      if(this.numericalMethodSelected != 'pendulumExact'){
        this.nextStep = numericalResolution(this.pendulumEq, this.time, x, v, this.step)[this.numericalMethodSelected]

        this.time += parseFloat(this.nextStep[2])
        this.step = parseFloat(this.nextStep[2])
      }else{
        this.nextStep = pendulumSimpleExact(this.time, this.angle0, this.velocity0, this.pendulum.length)
        this.time += parseFloat(this.nextStep[2])
      }
      this.pendulum.angle = parseFloat(this.nextStep[0])
      this.pendulum.velocity = parseFloat(this.nextStep[1])
      this.circle.position.x =  l * Math.sin(this.pendulum.angle)
      this.circle.position.y = -l * Math.cos(this.pendulum.angle)
      this.line.geometry.vertices[ 1 ].x = this.circle.position.x
      this.line.geometry.vertices[ 1 ].y = this.circle.position.y
      this.line.geometry.verticesNeedUpdate = true

      // CHARTS UPDATE
      this.energyAux.time.push(this.time)
      this.energyAux.potential.push(simEnergyP(GRAVITY, m, l, x))
      this.energyAux.kinetic.push(simEnergyK(m, l, v))
      this.phaseAux.push([x, v])

      if(this.energyAux.time.length == MAX_CHART_VALUES) {
        this.energy = this.energyAux
        this.energyAux = {
          time: [],
          potential: [],
          kinetic: []
        }
      }
      if(this.phaseAux.length == MAX_CHART_VALUES) {
        this.phase = this.phaseAux
        this.phaseAux = []
      }

      this.renderer.render( this.scene, this.camera )
    },
    stop(){
      cancelAnimationFrame(this.animFrameID)
    }
  },
  mounted() {
    this.initContext()
    this.initScene()
  }
}
</script>
<style>

</style>
