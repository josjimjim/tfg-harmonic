<template>
  <div>
    <h3 class="title is-3">Péndulo cónico</h3>
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
import {initContext, initAxis, initTrail, updateTrail} from "@/assets/js/graphics.js";

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
    initContext(){
      let context = initContext("canvas", new THREE.Vector3(100, 20, 100), new THREE.Vector3(0, 0, 0), true)

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
      let axis = initAxis(500, 500, 500, -17)

      this.scene.add(axis)
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

      this.trailLine = initTrail(this.sphere.position);

      this.minimumFrequency = Math.sqrt(GRAVITY / this.pendulum.length)

      this.scene.add(this.trailLine)
      this.scene.add(this.line)
      this.scene.add(this.sphere)

      this.renderer.render( this.scene, this.camera )
    },
    enableTrail(active) {
      this.trail = active
      if(active){ this.trailReload = true }
    },
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

      if (this.trail) {
        let update = updateTrail(this.trailLine, this.sphere.position, this.trailReload)
        this.trailLine.geometry.vertices = update.vertices
        this.trailReload = update.trailReload
      }

      this.renderer.render(this.scene, this.camera)
    },
    stop(){
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
