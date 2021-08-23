import React from 'react'
import { Divider, Form, Button, Table, notification, Popconfirm, Tag, Icon } from 'antd'
import { get, post, put } from '@/utils/http'
import styles from '../index.less'
import UserDrawer from './userDrawer'

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
      visible: false,
      edit: null,
      info: {}
    }
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = (params = { rows: this.state.pagination.pageSize, page: this.state.pagination.current }) => {
    let THE = this
    let page = params.page - 1
    let size = params.rows === undefined ? 10 : params.rows
    get(`userManage/getUserList?page=${page}&size=${size}`).then(res => {
      const pagination = { ...THE.state.pagination }
      pagination.total = res.headers['x-total-count']
      this.setState({
        dataSource: res.data.content,
        pagination
      })
    })
  }

  handleTableChange = pagination => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    })
    this.fetch({
      rows: pagination.pageSize,
      page: pagination.current
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
      edit: null,
      info: {}
    })
  }

  editModal = (id, val) => {
    this.setState({
      visible: true,
      edit: id,
      info: val
    })
  }

  onClose = val => {
    this.setState({
      visible: val,
      edit: null,
      info: {}
    })
    this.fetch()
  }

  confirm = e => {
    put(`userManage/deleteUser/${e}`).then(res => {
      notification.success({ message: '删除成功' })
      this.fetch()
    })
  }

  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'userName',
        width: '25%'
      },
      {
        title: '账号',
        dataIndex: 'loginCode',
        width: '25%'
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        width: '25%',
        render: text => {
          if (text === '系统管理员') {
            return <Tag color='cyan'>系统管理员</Tag>
          } else if (text === '普通用户') {
            return <Tag>普通用户</Tag>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'caozuo',
        render: (text, record) => (
          <span>
            <Button type='link' style={{ padding: 0 }} onClick={() => this.editModal(record.id, record)}>
              <Icon type='edit' />
              编辑
            </Button>
            <Divider type='vertical' />
            <Popconfirm title='确定删除该成员信息吗?' onConfirm={() => this.confirm(record.id)} okText='确定' cancelText='取消'>
              <Button type='link' style={{ padding: 0, color: '#d43030' }}>
                <Icon type='delete' />
                删除
              </Button>
            </Popconfirm>
          </span>
        )
      }
    ]
    const { dataSource } = this.state
    return (
      <div className={styles.container}>
        <div className={styles.shadowBox}>
          <h3>成员管理</h3>
          <Divider />
          <Button type='primary' onClick={this.showModal}>
            新增
          </Button>
          <UserDrawer visible={this.state.visible} edit={this.state.edit} info={this.state.info} onClose={this.onClose} />
          <Table columns={columns} dataSource={dataSource} pagination={this.state.pagination} onChange={this.handleTableChange} rowKey={record => record.id} />
        </div>
      </div>
    )
  }
}
const Appmain = Form.create()(App)
export default Appmain
