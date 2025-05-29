





```c++
message( [STATUS|WARNING|AUTHOR_WARNING|FATAL_ERROR|SEND_ERROR]
  "message to display" ...)
  
(无) = 重要消息；
 STATUS = 非重要消息；
 WARNING = CMake 警告, 会继续执行；
 AUTHOR_WARNING = CMake 警告 (dev), 会继续执行；
 SEND_ERROR = CMake 错误, 继续执行，但是会跳过生成的步骤；
 FATAL_ERROR = CMake 错误, 终止所有处理过程；
```





```
SET(USER_KEY, "Hello World")
MESSAGE( STATUS "this var key = ${USER_KEY}.")

```



```
set(CMAKE_CXX_COMPILER aarch64-linux-gnu-g++)

if (NOT CMAKE_CXX_COMPILER)
    message(FATAL_ERROR "not found ${CMAKE_CXX_COMPILER}") # CMAKE会报错停止
或者直接用
    return(0) # 不报错，直接退出返回‘’
else()
    message(status "FOUND ${CMAKE_CXX_COMPILER}")
endif()
```

