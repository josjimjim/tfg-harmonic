<template>
  <div>
    <h3 class="title is-3">Tools</h3>
    <div class="tabs">
      <ul>
        <li v-for="(numMeth,index) in numericalMethods" :id="index" :key="numMeth.method" :ref="'tool'+index"
            :value="numMeth.method" :class="index==0?'is-active':''" @click="show(numMeth.method, index)">
            <a >{{ numMeth.name }}</a>
        </li>
      </ul>
    </div>
    <div class="columns">
      <div class="column">
        <documentation :type="showDoc"></documentation>
      </div>
    </div>
  </div>
</template>

<script>
import Documentation from './Documentation'
import {NUMERICAL_METHODS} from '@/assets/js/math.js'

export default {
  name: 'tools' ,
  props: ['type'],
  components: {
    'documentation': Documentation
  },
  data(){
    return{
      showDoc: 'euler',
      numericalMethods: NUMERICAL_METHODS
    }
  },
  methods:{
    show(method, index){
      this.$refs['tool'+index].class
      this.showDoc = method
    }
  }
}
</script>
<style>

</style>
