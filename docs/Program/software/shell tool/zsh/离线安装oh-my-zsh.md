<h1 align="center">离线安装oh-my-zsh</h1>

## 1.  下载代码

这里从gitee下载，也可以从github下载。

```shell
git clone https://gitee.com/mirrors/oh-my-zsh.git
```



## 2. 删除脚本中需要从网上下载的部分

此脚本其实就是 [安装oh-my-zsh](./安装oh-my-zsh.md)中所下载的安装文件。

```diff
diff --git a/tools/install.sh b/tools/install.sh
index 5c9b2c18..bde35e06 100755
--- a/tools/install.sh
+++ b/tools/install.sh
@@ -288,39 +288,8 @@ setup_ohmyzsh() {
   # precedence over umasks except for filesystems mounted with option "noacl".
   umask g-w,o-w
 
-  echo "${FMT_BLUE}Cloning Oh My Zsh...${FMT_RESET}"
-
-  command_exists git || {
-    fmt_error "git is not installed"
-    exit 1
-  }
-
-  ostype=$(uname)
-  if [ -z "${ostype%CYGWIN*}" ] && git --version | grep -Eq 'msysgit|windows'; then
-    fmt_error "Windows/MSYS Git is not supported on Cygwin"
-    fmt_error "Make sure the Cygwin git package is installed and is first on the \$PATH"
-    exit 1
-  fi
-
-  # Manual clone with git config options to support git < v1.7.2
-  git init --quiet "$ZSH" && cd "$ZSH" \
-  && git config core.eol lf \
-  && git config core.autocrlf false \
-  && git config fsck.zeroPaddedFilemode ignore \
-  && git config fetch.fsck.zeroPaddedFilemode ignore \
-  && git config receive.fsck.zeroPaddedFilemode ignore \
-  && git config oh-my-zsh.remote origin \
-  && git config oh-my-zsh.branch "$BRANCH" \
-  && git remote add origin "$REMOTE" \
-  && git fetch --depth=1 origin \
-  && git checkout -b "$BRANCH" "origin/$BRANCH" || {
-    [ ! -d "$ZSH" ] || {
-      cd -
-      rm -rf "$ZSH" 2>/dev/null
-    }
-    fmt_error "git clone of oh-my-zsh repo failed"
-    exit 1
-  }
+  cp -ra "$(dirname "$0")"/.. $ZSH  # 复制本项目到~/.oh-my-zsh 
+  rm -rf $ZSH/.git                  # 删除项目下的.git
   # Exit installation directory
   cd -
```

