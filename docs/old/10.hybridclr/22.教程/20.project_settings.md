---
title: 项目设置
date: 2022-09-29 12:31:29
permalink: /hybridclr/project_settings/
categories:
  - hybridclr
  - 文档
tags:
  - 
author: 
  name: Code Philosophy
  link: https://github.com/focus-creative-games
---

# 项目设置

安装完hybridclr_unity包后，需要对项目进行AOT/热更新 assembly拆分，并且正确设置相关配置参数。

## 配置PlayerSettings

- 关闭增量式GC(Use Incremental GC) 选项。因为目前不支持增量式GC。WebGL平台忽略此选项。
- `Scripting Backend` 切换为 `il2cpp`, WebGL平台不用设置此选项。
- `Api Compatability Level` 切换为 `.Net 4` 或 `.Net Framework` (打主包时可以使用.net standard，但使用脚本Compile热更新dll时必须切换到`.Net 4.x or .Net Framework`)。如果你要一定要热更新部分也使用.net standard，请找我们[商业化服务](/hybridclr/price/)。

## 热更新模块拆分

很显然，项目必须拆分为AOT（即编译到游戏主包内）和热更新 assembly，才能进行热更新。HybridCLR对于
怎么拆分程序集并无任何限制，甚至你将AOT或者热更新程序集放到第三方工程中也是可以的。

常见的拆分方式有几种：

- Assembly-CSharp作为AOT程序集。剩余代码自己拆分为0-N个程序集。
- Assembly-CSharp作为热更新程序集。剩余代码自己拆分为1-N个程序集（实践中至少得有一个负责热更新的AOT启动程序集）。

第一种需要自己设置好热更新对AOT程序集的引用，并且由于Unity自身的原因，Assembly-CSharp是最顶层assembly，它会自动引用剩余所有assembly，
实践中很容易出现热更新assembly的代码被Assembly-CSharp意外引用，导致打包出错的情况。因此推荐新手将Assembly-CSharp作为热更新程序集。

无论哪种拆分方式，正确设置好程序集之间的引用关系即可

## 配置 HybridCLR

配置相关详细文档可见 [hybridclr_unity包介绍](/hybridclr/hybridclr_unity/)。

点击菜单 `HybridCLR/Settings` 打开配置界面，新手关心 `hotUpdate Assembly Definitions` 和 `hotUpdate dlls` 字段即可。

对于项目中的热更新程序集，如果是assembly definition(asmdef)定义的程序集，加入
`hotUpdateAssemblyDefinitions`列表，如果是普通dll，则将程序集名字（不包含'.dll'后缀，如Main、Assembly-CSharp）加入`hotUpdateAssemblies`即可。这两个列表是等价的，不要重复添加，否则会报错。

如果你的热更新代码在外部项目中，例如使用ET之类的框架，它的热更新代码并不放到Unity项目中，则可以在`externalHotUpdateAssemblyDirs`
配置项中指定外部热更新dll的搜索路径。注意，这个路径是相对路径，相对于Unity项目根目录。

**至此完成热更新相关的所有设置**。
