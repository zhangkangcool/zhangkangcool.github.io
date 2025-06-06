<h1 align="center">pass name</h1>


https://www.likecs.com/ask-1488002.html



```asm
opt --help-list-hidden | grep debug-pass -A 5
  --debug-pass=<value>                                            - Print PassManager debugging information
    =Disabled                                                     -   disable debug output
    =Arguments                                                    -   print pass arguments to pass to 'opt'（输出使用了哪些用于优化的选项）
    =Structure                                                    -   print pass structure before run()  输出具体有优化名称
    =Executions                                                   -   print pass name before it is executed
    =Details                                                      -   print pass details when it is executed
```





下面的方法只对旧的pass manger有用，如果是新的，则需要使用`--debug-pass-manager`

```asm
opt -S --debug-pass=Structure -O0 empty.ll -debug-pass=Structure > O0.log 2>&1
opt -S -O1 empty.ll -debug-pass=Structure > O1.log 2>&1
opt -S -O2 empty.ll -debug-pass=Structure > O2.log 2>&1
opt -S -O3 empty.ll -debug-pass=Structure > O3.log 2>&1
```





```asm
opt -O1 foo.bc -debug-pass=Arguments -o /dev/null
```



```asm
opt -S -mem2reg test.ll -o opt.ll
```

