



<h1 align="center">ubuntu上安装flatpak文件</h1>



`.flatpak` 文件是 Flatpak 应用程序的打包格式，它包含了运行一个应用所需的所有依赖，确保了应用在不同 Linux 发行版上都能稳定运行。下面以安装下载好的deskflow-1.24.0-linux-x86_64.flatpak为例。



## 1. 安装 Flatpak（如果尚未安装）

大多数现代 Ubuntu 版本已经预装了 Flatpak，但为了确保万无一失，我们先执行安装命令。

1. 打开您的终端（Terminal）。

2. 运行以下命令来安装 Flatpak 并添加 Flathub 仓库（Flathub 是 Flatpak 应用最主要的来源）：

   ```bash
   sudo apt update
   sudo apt install flatpak
   sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
   
   
   
   sudo http_proxy=http://172.18.8.106:7890 https_proxy=http://172.18.8.106:7890 flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
   ```
   
   执行完毕后，建议**重启您的电脑**或注销后重新登录，以确保 Flatpak 环境完全集成到您的桌面系统中。



## 2. 安装下载好的 `.flatpak` 文件

1. 运行以下命令来安装这个本地文件。**请将 `deskflow-1.24.0-linux-x86_64.flatpak` 替换为您文件的确切名称**：

   ```bash
   flatpak install --user deskflow-1.24.0-linux-x86_64.flatpak
   或者
   sudo flatpak install  ./deskflow-1.24.0-linux-x86_64.flatpak
   sudo http_proxy=http://172.18.8.106:7890 https_proxy=http://172.18.8.106:7890 flatpak install ./deskflow-1.24.0-linux-x86_64.flatpak  # 用代理的情况
   ```
   
   - `flatpak install`: 安装命令。
   
   - `--user`: **（推荐）** 这个参数表示将应用安装在当前用户的个人目录下，这样不需要 `sudo` 管理员权限，更加安全和方便。
   
   - `deskflow-1.24.0-linux-x86_64.flatpak`: 您要安装的文件名。
   
     

以下是安装日志，系统会分析包内容并询问您是否要继续安装。它可能会提示需要安装一些额外的运行时库（runtime）。

输入 `Y` 然后按回车，等待安装完成即可。

```c++
$ sudo flatpak install  ./deskflow-1.24.0-linux-x86_64.flatpak     
Required runtime for org.deskflow.deskflow/x86_64/master (runtime/org.kde.Platform/x86_64/6.9) found in remote flathub
Do you want to install it? [Y/n]: y

org.deskflow.deskflow permissions:    # 这里的org.deskflow.deskflow是ID
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





## 3. 运行已安装的应用

安装成功后，您有以下几种方式可以启动 Deskflow：

1. **通过应用菜单**：

   打开您的应用程序菜单（通常在屏幕左下角或左上角），直接搜索 "Deskflow"，然后点击图标启动它。

2. 、**通过终端**：

   打开终端，输入以下命令即可运行：

   ```bash
    flatpak run org.deskflow.deskflow
   ```

   

   **注意**：这里的 `org.deskflow.deskflow` 是应用的唯一 ID（Application ID），它可能与文件名不完全相同。您可以在安装成功的提示信息中找到它，或者运行 `flatpak list` 查看已安装应用的 ID。



## 4. 如何卸载 Flatpak 应用

如果您想卸载 Deskflow，可以使用以下命令。同样，需要使用应用的 ID：

```bash
flatpak uninstall com.github.jonmagon/deskflow
```

系统会再次询问您是否确认卸载，输入 `Y` 并回车即可。



