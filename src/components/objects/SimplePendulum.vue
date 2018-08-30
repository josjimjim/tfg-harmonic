<template>
  <div>
    <h3 class="title is-3">Simple pendulum</h3>
    <div class="columns">
      <div class="column is-half">
        <div id="canvas"></div>
      </div>
      <simple-input class="column is-quarter" @setStatus="setStatus" @setAnimation="setAnimation"
      @enableDamping="enableDamping" @enableTrail="enableTrail"></simple-input>
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
import {GRAVITY, numericalResolution, pendulumSimpleExact} from '@/assets/js/math.js'

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 400

export default {
  name: 'simple-pendulum',
  components: {
    'simple-input': SimpleInput,
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

      numericalMethodSelected: '',
      nextStep: null
    }
  },
  methods: {
    pendulumEq(t, x, v){
      var damping = 0
      if(this.damping.active){
        damping = (this.damping.value / this.pendulum.mass * v)
      }
      return - GRAVITY * Math.sin(x) / this.pendulum.length - damping
    },
    setStatus(status){
      this.pendulum.angle = parseFloat(status.pendulum.angle * Math.PI / 180)
      this.pendulum.velocity = parseFloat(status.pendulum.velocity)
      this.pendulum.length = parseFloat(status.pendulum.length) * 5
      this.pendulum.mass = parseFloat(status.pendulum.mass)

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
    },
    initContext(){
      this.camera = new THREE.PerspectiveCamera(20, CANVAS_WIDTH/CANVAS_HEIGHT, 0.1, 1000)
      this.camera.position.set(0, 0, 80)
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

      var geometry_circle = new THREE.CircleGeometry( this.pendulum.mass / 2, 50 )
      var material_circle = new THREE.MeshBasicMaterial( { color: 0x2469ff } )
      this.circle = new THREE.Mesh( geometry_circle, material_circle )
      this.circle.position.x = this.pendulum.length * Math.sin(this.pendulum.angle)
      this.circle.position.y = -this.pendulum.length * Math.cos(this.pendulum.angle)

      var material_line = new THREE.LineBasicMaterial( { color: 0x000000 } )
      var geometry_line = new THREE.Geometry()
      geometry_line.vertices.push(new THREE.Vector3( 0, 0, 0))
      geometry_line.vertices.push(new THREE.Vector3( this.circle.position.x, this.circle.position.y, 0))
      this.line = new THREE.Line( geometry_line, material_line )

      this.scene.add(this.line)
      this.scene.add(this.circle)
    },
    move() {
      this.animFrameID = requestAnimationFrame( this.move )

      if(this.numericalMethodSelected != 'pendulumExact'){
        this.nextStep = numericalResolution(this.pendulumEq, this.time, this.pendulum.angle,
        this.pendulum.velocity, this.step)[this.numericalMethodSelected]

        this.time += parseFloat(this.nextStep[2])
        this.step = parseFloat(this.nextStep[2])
      }else{
        this.nextStep = pendulumSimpleExact(this.time, this.pendulum.angle)
        this.time += 0.001
      }

      this.pendulum.angle = parseFloat(this.nextStep[0])
      this.pendulum.velocity = parseFloat(this.nextStep[1])
      this.circle.position.x =  this.pendulum.length * Math.sin(this.pendulum.angle)
      this.circle.position.y = -this.pendulum.length * Math.cos(this.pendulum.angle)
      this.line.geometry.vertices[ 1 ].x = this.circle.position.x
      this.line.geometry.vertices[ 1 ].y = this.circle.position.y
      this.line.geometry.verticesNeedUpdate = true

      this.drawTrail();

      this.renderer.render( this.scene, this.camera )
    },
    stop(){
      cancelAnimationFrame(this.animFrameID)
    },
    drawTrail(){
      if(this.trail) {
        var dotMaterial = new THREE.PointsMaterial( { size: 1, color: 0xff8800 } );
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(new THREE.Vector3( this.circle.position.x, this.circle.position.y, -1));

        var dot = new THREE.Points( dotGeometry, dotMaterial );

        this.scene.add(dot)
      }
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
