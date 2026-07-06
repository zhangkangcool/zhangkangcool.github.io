# nohup

## 1. 后台运行

```shell
nohup python main_concurrent.py > /dev/null 2>&1 &
或者
nohup python main_concurrent.py > myearning.out 2>&1 &
```



## 2. 退出程序

1. 查找进程 PID（推荐先查看确认）：

   ```shell
   pgrep -af main_concurrent.py
   # 或
   ps aux | grep '[m]ain_concurrent.py'
   ```

   

2. 发送终止信号（优雅退出）：

   ```shell
   kill <PID>
   # 例如
   kill 12345
   ```

   

3. 如果进程没有响应，再强制终止：

   ```shell
   kill -9 <PID>
   ```

   

4. 也可直接按匹配名一次性终止（小心，可能匹配到多个进程）:

   ```shell
   pkill -f main_concurrent.py
   # 强制：
   pkill -9 -f main_concurrent.py
   ```

   

5. 确认进程已停止

   ```shell
   pgrep -af main_concurrent.py
   # 或
   ps aux | grep '[m]ain_concurrent.py'
   ```

   

