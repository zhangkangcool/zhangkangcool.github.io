



https://zhuanlan.zhihu.com/p/47433678

# 三大 Shader 编程语言（CG/HLSL/GLSL）

## 什么是Shader Language**

Shader Language的发展方向是设计出在便携性方面可以和C++、Java等相比的高级语言，“赋予程序员灵活而方便的编程方式”，并“尽可能的控制渲染过程”同时“利用图形硬件的并行性，提高算法效率”。

Shader Language目前主要有3种语言：

1. 基于 OpenGL 的 **OpenGL Shading Language**，简称 **GLSL**;

2. 基于 DirectX 的 **High Level Shading Language**,简称 **HLSL**;

3. 还有 NVIDIA 公司的 **C for Graphic**，简称 **Cg** 语言。  

   Cg语言是Microsoft和NVIDIA相互协作在标准硬件光照语言的语法和语义上达成了一致，HLSL和Cg其实是同一种语言

### 1. OpenGL简介

OpenGL（全写Open Graphics Library）是一个定义了跨编程语言、跨平台的编程接口规格的专业图形程序接口。它用于三维图像（二维亦可），是一个功能强大，调用方便的底层图形库。OpenGL是行业领域中最为广泛接纳的2D/3D图形API，其自诞生至今已催生了各种计算机平台及设备上的数千优秀应用程序。它独立于视窗操作系统或其他操作系统的，亦是网络透明的。在包含CAD、内容创作、能源、娱乐、游戏开发、制造业及虚拟现实等行业领域中。OpenGL是一个与硬件无关的软件接口，可以在不同的平台如Windows 95、Windows NT、Unix、Linux、MacOS、OS/2之间进行移植。因此，支持OpenGL的软件具有很好的移植性，可以获得非常广泛的应用。

OpenGL的发展一直处于一种较为迟缓的态势，每次版本的提高新增的技术很少，大多只是对其中部分作出修改和完善。1992年7月，SGI公司发布了OpenGL的1.0版本，随后又与微软公司共同开发了Windows NT版本的OpenGL，从而使一些原来必须在高档图形工作站上运行的大型3D图形处理软件也可以在微机上运用。1995年OpenGL的1.1版本面世，该版本比1.0的性能有许多提高，并加入了一些新的功能，其中包括改进打印机支持，在增强元文件中包含OpenGL的调用，顶点数组的新特性，提高顶点位置、法线、颜色、色彩指数、纹理坐标、多边形边缘标识的传输速度，引入了新的纹理特性等等。OpenGL 1.5又新增了“OpenGL Shading Language”，该语言是“OpenGL 2.0”的底核，用于着色对象、顶点着色以及片段着色技术的扩展功能。



### 2. DirectX简介

DirectX（Direct eXtension，简称DX）是由微软公司创建的多媒体编程接口。由C++编程语言实现，遵循COM。被广泛适用于Microsoft Windows、Microsoft XBOX、Microsoft XBOX 360和Microsoft XBOX ONE电子游戏开发，并且只能支持这些平台。最新版本为DirextX 12，创建在最新的Windows 10。DirectX是这样一组技术：它们旨在使基于Windows的计算机成为运行和显示具有丰富多媒体元素（例如全色图形、视频、3D动画和丰富音频）的应用程序的理想平台。DirectX包括安全和性能更新程序，以及许多涵盖所有技术的新功能。应用程序可以通过使用DirectX API来访问这些新功能。

DirectX加强3D图形个声音效果，并提供设计人员一个共同的硬件驱动标准，让游戏开发者不必为每一品牌的硬件来写不同的驱动程序，也降低了用户安装及设置硬件的复杂度。从字面意义上说，Direct就是直接的意思，而后边的X则代表了很多意思，从这一点上可以看出DirectX的出现就是为了众多软件提供直接服务的。

举例来说，以前在DOS下玩家玩游戏时，并不是安装上就可以玩了，他们往往首先要设置声卡的品牌和型号，然后还要设置IRQ（中断）、I/O（输入和输出）、DMA（存取模式），如果哪项设置不对，那么游戏声音就发不出来。这部分的设置不仅让玩家伤透脑筋，对游戏开发者来说就更为头痛，为了让游戏能够正确运行，开发者必须在游戏制作之初，把市面上所有声卡硬件数据都收集过来，然后根据不同的API（应用编程接口）来写不同的驱动程序。这对于游戏制作公司来说，是很难完成的，所以在当时多媒体游戏很少。微软正是看到了这个问题，为众厂家推出了一个共同的应用程序接口——DirectX。只要游戏是依照DirectX来开发的，不管显卡、声卡型号如何，统统都能玩，而且还能发挥最佳的效果。当然，前提是使用的显卡、声卡的驱动程序必须支持DirectX才行。



### 3. Cg

GLSL与HLSL分别基于OpenGL和Direct3D的接口，两者不能混用，事实上OpenGL和Direct3D一直都是冤家对头，争斗良久。OpenGL在其长期发展中积累下的用户群庞大，这些用户会选择GLSL学习。GLSL继承了OpenGL的良好移植性，一度在Unix等操作系统上独领风骚。但GLSL的语法体系自成一家。微软的HLSL移植性较差，在Windows平台上可谓一家独大，这一点在很大程度上限制了HLSL的推广和发展。但是HLSL用于DX游戏领域却是深入人心。

Cg语言（C for Graphic）是为GPU编程设计的高级着色语言，Cg极力保留C语言的大部分语义，并让开发者从硬件细节中解脱出来，Cg同时也有一个高级语言的其它好处，如代码的易重用性，可读性得到提高，编译器代码优化。Cg是一个可以被OpenGL和Direct3D广泛支持的图形处理器编程语言。Cg语言和OpenGL、Direct3D并不是同一层次的语言，而是OpenGL和DirectX的上层，即Cg程序是运行在OpenGL和DirectX标准顶点和像素着色的基础上的。Cg由NVIDIA公司和微软公司相互协作在标准硬件光照语言的语法和语义上达成了一致开发。所以，HLSL和Cg其实是同一种语言。



**Unity使用的是哪种编程语言**

Unity官方手册上讲Shader程序嵌入的小片段是用Cg/HLSL编写的，从“CGPROGRAM”开始，到“CGEND”结束。所以，Unity官方主要是用Cg/HLSL编写Shader程序片段。Unity官方手册也说明对于Cg/HLSL程序进行扩展也可以使用GLSL，不过Unity官方建议使用原生的GLSL进行编写和测试。如果不使用原生GLSL，你就需要知道你的平台必须是Mac OS X、OpenGL ES 2.0以上的移动设备或者是Linux。在一般情况下Unity会把Cg/HLSL交叉编译成优化过的GLSL。因此我们有多种选择，我们既可以考虑使用Cg/HLSL，也可以使用GLSL。不过由于Cg/HLSL更好的跨平台性，更倾向于使用Cg/HLSL编写Shader程序。

