import React from 'react'

import { Pie, Column } from '@ant-design/charts'
import { Empty } from 'antd'

function DemoPie({ data }) {
  let result = data.filter(v => v.item !== null)
  let config = {
    appendPadding: 10,
    data: result,
    angleField: 'amount',
    colorField: 'item',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}', // 百分比显示
      offset: 20 // 偏移量  线
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }]
  }
  return data.length > 0 ? (
    <Pie {...config} style={{ height: 400, padding: 20 }} />
  ) : (
    <Empty style={{ height: 400, padding: '100px 20px 20px' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
  )
}

function SourceColumn({ data }) {
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    if (item.title === '工时') {
      item.title = '工时 / 小时'
    }
  }
  let config = {
    data,
    isGroup: true, // 是否为分组柱状图
    xField: 'source',
    yField: 'amount',
    seriesField: 'title',
    // columnWidthRatio: 0.3, // 柱状图宽度占比 [0-1]。
    minColumnWidth: 30,
    // maxColumnWidth: 30,
    scrollbar: {
      type: 'horizontal', // 滚动条类型
      height: 5, // 高度
      categorySize: 100, // 对应水平滚动条，为 x 轴每个分类字段的宽度；对于垂直滚动条，为 x 轴每个分类字段的高度
      style: {
        trackColor: '#f5f5f5', // 滚动条滑道填充色
        thumbColor: 'rgba(72,201,176,0.6)' //滚动条滑块填充色
      }
    }, // 滚动条
    label: {
      position: 'middle',
      style: {
        opacity: 0.6
      },
      layout: [{ type: 'interval-adjust-position' }, { type: 'interval-hide-overlap' }, { type: 'adjust-color' }]
    }
  }
  return data.length > 0 ? (
    <Column {...config} style={{ height: 400, padding: 20 }} />
  ) : (
    <Empty style={{ height: 400, padding: '100px 20px 20px' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
  )
}

function ShenPiColumn({ data }) {
  let config = {
    data,
    xField: 'name',
    yField: 'amount',
    // columnWidthRatio: 0.4,
    minColumnWidth: 20,
    maxColumnWidth: 30,
    color: 'rgba(72,201,176,1)',
    columnStyle: {
      fill: 'l(270) 0:rgba(72,201,176,0.7) 1:rgba(72,201,176,1)'
    },
    scrollbar: {
      type: 'horizontal', // 滚动条类型 横向
      height: 5, // 高度
      categorySize: 40, // 对应水平滚动条，为 x 轴每个分类字段的宽度；对于垂直滚动条，为 x 轴每个分类字段的高度
      style: {
        trackColor: '#f5f5f5', // 滚动条滑道填充色
        thumbColor: 'rgba(72,201,176,0.6)' //滚动条滑块填充色
      }
    }, // 滚动条
    label: {
      position: 'middle',
      style: {
        fill: 'white',
        opacity: 0.8
      }
    },
    meta: {
      name: { alias: '审批人' },
      amount: { alias: '审批数量' }
    }
  }
  return data.length > 0 ? (
    <Column {...config} style={{ height: 400, padding: 20 }} />
  ) : (
    <Empty style={{ height: 400, padding: '100px 20px 20px' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
  )
}

export { DemoPie, ShenPiColumn, SourceColumn }
