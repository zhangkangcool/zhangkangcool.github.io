

# AddLLVM.cmake

`llvm/cmake/modules/AddLLVM.cmake`

该文件放的是各种宏和函数，这些函数名中有`clang`和`llvm`，但不属于CMAKE提前的默认方法。，供LLVM中的`CMakeLists.txt`使用。如`add_llvm_library`、`add_llvm_tools`。





### 1. llvm_add_library

```cmake
...
  target_link_libraries(${name} ${libtype}
      ${ARG_LINK_LIBS}
      ${lib_deps}
      ${llvm_libs}
      )
...

message("library name: ${name}")
message("ARG_LINK_LIBS: ${ARG_LINK_LIBS}")
message("lib_deps: ${lib_deps}")
message("llvm_libs: ${llvm_libs}")
```

在该函数的后面，可以输入`lib_deps`和`llvm_libs`用于查看某个库的依赖。