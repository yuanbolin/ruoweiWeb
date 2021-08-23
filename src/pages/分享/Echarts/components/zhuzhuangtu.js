import React, { Component } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'

export default class componentName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      BarOptions: {}
    }
  }

  componentDidMount() {
    let { params } = this.props
    this.jingqingBar(JSON.parse(params))
  }

  //警情柱状图
  jingqingBar(params) {
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], //x轴数据
        axisLine: {
          lineStyle: {
            color: 'transport'
          }
        }
      },
      yAxis: [
        {
          //如果需要左右两个y轴,则在数组中再添加一项配置
          type: 'value',
          name: '月出警情统计', //y轴标题
          axisTick: {
            show: true,
            inside: true //方向:true内false外
          },
          position: 'left', //左
          min: 0,
          max: params.maxData
        },
        {
          //如果需要左右两个y轴,则在数组中再添加一项配置
          type: 'value',
          axisTick: {
            show: true,
            inside: true //方向:true内false外
          },
          position: 'right', //左
          min: 0,
          max: params.maxData
        }
      ],
      series: [
        {
          data: params.data, //数据
          type: 'bar', //柱状图
          // showBackground: true,  //阴影
          // backgroundStyle: {
          //     color: 'rgba(220, 220, 220, 0.8)'
          // },
          barWidth: 15,
          itemStyle: {
            //图形样式
            color: 'rgb(93,190,249)'
          },
          label: {
            //标注
            position: 'top',
            show: true,
            color: 'rgb(93,190,249)'
          },
          emphasis: {
            //高亮
            itemStyle: {
              //图形样式
              color: 'rgb(113,210,269)',
              borderColor: 'rgba(28,177,253,0.5)',
              borderWidth: 3
            }
          }
        }
      ],
      grid: {
        x: 50,
        y: 35,
        x2: 30,
        y2: 35
      }
    }
    this.setState({
      BarOptions: option
    })
  }

  render() {
    return (
      <ReactEchartsCore style={this.props.heighttemp == 'auto' ? {} : { height: this.props.heighttemp }} echarts={echarts} option={this.state.BarOptions} />
    )
  }
}
