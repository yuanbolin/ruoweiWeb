import { Redirect } from 'dva/router'
import { Component } from 'react'
import { Spin } from 'antd'
import { get } from '@/utils/http'

class AuthRouter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      role: ''
    }
  }

  componentDidMount() {
    get('personalMessage').then(res => {
      this.setState({
        role: res.data.role
      })
    })
  }

  render() {
    const { role } = this.state
    // eslint-disable-next-line no-nested-ternary
    return role ? (
      role === '系统管理员' ? (
        <div>{this.props.children}</div>
      ) : (
        <Redirect to='/main/workbench' />
      )
    ) : (
      <Spin size='large' style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }} />
    )
  }
}

export default AuthRouter
