

# Chrome Ask Gemini 调试与配置全流程对话记录

**导出时间**：2026-08-03
**主题**：开启 Google Chrome "Ask Gemini" (Glic 侧边栏) 功能及 Linux 环境问题排查全记录

---

## 💬 完整对话摘要与过程记录

### 1. 初始请求：开启 Ask Gemini 功能

- **用户**：帮我打开chrome ask gemini功能
- **助手**：提供了 Chrome 官方开启入口（`chrome://settings/ai`）、实验 Flag（`chrome://flags` 搜索 `glic`）以及地址栏 `@gemini` 快捷搜索的使用说明。

---

### 2. 反馈问题：功能未生效

- **用户**：not work
- **助手**：分析常见失败原因（美式英语界面要求、个人账号限制、无痕模式限制、网络/地区限制等），并提供了排查步骤。

---

### 3. 深入排查：本地 Chrome 配置检查

- **用户**：你自己检查下
- **助手**：直接读取并分析了本地 `~/.config/google-chrome/` 的配置文件：
  - **Flag 状态**：已开启 `glic@1`。
  - **地区限制**：`variations_country` 被判定为 `jp`（日本）。
  - **界面语言**：为系统默认语言（`zh-CN`），非 `en-US`。
  - **搜索引擎**：数据库中正常存在 `@gemini` 快捷方式。

---

### 4. 解决 Linux 语言选项缺失问题

- **用户**：只有上移没有Display Google Chrome in this language，你强制他开启呢
- **助手**：说明了 Linux 版本 Chrome 无“以这种语言显示”勾选项的原因。直接在本地 `Preferences` 与 `Local State` 文件中强制写入 `app_locale: "en-US"`，并将 `variations_country` 设为 `us`，批量开启相关 Flag，并写入 `~/.config/chrome-flags.conf`。

---

### 5. 排查语言仍为中文问题

- **用户**：现在界面还是中文的
- **助手**：指出 Linux 环境变量 `LANG=zh_CN.UTF-8` 会覆盖配置，创建并修改了桌面启动器 `~/.local/share/applications/google-chrome.desktop`，注入 `LANG=en_US.UTF-8`。

---

### 6. 深入定位 Locale 缺失

- **用户**：还是中文的
- **助手**：通过 `locale -a` 检测发现 Linux 系统未生成安装 `en_US.UTF-8` 语言库，导致环境变量回退到中文。采用 `LANGUAGE=en_US:en` 与 `LC_ALL=C.UTF-8` 绕过系统依赖，直接调用 Chrome 内置的 `en-US.pak`。

---

### 7. 安装用户级 en_US.UTF-8 Locale 库

- **用户**：帮我安装en_US.UTF-8 Locale 库
- **助手**：利用 `localedef` 为当前用户成功编译安装本地 Locale：
  - 路径：`~/.local/lib/locale/en_US.utf8`
  - 测试 `LOCPATH=~/.local/lib/locale LANG=en_US.utf8 locale` 验证通过。
  - 更新桌面启动器注入 `LOCPATH` 变量。

---

### 8. 解决英文界面下缺少 Ask Gemini 入口问题

- **用户**：英文了还是没有ask gemini
- **助手**：发现 Chrome 重启连接服务器时被重新重置为了 `jp` 地区。将核心参数强行注入启动器：
  - `--variations-override-country=us`
  - `--enable-features=Glic,GlicSidePanel,GlicFre,OptimizationGuideModelExecution`
  - 详细指引英文界面下的 3 个入口（Side Panel 下拉菜单、工具栏 ✨ 星芒图标、`chrome://settings/ai`）。
  - 强调网络代理需使用 US 节点或全局模式。

---

## 🛠️ 最终生效命令速查

在 Linux 终端中运行下方命令，即可完全以 **英文界面 + 强制美区 + 开启全套 Ask Gemini 功能** 启动 Chrome：

```bash
env LOCPATH=$HOME/.local/lib/locale LANG=en_US.UTF-8 LANGUAGE=en_US:en /usr/bin/google-chrome-stable --lang=en-US --variations-override-country=us --enable-features=Glic,GlicSidePanel,GlicFre,OptimizationGuideModelExecution &
```