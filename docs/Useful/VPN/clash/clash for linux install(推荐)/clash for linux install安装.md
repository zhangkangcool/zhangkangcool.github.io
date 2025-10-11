



<h1 align="center">clash for linux install 推荐使用</h1>



git clone https://github.com/nelvko/clash-for-linux-install.git  支持多种架构`clahs for linux`，只支持x86。





## 1. 安装



下述命令仅适用于 `x86_64` 架构，其他架构需修改 `--branch` 指定的分支。可通过 `uname -m` 查询系统架构，其与分支的对应关系如下：

| 分支       | 架构        |
| ---------- | ----------- |
| master     | x86_64      |
| arch-x86   | i386, ...   |
| arch-arm64 | aarch64     |
| arch-arm32 | armv7l, ... |



以下脚本只下载默认的master分支。

```shell
git clone --branch master --depth 1 https://gh-proxy.com/https://github.com/nelvko/clash-for-linux-install.git
cd clash-for-linux-install
```



如果是ARM或其他架构，需要进行切换。

```shell
git checkout arch-arm64
```





```shell
$ sudo bash ./install.sh
😼 安装内核：mihomo
✈️  输入订阅：https://jmssub.net/members/getsub.php?service=xxx&id=xxxxx(输入真实的订阅链接)
⏳ 正在下载...
🍃 下载成功：内核验证配置...
🍂 验证失败：尝试订阅转换...
✅ 配置可用
🚀 已设置开机自启

╔═══════════════════════════════════════════════╗
║                😼 Web 控制台                  ║
║═══════════════════════════════════════════════║
║                                               ║
║     🔓 注意放行端口：9090                     ║
║     🏠 内网：http://192.168.100.104:9090/ui   ║
║     🌏 公网：http://223.104.128.54:9090/ui    ║
║     ☁️  公共：http://board.zash.run.place      ║    推荐使用board，会多出Tun模式和允许局域网
║                                               ║
╚═══════════════════════════════════════════════╝

😼 当前密钥：5QDd9T

Usage:
    clash COMMAND  [OPTION]

Commands:
    on                      开启代理
    off                     关闭代理
    proxy    [on|off]       系统代理
    ui                      面板地址
    status                  内核状况
    tun      [on|off]       Tun 模式
    mixin    [-e|-r]        Mixin 配置
    secret   [SECRET]       Web 密钥
    update   [auto|log]     更新订阅

😼 请执行 clashon 开启代理环境
🎉 enjoy 🎉

```



修改密码：clashctl secret zhangkang



-------------------------------



## 2. 命令

### 2.1 命令一览

执行 `clashctl` 列出开箱即用的快捷命令。

> 同 `clash`、`mihomo`、`mihomoctl`

```shell
$ clashctl
Usage:
    clash     COMMAND [OPTION]
    
Commands:
    on                   开启代理
    off                  关闭代理
    ui                   面板地址
    status               内核状况
    proxy    [on|off]    系统代理
    tun      [on|off]    Tun 模式
    mixin    [-e|-r]     Mixin 配置
    secret   [SECRET]    Web 密钥
    update   [auto|log]  更新订阅
```



### 2.2 优雅启停

```shell
$ clashon
😼 已开启代理环境

$ clashoff
😼 已关闭代理环境
```



- 启停代理内核的同时，设置系统代理。
- 亦可通过 `clashproxy` 单独控制系统代理。

### 2.3 Web 控制台

```shell
$ clashui
╔═══════════════════════════════════════════════╗
║                😼 Web 控制台                  ║
║═══════════════════════════════════════════════║
║                                               ║
║     🔓 注意放行端口：9090                      ║
║     🏠 内网：http://192.168.0.1:9090/ui       ║
║     🌏 公网：http://255.255.255.255:9090/ui   ║
║     ☁️ 公共：http://board.zash.run.place      ║      使用公网UI的功能更多,打开TUN的话，则全局代理，无需设置浏览器，cmd可ping谷歌
║                                               ║
╚═══════════════════════════════════════════════╝

$ clashsecret 666
😼 密钥更新成功，已重启生效

$ clashsecret
😼 当前密钥：666
```

- 通过浏览器打开 Web 控制台，实现可视化操作：切换节点、查看日志等。

- 控制台密钥默认为空，若暴露到公网使用建议更新密钥。

  

### 2.4 更新订阅

```shell
$ clashupdate https://example.com
👌 正在下载：原配置已备份...
🍃 下载成功：内核验证配置...
🍃 订阅更新成功

$ clashupdate auto [url]
😼 已设置定时更新订阅

$ clashupdate log
✅ [2025-02-23 22:45:23] 订阅更新成功：https://example.com
```

- `clashupdate` 会记住上次更新成功的订阅链接，后续执行无需再指定。

- 可通过 `crontab -e` 修改定时更新频率及订阅链接。

  

## 3. 其它设置

### 3.1 `Tun` 模式(此模式可以直接实现全局代理，命令行直接Ping通，直接上google)

```shell
$ clashtun
😾 Tun 状态：关闭

$ clashtun on
😼 Tun 模式已开启
```

