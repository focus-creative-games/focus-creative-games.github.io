---
title: hybridclr_unity package介绍
date: 2022-05-25 11:50:18
permalink: /hybridclr/hybridclr_unity/
categories:
    - HybridCLR
tags:
    -
author:
    name: Code Philosophy
    link: https:://code-philosophy.com
---

# hybridclr_unity

hybridclr_unity是一个Unity package，它提供了HybridCLR所需的Editor工作流工具脚本及Runtime脚本。借助
hybridclr_unity提供的工作流工具，打包一个支持HybridCLR热更新功能的App变得非常简单。


hybridclr_unity工具主要包含：

- Editor相关脚本
- Runtime相关脚本
- iOSBuild脚本

## 安装 

从git url安装 `com.focus-creative-games.hybridclr_unity` [gitee(推荐)](https://gitee.com/focus-creative-games/hybridclr_unity)或[github](https://github.com/focus-creative-games/hybridclr_unity) package。

不熟悉从url安装package的请看[install from giturl](https://docs.unity3d.com/Manual/upm-ui-giturl.html)。

由于国内网络原因，在unity中可能遇到网络异常而无法安装。你可以先把 `com.focus-creative-games.hybridclr_unity` clone或者下载到本地，然后再 [install from disk](https://docs.unity3d.com/Manual/upm-ui-local.html)。

或者更简单一点的做法，下载到本地后，将仓库文件夹目录改名为`com.focus-creative-games.hybridclr_unity`，直接复制到你们项目的`Packages`目录下即可。

## HybridCLR菜单介绍

### Installer...

提供一个方便的安装器，帮助正确设置本地il2cpp目录，其中包含替换`HybridCLRData/LocalIl2CppData-{platform}/il2cpp/libil2cpp`目录为HybridCLR修改版本。

安装器需要从匹配版本的Unity安装目录复制il2cpp(类似`C:\Program Files\Unity\Hub\Editor\2020.3.33f1\Editor\Data\il2cpp`)相关文件。

- 对于2019.4.40+、2021.3.26+、2021.3.0+ 版本，直接从该版本的安装目录复制il2cpp文件。
- 对于2020.3.16-2020.3.20版本，需要额外安装2020.3.26或更高版本，使用`HybridCLR/Installer`安装后再切回当前版本。
- 对于2019.4.0-2019.4.39版本，需要额外安装2019.4.40版本，使用`HybridCLR/Installer`安装后再切回当前版本。

安装界面中 `安装状态：已安装|未安装` 指示是否完成HybridCLR初始化。

安装界面中 `il2cpp_plus分支对应的Unity兼容版本的il2cpp路径` （**注意！1.1.7版本移除了此设置。**）必须满足几个条件：

- 必须是兼容的unity版本的il2cpp目录
- 路径中必须包含unity版本号（Installer用来识别Unity版本，以及用于防止新手选错目录）

如果路径合法，则界面显示正常，否则将会出现红色警告。

填写你要安装的hybridclr和il2cpp_plus仓库的branch或tag。如果hybridclr的版本号留空，则安装hybridclr仓库main分支的最新版本。
如果il2cpp_plus的版本号留空，则安装相应年度版本（如2020.3.33）分支的最新版本。

点击安装，如成功，则最后会显示`安装成功`日志，并且安装状态切换为`已安装`，否则请检查错误日志。

如果已经安装HybridCLR，点击安装按钮会安装最新的HybridCLR版本的libil2cpp。

### Compile Dll

对于每个target，必须使用目标平台编译开关下编译出的热更新dll，否则会出现热更新代码与AOT主包或者热更新资源的代码信息不匹配的情况。

不匹配时Unity会打印此类日志： `A scripted object (probably XXX?) has a different serialization layout when loading. Did you #ifdef UNITY_EDITOR a section of your serialized properties in any of your scripts?`。

借助Unity的`PlayerBuildInterface.CompilePlayerScripts`Api，hybridclr_unity提供一个编译各个target对应的热更新dll的编译脚本，编译完成后的热更新dll放到 `{project}/HybridCLRData/HotUpdateDlls/{platform}` 目录下。

开发者灵活选择恰当的方式去使用这些热更新dll。

### Generate

Generate下包含多种生成工具。

#### LinkXml

扫描热更新dll引用的AOT类型，生成link.xml，避免热更新脚本用到的AOT类型或函数被裁剪。输出的文件路径在 HybridCLRSettings.asset中`OuputLinkXml`字段中指定，默认为`LinkGenerator/link.xml`。

更具体的裁剪相关介绍请看[代码裁剪原理及解决办法](/hybridclr/code_striping/)。

#### AOTDlls

生成裁剪后的AOT dlls。脚本通过在一个临时目录导出工程，实现生成裁剪后的AOT dlls的目标。

注意，如果你没有用 `HybridCLR/Generate/All` 这样的一键生成命令，在你手动生成裁剪后 AOTDlls 前请先通过 `HybridCLR/Generate/LinkXml` 生成LinkXml。

#### MethodBridge

根据当前的AOT dll集扫描生成桥接函数文件。HybridCLRSettings.asset中`maxGenericReferenceIteration`字段指定了泛型递归扫描最大迭代轮数。大多数项目取
10以内即可。

更具体的桥接函数相关文档请看[桥接函数](/hybridclr/method_bridge/)文档。

#### AOTGenericReference

根据当前热更新dll扫描出所有产生的AOT泛型类型及函数的实例化，并生成一个**启发的**泛型实例化文件。

HybridCLRSettings.asset中`outputAOTGenericReferenceFile`字段指定了输出文件路径，`maxGenericReferenceIteration`字段指定泛型递归扫描的最大迭代次数。

由于将扫描出的泛型类型及函数转换为对应的代码引用比较麻烦，生成的所有泛型实例化代码都是**注释代码**，由开发者自己酌情转换为正确的实例化引用（**这个操作是可选的，可以完全不处理或只处理一部分**），即在AOT代码中实例化这注释中的泛型类或泛型函数。方法大致如下：

```csharp

    // System.Collections.Generics.List`1<System.Object>.ctor
    new List<object>();

    // System.Byte[] Array.Empty`1<System.Byte>()
    Array.Empty<byte>();

```

请在其他文件中添加泛型类型及函数的实例化引用，因为这个输出文件每次重新生成后会被覆盖。

这个泛型实例化文档只起到启发作用，告诉你可以aot泛型实例化哪些类和函数。使用补充元数据机制后，
**不作任何处理**也不影响正常运行。但如果手动对aot泛型实例化，可以提升性能。建议是对于少量性能敏感的类或函数手动泛型实例化即可，如`Dictionary<int,int>`之类。

更具体的AOT泛型相关文档请看[AOT泛型介绍](/hybridclr/aot_generic/)。

#### ReversePInvokeWrapper

为标记了`[MonoPInvokeCallback]`注解的热更新C#静态函数生成一个 ReversePInvokeWrapper函数。这样每个热更新C#静态函数将有一个唯一对应的c++函数，
可以被用于注册到lua之类的脚本语言中，并且被脚本语言调用。

HybridCLRSettings.asset中`reversePInvokeWrapperCount`字段指示生成的wrapper c++函数的个数，请预留足够多，确保超过热更新C#代码中标记了`[MonoPInvokeCallback]`注释的C#函数的个数。否则可能会抛出异常。

更具体的MonoPInvokeCallback介绍请看文档[MonoPInvokeCallback支持](/hybridclr/monopinvokecallback/)

#### Il2CppDef

生成当前Unity版本相关宏定义。类似如下：

```cpp

// Il2CppCompatibleDefs.h

#define HYBRIDCLR_UNITY_VERSION 2020333
#define HYBRIDCLR_UNITY_2020 1
#define HYBRIDCLR_UNITY_2019_OR_NEW 1
#define HYBRIDCLR_UNITY_2020_OR_NEW 1
```

#### DHEAssemblyList

**DHE版本**专有字段。

生成差分混合assembly列表代码。

因为HybridCLR需要在il2cpp初始化的阶段对差分混合执行assembly作预处理，目前以生成的assembly列表代码的方式提供给HybridCLR。

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

#### DHEAssemblyOptionDatas

**DHE版本**专有字段。

生成 差分混合assembly的配置数据。 

加载差分混合执行assembly需要一些配置数据。例如哪些函数发生变化是离线计算好的，这样不需要运行时判定函数是否发生变化了。配置数据在调用`RuntimeApi::LoadDifferentialHybridAssembly` 作为参数传入。

#### All

一键执行上面4种生成操作。

## HybridCLR 配置

点击菜单 `HybridCLR/Settings` 打开配置界面。下面是字段详细说明。

### enable

是否开启HyridCLR热更。默认true。如果为false,则打包不再包含HybridCLR功能。

### useGlobalIl2cpp

是否使用全局安装位置，即editor安装位置下的il2cpp目录。默认false。一般只有打包WebGL时才需要`useGlobalIl2cpp=true`。

注意，就算 `useGlobalIl2Cpp=true`，安装时仍然会复制il2cpp到HybridCLRData目录。
需要手动将 `{project}/HyridCLRData/LocalIl2CppData-{platform}/il2cpp/libil2cpp` 目录替换 editor安装目录下的对应目录。另外运行`HybridCLR/Generate/*`执行生成操作，输出目录仍然是本地目录，需要自己手动复制替换全局安装位置的libil2cpp目录。

### hybridclrRepoURL

hybridclr仓库的地址，默认值为 `https://gitee.com/focus-creative-games/hybridclr`。

### il2cppPlusRepoURL

il2cpp_plus 仓库的地址，默认值为 `https://gitee.com/focus-creative-games/il2cpp_plus`。

### hotUpdateAssemblyDefinitions

以assembly definition(asmdef) 形式定义的热更新模块列表，它与下面的`hotUpdateAssemblies`是等效的，只不过编辑器下拖入asmdef模块比较方便，也不容易失误写错名称。

`hotUpdateAssemblyDefinitions`和`hotUpdateAssemblies`合并后构成最终的热更新dll列表。同一个assembly不要在两个列表中同时出现，会报错！

### hotUpdateAssemblies

有一些assembly以dll形式存在，例如你在外部工程中创建的热更新dll，又如你直接使用Assembly-CSharp作为你的热更新dll。由于没有对应的asmdef文件，只能以dll名称形式手动配置。

填写assembly名称时不要包含'.dll'后缀，像`Main`、`Assembly-CSharp`这样即可。

asmdef形式的assembly，你也可以选择不加到`hotUpdateAssemblyDefinitions`，而是加到`hotUpdateAssemblies`。不过这样不如直接拖入列表方便，你自己酌情选择。

`hotUpdateAssemblyDefinitions`和`hotUpdateAssemblies`合并后构成最终的热更新dll列表。同一个assembly不要在两个列表中同时出现，会报错！

### preserveHotUpdateAssemblies

预留的热更新dll名字列表。有时候想在将来新增一些热更新dll，并且期望这些新的热更新dll的脚本能够挂载到资源上。如果直接将热更新dll名加到 hotUpdateAssemblies则会报assembly不存在的错误。preserveHotUpdateAssemblies字段用来满足这种需求。打包时不检查这些dll的有效性，并且会将它们添加到scriptingassemblies.json之类的assembly列表文件中。

填写assembly名称时不要包含'.dll'后缀，像`Abc`这样即可。

### hotUpdateDllCompileOutputRootDir

编译后的热更新dll的输出根目录。最终输出目录在该目录的平台子目录下，即 `${hotUpdateDllCompileOutputRootDir}/{platform}`。

### externalHotUpdateAssemblyDirs

自定义外部热更新dll的搜索路径。有一些框架或项目的热更新项目放到Unity外部，编译出的dll也在外部。这个参数提供了一个热更新dll
的搜索路径，这样不需要每次将外部dll复制到工程里或者复制到 hotUpdateAssemblies 目录了。

- 按搜索路径的顺序搜索，排在越前的优先级越高。
- 搜索路径必须是相对位置，相对于项目根目录（即Assets的**上级目录**）。即填`mydir`，搜索`{proj}/mydir`。
- 每个路径`dir`，会先尝试搜索`{dir}/{platform}`，再尝试搜索`{dir}`。这样做为了兼顾平台特殊性及通用性。

下面展示一个使用示例。你有一个外部dll，它的位置为 `{proj}/MyDir1/MyDir2/Foo.dll`，则你应该：
- 在 hotUpdateAssemblies 添加 `Foo`
- 在 externalHotUpdateAssemblyDirs 里添加目录 `MyDir1/Mydir2`

### strippedAOTDllOutputRootDir

裁剪后的AOT dll的暂存目录。最终目录在该目录的平台子目录下，即 `${strippedAOTDllOutputRootDir}/{platform}`。

### patchAOTAssemblies

补充元数据AOT dll列表。package本身没有用到这个配置项。但它提供了一个配置AOT dll列表的地方，方便开发者在自己的打包流程中使用，这样就不用开发者单独再定义一个AOT dll配置脚本了。

填写assembly名称时不要包含'.dll'后缀，像`Main`、`Assembly-CSharp`这样即可。

### differentialHybridAssemblies

**注意！1.1.7版本移除了此字段。**

差分混合执行的assembly列表。差分混合执行的assembly与纯热更新的assembly不是同一类assembly，不能同时出现在hotUpdateAssemblies列表中。

### differentialHybridOptionOutputDir

**注意！1.1.7版本移除了此字段。**

差分混合执行的assembly的运行时配置参数。

需要向差分混合执行的assembly传递一些配置参数，比如说哪些函数发生变化了。这些配置数据是 `LoadImageErrorCode RuntimeApi::LoadDifferentialHybridAssembly(byte[] dllBytes, byte[] optionBytes)` 的optionBytes参数.

### collectAssetReferenceTypes

收集资源中引用的脚本类型，加入到 `HybridCLR/Generate/LinkXml` 的保留集。

### outputLinkFile

运行菜单`HybridCLR/Generate/LinkXml`命令时，输出的link.xml文件路径。

千万不要指向 `Assets/link.xml`，那个link.xml一般用来手动预留AOT类型，而这个自动输出的link.xml每次都会覆盖。

### outputAOTGenericReferenceFile

运行菜单`HybridCLR/Generate/AOTGenericReference`时输出的AOT泛型实例化集合文件的路径。

### maxGenericReferenceIteration

运行菜单`HybridCLR/Generate/AOTGenericReference`时，生成工具递归分析AOT泛型实例化的迭代次数。

因为泛型函数中可能会间接使用了新的泛型类和泛型函数，因此需要多轮迭代才能分析出所有的泛型实例化，`maxGenericReferenceIteration`参数用于控制迭代次数。这个参数一般10以内就够了，你通过观察日志
能看到几轮迭代后计算终止，如果迭代终止时还有大量泛型未计算迭代，可以适当增加这个值。

为什么不反复迭代直至计算出所有泛型实例化呢？因为有可能出现永远无法计算完的情况。如下代码，AOT.Show()
由于递归泛型实例化，永远也无法计算完。

```csharp

    struct AOT<A>
    {

        public void Show()
        {
            var a = new AOT<AOT<A>>();
            a.Show();
        }
    }

```

### maxMethodBridgeGenericIteration

运行菜单`HybridCLR/Generate/MethodBridge`时，生成工具递归分析AOT泛型实例化的迭代次数。含义与`maxGenericReferenceIteration`相似。

## Editor相关工具

主要包含以下功能：

- 初始化HybridCLR
- 检查和修复设置
- 打包时自动排除热更新assembly
- 打包时将热更新dll名添加到assembly列表
- 备份裁剪后的AOT dll
- 生成一些打包需要的文件和代码
- 编译用于目标平台的热更新dll

### 初始化HybridCLR

运行`HybridCLR/Installer...`菜单命令完成初始化操作。详细见上面的菜单命令介绍。

### 检查和修复设置

属于打包工作流的一部分，相关代码在 `Editor/BuildProcessors/CheckSettings.cs`中。

包含以下操作：

- 根据是否开启HybridCLR，设置或者清除UNITY_IL2CPP_PATH环境变量。脚本中修改的UNITY_IL2CPP_PATH环境变量是本进程的环境变量，不用担心干扰了其他项目。
- 如果检测到意外开启增量式GC，自动关闭这个选项。
- 如果HybridCLRSettings里未设置任何热更新assembly，提示错误。


### 打包时自动排除热更新assembly

属于打包工作流的一部分，相关代码在 `Editor/BuildProcessors/FilterHotFixAssemblies.cs`中。

很显然，热更新assembly不应该被il2cpp处理并且编译到最终的包体里。我们处理了`IFilterBuildAssemblies`回调，
将热更新dll从build assemblies列表移除。

脚本中会额外检查是否写错assembly名字，以及是否失误配置了重复的assembly。

### 打包时将热更新dll名添加到assembly列表

属于打包工作流的一部分，相关代码在 `Editor/BuildProcessors/PatchScriptingAssemblyList.cs`中。

工具在打包时，会自动将热更新assembly的dll名加入assembly列表配置文件。

热更新MonoBehaviour脚本所在的assembly的dll名必须添加到assembly列表配置文件，Unity的资源管理系统才能正确识别
和还原热更新脚本。更详细的原理介绍请看 [使用热更新MonoBehaviour](/hybridclr/monobehaviour/) 。

### 备份裁剪后的AOT dll

属于打包工作流的一部分，相关代码在 `Editor/BuildProcessors/CopyStrippedAOTAssemblies.cs`中。

当补充元数据模式为`HomologousImageMode::Consistent`时，需要使用打包时生成的裁剪后的AOT dll。因此会自动将打包过程中生成的裁剪后的AOT dll
复制到 `{project}/HybridCLRData/AssembliesPostIl2CppStrip/{platform}`目录，方便将来处理。

当数据模式为`HomologousImageMode::SuperSet`时，可以直接使用原始的aot dll。这个优点是工作流上便利一些，不用每次打包后更新aot dll，缺点是多占了内存，同时大幅增加了裁剪dll的大小，请使用者自己权衡使用原始还是裁剪后的aot dll。

`补充元数据` 更详细的原理性文档请看 [AOT泛型原理](/hybridclr/aot_generic/)

### 生成一些打包需要的文件和代码

包含以下几个生成功能：

- 扫描生成link.xml
- 生成桥接函数
- 生成AOT泛型实例化代码
- 生成ReversePInvokeCallback相关wrapper文件

菜单`HybridCLR/Generate/*`中包含了这些生成命令，请看上面的介绍文档。

## iOSBuild脚本

package中 `Editor/Data~/iOSBuild` 包含了编译iOS版本libil2cpp.a所需的脚本。在运行`HybridCLR/Installer...`菜单命令成功初始化HybridCLR后，会自动复制到`{project}/HybridCLRData/iOSBuild`目录。**后续操作必须在`{project}/HybridCLRData/iOSBuild`目录进行**。

build libil2cpp.a的具体操作请看文档 [iOS平台打包](/hybridclr/build_ios_libil2cpp/)。

## Runtime相关脚本

包含运行时用到的类。目前比较简单。

### LoadImageErrorCode

加载热更新dll的错误码。

### 元数据模式 HomologousImageMode

目前支持两种元数据模式：

#### `HomologousImageMode::Consistent` 模式

即补充的dll与打包时裁剪后的dll精确一致。因此必须使用build过程中生成的裁剪后的dll，则不能直接复制原始dll。我们在`HybridCLR.BuildProcessors.CopyStrippedAOTAssemblies`里添加了处理代码，在打包时自动将这些裁剪后的dll复制到 `{project}/HybridCLRData/AssembliesPostIl2CppStrip/{target}` 目录。

#### `HomologousImageMode::SuperSet` 模式

即补充的dll是打包时裁剪后的dll的超集，包含了裁剪dll的所有元数据。一个最简单易得的超集dll为原始aot dll，这也是推荐使用的超集dll。

- 原始UnityEngine相关AOT dll在Unity安装目录的PlayBackEngines子目录下
- 原始的.net核心AOT dll如mscorlib.dll在Unity安装目录的 `unityaot{xxx}` 目录下。2019-2020统一为unityaot目录，2021起拆分成多个目录，如果打包android取unityaot-linux、如果打包iOS取unityaot-macos。
- 插件的AOT dll为工程目录中的相应平台的原始dll。如果是源码形式，则为编译好的dll，取`HybridCLR/HotUpdateDlls/{platform}`目录下的相应dll即可

以Unity 2020.3.33版本Win下的Win64目标为例：

- mscorlib.dll在 `{editor}/Editor/Data/MonoBleedingEdge/lib/mono/unityaot`
- UnityEngine.CoreModule.dll 在 `{editor}/Editor/Data/Playbackengines/windowsstandalonesupport/Variations/il2cpp/Managed`
- protobuf-net.dll 为你的工程中的原始`protobuf-net.dll`
- 你的AOT模块Main对应的AOT dll为 `HybridCLR/HotUpdateDlls/{platform}/Main.dll`

`SuerSet`模式也可以使用`Consistent`模式的裁减后的dll，因为自己显然包含自身的所有元数据。但`SuperSet`模式主要为了简化工作流，避免`Consistent`模式经常出现的`metadata not match`的问题，因此除非要极致优化内存，强烈推荐使用原始AOT dll。

### RuntimeApi

底层的操作HybridCLR的工具类。比较常用的有几个

- `LoadImageErrorCode LoadMetadataForAOTAssembly(byte[] dllBytes, HomologousImageMode mode)` 用于加载补充元数据assembly。
- `LoadImageErrorCode LoadDifferentialHybridAssembly(byte[] dllBytes, byte[] optionBytes)` 加载差分混合执行assembly。**DHE版本**专有函数。

### UnchangedAttribute

**DHE版本**专有类型。

对于 差分混合执行assembly，用于手动指定哪些函数是否发生变化。变化的函数以interpreter模式执行，未变化的以原生AOT方式执行。

当前出于演示目的，未变化的函数需要手动标记，后面的正式版本会自动计算，基本用不上这个特性。

### ReversePInvokeWrapperGenerationAttribute

每个带 `[MonoPInvokeCallback]` 特性的函数都需要一个唯一对应的wrapper函数。这些wrapper函数必须是打包时预先生成，不可变化。
因此如果后续热更新新增了 带 `[MonoPInvokeCallback]` 特性的函数，则会发生wrapper函数不足的情况。

ReversePInvokeWrapperGenerationAttribute 用于为当前添加了 `[MonoPInvokeCallback]` 特性的函数预留指定数量的wrapper函数。

在如下示例中，为LuaFunction签名的函数预留了10个wrapper函数.

```csharp
    delegate int LuaFunction(IntPtr luaState);

    public class MonoPInvokeWrapperPreserves
    {
        [ReversePInvokeWrapperGeneration(10)]
        [MonoPInvokeCallback(typeof(LuaFunction))]
        public static int LuaCallback(IntPtr luaState)
        {
            return 0;
        }

        [MonoPInvokeCallback(typeof(Func<int, int, int>))]
        public static int Sum(int a, int b)
        {
            return a + b;
        }

        [MonoPInvokeCallback(typeof(Func<int, int, int>))]
        public static int Sum2(int a, int b)
        {
            return a + b;
        }

        [MonoPInvokeCallback(typeof(Func<int>))]
        public static int Sum3()
        {
            return 0;
        }
    }
```