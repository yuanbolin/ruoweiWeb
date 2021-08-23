/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react'
import { Button, Col, Divider, Input, Row, Select, Form, message } from 'antd'
import router from 'umi/router'
import { connect } from 'dva'
import { get, post, put } from '@/utils/http'
import styles from './Organize.less'
import OrgTreeSelect from '@/components/OrgTreeSelect'

const { Option } = Select
const { TextArea } = Input

class OrganizeAdd extends Component {
  constructor(props) {
    super(props)
    this.pageType = this.props.match.params.id ? 'edit' : 'add' // 判断页面是编辑还是新增
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    if (this.pageType === 'edit') this.getDetail()
  }

  getDetail = () => {
    get(`sys-offices/${this.props.match.params.id}`).then(res => {
      this.setState({ data: res.data })
    })
  }

  handleClose = () => {
    this.props.dispatch({
      type: 'routerTabs/closePage',
      payload: { closePath: this.props.location.pathname }
    })
    router.goBack()
  }

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false
      if (this.pageType === 'edit') {
        const id = this.props.match.params.id
        const newParams = { id, ...this.state.data, ...values }
        put('sys-offices', newParams).then(res => {
          message.success(`编辑成功`)
          this.handleClose()
        })
      } else {
        const newParams = { ...values }
        post('sys-offices', newParams).then(res => {
          message.success(`新增成功`)
          this.handleClose()
        })
      }
    })
  }

  render() {
    const { data } = this.state
    const sysOffice = data.sysOffice ? data.sysOffice : {}
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    }
    return (
      <div className={styles.container}>
        <div className={styles.shadowBox}>
          <div className={styles.contentbox}>
            {/* <div className={styles.header}> */}
            {/*  <span className={styles.tit}>{this.state.title}机构</span> */}
            {/* </div> */}
            <div className={styles.middle}>
              <Button className={styles.addtit} type='link'>
                基本信息
              </Button>
              <Divider />
              <Form {...formItemLayout}>
                <Row>
                  <Col span={10} offset={1}>
                    <Form.Item label='上级机构'>
                      {getFieldDecorator(`parentCode`, { initialValue: data.parentCode === 'virtualHeadOffice' ? '' : data.parentCode })(
                        <OrgTreeSelect mode='officeCode' />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item label='机构名称'>
                      {getFieldDecorator('officeName', {
                        rules: [
                          {
                            required: true,
                            message: '必填!'
                          }
                        ],
                        initialValue: data.officeName
                      })(<Input allowClear />)}
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />
                <Button type='primary' style={{ marginLeft: 200 }} onClick={this.submit}>
                  保存
                </Button>
                <Button type='primary' style={{ marginLeft: 200 }} onClick={() => router.goBack()}>
                  返回
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default connect()(Form.create()(OrganizeAdd))
