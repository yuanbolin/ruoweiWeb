# [若维事务工作管理系统](http://192.168.1.162:6103/static/index.html#/login)

> 事务型工作内容主要指上级安排的一切非项目任务清单内的工作，包括有计划目标的学习任务、会议、培训、项目前期客户沟通、整理报价清单、售后维护等
>> 本项目基于[UMI2.7.7],在umi项目配置的基础上增加了一些常用的组件和样式，减少手动编写PC后台管理系统整体模板,主题样式板等一系列繁琐的工作,可直接通过配置项修改项目主题版块.

## 项目整体目录介绍
```
    ├── dist/                       # 默认的 build 输出目录  
    ├── mock/                       # mock 文件所在目录，基于 express
    ├── config/                     # 项目配置文件所在目录
    ├── public/                     # 项目静态资源所在目录
    ├── src/                        # 源码目录
        ├── assets/                 # 静态资源存放目录，如项目所用图片等
        ├── components/             # 全局公用组件
        ├── layouts/                # 全局布局
        ├── models/                 # 
        ├── pages/                  # 页面目录，里面的文件即路由
            ├── .umi/                  # dev 临时文件目录，比如入口文件、路由等，都会被临时生成到这里。不要提交.umi目录到git仓库，它们会在umi dev和umi build时被删除并重新生成
            ├── document.ejs           # 项目HTML 模板
            ├── 404.js                 # 404 页面
            └── Authorized.js          # 权限效验文件                     
        ├── utils/                  # 全局公用方法
        ├── global.less             # 约定的全局样式文件
        ├── app.js                  # 运行时配置文件
    ├── .env                        # 环境变量，例如修改端口号PORT=8001
    ├── .gitignore                  # 避免将不必要的代码提交到 git 仓库中
    └── package.json  
```

## 初始准备

#### 1.修改项目基础配置

```js
  //config/setting.js中项目配置
export default {
  //项目配置
  title: '若维事务工作管理系统', //项目名称
  primaryColor: '#00baad', //项目主题颜色
  layout: 'top' //layout风格
}
```

#### 2.更换项目图标

* 替换public/favicon.ico文件
* 替换src/assrts/logo.png文件

#### 3.路由配置

```js
{
    path: '/login',
    component: './login/index'
}
```

#### 4.更改服务器地址

环境运行命令:


命令详情可查看package.json,打包后项目生成至dist文件夹下

<kbd>yarn start </kbd>   **运行开发环境**

<kbd>yarn  build:p </kbd>   **打包正式环境**

<kbd>yarn  build: t </kbd>   **打包测试环境**

<kbd>yarn  build: d </kbd>  **打包开发环境**


## 项目配置参数文件:config/setting.js

配置布局,颜色,主题,标题,图标 详情请查看defaultSetting.js文件

### 参数说明<font color=#C39178 size=2>（高亮属性表示该属性必填）</font>

| 属性           | 类型   | 缺省值  | 取值  | 描述  | 范畴  |
| ------------- |:------:|:------:|:-----:|:-----:|:-----:|
| `title`      | String | 无     |项目名称|项目名|umi-plugin-react|
| primaryColor| String| '#1890ff'  |颜色|主题色|UmiJS.theme|
| linkColor  | String | '#1890ff'   |颜色 |超链接色|UmiJS.theme|
| successColor  | String | '#52c41a' |颜色 |成功色|UmiJS.theme|
| warningColor  | String | '#faad14'   |颜色 |警告色|UmiJS.theme|
| errorColor  | String | '#f5222d'   |颜色 |错误色|UmiJS.theme|
| disabledColor  | String | 'rgba(0, 0, 0, .25)'   |颜色 |失效色|UmiJS.theme|
| fontSizeBase  | String | '14px'   |单位为px |主字号|UmiJS.theme|
| textColor  | String | 'rgba(0, 0, 0, 0.65)'   |颜色 |主文本色|UmiJS.theme|
| componentBackground  | String | '#fff'   |颜色 |背景色|UmiJS.theme|
| navTheme  | String | 'light'   |'light','dark' |layout黑白主题|自定义|
| logo  | require(文件路径) | require('@/assets/logo.png')   |图片文件路径|项目图标文件|自定义|
| layout  | String | 'side'   | 'top','mix','side'|项目图标文件|自定义|
| collapsible  | Boolean | true   | true,false|左侧栏是否可被收缩|antd.sider.collapsible|
| fixSiderbar  | Boolean | true   | true,false|是否固定左侧栏 当layout: 'side'时固定|自定义|
| defaultCollapsed  | Boolean | true   | true,false|左侧栏是否默认收起 当layout: 'side'时不收起|antd.sider.defaultCollapsed|
| siderWidth  | Number | 226   | 始终在屏幕内|左侧菜单栏宽度,高度自适应|自定义|
| headerHeight  | Number | 56   | 始终在屏幕内|头部Header高度,宽度自适应|自定义|
| menuMode  | String | 'inline'   | 'inline','horizontal'|左侧菜单栏风格|antd.menu.mode|
| headerRender  | Boolean | true  | true,false|是否显示头部Header|自定义|
| menuRender  | Boolean | true  | true,false|是否显示左侧菜单栏|自定义|
| BreadcrumbsRender  | Boolean | true  | true,false|是否显示面包屑|自定义|
| contentWidth  | Boolean,String | false  | false,单位为px的字符串值为始终在屏幕内|是否定死content区域的宽度,不定死为false,需要定死如:'1200px'|自定义|
| minWidth  |  Boolean,String | '1200px'  | false,单位为px的字符串值为始终在屏幕内|最小宽度,页面宽度缩小到指定值时使用滚动条,不定死为false,需要定死如:'1200px'|自定义|

