import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Form, Checkbox, Input, DatePicker, Radio, Select, Rate } from 'antd'
import moment from 'moment'

const { RangePicker } = DatePicker
const { TextArea } = Input

// 后台返回的数据格式
const data = [
  {
    type: 'TextArea',
    title: '多行输入框',
    props: {
      placeholder: '请输入'
    }
  },
  {
    type: 'Rate',
    title: '评分',
    props: {
      count: 5
    }
  }
]

function switchItem(item) {
  const type = item.type
  switch (type) {
    case 'Input':
      return <Input />
      break
    case 'TextArea':
      return <TextArea />
      break
    case 'Checkbox':
      let option = []
      item.options.map(items => {
        option.push({
          value: items.id,
          label: items.name
        })
      })
      return <Checkbox.Group options={option} defaultValue={['Pear']} />
      break
    case 'Radio':
      return (
        <Radio.Group>
          {item.options.map((option, index) => {
            return (
              <Radio key={index} value={option.id}>
                {option.name}
              </Radio>
            )
          })}
        </Radio.Group>
      )
      break
    case 'Radios':
      return (
        <Radio.Group>
          {item.options.map((option, index) => {
            return (
              <Radio key={index} value={option.id}>
                {option.name}
              </Radio>
            )
          })}
        </Radio.Group>
      )
      break
    case 'RangePicker':
      return <RangePicker style={{ width: '100%' }} />
      break
    case 'DatePicker':
      return <DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' defaultValue={moment()} />
      break
    case 'Select':
      return (
        <Select>
          {item.options.map((option, index) => {
            return (
              <Select.Option key={index} value={option.id}>
                {option.name}
              </Select.Option>
            )
          })}
        </Select>
      )
      break
    case 'Rate':
      return <Rate />
      break
    default:
      return <Input />
      break
  }
}

export { switchItem }
export default ''
