可以把你现在这个场景理解成 **两层配置**，所以才会出现“`~/.claude/settings.json` 已经写了，但 VS Code 里还要再写一次”的情况。

你现在不是直接连接 Anthropic，而是：

```text
Claude Code
    ↓
你们公司的 AIHub
https://aihub.cixcomputing.com
    ↓
DeepSeek / GLM 等模型
```

因此建议这样配置。

### 1. `~/.claude/settings.json`：给 Claude Code 本体用

文件位置：

```bash
~/.claude/settings.json
```

也就是你机器上的：

```bash
/home/ken.zhang/.claude/settings.json
```

推荐写成：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的TOKEN",
    "ANTHROPIC_BASE_URL": "https://aihub.cixcomputing.com",

    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",

    "ANTHROPIC_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_SMALL_FAST_MODEL": "deepseek-v4-flash",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5.3",
    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-v4-pro"
  },

  "model": "opus",
  "effortLevel": "high"
}
```

这个文件控制的是 **Claude Code 真正运行起来以后怎么调用模型**。

例如：

```text
ANTHROPIC_BASE_URL
```

告诉 Claude Code：

```text
不要访问 Anthropic 官方 API
↓
访问 aihub.cixcomputing.com
```

而：

```text
ANTHROPIC_AUTH_TOKEN
```

负责 API 认证。

这些：

```text
ANTHROPIC_MODEL
ANTHROPIC_DEFAULT_HAIKU_MODEL
ANTHROPIC_DEFAULT_SONNET_MODEL
ANTHROPIC_DEFAULT_OPUS_MODEL
```

则是告诉 Claude Code：

```text
Claude 所谓的 Haiku → 实际走哪个模型
Claude 所谓的 Sonnet → 实际走哪个模型
Claude 所谓的 Opus → 实际走哪个模型
```

例如你当前：

```text
opus
 ↓
ANTHROPIC_DEFAULT_OPUS_MODEL
 ↓
glm-5.3
```

所以：

```json
"model": "opus"
```

并不是说最终一定调用 Anthropic Opus，而是 Claude Code 内部选择 `opus` 这个档位，然后你们 AIHub 再把它映射到 `glm-5.3`。

------

第1步完成后，重启VSCode如果已经可以用的话，就不用第2步了。否则进行第二步。



### 2. VS Code 的 `settings.json`：给 Claude Code VS Code 插件用

这是另一个完全不同的文件。

在 VS Code 中：

```text
Ctrl + Shift + P
```

输入：

```text
Preferences: Open User Settings (JSON)
```

打开的一般是：

```text
~/.config/Code/User/settings.json
```

里面加入：

```json
{
  "claudeCode.disableLoginPrompt": true,

  "claudeCode.environmentVariables": [
    {
      "name": "ANTHROPIC_BASE_URL",
      "value": "https://aihub.cixcomputing.com"
    },
    {
      "name": "ANTHROPIC_AUTH_TOKEN",
      "value": "你的TOKEN"
    }
  ]
}
```

当然，如果这个文件已经有很多 VS Code 配置，不要覆盖，只需要加入这两个字段。

比如原来是：

```json
{
  "editor.fontSize": 15,
  "terminal.integrated.fontSize": 14
}
```

改成：

```json
{
  "editor.fontSize": 15,
  "terminal.integrated.fontSize": 14,

  "claudeCode.disableLoginPrompt": true,
  "claudeCode.environmentVariables": [
    {
      "name": "ANTHROPIC_BASE_URL",
      "value": "https://aihub.cixcomputing.com"
    },
    {
      "name": "ANTHROPIC_AUTH_TOKEN",
      "value": "你的TOKEN"
    }
  ]
}
```

------

### 为什么两个地方都要写？

关键就在这里。

可以把整个结构理解成：

```text
┌─────────────────────────────┐
│ VS Code                     │
│                             │
│ Claude Code Extension       │ ← VS Code settings.json
│   │                         │
│   │ 启动 Claude Code       │
│   ↓                         │
│ Claude Code Process         │ ← ~/.claude/settings.json
└──────────────┬──────────────┘
               │
               ↓
      aihub.cixcomputing.com
               │
               ↓
       DeepSeek / GLM
