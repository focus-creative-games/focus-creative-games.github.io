---
title: 热重载技术
date: 2022-05-25 11:50:18
permalink: /hybridclr/hotreload/
categories:
    - HybridCLR
tags:
    -
author:
    name: Code Philosophy
    link: https:://code-philosophy.com
---

# HotReload 热重载技术

HotReload技术用于卸载或者重新加载一个dll，适用于小游戏合集类型的游戏。该方案只提供**商业化版本**，具体请见[商业化服务](/hybridclr/price/)。


- 【优点】支持动态重新加载全新的AOT或热更新Assembly，代码可以任意变更
- 【优点】重新加载的Assembly代码可以任意变化甚至完全不同
- 【优点】卸载大部分内存，但有少量残留（如类型静态成员字段占据的内存）
- 【缺点】要求业务代码有清理逻辑，主动清除旧对象（核心是确保不会再调用旧代码），并且退出所有在执行的旧逻辑
- 【缺点】要求重载后在旧Assembly中存在同名类的MonoBehaviour中的被Unity引擎特殊处理函数如Awake之类不发生增删（但函数体可以变化）
