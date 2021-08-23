/*
 * @author: 姜潘潘
 * @Datetime  2020/10/30 9:34
 */

import React, { Component } from 'react'
import styles from '@/pages/welcome/系统管理/组织管理/Company.less'
import EditPassword from '@/components/Userinfo/editPassword'

class ZhangHaoManage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <div className={styles.contentbox}>
          <div className={styles.rightDiv}>
            <EditPassword />
          </div>
        </div>
      </div>
    )
  }
}

export default ZhangHaoManage
