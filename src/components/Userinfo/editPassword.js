import React, { Component } from 'react'
import { Button, Input, notification } from 'antd'
import router from 'umi/router'
import { post } from '@/utils/http'
import { Error_modal } from '@/utils/Modal'

class EditPassword extends Component {
  password = {
    oldpassword: '',
    newpassword: '',
    confirmpassword: ''
  }

  handleInputChange = event => {
    const { target } = event
    const { value } = target
    const { name } = target
    this.password[name] = value
  }

  checkPwd = str => {
    const pattern1 = /([0-9]+)/
    const pattern2 = /([a-z]+)/
    const pattern3 = /([A-Z]+)/
    // 限制密码的位数在8-20位之间
    if (str.length < 8 || str.length > 20) {
      return false
    }
    // 没有数字、大写字母、小写字母时返回false，验证输入的密码不符合规则。
    if (!pattern1.exec(str) || !pattern2.exec(str) || !pattern3.exec(str)) {
      return false
    }

    // 不能有空格、换行、tab缩进等所有的空白
    const pattern4 = /\s+/g
    if (pattern4.exec(str)) {
      return false
    }
    return true
  }

  editPw = () => {
    if (this.password.newpassword === this.password.confirmpassword) {
      if (this.checkPwd(this.password.newpassword)) {
        post(`sys/user-employees/password/edit`, { newPassword: this.password.newpassword, oldPassword: this.password.oldpassword })
          .then(res => {
            // Success_modal('修改成功,下次请用新密码登录')
            notification.success({
              message: '修改成功,下次请用新密码登录',
              duration: 2
            })
            router.goBack()
          })
          .catch()
      } else {
        notification.error({
          message: '密码需要长度在8-20位间，必须有数字，大写字母和小写字母并且不能有空格',
          duration: 2
        })
      }
    } else {
      Error_modal('两次密码不一致！')
    }
  }

  render() {
    return (
      <div id='edit_password_div'>
        {/*<h1 className='h3'>修改密码</h1>*/}
        <label>原密码：&#12288;</label>
        <Input.Password size='default' id='ymm_ipt' name='oldpassword' onChange={this.handleInputChange} style={{ width: 300, margin: 10 }} /> <br />
        <label>新密码：&#12288;</label>
        <Input.Password size='default' id='newmm_ipt' name='newpassword' onChange={this.handleInputChange} style={{ width: 300, margin: 10 }} />
        <br />
        <label>确认密码：</label>
        <Input.Password size='default' id='confirmmm_ipt' name='confirmpassword' onChange={this.handleInputChange} style={{ width: 300, margin: 10 }} />
        <br />
        <Button type='primary' className='editPw_btn' onClick={this.editPw}>
          提交
        </Button>
      </div>
    )
  }
}

export default EditPassword
