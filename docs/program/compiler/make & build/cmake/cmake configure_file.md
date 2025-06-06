<h1 align="center">cmake configure_file</h1>


https://www.jianshu.com/p/2946eeec2489

1. [https://cmake.org/cmake/help/latest/command/configure_file.html](https://links.jianshu.com/go?to=https%3A%2F%2Fcmake.org%2Fcmake%2Fhelp%2Flatest%2Fcommand%2Fconfigure_file.html)

   

# Cmake命令之configure_file介绍



# 一、命令格式

> #### configure_file(input output options)
>
> ####   *将一个文件(由`input`参数指定)拷贝到指定位置(由`output`参数指定)，并根据`options`修改其内容。*

# 二、命令解析

####   configure_file命令一般用于自定义编译选项或者自定义宏的场景。configure_file命令会根据`options`指定的规则，自动对`input`文件中`cmakedefine`关键字及其内容进行转换。

####   具体来说，会做如下几个替换：

####   1. 将input文件中的`@var@`或者`${var}`替换成cmake中指定的值。

####   2. 将input文件中的`#cmakedefine var`关键字替换成`#define var`或者`#undef var`，取决于cmake是否定义了var。

#### 

# 三、举例说明

####   需要准备2个文件，config.h.in（input）、CMakeLists.txt，（output是自动生成的）内容如下：

####   config.h.in



```objc
#cmakedefine var1
#cmakedefine var2 "@var2@" #注意：@@之间的名称要与cmakedefine后的变量名一样
#cmakedefine var3 "${var3}" #注意：${}之间的名称要与cmakedefine后的变量名一样
#ifdef _@var4@_${var5}_
#endif
```

####   CMakeLists.txt



```bash
cmake_mininum_required(VERSION 2.8)
project (configure_file_test)
option (var1 "use var1..." ON)  #定义var1，也可以使用cmake -Dvar1=ON替代
set (var2 13) #指定var2的值
set (var3 "var3string") #指定var3的值
set (var4 "VARTEST4")
set (var5 "VARTEST5")

configure_file (config.h.in config.h)
```

####   执行cmake命令



```undefined
cmake .
```

####   自动生成的config.h文件内容



```cpp
#define var1
#define var2 "13"
#define var3 "var3string"
#ifdef _VARTEST4_VARTEST5_
#endif
```

# 四、更多细节

- #### 参数详解

##### **`input`** - 输入文件的路径，它是一个相对路径，以[`CMAKE_CURRENT_SOURCE_DIR`](https://links.jianshu.com/go?to=https%3A%2F%2Fcmake.org%2Fcmake%2Fhelp%2Fv3.14%2Fvariable%2FCMAKE_CURRENT_SOURCE_DIR.html%23variable%3A%22CMAKE_CURRENT_SOURCE_DIR%22)为路径前缀。此外，![\color{red}{它必须是一个文件，不能是目录}](cmake configure_file.assets/math-20230706161016888)。

##### **`output`** - 输出文件或目录，它也是一个相对路径，以[`CMAKE_CURRENT_BINARY_DIR`](https://links.jianshu.com/go?to=https%3A%2F%2Fcmake.org%2Fcmake%2Fhelp%2Fv3.14%2Fvariable%2FCMAKE_CURRENT_BINARY_DIR.html%23variable%3ACMAKE_CURRENT_BINARY_DIR)为前缀。如果output的名称与已存在的目录名称相同，则会在该目录下生成一个与input文件名相同的文件。举个例子：如果input的文件名是inputfile，output是一个目录currentdir，那么生成的文件为currentdir/inputfile。

##### **`options`** - 参数选项

> 1. `COPYONLY`：简单的把`input`文件拷贝到`output`，不做任何替换。注意，![\color{red}{该选项与}](cmake configure_file.assets/math-20230706161016937)`NEWLINE_STYLE`![\color{red}{冲突，不能同时使用}](cmake configure_file.assets/math)。
> 2. `ESCAPE_QUOTES`：忽略反斜杠（C语言风格）的转义。
>      举个例子，不加`ESCAPE_QUOTES`的情况，也就是默认会对反斜杠进行转义：
>
> 
>
> ```cpp
> config.h.in文件：
> #define @var@
> 
> CMakeLists.txt文件：
> set (var "\"VAR\"")
> configure_file (config.h.in config.h)
> 
> 生成的config.h文件：
> #define "VAR"
> ```
>
>   加`ESCAPE_QUOTES`的情况，不对反斜杠进行转义：
>
> 
>
> ```csharp
> config.h.in文件：
> #define @var@
> 
> CMakeLists.txt文件：
> set (var "\"VAR\"")
> configure_file (config.h.in config.h ESCAPE_QUOTES)
> 
> 生成的config.h文件：
> #define \"VAR\"
> ```
>
> 1. `@ONLY`：只替换`@var@`，不替换`${var}`。`${var}`在脚本语言中有语义含义（替换会导致含义发生变化），因此在处理这类文件的时候，该选项很有用。
> 2. `NEWLINE_STYLE`：指定`output`文件的换行风格，例如linux以\n作为换行，windows以\r\n作为换行。该参数后面要指明换行的规则，如`UNIX|DOS|WIN32|LF|CRLF`。

- #### cmakedefine01命令

#####   `#cmakedefine01 var`

#####   如果var有定义，则实际生成的效果为：`#define var 1`；如果var未定义，生成的效果为：`#define var 0`。



```dart
config.h.in文件：
#cmakedefine01 var

CMakeLists.txt文件：
option(var "use var..." ON) # 实际也可以用cmake -Dvar=ON或者cmake -Dvar=OFF来定义或者不定义
#set (var XXX) # 用set来定义var也可以，验证发现XXX为0的时候相当于var未定义，XXX为非0的时候效果相当于var有定义

生成的config.h文件：
#define var 1 # 当var有定义
#define var 0 # 当var未定义
```

- #### 其他注意事项

> 1. 对于`#cmakedefine var @var@`或#`cmakedefine var ${var}`，@@之间或${}内的变量名称要与cmakedefine后的变量名称一样，否则替换不成功。
> 2. `configure_file`要放在变量定义之后（验证发现`OPTION`定义的变量可以在configure_file之后）。



