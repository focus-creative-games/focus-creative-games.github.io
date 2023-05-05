(window.webpackJsonp=window.webpackJsonp||[]).push([[118],{437:function(t,e,a){"use strict";a.r(e);var s=a(7),r=Object(s.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"faq"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#faq"}},[t._v("#")]),t._v(" FAQ")]),t._v(" "),e("h2",{attrs:{id:"what-platforms-does-hybridclr-support"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#what-platforms-does-hybridclr-support"}},[t._v("#")]),t._v(" What platforms does HybridCLR support?")]),t._v(" "),e("p",[t._v("All platforms supported by il2cpp support")]),t._v(" "),e("h2",{attrs:{id:"how-much-will-hybridclr-increase-the-package-body"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#how-much-will-hybridclr-increase-the-package-body"}},[t._v("#")]),t._v(" How much will HybridCLR increase the package body")]),t._v(" "),e("p",[t._v("Taking the 2019 version as an example, the libil2cpp.a file of the Android project is exported in release mode, the original version is 12.69M, and the HybridCLR version is 13.97M, which means an increase of about 1.3M.")]),t._v(" "),e("h2",{attrs:{id:"why-does-the-package-size-printed-by-hybridclr-increase-a-lot"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#why-does-the-package-size-printed-by-hybridclr-increase-a-lot"}},[t._v("#")]),t._v(" Why does the package size printed by HybridCLR increase a lot?")]),t._v(" "),e("p",[t._v("HybridCLR itself will only add a few inclusions (1-2M). The package body has increased a lot because you mistakenly reserved too many classes in link.xml, resulting in a sharp increase in the package body.")]),t._v(" "),e("p",[t._v("Please refer to Unity's clipping rules for optimization.")]),t._v(" "),e("h2",{attrs:{id:"is-hybridclr-embedded-with-mono"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#is-hybridclr-embedded-with-mono"}},[t._v("#")]),t._v(" Is HybridCLR embedded with mono?")]),t._v(" "),e("p",[t._v("no. HybridCLR supplements il2cpp with a complete register interpreter implemented completely independently.")]),t._v(" "),e("h2",{attrs:{id:"are-there-any-restrictions-on-writing-code-in-hybridclr"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#are-there-any-restrictions-on-writing-code-in-hybridclr"}},[t._v("#")]),t._v(" Are there any restrictions on writing code in HybridCLR?")]),t._v(" "),e("p",[t._v("Almost unlimited, see "),e("RouterLink",{attrs:{to:"/en/hybridclr/limit/"}},[t._v("Limitations")])],1),t._v(" "),e("h2",{attrs:{id:"do-you-support-generic-classes-and-functions-in-the-hot-update-section"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#do-you-support-generic-classes-and-functions-in-the-hot-update-section"}},[t._v("#")]),t._v(" Do you support generic classes and functions in the hot update section?")]),t._v(" "),e("p",[t._v("Thorough and complete support without any limitations.")]),t._v(" "),e("h2",{attrs:{id:"supports-array-types-of-hot-update-value-types-such-as-myhotupdatevaluetype"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#supports-array-types-of-hot-update-value-types-such-as-myhotupdatevaluetype"}},[t._v("#")]),t._v(" Supports array types of hot update value types, such as MyHotUpdateValueType[]?")]),t._v(" "),e("p",[t._v("Support, without any restrictions, any number of dimensions is fine.")]),t._v(" "),e("h2",{attrs:{id:"do-you-support-multidimensional-arrays"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#do-you-support-multidimensional-arrays"}},[t._v("#")]),t._v(" Do you support multidimensional arrays?")]),t._v(" "),e("p",[t._v("Support without any restrictions.")]),t._v(" "),e("h2",{attrs:{id:"does-it-support-nullable-variables"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#does-it-support-nullable-variables"}},[t._v("#")]),t._v(" Does it support nullable variables?")]),t._v(" "),e("p",[t._v("Full support without any restrictions.")]),t._v(" "),e("h2",{attrs:{id:"support-hot-update-monobehaviour"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#support-hot-update-monobehaviour"}},[t._v("#")]),t._v(" Support hot update MonoBehaviour?")]),t._v(" "),e("p",[t._v("fully support. Not only can it be added in the code, but it can also be directly linked to hot update resources. For details, see "),e("RouterLink",{attrs:{to:"/en/hybridclr/monobehaviour/"}},[t._v("Using Hot Update MonoBehaviour")])],1),t._v(" "),e("h2",{attrs:{id:"does-it-support-reflection"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#does-it-support-reflection"}},[t._v("#")]),t._v(" Does it support reflection?")]),t._v(" "),e("p",[t._v("Supported, without any restrictions.")]),t._v(" "),e("h2",{attrs:{id:"how-about-multithreading-support"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#how-about-multithreading-support"}},[t._v("#")]),t._v(" How about multithreading support?")]),t._v(" "),e("p",[t._v("Full support. Support Thread, Task, volatile, ThreadStatic, async.")]),t._v(" "),e("h2",{attrs:{id:"does-it-support-async-task-or-third-party-task"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#does-it-support-async-task-or-third-party-task"}},[t._v("#")]),t._v(" Does it support async task or third-party task?")]),t._v(" "),e("p",[t._v("support.")]),t._v(" "),e("h2",{attrs:{id:"does-it-support-multiple-assemblies"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#does-it-support-multiple-assemblies"}},[t._v("#")]),t._v(" Does it support multiple assemblies?")]),t._v(" "),e("p",[t._v("Support, up to 255. But the dependent dll will not be loaded automatically. You need to manually load hot-updated dlls in the order of dependencies.")]),t._v(" "),e("h2",{attrs:{id:"do-i-need-to-write-any-adapter-code-to-inherit-the-aot-class"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#do-i-need-to-write-any-adapter-code-to-inherit-the-aot-class"}},[t._v("#")]),t._v(" Do I need to write any adapter code to inherit the AOT class?")]),t._v(" "),e("p",[t._v("HybridCLR is a feature-complete runtime. You don't need to write any extra code, just inherit it casually.")]),t._v(" "),e("h2",{attrs:{id:"does-it-support-creating-value-types"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#does-it-support-creating-value-types"}},[t._v("#")]),t._v(" Does it support creating value types?")]),t._v(" "),e("p",[t._v("support.")]),t._v(" "),e("h2",{attrs:{id:"does-it-support-annotations"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#does-it-support-annotations"}},[t._v("#")]),t._v(" Does it support annotations?")]),t._v(" "),e("p",[t._v("support.")]),t._v(" "),e("h2",{attrs:{id:"does-it-support-net-standard-2-0"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#does-it-support-net-standard-2-0"}},[t._v("#")]),t._v(" Does it support .net standard 2.0?")]),t._v(" "),e("p",[t._v("support. But please note that the main project is packaged with .net standard, while the hot update dll must be packaged with .net 4.x**. For detailed explanation, please refer to "),e("RouterLink",{attrs:{to:"/en/hybridclr/common_errors/"}},[t._v("Common Errors Documentation")])],1)])}),[],!1,null,null,null);e.default=r.exports}}]);