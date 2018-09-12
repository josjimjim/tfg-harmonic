<template>
  <div>
    <h3 class="title is-3">Tools</h3>
    <div v-if="numericalMethods != null" class="tabs">
      <ul>
        <li v-for="(numMeth,index) in numericalMethods" :id="index" :key="index" :value="numMeth.method" 
            :class="{'is-active' : clicked == index}" @click="show(numMeth.method, index)">
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
      clicked: 0
    }
  },
  methods:{
    show(method, index){
      this.type = method
      this.clicked = index
    }
  },
  computed: {
    showDoc(){
      return this.type
    },
    numericalMethods(){
      let contains = false
      for(let i = 0; i < NUMERICAL_METHODS.length; i++) {
          if (NUMERICAL_METHODS[i].method == this.type) {
              contains = true
              break
          }
      }
      return contains ? NUMERICAL_METHODS : null
    }
  }
}
</script>
<style>

</style>
