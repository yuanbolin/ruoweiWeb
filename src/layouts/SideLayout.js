import React, { Component } from 'react'
import { Layout, Menu, Icon, Dropdown, Avatar, ConfigProvider, Tooltip } from 'antd'
import { Link, router } from 'umi'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import defaultSettings from '../../config/defaultSettings'
import styles from './NewLayout.less'
import HeaderBell from '@/components/HeaderBell/Index'
import 'moment/locale/zh-cn'
import BasicMenu from './Menu'
import Breadcrumbs from '@/components/Breadcrumb'
import { post } from '@/utils/http'

moment.locale('zh-cn')
const { Header, Content, Sider, Footer } = Layout
export default class SideLayout extends Component {
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
    console.log(defaultSettings)
    return (
      <ConfigProvider locale={zhCN}>
        <Layout style={{ minHeight: '100vh', height: '100%' }}>
          {defaultSettings.menuRender && (
            <Sider
              className={defaultSettings.fixSiderbar ? styles.rwSider : ''}
              theme={defaultSettings.navTheme}
              width={defaultSettings.siderWidth}
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              style={defaultSettings.navTheme === 'light' ? {'boxShadow': 'rgb(36, 36, 36) 2px 0 6px'} : {'boxShadow': 'rgb(136, 136, 136) 2px 0 6px'}}
            >
              {this.state.collapsed
                ? defaultSettings.menuHeaderRender && (
                    <div className={styles.sideLogoBox}>
                      <img src={defaultSettings.logo()} alt='图标' className={`${styles.logo} ${styles.logoSmall}`} />
                    </div>
                  )
                : defaultSettings.menuHeaderRender && (
                    <div className={styles.sideLogoBox}>
                      <img src={defaultSettings.logo()} alt='图标' className={styles.logo} />
                    </div>
                  )}
              <BasicMenu collapsed={this.state.collapsed} />
            </Sider>
          )}
          <Layout style={{ flexDirection: 'column' }}>
            {defaultSettings.headerRender && (
              <Header
                style={{
                  background: defaultSettings.navTheme === 'light' ? 'black' : 'white',
                  padding: 0,
                  boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'
                }}
              >
                <Icon
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  style={{ fontSize: 20, marginLeft: 20, color: defaultSettings.navTheme === 'light' ? 'white' : 'black' }}
                  onClick={this.toggle}
                />
                <span style={{ fontSize: 26, fontWeight: 600, marginLeft: 30, color: defaultSettings.primaryColor }}>{defaultSettings.title}</span>
                <Dropdown className={styles.dropdown} overlay={user_menu}>
                  <a
                    className='ant-dropdown-link'
                    onClick={e => e.preventDefault()}
                    style={{ color: defaultSettings.navTheme === 'light' ? 'white' : 'black' }}
                  >
                    <Avatar style={{ backgroundColor: defaultSettings.primaryColor, marginRight: '2px' }} icon='user' size='small' />
                    {`${sessionStorage.getItem('userName') || '管理员'}`}
                    <Icon type='down' style={{ paddingLeft: '2px' }} />
                  </a>
                </Dropdown>
                <HeaderBell color={defaultSettings.navTheme === 'light' ? 'white' : 'black'} />
                <Link
                  to='/admin/shiyongwendang'
                  style={{
                    float: 'right',
                    display: 'block',
                    marginRight: 20,
                    cursor: 'pointer',
                    paddingTop: 1,
                    color: defaultSettings.navTheme === 'light' ? 'white' : 'black'
                  }}
                >
                  <Tooltip placement='bottom' title='使用文档'>
                    <Icon type='question-circle' />
                  </Tooltip>
                </Link>
              </Header>
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
            <Footer>
              <div className={styles.footer}>Copyright© 2021 若维技术部出品</div>
            </Footer>
          </Layout>
        </Layout>
      </ConfigProvider>
    )
  }
}
