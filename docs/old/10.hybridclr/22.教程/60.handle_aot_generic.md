---
title: 处理AOT泛型
date: 2022-09-29 12:31:29
permalink: /hybridclr/handle_aot_generic/
categories:
  - hybridclr
  - 文档
tags:
  - 
author: 
  name: Code Philosophy
  link: https://github.com/focus-creative-games
---

# 处理AOT泛型

你的热更新代码中总会用到一些主工程中没有用过的泛型，例如你在热更新里有如下代码

```csharp
  struct MyIntVec3
  {
    public int x;
    public int y;
    public int z;
  }

  var list = new List<MyIntVec3>();
  list.Add(new MyIntVec3{x =1});

  var arr = Array.Empty<MyIntVec3>();
```

由于`List<MyIntVec3>`或`Array.Empty<MyIntVec3>` 从未在AOT中出现过，如果未做任何处理，你是无法在热更新中运行这些代码的。

HybridCLR使用`补充元数据技术`彻底解决了这个问题，详细原理请自己查看[AOT泛型问题](/hybridclr/aot_generic/)。

粗略地说，你补充AOT泛型类的原始元数据后，就可以实例化这个泛型类了。以上面代码为例，你补充了List类和Array.Empty函数所在的`mscorlib.dll`元数据后，就可以在热更新代码中使用任意`List<T>`泛型类了。


## 代码中执行补充元数据

使用`HybridCLR.RuntimeApi.LoadMetadataForAOTAssembly`函数为AOT泛型补充元数据，详细文档请参见[hybridclr_unity](/hybridclr/hybridclr_unity/)。

```csharp
    public static List<string> AOTMetaAssemblyNames { get; } = new List<string>()
    {
        "mscorlib.dll",
        "System.dll",
        "System.Core.dll",
    };

    private static void LoadMetadataForAOTAssemblies()
    {
        // 不限补充元数据dll文件的读取方式，你可以从ab、StreamingAssets、或者裸文件下载等办法获得
        HomologousImageMode mode = HomologousImageMode.SuperSet;
        foreach (var aotDllName in AOTMetaAssemblyNames)
        {
            byte[] dllBytes = GetAssetData(aotDllName); // 获得某个aot dll文件所有字节
            // 加载assembly对应的dll，会自动为它hook。一旦aot泛型函数的native函数不存在，用解释器版本代码
            LoadImageErrorCode err = RuntimeApi.LoadMetadataForAOTAssembly(dllBytes, mode);
            Debug.Log($"LoadMetadataForAOTAssembly:{aotDllName}. mode:{mode} ret:{err}");
        }
    }
```

可以在任何时机加载补充元数据，只要在对应的AOT泛型使用之前即可，甚至在热更新代码中也可以随时调用这个接口来补充元数据。推荐较合理时间为加载热更新dll之前或者刚刚加载完成热更新dll，还未执行任何更新代码之前。

补充元数据的实现原理决定了它是可以热更的，不一定要随包带。如果上线后发现需要某个dll未补充元数据，可以通过热更新加上。不过上线后需要新增补充元数据dll的情况极少发生。

## 应该补充元数据的assembly列表

`HybridCLR/generate/AOTGenericReference` 命令生成的 AOTGenericReferences.cs 文件中包含了应该补充元数据的assembly列表，类似这样。你不需要运行游戏也能快速知道应该补充哪些元数据。

```csharp
	// {{ AOT assemblies
	// Main.dll
	// System.Core.dll
	// UnityEngine.CoreModule.dll
	// mscorlib.dll
	// }}
```

## 获得补充元数据dll

目前支持两种元数据模式，详细文档请参见[hybridclr_unity](/hybridclr/hybridclr_unity/)：

- `HomologousImageMode::Consistent`
- `HomologousImageMode::SuperSet`

如果使用 `HomologousImageMode::Consistent` 模式，则需要使用**打包过程中**生成的裁剪后的AOT dll，hybridclr_unity插件会自动复制到`{project}/HybridCLRData/AssembliesPostIl2CppStrip/{target}`。

如果使用 `HomologousImageMode::SuperSet` 模式，你既可以像 `HomologousImageMode::Consistent` 模式那样使用裁剪后的dll，也可以使用原始AOT dll。这在工作流上有很大便利性。

就跟热更新dll一样，你可以自由选择合适的方式将补充元数据dll加入你的热更新资源管理系统。既可以放StreamingAssets随包携带，也可以打ab包或裸数据等等形式。
