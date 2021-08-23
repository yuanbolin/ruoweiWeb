import React from 'react'
import { Icon, Input, Form, Button, Table, Select, DatePicker, Divider, Tooltip, Tag } from 'antd'
import { get, post } from '@/utils/http'
import { utcToDateTime } from '@/utils/date'
import WorkDrawer from '@/pages/工作台/workDrawer'
import { paixuzuzhi } from '@/utils/common'
import styles from '../index.less'

const { RangePicker } = DatePicker
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        // showQuickJumper: true,
        showSizeChanger: true,
        current: 1,
        size: 'default',
        defaultPageSize: 10,
        pageSizeOptions: ['10', '20', '30', '40']
      },
      dataSource: [],
      userList: [],
      isShow: false,
      id: '',
      mode: '工作详情'
    }
  }

  componentDidMount() {
    this.fetch()
    this.getUser()
  }

  fetch = (params = { rows: this.state.pagination.pageSize, page: this.state.pagination.current }) => {
    let THE = this
    let form = this.props.form
    let name = form.getFieldValue('name') === undefined ? '' : form.getFieldValue('name')
    let source = form.getFieldValue('source') === undefined ? '' : form.getFieldValue('source')
    let applytime = form.getFieldValue('applytime')
    let startDate = applytime === undefined || applytime.length === 0 ? '' : applytime[0].format('YYYY-MM-DD')
    let endDate = applytime === undefined || applytime.length === 0 ? '' : applytime[1].format('YYYY-MM-DD')
    let page = params.page - 1
    let size = params.rows === undefined ? 10 : params.rows
    let sort = paixuzuzhi(params.sortField, params.sortOrder)
    get(`taskList?page=${page}&size=${size}&name=${name}&source=${source}&startDate=${startDate}&endDate=${endDate}&sort=${sort}`).then(res => {
      const pagination = { ...THE.state.pagination }
      pagination.total = res.headers['x-total-count']
      this.setState({
        dataSource: res.data,
        pagination
      })
    })
  }

  getUser = () => {
    get(`userManage/getUserList?page=0&size=200`).then(res => {
      this.setState({
        userList: res.data.content
      })
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    this.fetch({
      rows: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order
    })
  }

  onChange = (date, dateString) => {
    console.log(date, dateString)
  }

  showDrawer = (id, mode) => {
    this.setState({
      isShow: true,
      id,
      mode
    })
  }

  closeDrawer = () => {
    const pager = { ...this.state.pagination }
    pager.current = 1
    this.setState(
      {
        isShow: false,
        id: '',
        mode: '',
        pagination: pager
      },
      () => {
        this.fetch()
      }
    )
  }

  search = () => {
    const pager = { ...this.state.pagination }
    pager.current = 1
    this.setState({
      pagination: pager
    })
    this.fetch({
      rows: pager.pageSize,
      page: pager.current
    })
  }

  render() {
    const FormItem = Form.Item
    const columns = [
      {
        title: '工作人',
        dataIndex: 'createdBy',
        width: '10%'
      },
      {
        title: '工作内容',
        dataIndex: 'content',
        width: '30%',
        ellipsis: true,
        render: (text, record) => {
          return (
            <Tooltip placement='topLeft' title={text}>
              <span>{text}</span>
            </Tooltip>
          )
        }
      },
      {
        title: '工作时长',
        dataIndex: 'manhour',
        sorter: true,
        align: 'center',
        width: '10%'
      },
      {
        title: '来源',
        dataIndex: 'source',
        align: 'center',
        width: '10%'
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        width: '10%',
        render: (text, record) => {
          if (text === '审批驳回') {
            return <Tag color='red'>{text}</Tag>
          }
          if (text === '审批通过') {
            return <Tag color='green'>{text}</Tag>
          }
          return <Tag color='blue'>{text}</Tag>
        }
      },
      {
        title: '申请时间',
        dataIndex: 'createdTime',
        width: '15%',
        align: 'center',
        render: (text, record) => {
          if (text === null) {
            return <span />
          }
          return <span>{utcToDateTime(text)}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'caozuo',
        align: 'center',
        render: (text, record) => {
          return (
            <Button
              type='link'
              style={{ padding: 0, color: '#6395F9' }}
              onClick={() => {
                this.showDrawer(record.id, '工作详情')
              }}
            >
              <Icon type='book' />
              详情
            </Button>
          )
        }
      }
    ]
    const { getFieldDecorator } = this.props.form
    const { dataSource } = this.state
    const userOptins =
      this.state.userList &&
      this.state.userList.map(item => {
        return (
          <Select.Option value={item.userName} key={item.id}>
            {item.userName}
          </Select.Option>
        )
      })
    return (
      <div className={styles.container}>
        <div className={styles.shadowBox}>
          <h3>工作管理</h3>
          <Divider />
          <Form onSubmit={this.handleSubmit} layout='inline' style={{ margin: 5 }}>
            <FormItem label='工作人'>{getFieldDecorator('name')(<Input allowClear style={{ width: 200 }} />)}</FormItem>
            <FormItem label='来源'>
              {getFieldDecorator('source')(
                <Select style={{ width: 200 }} allowClear>
                  <Select.Option value='岗位职责'>岗位职责</Select.Option>
                  {userOptins}
                </Select>
              )}
            </FormItem>
            <FormItem label='申请时间'>{getFieldDecorator('applytime')(<RangePicker onChange={this.onChange} />)}</FormItem>
            <FormItem>
              <Button type='primary' onClick={this.search}>
                <Icon type='search' />
                查询
              </Button>
            </FormItem>
          </Form>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
            rowKey={record => record.id}
            // scroll={{ y: 'calc(100vh - 370px)', x: true }}
          />
        </div>
        {this.state.isShow ? (
          <WorkDrawer key={this.state.id} visible={this.state.isShow} close={this.closeDrawer} mode={this.state.mode} id={this.state.id} />
        ) : (
          ''
        )}
      </div>
    )
  }
}
const Appmain = Form.create()(App)
export default Appmain
