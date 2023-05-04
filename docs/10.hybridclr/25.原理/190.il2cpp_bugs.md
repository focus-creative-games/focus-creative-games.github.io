---
title: il2cpp bugs
date: 2022-05-25 11:50:18
permalink: /hybridclr/129afe/
categories:
  - HybridCLR
tags:
  - 
author: 
  name: Code Philosophy
  link: https:://code-philosophy.com
---
# il2cpp bug记录

## 逆变协变泛型接口调用错误

查找obj的interface实现有误，按规范以下代码应该打出"Comput B"，例如.net 6是这个结果，但mono和il2cpp下却打印出"Comput A"。

```csharp

interface ITest<out T>
{
    T Comput();
}

class A : ITest<object>
{
    public object Comput()
    {
        return "Comput A";
    }
}

class B : A, ITest<string>
{
    public string Comput()
    {
        return "Comput B";
    }
}

class App
{
    public static void Main()
    {
        ITest<object> f = new B();
        Debug.Log(f.Comput());
    }
}

```

## obj.Func() 非虚调用不符合规范

ECMA规范允许对null使用call指令进行非虚调用，但il2cpp却在调用前插入了NullCheck操作。导致以下代码在mono下会打印出 "hello"，而在il2cpp下抛了NullReferenceException。

```csharp

class TestNull
{
    public void Show()
    {
        Debug.Log("hello");
    }
}

class App
{
    public void Main()
    {
        TestNull nu = null;
        nu.Show();
    }
}

```

## 当struct中包含class类型对象时，StructLayout的pack不会生效

```csharp
    [StructLayout( LayoutKind.Sequential, Pack = 1)]
    struct StructWithoutClass
    {
        byte a;
        long b;
    }

    [StructLayout(LayoutKind.Sequential, Pack = 1)]
    struct StructWithClass
    {
        byte a;
        object b;
    }
```

x64下这两个struct计算的size都应该=9，运行.net 6程序测试也验证了这点。但在mono中，第一个结构计算值是9，第2个是16.

## 泛型数组函数未设置token

metadata/ArrayMetadata.cpp中

```cpp
    static MethodInfo* ConstructGenericArrayMethod(const GenericArrayMethod& genericArrayMethod, Il2CppClass* klass, Il2CppGenericContext* context)
    {
        MethodInfo* inflatedMethod = (MethodInfo*)MetadataCalloc(1, sizeof(MethodInfo));
        inflatedMethod->name = StringUtils::StringDuplicate(genericArrayMethod.name.c_str());
        inflatedMethod->klass = klass;

        const MethodInfo* methodToCopyDataFrom = genericArrayMethod.method;
        if (genericArrayMethod.method->is_generic)
        {
            const Il2CppGenericMethod* genericMethod = MetadataCache::GetGenericMethod(genericArrayMethod.method, context->class_inst, context->method_inst);
            methodToCopyDataFrom = GenericMethod::GetMethod(genericMethod);

            inflatedMethod->is_inflated = true;
            inflatedMethod->genericMethod = genericMethod;
            inflatedMethod->rgctx_data = methodToCopyDataFrom->rgctx_data;
        }
        // ==={{ add by HybridCLR
        inflatedMethod->token = methodToCopyDataFrom->token;
        // ===}} add by HybridCLR
        inflatedMethod->slot = methodToCopyDataFrom->slot;
        inflatedMethod->parameters_count = methodToCopyDataFrom->parameters_count;
        inflatedMethod->parameters = methodToCopyDataFrom->parameters;
        inflatedMethod->return_type = methodToCopyDataFrom->return_type;

        inflatedMethod->methodPointer = methodToCopyDataFrom->methodPointer;
        inflatedMethod->invoker_method = methodToCopyDataFrom->invoker_method;

        return inflatedMethod;
    }
```

## throw null 会导致崩溃

对于 c#代码  `throw ex;` 会生成如下代码 

```cpp
    IL2CPP_RAISE_MANAGED_EXCEPTION(L_107, TestCase_Run_m5B897FE9D1ABDC1AA114D3482A6613BAAE3243F6_RuntimeMethod_var);
```

当ex=null时崩溃

## close delegate 的this为null时，抛出的异常不合规范

