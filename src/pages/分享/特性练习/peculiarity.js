//父子组件特性练习3答案（两个输入框均为子组件，要求值互相关联哪一个发生变化另一个会随之变化）
import React, { Component } from 'react'
import Input from './components/Input'

export default class Peculiarity extends Component {
  state = {
    value: '',
    type: ''
  }

  changeInput = (value, type) => {
    this.setState({
      type,
      value
    })
  }

  render() {
    let { type, value } = this.state
    let sheshidu = value
    let huashidu = value
    if (type == 'sheshidu' && !isNaN(parseFloat(value))) {
      huashidu = (parseFloat(value) - 32) / 1.8
    } else if (type == 'huashidu' && !isNaN(parseFloat(value))) {
      sheshidu = parseFloat(value) * 1.8 + 32
    }
    return (
      <div>
        <div>两个输入框均为子组件，要求值互相关联哪一个发生变化另一个会随之变化</div>
        <Input type='sheshidu' value={sheshidu} changeInput={this.changeInput} />
        <Input type='huashidu' value={huashidu} changeInput={this.changeInput} />
      </div>
    )
  }
}
