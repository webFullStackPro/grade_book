import React, {useEffect} from "react";
import * as echarts from 'echarts';
import {Col, Row} from "antd";

const ChartList: React.FC = () => {

  const displayChart1 = () => {
    const chart1 = echarts.init(document.getElementById('chart1'));
    const option1 = {
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

    chart1.setOption(option1);
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

    chart2.setOption(option2);
  }

  useEffect(() => {
    displayChart1()
    displayChart2()
    return () => {
    };
  }, []);

  return (
    <>
      <Row gutter={10}>
        <Col span={11}>
          <div id="chart1" style={{height: 400, width: "100%"}}></div>
        </Col>
        <Col span={11}>
          <div id="chart2" style={{height: 400, width: "100%"}}></div>
        </Col>
      </Row>
    </>
  );
};

export default ChartList;