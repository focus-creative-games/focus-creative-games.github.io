---
title: 安装HybridCLR
date: 2022-05-25 11:50:18
permalink: /hybridclr/install/
categories:
    - HybridCLR
tags:
    -
author:
    name: Code Philosophy
    link: https:://code-philosophy.com
---

# 安装HybridCLR

这儿主要介绍安装过程，安装过程中涉及的参数及设置的详细文档请见[hybridclr_unity](/hybridclr/hybridclr_unity/)

## 安装前预备工作

- 安装 2019.4.40、2020.3.26、2021.3.0或更高版本。新手强烈推荐先用2020.3.33版本熟悉热更新后，再尝试自己项目的版本。如果你安装的hybridclr_unity版本号<=1.1.6，由于Installer使用路径中的版本号来判定Unity版本，**请确保安装路径中包含版本号**，例如 `d:\Unity2020.3.33`，1.1.7及更高版本移除此限制。
- 由于使用il2cpp backend，要求安装Unity时必须包含il2cpp 组件。如果未安装，请自行在UnityHub中安装。
- 安装相关开发SDK及IDE
    - Win下需要安装`visual studio 2019`或更高版本。安装时必须选中 `使用c++的游戏开发` 这个组件。如果你使用.net 7发布后的2022最新版本的vs，由于新版本vs与il2cpp有兼容性问题，发会生编译错误，请参照[常见错误](/hybridclr/common_errors/)中 `Win 下 打包时遇到 xxxx\il2cpp\libil2cpp\utils\Il2CppHashMap.h(71): error C2039: 'hash_compare': is not a member of 'stdext'` 问题的解决方式。
    - Mac下需要安装xcode较新版本，例如`xcode 13.4.1 macos 12.4`。最小支持版本是哪个我们未仔细验证过。
- 安装git


## 安装HybridCLR package

使用package manager的`install from git url`方式来安装hybridclr_unity package.

