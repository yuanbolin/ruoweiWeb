/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-27 11:50:25
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-08-28 15:54:09
 * @Description: Description
 */
import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import Link from 'umi/link'
import withRouter from 'umi/withRouter'
import pathToRegexp from 'path-to-regexp'
import defaultSettings from '../../config/defaultSettings'
import routers from '../../config/router.config'
import router from 'umi/router'
import { get } from '@/utils/http'

const { SubMenu } = Menu
const { layout, navTheme, menuMode } = defaultSettings
class BasicMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuArr: []
    }
    this.currentPath = ''
  }

  componentDidMount() {
    this.getMenu()
    this.getInfo()
  }

  componentWillReceiveProps() {
    const currentPath = this.props.history.location.pathname
    this.getInfo()
    if (currentPath !== this.currentPath) {
      this.initMenuStatus()
    }
  }

  initMenuStatus = () => {
    const { menuArr } = this.state
    const currentPath = this.props.history.location.pathname

    let openKeys = []
    let selectedKeys = ''
    const search = arr => {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (selectedKeys) break
        if (item.routes) {
          openKeys.push(item.path)
          search(item.routes)
        }
        let regResult = pathToRegexp(`${item.path}/(.*)`).exec(`${currentPath}/`) != null
        if (!item.redirect && !item.routes && regResult) {
          selectedKeys = item.path
          this.setState({ openKeys, selectedKeys })
          this.currentPath = currentPath
          break
        }
        if (i === arr.length - 1 && !selectedKeys) {
          openKeys.pop()
        }
      }
    }
    search(menuArr)
  }

  getMenu = () => {
    // 请求routers
    this.setState({ menuArr: routers })
  }

  getInfo = () => {
    get(`personalMessage`).then(response => {
      this.setState({
        isShow: response.data.role
      })
    })
  }

  onOpenChange = openKeys => {
    this.setState({ openKeys })
  }

  onSelect = item => {
    this.currentPath = item.item.props.children.props.to
    this.setState({ selectedKeys: item.key })
  }

  menuMap = menu => {
    let THE = this
    return menu.map(item => {
      if (item.hideMenu) return null
      if ((!item.name && !item.routes) || item.component == '404') return null
      if (item.name && !item.routes) {
        const icon = item.icon ? <Icon type={item.icon} /> : null
        return (
          <Menu.Item key={item.path}>
            <Link to={item.path}>
              {icon}
              <span>{item.name}</span>
            </Link>
          </Menu.Item>
        )
      }
      if (item.name && item.routes) {
        const icon = item.icon ? <Icon type={item.icon} /> : null
        return (
          <SubMenu
            key={item.path}
            title={
              <span>
                {icon}
                <span>{item.name}</span>
              </span>
            }
          >
            {this.menuMap(item.routes)}
          </SubMenu>
        )
      }
      if (!item.name && item.routes) {
        return this.menuMap(item.routes)
      }
    })
  }

  getResultArr = theRouters => {
    const menuArr = this.menuMap(theRouters).filter(item => item !== null)
    const resultArr = []
    const foreach = arr => {
      arr.forEach(item => {
        if (item instanceof Array) {
          foreach(item)
        } else {
          resultArr.push(item)
        }
      })
    }
    foreach(menuArr)
    return resultArr
  }

  render() {
    const { openKeys, selectedKeys } = this.state
    return (
      <Menu
        theme={defaultSettings.navTheme}
        mode={layout.indexOf('top') > -1 ? 'horizontal' : menuMode}
        onSelect={this.onSelect}
        onOpenChange={this.onOpenChange}
        openKeys={openKeys || null}
        selectedKeys={selectedKeys ? [selectedKeys] : null}
      >
        {this.getResultArr(this.state.menuArr)}
      </Menu>
    )
  }
}

export default withRouter(BasicMenu)
