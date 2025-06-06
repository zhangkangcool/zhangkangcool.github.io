<h1 align="center">CMake set</h1>

https://blog.csdn.net/Jay_Xio/article/details/121033423







# 1. 设置普通变量

### 1.1 指令格式

```cmake
set(<variable> <value>... [PARENT_SCOPE])
```

- `variable`：只能有一个；
- `value`：可以有0个，1个或多个，当value值为空时，方法同unset，用于取消设置的值；
- `PARENT_SCOPE(父作用域)`：作用域，除PARENT_SCOPE外还有function scope（方法作用域）和directory scope（目录作用域）。设置作用于上调用函数或者调用该cmake的上层目录。



```cmake
set(mul_vars zhang kang)
message("mul_vars: ${mul_vars}")

输出 列表以分号分割：
mul_vars: zhang;kang

这里也可以使用list一个个添加，或者分成多行进行添加
list(APPEND mul_vars zhang kang)
```





------

### 1.2 示例

#### 1.2.1 子目录

目录结构：

```shell
├── CMakeLists.txt
└── subsrc
    └── CMakeLists.txt
```



**(1) 子目录未改变根目录变量的值(未使用PARENT_SCODE)**

**根目录**的CMakeLists.txt：

```cmake
cmake_minimum_required(VERSION 3.10 FATAL_ERROR)
project(sample_005 LANGUAGES CXX)

message("根目录的 CMakeLists.txt 文件")

set(MY_CUSTOM_VAL 123)
message("根目录的 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

add_subdirectory(subsrc)

message("回到根目录")
message("根目录的 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")
```



**子目录**的CMakeLists.txt：

```cmake
cmake_minimum_required(VERSION 3.10 FATAL_ERROR)
project(sample_005 LANGUAGES CXX)

message("  子目录的 CMakeLists.txt 文件")

message("  子目录修改变量之前 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")
set(MY_CUSTOM_VAL 234)
message("  子目录修改变量之后 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")
```



以下是执行结果：

```shell
$ cmake .         
根目录的 CMakeLists.txt 文件
根目录的 MY_CUSTOM_VAL = 123
  子目录的 CMakeLists.txt 文件
  子目录修改变量之前 MY_CUSTOM_VAL = 123
  子目录修改变量之后 MY_CUSTOM_VAL = 234
回到根目录
根目录的 MY_CUSTOM_VAL = 123
-- Configuring done (0.0s)
-- Generating done (0.0s)
-- Build files have been written to: /Users/ken/workspace/test/cmake_test
```



从运行结果来看，子目录把`MY_CUSTOM_VAL`的值设置为了`234`，但是只在子目录有效，未改变根目录该变量的值，根目录的`MY_CUSTOM_VAL`的值仍为了`123`。

-------



**(1) 子目录改变根目录变量的值(使用PARENT_SCODE)**

根目录CMakeLists.txt不变。
子目录CMakeLists.txt如下：

```cmake
cmake_minimum_required(VERSION 3.10 FATAL_ERROR)
project(sample_005 LANGUAGES CXX)

message("  子目录的 CMakeLists.txt 文件")

message("  子目录修改变量之前 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")
set(MY_CUSTOM_VAL 234 PARENT_SCOPE)   # 此行加了PARENT_SCODE
message("  子目录修改变量之后 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

```



以下是运行结果

```shell
 cmake ..
-- The CXX compiler identification is AppleClang 12.0.0.12000032
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /Library/Developer/CommandLineTools/usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
根目录的 CMakeLists.txt 文件
根目录的 MY_CUSTOM_VAL = 123
  子目录的 CMakeLists.txt 文件
  子目录修改变量之前 MY_CUSTOM_VAL = 123
  子目录修改变量之后 MY_CUSTOM_VAL = 123    # 这里发生了变化
回到根目录
根目录的 MY_CUSTOM_VAL = 234   # 这里发生了变化 
-- Configuring done (0.4s)
-- Generating done (0.0s)
-- Build files have been written to: /Users/ken/workspace/test/cmake_test/build

```



从运行结果来看，子目录把`MY_CUSTOM_VAL`的值设置为了`234`，但是只在子目录有效，未改变根目录该变量的值，根目录的`MY_CUSTOM_VAL`的值仍为了`123`。



----------



### 1.2 function() [作用域](https://so.csdn.net/so/search?q=作用域&spm=1001.2101.3001.7020)使用set指令

**(1)根目录CMakeLists.txt，`set`指令不加`PARENT_SCOPE`**

```shell
cmake_minimum_required(VERSION 3.10 FATAL_ERROR)
project(sample_005 LANGUAGES CXX)

message("根目录的 CMakeLists.txt 文件")

set(MY_CUSTOM_VAL 123)
message("根目录的 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

function(func1)
    message("  function func1 修改变量之前 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")
    set(MY_CUSTOM_VAL 234)
    message("  function func1 修改变量之后 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")
endfunction(func1)

func1()
message("回到根目录")
message("根目录的 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

```



运行结果：