`Delegate.Create(XXInstanceMethod, null)` ，调用时应该抛出 NullReferenceException异常，而unity2021版本抛出了ArgumentException。

## 2019 生成的delegate 调用代码，未正确处理open delegate，并且this为ValueType的情形

当使用open delegate，并且 ref ValueType作为this参数时，会错误地产生两次调用！

```csharp
    if (targetThis == NULL && il2cpp_codegen_class_is_value_type(il2cpp_codegen_method_get_declaring_type(targetMethod)))
    {
        typedef int32_t (*FunctionPointerType) (RuntimeObject*, int32_t, const RuntimeMethod*);
        result = ((FunctionPointerType)targetMethodPointer)((reinterpret_cast<RuntimeObject*>(___a0) - 1), ___b1, targetMethod);
    }
    if (targetThis == NULL)
    {
        typedef int32_t (*FunctionPointerType) (RuntimeObject*, int32_t, const RuntimeMethod*);
        result = ((FunctionPointerType)targetMethodPointer)((RuntimeObject*)(reinterpret_cast<RuntimeObject*>(___a0) - 1), ___b1, targetMethod);
    }
    else
    {
        typedef int32_t (*FunctionPointerType) (void*, FT_AOT_ValueType_t851DF541610F2A3DE72568571355F3953F0063AF *, int32_t, const RuntimeMethod*);
        result = ((FunctionPointerType)targetMethodPointer)(targetThis, ___a0, ___b1, targetMethod);
    }

```

## mono及il2cpp不支持 instance method的open delegate 上调用 InvokeDyanmic

会抛出 'Object does not match target type' 错误。

```csharp
    public void void_class_intp_open_reflection()
    {
        var b = new FT_Class() { x = 1, y = 2f, z = "abc" };
        var m = typeof(FT_Class).GetMethod("Run");
        var del = (Action<FT_Class, int>)Delegate.CreateDelegate(typeof(Action<FT_Class, int>), null, m);
        del.DynamicInvoke(b, 4);
        Assert.Equal(5, b.x);

        var dd = del + del;
        dd.DynamicInvoke(b, 1);
        Assert.Equal(7, b.x);

        Assert.ExpectException<NullReferenceException>();
        del.DynamicInvoke(null, 4);
        Assert.Fail();
    }
```

## 2019 WebGL 平台的代码有bug

取类成员字段时未检查是否空指针。目前发现只有WebGL平台才会这样。

```cpp

//WebGL平台没有NullCheck
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void FT_AOT_Class_Run2_m0451FFC153671CD294EB1178A01AB2D92202624C (FT_AOT_Class_t03C2F346FF0EA8694088FD3F901E6536935FB2BA * ___s0, int32_t ___b1, const RuntimeMethod* method)
{
	{
		// s.x += b;
		FT_AOT_Class_t03C2F346FF0EA8694088FD3F901E6536935FB2BA * L_0 = ___s0;
		FT_AOT_Class_t03C2F346FF0EA8694088FD3F901E6536935FB2BA * L_1 = L_0;
		int32_t L_2 = L_1->get_x_0();
		int32_t L_3 = ___b1;
		L_1->set_x_0(((int32_t)il2cpp_codegen_add((int32_t)L_2, (int32_t)L_3)));
		// }
		return;
	}
}

// 其他平台有NullCheck
IL2CPP_EXTERN_C IL2CPP_METHOD_ATTR void FT_AOT_Class_Run2_m0451FFC153671CD294EB1178A01AB2D92202624C (FT_AOT_Class_t03C2F346FF0EA8694088FD3F901E6536935FB2BA * ___s0, int32_t ___b1, const RuntimeMethod* method)
{
	{
		// s.x += b;
		FT_AOT_Class_t03C2F346FF0EA8694088FD3F901E6536935FB2BA * L_0 = ___s0;
		FT_AOT_Class_t03C2F346FF0EA8694088FD3F901E6536935FB2BA * L_1 = L_0;
		NullCheck(L_1);
		int32_t L_2 = L_1->get_x_0();
		int32_t L_3 = ___b1;
		NullCheck(L_1);
		L_1->set_x_0(((int32_t)il2cpp_codegen_add((int32_t)L_2, (int32_t)L_3)));
		// }
		return;
	}
}
```

