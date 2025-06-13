<h1 align="center">vimrc</h1>




```shell
" set paste  "取消自动缩进


" https://blog.csdn.net/clevercode/article/details/51416854
" set mosue-=a "disable mouse, and you can use the mouse to copy and paste

set number     " 设置行号
set wrap       " 设置折叠
set ic         " 忽略大小写
syntax on      " 打开语法

set hlsearch   " 高亮显示所有搜索到的内容
set incsearch  " 光标立刻跳转到搜索到内容

set cursorline                     " 突出显示当前行
" set cursorcolumn                 " 突出显示当前列
autocmd InsertLeave * se nocul     " 用浅色高亮当前行
autocmd InsertEnter * se cul       " 用浅色高亮当前行

" 状态栏
set ruler           " 状态栏显示标尺
set showcmd         " 输入的命令显示出来，看的清楚些
set statusline=%F%m%r%h%w\ [FORMAT=%{&ff}]\ [TYPE=%Y]\ [POS=%l,%v][%p%%]\ %{strftime(\"%d/%m/%y\ -\ %H:%M\")}   "状态行显示的内容
" 状态栏信息一直显示
set laststatus=2      " 总是显示状态栏
highlight StatusLine cterm=bold ctermfg=yellow ctermbg=blue


set completeopt=preview,menu       " 补全
filetype plugin on                 " 允许插件
set clipboard+=unnamed             " 共享剪贴板
set nobackup                       " 从不备份
set noswapfile                     " 不要swap文件
set makeprg=g++\ -Wall\ \ %        " make运行

set autowrite                      " 自动保存
set magic                          " 设置魔术
set guioptions-=T                  " 隐藏工具栏
set guioptions-=m                  " 隐藏菜单栏


" tab显示4个空格 
" set ts=4
" set sw=4

" 按tab键时产生的是4个空格
set ts=4
set expandtab
set autoindent

" 超过80行标红，after vim7.3，早期版本参考
" https://stackoverflow.com/questions/235439/vim-80-column-layout-concerns
set colorcolumn = 80  

" 让vim显示行尾的空格,color red
highlight WhitespaceEOL ctermbg=red guibg=red
match WhitespaceEOL /\s\+$/

" 记住上次打开文件的位置
if has("autocmd")
    au BufReadPost * if line("'\"") > 1 && line("'\"") <= line("$") | exe "normal! g'\"" | endif
endif


" 获取当前路径，将$HOME转化为~
function! CurDir()
    let curdir = substitute(getcwd(), $HOME, "~", "g")
        return curdir
        endfunction
set statusline=[%n]\ %f%m%r%h\ \|\ \ pwd:\ %{CurDir()}\ \ \|%=\|\%l,%c\ %p%%\ \|\ ascii=%b,hex=%b%{((&fenc==\"\")?\"\":\"\ \|\ \".&fenc)}\ \|\ %{$USER}\ @\ %{hostname()}\
        
" ************************插件设置*************************
" ************************ for ctags *********************
set tags=tags;    "   其中 ; 不能没有
set autochdir     " 不用每次都在有tags的文件



"""""""""""""""""""""""""""""""""""""""""""""""
" Seting clang-format
"""""""""""""""""""""""""""""""""""""""""""""""
if has('python')
  map <C-I> :pyf ~/software/clang-format/clang-format.py<cr>
  imap <C-I> <c-o>:pyf ~/softwware/clang-format/clang-format.py<cr>  " insert mode tab
elseif has('python3')
  map <C-I> :py3f ~/software/clang-format/clang-format.py<cr>
  imap <C-I> <c-o>:py3f ~/software/clang-format//clang-format.py<cr>
endif

function FormatOnSave()
  let l:formatdiff = 1 " or let l:lines="all"
  if has('python')
    pyf ~/software/clang-format/clang-format.py
  elseif has('python3')
    py3f ~/software/clang-format/clang-format.py
  endif
endfunction

autocmd BufWritePre *.h,*.hpp,*.c,*.cc,*.cpp call FormatOnSave()

" Haven't use below func
function FormatWholeFile()
  let l:lines="all"
  if has('python')
    pyf ~/software/clang-format/clang-format.py
  elseif has('python3')
    py3f ~/software/clang-format/clang-format.py
   endif
endfunction

" can't work: map <F5>: call FormatWholeFile()<cr>


```



## recycler

