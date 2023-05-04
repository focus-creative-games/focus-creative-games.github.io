---
title: 最佳实践
date: 2022-05-25 11:50:18
permalink: /hybridclr/best_practices/
categories:
  - HybridCLR
  - start_up
tags:
  - 
author: 
  name: Code Philosophy
  link: https:://code-philosophy.com
---

# 最佳实践

## unity版本推荐

推荐使用 `2020.3.x(x >= 21)` 系列及 `2021.3.x` 系列，最稳定。

## 推荐启动脚本挂载到热更新完成后首个加载的热更新场景

推荐将启动脚本挂载到启动热更新场景，这样可以零改动将非热更新工程改造成热更新工程，还不需要任何反射操作。

## `RuntimeApi.LoadMetadataForAOTAssembly` 调用的时机

你只要在使用AOT泛型前调用即可（只需要调用一次），理论上越早加载越好。实践中比较合理的时机是热更新完成后，或者热更新dll加载后但还未执行任何何代码前。如果补充元数据的dll作为额外数据文件也打入了主包，则主工程启动时加载更优。可参考[HybridCLR_trial](https://github.com/focus-creative-games/hybridclr_trial)项目

## 原生与解释器部分性能敏感的场合不要用反射来交互，应该通过Delegate或虚函数

以Update函数为例，大多数人会想到主工程跟热更部分的交互像这样

```csharp
var klass = ass.GetType("App");
var method = klass.GetMethod("Update");
method.Invoke(null, new object[] {deltaTime});
```

这种方式的缺点是反射成本高，万一带参数，还有额外gc，其实完全有更高效的办法。主要有两种方式：

### 热更新层返回一个 Delegate

```csharp
// Hotfix.asmdf 热更新部分 
class App
{
    public static Action<float> GetUpdateDelegate()
    {
        return Update;
    }

    public static void Update(float deltaTime)
    {
    }
}

// Main.asmdf 主工程
var klass = ass.GetType("App");
var method = klass.GetMethod("GetUpdateDelegate");
var updateDel = (Action<float>)method.Invoke(null, null);

updateDel(deltaTime);
```

### 通过 Delegate.Create，根据MethodInfo创建相应的Delegate

```csharp
var klass = ass.GetType("App");
var method = klass.GetMethod("Update");
updateDel = (Action<float>)System.Delegate.CreateDelegate(typeof(Action<float>), null, method);
updateDel(deltaTime);
```

## 2021 版本不要使用 `faster(smaller) builds` 选项

自2021.3.x LTS版本起，il2cpp已经完全支持`full generic share`技术，当 Build Settings中 `Il2Cpp Code Generation` 选项为 `faster runtime`时为标准泛型共享机制，为 `faster(smaller) builds` 时开启
`full generic share` 机制。

当开启`full generic share`后每个泛型函数（无论泛型参数是值类型还是class类型）都会完全共享一份代码，优点是节约包体大小，缺点是极大地伤害了泛型函数的性能。完全泛型共享的代码相比于标准泛型共享代码有时候会慢几倍到十几倍，甚至比不上纯解释版本。因此强烈推荐**不要开启** `faster(smaller) builds` 选项。
