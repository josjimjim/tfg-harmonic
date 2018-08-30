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
import {GRAVITY, rungeKutta4, euler} from '@/assets/js/math.js'

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 400

const MAX_TRAIL_POINTS = 5000

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
    pendulumEq31(t, x, v) {
      var damping = this.damping.active ? this.damping.value : 0
  
      // Pendulum 1 variables
      let x1 = x
      let v1 = v
      let l1 = this.pendulum1.length
      let m1 = this.pendulum1.mass

      // Pendulum 2 variables
      let x2 = this.pendulum2.angle
      let v2 = this.pendulum2.velocity
      let l2 = this.pendulum2.length
      let m2 = this.pendulum2.mass

      // Pendulum 3 variables
      let x3 = this.pendulum3.angle
      let v3 = this.pendulum3.velocity
      let l3 = this.pendulum3.length
      let m3 = this.pendulum3.mass

      let w1 = v1 * damping // DAMPING
      let a1 = GRAVITY * (m1 + m2 + m3) * Math.sin(x1)
      let b1 = l2 * (m2 + m3) * Math.sin(x1 - x2) * Math.pow(v2, 2)
      let c1 = l3 * m3 * Math.sin(x1 - x3) * Math.pow(v3, 2)
      let d1 = (l1 * m1 + (m2 + m3) * l1) //* acc1 
      let e1 = (m2 + m3) * l2 * Math.cos(x1 - x2) //* acc2
      let f1 = l3 * m3 * Math.cos(x1 - x3) //* acc3

      let w2 = v2 * damping // DAMPING
      let a2 = l1 * (m2 + m3) * Math.sin(x1 - x2) * Math.pow(v1, 2)
      let b2 = l3 * m3 * Math.sin(x2 - x3) * Math.pow(v3, 2)
      let c2 = (m2 + m3) * GRAVITY * Math.sin(x2) 
      let d2 = (m2 + m3) * l1 * Math.cos(x1 - x2)// * acc1
      let e2 = (m2 + m3) * l2// * acc2
      let f2 = l3 * m3 * Math.cos(x2 - x3)// * acc3

      let w3 = v3 * damping // g
      let a3 = m3 * GRAVITY * Math.sin(x3)
      let b3 = m3 * l1 * Math.sin(x1 - x3) * Math.pow(v1, 2)
      let c3 = m3 * l2 * Math.sin(x2 - x3) * Math.pow(v2, 2)
      let d3 = m3 * l1 * Math.cos(x1 - x3) //* acc1
      let e3 = m3 * l2 * Math.cos(x2 - x3) //* acc2
      let f3 = m3 * l3 //* acc3


      return -((e3*f2 - e2*f3)*a1 + (e3*f2 - e2*f3)*b1 + (e3*f2 - e2*f3)*c1
- ((a3 - b3 - c3 + w3)*f2 + a2*f3 - b2*f3 - c2*f3 - f3*w2)*e1 + ((a3 -
b3 - c3 + w3)*e2 + a2*e3 - b2*e3 - c2*e3 - e3*w2)*f1 + (e3*f2 -
e2*f3)*w1)/((e3*f2 - e2*f3)*d1 - (d3*f2 - d2*f3)*e1 + (d3*e2 -
d2*e3)*f1)
    },
    pendulumEq32(t, x, v) {
      var damping = this.damping.active ? this.damping.value : 0
      console.log(damping)
      // Pendulum 1 variables
      let x1 = this.pendulum1.angle
      let v1 = this.pendulum1.velocity
      let l1 = this.pendulum1.length
      let m1 = this.pendulum1.mass

      // Pendulum 2 variables
      let x2 = x
      let v2 = v
      let l2 = this.pendulum2.length
      let m2 = this.pendulum2.mass

      // Pendulum 3 variables
      let x3 = this.pendulum3.angle
      let v3 = this.pendulum3.velocity
      let l3 = this.pendulum3.length
      let m3 = this.pendulum3.mass
      
      let w1 = v1 * damping // DAMPING
      let a1 = GRAVITY * (m1 + m2 + m3) * Math.sin(x1)
      let b1 = l2 * (m2 + m3) * Math.sin(x1 - x2) * Math.pow(v2, 2)
      let c1 = l3 * m3 * Math.sin(x1 - x3) * Math.pow(v3, 2)
      let d1 = (l1 * m1 + (m2 + m3) * l1) //* acc1 
      let e1 = (m2 + m3) * l2 * Math.cos(x1 - x2) //* acc2
      let f1 = l3 * m3 * Math.cos(x1 - x3) //* acc3

      let w2 = v2 * damping // DAMPING
      let a2 = l1 * (m2 + m3) * Math.sin(x1 - x2) * Math.pow(v1, 2)
      let b2 = l3 * m3 * Math.sin(x2 - x3) * Math.pow(v3, 2)
      let c2 = (m2 + m3) * GRAVITY * Math.sin(x2) 
      let d2 = (m2 + m3) * l1 * Math.cos(x1 - x2)// * acc1
      let e2 = (m2 + m3) * l2// * acc2
      let f2 = l3 * m3 * Math.cos(x2 - x3)// * acc3

      let w3 = v3 * damping // g
      let a3 = m3 * GRAVITY * Math.sin(x3)
      let b3 = m3 * l1 * Math.sin(x1 - x3) * Math.pow(v1, 2)
      let c3 = m3 * l2 * Math.sin(x2 - x3) * Math.pow(v2, 2)
      let d3 = m3 * l1 * Math.cos(x1 - x3) //* acc1
      let e3 = m3 * l2 * Math.cos(x2 - x3) //* acc2
      let f3 = m3 * l3 //* acc3

      return ((d3*f2 - d2*f3)*a1 + (d3*f2 - d2*f3)*b1 + (d3*f2 -
d2*f3)*c1 - ((a3 - b3 - c3 + w3)*f2 + a2*f3 - b2*f3 - c2*f3 - f3*w2)*d1
+ ((a3 - b3 - c3 + w3)*d2 + a2*d3 - b2*d3 - c2*d3 - d3*w2)*f1 + (d3*f2 -
d2*f3)*w1)/((e3*f2 - e2*f3)*d1 - (d3*f2 - d2*f3)*e1 + (d3*e2 -
d2*e3)*f1)
    },
    pendulumEq33(t, x, v) {
      var damping = this.damping.active ? this.damping.value : 0

      // Pendulum 1 variables
      let x1 = this.pendulum1.angle
      let v1 = this.pendulum1.velocity
      let l1 = this.pendulum1.length
      let m1 = this.pendulum1.mass

      // Pendulum 2 variables
      let x2 = this.pendulum2.angle
      let v2 = this.pendulum2.velocity
      let l2 = this.pendulum2.length
      let m2 = this.pendulum2.mass

      // Pendulum 3 
      let x3 = x
      let v3 = v
      let l3 = this.pendulum3.length
      let m3 = this.pendulum3.mass

      let w1 = v1 * damping // DAMPING
      let a1 = GRAVITY * (m1 + m2 + m3) * Math.sin(x1)
      let b1 = l2 * (m2 + m3) * Math.sin(x1 - x2) * Math.pow(v2, 2)
      let c1 = l3 * m3 * Math.sin(x1 - x3) * Math.pow(v3, 2)
      let d1 = (l1 * m1 + (m2 + m3) * l1) //* acc1 
      let e1 = (m2 + m3) * l2 * Math.cos(x1 - x2) //* acc2
      let f1 = l3 * m3 * Math.cos(x1 - x3) //* acc3

      let w2 = v2 * damping // DAMPING
      let a2 = l1 * (m2 + m3) * Math.sin(x1 - x2) * Math.pow(v1, 2)
      let b2 = l3 * m3 * Math.sin(x2 - x3) * Math.pow(v3, 2)
      let c2 = (m2 + m3) * GRAVITY * Math.sin(x2) 
      let d2 = (m2 + m3) * l1 * Math.cos(x1 - x2)// * acc1
      let e2 = (m2 + m3) * l2// * acc2
      let f2 = l3 * m3 * Math.cos(x2 - x3)// * acc3

      let w3 = v3 * damping // g
      let a3 = m3 * GRAVITY * Math.sin(x3)
      let b3 = m3 * l1 * Math.sin(x1 - x3) * Math.pow(v1, 2)
      let c3 = m3 * l2 * Math.sin(x2 - x3) * Math.pow(v2, 2)
      let d3 = m3 * l1 * Math.cos(x1 - x3) //* acc1
      let e3 = m3 * l2 * Math.cos(x2 - x3) //* acc2
      let f3 = m3 * l3 //* acc3

      return -((d3*e2 - d2*e3)*a1 + (d3*e2 - d2*e3)*b1 + (d3*e2 -
d2*e3)*c1 - ((a3 - b3 - c3 + w3)*e2 + a2*e3 - b2*e3 - c2*e3 - e3*w2)*d1
+ ((a3 - b3 - c3 + w3)*d2 + a2*d3 - b2*d3 - c2*d3 - d3*w2)*e1 + (d3*e2 -
d2*e3)*w1)/((e3*f2 - e2*f3)*d1 - (d3*f2 - d2*f3)*e1 + (d3*e2 -
d2*e3)*f1)
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
    enableDamping(active) {
      this.damping.active = active
    },
    enableTrail(active) {
      this.trail = active
      if(active) { this.trailReload = true }
    },
    initContext(){
      this.camera = new THREE.PerspectiveCamera(20, CANVAS_WIDTH/CANVAS_HEIGHT, 0.1, 1000)
      this.camera.position.set(0, 0, 100)
      this.camera.lookAt( new THREE.Vector3(0, 0, 0))

      this.renderer = new THREE.WebGLRenderer() 
      this.renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT)
      this.renderer.sortObjects = false

      this.canvas = document.getElementById("canvas")
      this.canvas.appendChild(this.renderer.domElement)

    },
    initScene() {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color( 0xffffff )

      this.initAxis()
      this.initObject()
    },
    initAxis() {
      var materialAxisX = new THREE.LineBasicMaterial( { color: 0xff0000 } )
      var geometryAxisX = new THREE.Geometry()
      geometryAxisX.vertices.push(new THREE.Vector3( 0, -50, 0) )
      geometryAxisX.vertices.push(new THREE.Vector3( 0,  50, 0) )

      var materialAxisY = new THREE.LineBasicMaterial( { color: 0x0000ff } )
      var geometryAxisY = new THREE.Geometry()
      geometryAxisY.vertices.push(new THREE.Vector3(-50, 0, 0) )
      geometryAxisY.vertices.push(new THREE.Vector3( 50, 0, 0) )

      var axisX = new THREE.Line( geometryAxisX, materialAxisX )
      var axisY = new THREE.Line( geometryAxisY, materialAxisY )

      var axis = new THREE.Object3D()
      axis.add( axisX )
      axis.add( axisY )
      this.scene.add( axis )
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

      this.initTrail()

      this.scene.add(this.trailLine)
      this.scene.add(this.line1)
      this.scene.add(this.line2)
      this.scene.add(this.line3)
      this.scene.add(this.circle1)
      this.scene.add(this.circle2)
      this.scene.add(this.circle3)

      this.renderer.render( this.scene, this.camera )
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

      console.log(nextStep1[0])
      console.log(nextStep2[0])
      console.log(nextStep3[0])
      console.log("\n")
      this.time += this.step

      this.updateTrail()

      this.renderer.render( this.scene, this.camera )
    },
    stop(){
      cancelAnimationFrame(this.animFrameID)
    },
    initTrail(){
      var lineMaterial = new THREE.MeshBasicMaterial({color: 0xff8800 })
      var geometry = new THREE.Geometry()
      for (var i=0; i < MAX_TRAIL_POINTS; i++){
        geometry.vertices.push(new THREE.Vector3(this.circle3.position.x, this.circle3.position.y, 0))
      }
      this.trailLine = new THREE.Line(geometry, lineMaterial)
      this.trailLine.geometry.dynamic = true
    },
    updateTrail(){
       if(this.trail) {
        if(this.trailReload) {
          this.reloadTrail()
          this.trailReload = false
        }
        this.trailLine.geometry.vertices.push(this.trailLine.geometry.vertices.shift());
        this.trailLine.geometry.vertices[MAX_TRAIL_POINTS - 1] = new THREE.Vector3(this.circle3.position.x, this.circle3.position.y, 0)
        this.trailLine.geometry.verticesNeedUpdate = true
      }
    },
    reloadTrail() {
      for (var i=0; i < MAX_TRAIL_POINTS; i++){
        this.trailLine.geometry.vertices[i] = new THREE.Vector3(this.circle3.position.x, this.circle3.position.y, 0)
        this.trailLine.geometry.verticesNeedUpdate = true
      }
    }    
  },
  mounted() {
    this.initContext()
    this.initScene()
  },
  beforeDestroy() {
    // this.camera.aspect = window.innerWidth/ window.innerHeight
    //
		// this.camera.updateProjectionMatrix()
		// this.renderer.setSize( window.innerWidth, window.innerHeight )
  }
}
</script>
<style>

</style>
