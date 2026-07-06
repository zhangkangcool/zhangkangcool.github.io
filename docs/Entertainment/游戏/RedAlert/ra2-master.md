https://github.com/OpenRA/ra2/wiki



一款基于 OpenRA 引擎 2.5D 特性开发的《红色警戒 2》模组。运行本模组需准备原版游戏数据。

## 1. 依赖项

安装编译 OpenRA 所需的依赖项。

需要安装dotnet，报错再进行安装。可以让VSCode AI解决报错问题。

## 2. 模组安装（推荐）

1. 从 https://github.com/OpenRA/ra2/archive/master.zip 下载最新版 RA2 仓库压缩包。
2. 解压文件，在 Windows 系统的命令行中运行 `make all`，在 Unix 系统中运行 `make`。
3. 在 Windows 系统中运行 `launch-game.cmd`，在 Unix 系统中运行 `launch-game.sh` 启动《红色警戒 2》。

### 替代安装方法

上述方法会自动从 GitHub 下载 OpenRA 引擎。若你已克隆引擎（OpenRA），可按以下步骤操作：

1. 确保引擎目录位于 `ra2/engine` 下，且该目录中存在名为 `VERSION` 的文件。
2. 检出与 `ra2/mod.config` 文件中 `ENGINE_VERSION` 变量对应的 OpenRA 引擎版本。例如，在 `ra2/engine` 目录下执行 `git checkout release-20231010`。
3. 编辑 `ra2/engine/VERSION` 文件，使其内容与 `ra2/mod.config` 中的 `ENGINE_VERSION` 变量值一致。例如，若 `ra2/mod.config` 中 `ENGINE_VERSION="release-20231010"`，则 `ra2/engine/VERSION` 文件的内容也应为 `release-20231010`。
4. 在 `ra2` 目录下创建 `user.config` 文件，内容如下：`AUTOMATIC_ENGINE_MANAGEMENT="False"`。
5. 在 `ra2/engine` 目录下运行 `make dependencies`，获取所需的外部库。
6. 在 `ra2` 目录下运行 `make all`。

## 3. 手动安装内容

> 注意：通常通过游戏内的内容安装器即可完成内容安装。

本模组需要原版《红色警戒 2》的游戏资源文件。根据你的操作系统，将 `.mix` 档案放置到以下目录：

- **Windows**：`%APPDATA%\OpenRA\Content\ra2\` 或 `%USERPROFILE%\Documents\OpenRA\Content\ra2\`（旧版安装目录）
- **Mac OSX**：`~/Library/Application Support/OpenRA/Content/ra2/`
- **Linux**：`~/.config/openra/Content/ra2/`

若目录不存在，请手动创建 `ra2` 文件夹。

## 

我的ubuntu系统，是直接解压`https://download.ra2web.com/full-pack.7z`，然后将解压后的内容复制到`~/.config/openra/Content/ra2/`,  `ra2.mix` 和 `language.mix`两个文件没有，需要从大写复制成小写。



你可以从以下官方渠道购买并下载该游戏：

- EA
- Steam
- Discord

若你拥有原版游戏光盘：

1. 在 CD1 的 `INSTALL/` 目录中找到 `Game1.CAB` 文件。
2. 将所有所需的 `.mix` 文件复制到你的内容文件夹中。
3. `Game1.CAB` 中的 `.mix` 文件包括 `ra2.mix` 和 `language.mix`，将这两个文件复制到内容文件夹。
4. 若需要背景音乐，从光盘中提取 `theme.mix` 文件。

> 提示：“安装内容” 面板是否仍显示？请确保你的内容文件夹中存在 `ra2.mix` 和 `language.mix` 文件。例如，即使你已从 `ra2.mix` 中提取了所有 `.mix` 文件（游戏内可正常运行），OpenRA 的内容安装器仍会寻找 `ra2.mix` 文件。