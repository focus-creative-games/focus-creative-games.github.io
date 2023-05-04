---
title: 限制事项
date: 2022-05-25 11:50:18
permalink: /hybridclr/limit/
categories:
  - HybridCLR
tags:
  - 
author: 
  name: Code Philosophy
  link: https:://code-philosophy.com
---
# 限制

::: danger 不在限制事项中的特性HybridCLR都支持
请不要再问HybridCLR是否支持某个功能。
:::

- 暂不支持增量式gc。由于时间紧凑，来不及仔细处理增量式gc的memory barrier细节。这个问题会在后面解决。
- 暂时不支持在热更新脚本中定义extern函数，但可以调用AOT中extern函数。
- 支持Unity Jobs库，但无法利用burst加速。如果burst部分在AOT，则仍然原生方式执行；如果burst部分在热更部分，则虽然是Jobs并发执行，但以解释方式执行。
- 不支持`System.Runtime.InteropServices.Marshal`中 `Marshal.StructureToPtr`之类序列化结构的函数，但普通Marshal函数如`Marshal.PtrToStringAnsi`都是能正常工作的。
- 不支持[RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.xxx)]。纯粹是时机问题，Unity收集这些函数的时机很早，此时热更新dll还没加载。建议换一种方式。
- 支持函数级别的profile, 但不支持手动调用 `UnityEngine.Profiling.Profiler.BeginSample` 对代码段进行profile。
