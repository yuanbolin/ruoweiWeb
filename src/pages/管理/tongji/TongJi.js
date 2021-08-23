import React, { Component } from 'react'
import { Divider, Radio, DatePicker, Spin } from 'antd'
import styles from './TongJi.less'
import { getTimeDistance } from '@/utils/utils'
import { DemoPie, ShenPiColumn, SourceColumn } from '@/pages/管理/tongji/charts'
import { get } from '@/utils/http'
import { dateToUTC, dateToUTCForstart } from '@/utils/date'

const { RangePicker } = DatePicker

class TongJi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      flag: 0,
      rangePickerValue: getTimeDistance('month'),
      rangePickerValueSp: getTimeDistance('month'),
      rangePickerValueSource: getTimeDistance('month'),
      pieData: [],
      sourceData: [],
      shenpiData: [],
      loadingLx: false,
      loadingLy: false,
      loadingSp: false
    }
  }

  componentDidMount() {
    this.getPie()
    this.getShenPi()
    this.getSource()
  }

  // 工作类型统计
  getPie = () => {
    this.setState({
      loadingLx: true
    })
    let params = {
      flag: Number(this.state.flag),
      startDate: this.state.rangePickerValue.length > 0 ? dateToUTCForstart(this.state.rangePickerValue[0]) : '',
      endDate: this.state.rangePickerValue.length > 0 ? dateToUTC(this.state.rangePickerValue[1]) : ''
    }
    get(`workType-total`, params).then(res => {
      this.setState({
        pieData: res.data,
        loadingLx: false
      })
    })
  }

  // 审批统计
  getShenPi = () => {
    this.setState({
      loadingSp: true
    })
    let params = {
      startDate: this.state.rangePickerValueSp.length > 0 ? dateToUTCForstart(this.state.rangePickerValueSp[0]) : '',
      endDate: this.state.rangePickerValueSp.length > 0 ? dateToUTC(this.state.rangePickerValueSp[1]) : ''
    }
    get(`workApprove-total`, params).then(res => {
      this.setState({
        shenpiData: res.data,
        loadingSp: false
      })
    })
  }

  // 来源统计
  getSource = () => {
    this.setState({
      loadingLy: true
    })
    let params = {
      startDate: this.state.rangePickerValueSource.length > 0 ? dateToUTCForstart(this.state.rangePickerValueSource[0]) : '',
      endDate: this.state.rangePickerValueSource.length > 0 ? dateToUTC(this.state.rangePickerValueSource[1]) : ''
    }
    get(`workSource-total`, params).then(res => {
      this.setState({
        sourceData: res.data,
        loadingLy: false
      })
    })
  }

  radioChange = e => {
    this.setState(
      {
        flag: e.target.value
      },
      () => {
        this.getPie()
      }
    )
  }

  // 工作类型统计时间段
  handleRangePickerChange = rangePickerValue => {
    this.setState(
      {
        rangePickerValue
      },
      () => {
        this.getPie()
      }
    )
  }

  // 审批时间段
  handleRangePickerChangeSp = rangePickerValue => {
    this.setState(
      {
        rangePickerValueSp: rangePickerValue
      },
      () => {
        this.getShenPi()
      }
    )
  }

  // 工作来源统计时间段
  handleRangePickerChangeSource = rangePickerValue => {
    this.setState(
      {
        rangePickerValueSource: rangePickerValue
      },
      () => {
        this.getSource()
      }
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.shadowBox} style={{ width: '50%', position: 'relative' }}>
            <Spin spinning={this.state.loadingLx} style={{ position: 'absolute', left: '50%', top: '30%' }} />
            <h3>工作类型统计</h3>
            <Divider />
            <div className={styles.headerBox}>
              <Radio.Group defaultValue='0' buttonStyle='solid' onChange={this.radioChange}>
                <Radio.Button value='0'>工时 / 小时</Radio.Button>
                <Radio.Button value='1'>任务数</Radio.Button>
              </Radio.Group>
              <RangePicker format='YYYY-MM-DD' onChange={this.handleRangePickerChange} value={this.state.rangePickerValue} allowClear />
            </div>
            <DemoPie data={this.state.pieData} key={this.state.pieData} />
          </div>
          <div style={{ width: 20 }} />
          <div className={styles.shadowBox} style={{ width: '50%', position: 'relative' }}>
            <Spin spinning={this.state.loadingSp} style={{ position: 'absolute', left: '50%', top: '30%' }} />
            <h3>审批统计</h3>
            <Divider />
            <div className={styles.headerBox} style={{ justifyContent: 'flex-end' }}>
              <RangePicker format='YYYY-MM-DD' onChange={this.handleRangePickerChangeSp} value={this.state.rangePickerValueSp} allowClear />
            </div>
            <ShenPiColumn data={this.state.shenpiData} key={this.state.shenpiData} />
          </div>
        </div>
        <div className={styles.shadowBox} style={{ width: '100%', position: 'relative' }}>
          <Spin spinning={this.state.loadingLy} style={{ position: 'absolute', left: '50%', top: '30%' }} />
          <h3>工作来源统计</h3>
          <Divider />
          <div className={styles.headerBox} style={{ justifyContent: 'flex-end' }}>
            <RangePicker format='YYYY-MM-DD' onChange={this.handleRangePickerChangeSource} value={this.state.rangePickerValueSource} allowClear />
          </div>
          <SourceColumn data={this.state.sourceData} key={this.state.sourceData} />
        </div>
      </div>
    )
  }
}

export default TongJi
