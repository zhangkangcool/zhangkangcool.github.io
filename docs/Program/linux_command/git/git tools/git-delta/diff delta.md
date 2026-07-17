## 传统 `diff` 命令如何使用 `delta`



标准的 Linux `diff` 命令输出是黑白的，而且格式简陋。你只需要将 `diff` 的输出通过管道传给 `delta`，或者加上 `--color=always`（视系统而定），就能立刻获得现代化的彩色并排对比：

- **单次临时使用**：

  bash

  ```
  diff -u file1.txt file2.txt | delta
  ```

  请谨慎使用此类代码。

  

  *(注：建议加上 `-u` 参数，统一输出格式可以让 `delta` 更好地识别和渲染)*

- **配置永久别名（Alias）**：
  在你的 `~/.bashrc` 或 `~/.zshrc` 中添加以下别名，以后只需打 `ldiff` 就能享受到精美的对比：

  bash

  ```
  alias ldiff='diff -u "$@" | delta'
  ```