# bat
https://zhuanlan.zhihu.com/p/363313066



```bash
sudo apt install bat -y
batcat才是这个命令，需要softlink
ln -s /usr/bin/batcat ~/.local/bin/bat
sudo ln -s /usr/bin/batcat /usr/bin/bat
```





https://github.com/sharkdp/bat/releases

```shell
git show v0.6.0:src/main.rs | bat -l rs
bat -l sh test.ksh
bat -l asm test.dis
```

