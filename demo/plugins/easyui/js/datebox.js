/**
 * datebox - jQuery EasyUI
 *
 * Licensed under the GPL:
 *   http://www.gnu.org/licenses/gpl.txt
 *
 * Copyright 2010 stworthy [ stworthy@gmail.com ]
 *
 *
 生成该组件
 $('#dd').datebox({
    range: true       //区域选择
  });
 获取值
 $('#dd').datebox('getValue')
 *
 *
 * Dependencies:
 *   calendar
 *   combo
 *
 *
 */
(function ($) {
  /**
   * create date box
   */
  function createBox(target) {
    var state = $.data(target, 'datebox');
    var opts = state.options;
    if(typeof opts.startIndex === 'string'){
      var statIndex = opts.getDateFromStr(opts.startIndex);
    }else{
      var statIndex = opts.startIndex;
    }

    if(opts.fromEl){
      var startIndex = $('#'+opts.fromEl).datebox('getDate');
    }
    if(opts.range){
      $(target).combo($.extend({}, opts, {
        onShowPanel: function () {
          state.calendar.calendar('resize');
//				opts.onShowPanel.call(target);
        },
        panelWidth: opts.panelWidth*2+2
      }));
    }else{
      $(target).combo($.extend({}, opts, {
        onShowPanel: function () {
          state.calendar.calendar('resize');
//				opts.onShowPanel.call(target);
        }
      }));
    }
    $(target).combo('textbox').parent().addClass('eui-datebox');

    /**
     * if the calendar isn't created, create it.
     */
    if (!state.calendar) {
      createCalendar(opts.range);
    }

    if(opts.currentDate){
      setDate(target, opts.currentDate);
    }
    function createCalendar(range) {
      var panel = $(target).combo('panel');
      opts.zIndex ? panel.css('z-index', opts.zIndex) : 0;
      state.calendar = $('<div></div>').appendTo(panel).wrap('<div class="eui-datebox-calendar-inner"></div>');
      if(range){
        state.calendar2 = $('<div></div>').appendTo(panel).wrap('<div class="eui-datebox-calendar-inner"></div>');
      }


      var aa = new Date();
      var bb = new Date(aa);
      bb.setMonth(aa.getMonth()+1);

      //不是区域选择
      if(!opts.range){

        state.calendar.calendar({
          fit: false,
          border: false,
          startIndex: statIndex,
          onSelect: function (date) {
            var value = opts.formatter(date);
            setValue(target, value);
            $(target).combo('hidePanel');
            opts.onSelect.call(target, date);
          }
        });
      }
      else {
        state.calendar.calendar({
          fit: false,
          border: false,
          current: aa,
          nextMonthBtn: false,
          parentEl: target,//input元素，用于查start,end
          onPrevMonth: function(){
            state.calendar2.calendar('prevMonth');
          },
          onSelect: function (date) {

            var startDate = opts.startDate;
            var endDate = opts.endDate;
            var current = date.getTime();
            var start, end;

            if(startDate && endDate){
              start = date;
              end = undefined;
            }
            else if(startDate){
              if(current<startDate){
                start = date;
                end = startDate;
              }else{
                start = startDate;
                end = date;
              }
            }else{
              start = date;
              end = undefined;
            }
            opts.startDate = start;
            opts.endDate = end;

            if (start && end) {
              var startValue = opts.formatter(start);
              var endValue = opts.formatter(end);
              state.calendar2.calendar('selectRange');
              state.calendar.calendar('selectRange', start, end);
              state.calendar2.calendar('selectRange', start, end);
              setValue(target, startValue + '-' + endValue);
              $(target).combo('hidePanel');
              opts.onSetValue.call(target, startValue + '-' + endValue);
            }else{
              state.calendar2.calendar('selectRange');
            }
          }
        });

        state.calendar2.calendar({
          selectedToday: false,//是否选择中当天
          fit: false,
          border: false,
          current: bb,
          prevMonthBtn: false,
          parentEl: target,//input元素，用于查start,end
          onNextMonth: function(){
            state.calendar.calendar('nextMonth');
          },
          onSelect: function (date) {
            var startDate = opts.startDate;
//            var start = startDate.getTime();
            var endDate = opts.endDate;
//            var end = endDate.getTime();
            var current = date.getTime();
            var start, end;

            if(startDate && endDate){
              start = date;
              end = undefined;
            }
            else if(startDate){
              if(current<startDate){
                start = date;
                end = startDate;
              }else{
                start = startDate;
                end = date;
              }
            }else{
              start = date;
              end = undefined;
            }

            opts.startDate = start;
            opts.endDate = end;

            if (start && end) {
              var startValue = opts.formatter(start);
              var endValue = opts.formatter(end);
              setValue(target, startValue + '-' + endValue);
              state.calendar.calendar('selectRange');
              state.calendar.calendar('selectRange', start, end);
              state.calendar2.calendar('selectRange', start, end);
              $(target).combo('hidePanel');
              opts.onSetValue.call(target, startValue + '-' + endValue);
            }else{
              state.calendar.calendar('selectRange');
            }
//            var value = opts.formatter(date);
//            opts.endValue = value
//            setValue(target, opts.startValue+'-'+value);
//            $(target).combo('hidePanel');
//            opts.onSelect.call(target, date);
          }
        });
      }
      setValue(target, opts.value);

//			var button = $('<div class="eui-datebox-button"></div>').appendTo(panel);
//			$('<a href="javascript:void(0)" class="eui-datebox-current"></a>').html(opts.currentText).appendTo(button);
//			$('<a href="javascript:void(0)" class="eui-datebox-close"></a>').html(opts.closeText).appendTo(button);
//			button.find('.eui-datebox-current,.eui-datebox-close').hover(
//					function(){$(this).addClass('eui-datebox-button-hover');},
//					function(){$(this).removeClass('eui-datebox-button-hover');}
//			);
//			button.find('.eui-datebox-current').click(function(){
//				state.calendar.calendar({
//					year:new Date().getFullYear(),
//					month:new Date().getMonth()+1,
//					current:new Date()
//				});
//			});
//			button.find('.eui-datebox-close').click(function(){
//				$(target).combo('hidePanel');
//			});
    }
  }

  /**
   * called when user inputs some value in text box
   */
  function doQuery(target, q) {
    setValue(target, q);
  }

  /**
   * called when user press enter key
   */
  function doEnter(target) {
    var opts = $.data(target, 'datebox').options;
    var c = $.data(target, 'datebox').calendar;
    var value = opts.formatter(c.calendar('options').current);
    setValue(target, value);
    $(target).combo('hidePanel');
  }

  function setValue(target, value) {
    var state = $.data(target, 'datebox');
    var opts = state.options;
    if(!opts.range){
      opts.date = opts.parser(value);
    }
    $(target).combo('setValue', value).combo('setText', value);
    if(opts.range) return ;
      state.calendar.calendar('moveTo', opts.parser(value));

  }

  function setDate(target, date) {
    var state = $.data(target, 'datebox');
    var opts = state.options;
    opts.date = date;
    var value;
    try{
      value = opts.formatter(date);
      setValue(target, value);
    }catch(ex){
      $(target).combo('setText', date);
    }
    $(target).combo('hidePanel');
    opts.onSelect.call(target, date);
  }

  /**
   * 不执行回调函数
   * @param target
   * @param date
   */
  function setDate2(target, date) {
    var state = $.data(target, 'datebox');
    var opts = state.options;
    opts.date = date;
    var value;
    try{
      value = opts.formatter(date);
      setValue(target, value);
    }catch(ex){
      $(target).combo('setText', date);
    }
    $(target).combo('hidePanel');
//    opts.onSelect.call(target, date);
  }

  function getDate(target) {
    var state = $.data(target, 'datebox');
    var retDate;
    retDate = new Date(state.options.date);
    var retVal = retDate.getTime();
    if(retVal)
      return retDate;
    else
      return  state.options.date;
  }

  function borderRed(target){
    $(target).combo('borderRed');
  }

  $.fn.datebox = function (options, param) {
    if (typeof options == 'string') {
      var method = $.fn.datebox.methods[options];
      if (method) {
        return method(this, param);
      } else {
        return this.combo(options, param);
      }
    }

    options = options || {};
    return this.each(function () {
      var state = $.data(this, 'datebox');
      if (state) {
        $.extend(state.options, options);
      } else {
        $.data(this, 'datebox', {
          options: $.extend({}, $.fn.datebox.defaults, $.fn.datebox.parseOptions(this), options)
        });
      }
      createBox(this);
    });
  };

  $.fn.datebox.methods = {
    options: function (jq) {
      return $.data(jq[0], 'datebox').options;
    },
    calendar: function (jq) {	// get the calendar object
      return $.data(jq[0], 'datebox').calendar;
    },
    setValue: function (jq, value) {
      return jq.each(function () {
        setValue(this, value);
      });
    },
    setDate: function (jq, value) {
      return jq.each(function () {
        setDate(this, value);
      });
    },
    setDate2: function (jq, value) {
      return jq.each(function () {
        setDate2(this, value);
      });
    },
    setDateNoCall: function (jq, value) {
      return jq.each(function () {
        setDate2(this, value);
      });
    },
    getDate: function (jq) {
//      return jq.each(function(){
      return getDate(jq[0]);
//      });
    },
    borderRed: function(jq){
      borderRed(jq[0]);
    }
  };

  $.fn.datebox.parseOptions = function (target) {
    var t = $(target);
    return $.extend({}, $.fn.combo.methods.parseOptions(t), {
    });
  };

  $.fn.datebox.defaults = $.extend({}, $.fn.combo.defaults, {
    panelWidth: 180,
    panelHeight: 'auto',
    keyHandler: {
      up: function () {
      },
      down: function () {
      },
      enter: function () {
        doEnter(this);
      },
      query: function (q) {
        doQuery(this, q);
      }
    },
    currentText: 'Today',
//    currentDate: new Date(),
    //TODO
    closeText: 'Ok',
    okText: 'Ok',
//    startIndex: '4/24/2013',
//    fromEl: '',
//    toEl: '',
    range: false,
//    zIndex: 100,

    formatter: function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      return m + '/' + d + '/' + y;
    },
    getDateFromStr: function (dateStr) {
//      dateStr = '4/24/2013'
      var mmddyy = dateStr.split('/');
      if(mmddyy.length !== 3)
        throw new Error('dateStr formatter error! ');
      var d = new Date();
      d.setFullYear(mmddyy[2])
      d.setMonth(mmddyy[0]-1)
      d.setDate(mmddyy[1])
      return d;
    },
    parser: function (s) {
      var t = Date.parse(s);
      if (!isNaN(t)) {
        return new Date(t);
      } else {
        return new Date();
      }
    },
    onSelect: function (date) {
    },
    onSetValue: function (date) {
    }
  });
})(jQuery);
