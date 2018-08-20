<template>
  <div>
    <h3 class="title is-3">Double pendulum</h3>
    <div class="columns">
      <div class="column is-half">
        <div id="canvas"></div>
      </div>
      <double-input class="column is-quarter" @setStatus="setStatus" @setAnimation="setAnimation"
      @enableDamping="enableDamping"></double-input>
    </div>
    <div class="columns">
      <div class="column">
        <documentation type="double-pendulum"></documentation>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import DoubleImput from '../inputs/DoubleInput'
import Documentation from '../Documentation'
import {GRAVITY, rungeKutta4} from '@/assets/js/math.js'

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

export default {
  name: 'double-pendulum',
  components: {
    'double-input': DoubleImput,
    'documentation': Documentation
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      canvas: null,

      time: 0,
      step: 0,
      pendulum1: {},
      pendulum2: {},
      damping: {},

      circle1: null,
      circle2: null,
      line1: null,
      line2: null,

      circleRadius1: null,
      circleRadius2: null,
      lineLength1: null,
      lineLength2: null,

      anFrmID: null
    }
  },
  methods: {
    pendulumUpEq(x, v, t) {
      var pendulum1 = this.pendulum1
      var pendulum2 = this.pendulum2

      var damping = 0;
      if(this.damping.active){
        damping = (this.damping.value / pendulum1.mass * v)
      }

    	var a = Math.pow(v, 2) * pendulum1.length * pendulum2.mass * Math.cos(x - pendulum2.angle) * Math.sin(x - pendulum2.angle);
    	var b = GRAVITY * pendulum2.mass * Math.sin(pendulum2.angle) * Math.cos(x - pendulum2.angle);
    	var c = Math.pow(pendulum2.velocity, 2) * pendulum2.length * Math.sin(x - pendulum2.angle) * pendulum2.mass;
    	var d = GRAVITY * (pendulum1.mass + pendulum2.mass) * Math.sin(x);
    	var e = pendulum1.length * (pendulum1.mass + pendulum2.mass) - pendulum1.length * pendulum2.mass * Math.pow(Math.cos(x - pendulum2.angle), 2);

      return ((- a + b - c - d) / e) - damping
    },

    pendulumDwEq(x, v, t) {
      var pendulum1 = this.pendulum1
      var pendulum2 = this.pendulum2

      var damping = 0;
      if(this.damping.active){
        damping = (this.damping.value / pendulum2.mass * v)
      }

      var a = Math.pow(v, 2) * pendulum2.length * pendulum2.mass * Math.cos(pendulum1.angle - x) * Math.sin(pendulum1.angle - x);
      var b = GRAVITY * (pendulum1.mass + pendulum2.mass) * Math.sin(pendulum1.angle) * Math.cos(pendulum1.angle - x);
      var c = Math.pow(pendulum1.velocity, 2) * pendulum1.length * Math.sin(pendulum1.angle - x) * (pendulum1.mass + pendulum2.mass);
      var d = GRAVITY * (pendulum1.mass + pendulum2.mass) * Math.sin(x);
      var e = pendulum2.length * (pendulum1.mass + pendulum2.mass) - pendulum2.length * pendulum2.mass * Math.pow(Math.cos(pendulum1.angle - x), 2);

      return ((a + b + c - d) / e) - damping
    },

    setStatus(status){
      this.pendulum1.angle = parseFloat(status.pendulum1.angle * Math.PI / 180);
      this.pendulum1.length = parseFloat(status.pendulum1.length);
      this.pendulum1.velocity = parseFloat(status.pendulum1.velocity);
      this.pendulum1.mass = parseFloat(status.pendulum1.mass);

      this.pendulum2.angle = parseFloat(status.pendulum2.angle * Math.PI / 180);
      this.pendulum2.length = parseFloat(status.pendulum2.length);
      this.pendulum2.velocity = parseFloat(status.pendulum2.velocity);
      this.pendulum2.mass = parseFloat(status.pendulum2.mass);

      this.damping.value = status.damping.value
      this.damping.active = status.damping.active

      this.circleRadius1 = this.pendulum1.mass / 2;
      this.circleRadius2 = this.pendulum2.mass / 2;
      this.lineLength1 = this.pendulum1.length * 5;
      this.lineLength2 = this.pendulum2.length * 5;

      this.step = parseFloat(status.step);

      if(this.scene != null) {
        this.initScene()
      }
    },
    setAnimation(animate) {
      if(animate) this.move(); else this.stop();
    },
    enableDamping(active) {
      console.log(active)
      this.damping.active = active
    },
    initContext(){
      this.camera = new THREE.PerspectiveCamera(20, CANVAS_WIDTH/CANVAS_HEIGHT, 0.1, 1000);
      this.camera.position.set(0, 0, 100);
      this.camera.lookAt( new THREE.Vector3(0, 0, 0));

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT);
      this.renderer.sortObjects = false;

      this.canvas = document.getElementById("canvas");
      this.canvas.appendChild(this.renderer.domElement);

    },
    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color( 0xffffff );

      this.initAxis();
      this.initObject();
    },
    initAxis() {
      var materialAxisX = new THREE.LineBasicMaterial( { color: 0xff0000 } );
      var geometryAxisX = new THREE.Geometry();
      geometryAxisX.vertices.push(new THREE.Vector3( 0, -50, 0) );
      geometryAxisX.vertices.push(new THREE.Vector3( 0,  50, 0) );

      var materialAxisY = new THREE.LineBasicMaterial( { color: 0x0000ff } );
      var geometryAxisY = new THREE.Geometry();
      geometryAxisY.vertices.push(new THREE.Vector3(-50, 0, 0) );
      geometryAxisY.vertices.push(new THREE.Vector3( 50, 0, 0) );

      var axisX = new THREE.Line( geometryAxisX, materialAxisX );
      var axisY = new THREE.Line( geometryAxisY, materialAxisY );

      var axis = new THREE.Object3D();
      axis.add( axisX );
      axis.add( axisY );
      this.scene.add( axis );
    },
    initObject() {

      var material_circle = new THREE.MeshBasicMaterial( { color: 0x2469ff } );
      var geometry_circle1 = new THREE.CircleGeometry( this.circleRadius1, 32 );
      this.circle1 = new THREE.Mesh( geometry_circle1, material_circle );
      this.circle1.position.x =  this.lineLength1 * Math.sin(this.pendulum1.angle);
      this.circle1.position.y = -this.lineLength1 * Math.cos(this.pendulum1.angle);

      var geometry_circle2 = new THREE.CircleGeometry( this.circleRadius2, 32 );
      var material_circle2 = new THREE.MeshBasicMaterial( { color: 0x2469ff } );
      this.circle2 = new THREE.Mesh( geometry_circle2, material_circle );
      this.circle2.position.x = this.circle1.position.x + this.lineLength2 * Math.sin(this.pendulum2.angle);
      this.circle2.position.y = this.circle1.position.y - this.lineLength2 * Math.cos(this.pendulum2.angle);

      var geometry_line1 = new THREE.Geometry();
      var material_line = new THREE.LineBasicMaterial( { color: 0x000000 } );
      geometry_line1.vertices.push(new THREE.Vector3(0, 0, 0));
      geometry_line1.vertices.push(new THREE.Vector3(this.circle1.position.x, this.circle1.position.y, 0));
      this.line1 = new THREE.Line( geometry_line1, material_line );

      var geometry_line2 = new THREE.Geometry();
      geometry_line2.vertices.push(new THREE.Vector3(this.circle1.position.x, this.circle1.position.y, 0));
      geometry_line2.vertices.push(new THREE.Vector3(this.circle2.position.x, this.circle2.position.y, 0));
      this.line2 = new THREE.Line( geometry_line2, material_line );

      this.scene.add( this.line1 );
      this.scene.add( this.line2 );
      this.scene.add( this.circle1 );
      this.scene.add( this.circle2 );

      this.renderer.render( this.scene, this.camera );
    },
    move() {
      this.anFrmID = requestAnimationFrame( this.move );

      var angle0_1 = this.pendulum1.angle;
      var nextStep1 = rungeKutta4(this.pendulumUpEq, this.pendulum1.angle, this.pendulum1.velocity, this.time, this.step);
      this.pendulum1.angle = parseFloat(nextStep1[0]);
      this.pendulum1.velocity = parseFloat(nextStep1[1]);
      this.circle1.position.x =  this.lineLength1 * Math.sin(this.pendulum1.angle);
      this.circle1.position.y = -this.lineLength1 * Math.cos(this.pendulum1.angle);
      this.line1.geometry.vertices[ 1 ].x = this.circle1.position.x;
      this.line1.geometry.vertices[ 1 ].y = this.circle1.position.y;
      this.line1.geometry.verticesNeedUpdate = true;

      var angle0_2 = this.pendulum2.angle;
      var nextStep2 = rungeKutta4(this.pendulumDwEq, this.pendulum2.angle, this.pendulum2.velocity, this.time, this.step);
      this.pendulum2.angle = parseFloat(nextStep2[0]);
      this.pendulum2.velocity = parseFloat(nextStep2[1]);
      this.circle2.position.x = this.circle1.position.x + this.lineLength2 * Math.sin(this.pendulum2.angle);
      this.circle2.position.y = this.circle1.position.y - this.lineLength2 * Math.cos(this.pendulum2.angle);
      this.line2.geometry.vertices[ 0 ].x = this.circle1.position.x;
      this.line2.geometry.vertices[ 0 ].y = this.circle1.position.y;
      this.line2.geometry.vertices[ 1 ].x = this.circle2.position.x;
      this.line2.geometry.vertices[ 1 ].y = this.circle2.position.y;
      this.line2.geometry.verticesNeedUpdate = true;

      this.time += this.step;
      this.renderer.render( this.scene, this.camera );
    },
    stop(){
      cancelAnimationFrame(this.anFrmID);
    }
  },
  mounted() {
    this.initContext()
    this.initScene()
  },
  beforeDestroy() {
    // this.camera.aspect = window.innerWidth/ window.innerHeight;
    //
		// this.camera.updateProjectionMatrix();
		// this.renderer.setSize( window.innerWidth, window.innerHeight );
  }
}
</script>
<style>

</style>
