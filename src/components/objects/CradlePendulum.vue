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
import {initContext, initAxis} from '@/assets/js/graphics.js'
import {simplePendulum} from '@/assets/js/models.js'
import {GRAVITY, circleColisionDetection, rungeKutta4} from '@/assets/js/math.js'

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
    enableDamping(active) {
      this.damping.active = active
    },
    pendulumEq(t0, x0, v0){

      let g = GRAVITY
      let t = t0
      let d = this.damping.active ? this.damping.value : 0
      let m = this.pendulums[this.ballReference].mass
      let l = this.pendulums[this.ballReference].length
      let x = x0
      let v = v0

      return simplePendulum(g, t, d, m, l, x, v)
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
