



```shell


# clang target 
# 必须是 --target=xxx， 不能没有等于
clang test.c --target=x86_64
clang test.c --target=ppc64
clang test.c --target=lyngpu


# cc1 triple
clang -cc1 -triple amdgcn test.c -S -emit-llvm -o test.ll 


```