- 作用：实现本机及 `Docker` 等容器的所有流量路由到 `clash` 代理、DNS 劫持等。
- 原理：[clash-verge-rev](https://www.clashverge.dev/guide/term.html#tun)、 [clash.wiki](https://clash.wiki/premium/tun-device.html)。
- 注意事项：[#100](https://github.com/nelvko/clash-for-linux-install/issues/100#issuecomment-2782680205)

在http://board.zash.run.place可以看到TUN设置，但在http://192.168.100.104:9090/ui无法看到TUN设置。



### 3.2 允许局域网

此选项在http://192.168.100.104:9090/ui和http://board.zash.run.place，都能看到。就是是否允许其他设备连接把本机器当代理服务器。[详见允许局域网](./clash允许局域网.md) 



### 3.3 `Mixin` 配置

```shell
$ clashmixin
😼 less 查看 mixin 配置

$ clashmixin -e
😼 vim 编辑 mixin 配置

$ clashmixin -r
😼 less 查看 运行时 配置
```



- 持久化：将自定义配置项写入`Mixin`（`mixin.yaml`），而非原订阅配置（`config.yaml`），可避免更新订阅后丢失。

- 配置加载：代理内核启动时使用 `runtime.yaml`，它是订阅配置与 `Mixin` 配置的合并结果集，相同配置项以 `Mixin` 为准。

- 注意：因此直接修改 `config.yaml` 并不会生效。

  



## 4. 卸载

```shell
sudo bash uninstall.sh
```















VSCode AI回答

下面我会说明 Clash 配置中的“允许局域网”（通常在配置里是 allow-lan 或 allow-lan: true/false）是什么意思、它如何工作、会开启哪些服务/端口、可能的安全风险、常见场景以及推荐的配置和检测方法。

## 基本含义

- “允许局域网”（allow-lan）是 Clash（及其衍生脚本/一键安装）中的一个开关。开启后，Clash 会监听本机的代理服务（HTTP/SOCKS/DNS/TUN 等）在局域网接口上可被同一局域网内其它设备访问。
- 换句话说，当 allow-lan = true 时，局域网内其他设备可以通过你的机器上的 Clash 服务来使用代理（即把你这台机器当作代理网关）。

## 具体行为（常见实现）

- HTTP 代理（如端口 7890/7910 等）和 SOCKS5（如 7891）会绑定到 0.0.0.0 或 局域网 IP（例如 192.168.x.x），而不是仅绑定到 localhost（127.0.0.1）。
- Web UI（通常是 9090）也会按 allow-lan 的配置可在局域网地址上访问（比如 [http://192.168.1.100:9090/ui）。](vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-browser/workbench/workbench.html)
- 有些安装脚本会同时开放端口转发或 iptables 规则以支持 TUN/透明代理，此时也会影响局域网可达性。

## 常见端口（仅作示例，实际端口以你的配置为准）

- HTTP 代理：7890（或自定义）
- SOCKS5 代理：7891
- 本地 DNS：53 或 1053（视配置）
- Web UI：9090 说明：这些端口是否对局域网开放，取决于服务是否绑定在非 127.0.0.1 接口。

## 安全风险

- 未设密码或未限制来源时，局域网内任意设备都可使用你的代理访问外网，可能导致滥用（比如被用作非法活动的跳板）。
- 如果你的本机处在不受信任的网络（例如公共 Wi‑Fi）或你的路由器设置不够严格，可能会有外部（互联网）访问到这些端口的风险（端口转发 / UPnP）——尤其当你的机器有公网 IP 或被路由器映射端口时。
- Web UI 如果无认证或密钥较弱，可能泄露代理订阅、日志、甚至允许远程控制（切换节点、导出订阅等）。

## 推荐配置（安全优先）

- 若只在本机使用代理：将 allow-lan 设为 false（或确保所有服务仅绑定到 127.0.0.1）。
- 若确实需要在局域网共享代理：
  - keep allow-lan = true，但同时在 Clash 配置中设置 `secret`（Web UI 密钥）并确保代理服务需要认证（SOCKS5 可启用用户名/密码）。
  - 在路由器上禁止端口映射（确保 7890/7891/9090 等不被映射到公网）。
  - 在操作系统防火墙上只允许特定局域网 IP 访问这些端口（例如通过 iptables 或 UFW 限制来源 IP）。
  - 在 Web UI 中设置强密码或只允许 HTTPS（如果 Web UI 支持）。
- 如使用脚本安装（例如仓库中提到的一键脚本），注意脚本默认的提示密钥/端口，修改默认密钥（示例中 clashsecret）并记录密钥。

## 检测与验证方法

- 本机检查服务绑定：
  - 在 Linux 上运行：ss -lntp | grep <port> 或 ss -lnp 查看端口监听地址，确认是否绑定到 0.0.0.0（表示对所有接口可达）还是 127.0.0.1（仅本机）。
- 局域网设备测试：
  - 在同一局域网其他机器上配置浏览器或系统代理指向你的机器 IP + 端口，检查是否能上网。
- Web UI 测试：
  - 在局域网设备上打开 http://<你的机局域网IP>:9090/ui（或脚本中提示的地址），如果能打开并看到控制面板，说明 allow-lan 已允许访问。
- 公网暴露检测：
  - 使用在线端口扫描或从外网主机尝试访问你的公网 IP:端口（注意不要做不安全或违规的扫描）。更稳妥的是检查路由器的端口转发设置。

## 示例（配置片段）

- 只允许本机（更安全）
  - 将 Clash 配置中的 allow-lan 设为 false（或不设置，让默认本机绑定）。
- 允许局域网但开启 Web UI 密钥（推荐共享时使用）
  - allow-lan: true
  - secret: "强密码或长随机字符串"
  - 然后在防火墙/路由器上限制来源。

示例（YAML 风格，仅作展示）： allow-lan: true secret: "change_this_to_a_strong_secret" port: 7890 socks-port: 7891 redir-port: 7892 mixed-port: 7893

