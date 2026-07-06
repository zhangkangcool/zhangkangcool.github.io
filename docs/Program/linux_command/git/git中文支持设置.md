# git中文支持设置



以下问题:

```shell
mac/linux 命令行git无法正确显示中文

# ken @ kendeMacBook-Pro.local in ~/Documents/note/mygithub-docs/zhangkangcool.github.io on git:main x [14:27:44]
$ git status
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	"docs/useful/\344\270\262\345\217\243\351\200\232\344\277\241/\344\270\262\345\217\243\350\277\236\346\216\245.assets/"
	"docs/useful/\344\270\262\345\217\243\351\200\232\344\277\241/\344\270\262\345\217\243\350\277\236\346\216\245.md"
	"docs/useful/\344\270\262\345\217\243\351\200\232\344\277\241/\344\270\273\346\235\277/"
```





在 macOS 或 Linux 系统中，Git 命令行显示中文乱码通常是由于编码设置问题导致的。可以通过以下步骤解决：



### 1. 首先检查当前 Git 的编码设置：

```bash
git config --global --get core.quotepath
git config --global --get i18n.commitencoding
git config --global --get i18n.logoutputencoding
```



### 2. 若未正确配置，执行以下命令进行设置：(亲测可用)

```bash
# 解决中文文件/目录名显示为八进制编码的问题
git config --global core.quotepath false

# 设置提交信息的编码
git config --global i18n.commitencoding utf-8

# 设置显示日志的编码
git config --global i18n.logoutputencoding utf-8

# 告诉 Git 使用终端的编码
export LESSCHARSET=utf-8   # 从步可能不需要，先不设置
```



### 3. 为了让 `LESSCHARSET` 设置永久生效，可以将其添加到 shell 配置文件中：



```bash
# 对于 bash 用户
echo "export LESSCHARSET=utf-8" >> ~/.bash_profile
source ~/.bash_profile

# 对于 zsh 用户
echo "export LESSCHARSET=utf-8" >> ~/.zshrc
source ~/.zshrc
```

完成以上设置后，Git 命令行应该就能正确显示中文文件名和提交信息了。如果问题仍然存在，可以检查系统的语言环境设置是否正确，确保使用了支持 UTF-8 的 locale。