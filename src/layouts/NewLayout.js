/**
 *
 * @author     ：苑博林
 * @date       ：2020/12/14 15:43
 * @creed      ：layout布局 由于多一层组件嵌套,将this.props.children再一次传入
 * @version    ： 1.0
 */
import React, { Component } from 'react'
import defaultSettings from '../../config/defaultSettings'
import SideLayout from './SideLayout'
import TopLayout from './TopLayout'
import MixLayout from './MixLayout'
import Authorized from '@/pages/Authorized'

export default class NewLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  getLayout = () => {
    if (defaultSettings.layout == 'mix') {
      return <MixLayout content={this.props.children} />
    }
    if (defaultSettings.layout == 'top') {
      return <TopLayout content={this.props.children} />
    }
    return <SideLayout content={this.props.children} />
  }

  render() {
    return (
      <Authorized>
        <div style={{ minWidth: defaultSettings.minWidth }}>{this.getLayout()}</div>
      </Authorized>
    )
  }
}
