/**
 * 异步请求类，依赖jquery
 */
(function() {

    function Ajax() {
        this.host = 'http://116.62.64.184'; //接口主机，
        this.key = 'rqovzf%%#$gbtxey'; //密钥
        this.timeout = 3000; //接口默认超时时间
        this.cache = true; //是否缓存
    }

    /**
     * 获取当前登录用户ID
     * @return 用户ID
     */
    Ajax.prototype.getUserID = function(){
    	return 1;
    }

    /**
     * 发起请求
     * @param options 请求参数，参照jquery
     * {
     * 	url: '/api/test',//接口地址，以斜杠开头
     * 	data: {},//请求数据
     * 	type: 'POST|GET',//请求类型，默认POST
     * 	...
     * }
     * @param callback 成功回调
     * @param callbackError 失败回调
     * @return 
     */
    Ajax.prototype.send = function(options, callback, callbackError) {
        var that = this;

        options = options || {};

        if (typeof options.contentType == undefined) {
            options.contentType = 'application/json'
        }
        if (typeof options.processData == undefined) {
            options.processData = true;
        }

        $.ajax({
            url: options.url,
            data: options.data,
            type: options.type || 'POST',
            dataType: 'json',
            timeout: that.timeout,
            cache: that.cache,
            contentType: options.contentType,
            processData: options.processData,
            headers: options.header,
            success: function(response, textStatus, jqXHR) {
                if (!response || (response.code && response.code != 200 && response.code != 204)) {
                    if (typeof callbackError == 'function') {
                        callbackError('Malformed', response);
                    }
                    return;
                }

                if (typeof callback == 'function') {
                    callback(response);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (typeof callbackError == 'function') {
                    callbackError(textStatus, {});
                }
            },
            complete: function(xhr, status) {

            }
        });
    }

    /**
     * 数据渲染到模板
     * @param renderEle-渲染容器
     * @param renderFor-渲染模版
     * @param data-数据
     * @param isAppend-是否追加
     */
    function render(renderEle, renderFor, data, isAppend) {
        if ($('#' + renderFor).length > 0 && data) {
            if (typeof data.length != 'undefined') {
                data = {
                    'list': data
                };
            }
            var result = tmpl(renderFor, data);
            if (isAppend) {
                $(renderEle).append(result);
            } else {
                $(renderEle).html(result);
            }
        }
    }

    /**
     * 使用模板
     * @param renderFor 模板名称
     * @data 数据
     */
    function tmpl(renderFor, data) {
        return template.render(renderFor, data);
    }

    Ajax.prototype.getParamFromURL = function(name){//获取具体参数，通过URL
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]); return null;
    }

    window.Ajax = new Ajax();//定为全局方法

})()