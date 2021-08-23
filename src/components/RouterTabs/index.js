import React, { Component } from 'react'
import classNames from 'classnames'
import { Tag, Dropdown, Icon, Tooltip, Menu } from 'antd'
import withRouter from 'umi/withRouter'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import router from 'umi/router'
import styles from './index.less'
import routers from '../../../config/router.config'
import defaultSettings from '../../../config/defaultSettings'

const { SubMenu } = Menu

// 通过 pathname 获取 pathname 对应到路由描述信息对象
export const getTitleByPathname = path => {
  let title = '404'
  const searchTit = arr => {
    for (let i = 0; i < arr.length; i++) {
      if (path.indexOf(arr[i].path) >= 0 && arr[i].routes) searchTit(arr[i].routes)
      if (arr[i].path && pathToRegexp(arr[i].path).exec(path)) {
        title = arr[i].name ? arr[i].name : '404'
        break
      }
    }
  }
  searchTit(routers)
  return title
}

const namespace = 'routerTabs'

const mapStateToProps = state => {
  const { currentPath, refsTag } = state[namespace]
  return {
    currentPath,
    refsTag,
  }
}

class RouterTabs extends Component {
  handleClose = (tag, e) => {
    let { currentPath, refsTag } = this.props
    // const { searchMap } = this.props;
    const newRefsTag = [...refsTag.filter(t => t !== tag)]
    // 关闭当前页
    if (currentPath === tag) {
      currentPath = refsTag[refsTag.indexOf(tag) - 1]
      router.push({
        pathname: currentPath,
        // search: searchMap[currentPath],
      })
    }

    this.props.dispatch({
      type: `${namespace}/closePage`,
      payload: { closePath: tag },
    })

    // this.props.dispatch({
    //   type: `${namespace}/save`,
    //   payload: { refsTag: newRefsTag },
    // })

    if (e && e.stopPropagation)
      // 因此它支持W3C的stopPropagation()方法
      e.stopPropagation()
    // 否则，我们需要使用IE的方式来取消事件冒泡
    else window.event.cancelBubble = true
  }

  handleClickTag = (tag, e) => {
    if (tag !== this.props.currentPath) {
      router.push({
        pathname: tag,
        // search: this.state.searchMap[tag] ? this.state.searchMap[tag].replace(/from=[^&]+&?/, '') : undefined,
      })
      sessionStorage.setItem(`${this.props.currentPath}-close`, 'false')
    }
  }

  handleMenuClick = e => {
    const eKey = e.key
    let { currentPath, refsTag } = this.props

    let newRefsTag
    if (eKey === '1') {
      newRefsTag = [refsTag[0]]
      router.push({
        pathname: refsTag[0],
      })
    } else if (eKey === '2') {
      newRefsTag = [refsTag[0], currentPath]
    } else {
      this.handleClickTag(eKey)
      return
    }
    if (newRefsTag) {
      this.props.dispatch({
        type: `${namespace}/save`,
        payload: { refsTag: newRefsTag },
      })
    }
  }

  render() {
    const { currentPath, refsTag } = this.props
    const { className, style } = this.props // 可以在父组件定义样式
    const cls = classNames(styles['router-tabs'], className)
    const tags = refsTag.map((pathname, index) => {
      const title = getTitleByPathname(pathname)
      if (!title) return null
      const isLongTag = title.length > 30
      const tagElem = (
        <Tag
          key={pathname}
          data-key={pathname}
          className={classNames(styles.tag, { [styles.active]: pathname === currentPath })}
          onClick={e => this.handleClickTag(pathname, e)}
          closable={index !== 0}
          onClose={e => this.handleClose(pathname, e)}
        >
          {pathname === currentPath ? (
            <span className={styles.icon} style={{ background: defaultSettings.primaryColor }} />
          ) : (
            <span className={styles.icon} />
          )}

          {isLongTag ? `${title.slice(0, 30)}...` : title}
        </Tag>
      )
      return isLongTag ? (
        <Tooltip title={title} key={`tooltip_${pathname}`}>
          {tagElem}
        </Tooltip>
      ) : (
        tagElem
      )
    })
    this.tags = tags
    /* eslint-disable */
    return (
      <div
        className={cls}
        style={{
          ...style,
          height: '40px',
          maxHeight: '40px',
          lineHeight: '40px',
          marginRight: '-12px',
        }}
      >
        <div
          style={{
            flex: '1',
            height: '40px',
            position: 'relative',
            overflow: 'hidden',
            background: '#f0f0f0',
            padding: '0px 0px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              whiteSpace: 'nowrap',
              width: '100%',
              top: '0px',
              padding: '0px 10px 0px 10px',
              overflowX: 'auto',
            }}
          >
            {tags}
          </div>
        </div>
        <div
          style={{
            width: '96px',
            height: '100%',
            background: '#fff',
            boxShadow: '-3px 0 15px 3px rgba(0,0,0,.1)',
          }}
        >
          <Dropdown
            overlay={
              <Menu onClick={this.handleMenuClick}>
                <Menu.Item key='1'>关闭所有</Menu.Item>
                <Menu.Item key='2'>关闭其他</Menu.Item>
                <SubMenu title='切换标签'>
                  {tags.map(item => (
                    <Menu.Item key={item.key}>{item.props.children}</Menu.Item>
                  ))}
                </SubMenu>
              </Menu>
            }
          >
            <Tag size={'small'} color='#2d8cf0' style={{ marginLeft: 12 }}>
              标签选项 <Icon type='down' />
            </Tag>
          </Dropdown>
        </div>
      </div>
    )
  }
}
export default withRouter(connect(mapStateToProps)(RouterTabs))
