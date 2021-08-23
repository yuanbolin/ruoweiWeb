import React, { Component } from 'react'
import { Button, Form, Icon, Row, Col, Avatar, Tag, Statistic } from 'antd'
import { get, post } from '@/utils/http'
import PaiHang from './paihang/index'
import WorkList from './workList/index'
import ApprovedList from './approved/index'
import style from './index.less'
import TuanduiDongtai from './tuanduidongtai/TuanduiDongtai'
import Header from './header'

class Login extends Component {
  state = { loading: false }

  componentDidMount() {}

  render() {
    const { userName, userPower, userPhoto, totaltime, sort, totalnum, department } = this.state
    return (
      <div className={style.container}>
        {/*请使用flex弹性布局,考虑最小宽度1200px的适应效果*/}
        <div className={style.shadowBox} style={{ padding: '20px 0 ' }}>
          <Header />
        </div>
        <div className={style.shadowBox}>
          <WorkList />
        </div>
        <div className={style.shadowBox}>
          <ApprovedList />
        </div>
        <div className={`${style.row} ${style.tableBox}`}>
          {/*排行固态宽度,动态自动伸缩*/}
          <div className={style.tableCell}>
            <div className={`${style.shadowBox} ${style.dongtaiBox}`}>
              <TuanduiDongtai />
            </div>
          </div>
          <div className={style.tableCell} style={{ width: '517px' }}>
            <div className={`${style.shadowBox} ${style.paihangBox}`}>
              <PaiHang />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const WrappedNormalLoginForm = Form.create()(Login)
export default WrappedNormalLoginForm
