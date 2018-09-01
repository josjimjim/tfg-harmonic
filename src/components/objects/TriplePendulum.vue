<template>
  <div>
    <h3 class="title is-3">Triple pendulum</h3>
    <div class="columns">
      <div class="column is-half">
        <div id="canvas"></div>
      </div>
      <triple-input class="column is-quarter" @setStatus="setStatus" @setAnimation="setAnimation"
      @enableDamping="enableDamping" @enableTrail="enableTrail"></triple-input>
    </div>
    <div class="columns">
      <div class="column">
        <documentation type="triple-pendulum"></documentation>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import TripleInput from '../inputs/TripleInput'
import Documentation from '../Documentation'
import {triplePendulum} from '@/assets/js/models.js'
import {GRAVITY, rungeKutta4, euler} from '@/assets/js/math.js'
import {initContext, initAxis, initTrail, updateTrail} from "@/assets/js/graphics.js";

function normalizeAngle(angle) {
  return angle % 360
}

export default {
  name: 'double-pendulum',
  components: {
    'triple-input': TripleInput,
    'documentation': Documentation
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      canvas: null,
      animFrameID: null,

      time: 0,
      step: 0,
      pendulum1: {},
      pendulum2: {},
      pendulum3: {},
      damping: {},

      trail: true,
      trailLine: null,
      trailReload: false,

      circle1: null,
      circle2: null,
      circle3: null,
      line1: null,
      line2: null,
      line3: null,

      circleRadius1: null,
      circleRadius2: null,
      circleRadius3: null,
      lineLength1: null,
      lineLength2: null,
      lineLength3: null
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
    },
    initAxis() {
      let axis = initAxis()

      this.scene.add(axis)
    },
    initObject() {
      var material_circle = new THREE.MeshBasicMaterial( { color: 0x2469ff } )

      var geometry_circle1 = new THREE.CircleGeometry( this.circleRadius1, 32 )
      this.circle1 = new THREE.Mesh( geometry_circle1, material_circle )
      this.circle1.position.x =  this.lineLength1 * Math.sin(this.pendulum1.angle)
      this.circle1.position.y = -this.lineLength1 * Math.cos(this.pendulum1.angle)

      var geometry_circle2 = new THREE.CircleGeometry( this.circleRadius2, 32 )
      this.circle2 = new THREE.Mesh( geometry_circle2, material_circle )
      this.circle2.position.x = this.circle1.position.x + this.lineLength2 * Math.sin(this.pendulum2.angle)
      this.circle2.position.y = this.circle1.position.y - this.lineLength2 * Math.cos(this.pendulum2.angle)

      var geometry_circle3 = new THREE.CircleGeometry( this.circleRadius3, 32 )
      this.circle3 = new THREE.Mesh( geometry_circle3, material_circle )
      this.circle3.position.x = this.circle2.position.x + this.lineLength3 * Math.sin(this.pendulum3.angle)
      this.circle3.position.y = this.circle2.position.y - this.lineLength3 * Math.cos(this.pendulum3.angle)

      var geometry_line1 = new THREE.Geometry()
      var material_line = new THREE.LineBasicMaterial( { color: 0x000000 } )
      geometry_line1.vertices.push(new THREE.Vector3(0, 0, 0))
      geometry_line1.vertices.push(new THREE.Vector3(this.circle1.position.x, this.circle1.position.y, 0))
      this.line1 = new THREE.Line( geometry_line1, material_line )

      var geometry_line2 = new THREE.Geometry()
      geometry_line2.vertices.push(new THREE.Vector3(this.circle1.position.x, this.circle1.position.y, 0))
      geometry_line2.vertices.push(new THREE.Vector3(this.circle2.position.x, this.circle2.position.y, 0))
      this.line2 = new THREE.Line( geometry_line2, material_line )

      var geometry_line3 = new THREE.Geometry()
      geometry_line3.vertices.push(new THREE.Vector3(this.circle2.position.x, this.circle2.position.y, 0))
      geometry_line3.vertices.push(new THREE.Vector3(this.circle3.position.x, this.circle3.position.y, 0))
      this.line3 = new THREE.Line( geometry_line3, material_line )

      this.trailLine = initTrail(this.circle3.position);

      this.scene.add(this.trailLine)
      this.scene.add(this.line1)
      this.scene.add(this.line2)
      this.scene.add(this.line3)
      this.scene.add(this.circle1)
      this.scene.add(this.circle2)
      this.scene.add(this.circle3)

      this.renderer.render( this.scene, this.camera )
    },
    enableDamping(active) {
      this.damping.active = active
    },
    enableTrail(active) {
      this.trail = active
      if(active) { this.trailReload = true }
    },
    pendulumEq31(t0, x0, v0) {
      let g = GRAVITY
      let t = t0
      let d = this.damping.active ? this.damping.value : 0
  
      // Top pendulum variables
      let x1 = x0
      let v1 = v0
      let l1 = this.pendulum1.length
      let m1 = this.pendulum1.mass

      // Middle pendulum variables
      let x2 = this.pendulum2.angle
      let v2 = this.pendulum2.velocity
      let l2 = this.pendulum2.length
      let m2 = this.pendulum2.mass

      // Bottom pendulum variables
      let x3 = this.pendulum3.angle
      let v3 = this.pendulum3.velocity
      let l3 = this.pendulum3.length
      let m3 = this.pendulum3.mass

      return triplePendulum(1, g, t, d, m1, l1, x1, v1, m2, l2, x2, v2, m3, l3, x3, v3)
    },
    pendulumEq32(t0, x0, v0) {
      let g = GRAVITY
      let t = t0
      let d = this.damping.active ? this.damping.value : 0

      // Top pendulum variables
      let x1 = this.pendulum1.angle
      let v1 = this.pendulum1.velocity
      let l1 = this.pendulum1.length
      let m1 = this.pendulum1.mass

      // Middle pendulum variables
      let x2 = x0
      let v2 = v0
      let l2 = this.pendulum2.length
      let m2 = this.pendulum2.mass

      // Bottom pendulum variables
      let x3 = this.pendulum3.angle
      let v3 = this.pendulum3.velocity
      let l3 = this.pendulum3.length
      let m3 = this.pendulum3.mass
      
      return triplePendulum(2, g, t, d, m1, l1, x1, v1, m2, l2, x2, v2, m3, l3, x3, v3)
    },
    pendulumEq33(t0, x0, v0) {
      let g = GRAVITY
      let t = t0
      let d = this.damping.active ? this.damping.value : 0

      // Top pendulum variables
      let x1 = this.pendulum1.angle
      let v1 = this.pendulum1.velocity
      let l1 = this.pendulum1.length
      let m1 = this.pendulum1.mass

      // Middle pendulum variables
      let x2 = this.pendulum2.angle
      let v2 = this.pendulum2.velocity
      let l2 = this.pendulum2.length
      let m2 = this.pendulum2.mass

      // Bottom pendulum variables
      let x3 = x0
      let v3 = v0
      let l3 = this.pendulum3.length
      let m3 = this.pendulum3.mass

      return triplePendulum(3, g, t, d, m1, l1, x1, v1, m2, l2, x2, v2, m3, l3, x3, v3)
    },
    setStatus(status){
      this.pendulum1.angle = parseFloat(status.pendulum1.angle * Math.PI / 180)
      this.pendulum1.length = parseFloat(status.pendulum1.length)
      this.pendulum1.velocity = parseFloat(status.pendulum1.velocity)
      this.pendulum1.mass = parseFloat(status.pendulum1.mass)

      this.pendulum2.angle = parseFloat(status.pendulum2.angle * Math.PI / 180)
      this.pendulum2.length = parseFloat(status.pendulum2.length)
      this.pendulum2.velocity = parseFloat(status.pendulum2.velocity)
      this.pendulum2.mass = parseFloat(status.pendulum2.mass)

      this.pendulum3.angle = parseFloat(status.pendulum3.angle * Math.PI / 180)
      this.pendulum3.length = parseFloat(status.pendulum3.length)
      this.pendulum3.velocity = parseFloat(status.pendulum3.velocity)
      this.pendulum3.mass = parseFloat(status.pendulum3.mass)

      this.damping.value = status.damping.value
      this.damping.active = status.damping.active

      this.circleRadius1 = this.pendulum1.mass / 2
      this.circleRadius2 = this.pendulum2.mass / 2
      this.circleRadius3 = this.pendulum3.mass / 2
      this.lineLength1 = this.pendulum1.length * 5
      this.lineLength2 = this.pendulum2.length * 5
      this.lineLength3 = this.pendulum3.length * 5

      this.step = parseFloat(status.step)

      if(this.scene != null) {
        this.initScene()
      }
    },
    setAnimation(animate) {
      if(animate){ this.move() }else{ this.stop() }
    },
    move() {
      this.animFrameID = requestAnimationFrame( this.move )

      var nextStep1 = euler(this.pendulumEq31, this.time, this.pendulum1.angle, this.pendulum1.velocity, this.step)
      this.pendulum1.angle = parseFloat(nextStep1[0])
      this.pendulum1.velocity = parseFloat(nextStep1[1])
      this.circle1.position.x =  this.lineLength1 * Math.sin(this.pendulum1.angle)
      this.circle1.position.y = -this.lineLength1 * Math.cos(this.pendulum1.angle)
      this.line1.geometry.vertices[ 1 ].x = this.circle1.position.x
      this.line1.geometry.vertices[ 1 ].y = this.circle1.position.y
      this.line1.geometry.verticesNeedUpdate = true
      
      var nextStep2 = euler(this.pendulumEq32, this.time, this.pendulum2.angle, this.pendulum2.velocity, this.step)
      this.pendulum2.angle = parseFloat(nextStep2[0])
      this.pendulum2.velocity = parseFloat(nextStep2[1])
      this.circle2.position.x = this.circle1.position.x + this.lineLength2 * Math.sin(this.pendulum2.angle)
      this.circle2.position.y = this.circle1.position.y - this.lineLength2 * Math.cos(this.pendulum2.angle)
      this.line2.geometry.vertices[ 0 ].x = this.circle1.position.x
      this.line2.geometry.vertices[ 0 ].y = this.circle1.position.y
      this.line2.geometry.vertices[ 1 ].x = this.circle2.position.x
      this.line2.geometry.vertices[ 1 ].y = this.circle2.position.y
      this.line2.geometry.verticesNeedUpdate = true

      var nextStep3 = euler(this.pendulumEq33, this.time, this.pendulum3.angle, this.pendulum3.velocity, this.step)
      this.pendulum3.angle = parseFloat(nextStep3[0])
      this.pendulum3.velocity = parseFloat(nextStep3[1])
      this.circle3.position.x = this.circle2.position.x + this.lineLength3 * Math.sin(this.pendulum3.angle)
      this.circle3.position.y = this.circle2.position.y - this.lineLength3 * Math.cos(this.pendulum3.angle)
      this.line3.geometry.vertices[ 0 ].x = this.circle2.position.x
      this.line3.geometry.vertices[ 0 ].y = this.circle2.position.y
      this.line3.geometry.vertices[ 1 ].x = this.circle3.position.x
      this.line3.geometry.vertices[ 1 ].y = this.circle3.position.y
      this.line3.geometry.verticesNeedUpdate = true

      this.time += this.step

      if (this.trail) {
        let update = updateTrail(this.trailLine, this.circle3.position, this.trailReload)
        this.trailLine.geometry.vertices = update.vertices
        this.trailReload = update.trailReload
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
