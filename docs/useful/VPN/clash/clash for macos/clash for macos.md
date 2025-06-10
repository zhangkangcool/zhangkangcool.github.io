<h1 align="center">clash for macos</h1>



## 1. 只使用clashX

### 1.1 下载clashX

https://github.com/yichengchen/clashX/releases





### 1.2 在clashX中复制终端命令

<img src="clash for macos.assets/image-20230417230743035.png" alt="image-20230417230743035" style="zoom:33%;" />



```shell
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
```



这样，终端应该就可以翻墙了



### 1.3 测试

```shell
wget google.com
```

应该会下载`index.html`，打开该`html`文件，看是否是google





## 2. 使用clashX + privoxy

如果方式1，调通后不建议使用方法2

https://www.cashqian.net/blog/001486989831982332565298e4942a2bb8f56b08f9d2475000

### ### 2.1 privoxy安装

安装很简单用brew安装：

```shell
brew install privoxy
```

### ### 2.2 privoxy配置

打开配置文件 `/usr/local/etc/privoxy/config`

```shell
vim /usr/local/etc/privoxy/config
```

加入下面这两项配置项

```shell
listen-address 0.0.0.0:8118
forward-socks5 / localhost:7890 .
```

第一行设置privoxy监听任意IP地址的8118端口。第二行设置本地socks5代理客户端端口，注意不要忘了最后有一个空格和点号。7890端口是clashX中使用的代理端口。



### ### 2.3 启动privoxy

因为没有安装在系统目录内，所以启动的时候需要打全路径。

```shell
sudo /usr/local/sbin/privoxy /usr/local/etc/privoxy/config
```

### ### 2.4 查看是否启动成功

```shell
netstat -na | grep 8118
```

看到有类似如下信息就表示启动成功了

```shell
tcp4       0      0  *.8118                 *.*                    LISTEN
```

如果没有，可以查看日志信息，判断哪里出了问题。打开配置文件找到 `logdir` 配置项，查看log文件。

### ### 2.5 privoxy使用

在命令行终端中输入如下命令后，该终端即可翻墙了。

```shell
export http_proxy='http://localhost:8118'
export https_proxy='http://localhost:8118'
```

他的原理是讲socks5代理转化成http代理给命令行终端使用。

如果不想用了取消即可

```shell
unset http_proxy
unset https_proxy
```

如果关闭终端窗口，功能就会失效，如果需要代理一直生效，则可以把上述两行代码添加到 ~/.bash_profile 文件最后。

```shell
vim ~/.bash_profile
-----------------------------------------------------
export http_proxy='http://localhost:8118'
export https_proxy='http://localhost:8118'
-----------------------------------------------------
```

使配置立即生效

```shell
source  ~/.bash_profile
```

还可以在 `~/.bash_profile` 里加入开关函数，使用起来更方便

```shell
function proxy_off(){
    unset http_proxy
    unset https_proxy
    echo -e "已关闭代理"
}

function proxy_on() {
    export no_proxy="localhost,127.0.0.1,localaddress,.localdomain.com"
    export http_proxy="http://127.0.0.1:8118"
    export https_proxy=$http_proxy
    echo -e "已开启代理"
}
```

