<template>
  <div>
    <h3 class="title is-3">Spring pendulum</h3>
    <div class="columns">
      <div class="column is-half">
        <div id="canvas"></div>
      </div>
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
import {GRAVITY, numericalResolution} from '@/assets/js/math.js'

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 400

const MAX_TRAIL_POINTS = 5000

export default {
  name: 'spring-pendulum',
  components: {
    'spring-input': SpringInput,
    'documentation': Documentation
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

      numericalMethodSelected: ''
    }
  },
  methods: {
    pendulumSpringEq(t, x, v){
      let damping = 0
      if(this.damping.active){
        damping = (this.damping.value / this.pendulum.mass * v)
      }

      let a = (this.pendulum.length + x) * Math.pow(this.pendulum.velocity, 2)
      let b = GRAVITY * Math.cos(this.pendulum.angle)
      let c = this.pendulum.stiffness * x / this.pendulum.mass
      return a + b - c - damping
    },
    pendulumAngleEq(t, x, v){
      let damping = 0
      if(this.damping.active){
        damping = (this.damping.value / this.pendulum.mass * v)
      }

      let a = GRAVITY * Math.sin(x)
      let b = 2 * this.pendulum.elongationVelocity * v
      let c = (this.pendulum.length + this.pendulum.elongation)
      return (-a - b) / c  - damping
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
      this.renderer.sortObjects = false;
      this.canvas = document.getElementById("canvas")
      this.canvas.appendChild(this.renderer.domElement)

    },
    initScene() {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color( 0xffffff )

      this.initAxis()
      this.initObject()

      this.renderer.render( this.scene, this.camera )
    },
    initAxis() {
      let materialAxisX = new THREE.LineBasicMaterial( { color: 0xff0000 } )
      let geometryAxisX = new THREE.Geometry()
      geometryAxisX.vertices.push(new THREE.Vector3( 0, -50, 0) )
      geometryAxisX.vertices.push(new THREE.Vector3( 0,  50, 0) )

      let materialAxisY = new THREE.LineBasicMaterial( { color: 0x0000ff } )
      let geometryAxisY = new THREE.Geometry()
      geometryAxisY.vertices.push(new THREE.Vector3(-50, 0, 0) )
      geometryAxisY.vertices.push(new THREE.Vector3( 50, 0, 0) )

      let axisX = new THREE.Line( geometryAxisX, materialAxisX )
      let axisY = new THREE.Line( geometryAxisY, materialAxisY )

      let axis = new THREE.Object3D()
      axis.add( axisX )
      axis.add( axisY )
      this.scene.add( axis )
    },
    initObject() {

      let geometry_circle = new THREE.CircleGeometry( this.pendulum.mass / 2, 50 )
      let material_circle = new THREE.MeshBasicMaterial( { color: 0x2469ff } )
      this.circle = new THREE.Mesh( geometry_circle, material_circle )
      this.circle.position.x =  (this.pendulum.length + this.pendulum.elongation) * Math.sin(this.pendulum.angle)
      this.circle.position.y = -(this.pendulum.length + this.pendulum.elongation) * Math.cos(this.pendulum.angle)

      let material_line = new THREE.LineBasicMaterial( { color: 0x000000 } )
      let geometry_line = new THREE.Geometry()
      geometry_line.vertices.push(new THREE.Vector3( 0, 0, 0))
      geometry_line.vertices.push(new THREE.Vector3( this.circle.position.x, this.circle.position.y, 0))
      this.line = new THREE.Line( geometry_line, material_line )

      this.initTrail()
      
      this.scene.add(this.trailLine)
      this.scene.add(this.line)
      this.scene.add(this.circle)
    },
    move() {
      this.animFrameID = requestAnimationFrame( this.move )

      let nextStep1 = numericalResolution(this.pendulumAngleEq, this.time, this.pendulum.angle, this.pendulum.velocity, this.step)[this.numericalMethodSelected]
      this.pendulum.angle = parseFloat(nextStep1[0])
      this.pendulum.velocity = parseFloat(nextStep1[1])

      let nextStep2 = numericalResolution(this.pendulumSpringEq, this.time, this.pendulum.elongation, this.pendulum.elongationVelocity, this.step)[this.numericalMethodSelected]
      this.pendulum.elongation = parseFloat(nextStep2[0])
      this.pendulum.elongationVelocity = parseFloat(nextStep2[1])

      this.circle.position.x =  (this.pendulum.length + this.pendulum.elongation) * Math.sin(this.pendulum.angle)
      this.circle.position.y = -(this.pendulum.length + this.pendulum.elongation) * Math.cos(this.pendulum.angle)
      this.line.geometry.vertices[ 1 ].x = this.circle.position.x
      this.line.geometry.vertices[ 1 ].y = this.circle.position.y
      this.line.geometry.verticesNeedUpdate = true

      this.time += parseFloat(nextStep1[2])
      this.step = parseFloat(nextStep1[2])

      this.updateTrail()

      this.renderer.render( this.scene, this.camera )
    },
    stop(){
      cancelAnimationFrame(this.animFrameID)
    },
    initTrail(){
      let lineMaterial = new THREE.MeshBasicMaterial({color: 0xff8800 })
      let geometry = new THREE.Geometry()
      for (let i=0; i < MAX_TRAIL_POINTS; i++){
        geometry.vertices.push(new THREE.Vector3(this.circle.position.x, this.circle.position.y, 0))
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
        this.trailLine.geometry.vertices[MAX_TRAIL_POINTS - 1] = new THREE.Vector3(this.circle.position.x, this.circle.position.y, 0)
        this.trailLine.geometry.verticesNeedUpdate = true
      }
    },
    reloadTrail() {
      for (let i=0; i < MAX_TRAIL_POINTS; i++){
        this.trailLine.geometry.vertices[i] = new THREE.Vector3(this.circle.position.x, this.circle.position.y, 0)
        this.trailLine.geometry.verticesNeedUpdate = true
      }
    }
    // createSpring(x, y) {
    //     let pi2 = Math.PI * 2.0;
    //     let twists = 10;
    //     let angleIncr = Math.PI / 8;
    //     let height = 6 - posY;
    //     let cylY = 5.5 - height * 0.5;
    //     let x,z;
    //     let y = height/2;
    //     let radius = this.pendulum.mass / 4;
    //     let n = 0;
    //     let yIncr = height / (pi2 / angleIncr * twists );
    //     let helix = [];
    //     for( let i=0; i<=pi2 * twists; i+=angleIncr ) {
    //         x = Math.cos(i) * radius;
    //         y -= yIncr;
    //         z = Math.sin(i) * radius;
    //         helix.push( new THREE.Vector3(x, y, z));

    //         n++;
    //     }
        
    // }
  },
  mounted() {
    this.initContext()
    this.initScene()
  }
}
</script>
<style>

</style>
