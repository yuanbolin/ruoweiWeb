/*
 *作者：苑博林
 *功能：地图实例
 *时间：2020/07/29 - 15:36
 */
import React, { Component } from 'react'
import Amap_路线巡航 from './components/Amap-路线巡航'
import Amap_区域展示 from './components/Amap-区域展示'
import Amap_区域展示2 from './components/Amap-区域展示2'

export default class MyAmap extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div style={{ width: '100%', height: '75vh' }}>
        <Amap_区域展示2 />
        {/*<Amap_区域展示 />*/}
        {/*<Amap_路线巡航 />*/}
      </div>
    )
  }
}
