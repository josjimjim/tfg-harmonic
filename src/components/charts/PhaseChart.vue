<template>
  <div>
    <div name="phase" style="witdh:100%; height:300px">
        <chart :options="options" ref="line" :manual-update="true" :auto-resize="true"></chart>
    </div>
  </div>
</template>

<script>

import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'

const LIMIT = 800

export default {
  components: {
    chart: ECharts
  },
  name: "phase-chart",
  props: ['input'],
  data() {
    return {
      phase: [],

      options: {
        color: ['#7a2566'],
        
    xAxis: {
    },
    yAxis: {
    },
        series: [
          {
            type: 'line',
            smooth: true,
            showSymbol: false,
            hoverAnimation: false,
            data: []
          }
        ]
      }
    }
  },
  watch: {
    input: {
      handler: function(newVal, oldVal) { 
        this.phase = this.phase.concat(newVal)

        this.phase = this.phase.slice(-LIMIT)

        this.options.series[0].data = this.phase

        let line = this.$refs.line
        if(line) {
          line.mergeOptions(this.options)
        }
      },
      inmediate: true,
      deep: true
    }
  }
}
</script>
<style>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
