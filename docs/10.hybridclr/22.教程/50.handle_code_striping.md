---
title: 处理代码裁剪
date: 2022-09-29 12:31:29
permalink: /hybridclr/handle_code_striping/
categories:
  - hybridclr
  - 文档
tags:
  - 
author: 
  name: Code Philosophy
  link: https://github.com/focus-creative-games
---

# 处理代码裁剪

Unity使用了[代码裁剪](https://docs.unity3d.com/Manual/ManagedCodeStripping.html)技术来帮助减少il2cpp backend的包体大小。如果未做防裁剪处理，由于AOT主工程里的代码一般不多，大量的C#类型和函数被裁剪，导致热更新中调用这些被裁剪类或函数出现如下异常：

```txt
    // 类型缺失错误
    Unity: TypeLoadException: Could not load type 'Xxx' from assembly 'yyy'

    // 函数缺失错误
    MissingMethodException: xxxx
```

Unity已经提供了避免代码裁剪的机制，详细方式见[代码裁剪问题](/hybridclr/code_striping/)文档。

hybridclr_unity提供了便捷的命令`HybridCLR/generate/LinkXml`，一键生成link.xml。

注意如果某个assembly在你的主工程中完全没有引用到，即使link.xml中preserve了这个assembly或它的类及函数，这个防裁剪操作不会生效。
因此你要确保对于每个要保留的assembly，你在主工程中（例如hybridclr_trial项目的Main模块）至少要引用过这个assembly里的某个类或函数。


