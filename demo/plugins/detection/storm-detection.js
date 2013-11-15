/**
 * storm-detection.js
 *
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-2-26
 * Time: 上午9:59
 * Email: stormhouse@yeah.net
 * To change this template use File | Settings | File Templates.
 *
 * file list:
 *    storm-detection.js  主文件
 *
 * 1. 初始化
 * var opts = {
    countrycodes: {     //国家编码，用于选择按哪个国家来执行，h：归属地，v：漫游地，o：第三方国家
      h: '10086',
      v: '10087'
    },
    timezone: '',       //实际执行国家的时区
    locale: 'en_us',    //国际化  zh_cn /en_us
    taskDuration: 3000, //任务时长  单位秒s
    simTs: [            //终端与卡
      {
        id: '457-1000-1',
        name: 'China-BeiJing-name0001',
        type: 'ts'
      },
      {
        id: '457-1000-1',
        name: 'China-BeiJing-name0001',
        type: 'ts'
      },
      {
        id: '13141485180',
        name: 'SIM(a1)',
        type: 'sim'
      },
      {
        id: '13141485180',
        name: 'SIM(b1)',
        type: 'sim'
      }
    ],
    url: 'detectionTask'
  }
 * var detection = Detection.create(document.getElementById(domid), opts);
 *
 *
 * 2. 外部调用方法：
 * 2.1 取值
 *  detection.getDate();
 *  detection.getValue();
 *  detection.getExcuteDate();
 * 2.2 更新初始化控件信息
 *  detection.updateTaskDuration(300*3); //秒
 *  detection.updateSim([{id: '111', name='13712344321', type='sim'}]);
 *  detection.updateTs([{id: '111', name='China-Beijing-*', type='ts'}]);
 * 2.3 timezone加入
 *  配置countrycodes
 *  url:  getTimezone               获取所有的时区
 *  url:  getTimezoneByCountrycode  取得国家所在时区（漫游地）
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
(function(w){
  if('StormDetection' in w) return ;
  var de = new Object();
  de.HORIZONTAL = 0;
  de.SIMTS_TITLE_HEIGHT = 30;
  //方框单元高度
  de.SIMTS_HEIGHT = 35;
  de.SIMTS_WIDTH = 140;
  de.TASK_TITLE_HEIGHT = 20;
  de.CURRENT_TIME_LABEL_HEIGHT = 30;
  de.TASK_DURATION_MAX = 7200;
  de.TASK_DURATION_DEFALUT = 1800;
  de.DETECTION_URL = 'detectionTask';
  de.TZ_BY_COUNTRYCODE = 'getTimezoneByCountrycode';
  de.TZ = 'getTimezone';
  de.GRQ_6_HOUR = [0, 4, 8, 12, 16, 20];
  de.GRQ_9_HOUR = [0, 4, 8, 10, 12, 14, 16, 18, 20];
  de.MS_OF_DAY = 86400000;

  /**
   *
   * @param gmt   0, -8, -8.5
   * @return UTC-08:30
   */
  de.GMT_2_UTC = function(gmt){
    var i = parseInt(gmt);
    var utc = i<0 ? 'UTC-' : 'UTC+';
    i = Math.abs(i);
    var f = Math.abs(parseFloat(gmt))
    var mm = (f-i)*60;
    mm = mm>9 ? mm : '0'+mm;
    var hh = i>9 ? i : '0'+i;
    return utc+hh+':'+mm;
  }


  function guid() {
    //    Generate four random hex digits.
    function S4() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  if(!de.detections)
    de.detections = [];
  //TODO 国际化
  de.getDefaultLocale = function() {
    return 'zh_cn';
  };

  de.create = function(el, opts){
    var eventSource = new StormDetection.DefaultEventSource();
    opts.eventSource = eventSource;
    opts.intervalUnit = 3;//Storm.DateTime.HOUR,
    opts.intervalPixels = 60;
    var bandInfos = [de.createBandInfo(opts)];

    var deObj = new de._Impl(el, bandInfos);

    return deObj;
  }

  de.getDefaultTheme = function() {
    if (de._defaultTheme == null) {
      de._defaultTheme = de.ClassicTheme.create(de.getDefaultLocale());
    }
    return de._defaultTheme;
  };

  de.createBandInfo = function (params) {

    if(typeof parseInt(params.taskDuration) !== 'number')
      throw new Error('task duration must be a number')

    var theme = ("theme" in params) ? params.theme : de.getDefaultTheme();
    var eventSource = ("eventSource" in params) ? params.eventSource : null;


    var seconds_pixel;//每像素多少秒
    if(params.intervalUnit === 3){
      seconds_pixel = 3600/params.intervalPixels
    }


    var ether = new de.LinearEther({
      centersOn:          ("date" in params) ? params.date : new Date(),
      interval:           Storm.DateTime.gregorianUnitLengths[params.intervalUnit],
      pixelsPerInterval:  params.intervalPixels,
      theme:              theme
    });

    var etherPainter = new de.GregorianEtherPainter({
      unit:       params.intervalUnit,
//      multiple:   ("multiple" in params) ? params.multiple : 1,
      theme:      theme,
      align:      ("align" in params) ? params.align : 'Top'
    });

    //event painter
    var eventPainterParams = {
      showText:   ("showEventText" in params) ? params.showEventText : true,
      theme:      theme
    };

    var layout = ("overview" in params && params.overview) ? "overview" : ("layout" in params ? params.layout : "original");
    var eventPainter;
    if ("eventPainter" in params) {
      eventPainter = new params.eventPainter(eventPainterParams);
    } else {
      switch (layout) {
        case "overview" :
//          eventPainter = new Timeline.OverviewEventPainter(eventPainterParams);
          break;
        case "detailed" :
//          eventPainter = new Timeline.DetailedEventPainter(eventPainterParams);
          break;
        default:
          eventPainter = new de.OriginalEventPainter(eventPainterParams);
      }
    }
    if(params.TZ_BY_COUNTRYCODE)
      de.TZ_BY_COUNTRYCODE = params.TZ_BY_COUNTRYCODE;
    if(params.TZ)
      de.TZ = params.TZ;
    return {
//      width:params.width,
      type: params.type? params.type : 111,
      typeValue: params.typeValue,
      eventSource:eventSource,
      locale: params.locale,
      countrycodes: params.countrycodes,
      timezone: params.timezone ? params.timezone : (new Date().getTimezoneOffset()/60)*(-1),
      realtimezone:params.timezone ? params.timezone : (new Date().getTimezoneOffset()/60)*(-1),
      ether:ether,
      etherPainter:etherPainter,
      eventPainter:eventPainter,
      theme:theme,
//      zoomIndex:("zoomIndex" in params) ? params.zoomIndex : 0,
//      zoomSteps:("zoomSteps" in params) ? params.zoomSteps : null,
      simTs: params.simTs,
      currentDate: ('currentDate' in params) ? params.currentDate : new Date(),
      taskDuration: params.taskDuration,
      timeSegment: params.timeSegment,
      seconds_pixel: seconds_pixel,
      url: params.url,
      guid: params.guid
    };
  }

  de.loadJSON = function(url,params, fun){

    $.ajax({
      converterTz: false,
      async:true,
      type: 'post',
      url: url,
      data:params,
      dataType:'json',
      success:function (data) {
        fun(data, url)
      },
      error:function (data, textStatus) {
        throw new Error('can not get time segment!'+textStatus);
      }
    });
  }

  de._Impl = function(el, bandInfos, orientation, unit, timelineID){

    //清理
    $(el).html('');

    this._type = bandInfos[0].type;
    this._typeValue = bandInfos[0].typeValue;
    this._eventSource = bandInfos[0].eventSource;
    this._containerDiv = el;
    this._bandInfos = bandInfos;
    this._orientation = 0;
    this._locale = bandInfos[0].locale;
    //客户浏览器时区
    this._timezone = bandInfos[0].timezone
    //客户选择的时区
    this._realtimezone = bandInfos[0].realtimezone
    this._countrycodes = bandInfos[0].countrycodes

    de.i18n = de.I18N[this._locale];

    this._unit = (unit != null) ? unit : de.NativeDateUnit;
//    this._url = bandInfos[0].url;
    if(bandInfos[0].url)
      this._url = bandInfos[0].url;
    else
      this._url = de.DETECTION_URL;
    this._ts = [];
    this._sim = [];
    this._simTsOrder = [];
//    this._guid = bandInfos[0].guid;
    if(bandInfos[0].guid)
      this._guid = bandInfos[0].guid;
    else
      this._guid = guid();
    this._priority = (bandInfos[0].priority != null) ? bandInfos[0].priority : 11;
    for(var simTemp in bandInfos[0].simTs){
      var temp = bandInfos[0].simTs[simTemp];
      if(temp.type == 'ts'){
        this._ts.push(temp);
        this._simTsOrder.push(temp.id);
      }
      else if(temp.type == 'sim'){
        this._sim.push(temp);
        this._simTsOrder.push(temp.id);
      }
    }

    //@@@@初始化数据
    this._simTs = bandInfos[0].simTs;
    this._currentDate = bandInfos[0].currentDate;
    this._timeSegment = bandInfos[0].timeSegment;

    var dTemp = bandInfos[0].taskDuration

    if(parseInt(dTemp)>0){
      this._taskDuration = dTemp > de.TASK_DURATION_MAX ? de.TASK_DURATION_MAX : dTemp;
    }else{
      this._taskDuration = de.TASK_DURATION_DEFALUT;

    }

    this._taskInfo = {
      taskName: Math.round(this._taskDuration/60) +'min',
      taskDuration: this._taskDuration
    }

    //每像素
    this._seconds_pixel = bandInfos[0].seconds_pixel;
    this.initialize();
  }
  de._Impl.prototype.initialize = function(){

    var containerDiv = this._containerDiv;
    var doc = containerDiv.ownerDocument;

//    containerDiv.className =
    containerDiv.className.split(" ").concat("timeline-container timeline-default").join(" ");

    var orientation = (this.isHorizontal()) ? 'horizontal' : 'vertical'
    containerDiv.className +=' timeline-'+orientation;

    //@@@@添加类型
    this.createTaskType(containerDiv);



    this._mainBandContainer = this.getDocument().createElement("div");
    this._mainBandContainer.className = "timeline-band-container";

    this._mainBandContainer.style.height = (de.SIMTS_TITLE_HEIGHT + de.SIMTS_HEIGHT * this._simTs.length)+'px'


    //左侧终端, 卡信息
    this.createLeft();

    //@@@@右侧
    this._rightPart = this.getDocument().createElement("div");
    this._rightPart.className = 'timeline-band-right-part'
    this._rightPart.style.width = (containerDiv.style.width.split('px')[0]-de.SIMTS_WIDTH)+'px';
    this._rightPart.style.left = de.SIMTS_WIDTH+'px';
    this._mainBandContainer.appendChild(this._rightPart);

    containerDiv.appendChild(this._mainBandContainer);

    //@@@@图例
    var legend = this.getDocument().createElement("div");
    legend.innerHTML = '<div style="position: absolute; bottom: -40px; right: 1px;"><span class="timeline-task-legend"></span><span>'+de.i18n.free+'</span><span class="timeline-task-legend timeline-task-legend-red"></span><span>'+de.i18n.busy+'</span></div>'
    this._mainBandContainer.appendChild(legend);

    //@@@@create bands
    this._bands = [];
    this._mainBand = new de._Band(this, this._bandInfos[0], 0);//new _Band
//    this._rightBand =
//    for (var i = 0; i < this._bandInfos.length; i++) {
//      var band = new de._Band(this, this._bandInfos[i], i);//new _Band
    this._bands.push(this._mainBand);
//    }

//    this._bands.push(this._rightBand);
    this._rightBand = new de._RightPart(this, this._bandInfos[0]);
    this._rightBand.initialize();
//    this._bands.push(this._ri)
    this._distributeWidths();

    /**
     * 设置当前时间
     */
    this._mainBand.computeTime();
    this._mainBand.fixToDate(this._currentDate, true);//移动到当前时间
    this._mainBand._currentDate = this._currentDate //detection 与band 当前时间同步
    //设置timespinner
    var timeSpinner = this._timeSpinner;
    var h = this._currentDate.getHours();
    var m = this._currentDate.getMinutes();
    var hhmm = (h<10 ? '0'+h: h)+':'+(m<10 ? '0'+m : m);
    $(timeSpinner).val(hhmm);

//    @@@@当前时间
    var dateOfRealtimezone = new Date(new Date().getTime()-(this._timezone - this._realtimezone)*3600000);
    this.updateCurrentDateFlag(dateOfRealtimezone);

    if(this._type == 'grq'){
      this._fillCycle();
    }

    $('.timeline-task-legend-red').click(function(event){
      if(event.shiftKey && event.ctrlKey && event.altKey){
        var d = $('<div>');
        d.append($('<label>priority</label>'))
        d.append($('<input id="priority-temp" value="12"/>'));
        $('.timeline-type-title').parent().append(d)
      }
    });

    this.updateTimeSegment(new Date());
  }
  de._Impl.prototype.addDiv = function(div) {
    this._containerDiv.appendChild(div);
  };
  de._Impl.prototype.addBandDiv = function(div) {
    this._rightPart.appendChild(div);
  };

  //更新当前时间的标识
  de._Impl.prototype.updateCurrentDateFlag = function(date){
    if(!date)
      var date = new Date(new Date().getTime()-(this._timezone - this._realtimezone)*3600000);
    var offset = Math.round(this._mainBand.dateToPixelOffset(date));
    var cf = $('#current-date-flag');
    if(cf.length == 0){
      cf  = $('<div class="timeline-date-label" id="current-date-flag" style="border-color: green; left: 55px; top: 0px;"></div>');
      $('div[name=ether-markers]').append(cf)
    }
    cf.css('left', offset+'px');

//    $(this._containerDiv).find('.timeline-event-icon').remove();

//    this._eventSource.updateCurrentDateFlag();
    //    @@@@当前时间
//    this._eventSource.loadJSON({
//      events: [{
//        "start": new Date(),
//        "durationEvent": false,
//        "orizontalIndex": "1"
//      }]
//    }, '', 'move')

  }

  de._Impl.prototype.changeDateTimezone = function(date, fromtz, totz){
    return new Date(date.getTime()+(parseFloat(fromtz)-parseFloat(totz))*3600*1000);
  }
  //左侧终端，卡信息
  de._Impl.prototype.createLeft = function(){
    var self = this;
//    this._leftPart = this.getDocument().createElement("div");
//    this._leftPart.className = 'timeline-band-left-part';
//    this._leftPart.style.width = de.SIMTS_WIDTH + 'px';
    self._leftPart = $('<div>').addClass('timeline-band-left-part').width(de.SIMTS_WIDTH);


    var tz = self._timezone;

    var timezonediv = $('<div class="timeline-left-timezone"></div>');
    var timezonebtn = $('<label class="timeline-timezone-btn" style="cursor: pointer;margin-left: 20px;"></label>');
    timezonebtn.html(de.GMT_2_UTC(self._timezone));
    timezonediv.append(timezonebtn)
    timezonediv.height(de.SIMTS_TITLE_HEIGHT);
    timezonediv.css('line-height',de.SIMTS_TITLE_HEIGHT+'px');

    self._leftPart.append(timezonediv)

    for(var ii=0; ii<this._simTs.length; ii++){
      var s1 = $('<div>');
      s1.attr('data-main-id',  this._simTs[ii].id);
      s1.attr('data-type',  this._simTs[ii].type);
      s1.css('height', de.SIMTS_HEIGHT + 'px');
      s1.css('line-height', de.SIMTS_HEIGHT + 'px');
      if(this._simTs[ii].type == 'sim'){
        s1.html(this._simTs[ii].id);
        s1.addClass('timeline-left-sim');
      }else{
        s1.html(this._simTs[ii].name);
        s1.addClass('timeline-left-ts');
      }
      this._leftPart.append(s1);
    }

    this._mainBandContainer.appendChild(this._leftPart.get(0));


    timezonebtn.click(function (e) {
      e.stopPropagation();
      var panel = timezonediv.children('div');
      var cs;
      try{
        cs = _.uniq([self._countrycodes.h, self._countrycodes.v, self._countrycodes.o]).toString();
      }catch (ex){}
      if(cs){
        if (panel.length==1) {
          panel.show();
        } else {
          $.ajax({
            converterTz: false,
            async: true,
            type: 'post',
            url: de.TZ,
            //          url: 'timezone.json',
            data: {
              countrys: cs
            },
            dataType: 'json',
            success: function (data) {
              createTimezonePanel(data);
            },
            error: function (data, textStatus) {
              throw new Error('can not get time segment!' + textStatus);
            }
          });
        }
      }

    });

    getTimezoneByCountry();

    function createTimezonePanel(data){
      timezonediv.find('div').remove();
      var panel = $('<div style="background-color: #ffffff;border: 1px solid #DDDDDD;position: absolute;width: 300px;max-height: 250px; height: auto;overflow-y: auto;left: 20px;z-index: 300">');

      for(var i=0; i<data.length; i++){
        var itemTemp = $('<div class="eui-combobox-item" style="padding-right: 10px;"></div>').appendTo(panel);
        itemTemp.css('background-position', '0px -1034px');

        itemTemp.attr('value', data[i].timezoneid);
        itemTemp.attr('data-text', data[i].timezonename);
        itemTemp.html(data[i].description);
//        itemTemp.attr('title', data[i][opts.textField]);
      }
      panel.click(function(e){
        e.stopPropagation();
        var s = $(e.target);
        timezonediv.children('label').attr({
          'value': s.attr('value'),
          'text': s.attr('data-text')
        }).html(s.attr('data-text'));
        self._realtimezone = s.attr('value').split('UTC')[1];
        panel.hide();
        if($("input[name='task-type']:checked").val() == 1){
          $('#task-type-immediately').trigger('click');
        }
        self.updateCurrentDateFlag();
      });
      timezonediv.append(panel);
      $(document.body).unbind('click').bind('click', function(){
        panel.hide();
      })
      self.updateCurrentDateFlag();
    }

    function getTimezoneByCountry(){
      var v;
      try{
        v = self._countrycodes.v;
      }catch(ex){console.log(ex)}

      if(v){
        $.ajax({
          converterTz: false,
          async: true,
          type: 'post',
          url: de.TZ_BY_COUNTRYCODE,
          data: {countrycode: self._countrycodes.v},
          dataType: 'json',
          success: function (data) {
            if(data){
              $('.timeline-left-timezone').children('label').attr('value', data.timezoneid).html(data.timezonename);
              var t = data.timezoneid.split('UTC')[1];
              if(t){
                self._realtimezone = t;
                if($("input[name='task-type']:checked").val() == 1){
                  $('#task-type-immediately').trigger('click')
                }
                self.updateCurrentDateFlag();
              }
            }
          },
          error: function (data, textStatus) {
            throw new Error('can not get time segment!' + textStatus);
          }
        });
      }

    }
  }

  de._Impl.prototype.createTaskType = function(containerDiv){

    var self = this;

    var doc = this.getDocument();
    var typeContainer = doc.createElement('div');
    typeContainer.style.position = 'relative';
    var typeTitle = $('<div class="timeline-type-title"></div>')
    var typeGRQ = $('<div class="timeline-type-title"></div>');
    var typeContent = $('<div style="margin: 6px 0;"></div>')

    var r1 = createRadio(doc, 'task-type-immediately', 'task-type', true, 1)
    var l1 = createLabel(doc ,'task-type-immediately', de.i18n.taskType[0])
    var r2 = createRadio(doc, 'task-type-timely', 'task-type', false,2)
    var l2 = createLabel(doc ,'task-type-timely', de.i18n.taskType[1])
    var r3 = createRadio(doc, 'task-type-circularly', 'task-type', false, 3)
    var l3 = createLabel(doc ,'task-type-circularly', de.i18n.taskType[2])
    $(r1).click( function(event){
      self._taskType = '';
      typeContent.children().hide();
      $('.timeline-rightband-container').hide();
      var dateOfRealtimezone = new Date(new Date().getTime()-(self._timezone - self._realtimezone)*3600000);
      self._bands[0].fixToDate(dateOfRealtimezone);
    })
    $(r2).click(function(event){
      self._taskType = '';
      typeContent.children().hide();
      $('.timeline-rightband-container').hide();
      var isExits = typeContent.find('.task-timely');
      if(isExits.length == 1){
        isExits.show();
        //TODO
//        console.log(self.getCurrentDate());
//        console.log($('#execute-date').datebox('getDate'));

//        self._bands[0].fixToDate($('#execute-date').datebox('getDate'));
      }else{
        var div = $('<div class="task-timely"></div>');
        var input = $('<input id="execute-date">');
        self._timelyDateInput = input;
        div.append('<label class="timeline-input-label">'+de.i18n.date+':</label>').append(input);
        $(typeContent).append(div);
        input.datebox({
          zIndex: 400,
          width: 150,
          currentDate: self.getNewCurrentDate(),
          startIndex: self.getNewCurrentDate(),//'4/23/2013',
          onSelect: function(date){
            date.setHours(self.getCurrentDate().getHours());
            date.setMinutes(self.getCurrentDate().getMinutes());
            date.setSeconds(self.getCurrentDate().getSeconds());
            self._bands[0].fixToDate(date)
            self.updateTimeSegment(date)
          }
        });

      }
    });
    $(r3).click(function(event){
      self._taskType = 'cycle';
      typeContent.children().hide();
//      $('.timeline-rightband-container').show();
      var isExits = typeContent.find('.task-circularly');
      if(isExits.length == 1){
        isExits.show();
      }else{
        createCycleDate();
      }
      self._fillCycle();
    });

    if(this._type!='grq'){
      if((parseInt(this._type&100, 10) == 100)){
        typeTitle.append(r1);
        typeTitle.append(l1);
      }

      if((parseInt(this._type&010, 10) == 010)){
        typeTitle.append(r2);
        typeTitle.append(l2);
      }
      if((parseInt(this._type&001, 10) == 001)){
        typeTitle.append(r3);
        typeTitle.append(l3);
      }
    }


    var r9 = createRadio(doc, 'grq-exe-nine', 'grq-exe-type', true, 9);
    var l9 = createLabel(doc ,'grq-exe-nine', de.i18n.grq9)
    var r6 = createRadio(doc, 'grq-exe-six', 'grq-exe-type', false, 6);
    var l6 = createLabel(doc ,'grq-exe-six', de.i18n.grq6)

    $(r9).click(function(event){
      self._rightBand.clearTimeSegment();
      if(computeDateRange('start-date', 'end-date', 'detection-frequency')) return ;
      computeCycleTask('start-date', 'end-date', 'detection-frequency');
    })
    $(r6).click(function(event){
      self._rightBand.clearTimeSegment();
      if(computeDateRange('start-date', 'end-date', 'detection-frequency')) return ;
      computeCycleTask('start-date', 'end-date', 'detection-frequency');
    })



    typeGRQ.append($('<div style="margin: 5px 0 5px 30px;">').append(r9).append(l9));
    typeGRQ.append($('<div style="margin: 5px 0 5px 30px;">').append(r6).append(l6));

    if(this._type == 'grq'){
      typeContainer.appendChild(typeGRQ.get(0));
      createCycleDate('grq');
    }else{
      typeContainer.appendChild(typeTitle.get(0));
    }

    typeContainer.appendChild(typeContent.get(0));
//    var timezoneDiv = $('<div style="top: 0;position: absolute;right: 0;"></div>');

//    var timezoneSelect = $('<select></select>');

//    timezoneDiv.append(timezoneSelect);


//    typeContainer.appendChild(timezoneDiv.get(0));

    containerDiv.appendChild(typeContainer)
//    timezoneSelect.combobox({
//      width: 250,
//      zIndex:100,
//      url: de.TZ,
//      valueField:'timezoneid',
//      textField:'description',
//      onSelect: function(obj){
//        //TODO
//      }
//    });

//    $.ajax({
//      converterTz: false,
//      async:true,
//      type: 'post',
//      url: de.TZ_BY_COUNTRYCODE,
//      data:{countrycode: self._countrycodes},
//      dataType:'json',
//      success:function (data) {
//        timezoneSelect.combobox('setValue', data.timezoneid);
//      },
//      error:function (data, textStatus) {
//        throw new Error('can not get time segment!'+textStatus);
//      }
//    });

    function computeDateRange(startDatebox, endDatebox, frequency){

      var f = $('#'+frequency)
      var changed = false;
      var opts = $.data(f.get(0), 'frequency').options;

      if(startDatebox && endDatebox){
        var sDate = $('#'+startDatebox).datebox('getDate')
        var eDate = $('#'+endDatebox).datebox('getDate')
        var sValue = $('#'+startDatebox).datebox('getValue')
        var eValue = $('#'+endDatebox).datebox('getValue')
        if(sValue !== '' && eValue !== ''){
          var offsetMS = eDate.getTime()-sDate.getTime();
          var offsetDay = offsetMS/(1000*60*60*24);


          var tempV = f.frequency('getValue').split('-')[0];
          if(tempV === '' || tempV === '-' || tempV === undefined){
            changed = true;
          }
          if(tempV.indexOf(':')> -1){
            tempV = tempV.split(':')[0];
          }
          if(offsetDay<0){
            changed = true;
          }
//          Hour
          else if(offsetDay<opts.hourOfDay){
            if(tempV === 'day' || tempV === 'week' || tempV === 'month')
              changed = true;
          }
//          Day
          else if(offsetDay<opts.dayOfDay){
            if(tempV === 'week' || tempV === 'month')
              changed = true;
          }
//          Week
          else if(offsetDay<opts.weekOfDay){
            if(tempV === 'month')
              changed = true;
          }
        }
        else{
          changed = true;
        }
      }

      if(changed) f.frequency('clearValue');
      return changed
    }

    /**
     *
     * @param startDatebox
     * @param endDatebox
     * @param frequency   day-2
     *                     week:(1,2,3)-1
     *                     month:(1,10,30)-2
     *
     */
    function computeCycleTask(startDatebox, endDatebox, frequency){

      var startDate = $('#'+startDatebox).datebox('getDate');
      var endDate = $('#'+endDatebox).datebox('getDate');
      var fValue = $('#'+frequency).frequency('getValue');
      var ss = fValue.split('-');
      if(ss.length !== 2) return ;


//      hour day week month
      var frFlag;
//      1,2,3,6
      var frFlagValue;
//      频点 每隔 {frPoint} 月
      var frPoint;

      //week month
      if(ss[0].indexOf(':')>0){
        var frSS = ss[0].split(':');
        frFlag = frSS[0];
        frFlagValue = frSS[1]
      }
      //hour day
      else{
        frFlag = ss[0];
      }
      frPoint = ss[1];
      var datas = getDatesFromCycleTask(startDate, endDate, frFlag, frFlagValue, frPoint, self.getCurrentDate());

      if(datas.length>0){
        self._dates = datas[0];
        self._rightBand.updateTimePiece(datas[0], datas[1]);
      }
    }

    /**
     *
     * @param startDate
     * @param endDate
     * @param frFlag  hour, day, week, month
     * @param frValue hour(none), day(none), week(1,2,3,4,5,6,7), month(1,2,3...31)
     * @param frPoint
     * @param currentDate
     *
     * @return [dates, newStartDate]
     */
    function getDatesFromCycleTask(startDate, endDate, frFlag, frValue, frPoint, currentDate){
      var startMs = startDate.getTime();
      //截止日期的24点
      var endMs = endDate.getTime()+1000*60*60*24;

      var execHour = currentDate.getHours();
      var execMin = currentDate.getMinutes();
      var execSecond = currentDate.getSeconds();

      if(endMs < startMs) return [];
      if(frPoint === '') return [];
//      if(typeof frPoint !== 'number')
//        throw new Error('frPoint value error');

      var dates = [];
      //是否已设置newStartDate
      var isSetNewStartDate = false;
      var isFirst = true;
      //计算完后，返回给新的开始时间，时间值滑动标识到该时间点
      var newStartDate;

      var currentDate = new Date().getTime();

      var GRQ_HOURS;
      if($("input[name='grq-exe-type']:checked").val() ==9){
        GRQ_HOURS = de.GRQ_9_HOUR;
      }else{
        GRQ_HOURS = de.GRQ_6_HOUR;
      }

//      TODO 选一年怎么办
      if(frFlag === 'hour'){
        var sD = new Date(startDate)
        sD.setHours(execHour);
        sD.setMinutes(execMin);
        sD.setSeconds(execSecond);
        while(sD.getTime() < endMs){
          if(sD.getTime()>=currentDate){
            dates.push(sD);
          }
          //重置newStartDate，也就循环第一次设置，
          if(!isSetNewStartDate){
            var tempI = sD.getTime()-self.getCurrentDate().getTime()
            if(-1000<=tempI && tempI<1000*60*60){
              newStartDate = new Date(sD.getTime());
              isSetNewStartDate = true;
            }
          }
          //间隔frPoint，sD为下一个时间点
          sD = new Date(sD.getTime()+frPoint*1000*60*60);
        }
      }
      else if(frFlag === 'day'){
        var sD = new Date(startDate)
        sD.setHours(execHour);
        sD.setMinutes(execMin);
        sD.setSeconds(execSecond);
        while(sD.getTime() < endMs){

          if(self._type == 'grq'){
            for(var hourgrq in GRQ_HOURS){
              var grqDateTemp = new Date(sD.getTime());
              grqDateTemp.setHours(GRQ_HOURS[hourgrq]);
              grqDateTemp.setMinutes(0);
              grqDateTemp.setSeconds(0)
              if(grqDateTemp.getTime()>=currentDate){
                dates.push(grqDateTemp);
              }
            }
          }else{
            if(sD.getTime()>=currentDate){
              dates.push(sD);
            }
          }

          if(!isSetNewStartDate){
            var tempI = sD.getTime()-self.getCurrentDate().getTime()
            if(-1000<=tempI && tempI<1000*60*60*24*frPoint){
              newStartDate = new Date(sD.getTime());
              isSetNewStartDate = true;
            }
          }
          //设置sD，为下一个执行时间点，
          sD = new Date(sD.getTime()+frPoint*1000*60*60*24);
        }
      }
      else if(frFlag === 'week'){

        if(frValue.indexOf('7')>-1){
          frValue = frValue+',0'
        }
        var sD = new Date(startDate)
        sD.setHours(execHour);
        sD.setMinutes(execMin);
        sD.setSeconds(execSecond);
        while(sD.getTime() < endMs){
          if(frValue.indexOf(sD.getDay())>-1){
            if(self._type == 'grq'){
              for(var hourgrq in GRQ_HOURS){
                var grqDateTemp = new Date(sD.getTime());
                grqDateTemp.setHours(GRQ_HOURS[hourgrq]);
                grqDateTemp.setMinutes(0);
                grqDateTemp.setSeconds(0)
                if(grqDateTemp.getTime()>=currentDate){
                  dates.push(grqDateTemp);
                }
              }
            }else{
              if(sD.getTime()>=currentDate){
                dates.push(sD);
              }
            }
          }
          if(!isSetNewStartDate){
            var tempI = sD.getTime()-self.getCurrentDate().getTime()
            if(-1000<=tempI && tempI<1000*60*60*24*7*frPoint){
              newStartDate = new Date(sD.getTime());
              isSetNewStartDate = true;
            }
          }
          sD = new Date(sD.getTime()+1000*60*60*24);
          if(sD.getDay() == 6){
            sD = new Date(sD.getTime()+7*1000*60*60*24*(frPoint-1));
          }
        }
      }
      else if(frFlag === 'month'){
        var sD = new Date(startDate)
        sD.setHours(execHour);
        sD.setMinutes(execMin);
        sD.setSeconds(execSecond);
        while(sD.getTime() < endMs){
          var frValues = frValue.split(',');
          if(!isFirst){
            sD = new Date(sD.getTime()+1000*60*60*24);
            var tempD = new Date(sD);
            tempD.setDate(1);
            tempD.setMonth(tempD.getMonth()+1);
            tempD.setDate(0);
            var currentDates = tempD.getDate();
          }
          isFirst = false;
          //循环取date [1,15,16,30,31]
          for(var i=0; i<frValues.length; i++){
            if(frValues[i] == sD.getDate()){
              //GRQ
              if(self._type == 'grq'){
                for(var hourgrq in GRQ_HOURS){
                  var grqDateTemp = new Date(sD.getTime());
                  grqDateTemp.setHours(GRQ_HOURS[hourgrq]);
                  grqDateTemp.setMinutes(0);
                  grqDateTemp.setSeconds(0)
                  if(grqDateTemp.getTime()>=currentDate){
                    dates.push(grqDateTemp);
                  }
                }
                //不是GRQ
              }else{
                if(sD.getTime()>=currentDate){
                  dates.push(new Date(sD));
                }
              }
              break;
            }
          }
          if(!isSetNewStartDate){
            var tempI = sD.getTime()-self.getCurrentDate().getTime()
            if(-1000<=tempI && tempI<1000*60*60*24*30*frPoint){
              newStartDate = new Date(sD.getTime());
              isSetNewStartDate = true;
            }
          }


          //判断是否当月的最后一天，如果是，下一个执行周期
          if(sD.getDate() == currentDates){
//            sD = new Date(sD.getTime()+tempD.getDate()*1000*60*60*24*frPoint);
//            sD = new Date(sD.getTime()+tempD.getDate()*1000*60*60*24*(frPoint-1));
            if(frPoint == 1){

            }else{
              isFirst = true;
              sD.setDate(1)
              var tM = sD.getMonth();
              sD.setMonth(tM+parseInt(frPoint));
            }
          }
        }
      }
      return [dates, newStartDate];
    }

    /**
     *
     * @param doc     document
     * @param id      生成radio的id属性
     * @param name    生成radio的name属性
     * @param checked 是否为选中状态。true：选中，false：不选中
     * @param value   生成radio的value属性
     * @returns {*}   返回生成好的radio元素
     */
    function createRadio(doc, id, name, checked, value){
      var radioInput;
      try {
        var radioHtml = '<input type="radio" style="margin-left: 5px;" name="' + name + '" id="'+ id +'"';
        if ( checked ) {
          radioHtml += ' checked="checked"';
        }
        radioHtml += '/>';
        radioInput = doc.createElement(radioHtml);
      } catch( err ) {
        radioInput = doc.createElement('input');
        radioInput.setAttribute('type', 'radio');
        radioInput.setAttribute('name', name);
        radioInput.setAttribute('id', id);
        radioInput.setAttribute('value', value);
        if ( checked ) {
          radioInput.setAttribute('checked', 'checked');
        }
      }
      return radioInput;
    }

    function createLabel(doc, id, text){
      var l = doc.createElement('label');
      l.setAttribute('for', id);
      l.style.paddingRight = '10px';
      l.style.paddingLeft = '5px';
      l.innerHTML = text;
      return l
    }

    /**
     * 创建循环任务的 Date Frequency
     */
    function createCycleDate(grq){
      var div = $('<div class="task-circularly"></div>');
      var startInput = $('<input id="start-date">');
      var endInput = $('<input id="end-date">');
      div.append('<label class="timeline-input-label">'+de.i18n.from+':</label>').append(startInput);
      div.append('<label style="margin-left: 5px;" class="timeline-input-label">'+de.i18n.to+':</label>').append(endInput);
      var frequencyInput = $('<input id="detection-frequency">')
      div.append(frequencyInput);
      self._frequencyInput = frequencyInput;
//        div.append('<label class="timeline-input-label">Frequency:</label>').append('<select><option>Day</option><option>Hour</option></select>');
//        div.append('<label class="timeline-input-label">Eeah:</label>').append('<select><option>1</option><option>2</option></select>');
//        div.append('<label class="timeline-input-label">Hour</label>');
      $(typeContent).append(div);
      startInput.datebox({
        zIndex: 400,
        startIndex: new Date(),//'4/23/2013',
        width: 150,
        onSelect: function(date){
          self._mainBand.fixToDate(date)
//          self.updateTimeSegment(date)

          self._rightBand.clearTimeSegment();
          if(computeDateRange('start-date', 'end-date', 'detection-frequency')) return ;
          computeCycleTask('start-date', 'end-date', 'detection-frequency');
        }
      })
      endInput.datebox({
        zIndex: 400,
        startIndex: new Date(),//'4/23/2013',
        width: 150,
        onSelect: function(date){
          self._rightBand.clearTimeSegment();
          if(computeDateRange('start-date', 'end-date', 'detection-frequency')) return ;
          computeCycleTask('start-date', 'end-date', 'detection-frequency');
        }
      })
      frequencyInput.frequency({
        startDatebox: 'start-date',
        endDatebox: 'end-date',
        readOnly: true,
        locale: self._locale,
        grq: grq,
        onSelectValue: function(value){
          self._rightBand.clearTimeSegment();
          computeCycleTask('start-date', 'end-date', 'detection-frequency');
        }
      });
    }

  }

  de._Impl.prototype._fillCycle = function(){
    var self = this;
//    setTimeout(function(){
    var currentDate = new Date().getDate();
    var ds = new Date().setDate(currentDate+1);
    var de = new Date().setDate(currentDate+2);
    $('#start-date').datebox('setDate', new Date(ds));
    $('#end-date').datebox('setDate', new Date(de));
    //hour-1 day-1  week:4,0-1  week:2,0-2 month:1,2,3-2
    self._frequencyInput.frequency('setValue', 'day-1');
//    }, 500);
//    console.log(new Date(ds))
//    this._mainBand.fixToDate(new Date(ds));
//    $('#end-date').datebox('setDate', new Date(new Date().getDate()+2))
  }

  de._Impl.prototype.getCurrentDate = function(){
    return new Date(this._mainBand._currentDate);
//    return new Date(this._mainBand._currentDate.getTime()+(parseInt(this._realtimezone)-parseInt(this._timezone))*3600*1000)
  }

  //根据时区返回当前时间
  de._Impl.prototype.getNewCurrentDate = function(){
    return this.changeDateTimezone(new Date(), this._timezone, this._realtimezone);
  }
  de._Impl.prototype.getExeDate = function(){
//    return new Date(this._mainBand._currentDate);
    return this.changeDateTimezone(this._mainBand._currentDate, this._timezone, this._realtimezone).getTime();
  }

  de._Impl.prototype.getStartDate = function(){
    var s;
    try{
      s = this.changeDateTimezone($('#start-date').datebox('getDate'), this._timezone, this._realtimezone).getTime();
    }catch(ex){
      console.log(ex)
    }
    return s;
  }
  de._Impl.prototype.getEndDate = function(){
    var e;
    try{
      e = this.changeDateTimezone($('#end-date').datebox('getDate'), this._timezone, this._realtimezone).getTime();
    }catch(ex){
      console.log(ex)
    }
    return e;
  }
  de._Impl.prototype.getTimezone = function(){
    return this._realtimezone;
  }


  de._Impl.prototype.getDocument = function() {
    return this._containerDiv.ownerDocument;
  };

  de._Impl.prototype.getUnit = function() {
    return this._unit;
  };
  de._Impl.prototype._distributeWidths = function(){
    var length = this.getPixelLength();

    for (var i = 0; i < this._bands.length; i++) {
      var band = this._bands[i];
      band.setViewLength(length);//@@@@当前的宽度
    }
  }

  de._Impl.prototype.getPixelLength = function(){
    return this._orientation == de.HORIZONTAL ? this._containerDiv.offsetWidth : this._containerDiv.offsetHeight;
  }

  de._Impl.prototype.isHorizontal= function(){
    return this._orientation == de.HORIZONTAL;
  }

//  de._Impl.prototype.updateTs = function(ts){
//    this._ts = ts;
//
//    var simTs = []
//    for(var i in ts){
//      simTs.push(ts[i]);
//    }
//
//    for(var tempObj in this._simTs){
//      if(this._simTs[tempObj].type == 'sim'){
//        simTs.push(this._simTs[tempObj]);
//      }
//    }
//    this._simTs = simTs;
//  }

  de._Impl.prototype.getTesttype = function(){
    return $("input[name='task-type']:checked").val();
  }

  de._Impl.prototype.updateTimeSegment = function(date){
    $('.timeline-event-tape').remove();
    var self = this;
    var tss = []
    for(var ts in self._ts){
      tss.push(self._ts[ts].id);
    }
    var sims = []
    for(var sim in self._sim){
      sims.push(self._sim[sim].id);
    }


    var param = {
      guid: self._guid,
      timezone: self._timezone,
      taskDuration: self._taskInfo.taskDuration,
      priority: $('#priority-temp').length == 1 ?$('#priority-temp').val() : self._priority,
//      date: self._currentDate.getTime(),
//      date: date ? date.change2Timezone(0).getTime() : self._currentDate.change2Timezone(0).getTime(),
      date: date ? date.getTime() : self._currentDate.getTime(),
      simTsOrder: self._simTsOrder.toString(),
      ts: tss.toString(),
      sim: sims.toString()
    }

    de.loadJSON(this._url, param, function (data, url) {
      self._eventSource.loadJSON(data, url, self._realtimezone?self._realtimezone : self._timezone);
    });
  }

//  @Deprecated
  de._Impl.prototype.updateTaskDuration = function(taskDuration){
    if(parseInt(taskDuration)>0){
      this._taskDuration = taskDuration > de.TASK_DURATION_MAX ? de.TASK_DURATION_MAX : taskDuration;
    }else{
      this._taskDuration = de.TASK_DURATION_DEFALUT;

    }
    this._taskInfo = {
      taskName: Math.round(this._taskDuration/60) +'min',
      taskDuration: this._taskDuration
    }
    this._mainBand.updateTaskDuration()
  }

  de._Impl.prototype.getGUID = function(){
    return this._guid;
  }

  de._Impl.prototype.getFrequency = function(){
    try{
      return $('#detection-frequency').frequency('getValue')
    }catch(ex){
      return '';
    }
  }

  de._Impl.prototype.getExeDates = function(){
    try{
//    return this._dates ? this._dates : [];
      if(!this._dates) return [];
      var realDates = []
      for(var i=0; i<this._dates.length; i++){
        realDates.push(new Date(this._dates[i].getTime()+(parseFloat(this._timezone)-parseFloat(this._realtimezone))*3600*1000).getTime());
      }
    }catch(ex){console.log(ex);return []}
    return realDates;
  }
  de._Impl.prototype.getTaskDuration = function(){
    return this._taskDuration//单位 秒
  }
  de._Impl.prototype.getTaskType = function(){
    if(this._type == 'grq'){
      return $("input[name='grq-exe-type']:checked").val() //1. 立即， 2. 定时，3. 循环, 6. 每天测6次的， 9.每天测9次的
    }else{
      return $("input[name='task-type']:checked").val() //1. 立即， 2. 定时，3. 循环, 6. 每天测6次的， 9.每天测9次的
    }
  }

  //@Deprecated
  de._Impl.prototype.setTaskType = function(type, date, beginDate, endDate, begintime, frequency){
    var self = this;

    //循环任务
    if(type == 3){
      $('#task-type-circularly').trigger('click');
      $('#start-date').datebox('setDate2', beginDate)
      $('#end-date').datebox('setDate2', endDate)
      self._currentDate = begintime
      self._mainBand._currentDate = begintime
      self._mainBand.fixToDate(begintime, true, function(){self.updateTimeSegment()})


      var h = self._currentDate.getHours();
      var m = self._currentDate.getMinutes();
      var hhmm = (h<10 ? '0'+h: h)+':'+(m<10 ? '0'+m : m);
      $(self._timeSpinner).val(hhmm);

      //hour-1 day-1  week:4,0-1  week:2,0-2 month:1,2,3-2
      self._frequencyInput.frequency('setValue', frequency);
    }
    //定时任务
    else if(type == 2){
      $('#task-type-timely').trigger('click');
//      $('#execute-date').datebox('setDate2', new Date('Fri May 31 2013 00:00:00 GMT+0800'))
//      self._mainBand.fixToDate(new Date('Fri May 31 2013 00:00:00 GMT+0800'))
      self._currentDate = date
//      self._mainBand._currentDate =
      self._mainBand.fixToDate(date, false, function(){self.updateTimeSegment()})
      $('#execute-date').datebox('setDate2', date);
    }
    else if(type == 1){
      $('#task-type-immediately').trigger('click');
    }else if(type == 6){
      $('#grq-exe-six').trigger('click');
      $('#start-date').datebox('setDate2', beginDate)
      $('#end-date').datebox('setDate2', endDate)
      self._currentDate = begintime
      self._mainBand._currentDate = begintime
      self._mainBand.fixToDate(begintime, true, function(){self.updateTimeSegment()})


      var h = self._currentDate.getHours();
      var m = self._currentDate.getMinutes();
      var hhmm = (h<10 ? '0'+h: h)+':'+(m<10 ? '0'+m : m);
      $(self._timeSpinner).val(hhmm);

      //hour-1 day-1  week:4,0-1  week:2,0-2 month:1,2,3-2
      self._frequencyInput.frequency('setValue', frequency);
    }else if(type == 9){
      $('#grq-exe-nine').trigger('click');
      $('#start-date').datebox('setDate2', beginDate)
      $('#end-date').datebox('setDate2', endDate)
      self._currentDate = begintime
      self._mainBand._currentDate = begintime
      self._mainBand.fixToDate(begintime, true, function(){self.updateTimeSegment()})

      var h = self._currentDate.getHours();
      var m = self._currentDate.getMinutes();
      var hhmm = (h<10 ? '0'+h: h)+':'+(m<10 ? '0'+m : m);
      $(self._timeSpinner).val(hhmm);

      //hour-1 day-1  week:4,0-1  week:2,0-2 month:1,2,3-2
      self._frequencyInput.frequency('setValue', frequency);
    }
  }
  /**
   *
   * @param timezone    ra_taskschedule.timezone用户下发任务时的时区（一般为漫游地时区）
   * @param type        任务类型1-立即，2-定时，3-循环
   * @param date        当前时间（定时）
   * @param beginDate   开始时间（循环）
   * @param endDate     结束时间（循环）
   * @param begintime   （循环）
   * @param frequency   （循环）
   */
  de._Impl.prototype.setTaskInfo = function(timezone, type, date, beginDate, endDate, begintime, frequency){
    var self = this;
    self._realtimezone = timezone;
    $('.timeline-timezone-btn').html(de.GMT_2_UTC(timezone));

    self.updateCurrentDateFlag();
    try{
      beginDate = self.changeDateTimezone(beginDate, 0, self._realtimezone);
      endDate = self.changeDateTimezone(endDate, 0, self._realtimezone);
    }catch(ex){console.log(ex)}
    try{
      date = self.changeDateTimezone(date, 0, self._realtimezone);
    }catch(ex){console.log(ex)}
    try{
      begintime = self.changeDateTimezone(begintime, 0, self._realtimezone);
    }catch(ex){console.log(ex)}

    //循环任务
    if(type == 3){
      $('#task-type-circularly').trigger('click');
      $('#start-date').datebox('setDate2', beginDate)
      $('#end-date').datebox('setDate2', endDate)
      self._currentDate = begintime
      self._mainBand._currentDate = begintime
      self._mainBand.fixToDate(begintime, true, function(){self.updateTimeSegment()})


      var h = self._currentDate.getHours();
      var m = self._currentDate.getMinutes();
      var hhmm = (h<10 ? '0'+h: h)+':'+(m<10 ? '0'+m : m);
      $(self._timeSpinner).val(hhmm);

      //hour-1 day-1  week:4,0-1  week:2,0-2 month:1,2,3-2
      self._frequencyInput.frequency('setValue', frequency);
    }
    //定时任务
    else if(type == 2){
      $('#task-type-timely').trigger('click');
//      $('#execute-date').datebox('setDate2', new Date('Fri May 31 2013 00:00:00 GMT+0800'))
//      self._mainBand.fixToDate(new Date('Fri May 31 2013 00:00:00 GMT+0800'))
      self._currentDate = date
//      self._mainBand._currentDate =
      self._mainBand.fixToDate(date, false, function(){self.updateTimeSegment()})
      $('#execute-date').datebox('setDate2', date);
    }
    else if(type == 1){
      $('#task-type-immediately').trigger('click');
    }else if(type == 6){
      $('#grq-exe-six').trigger('click');
      $('#start-date').datebox('setDate2', beginDate)
      $('#end-date').datebox('setDate2', endDate)
      self._currentDate = begintime
      self._mainBand._currentDate = begintime
      self._mainBand.fixToDate(begintime, true, function(){self.updateTimeSegment()})


      var h = self._currentDate.getHours();
      var m = self._currentDate.getMinutes();
      var hhmm = (h<10 ? '0'+h: h)+':'+(m<10 ? '0'+m : m);
      $(self._timeSpinner).val(hhmm);

      //hour-1 day-1  week:4,0-1  week:2,0-2 month:1,2,3-2
      self._frequencyInput.frequency('setValue', frequency);
    }else if(type == 9){
      $('#grq-exe-nine').trigger('click');
      $('#start-date').datebox('setDate2', beginDate)
      $('#end-date').datebox('setDate2', endDate)
      self._currentDate = begintime
      self._mainBand._currentDate = begintime
      self._mainBand.fixToDate(begintime, true, function(){self.updateTimeSegment()})

      var h = self._currentDate.getHours();
      var m = self._currentDate.getMinutes();
      var hhmm = (h<10 ? '0'+h: h)+':'+(m<10 ? '0'+m : m);
      $(self._timeSpinner).val(hhmm);

      //hour-1 day-1  week:4,0-1  week:2,0-2 month:1,2,3-2
      self._frequencyInput.frequency('setValue', frequency);
    }
  }

  //@Deprecated
  de._Impl.prototype.updateSim = function(sims){
    var els = $('div[data-type="sim"]', this._leftPart);

    for(var i=0; i<els.length; i++){
      $(els[i]).attr('data-main-id', sims[i].id);
      $(els[i]).html(sims[i].name)
    }
  }
  //@Deprecated
  de._Impl.prototype.updateTs = function(ts){
    var els = $('div[data-type="ts"]', this._leftPart);

    for(var i=0; i<els.length; i++){
      $(els[i]).attr('data-main-id', ts[i].id);
      $(els[i]).html(ts[i].name)
    }
  }

//  de._Impl.prototype. = function(){}

  de._Impl.prototype.shiftOK = function(index, shift) {
    // Returns true if the proposed shift is ok
    //
    // Positive shift means going back in time
    var going_back = shift > 0,
        going_forward = shift < 0;

    // Is there an edge?
    if ((going_back    && this.timeline_start == null) ||
        (going_forward && this.timeline_stop  == null) ||
        (shift == 0)) {
      return (true);  // early return
    }

    // If any of the bands has noted that it is changing the others,
    // then this shift is a secondary shift in reaction to the real shift,
    // which already happened. In such cases, ignore it. (The issue is
    // that a positive original shift can cause a negative secondary shift,
    // as the bands adjust.)
    var secondary_shift = false;
    for (var i = 0; i < this._bands.length && !secondary_shift; i++) {
      secondary_shift = this._bands[i].busy();
    }
    if (secondary_shift) {
      return(true); // early return
    }

    // If we are already at an edge, then don't even think about going any further
    if ((going_back    && this.timeline_at_start) ||
        (going_forward && this.timeline_at_stop)) {
      return (false);  // early return
    }

    // Need to check all the bands
    var ok = false; // return value
    // If any of the bands will be or are showing an ok date, then let the shift proceed.
    for (var i = 0; i < this._bands.length && !ok; i++) {
      var band = this._bands[i];
      if (going_back) {
        ok = (i == index ? band.getMinVisibleDateAfterDelta(shift) : band.getMinVisibleDate())
            >= this.timeline_start;
      } else {
        ok = (i == index ? band.getMaxVisibleDateAfterDelta(shift) : band.getMaxVisibleDate())
            <= this.timeline_stop;
      }
    }

    // process results
    if (going_back) {
      this.timeline_at_start = !ok;
      this.timeline_at_stop = false;
    } else {
      this.timeline_at_stop = !ok;
      this.timeline_at_start = false;
    }
    // This is where you could have an effect once per hitting an
    // edge of the Timeline. Eg jitter the Timeline
    //if (!ok) {
    //alert(going_back ? "At beginning" : "At end");
    //}
    return (ok);
  };

  /**
   *
   * @return {boolean}
   *  true  验证成功
   *  false 验证失败
   */
  de._Impl.prototype.validate = function(){
    var vali = true
    var taskType = $("input[name='task-type']:checked").val();
    //定时任务
    if(taskType =='2'){
      var exeDate = $('#execute-date').datebox('getText');
      if(!exeDate){
        $('#execute-date').datebox('borderRed')
        vali =false;
      }
      if(this._mainBand._currentDate.getTime()<new Date().getTime()){
        $('#execute-date').datebox('borderRed')
        vali =false;
      }
    }
    //循环任务
    else if(taskType =='3'){
      var startDate = $('#start-date').datebox('getText');
      var endDate = $('#end-date').datebox('getText');
      var freqText = $('#detection-frequency').frequency('getValue');

      if(!startDate){
        $('#start-date').datebox('borderRed')
        vali =false;
      }
      if(!endDate){
        $('#end-date').datebox('borderRed')
        vali =false;
      }

      if(!freqText){
        $('#detection-frequency').frequency('borderRed')
        vali =false;
      }
      if($('.timeline-rightband-month').children().length == 0){
        $('#end-date').datebox('borderRed')
        vali =false;
      }
    }
    if(this._type == 'grq'){
      var startDate = $('#start-date').datebox('getText');
      var endDate = $('#end-date').datebox('getText');
      var freqText = $('#detection-frequency').frequency('getValue');

      if(!startDate){
        $('#start-date').datebox('borderRed')
        vali =false;
      }
      if(!endDate){
        $('#end-date').datebox('borderRed')
        vali =false;
      }

      if(!freqText){
        $('#detection-frequency').frequency('borderRed')
        vali =false;
      }
    }
    return vali;
  }


  w.StormDetection = de;
})(window);

