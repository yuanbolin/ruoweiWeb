import React, { Component } from 'react'
import { Layout, Menu, Icon, Dropdown, Avatar, ConfigProvider, Tooltip, Row, Col, Button } from 'antd'
import { Link, router } from 'umi'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'

import Breadcrumbs from '@/components/Breadcrumb'
import defaultSettings from '../../config/defaultSettings'
import styles from './NewLayout.less'
import 'moment/locale/zh-cn'
import BasicMenu from './Menu'
import { post } from '@/utils/http'

moment.locale('zh-cn')
const { Header, Content, Footer } = Layout
export default class NewLayout extends Component {
  constructor(props) {
    super(props)
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
          <Link to='/main/home'>个人主页</Link>
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
            <Header
              style={{
                background: defaultSettings.navTheme === 'light' ? 'white' : defaultSettings.navTheme,
                padding: 0,
                borderBottom: '12px solid rgba(0, 186, 173, 1)'
              }}
              className={styles.header}
            >
              <img src={defaultSettings.logo()} alt='图标' className={styles.topLogo} />
              <div className={styles.topMenu}>
                <BasicMenu />
              </div>
              <Dropdown className={styles.dropdown} overlay={user_menu}>
                <a
                  className='ant-dropdown-link'
                  onClick={e => e.preventDefault()}
                  style={{ color: defaultSettings.navTheme === 'light' ? 'rgba(0, 0, 0, 0.65)' : 'white' }}
                >
                  {sessionStorage.getItem('touxiang') && sessionStorage.getItem('touxiang') != 'undefined' ? (
                    <Avatar src={`${window.server}/${sessionStorage.getItem('touxiang')}`} size='small' />
                  ) : (
                    <Avatar icon='user' size='small' />
                  )}
                  {` ${sessionStorage.getItem('name') && sessionStorage.getItem('touxiang') != 'undefined' ? sessionStorage.getItem('name') : '管理员'} `}
                  <Icon type='down' style={{ paddingLeft: '2px' }} />
                </a>
              </Dropdown>
              {/*<HeaderBell color={defaultSettings.navTheme === 'light' ? 'black' : 'white'} />*/}
            </Header>
          )}
          <Row>
            <Col xxl={{ span: 20, offset: 2 }} xl={{ span: 22, offset: 1 }} lg={{ span: 24, offset: 0 }}>
              <Content
                style={{
                  width: '100%',
                  maxWidth: `${defaultSettings.contentWidth}px`,
                  margin: '0 auto',
                  minHeight: `calc(100vh - ${defaultSettings.headerHeight + 81}px)`
                }}
              >
                {defaultSettings.BreadcrumbsRender && <Breadcrumbs />}
                <div className={styles.contentBox}>{this.props.content}</div>
              </Content>
            </Col>
          </Row>
          <Footer>
            <div className={styles.footer}>Copyright© 2021 若维技术部出品</div>
          </Footer>
        </Layout>
      </ConfigProvider>
    )
  }
}
