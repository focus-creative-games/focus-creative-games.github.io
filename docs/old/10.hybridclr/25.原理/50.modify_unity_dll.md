---
title: 修改Unity编辑器相关dll
date: 2022-05-29 20:55:59
permalink: /hybridclr/modify_unity_dll/
categories:
  - HybridCLR
tags:
  - 
author: 
  name: Code Philosophy
  link: https:://code-philosophy.com
---

# 修改Unity编辑器相关dll

由于Unity提供的Editor脚本及il2cpp工具未能完全满足需求，在某些Unity版本或者打包某些目标平台，需要对Unity Edtior
自带的一些dll进行修改。

目前有两个dll发生修改：

- UnityEditor.CoreModule.dll
- Unity.IL2CPP.dll

注意，不是所有版本和平台都需要修改这两个dll，具体下面详细说明。

## 使用dnspy工具

我们使用 [dnspy](https://github.com/dnSpy/dnSpy) 来修改 dll文件。而dnspy只能在Win下运行，故哪怕是mac版本dll，
你也得先将相应dll复制到Win下后再修改。

下载 [dnspy](https://github.com/dnSpy/dnSpy/releases)，选择 [Win64版本](https://github.com/dnSpy/dnSpy/releases/download/v6.1.8/dnSpy-net-win64.zip)。

修改dll的操作大致如下：

- dnspy中清空左侧所有dll
- 打开dll
- 找到你要修改的函数 `ToModifiedType.ToModifiedMethod` 函数， 右键菜单 -> 编辑方法(c#)...，弹出源码编辑界面。
- 如果编辑器提示缺少某些dll引用，点击源码编辑窗口左下角类似文件夹的按钮，进行添加。
- 修改代码
- 点击右下角的 `编译` 按钮，如果成功，则无任何提示，退出编辑界面，返回反编译查看模式。如果失败，请自行处理编译错误。有时候dnspy会有莫名其妙的引用错误，退出源码编辑模式，重新右键`编辑方法`，再次进入就能解决。
- 菜单 `文件 -> 保存模块` 保存修改后的dll文件。如果在Win或Mac下，有可能会遇到权限问题，请酌情处理（比如先保存到其他位置，再手动覆盖）

## UnityEditor.CoreModule.dll

只有2021版本并且需要build iOS的开发者，才需要使用修改版本的 UnityEditor.CoreModule.dll。

**如果你的hybridclr_unity版本 >= 2.0.1**，由于已经使用MonoHook技术在不修改UnityEditor.CoreModule.dll的情况下也能复制出裁判后的AOT dll，**不需要**执行以下操作。

### 原理

`补充元数据` 技术的`HomologousImageMode::Consistent`模式需要使用裁剪后的AOT dll，此时我们需要获得打包过程中生成的AOT dll。

对于Unity 2020及更早版本，在 `IIl2CppProcessor.OnBeforeConvertRun` 事件中复制出裁剪后的AOT dll即可。

对于Unity 2021版本，除了iOS以外的target，可以在 `IPostprocessBuildWithReport.OnPostprocessBuild` 事件中复制出AOT dll。

但当target为iOS时，裁减输出目录与其他很不相同，为`Temp/StagingArea/Data/Managed/tempStrip` ，并且Unity在转换为c++代码后就会删除这个临时目录。

Unity Editor未提供公开接口可以复制出target为iOS时的AOT dll，故只能修改UnityEditor.CoreModule.dll的代码，在生成裁剪AOT dll后，插入适当的代码，将相应dll复制到 `HybridCLRData\AssembliesPostIl2CppStrip\iOS`，供后续打包使用。

UnityEditor.CoreModule.dll 代码每个Unity版本都不一样。由于我们时间有限，目前只提供了2021.3.1、2021.3.6版本 （将来可能会提供更多），其他版本请自行制作。具体操作方式见 `修改 UnityEditor.CoreModule.dll` 这节。

注意！同个版本的Win与Mac版本的UnityEditor.CoreModule.dll并不能混用，必须分别制作。

### 替换原始UnityEditor.CoreModule.dll

- 提前备份 `{Editor安装目录}/Editor/Data/Managed/UnityEngine/UnityEditor.CoreModule.dll`。 UnityEditor.CoreModule.dll 具体位置有可能因为操作系统或者Unity版本而有不同。
- 如果你正好使用2021.3.1等已经提供了制作好的dll的版本，则使用 `com.focus-creative-games.hybridclr_unity/Datas~/ModifiedUnityAssemblies/{version}/UnityEditor.CoreModule-{Win,MAC}.dll` 覆盖 Editor安装目录中的 UnityEditor.CoreModule.dll。


### 使用dnspy修改

进行以下操作前，你先仔细看完前面的 `使用dnspy工具` 这节内容。

- 将`{Editor安装目录}/Editor/Data/Managed/UnityEngine`目录拷贝出来，假设是TempUnityEngine目录
- 删除TempUnityEngine目录下的所有.pdb类型调试文件。**因为Unity的pdb文件有问题，会导致dnspy解析出错，导致无法保存。**
- 打开 dnspy，清除左侧的dll列表。
- 使用dnspy打开 `TempUnityEngine/UnityEditor.CoreModule.dll`
- 打开 `UnityEditorInternal.AssemblyStripper.RunAssemblyStripper` 函数， 右键菜单 -> 编辑方法(c#)...，弹出源码编辑界面。
- 此时编辑器缺少mscorlib.dll的引用，需要手动添加。点击源码编辑窗口左下角类似文件夹的按钮，添加 `{Editor安装目录}/Editor/Data/UnityReferenceAssemblies/unity-4.8-api/mscorlib.dll`。
- 在`RunAssemblyStripper`函数尾部，找到这个代码块
```csharp
	foreach (string text3 in Directory.GetFiles(fullPath))
	{
		File.Move(text3, Path.Combine(managedAssemblyFolderPath, Path.GetFileName(text3)));
	}
```
修改为 
```csharp
	string dstAOTDir = Path.Combine(UnityEngine.Application.dataPath, "../HybridCLRData/AssembliesPostIl2CppStrip", EditorUserBuildSettings.activeBuildTarget.ToString());
	Directory.CreateDirectory(dstAOTDir);
	foreach (string text3 in Directory.GetFiles(fullPath))
	{
		if (text3.EndsWith(".dll"))
		{
			string copyDstFile = Path.Combine(dstAOTDir, Path.GetFileName(text3));
			File.Copy(text3, copyDstFile, true);
			UnityEngine.Debug.Log("[RunAssemblyStripper] copy aot dll " + text3 + " -> " + copyDstFile);
		}
		File.Move(text3, Path.Combine(managedAssemblyFolderPath, Path.GetFileName(text3)));
	}
```
- 注意!反编译的代码中，变量名未必是text3，请按实际情况处理。如有遇到编译错误，请自行酌情处理。
- 点击右下角的 `编译` 按钮，如果成功，则无任何提示，退出编辑界面，返回反编译查看模式。如果失败，请自行处理编译错误。有时候dnspy会有莫名其妙的引用错误，退出源码编辑模式，重新右键`编辑方法`，再次进入就能解决。
- 菜单 `文件 -> 保存模块` 保存修改后的 UnityEditor.CoreModule.dll文件。如果在Win或Mac下，有可能会遇到权限问题，请酌情处理（比如先保存到其他位置，再手动覆盖）
- 重新打开Unity Editor。此时iOS便能正确获得裁剪AOT dll。

## Unity.IL2CPP.dll

### 原理

2019版本，我们需要轻微修改il2cpp生成的代码，将 `Il2CppOutputProject\Source\il2cppOutput\Il2CppTypeDefinitions.c`中定义的常量const Il2CppType换成可变的Il2CppType。我们需要修改`Unity.IL2CPP.dll`代码达到这个目标。

注意！实际操作过程发现dnspy反编译的代码有问题，最终我们在ILSpy反编译的代码基础上调整后，再在dnspy里编辑保存。

直接复制以下我们修改好的代码，在dnspy里编辑保存。修改过程可能会遇到问题，参照上面修改`UnityEditor.CoreModule.dll`中使用的解决办法。

### Unity.IL2CPP.CppDeclarationsWriter::Write(StreamWriter writer, ICppDeclarations declarationsIn, IInteropDataCollector interopDataCollector)

修改后的代码

```csharp
     string[] includesToSkip = new string[3] { "\"il2cpp-config.h\"", "<alloca.h>", "<malloc.h>" };
    CppDeclarationsCollector.PopulateCache(declarationsIn.TypeIncludes, cache, interopDataCollector);
    HashSet<TypeReference> hashSet = new HashSet<TypeReference>(declarationsIn.TypeIncludes, new TypeReferenceEqualityComparer());
    ReadOnlyHashSet<TypeReference> dependencies = CppDeclarationsCollector.GetDependencies(declarationsIn.TypeIncludes, cache);
    hashSet.UnionWith(dependencies);
    ReadOnlyCollection<TypeReference> readOnlyCollection = hashSet.ToSortedCollection(new CppIncludeDepthComparer(comparer));
    CppDeclarations cppDeclarations = new CppDeclarations();
    cppDeclarations.Add(declarationsIn);
    foreach (TypeReference item in readOnlyCollection)
    {
        cppDeclarations.Add(cache.GetDeclarations(item));
    }
    writer.WriteLine();
    foreach (string rawFileLevelPreprocessorStmt in cppDeclarations.RawFileLevelPreprocessorStmts)
    {
        writer.WriteLine(rawFileLevelPreprocessorStmt);
    }
    writer.WriteLine();
    foreach (string item2 in cppDeclarations.Includes.Where((string i) => !includesToSkip.Contains(i) && i.StartsWith("<")))
    {
        writer.WriteLine("#include {0}", item2);
    }
    writer.WriteLine();
    foreach (string item3 in cppDeclarations.Includes.Where((string i) => !includesToSkip.Contains(i) && !i.StartsWith("<")))
    {
        writer.WriteLine("#include {0}", item3);
    }
    writer.WriteLine();
    WriteVirtualMethodDeclaration(writer, cppDeclarations.VirtualMethods);
    writer.WriteLine();
    foreach (TypeReference item4 in cppDeclarations.ForwardDeclarations.ToSortedCollection())
    {
        if (!item4.IsSystemObject() && !item4.IsSystemArray())
        {
            if (CodeGenOptions.EmitComments)
            {
                writer.WriteLine(Emit.Comment(item4.FullName));
            }
            writer.WriteLine("struct {0};", Globals.Naming.ForType(item4));
        }
    }
    writer.WriteLine();
    foreach (string item5 in cppDeclarations.RawTypeForwardDeclarations.ToSortedCollection())
    {
        writer.WriteLine(item5 + ";");
    }
    writer.WriteLine();
    foreach (ArrayType item6 in cppDeclarations.ArrayTypes.ToSortedCollection())
    {
        writer.WriteLine("struct {0};", Globals.Naming.ForType(item6));
    }
    writer.WriteLine();
    writer.WriteLine("IL2CPP_EXTERN_C_BEGIN");
    foreach (TypeReference typeExtern in cppDeclarations.TypeExterns)
    {
        writer.WriteLine("extern Il2CppType " + Globals.Naming.ForIl2CppType(typeExtern) + ";");
    }
    foreach (IList<TypeReference> genericInstExtern in cppDeclarations.GenericInstExterns)
    {
        writer.WriteLine("extern Il2CppGenericInst " + Globals.Naming.ForGenericInst(genericInstExtern) + ";");
    }
    foreach (TypeReference genericClassExtern in cppDeclarations.GenericClassExterns)
    {
        writer.WriteLine("extern Il2CppGenericClass " + Globals.Naming.ForGenericClass(genericClassExtern) + ";");
    }
    writer.WriteLine("IL2CPP_EXTERN_C_END");
    writer.WriteLine();
    if (readOnlyCollection.Count > 0)
    {
        writer.WriteClangWarningDisables();
        foreach (TypeReference item7 in readOnlyCollection)
        {
            string source = cache.GetSource(item7);
            writer.Write(source);
        }
        writer.WriteClangWarningEnables();
    }
    foreach (ArrayType arrayType in cppDeclarations.ArrayTypes)
    {
        TypeDefinitionWriter.WriteArrayTypeDefinition(arrayType, new CodeWriter(writer));
    }
    writer.WriteLine();
    foreach (string rawMethodForwardDeclaration in cppDeclarations.RawMethodForwardDeclarations)
    {
        writer.WriteLine(rawMethodForwardDeclaration + ";");
    }
    writer.WriteLine();
    foreach (MethodReference sharedMethod in cppDeclarations.SharedMethods)
    {
        WriteSharedMethodDeclaration(writer, sharedMethod);
    }
    writer.WriteLine();
    foreach (MethodReference method in cppDeclarations.Methods)
    {
        WriteMethodDeclaration(writer, method);
    }
    writer.Flush();
```

### Unity.IL2CPP.Il2CppTypeWriter::WriteIl2CppTypeDefinitions(IMetadataCollection metadataCollection)

修改后的代码

```csharp
    base.Writer.AddCodeGenMetadataIncludes();
    IDictionary<Il2CppTypeData, int> items = Globals.Il2CppTypeCollectorReader.Items;
    foreach (IGrouping<TypeReference, Il2CppTypeData> item in items.Keys.GroupBy((Il2CppTypeData entry) => entry.Type.GetNonPinnedAndNonByReferenceType(), new TypeReferenceEqualityComparer()))
    {
        base.Writer.WriteLine();
        TypeReference key = item.Key;
        GenericParameter genericParameter = key as GenericParameter;
        GenericInstanceType genericInstanceType = key as GenericInstanceType;
        ArrayType arrayType = key as ArrayType;
        PointerType pointerType = key as PointerType;
        string text = ((genericParameter != null) ? ("(void*)" + metadataCollection.GetGenericParameterIndex(genericParameter)) : ((genericInstanceType != null) ? WriteGenericInstanceTypeDataValue(genericInstanceType, metadataCollection) : ((arrayType != null) ? WriteArrayDataValue(arrayType) : ((pointerType == null) ? ("(void*)" + metadataCollection.GetTypeInfoIndex(key.Resolve()).ToString(CultureInfo.InvariantCulture)) : WritePointerDataValue(pointerType)))));
        foreach (Il2CppTypeData item2 in item)
        {
            base.Writer.WriteLine("extern Il2CppType {0};", Globals.Naming.ForIl2CppType(item2.Type, item2.Attrs));
            base.Writer.WriteLine("Il2CppType {0} = {{ {1}, {2}, {3}, {4}, {5}, {6} }};", Globals.Naming.ForIl2CppType(item2.Type, item2.Attrs), text, item2.Attrs.ToString(CultureInfo.InvariantCulture), Il2CppTypeSupport.For(item2.Type), "0", item2.Type.IsByReference ? "1" : "0", item2.Type.IsPinned ? "1" : "0");
        }
    }
    return MetadataWriter.WriteTable(base.Writer, "const Il2CppType* const ", "g_Il2CppTypeTable", items.ItemsSortedByValue(), (KeyValuePair<Il2CppTypeData, int> kvp) => "&" + Globals.Naming.ForIl2CppType(kvp.Key.Type, kvp.Key.Attrs), externTable: true);
```

### Unity.IL2CPP.Metadata.Il2CppGenericInstWriter::WriteIl2CppGenericInstDefinitions(IIl2CppGenericInstCollectorReaderService genericInstCollection)

修改后的代码

```csharp
base.Writer.AddCodeGenMetadataIncludes();
    foreach (TypeReference[] item in genericInstCollection.Items.Select(delegate(KeyValuePair<TypeReference[], uint> item)
    {
        KeyValuePair<TypeReference[], uint> keyValuePair = item;
        return keyValuePair.Key;
    }))
    {
        for (int i = 0; i < item.Length; i++)
        {
            base.Writer.WriteExternForIl2CppType(item[i]);
        }
        string format = "static const Il2CppType* {0}[] = {{ {1} }};";
        WriteLine(format, Globals.Naming.ForGenericInst(item) + "_Types", item.Select((TypeReference t) => MetadataWriter.TypeRepositoryTypeFor(t)).AggregateWithComma());
        WriteLine("extern Il2CppGenericInst {0};", Globals.Naming.ForGenericInst(item));
        WriteLine("Il2CppGenericInst {0} = {{ {1}, {2} }};", Globals.Naming.ForGenericInst(item), item.Length, Globals.Naming.ForGenericInst(item) + "_Types");
    }
    return MetadataWriter.WriteTable(base.Writer, "const Il2CppGenericInst* const", "g_Il2CppGenericInstTable", genericInstCollection.Items.ItemsSortedByValue(), (KeyValuePair<TypeReference[], uint> item) => "&" + Globals.Naming.ForGenericInst(item.Key), externTable: true);
```
