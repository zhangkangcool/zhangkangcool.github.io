<h1 align="center">vim变成ABCD</h1>


## Linux （Ubuntu）使用vi和vim方向键变成了ABCD



ubuntu下 vi输入方向键会变成ABCD，这是ubuntu预装的是vim tiny版本，安装vim full版本即可解决。

首先，卸载了原有的vim

```csharp
$ sudo apt-get remove vim-common
```

然后，安装新的vim-full

```sql
$ sudo apt-get install vim
```

以上命令执行完后即可解决问题。