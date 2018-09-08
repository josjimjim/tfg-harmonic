<template>
  <div>
    <div name="energy" style="witdh:100%; height:300px">
        <chart :options="options" ref="line" :manual-update="true" :auto-resize="true"></chart>
    </div>
  </div>
</template>

<script>

import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'

const LIMIT = 300

export default {
  components: {
    chart: ECharts
  },
  name: "energy-chart",
  props: ['input'],
  data() {
    return {
      time: [],
      potential: [],
      kinetic: [],

      options: {
        legend: {
            data:['Potencial','Cinética']
        },
        color: ['#55be5a', '#2f4554'],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          splitLine: {
              show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '30%'],
          splitLine: {
              show: false
          }
        },
        series: [
          {
            name: 'Potencial',
            type: 'line',
            smooth: true,
            showSymbol: false,
            hoverAnimation: false,
            data: []
          },
          {
            name: 'Cinética',
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
        this.time = this.time.concat(newVal.time)
        this.potential = this.potential.concat(newVal.potential)
        this.kinetic = this.kinetic.concat(newVal.kinetic)

        this.time = this.time.slice(-LIMIT)
        this.potential = this.potential.slice(-LIMIT)
        this.kinetic = this.kinetic.slice(-LIMIT)
        
        this.options.xAxis.data = this.time
        this.options.series[0].data = this.potential
        this.options.series[1].data = this.kinetic

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
