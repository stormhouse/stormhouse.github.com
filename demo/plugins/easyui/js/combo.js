/**
 * from jquery-easy-ui
 * http://www.jeasyui.com
 *
 * TODO 验证功能
 *
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 12-12-31
 * Time: 上午11:04
 * To change this template use File | Settings | File Templates.
 *
 * dependencies
 *  jquery.eui.panel
 */

(function($){

  function setSize(target, width){
    var opts = $.data(target, 'combo').options;
    var combo = $.data(target, 'combo').combo;
    var panel = $.data(target, 'combo').panel;

    if (width) opts.width = width;
    //TODO 自适应宽度
    if((''+opts.width).indexOf('%')>-1){
      $(target).next().width(opts.width);
      combo.find('input.eui-combo-text').css('width', '100%');
    }else{
      var ow = combo.find('input.eui-combo-text').outerWidth()
      var arrowWidth = combo.find('.eui-combo-arrow').outerWidth();
      if (isNaN(opts.width)){
  //      opts.width = combo.find('input.eui-combo-text').outerWidth()+arrowWidth;
        opts.width = combo.find('input.eui-combo-text').outerWidth();//+arrowWidth;
      }
  //    var width = opts.width - arrowWidth;
      var width = opts.width;
      combo.find('input.eui-combo-text').width(width);
    }
    panel.panel('resize', {
      width: (opts.panelWidth ? opts.panelWidth : combo.outerWidth()),
      height: opts.panelHeight
    });
  }

  function init(target, opts){
    $(target).hide();
    var name = $(target).attr('id');
    var span = $('<span class="eui-combo"></span>').insertAfter(target);
    var input = $('<input type="text" class="eui-combo-text" name="'+name +'" tabindex="'+opts.tabindex+'">').appendTo(span);
    if(opts.width)
      input.css('width',opts.width);
    for(var a in opts){
      if(typeof a == 'string' && a.indexOf('data-rule')>-1){
        input.attr(a, opts[a])
      }
    }
    $('<span><span class="eui-combo-arrow"></span></span>').appendTo(span);
    $('<input type="hidden" class="eui-combo-value">').appendTo(span);
    var panel = $('<div class="eui-combo-panel"></div>').appendTo('body');
    panel.css('overflow-y', 'auto')
    panel.css('overflow-x', 'hidden')
    panel.css('max-height', '250px')

    //input加属性
    if(opts && opts.required)
      input.attr('required', true);
    if(opts && opts.readOnly){
      input.attr('readonly', true);
    }
    if(opts && !opts.editable){
      input.attr('readonly', true);
    }

    panel.panel({
      doSize: false,
      closed:true,
      style:{
        position:'absolute'
      },
      onOpen:function(){
        $(this).panel('resize');
      }
    });

    //如果有name属性，替换为comboName
    var name = $(target).attr('name');
    if (name){
      span.find('input.eui-combo-value').attr('name', name);
      $(target).removeAttr('name').attr('comboName', name);
    }
//    input.attr('autocomplete', 'off');
    return {
      combo: span,
      panel: panel
    };
  }

  function destroy(target){
    $.data(target, 'combo').panel.panel('destroy');
    $.data(target, 'combo').combo.remove();
    $.data(target, 'combo', null);
    $(target).show();
  }

  function bindEvents(target){
    var opts = $.data(target, 'combo').options;
    var combo = $.data(target, 'combo').combo;
    var panel = $.data(target, 'combo').panel;
    var input = combo.find('.eui-combo-text');
    var arrow = combo.find('.eui-combo-arrow');

    $(document).unbind('.combo');
    input.unbind('.combo');
    panel.unbind('.combo');
    arrow.unbind('.combo');



    if (!opts.disabled){
      $(document).bind('mousedown.combo', function(e){
        $('div.eui-combo-panel').panel('close');
      })
      panel.bind('mousedown.combo', function(e){
        return false;
      });
      input.bind('focus.combo', function(e){
        input.css('border-color', '');
        opts.onArrowClick.call(target);
//        showPanel(target);
      }).bind('blur.combo', function(e){
          hidePanel(target);
          opts.onBlur.call(target, input.val());
      }).bind('mousedown.combo', function(e){
          e.stopPropagation();
      }).bind('keyup.combo', function(e){
          switch(e.keyCode){
            case 37:	// left
            case 38:	// up
              opts.selectPrev.call(target);
              break;
            case 39:	// right
            case 40:	// down
              opts.selectNext.call(target);
              break;
            case 13:	// enter
              opts.selectCurr.call(target);
              break;
            case 27:	// esc
              hidePanel(target);
              break;
            default:
              if (opts.editable){
                opts.filter.call(target, $(this).val());
              }
          }
          return false;
      });
      arrow.bind('click.combo', function(){
        input.focus();
        showPanel(target, true);
      }).bind('mouseenter.combo', function(){
          $(this).addClass('eui-combo-arrow-hover');
      }).bind('mouseleave.combo', function(){
        $(this).removeClass('eui-combo-arrow-hover');
      });


    }
  }

  //TODO计算panel的位置
  function showPanel(target, all){
    var panel = $.data(target, 'combo').panel;
    var combo = $.data(target, 'combo').combo;
    var options = $.data(target, 'combo').options
    var z = options.zIndex;

    //TODO
    if(all && $.data(target, 'combobox') && $.data(target, 'combobox').allPanelContent){
      panel.html($.data(target, 'combobox').allPanelContent);
      $.data(target, 'combobox').data = $.data(target, 'combobox').allPanelData;
      options.onBindAllItem.call(target, target);
    }

    if ($.fn.window){
      panel.panel('panel').css('z-index', $.fn.window.defaults.zIndex++);
    }else if(z){
      panel.panel('panel').css('z-index', z);
    }
    if(panel.panel("options").closed){
      panel.panel('open');
      options.onShowPanel.call(target);
    }
    panel.panel('resize', {
      width: (options.panelWidth ? options.panelWidth : combo.outerWidth()),
      height: options.panelHeight
    });
    //计算panel位置
    (function(){
      if (panel.is(':visible')){
        var top = combo.offset().top + combo.outerHeight();
        if (top + panel.outerHeight() > $(window).height() + $(document).scrollTop()){
          top = combo.offset().top - panel.outerHeight();
        }
        if (top < $(document).scrollTop()){
          top = combo.offset().top + combo.outerHeight();
        }
        //move
        var left;
        if(options.align == 'right'){
          left =combo.offset().left - panel.width()+combo.find('.eui-combo-text').width();
        }else{
          left = combo.offset().left;
        }

        panel.panel('move', {
          left:left,
          top:top
        });
        setTimeout(arguments.callee, 2000);
      }
    })();
  }

  function hidePanel(target){
    var panel = $.data(target, 'combo').panel;
//    panel.hide();
    panel.panel('close');
  }

  //TODO validate
  //function validate(){}

  function setDisabled(target, disabled){
    var opts = $.data(target, 'combo').options;
    var combo = $.data(target, 'combo').combo;
    if (disabled){
      opts.disabled = true;
      $(target).attr('disabled', true);
      combo.find('.eui-combo-value').attr('disabled', true);
      combo.find('.eui-combo-text').attr('disabled', true);
    } else {
      opts.disabled = false;
      $(target).removeAttr('disabled');
      combo.find('.eui-combo-value').removeAttr('disabled');
      combo.find('.eui-combo-text').removeAttr('disabled');
    }
  }

  function clear(target){

  }

  function getText(target){
    var combo = $.data(target, 'combo').combo;
    return combo.find('input.eui-combo-text').val();
  }

  function setText(target, text){
    var combo = $.data(target, 'combo').combo;
    combo.find('input.eui-combo-text').val(text);
  }

  function getValue(target){
    return getValues(target)[0];
  }

  function setValue(target, value){
    setValues(target, [value]);
  }

  function setValues(target, values){
    var opts = $.data(target, 'combo').options;
    var oldValues = getValues(target);

    var combo = $.data(target, 'combo').combo;
    combo.find('input.eui-combo-value').remove();
    var name = $(target).attr('comboName');
    for(var i=0; i<values.length; i++){
      var input = $('<input type="hidden" class="eui-combo-value">').appendTo(combo);
      if (name) input.attr('name', name);
      input.val(values[i]);
    }

    var tmp = [];
    for(var i=0; i<oldValues.length; i++){
      tmp[i] = oldValues[i];
    }
    var aa = [];
    for(var i=0; i<values.length; i++){
      for(var j=0; j<tmp.length; j++){
        if (values[i] == tmp[j]){
          aa.push(values[i]);
          tmp.splice(j, 1);
          break;
        }
      }
    }

    if (aa.length != values.length || values.length != oldValues.length){
      if (opts.multiple){
        opts.onChange.call(target, values, oldValues);
      } else {
        opts.onChange.call(target, values[0], oldValues[0]);
      }
    }
  }

  function getValues(target){
    var values = [];
    var combo = $.data(target, 'combo').combo;
    combo.find('input.eui-combo-value').each(function(){
      values.push($(this).val());
    });
    return values;
  }

  function borderRed(target){
    $(target).next().children().first().css('border-color', 'red');
  }

  /**
   * parse options from markup.
   * @param target
   * @return {Object}
   */
  function parseOptions(target){

    var t = $(target);
    var retObjt = {
      width: (parseInt(target.style.width) || undefined),
      panelWidth: (parseInt(t.attr('panelWidth')) || undefined),
      panelHeight: (t.attr('panelHeight')=='auto' ? 'auto' : parseInt(t.attr('panelHeight')) || undefined),
      separator: (t.attr('separator') || undefined),
      multiple: (t.attr('multiple') ? (t.attr('multiple') == 'true' || t.attr('multiple') == true) : undefined),
      editable: (t.attr('editable') ? t.attr('editable') == 'true' : undefined),
      disabled: (t.attr('disabled') ? true : undefined),
      required: (t.attr('required') ? (t.attr('required') == 'required' || t.attr('required') == 'true' || t.attr('required') == true) : undefined),
      missingMessage: (t.attr('missingMessage') || undefined),
      tabindex: (t.attr('tabindex') ? t.attr('tabindex') : undefined)
    };

    var attrs = $(target).get(0).attributes;
    for(var a in attrs){
      if(typeof attrs[a] == 'object'){
        if(attrs[a].name.indexOf('data-rule')>-1){
          retObjt[attrs[a].name] = attrs[a].value;
        }
      }
    }
    return retObjt;
  }

  $.fn.combo = function(options, params){

    if(typeof options === 'string'){
      return $.fn.combo.methods[options](this, params);
    }


    options = options || {}
    return this.each(function(){
      var state = $.data(this,'combo');
      if(state){
        $.extend(state.options, options);
      }else{
        var parseOpts = parseOptions(this);
        var opts = $.extend({}, $.fn.combo.defaults, parseOpts, options);
        var r = init(this, opts);
        state = $.data(this, 'combo', {
          options: opts,
          combo: r.combo,
          panel: r.panel
        });
      }
      setDisabled(this, state.options.disabled);
      setSize(this);
      bindEvents(this);
      //TODO validate
    });

  }

  $.fn.combo.methods = {
    parseOptions: function(jq){
      return parseOptions(jq[0]);
    },
    panel: function(jq){
      return $.data(jq[0], 'combo').panel;
    },
    resize: function(jq, width){
      return jq.each(function(){
        setSize(this, width);
      });
    },
    textbox: function(jq){
      return $.data(jq[0], 'combo').combo.find('input.eui-combo-text');
    },
    hidePanel: function(jq){
      return jq.each(function(){
        hidePanel(this);
      });
    },
    showPanel: function(jq, all){
      return jq.each(function(){
        showPanel(this, all);
      });
    },
    getValue: function(jq){
      return getValue(jq[0]);
    },
    setValue: function(jq, value){
      return jq.each(function(){
        setValue(this, value);
      });
    },
    getValues: function(jq){
      return getValues(jq[0]);
    },
    setValues: function(jq, values){
      return jq.each(function(){
        setValues(this, values);
      });
    },
    getText: function(jq){
      return getText(jq[0]);
    },
    setText: function(jq, text){
      return jq.each(function(){
        setText(this, text);
      });
    },
    enable: function(jq){
      return jq.each(function(){
        setDisabled(this, false);
        bindEvents(this);
      });
    },
    disable: function(jq){
      return jq.each(function(){
        setDisabled(this, true);
        bindEvents(this);
      });
    },
    destroy: function(jq){
      return jq.each(function(){
        destroy(this);
      });
    },
    /**
     * 禁用combo文本域
     * @param {Object} jq
     * @param {Object} param stopArrowFocus:是否阻止点击下拉按钮时foucs文本域
     * stoptype:禁用类型，包含disable和readOnly两种方式
     */
    disableTextbox : function(jq, param) {
      return jq.each(function() {
        param = param || {};
        var textbox = $(this).combo("textbox");
        var that = this;
        var panel = $(this).combo("panel");
        var data = $(this).data('combo');
        if (param.stopArrowFocus) {
          data.stopArrowFocus = param.stopArrowFocus;
          var arrowbox = $.data(this, 'combo').combo.find('span.combo-arrow');
          arrowbox.unbind('click.combo').bind('click.combo', function() {
            if (panel.is(":visible")) {
              $(that).combo('hidePanel');
            } else {
              $("div.combo-panel").panel("close");
              $(that).combo('showPanel');
            }
          });
          textbox.unbind('mousedown.mycombo').bind('mousedown.mycombo', function(e) {
            e.preventDefault();
          });
        }
        textbox.prop(param.stoptype?param.stoptype:'disabled', true);
        data.stoptype = param.stoptype?param.stoptype:'disabled';
      });
    },
    /**
     * 还原文本域
     * @param {Object} jq
     */
    enableTextbox : function(jq) {
      return jq.each(function() {
        var textbox = $(this).combo("textbox");
        var data = $(this).data('combo');
        if (data.stopArrowFocus) {
          var that = this;
          var panel = $(this).combo("panel");
          var arrowbox = $.data(this, 'combo').combo.find('span.combo-arrow');
          arrowbox.unbind('click.combo').bind('click.combo', function() {
            if (panel.is(":visible")) {
              $(that).combo('hidePanel');
            } else {
              $("div.combo-panel").panel("close");
              $(that).combo('showPanel');
            }
            textbox.focus();
          });
          textbox.unbind('mousedown.mycombo');
          data.stopArrowFocus = null;
        }
        textbox.prop(data.stoptype, false);
        data.stoptype = null;
      });
    },
    borderRed: function(jq){
      return jq.each(function() {
        borderRed(this);
      });
    }
  }

  $.fn.combo.defaults = {
    width: 'auto',
    panelWidth: null,
    panelHeight: 'auto',
    separator: ',',
    editable: true,
    disabled: false,
    required: false,

    selectPrev: function(){},
    selectNext: function(){},
    selectCurr: function(){},
    filter: function(value){},

    onShowPanel: function(){},

    onChange: function(newValue, oldValue){},
    onArrowClick: function(){},
    onBlur: function(value){}
  }

})(jQuery);