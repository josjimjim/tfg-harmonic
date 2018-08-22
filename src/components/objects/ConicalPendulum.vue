<template>
  <div>
    <h3 class="title is-3">Conical pendulum</h3>
    <div class="columns">
      <div class="column is-half">
        <div id="canvas"></div>
      </div>
      <conical-input class="column is-quarter" @setStatus="setStatus" @setAnimation="setAnimation"
      @enableTrail="enableTrail"></conical-input>
    </div>
    <div class="columns">
      <div class="column">
        <documentation type="conical-pendulum"></documentation>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
window.THREE = THREE;
require('three/examples/js/controls/OrbitControls.js');

import ConicalInput from '../inputs/ConicalInput'
import Documentation from '../Documentation'
import {GRAVITY} from '@/assets/js/math.js'

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 400

const MAX_TRAIL_POINTS = 5000

export default {
  name: 'conical-pendulum',
  components: {
    'conical-input': ConicalInput,
    'documentation': Documentation
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      canvas: null,
      controls: null,

      sphere: null,
      line: null,

      trail: false,
      trailLine: null,
      trailReload: false,

      pendulum: {},
      angleAmplitude: 0,
      angleRotation: 0,
      minimumFrequency: 0,

      lineLength: 0,

      anFrmID: null
    }
  },
  methods: {
    setStatus(status){
      this.pendulum.frequency = parseFloat(status.pendulum.frequency)
      this.pendulum.mass = parseFloat(status.pendulum.mass)
      this.pendulum.length = parseFloat(status.pendulum.length)

      this.lineLength = this.pendulum.length * 5

      if(this.scene != null) {
        this.initScene()
      }
    },
    setAnimation(animate) {
      if(animate){ this.move() }else{ this.stop() }
    },
    enableTrail(active) {
      this.trail = active
      if(active){ this.trailReload = true }
    },
    initContext(){
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT)
      this.renderer.sortObjects = false

      this.camera = new THREE.PerspectiveCamera(20, CANVAS_WIDTH/CANVAS_HEIGHT, 0.1, 1000)
      this.camera.position.set( 100, 20, 100 )
      this.camera.lookAt( new THREE.Vector3(0, 0, 0))

      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)

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
      geometryAxisY.vertices.push(new THREE.Vector3(-50, -17, 0) )
      geometryAxisY.vertices.push(new THREE.Vector3( 50, -17, 0) )

      var materialAxisZ = new THREE.LineBasicMaterial( { color: 0x00ff00 } )
      var geometryAxisZ = new THREE.Geometry()
      geometryAxisZ.vertices.push(new THREE.Vector3( 0, -17, -50) )
      geometryAxisZ.vertices.push(new THREE.Vector3( 0, -17, 50) )

      var axisX = new THREE.Line( geometryAxisX, materialAxisX )
      var axisY = new THREE.Line( geometryAxisY, materialAxisY )
      var axisZ = new THREE.Line( geometryAxisZ, materialAxisZ )

      var axis = new THREE.Object3D()
      axis.add( axisX )
      axis.add( axisY )
      axis.add( axisZ )

      this.scene.add( axis )
    },
    initObject() {

      var geometry_sphere = new THREE.SphereGeometry( this.pendulum.mass / 2, 32, 32 )
      var material_sphere = new THREE.MeshBasicMaterial( { color: 0x2469ff } )
      this.sphere = new THREE.Mesh( geometry_sphere, material_sphere )
      this.sphere.position.x =  this.lineLength * Math.sin(this.angleAmplitude) *  Math.sin(this.angleRotation)
      this.sphere.position.y = -this.lineLength * Math.cos(this.angleAmplitude)
      this.sphere.position.z =  this.lineLength * Math.sin(this.angleAmplitude) *  Math.cos(this.angleRotation)

      var material_line = new THREE.LineBasicMaterial( { color: 0x000000 } )
      var geometry_line = new THREE.Geometry()
      geometry_line.vertices.push(new THREE.Vector3(0, 0, 0))
      geometry_line.vertices.push(new THREE.Vector3(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z))
      this.line = new THREE.Line( geometry_line, material_line )

      this.initTrail()

      this.minimumFrequency = Math.sqrt(GRAVITY / this.pendulum.length)

      this.scene.add(this.trailLine)
      this.scene.add(this.line)
      this.scene.add(this.sphere)

      this.renderer.render( this.scene, this.camera )
    },
    move() {
      this.anFrmID = requestAnimationFrame( this.move )

      this.angleAmplitude = this.pendulum.frequency > this.minimumFrequency ? Math.acos(GRAVITY / (this.pendulum.length * Math.pow(this.pendulum.frequency, 2))) : 0.0
      this.angleRotation += this.pendulum.frequency * 0.01// x dif(time) pero como siempre será 1 pues ¯\_(ツ)_/¯

      this.sphere.position.x =  this.lineLength * Math.sin(this.angleAmplitude) *  Math.sin(this.angleRotation)
      this.sphere.position.y = -this.lineLength * Math.cos(this.angleAmplitude)
      this.sphere.position.z =  this.lineLength * Math.sin(this.angleAmplitude) *  Math.cos(this.angleRotation)

      this.line.geometry.vertices[ 1 ].x = this.sphere.position.x
      this.line.geometry.vertices[ 1 ].y = this.sphere.position.y
      this.line.geometry.vertices[ 1 ].z = this.sphere.position.z
      this.line.geometry.verticesNeedUpdate = true

      this.updateTrail()

      this.renderer.render(this.scene, this.camera)
    },
    stop(){
      cancelAnimationFrame(this.anFrmID)
    },
    initTrail(){
      var lineMaterial = new THREE.MeshBasicMaterial({color: 0xff8800 })
      var geometry = new THREE.Geometry()
      for (var i=0; i < MAX_TRAIL_POINTS; i++){
        geometry.vertices.push(new THREE.Vector3(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z))
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
        this.trailLine.geometry.vertices.push(this.trailLine.geometry.vertices.shift())
        this.trailLine.geometry.vertices[MAX_TRAIL_POINTS - 1] = new THREE.Vector3(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z)
        this.trailLine.geometry.verticesNeedUpdate = true
      }
    },
    reloadTrail() {
      for (var i=0; i < MAX_TRAIL_POINTS; i++){
        this.trailLine.geometry.vertices[i] = new THREE.Vector3(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z)
        this.trailLine.geometry.verticesNeedUpdate = true
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
