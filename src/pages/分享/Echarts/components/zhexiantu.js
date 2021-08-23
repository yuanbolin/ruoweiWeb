import React, { Component } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legend'

export default class componentName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lineOption: {}
    }
  }

  componentDidMount() {
    this.initalLineEcharts()
  }

  initalLineEcharts = () => {
    let { params } = this.props
    params = JSON.parse(params)
    let option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        orient: 'horizontal',
        right: 10,
        top: 10,
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#333'
        },
        data: params.label
      },
      xAxis: {
        type: 'category',
        offset: 10,
        boundaryGap: false,
        data: params.XData,
        axisLabel: {
          color: '#333' //标签颜色
        },
      },
      yAxis: {
        type: 'value',
        offset: 5,
        minInterval: 1,
        position: 'left', //左
        axisLabel: {
          color: '#333', //标签颜色
          formatter(params) {
            // console.log(params);
            return `${params}次`
          }
        }
      },
      series: [
        {
          name: params.label[0],
          data: params.data[0],
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            normal: {
              color: params.color[0],
              areaStyle: {
                type: 'default',
                //渐变色实现
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1, //变化度
                  //三种由深及浅的颜色
                  [
                    {
                      offset: 0,
                      color: 'rgba(44,135,203,0.4)'
                    },
                    {
                      offset: 0.4,
                      color: 'rgba(44,135,203,0.2)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,0,0,0)'
                    }
                  ]
                )
              },
              //以及在折线图每个日期点顶端显示数字
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: 'white'
                }
              }
            }
          }
        },
        {
          name: params.label[1],
          data: params.data[1],
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            normal: {
              color: params.color[1],
              areaStyle: {
                type: 'default',
                //渐变色实现
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1, //变化度
                  //三种由深及浅的颜色
                  [
                    {
                      offset: 0,
                      color: 'rgba(44,135,203,0.4)'
                    },
                    {
                      offset: 0.4,
                      color: 'rgba(44,135,203,0.2)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,0,0,0)'
                    }
                  ]
                )
              },
              //以及在折线图每个日期点顶端显示数字
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#333'
                }
              }
            }
          }
        },
        {
          name: params.label[2],
          data: params.data[2],
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            normal: {
              color: params.color[2],
              areaStyle: {
                type: 'default',
                //渐变色实现
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1, //变化度
                  //三种由深及浅的颜色
                  [
                    {
                      offset: 0,
                      color: 'rgba(44,135,203,0.4)'
                    },
                    {
                      offset: 0.4,
                      color: 'rgba(44,135,203,0.2)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,0,0,0)'
                    }
                  ]
                )
              },
              //以及在折线图每个日期点顶端显示数字
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#333'
                }
              }
            }
          }
        },
        {
          name: params.label[3],
          data: params.data[3],
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            normal: {
              color: params.color[3],
              areaStyle: {
                type: 'default',
                //渐变色实现
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1, //变化度
                  //三种由深及浅的颜色
                  [
                    {
                      offset: 0,
                      color: 'rgba(44,135,203,0.4)'
                    },
                    {
                      offset: 0.4,
                      color: 'rgba(44,135,203,0.2)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,0,0,0)'
                    }
                  ]
                )
              },
              //以及在折线图每个日期点顶端显示数字
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#333'
                }
              }
            }
          }
        }
      ]
    }
    this.setState({
      lineOption: option
    })
  }

  render() {
    return (
      <ReactEchartsCore style={this.props.heighttemp == 'auto' ? {} : { height: this.props.heighttemp }} echarts={echarts} option={this.state.lineOption} />
    )
  }
}
