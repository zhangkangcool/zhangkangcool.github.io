





```c++
export LD_LIBRARY_PATH=/lib/aarch64-linux-gnu/mwv207:$LD_LIBRARY_PATH
cd ~/workspace/Compiler_6434/compiler/libSPVTRANS/test/test_add_spirv
gcc -g3 -O0 main.c -lOpenCL -L/lib/aarch64-linux-gnu/mwv207 
```



输出如结果是正确的，说明支持`clCreateProgramWithIL`函数的使用。



修改char* spirv_kernel = "add/add.spv";为`char* spirv_kernel = "add_opt/add.spv";`均能测试通过。这连个case使用的SPIRV是1.0的版本。



理论上来说，使用我们前端优化有的SPV文件，也是可行的。







~/workspace/Compiler_6434/compiler/libSPVTRANS/test/test_add_src case修改后报错，应该是使用上哪里有问题，和testBlas程序有一样的错误。