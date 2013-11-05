/**
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-3-23
 * Time: 下午12:52
 * To change this template use File | Settings | File Templates.
 *
 *  * dependencies
 *  jquery.eui.panel
 *  jquery.eui.combo
 */

(function($){

  function init(target, opts){
//    var opts = $.data(this,'frequency').options;
    var self = $(target)
    var i18nObj = $.fn.frequency.i18n[opts.locale];

    var second = $('<input>');
    var lastLabel = $('<label style="margin:0 0 0 5px;"></label>');
//    self.after(lastLabel).before(second);
    self.before(second);
//    self.before($('<label style="margin:0 5px 0 10px;">').html(i18nObj.freq+':'));
    self.before($('<label style="margin:0 5px 0 0;">').html(''));
    second.before($('<label style="margin:0 5px 0 10px;">').html(i18nObj.freqP+':'));

    opts.onArrowClick = function(){
      if(opts.startDatebox && opts.endDatebox){
        var sDate = $('#'+opts.startDatebox).datebox('getDate')
        var eDate = $('#'+opts.endDatebox).datebox('getDate')
        var sValue = $('#'+opts.startDatebox).datebox('getValue')
        var eValue = $('#'+opts.endDatebox).datebox('getValue')
        if(sValue !== '' && eValue !== ''){
          var offsetMS = eDate.getTime()-sDate.getTime();
          var offsetDay = offsetMS/(1000*60*60*24);
////          Hour
//          if(offsetDay<1){}
////          Day
//          else if(offsetDay<8){}
////          Week
//          else if(offsetDay<60){}
////          Month
//          else{}

          if(offsetDay<0){
            var panelContent = $('\
              <div class="eui-frequency-item eui-frequency-item-disable" value="hour">'+i18nObj.hour+'</div>\
              <div class="eui-frequency-item eui-frequency-item-disable" value="day">'+i18nObj.day+'</div>\
              <div class="eui-frequency-item eui-frequency-item-disable" value="week">'+i18nObj.week+'</div>\
              <div class="eui-frequency-item eui-frequency-item-disable" value="month">'+i18nObj.month+'</div>\
              ')
          }
//          Hour
          else if(offsetDay<opts.hourOfDay){
            var panelContent = $('\
              <div class="eui-frequency-item" value="hour">'+i18nObj.hour+'</div>\
              <div class="eui-frequency-item eui-frequency-item-disable" value="day">'+i18nObj.day+'</div>\
              <div class="eui-frequency-item eui-frequency-item-disable" value="week">'+i18nObj.week+'</div>\
              <div class="eui-frequency-item eui-frequency-item-disable" value="month">'+i18nObj.month+'</div>\
              ')
          }
//          Day
          else if(offsetDay<opts.dayOfDay){
            var panelContent = $('\
              <div class="eui-frequency-item" value="hour">'+i18nObj.hour+'</div>\
              <div class="eui-frequency-item" value="day">'+i18nObj.day+'</div>\
              <div class="eui-frequency-item eui-frequency-item-disable" value="week">'+i18nObj.week+'</div>\
              <div class="eui-frequency-item eui-frequency-item-disable" value="month">'+i18nObj.month+'</div>\
              ')
          }
//          Week
          else if(offsetDay<opts.weekOfDay){
            var panelContent = $('\
              <div class="eui-frequency-item" value="hour">'+i18nObj.hour+'</div>\
              <div class="eui-frequency-item" value="day">'+i18nObj.day+'</div>\
              <div class="eui-frequency-item" value="week">'+i18nObj.week+'</div>\
              <div class="eui-frequency-item eui-frequency-item-disable" value="month">'+i18nObj.month+'</div>\
              ')
          }
//          Month
          else{
            var panelContent = $('\
              <div class="eui-frequency-item" value="hour">'+i18nObj.hour+'</div>\
              <div class="eui-frequency-item" value="day">'+i18nObj.day+'</div>\
              <div class="eui-frequency-item" value="week">'+i18nObj.week+'</div>\
              <div class="eui-frequency-item" value="month">'+i18nObj.month+'</div>\
              ')
          }

          panel.html(panelContent);
        }
        else{
          var panelContent = $('\
              <div class="eui-frequency-item eui-frequency-item-disable" value="hour">'+i18nObj.hour+'</div>\
              <div class="eui-frequency-item eui-frequency-item-disable" value="day">'+i18nObj.day+'</div>\
              <div class="eui-frequency-item eui-frequency-item-disable" value="week">'+i18nObj.week+'</div>\
              <div class="eui-frequency-item eui-frequency-item-disable" value="month">'+i18nObj.month+'</div>\
              ')
          panel.html(panelContent);
        }
      }
      if(opts.grq){
        panel.children().eq(0).remove()
      }
//      combo1.combo('setValue', '')
//      combo1.combo('setText', '')
    }
    var combo = self.combo(opts);
    var combo1 = second.combo({
      width: 50,
      readOnly: opts.readOnly
    });
    var panel1 = $.data(second.get(0), 'combo').panel;
    var comboData = $.data(target, 'combo');

    panel1.html(getPanel1Content(opts.dayFP))

    var panel = comboData.panel;


    var panelContent = $('\
    <div class="eui-frequency-item" value="hour">'+i18nObj.hour+'</div>\
    <div class="eui-frequency-item" value="day">'+i18nObj.day+'</div>\
    <div class="eui-frequency-item" value="week">'+i18nObj.week+'</div>\
    <div class="eui-frequency-item" value="month">'+i18nObj.month+'</div>\
    ')
    panel.append(panelContent);

//    var panel1Content = $('\
//    <div class="eui-frequency-item" value="1">1</div>\
//    <div class="eui-frequency-item" value="2">2</div>\
//    <div class="eui-frequency-item" value="3">3</div>\
//    ');
//    panel1.append(panel1Content);



    var weekPanel = $('\
      <div><ul>\
      <li value="1">'+i18nObj.weeks[1]+'</li>\
      <li value="2">'+i18nObj.weeks[2]+'</li>\
      <li value="3">'+i18nObj.weeks[3]+'</li>\
      <li value="4">'+i18nObj.weeks[4]+'</li>\
      <li value="5">'+i18nObj.weeks[5]+'</li>\
      <li value="6">'+i18nObj.weeks[6]+'</li>\
      <li value="0">'+i18nObj.weeks[7]+'</li>\
      </ul>\
      <div style="text-align:center;margin-bottom: 5px;"><button class="frequency-btn">'+i18nObj.ok+'</button></div>\
      </div>\
      ');
    weekPanel.appendTo('body');
    weekPanel.panel({
      doSize: true,
      closed:true,
      style:{
        position:'absolute'
      }
    });

//    var monthPanel = $('\
//      <div><ul>\
//      <li>1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6</li><li>7</li><li>8</li><li>9</li><li>10</li>\
//      <li>11</li><li>12</li><li>13</li><li>14</li><li>15</li><li>16</li><li>17</li><li>18</li><li>19</li><li>20</li>\
//      <li>21</li><li>22</li><li>23</li><li>24</li><li>25</li><li>26</li><li>27</li><li>28</li><li>29</li><li>30</li><li>31</li>\
//      </ul>\
//      <div style="text-align:center;margin-bottom: 5px;"><button class="frequency-btn">OK</button></div>\
//      </div>\
//      ');
    var monthPanel = $('\
      <div class="month-panel"><table>\
      <tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td></tr>\
      <tr><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td></tr>\
      <tr><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td></tr>\
      <tr><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td></tr>\
      <tr><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td></tr>\
      <tr><td>31</td></tr>\
      </table>\
      <div style="text-align:center;margin-bottom: 5px;"><button class="frequency-btn">OK</button></div>\
      </div>\
      ');
    monthPanel.appendTo('body');
    monthPanel.panel({
      doSize: true,
      closed:true,
      style:{
        position:'absolute'
      }
    });
    if(opts.zIndex){
      panel.css('z-index', opts.zIndex);
      panel1.panel('panel').css('z-index', opts.zIndex);
      monthPanel.panel('panel').css('z-index', opts.zIndex);
      weekPanel.panel('panel').css('z-index', opts.zIndex);

    }

    $.data(target, 'frequency',{
      options: opts,
      second: second,
      panel: panel,
      panel1: panel1,
      weekPanel: weekPanel,
      monthPanel: monthPanel,
      lastLabel: lastLabel
    })



  }

  function getPanel1Content(max){
    var str = '';
    for(var i=1; i<=max; i++){
      str += '<div class="eui-frequency-item" value="'+i+'">'+i+'</div>';
    }
    return $(str);
  }

  function bindEvents(target){
    var self = $(target)
    var comboData = $.data(target, 'combo');
    var panel = comboData.panel;


    var frequencyData = $.data(target, 'frequency');
    var opts = frequencyData.options;
    var i18nObj = $.fn.frequency.i18n[opts.locale];
    var second = frequencyData.second;
    var panel1 = frequencyData.panel1;
    var weekPanel = frequencyData.weekPanel;
    var monthPanel = frequencyData.monthPanel;


    panel.unbind('.frequency');
    weekPanel.unbind('.frequency');
    monthPanel.unbind('.frequency');
    $(document).unbind('.frequency').bind('mousedown.frequency', function(e){
      weekPanel.panel('close');
      monthPanel.panel('close');
    });
    panel.bind('click.frequency', function(event){
      var t = $(event.target);

      if(t.hasClass('eui-frequency-item-disable')) return ;
      //min hour day week moth
      var v = t.attr('value');
//      panel.panel('close');
      if(v === 'week'){
        _setValue(target, '', '');
        var width = panel.width();
        var left = panel.offset().left;
        var top = panel.offset().top;
        weekPanel.width(width);
        weekPanel.height('auto');
        weekPanel.panel('move', {
          left: left,
          top: top
        });
        panel.panel('close');
        weekPanel.panel('open');
        panel1.html(getPanel1Content(opts.weekFP));
      }
      else if (v === 'month'){
        _setValue(target, '', '');
        var width = panel.width();
        var left = panel.offset().left;
        var top = panel.offset().top;
        monthPanel.width(width);
        monthPanel.height('auto');
        monthPanel.panel('move', {
          left: left,
          top: top
        });
        panel.panel('close');
        monthPanel.panel('open');
        panel1.html(getPanel1Content(opts.monthFP));
      }
      else if (v === 'quarter'){}
      else if (v === 'year'){}
      else if (v === 'day'){
        _setValue(target, v, t.text());
        panel.panel('close');
//        changeLabel(target, i18nObj.day);
        panel1.html(getPanel1Content(opts.dayFP));
      }
      else if(v === 'hour'){
        _setValue(target, v, t.text());
        panel.panel('close');
//        changeLabel(target, i18nObj.hour);
        panel1.html(getPanel1Content(opts.hourFP));
      }

      var s2 = second.combo('getValue');
      if(s2){
        opts.onSelectValue.call(target, self.frequency('getValue'));
      }
    });

    panel1.bind('click.frequency', function(event){
      var t = $(event.target);
      second.combo('setValue', t.attr('value'));
      second.combo('setText', t.text());
//      setValue(target, t, t.text());
      panel1.panel('close');
      var s1 = self.combo('getValue');
      if(s1){
        opts.onSelectValue.call(target, self.frequency('getValue'));
      }

    });

    weekPanel.bind('click.frequency', function(event){
      var t = $(event.target);
      if(t.get(0).tagName === 'LI'){
        if(t.hasClass('frequency-selected')){
          t.removeClass('frequency-selected');
        }else{
          t.addClass('frequency-selected');
        }
      }else if(t.get(0).tagName === 'BUTTON'){
        var selecteds = weekPanel.find('.frequency-selected');
        var nums = []
        var texts = []
        selecteds.each(function(){
          nums.push($(this).attr('value'));
          texts.push(this.innerHTML);
        });
        if(texts.length == 0) return ;
        var value = 'week:'+nums.toString();
        var text = i18nObj.week+'('+texts.toString()+')';
        _setValue(target, value, text);
//        changeLabel(target, i18nObj.week);
        weekPanel.panel('close');
        if(parseInt(second.combo('getValue'))>opts.weekFP){
          second.combo('setValue', opts.weekFP);
          second.combo('setText', opts.weekFP);
        }
        opts.onSelectValue.call(self, self.frequency('getValue'));
      }
    }).bind('mousedown.frequency', function(event){
          event.stopPropagation();
    });

    monthPanel.bind('click.frequency', function(event){
      var t = $(event.target);
      if(t.get(0).tagName === 'TD'){
        if(t.hasClass('frequency-selected')){
          t.removeClass('frequency-selected');
        }else{
          t.addClass('frequency-selected');
        }
      }else if(t.get(0).tagName === 'BUTTON'){
        var selecteds = monthPanel.find('.frequency-selected');
        var nums = []
        selecteds.each(function(){
          nums.push(this.innerHTML);
        })
        if(nums.length == 0) return ;
        var value = 'month:'+nums.toString();
        var text = i18nObj.month+'('+nums.toString()+')';
        _setValue(target, value, text);
//        changeLabel(target, i18nObj.month);
        monthPanel.panel('close')
        if(parseInt(second.combo('getValue'))>opts.monthFP){
          second.combo('setValue', opts.monthFP);
          second.combo('setText', opts.monthFP);
        }
        opts.onSelectValue.call(self, self.frequency('getValue'));
      }
    }).bind('mousedown.frequency', function(event){
      event.stopPropagation();
    });

  }

  function _setValue(target, value, text){
    $(target).combo('setValue', value);
    $(target).combo('setText', text);
  }

  /**
   *
   * @param target
   * @param value   hour-1 day-1  week:4,0-1  week:2,0-2 month:1,2,3-2
   * @param text
   */
  function setValue(target, value, text){
    var self = $(target)
    var comboData = $.data(target, 'combo');
    var panel = comboData.panel;

    var frequencyData = $.data(target, 'frequency');
    var opts = frequencyData.options;
    var i18nObj = $.fn.frequency.i18n[opts.locale];
    var second = frequencyData.second;
    var lastLabel = frequencyData.lastLabel;
    var panel1 = frequencyData.panel1;
    var weekPanel = frequencyData.weekPanel;
    var monthPanel = frequencyData.monthPanel;

    if(value.indexOf('hour')>-1){
      self.combo('setValue', 'hour');
      self.combo('setText', i18nObj.hour);
      second.combo('setValue', value.split('-')[1]);
      second.combo('setText', value.split('-')[1]);
      lastLabel.html(i18nObj.hour);
    }
    else if(value.indexOf('day')>-1){
      self.combo('setValue', 'day');
      self.combo('setText', i18nObj.day);
      second.combo('setValue', value.split('-')[1]);
      second.combo('setText', value.split('-')[1]);
      lastLabel.html(i18nObj.day);
    }
//    week:4,0-1
    else if(value.indexOf('week')>-1){
      var v1 = value.split('-')[0];
      var v2 = value.split('-')[1];
      self.combo('setValue', v1);
      self.combo('setText', i18nObj.week+'('+v1.split(':')[1]+')');

      second.combo('setValue', v2);
      second.combo('setText', v2);
      lastLabel.html(i18nObj.week);
    }
    else if(value.indexOf('month')>-1){
      var v1 = value.split('-')[0];
      var v2 = value.split('-')[1];
      self.combo('setValue', v1);
      self.combo('setText', i18nObj.week+'('+v1.split(':')[1]+')');

      second.combo('setValue', v2);
      second.combo('setText', v2);
      lastLabel.html(i18nObj.month);
    }

    opts.onSelectValue.call(target, self.frequency('getValue'));
  }

  function getValue(target){
    var self = $(target)
    var frequencyData = $.data(target, 'frequency');
    var s1 = self.combo('getValue');
    var s2 = frequencyData.second.combo('getValue');
    if(s1 == '' || s2 == '')
      return ''
    return s1 + '-' +s2;
  }

  function clearValue(target){
    var frequencyData = $.data(target, 'frequency');
    var second = frequencyData.second;
    $(target).combo('setValue', '')
    $(target).combo('setText', '')
    $(second).combo('setValue', '')
    $(second).combo('setText', '')
  }

  function changeLabel(target, label){
    $.data(target, 'frequency').lastLabel.html(label);
  }

  function borderRed(target){
    var self = $(target)
    var frequencyData = $.data(target, 'frequency');
    var second = frequencyData.second;
    if(self.combo('getText') == ''){
      self.combo('borderRed');
    }
    if(second.combo('getText') == ''){
      second.combo('borderRed');
    }
  }

  $.fn.frequency = function(options, params){

    if(typeof options === 'string'){
      return $.fn.frequency.methods[options](this, params);
    }

    this.each(function(){
      var state = $.data(this,'frequency');
      if(state){
        $.extend(state.options, options);
      }else{
//        var parseOpts = parseOptions(this);
        var opts = $.extend({}, $.fn.combo.defaults,$.fn.frequency.defaults ,options);
        var r = init(this, opts);
//        state = $.data(this, 'frequency', {
//          options: opts,
//          combo: r.combo,
//          panel: r.panel
//        });
      }

      bindEvents(this);

    })
  }

  $.fn.frequency.methods = {
    getValue: function(jq){
      return getValue(jq[0]);
    },
    setValue: function(jq, value){
      setValue(jq[0], value);
    },
    clearValue: function(jq){
      return clearValue(jq[0]);
    },
    borderRed: function(jq){
      return borderRed(jq[0]);
    }

  }

  $.fn.frequency.defaults = {
    locale: 'en_us',//en_us zh_cn
    zIndex: 500,
    width: 160,
    readOnly: true,
    hourFP: 12,
    dayFP: 15,
    weekFP: 4,
    monthFP: 12,
    hourOfDay: 1,
    dayOfDay: 8,
    weekOfDay: 31,
    onSelectValue: function(value){}
  };

//  TODO ascii
  $.fn.frequency.i18n = {
    en_us: {
      hour: 'Hour',
      day: 'Day',
      week: 'Week',
      month: 'Month',
      freq: 'Frequency',
      freqP: 'Every',
      weeks:['', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      ok: 'Ok'
    },
    zh_cn: {
      hour: '时',
      day: '天',
      week: '周',
      month: '月',
      freq: '频率',
      freqP: '每',
      weeks:['', '一', '二', '三', '四', '五', '六', '日'],
      ok: '确定'
    }
  }

})(jQuery);