```shell
cmake .
-- The CXX compiler identification is AppleClang 12.0.0.12000032
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /Library/Developer/CommandLineTools/usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
根目录的 CMakeLists.txt 文件
根目录的 MY_CUSTOM_VAL = 123
  function func1 修改变量之前 MY_CUSTOM_VAL = 123
  function func1 修改变量之后 MY_CUSTOM_VAL = 234
回到根目录
根目录的 MY_CUSTOM_VAL = 123
-- Configuring done (0.4s)
-- Generating done (0.0s)
-- Build files have been written to: /Users/ken/workspace/test/test2
```



函数中中不加`PARENT_SCODE`的话，只对函数内的变量进行了修改，不影响调用函数。





(2)根目录CMakeLists.txt，`set`指令加`PARENT_SCOPE`

```cmake
cmake_minimum_required(VERSION 3.10 FATAL_ERROR)
project(sample_005 LANGUAGES CXX)

message("根目录的 CMakeLists.txt 文件")

set(MY_CUSTOM_VAL 123)
message("根目录的 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

# 定义一个函数func1
function(func1)
    message("  function func1 修改变量之前 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")
    set(MY_CUSTOM_VAL 234 PARENT_SCOPE)
    message("  function func1 修改变量之后 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")
endfunction(func1)

# 调用函数func1
func1()

message("回到根目录")
message("根目录的 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

```



运行结果：

```shell
cmake .
根目录的 CMakeLists.txt 文件
根目录的 MY_CUSTOM_VAL = 123
  function func1 修改变量之前 MY_CUSTOM_VAL = 123
  function func1 修改变量之后 MY_CUSTOM_VAL = 123
回到根目录
根目录的 MY_CUSTOM_VAL = 234
-- Configuring done (0.0s)
-- Generating done (0.0s)
-- Build files have been written to: /Users/ken/workspace/test/test2
```

调用函数的地方发生了变化，函数内变量不变。

-----

### 1.3 macro() 宏使用set指令

```cmake
cmake_minimum_required(VERSION 3.10 FATAL_ERROR)
project(sample_005 LANGUAGES CXX)

message("根目录的 CMakeLists.txt 文件")

set(MY_CUSTOM_VAL 123)
message("根目录的 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

# 宏定义testmcro
macro(testmcro)
    message("  macro testmcro 修改变量之前 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")
    set(MY_CUSTOM_VAL 234)
    message("  macro testmcro 修改变量之后 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")
endmacro(testmcro)

# 调用宏testmcro
testmcro()

message("回到根目录")
message("根目录的 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

```



运行结果
```shell
根目录的 CMakeLists.txt 文件
根目录的 MY_CUSTOM_VAL = 123
  macro testmcro 修改变量之前 MY_CUSTOM_VAL = 123
  macro testmcro 修改变量之后 MY_CUSTOM_VAL = 234
回到根目录
根目录的 MY_CUSTOM_VAL = 234
-- Configuring done (0.0s)
-- Generating done (0.0s)
-- Build files have been written to: /Users/ken/workspace/test/test2
```

从运行结果来看，宏`macro()`不需要加`PARENT_SCOPE`就能修改宏外面的变量值。

-----



### 1.4 include()

在根目录新建一个`cmake`的文件夹，增加一个`custom.cmake`的文件

```shell
.
├── CMakeLists.txt
├── build
└── cmake
    └── custom.cmake

3 directories, 2 files

```





`custom.cmake`的文件内容：

```cmake
message("  进入cmake目录下的custom.cmake文件")

message("  custom.cmake文件修改变量之前 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")
set(MY_CUSTOM_VAL 234)
message("  custom.cmake文件修改变量之后 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

```



根目录下的CMakeLists.txt文件：

```cmake
cmake_minimum_required(VERSION 3.10 FATAL_ERROR)
project(sample_005 LANGUAGES CXX)

message("根目录的 CMakeLists.txt 文件")

set(MY_CUSTOM_VAL 123)
message("根目录的 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

# 使用include的添加.cmake文件
list(APPEND CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/cmake) 
include(custom) # 从 CMAKE_MODULE_PATH 包含的路径中搜索 custom.cmake 文件

message("回到根目录")
message("根目录的 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

```



结果

```shell
-- The CXX compiler identification is AppleClang 12.0.0.12000032
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /Library/Developer/CommandLineTools/usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
根目录的 CMakeLists.txt 文件
根目录的 MY_CUSTOM_VAL = 123
  进入cmake目录下的custom.cmake文件
  custom.cmake文件修改变量之前 MY_CUSTOM_VAL = 123
  custom.cmake文件修改变量之后 MY_CUSTOM_VAL = 234
回到根目录
根目录的 MY_CUSTOM_VAL = 234
-- Configuring done (0.5s)
-- Generating done (0.0s)
-- Build files have been written to: /Users/ken/workspace/test/test2/build

```



从运行结果来看，`custom.cmake`文件虽然在下一级目录，但是在`custom.cmake`文件里面不需要添加`PARENT_SCOPE`就能修改根目录下的CMakeLists.txt文件中的变量。

---------

### 普通变量使用总结

