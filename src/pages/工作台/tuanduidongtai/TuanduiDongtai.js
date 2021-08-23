import React, { Component } from 'react'
import { Table, Tooltip, Avatar } from 'antd'
import moment from 'moment'
import { get, post } from '@/utils/http'
import style from './TuanduiDongtai.less'

class TuanduiDongtai extends Component {
  state = {
    list: [],
    pagination: {
      showQuickJumper: true,
      current: 1,
      size: 'default',
      defaultPageSize: 5
    },
    loading: false,
    visible: false
  }

  componentDidMount() {
    this.fetch()
  }

  startOfFormat = time => {
    return moment(time).fromNow(true)
  }

  //验证json合法性
  isJsonString(str) {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  fetch = (
    params = {
      rows: this.state.pagination.pageSize,
      page: this.state.pagination.current
    }
  ) => {
    let page = params.page
    let size = params.rows === undefined ? 5 : params.rows
    this.setState({
      loading: true
    })
    post(`elasticsearch/searchES`, { page, size }).then(({ data }) => {
      let { data: arr, total } = data
      let list = []
      for (let i = 0; i < arr.length; i++) {
        if (this.isJsonString(arr[i].message)) {
          arr[i].message = JSON.parse(arr[i].message)
        } else {
          arr[i].message = {
            msg: '未知操作'
          }
        }
        if (arr[i].username.indexOf('&&&') > -1) {
          let strArr = arr[i].username.split('&&&')
          arr[i].username = strArr[0]
          arr[i].touxiang = strArr[1]
        } else {
          arr[i].touxiang = null
        }
        arr[i].createTime = this.startOfFormat(arr[i].createTime)
        arr[i].key = i + ''
        list.push(arr[i])
      }
      const pagination = { ...this.state.pagination }
      pagination.total = total
      this.setState(
        {
          list,
          pagination
        },
        () => {
          this.setState({
            loading: false
          })
        }
      )
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({ pagination })
    this.fetch({
      page: pager.current,
      ...filters
    })
  }

  //字体颜色
  setColor(msg) {
    let color = '#999'
    switch (msg) {
      case '登录到系统中':
        color = '#999'
        break
      case '编辑了一项工作':
        color = '#6877d0'
        break
      case '创建了一项事务型工作':
        color = '#2db7f5'
        break
      case '审批通过了一项事务型工作':
        color = '#87d068'
        break
      case '驳回了一项事务型工作':
        color = '#f50'
        break
      case '删除了一项事务型工作':
        color = '#ff0000'
        break
    }
    return color
  }

  render() {
    const columns = [
      {
        ellipsis: {
          showTitle: false
        },
        title: '团队动态',
        key: '团队动态',
        render: (text, record) => (
          <div className={`${style.flexRow} ${style.dongtaiItem}`}>
            {record.touxiang ? <Avatar src={`${window.server}/${record.touxiang}`} /> : <Avatar icon='user' />}
            <div className={style.content}>
              <div className={style.flexRow}>
                <div className={style.name}>{record.username}</div>
                <div className={`${style.text}`}>
                  <Tooltip title={record.message.msg}>
                    <div
                      className={`${style.oneline}  ${record.message.msg.length > 30 && style.ellipsis}`}
                      style={{ color: this.setColor(record.message.msg) }}
                    >
                      {record.message.msg}
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className={style.time}>{`${record.createTime}前`}</div>
            </div>
          </div>
        )
      }
    ]
    let { list, visible } = this.state
    return (
      <div className={style.container}>
        <Table columns={columns} dataSource={list} pagination={this.state.pagination} loading={this.state.loading} onChange={this.handleTableChange} />
      </div>
    )
  }
}

export default TuanduiDongtai
