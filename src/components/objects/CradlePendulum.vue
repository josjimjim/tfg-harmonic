<template>
  <div>
    <h3 class="title is-3">Newton's cradle</h3>
    <div class="columns">
      <div class="column is-half">
        <div id="canvas"></div>
      </div>
      <cradle-input class="column is-quarter" @setStatus="setStatus" @setAnimation="setAnimation"
      @enableDamping="enableDamping"></cradle-input>
    </div>
    <div class="columns">
      <div class="column">
        <documentation type="cradle-pendulum"></documentation>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import CradleInput from '../inputs/CradleInput'
import Documentation from '../Documentation'
import {GRAVITY, circleColisionDetection, rungeKutta4} from '@/assets/js/math.js'

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 400

export default {
  name: 'cradle-pendulum',
  components: {
    'cradle-input': CradleInput,
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
      damping: {},

      ballsNum: 5,
      position: 0,
      pendulums: [],
      totalGap: 0,
      ballReference: 0
    }
  },
  methods: {
    pendulumEq(t, x, v){
      var damping = 0
      if(this.damping.active){
        damping = (this.damping.value / this.pendulums[this.ballReference].mass * v)
      }
      return - GRAVITY * Math.sin(x) / this.pendulums[this.ballReference].length - damping
    },
    setStatus(status){

      this.position = parseInt(status.position)
      this.totalGap = 0;
      this.pendulums = [];

      for(let i = 0; i < this.ballsNum; i++){
        let ang = i < this.position ? parseFloat(status.pendulum.angle * Math.PI / 180) : 0.0
        let vec = i < this.position ? parseFloat(status.pendulum.velocity) : 0.0

        this.pendulums.push({
          angle: ang,
          velocity: vec,
          mass: parseFloat(status.pendulum.mass),
          momentum: parseFloat(status.pendulum.mass) * vec,
          radius: parseFloat(status.pendulum.mass) / 2,
          length: 5.0,
          circle: null,
          line: null
        })

        this.step = parseFloat(status.step)
        this.totalGap += parseFloat(status.pendulum.mass)
      }

      this.totalGap -= this.pendulums[0].mass
      this.damping.value = status.damping.value
      this.damping.active = status.damping.active

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

      let gap = 0
      let material_circle = new THREE.MeshBasicMaterial( { color: 0x2469ff } )
      let material_line = new THREE.LineBasicMaterial( { color: 0x000000 } )

      for(let i = 0; i < this.pendulums.length; i++){

        let geometry_circle = new THREE.CircleGeometry( this.pendulums[i].radius, 50 )
        this.pendulums[i].circle = new THREE.Mesh( geometry_circle, material_circle )
        this.pendulums[i].circle.position.x =  this.pendulums[i].length * Math.sin(this.pendulums[i].angle) - gap + this.totalGap/2
        this.pendulums[i].circle.position.y = -this.pendulums[i].length * Math.cos(this.pendulums[i].angle) + this.pendulums[i].length/2

        let geometry_line = new THREE.Geometry()
        geometry_line.vertices.push(new THREE.Vector3( -gap + this.totalGap/2, this.pendulums[i].length / 2 , 0))
        geometry_line.vertices.push(new THREE.Vector3( this.pendulums[i].circle.position.x, this.pendulums[i].circle.position.y, 0))
        this.pendulums[i].line = new THREE.Line( geometry_line, material_line )

        gap += this.pendulums[i].radius * 2 
        this.scene.add(this.pendulums[i].line)
        this.scene.add(this.pendulums[i].circle)
      }

      this.renderer.render( this.scene, this.camera )
 
    },
    move() {
      this.animFrameID = requestAnimationFrame( this.move )

      let gap = 0
      for(let i = 0; i < this.pendulums.length; i++){
        this.ballReference = i;

        let nextStep = rungeKutta4(this.pendulumEq, this.time, this.pendulums[i].angle, this.pendulums[i].velocity, this.step)

        this.pendulums[i].angle = parseFloat(nextStep[0])
        this.pendulums[i].velocity = parseFloat(nextStep[1])
        this.pendulums[i].circle.position.x =  this.pendulums[i].length * Math.sin(this.pendulums[i].angle) - gap + this.totalGap/2
        this.pendulums[i].circle.position.y = -this.pendulums[i].length * Math.cos(this.pendulums[i].angle) + this.pendulums[i].length/2
        this.pendulums[i].line.geometry.vertices[ 1 ].x = this.pendulums[i].circle.position.x
        this.pendulums[i].line.geometry.vertices[ 1 ].y = this.pendulums[i].circle.position.y
        this.pendulums[i].line.geometry.verticesNeedUpdate = true

        this.time += parseFloat(nextStep[2])
        this.step = parseFloat(nextStep[2])

        for(let j = 0; j < this.pendulums.length; j++){
          if(i!=j && this.pendulums[i].velocity != 0 && circleColisionDetection(this.pendulums[i], this.pendulums[j], 0)){
            this.pendulums[j].velocity = this.pendulums[i].velocity
            this.pendulums[i].velocity = 0
          }
        }

        gap += this.pendulums[i].radius * 2 
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
