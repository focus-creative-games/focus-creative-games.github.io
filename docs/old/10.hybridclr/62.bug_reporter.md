---
title: BUG反馈模板
date: 2022-06-15 19:12:10
permalink: /hybridclr/bug_reporter/
categories:
  - HybridCLR
tags:
  -  
comment: false
editLink: false
author: 
  name: Code Philosophy
  link: https://github.com/focus-creative-games
---
# BUG反馈模板

反馈bug前，请确认已经完成以下步骤：  
- 首先仔细查看[常见错误文档](/hybridclr/common_errors/),大多数新手问题都在里面。
- 至此，如果还确定是bug，请按照下面 **反馈模板** 发给给技术客服(QQ1732047670)。

## Bug反馈

如果确定是bug，请按以下 bug反馈模板提交issue（一些较大的如导出工程之类的文件不用提交），然后直接将issue反馈给技术客服，同时在QQ上附带材料（如导出工程之类）。

**bug反馈模板**

- Unity Editor版本。如 2020.3.33
- 操作系统。 如Win 10
- 出错的Build Target。如 Android 64。
- com.focus-creative-games.hybridclr_unity的版本号
- hybridclr仓库的版本号
- il2cpp_plus仓库的版本号
- 截图及日志文件
- 复现条件
- 出错的c#代码位置（如果能定位出的话）
- 免费用户必须提供符合以下条件的材料之一，否则会被拒绝，因为不符合标准的bug反馈信息会浪费我们太多时间，敬请理解。
  - 可复现的一段代码
  - 可复现的最小Unity项目，要求在hybridclr_trial基础上修改。并且打包后立即复现
  - Win 64可复现的导出Debug工程（必须启动即复现）及热更新dll（用于跟踪指令）
- 商业化用户可以提供以下材料之一。
  - 可复现的最小Unity项目，尽量在hybridclr_trial基础上修改。
  - Win 64可复现的导出Debug工程（必须启动即复现）及热更新dll（用于跟踪指令）
  - Android (64或32)可复现的导出Debug工程，必须可以直接打包成功，不能有key store缺失之类的错误！！！必须build完后运行即可复现。
  - xcode 导出工程。必须运行即可复现。
