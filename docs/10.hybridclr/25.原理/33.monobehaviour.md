---
title: 热更新MonoBehaviour
date: 2022-05-25 11:50:18
permalink: /hybridclr/monobehaviour/
categories:
    - HybridCLR
tags:
    -
author:
    name: Code Philosophy
    link: https:://code-philosophy.com
---

# 热更新MonoBehaviour

HybridCLR完全支持热更新MonoBehaviour和ScriptableObject工作流，即可以在代码里在GameObject上Add热更新脚本或者在资源上直接挂载
热更新脚本。但由于Unity资源管理机制的特殊性，对于资源上挂载热更新脚本，需要打包工作流上作一些特殊处理。

## 通过代码使用

`AddComponent<T>()`或者`AddComponent(Type type)`任何时候都是完美支持的。只需要提前通过Assembly.Load将热更新dll加载到运行时
内即可。

## 在资源上挂载MonoBehaviour或者创建ScriptableObject类型资源

Unity资源管理系统在反序列化资源中的热更新脚本时，需要满足以下条件：

1. 脚本所在的dll已经加载到运行时中
1. 必须是使用AssetBundle打包的资源（**addressable之类间接使用了ab的框架也可以**）
1. 脚本所在的dll必须添加到打包时生成的assembly列表文件。这个列表文件是unity启动时即加载的，不可变数据。不同版本的Unity的列表文件名和格式不相同。

如果未对打包流程作任何处理，由于热更新dll已经在`IFilterBuildAssemblies`回调中被移除，肯定不会出现在assembly列表文件中。
由于不满足条件3，挂载在热更新资源中的热更新脚本无法被还原，运行时会出现 `Scripting Missing`的错误。

因此我们在`Editor/BuildProcessors/PatchScriptingAssemblyList.cs` 脚本中作了特殊处理，把热更新dll加入到assembly列表文件中。
你需要把项目中的热更新assembly添加到`HybridCLRSettings配置的HotUpdateAssemblyDefinitions或HotUpdateAssemblies 字段`中。

只限制了热更新资源以ab包形式打包，热更新dll打包方式没有限制。你可以按照项目需求**自由选择热更新方式**，可以将dll打包到ab中，或者裸数据
文件，或者加密压缩等等。只要能保证在加载热更新资源前使用Assembly.Load将其加载即可。

## assembly列表文件

不同Unity版本下assembly列表文件的名称和格式都不一样。

- 2019版本。 非压缩打包时为globalgamemanagers文件，压缩打包时先保存到globalgamemanagers文件，再以BundleFile格式和其他文件打包到data.unity3d文件。
- 2020-2021版本。 保存在ScriptingAssembles.json文件中。

## 已知问题

### GameObject.GetComponent(string name) 接口无法获得组件

这是已知bug,跟unity的代码实现有关，只有挂载在热更新资源上热更新脚本才会有这个问题，通过代码中AddComponent添加的热更新脚本是可以用这个方法查找到。如果遇到这个问题请改用 `GameObject.GetComponent<T>()` 或 `GameObject.GetComponent(typeof(T))`

## 其它

需要被挂到资源上的脚本所在dll名称上线后勿修改，因为assembly列表文件打包后无法修改。

建议打AB时不要禁用TypeTree，否则普通的AB加载方式会失败。（原因是对于禁用TypeTree的脚本，Unity为了防止二进制不匹配导致反序列化MonoBehaviour过程中进程Crash，会对脚本的签名进行校验，签名的内容是脚本FullName及TypeTree数据生成的Hash, 但由于我们的热更脚本信息不存在于打包后的安装包中，因此校验必定会失败）

如果必须要禁用TypeTree，一个变通的方法是禁止脚本的Hash校验, 此种情况下用户必须保证打包时代码与资源版本一致，否则可能会导致Crash，示例代码

```csharp
    AssetBundleCreateRequest req = AssetBundle.LoadFromFileAsync(path);
    req.SetEnableCompatibilityChecks(false); // 非public，需要通过反射调用
```
