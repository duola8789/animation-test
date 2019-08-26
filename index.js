const puppeteer = require('puppeteer');
const fs = require('fs-extra');

const getTimeFromMetrics = (metrics, name) => metrics.metrics.find(x => x.name === name).value * 1000;

//  CPU 模拟卡顿，1为不卡顿，2是2倍降速
const CPU_THROTTLE_RATE = 4;

// 动画 demo 地址
const ANIMATION_DEMO_URL = 'http://10.232.46.232:8081/';

// trace.json 存放路径
const TRACT_PATH = './trace';

// 截图存放路径
const IMAGE_PATH = './images';

(async () => {
  try {
    const browser = await puppeteer.launch({
      slowMo: 1
    });

    // 设置 CPU 模拟情况
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Emulation.setCPUThrottlingRate', { rate: CPU_THROTTLE_RATE });

    await page.goto(ANIMATION_DEMO_URL);

    // 时间处理
    const metrics = await page._client.send('Performance.getMetrics');
    const navigationStart = getTimeFromMetrics(metrics, 'NavigationStart');

    // 等待 1s
    await page.waitFor(1000);

    await fs.emptyDir(TRACT_PATH);

    // 开始测量
    await page.tracing.start({ screenshots: true, path: './trace/trace.json' });

    // 点击元素并进行移动
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(50, 100);
    await page.mouse.up();

    // 结束测量
    await page.tracing.stop();

    // 提取数据
    const tracing = JSON.parse(fs.readFileSync('./trace/trace.json', 'utf8'));
    const traceScreenshots = tracing.traceEvents.filter(x => (
      x.cat === 'disabled-by-default-devtools.screenshot' &&
      x.name === 'Screenshot' &&
      typeof x.args !== 'undefined' &&
      typeof x.args.snapshot !== 'undefined'
    ));

    await fs.emptyDir(IMAGE_PATH);

    // 生成截图
    traceScreenshots.forEach(function(snap, index) {
      const time = Math.round(snap.ts / 1000 - navigationStart);
      fs.writeFile('./images/trace-screenshot-'+ time +'.png', snap.args.snapshot, 'base64', function(err) {
        if (err) {
          console.log('writeFile error', err);
        }
      });
    });

    // 测量结果
    const timeResult = Math.round((traceScreenshots[1].ts - traceScreenshots[0].ts) / 1000);

    console.log(`跟手性延迟：${timeResult}ms`);

    await browser.close();
  } catch (e) {
    console.log(e);
  }
})();