hybridclr_unity 的主仓库在 [github](https://github.com/focus-creative-games/hybridclr_unity) ,国内快速的镜像仓库在[gitee](https://gitee.com/focus-creative-games/hybridclr_unity)。

目前hybridclr_unity package有多个分支，其中：

- main分支为主分支。由于当前main分支也已经稳定，而且工作流更完善，新接入的项目强烈推荐直接安装main分支最新版本或 `>= 2.0.1` 的版本。
- 1.0为稳定分支。1.0分支已经稳定运行很久，已经经受过大量上线项目验证，但工具流上略繁琐一点，一些新bug可能不会快速合并到此分支，已经上线或者马上要上线（如一个月内）的项目，可以选择该分支。

目前main分支与1.0分支差别很小，都足以满足商业项目的稳定性要求，不用特别纠结选择哪个分支。

仓库地址：

- main分支地址为 `https://gitee.com/focus-creative-games/hybridclr_unity.git`
- 1.0分支地址为 `https://gitee.com/focus-creative-games/hybridclr_unity.git#1.0`
- 其他tag版本地址为 `https://gitee.com/focus-creative-games/hybridclr_unity.git#{tag}`

不熟悉从url安装package的请看[install from giturl](https://docs.unity3d.com/Manual/upm-ui-giturl.html)。

由于国内网络原因，在unity中可能遇到网络异常而无法安装。你可以先把 `com.focus-creative-games.hybridclr_unity` clone或者下载到本地，然后再 [install from disk](https://docs.unity3d.com/Manual/upm-ui-local.html)。

或者更简单一点的做法，下载到本地后，将仓库文件夹目录改名为`com.focus-creative-games.hybridclr_unity`，直接复制到你们项目的`Packages`目录下即可。

hybridclr_unity在openupm上也有仓库，但由于有较大的更新延迟以及对分支支持不佳，openump上的仓库我们已经废弃，不再维护。

## 初始化HybridCLR

为了减少package自身大小，有一些文件需要从Unity Editor的安装目录复制。因此安装完插件后，还需要一个额外的初始化过程。

点击菜单 `HybridCLR/Installer...`，弹出安装界面。在点击安装之前，可能需要一些设置。由于随着版本变化，Installer一直在调整，请根据你当前版本读取下面对应的说明。

### 如果你的版本 >= 2.0.5

hybridclr_unity中 `Data~/hybridclr_version.json` 文件中已经配置了当前package版本对应的兼容 hybridclr及il2cpp_plus的分支或者tag，
Installer会安装配置中指定的版本，不再支持自定义待安装的版本。

示例配置如下。

```json
{
    "versions": [
    {
        "unity_version":"2019",
        "hybridclr" : { "branch":"v2.0.1"},
        "il2cpp_plus": { "branch":"v2019-2.0.1"}
    },
    {
        "unity_version":"2020",
        "hybridclr" : { "branch":"v2.0.1"},
        "il2cpp_plus": { "branch":"v2020-2.0.1"}
    },
    {
        "unity_version":"2021",
        "hybridclr" : { "branch":"v2.0.1"},
        "il2cpp_plus": { "branch":"v2021-2.0.1"}
    }
    ]
}
```

如果你想安装其他版本的hybridclr或il2cpp_plus，修改该配置文件中的branch为目标分支或者tag。

绝大多数情况下，直接点击`安装`默认从远程仓库下载安装即可。如下图所示。

![install_default](/img/hybridclr/install_default.jpg)

从版本2.3.1起新增支持直接从本地自己制作的包含hybridclr的libil2cpp目录复制安装。如果你网络不好，或者没有安装git导致无法从仓库远程下载安装，则可以先将 [il2cpp_plus](https://github.com/focus-creative-games/il2cpp_plus)和[hybridclr](https://github.com/focus-creative-games/hybridclr)下载到本地后，再根据下面**安装原理**小节的文档，由这两个仓库合并出含hybridclr的libil2cpp目录，接着在`Installer`安装界面中启用`从本地复制libil2cpp`选项，选择你制作的libil2cpp目录，再点击`安装`执行安装。如下图所示。

![install](/img/hybridclr/install.jpg)



### 如果你的版本 >= 1.1.20

hybridclr_unity中 `Data~/hybridclr_version.json` 文件中已经配置了当前package版本对应的兼容 hybridclr及il2cpp_plus的版本，
Installer会安装配置中指定的版本，不再支持自定义待安装的版本。

示例配置如下。

```json
{
    "versions": [
    {
        "unity_version":"2019",
        "hybridclr" : { "branch":"main", "hash":"531f98365eebce5d1390175be2b41c41e217d918"},
        "il2cpp_plus": { "branch":"2019-main", "hash":"ebe5190b0404d1857832bd1d52ebec7c3730a01d"}
    },
    {
        "unity_version":"2020",
        "hybridclr" : { "branch":"main", "hash":"531f98365eebce5d1390175be2b41c41e217d918"},
        "il2cpp_plus": { "branch":"2020-main", "hash":"c6cf54285381d0b03a58126e0d39b6e4d11937b7"}
    },
    {
        "unity_version":"2021",
        "hybridclr" : { "branch":"main", "hash":"531f98365eebce5d1390175be2b41c41e217d918"},
        "il2cpp_plus": { "branch":"2021-main", "hash":"99cd1cbbfc1f637460379e81c9a7776cd3e662ad"}
    }
    ]
}

```

如果你想安装其他版本的hybridclr或il2cpp_plus，修改该配置文件中的branch和hash即可。

### 如果你的package版本 <= 1.1.19

填写你要安装的hybridclr和il2cpp_plus仓库的 commit id或branch或tag。如果hybridclr的版本号留空，则安装hybridclr仓库main分支的最新版本。
如果il2cpp_plus的版本号留空，则安装相应年度版本主分支（如2020-main）的最新版本。

**hybridclr_uniyt分支、hybridclr仓库的分支跟il2cpp_plus仓库分支必须匹配**。如果你hybridclr_unity使用了main分支，则hybridclr必须使用main分支，il2cpp_plus必须使用`{version}-main`，如果你hybridclr_unity使用了1.0分支， 则hybridclr必须使用`1.0`分支，il2cpp_plus必须使用`{version}-1.0`分支。 如果你使用了某个tag的版本，确保这个tag所属的分支匹配。

hybridclr仓库推荐填写`1.0`，即每次安装1.0分支的最新版本；il2cpp_plus仓库推荐填`{年度版本}-1.0`（如2020-1.0），即每次安装`{年度版本}-1.0`分支的最新版本。如图：

![image](/img/hybridclr/install_version.jpg)

目前已经发布了1.0.1稳定正式版本，同样推荐追求稳定的项目使用。hybridclr_unity取 `1.0.1-release`，hybridclr 版本取 `1.0.1-release`，il2cpp_plus版本取 `{version}-1.0.1-relase`。

========================================

完成以上设置后，点击`install`按钮完成安装。由于安装过程需要拉取hybridclr及il2cpp_plus仓库，有可能会因为网络故障而失败，如果
发现失败时 `HybridCLRData/hybridclr_repo`或`HybridCLRData/il2cpp_plus_repo`为空，请再次尝试。

最常见失败原因为git未安装，或者安装git后未重启UnityEditor和UnityHub。如果你确信安装了git，cmd中也确实能运行git，则尝试重启电脑。

如果因为各种特殊原因未能完成自动化安装，请参照下面的**安装原理**手动模拟整个安装过程。

## WebGL平台的特殊处理

由于Unity自身原因，即使设置了WebGL平台无法本地安装，请看下面章节中关于全局安装的介绍以及查看[跨平台支持](/hybridclr/supported_platform/).

## Unity版本相关特殊操作

### Unity 2021

注意！**如果你的hybridclr_unity版本 >= 2.0.1**，由于已经使用MonoHook技术在不修改UnityEditor.CoreModule.dll的情况下也能复制出裁判后的AOT dll，**不需要**执行以下操作。

补充元数据及`HybridCLR/Generate/*`下的部分命令依赖裁减后的AOT dll。但Unity 2021版本（2019、2020不需要）打包`iOS平台`(其他平台不需要)时，由于Unity Editor未提供公开接口可以复制出target为iOS时的裁剪后的AOT dll，故必须使用修改后的UnityEditor.CoreModule.dll覆盖Unity自带的相应文件。

具体操作为将 `{package目录}/Data~/ModifiedUnityAssemblies/2021.3.x/UnityEditor.CoreModule-{Win,Mac}.dll` 覆盖 `{Editor安装目录}/Editor/Data/Managed/UnityEngine/UnityEditor.CoreModule.dll`，具体相关目录有可能因为操作系统或者Unity版本而有不同。

**由于权限问题，该操作无法自动完成，需要你手动执行复制操作。**

`UnityEditor.CoreModule.dll` 每个Unity小版本都不相同，我们目前暂时只提供了2021.3.1版本，如需其他版本请自己手动制作，详情请见 [修改Unity编辑器相关dll](/hybridclr/modify_unity_dll/)。

### Unity 2019

为了支持2019，需要修改il2cpp生成的源码，因此我们修改了2019版本的il2cpp工具。故Installer的安装过程多了一个额外步骤：将 `{package}/Data~/ModifiedUnityAssemblies/2019.4.40/Unity.IL2CPP.dll` 复制到 `{project}/HybridCLRData/LocalIl2CppData/il2cpp/build/deploy/net471/Unity.IL2CPP.dll`

**注意，该操作在Installer安装时自动完成，不需要手动操作。**

由于时间有限，目前只制作了2019.4.40的`Unity.IL2CPP.dll`文件，将来会补充更多版本，如需其他版本请自己手动制作，详情请见 [修改Unity编辑器相关dll](/hybridclr/modify_unity_dll/)，或者找我们的商业技术支持。

## 为不在支持版本列表中的Unity版本安装HybridCLR

由于我们没有完全测试所有Unity版本，实际上一些不在支持列表中的Unity版本，也有可能能正常使用HybridCLR。安装方式如下：

- 找一个离你的版本最近的在支持列表中的版本，例如你的版本号为 2021.2.20,则离你最新的版本为2021.3.0。
- 先将你的Unity工程切换到这个最近的受支持的版本，安装HybridCLR。
- 切换回你的Unity版本。
- 尝试打包，如果能顺利运行，则表明HybridCLR支持你这个版本，如果有问题，那还是升级版本吧。

由于大项目打包非常耗时，你可以直接使用 hybridclr_trial 项目来测试兼容性。


## 安装原理

本节只是介绍原理，安装libil2cpp的操作已由installer完成，并不需要你手动操作。

HybridCLR安装过程主要包含这几部分：

- 替换libil2cpp代码
- 对Unity Editor的少量改造

### 替换libil2cpp代码

原始的libil2cpp代码是静态CLR，需要替换成改造后的libil2cpp才能支持热更新。改造后的libil2cpp由两部分构成

- il2cpp_plus [github](https://github.com/focus-creative-games/il2cpp_plus) [gitee](https://gitee.com/focus-creative-games/il2cpp_plus)
- hybridclr [github](https://github.com/focus-creative-games/hybridclr) [gitee](https://gitee.com/focus-creative-games/hybridclr)

il2cpp_plus仓库为对原始libil2cpp作了少量修改以支持动态**register**元数据的版本（改了几百行代码）。这个仓库与原始libil2cpp代码高度
相似。2019-2021各有一个对应主开发分支`{version}-main`，另外还有对应的发布版本分支`{version}-x.x`。

hybridclr为解释器部分的核心代码，包含元数据加载、代码transform(编译)、代码解释执行。所有Unity版本共享同一套hybridclr代码。

![merge_hybridclr_dir](/img/hybridclr/merge_hybridclr_dir.jpg)

根据与你的Unity版本匹配的il2cpp_plus分支(详情见[supported_unity_versions](/hybridclr/supported_unity_versions/))和hybridclr制作出最终版本的libil2cpp后，有两种安装方式：


#### 项目本地安装

Unity允许使用环境变量`UNITY_IL2CPP_PATH`自定义`il2cpp`的位置。因此hybridclr_unity包中，将进程环境变量`UNITY_IL2CPP_PATH`指向`{project}/HyridCLRData/LocalIl2CppData-{platform}/il2cpp`。il2cpp目录从Unity Ediotr安装目录复制，然后替换`il2cpp/libil2cpp`目录为修改后lil2cpp。

为什么需要创建上层的`LocalIl2CppData-{platform}`目录，而不是只创建il2cpp呢？实测发现仅仅指定il2cpp目录位置是不够的，打包时Unity隐含假设了il2cpp同级有一个`MonoBleedingEdge`目录，所以创建了上级目录，将il2cpp及MonoBleedingEdge目录都复制过来。

因为不同平台Editor自带的il2cpp目录略有不同，LocalIl2CppData要区分platform。

#### 全局安装

直接替换Editor安装目录的libil2cpp目录(Win下为{editor}/Data/il2cpp/libil2cpp，Mac类似)。优点是简单，缺点是会影响其他不使用hybridclr的项目，而且可能遇到目录权限问题。

`HybridCLRSettings.useGlobalIl2Cpp=true`时表示打包时使用Editor安装目录的libil2cpp，但仍然需要自己手动复制`{project}/HyridCLRData/LocalIl2CppData-{platform}/il2cpp/libil2cpp`目录替换editor下的对应目录。

由于权限原因，即使是全局安装，`Generate/xxx`命令修改的是本地`{project}/HyridCLRData/LocalIl2CppData-{platform}/il2cpp/libil2cpp`下的文件。**请每次generate后都将本地libil2cpp目录覆盖全局安装目录**。

如果你下面的目录替换的安装方式，并且你的hybridclr_unity版本 >= 2.1.0，则**第一次**覆盖libil2cpp前，请先运行`HybridCLR/Generate/Il2cppDef`（只此一次，后面不再需要，除非你切换了项目Unity版本）以生成正确的版本宏，再覆盖原始的libil2cpp目录。**符号链接安装方式或者hybridclr_unity版本低于2.1.0不需要执行此操作**。

每次替换libil2cpp目录非常麻烦，强烈推荐当打包WebGL平台时，除了设置`HybridCLRSettings.useGlobalIl2Cpp=true`外，不要手动替换libil2cpp目录，而使用创建安装目录的libil2cpp目录到本地libil2cpp目录的软链接的方式。方法如下：
- Win平台。以管理员权限打开命令行窗口，删除或者重命名原libil2cpp，然后运行 `mklink /D  "<Editor安装目录的libil2cpp目录路径>" "{project}/HyridCLRData/LocalIl2CppData-{platform}/il2cpp/libil2cpp"`。
- Linux或者Mac平台。以管理员权限打开命令行窗口，删除或者重命名原libil2cpp，然后运行 `ln -s "{project}/HyridCLRData/LocalIl2CppData-{platform}/il2cpp/libil2cpp" "<Editor安装目录的libil2cpp目录路径>" `。

### 对Unity Editor的少量改造

原理在前面的`Unity版本相关特殊操作`小节已经介绍。

## 注意事项

由于 Unity 的缓存机制，更新 HybridCLR 后，一定要清除 Library\Il2cppBuildCache 目录，不然打包时不会使用最新的代码。如果你使用Installer来自动安装或者更新HybridCLR，它会自动清除这些目录，不需要你额外操作。
