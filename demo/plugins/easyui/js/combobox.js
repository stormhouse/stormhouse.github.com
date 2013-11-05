/**
 *
 * from jquery-easy-ui
 * http://www.jeasyui.com
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 12-12-31
 * Time: 下午5:55
 * To change this template use File | Settings | File Templates.
 *
 * 201-09-10 添加reload方法
 *    var url = 'get_data2.php?id='+rec.id;
 *    $('#cc2').combobox('reload', url);
 *
 *
 *
 */

(function($){

  /**
   * select previous item
   */
  function selectPrev(target){
    var panel = $(target).combo('panel');
    var values = $(target).combo('getValues');
    var item = panel.find('div.eui-combobox-item[value=' + values.pop() + ']');
    if (item.length){
      var prev = item.prev(':visible');
      if (prev.length){
        item = prev;
      }else{
        item = panel.find('div.eui-combobox-item:visible:last');
      }
    } else {
      item = panel.find('div.eui-combobox-item:visible:last');
    }
    var value = item.attr('value');
    setValues(target, [value]);
    childrenLoadData(target, value);

    if (item.position().top <= 0){
      var h = panel.scrollTop() + item.position().top;
      panel.scrollTop(h);
    } else if (item.position().top + item.outerHeight() > panel.height()){
      var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
      panel.scrollTop(h);
    }
  }

  function bindEvents(target){
    var opts = $.data(target, 'combobox').options;
    var panel = $(target).combo('panel');
    var input = $.data(target, 'combo').combo.find('.eui-combo-text');
//    $.data(target, 'combobox').data = data;

    input.unbind('.combobox').bind('keyup.combobox', function(e){
      var item = panel.find('.eui-combobox-item-selected');
      var keyCode = e.keyCode;
      switch(keyCode){
        case 13:
          select(target, item.attr('value'));
      }
      //BackSpace space 字符
      if (keyCode == 8 || keyCode == 32 || keyCode >= 65 && keyCode <= 90 || keyCode >= 48 && keyCode <= 57 ){
        clearTimeout(opts.timeouter);
        if(input.val().length<opts.searchCharSize) { $(target).combo('hidePanel');return; };
        doSearch(target, input.val());
      }
    });
  }

  /**
   * select next item
   */
  function selectNext(target){
    var panel = $(target).combo('panel');
    var values = $(target).combo('getValues');
    var item = panel.find('div.eui-combobox-item[value=' + values.pop() + ']');
    if (item.length){
      var next = item.next(':visible');
      if (next.length){
        item = next;
      }else{
        item = panel.find('div.eui-combobox-item:visible:first');
      }
    } else {
      item = panel.find('div.eui-combobox-item:visible:first');
    }
    var value = item.attr('value');
    setValues(target, [value]);
    childrenLoadData(target, value);

    if (item.position().top <= 0){
      var h = panel.scrollTop() + item.position().top;
      panel.scrollTop(h);
    } else if (item.position().top + item.outerHeight() > panel.height()){
      var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
      panel.scrollTop(h);
    }
  }

  function selectCurr(target){
    var panel = $(target).combo('panel');
    var item = panel.find('div.eui-combobox-item-selected');
    setValues(target, [item.attr('value')]);
    $(target).combo('hidePanel');
  }

  function filter(target){

  }

  function childrenLoadData(target, parentValue){
    var opts = $.data(target, 'combobox').options;
    var childrenIds = opts.children;

    for(var id in childrenIds){
      var childOpts = $.data($('#'+childrenIds[id]).get(0), 'combobox').options;
      var su = childOpts.shortUrl;
      var searchParentKey = childOpts.searchParentKey;
      var url = su+ '?'+searchParentKey+'='+parentValue;
      if(!parentValue || parentValue =='') return ;

      $('#'+childrenIds[id]).combobox({
        url: url
      });
    }
  }

  /**
   * select the specified value
   */
  function select(target, value){
    var opts = $.data(target, 'combobox').options;
    var data = $.data(target, 'combobox').data;

    if (opts.multiple){
      var values = $(target).combo('getValues');
      for(var i=0; i<values.length; i++){
        if (values[i] == value) return;
      }
      values.push(value);
      setValues(target, values);
    } else {
      setValues(target, [value]);
      $(target).combo('hidePanel');
      childrenLoadData(target, value);
    }

//    var childrenIds = opts.children;
//
//    for(var id in childrenIds){
//      $('#'+childrenIds[id]).combobox('setValue', '');
//      $('#'+childrenIds[id]).combobox('setText', '');
//    }
    for(var i=0; i<data.length; i++){
      if (data[i][opts.valueField] == value){
        opts.onSelect.call(target, data[i]);
        return;
      }
    }
  }

  /**
   * set value
   */
  function setValue(target, value){
    var opts = $.data(target, 'combobox').options;
    var v = value;
    if (typeof value == 'object'){
      v = value[opts.valueField];
    }
    setValues(target, [v]);
  }

  function setData(target, obj){

    var opts = $.data(target, 'combobox').options;
    setValue(target, obj.value)
    $(target).combo('setText', obj.text)
    var newObj = {};
    newObj[opts.valueField] = obj.value
    newObj[opts.textField] = obj.text
    opts.onSelect.call(target, newObj);

  }

  /**
   * set values
   * 暂不支持多选
   */
  function setValues(target, values, remainText){
    var opts = $.data(target, 'combobox').options;
    var data = $.data(target, 'combobox').data;
    var panel = $(target).combo('panel');

    panel.find('div.eui-combobox-item-selected').removeClass('eui-combobox-item-selected');
    var vv = [], ss = [];
    for(var i=0; i<values.length; i++){
      var v = values[i];
      var s = '';
      for(var j=0; j<data.length; j++){
        if (data[j][opts.valueField] == v){
          if(data[j][opts.aliasField]){
            s = data[j][opts.textField]+'('+data[j][opts.aliasField]+')';
          }else{
            s = data[j][opts.textField];
          }
          break;
        }
      }
      vv.push(v);
      ss.push(s);
      var temp = panel.find('div.eui-combobox-item');
      //修正value里有特殊字符
      temp.each(function(){
        if($(this).attr('value') ==v){
          $(this).addClass('eui-combobox-item-selected');
        }
      })
//	      temp.addClass('eui-combobox-item-selected');
//	      panel.find('div.eui-combobox-item[value=' + v + ']').addClass('eui-combobox-item-selected');
    }

    $(target).combo('setValues', vv);
    if (!remainText){
      $(target).combo('setText', ss.join(opts.separator));
    }
  }

  /**
   * request remote data if the url property is setted.
   */
  function request(target, url){
    var opts = $.data(target, 'combobox').options;
    if (url){
      opts.url = url;
    }
    if (!opts.url) return;
//	    else
//	      if(opts.shortUrl) return;//为级连

    $.ajax({
      url:opts.url,
      type: opts.method,
      dataType:'json',
      data: opts.urlParams,
      success:function(data){
        loadData(target, data, true);
        opts.onLoadSuccess.call(target, data);
      },
      error:function(){
        opts.onLoadError.apply(this, arguments);
      }
    })
  }

  /**
   * input失去焦点,如果input中输入的值，不存在于下拉panel中，则清空
   * @param value
   * @private
   */
  function _onBlur(value){
    var panel = $(this).combo('panel');
    var opts = $.data(this, 'combobox').options;
    var list = panel.find('.eui-combobox-item');

//    console.log(this);
    if(value == ''){
      $(this).combo('setValue', '');
      panel.find('.eui-combobox-item-selected').removeClass('eui-combobox-item-selected');
    }


    var isExit = false;
    var item;
    list.each(function(){
      if($(this).html().replace(new RegExp('<b>',"gm"),"").replace(new RegExp('</b>',"gm"),"") == value){
        isExit = true;
        item = $(this)
      }
    });
    if(!isExit){
      $.data(this, 'combo').combo.find('.eui-combo-text').val('');
      $.data(this, 'combo').combo.find('.eui-combo-value').val('');
    }else{
      var obj = {};
      obj[opts.valueField] = item.attr('value');
      obj[opts.textField] = item.attr('data-text');
//      console.log('_onBlur')
//      opts.onSelect.call(this, obj);
    }
  }

  function _onBindAllItem(target){
    var opts = $.data(target, 'combobox').options;
    var data = $.data(target, 'combobox').data;
    var panel = $(target).combo('panel');
    $('.eui-combobox-item', panel).hover(
        function(){$(this).addClass('eui-combobox-item-hover');},
        function(){$(this).removeClass('eui-combobox-item-hover');}
    ).click(function(){
          var item = $(this);
          if (opts.multiple){
            if (item.hasClass('eui-combobox-item-selected')){
//            unselect(target, item.attr('value'));
            } else {
              select(target, item.attr('value'));
            }
          } else {
            select(target, item.attr('value'));
          }
        });
  }

  function create(target){
    var opts = $.data(target, 'combobox').options;
    opts.onBlur = _onBlur
    opts.onBindAllItem = _onBindAllItem;
    var combo = $(target).combo(opts);
    $(target).combo('setValue', '');
    $(target).combo('setText', '');
    $.data(target, 'combobox', {
      options: opts,
      combo: combo
    });
  }

  function setDisable(target){
    var opts = $.data(target, 'combobox').options;
    opts.disabled = true;
    $(target).combo('disable');
    opts.onDisable.call(target, target);
  }

  function setEnable(target){
    var opts = $.data(target, 'combobox').options;
    opts.disabled = false;
    $(target).combo('enable');
    opts.onEnable.call(target, target);
  }

  function destroy(target){
    var comboboxDaa = $.data(target, 'combobox');
    if(comboboxDaa){
      var combo = $.data(target, 'combobox').combo;
//	    var combo1 = $.data(target, 'combo').combo;
      combo.combo('destroy');
      $.data(target, 'combobox', null);
//	    $(target).remove();
    }
  }

  function transformData(target){
    var opts = $.data(target, 'combobox').options;
    var data = [];
    $('>option', target).each(function(){
      var item = {};
      item[opts.valueField] = $(this).attr('value') || $(this).html();
      item[opts.textField] = $(this).html();
      item['selected'] = $(this).attr('selected');
      data.push(item);
    });
    return data;
  }

  /**
   *
   * @param target
   * @param data
   * @param all   all为true则为点arrow出的全部值（allPanel）；区分开输入查询的部分值(panel)
   */
  function loadData(target, data, all){
    var opts = $.data(target, 'combobox').options;
    var panel = $(target).combo('panel');
    var input = $.data(target, 'combo').combo.find('.eui-combo-text');
    var hiddenValue = $.data(target, 'combo').combo.find('.eui-combo-value').val();

    var currentText = $(target).combo('getText')
    var oldValue = $(target).combo('getValue');
    var oldValueExits = false;
    var isContain = false;

    $.data(target, 'combobox').data = data;

    var selected = [];
    panel.empty();	// clear old data
    if(opts.blankItem){
      var item = $('<div class="eui-combobox-item" style="height: 16px;"></div>');
      item.attr('value', '');
      item.html('');
      item.appendTo(panel);
    }
    var inputValue = input.val();
    for(var i=0; i<data.length; i++){
      var itemTemp = $('<div class="eui-combobox-item"></div>').appendTo(panel);
      itemTemp.css('background-position', '0px -1034px');

      itemTemp.attr('value', data[i][opts.valueField]);
      itemTemp.attr('data-text', data[i][opts.textField]);
      itemTemp.attr('title', data[i][opts.textField]);
      if(data[i][opts.valueField] == oldValue){
        oldValueExits = true;
      }

      if(data[i][opts.textField].indexOf(currentText)>-1 || (data[i][opts.aliasField] ? data[i][opts.aliasField].indexOf(currentText)>-1 : false) )
        isContain = true;
      var itemHtmlStr;

      if(data[i][opts.aliasField]){
        itemHtmlStr = data[i][opts.textField]+'('+data[i][opts.aliasField]+')'
//        itemTemp.html(data[i][opts.textField]+'('+data[i][opts.aliasField]+')');
      }else{
        itemHtmlStr = data[i][opts.textField];
//        itemTemp.html(data[i][opts.textField]);
      }
      if(!all && inputValue != ''){
        var newKeyword  = (inputValue).replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g, '\\$1');
        var reg = new RegExp('(' + newKeyword + ')',"gi");
        var highlightHtml = '<b>$1</b>';
        itemHtmlStr = itemHtmlStr.replace(reg, highlightHtml);
      }
      itemTemp.html(itemHtmlStr)
      if (data[i]['selected'] || data[i][opts.valueField] == hiddenValue){
        selected.push(data[i][opts.valueField]);
      }
      if (inputValue == data[i][opts.textField]+'('+data[i][opts.aliasField]+')' || inputValue == data[i][opts.textField]){
        selected.push(data[i][opts.valueField]);
      }
    }
//    if(!oldValueExits && !oldValue && !isContain){
//      $(target).combo('setText', '');
//    }

    if(all){
      $.data(target, 'combobox').allPanelContent = panel.html();
      $.data(target, 'combobox').allPanelData = data;

    }


    if (opts.multiple){
      setValues(target, selected);
    } else {
      if (selected.length){
        setValues(target, [selected[0]]);
      } else {
        if(opts.search){

        }else{
          setValues(target, []);
        }
      }
    }


    $('.eui-combobox-item', panel).hover(
        function(){$(this).addClass('eui-combobox-item-hover');},
        function(){$(this).removeClass('eui-combobox-item-hover');}
    ).click(function(){
          var item = $(this);
          if (opts.multiple){
            if (item.hasClass('eui-combobox-item-selected')){
//            unselect(target, item.attr('value'));
            } else {
              select(target, item.attr('value'));
            }
          } else {
            select(target, item.attr('value'));
          }
        });

  }

  function doSearch(target, value){
    var data  = $.data(target, 'combobox');
    var opts  = data.options;
    var panel = $(target).combo('panel');

    var key = opts.searchKey;
    var pKey = opts.searchParentKey;
    var params = {};
    if(opts.searchParentId){
      var pValue = $('#'+opts.searchParentId).combobox('getValue');
      params[key] = value;
      params[pKey] = pValue;
//      params = key+'='+value+'&'+pKey+'='+pValue;
    }else{
      params[key] = value;
    }

    opts.timeouter = setTimeout(function () {
      $.ajax({
        url: opts.searchUrl,
        type: opts.method,
        data: params,
        dataType: 'json',
        async: false,
//        contentType:'application/x-www-form-urlencoded;charset="utf-8"',
        success:function (data) {
          loadData(target, data);
          $(target).combo('showPanel', false);
        },
        error:function (xhr, status, error) {}
      });
    }, opts.searchTimeout);
  }

  function reload(target, url){
    $(target).combo('setValue', '');
    $(target).combo('setText', '');
    request(target,url);
  }

  /**
   * parse options from markup.
   */
  function parseOptions(target){
    var t = $(target);
    return $.extend({}, t.combo('parseOptions'), {
      valueField: t.attr('valueField'),
      textField: t.attr('textField'),
      url: t.attr('url')
    });
  }

  $.fn.combobox = function(options, params){

    if('string' == typeof options){
      var m = $.fn.combobox.methods[options];
      if(m){
        return m(this, params);
      }else{
        return this.combo(options, params);
      }
    }

    options = options || {};

    return this.each(function(){

      var state = $.data(this, 'combobox');
      if(state){
        $.extend(state.options, options);
//        create(this);
      }else{
//        if($(this).next().hasClass('eui-combo'))
//          $(this).next().remove();
        state = $.data(this, 'combobox', {
          options: $.extend({}, $.fn.combo.defaults, $.fn.combobox.defaults, parseOptions(this), options)
        });
        create(this);
        loadData(this, transformData(this));
      }
      bindEvents(this);
      request(this);
    });

  };

  $.fn.combobox.methods = {
    parseOptions: function(jq){
      return parseOptions(jq[0]);
    },
    setValue: function(jq, value){
      return jq.each(function(){
        setValue(this, value);
      });
    },
    setData: function(jq, obj){
      return jq.each(function(){
        setData(this, obj);
      });
    },
    destroy: function(jq){
      return jq.each(function(){
        destroy(this);
      });
    },
    disable: function(jq){
      return jq.each(function(){
        setDisable(this);
      });
    },
    enable: function(jq){
      return jq.each(function(){
        setEnable(this);
      });
    },
    triggerChildrenLoad: function(jq, value){
      return jq.each(function(){
        childrenLoadData(this, value);
      });
    },
    reload : function(jq, url){
      return jq.each(function(){
        reload(this, url);
      });
    }
  };

  $.fn.combobox.defaults = {
    valueField: 'id',
    textField: 'text',
    aliasField: 'alias',
    url: null,
    data: null,
    blankItem: false,
    search: false,
    searchParentId: '',
    searchParentKey: '',
    searchKey: 'searchKey',
    searchUrl: '',
    searchTimeout: 500,
    searchCharSize: 1,
    method: 'POST',

    selectPrev: function () {
      selectPrev(this);
    },
    selectNext: function () {
      selectNext(this);
    },
    selectCurr: function () {
      selectCurr(this);
    },
    filter: function (query) {
      filter(this, query);
    },

    onLoadSuccess: function () {
    },
    onLoadError: function () {
    },
    onSelect: function (record) {
    },
    onEnable: function (target) {
    },
    onDisable: function (target) {},
    onUnselect: function (record) {}
//    onBlur: function(){}
  };

})(jQuery);