# Grammer

```
https://www.cnblogs.com/alenoscar/p/6064737.html
https://www.jianshu.com/p/e44885a777f0
https://www.shellcodes.org/Unix/%E4%BD%BF%E7%94%A8Graphviz%E7%BB%98%E5%9B%BE.html
https://www.cnblogs.com/rocketfan/archive/2009/09/09/1563628.html
https://itopic.org/graphviz.html
https://blog.csdn.net/gdp12315_gu/article/details/48373865
https://blog.csdn.net/stormdpzh/article/details/14648827
https://www.jianshu.com/p/5b02445eca1d
```

# Using the dot tool in LLVM
```shell
How to use and install
https://blog.csdn.net/qq_27885505/article/details/80366525



sudo apt-get install graphviz
```

```
dot test.dot -Tpng -o test.png  # 可以选择svg文件，markdown支持的矢量文件
clang -S -emit-llvm mul.cpp
llc -view-dag-combine1-dags mul.ll  // get the dot file


dot dag._Z4imulll-d35333.dot -Tpng -o dag.png
或
dotty ast.dot  直接显示dot文件
```





在VSCode中可安装 `Graphviz Interactive Preview`和`Graphviz(dot) language support format`两个插件，这样可以实时显示。









