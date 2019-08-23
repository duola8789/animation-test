# 跟手性测量 Demo

## 使用

```BASH
# 开始测量
npm run test

# 运行动画 demo
npm run demo
```

首先需要域名`npm run demo`，启动动画页面，然后在另外的Bash窗口执行`npm run test`即可输出跟手性测量结果。

## 说明

首先，跟手性衡量指标定义为：「触发产生动画的操作，到动画元素开始移动之间的时间差」

目前采取的方案是利用 puppeteer 的 page.tracing 接口进行截图，因为 tracing 的截图只会在屏幕发生变化时进行，所以认为第一帧和第二帧的时间差即为跟手性时间差

## 缺陷

1. 准确性待测量
2. 本来想使用像素对比工具（Pixelmatch 或者 Blink-Diff）对前两帧的截图进行比对，但是在试验时，两个工具都对 puppeteer 的 tracing 截图 PNG 图片报错 `Invalid file
 signature`，原因未知

## 参考

- [trace.json各字段说明](https://github.com/temberature/blog/issues/22)
- [从trace.json结果中提取数据以及时间的处理](https://github.com/GoogleChrome/puppeteer/issues/1368)
- [从trace.json结果中提取截图](https://github.com/GoogleChrome/puppeteer/issues/1072)
- [puppeteer中文文档](https://zhaoqize.github.io/puppeteer-api-zh_CN/)
- [puppeteer模拟CPU卡顿的方法](https://michaljanaszek.com/blog/test-website-performance-with-puppeteer#emulateSlowNetworkAndCPU)
- [puppeteer模拟CPU卡顿的文档](https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setCPUThrottlingRate)
- [像素对比工具blink-diff的使用](https://segmentfault.com/a/1190000014720175#articleHeader8)
- [像素对比工具pixelmatch的文档](https://github.com/mapbox/pixelmatch)
- [像素对比工具pixelmatch的使用例子](https://futu.im/article/automatic-visual-diffing-with-puppeteer/)

