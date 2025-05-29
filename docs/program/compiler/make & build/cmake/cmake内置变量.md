https://blog.csdn.net/fanrongwoaini/article/details/126559472



1、预定义变量
PROJECT_SOURCE_DIR
工程的根目录，执行cmake时所使用的CMakeLists.txt所在的目录

PROJECT_BINARY_DIR
运行 cmake 命令的目录，通常是 ${PROJECT_SOURCE_DIR}/build
1
PROJECT_NAME
    返回通过 project 命令定义的项目名称
1
CMAKE_CURRENT_SOURCE_DIR
当前处理的 CMakeLists.txt 所在的路径

CMAKE_CURRENT_BINARY_DIR
target 编译目录

CMAKE_CURRENT_LIST_DIR
CMakeLists.txt 的完整路径

CMAKE_CURRENT_LIST_LINE
当前所在的行

CMAKE_MODULE_PATH
定义自己的 cmake 模块所在的路径，SET(CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/cmake)，然后可以用INCLUDE命令来调用自己的模块

EXECUTABLE_OUTPUT_PATH
重新定义目标二进制可执行文件的存放位置

LIBRARY_OUTPUT_PATH
重新定义目标链接库文件的存放位置

2、环境变量
使用环境变量
$ENV{Name}

写入环境变量
set(ENV{Name} value)
这里没有“$”符号

3、系统信息
­CMAKE_MAJOR_VERSION
cmake 主版本号，比如 3.4.1 中的 3

­CMAKE_MINOR_VERSION
cmake 次版本号，比如 3.4.1 中的 4

­CMAKE_PATCH_VERSION
cmake 补丁等级，比如 3.4.1 中的 1

­CMAKE_SYSTEM
系统名称，比如 Linux-­2.6.22

­CMAKE_SYSTEM_NAME
不包含版本的系统名，比如 Linux

­CMAKE_SYSTEM_VERSION
系统版本，比如 2.6.22

­CMAKE_SYSTEM_PROCESSOR
处理器名称，比如 i686

­UNIX
在所有的类 UNIX 平台下该值为 TRUE，包括 OS X 和 cygwin

­WIN32
在所有的 win32 平台下该值为 TRUE，包括 cygwin

4、主要开关选项
BUILD_SHARED_LIBS
这个开关用来控制默认的库编译方式，如果不进行设置，使用 add_library 又没有指定库类型的情况下，默认编译生成的库都是静态库。
如果 set(BUILD_SHARED_LIBS ON) 后，默认生成的为动态库

CMAKE_C_FLAGS
设置 C 编译选项，也可以通过指令 add_definitions() 添加

CMAKE_CXX_FLAGS
设置 C++ 编译选项，也可以通过指令 add_definitions() 添加

add_definitions(-DENABLE_DEBUG -DABC) # 参数之间用空格分隔
————————————————
版权声明：本文为CSDN博主「开始沸腾了」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/fanrongwoaini/article/details/126559472