`技术分享`

其中siderWidth,headerHeight 使用到 [Less.js Plugin Object功能](https://less.bootcss.com/features/#plugin-at-rules-pre-loaded-plugins) css引入js函数功能

```js
//CSSplugin.js文件
let defaultSettings = require('./defaultSettings');

module.exports = {
  install: function(less, pluginManager, functions) {
    functions.add('headerHeight', function() {
      return new less.tree.Dimension(defaultSettings.default.headerHeight, 'px')
    })
    functions.add('siderWidth', function() {
      return new less.tree.Dimension(defaultSettings.default.siderWidth, 'px')
    })
  }
}


//NewLayout.less
@plugin "../../config/CSSplugin";

.header {
  line-height: headerHeight();
  height: headerHeight();
  padding-left: 0;
  box-sizing: content-box;
}
```

通过js中定义常量和函数实现样式的变化,将js和css配置项全放入一个js文件中配置



> 未使用到的umi配置请参见  https://v2.umijs.org/zh/config/#plugins

## 路由配置参数文件:config/router.config.js

| 属性           | 类型   | 缺省值  | 取值  | 描述  | 必填  |
| ------------- |:------:|:------:|:-----:|:-----:|:-----:|
| path      | String | undefined     |无限制|路由地址,同时是面包屑的地址|是|
| name| String| '项目名'  |无限制|路由名称,同时是面包屑的名称|否|
| icon  | String | undefined   |无限制 |路由图标名称|否|
| component  | String | undefined   |项目文件路径 |指定路由组件文件是从 src/pages 目录开始解析的|否|
| hideMenu  | Boolean | false   |true,false |是否在菜单栏里隐藏|否|
| redirect  | String | undefined   | 已存在的路由地址 |重定向至其他路由地址|否|
| routes  | Array | undefined   | 路由参数 |嵌套路由|否|
| Routes  | Array | undefined   | 指定路由权限效验文件 |权限路由|否|
| AvoidToken  | Boolean | false   | true,false |是否取消token效验|否|
| ~~breadcrumb~~  | Component  | 缺省时返回默认的面包屑  | String,Component |面包屑|否|

`路由使用技巧`

* **layout**在嵌套路由时最外层加入component:"layout.js",此layout文件将作为父组件返回一个 React 组件，通过 props.children 渲染子组件。
* **404**在嵌套路由时每层加入404路由,确保地址错误时正确提示404
* **屏蔽token效验**部分功能不需要token的可将AvoidToken设置为ture,此功能即下属功能不进行token效验
* **权限效验**部分功能根据权限才能使用,将Routes设置指定权限效验文件,此功能即下属功能对权限进行效验
* **breadcrumb**目前breadcrumb缺省,使用默认返回的面包屑格式在'src/components/Breadcrumb.js'中自定义面包屑样式

`简单实例`
```js
export default [
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
      {component: '404', name: '404', path: '/main/*'}
    ]
  },
  {component: '404', name: '404'}
]
```

> 未使用到的路由配置请参见  https://v2.umijs.org/zh/guide/router.html#%E6%9D%83%E9%99%90%E8%B7%AF%E7%94%B1

## src目录详细介绍
我们约定将项目的所有源码放在src目录。当我们运行<kbd>umi dev</kbd>或者<kbd>umi build</kbd>时，此目录下的代码会被转化成浏览器能够运行的正确的JavaScript版本。
### components目录
#### 1. PageLoading/index.jsx  
加载组件。在config/config.js文件中配置dynamicImport 的 loadingComponent，配置好后，切换指定等级内的页面时会显示该加载组件
  
`使用实例`
```js
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: true,
      dll: false,
      library: 'react',
      title: defaultSettings.title,
      dynamicImport: { //实现路由级的动态加载（code splitting），可按需指定哪一级的按需加载。
        loadingComponent: './components/PageLoading/index',   //此处配置加载文件路径
        webpackChunkName: true,  //是否通过 webpackChunkName 实现有意义的异步文件名
        level: 3  //指定按需加载的路由等级
      }
    }
  ]
]
```
#### 2. Upload.js  
上传文件组件。  

#### 3. Breadcrumb.js  
面包屑：  
* 显示当前页面在系统层级结构中的位置，并能向上返回。 在配置文件config/setting.js中配置BreadcrumbsRender，为true时显示面包屑，反之则不显示。  
* 在Breadcrumb.js文件内可更改面包屑的分隔符(当前是/)，字体颜色或者添加图标等。  
* 根据config/router.config.js中的嵌套路由显示面包屑，每多一级routes，所对应显示的面包屑就多一级嵌套，有component表示可以返回上级，没有的话只显示不可点击返回，显示的面包屑名称根据name属性值来决定。  
  
`示例代码`
```js 
//config/router.config.js文件
 export default [
       {
          path: '/main/workbench',
          name: '工作台',
          icon: 'appstore',
          component: './工作台/index',    
        },
        {
          path: '/main/manage',
          name: '管理',    //根据此处的值显示面包屑名称
          icon: 'setting',
          Routes: ['./src/pages/login/privateRoute'],
          routes: [                    //根据此处routes，所对应显示的面包屑就多一级嵌套
            {
              path: '/main/manage/worklist',
              name: '所有工作',
              icon: 'calendar',
              component: './管理/工作管理/index'
            },
            {component: '404', name: '404', path: '/main/manage/*'}
          ]
        }
 ]  
```  

#### 4. RouterTabs/index  
该文件用来以标签的形式展示当前打开的菜单项。使用时先将其引入到布局文件中，以组件的形式使用。在RouterTabs/index.less文件中可更改样式。  

#### 5. HeaderBell  
消息通知组件，包含通知和代办项。使用时将其引入到布局文件中（当前项目中MixLayout布局和SideLayout布局默认包含此组件），以组件的形式使用。  

#### 6. Userinfo  
账号管理：修改个人信息、修改密码。系统内作为页面顶部用户信息下拉框内的账号管理选项的方式来展示。  

`使用实例`
```js
 //三种布局文件内，以声明式跳转（Link）的方式使用
 render() {
    const user_menu = (
         <Menu>
           <Menu.Item key='1'>
             <Link to='/admin/zhgl'>帐号管理</Link>      //以link的方式跳转，路径为路由配置文件config/router.config.js中所定义的
           </Menu.Item>
           <Menu.Item key='2' onClick={this.logout}>
             退出
           </Menu.Item>
         </Menu>
       )
    return(
          .........
         <Dropdown overlay={user_menu}>
            ......
         </Dropdown>
      )
 }
```  
```js
 //路由配置文件config/router.config.js
     {
        path: '/admin/zhgl', //此处定义的就是link内跳转的路径
        bread: '账号管理',  //面包屑显示的名称
        component: '../components/Userinfo/zhgl'   //需要引用的文件所在的路径
      }
```  

### layouts目录  
#### NewLayout.js  
全局布局，实际上是在路由外面套了一层。比如，你的路由是：
```
[
  {
    path: '/',
    component: '../pages/index,
  },
  {
    path: '/users',
    component: '../pages/users',
  },
]
```
有了该全局布局后，路由则变成（可见config/router.config.js文件）：
```
[
  {
    path: '/',
    component: '../layouts/NewLayout',
    routes: [
      {
        path: '/',
        component: '../pages/index',
      },
      {
        path: '/users',
        component: '../pages/users',
      },
    ],
  },
]
```  

通过在项目配置参数文件:config/setting.js中配置的layout风格来渲染不同的layout    
* MixLayout：『顶部-侧边布局-通栏』，拥有顶部及侧边栏，侧边导航可收起。 
* TopLayout：基本的『上-中-下』布局，主导航放置于页面的顶端，从左自右依次为：logo、一级导航项、辅助菜单（用户、设置、通知等）。
* SideLayout：侧边两列式布局。主导航放置于页面的左侧固定位置（设置了自定义触发器trigger收起侧边导航），辅助菜单放置于工作区顶部。  
样式文件在NewLayout.less文件中编写。 

```js
 //config/setting.js中项目配置
 export default {
  layout: 'top'     //layout风格
}
```  
```js
 //NewLayout根据配置的layout值渲染对应的layout，由于多一层组件嵌套,将this.props.children再一次传入
 getLayout = () => {
    if (defaultSettings.layout == 'mix') {
      return <MixLayout content={this.props.children} />
    }
    if (defaultSettings.layout == 'top') {
      return <TopLayout content={this.props.children} />
    }
    return <SideLayout content={this.props.children} />
  }
```  

### pages目录
约定pages下所有的.js 、.jsx 、.ts 或 .tsx文件即路由。在umi中可以使用约定式路由和配置式路由。  
* 配置式路由详见配置文件（config/router.config.js文件） 
* 约定式路由也叫文件路由，就是不需要手写配置文件，文件系统即路由。  
如果没有routes配置，umi会进入约定式路由模式，然后分析src/pages目录拿到路由配置。  

#### 1. 404.js
当访问的路由地址不存在时，会自动显示404 页面。只有build之后生效。调试的时候可以访问 /404  
  <font color=gray>注意：开发模式下会使用内置 umi 提供的 404 提示页面。</font>  
  
#### 2. document.ejs  
umi 约定如果这个文件存在，会作为默认模板,模板里可通过context来获取变量，比如配置标题：
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title><%= context.title %></title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```
该文件内也可配置运行不同环境时的请求服务器地址，详细见上方对应服务器地址。如在开发时需要对接不同的后端人员时，修改以下代码：  

```js
  <% if(context.config.define.mode === 'dev') {%>
    window.server = 'XXX需要对接的后端人员的ip'         //修改此处的ip地址即可
  <%} %>
```
该文件也常用于需要设置网站名称，网站图标,增加 meta，增加头部 js 等情况。  

#### 3. Authorized.js
权限效验文件，不需要的在路由配置中（config/router.config.js文件）加入AvoidToken:true  

### utils目录
#### 1. common.js文件
文件内封装了项目内可使用到的公用方法，包括时间处理（utc时间相互转换）、cookie存取、导出table为csv文件、导出table为Xls文件等方法。  
使用common文件内的方法时，在所需要使用的js文件内使用import引入
```js
import { xxx方法名 } from '@/utils/common'        //umi内置的别名，@表示项目src目录
```
| 函数名           | 参数   | 返回值        | 描述  | 参数必填 |
| :-------------- |:-----:|:------------:|:--------------:|:---:|
| dateToUTC   | String | String |日期时间转化成utc时间格式|是|
| uTCToDate   | String | String  |utc时间转化成标准时间格式|是|
| getCookie  | String | null或String   |获取cookie值 |是|
| setCookie  | (name, value) | 无   |存储cookie |是|
| tableToCsv  | (columns, dataSource, name = '导出文件') | 无   |导出table为Csv文件|是|
| tableToXls  | (columns, dataSource, name = '导出文件') | 无   | 导出table为Xls文件 |是|


#### 2. date.js文件
对于前端antd内常用的时间组件，date文件封装了处理前后端传入传出数据格式的方法。
```js
import { xxx方法名 } from '@/utils/date'        //umi内置的别名，@表示项目src目录
```
| 函数名           | 参数   | 返回值        | 描述  | 参数必填 |
| :-------------- |:-----:|:------------:|:--------------:|:---:|
| dateToNow   | String | String |日期时间转化成'YYYY-MM-DD T HH:mm:ss+08:00'|是|
| dateToUtcTime   | String或者moment对象 | String |日期时间转化成utc格式|是|
| utcToDateTime  | String | String   |utc时间转化为YYYY-MM-DD HH:mm:ss 格式|是|
| arrayToDate  | Array | Array |当后端传入参数为数组格式时使用，适用于时间范围组件 |是|

#### 3. http.js文件
封装了常用的请求方法：get、post、patch、put、delete

#### 4. NotificationUtils.js
通过antd内Notification（通知提醒框）组件内置的API:success、error、warning，封装成全局所用的通知工具类。包括success（成功提醒）、error（错误提醒）、warn（警告提醒）、successAndGoBack（成功提醒并返回）  
使用方法：
```js
import { success, error, warn, successAndGoBack } from '@/utils/NotificationUtils'  
```

| 函数名           | 参数   | 返回值        | 描述  | 参数必填 |
| :--------------:|:-----:|:------------:|:--------------:|:---:|
| success         | String | 无 |成功提醒|是|
| error           | String | 无  |错误|是|
| warn            | String | 无   |警告提醒 |是|
| successAndGoBack| String | 无   |成功提醒并返回 |是|

### global.less
这个文件不走 css modules，自动被引入，可以写一些全局样式，或者做一些样式覆盖。
