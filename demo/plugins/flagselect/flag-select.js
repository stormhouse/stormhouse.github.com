/**
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-7-25
 * Time: 下午1:43
 * To change this template use File | Settings | File Templates.
 */


(function($){

  function create(target, options){
    options = $.extend({}, $.fn.comboflag.defaults, options);

    var data  = $.data(target, 'comboflag');
    var container = $('<span class="flag-container">');
    container.width(options.width);
    if(options.height)
      container.height(options.height-2);


    var flag = $('<span class="flag-before"></span>');
    var f2 = $('<span class="triangle-bottom"></span>')
    var fContainer = $('<div style="cursor: pointer;">');
    fContainer.css({
      'display': 'inline-block',
      'position': 'relative',
      'top': options.height == 25 ? 1.5:2
    })
    fContainer.append(flag).append(f2)
    $(target).wrap(container).before(fContainer).addClass('flag-input');

    var panel = $('<div class="flag-panel" style="display: none"></div>');
    var input = $(target);

//    input.after(panel).css('border-width', '0').css('line-height', '23px');;
    input.after(panel).css({
      'border-width': '0',
      'line-height': options.height ? options.height-2+'px':'23px',
      'height': options.height ? options.height-2+'px':'23px',
      'padding': 0
    });
    panel.css("top", input.height() + "px");
    panel.css("left", "-1px").width(options.width);
    input.parent().css("position", "relative");

    input.width(options.width-40);
    $.data(target, 'comboflag', {
      options: options,
      panel: panel,
      flag: flag
    });
  }

  function generatePanel(target, dataArray){
    var data  = $.data(target, 'comboflag');
    var panel = data.panel;
    panel.html('');
    for(var i=0; i< dataArray.length; i++){
      panel.append($('<div class="flag-panel-item" data-y="'+dataArray[i].axisy+'" data-id="'+dataArray[i].countrycode+'" data-value="'+dataArray[i].areacode+'"></div>').append('<span class="flag-span-talk" style="background-position:0 '+dataArray[i].axisy+'px;"></span>').append('<span style="padding-left: 4px;">+'+dataArray[i].areacode+'</span>'));
    }
  }
  function bindEvents(target){

    var data  = $.data(target, 'comboflag');
    var panel = data.panel;
    var flag = data.flag;
    var datas = data.datas;
    var opts = data.options;

    $(document).unbind('click.comboflag').bind('click.comboflag', function(){
      panel.hide();
    })
    flag.unbind('click.comboflag').bind('click.comboflag', function(event){
      event.stopPropagation();
      generatePanel(target, datas);
      panel.show();
    });
    flag.next().unbind('click.comboflag').bind('click.comboflag', function(event){
      event.stopPropagation();
      generatePanel(target, datas);
      panel.show();
    });
    $(target).unbind('focus.comboflag').bind('focus.comboflag', function(event){
      event.stopPropagation();
      generatePanel(target, datas);
      panel.show();
    });

    panel.unbind('click.comboflag').bind('click.comboflag', function(event){
      select(target, $(event.target));
      panel.hide();
    });

    $(target).unbind('keyup.comboflag').bind('keyup.comboflag', function(event){
      var keyCode = event.keyCode;
      //BackSpace space 字符
      if (keyCode == 8 || keyCode == 32 || keyCode >= 65 && keyCode <= 90 || keyCode >= 48 && keyCode <= 57 ){
        clearTimeout(opts.timeouter);
//        if($(target).val().length<opts.charSizeSearch) { panel.hide();return; };
        doSearch(target, $(target).val());
      }
      // up
      else if(keyCode == 38){selectPre(target);}
      // down
      else if(keyCode == 40){selectNext(target)}
      // enter
      else if(keyCode == 13){selectCurr(target);}
    });
    $(target).unbind('focus.comboflag').bind('focus.comboflag', function(){
      flag.trigger('click');
    });
    $(target).unbind('click.comboflag').bind('click.comboflag', function(event){
      event.stopPropagation();
    });
  }

  function selectPre(target){
    var d  = $.data(target, 'comboflag');
    var panel = d.panel;
    var opts  = d.options;
    if(panel.is(":hidden")) panel.show();

    var selected = panel.find('.flag-item-selected');
    var oldItem ;
    var newItem ;
    if(selected.length!=0){
      oldItem = selected;
      newItem = oldItem.prev();
      if(newItem.length == 0)
        newItem = panel.children().last();
    }else{
      newItem = panel.children().last();
    }
    if(newItem){
      newItem.addClass('flag-item-selected');
    }
    if(oldItem){
      oldItem.removeClass('flag-item-selected');
    }
//    //特殊化属性  国家缩写
//    var attr = newItem.attr('data-main-attr');
//    if(attr){
//      setValue(target, newItem.attr('value'), newItem.attr('text'), {"data-main-attr": attr});
//    }else
//      setValue(target, newItem.attr('value'), newItem.attr('text'));
  }
  function selectNext(target){
    var d  = $.data(target, 'comboflag');
    var panel = d.panel;
    var opts  = d.options;
    if(panel.is(":hidden")) panel.show();

    var selected = panel.find('.flag-item-selected');
    var oldItem ;
    var newItem ;
    if(selected.length!=0){
      oldItem = selected;
      newItem = oldItem.next();
      if(newItem.length == 0)
        newItem = panel.children().first();
    }else{
      newItem = panel.children().first();
    }
    if(newItem){
      newItem.addClass('flag-item-selected');
    }
    if(oldItem){
      oldItem.removeClass('flag-item-selected');
    }
//    //特殊化属性  国家缩写
//    var attr = newItem.attr('data-main-attr');
//    if(attr){
//      setValue(target, newItem.attr('value'), newItem.attr('text'), {"data-main-attr": attr});
//    }else
//      setValue(target, newItem.attr('value'), newItem.attr('text'));
  }
  function selectCurr(target){
    var d  = $.data(target, 'comboflag');
    var panel = d.panel;
    if(panel.is(":hidden")) panel.show();

    var selected = panel.find('.flag-item-selected');
    if(selected.length!=0){
      _setValue(target, selected.attr('data-id'), selected.attr('data-y'));
    }
    panel.hide();
  }

  function reloadPanel(target, datas){
    var data  = $.data(target, 'comboflag');
    var panel = data.panel;
    generatePanel(target, datas);
    panel.show();
  }

  function select(target, item){
    var data  = $.data(target, 'comboflag');
    var panel = data.panel;
    var flag = data.flag;

    if(!item.hasClass('flag-panel-item'))
      item = item.parent();

    _setValue(target, item.attr('data-id'), item.attr('data-y'))
    item.addClass('flag-item-selected');
  }

  function doSearch(target, val){
    var data  = $.data(target, 'comboflag');
    var opts = data.options;
    var allDatas = data.datas;

    opts.timeouter = setTimeout(function () {

      var newDatas = [];
      if(val == ''){
        newDatas = allDatas;
      }else{
        for(var i=0; i<allDatas.length; i++){
          if(allDatas[i].areacode.toString().indexOf(val.replace('+', ''))>-1)
            newDatas.push(allDatas[i]);
        }
      }
      reloadPanel(target, newDatas);
    }, opts.searchTimeout);

  }

  function loadData(target){
    var data  = $.data(target, 'comboflag');
    var opts = data.options;
    $.ajax({
      url: opts.url,
      type: 'POST',
      dataType: 'json',
      async: false,
      contentType:'application/x-www-form-urlencoded;charset="utf-8"',
      success:function (d) {
        data.datas = d;
        _setDefault(target);
      },
      error:function (xhr, status, error) {}
    });
  }

  function parseOptions(target){
    return {};
  }

  function _setValue(target, countrycode, y){
    var data  = $.data(target, 'comboflag');
    var panel = data.panel;
    var flag = data.flag;
    var areacode;

//    if(!y){
//      var aa = panel.find('div[data-id='+countrycode+']');
//      y = aa.attr('data-y');
//      areacode = aa.attr('data-value');
//    }
//    if(!y){
      for(var j=0;j<data.datas.length; j++){
        if(data.datas[j].countrycode == countrycode){
          y = data.datas[j].axisy;
          areacode = data.datas[j].areacode;
          break;
        }
      }
//    }
    $(target).val('+'+areacode);
    $(target).attr('data-id', countrycode);
    flag.css('background-position', '0 '+y+'px');
    data.options.onSelect.call(target, countrycode);
  }
  function setValue(target, countrycode, y){
    var data  = $.data(target, 'comboflag');
    var panel = data.panel;
    var flag = data.flag;
    var areacode;

//    if(!y){
//      var aa = panel.find('div[data-id='+countrycode+']');
//      y = aa.attr('data-y');
//      areacode = aa.attr('data-value');
//    }
//    if(!y){
      for(var j=0;j<data.datas.length; j++){
        if(data.datas[j].countrycode == countrycode){
          y = data.datas[j].axisy;
          areacode = data.datas[j].areacode;
          break;
        }
      }
//    }
    $(target).val('+'+areacode);
    $(target).attr('data-id', countrycode);
    flag.css('background-position', '0 '+y+'px');
  }

  function _setDefault(target){
    var data  = $.data(target, 'comboflag');
    var d = data.datas;
    var flag = data.flag;
    var v = $(target).val();
    for(var i=0; i< d.length; i++){
      if(v.replace('+','') == d[i].countrycode){
        flag.css('background-position', '0 '+d[i].axisy+'px');
        $(target).val('+'+(d[i].areacode.replace('+', '')));
        break;
      }
    }

  }

  function getValue(target){
//    return $(target).val().replace('+', '');
    return $(target).attr('data-id');
  }

  $.fn.comboflag = function(options, param){
    if(typeof options === 'string'){
      var m = $.fn.comboflag.methods[options];
      if(m){
        return m(this, param)
      }
    }

    return this.each(function(){
      var state = $.data(this, 'comboflag');
      if(state){
//        $.extend(state.options, options);
      }else{
        create(this, options);
        loadData(this);
      }
      bindEvents(this);
    });
  }

  $.fn.comboflag.methods = {
    setValue: function(jq, param){
      return jq.each(function(){
        setValue(this, param);
      });
    },
    getValue: function(jq, param){
      return getValue(jq[0]);
    }
  }

  $.fn.comboflag.defaults = {
    url: 'flag.json',
    width:80,
    heith: 27,
    charSizeSearch: 1,
    searchTimeout: 300,
    onSelect: function(countrycode){}
  }
})(jQuery);