import settings from './settings'

//默认配置,设置请去setting.js,此文件尽可能少的修改
export default {
  //项目配置
  title: settings.title, //项目名
  primaryColor: settings.primaryColor || '#1890ff', //大多数的主题色
  linkColor: settings.linkColor || '#1890ff', // 链接色
  successColor: settings.successColor || '#52c41a', // 成功色
  warningColor: settings.warningColor || '#faad14', // 警告色
  errorColor: settings.errorColor || '#f5222d', // 错误色
  disabledColor: settings.disabledColor || 'rgba(0, 0, 0, .25)', // 失效色
  fontSizeBase: settings.fontSizeBase || '14px', // 主字号
  textColor: settings.textColor || 'rgba(0, 0, 0, 0.65)', // 主文本色
  componentBackground: settings.componentBackground || '#fff', //大多数组件的默认背景色

  //自定义配置项
  navTheme: settings.navTheme || 'light', //整题颜色 light dark
  logo: () => {
    return require('@/assets/logo.png')
  }, //项目图标
  layout: settings.layout || 'side', //导航模式 top mix side
  collapsible: settings.collapsible || true, //左侧栏是否可被收缩
  fixSiderbar: settings.fixSiderbar || true, //是否固定左侧栏 当layout: 'side'时固定
  defaultCollapsed: settings.defaultCollapsed || false, //左侧栏是否默认收起 当layout: 'side'时不收起
  siderWidth: settings.siderWidth || 226, //左侧栏宽度
  headerHeight: settings.headerHeight || 56, //头部Header高度
  menuMode: settings.menuMode || 'inline', //菜单栏风格
  headerRender: settings.headerRender || true, //是否显示头部
  menuRender: settings.menuRender || true, //是否显示侧边菜单
  BreadcrumbsRender: settings.BreadcrumbsRender || false, //是否显示面包屑
  contentWidth: settings.contentWidth || false, //是否定死content区域的宽度,不定死为false,需要定死如:'1200px'
  minWidth: settings.minWidth || '1200px' //最小宽度,页面宽度缩小到指定值时使用滚动条,不定死为false,需要定死如:'1200px'
}
