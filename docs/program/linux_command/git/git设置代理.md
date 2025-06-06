<h1 align="center">git设置代理</h1>




在使用 Git 时，有时候为了加快下载速度或者突破网络限制，需要设置代理。下面为你分别介绍 HTTP/HTTPS 代理和 SOCKS5 代理的设置方法。

### HTTP/HTTPS 代理

#### 全局设置

如果你希望为所有的 Git 仓库都设置代理，可以使用全局设置。假设代理服务器地址为 `proxy.example.com`，端口为 `8080`，执行以下命令：

```bash
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy http://proxy.example.com:8080
```



若代理服务器需要用户名和密码进行身份验证，命令如下：

```bash
git config --global http.proxy http://username:password@proxy.example.com:8080
git config --global https.proxy http://username:password@proxy.example.com:8080
```

#### 单个仓库设置

如果你只想为某个特定的 Git 仓库设置代理，可以在该仓库的目录下执行以下命令：

```bash
git config http.proxy http://proxy.example.com:8080
git config https.proxy http://proxy.example.com:8080
```

### SOCKS5 代理

#### 全局设置

如果使用的是 SOCKS5 代理，同样可以进行全局设置。假设代理服务器地址为 `127.0.0.1`，端口为 `1080`，执行以下命令：

```bash
git config --global http.proxy socks5://127.0.0.1:1080
git config --global https.proxy socks5://127.0.0.1:1080
```

#### 单个仓库设置

在特定仓库目录下为其设置 SOCKS5 代理，命令如下：

```bash
git config http.proxy socks5://127.0.0.1:1080
git config https.proxy socks5://127.0.0.1:1080
```

### 取消代理设置

#### 全局取消

若要取消全局代理设置，执行以下命令：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

#### 单个仓库取消

在特定仓库目录下取消代理设置，命令如下：

```bash
git config --unset http.proxy
git config --unset https.proxy
```

### 验证代理设置

你可以通过克隆一个远程仓库来验证代理设置是否生效，例如：

```bash
git clone https://github.com/example/repo.git
```





也可以直接修改配置文件`.gitconfig`

```shell
[user]                                                                                                                                                                        
    email = zhangkang@csmicro.net
    name = zhangkang
[core]
    editor = vim 
[http]
    proxy = 192.168.110.124:4399
[https]
    proxy = 192.168.110.124:4399
```

