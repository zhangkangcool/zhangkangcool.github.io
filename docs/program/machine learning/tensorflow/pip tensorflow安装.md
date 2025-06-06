<h1 align="center">pip tensorflow安装</h1>
https://blog.csdn.net/qq_44019762/article/details/124984425



# [tensorflow](https://so.csdn.net/so/search?q=tensorflow&spm=1001.2101.3001.7020) 安装(只是用pip install 安装tensorflow)

```shell
conda create --name tensorflow python=3.7      # “tensorflow”是你建立的conda虚拟环境的名字
conda activate tensorflow                      # 进入conda虚拟环境
pip install tensorflow-gpu==2.2 -i https://pypi.tuna.tsinghua.edu.cn/simple
```



这里，我使用的命令是

```asm
pip install tensorflow-gpu -i https://pypi.tuna.tsinghua.edu.cn/simple
```



安装tensorflow时，如果使用直接安装速度相对较慢，pip install tensorflow
采取清华大学的镜像会提高速度。

```asm
GPU版本安装方法：
pip3 install tensorflow-gpu==2.2 -i https://pypi.tuna.tsinghua.edu.cn/simple
CPU版本安装方法：

pip3 install tensorflow==2.2 -i https://pypi.tuna.tsinghua.edu.cn/simple
```



安装的时候需要python是64位版本，32位版本则会报错
备注2：如果默认的 pip 和 conda 网络连接速度慢，可以尝试使用镜像，将显著提升 pip 和 conda 的下载速度（具体效果视您所在的网络环境而定）；

```asm
清华大学；}- 的 pypi 镜像：https://mirrors.tuna.tsinghua.edu.cn/help/pypi/

 Anaconda 镜像：https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/
```



NVIDIA 驱动程序安装完成后，可在命令行下使用 nvidia-smi 命令检查是否安装成功。

```python
import tensorflow as tf
tf.compat.v1.disable_eager_execution()
hello=tf.constant("Hello,Tensorflow!")
sess=tf.compat.v1.Session()
print(sess.run(hello))
tf.compat.v1.disable_eager_execution()
```





```asm
#创建虚拟环境
conda create -n python37 python=3.7.1
#激活虚拟环境
conda activate python37
#退出当前虚拟环境
conda deactivate
#查看所有虚拟环境
conda env list
conda info --envs
#进入虚拟环境
conda activate [你的虚拟环境名]
#退出虚拟环境
conda deactivate
#删除环境
conda remove -n 名字 --all
```





```python
import pip
from subprocess import call
from pip._internal.utils.misc import get_installed_distributions
for dist in get_installed_distributions():
    call("pip install -i  https://mirrors.aliyun.com/pypi/simple/ --upgrade " + dist.project_name, shell=True)
```





## Navigator打不开的解决办法

```asm
以管理员权限打开anaconda prompt，输入代码：
1、conda update conda
2、conda update --all`

在不关闭刚打开的anaconda prompt的前提下，尝试打开anaconda navigator，如果不行，则继续输入代码：

3、conda update anaconda-navigator
4、anaconda-navigator --reset
5、conda update anaconda-client
6、conda update -f anaconda-client

```

