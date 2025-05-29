## LD LLD GOLD

编译llvm时，如果明确编译了lld，并且加入了path，则clang会用lld

clang test.c -v



也可以用`fuse-ld=gold`来指定使用ld.gold

 ```
clang test.c -fuse-ld=gold
 ```

