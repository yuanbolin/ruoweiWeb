import React, { Component } from 'react'
import { Empty, Radio, Spin } from 'antd'
import moment from 'moment'
import styles from './index.less'
import { getTimeDistance } from '@/utils/utils'
import { get } from '@/utils/http'

// 所有成员排行
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flag: 0, //工时，任务数
      loading: false,
      rangePickerValue: getTimeDistance('month'),
      data: []
    }
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    this.setState({
      loading: true
    })
    let params = {
      flag: Number(this.state.flag),
      startDate: this.state.rangePickerValue.length > 0 ? moment(this.state.rangePickerValue[0]).format('YYYY-MM-DD') : '',
      endDate: this.state.rangePickerValue.length > 0 ? moment(this.state.rangePickerValue[1]).format('YYYY-MM-DD') : ''
    }
    get(`totalRanking`, params).then(res => {
      this.setState({
        data: res.data,
        loading: false
      })
    })
  }

  radioChange = e => {
    this.setState(
      {
        flag: e.target.value
      },
      () => {
        this.fetch()
      }
    )
  }

  selectDate = type => {
    this.setState(
      {
        rangePickerValue: type === 'total' ? [] : getTimeDistance(type)
      },
      () => {
        this.fetch()
      }
    )
  }

  render() {
    const { data } = this.state
    return (
      <div className={styles.paihang_div}>
        <div className={styles.header_div}>
          <Radio.Group defaultValue='0' buttonStyle='solid' onChange={this.radioChange}>
            <Radio.Button value='0'>工时 / 小时</Radio.Button>
            <Radio.Button value='1'>任务数</Radio.Button>
          </Radio.Group>
          <Radio.Group defaultValue='month' buttonStyle='solid'>
            <Radio.Button value='month' onClick={() => this.selectDate('month')}>
              月
            </Radio.Button>
            <Radio.Button value='year' onClick={() => this.selectDate('year')}>
              年
            </Radio.Button>
            <Radio.Button value='total' onClick={() => this.selectDate('total')}>
              总计
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles.title_div}>所有成员排行</div>
        <div className={styles.content_div}>
          <Spin spinning={this.state.loading} className={styles.loading} />
          {data.length > 0 ? (
            data.map((v, i) => {
              return (
                <div className={styles.content_item} key={i}>
                  <div className={`${styles.sort} ${v.rank > 3 && styles.sort2} ${v.rank > 99 && styles.sort3}`}>{v.rank}</div>
                  <div className={styles.name}>{v.name}</div>
                  <div className={styles.count}>{v.amount}</div>
                </div>
              )
            })
          ) : (
            <Empty description='暂无排名' image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 50 }} />
          )}
        </div>
      </div>
    )
  }
}

export default Index
