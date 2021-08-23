import React, { Component } from 'react'
import { Avatar, Col, Row, Statistic, Tag, Tooltip } from 'antd'
import { get } from '@/utils/http'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      userRole: false,
      userPhoto: '',
      totalTime: 0,
      sort: 0,
      totalNum: 0,
      title: '',
      userPosition: ''
    }
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get('user/getUserHeader').then(res => {
      const { userName, userRole, userPhoto, totalTime, sort, totalNum, title, userPosition } = res.data
      console.log(userPhoto)
      this.setState({
        userName,
        userRole,
        userPhoto,
        userPosition,
        totalTime,
        sort,
        totalNum,
        title
      })
    })
  }

  render() {
    const { userName, userRole, userPhoto, userPosition, totalTime, sort, totalNum, title } = this.state
    return (
      <div>
        <Row gutter={16}>
          <Col style={{ paddingTop: 5 }} span={2} xl={3} xxl={2}>
            <Avatar src={window.server + '/' + userPhoto} style={{ float: 'right' }} size={80} />
          </Col>
          <Col span={15} xl={12} xxl={15}>
            <p style={{ fontSize: 20, color: 'rgba(56, 56, 56, 1)' }}>
              {userName} {userRole === '系统管理员' && <Tag color='cyan'>管理</Tag>}
            </p>
            <p style={{ width: '90%', fontSize: 14, color: 'rgba(166, 166, 166, 1)' }}>
              {userPosition && (
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{userPosition} |</span>
              )}{' '}
              <Tooltip
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}
                placement='topLeft'
                title={title}
              >
                <span style={{ width: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{title}</span>
              </Tooltip>
            </p>
          </Col>
          <Col style={{ paddingTop: 15 }} span={2} xl={3} xxl={2}>
            <Statistic
              title={
                <span style={{ fontSize: 14 }}>
                  累计工作/<span style={{ fontSize: 10 }}>件</span>
                </span>
              }
              value={totalNum}
            />
          </Col>
          <Col style={{ paddingTop: 15 }} span={2} xl={3} xxl={2}>
            <Statistic
              title={
                <span style={{ fontSize: 14 }}>
                  总工时/<span style={{ fontSize: 10 }}>小时</span>
                </span>
              }
              value={totalTime}
              precision={1}
            />
          </Col>
          <Col style={{ paddingTop: 15 }} span={3} xl={3} xxl={2}>
            <Statistic
              title={
                <span style={{ fontSize: 14 }}>
                  团队内排名<span style={{ fontSize: 10 }}>(工时)</span>
                </span>
              }
              value={sort}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Index
