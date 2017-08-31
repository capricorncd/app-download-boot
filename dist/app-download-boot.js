/**
 * Created by Capricorncd on 2017/6/28 0028.
 * https://github.com/capricorncd
 */
'use strict';

function appDownloadBoot(params) {
    // 微信
    this.isWeixin = !!/MicroMessenger/ig.test(navigator.userAgent);
    // Android Device
    this.isAndroid = !!navigator.userAgent.match(/android/ig);
    // IOS Device
    this.isIos = !!navigator.userAgent.match(/(iphone|ipod|ios|ipad)/ig);
    this.iosVersion = this.getIosVersion();
    this.opts = {};
    this.concatOptions(params);
    // 创建meta标签，只对ios6及以上safari浏览器有效
    this.createIosMeta();
}

var fn = appDownloadBoot.prototype;

// 合并默认配置参数与用户设置的参数
fn.concatOptions = function (opts) {
    opts = opts instanceof Object ? opts : {};
    for (var key in opts) {
        this.opts[key] = opts[key];
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
        if (!this.opts[key1]) {
            this.opts.callback && this.opts.callback({
                code: 1,
                msg: key1 + ' \u672A\u914D\u7F6E'
            });
            this.opts[key1] = _DEFAULT[key1];
        }

        if (_DEFAULT[key1] instanceof Object) {
            for (var k in _DEFAULT[key1]) {
                var val = _DEFAULT[key1][k];
                try {
                    if (!this.opts[key1][k]) {
                        this.opts.callback && this.opts.callback({
                            code: 2,
                            msg: key1 + '\u5C5E\u6027' + k + ' \u672A\u914D\u7F6E'
                        });
                        this.opts[key1][k] = val;
                    }
                } catch (e) {}
            }
        }
    }
};

// 点击下载
fn.download = function () {
    var _this = this;

    // 非移动设备，直接跳转至设置的官网
    if (!this.isAndroid && !this.isIos) {
        this.opts.callback && this.opts.callback({
            code: 7,
            msg: '非移动设备'
        });
        window.location.href = this.opts.site;
        return;
    }

    var android = this.opts.android || {};
    var ios = this.opts.ios || {};
    // Android
    if (this.isAndroid) {
        // 尝试启动app
        this.tryStarting(android.schema, function (res) {
            if (res.code > 0) {
                // 微信浏览器 =》应用宝
                // 非微信浏览器：访问apk文件，直接下载
                if (_this.isWeixin) {
                    window.location.href = android.yyb;
                } else {
                    _this.createIframe(android.file, function (res2) {
                        // 下载文件失败，实际获取不到结果?
                        if (res2.code > 0) {
                            window.location.href = this.opts.site;
                        }
                    });
                }
            }
        });
        this.opts.callback && this.opts.callback({
            code: 5,
            msg: 'andriod设备'
        });
    }
    // Ios
    else if (this.isIos) {
            // ios version >= 9
            if (this.iosVersion >= 9) {
                window.location.href = this.opts.url ? ios.schema + '?url=' + this.opts.url : ios.schema;
                var timer = setTimeout(function () {
                    // 阻塞页面跳转，让用户有时间点击启动App按钮
                    window.alert('即将进入appStore！');
                    window.location.href = ios.appstore;
                    clearTimeout(timer);
                }, 500);
                return;
            }
            // ios version < 9
            // 尝试启动app
            this.tryStarting(ios.schema, function (res) {
                if (res.code > 0) {
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
fn.tryStarting = function (schemaUrl, callback) {
    var _this2 = this;

    // 创建iframe
    // 通过iframe.src尝试启动app
    if (schemaUrl) {

        this.createIframe(schemaUrl, function (res) {
            callback && callback(res);
            if (res.code === 0) {
                _this2.opts.callback && _this2.opts.callback({
                    code: 3,
                    msg: '启动App成功'
                });
            } else {
                _this2.opts.callback && _this2.opts.callback({
                    code: 4,
                    msg: '启动App失败 ' + schemaUrl
                });
            }
        });

        this.opts.callback && this.opts.callback({
            code: 8,
            msg: '尝试启动app: ' + schemaUrl
        });
    } else {
        this.opts.callback && this.opts.callback({
            code: 9,
            msg: '未配置schema协议'
        });
    }
};

// 获取ios系统版本号
fn.getIosVersion = function () {
    return (/OS (\d+)/ig.test(navigator.userAgent) ? RegExp.$1 : 0
    );
};

// 创建meta标签
fn.createIosMeta = function () {
    if (this.isIos) {
        var appid = this.opts.ios.appid;
        var meta = document.createElement('meta');
        meta.setAttribute('name', 'apple-itunes-app');
        meta.setAttribute('content', 'app-id=\'' + appid + '\', affiliate-data=myAffiliateData, app-argument=\'' + appid + '\'');
        document.querySelector('head').appendChild(meta);
    }
};

// 创建iframe
fn.createIframe = function (url, callback) {
    var iframe = document.createElement('iframe');
    iframe.style.cssText = 'display:none;width=0;height=0';
    iframe.src = url;
    document.body.appendChild(iframe);

    // 超时处理
    var overtime = setTimeout(function () {
        callback && callback({
            code: 2,
            msg: 'overtime'
        });
        clearTimeout(overtime);
    }, 3000);

    // onload
    iframe.onload = function () {
        clearTimeout(overtime);
        callback && callback({
            code: 0,
            msg: 'success'
        });
    };

    // onerror
    iframe.onerror = function () {
        clearTimeout(overtime);
        callback && callback({
            code: 1,
            msg: 'error'
        });
    };
    // 移除iframe
    var timer = setTimeout(function () {
        document.body.removeChild(iframe);
        clearTimeout(timer);
    }, 1500);
};