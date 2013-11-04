/**
 * calendar - jQuery EasyUI
 *
 * Licensed under the GPL:
 *   http://www.gnu.org/licenses/gpl.txt
 *
 * Copyright 2010 stworthy [ stworthy@gmail.com ]
 *
 */
(function ($) {

  function setSize(target) {
    var opts = $.data(target, 'calendar').options;
    var t = $(target);
    if (opts.fit == true) {
      var p = t.parent();
      opts.width = p.width();
      opts.height = p.height();
    }
    var header = t.find('.eui-calendar-header');
    if ($.support.boxModel == true) {
      t.width(opts.width - (t.outerWidth() - t.width()));
      t.height(opts.height - (t.outerHeight() - t.height()));
    } else {
      t.width(opts.width);
      t.height(opts.height);
    }
    var body = t.find('.eui-calendar-body');
    var height = t.height() - header.outerHeight();
    if ($.support.boxModel == true) {
      body.height(height - (body.outerHeight() - body.height()));
    } else {
      body.height(height);
    }

  }

  function init(target) {

    var opts = $.data(target, 'calendar').options;

    $(target).addClass('eui-calendar').wrapInner(
        '<div class="eui-calendar-header">' +
            '<div class="eui-calendar-prevmonth"></div>' +
            '<div class="eui-calendar-nextmonth"></div>' +
//					'<div class="eui-calendar-prevyear"></div>' +
//					'<div class="eui-calendar-nextyear"></div>' +
            '<div class="eui-calendar-title">' +
            '<span>Aprial 2010</span>' +
            '</div>' +
            '</div>' +
            '<div class="eui-calendar-body">' +
            '<div class="eui-calendar-menu">' +
            '<div class="eui-calendar-menu-year-inner">' +
            '<span class="eui-calendar-menu-prev"></span>' +
            '<span><input class="eui-calendar-menu-year" type="text"/></span>' +
            '<span class="eui-calendar-menu-next"></span>' +
            '</div>' +
            '<div class="eui-calendar-menu-month-inner" style="height: 65%">' +
            '</div>' +
            '</div>' +
            '</div>'
    );

    $(target).find('.eui-calendar-title span').hover(
        function () {
          $(this).addClass('eui-calendar-menu-hover');
        },
        function () {
          $(this).removeClass('eui-calendar-menu-hover');
        }
    ).click(function () {
          event.stopPropagation();
          var menu = $(target).find('.eui-calendar-menu');
          if (menu.is(':visible')) {
            menu.hide();
          } else {
            showSelectMenus(target);
          }
        });

    $('.eui-calendar-prevmonth,.eui-calendar-nextmonth,.eui-calendar-prevyear,.eui-calendar-nextyear', target).hover(
        function () {
          $(this).addClass('eui-calendar-nav-hover');
        },
        function () {
          $(this).removeClass('eui-calendar-nav-hover');
        }
    );
    $(target).find('.eui-calendar-nextmonth').click(function () {
      showMonth(target, 1);
      opts.onNextMonth.call(target);
    });
    $(target).find('.eui-calendar-prevmonth').click(function () {
      showMonth(target, -1);
      opts.onPrevMonth.call(target);
    });
    $(target).find('.eui-calendar-nextyear').click(function () {
      showYear(target, 1);
    });
    $(target).find('.eui-calendar-prevyear').click(function () {
      showYear(target, -1);
    });

    $(target).bind('_resize', function () {
      var opts = $.data(target, 'calendar').options;
      if (opts.fit == true) {
        setSize(target);
      }
      return false;
    });
  }

  /**
   * show the calendar corresponding to the current month.
   */
  function showMonth(target, delta) {
    var opts = $.data(target, 'calendar').options;
    var start, end;
    if(opts.parentEl){
      start = $.data(opts.parentEl, 'datebox').options.startDate;
      end = $.data(opts.parentEl, 'datebox').options.endDate;
    }

    opts.month += delta;
    if (opts.month > 12) {
      opts.year++;
      opts.month = 1;
    } else if (opts.month < 1) {
      opts.year--;
      opts.month = 12;
    }
    show(target, true);

    var menu = $(target).find('.eui-calendar-menu-month-inner');
    menu.find('td.eui-calendar-selected').removeClass('eui-calendar-selected');
    menu.find('td:eq(' + (opts.month - 1) + ')').addClass('eui-calendar-selected');
  }

  /**
   * show the calendar corresponding to the current year.
   */
  function showYear(target, delta) {
    var opts = $.data(target, 'calendar').options;
    opts.year += delta;
    show(target);

    var menu = $(target).find('.eui-calendar-menu-year');
    menu.val(opts.year);
  }

  /**
   * show the select menu that can change year or month, if the menu is not be created then create it.
   */
  function showSelectMenus(target) {
    var opts = $.data(target, 'calendar').options;
    $(target).find('.eui-calendar-menu').show();

    if ($(target).find('.eui-calendar-menu-month-inner').is(':empty')) {
      $(target).find('.eui-calendar-menu-month-inner').empty();
      var t = $('<table></table>').appendTo($(target).find('.eui-calendar-menu-month-inner'));
      var idx = 0;
      for (var i = 0; i < 3; i++) {
        var tr = $('<tr></tr>').appendTo(t);
        for (var j = 0; j < 4; j++) {
          $('<td class="eui-calendar-menu-month"></td>').html(opts.months[idx++]).attr('abbr', idx).appendTo(tr);
        }
      }

      $(target).find('.eui-calendar-menu-prev,.eui-calendar-menu-next').hover(
          function () {
            $(this).addClass('eui-calendar-menu-hover');
          },
          function () {
            $(this).removeClass('eui-calendar-menu-hover');
          }
      );
      $(target).find('.eui-calendar-menu-next').click(function () {
        var y = $(target).find('.eui-calendar-menu-year');
        if (!isNaN(y.val())) {
          y.val(parseInt(y.val()) + 1);
        }
      });
      $(target).find('.eui-calendar-menu-prev').click(function () {
        var y = $(target).find('.eui-calendar-menu-year');
        if (!isNaN(y.val())) {
          y.val(parseInt(y.val() - 1));
        }
      });

      $(target).find('.eui-calendar-menu-year').keypress(function (e) {
        if (e.keyCode == 13) {
          setDate();
        }
      });

      $(target).find('.eui-calendar-menu-month').hover(
          function () {
            $(this).addClass('eui-calendar-menu-hover');
          },
          function () {
            $(this).removeClass('eui-calendar-menu-hover');
          }
      ).click(function (event) {
            var menu = $(target).find('.eui-calendar-menu');
            menu.find('.eui-calendar-selected').removeClass('eui-calendar-selected');
            $(this).addClass('eui-calendar-selected');
            setDate();
          });
    }

    function setDate() {
      var menu = $(target).find('.eui-calendar-menu');
      var year = menu.find('.eui-calendar-menu-year').val();
      var month = menu.find('.eui-calendar-selected').attr('abbr');
      if (!isNaN(year)) {
        opts.year = parseInt(year);
        opts.month = parseInt(month);
        show(target);
      }
      menu.hide();
    }

    var body = $(target).find('.eui-calendar-body');
    var sele = $(target).find('.eui-calendar-menu');
    var seleYear = sele.find('.eui-calendar-menu-year-inner');
    var seleMonth = sele.find('.eui-calendar-menu-month-inner');

//    seleYear.find('input').val(opts.year).focus();
    seleYear.find('input').val(opts.year);
    seleMonth.find('td.eui-calendar-selected').removeClass('eui-calendar-selected');
    seleMonth.find('td:eq(' + (opts.month - 1) + ')').addClass('eui-calendar-selected');

    if ($.support.boxModel == true) {
//      sele.width(body.outerWidth() - (sele.outerWidth() - sele.width()));
//      sele.height(body.outerHeight() - (sele.outerHeight() - sele.height()));
//      seleMonth.height(sele.height() - (seleMonth.outerHeight() - seleMonth.height()) - seleYear.outerHeight());
//      sele.width($(target).outerWidth() - (sele.outerWidth() - sele.width()));
//      sele.height($(target).outerHeight() - (sele.outerHeight() - sele.height()));
//      seleMonth.height(sele.height() - (seleMonth.outerHeight() - seleMonth.height()) - seleYear.outerHeight());
    } else {
      sele.width(body.outerWidth());
      sele.height(body.outerHeight());
      seleMonth.height(sele.height() - seleYear.outerHeight());
    }
  }

  /**
   * get weeks data.
   */
  function getWeeks(year, month, startDateIndex) {
    var startDateIndexInC; //1 在当前 2 大于当前日期
    var dates = [];
    var beginDate = new Date(year, month, 0);
    var lastDay = beginDate.getDate();
    beginDate.setDate(1);
    var endDate = (new Date(beginDate.getTime()));
    endDate.setDate(lastDay);
    if(startDateIndex)
      var startDay = startDateIndex.getDate()

    if(startDateIndex && startDateIndex.getTime()>beginDate.getTime() && startDateIndex.getTime()<endDate.getTime()){
      var startDateIndexInC = 1;
      for (var i = 1; i <= lastDay; i++){
        if(i<startDay)
          dates.push([year, month, i, true]);
        else
          dates.push([year, month, i]);
      }
    }
    else if(startDateIndex && startDateIndex.getTime()>endDate.getTime()){
      var startDateIndexInC = 2;
      for (var i = 1; i <= lastDay; i++){
        dates.push([year, month, i, true]);
      }
    }
    else{
      for (var i = 1; i <= lastDay; i++) dates.push([year, month, i]);
    }


    // group date by week
    var weeks = [], week = [];
    while (dates.length > 0) {
      var date = dates.shift();
      week.push(date);
      if (new Date(date[0], date[1] - 1, date[2]).getDay() == 6) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length) {
      weeks.push(week);
    }

    var firstWeek = weeks[0];
    if (firstWeek.length < 7) {
      while (firstWeek.length < 7) {
        var firstDate = firstWeek[0];
        var date = new Date(firstDate[0], firstDate[1] - 1, firstDate[2] - 1)
        if(startDateIndexInC == 1 || startDateIndexInC == 2){
          firstWeek.unshift([date.getFullYear(), date.getMonth() + 1, date.getDate(), true]);
        }else{
          firstWeek.unshift([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
        }

      }
    } else {
      var firstDate = firstWeek[0];
      var week = [];
      for (var i = 1; i <= 7; i++) {
        var date = new Date(firstDate[0], firstDate[1] - 1, firstDate[2] - i);
        if(startDateIndexInC === 1 || startDateIndexInC === 2){
          week.unshift([date.getFullYear(), date.getMonth() + 1, date.getDate(), true]);
        }else{
          week.unshift([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
        }

      }
      weeks.unshift(week);
    }

    var lastWeek = weeks[weeks.length - 1];
    while (lastWeek.length < 7) {
      var lastDate = lastWeek[lastWeek.length - 1];
      var date = new Date(lastDate[0], lastDate[1] - 1, lastDate[2] + 1);
      lastWeek.push([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
    }
    if (weeks.length < 6) {
      var lastDate = lastWeek[lastWeek.length - 1];
      var week = [];
      for (var i = 1; i <= 7; i++) {
        var date = new Date(lastDate[0], lastDate[1] - 1, lastDate[2] + i);
        week.push([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
      }
      weeks.push(week);
    }

    return weeks;
  }

  /**
   * show the calendar day.
   */
  function show(target, nextControl) {
    var opts = $.data(target, 'calendar').options;

    var start, end;
    if(opts.parentEl){
      start = $.data(opts.parentEl, 'datebox').options.startDate;
      end = $.data(opts.parentEl, 'datebox').options.endDate;
    }

    var startDateIndex = opts.startIndex;
    if(!opts.nextMonthBtn){
      $(target).find('.eui-calendar-nextmonth').hide();
    }
    if(!opts.prevMonthBtn){
      $(target).find('.eui-calendar-prevmonth').hide();
    }
    $(target).find('.eui-calendar-title span').html(opts.months[opts.month - 1] + ' ' + opts.year);

    var body = $(target).find('div.eui-calendar-body');
    body.find('>table').remove();

    var t = $('<table cellspacing="0" cellpadding="0" border="0"><thead></thead><tbody></tbody></table>').prependTo(body);
    var tr = $('<tr></tr>').appendTo(t.find('thead'));
    for (var i = 0; i < opts.weeks.length; i++) {
      tr.append('<th>' + opts.weeks[i] + '</th>');
    }
    // from to
    if (opts.from) {
      var fromDate = $('#' + opts.from).datebox('getValue');
    }
    if (opts.to) {
      var toDate = $('#' + opts.to).datebox('getValue');
    }
    var weeks = getWeeks(opts.year, opts.month, startDateIndex);
    for (var i = 0; i < weeks.length; i++) {
      var week = weeks[i];
      var tr = $('<tr></tr>').appendTo(t.find('tbody'));
      for (var j = 0; j < week.length; j++) {
        var day = week[j];
        var tempTd;
        if(day[3]){
          tempTd =$('<td class="eui-calendar-other-month eui-calendar-day-disable"></td>').attr('abbr', day[0] + ',' + day[1] + ',' + day[2]).html(day[2]).appendTo(tr);
        }else{
          tempTd = $('<td class="eui-calendar-day eui-calendar-other-month day-enable"></td>').attr('abbr', day[0] + ',' + day[1] + ',' + day[2]).html(day[2]).appendTo(tr);
        }
        var currentMs =new Date(day[0],day[1]-1,day[2]).getTime();
        if(start && end && start.getTime()<=currentMs && currentMs<=end.getTime()){
          tempTd.addClass('eui-calendar-selected');
        }

      }
    }
    t.find('td[abbr^="' + opts.year + ',' + opts.month + '"]').removeClass('eui-calendar-other-month');

    var now = new Date();
    var today = now.getFullYear() + ',' + (now.getMonth() + 1) + ',' + now.getDate();
    t.find('td[abbr="' + today + '"]').addClass('eui-calendar-today');

    if (opts.current && opts.selectedToday && !nextControl) {
      t.find('.eui-calendar-selected').removeClass('eui-calendar-selected');
      var current = opts.current.getFullYear() + ',' + (opts.current.getMonth() + 1) + ',' + opts.current.getDate();
      t.find('td[abbr="' + current + '"]').addClass('eui-calendar-selected');
    }

    t.find('tr').find('td:first').addClass('eui-calendar-sunday');
    t.find('tr').find('td:last').addClass('eui-calendar-saturday');

    t.find('td.day-enable').hover(
        function () {
          $(this).addClass('eui-calendar-hover');
        },
        function () {
          $(this).removeClass('eui-calendar-hover');
        }
    ).click(function () {
          if($(this).hasClass('eui-calendar-day-disable')) return ;
          t.find('.eui-calendar-selected').removeClass('eui-calendar-selected');
          $(this).addClass('eui-calendar-selected');
          var parts = $(this).attr('abbr').split(',');
          opts.current = new Date(parts[0], parseInt(parts[1]) - 1, parts[2]);
          opts.onSelect.call(target, opts.current);
        });
  }

  function selectRange(target, startDate, endDate) {

    var opts = $.data(target, 'calendar').options;
    var current = opts.current;
    var t = $(target).find('div.eui-calendar-body').find('>table');
    if(!startDate){
      t.find('.eui-calendar-selected').removeClass('eui-calendar-selected');
      return ;
    }

    var startM = startDate.getMonth()+1;
    var endM = endDate.getMonth()+1;
    var currentM = current.getMonth()+1;
    var selectedIds = [];//2013,4,3
    if(currentM == startM && currentM == endM){
      for(var i1= startDate.getDate(); i1<=endDate.getDate(); i1++){
        selectedIds.push(current.getFullYear()+','+currentM+','+i1);
      }
    }
    else if(currentM == startM){
      var allTds = t.find('td');
      var allindex = 0;
      for(var alli=0; alli<allTds.length; alli++){
        if($(allTds[alli]).attr('abbr') == current.getFullYear()+','+currentM+','+startDate.getDate()){
          allindex = alli;
          break ;
        }
      }
      for(var alli=allindex; alli<allTds.length; alli++){
        selectedIds.push($(allTds[alli]).attr('abbr'));
      }

    }
    else if(currentM == endM){
      var allTds = t.find('td');
      var allindex = 0;
      for(var alli=0; alli<allTds.length; alli++){
        if($(allTds[alli]).attr('abbr') == endDate.getFullYear()+','+endM+','+endDate.getDate()){
          allindex = alli;
          break ;
        }
      }
      for(var alli=0; alli<allindex; alli++){
        selectedIds.push($(allTds[alli]).attr('abbr'));
      }
    }


    for(var zz=0; zz<selectedIds.length; zz++){
      t.find('td[abbr="' + selectedIds[zz] + '"]').addClass('eui-calendar-selected');
    }
//    t.find('.eui-calendar-selected').removeClass('eui-calendar-selected');
//    var current = opts.current.getFullYear() + ',' + (opts.current.getMonth() + 1) + ',' + opts.current.getDate();
//    t.find('td[abbr="' + current + '"]').addClass('eui-calendar-selected');

  }

  function nextMonth(target){
    $(target).find('.eui-calendar-nextmonth').trigger('click');
  }

  function prevMonth(target){
    $(target).find('.eui-calendar-prevmonth').trigger('click');
  }

  $.fn.calendar = function (options, params,p2) {
    if (typeof options === 'string') {

      var method = $.fn.calendar.methods[options];
      if(method)
        method(this, params, p2);
      else
        return ;
      return ;
    }
    options = options || {};
    return this.each(function () {
      var state = $.data(this, 'calendar');
      if (state) {
        $.extend(state.options, options);
      } else {
//        init(this);
        var config;
        if (options.current)
          config = {
            year: options.current.getFullYear(),
            month: options.current.getMonth() + 1
          }
        else
          config = {
            year: $.fn.calendar.defaults.current.getFullYear(),
            month: $.fn.calendar.defaults.current.getMonth() + 1
          }


        state = $.data(this, 'calendar', {
          options: $.extend({}, $.fn.calendar.defaults, options, config)
        });
        init(this);
      }
      if (state.options.border == false) {
        $(this).addClass('eui-calendar-noborder');
      }
      setSize(this);
      show(this);
      $(this).find('div.eui-calendar-menu').hide();	// hide the calendar menu
    });
  };

  $.fn.calendar.methods = {
    selectRange: function (jq, startDate, endDate) {
      return jq.each(function () {
        selectRange(this, startDate, endDate);
      });
    },
    nextMonth: function(jq){
      return jq.each(function () {
        nextMonth(this);
      });
    },
    prevMonth: function(jq){
      return jq.each(function () {
        prevMonth(this);
      });
    }
  }

  $.fn.calendar.defaults = {
    width: 180,
    height: 180,
    fit: false,
    border: true,
    weeks: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    year: undefined,
    month: undefined,
    nextMonthBtn: true,
    prevMonthBtn: true,
//		year:new Date().getFullYear(),
//		month:new Date().getMonth()+1,
    current: new Date(),
    selectedToday: true,//是否选择中当天

    onSelect: function (date) {
    },
    selectLater: function () {

    },
    onNextMonth: function(){},
    onPrevMonth: function(){}
  };

})(jQuery);