```shell
set number
set wrap
set hlsearch
set ic
syntax on
autocmd InsertLeave * se nocul  " 用浅色高亮当前行
autocmd InsertEnter * se cul    " 用浅色高亮当前行
set ruler           " 显示标尺
set showcmd         " 输入的命令显示出来，看的清楚些
"set paste
set statusline=%F%m%r%h%w\ [FORMAT=%{&ff}]\ [TYPE=%Y]\ [POS=%l,%v][%p%%]\ %{strftime(\"%d/%m/%y\ -\ %H:%M\")}   "状态行显示的内容

set completeopt=preview,menu
"允许插件
filetype plugin on
"共享剪贴板
set clipboard+=unnamed
"从不备份
set nobackup
"make 运行
set makeprg=g++\ -Wall\ \ %
"自动保存
set autowrite
set ruler                   " 打开状态栏标尺
set cursorline              " 突出显示当前行
set magic                   " 设置魔术
set guioptions-=T           " 隐藏工具栏
set guioptions-=m           " 隐藏菜单栏
set nobackup
set noswapfile
set nofoldenable


set ts=2
set expandtab
set autoindent
set fdm=indent

set tags=tags;
"set autochdir


" 状态栏信息一直显示
set laststatus=2      " 总是显示状态栏
highlight StatusLine cterm=bold ctermfg=yellow ctermbg=blue

" 获取当前路径，将$HOME转化为~
function! CurDir()
    let curdir = substitute(getcwd(), $HOME, "~", "g")
        return curdir
        endfunction

        set statusline=[%n]\ %f%m%r%h\ \|\ \ pwd:\ %{CurDir()}\ \ \|%=\|\%l,%c\ %p%%\ \|\ ascii=%b,hex=%b%{((&fenc==\"\")?\"\":\"\ \|\ \".&fenc)}\ \|\ %{$USER}\ @\ %{hostname()}\


"鼠标在Vim 里面点击无效，请在~/.vimrc下加入这句话
"set mouse=a  " always use mouse

" you can use the mouse to paste
" set mouse-=a

"Taglist setup
"设置ctags路径
let Tlist_Ctags_Cmd = '/usr/bin/ctags'

"启动vim后自动打开taglist窗口
"let Tlist_Auto_Open = 1

"不同时显示多个文件的tag，仅显示一个
"let Tlist_Show_One_File = 1

"taglist为最后一个窗口时，退出vim
let Tlist_Exit_OnlyWindow = 1

"taglist窗口显示在右侧，缺省为左侧
"let Tlist_Use_Right_Window =1

"设置taglist窗口大小
"let Tlist_WinHeight = 100
"let Tlist_WinWidth = 40

"设置taglist打开关闭的快捷键F2
noremap <F2> :TlistToggle<CR>

"更新ctags标签文件快捷键设置
noremap <F6> :!ctags -R<CR>

"设置Tlist_Sort_Type为”name”可以使taglist以tag名字进行排序
let Tlist_Sort_Type = "name"

"listToggle打开taglist窗口时，如果希望输入焦点在taglist窗口中
"let Tlist_GainFocus_On_ToggleOpen = 1

"defualt double click to jump
"let list_Use_SingleClick = 1


let Tlist_Show_Menu = 1

" 让vim将行尾的空格显示为红色
highlight WhitespaceEOL ctermbg=red guibg=red
match WhitespaceEOL /\s\+$/

" Uncomment the following to have Vim jump to the last position when
" reopening a filec 记住上次的位置
if has("autocmd")
  au BufReadPost * if line("'\"") > 1 && line("'\"") <= line("$") | exe "normal! g'\"" | endif
endif

"*******************cscope************************
if has("cscope")
    set csprg=/usr/bin/cscope
    set csto=0
    set cst

    " add any database in current directory
    if filereadable("cscope.out")
"        cs add cscope.out
    " else add database pointed to by enrironment
    elseif $CSCOPE_DB != ""
        cs add $CSCOPE_DB
    endif

    set csverb

endif
```



# 设置使用指定的vimrc

https://segmentfault.com/q/1010000000411428

### 单次使用命令行

```shell
vim -u myvimrc  
或
gvim -U myvimrc
```



### 使用如下的脚本 `../cmd.sh`

cat `/gsa/tlbgsa/projects/x/xlcdl/shkzhang/docker/.vim/cmd.sh`

```shell
export MYVIMRC=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/docker/.vim/vimrc
export VIMINIT="let &rtp='/gsa/tlbgsa/projects/x/xlcdl/shkzhang/docker/.vim,' . &rtp
so $MYVIMRC"
export VIMTMP=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/docker/.vim/tmpfs
```



### 或者 `cat cmd.sh`

```shell
# https://segmentfault.com/q/1010000000411428
export VIM_HOME=/gsa/tlbgsa/projects/x/xlcdl/shkzhang/docker/.vim
export MYVIMRC=$VIM_HOME/vimrc
export VIMINIT="let &rtp='$VIM_HOME,' . &rtp
so $MYVIMRC"
export VIMTMP=$VIM_HOME/tmpfs
```



### 在.bashrc中加入如下

```shell
. /gsa/tlbgsa/projects/x/xlcdl/shkzhang/docker/.vim/cmd.sh
```

