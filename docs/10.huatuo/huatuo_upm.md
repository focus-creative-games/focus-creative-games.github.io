---
#title: huatuo Tookit for Unity
title: Unity工具集
date: 2022-05-25 23:18:12
permalink: /huatuo/huatuo_upm/
categories:
  - huatuo
tags:
  - 
author: 
  name: Dongua
  link: https://github.com/ShuaiGao
---

# Unity工具集——huatuo Toolkit for Unity
[![license](http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/focus-creative-games/huatuo_upm/blob/main/LICENSE)[![openupm](https://img.shields.io/npm/v/com.focus-creative-games.huatuo?style=flat-square&label=openupm&registry_uri=https://package.openupm.com)](https://openupm.com/packages/com.focus-creative-games.huatuo/) 


huatuo Toolkit 是一个用户管理huatuo的Unity工具包（[仓库链接](https://github.com/focus-creative-games/huatuo_upm)），它用来模拟手工安装huatuo的操作，实现自动化的安装、卸载操作。

::: warning
该工具无法处理unity Editor安装在C盘目录下的权限问题，对于安装于C盘下的情况需要手动下载安装。
:::

# 安装

支持最小unity版本 2020.3

多种安装方法如下，或参照海浪的[手把手教你使用Huatuo部署插件](https://zhuanlan.zhihu.com/p/513834841)

### 方法1： 使用OpenUPM的Unity依赖文件

1. 打开unity工程的根目录

2. 打开编辑文件 Packages\mainfest.json

3. 在scopedRegistries数据中添加注册信息，配置unity包搜索URL。示例如下

   ```json
   {
       "dependencies": {
           ...
       },
       "scopedRegistries": [
           {
               "name": "package.openupm.cn",
               "url": "https://package.openupm.cn",
               "scopes": [
                   "com.focus-creative-games.huatuo"
               ]
           }
       ]
   }
   ```
   
4. 打开Unity后会弹出 Edit->Project Settings->Package Manager界面，可以看到Scoped Registries中已经自动填充了信息。切换到Window->Package Manager->Packages: My Registries 中将看到名为`huatuo Tookit for Unity`的包，其它操作在Package Manager中进行即可。

### 方法2：使用openupm-cn命令行

关于OpenUPM CLI的命令行工具可以参照 [OpenUPM-CLI快速入门文档](https://openupm.cn/zh/docs/getting-started.html#安装openupm-cli)

1. 安装命令行工具
2. 命令行中跳转到在对应Unity工程目录（包含Assets或Packages的目录）
3. 输入命令安装`openupm-cn add com.focus-creative-games.huatuo`
3. 后续操作参照方法1-第4步。

### 方法3： 使用Unity Package Manager 安装

1. 在Unity中，点击 Edit->Project Settings，选择 Package Manager
2. 在Scoped Registries中添加下面信息
   - Name: package.openupm.cn
   - URL: https://package.openupm.cn
   - Scope(s): com.focus-creative-games.huatuo
3. 点击Save
4. 后续操作参照方法1-第4步。

## 工作原理

### 安装和卸载

安装和卸载完全模拟手工操作，都是目录的替换。

安装流程如下：

1. 下载源代码zip。下载并将压缩包存储在缓存目录（缓存目录可配置），**如遇下载失败可手动下载并将文件置于缓存目录**。
2. 备份Libil2cpp。在il2cpp目录备份原始Libil2cpp文件夹，**此处注意在安装前应先恢复之前的本地改动**。
3. 解压缩源码zip。
4. 版本信息写入文件。版本信息写入到对应Unity Editor路径下，例：...\\2020.3.33f1c2\Editor\\.huatuo

卸载流程如下：

1. 检查是否存在原始文件夹备份。备份文件夹名示例 例：\...\\2020.3.33f1c2\Editor\Data\il2cpp\libil2cpp_original_unity
2. 移除libil2cpp，将libil2cpp_original_unity重命名为libil2cpp
