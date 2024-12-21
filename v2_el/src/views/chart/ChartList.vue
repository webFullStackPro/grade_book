<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div id="chart1" style="height: 400px; width: 100%;"></div>
      </el-col>
      <el-col :span="12">
        <div id="chart2" style="height: 400px; width: 100%;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'ChartList',
  mixins: [
  ],
  data () {
    return {
    }
  },
  mounted () {
    this.displayChart1()
    this.displayChart2()
  },
  methods: {
    displayChart1 () {
      const chartDom = document.getElementById('chart1');
      const myChart = echarts.init(chartDom);
      const option = {
        xAxis: {
          type: 'category',
          data: ['软件工程', '会计学', '汉语言文学', '应用数学', '心理学', '电子信息', '智能建造'],
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }
        ]
      };

      myChart.setOption(option);
    },
    displayChart2 () {
      const chartDom = document.getElementById('chart2');
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: '考勤数据',
          subtext: '仅供参考',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '考勤数据',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 235, name: '出勤' },
              { value: 6, name: '缺勤' },
              { value: 25, name: '迟到' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      myChart.setOption(option);
    }
  }
}
</script>

<style scoped>

</style>
