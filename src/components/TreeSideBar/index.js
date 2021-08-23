/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-09 09:08:13
 * @Description: Description
 */
import React, { Component } from 'react'
import { Layout, Icon, Tree } from 'antd'
import Link from 'umi/link'
import styles from './index.less'
import { get } from '../../utils/http'
import defaultSettings from '../../../config/defaultSettings'

const { Sider } = Layout
const { TreeNode } = Tree

class TreeSideBar extends Component {
  static defaultProps = {
    onfetch() {}
  }

  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      expandedKeys: [],
      isExpanded: false,
      data: [],
      selectedKeys: [],
      maxWidth: 10
    }
    this.maxLength = 10
  }

  componentDidMount() {
    // this.props.onfetch(this)
    const initValState = sessionStorage.getItem(`${this.props.match.url}-siderBar`)
    if (initValState) {
      console.log('initValState==>', initValState)
      this.setState({ ...JSON.parse(initValState) })
    } else {
      // this.fetch()
    }
  }

  componentWillUnmount() {
    if (sessionStorage.getItem(`${this.props.match.url}-close`) === 'false') {
      sessionStorage.setItem(`${this.props.match.url}-siderBar`, JSON.stringify(this.state))
    } else {
      sessionStorage.removeItem(`${this.props.match.url}-siderBar`)
    }
  }

  fetch = () => {
    get('sys-offices/tree').then(
      res => {
        console.log('tree==>', res.data)
        this.setState({ data: res.data.children })
      },
      () => {
        this.getWidth(this.state.data)
        this.setState({
          maxWidth: this.maxLength
        })
      }
    )
  }

  getWidth = data => {
    data.children.map(item => {
      if (item.children && item.children.length === 0) {
        if (item.sysOffice.officeName.length > this.maxLength) {
          this.maxLength = item.sysOffice.officeName.length
        }
      } else {
        this.getWidth(item)
      }
    })
  }

  refresh = () => {
    this.setState({ data: [] })
    this.fetch()
  }

  onExpand = (expandedKeys, { expanded: bool, node }) => {
    this.setState({ expandedKeys })
  }

  toggleExpand = () => {
    const { isExpanded, data } = this.state
    if (isExpanded) {
      this.setState({
        isExpanded: false,
        expandedKeys: []
      })
      this.expandedKeys = null // 避免每次遍历 提升效率
    } else {
      if (!this.expandedKeys) {
        this.expandedKeys = []
        const loop = datas => {
          datas.forEach(item => {
            if (item.children) {
              this.expandedKeys.push(item.sysOffice.id)
              loop(item.children)
            }
          })
        }
        loop(data)
      }
      console.log('expandedKeys==>', this.expandedKeys)
      this.setState({
        expandedKeys: this.expandedKeys,
        isExpanded: true
      })
    }
  }

  renderTree = data => {
    return data.map(item => {
      return (
        <TreeNode
          key={item.sysOffice.id}
          title={<div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}> {item.sysOffice.officeName}</div>}
        >
          {item.children ? this.renderTree(item.children) : null}
        </TreeNode>
      )
    })
  }

  onSelect = value => {
    const v = value[0] ? value[0] : null
    this.props.onSelect(v)
    this.setState({ selectedKeys: value })
  }

  render() {
    const { isExpanded, expandedKeys, data, selectedKeys } = this.state
    const maxWidth = this.state.maxWidth * 14 + 100
    const treeOpt = this.renderTree(data)
    return (
      <Sider
        className={styles.sider}
        theme='light'
        width={maxWidth >= defaultSettings.siderWidth ? maxWidth : defaultSettings.siderWidth}
        // style={{maxHeight:500}}
        defaultCollapsed={defaultSettings.defaultCollapsed}
        collapsible={defaultSettings.collapsible}
        collapsedWidth={0}
        collapsed={this.state.collapsed}
        onCollapse={collapsed => {
          this.setState({ collapsed })
        }}
      >
        <div className={styles.header}>
          <span className={styles.tit}>部门</span>
          <span onClick={this.toggleExpand} title={isExpanded ? '折叠' : '展开'}>
            {isExpanded ? <Icon type='up' /> : <Icon type='down' />}
          </span>
          <span onClick={this.refresh} title='刷新'>
            <Icon type='redo' />
          </span>
        </div>
        <div className={styles.treeDiv}>
          <Tree
            expandedKeys={expandedKeys}
            onExpand={this.onExpand}
            blockNode
            style={{ fontSize: 12, maxHeight: 400 }}
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
          >
            {treeOpt}
          </Tree>
        </div>
      </Sider>
    )
  }
}
export default TreeSideBar
