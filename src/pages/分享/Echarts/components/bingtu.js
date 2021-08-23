import React, { Component } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

export default class componentName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pieOption: {}
    }
  }

  componentDidMount() {
    let { params } = this.props
    this.huanPie(JSON.parse(params))
  }

  //战备秩序环形饼图
  huanPie = params => {
    let THE = this
    params.maxData = THE.sum(params.data)
    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 20,
        bottom: 20,
        itemWidth: 15,
        itemHeight: 15,
        textStyle: {
          color: '#333'
        },
        data: params.label
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: [30, 110],
          center: ['40%', '50%'],
          roseType: 'radius',
          avoidLabelOverlap: false,
          data: [
            {
              value: params.data[2],
              name: params.label[2],
              itemStyle: {
                color: params.color[3]
              }
            },
            {
              value: params.data[3],
              name: params.label[3],
              itemStyle: {
                color: params.color[2]
              }
            },
            {
              value: params.data[1],
              name: params.label[1],
              itemStyle: {
                color: params.color[1]
              }
            },
            {
              value: params.data[0],
              name: params.label[0],
              itemStyle: {
                color: params.color[0]
              }
            }
          ],
          // roseType: 'area',
          // label: {
          //   formatter: param => {
          //     return parseFloat((param.value / THE.sum(params.data)) * 100).toFixed(2) + ' %'
          //   }
          // },
          labelLine: {
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          itemStyle: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold'
            }
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: () => {
            return Math.random() * 200
          }
        }
      ]
    }

    this.setState({
      pieOption: option
    })
  }

  //求和
  sum = arr => {
    let sum = 0
    let l = arr.length
    for (let i = 0; i < l; i++) {
      sum += arr[i]
    }
    return sum
  }

  render() {
    return <ReactEchartsCore style={this.props.heighttemp == 'auto' ? {} : { height: this.props.heighttemp }} echarts={echarts} option={this.state.pieOption} />
  }
}
