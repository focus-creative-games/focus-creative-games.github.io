# FCG web

<div align=center><img src="docs/.vuepress/public/img/logo.png"></div>

Focus Create Games组织官网项目，使用vuepress构建，使用[vdoing主题](https://github.com/xugaoyi/vuepress-theme-vdoing)

## 启动项目

```bash
# clone the project
git clone git@github.com:focus-creative-games/focus-creative-games.github.io.git

# enter the project directory
cd focus-creative-games.github.io

# install dependency
yarn install # or npm install

# develop
yarn dev # or npm run dev
```

## 本地测试

- 安装 nodejs
- npm install --force  
- npm run dev 。 即会在本地 0.0.0.0:8080 上运行一个本地静态网站。
- 测试页面没问题。直接提交代码即可。由于静态网站生成需要几分钟，过一会后网站才会刷新。

本项目部署于pages分支，通过github Action自动部署。