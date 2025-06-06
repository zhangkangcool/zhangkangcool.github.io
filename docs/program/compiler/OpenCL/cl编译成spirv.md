<h1 align="center">cl编译成spirv</h1>






```shell
../../install/bin/clang -c -target spir -x cl -emit-llvm -cl-std=CL1.2 -fno-discard-value-names -Xclang -finclude-default-header ../add.cl
```