```

也就是说，它实际上有 **两个程序层次**。

VS Code 插件这一层先启动。它会先判断：

```text
“你登录 Claude 了吗？”
```

如果它不知道你正在使用第三方 Gateway，就会给你刚才看到的界面：

```text
How do you want to log in?

Claude.ai Subscription
Anthropic Console
Bedrock, Foundry, or Vertex
```

即便下面真正的 Claude Code 进程能够从：

```text
~/.claude/settings.json
```

读取：

```text
ANTHROPIC_BASE_URL
ANTHROPIC_AUTH_TOKEN
```

也已经晚了，因为 **VS Code 插件自己先拦在登录界面上了**。

所以 VS Code 层需要：

```json
"claudeCode.disableLoginPrompt": true
```

告诉插件：

> 别让我登录 Claude.ai，我已经自己配置认证了。

同时：

```json
"claudeCode.environmentVariables": [...]
```

让插件启动 Claude Code 时也知道 Gateway 和 Token。

Anthropic 官方对通过 LLM Gateway 使用 Claude Code 的 VS Code 场景，也专门区分了插件环境变量和 Claude Code settings。([Claude](https://code.claude.com/docs/ja/changelog?utm_source=chatgpt.com))

------

### 那为什么 `~/.claude/settings.json` 不能删？

也不能简单删。

因为进入 Claude Code 后，它真正执行：

```text
聊天
读代码
改代码
调用工具
启动 subagent
选择模型
```

这些行为是 **Claude Code 本体**完成的。

所以你下面这些配置：

```json
"ANTHROPIC_MODEL": "deepseek-v4-pro",
"ANTHROPIC_SMALL_FAST_MODEL": "deepseek-v4-flash",
"ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-v4-pro",
"ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-v4-pro",
"ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-5.3",
"CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-v4-pro"
```

还是更适合放：

```text
~/.claude/settings.json
```

所以一句话：

> **VS Code `settings.json` 解决“插件怎么启动和认证”；`~/.claude/settings.json` 解决“Claude Code 启动后怎么运行、用什么 Gateway 和模型”。**

------

### 你当前推荐的最终配置

我建议就保持这种职责划分：

| 配置                              | 放哪里                    | 用途                            |
| --------------------------------- | ------------------------- | ------------------------------- |
| `claudeCode.disableLoginPrompt`   | VS Code `settings.json`   | 跳过 Claude.ai 登录页           |
| `claudeCode.environmentVariables` | VS Code `settings.json`   | 给 VS Code 插件 Gateway/Token   |
| `ANTHROPIC_BASE_URL`              | 两边都写                  | 插件和 Claude Code 都知道 AIHub |
| `ANTHROPIC_AUTH_TOKEN`            | 两边都写                  | 插件和 Claude Code 都有认证     |
| `ANTHROPIC_MODEL`                 | `~/.claude/settings.json` | 主模型                          |
| `ANTHROPIC_DEFAULT_*_MODEL`       | `~/.claude/settings.json` | 模型映射                        |
| `CLAUDE_CODE_SUBAGENT_MODEL`      | `~/.claude/settings.json` | Subagent 模型                   |
| `API_TIMEOUT_MS`                  | `~/.claude/settings.json` | 请求超时                        |
| `model`                           | `~/.claude/settings.json` | Claude Code 默认模型档位        |
| `effortLevel`                     | `~/.claude/settings.json` | 推理强度                        |

所以真正**重复的其实只有两个**：

```text
ANTHROPIC_BASE_URL
ANTHROPIC_AUTH_TOKEN
```

其他模型配置没必要在 VS Code `settings.json` 再复制一遍。

另外还有一个容易混淆的第三种方式：你也可以在 shell 里 `export ANTHROPIC_BASE_URL=...`、`export ANTHROPIC_AUTH_TOKEN=...`，但既然你主要通过 VS Code Claude Code 使用，**没必要再增加第三套配置**。现在这两处配置好以后比较稳定，也更容易排查问题。

还有一点，你之前的 `\302\240` 问题要记住：**JSON 里面缩进必须是普通 ASCII 空格，不要从带格式网页里直接复制缩进**。以后改完可以顺手跑：

```bash
python3 -m json.tool ~/.claude/settings.json >/dev/null && echo "JSON OK"
```

看到：

```text
JSON OK
```

再 Reload VS Code。