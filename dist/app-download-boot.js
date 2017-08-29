/**
 * Created by Capricorncd on 2017/6/28 0028.
 * https://github.com/capricorncd
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && (define.amd || define.cmd) ? define(factory) :
            global.appDownloadBoot = factory();
}(this, function () {
    'use strict';
    var appDownloadBoot = (function () {
        function appDownloadBoot(params) {
            // 微信
            this.isWeixin = !!(/MicroMessenger/ig).test(navigator.userAgent);
            // Android Device
            this.isAndroid = !!navigator.userAgent.match(/android/ig);
            // IOS Device
            this.isIos = !!navigator.userAgent.match(/(iphone|ipod|ios|ipad)/ig);
            this.opts = this.concatOptions(params);
            // 创建meta标签，只对ios6及以上safari浏览器有效
            if (this.isIos) {
                this.createIosMeta();
            }
        }
        // 合并默认配置参数与用户设置的参数
        appDownloadBoot.prototype.concatOptions = function (opts) {
            opts = opts instanceof Object ? opts : {};
            var obj = {};
            for (var key in opts) {
                obj[key] = opts[key];
            }
            // 默认配置
            var _DEFAULT = {
                android: {
                    file: null,
                    schema: null,
                    yyb: null
                },
                ios: {
                    appid: null,
                    schema: null,
                    appstore: null
                },
                site: null,
                url: null
            };
            for (var key1 in _DEFAULT) {
                if (!obj[key1]) {
                    this.opts.callback && this.opts.callback({
                        code: 1,
                        msg: key1 + " \u672A\u914D\u7F6E"
                    });
                    obj[key1] = _DEFAULT[key1];
                }
                if (_DEFAULT[key1] instanceof Object) {
                    for (var k in _DEFAULT[key1]) {
                        var val = _DEFAULT[key1][k];
                        try {
                            if (!obj[key1][k]) {
                                this.opts.callback && this.opts.callback({
                                    code: 2,
                                    msg: key1 + "\u5C5E\u6027" + k + " \u672A\u914D\u7F6E"
                                });
                                obj[key1][k] = val;
                            }
                        }
                        catch (e) {
                        }
                    }
                }
            }
            return obj;
        };
        // 点击下载
        appDownloadBoot.prototype.download = function () {
            var _this = this;
            // 非移动设备，直接跳转至设置的官网
            if (!this.isAndroid && !this.isIos) {
                this.opts.callback && this.opts.callback({
                    code: 7,
                    msg: '非移动设备'
                });
                window.location.href = this.opts.url;
                return;
            }
            var android = this.opts.android || {};
            var ios = this.opts.ios || {};
            // Android
            if (this.isAndroid) {
                // 尝试启动app
                this.tryStarting(android.schema, function (status) {
                    if (!status) {
                        // 微信浏览器 =》应用宝
                        // 非微信浏览器：访问apk文件，直接下载
                        window.location.href = _this.isWeixin ? android.yyb : android.file;
                    }
                });
                this.opts.callback && this.opts.callback({
                    code: 5,
                    msg: 'andriod设备'
                });
            }
            else if (this.isIos) {
                // 尝试启动app
                this.tryStarting(ios.schema, function (status) {
                    if (!status) {
                        // 进入appStore
                        window.location.href = ios.appstore;
                    }
                });
                this.opts.callback && this.opts.callback({
                    code: 6,
                    msg: 'ios设备'
                });
            }
        };
        // 尝试启动app
        appDownloadBoot.prototype.tryStarting = function (schemaUrl, callback) {
            var _this = this;
            // 创建iframe
            // 通过iframe.src尝试启动app
            if (schemaUrl) {
                var iframe_1 = document.createElement('iframe');
                iframe_1.style.cssText = 'display:none;width=0;height=0';
                iframe_1.src = schemaUrl + "?url=" + this.opts.url;
                iframe_1.onload = function () {
                    callback && callback(true);
                    _this.opts.callback && _this.opts.callback({
                        code: 3,
                        msg: '启动App成功'
                    });
                };
                iframe_1.onerror = function () {
                    callback && callback(false);
                    _this.opts.callback && _this.opts.callback({
                        code: 4,
                        msg: '启动App失败'
                    });
                };
                document.body.appendChild(iframe_1);
                // 移除iframe
                var timer_1 = setTimeout(function () {
                    document.body.removeChild(iframe_1);
                    clearTimeout(timer_1);
                }, 1000);
                this.opts.callback && this.opts.callback({
                    code: 8,
                    msg: '尝试启动app: ' + iframe_1.src
                });
            }
            else {
                this.opts.callback && this.opts.callback({
                    code: 9,
                    msg: '未配置schema协议'
                });
            }
        };
        // 创建meta标签
        appDownloadBoot.prototype.createIosMeta = function () {
            var appid = this.opts.ios.appid;
            var meta = document.createElement('meta');
            meta.setAttribute('name', 'apple-itunes-app');
            meta.setAttribute('content', "app-id='" + appid + "', affiliate-data=myAffiliateData, app-argument='" + appid + "'");
            document.querySelector('head').appendChild(meta);
        };
        return appDownloadBoot;
    }());
    return appDownloadBoot;
}));
