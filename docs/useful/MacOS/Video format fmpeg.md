https://mrcoles.com/convert-mov-mp4-ffmpeg/

https://videoconverter.wondershare.com/mov/ffmpeg-mov-to-mp4.html

https://juejin.im/post/5a3522eb6fb9a044fc44cfeb

https://blog.csdn.net/wh8_2011/article/details/52128824

https://blog.csdn.net/zhangfan_12871/article/details/79851763

https://askubuntu.com/questions/5198/what-is-the-best-way-to-shrink-hd-quicktime-mov-files





100M mov to 100M mp4

```shell
ffmpeg -i ShrinkWrap.cut.mov -vcodec h264 -acodec copy ShrinkWrap.cut.mp4
```





100M mov to 20M mp4.

```shell
ffmpeg -i ShrinkWrap.cut.mov -vcodec h264 -acodec copy ShrinkWrap.cut.mp4
```





视频变小选项fs（视频的最大尺寸限制file_size）

还不确定是否能对格式进行转换

```
ffmpeg -i input.avi -fs 10MB output.mp4
ffmpeg -i input.mov -fs 10MB output.mp4
ffmpeg -i input.mov -fs 10MB output.mov
```

