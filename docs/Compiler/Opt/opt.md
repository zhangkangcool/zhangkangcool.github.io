# opt










````shell
opt -O3 main.ll -S -o test.ll --debug-pass-manager > opt3.log 

opt -O3 main.ll -S -o test.ll --debug-pass=Structure > opt3.log 

```
opt -passes="default<O3>" --print-pipeline-passes resnet50.ll -S -o /dev/null
```
````





```shell
opt和llc有很多优化是相同的，可以通过llc --help-list-hidden和opt --help-list-hidden
```





```shell
opt -view-cfg test.ll # 会生成dot文件，进行展示,已经弃用，使用下面


opt -passes=dot-cfg -disable-output 2-4.ll
-passes=dot-cfg：指定执行 “生成 CFG DOT 图” 的分析传递（对应旧版-dot-cfg）；
-disable-output：关键参数 ——opt 默认会输出处理后的 IR 文件，加这个参数可以只生成 DOT 图，避免多余输出。
```

