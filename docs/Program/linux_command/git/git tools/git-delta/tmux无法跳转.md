# tmux无法跳转



如果您在 `tmux` 分屏工具内部运行 Git，`tmux` 默认会吃掉超链接转义符。

- **解决办法**：需要确保您的 `tmux` 版本在 3.4 或以上，并在 `~/.tmux.conf` 中开启了真彩色和超链接透传支持。





要在 `tmux` 中完美使用 `git-delta` 的真彩色和点击超链接功能，您需要配置 `~/.tmux.conf`。 [[1](https://stackoverflow.com/questions/79013973/enable-hyperlinks-in-tmux-config-file), [2](https://dandavison.github.io/delta/tips-and-tricks/using-delta-with-tmux.html)]

请在 `~/.tmux.conf` 中追加或修改以下核心配置：

\1. 核心配置内容

tmux

```bash
# 1. 声明 tmux 内部的默认终端类型，使其支持 256 色和斜体（推荐使用 tmux-256color）
set -g default-terminal "tmux-256color"

# 2. 开启 True Color（真彩色）支持
# 告诉 tmux 如果外部终端支持真彩色，内部也原样透传
set -ga terminal-overrides ",*256col*:Tc"
set -ga terminal-overrides ",xterm*:Tc"

# 3. 开启 OSC 8 超链接透传支持（针对 tmux 3.3a 或更高版本）
# 告诉 tmux 允许对所有连接的客户端透传 hyperlinks 特性
set -as terminal-features ",*:hyperlinks"

# 4. 允许终端应用程序直通逃逸序列（备用保障）
set -g allow-passthrough on
```

请谨慎使用此类代码。



------

\2. 关键两步：如何让配置彻底生效？

很多用户修改了配置却发现没有效果，是因为 `tmux` 有后台守护进程，单纯关闭当前窗口（Detached）并不会重新加载终端底层配置。

请**严格按照以下步骤**重启 `tmux`：

1. **彻底关闭所有 tmux 服务**：
   在终端运行以下命令，强制杀掉所有后台 `tmux` 进程（请注意保存您当前各分屏的工作）：

   bash

   ```
   tmux kill-server
   ```

   请谨慎使用此类代码。

   

2. **重新启动一个新的 tmux 会话**：

   bash

   ```
   tmux new
   ```

   请谨慎使用此类代码。

   

   

------