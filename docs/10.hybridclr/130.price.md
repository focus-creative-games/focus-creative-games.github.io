---
title: 商业化服务
date: 2022-05-25 23:17:56
permalink: /hybridclr/price/
categories:
  - HybridCLR
tags:
  - 
author: 
  name: Code Philosophy
  link: https:://code-philosophy.com
---

# 商业化服务

灵活支持多种商业化形式，既可以是一整套的标准化企业服务，也可以购买单独的技术产品。

## 标准企业版本

- 对Android64、iOS64平台的技术支持（其他服务均只针对这些平台）
- HybridCLR 社区版本的技术支持，包含一对一远程协助指导
- Bug标准响应及解决，大多数可复现bug会在2-7天内修复或者提供规避方案
- 提前支持社区版本暂未跟进的LTS小版本
- 对2019.4.x、2020.3.x等已经过期的LTS版本的bug修复支持
- 与lua或者其他热更新方案兼容的技术指导

## 高级企业版本

- 包含标准企业版本的所有服务
- 额外新增对 Android32、**WebGL（含MiniGame、微信小游戏）**、Win64、MacOS平台的技术支持（扩展到所有服务）
- **可以使用指令优化版本，大多数数值计算指令性能提升100-300%甚至更多**
- Bug快速响应及解决，大多数可复现Bug会在6-24小时内修复或者提供规避方案
- 移植非标准支持范围内小版本的技术指导，例如指导支持2020.2.4版本。
- 优化指导

以下是部分测试用例下的商业化版本相比于社区版本的性能提升数据。

![interpreter_optimization](/img/hybridclr/interpreter_optimization.jpg)

以下是数值计算方面AOT与HybridCLR在优化后的性能对比，加法大约是7-16倍左右，乘法是4倍，除法是2倍。

![benchmark_numeric](/img/hybridclr/benchmark_numeric.jpg)


## Differential Hybrid Execution（DHE） 差分混合执行技术

Differential Hybrid Execution 使得开发者可以对AOT dll任意增删改，会智能地让变化或者新增的类和函数以interpreter模式运行，但未改动的类和函数以AOT方式运行，让热更新的游戏逻辑的运行性能基本达到原生AOT的水平。

DHE分区标准和高级版本，其中高级版本额外包含了解释指令优化。

- 【优点】未变化部分代码性能提升惊人的**3-30**倍甚至更高。整体接近原生性能水平。
- 【优点】对代码基本无入侵
- 【优点】对项目的改造成本比纯热更新版本更低。例如可以直接在DHE中定义extern函数，而不需要移到AOT模块。不过仍然无法在热更新模块中新增extern函数。
- 【优点】**解释指令优化，变化部分的大多数数值计算指令性能提升100-300%甚至更多**
- 【缺点】要求加载DHE热更新代码前不能执行DHE对应的AOT assembly中的任何代码。意味着DHE不支持像mscorlib这种基础库的差分混合，但支持传统热更新assembly的差分热更新。

## HotReload热重载技术

HotReload技术用于卸载或者重新加载一个dll，适用于小游戏合集类型的游戏。

- 【优点】支持动态重新加载全新的AOT或热更新Assembly，代码可以任意变更
- 【优点】重新加载的Assembly代码可以任意变化甚至完全不同
- 【优点】卸载大部分内存，但有少量残留（如类型静态成员字段占据的内存）
- 【缺点】要求业务代码有清理逻辑，主动清除旧对象（核心是确保不会再调用旧代码），并且退出所有在执行的旧逻辑
- 【缺点】要求重载后在旧Assembly中存在同名类的MonoBehaviour中的被Unity引擎特殊处理函数如Awake之类不发生增删（但函数体可以变化）


## 其他服务

- 其他特殊的定制服务

## 联系方式

请使用贵公司的**公司邮箱**向邮箱business@code-philosophy.com发起咨询，以QQ或者126邮箱之类发起的邮件会被忽略，敬请谅解。


