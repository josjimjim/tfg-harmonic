<template>
  <div>
    <h3 class="title is-3">Péndulo esférico</h3>
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
      <spherical-input class="column" @setStatus="setStatus" @setAnimation="setAnimation"
      @enableTrail="enableTrail"></spherical-input>
    </div>

    <div class="columns">
      <div class="column">
        <documentation type="spherical-pendulum"></documentation>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three"
import SphericalInput from "../inputs/SphericalInput"
import Documentation from "../Documentation"
import { sphericalPendulum, sphEnergyP, sphEnergyK } from "@/assets/js/models.js"
import { GRAVITY, numericalResolution } from "@/assets/js/math.js"
import {initContext, initAxis, initTrail, updateTrail, addChartItem} from "@/assets/js/graphics.js"
import EnergyChart from '../charts/EnergyChart.vue'
import PhaseChart from '../charts/PhaseChart.vue'

const RADIUS_SCALE = 0.5
const LENGTH_SCALE = 5
const MAX_CHART_VALUES = 25

export default {
  name: "spherical-pendulum",
  components: {
    "spherical-input": SphericalInput,
    "documentation": Documentation,
    "energy-chart": EnergyChart,
    "phase-chart": PhaseChart
  },
  data() {
    return {
      anFrmID: null,

      scene: null,
      camera: null,
      renderer: null,
      canvas: null,
      controls: null,

      time: 0,
      step: 0,
      pendulum: {},

      sphere: null,
      line: null,

      trail: true,
      trailLine: [],
      trailReload: false,

      numericalMethodSelected: '',
      nextStep: null,

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
    initContext() {
      let context = initContext(new THREE.Vector3(100, 20, 100), new THREE.Vector3(0, 0, 0), true)

      this.renderer = context.renderer
      this.camera = context.camera
      this.controls = context.controls
      this.canvas = context.cavas
    },
    initScene() {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xffffff)

      this.initAxis()
      this.initObject()
    },
    initAxis() {
      let axis = initAxis(500, 500, 500, -17)

      this.scene.add(axis)
    },
    initObject() {

      let m = this.pendulum.mass
      let l = this.pendulum.length
      let x1 = this.pendulum.angleAmplitude
      let v1 = this.pendulum.velocityAmplitude
      let x2 = this.pendulum.angleRotation
      let v2 = this.pendulum.velocityRotation

      let material_line = new THREE.LineBasicMaterial({ color: 0x000000 })
      let geometry_line = new THREE.Geometry()
      geometry_line.vertices.push(new THREE.Vector3(0, 0, 0))
      geometry_line.vertices.push(new THREE.Vector3(
          (l * LENGTH_SCALE) * Math.sin(x1) * Math.sin(x2),
        - (l * LENGTH_SCALE) * Math.cos(x1),
          (l * LENGTH_SCALE) * Math.sin(x1) * Math.cos(x2)))
      this.line = new THREE.Line(geometry_line, material_line)

      let geometry_sphere = new THREE.SphereGeometry(m * RADIUS_SCALE, 32, 32)
      let material_sphere = new THREE.MeshBasicMaterial({ color: 0x2469ff })
      this.sphere = new THREE.Mesh(geometry_sphere, material_sphere)
      this.sphere.position.x =   (l * LENGTH_SCALE) * Math.sin(x1) * Math.sin(x2)
      this.sphere.position.y = - (l * LENGTH_SCALE) * Math.cos(x1)
      this.sphere.position.z =   (l * LENGTH_SCALE) * Math.sin(x1) * Math.cos(x2)

      this.trailLine = initTrail(this.sphere.position)
      
      this.energy.time.push(this.time)
      this.energy.potential.push(sphEnergyP(GRAVITY, m, l, x1))
      this.energy.kinetic.push(sphEnergyK(m, l, x1, v1, v2))
      this.phase.push([x1, v1])

      this.scene.add(this.trailLine)
      this.scene.add(this.line)
      this.scene.add(this.sphere)

      this.renderer.render(this.scene, this.camera)
    },
    enableTrail(active) {
      this.trail = active
      if(active) { this.trailReload = true }
    },
    showChart(index) {
      this.clicked = index
    },
    pendulumAmplitudeEq(t0, x0, v0) {
      let g = GRAVITY
      let t = t0
      let d = 0
      let m = this.pendulum.mass
      let l = this.pendulum.length
      let x1 = x0
      let v1 = v0
      let x2 = this.pendulum.angleRotation
      let v2 = this.pendulum.velocityRotation

      return sphericalPendulum(1, g, t, d, m, l, x1, v1, x2, v2)
    },
    pendulumRotationEq(t0, x0, v0) {
      let g = GRAVITY
      let t = t0
      let d = 0
      let m = this.pendulum.mass
      let l = this.pendulum.length
      let x1 = this.pendulum.angleAmplitude
      let v1 = this.pendulum.velocityAmplitude
      let x2 = x0
      let v2 = v0

      return sphericalPendulum(2, g, t, d, m, l, x1, v1, x2, v2)
    },
    setStatus(status) {
      this.pendulum.angleAmplitude = parseFloat(status.pendulum.angleAmplitude * Math.PI / 180)
      this.pendulum.velocityAmplitude = parseFloat(status.pendulum.velocityAmplitude)
      this.pendulum.angleRotation = parseFloat(status.pendulum.angleRotation * Math.PI / 180)
      this.pendulum.velocityRotation = parseFloat(status.pendulum.velocityRotation)
      this.pendulum.length = parseFloat(status.pendulum.length)
      this.pendulum.mass = parseFloat(status.pendulum.mass)

      this.step = parseFloat(status.step)

      this.numericalMethodSelected = status.numericalMethodSelected

      if (this.scene != null) {
        this.initScene()
      }
    },
    setAnimation(animate) {
      if (animate) { this.move()  } else { this.stop() }
    },
    move() {
      this.anFrmID = requestAnimationFrame(this.move)

      let m = this.pendulum.mass
      let l = this.pendulum.length
      let x1 = this.pendulum.angleAmplitude
      let v1 = this.pendulum.velocityAmplitude
      let x2 = this.pendulum.angleRotation
      let v2 = this.pendulum.velocityRotation

      let nextStep1 = numericalResolution(this.pendulumAmplitudeEq, this.time, x1, v1, this.step)[this.numericalMethodSelected]
      this.pendulum.angleAmplitude = nextStep1[0]
      this.pendulum.velocityAmplitude = nextStep1[1]

      let nextStep2 = numericalResolution(this.pendulumRotationEq, this.time, x2, v2, this.step)[this.numericalMethodSelected]
      this.pendulum.angleRotation = nextStep2[0]
      this.pendulum.velocityRotation = nextStep2[1]

      this.sphere.position.x =  (l * LENGTH_SCALE) * Math.sin(x1) * Math.sin(x2)
      this.sphere.position.y = -(l * LENGTH_SCALE) * Math.cos(x1)
      this.sphere.position.z =  (l * LENGTH_SCALE) * Math.sin(x1) * Math.cos(x2)

      this.line.geometry.vertices[1].x = this.sphere.position.x
      this.line.geometry.vertices[1].y = this.sphere.position.y
      this.line.geometry.vertices[1].z = this.sphere.position.z
      this.line.geometry.verticesNeedUpdate = true

      this.time += this.step

      if (this.trail) {
        let update = updateTrail(this.trailLine, this.sphere.position, this.trailReload)
        this.trailLine.geometry.vertices = update.vertices
        this.trailReload = update.trailReload
      }

      this.energyAux.time.push(this.time)
      this.energyAux.potential.push(sphEnergyP(GRAVITY, m, l, x1))
      this.energyAux.kinetic.push(sphEnergyK(m, l, x1, v1, v2))
      this.phaseAux.push([x1, v1])

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

      this.renderer.render(this.scene, this.camera)
    },
    stop() {
      cancelAnimationFrame(this.anFrmID)
    }
  },
  mounted() {
    this.initContext()
    this.initScene()  
  },
  beforeDestroy() {
    this.stop()
  }
  
}
</script>
<style>
</style>
