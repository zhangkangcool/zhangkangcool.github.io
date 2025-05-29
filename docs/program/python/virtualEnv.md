



https://tensorflow.juejin.im/install/install_linux.html#NVIDIARequirements



## 直接使用virtualenv

1. 选择下面的一条命令来安装 pip 和 Virtualenv：

   ```
   $ sudo apt-get install python-pip python-dev python-virtualenv # for Python 2.7
   $ sudo apt-get install python3-pip python3-dev python-virtualenv # for Python 3.n 
   ```

2. 挑选其中的一条命令来创建一个 Virtualenv 的虚拟环境:

   默认情况下，虚拟环境会依赖系统环境中的site packages，就是说系统中已经安装好的第三方package也会安装在虚拟环境中，如果不想依赖这些package，那么可以加上参数 –no-site-packages建立虚拟环境

   > virtualenv --no-site-packages [虚拟环境名称]

   

   ```
   $ virtualenv --system-site-packages targetDirectory # for Python 2.7
   $ virtualenv --system-site-packages -p python3 targetDirectory # for Python 3.n 
   ```

   其中 `*targetDirectory*` 指明了 Virtualenv 树中根部位置。我们的命令中假设了 `*targetDirectory*` 是 `~/virtualEnv/tf2.1`，但你也可以指定任意目录。

   ```
    virtualenv --system-site-packages -p python3 ~/virtualEnv/tf2.1
   ```

   ls

3. 通过以下任意一条命令激活 Virtualenv 的虚拟环境:

   ```
   $ source ~/tensorflow/bin/activate # bash, sh, ksh, or zsh 
   $ source ~/tensorflow/bin/activate.csh  # csh or tcsh
   $ . ~/tensorflow/bin/activate.fish  # fish 
   ```



4. 退出虚拟环境使用

   ```
   (tensorflow)$ deactivate 
   ```

5. 删除虚拟环境

   ```python
   rm -rf 虚拟环境文件夹
   ```

   

## 使用workon对虚拟环境进行管理

```
export WORKON_HOME=~/.virtualenvs
source virtualwrapper/virtualenvwrapper.sh
```



```
workon  # 下面会返回一个装有虚拟环境的列表

### 下面是返回结果
caffe
tf112

```



```
workon caffe  # 使用caffe虚拟环境
```



