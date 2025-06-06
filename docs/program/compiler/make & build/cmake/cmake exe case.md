<h1 align="center">cmake exe case</h1>




使用`CMake_CURRENT_PATH`比用`PROJECT_SOURCE_DIR`更好

```c++
set(CMAKE_CXX_COMPILER g++)
set(CMAKE_VERBOSE_MAKEFILE ON)
 
  
include_directories (${PROJECT_SOURCE_DIR}/../3rdparty/lxapu/include)
include_directories (${PROJECT_SOURCE_DIR}/../src)
                      
link_directories (sPROJECT _SOURCE_DIR)/../3rdparty/lxapu/libs)

#LINK_LIBRARIES　（添加需要链接的库文件路径，注意这里是全路径）
LINK_LIBRARIES("/opt/MATLAB/R2012a/bin/glnxa64/libeng.so")
LINK_LIBRARIES("/opt/MATLAB/R2012a/bin/glnxa64/libmx.so")
  

if (CMAKE_BUILD_TYPE STREQUAL "Debug")
  add_definitions(-ggdb -O0 -Wall)
else() # Release
  add_definitions(-03 -Wall)
#endif

add_compile_options(-Werror)
  
# 自动新建bin文件，放编译出来的可执行文件
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_CURRENT_SOURCE_DIR}/bin)

# cpp文件全部放在src下    
aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR}/src SRC)
add_executable(lynHopSourceGenerator ${SRC})

# 或者（不推荐）
#add_executable(lynHopSourceGenerator ${CMAKE_CURRENT_SOURCE _DIRt /lynHopSource
#Generator.cpp
#                                     S{CMAKE_CURRENT_SOURCE_DIR}/commandLineUtils.cpp)

target_link_libraries (lynHopSourceGenerator -lpthread)
```



最上层的CMakeLists.txt只需要写

```
add_subdirectory(mchips/test) # 使用mchips/test下的CMakeLists.txt
```



为源文件的编译添加由-D定义的标志。

```
add_definitions(-DFOO -DBAR ...)
```