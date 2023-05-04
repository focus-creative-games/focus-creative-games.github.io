---
title: 使用热更新MonoBehaviour和ScriptableObject
date: 2022-09-29 12:31:29
permalink: /hybridclr/use_monobehaviour/
categories:
  - hybridclr
  - 文档
tags:
  - 
author: 
  name: Code Philosophy
  link: https://github.com/focus-creative-games
---

# 使用热更新MonoBehaviour和ScriptableObject

HybridCLR完全支持热更新MonoBehaviour和ScriptableObject工作流。你可以无任何限制地通过代码 `go.AddComponent<T>()或go.AddComponent(typeof(T))`来添加运行时热更新脚本。

你也可以在资源上直接挂载热更新MonoBehaviour或者使用 ScriptableObject类对应的资源，但有一些限制，这些限制是Unity的资源管理系统造成的。

Unity资源管理系统在反序列化资源中的热更新脚本时，需要满足以下条件：

1. 脚本所在的dll已经加载到运行时中
1. 必须是使用AssetBundle打包的资源（**addressable之类间接使用了ab的框架也可以**）
1. 脚本所在的dll必须添加到打包时生成的assembly列表文件。这个列表文件是unity启动时即加载的，不可变数据。不同版本的Unity的列表文件名和格式不相同。

详细原理请看[热更新MonoBehaviour](/hybridclr/monobehaviour/)。

对于新手来说，你只需要记住：挂载热更新脚本的资源（场景或prefab）必须打包成ab，在实例化资源前先加载热更新dll即可（这个要求是显然的！）。

