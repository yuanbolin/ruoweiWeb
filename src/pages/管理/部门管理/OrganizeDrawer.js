import React from 'react'
import { Input, Form, Button, Select, Drawer, message } from 'antd'
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
    // this.fetch()
    // this.getTask()
  }

  componentWillUpdate(nextProps, nextState) {
    let THE = this
    if (nextState.visible !== nextProps.visible) {
      THE.setState({
        visible: nextProps.visible,
        edit: nextProps.edit
      })
      THE.fetch()
      return true
    }
    return false
  }

  fetch = () => {
    // console.log(this.props)
    // get(`services/activiti/api/process-instances/${this.props.record.id}`).then(res => {
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

  onClose = p => {
    this.props && this.props.onClose(false)
  }

  onSubmit = params => {
    const { edit } = this.state
    this.props.form.validateFields((err, values) => {
      if (err) return false
      if (edit !== null) {
        const id = this.props.record.officeCode
        const newParams = { id, ...this.state.data, ...values }
        put('sys-offices', newParams).then(res => {
          message.success(`编辑成功`)
          this.props && this.props.onClose(false)
          this.props.fetch()

        })
      } else {
        const newParams = { ...values }
        post('sys-offices', newParams).then(res => {
          message.success(`新增成功`)
          this.props && this.props.onClose(false)
          this.props.fetch()
        })
      }
    })
  }

  render() {
    const FormItem = Form.Item
    const { getFieldDecorator } = this.props.form
    const { edit, visible, data } = this.state
    return (
      <div>
        <Drawer
          destroyOnClose
          title={edit === null ? '新增部门' : '编辑部门信息'}
          width={450}
          onClose={this.onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form hideRequiredMark>
            <Form.Item label='上级部门'>
              {getFieldDecorator(`parentCode`, { initialValue: data.parentCode === 'virtualHeadOffice' ? '' : data.parentCode })(
                <OrgTreeSelect mode='officeCode' style={{ width: 300 }} />
              )}
            </Form.Item>
            <Form.Item label='部门'>
              {getFieldDecorator('officeName', {
                rules: [{ required: true, message: '请输入部门名称' }]
              })(<Input placeholder='请输入部门名称' style={{ width: 300 }} />)}
            </Form.Item>
          </Form>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right'
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.onSubmit} type='primary'>
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
