import React from 'react'
import { Input, Form, Button, Select, Drawer, message, notification } from 'antd'
import { get, post, put } from '@/utils/http'
import OrgTreeSelect from '@/components/OrgTreeSelect'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      edit: null,
      data: {}
    }
  }

  componentDidMount() {
    if (this.pageType === 'edit') this.getDetail()
    this.props.form.setFieldsValue(this.props.record)
    /*this.fetch()
    this.getTask()*/
  }

  componentWillUpdate(nextProps, nextState) {
    let THE = this
    if (nextState.visible !== nextProps.visible) {
      THE.setState({
        visible: nextProps.visible,
        edit: nextProps.edit
      })
      // THE.fetch()
      return true
    }
    return false
  }

  fetch = () => {
    // get(`services/activiti/api/process-instances/${this.props.match.params.id}`).then(res => {
    //   this.setState({
    //     dataSource: res.data
    //   })
    // })
  }

  getDetail = () => {
    get(`sys-offices/${this.props.match.params.id}`).then(res => {
      this.setState({ data: res.data })
    })
  }

  onClose = () => {
    this.props && this.props.onClose(false)
  }

  onSubmit = params => {
    const { edit } = this.state
    this.props.form.validateFields((err, values) => {
      if (err) return false
      if (values.positionName.length > 128) return notification.error({ message: '字数应小于128个字' })
      this.setState({
        loading: true
      })

      if (edit !== null) {
        const id = this.props.record.id
        const positionCode = this.props.record.positionCode
        const newParams = { ...this.props.record, ...this.state.data, ...values }
        post('updatePosition', newParams)
          .then(res => {
            notification.success({ message: '修改成功' })
            this.setState({
              loading: false
            })
            this.props && this.props.onClose(false)
            this.props.fetch()
          })
          .catch(() => {
            this.setState({
              loading: false
            })
          })
      } else {
        const newParams = { ...values }
        post('addPosition', newParams)
          .then(res => {
            notification.success({ message: '新增成功' })
            this.setState({
              loading: false
            })
            this.props && this.props.onClose(false)
            this.props.fetch()
          })
          .catch(() => {
            this.setState({
              loading: false
            })
          })
      }
    })
  }

  render() {
    const FormItem = Form.Item
    const { getFieldDecorator } = this.props.form
    const { edit, visible, data } = this.state
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
          destroyOnClose
          title={edit === null ? '新增职位' : '编辑职位信息'}
          width={450}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form hideRequiredMark {...formItemLayout}>
            {/*<Form.Item label='上级部门'>*/}
            {/*  {getFieldDecorator(`officeCode`, { initialValue: data.parentCode === 'virtualHeadOffice' ? '' : data.parentCode })(*/}
            {/*    <OrgTreeSelect mode='officeCode' style={{ width: 300 }} />*/}
            {/*  )}*/}
            {/*</Form.Item>*/}
            <Form.Item label='职位'>
              {getFieldDecorator('positionName', {
                rules: [
                  {
                    required: true,
                    message: '请输入职位名称'
                  },
                  {
                    required: true,
                    message: '不能有特殊字符',
                    pattern: /^[^\s^!%_&',;=?$！@#￥%……&*（）~`·]*$/
                  }
                ]
              })(<Input placeholder='请输入职位名称' style={{ width: 300 }} />)}
            </Form.Item>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button loading={this.state.loading} onClick={this.onSubmit} type='primary'>
              提交
            </Button>
          </div>
        </Drawer>
      </div>
    )
  }
}
const Appmain = Form.create()(App)
export default Appmain
