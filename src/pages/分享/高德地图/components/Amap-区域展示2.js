import React, { Component } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import { Error_modal } from '@/utils/Modal'
import './Amap.css'

export default class componentName extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js'
    document.head.appendChild(script)
  }

  componentDidMount() {
    this.searchMap(`山东`) //输入要查询的地区
    window.addEventListener('resize', this.getzoom)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getzoom)
  }

  searchMap = jigoudidian => {
    let httpRequest = new XMLHttpRequest() //第一步：建立所需的对象
    httpRequest.open(
      'GET',
      `https://restapi.amap.com/v3/config/district?key=f11d2b149f1fc6aae9e708565131cc24&keywords=${jigoudidian}&subdistrict=0&extensions=all`,
      true
    ) //第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
    httpRequest.send() //第三步：发送请求  将请求参数写在URL中
    /**
     * 获取数据后的处理程序
     */
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        let json = JSON.parse(httpRequest.responseText) //获取到json字符串，还需解析
        let holes = json.districts[0].polyline.split(',')
        this.loadMap(json.districts[0].adcode, holes)
      }
    }
  }

  loadMap = (adcode, holes) => {
    AMapLoader.load({
      key: 'a2cb74e78502c154bafb36f812d52b4e', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      AMapUI: {
        // 是否加载 AMapUI，缺省不加载
        version: '1.1', // AMapUI 缺省 1.1
        plugins: ['geo/DistrictExplorer'] // 需要加载的 AMapUI ui插件
      }
    })
      .then(AMap => {
        this.AMap = AMap
        this.rendermap(adcode, AMap, holes)
      })
      .catch(e => {
        Error_modal('地图加载失败')
        // console.log(e)
      })
  }

  //生成地图
  rendermap = (adcode, AMap, holes) => {
    let { $ } = window
    let content = this.containerRef
    this.map = new AMap.Map(content, {
      expandZoomRange: true,
      zooms: [3, 20]
      // layers: [satellite],
      //设置地图背景图
      // mapStyle: 'amap://styles/9463d1b6c459e68ffe471b4c9ba37154'
    })
    //创建一个实例
    let districtExplorer = (this.districtExplorer = new window.AMapUI.DistrictExplorer({
      eventSupport: true, //打开事件支持
      map: this.map
    }))

    //鼠标hover提示内容
    let $tipMarkerContent = $('<div style="background-color: #888888;color: #000;"></div>')

    let tipMarker = new AMap.Marker({
      content: $tipMarkerContent.get(0),
      offset: new AMap.Pixel(10, 0),
      bubble: true
    })
    let THE = this
    //根据Hover状态设置相关样式
    function toggleHoverFeature(feature, isHover, position) {
      tipMarker.setMap(isHover ? THE.map : null)

      if (!feature) {
        return
      }

      let props = feature.properties

      if (isHover) {
        //更新提示内容
        $tipMarkerContent.html(`${props.adcode}: ${props.name}`)
        //更新位置
        tipMarker.setPosition(position || props.center)
      }

      //更新相关多边形的样式
      let polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode)
      for (let i = 0, len = polys.length; i < len; i++) {
        polys[i].setOptions({
          fillOpacity: isHover ? 0.5 : 0.2
        })
      }
    }

    //监听feature的hover事件
    districtExplorer.on('featureMouseout featureMouseover', function(e, feature) {
      toggleHoverFeature(feature, e.type === 'featureMouseover', e.originalEvent ? e.originalEvent.lnglat : null)
    })

    //监听鼠标在feature上滑动
    districtExplorer.on('featureMousemove', function(e, feature) {
      //更新提示位置
      tipMarker.setPosition(e.originalEvent.lnglat)
    })

    districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
      if (error) {
        console.error(error)
        return
      }

      //绘制载入的区划节点
      this.renderAreaNode(districtExplorer, areaNode)
    })
  }

  renderAreaNode = (districtExplorer, areaNode) => {
    //清除已有的绘制内容
    districtExplorer.clearFeaturePolygons()

    //just some colors
    let colors = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00']

    //绘制子级区划
    districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
      let fillColor = colors[i % colors.length]
      let strokeColor = colors[colors.length - 1 - (i % colors.length)]

      return {
        cursor: 'default',
        bubble: true,
        strokeColor, //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线宽
        fillColor, //填充色
        fillOpacity: 0.35 //填充透明度
      }
    })

    //绘制父级区划，仅用黑色描边
    districtExplorer.renderParentFeature(areaNode, {
      cursor: 'default',
      bubble: true,
      strokeColor: 'black', //线颜色
      fillColor: null,
      strokeWeight: 3 //线宽
    })
    //更新地图视野以适合区划面
    this.map.setFitView(districtExplorer.getAllFeaturePolygons())
  }

  render() {
    return (
      <div
        style={{
          height: '48vh',
          margin: '0px 4.6vh 1.84vh 4.6vh',
          border: '0.4vh solid rgb(9,9,69)'
        }}
        className='mapboxcard'
        ref={ref => {
          this.containerRef = ref
        }}
      />
    )
  }
}
