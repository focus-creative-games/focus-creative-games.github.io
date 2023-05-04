---
title: Differential Hybrid Execution
date: 2022-05-25 11:50:18
permalink: /hybridclr/differential_hybrid_execution/
categories:
    - HybridCLR
tags:
    -
author:
    name: Code Philosophy
    link: https:://code-philosophy.com
---

# Differential Hybrid Execution

HybridCLR开创性地实现了 Differential Hybrid Execution(DHE) 差分混合执行技术。即可以对AOT dll任意增删改，会智能地让变化或者新增的类和函数以interpreter模式运行，但未改动的类和函数以AOT方式运行，让热更新的游戏逻辑的运行性能基本达到原生AOT的水平。

DHE只提供**商业化版本**，具体请见[商业化服务](/hybridclr/price/)

## 安装

`HybridCLR/Installer`中完成安装后，手动将修改版本libil2cpp复制到`{project}/HyridCLRData/LocalIl2CppData-{platform}/il2cpp/libil2cpp`，完成安装。

## 配置

### 配置需要差分混合执行的assembly

通过`HybridCLR/Settings` 菜单打开配置对话框，将需要差分混合执行的assembly加入到 differentialHybridAssemblies (差分混合执行 dlls)。

差分混合执行assembly与普通的纯热更新assembly的工作流不一样，因为纯热更新assembly不需要打包到主工程中。因此同一个assembly不能同时加入
differentialHybridAssemblies和hotUpdateAssemlies列表。

必须在执行差分混合执行assembly的任何代码之前执行`RuntimeApi::LoadDifferentialHybridAssembly`，因此不是所有assembly都可以配置成为差分混合执行assembly，因为mscorlib这样的系统assembly运行时机很早。

所幸像mscorlib这样的assembly也没有差分混合执行的需求。而大多数游戏逻辑assembly都是在热更之后再执行的，满足差分混合执行的条件。

### 配置 差分混合执行的assembly的配置数据的导出目录

配置 HybridCLRSetting中 `differentialHybridOptionOutputDir` 字段。使用`HybridCLR/generate/DHEAssemblyOptionDatas` 会为每个差分混合assembly生成一个  `<assembly>.dhao.bytes` 文件 。

加载差分混合执行assembly需要一些配置数据。例如哪些函数发生变化是离线计算好的，这样不需要运行时判定函数是否发生变化了。配置数据在调用`RuntimeApi::LoadDifferentialHybridAssembly` 作为参数传入。

## 标记函数信息

目前已经可以自动计算变化的函数，不需要手动操作。但也支持手动使用`[Unchanged]`标注哪些函数未发生变化。

## 代码中使用

运行时，完成热更新后，对于每个混合执行 assembly，调用 `RuntimeApi::LoadDifferentialHybridAssembly` 加载热更新assembly。

一定要按照assembly的依赖顺序加载 差分混合执行 assembly。

示例代码如下。

```csharp
void InitDifferentialHybridAssembly(string assemblyName)
{

    LoadImageErrCode err = RuntimeApi::UseDifferentialHybridAOTAssembly(GetAssemblyData(assemblyName), GetAssemblyOptionData(assemblyName));
}
```
## 打包

### Player Building 设置

- 关闭 development build 选项

### `HybridCLR/generate/DHEAssemblyList`

打包前需要执行 `HybridCLR/generate/DHEAssemblyList` 命令。因为HybridCLR需要在il2cpp初始化的阶段对差分混合执行assembly作预处理，目前
以生成的assembly列表代码的方式提供给HybridCLR。

示例如下:

```cpp
    // Il2CppCompatibleDefs.cpp 文件

	const char* g_differentialHybridAssemblies[]
	{

	//!!!{{DHE
        "Assembly-CSharp",
	//!!!}}DHE
		nullptr,
	};

```

### `HybridCLR/generate/DHEAssemblyOptionDatas`

使用 `HybridCLR/generate/DHEAssemblyOptionDatas` 生成 相关配置数据文件，酌情配合实际项目的打包流程使用。

注意！由于 DHEAssemblyOptionDatas 的工作原理是对比最新的`DHE dll`与AssembliesPostIl2CppStrip目录下的aot dll的代码，离线生成变化的函数及类型信息。因此请确保AssembliesPostIl2CppStrip下的aot dll为上一次对外发布的app打包时生成的 aot dll，否则会出现计算错误！


