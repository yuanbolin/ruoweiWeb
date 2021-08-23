import React, { Component } from 'react'
import { Tag, Button, Icon, Radio, Select, Tooltip, Input, Popconfirm, notification, Table, message } from 'antd'
import style from './index.less'
import WorkDrawer from '@/pages/工作台/workDrawer'
import { utcToDateTime } from '@/utils/date'
import { paixuzuzhi } from '@/utils/common'
import { post, get, del, put } from '@/utils/http'

const { Search } = Input
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      workList: [],
      userList: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        current: 1,
        defaultPageSize: 10
      },
      loading: false,
      radioValue: '',
      neirong: '',
      source: [],
      sortField: '',
      sortOrder: '',
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
    let sort = paixuzuzhi(THE.state.sortField, THE.state.sortOrder)
    const { radioValue, neirong, source } = THE.state
    queryConditions.status = radioValue
    queryConditions.content = neirong
    queryConditions.source = THE.state.source
    queryConditions.sort = sort
    THE.setState({ loading: true, workList: [] })
    const newParams = { page, size, ...queryConditions }
    get(`taskWork/workList`, newParams).then(res => {
      const pagination = { ...THE.state.pagination }
      pagination.total = res.data.total
      pagination.pageSize = params.size
      THE.setState({
        loading: false,
        workList: res.data.content,
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

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState(
      {
        pagination: pager,
        source: filters.source,
        sortField: sorter.field,
        sortOrder: sorter.order
      },
      () => {
        this.fetch({
          size: pagination.pageSize,
          page: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters
        })
      }
    )
  }

  //radio切换
  onRadioChange = e => {
    const THE = this
    const pager = { ...THE.state.pagination }
    pager.current = 1
    THE.setState(
      {
        radioValue: e.target.value,
        pagination: pager
      },
      () => {
        THE.fetch({
          size: pager.pageSize,
          page: pager.current
        })
      }
    )
  }

  onSearch = value => {
    const THE = this
    const pager = { ...THE.state.pagination }
    pager.current = 1
    THE.setState(
      {
        neirong: value,
        pagination: pager
      },
      () => {
        THE.fetch({
          size: pager.pageSize,
          page: pager.current
        })
      }
    )
  }

  //删除
  delete = record => {
    const THE = this
    put(`transaction/deleteWork/${record.id}`).then(res => {
      notification.success({
        message: '删除成功',
        duration: 3
      })
      const pager = { ...THE.state.pagination }
      pager.current = 1
      THE.setState(
        {
          pagination: pager
        },
        () => {
          THE.fetch()
        }
      )
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

  render() {
    const { userList } = this.state
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
        sorter: true,
        align: 'center',
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
        title: '审批状态',
        align: 'center',
        dataIndex: 'status',
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
        align: 'center',
        dataIndex: 'createdTime',
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
        width: '25%',
        align: 'center',
        dataIndex: 'caozuo',
        render: (text, record) => {
          if (record.status === '待审批') {
            return (
              <span>
                <Button type='link' style={{ padding: 0 }} disabled>
                  <Icon type='edit' />
                  编辑
                </Button>
                <Popconfirm placement='top' title='确认要删除?' onConfirm={() => this.delete(record)} okText='确认' cancelText='取消'>
                  <Button type='link' style={{ color: 'rgba(212, 48, 48, 1)' }}>
                    <Icon type='delete' />
                    删除
                  </Button>
                </Popconfirm>
                <Button
                  type='link'
                  style={{ color: '#6395F9', padding: 0 }}
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
          if (record.status === '审批驳回') {
            return (
              <span>
                <Button
                  type='link'
                  style={{ color: '#20c7b6', padding: 0 }}
                  onClick={() => {
                    this.showDrawer(record.id, '编辑工作')
                  }}
                >
                  <Icon type='edit' />
                  编辑
                </Button>
                <Popconfirm placement='top' title='确认要删除?' onConfirm={() => this.delete(record)} okText='确认' cancelText='取消'>
                  <Button type='link' style={{ color: 'rgba(212, 48, 48, 1)' }}>
                    <Icon type='delete' />
                    删除
                  </Button>
                </Popconfirm>
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
          return (
            <span>
              <Button type='link' style={{ padding: 0 }} disabled>
                <Icon type='edit' />
                编辑
              </Button>
              <Button type='link' disabled>
                <Icon type='delete' />
                删除
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
    return (
      <div className={style.workList_wrap}>
        <div className={style.top_wrap}>
          <div className={style.top_title}>我的工作列表</div>
          <div className={style.top_search}>
            <Radio.Group defaultValue='' buttonStyle='solid' onChange={this.onRadioChange}>
              <Radio.Button value='待审批'>待审批</Radio.Button>
              <Radio.Button value='审批通过'>审批通过</Radio.Button>
              <Radio.Button value='审批驳回'>审批驳回</Radio.Button>
              <Radio.Button value=''>全部工作</Radio.Button>
            </Radio.Group>
            <div className={style.top_search_input}>
              <Search allowClear placeholder='请输入工作内容' style={{ width: 200 }} onSearch={value => this.onSearch(value)} enterButton />
            </div>
          </div>
        </div>
        <div className={style.main_wrap}>
          <Table
            columns={columns}
            rowKey={record => record.id}
            dataSource={this.state.workList}
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
