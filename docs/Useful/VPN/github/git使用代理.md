<h1 align="center">git使用代理</h1>
### clash.sh

```shell
# 开启系统代理
function proxy_on() {
	export http_proxy=http://127.0.0.1:7890
	export https_proxy=http://127.0.0.1:7890
	export no_proxy=127.0.0.1,localhost
    	export HTTP_PROXY=http://127.0.0.1:7890
    	export HTTPS_PROXY=http://127.0.0.1:7890
 	export NO_PROXY=127.0.0.1,localhost
	echo -e "\033[32m[√] 已开启代理\033[0m"
}

# 关闭系统代理
function proxy_off(){
	unset http_proxy
	unset https_proxy
	unset no_proxy
  	unset HTTP_PROXY
	unset HTTPS_PROXY
	unset NO_PROXY
	echo -e "\033[31m[×] 已关闭代理\033[0m"
}
```

```shell
source clash.sh
porxy_on

不用时使用proxy_off
```

------

在使用 Git 时，你可以通过设置代理来绕过网络限制或者加速网络访问。下面介绍不同类型代理的设置方法。

### HTTP/HTTPS 代理

如果你使用的是 HTTP 或者 HTTPS 代理，可以通过以下命令设置：

```bash
# 设置全局代理
git config --global http.proxy http://proxy.example.com:port
git config --global https.proxy http://proxy.example.com:port

# 如果代理需要认证
git config --global http.proxy http://username:password@proxy.example.com:port
git config --global https.proxy http://username:password@proxy.example.com:port
```



取消全局代理设置的命令如下：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### SOCKS5 代理

如果你使用的是 SOCKS5 代理，可通过如下命令设置：

```bash
# 设置全局代理
git config --global http.proxy socks5://proxy.example.com:port
git config --global https.proxy socks5://proxy.example.com:port

# 如果代理需要认证
git config --global http.proxy socks5://username:password@proxy.example.com:port
git config --global https.proxy socks5://username:password@proxy.example.com:port
```



取消全局代理设置的命令如下：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 仅对特定域名设置代理

若你只想针对特定的域名设置代理，可以使用如下命令：

```bash
git config --global http.https://github.com.proxy http://proxy.example.com:port
```



取消特定域名代理设置的命令如下：

```bash
git config --global --unset http.https://github.com.proxy
```

### 查看当前的代理设置

你可以使用以下命令查看当前的 Git 代理设置：

```bash
git config --global --get http.proxy
git config --global --get https.proxy
```

上述命令中的 `proxy.example.com` 需要替换成实际的代理服务器地址，`port` 替换成实际的代理端口号，`username` 和 `password` 替换成实际的认证信息。







