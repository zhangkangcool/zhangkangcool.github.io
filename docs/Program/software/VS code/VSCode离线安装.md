# VSCodeç¦»çº¿å®è£

## 1. 工具说明

以下工具只在X86 + kylin上做过测试。

`code_1.105.1-1760482543_amd64.deb`: 编辑代码所需要的软件。

`extensions`：为了开发方便，所需要的必要扩展。





## 2. 安装

安装deb文件

```
dpkg -i code_1.105.1-1760482543_amd64.deb
```



安装插件

```
mv ~/.vscode/extensions ~/.vscode/extensions_bak    # 先备份原有插件
cp -rf extensions ~/.vscode/extensions
```

