---
title: 常见错误
date: 2022-08-23 09:00:00
permalink: /hybridclr/common_errors/
categories:
  - HybridCLR
  - errors
tags:
  - 
author: 
  name: Code Philosophy
  link: https:://code-philosophy.com
---

# 常见错误

目前提交的版本都经过测试，基本不可能出现编译错误及崩溃或者基础的运行错误。如果查看了常见错误，还未能解决问题，请将hybridclr_unity、hybridclr、il2cpp_plus更新到最新版本，再试一次。

如果仍然没有解决问题，可以加入以下群：

- 新手1群：428404198。新手使用过程中遇到问题，都可以在群里咨询。
- **悬赏互助群**：762953653。悬赏提问，快速解决问题。

## Unity Editor下的错误

### 点击 `HybridCLR/Setting`，未能找到HybridCLR设置界面

删除 `ProjectSettings/HybridCLRSettings.asset`文件即可。如果仍未显示，则重启Unity Editor。

### Installer点击安装出现：git不是内部或外部命令，也不是可运行的程序

最常见原因为git未安装（Windows 下安装 [GitForWindows](https://gitforwindows.org/)。其他平台请自己酌情安装），或者安装git后未重启UnityEditor和UnityHub。如果你确信安装了git，cmd中也确实能运行git，则尝试重启电脑。

### 使用Installer安装时发生 DirectoryNotFoundException: Counld not find a part of the path 'xxx'

有几种原因：

- 如果出错目录不存在，则因为网络或者各种原因，git clone hybridclr或il2cpp_plus仓库失败了。 此时你可以重试几次。
- 如果出错目录存在，则因为路径长度超过256字符导致。请避免过深的目录。

### Exception. region:UNITY_CONFIG start not find

hybridclr_unity版本过低。请升级最新版本。


### Exception. region:PLACE_HOLDER start not find

hybridclr_unity为较新版本，但hybridclr代码太旧导致。

要求你的 hybridclr及il2cpp_plus必须是main分支，并且更新到最新。

### Exception. region:XXXXXX start not find

hybridclr_unity 与 hybridclr及il2cpp_plus版本不匹配导致。

要求相同版本分支，并且同时更到最新（或者相匹配的版本，但大多数人很难知道哪个是相匹配的版本）。

### 运行 `HybridCLR/generate/xxx` 时发生 `Exception: resolve assembly: yyyAssembly fail`

如果 yyyAssembly为`netstandard`，则你需要将Build Settings中Api Compatible Level切为 .Net 4.x或.Net Framework。

否则是因为这个生成依赖于裁剪后的aot dll，而此时aot dll还未生成。有几种原因导致这个结果：

- 你从未在主工程中使用过跟该dll相关代码，导致就算link.xml中保留了，仍然整个被裁剪。解决办法是在主工程中随便写段代码引用该dll中的某个类或函数。
- Unity2021版本，打包iOS平台，使用低于2.0.1版本hybridclr_unity，同时未修改 UnityEditor.CoreModule.dll文件，导致未获得裁剪后的dll。解决办法是升级hybridclr_unity到2.0.1及更高版本或者按照文档[修改Unity编辑器相关dll](/hybridclr/modify_unity_dll/)修改UnityEditor.CoreModule.dll。
- 你开启了 collectAssetReferenceTypes 选项，它会导致依赖aot dll来生成link.xml，形成死循环。解决办法是 关闭它或者先手动build一次项目。
- 其他原因。万能的解决办法是手动build一次项目生成aot dll。

 详细请看 [HybridCLR打包工作流](/hybridclr/build_pipeline/)中
生成桥接函数 这一节的文档。

### 运行 `HybridCLR/generate/xxx` 时发生 `NullReferenceException. HybridCLR.Editor.ABI.TypeCreatorBase.CreateTypeInfo ...`

如果你的hybridclr_unity package版本低于 1.1.6,则因为你的项目中存在 mscorlib.dll、System.Memory.dll、UnityEngine.dll等跟系统dll重名的冲突dll，导致解析dll时错误地读取了这些dll，进而发生错误。

如果版本 >= 1.1.6, 由于生成桥接函数需要依赖裁减后的AOT dll，而你的AOT dll是旧的，导致热更新代码中依赖的类型在AOT dll中因为卸载而缺失了。因此你需要先 `generate/linkxml`，再build或者导出工程以生成裁剪后的aot dll，再运行你当前的 `generate/xxx` 命令。 详细请看 [HybridCLR打包工作流](/hybridclr/build_pipeline/)中
生成桥接函数 这一节的文档。

### 运行 `HybridCLR/generate/xxx` 时发生 `DHE start not found`

mian分支已经移除了DHE相关的代码，相应的package版本1.1.6也移除了DHE相关生成。这个错误是因为你package版本低于1.1.6，但install了最新`hybridclr+il2cpp_plus`代码导致。

解决办法是升级package到1.1.6及更高版本。或者将package回退到1.0分支的版本，同时install 1.0分支相关的`hybridclr+il2cpp_plus`代码。

### 打包iOS版本时未生成 AssembliesPostIl2CppStrip 目录

Unity 2021版本打包`iOS平台`时，由于Unity Editor未提供公开接口可以复制出target为iOS时的裁剪后的AOT dll，故必须使用修改后的UnityEditor.CoreModule.dll覆盖Unity自带的相应文件。

详见 [安装HybridCLR](/hybridclr/install/) 及 [修改Unity编辑器相关dll](/hybridclr/modify_unity_dll/)。

### BuildFailedExceptoin: Build path contains a project prevously built without the "Create Visual Studio Solution"

运行 `generate/all`或者`generate/AOTDlls`时，会尝试进行导出工程以获得裁剪后的aot dll。如果你的项目之前打包时关闭了 `Create Visual Studio Solution` 选项，则Unity Editor自身原因，一定概率下会出现这个错误。

解决办法是清空 Library和Temp下的 il2cpp 相关缓存目录，或者简单粗暴删除这两个目录。

如果还是遇到这个问题，你完全可以自己手动build一次工程来生成aot dll，然后跳过 `generate/AOTDlls`这一步。

### Project Settings里面没有 HybridCLR Settings

HybridclrSettings.asset 文件因为版本更迭的原因，配置无法兼容导致加载出错。

解决办法为 删除 `ProjectSettings/HybriclrSettings.assets` 文件。

## 打包时发生错误


### Currently selected scripting backend (IL2CPP) is not installed

请在Unity Hub安装il2cpp模块。操作方式为：

- 切到UnityHub左侧的 Installers 标签页
- 你在当前使用的Unity版本上 `右键 -> Add Modules`，选中当前平台的IL2CPP组件，例如Win平台选 `Windows Build Support(Il2CPP)`
- 安装
- 重新打开Unity Editor

### `Exception: C++ code bulider is unable to build C+ code. Inorder to build C++ code for Windows Destop, You must have one of these installed. xxxxx

你没有安装 vs 及 win 10 sdk。请安装vs，并且在 Visutal Studio Installer中安装 `使用c++的游戏开发` 这个组件。 win 10 sdk选最新的即可。

### 遇到Undefined symbols for architecture arm64:"Il2CppCodeGenWriteBarrier(void**, void*)", referenced from:...

取消PlayerSetting中`Increasemental GC`选项。

### 遇到 Undefined symbols for architecture arm64:  "_objc_msgSend$initWithName:", referenced from:      il2cpp::os::TimeZoneInfo::GetTimeZoneDataForID

xcode版本太旧导致。更新到较新版本。

### 打包iOS时出现 Undefined symbols： RuntimeApi_LoadMetadataForAOTAssembly 或 HuatuoApi_LoadMetadataForAOTAssembly

因为 你使用的是原始libil2cpp.a或者过时的libil2cpp.a。请根据 [build iOS libil2cpp.a](/hybridclr/build_ios_libil2cpp/) 文档编译最新的。然后替换xcode项目中的libil2cpp.a文件

### Building Library/Bee/artifacts/xxxx failed with output: Fatalerror in Unitiy CIL Linker Mono.Cecil.AssemblyResolutionException: Failed to resolve assembly:'xxx'

你失误地在主工程里引用 'xxx' 这个热更新dll。 如果你找不到到底哪儿引用的，可以尝试先删掉 'xxx' 这个热更新模块，根据编译错误来定位。

### WebGL平台打包时遇到 undefine symbol: send file 之类的错误

这个错误跟HybridCLR无关。 这是因为WebGL对很多函数有限制，比如说send file符号丢失是因为不能调用IO相关函数。

遇到问题请自己剔除那些WebGL平台不支持函数。具体自己阅读Unity文档。

### Win 下 打包时遇到 xxxx\il2cpp\libil2cpp\utils\Il2CppHashMap.h(71): error C2039: 'hash_compare': is not a member of 'stdext'

这是.net 7发布后最新版本vs改动打破了一些向后兼容性引起。你可以回退2022的旧版本或者使用2019之类的版本。

一种不需要回退vs版本的解决办法是修改 `HybridCLRData/LocalIl2CppData-{platform}/il2cpp/external/google/sparsehash/internal/sparseconfig.h`，新增 `#define _SILENCE_STDEXT_HASH_DEPRECATION_WARNINGS` 即可。可参照下图修改。

![stdext_error](/img/hybridclr/stdext_error.jpg)

其他解决办法参见[链接](https://forum.unity.com/threads/workaround-for-building-with-il2cpp-with-visual-studio-2022-17-4.1355570/)

### fatal error: 'icalls/mscorlib/System/MonoType.h' file not found #include "icalls/mscorlib/System/MonoType.h"

hybridclr依赖版本宏来同时支持2019-2021的il2cpp。hybridclr代码中版本宏默认是2020版本，如果你使用的不是2020，则会因为版本宏不正确而发生编译错误。你必须将hybridclr_unity更新了0.10.0或更高版本，再运行  `HybridCLR/generate/il2cppdef` 来生成正确的版本宏。

### Internal build system error. BuildProgram exited with code -2147024894.


```text
Internal build system error. BuildProgram exited with code -2147024894.
System.IO.FileNotFoundException: Could not load file or assembly 'Unity.IL2CPP.Bee.BuildLogic.WindowsDesktop, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'. 
File name: 'Unity.IL2CPP.Bee.BuildLogic.WindowsDesktop, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
```

这是因为你Installer中安装后切换了Unity项目的版本，导致Build Tool不匹配导致。解决办法为在`HybridCLR/Installer...`中重新安装一次即可。

### 打包时出现 DirectoryNotFoundException: xxxx\Library\Bee\artifacts\yyyy\ManagedStripted 错误

你错误地设置 Scripting BackEngine 为 mono导致的。有时候你尽管之前已经切到il2cpp了，但切换平台时仍然可能被Editor重置为mono。解决办法为切换到il2cpp即可。

### 打包WebGL平台时出现 DirectoryNotFoundException: xxx\HybridCLRData\LocalIl2CppData-{yyy}\il2cpp\il2cpp-deps  错误

WebGL必须使用全局安装，即 HybridCLRSettings中useGlobal为true。 切记
每次`Generate/xxx`之后必须重新将`{project}/HyridCLRData/LocalIl2CppData-{platform}/il2cpp/libil2cpp`目录复制到Editor安装目录，再打包。否则有可能会出现 Scripting Missing或者桥接函数缺失之类的错误。

### 打包时出现 GC_set_mark_stck_empty 函数找不到或者签名不匹配的错误

这是自Unity2021.3.20起修改了这个函数签名引发的问题。更新到hybridclr_unity 2.0.10+ 版本，重新install即可解决。

### 打包WebGL平台出现 `build.js: undefined symbol: RuntimeApi_LoadMetadataForAOTAssembly (referenced by top-level compiled C/C++ code)`

WebGL使用全局安装，你没有将本地`{project}/HyridCLRData/LocalIl2CppData-{platform}/il2cpp/libil2cpp`替换Editor安装目录的原始libil2cpp，导致缺失了函数。解决办法是：
- 运行`HybridCLR/Generate/Il2cppDef`生成正确的版本宏
- 复制 `{project}/HyridCLRData/LocalIl2CppData-{platform}/il2cpp/libil2cpp` 替换Editor安装目录的原始libil2cpp。注意必须是替换目录，而不是合并目录，这个可能会导致多了一些文件而编译出错。你也可以使用创建软链接的方式，详细请看[安装HybridCLR](/hybridclr/install/)中关于全局安装的文档。

### 打包WebGL平台点击`Generate/All`发生错误

有两个原因：
- 没有替换全局安装位置的libil2cpp或者创建其软链接
- 你使用了hybridclr_unity 2.1.0或更高版本，在替换全局libil2cpp前没有先运行一次`HybridCLR/Generate/Il2cppDef`，导致没有正确生成版本宏，进而引发编译错误。

### 打包出现 `#error: "not support unity version"`

有几种原因：
- 你使用了 低于2019或者高于2021的版本，这些版本目前未被支持
- 你打包前未运行`HybridCLR/Generate/All`或者`HybridCLR/Generate/Il2CppDef`，导致未生成Unity版本宏

### 打包时出现 'could not find a part of path "xxxx/hybridclr/generated/UnityVersion.h"

你更新 hybridclr_unity包后未重新install，导致本地lil2cpp目录代码过旧。

### 打包里发现 "Undefined symbols for architecture arm64: "il2cpp::utils::Debugger::xxxxx"

原因是 build_libil2cpp.sh打包出的 libil2cpp.a是 release模式的，与development模式的工程一起编译时会出现编译错误。

解决办法是去掉development build选项，或者说自己修改 build_libil2cpp.sh，打包出 debug模式的libil2cpp.a

### 打包时出现编译错误，通用处理办法

很大程度是你的package 和 hybridclr c++代码版本不匹配导致的。 你需要：

- hybridclr_unity 更新到最新
- `HybridCLR/installer...` 里安装最新版本
- `HybridCLR/generate/all` 生成所有
- 打包


## 运行时错误

### EntryPointNotFoundException. Unable to find entry point named 'RuntimeApi_LoadMetadataForAOTAssembly' in 'GameAssembly`

你当前的scripting backend为mono，请切换到il2cpp。

### A scripted object (probably XXX?) has a different serialization layout when loading. Did you #ifdef UNITY_EDITOR a section of your serialized properties in any of your scripts?

主工程的AOT资源中引用了热更新脚本会导致这个错误。例如Resources下的资源引用了热更新脚本。

### 挂载在资源上的脚本出现 Script Missing 错误

有几种原因：

- 如果是iOS平台，有可能因为你在热更新dll列表变化后未`Generate/all`并且重新编译和替换libil2cpp.a文件。
- 如果你使用Unity 2021及以上版本，并且WebGL平台，需要hybridclr_unity版本 >= 2.0.9
- 如果是其他版本及平台，由于Unity的资源管理的实现机制，资源必须打包为AssetBundle才能正常恢复热更新脚本，放到Resource下不行。详情请看 [MonoBehaviour工作流](/hybridclr/monobehaviour/)。
- 如果你安装了最新的main分支的hybridclr，则要求hybridclr_unity package版本 >= 1.1.17

### 遇到  "This icall is not supported by il2cpp at System.AppDomain.Load"

有两种原因

1. 如果非ios平台，则因为未安装HybridCLR。请参照[安装HybridCLR](/hybridclr/install/)文档操作。
2. 如果ios平台，因为ios平台并不从源码编译libil2cpp，而是使预先编译好的libil2cpp.a，你需要替换xcode工程中的libil2cpp.a为HybridCLR的编译版本。编译方式请看[build libil2cpp.a for iOS](/hybridclr/build_ios_libil2cpp/)


### unsupported internal call for il2cpp. xxxx 

调用了一个Mono中存在，但在il2cpp未实现的函数。请修改代码，不要使用这些类和函数。

### 遇到Async 调用Editor和打包后执行不一致的问题

如果代码在async里抛了异常，又没有捕获异常，会导致悄无声息失败，目前万一在async里因为裁剪或者aot泛型原因出错，会出现这种没有任何错误提示的情况。从而导致出现行为不一致。

解决方案：捕获async异常，然后解决对应异常。

### 遇到 Unity: TypeLoadException: Could not load type 'XxxType' from assembly 'yyyAssembly'

分几情况：

#### 情况1：yyyAssembly 是 netstandard

这是因为你Player Settings里 `api compatible level` 设置为 .net standard。

目前支持.net standard 2.0和.net 4.x，但即使主工程打包用.net standard，热更新dll打包**必须用.net 4.x**。原因是unity使用.net standard打包时，会自动剥除.net standard的依赖，直接依赖最终的dll，导致主工程的dll列表中实际上不存在net standard这个dll，进而导致热更新dll加载时，找不到来自netstandard的对象。

解决办法为打包和编译热更新都用.net 4.x或者打包用.net standard 2.0但编译热更新部分时api compatible level切换为.net 4.x(2021 起改名为 .net framework)。

#### 情况2：yyyAssembly是 其他AOT assembly

这是unity代码裁剪引起的函数丢失，你使用常规的避免unity代码裁剪的方式处理即可。

按照Unity防裁剪原理，你在link.xml中添加对丢失代码类的引用即可，但这种事情费时费力。

HybridCLR提供了快捷的自动生成工具，运行菜单命令 `HybridCLR/Genrate/LinkXml` 根据热更新dll生成 link.xml。

**注意**，如果你发现在link.xml确实preserve了这个类，但仍然出现这种类型缺失的错误，这是Unity自身引起的。Unity要求必须在代码里引用过dll里的任意类，才会保留这个dll，link中的那些配置才会生效。因此需要你手动在代码里引用缺失的这个类所在的dll里的任意一个类即可。 

#### 情况3：yyyAssembly是热更新assembly

这是因为你没有按照依赖顺序加载热更新dll。例如，如果A依赖于B，那你应该先加载B，再加载A。

### 遇到  MissingMethodException xxx 错误

区分两种情况：

#### 情况1： MissingMethodException: AOT generic method isn't instantiated in aot module xxx 

有几个原因：

- 这是因为AOT泛型函数实例化缺失引起的
- 使用了Unity 2021并且 `Il2Cpp Code Generation` 选项为 `faster runtime`，导致生成的代码为完全泛型模式，所有泛型函数签名均发生变化。如果没有补充元数据，调用即使已经在AOT中实例化的泛型函数，仍然会出现这个错误。
- 微信小游戏转换工具，默认会将IL2CPP Code Generation设置为Faster(Smaller) builds模式，如果未补充元数据，会导致无法访问AOT泛型函数。

原因1的解决办法为：

- 错误日志告诉你缺失哪个AOT函数实例化，你就在主工程里加上对这个函数的调用，使得il2cpp在打包时能生成这个泛型函数的代码。 主工程里任意地方加个这个泛型AOT函数调用都可以，目前一般集中加到 RefTypes.cs 这个文件里。
- 使用补充元数据技术

原因2的解决办法为：

- 使用补充元数据技术

原因3的解决办法：

- 使用补充元数据技术
- 自己改微信工具源码，将BuildSettings中 `IL2CPP Code Generation` 设置为 `Faster`。


具体操作请看[AOT泛型原理介绍](/hybridclr/aot_generic/) 文档。


#### 情况2： 错误日志中未出现AOT generic method的字眼

这是unity代码裁剪引起的函数丢失，你使用常规的避免unity代码裁剪的方式处理即可。

按照Unity防裁剪原理，你在link.xml中添加对丢失代码类的引用即可，但这种事情费时费力。

HybridCLR提供了快捷的自动生成工具，运行菜单命令 `HybridCLR/Genrate/LinkXml` 根据热更新dll生成 link.xml

### 遇到'ExecutionEngineException: Image::ReadTypeFromResolutionScope ReadTypeFromResolutionScope.TYPEREF fail' 

由裁剪引起，裁剪的是类的内部类。处理方式同上。

### 遇到 ExecutionEngineException: metadata type not match

在 LoadMetadataForAOTAssembly 方法中，载入的dll，使用了裁剪之前的版本。应该使用裁剪之后的，具体使用可以参照hybridclr_trial项目。在BuildProcessor中，生成裁剪后的dll后，将dll拷贝到暂存目录。

### 遇到ExecutionEngineException: not support extern method: xxxx

有两种原因：

- 在热更新中定义了extern函数，这暂时不支持。解决办法是将extern函数移到AOT部分。
- 使用了SuperSet元数据格式，但补充元数据aot dll太旧，导致AOT中的泛型在补充元数据dll中找不到。解决办法是更新最新的AOT dll。

### 遇到ExecutionEngineException:method body is null. xxx::yyyy

原因同上。

### 遇到 ExecutionEngineException: GetManaged2NativeMethodPointer not support. xxxx 函数名

缺失 interpreter -> aot 方向的桥接函数。请先确认你的 hybridclr是最新代码， hybridclr_unity package也是最新版本，
并且已经生成最新的桥接函数。原理请参考 [桥接函数](/hybridclr/method_bridge/) 。

如果是iOS平台，则很大可能因为你没有生成最新的libil2cpp.a。

如果还有问题，请在群里反馈给管理员 技术支持。

### 遇到'ExecutionEngineException: NotSupportNative2Managed' 

缺失 aot -> interpreter 方向的桥接函数。请先确认你的 hybridclr是最新代码， hybridclr_unity package也是最新版本，
并且已经生成最新的桥接函数。原理请参考 [桥接函数](/hybridclr/method_bridge/) 。

如果还有问题，请在群里反馈给管理员 技术支持。

### ExecutionEngineException: Attempting to call method 'xxxx' for which no ahead of time (AOT) code was generated.

为出错的函数所在的dll补充元数据即可。

### MethodAccessException 错误

你失误开启了增量式GC导致对象内存覆盖。请在player settings里关闭增量式gc

### GetReversePInvokeWrapper fail. exceed max wrapper num of method

Wrapper函数不足。你需要为热更新中的添加了MonoPInvokeCallback特性的函数预留Wrapper函数，详见[MonoPInvokeCallback支持](/hybridclr/monopinvokecallback/)

### 使用addressable进行热更新时，加载资源出现 UnityEngine.AddressableAssets.InvlidKeyException: Exception of type 'UnityEngine.AddressableAssets.InvalidKeyException' was thrown. No Asset found with for key 'xxxx' 异常

原因是addressable默认加载时会初始化资源中的所有类型，而此时热更新dll还未加载，找不到相应热更新类型。

解决办法有如下几种：
- 使用LoadAsset<System.Object>接口加载后再强转
- 是关闭自动加载，然后手动加载热更新dll，再接着自动加载资源。参见视频[踩坑实战:将HybridCLR导入自己的项目并实现热更新](https://www.bilibili.com/video/BV1aP4y1o7xi/) 1:02:30起的内容。

### GameObject.GetComponent(string name) 接口无法获得组件

这是已知bug，跟unity的代码实现有关，只有挂载在热更新资源上热更新脚本才会有这个问题，通过代码中AddComponent添加的热更新脚本是可以用这个方法查找到。请改用 `GameObject.GetComponent<T>()` 或 `GameObject.GetComponent(typeof(T))`

### 使用 Unity.netcode.runtime 后出现 NotSupportNative2Managed 桥接函数缺失异常

原因是 在Unity.netcode.runtime.dll中 NetworkManager.RpcReceiveHandler 是internal， 定义如下

```csharp
internal delegate void RpcReceiveHandler(NetworkBehaviour behaviour, FastBufferReader reader, __RpcParams parameters);
```

导致生成工具没有为它生成桥接函数。但Unity又非常trick地在打包时为 标记了 `[ClientRpc]` 和 `[ServerRpc]` 的函数生成 RpcReceiveHandler 
处理函数，并且引用了 internal 的RpcReceiveHandler类！居然没报错。 导致出现桥接函数缺失的问题。


原始代码如下。

```csharp

public class NetworkPlayer : NetworkBehaviour
{

    public static string msgFromHost;
    public static string msgFromClient;


    [ClientRpc]
    public void SendMsgClientRpc(string msgFromHost)
    {
        NetworkPlayer.msgFromHost = msgFromHost;
    }


    [ServerRpc]
    public void SendMsgServerRpc(string msgFromClient)
    {
        NetworkPlayer.msgFromClient = msgFromClient;
    }
}

```


打包时生成的代码添加了几个函数，如下。

```csharp
public class NetworkPlayer : NetworkBehaviour
{
    public static string msgFromHost;

    public static string msgFromClient;

    [ClientRpc]
    public void SendMsgClientRpc(string msgFromHost)
    {
        // ...
    }

    [ServerRpc]
    public void SendMsgServerRpc(string msgFromClient)
    {
        // ...
    }

    static NetworkPlayer()
    {
      // NetworkManager.__rpc_func_table 在自己的代码里是无法访问的！因为它是internal
      NetworkManager.__rpc_func_table.Add(3066788814u, __rpc_handler_3066788814);
      NetworkManager.__rpc_func_table.Add(901396020u, __rpc_handler_901396020);
    }

    private static void __rpc_handler_3066788814(NetworkBehaviour target, FastBufferReader reader, __RpcParams rpcParams)
    {
        // ...
    }

    private static void __rpc_handler_901396020(NetworkBehaviour target, FastBufferReader reader, __RpcParams rpcParams)
    {
        // ...
    }

    internal override string __getTypeName()
    {
        return "NetworkPlayer";
    }
}

```

解决办法为你在AOT工程里也定义一个相同签名的delegate。

```csharp
    // 由于 __RpcParams也是internal的，我们这儿自己重新定义了一个一样的类型
    public struct __RpcParams
#pragma warning restore IDE1006 // restore naming rule violation check
    {
        public ServerRpcParams Server;
        public ClientRpcParams Client;
    }

    public delegate void MyRpcReceiveHandler(NetworkBehaviour behaviour, FastBufferReader reader, __RpcParams parameters);

```
