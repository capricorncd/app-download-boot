/**
 * Created by Capricorncd on 2017/6/28 0028.
 * https://github.com/capricorncd
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && (define.amd || define.cmd) ? define(factory) :
            global.appDownloadBoot = factory();
}(this, function () {
    'use strict'

    class appDownloadBoot {
        // 微信
        isWeixin: boolean = !!(/MicroMessenger/ig).test(navigator.userAgent)
        // Android Device
        isAndroid: boolean = !!navigator.userAgent.match(/android/ig)
        // IOS Device
        isIos: boolean = !!navigator.userAgent.match(/(iphone|ipod|ios|ipad)/ig)
        opts: any

        constructor(params) {
            this.opts = this.concatOptions(params)
            // 创建meta标签，只对ios6及以上safari浏览器有效
            if (this.isIos) {
                this.createIosMeta()
            }
        }

        // 合并默认配置参数与用户设置的参数
        concatOptions(opts) {
            opts = opts instanceof Object ? opts : {}
            let obj = {}
            for (let key in opts) {
                obj[key] = opts[key]
            }
            // 默认配置
            let _DEFAULT: any = {
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
            }

            for (let key1 in _DEFAULT) {
                if (!obj[key1]) {
                    this.opts.callback && this.opts.callback({
                        code: 1,
                        msg: `${key1} 未配置`
                    })
                    obj[key1] = _DEFAULT[key1]
                }

                if (_DEFAULT[key1] instanceof Object) {
                    for (let k in _DEFAULT[key1]) {
                        let val = _DEFAULT[key1][k]
                        try {
                            if (!obj[key1][k]) {
                                this.opts.callback && this.opts.callback({
                                    code: 2,
                                    msg: `${key1}属性${k} 未配置`
                                })
                                obj[key1][k] = val
                            }
                        } catch (e) {
                        }
                    }
                }
            }
            return obj
        }

        // 点击下载
        download() {
            // 非移动设备，直接跳转至设置的官网
            if (!this.isAndroid && !this.isIos) {
                this.opts.callback && this.opts.callback({
                    code: 7,
                    msg: '非移动设备'
                });
                window.location.href = this.opts.url
                return
            }

            let android = this.opts.android || {}
            let ios = this.opts.ios || {}
            // Android
            if (this.isAndroid) {
                // 尝试启动app
                this.tryStarting(android.schema, (status) => {
                    if (!status) {
                        // 微信浏览器 =》应用宝
                        // 非微信浏览器：访问apk文件，直接下载
                        window.location.href = this.isWeixin ? android.yyb : android.file
                    }
                })
                this.opts.callback && this.opts.callback({
                    code: 5,
                    msg: 'andriod设备'
                })
            }
            // Ios
            else if (this.isIos) {
                // 尝试启动app
                this.tryStarting(ios.schema, (status) => {
                    if (!status) {
                        // 进入appStore
                        window.location.href = ios.appstore
                    }
                })
                this.opts.callback && this.opts.callback({
                    code: 6,
                    msg: 'ios设备'
                })
            }
        }

        // 尝试启动app
        tryStarting(schemaUrl, callback) {
            // 创建iframe
            // 通过iframe.src尝试启动app
            if (schemaUrl) {
                let iframe = document.createElement('iframe')
                iframe.style.cssText = 'display:none;width=0;height=0'
                iframe.src = `${schemaUrl}?url=${this.opts.url}`
                iframe.onload = () => {
                    callback && callback(true)
                    this.opts.callback && this.opts.callback({
                        code: 3,
                        msg: '启动App成功'
                    })
                }
                iframe.onerror = () => {
                    callback && callback(false)
                    this.opts.callback && this.opts.callback({
                        code: 4,
                        msg: '启动App失败'
                    })
                }
                document.body.appendChild(iframe)
                // 移除iframe
                let timer = setTimeout(() => {
                    document.body.removeChild(iframe)
                    clearTimeout(timer)
                }, 1000)
                this.opts.callback && this.opts.callback({
                    code: 8,
                    msg: '尝试启动app: ' + iframe.src
                })
            } else {
                this.opts.callback && this.opts.callback({
                    code: 9,
                    msg: '未配置schema协议'
                })
            }
        }

        // 创建meta标签
        createIosMeta() {
            let appid = this.opts.ios.appid
            let meta = document.createElement('meta')
            meta.setAttribute('name', 'apple-itunes-app')
            meta.setAttribute('content', `app-id='${appid}', affiliate-data=myAffiliateData, app-argument='${appid}'`)
            document.querySelector('head').appendChild(meta)
        }

    }

    return appDownloadBoot

}))