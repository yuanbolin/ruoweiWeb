import React, { Component } from 'react'
import { Modal, Button, Icon, Radio, Select, Form, Tooltip, Input, Popconfirm, Table, message, notification } from 'antd'
import style from './index.less'
import { post, get } from '@/utils/http'
import WorkDrawer from '@/pages/工作台/workDrawer'
import { utcToDateTime } from '@/utils/date'
import { paixuzuzhi } from '@/utils/common'

const { TextArea } = Input
const { confirm } = Modal
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      approvedList: [],
      userList: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        current: 1,
        size: 'default',
        defaultPageSize: 10
      },
      loading: false,
      bohuiVisible: false,
      bohuiliyou: '',
      bohuiID: '',
      selectedRowKeys: [],
      selectedRows: [],
      isShow: false,
      id: '',
      mode: '工作详情'
    }
  }

  componentDidMount() {
    this.fetch()
    this.getUsers()
  }

  fetch = (params = { size: this.state.pagination.pageSize, page: this.state.pagination.current }) => {
    const THE = this
    let queryConditions = {}
    let page = params.page - 1
    let size = params.size === undefined ? 10 : params.size
    if (params.sortField === 'applicationTime') {
      // eslint-disable-next-line no-param-reassign
      params.sortField = 'createdTime'
    }
    let sort = paixuzuzhi(params.sortField, params.sortOrder)
    queryConditions.source = params.source
    queryConditions.sort = sort
    this.setState({ loading: true, approvedList: [] })
    const newParams = { page, size, ...queryConditions }
    get(`work-unapproved`, newParams).then(res => {
      const pagination = { ...THE.state.pagination }
      pagination.total = res.data.totalElements
      this.setState({
        loading: false,
        approvedList: res.data.content,
        pagination
      })
    })
  }

  //获取用户列表
  getUsers = () => {
    get('userManage/dropList').then(res => {
      this.setState({
        userList: res.data
      })
    })
  }

  //批量通过部分
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }

  unselected = () => {
    notification.warning({
      message: '请选择要通过的申请',
      duration: 3
    })
  }

  piliangtongguo = () => {
    const THE = this
    let selected = THE.state.selectedRows
    let workAgreeDTO = {}
    let ids = []
    if (selected.length === 0) {
      THE.unselected()
    } else {
      confirm({
        title: '提示',
        content: '确认通过所有选中审批申请?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          for (let i = 0; i < selected.length; i++) {
            ids.push(selected[i].id)
          }
          workAgreeDTO.ids = ids
          post(`work/agree`, workAgreeDTO).then(() => {
            notification.success({
              message: '批量通过成功',
              duration: 3
            })
            const pager = { ...THE.state.pagination }
            pager.current = 1
            THE.setState({ selectedRowKeys: [], selectedRows: [], pagination: pager }, () => {
              THE.fetch()
            })
          })
        },
        onCancel() {
          return false
        }
      })
    }
  }

  //单个通过
  tongguo = record => {
    const THE = this
    let workAgreeDTO = {}
    let ids = []
    ids.push(record.id)
    workAgreeDTO.ids = ids
    post(`work/agree`, workAgreeDTO).then(() => {
      notification.success({
        message: '申请已通过',
        duration: 3
      })
      const pager = { ...THE.state.pagination }
      pager.current = 1
      THE.setState({ pagination: pager, selectedRowKeys: [], selectedRows: [] }, () => {
        THE.fetch()
      })
    })
  }

  //驳回申请部分
  bohuiModal = record => {
    this.setState({
      bohuiVisible: true,
      // eslint-disable-next-line react/no-unused-state
      bohuiID: record.id
    })
  }

  onchangeTitle = e => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      bohuiliyou: e.target.value
    })
  }

  handleOk = e => {
    const THE = this
    let bohuiliyou = THE.state.bohuiliyou
    let bohuiID = THE.state.bohuiID
    let params = {
      id: bohuiID,
      reason: bohuiliyou
    }
    post(`work/reject`, params).then(() => {
      notification.success({
        message: '申请已驳回',
        duration: 3
      })
      const pager = { ...THE.state.pagination }
      pager.current = 1
      THE.setState({ bohuiVisible: false, bohuiliyou: '', bohuiID: '', pagination: pager, selectedRowKeys: [], selectedRows: [] }, () => {
        THE.fetch()
      })
    })
  }

  showDrawer = (id, mode) => {
    this.setState({
      isShow: true,
      id,
      mode
    })
  }

  closeDrawer = () => {
    this.setState({
      isShow: false
    })
  }

  handleCancel = e => {
    this.setState({
      bohuiVisible: false
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager,
      selectedRowKeys: [],
      selectedRows: []
    })
    console.log(sorter, filters)
    this.fetch({
      size: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    })
  }

  render() {
    const { selectedRowKeys, selectedRows, userList } = this.state
    const options = []
    options.push({
      text: '岗位职责',
      value: '岗位职责'
    })
    for (let i = 0; i < userList.length; i++) {
      options.push({
        text: userList[i].userName,
        value: userList[i].userName
      })
    }
    const columns = [
      {
        title: '工作人',
        dataIndex: 'applicant',
        ellipsis: true,
        width: '9%'
      },
      {
        title: '工作内容',
        dataIndex: 'content',
        ellipsis: true,
        width: '25%',
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
        align: 'center',
        sorter: true,
        width: '10%',
        render: (text, record) => {
          return <span>{text}小时</span>
        }
      },
      {
        title: '来源',
        dataIndex: 'source',
        align: 'center',
        filters: options,
        filterMultiple: false,
        width: '15%',
        render: (text, record) => {
          if (text === null) {
            return <span>岗位职责</span>
          }
          return <span>{text}</span>
        }
      },
      {
        title: '申请时间',
        align: 'center',
        dataIndex: 'applicationTime',
        sorter: true,
        width: '15%',
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
        width: '26%',
        render: (text, record) => {
          return (
            <span>
              <Popconfirm placement='top' title='确认要通过该申请?' onConfirm={() => this.tongguo(record)} okText='确认' cancelText='取消'>
                <Button type='link' style={{ color: '#20c7b6', padding: 0 }}>
                  <Icon type='check-circle' />
                  通过
                </Button>
              </Popconfirm>
              <Button type='link' onClick={() => this.bohuiModal(record)} style={{ color: 'rgba(212, 48, 48, 1)' }}>
                <Icon type='stop' />
                驳回
              </Button>
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
            </span>
          )
        }
      }
    ]
    const rowSelection = {
      selectedRowKeys,
      selectedRows,
      fixed: true,
      onChange: this.onSelectChange
    }
    return (
      <div className={style.approvedList_wrap}>
        <Modal title='驳回申请' destroyOnClose visible={this.state.bohuiVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <TextArea rows={4} placeholder='请输入理由' onChange={this.onchangeTitle} />
        </Modal>
        <div className={style.top_wrap}>
          <div className={style.top_title}>待审批工作</div>
          <div className={style.top_caozuo}>
            <Button onClick={this.piliangtongguo}>批量通过</Button>
          </div>
        </div>
        <div className={style.main_wrap}>
          <Table
            columns={columns}
            rowSelection={rowSelection}
            rowKey={record => record.id}
            dataSource={this.state.approvedList}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
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

export default Index