- 使用 add_subdirectory()添加子目录的CMakeLists 或者 使用 function()，变量的作用域改变了，如果要修改上一级作用域的变量则需要加PARENT_SCOPE；
- 使用macro() 或者 include()未改变变量的作用域，不用加PARENT_SCOPE就能改变外面的变量值；
- 通过 include()和 macro() 相当于把这两部分包含的代码直接加入根目录 CMakeLists.txt 文件中去执行，相当于他们是一个整体。



------



## 2 设置缓存变量

根目录下的CMakeLists.txt文件：

```cmake
cmake_minimum_required(VERSION 3.10 FATAL_ERROR)
project(sample_005 LANGUAGES CXX)

message("根目录的 CMakeLists.txt 文件")

# Cache变量
message("设置Cache变量之前 filePath = ${filePath}")
set(filePath ${PROJECT_SOURCE_DIR}/CMakeLists.txt CACHE FILEPATH " file path")
message("设置Cache变量之后 filePath = ${filePath}")
set(filePath ${PROJECT_SOURCE_DIR}/subsrc/CMakeLists.txt CACHE FILEPATH " file path")
message("设置Cache变量[不带FORCE]之后 filePath = ${filePath}")
set(filePath ${PROJECT_SOURCE_DIR}/cmake/custom.cmake CACHE FILEPATH " file path" FORCE)
message("设置Cache变量[带FORCE]之后 filePath = ${filePath}")

message("回到根目录")
message("根目录的 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

```



运行结果



每一次运行`cmake .`

```shell
cmake .
-- The CXX compiler identification is AppleClang 12.0.0.12000032
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /Library/Developer/CommandLineTools/usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
根目录的 CMakeLists.txt 文件
设置Cache变量之前 filePath = 
设置Cache变量之后 filePath = /Users/ken/workspace/test/test2/CMakeLists.txt
设置Cache变量[不带FORCE]之后 filePath = /Users/ken/workspace/test/test2/CMakeLists.txt
设置Cache变量[带FORCE]之后 filePath = /Users/ken/workspace/test/test2/cmake/custom.cmake
回到根目录
根目录的 MY_CUSTOM_VAL = 
-- Configuring done (0.4s)
-- Generating done (0.0s)
-- Build files have been written to: /Users/ken/workspace/test/test2
```



不做任何删除，再次运行`cmake .`

```shell
根目录的 CMakeLists.txt 文件
设置Cache变量之前 filePath = /Users/ken/workspace/test/test2/cmake/custom.cmake
设置Cache变量之后 filePath = /Users/ken/workspace/test/test2/cmake/custom.cmake
设置Cache变量[不带FORCE]之后 filePath = /Users/ken/workspace/test/test2/cmake/custom.cmake
设置Cache变量[带FORCE]之后 filePath = /Users/ken/workspace/test/test2/cmake/custom.cmake
回到根目录
根目录的 MY_CUSTOM_VAL = 
-- Configuring done (0.0s)
-- Generating done (0.0s)
-- Build files have been written to: /Users/ken/workspace/test/test2

```



从运行结果上看：

- 在设置Cache变量之前，此变量就有值了，说明此变量的值被报存在一个缓存文件中；
- 此Cache变量的值在第一次执行`cmake ..`后保存在了一个名为`CMakeCache.txt`文件中；
- 删除`CMakeCache.txt`文件可以删掉此缓存变量。



--------



## 3 设置环境变量

在Ubuntu系统的`~/.bashrc`文件中添加了一个自定义的环境变量`TEXT_ENV_VAL`

根目录下的CMakeLists.txt文件：

```cmake
cmake_minimum_required(VERSION 3.10 FATAL_ERROR)
project(sample_005 LANGUAGES CXX)

message("根目录的 CMakeLists.txt 文件")

# 设置环境变量
message("环境变量修改之前 TEXT_ENV_VAL = $ENV{TEXT_ENV_VAL}")
set(ENV{TEXT_ENV_VAL} /usr/local/text_c)
message("环境变量修改之后 TEXT_ENV_VAL = $ENV{TEXT_ENV_VAL}")

message("回到根目录")
message("根目录的 MY_CUSTOM_VAL = ${MY_CUSTOM_VAL}")

```



运行结果：

```shell
-- The CXX compiler identification is AppleClang 12.0.0.12000032
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Check for working CXX compiler: /Library/Developer/CommandLineTools/usr/bin/c++ - skipped
-- Detecting CXX compile features
-- Detecting CXX compile features - done
根目录的 CMakeLists.txt 文件
环境变量修改之前 TEXT_ENV_VAL = 
环境变量修改之后 TEXT_ENV_VAL = /usr/local/text_c
回到根目录
根目录的 MY_CUSTOM_VAL = 
-- Configuring done (0.4s)
-- Generating done (0.0s)
-- Build files have been written to: /Users/ken/workspace/test/test2

```





- 修改环境变量只在当前CMakeList.txt中有效，而没有真正改变操作系统中的环境变量的值；
- 在子目录的CMakeLists.txt中查看此环境变量的值，也是修改后的值。





最简单的一个测试：

```
set(MY_var 123)
message("MY VAR: ${MY_VAR}")
```

