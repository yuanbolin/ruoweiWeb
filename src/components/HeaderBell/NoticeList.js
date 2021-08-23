import React from 'react'
import { Avatar, List, Tabs, Badge } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import styles from './NoticeList.less'

const { TabPane } = Tabs

class NoticeList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.data) {
      return {
        data: nextProps.data
      }
    }
    return null
  }

  clearMsg = () => {
    let arr = []
    for (let item of this.tz) {
      arr.push(item.xiaoxibianhao)
    }
    this.props.clearMsg(arr)
  }

  clearDb = () => {
    let arr = []
    for (let item of this.db) {
      arr.push(item.xiaoxibianhao)
    }
    this.props.clearDb(arr)
  }

  onClickmor = () => {
    router.push(`/admin/xiaoxiList`)
  }

  toPage = item => {
    this.props.yiduMsg(item.xiaoxibianhao)
    const { xiaoxibiaoti, zidingyixiaoxi } = item
    switch (xiaoxibiaoti) {
      case '脱岗告警提醒':
        router.push(`/app/zhanbei/gangshaozhiban/tuogangguanli/list/zuzhilingdao_zhibanguanliyuanDetail/${zidingyixiaoxi.id}`)
        break
      case '要事日记签字提醒':
        router.push(`/app/gongzuozhixu/taizhangziliao/liangbenyiceyibiao/yaoshirijilist/detail/${zidingyixiaoxi.bianhao}`)
        break
      case '缺席提醒':
        router.push(`/app/zhanbei/gangshaozhiban/ligangguanli/list`)
        break
      case '周界入侵告警':
        router.push(`/app/gongzuozhixu/zongheanfang/zhoujieruqinjilu/list/detail/${zidingyixiaoxi.id}`)
        break
      case '访客':
        router.push(`/app/gongzuozhixu/fangkeguanli/list/detail/${zidingyixiaoxi.id}`)
        break
      case '库室申请':
        router.push(`/app/shenghuozhixu/kushiguanli/fangjianshiyongjilu/List`)
        break
      case '库室申请审批结果':
        router.push(`/app/shenghuozhixu/kushiguanli/fangjianshiyongjilu/List`)
        break
      case '公车使用':
        router.push(`/app/gongzuozhixu/yongchejilu/list/detail/${zidingyixiaoxi.id}`)
        break
      case '请销假':
        router.push(`/app/gongzuozhixu/qingxiaojiaguanli/list/detail/${zidingyixiaoxi.id}`)
        break
      default:
        break
    }
  }

  onClickmes = val => {
    this.props.yiduMsg(val.xiaoxibianhao)
  }

  render() {
    const { data } = this.state
    this.tz = []
    this.db = []
    for (let item of data) {
      item.shifoutiaozhuan ? this.db.push(item) : this.tz.push(item)
    }
    return (
      <div className={styles.header_bell_popover_box}>
        <Tabs defaultActiveKey='1'>
          <TabPane
            tab={
              <Badge dot={this.tz.length > 0}>
                <span>通知</span>
              </Badge>
            }
            // tab='通知'
            key='1'
          >
            <List
              className={styles.notice_list}
              dataSource={this.tz}
              renderItem={(item, i) => {
                return (
                  <List.Item
                    className={styles.notice_list_item}
                    key={item.key || i}
                    onClick={() => {
                      this.onClickmes(item)
                    }}
                  >
                    <List.Item.Meta
                      className={styles.notice_list_item_meta}
                      avatar={
                        <Avatar className={styles.notice_list_item_meta_avatar} size='large' style={{ verticalAlign: 'middle', backgroundColor: '#606D80' }}>
                          {item.xiaoxibiaoti}
                        </Avatar>
                      }
                      title={
                        <div className={styles.notice_list_item_meta_title}>
                          {item.xiaoxibiaoti}
                          <div className={styles.notice_list_item_meta_extra}>{item.xiaoxineirong}</div>
                        </div>
                      }
                      description={
                        <div>
                          <div className={styles.notice_list_item_meta_extra_description}>{item.xiaoxineirong}</div>
                          <div className={styles.notice_list_item_meta_extra_datetime}>{moment(item.chuangjianshijian).format('YYYY-MM-DD HH:mm:SS')}</div>
                        </div>
                      }
                    />
                  </List.Item>
                )
              }}
            />
            {this.tz.length > 0 ? (
              <div className={styles.notice_list_item_bottomBar}>
                <div className={styles.notice_list_item_bottomBar_div} onClick={this.clearMsg}>
                  清空
                </div>
                <div className={styles.notice_list_item_bottomBar_div} onClick={this.onClickmor}>
                  更多
                </div>
              </div>
            ) : null}
          </TabPane>
          <TabPane
            tab={
              <Badge dot={this.db.length > 0}>
                <span>待办</span>
              </Badge>
            }
            key='3'
          >
            <List
              className={styles.notice_list}
              dataSource={this.db}
              renderItem={(item, i) => {
                return (
                  <List.Item
                    className={styles.notice_list_item}
                    key={item.key || i}
                    onClick={() => {
                      this.toPage(item)
                    }}
                  >
                    <List.Item.Meta
                      className={styles.notice_list_item_met}
                      avatar={
                        <Avatar className={styles.notice_list_item_meta_avatar} size='large' style={{ verticalAlign: 'middle', backgroundColor: '#606D80' }}>
                          {item.xiaoxibiaoti}
                        </Avatar>
                      }
                      title={
                        <div className={styles.notice_list_item_meta_title}>
                          {item.xiaoxibiaoti}
                          <div className={styles.notice_list_item_meta_extra}>{item.xiaoxineirong}</div>
                        </div>
                      }
                      description={
                        <div>
                          <div className={styles.notice_list_item_meta_extra_description}>{item.xiaoxineirong}</div>
                          <div className={styles.notice_list_item_meta_extra_description_datetime}>
                            {moment(item.chuangjianshijian).format('YYYY-MM-DD HH:mm:SS')}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )
              }}
            />
            {this.db.length > 0 ? (
              <div className={styles.notice_list_item_bottomBar}>
                <div className={styles.notice_list_item_bottomBar_div} onClick={this.clearDb}>
                  清空
                </div>
                <div className={styles.notice_list_item_bottomBar_div} onClick={this.onClickmor}>
                  更多
                </div>
              </div>
            ) : null}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default NoticeList
