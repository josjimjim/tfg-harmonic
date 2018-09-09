<template>
  <div>
    <h3 class="title is-3">Péndulo amortiguado</h3>

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
      <spring-input class="column is-quarter" @setStatus="setStatus" @setAnimation="setAnimation"
      @enableDamping="enableDamping" @enableTrail="enableTrail"></spring-input>
    </div>

    <div class="columns">
      <div class="column">
        <documentation type="spring-pendulum"></documentation>
      </div>
    </div>

  </div>
</template>

<script>
import * as THREE from 'three'
import SpringInput from '../inputs/SpringInput'
import Documentation from '../Documentation'
import {springPendulum, sprEnergyP, sprEnergyK} from '@/assets/js/models.js'
import {GRAVITY, numericalResolution} from '@/assets/js/math.js'
import {initContext, initAxis, initTrail, updateTrail} from "@/assets/js/graphics.js"
import EnergyChart from '../charts/EnergyChart.vue'
import PhaseChart from '../charts/PhaseChart.vue'

const RADIUS_SCALE = 0.5
const LENGTH_SCALE = 5
const MAX_CHART_VALUES = 25

export default {
  name: 'spring-pendulum',
  components: {
    'spring-input': SpringInput,
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
      trailLine: null,
      trailReload: false,

      numericalMethodSelected: '',

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
      let k = this.pendulum.stiffness
      let x1 = this.pendulum.angle
      let v1 = this.pendulum.velocity
      let x2 = this.pendulum.elongation
      let v2 = this.pendulum.elongationVelocity

      let geometry_circle = new THREE.CircleGeometry( m * RADIUS_SCALE, 50 )
      let material_circle = new THREE.MeshBasicMaterial( { color: 0x2469ff } )
      this.circle = new THREE.Mesh( geometry_circle, material_circle )
      this.circle.position.x =  (l + x2) * Math.sin(x1)
      this.circle.position.y = -(l + x2) * Math.cos(x1)

      let material_line = new THREE.LineBasicMaterial( { color: 0x000000 } )
      let geometry_line = new THREE.Geometry()
      geometry_line.vertices.push(new THREE.Vector3( 0, 0, 0))
      geometry_line.vertices.push(new THREE.Vector3( this.circle.position.x, this.circle.position.y, 0))
      this.line = new THREE.Line( geometry_line, material_line )

      this.trailLine = initTrail(this.circle.position);

      this.energy.time.push(this.time)
      this.energy.potential.push(sprEnergyP(GRAVITY, m, l, k, x1, x2))
      this.energy.kinetic.push(sprEnergyK(m, l, v1, x2, v2))
      this.phase.push([x2, v2])
      
      this.scene.add(this.trailLine)
      this.scene.add(this.line)
      this.scene.add(this.circle)
    },
    enableDamping(active) {
      this.damping.active = active
    },
    enableTrail(active) {
      this.trail = active
      if(active) { this.trailReload = true }
    },
    showChart(index) {
      this.clicked = index
    },
    pendulumAngleEq(t0, x0, v0){
      let g = GRAVITY
      let t = t0
      let d = this.damping.active ? this.damping.value : 0
      let m = this.pendulum.mass
      let l = this.pendulum.length
      let k = this.pendulum.stiffness
      let x1 = x0
      let v1 = v0
      let x2 = this.pendulum.elongation
      let v2 = this.pendulum.elongationVelocity

      return springPendulum(1, g, t, d, m, l, k, x1, v1, x2, v2)
    },
    pendulumSpringEq(t0, x0, v0){
      let g = GRAVITY
      let t = t0
      let d = this.damping.active ? this.damping.value : 0
      let m = this.pendulum.mass
      let l = this.pendulum.length
      let k = this.pendulum.stiffness
      let x1 = this.pendulum.angle
      let v1 = this.pendulum.velocity
      let x2 = x0
      let v2 = v0

      return springPendulum(2, g, t, d, m, l, k, x1, v1, x2, v2)
    },
    setStatus(status){
      this.pendulum.stiffness = parseFloat(status.pendulum.stiffness)
      this.pendulum.angle = parseFloat(status.pendulum.angle * Math.PI / 180)
      this.pendulum.velocity = parseFloat(status.pendulum.velocity)
      this.pendulum.length = 5
      this.pendulum.elongation = parseFloat(status.pendulum.elongation)
      this.pendulum.mass = parseFloat(status.pendulum.mass)

      this.pendulum.elongationVelocity = 0

      this.damping.value = status.damping.value
      this.damping.active = status.damping.active

      this.step = parseFloat(status.step)

      this.numericalMethodSelected = status.numericalMethodSelected

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
      let k = this.pendulum.stiffness
      let x1 = this.pendulum.angle
      let v1 = this.pendulum.velocity
      let x2 = this.pendulum.elongation
      let v2 = this.pendulum.elongationVelocity

      let nextStep1 = numericalResolution(this.pendulumAngleEq, this.time, x1, v1, this.step)[this.numericalMethodSelected]
      this.pendulum.angle = parseFloat(nextStep1[0])
      this.pendulum.velocity = parseFloat(nextStep1[1])

      let nextStep2 = numericalResolution(this.pendulumSpringEq, this.time, x2, v2, this.step)[this.numericalMethodSelected]
      this.pendulum.elongation = parseFloat(nextStep2[0])
      this.pendulum.elongationVelocity = parseFloat(nextStep2[1])

      this.circle.position.x =  (l + x2) * Math.sin(x1)
      this.circle.position.y = -(l + x2) * Math.cos(x1)
      this.line.geometry.vertices[ 1 ].x = this.circle.position.x
      this.line.geometry.vertices[ 1 ].y = this.circle.position.y
      this.line.geometry.verticesNeedUpdate = true

      this.time += parseFloat(nextStep1[2])
      this.step = parseFloat(nextStep1[2])

      if (this.trail) {
        let update = updateTrail(this.trailLine, this.circle.position, this.trailReload)
        this.trailLine.geometry.vertices = update.vertices
        this.trailReload = update.trailReload
      }

      // CHARTS UPDATE
      this.energyAux.time.push(this.time)
      this.energyAux.potential.push(sprEnergyP(GRAVITY, m, l, k, x1, x2))
      this.energyAux.kinetic.push(sprEnergyK(m, l, v1, x2, v2))
      this.phaseAux.push([x2, v2])

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
