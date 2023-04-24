import { resolve } from 'path'
import { defineConfig4CustomTheme, UserPlugins } from 'vuepress/config'
import { VdoingThemeConfig } from 'vuepress-theme-vdoing/types'
import { svgIconPlugin } from '@goy/vuepress-plugin-svg-icons'
import dayjs from 'dayjs'
import baiduCode from './config/baiduCode' // 百度统计hm码
import htmlModules from './config/htmlModules' // 自定义插入的html块
//import sidebarConfig from './config/sidebar'

export default defineConfig4CustomTheme<VdoingThemeConfig>({
  theme: 'vdoing', // 使用npm主题包
  // theme: resolve(__dirname, '../../vdoing'), // 使用本地主题包
  //多语言
  locales: {
    '/': {
      lang: 'zh-CN',
      title: "Focus Creative Games",
      description: 'Focus Creative Games是一个业内领先的专注于提供游戏行业深度技术解决方案的创新型公司。',
    },
    '/en/':{
      lang: 'en-US',
      title: "Focus Creative Games",
      description: 'Focus Creative Games是一个业内领先的专注于提供游戏行业深度技术解决方案的创新型公司。',
    }
  },
  // base: '/', // 默认'/'。如果你想将你的网站部署到如 https://foo.github.io/bar/，那么 base 应该被设置成 "/bar/",（否则页面将失去样式等文件）

  // 主题配置
  themeConfig: {
    docsDir: 'docs', // 编辑的文件夹
    logo: '/img/logo.png', // 导航栏logo
    repo: 'focus-creative-games', // 导航栏右侧生成Github链接
    //多语言
    locales: {
      '/': {
        selectText: 'Languages',
        label: '简体中文',
        // 导航配置
        nav: [
          { text: '首页', link: '/' },
          { 
            text: 'HybridCLR文档', 
            link: '/hybridclr/index/',
            items:[
              { text: '关于HybridCLR', link: '/hybridclr/about/'},
              { text: '快速开始', link: '/hybridclr/start_up/'},
              { text: '安装', link: '/hybridclr/install/'},
              { text: '性能报告', link: '/hybridclr/benchmark/'},
              { text: 'FAQ', link: '/hybridclr/faq/'},
              { text: '常见错误处理', link: '/hybridclr/common_errors/'},
              { text: 'bug反馈', link:'/hybridclr/bug_reporter/'},
            ]
          },
          {
            text: 'Luban文档',
            link: '/luban/index/',
            items: [
              { text: '关于luban', link: '/luban/about/' },
              { text: '快速开始', link: '/luban/start_up/' },
              { text: '完整特性', link: '/luban/command_tools/'},
              { text: '多数据源', link: '/luban/data_source/' },
              { text: '高级特性', link: '/luban/advanced/validator/' },
              { text: 'Luban工具', link: '/luban/tools/' },
            ],
          },
          { text:'商业化支持', link: '/hybridclr/price/'},
          { text:'招聘', link: '/join/'},
          { text: '关于', link: '/about/' },
        ],
        sidebarDepth: 2, // 侧边栏显示深度，默认1，最大2（显示到h3标题）
        lastUpdated: '上次更新', // 开启更新时间，并配置前缀文字   string | boolean (取值为git提交时间)
        editLinkText: '编辑',
        searchMaxSuggestions: 10, // 搜索结果显示最大数
        editLinks: true, // 启用编辑
      },

      '/en/': {
        selectText: '切换语言',
        label: 'English',
        // 导航配置
        nav: [
          { text: 'Home', link: '/en/' },
          { 
            text: 'HybridCLR', 
            // link: '/en/hybridclr/index/', //注释原因：vdoing这里有url拼接bug，会使得英文页面跳转回中文页面
            items:[
              { text: 'About', link: '/en/hybridclr/about/'},
              { text: 'Get Started', link: '/en/hybridclr/monobehaviour/'},
              { text: 'Benchmark', link: '/en/hybridclr/benchmark/'},
              { text: 'FAQ', link: '/en/hybridclr/faq/'},
            // { text: '常见错误处理', link: '/en/hybridclr/common_errors/'},
            { text: 'Common Mistakes', link: '/en/hybridclr/common_errors/'},
              { text: 'Report Bugs', link:'/en/hybridclr/bug_reporter/'},
            ]
          },
          {
            text: 'Luban',
            link: '/en/luban/index/',
            items: [
              { text: 'About', link: '/en/luban/about/' },
              { text: 'Get Started', link: '/en/luban/start_up/' },
              { text: 'Complete Features', link: '/en/luban/command_tools/'},
              { text: 'Data Source', link: '/en/luban/data_source/' },
              { text: 'Advanced Features', link: '/en/luban/advanced/validator/' },
              { text: 'Luban Tools', link: '/en/luban/tools/' },
            ],
          },
          { text:'Service', link: '/en/hybridclr/price/'},
          { text:'Jobs', link: '/en/join/'},
          //{ text: '服务与合作', link: '/support/' },
          { text: 'Zhihu', link: 'https://www.zhihu.com/column/c_1489549396035870720' },
          { text: 'About', link: '/en/about/' },
        ],
        sidebarDepth: 2, // 侧边栏显示深度，默认1，最大2（显示到h3标题）
        lastUpdated: 'Last Updated', // 开启更新时间，并配置前缀文字   string | boolean (取值为git提交时间)
        editLinkText: 'Edit',
        searchMaxSuggestions: 10, // 搜索结果显示最大数
        editLinks: true, // 启用编辑
      },
    },
    

    //*** 以下是Vdoing主题相关配置，文档：https://doc.walon.com/pages/a20ce8/ ***//

    // category: false, // 是否打开分类功能，默认true
    // tag: false, // 是否打开标签功能，默认true
    // archive: false, // 是否打开归档功能，默认true
    // categoryText: '随笔', // 碎片化文章（_posts文件夹的文章）预设生成的分类值，默认'随笔'

    bodyBgImg: [
      '/img/flying-seagull.jpg'
    //   // 'https://cdn.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175828.jpeg',
    //   // 'https://cdn.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175845.jpeg',
    //   // 'https://cdn.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175846.jpeg'
    ], // body背景大图，默认无。 单张图片 String | 多张图片 Array, 多张图片时每隔15秒换一张。
    bodyBgImgOpacity: 1, // body背景图透明度，选值 0.1~ 1.0, 默认0.5
    // titleBadge: false, // 文章标题前的图标是否显示，默认true
    // titleBadgeIcons: [ // 文章标题前图标的地址，默认主题内置图标
    //   '图标地址1',
    //   '图标地址2'
    // ],
    // contentBgStyle: 1, // 文章内容块的背景风格，默认无. 1 方格 | 2 横线 | 3 竖线 | 4 左斜线 | 5 右斜线 | 6 点状

    // updateBar: { // 最近更新栏
    //   showToArticle: false, // 显示到文章页底部，默认true
    //   moreArticle: '/archives' // “更多文章”跳转的页面，默认'/archives'
    // },
    // rightMenuBar: false, // 是否显示右侧文章大纲栏，默认true (屏宽小于1300px下无论如何都不显示)
    // sidebarOpen: false, // 初始状态是否打开左侧边栏，默认true
    // pageButton: false, // 是否显示快捷翻页按钮，默认true

    // 侧边栏  'structuring' | { mode: 'structuring', collapsable: Boolean} | 'auto' | <自定义>    温馨提示：目录页数据依赖于结构化的侧边栏数据，如果你不设置为'structuring',将无法使用目录页
    sidebar: 'structuring',

    // 文章默认的作者信息，(可在md文件中单独配置此信息) string | {name: string, link?: string}
    author: {
      name: 'walon', // 必需
      link: 'https://github.com/focus-creative-games', // 可选的
    },

    // // 博主信息 (显示在首页侧边栏)
    // blogger: {
    //   avatar: 'https://cdn.jsdelivr.net/gh/walon/image_store/blog/20200103123203.jpg',
    //   name: 'Walon',
    //   slogan: '专注创造游戏开发解决方案',
    // },

    // 社交图标 (显示于博主信息栏和页脚栏。内置图标：https://doc.walon.com/pages/a20ce8/#social)
    social: {
      // iconfontCssFile: '//at.alicdn.com/t/xxx.css', // 可选，阿里图标库在线css文件地址，对于主题没有的图标可自己添加。阿里图片库：https://www.iconfont.cn/
      icons: [
        {
          iconClass: 'icon-youjian',
          title: '发邮件',
          link: 'mailto:hybridclr@code-philosophy.com',
        },
        {
          iconClass: 'icon-github',
          title: 'GitHub',
          link: 'https://github.com/focus-creative-games',
        },
        // {
        //   iconClass: 'icon-erji',
        //   title: '听音乐',
        //   link: 'https://music.163.com/#/playlist?id=755597173',
        // },
      ],
    },

    // 页脚信息
    footer: {
      createYear: 2022, // 博客创建年份
      copyrightInfo:
        'focus-creative-games', // 博客版权信息，支持a标签或换行标签</br>
    },

    // 扩展自动生成frontmatter。（当md文件的frontmatter不存在相应的字段时将自动添加。不会覆盖已有的数据。）
    extendFrontmatter: {
      author: {
        name: 'walon',
        link: 'https://github.com/focus-creative-games'
      }
    },
    indexImg: {
      navColor: 2,    // 导航栏左侧名字、中间搜索框、右侧字体的颜色，1 是黑色，2 是白色。默认是 1
      switchNavColor: true,    // 页面移出大图片的位置后，navColor 是否变换，如由白色变黑色，黑色变白色。默认是 false
      // 因为本主题的默认背景色偏向白色，如果 navColor 是 2，建议需要开启(true)，否则白背景 + 白字体 = 看不见
      bgTimeColor: false,     // 是否开启图片的背景色随一天的不同时间而变化，并且开启时间窗口提示，默认是 false。时间分为四种：白天（原图）、黄昏（偏黄）、晚上（偏黑）、深夜（偏深黑）
      bgTimeColorArray: ['transparent', 'rgba(255, 148, 48, .2)', 'rgba(0, 0, 0, .3)', 'rgba(0, 0, 0, .5)'],   // 第一个是白天的颜色（默认原图），第二个是黄昏的颜色，第三个是晚上的颜色，第四个是深夜的颜色。bgTimeColor 为 true 生效。提示：如果不想要这个效果，但是又想要时间窗口提示效果，则改为 ['transparent', 'transparent', 'transparent', 'transparent']
      descFade: false,   // 是否开启图片中间描述的淡入效果，默认为 false
      desc: ["提供游戏行业的深度技术解决方案，让游戏开发者专注于做有创造力并有趣的游戏!"],  // 多个描述，如果填写则覆盖 config.js 的 description，不填写默认读取 config.js 的 description，descFadeIn 为 true 生效
      descFontSize: '1.4rem',   // desc 的字体大小，默认 1.4rem。提示：原主题是 1.1rem
      descFadeInTime: 200,  // 描述的淡入效果持续时间，descFade 为 true 生效，默认 200 毫秒
      descFadeOutTime: 100,  // 描述的淡出效果持续时间，descFade 为 true 生效，默认 100 毫秒
      descNextTime: 800,  // 当存在多个 desc 时，一个 desc 展示完后或准备开始时，多少秒后出现下一个 desc，默认 800 毫秒
      bubble: false,    // 是否开启图片的气泡效果，默认为 false
      bubblePosition: 70,  // 气泡效果的位置，范围：0-100，不同数值代表不同的起始位置，0是整个图片，50是半张图（一半的下方）。bubble 为 true 生效。默认是 0
      bubbleNum: 200,   // 气泡的个数，bubble 为 true 生效，默认 200 个
    },

    // 自定义hmtl(广告)模块
    //htmlModules
  },

  // 注入到页面<head>中的标签，格式[tagName, { attrName: attrValue }, innerHTML?]
  head: [
    ['link', { rel: 'icon', href: '/img/favicon.png' }], //favicons，资源放在public文件夹
    ['link', { rel: 'stylesheet', href: '//at.alicdn.com/t/font_3114978_qe0b39no76.css' }],
    [
      'meta',
      {
        name: 'keywords',
        content: 'HybridCLR,luban,热更新,配表,配置,游戏,git,github',
      },
    ],
    //['meta', { name: 'baidu-site-verification', content: '7F55weZDDc' }], // 百度统计的站长验证（你可以去掉）
    ['meta', { name: 'theme-color', content: '#11a8cd' }], // 移动浏览器主题颜色
    // [
    //   'script',
    //   {
    //     'data-ad-client': 'ca-pub-7828333725993554',
    //     async: 'async',
    //     src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
    //   },
    // ], // 网站关联Google AdSense 与 html格式广告支持（你可以去掉）
  ],


  // 插件配置
  plugins: <UserPlugins>[
    // svgIconPlugin(
    //   {
    //     svgsDir: ".vuepress/public/icons/"
    //   }
    // ),
    'tabs',
    'vuepress-plugin-baidu-autopush', // 百度自动推送
    [
      'vuepress-plugin-baidu-tongji', // 百度统计
      {
        hm: baiduCode,
      },
    ],
    {
        name: 'custom-plugins',
        globalUIComponents: ["BlockToggle"] // 2.x 版本 globalUIComponents 改名为 clientAppRootComponentFiles
    },
    // {
    //     name: 'iframe-Comp',
    //     globalUIComponents: ["iframeComp"]
    // },

    // 全文搜索。 ⚠️注意：此插件会在打开网站时多加载部分js文件用于搜索，导致初次访问网站变慢。如在意初次访问速度的话可以不使用此插件！（推荐：vuepress-plugin-thirdparty-search）
    // 'fulltext-search',

    // 可以添加第三方搜索链接的搜索框（继承原官方搜索框的配置参数）
    [
      'thirdparty-search',
      {
        thirdparty: [
          // {
          //   title: '在MDN中搜索',
          //   frontUrl: 'https://developer.mozilla.org/zh-CN/search?q=', // 搜索链接的前面部分
          //   behindUrl: '', // 搜索链接的后面部分，可选，默认 ''
          // },
          // {
          //   title: '在Runoob中搜索',
          //   frontUrl: 'https://www.runoob.com/?s=',
          // },
          // {
          //   title: '在Vue API中搜索',
          //   frontUrl: 'https://cn.vuejs.org/v2/api/#',
          // },
          // {
          //   title: '在Bing中搜索',
          //   frontUrl: 'https://cn.bing.com/search?q=',
          // },
          {
            title: '通过百度搜索本站的',
            frontUrl: 'https://www.baidu.com/s?wd=site%3Afocus-creative-games.github.io%20',
          },
        ],
      }
    ],
    [
      'one-click-copy', // 代码块复制按钮
      {
        copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'], // String or Array
        copyMessage: '复制成功', // default is 'Copy successfully and then paste it for use.'
        duration: 1000, // prompt message display time.
        showInMobile: false, // whether to display on the mobile side, default: false.
      },
    ],
    [
      'demo-block', // demo演示模块 https://github.com/xiguaxigua/vuepress-plugin-demo-block
      {
        settings: {
          // jsLib: ['http://xxx'], // 在线示例(jsfiddle, codepen)中的js依赖
          // cssLib: ['http://xxx'], // 在线示例中的css依赖
          // vue: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js', // 在线示例中的vue依赖
          jsfiddle: false, // 是否显示 jsfiddle 链接
          codepen: true, // 是否显示 codepen 链接
          horizontal: false, // 是否展示为横向样式
        },
      },
    ],
    [
      'vuepress-plugin-zooming', // 放大图片
      {
        selector: '.theme-vdoing-content img:not(.no-zoom)', // 排除class是no-zoom的图片
        options: {
          bgColor: 'rgba(0,0,0,0.6)',
        },
      },
    ],
    // [
    //   'vuepress-plugin-comment', // 评论
    //   {
    //     choosen: 'gitalk',
    //     options: {
    //       clientID: 'a6e1355287947096b88b',
    //       clientSecret: 'f0e77d070fabfcd5af95bebb82b2d574d7248d71',
    //       repo: 'blog-gitalk-comment', // GitHub 仓库
    //       owner: 'walon', // GitHub仓库所有者
    //       admin: ['walon'], // 对仓库有写权限的人
    //       // distractionFreeMode: true,
    //       pagerDirection: 'last', // 'first'正序 | 'last'倒序
    //       id: '<%- (frontmatter.permalink || frontmatter.to.path).slice(-16) %>', //  页面的唯一标识,长度不能超过50
    //       title: '「评论」<%- frontmatter.title %>', // GitHub issue 的标题
    //       labels: ['Gitalk', 'Comment'], // GitHub issue 的标签
    //       body:
    //         '页面：<%- window.location.origin + (frontmatter.to.path || window.location.pathname) %>', // GitHub issue 的内容
    //     },
    //   },
    // ],
    [
      '@vuepress/last-updated', // "上次更新"时间格式
      {
        transformer: (timestamp, lang) => {
          return dayjs(timestamp).format('YYYY/MM/DD, HH:mm:ss')
        },
      },
    ],
  ],
  markdown: {
    lineNumbers: true,
    extractHeaders: ['h2', 'h3', 'h4', 'h5', 'h6'], // 提取标题到侧边栏的级别，默认['h2', 'h3']
  },

  // 监听文件变化并重新构建
  extraWatchFiles: [
    '.vuepress/config.ts',
    '.vuepress/config/htmlModules.ts',
  ]
})
