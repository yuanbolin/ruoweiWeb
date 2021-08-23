import React, { Component } from 'react'
import { Icon, Input, Form, Button, Select, notification, Upload, message, Divider, Avatar, Tag, Tooltip } from 'antd'
import { get, post, put } from '@/utils/http'
import styles from './index.less'

const { TextArea } = Input
const { Option } = Select

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      edit: false,
      imageUrl: '',
      imgurl: '',
      loading: false
    }
  }

  componentDidMount() {
    this.fetch()
    this.getJob()
  }

  fetch = () => {
    get(`personalMessage`).then(res => {
      this.setState({
        userInfo: res.data,
        imageUrl: `${window.server}/${res.data.image}`,
        imgurl: res.data.image
      })
    })
  }

  getJob = () => {
    get('getPositionList').then(res => {
      this.setState({
        jobList: res.data
      })
    })
  }

  onHandelOK = () => {
    let form = this.props.form
    let name = form.getFieldValue('name')
    let login = form.getFieldValue('login')
    let gender = form.getFieldValue('gender')
    // let department = form.getFieldValue('department')
    let password = form.getFieldValue('password')
    let job = form.getFieldValue('job')
    let title = form.getFieldValue('title')
    let role = this.state.userInfo.role
    let image = this.state.imgurl
    let datas = {
      name,
      login,
      gender,
      // department,
      password,
      job,
      title,
      role,
      image,
      id: this.state.userInfo.id
    }
    this.setState({
      loading: true
    })
    post(`personalMessage`, datas)
      .then(res => {
        notification.success({ message: '修改成功' })
        this.fetch()
        this.setState({
          userInfo: {},
          edit: false,
          loading: false
        })
      })
      .catch(error => {
        this.setState({
          loading: false
        })
      })
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('请选择 JPG/PNG 格式的图片!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('文件大小不超过 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
          imgurl: info.file.response
        })
      )
    }
  }

  onEdit = () => {
    this.setState({
      edit: true
    })
    this.fetch()
  }

  onCancel = () => {
    this.setState({
      edit: false
    })
    this.props.form.resetFields()
    this.fetch()
  }

  render() {
    const FormItem = Form.Item
    const { getFieldDecorator } = this.props.form
    const { userInfo, imageUrl, edit } = this.state
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className='ant-upload-text'>Upload</div>
      </div>
    )
    const props = {
      action: `${window.server}/api/upload`,
      onChange: this.handleChange,
      name: 'image',
      headers: {
        // Authorization: `Bearer ${sessionStorage.getItem('token')}`
        Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLnjovlurflroEiLCJjdXIiOnsicGFzc3dvcmQiOm51bGwsInVzZXJuYW1lIjoi546L5bq35a6BIiwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifV0sImFjY291bnROb25FeHBpcmVkIjp0cnVlLCJhY2NvdW50Tm9uTG9ja2VkIjp0cnVlLCJjcmVkZW50aWFsc05vbkV4cGlyZWQiOnRydWUsImVuYWJsZWQiOnRydWUsImlkIjoxMzY5NDY3OTEyODE2OTUxMjk2LCJlbXBsb3llZUlkIjoxMzY5NDY3OTEyODA0MzY4Mzg0LCJsb2dpbkNvZGUiOiJ3a24xMjMiLCJhdmF0YXIiOm51bGx9LCJleHAiOjE2MTc5MzM1OTh9.xo0t4SMgAn8x6d6gn23jsDs_biXoDsWxtaTh-IIeeq45WWbfcFahDCpgALwrkuo7gU0zcVQ6GnPgAcdxx4c44g`
      }
    }
    const jobOptins =
      this.state.jobList &&
      this.state.jobList.map(item => {
        return (
          <Select.Option value={item.positionName} key={item.id}>
            {item.positionName}
          </Select.Option>
        )
      })
    return (
      <div className={styles.container}>
        <div style={{ flex: '1' }} className={styles.shadowBox}>
          <h3>个人主页</h3>
          <Divider />
          <div style={{ width: '500px', margin: '0 auto' }}>
            {!edit ? (
              imageUrl ? (
                <Avatar src={imageUrl} style={{ width: '120px', height: '120px' }} />
              ) : (
                <Avatar icon='user' size={120} />
              )
            ) : (
              <Upload {...props} listType='picture-card' className='avatar-uploader' showUploadList={false} beforeUpload={this.beforeUpload} disabled={!edit}>
                {imageUrl ? <img src={imageUrl} alt='avatar' style={{ width: '120px', height: '120px', borderRadius: '50%' }} /> : uploadButton}
              </Upload>
            )}
            <Form onSubmit={this.handleSubmit} layout='inline' style={{ margin: 5 }}>
              <FormItem label='姓名'>
                {getFieldDecorator('name', {
                  initialValue: userInfo.name ? userInfo.name : null
                })(
                  this.state.edit ? (
                    <Input style={{ width: 200, fontSize: '16px', marginBottom: 5 }} />
                  ) : (
                    <p style={{ width: 200, marginBottom: 5 }}>{userInfo.name}</p>
                  )
                )}
              </FormItem>
              <FormItem label='账号'>
                {getFieldDecorator('login', {
                  initialValue: userInfo.login ? userInfo.login : null
                })(
                  <p style={{ width: 200, marginBottom: 5 }}>
                    {userInfo.login}
                    {userInfo.role === '系统管理员' ? (
                      <Tag color='cyan' style={{ marginLeft: 5 }}>
                        系统管理员
                      </Tag>
                    ) : (
                      <Tag style={{ marginLeft: 5 }}>普通用户</Tag>
                    )}
                  </p>
                )}
              </FormItem>
              <FormItem label='密码'>
                {getFieldDecorator('password', {
                  initialValue: userInfo.password ? userInfo.password : null
                })(
                  this.state.edit ? (
                    <Input style={{ width: 200, fontSize: '16px', marginBottom: 5 }} disabled={!edit} />
                  ) : (
                    <p style={{ width: 200, marginBottom: 5 }}>{userInfo.password}</p>
                  )
                )}
              </FormItem>
              <FormItem label='性别'>
                {getFieldDecorator('gender', {
                  initialValue: userInfo.gender ? userInfo.gender : null
                })(
                  this.state.edit ? (
                    <Select style={{ width: 200, fontSize: '16px', marginBottom: 5 }} disabled={!edit}>
                      <Option value='MALE'>男</Option>
                      <Option value='FEMALE'>女</Option>
                    </Select>
                  ) : (
                    <p style={{ width: 200, marginBottom: 5 }}>
                      {userInfo.gender === 'MALE' ? '男' : ''}
                      {userInfo.gender === 'FEMALE' ? '女' : ''}
                    </p>
                  )
                )}
              </FormItem>
              {/*<FormItem label='部门'>
                {getFieldDecorator('department', {
                  initialValue: userInfo.department ? userInfo.department : null
                })(
                  this.state.edit ? (
                    <Select style={{ width: 200 }} disabled={!edit}>
                      <Option value='技术部'>技术部</Option>
                      <Option value='其他'>其他</Option>
                    </Select>
                  ) : (
                    <p style={{ width: 200 }}>{userInfo.department}</p>
                  )
                )}
              </FormItem>*/}
              <FormItem label='职位'>
                {getFieldDecorator('job', {
                  initialValue: userInfo.job ? userInfo.job : null
                })(
                  this.state.edit ? (
                    <Select style={{ width: 200, fontSize: '16px', marginBottom: 5 }} disabled={!edit}>
                      {jobOptins}
                    </Select>
                  ) : (
                    <p style={{ width: 200, marginBottom: 5 }}>{userInfo.job}</p>
                  )
                )}
              </FormItem>
              <FormItem label='个性签名'>
                {getFieldDecorator('title', {
                  initialValue: userInfo.title ? userInfo.title : null
                })(
                  this.state.edit ? (
                    <TextArea autoSize={{ minRows: 2, maxRows: 7 }} style={{ width: 300, fontSize: '16px' }} disabled={!edit} />
                  ) : (
                    <Tooltip placement='topLeft' title={userInfo.title}>
                      <p style={{ width: 200, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{userInfo.title}</p>
                    </Tooltip>
                  )
                )}
              </FormItem>
              <br />
              <FormItem>
                {this.state.edit ? (
                  <>
                    <Button style={{ marginLeft: 10 }} onClick={this.onCancel}>
                      取消
                    </Button>
                    <Button type='primary' style={{ marginLeft: 10 }} onClick={this.onHandelOK} loading={this.state.loading}>
                      保存
                    </Button>
                  </>
                ) : (
                  <Button type='primary' onClick={this.onEdit}>
                    修改
                  </Button>
                )}
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

const Appmain = Form.create()(App)

export default Appmain
