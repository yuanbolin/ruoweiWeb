import React from 'react'
import { Badge, Icon, Dropdown, message, notification } from 'antd'
import { Link, router } from 'umi'
import { get, post } from '@/utils/http'
import styles from './Index.less'
import NoticeList from './NoticeList'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      dataNum: null
    }
  }

  componentDidMount() {
    this.getNotices()
  }

  componentWillUnmount() {
    this.state.socket && this.state.socket.close()
  }

  openNotification = (e, val) => {
    notification.open({
      message: e,
      description: val,
      onClick: () => {}
    })
  }

  getNotices = () => {
    get(`xiaoxi/all?shifouyidu=false`).then(({ data }) => {
      this.setState({
        dataNum: data.length
      })
      get(`xiaoxi/current-login-user/page?shifouyidu=false&shifoutiaozhuan=true&page=0&size=10`).then(res => {
        res.data.content &&
          res.data.content.length > 0 &&
          res.data.content.map(item => {
            this.state.data.push(item)
          })
        this.setState({
          data: this.state.data
        })
        get(`xiaoxi/current-login-user/page?shifouyidu=false&shifoutiaozhuan=false&page=0&size=10`).then(response => {
          response.data.content &&
            response.data.content.length > 0 &&
            response.data.content.map(item => {
              this.state.data.push(item)
            })
          this.setState({
            data: this.state.data
          })
        })
      })
    })
  }

  clearMsg = list => {
    console.log(list)
    let data = {
      jieshouduanLeixing: 'WEB',
      xiaoxibianhaoList: list
    }
    post(`xiaoxi/yidu/batch`, data).then(() => {
      this.setState(
        {
          data: []
        },
        () => {
          this.getNotices()
        }
      )
    })
  }

  clearDb = list => {
    console.log(list)
    let data = {
      jieshouduanLeixing: 'WEB',
      xiaoxibianhaoList: list
    }
    post(`xiaoxi/yidu/batch`, data).then(() => {
      this.setState(
        {
          data: []
        },
        () => {
          this.getNotices()
        }
      )
    })
  }

  yiduMsg = e => {
    let datas = new FormData()
    datas.append('jieshouduanLeixing', 'WEB')
    post(`xiaoxi/yidu/${e}`, datas, {
      headers: { contentType: 'application/x-www-form-urlencoded;charset=UTF-8' }
    }).then(() => {
      this.setState(
        {
          data: []
        },
        () => {
          this.getNotices()
        }
      )
    })
  }

  render() {
    return (
      <Link to='/admin/xiaoxiList' className={styles.noticeButton} style={{ float: 'right', marginRight: 30 }}>
        <Dropdown overlay={<NoticeList data={this.state.data} propsUrl={this.props} clearMsg={this.clearMsg} clearDb={this.clearDb} yiduMsg={this.yiduMsg} />}>
          <Badge className='badge' count={this.state.dataNum}>
            <Icon type='bell' className='icon' style={{ color: this.props.color ? this.props.color : 'white' }} />
          </Badge>
        </Dropdown>
      </Link>
    )
  }
}
export default Index
