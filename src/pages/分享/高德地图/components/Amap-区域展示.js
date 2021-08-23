import React, { Component } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import * as turf from '@turf/turf'
import { Error_modal } from '@/utils/Modal'

export default class componentName extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.loadMap(`山东省`)
    window.addEventListener('resize', this.getzoom)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getzoom)
  }

  loadMap = jigoudidian => {
    AMapLoader.load({
      key: 'a2cb74e78502c154bafb36f812d52b4e', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [] //插件列表
    })
      .then(AMap => {
        this.AMap = AMap
        this.rendermap(jigoudidian, AMap)
      })
      .catch(e => {
        Error_modal('地图加载失败')
        // console.log(e)
      })
  }

  //生成地图
  rendermap = (jigoudidian, AMap) => {
    let content = this.containerRef
    let THIS = this
    AMap.plugin(['AMap.DistrictSearch', 'AMap.GeoJSON'], function() {
      let geojson = new AMap.GeoJSON({
        geoJSON: ''
      })
      let districtSearch = new AMap.DistrictSearch({
        extensions: 'all',
        subdistrict: 0
      })
      // 搜索所有省/直辖市信息
      districtSearch.search(jigoudidian, function(status, result) {
        console.log(result)
        // 查询成功时，result即为对应的行政区信息
        if (JSON.stringify(result) === '{}') return
        let holes = result.districtList[0].boundaries
        //获取中心点开始=======>

        holes.sort((a, b) => {
          return b.length - a.length
        })
        let polygonGeo = new AMap.Polygon({
          pathL: holes
        })
        polygonGeo.setPath(holes)
        geojson.addOverlay(polygonGeo)
        let Togeojson = geojson.toGeoJSON()
        let center = turf.centerOfMass(Togeojson)

        //<========获取中心点结束
        // 卫星图层
        let satellite = new AMap.TileLayer.Satellite()
        let map = new AMap.Map(content, {
          expandZoomRange: true,
          zooms: [3, 20],
          center: center.geometry.coordinates,
          // layers: [satellite]
          //设置地图背景图
          mapStyle: 'amap://styles/9463d1b6c459e68ffe471b4c9ba37154'
        })
        // map.setBounds(polygonGeo.getBounds(), null, null, true)
        let PolygonList = []
        holes.forEach(item => {
          let polygon = new AMap.Polygon({
            pathL: item,
            //线条颜色，使用16进制颜色代码赋值。默认值为#006600
            strokeColor: '#0198f7',
            strokeWeight: 4,
            //轮廓线透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
            strokeOpacity: 0.5,
            //多边形填充颜色，使用16进制颜色代码赋值，如：#FFAA00
            fillColor: 'rgba(11,22,89)',
            //多边形填充透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
            fillOpacity: 1,
            //轮廓线样式，实线:solid，虚线:dashed
            strokeStyle: 'solid',
            /*勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效， 此属性在
                        ie9+浏览器有效 取值：
                        实线：[0,0,0]
                        虚线：[10,10] ，[10,10] 表示10个像素的实线和10个像素的空白（如此反复）组成的虚线
                        点画线：[10,2,10]， [10,2,10] 表示10个像素的实线和2个像素的空白 + 10个像素的实
                        线和10个像素的空白 （如此反复）组成的虚线*/
            strokeDasharray: [10, 2, 10]
          })
          polygon.setPath(item)
          PolygonList.push(polygon)
        })
        map.setFitView(PolygonList)
        // map.setMapStyle("amap://styles/584f421c9e96aa6d4e8dfb3d4464ecd3");
        //map.setZoom(12.2); //设置地图层级
        if (holes) {
          // 外多边形坐标数组和内多边形坐标数组
          let outer = [new AMap.LngLat(-360, 90, true), new AMap.LngLat(-360, -90, true), new AMap.LngLat(360, -90, true), new AMap.LngLat(360, 90, true)]
          let pathArray = [outer]
          pathArray.push.apply(pathArray, holes)
          let polygon = new AMap.Polygon({
            pathL: pathArray,
            //线条颜色，使用16进制颜色代码赋值。默认值为#006600
            strokeColor: '#0198f7',
            strokeWeight: 4,
            //轮廓线透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
            strokeOpacity: 0.5,
            //多边形填充颜色，使用16进制颜色代码赋值，如：#FFAA00
            fillColor: 'rgba(11,22,89)',
            //多边形填充透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
            fillOpacity: 1,
            //轮廓线样式，实线:solid，虚线:dashed
            strokeStyle: 'solid',
            /*勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效， 此属性在
                        ie9+浏览器有效 取值：
                        实线：[0,0,0]
                        虚线：[10,10] ，[10,10] 表示10个像素的实线和10个像素的空白（如此反复）组成的虚线
                        点画线：[10,2,10]， [10,2,10] 表示10个像素的实线和2个像素的空白 + 10个像素的实
                        线和10个像素的空白 （如此反复）组成的虚线*/
            strokeDasharray: [10, 2, 10]
          })
          polygon.setPath(pathArray)
          map.add(polygon)
        }
      })
    })
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
