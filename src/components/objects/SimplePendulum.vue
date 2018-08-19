<template>
  <div>
    <h3 class="title is-3">Simple pendulum</h3>
    <div class="columns">
      <div class="column is-half">
        <div id="canvas"></div>
      </div>
      <simple-input class="column is-quarter" @setStatus="setStatus" @setAnimation="setAnimation"></simple-input>
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
import SimpleImput from '../inputs/SimpleInput'
import Documentation from '../Documentation'
import {GRAVITY, rungeKutta4} from '@/assets/js/math.js'

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

export default {
  name: 'simple-pendulum',
  components: {
    'simple-input': SimpleImput,
    'documentation': Documentation
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      canvas: null,
      group: null,

      time: 0,
      step: 0,
      pendulum: {},

      anFrmID: null
    }
  },
  methods: {
    pendulumEq(x, v, t){
      return - GRAVITY * Math.sin(x) / this.pendulum.length;
    },
    setStatus(status){
      this.pendulum.angle = parseFloat(status.pendulum.angle * Math.PI / 180);
      this.pendulum.velocity = parseFloat(status.pendulum.velocity);
      this.pendulum.length = parseFloat(status.pendulum.length) * 5;
      this.pendulum.mass = parseFloat(status.pendulum.mass);

      this.step = parseFloat(status.step);

      if(this.scene != null) {
        this.initScene()
      }
    },
    setAnimation(animate) {
      if(animate) this.move(); else this.stop();
    },
    initContext(){
      this.camera = new THREE.PerspectiveCamera(20, CANVAS_WIDTH/CANVAS_HEIGHT, 0.1, 1000);
      this.camera.position.set(0, 0, 80);
      this.camera.lookAt( new THREE.Vector3(0, 0, 0));

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT);
      this.canvas = document.getElementById("canvas");
      this.canvas.appendChild(this.renderer.domElement);

    },
    initScene() {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color( 0xffffff )

      this.initAxis()
      this.initObject()
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

      var material_line = new THREE.LineBasicMaterial( { color: 0x000000 } );
      var geometry_line = new THREE.Geometry();
      geometry_line.vertices.push(new THREE.Vector3(
        this.pendulum.length * Math.sin(this.pendulum.angle),
        -this.pendulum.length * Math.cos(this.pendulum.angle),
        0) );
      geometry_line.vertices.push(new THREE.Vector3( 0, 0, 0) );
      var line = new THREE.Line( geometry_line, material_line );


      var geometry_circle = new THREE.CircleGeometry( this.pendulum.mass / 2, 50 );
      var material_circle = new THREE.MeshBasicMaterial( { color: 0x2469ff } );
      var circle = new THREE.Mesh( geometry_circle, material_circle );
      circle.position.x = this.pendulum.length * Math.sin(this.pendulum.angle);
      circle.position.y = -this.pendulum.length * Math.cos(this.pendulum.angle);

      this.group = new THREE.Object3D();
      this.group.add( line );
      this.group.add( circle );

      this.scene.add( this.group );

      this.renderer.render( this.scene, this.camera );
    },
    move() {
      this.anFrmID = requestAnimationFrame( this.move );
      var angle0 = this.pendulum.angle;
      var nextStep = rungeKutta4(this.pendulumEq, this.pendulum.angle, this.pendulum.velocity, this.time, this.step);

      this.pendulum.angle = nextStep[0];
      this.pendulum.velocity = nextStep[1];
      this.time = nextStep[2];

      this.group.rotation.z -= (angle0 - this.pendulum.angle);

      this.renderer.render( this.scene, this.camera );
    },
    stop(){
      cancelAnimationFrame(this.anFrmID);
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
