import React, { Component } from 'react'

import Xiangxingtu from './components/xiangxingtu'
import Bingtu from './components/bingtu'
import Zhuzhuangtu from './components/zhuzhuangtu'
import Zhexiantu from './components/zhexiantu'

export default class componentName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      qicaiBarParams: {
        backgroundColor: 'rgb(9,8,68)', //背景色
        data: [1, 2, 3, 4, 5],
        label: ['张三', '李四', '王五', '薛六', '贾七'],
        maxData: 20
      },
      qicaiData: [
        {
          xingming: '张三',
          shuliang: 10,
          xiaolei: [
            {
              leibie: '赵明磊',
              name: '强光灯',
              value: 14
            }
          ]
        },
        {
          xingming: '李四',
          shuliang: 10,
          xiaolei: [
            {
              leibie: '赵明磊',
              name: '强光灯',
              value: 2
            }
          ]
        },
        {
          xingming: '王五',
          shuliang: 10,
          xiaolei: [
            {
              leibie: '赵明磊',
              name: '强光灯',
              value: 5
            }
          ]
        },
        {
          xingming: '薛六',
          shuliang: 10,
          xiaolei: [
            {
              leibie: '赵明磊',
              name: '强光灯',
              value: 13
            }
          ]
        },
        {
          xingming: '贾七',
          shuliang: 10,
          xiaolei: [
            {
              leibie: '赵明磊',
              name: '强光灯',
              value: 12
            }
          ]
        }
      ],
      bingtuData: {
        label: ['直接访问', '邮件营销', '联盟广告', '视频广告'],
        data: [112, 234, 135, 310],
        color: ['#333', '#789', '#acd', '#daa']
      },
      zhuzhuangtuData: {
        data: [112, 234, 135, 310, 335, 256, 111, 543, 46, 222, 333, 117],
        maxData: 543
      },
      zhexiantuData: {
        label: ['直接访问', '邮件营销', '联盟广告', '视频广告'],
        data: [[120, 132, 101, 134], [112, 234, 135, 310], [212, 334, 235, 510], [12, 134, 35, 320]],
        color: ['#333', '#789', '#acd', '#daa'],
        XData: ['周一', '周二', '周三', '周四']
      }
    }
  }

  componentDidMount() {}

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', height: '75vh' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Zhuzhuangtu params={JSON.stringify(this.state.zhuzhuangtuData)} heighttemp='50%' />
          <Zhexiantu params={JSON.stringify(this.state.zhexiantuData)} heighttemp='50%' />
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Bingtu params={JSON.stringify(this.state.bingtuData)} heighttemp='50%' />
          <Xiangxingtu params={JSON.stringify(this.state.qicaiBarParams)} data={this.state.qicaiData} heighttemp='50%' />
        </div>
      </div>
    )
  }
}
