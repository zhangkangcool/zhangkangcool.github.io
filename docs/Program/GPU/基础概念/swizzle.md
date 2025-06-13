<h1 align="center">swizzle</h1>




https://blog.csdn.net/PangNanGua/article/details/86527236



# Swizzle 操作符



#### Swizzle 操作符

可以使用Cg语言中的**swizzle操作符**（`.`）将一个向量的成员取出组成一个新的向量。swizzle操作符被GPU硬件高效支持。swizzle操作符后接**x、y、z、w**，分别表示原始向量的第一个、第二个、第三个、第四个元素；swizzle操作符后接 **r、g、b**和**a**的含义与前者等同。不过为了程序的易读性，建议对于表示颜色值的向量，使用swizzle操作符后接r、g、b和a的方式。

举例如下：

```c++
float4(a, b, c, d).xyz 等价于  float3(a, b, c)
float4(a, b, c, d).xyy 等价于  float3(a, b, b)
float4(a, b, c, d).wzyx 等价于  float4(d, c, b, a)
float4(a, b, c, d).w 等价于  float d
```

值得注意的是，Cg语言中***float a 和float1 a是基本等价的\***，两者可以进行类型转换；float、bool、half等基本类型声明的变量也可以使用swizzle操作符。例如：

```c++
float a = 1.0;
float4 b = a.xxxx;
```

注意：***swizzle操作符只能对结构体和向量使用，不能对数组使用\***，如果对数组使用swizzle操作符则会出现错误信息：`error C1010: expression left of .”x” is not a struct or array`（其实个人觉得，提示的错误信息中array换成vector更加合适）。



要从数组中取值必须使用`[]`符号。例如：

```c++
float a[3] = {1.0,1.0,0.0};
float b = a[0]; //正确
float c = a.x; //编译会提示错误信息
```