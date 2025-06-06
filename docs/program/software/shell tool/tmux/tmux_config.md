<h1 align="center">tmux_config</h1>
http://louiszhai.github.io/2017/09/30/tmux/

https://linuxtoy.org/archives/from-screen-to-tmux.html



#  tmux 配置文件

tmux的用户级配置文件为`~/.tmux.conf`（没有的话就创建一个）

用以下两种方法使`tmux.conf`生效。

- tmux kill-server(关闭后再输入tmux)
- 在tmux窗口中，先按下`Ctrl+b`指令前缀，然后按下系统指令`:`，进入到命令模式后输入`source-file ~/.tmux.conf`，回车后生效。(推荐方式)

### 只要不使用unbind，旧的快捷键依然有效。



https://www.atjiang.com/pragmatic-tmux-confi

`-g`：全局的，对所有的session都有效，（加不加无所谓）

`set-option`：缩写是`set`

`set-window-option`: 缩写是`setw`

```shell
# 解除默认前缀，C-b在vim中是上一页，否则需要按2次才是上一页
unbind C-b
# 设置自定义前缀
set -g prefix C-a

# 可以将延时时长调高些，以提高操作响应能力
set -sg escape-time 1

# prefix + r键重载配置文件
bind r source-file ~/.tmux.conf \; display "Reloaded!"

# 窗口序号从1开始计数
# set -g base-index 1

# 通过前缀+kjhl快速切换pane
#up
bind-key k select-pane -U
#down
bind-key j select-pane -D
#left
bind-key h select-pane -L
#right
bind-key l select-pane -R

# panes 分割线颜色
set -ag pane-active-border-style bg=default,fg=magenta
set -ag pane-border-style fg=green

#************* set copy *****************************
#### below is for before v2.4
#bind [ copy-mode
#bind -t vi-copy v begin-selection
#bind -t vi-copy y copy-selection
#bind -t vi-copy V rectangle-toggle
#bind ] paste-buffer

### below is for v2.4 and after.
bind -T copy-mode-vi v send-keys -X begin-selection
bind -T copy-mode-vi y send-keys -X copy-selection-and-cancel
bind -T copy-mode-vi V send-keys -X rectangle-toggle
#************* set copy end**************************

# buffer
bind Space choose-buffer


#******************Mouse Setting********************
#***************below is for version before v2.1*******
# https://www.cnblogs.com/zuoruining/p/11074367.html
# setw -g mode-mouse on # 支持鼠标选取文本等
# setw -g mouse-resize-pane on # 支持鼠标拖动调整面板的大小(通过拖动面板间的分割线)
# setw -g mouse-select-pane on # 支持鼠标选中并切换面板
# setw -g mouse-select-window on # 支持鼠标选中并切换窗口(通过点击状态栏窗口名称)

#***************below is for version v2.1 and after*******
# set-option -g mouse on
#******************Mouse Setting********************



# 如果喜欢给窗口自定义命名，那么需要关闭窗口的自动命名
# set-option -g allow-rename off

# 如果对 vim 比较熟悉，可以将 copy mode 的快捷键换成 vi 模式
set-window-option -g mode-keys vi


# unbind '"'
bind - splitw -v -c '#{pane_current_path}' # 垂直方向新增面板，默认进入当前目录
# unbind %
bind \\ splitw -h -c '#{pane_current_path}' # 水平方向新增面板，默认进入当前目录


set -g default-terminal "screen-256color"

```

















