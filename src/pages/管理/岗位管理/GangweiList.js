/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react'
import { Form, Button, Divider, Icon, Input, Layout, Select, Table, Tag, Tooltip, notification, Modal } from 'antd'
import router from 'umi/router'
import { del, get, put } from '@/utils/http'
import TreeSideBar from '../../../components/TreeSideBar'
import styles from './Gangwei.less'
import UserDrawer from './GangweiDrawer'

const { Option } = Select
const { Sider, Content } = Layout
const { confirm } = Modal

class GangweiList extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      dataSource: [],
      loading: false,
      pagination: { current: 0, pageSize: this.PageSize },
      defaultExpandAllRows: false //默认展开全部行 配合tableKey 使用
    }
  }

  componentDidMount() {
    const initValForm = sessionStorage.getItem(`${this.props.match.url}-form`)
    const initValState = sessionStorage.getItem(`${this.props.match.url}-state`)
    if (initValForm) {
      this.props.form.setFieldsValue(JSON.parse(initValForm))
    }
    if (initValState) {
      this.setState({ ...JSON.parse(initValState) })
    } else {
      this.fetch()
    }
  }

  componentWillUnmount() {
    if (sessionStorage.getItem(`${this.props.match.url}-close`) === 'false') {
      sessionStorage.setItem(`${this.props.match.url}-form`, JSON.stringify(this.props.form.getFieldsValue()))
      sessionStorage.setItem(`${this.props.match.url}-state`, JSON.stringify(this.state))
    } else {
      sessionStorage.removeItem(`${this.props.match.url}-form`)
      sessionStorage.removeItem(`${this.props.match.url}-state`)
    }
  }

  expandRows = isExpand => {
    // 折叠
    this.setState(prevState => ({ defaultExpandAllRows: isExpand }))
  }

  fetch = (params = {}) => {
    let queryConditions = {}
    this.props.form.validateFields((err, values) => {
      if (!err) {
        queryConditions = values
      }
    })
    this.setState({ loading: true })
    const newParams = { page: 0, size: this.PageSize, ...params, ...queryConditions }
    get('getPositionList', newParams).then(res => {
      const { pagination } = this.state
      if (Object.keys(params).length === 0 && pagination.current !== 0) {
        pagination.current = 0
      }
      pagination.total = parseInt(res.headers['x-total-count'], 10)
      this.setState({
        loading: false,
        dataSource: res.data,
        pagination
      })
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current - 1
    this.setState({ pagination })
    this.fetch({
      page: pager.current,
      ...filters
    })
  }

  showDeleteConfirm = officeCode => {
    const that = this
    confirm({
      title: '信息',
      content: '删除岗位将一并删除所有下属子岗位和员工，确定吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        del(`sys-offices/${officeCode}`).then(res => {
          that.fetch()
          that.child.fetch()
          notification.success({ message: '删除成功' })
        })
      }
    })
  }

  tyConfirm = record => {
    const that = this
    confirm({
      title: '停用',
      content: '确认要停用该岗位吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const obj = Object.assign({}, record.sysOffice)
        obj.status = 'DISABLE'
        put('sys-offices', obj).then(res => {
          notification.success({
            message: '停用成功'
          })
          that.fetch()
          that.child.fetch()
        })
      }
    })
  }

  qyConfirm = record => {
    const that = this
    confirm({
      title: '启用',
      content: '确认要启用该岗位吗?',
      okText: '确认',
      okType: 'success',
      cancelText: '取消',
      onOk() {
        const obj = Object.assign({}, record.sysOffice)
        obj.status = 'NORMAL'
        put('sys-offices', obj).then(res => {
          notification.success({
            message: '启用成功'
          })
          that.fetch()
          that.child.fetch()
        })
      }
    })
  }

  onSelectTreeSideBar = val => {
    this.fetch({ officeId: val })
  }

  showModal = () => {
    this.setState({
      visible: true,
      edit: null
    })
  }

  editModal = () => {
    this.setState({
      visible: true,
      edit: true
    })
  }

  onClose = val => {
    this.setState({
      visible: val,
      edit: null
    })
  }

  render() {
    const { dataSource } = this.state
    const { getFieldDecorator } = this.props.form
    const columns = [
      {
        title: '岗位名称',
        dataIndex: 'positionName'
      },
      // {
      //   title: '状态',
      //   dataIndex: 'status',
      //   render: text => {
      //     if (text === true) return <Tag color='blue'>正常</Tag>
      //     if (text === false) return <Tag color='red'>停用</Tag>
      //   }
      // },
      {
        title: '操作',
        dataIndex: 'operator',
        render: (text, record) => {
          const bj_bt = (
            <Tooltip placement='top' title='编辑岗位'>
              <Button
                type='link'
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  this.record = record
                  this.editModal(record.officeCode)
                }}
              >
                <Icon type='edit' style={{ color: 'green' }} />
              </Button>
            </Tooltip>
          )
          const del_bt = (
            <Tooltip placement='top' title='删除岗位'>
              <Button
                type='link'
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  this.showDeleteConfirm(record.officeCode)
                }}
              >
                <Icon type='delete' style={{ color: 'red' }} />
              </Button>
            </Tooltip>
          )
          const ty_bt =
            record.status === 'NORMAL' ? (
              <Tooltip placement='top' title='停用'>
                <Button type='link' style={{ paddingLeft: 0 }} onClick={() => this.tyConfirm(record)}>
                  <Icon type='stop' style={{ color: 'red' }} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip placement='top' title='启用'>
                <Button type='link' style={{ paddingLeft: 0 }} onClick={() => this.qyConfirm(record)}>
                  <Icon type='check-circle' style={{ color: 'green' }} />
                </Button>
              </Tooltip>
            )
          return (
            <span>
              {bj_bt}
              {/*{ty_bt}*/}
              {del_bt}
            </span>
          )
        }
      }
    ]

    return (
      <div className={styles.container}>
        <div className={styles.shadowBox}>
          {/*<Layout>*/}
          {/*  <TreeSideBar*/}
          {/*    onSelect={this.onSelectTreeSideBar}*/}
          {/*    onfetch={ref => {*/}
          {/*      this.child = ref*/}
          {/*    }}*/}
          {/*    {...this.props}*/}
          {/*  />*/}
          <Content className={styles.contentbox}>
            <div className={styles.rightDiv}>
              <Form layout='inline'>
                <Button type='default' style={{ marginLeft: 8 }} onClick={this.showModal}>
                  新增
                </Button>
                <Divider dashed='true' />
              </Form>
              <UserDrawer record={this.record} visible={this.state.visible} edit={this.state.edit} onClose={this.onClose} />
              <Table
                key={this.state.defaultExpandAllRows}
                defaultExpandAllRows={this.state.defaultExpandAllRows}
                dataSource={dataSource}
                columns={columns}
                expandRowByClick
                rowKey={record => record.id}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
              />
            </div>
          </Content>
          {/*</Layout>*/}
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(GangweiList)
export default wapper
