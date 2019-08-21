'use strict';
/**
 * Created By zh on 2019-08-21
 */
var casper = require('casper').create({
  pageSettings: {
    userAgent: 'mozilla/5.0 (iphone; cpu iphone os 12_4 like mac os x) applewebkit/605.1.15 (khtml, like gecko)' +
      ' mobile/15e148 micromessenger/7.0.5(0x17000523) nettype/wifi language/zh_cn'
  },

  viewportSize: {
    width: 320,
    height: 568
  }
});

casper.start();

casper.thenOpen('http://www.baidu.com/', function () {
  casper.captureSelector('./images/baidu.png', 'html');
});

casper.run();
