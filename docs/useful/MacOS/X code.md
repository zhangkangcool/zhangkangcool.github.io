# 使用`cmake`产生`xcode`所需的配置文件

```shell
cmake -G "Xcode" $HOME/llvm/llvm -DLLVM_ENABLE_ASSERTIONS=On -DCMAKE_BUILD_TYPE=RELEASE -DCMAKE_CXX_COMPILER=/usr/bin/g++ -DCMAKE_C_COMPILER=/usr/bin/gcc
```

If you get the error `xcode-select: error: tool 'xcodebuild' requires Xcode`, you should run below command:

```shell
# https://www.jianshu.com/p/07a281ff57d3
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer/
```

Then, you can use `xcode` to open `/Users/ken/llvm-project/xcode-build/LLVM.xcodeproj/`.



# Settings

https://www.jianshu.com/p/07a281ff57d3

### 设置单击跳转

选择`xcode菜单--->preference—>navigation`就会进入上图，然后选择jump to definition选项，这个时候我们再用“command +鼠标左键”



### 设置黑色背景

选择`xcode菜单--->preference—>Font & Colors —> Default(Dark)`



### 设置80行加线

选择`xcode菜单--->preference—>Text Editing —> Page guide at column`



# ShortCut

## 切换头文件和cpp文件，很实用

Command + control+ 上下箭头键



## go back/forward

Command + control+ 左右箭头键



## 文档内搜索

Command + F: 搜索

Command + G: 搜索下一处
Shift + Command + G: 搜索上一处



## 新建窗口，可打开多个文件

Command +T



## 多个打开文件间进行切换

Control + TAB



## 折叠代码

Option + Command + 左右



## 跳到定义

Command + 右击（双击）



## 分屏打开定义

Option + Command + 右击