---
title: 加载和使用热更新代码
date: 2022-09-29 12:31:29
permalink: /hybridclr/load_assembly/
categories:
  - hybridclr
  - 文档
tags:
  - 
author: 
  name: Code Philosophy
  link: https://github.com/focus-creative-games
---

# 加载和使用热更新代码

## 编译热更新dll

对于热更新代码放在第3方工程的开发者，使用你自己的方式编译出热更新dll即可。

对于热更新代码放在Unity项目中的开发者，你不能直接复制`Library/ScriptAssemblies`目录下的dll，
这是因为由于编译代码时需要正确的平台宏开关，而`Library/ScriptAssemblies`下的dll是使用Editor平台宏编译出来的，不满足要求。

Unity打包时会自动帮你使用正确的宏开关编译dll，但这样很麻烦，也很费时。更好的办法是借助Unity的`PlayerBuildInterface.CompilePlayerScripts`Api完成编译。

hybridclr_unity提供一个编译各个target对应的热更新dll的编译脚本。使用菜单`HybridCLR/CompileDll/xxxx`来编译你期望的平台的热更新
dll，编译完成后的热更新dll放到 `{project}/HybridCLRData/HotUpdateDlls/{platform}` 目录下。

## 将热更新dll加入你的热更新资源管理系统

`{project}/HybridCLRData/HotUpdateDlls/{platform}`目录可以获得热更新dll，按照自己项目的情况处理即可，既可以打入ab包，也可以是裸数据。

hybridclr_trial项目出于方便演示起见，直接将 Assembly-CSharp.dll改名为Assembly-CSharp.dll.bytes后放入StreamingAssets目录。

## 加载更新assembly

根据你们项目资源管理的方式，获得热更新dll的bytes数据。然后再直接调用Assembly.Load(byte[] assemblyData)加载热更新dll。代码类似
如下：

```csharp
    byte[] assemblyData = xxxx; // 从你的资源管理系统中获得热更新dll的数据
    Assembly ass = Assembly.Load(assemblyData);
```

如果有多个热更新dll，请一定要按照依赖顺序加载，先加载被依赖的assembly。

## 运行热更新代码

加载完热更新dll后，有多种方式运行热更新代码，跟你使用常规的c#代码无特殊区别。

### 通过反射运行

假设热更新集中有HotUpdateEntry类，主入口是静态的Main函数，代码类似：

```csharp
class HotUpdateEntry
{
    public static void Main()
    {
        UnityEngine.Debug.Log("hello, HybridCLR");
    }
}
```


你用如下方式运行：

```csharp
    // ass 为Assembly.Load返回的热更新assembly。
    // 你也可以在Assembly.Load后通过类似如下代码查找获得。
    // Assembly ass = AppDomain.CurrentDomain.GetAssemblies().First(assembly => assembly.GetName().Name == "Assembly-CSharp");
    Type entryType = ass.GetType("HotUpdateEntry");
    MethodInfo method = entryType.GetMethod("Main");
    method.Invoke(null, null);
```

### 通过反射创造出Delegate后 运行

```csharp
    Type entryType = ass.GetType("HotUpdateEntry");
    MethodInfo method = entryType.GetMethod("Main");
    Action mainFunc = (Action)Delegate.CreateDelegate(typeof(Action), method);
    mainFunc();
```

### 通过反射创建出对象后，再调用接口函数

假设AOT中有这样的接口

```csharp
public interface IEntry
{
    void Start();
    void Update(float deltaTime);
}
```

热更新中实现了这样的类

```csharp
class HotUpdateEntry : IEntry
{
    public void Start()
    {
        UnityEngine.Debug.Log("hello, HybridCLR");
    }

    public void Update(float deltaTime)
    {

    }
}
```

你用如下方式运行：

```csharp
    Type entryType = ass.GetType("HotUpdateEntry");
    IEntry entry = (IEntry)Activator.CreateInstance(entryType);
    entry.Start();
```

### 通过直接初始化挂载了热更新脚本的scene或者prefab

假设热更新中有这样的入口脚本，这个脚本被挂到`HotUpdatePrefab.prefab`上。

```csharp

public class HotUpdateMain : MonoBehaviour
{
    void Start()
    {
        Debug.Log("hello, HybridCLR");
    }
}

```

你通过实例化这个prefab，即可运行热更新逻辑。

```csharp
        AssetBundle prefabAb = xxxxx; // 获得HotUpdatePrefab.prefab所在的AssetBundle
        GameObject testPrefab = Instantiate(prefabAb.LoadAsset<GameObject>("HotUpdatePrefab.prefab"));
```

这种方法不需要借助任何反射，而且跟原生的启动工作流非常相似，强烈推荐！

实践中在完成热更新后，通过直接切换到热更新场景的方式直接进入热更新逻辑，对旧工程改动最小。

