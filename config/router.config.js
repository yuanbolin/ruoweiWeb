export default [
  // user  有name 属性 可以有tab页
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: './login/index'
  },
  {
    path: '/main',
    component: '../layouts/NewLayout',
    // AvoidToken: true, //不进行路由权限效验
    routes: [
      {
        path: '/main',
        redirect: '/main/index'
      },
      {
        path: '/main/index',
        name: '欢迎使用!',
        icon: 'appstore',
        component: './welcome/index',
        hideMenu: true
      },
      {
        path: '/main/share',
        name: '技术分享',
        icon: 'appstore',
        // Routes: ['./src/pages/login/privateRoute'],
        routes: [
          {
            path: '/main/share/peculiarity',
            name: '父子组件传值',
            icon: 'calendar',
            component: './分享/特性练习/peculiarity'
          },
          {
            path: '/main/share/Amap',
            name: '高德地图',
            icon: 'calendar',
            component: './分享/高德地图/map'
          },
          {
            path: '/main/share/echartsDemo',
            name: 'Echarts图表',
            icon: 'calendar',
            component: './分享/Echarts/echartsDemo'
          },
          ]
      },
      {component: '404', name: '404', path: '/main/*'}
    ]
  },
  {
    component: '404'
  }
]
