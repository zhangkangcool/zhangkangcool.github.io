





# 在 VS Code Remote-SSH 插件中设置自定义 SSH Config 文件路径

在 VS Code 的 Remote-SSH 插件中，**可以直接指定自定义的 SSH config 文件路径**，有以下几种方式，按推荐程度排序：

## 方法一：在 VS Code 设置中全局指定（推荐）

1. 打开 VS Code 设置：
   1. 快捷键：`Ctrl + ,`（Windows/Linux） / `Cmd + ,`（macOS）
   2. 或者按 `F1` 输入 `Preferences: Open Settings (JSON)`，直接打开 `settings.json` 文件。
2. 在 JSON 配置中添加以下条目，替换为你的 config 文件路径：
   1. ```JSON
      {
        // Windows 示例路径
        "remote.SSH.configFile": "C:\\Users\\你的用户名\\.ssh\\my_custom_config",
        // macOS/Linux 示例路径
        // "remote.SSH.configFile": "/home/你的用户名/.ssh/my_custom_config"
      }
      ```
3. 保存文件，重启 VS Code 或重新加载窗口（`Ctrl+R`），即可生效。

## 方法二：通过命令临时指定（单次连接用）

在 VS Code 中，按 `F1` 输入并执行：

```Plain
Remote-SSH: Connect to Host...
```

在弹出的输入框中，直接用以下格式指定配置文件和主机：

```Plain
ssh -F /path/to/your/custom_config user@host
```

- Windows 示例：`ssh -F C:\Users\Ken.ssh\work_config root@192.168.1.100`
- macOS/Linux 示例：`ssh -F ~/.ssh/work_config root@192.168.1.100`

## 方法三：修改 VS Code 的 SSH 配置选择器

1. 按 `F1` 输入：`Remote-SSH: Open SSH Configuration File...`
2. 在弹出的列表中，选择 `Configure SSH Hosts...`
3. 点击 `Add new SSH config file to list...`
4. 输入你的自定义 config 文件路径，确认后即可在列表中看到它。

之后你就可以在 `Connect to Host...` 时，选择该配置文件中的主机。

## 💡 补充说明与避坑

1. **路径格式注意**
   1. Windows 路径中，JSON 里必须用双反斜杠 `\\`，或用正斜杠 `/`：
      - 正确：`"C:/Users/Ken/.ssh/config"` 或 `"C:\\Users\\Ken\.ssh\\config"`
      - 错误：`"C:\Users\Ken.ssh\config"`（单斜杠会被转义）
   2. 路径中不要有空格，若必须有，需要用引号包裹（或改用短路径）。
2. **多配置文件的场景**

1. 你可以在设置里配置多个 config 文件，用数组形式：

   ```JSON
   {
     "remote.SSH.configFile": [
       "C:\\Users\\Ken\\.ssh\\personal_config",
       "C:\\Users\\Ken\\.ssh\\work_config"
     ]
   }
   ```

    VS Code 会自动合并读取所有文件中的主机配置。

1. **优先级说明**
   1. VS Code 会优先读取你在 `remote.SSH.configFile` 中指定的路径。
   2. 若未设置，会按系统默认路径查找：`~/.ssh/config`（macOS/Linux）或 `%USERPROFILE%.ssh\config`（Windows）。

如果你告诉我你的操作系统和自定义 config 文件的具体路径，我可以帮你生成一段可以直接复制到 `settings.json` 里的配置代码。