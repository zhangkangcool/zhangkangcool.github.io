<h1 align="center">生成目录</h1>


https://zhuanlan.zhihu.com/p/126353341



### 1. 使用`[toc]`进行生成 

熟悉markdown都知道可以使用[TOC]自动生成markdown文件的标题目录，比如在typora，vscode(需要插件)等本地编辑器中，或者在CSDN等网页编辑器中，但是github却不支持[TOC]标签，至于为什么不支持感兴趣的可以深入搜索，而相应的解决方法之一就是为md文件自动生成适用于github的目录。

此方法生成的无跳转链接，并且在github上可能用不了。



### 2. VSCode的markdown插件(推荐方法)

Markdown All in One 插件了，安装后点开md文件，然后快捷键`CTRL(CMD)+SHIFT+P或者`F1`，输入`Markdown All in One: Create Table of Contents`回车即可。





### 3. 使用工具

https://www.jianshu.com/p/b0a18eb32d09



#### 3. 1 安装doctoc工具

```shell
npm i doctoc -g //install 简写 i
```

#### 3.2 生成目录

```asm
octoc demo.md
```





```
着色源

github.com/Maratyszcza/FXdiv.git
```

