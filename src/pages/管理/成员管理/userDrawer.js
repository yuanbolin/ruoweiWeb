import React from 'react'
import { Input, Form, Button, Select, Drawer, notification, Col, Row } from 'antd'
import { get, post, put } from '@/utils/http'
import styles from '../index.less'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      edit: null,
      loading: false,
      info: {}
    }
  }

  componentDidMount() {}

  componentWillUpdate(nextProps, nextState) {
    let THE = this
    if (nextState.visible !== nextProps.visible) {
      THE.setState({
        visible: nextProps.visible,
        edit: nextProps.edit,
        info: {}
      })
      if (nextProps.edit) {
        THE.setState({
          info: nextProps.info
        })
      }
      return true
    }
    return false
  }

  onClose = () => {
    this.props && this.props.onClose(false)
  }

  onHandelOK = () => {
    let form = this.props.form
    let name = form.getFieldValue('name')
    let account = form.getFieldValue('account')
    let password = form.getFieldValue('password')
    let roleName = form.getFieldValue('role')
    if (name !== null) {
      name = name.replace(/(^\s*)|(\s*$)/g, '')
    }
    if (account !== null) {
      account = account.replace(/(^\s*)|(\s*$)/g, '')
    }
    if (name === null || name === '') {
      return notification.warn({ message: '请输入姓名' })
    }
    if (account === null || account === '') {
      return notification.warn({ message: '请输入账号' })
    }
    if (roleName === null || roleName === '') {
      return notification.warn({ message: '请选择角色' })
    }
    let data = {
      name,
      account,
      roleName
    }
    if (this.state.edit === null) {
      if (password !== undefined) {
        password = password.replace(/(^\s*)|(\s*$)/g, '')
      }
      if (password === undefined || password === '') {
        return notification.warn({ message: '请输入密码' })
      }
      let datas = {
        ...data,
        password
      }
      this.setState({
        loading: true
      })
      post(`userManage/addUser`, datas)
        .then(res => {
          notification.success({ message: '新增成功' })
          this.setState({
            info: {},
            loading: false
          })
          this.onClose()
        })
        .catch(error => {
          this.setState({
            loading: false
          })
        })
    } else {
      let datas = {}
      if (password !== undefined && password !== '') {
        datas = {
          ...data,
          id: this.state.edit,
          password
        }
      } else {
        datas = {
          ...data,
          id: this.state.edit
        }
      }
      this.setState({
        loading: true
      })
      put(`userManage/alterUser`, datas)
        .then(res => {
          notification.success({ message: '修改成功' })
          this.setState({
            info: {},
            loading: false
          })
          this.onClose()
        })
        .catch(error => {
          this.setState({
            loading: false
          })
        })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { edit, visible, info } = this.state
    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 16
      }
    }
    return (
      <div>
        <Drawer
          className={styles.drawer}
          title={edit === null ? '新增成员信息' : '编辑成员信息'}
          width={450}
          onClose={this.onClose}
          visible={visible}
          destroyOnClose
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form hideRequiredMark {...formItemLayout}>
            <Row>
              <Col>
                <Form.Item label='账号'>
                  {getFieldDecorator('account', {
                    initialValue: info.loginCode ? info.loginCode : null,
                    rules: [{ required: true, message: '请输入员工账号' }]
                  })(edit ? <p style={{ width: 200, margin: 0 }}>{info.loginCode}</p> : <Input placeholder='请输入员工账号' style={{ width: 300 }} />)}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label='姓名'>
                  {getFieldDecorator('name', {
                    initialValue: info.userName ? info.userName : null,
                    rules: [{ required: true, message: '请输入员工姓名' }]
                  })(<Input placeholder='请输入员工姓名' style={{ width: 300 }} />)}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label='角色'>
                  {getFieldDecorator('role', {
                    initialValue: info.roleName ? info.roleName : null,
                    rules: [{ required: true, message: '请选择员工角色' }]
                  })(
                    <Select placeholder='请选择员工角色' style={{ width: 300 }}>
                      <Select.Option value='系统管理员'>系统管理员</Select.Option>
                      <Select.Option value='普通用户'>普通用户</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label='密码' extra='编辑成员信息时，该项可不填!'>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码' }]
                  })(<Input placeholder='请输入密码' style={{ width: 300 }} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.onHandelOK} type='primary' loading={this.state.loading}>
              确定
            </Button>
          </div>
        </Drawer>
      </div>
    )
  }
}
const Appmain = Form.create()(App)
export default Appmain
