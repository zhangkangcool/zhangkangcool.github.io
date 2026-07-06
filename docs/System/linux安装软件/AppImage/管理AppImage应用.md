

# 管理AppImage应用





## 1. 安装AppImageLauncher管理软件

该软件可以使AppImage软件集成在系统应用中，更方便使用。

安装工具 AppImageLauncher 自动管理 AppImage，命令如下：

```bash
sudo add-apt-repository ppa:appimagelauncher-team/stable
sudo apt update
sudo apt install appimagelauncher
```



## 2. 打开AppImage应用

双击 AppImage 文件，选择 “Integrate and run”，即可集成到菜单并运行。

默认应用会被复制到`~/Applications`目录下。

此外，如果运行 AppImage 文件时出现问题，可能需要安装 FUSE 库，使用命令`sudo apt install libfuse2`。





## 3. 删除应用

使用 AppImageLauncher 管理的应用可以通过以下方法卸载，操作简单且能彻底清理相关文件：

#### 3.1 通过 AppImageLauncher 的上下文菜单卸载

1. 找到你保存 AppImage 文件的位置（通常默认在`~/Applications`目录）
2. 右键点击对应的 AppImage 文件
3. 在弹出的菜单中选择 **"Remove AppImage from system"**（从系统中移除 AppImage）
4. 确认卸载，AppImageLauncher 会自动：
   - 删除 AppImage 文件
   - 移除桌面快捷方式
   - 清理菜单条目和相关配置



#### 3.2 手动完全卸载

如果上述方法不可用，可以手动清理：

1. 删除 AppImage 文件：

   

   ```bash
   rm ~/Applications/你的应用名称.AppImage
   ```

   

2. 删除桌面快捷方式：

   ```bash
   rm ~/.local/share/applications/appimagekit-*.desktop
   ```

   

3. 清理图标缓存：

   ```bash
   update-desktop-database ~/.local/share/applications
   ```

   

### 注意事项

- AppImageLauncher 管理的应用本质上仍是 AppImage 文件，卸载后不会有系统级残留文件
- 如果你之前选择了 "Integrate and run"（集成并运行），应用会被移动到`~/Applications`目录
- 若忘记文件位置，可通过应用菜单右键查看应用属性，找到文件路径

通过以上方法可以彻底卸载由 AppImageLauncher 管理的应用，保持系统清洁。

分享

