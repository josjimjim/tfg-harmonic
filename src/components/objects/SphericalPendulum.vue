<template>
  <div>
    <h3 class="title is-3">Spherical pendulum</h3>
    <div class="columns">
      <div class="column is-half">
        <div id="canvas"></div>
      </div>
      <div class="column is-half">
        <chart id="chart1" :input="chartValue1"></chart>
        <chart id="chart2" :input="chartValue2"></chart>
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
import Chart from "../Chart"
import Documentation from "../Documentation"
import { sphericalPendulum } from "@/assets/js/models.js"
import { GRAVITY, rungeKutta4 } from "@/assets/js/math.js"
import {initContext, initAxis, initTrail, updateTrail, addChartItem} from "@/assets/js/graphics.js"


export default {
  name: "spherical-pendulum",
  components: {
    "chart": Chart,
    "spherical-input": SphericalInput,
    "documentation": Documentation
  },
  data() {
    return {
      anFrmID: null,

      scene: null,
      camera: null,
      renderer: null,
      canvas: null,
      controls: null,

      sphere: null,
      line: null,

      trail: false,
      trailLine: [],
      trailReload: false,

      chartValue1: [],
      chartValueAux1: [],
      chartValue2: [],
      chartValueAux2: [],

      time: 0,
      step: 0,
      pendulum: {},

      lineLength: null,

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
      var material_line = new THREE.LineBasicMaterial({ color: 0x000000 })
      var geometry_line = new THREE.Geometry()
      geometry_line.vertices.push(new THREE.Vector3(0, 0, 0))
      geometry_line.vertices.push(new THREE.Vector3(
        this.lineLength * Math.sin(this.pendulum.angleAmplitude) * Math.sin(this.pendulum.angleRotation),
        -this.lineLength * Math.cos(this.pendulum.angleAmplitude),
        this.lineLength * Math.sin(this.pendulum.angleAmplitude) * Math.cos(this.pendulum.angleRotation)))
      this.line = new THREE.Line(geometry_line, material_line)

      var geometry_sphere = new THREE.SphereGeometry(this.pendulum.mass / 2, 32, 32)
      var material_sphere = new THREE.MeshBasicMaterial({ color: 0x2469ff })
      this.sphere = new THREE.Mesh(geometry_sphere, material_sphere)
      this.sphere.position.x = this.lineLength * Math.sin(this.pendulum.angleAmplitude) * Math.sin(this.pendulum.angleRotation)
      this.sphere.position.y = -this.lineLength * Math.cos(this.pendulum.angleAmplitude)
      this.sphere.position.z = this.lineLength * Math.sin(this.pendulum.angleAmplitude) * Math.cos(this.pendulum.angleRotation)

      this.trailLine = initTrail(this.sphere.position)
      this.chartValue1.push({name:"0", value:[this.time, this.pendulum.angleAmplitude]})
      this.chartValue2.push({name:"0", value:[this.pendulum.velocityAmplitude, this.pendulum.angleAmplitude]})

      this.scene.add(this.trailLine)
      this.scene.add(this.line)
      this.scene.add(this.sphere)

      this.renderer.render(this.scene, this.camera)
    },
    enableTrail(active) {
      this.trail = active
      if (active) {
        this.trailReload = true
      }
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

      this.lineLength = this.pendulum.length * 5

      if (this.scene != null) {
        this.initScene()
      }
    },
    setAnimation(animate) {
      if (animate) { this.move()  } else { this.stop() }
    },
    move() {
      this.anFrmID = requestAnimationFrame(this.move)

      var nextStep1 = rungeKutta4(this.pendulumAmplitudeEq, this.time, this.pendulum.angleAmplitude, this.pendulum.velocityAmplitude, this.step)
      this.pendulum.angleAmplitude = nextStep1[0]
      this.pendulum.velocityAmplitude = nextStep1[1]

      var nextStep2 = rungeKutta4(this.pendulumRotationEq, this.time, this.pendulum.angleRotation, this.pendulum.velocityRotation, this.step)
      this.pendulum.angleRotation = nextStep2[0]
      this.pendulum.velocityRotation = nextStep2[1]

      this.sphere.position.x = this.lineLength * Math.sin(this.pendulum.angleAmplitude) * Math.sin(this.pendulum.angleRotation)
      this.sphere.position.y = -this.lineLength * Math.cos(this.pendulum.angleAmplitude)
      this.sphere.position.z = this.lineLength * Math.sin(this.pendulum.angleAmplitude) * Math.cos(this.pendulum.angleRotation)

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

      this.chartValueAux1.push({name:"0", value:[this.time,this.pendulum.angleAmplitude]})
      if(this.chartValueAux1.length == 25) {
          this.chartValue1 = this.chartValueAux1
          this.chartValueAux1 = []
      }
      this.chartValueAux2.push({name:"0", value:[this.pendulum.velocityAmplitude,this.pendulum.angleAmplitude]})
      if(this.chartValueAux2.length == 25) {
          this.chartValue2 = this.chartValueAux2
          this.chartValueAux2 = []
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
  }
  
}
</script>
<style>
</style>
