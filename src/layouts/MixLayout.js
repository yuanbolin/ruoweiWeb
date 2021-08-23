import React, { Component } from 'react'
import { Layout, Menu, Icon, Dropdown, Avatar, ConfigProvider, Tooltip } from 'antd'
import { Link, router } from 'umi'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import { Scrollbars } from 'react-custom-scrollbars'
import HeaderBell from '@/components/HeaderBell/Index'
import defaultSettings from '../../config/defaultSettings'
import styles from './NewLayout.less'
import 'moment/locale/zh-cn'
import BasicMenu from './Menu'
import Breadcrumbs from '@/components/Breadcrumb'
import { post } from '@/utils/http'
const { layout } = defaultSettings
moment.locale('zh-cn')
const { Header, Content, Sider, Footer } = Layout
export default class MixLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  // 退出
  logout = () => {
    router.push('/login')
    post(`logout`).then(res => {
      router.push('/login')
      sessionStorage.clear()
    })
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    // let token = sessionStorage.getItem('token')
    // if (!token) {
    //   router.push('/login')
    //   return false
    // }
    const user_menu = (
      <Menu>
        <Menu.Item key='1'>
          <Link to='/admin/zhgl'>帐号管理</Link>
        </Menu.Item>
        <Menu.Item key='2' onClick={this.logout}>
          退出
        </Menu.Item>
      </Menu>
    )

    return (
      <ConfigProvider locale={zhCN}>
        <Layout style={{ minHeight: '100vh', height: '100%' }}>
          {defaultSettings.headerRender && (
            <Header style={{ background: 'dark', padding: 0 }} className={styles.header}>
              <div className={styles.mixLogoBox}>
                <img src={defaultSettings.logo()} alt='图标' className={styles.logo} />
              </div>
              <Dropdown className={styles.dropdown} overlay={user_menu}>
                <a className='ant-dropdown-link' onClick={e => e.preventDefault()} style={{ color: 'white' }}>
                  <Avatar icon='user' size='small' /> {` ${sessionStorage.getItem('USER-NAME') || '管理员'}`}
                  <Icon type='down' style={{ paddingLeft: '2px' }} />
                </a>
              </Dropdown>
              <HeaderBell />
              <Link to='/admin/shiyongwendang' style={{ float: 'right', display: 'block', marginRight: 20, cursor: 'pointer', paddingTop: 1, color: 'white' }}>
                <Tooltip placement='bottom' title='使用文档'>
                  <Icon type='question-circle' />
                </Tooltip>
              </Link>
            </Header>
          )}
          <Layout>
            {defaultSettings.menuRender && (
              <Sider
                defaultCollapsed={defaultSettings.defaultCollapsed}
                collapsible={defaultSettings.collapsible}
                className={styles.rwSider}
                theme={defaultSettings.navTheme}
                width={defaultSettings.siderWidth}
              >
                {defaultSettings.fixSiderbar ? (
                  <Scrollbars style={{ height: '100%' }}>
                    {defaultSettings.layout !== 'mix' && defaultSettings.menuHeaderRender && (
                      <img src={defaultSettings.logo()} alt='图标' className={styles.logo} />
                    )}
                    <BasicMenu />
                  </Scrollbars>
                ) : (
                  <>
                    {defaultSettings.layout !== 'mix' && defaultSettings.menuHeaderRender && (
                      <img src={defaultSettings.logo()} alt='图标' className={styles.logo} />
                    )}
                    <BasicMenu />
                  </>
                )}
              </Sider>
            )}
            <Content
              style={{
                width: '100%',
                maxWidth: defaultSettings.contentWidth+'px',
                margin: '0 auto',
                minHeight: `calc(100vh - ${defaultSettings.headerHeight+81}px)`
              }}
            >
              {defaultSettings.BreadcrumbsRender && <Breadcrumbs />}
              <div className={styles.contentBox}>{this.props.content}</div>
            </Content>
          </Layout>
          <Footer>
            <div className={styles.footer}>Copyright© 2021 若维技术部出品</div>
          </Footer>
        </Layout>
      </ConfigProvider>
    )
  }
}
