<template>
  <div>
    <h3 class="title is-3">Spherical pendulum</h3>
    <div class="columns">
      <div class="column is-half">
        <div id="canvas"></div>
      </div>
      <spherical-input class="column is-quarter" @setStatus="setStatus" @setAnimation="setAnimation"></spherical-input>
    </div>
    <div class="columns">
      <div class="column">
        <documentation type="spherical-pendulum"></documentation>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import SphericalInput from '../inputs/SphericalInput'
import Documentation from '../Documentation'
import {GRAVITY, rungeKutta4} from '@/assets/js/math.js'

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

export default {
  name: 'spherical-pendulum',
  components: {
    'spherical-input': SphericalInput,
    'documentation': Documentation
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      canvas: null,

      sphere: null,
      line: null,

      time: 0,
      step: 0,
      pendulum: {},

      lineLength: null,

      anFrmID: null
    }
  },
  methods: {
    pendulumAmplitudeEq(x, v, t){
      return Math.pow(this.pendulum.velocityRotation, 2) * Math.sin(x) * Math.cos(x) - GRAVITY * Math.sin(x) / this.pendulum.length;
    },
    pendulumRotationEq(x, v, t){
      return -2 * this.pendulum.velocityAmplitude * v * 1 / Math.tan(this.pendulum.angleAmplitude);
    },
    setStatus(status){
      this.pendulum.angleAmplitude = parseFloat(status.pendulum.angleAmplitude * Math.PI / 180);
      this.pendulum.velocityAmplitude = parseFloat(status.pendulum.velocityAmplitude);
      this.pendulum.angleRotation = parseFloat(status.pendulum.angleRotation * Math.PI / 180);
      this.pendulum.velocityRotation = parseFloat(status.pendulum.velocityRotation);
      this.pendulum.length = parseFloat(status.pendulum.length);
      this.pendulum.mass = parseFloat(status.pendulum.mass);

      this.step = parseFloat(status.step);

      this.lineLength = this.pendulum.length * 5;

      if(this.scene != null) {
        this.initScene()
      }
    },
    setAnimation(animate) {
      if(animate) this.move(); else this.stop();
    },
    initContext(){
      this.camera = new THREE.PerspectiveCamera(20, CANVAS_WIDTH/CANVAS_HEIGHT, 0.1, 1000);
      this.camera.position.set( 80, 50, 80 );
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

      var materialAxisZ = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
      var geometryAxisZ = new THREE.Geometry();
      geometryAxisZ.vertices.push(new THREE.Vector3( 0, 0, -50) );
      geometryAxisZ.vertices.push(new THREE.Vector3( 0, 0, 50) );

      var axisX = new THREE.Line( geometryAxisX, materialAxisX );
      var axisY = new THREE.Line( geometryAxisY, materialAxisY );
      var axisZ = new THREE.Line( geometryAxisZ, materialAxisZ );

      var axis = new THREE.Object3D();
      axis.add( axisX );
      axis.add( axisY );
      axis.add( axisZ );
      this.scene.add( axis );
    },
    initObject() {
      var material_line = new THREE.LineBasicMaterial( { color: 0x000000 } );
      var geometry_line = new THREE.Geometry();
      geometry_line.vertices.push(new THREE.Vector3( 0, 0, 0) );
      geometry_line.vertices.push(new THREE.Vector3(
        this.lineLength * Math.sin(this.pendulum.angleAmplitude) *  Math.sin(this.pendulum.angleRotation),
        -this.lineLength * Math.cos(this.pendulum.angleAmplitude),
        this.lineLength * Math.sin(this.pendulum.angleAmplitude) *  Math.cos(this.pendulum.angleRotation)) );
      this.line = new THREE.Line( geometry_line, material_line );

      var geometry_sphere = new THREE.SphereGeometry( this.pendulum.mass / 2, 32, 32 );
      var material_sphere = new THREE.MeshBasicMaterial( { color: 0x2469ff } );
      this.sphere = new THREE.Mesh( geometry_sphere, material_sphere );
      this.sphere.position.x = this.lineLength * Math.sin(this.pendulum.angleAmplitude) *  Math.sin(this.pendulum.angleRotation);
      this.sphere.position.y = -this.lineLength * Math.cos(this.pendulum.angleAmplitude);
      this.sphere.position.z = this.lineLength * Math.sin(this.pendulum.angleAmplitude) *  Math.cos(this.pendulum.angleRotation);

      this.scene.add( this.line );
      this.scene.add( this.sphere );

      this.renderer.render( this.scene, this.camera );
    },
    move() {
      this.anFrmID = requestAnimationFrame( this.move );

      var nextStep1 = rungeKutta4(this.pendulumAmplitudeEq, this.pendulum.angleAmplitude, this.pendulum.velocityAmplitude, this.time, this.step);
      this.pendulum.angleAmplitude = nextStep1[0];
      this.pendulum.velocityAmplitude = nextStep1[1];

      var nextStep2 = rungeKutta4(this.pendulumRotationEq, this.pendulum.angleRotation, this.pendulum.velocityRotation, this.time, this.step);
      this.pendulum.angleRotation = nextStep2[0];
      this.pendulum.velocityRotation = nextStep2[1];

      this.sphere.position.x = this.lineLength * Math.sin(this.pendulum.angleAmplitude) *  Math.sin(this.pendulum.angleRotation);
      this.sphere.position.y = -this.lineLength * Math.cos(this.pendulum.angleAmplitude);
      this.sphere.position.z = this.lineLength * Math.sin(this.pendulum.angleAmplitude) *  Math.cos(this.pendulum.angleRotation);
      this.line.geometry.vertices[ 1 ].x = this.lineLength * Math.sin(this.pendulum.angleAmplitude) *  Math.sin(this.pendulum.angleRotation);
      this.line.geometry.vertices[ 1 ].y = -this.lineLength * Math.cos(this.pendulum.angleAmplitude);
      this.line.geometry.vertices[ 1 ].z = this.lineLength * Math.sin(this.pendulum.angleAmplitude) *  Math.cos(this.pendulum.angleRotation);
      this.line.geometry.verticesNeedUpdate = true;

      this.time += this.step;

      this.renderer.render(this.scene, this.camera);
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
