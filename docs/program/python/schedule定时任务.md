<h1 align="center">schedule定时任务</h1>






```python
import schedule
import time
from datetime import datetime

def job(name, count=0):
    """需要定时执行的函数，接收参数"""
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"任务执行时间: {current_time}")
    print(f"参数 name: {name}, count: {count}")

# 设置定时任务，传递参数
schedule.every(2).seconds.do(job, name="2s定时任务", count=1)
schedule.every().minute.do(job, name="每分钟任务", count=2)
schedule.every().day.at("22:35:01").do(job, name="每分钟任务", count=3)

# 无限循环执行定时任务
print("定时任务已启动，按 Ctrl+C 终止...")
try:
    while True:
        schedule.run_pending()
        time.sleep(1)
except KeyboardInterrupt:
    print("\n任务已停止")
```

