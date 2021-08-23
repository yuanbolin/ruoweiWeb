import { Button, Result } from 'antd'
import React from 'react'
import router from 'umi/router' // 这里应该使用 antd 的 404 result 组件，
// 但是还没发布，先来个简单的。

const NoFoundPage = () => (
  <Result
    status='404'
    title='404'
    subTitle='抱歉，你访问的页面不存在。'
    // extra={
    //   <Button type='primary' onClick={() => router.push('/app')}>
    //     Back Home
    //   </Button>
    // }
  />
)

export default NoFoundPage
