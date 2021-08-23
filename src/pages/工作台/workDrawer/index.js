import React, { Component, Fragment } from 'react'
import { Drawer, Button, Form, Steps, Input, Col, Row, InputNumber, Select, DatePicker, notification, Divider, Tag, Spin } from 'antd'
import moment from 'moment'
import { get, post, put } from '@/utils/http'
import styles from './index.less'

const { Step } = Steps
const { Option } = Select
const { RangePicker } = DatePicker

class WorkDrawer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      mode: '',
      data: {},
      id: '',
      user: [],
      tag: [],
      loading: false,
      selectLoading: false,
      tagLoading: false
    }
  }

  componentDidMount() {
    this.getUser()
    this.getTag()
    this.fetch()
  }

  static getDerivedStateFromProps(nextprops, preprops) {
    const { visible, mode, id } = nextprops
    let obj = {}
    if (visible !== preprops.visible) obj.visible = visible
    if (mode !== preprops.mode) obj.mode = mode
    if (id !== preprops.id) obj.id = id
    return obj || null
  }

  fetch = () => {
    if (this.state.mode !== '创建工作') {
      get(`taskDetail?taskId=${this.state.id}`).then(res => {
        res.data.startDate = moment(res.data.startDate).add(8, 'h')
        res.data.endDate = moment(res.data.endDate).add(8, 'h')
        res.data.time = [res.data.startDate, res.data.endDate]
        res.data.workperson = res.data.processList[0].name
        res.data.processList.forEach((item, index) => {
          // eslint-disable-next-line no-unused-expressions
          item.time = item.time ? moment(item.time).format('YYYY-MM-DD HH:mm:ss') : ''
          if (item.state.includes('通过')) {
            // eslint-disable-next-line no-param-reassign
            item.status = 'finish'
          }
          if (item.state.includes('驳回')) {
            // eslint-disable-next-line no-param-reassign
            item.status = 'error'
          }
        })
        if (this.state.mode === '编辑工作') {
          res.data.source = res.data.source === '岗位职责' ? '' : res.data.source
          res.data.approver = `${res.data.approver}-${res.data.shenpiren}`
          let tag = []
          for (let i of res.data.tag) {
            tag.push(i.id)
          }
          res.data.tag = tag
        }
        this.setState({
          data: res.data
        })
      })
    }
  }

  getUser = () => {
    this.setState({
      selectLoading: true
    })
    get('userManage/dropList').then(res => {
      res.data.forEach((item, index) => {
        if (item.loginCode === sessionStorage.getItem('login')) {
          res.data.splice(index, 1)
        }
      })
      this.setState({
        user: res.data,
        selectLoading: false
      })
    })
  }

  getTag = () => {
    this.setState({
      tagLoading: true
    })
    get('wlt').then(res => {
      this.setState({
        tag: res.data.data,
        tagLoading: false
      })
    })
  }

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false
      this.setState({ loading: true })
      let obj = {
        approver: values.approver.split('-')[0],
        content: values.content,
        endDate: moment(values.time[1])
          .hour(+8)
          .minute(0)
          .second(0)
          .toISOString(),
        id: '',
        manhour: values.manhour,
        source: values.source ? values.source.split('-')[1] : '岗位职责',
        startDate: moment(values.time[0])
          .hour(+8)
          .minute(0)
          .second(0)
          .toISOString(),
        tag: values.tag
      }
      if (this.state.mode === '创建工作') {
        post('work', obj).then(res => {
          notification.success({ message: '提交成功' })
          this.props.form.resetFields()
          this.props.close()
          this.setState({ loading: false })
        })
      } else if (this.state.mode === '编辑工作') {
        obj.id = this.state.id
        put('transaction/alterWork', obj).then(res => {
          notification.success({ message: '编辑成功' })
          this.props.close()
          this.setState({ loading: false })
        })
      }
    })
  }

  onchange = val => {
    this.props.form.setFieldsValue({ approver: val })
  }

  render() {
    const { data, mode, user, tag } = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    }
    const option =
      user &&
      user.map((item, index) => {
        return (
          <Option key={index} value={`${item.loginCode}-${item.userName}`}>
            {item.userName}
          </Option>
        )
      })
    const tagoption =
      tag &&
      tag.map((item, index) => {
        return (
          <Option key={index} value={item.id}>
            {item.name}
          </Option>
        )
      })
    const addobj = [
      {
        name: sessionStorage.getItem('name'),
        time: moment(new Date()).format('YYYY/MM/DD HH:mm:ss'),
        opinion: '',
        state: '创建'
      }
    ]
    const stepsobj = mode === '创建工作' ? addobj : data.processList
    const startDate = moment(data.startDate).format('YYYY-MM-DD')
    const endDate = moment(data.endDate).format('YYYY-MM-DD')
    return (
      <Drawer
        className={styles.drawer}
        title={this.state.mode}
        placement='right'
        closable
        width={720}
        onClose={() => {
          this.props.form.resetFields()
          this.props.close()
        }}
        visible={this.state.visible}
      >
        <div className={styles.drawer_div}>
          {this.state.mode !== '工作详情' && (
            <Form {...formItemLayout}>
              <Row style={{ height: '43vh' }}>
                <Col>
                  <Form.Item label='工作来源'>
                    {getFieldDecorator('source', {
                      initialValue: data.source ? data.source : undefined
                    })(
                      <Select
                        placeholder='不填为岗位职责'
                        showSearch
                        allowClear
                        notFoundContent={this.state.selectLoading ? <Spin size='small' /> : null}
                        onChange={this.onchange}
                      >
                        {option}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label='工作内容'>
                    {getFieldDecorator('content', {
                      initialValue: data.content ? data.content : undefined,
                      rules: [
                        {
                          required: true,
                          message: '请填写工作内容!'
                        },
                        {
                          min: 15,
                          message: '最小字数限制为15个字数'
                        },
                        {
                          whitespace: true,
                          message: '请输入内容!'
                        }
                      ]
                    })(<Input.TextArea placeholder='字数不少于15字' rows={4} />)}
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label='审批人'>
                    {getFieldDecorator('approver', {
                      initialValue: data.approver ? data.approver : undefined,
                      rules: [
                        {
                          required: true,
                          message: '请选择审批人!'
                        }
                      ]
                    })(
                      <Select showSearch allowClear notFoundContent={this.state.selectLoading ? <Spin size='small' /> : null}>
                        {option}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label='起止时间'>
                    {getFieldDecorator('time', {
                      initialValue: data.time ? data.time : [moment(new Date()), moment(new Date())],
                      rules: [
                        {
                          required: true,
                          message: '请选择时间!'
                        }
                      ]
                    })(<RangePicker width={450} format='YYYY-MM-DD' />)}
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label='工作时长'>
                    {getFieldDecorator('manhour', {
                      initialValue: data.manhour ? data.manhour : undefined,
                      rules: [
                        {
                          required: true,
                          message: '请填写工时!'
                        }
                      ]
                    })(<InputNumber step='0.1' min={0.5} max={9999} precision={1} style={{ marginRight: 10 }} />)}
                    小时
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label='工作类型'>
                    {getFieldDecorator('tag', {
                      initialValue: data.tag ? data.tag : undefined,
                      rules: [
                        {
                          required: true,
                          message: '请选择工作类型!'
                        }
                      ]
                    })(
                      <Select
                        placeholder='可选择多个工作类型'
                        showSearch
                        mode='multiple'
                        notFoundContent={this.state.tagLoading ? <Spin size='small' /> : null}
                      >
                        {tagoption}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col offset={10}>
                  <Form.Item>
                    <Button
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        this.props.form.resetFields()
                        this.props.close()
                      }}
                    >
                      取消
                    </Button>
                    <Button type='primary' onClick={this.submit} loading={this.state.loading}>
                      提交
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          )}
          {this.props.mode === '工作详情' && (
            <div style={{ margin: '0 100px', fontSize: 15 }}>
              <p style={{ marginBottom: 15 }}>
                <b style={{ marginRight: 20 }}>&#12288;工作人：</b>
                {data.workperson}
              </p>
              <p style={{ marginBottom: 15, display: 'flex', flexDirection: 'row' }}>
                <b style={{ marginRight: 20 }}>工作内容：</b>
                <div style={{ width: '75%' }}>{data.content}</div>
              </p>
              <p style={{ marginBottom: 15 }}>
                <b style={{ marginRight: 20 }}>工作来源：</b>
                {data.source}
              </p>
              <p style={{ marginBottom: 15 }}>
                <b style={{ marginRight: 20 }}>&#12288;审批人：</b>
                {data.shenpiren}
              </p>
              <p style={{ marginBottom: 15 }}>
                <b style={{ marginRight: 20 }}>起止时间：</b>
                {data.startDate && data.endDate && startDate === endDate ? startDate : `${startDate} 至 ${endDate}`}
              </p>
              <p style={{ marginBottom: 15 }}>
                <b style={{ marginRight: 20 }}>工作时长：</b>
                {data.manhour}小时
              </p>
              <p style={{ marginBottom: 20 }}>
                <b style={{ marginRight: 20 }}>工作类型：</b>
                {data.tag &&
                  data.tag.map((item, index) => {
                    return (
                      <Tag color='#00baad' key={index}>
                        {item.name}
                      </Tag>
                    )
                  })}
              </p>
            </div>
          )}
          <Divider orientation='left' style={{ fontSize: 18 }}>
            审批进度
          </Divider>
          <div className={styles.steps_div} style={{ height: mode === '工作详情' ? '50vh' : 'auto' }}>
            <Steps
              size='default'
              current={mode === '创建工作' ? 0 : stepsobj && stepsobj.length - 1}
              direction='vertical'
              style={{ marginBottom: 30, marginLeft: 85, width: '80%' }}
            >
              {stepsobj &&
                stepsobj.map((item, index) => {
                  return (
                    <Step
                      key={index}
                      title={item.state}
                      description={item.opinion}
                      subTitle={`${item.name} ${item.time}`}
                      status={item.status ? item.status : ''}
                    />
                  )
                })}
            </Steps>
          </div>
        </div>
      </Drawer>
    )
  }
}

const wapper = Form.create()(WorkDrawer)
export default wapper
