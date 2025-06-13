<h1 align="center">get current dir</h1>


得到当前脚本的绝对路径

绝对路径

absolute path

```shell
export PROJECT_HOME=$( cd $( dirname "$BASH_SOURCE[0]" ) && pwd )
```

