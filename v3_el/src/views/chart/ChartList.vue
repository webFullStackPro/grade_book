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

<script setup lang="ts">
import * as echarts from 'echarts';
import {onMounted} from "vue";

onMounted(() => {
  displayChart1()
  displayChart2()
})

const displayChart1 = () => {
  const chart1 = echarts.init(document.getElementById('chart1'));
  var option1 = {
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

  option1 && chart1.setOption(option1);
}

const displayChart2 = () => {
  const chart2 = echarts.init(document.getElementById('chart2'));
  const option2 = {
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

  option2 && chart2.setOption(option2);
}
</script>

<style lang="scss">
</style>
