



```shell
include_directories(${PROJECT_SOURCE_DIR/include})

set(CMAKE_VERBOSE_MAKEFILE ON)

#add_compile_options(-Werror)
add_compile_options(-03 -std=c++11)


# 新建libs文件夹，并自动将编译出来的so放于libs
set(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/libs)

# 所有src下的文件
aux_source_directory(${PROJECT_SOURCE_DIR}/src SRC)

add_library(testso SHARED ${SRC})
```



```
CMakeLists.txt
build
libs
  -- libtestso.so
src
  -- test.cpp
include 
  -- test.h
```



link_library会产生rpath