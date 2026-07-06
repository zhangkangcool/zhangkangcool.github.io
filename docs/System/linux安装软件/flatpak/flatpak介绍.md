# flatpak介绍





当您使用 `flatpak install` 命令安装一个本地的 `.flatpak` 文件时，Flatpak 会做以下事情：

1. **解析包内容**：首先，它会检查这个 `.flatpak` 文件里的 “清单”（manifest），了解这个应用程序需要哪些东西才能运行。

2. **检查本地依赖**：然后，它会检查您的系统上是否已经安装了这些**依赖项**（主要是 “运行时环境”，即 runtime，例如 GNOME Platform 或 Freedesktop SDK）。

3. 下载缺失的依赖

   - **如果依赖已存在**：Flatpak 会直接跳过。

   - **如果依赖不存在或版本不匹配**：Flatpak 会**自动连接到您已配置的软件源（最常见的是 Flathub）**，从网上下载并安装这些缺失的依赖项。

     

### 举个例子

当您安装 `deskflow-1.24.0-linux-x86_64.flatpak` 时，终端的输出可能会像这样：

```c++
$ sudo flatpak install  ./deskflow-1.24.0-linux-x86_64.flatpak     
Required runtime for org.deskflow.deskflow/x86_64/master (runtime/org.kde.Platform/x86_64/6.9) found in remote flathub
Do you want to install it? [Y/n]: y

org.deskflow.deskflow permissions:
    ipc     network     fallback-x11     wayland     x11     dri    file access [1]    dbus access [2]

    [1] xdg-config/kdeglobals:ro
    [2] com.canonical.AppMenu.Registrar, org.kde.KGlobalSettings, org.kde.StatusNotifierWatcher, org.kde.kconfig.notify, org.kde.kdeconnect


        ID                                               Branch                 Op             Remote                      Download
 1. [✓] org.freedesktop.Platform.GL.default              24.08                  i              flathub                     144.7 MB / 145.4 MB
 2. [✓] org.freedesktop.Platform.GL.default              24.08extra             i              flathub                      24.0 MB / 145.4 MB
 3. [✓] org.freedesktop.Platform.VAAPI.Intel             24.08                  i              flathub                      14.8 MB / 15.0 MB
 4. [✓] org.freedesktop.Platform.openh264                2.5.1                  i              flathub                     911.5 kB / 971.4 kB
 5. [✓] org.gtk.Gtk3theme.Yaru                           3.22                   i              flathub                     137.3 kB / 191.5 kB
 6. [✓] org.kde.Platform.Locale                          6.9                    i              flathub                       7.0 MB / 409.5 MB
 7. [✓] org.kde.Platform                                 6.9                    i              flathub                     482.8 MB / 391.9 MB
 8. [✓] org.deskflow.deskflow                            master                 i              deskflow-origin             0 bytes

Installation complete.
```

**从上面的输出可以清晰地看到：**

- **第 1~8 行**：Flatpak 发现系统缺少 `org.freedesktop.Platform` (一个核心运行时环境) 及其本地化包 `org.freedesktop.Platform.Locale`。于是，它自动从 `flathub` 这个远程仓库下载并安装了它们。
- **最后一行**：这才是您本地的 `.flatpak` 文件本身被安装。

### 总结

所以，您不需要手动去寻找和安装这些依赖。Flatpak 的沙箱机制（Sandbox）决定了应用不能直接使用系统里的库，必须使用它自己打包好的、版本已知且兼容的依赖。自动下载依赖正是为了确保应用能够在任何支持 Flatpak 的系统上**开箱即用**，避免了 “在我的机器上能跑，在你的机器上就报错” 的问题。