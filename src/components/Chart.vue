<template>
  <div>
    <canvas :id="id" width="400" height="400"></canvas>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "chart",
  props: ['id', 'input'],
  data() {
    return {
      chart: null,
      interval: null,

      chartLine: []
    };
  },
  methods: {
    init() {
      this.chart = echarts.init(document.getElementById(this.id));
      var app = {};
      var option = null;

      this.chartLine = this.input

      option = {
        title: {
          text: "TEXTO"
        },
        xAxis: {
          type: "value",
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: "",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: this.chartLine
          }
        ]
      };  

      if (option && typeof option === "object") {
        this.chart.setOption(option, true);
      }
    },
    newInterval(){    
    
      this.chart.setOption({
        series: [
          {
            data: this.chartLine
          }
        ]
      })
    }
  },
  mounted() {
    this.init()
  },
  watch: { 
    input: function(newVal, oldVal) {
      if(this.chartLine.length>10000){
        for (var i = 0; i < 50; i++) {
          this.chartLine.shift()
          this.chartLine.push(newVal[i])
        }
      }else{
          this.chartLine = this.chartLine.concat(newVal)
      }
      this.newInterval()
    }
  }
};
</script>
<style>
</style>
