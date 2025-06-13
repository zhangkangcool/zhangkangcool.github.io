<h1 align="center">CTS测试说明</h1>






## 1. 编译
### 1.1 设置环境变量DRIVER
可以在`presubmit.sh`编译脚本中直接设置DRIVER，或者使用export进行设置，建议后者。
如
```
export DRIVER=/home/ken/workspace/Compiler_6434/install
```

### 1.2 编译spirv_new和api
```
./presubmit.sh
```


## 2. spirv_new测试
运行前需使用export设置DRIVER或者直接run_spirv_new_test.sh中的DRIVER
```
cd build/test_conformance/spirv_new
```

使用下面的命令运行所有测试
```
run_spirv_new_test.sh
或者
run_spirv_new_test.sh a
```
该脚本可以接一个参数，仅运行和某类测试，可接的参数如下
```
decorate                   装饰指令测试
controlFlowAndLinkage      程序与流程控制测试
constant                   常量与复制指令测试
arithmetic                 算术与向量操作测试
function                   函数操作测试
other                      其他测试
···
如
```
run_spirv_new_test.sh decorate
```


## 3. OpenCL API函数测试
运行前需使用export设置DRIVER或者直接run_api_test.sh中的DRIVER
```
cd build/test_conformance/api
```

使用下面的命令运行所有测试
```
run_api_test.sh
或者
run_api_test.sh all
```
该脚本可以接一个参数，仅运行和某类测试，可接的参数如下
```
device                    OpenCL平台和设备管理API测试
context                   OpenCL上下文管理API测试  
command                   OpenCL命令队列管理API测试
memory                    OpenCL内存对象管理API测试
program                   OpenCL程序和内核管理API测试
queue                     OpenCL队列操作和任务执行API测试
other                     OpenCL其它API测试
···
如
```
run_api_test.sh device
```

