---
title: 代码裁剪问题
date: 2022-05-25 11:50:18
permalink: /hybridclr/code_striping/
categories:
    - HybridCLR
tags:
    -
author:
    name: Code Philosophy
    link: https:://code-philosophy.com
---

# 代码裁剪问题

Unity使用了[代码裁剪](https://docs.unity3d.com/Manual/ManagedCodeStripping.html)技术来帮助减少il2cpp backend的包体大小。如果未做防裁剪处理，由于AOT主工程里的代码一般不多，大量的C#类型和函数被
裁剪，导致热更新中调用这些被裁剪类或函数出现如下异常：

```txt
    // 类型缺失错误
    Unity: TypeLoadException: Could not load type 'Xxx' from assembly 'yyy'

    // 函数缺失错误
    MissingMethodException: xxxx
```

## 解决办法

标准解决办法是，根据日志错误日志确定哪个类型或函数被裁减，然后在link.xml里保留这个类型或函数，或者
在主工程里显式地加上对这些类或函数的调用。

如果不熟悉如何在link.xml保留这个类型或函数，请参阅[代码裁剪](https://docs.unity3d.com/Manual/ManagedCodeStripping.html)。

但这种办法终究很麻烦，实际项目中有大量被裁剪的类型，你一遍遍地进行"打包-类型缺失-补充-打包"的操作，
浪费了极多时间。 [hybridclr_unity package](/hybridclr/hybridclr_unity/)提供了一个便捷的生成脚本，
你运行菜单`HybridCLR/Generate/LinkXml`就能一键生成热更新工程里的所有AOT类型及函数引用。详细请看
hybridclr_unity package的文档说明。

## AOT类型及函数预留

hybridclr_unity的link生成脚本虽然可以智能地扫描出你当前引用的AOT类型，却不能预知你未来将来使用的
类型。因此你仍然需要有规划地提前在 `Assets/link.xml`(注意！不是自动生成的那个link.xml)预留你将来
可能用到的类型。切记不要疏漏，免得出现上线后某次更新使用的类型被裁剪的尴尬状况！
