---
title: 内存占用与GC
date: 2022-05-25 11:50:18
permalink: /hybridclr/memory/
categories:
    - HybridCLR
tags:
    -
author:
    name: Code Philosophy
    link: https:://code-philosophy.com
---

# 内存相关原理

HybridCLR是CLR级别的实现，因此热更新的脚本，除了执行代码是以解释模式执行，其他方式跟AOT部分完全相同的。

## 对象内存大小

对于值类型，对象大小并不是简单为所有成员所占大小，必须考虑到内存对齐。对于引用类型，多了额外了对象头(16字节)，并且内存对齐为8字节。对于array类型，则更为复杂。

### primitive type

如byte,int。如熟知， byte占1字节,int占4字节，其他不赘述。

### struct值类型

在未指定Explicit Layout的情况下，根据字段大小及内存对齐规则计算出总大小，与c++的struct计算规则相似。这里不详细阐述，直接举例吧。

```csharp
// V1 对象大小 1
struct V1
{
    public byte a1;
}

// V2 对象大小 8
struct V2
{
    public byte a1;
    public int a2;
}

// V3 对象大小 24
struct V3
{
    public int a1;
    public int a2;
    public object a3;
    public byte a4;
}
```

### class 类型

与值类型相似，但多了对象头的16字节，并且强制内存对齐为8字节。示例:

```csharp
// C1 对象大小 24
class C1
{
    public byte a1;
}
// C2 对象大小 24
class C2
{
    public byte a1;
    public int a2;
}
// C3 对象大小 40
class C3
{
    public int a1;
    public int a2;
    public object a3;
    public byte a4;
}
```

## 与lua、ILRuntime的对象内存大小对比

lua的计算规则略复杂，参见[第三方文章](https://www.linuxidc.com/Linux/2018-10/154971.htm)。空table占56字节，每多一个字段至少多占32字节。

ILRuntime的类型除了enum外统一以IlTypeInstance表达，空类型占72字节，每多一个字段至少多用16字节。如果对象中包含引用类型数据，则整体又至少多24字节，并且每多一个object字段多8字节。

|类型 | Xlua | ILRuntime | HybridCLR |
|:---:|:---:|:---:|:---:|
|V1|88+| 88 | 1|
|V2|120+|104|8|
|V3|184+|168|24|
|C1|88+| 88 | 24|
|C2|120+|104|24|
|C3|184+|168|40|

## 运行过程中GC

HybridCLR严格按照规范实现，除了assembly加载和函数第一次transfrom时会额外消耗CPU和内存外，运行时消耗的内存跟il2cpp完全相同。

因此你不要再问诸如 `foreach 循环会不会产生GC` 这样的问题。在il2cpp或mono下产生多少GC，在HybridCLR中解释执行时也产生完全相同的GC。
