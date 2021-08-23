import defaultSettings from './defaultSettings'
import slash from 'slash2'
import webpackPlugin from './plugin.config'
import router from './router.config'

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: true,
      dll: false,
      library: 'react',
      title: defaultSettings.title,
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3
      }
    }
  ]
]

export default {
  base:'/',
  publicPath: '/static/',
  define:{
    mode: process.env.UMI_ENV ? process.env.UMI_ENV.toString() : 'prod'
  },
  treeShaking: true,
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks'
  },
  hash: true,
  history: 'hash', // hash路由
  targets: {
    ie: 9
  },
  devtool: process.env.UMI_ENV === 'dev' ? 'source-map' : false,
  routes: router,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'content-width': defaultSettings.contentWidth,
    'font-size-base': defaultSettings.fontSizeBase,
    'body-background': defaultSettings.bodyBackground,
    'component-background': defaultSettings.componentBackground,
    'link-color': defaultSettings.linkColor,
    'success-color': defaultSettings.successColor,
    'warning-color': defaultSettings.warningColor,
    'error-color': defaultSettings.errorColor,
    'heading-color': defaultSettings.headingColor,
    'text-color': defaultSettings.textColor,
    'text-color-secondary': defaultSettings.textColorSecondary,
    'disabled-color': defaultSettings.disabledColor,
    'border-radius-base': defaultSettings.borderRadiusBase,
    'border-color-base': defaultSettings.borderColorBase,
    'box-shadow-base': defaultSettings.boxShadowBase
  },
  ignoreMomentLocale: true, //忽略 moment 的 locale 文件，用于减少尺寸
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName
      }

      const match = context.resourcePath.match(/src(.*)/)

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '')
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase())
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-')
      }

      return localName
    }
  },
  disableRedirectHoist: true,

  manifest: {
    basePath: '/'
  },
  chainWebpack: webpackPlugin
  /*
  proxy: {
    '/server/api/': {
      target: 'https://preview.pro.ant.design/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  */
}
