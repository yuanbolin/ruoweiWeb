import React, { Component } from 'react'
import { Button, Form, Icon, Input } from 'antd'
import router from 'umi/router'
import { get, post } from '@/utils/http'
import style from './index.less'
import defaultSettings from '@/../config/defaultSettings'

const FormItem = Form.Item

class Login extends Component {
  state = { loading: false }

  componentDidMount() {
    this.clearStorage()
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })
        let newParams = {
          username: values.username && values.username.replace(/^\s+|\s+$/g, ''), // 去除首尾空格
          password: values.password
        }

        // post('authenticate', newParams)
        //   .then(res => {
        //     const data = res.data
        //     sessionStorage.clear() // 重新登录时，需要清除
        //     sessionStorage.setItem('token', data.id_token)
        //     get(`personalMessage`).then(response => {
        //       const login_info = response.data
        //       sessionStorage.setItem('name', login_info.name)
        //       sessionStorage.setItem('login', login_info.login)
        //       sessionStorage.setItem('id', login_info.id)
        //       sessionStorage.setItem('touxiang', login_info.image)
        //       sessionStorage.setItem('roleName', login_info.role)
        //       this.setState(
        //         {
        //           loading: false
        //         },
        //         () => {
        //           router.push('/main')
        //         }
        //       )
        //     })
        //   })
        //   .catch(() => {
        //     this.setState({
        //       loading: false
        //     })
        //   })

        //模拟1000延迟登录接口效果
        setTimeout(() => {
          sessionStorage.clear() // 重新登录时，需要清除
          sessionStorage.setItem('token', 'token_test')
          sessionStorage.setItem('name', '游客')
          sessionStorage.setItem('id', '123456')
          sessionStorage.setItem('touxiang', '')
          sessionStorage.setItem('roleName', '游客访问')
          this.setState(
            {
              loading: false
            },
            () => {
              router.push('/main')
            }
          )
        }, 1000)
      }
    })
  }

  //清空sessionStorage缓存
  clearStorage = () => {
    sessionStorage.setItem('openKeys', null)
    sessionStorage.setItem('menuSelectKeys', null)
    sessionStorage.setItem('name', null)
    sessionStorage.setItem('id', null)
    sessionStorage.setItem('phone', null)
    sessionStorage.setItem('token', null)
    sessionStorage.setItem('roleName', null)
  }

  render() {
    let { getFieldDecorator } = this.props.form
    return (
      <div className={style.Login}>
        <div className={style.loginBox}>
          <div className={style.content}>
            <img src={defaultSettings.logo()} alt='图标' style={{ height: '70px', margin: `0 auto 47px` }} />
            <Form onSubmit={this.handleSubmit} className='login-form'>
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入用户名' }]
                })(<Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='用户名' />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }]
                })(<Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='密 码' />)}
              </FormItem>
              <FormItem>
                <Button type='primary' htmlType='submit' className={style.loginFormButton} loading={this.state.loading}>
                  登录
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

const WrappedNormalLoginForm = Form.create()(Login)
export default WrappedNormalLoginForm
