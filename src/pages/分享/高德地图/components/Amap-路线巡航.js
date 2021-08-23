/*
 *作者：苑博林
 *功能：地图实例
 *时间：2020/07/29 - 15:36
 */
import React, { Component } from 'react'
import { message } from 'antd'
import { Map } from 'react-amap'

class UIMarker extends React.Component {
  constructor() {
    super()
    this.loadUI()
  }

  loadUI() {
    window.AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
      this.initPath(PathSimplifier)
    })
    window.AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
      this.initPage(SimpleMarker)
    })
  }

  initPath = PathSimplifier => {
    const map = this.props.__map__
    if (!PathSimplifier.supportCanvas) {
      alert('当前环境不支持 Canvas，无法显示轨迹图，建议使用Google浏览器预览')
      return
    }
    let pathSimplifierIns = new PathSimplifier({
      zIndex: 100,
      //autoSetFitView:false,
      map, //所属的地图实例
      getPath(pathData, pathIndex) {
        return pathData.path
      },
      getHoverTitle(pathData, pathIndex, pointIndex) {
        if (pointIndex >= 0) {
          //point
          return `${pathData.name}，点：${pointIndex}/${pathData.path.length}`
        }
        return `${pathData.name}，点数量${pathData.path.length}`
      },
      renderOptions: {
        renderAllPointsIfNumberBelow: -1 //绘制路线节点，如不需要可设置为-1
      }
    })
    pathSimplifierIns.clearPathNavigators()
    window.pathSimplifierIns = pathSimplifierIns
    //设置数据
    pathSimplifierIns.setData([
      {
        name: '轨迹0',
        path: [[100.340417, 27.376994], [108.426354, 37.827452], [113.392174, 31.208439], [124.905846, 42.232876]]
      },
      {
        name: '大地线',
        //创建一条包括500个插值点的大地线
        path: PathSimplifier.getGeodesicPath([116.405289, 39.904987], [87.61792, 43.793308], 500)
      }
    ])
    function onload() {
      pathSimplifierIns.renderLater()
    }

    function onerror(e) {
      console.log(e)
      alert('图片加载失败！')
    }
    //对第一条线路（即索引 0）创建一个巡航器
    let navg1 = pathSimplifierIns.createPathNavigator(0, {
      loop: true, //循环播放
      speed: 1000000, //巡航速度,单位千米每小时
      pathNavigatorStyle: {
        width: 24,
        height: 24,
        //使用图片
        content: PathSimplifier.Render.Canvas.getImageContent(
          'https://webapi.amap.com/ui/1.1/ui/misc/PathSimplifier/examples/imgs/car-front.png',
          onload,
          onerror
        ),
        strokeStyle: null,
        fillStyle: null,
        //经过路径的样式
        pathLinePassedStyle: {
          lineWidth: 6,
          strokeStyle: 'black', //导航图层颜色
          dirArrowStyle: {
            stepSpace: 15,
            strokeStyle: 'red' //指示方向颜色
          }
        }
      }
    })

    navg1.start()

    let navg2 = pathSimplifierIns.createPathNavigator(1, {
      loop: true,
      speed: 500000,
      pathNavigatorStyle: {
        width: 24,
        height: 24,
        content: PathSimplifier.Render.Canvas.getImageContent('https://webapi.amap.com/ui/1.1/ui/misc/PathSimplifier/examples/imgs/plane.png', onload, onerror),
        strokeStyle: null,
        fillStyle: null
      }
    })

    navg2.start()
  }

  initPage(SimpleMarker) {
    const map = this.props.__map__
    // 这个例子来自官方文档 http://lbs.amap.com/api/javascript-api/guide/amap-ui/intro
    new SimpleMarker({
      //前景文字
      iconLabel: 'A',
      //图标主题
      iconTheme: 'default',
      //背景图标样式
      iconStyle: 'red',
      //...其他Marker选项...，不包括content
      map,
      position: [120, 31]
    })

    //创建SimpleMarker实例
    new SimpleMarker({
      //前景文字
      iconLabel: {
        innerHTML: '<i>B</i>', //设置文字内容
        style: {
          color: '#fff' //设置文字颜色
        }
      },
      //图标主题
      iconTheme: 'fresh',
      //背景图标样式
      iconStyle: 'black',
      //...其他Marker选项...，不包括content
      map,
      position: [120, 29]
    })
  }

  render() {
    return null
  }
}

export default class MyAmap extends React.Component {
  constructor() {
    super()
  }

  render() {
    const loadingStyle = {
      position: 'relative',
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 40,
      fontWeight: 'bold'
    }
    const Loading = <div style={loadingStyle}>Loading Map...</div>
    return (
      <div style={{ width: '100%', height: '400px' }}>
        <Map loading={Loading} zoom={6} center={[120, 30]} useAMapUI>
          <UIMarker />
        </Map>
      </div>
    )
  }
}
