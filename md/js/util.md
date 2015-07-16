## form 提交 监听返回数据

    "plainFormSubmit": function (formSelector, callback) {
        var formEl = $(formSelector),
            iframeEl = $('#app-form-result-container');
        if (!iframeEl.length) {
            iframeEl = $('<iframe id="app-form-result-container" name="app_form_result_container"></iframe>');
            iframeEl.css({
                "position": "absolute",
                "top": "-100000px",
                "left": "-100000px"
            }).appendTo('body');
        }
        iframeEl.one('load', function () {
            callback && callback(JSON.parse(iframeEl.contents().text()));
        });
        formEl.attr('target', 'app_form_result_container');
        formEl[0].submit();
    }

## 驼峰式 -> 中划线式

    function humpStringToStrike(key){
        var i=0;
        var str = '';
        while(i<key.length){
            if(key[i].charCodeAt()>=65 && key[i].charCodeAt()<=90){
                str+='-'+key[i].toLowerCase();
            }else{
                str+=key[i];
            }
            i++;
        }
        return str
    }
