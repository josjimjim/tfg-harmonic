<template>
  <div>
    <div name="phase" style="witdh:100%; height:300px">
      <div id="phase"></div>
    </div>
  </div>
</template>

<script>
import {initContext, initChartAxis, initTrail, updateTrail} from "@/assets/js/graphics.js"

const MAX_CAMERA_MOVEMENT = 5

export default {
  name: "phase-chart",
  props: ['input','animation'],
  data() {
    return {
      anFrmID: null,

      scene: null,
      camera: null,
      renderer: null,
      canvas: null,
      controls: null,

      phaseLine: null
    }
  },
  computed: {
    value() {
      return this.input.value
    },
    animate() {
      return this.input.animate
    },
    reload() {
      return this.input.reload
    }
  },
  methods: {
    initContext() {
      if(this.renderer == null) {

        let context = initContext("phase", new THREE.Vector3(0, 0, 20), new THREE.Vector3(0, 0, 0), false, 400, 300)

        this.renderer = context.renderer
        this.camera = context.camera
        this.canvas = context.cavas
        this.controls = context.controls
        this.controls.maxDistance = 50;
      }
    },
    initScene() {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xffffff)

      let chartAxis = initChartAxis(50, 50, 0, 0)
      this.phaseLine = initTrail(this.value, 0x9932cc)

      this.scene.add(chartAxis)
      this.scene.add(this.phaseLine)
      this.renderer.render(this.scene, this.camera)
    },
    move() {
      this.anFrmID = requestAnimationFrame(this.move)

      if(this.animate){
        let update = updateTrail(this.phaseLine, this.value, this.reload)
        this.phaseLine.geometry.vertices = update.vertices
        if(this.value.x < MAX_CAMERA_MOVEMENT && this.value.x > -MAX_CAMERA_MOVEMENT){
          this.camera.position.set(this.value.x, 0, 30)
        }
      }
      
      this.renderer.render(this.scene, this.camera)
    },
    stop() {
      cancelAnimationFrame(this.anFrmID)
    }
  },
  mounted() {
    this.initContext()
    this.initScene()  
    this.move()
  },
  beforeDestroy() {
    this.stop()
    this.renderer.forceContextLoss()
    this.renderer.context = null
    this.renderer.domElement = null
    this.renderer = null
  }
}
</script>
<style>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
