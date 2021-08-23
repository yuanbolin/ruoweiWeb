/**
 *
 * @author     ：苑博林
 * @date       ：2020/12/14 15:33
 * @creed      ：权限效验 不需要的在路由配置中加入AvoidToken:true
 * @version    ： 1.0
 */
import React from 'react'
import { Route, Redirect } from 'umi'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import routes from '../../config/router.config'

const Breadcrumbs = withBreadcrumbs(routes)(data => {
  let currentRoute = data.breadcrumbs[data.breadcrumbs.length - 1]
  let AvoidToken
  let AvoidRoutes = [] //常见不需要效验的路由数组
  if (!currentRoute.match || !currentRoute.match.path || !AvoidRoutes.includes(currentRoute.match.path)) {
    data.breadcrumbs.forEach(item => {
      //遍历路由数组,查询是否不需要权限
      if (item.AvoidToken) {
        AvoidToken = item.AvoidToken
      }
      //判断当前跳转路由是否为redirect重定向类型,如果是则不需要权限效验
      if (currentRoute.location && currentRoute.location.pathname && item.path == currentRoute.location.pathname && item.redirect) {
        AvoidToken = true
      }
    })
  } else {
    AvoidToken = true
  }
  if (AvoidToken) {
    return <React.Fragment>{data.children}</React.Fragment>
  }
  return (
    <React.Fragment>
      {sessionStorage.getItem('token') && sessionStorage.getItem('token') !== 'null' ? (
        data.children
      ) : (
        <Route
          render={() => {
            return <Redirect to='/login' />
          }}
        />
      )}
    </React.Fragment>
  )
})

export default Breadcrumbs
