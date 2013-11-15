/**
 * band.js
 * A band is responsible for supporting panning as well as coordinating its various sub-components:
 */
(function(de){




  de._Band = function(timeline, bandInfo, index) {

    this._timeline = timeline;
    this._bandInfo = bandInfo;
    this._isDragging = true;
    this._currentDate = bandInfo.currentDate;
    this._index = index;
    this._locale = ("locale" in bandInfo) ? bandInfo.locale : de.getDefaultLocale();
    this._timezone = ("timezone" in bandInfo) ? bandInfo.timezone : 0;
    this._labeller = ("labeller" in bandInfo) ? bandInfo.labeller :
      (("createLabeller" in timeline.getUnit()) ?
        timeline.getUnit().createLabeller(this._locale, this._timezone) :
        new de.GregorianDateLabeller(this._locale, this._timezone));
    this._viewOffset = 0;


    var self = this;


    /*
     *  Install a textbox to capture keyboard events
     */
    var inputDiv = this._timeline.getDocument().createElement("div");
    inputDiv.type = 'hidden';
    inputDiv.className = "timeline-band-input";
    this._timeline.addDiv(inputDiv);


    this.updateTaskDuration();

    this._keyboardInput = document.createElement("input");
    this._keyboardInput.type = "text";
    inputDiv.appendChild(this._keyboardInput);
    Storm.DOM.registerEventWithObject(this._keyboardInput, "keydown", this, "_onKeyDown");
    Storm.DOM.registerEventWithObject(this._keyboardInput, "keyup", this, "_onKeyUp");

    //band
    this._div = this._timeline.getDocument().createElement("div");
    this._div.id = "timeline-band-" + index;
    this._div.className = "timeline-band timeline-band-" + index;
    this._timeline.addBandDiv(this._div);


//    $(this._div).mousedown(self._onMouseDown).mousemove(self._onMouseMove).mouseup(self._onMouseUp).mouseout(self._onMouseOut);
    Storm.DOM.registerEventWithObject(this._div, "mousedown", this, "_onMouseDown");
    Storm.DOM.registerEventWithObject(this._div, "mousemove", this, "_onMouseMove");
    Storm.DOM.registerEventWithObject(this._div, "mouseup", this, "_onMouseUp");
    Storm.DOM.registerEventWithObject(this._div, "mouseout", this, "_onMouseOut");


    this.addEventBtn();

    /*
     *  The inner div that contains layers
     */
    this._innerDiv = this._timeline.getDocument().createElement("div");
    this._innerDiv.className = "timeline-band-inner";
    this._div.appendChild(this._innerDiv);


    /*
    *  Initialize parts of the band
    */
    this._ether = bandInfo.ether;
//    ether.js---LinearEther
    bandInfo.ether.initialize(this, timeline);

    this._etherPainter = bandInfo.etherPainter;
    bandInfo.etherPainter.initialize(this, timeline);//初始化画板

    this._eventSource = bandInfo.eventSource;
    if (this._eventSource) {
      this._eventListener = {
        onAddMany: function() { self._onAddMany(); },
        onClear:   function() { self._onClear(); }
      }
      this._eventSource.addListener(this._eventListener);
    }
    this._eventPainter = bandInfo.eventPainter;
    this._eventPainter.initialize(this, timeline);
//    this._currentDate = bandInfo.currentDate;
//    this.fixToDate(this._currentDate);
//    this.computeTime();
//    this.fixToDate(this._currentDate);
  }

  //contants
  de._Band.SCROLL_MULTIPLES = 5;

  de._Band.prototype._onKeyDown = function (keyboardInput, evt, target) {
//    if (!this._dragging) {
//      switch (evt.keyCode) {
//        case 27: // ESC
//          break;
//        case 37: // left arrow
//        case 38: // up arrow
//          this._scrollSpeed = Math.min(50, Math.abs(this._scrollSpeed * 1.05));
//          this._moveEther(this._scrollSpeed);
//          break;
//        case 39: // right arrow
//        case 40: // down arrow
//          this._scrollSpeed = -Math.min(50, Math.abs(this._scrollSpeed * 1.05));
//          this._moveEther(this._scrollSpeed);
//          break;
//        default:
//          return true;
//      }
//      this.closeBubble();
//
//      SimileAjax.DOM.cancelEvent(evt);
//      return false;
//    }
    return true;
  };

  de._Band.prototype._onKeyUp = function(keyboardInput, evt, target) {
//    if (!this._dragging) {
//      this._scrollSpeed = this._originalScrollSpeed;
//
//      switch (evt.keyCode) {
//        case 35: // end
//          this.setCenterVisibleDate(this._eventSource.getLatestDate());
//          break;
//        case 36: // home
//          this.setCenterVisibleDate(this._eventSource.getEarliestDate());
//          break;
//        case 33: // page up
//          this._autoScroll(this._timeline.getPixelLength());
//          break;
//        case 34: // page down
//          this._autoScroll(-this._timeline.getPixelLength());
//          break;
//        default:
//          return true;
//      }
//
//      this.closeBubble();
//
//      SimileAjax.DOM.cancelEvent(evt);
//      return false;
//    }
    return true;
  };

  de._Band.prototype._onMouseDown = function(innerFrame, evt, target) {
//    this.closeBubble();
    this._dragging = true;
    this._dragX = evt.clientX;
    this._dragY = evt.clientY;
  };
  de._Band.prototype._onMouseMove = function(innerFrame, evt, target) {
    if (this._dragging && this._isDragging) {
      var diffX = evt.clientX - this._dragX;
      var diffY = evt.clientY - this._dragY;

      this._dragX = evt.clientX;
      this._dragY = evt.clientY;

      this._moveEther(this._timeline.isHorizontal() ? diffX : diffY);
//      this._positionHighlight();
    }
  };

  de._Band.prototype.updateTaskDuration = function(){
    var oldCon = document.getElementsByClassName('timeline-task-container')[0];
    if(oldCon){
      this._timeline._mainBandContainer.removeChild(oldCon);
    }
    var b = this;
    //-----------------------------taskContainer begin------------------------------------------
    var taskContainer = this._timeline.getDocument().createElement("div");
    taskContainer.className = 'timeline-task-container';
    var taskWidth = this._timeline._taskInfo.taskDuration/this._timeline._seconds_pixel;
    taskContainer.style.width = taskWidth+'px';

    var height = (de.SIMTS_TITLE_HEIGHT + de.SIMTS_HEIGHT * this._timeline._simTs.length + de.TASK_TITLE_HEIGHT)

    taskContainer.style.height = height+de.CURRENT_TIME_LABEL_HEIGHT +'px';
    taskContainer.style.top = '-'+de.TASK_TITLE_HEIGHT+'px';
    var taskLeft = (this._timeline._mainBandContainer.parentElement.style.width.split('px')[0]/2 - taskWidth/2 + de.SIMTS_WIDTH/2);
    taskContainer.style.left = taskLeft +'px';

    var taskTitle = this._timeline.getDocument().createElement("div");
    taskTitle.className = 'timeline-tasktitle';
    taskTitle.innerHTML = this._timeline._taskInfo.taskName;
    var currentTime = this._timeline.getDocument().createElement("div");
//    currentTime.id = 'timeline-current-time';
    currentTime.style.position = 'absolute';
    currentTime.style.left = 0;
    currentTime.style.top = height+5+'px';

    var timeSpinner = this._timeline.getDocument().createElement("input");
    timeSpinner.style.border = 'none';
    timeSpinner.id = 'timeline-current-time';

    this._timeline._timeSpinner = timeSpinner;
    currentTime.appendChild(timeSpinner);

    $(timeSpinner).timespinner({
      width: 50,
      isLabel: true,
      onChange: function(hhmm){
//        console.log(hhmm+'--onChange')
        var newDate = new Date(b._currentDate.getTime());
        newDate.setHours(hhmm.split(':')[0]);
        newDate.setMinutes(hhmm.split(':')[1]);

        b.fixToDate(newDate);
      }
    });
//    TODO spinnertime不显示
    try{
      var h = this._currentDate.getHours();
      var m = this._currentDate.getMinutes();
      $(timeSpinner).timespinner('setValue', h+':'+m);
    }catch(ex){}

    var taskMid = this._timeline.getDocument().createElement("div");
    taskMid.className = 'timeline-task-mid';
    taskMid.style.width = '100%'
    taskMid.style.height = (de.SIMTS_HEIGHT * this._timeline._simTs.length+de.SIMTS_TITLE_HEIGHT-1) +'px'
    taskContainer.appendChild(taskTitle);
    taskContainer.appendChild(taskMid);


    taskContainer.appendChild(currentTime)
    this._timeline._mainBandContainer.appendChild(taskContainer);
    this._timeline._taskContainer = taskContainer;
//-----------------------------taskContainer end------------------------------------------
  }

  de._Band.prototype._onMouseUp = function(innerFrame, evt, target) {
//    $('#timeline-band-0').removeClass('dragging');
    if($("input[name='task-type']:checked").val() == 1){
      $('#task-type-timely').trigger('click');
    }
    this._dragging = false;
    this._keyboardInput.focus();
    this.computeTime();
    if(this._timeline._taskType === 'timely'){
      this.syncDatebox();
    }
    if(this._timeline._taskType === 'cycle'){
      this._timeline._rightBand.setDate(this._timeline.getCurrentDate());
    }
    var dateOfRealtimezone = new Date(new Date().getTime()-(this._timeline._timezone - this._timeline._realtimezone)*3600000);
    if(this._timeline.getCurrentDate().getTime() < dateOfRealtimezone){
      this.fixToDate(dateOfRealtimezone)//当前时间
      this._timeline.updateCurrentDateFlag(dateOfRealtimezone);
    }
  };

  de._Band.prototype._onMouseOut = function(innerFrame, evt, target) {
    if($("input[name='task-type']:checked").val() == 1) return ;
    this._onMouseUp(innerFrame, evt, target);

//    this._dragging = false;
//    var coords = SimileAjax.DOM.getEventRelativeCoordinates(evt, innerFrame);
//    coords.x += this._viewOffset;
//    if (coords.x < 0 || coords.x > innerFrame.offsetWidth ||
//      coords.y < 0 || coords.y > innerFrame.offsetHeight) {
//      this._dragging = false;
//    }
//    this.computeTime();
  };

  de._Band.prototype._moveEther = function(shift) {
//    this.closeBubble();

    var self = this;
    this.computeTime();
    // A positive shift means back in time
    // Check that we're not moving beyond Timeline's limits
    if (!this._timeline.shiftOK(this._index, shift)) {
      return; // early return
    }
    this._viewOffset += shift;
    this._ether.shiftPixels(-shift);
//    if (this._timeline.isHorizontal()) {
      this._div.style.left = this._viewOffset + "px";
//    jquery动画 begin
//      $(this._div).animate({
//        left: self._viewOffset
//      }, 1000, null, function(){
//        if (self._viewOffset > -self._viewLength * 0.5 ||
//            self._viewOffset < -self._viewLength * (de._Band.SCROLL_MULTIPLES - 1.5)) {
////      重新计算
//          self._recenterDiv();
//        } else {
////      this.softLayout();
//        }
//      });
//      jquery动画 end

//      this._div.style.left = 200+ "px";
//    } else {
//      this._div.style.top = this._viewOffset + "px";
//    }

    if (this._viewOffset > -this._viewLength * 0.5 ||
      this._viewOffset < -this._viewLength * (de._Band.SCROLL_MULTIPLES - 1.5)) {

//      重新计算
      this._recenterDiv();
    } else {
//      this.softLayout();
    }
//
//    this._onChanging();
  }
  /**
   *
   * TODO 修改定时任务日期时，detectionTask
   * @param shift
   * @param opacity 是否出现透明度渐变
   * @private
   */
  de._Band.prototype._moveEther2 = function(shift, callback, opacity) {

    if(callback) setTimeout(callback, 1500);

    if(opacity)
      opacity = true;
    else
      opacity = false;
//    this.closeBubble();

    var self = this;
//    this.computeTime();
    // A positive shift means back in time
    // Check that we're not moving beyond Timeline's limits
    if (!this._timeline.shiftOK(this._index, shift)) {
      return; // early return
    }
    this._viewOffset += shift;
    this._ether.shiftPixels(-shift);
//    普通
//    this._div.style.left = this._viewOffset + "px";
//    if (this._viewOffset > -this._viewLength * 0.5 ||
//        this._viewOffset < -this._viewLength * (de._Band.SCROLL_MULTIPLES - 1.5)) {
//
////      重新计算
//      this._recenterDiv();
//    } else {
////      this.softLayout();
//    }
//    jquery动画
    var _div = this._div;
    if(!opacity){
      self._isDragging = false;
      $(this._div).stop().animate({
        left: self._viewOffset
      }, 1000, null, function(){
        self._isDragging = true;
        if (self._viewOffset > -self._viewLength * 0.5 ||
            self._viewOffset < -self._viewLength * (de._Band.SCROLL_MULTIPLES - 1.5)) {
//      重新计算
          self._recenterDiv();
        } else {
//      this.softLayout();
        }
        self.computeTime();
//        callback()
//        $(_div).animate({
////        left: self._viewOffset,
//          opacity: 1
//        }, 1000, null,function(){});
      });
    }else{
      self._isDragging = false;
      $(this._div).stop().animate({
        left: self._viewOffset,
        opacity: 0
      }, 1000, null, function(){
        self._isDragging = true;
        if (self._viewOffset > -self._viewLength * 0.5 ||
            self._viewOffset < -self._viewLength * (de._Band.SCROLL_MULTIPLES - 1.5)) {
//      重新计算
          self._recenterDiv();
        } else {
//      this.softLayout();
        }
        self.computeTime();
        $(_div).stop().animate({
//          left: self._viewOffset,
          opacity: 1
        }, 1000, null,function(){});
      });

    }


//    console.log(this._currentDate+'-_moveEther2');
//    this._onChanging();
  }


  de._Band.prototype._onAddMany = function() {
    this._paintEvents();
  };

  de._Band.prototype._onClear = function() {
    this._paintEvents();
  };

  de._Band.prototype._paintEvents = function() {
    this._eventPainter.paint();
  };

  //重新设置band的长度和位置，画新的刻度
  de._Band.prototype._recenterDiv = function(){
    this._viewOffset = -this._viewLength * (de._Band.SCROLL_MULTIPLES - 1) / 2;
    //horizontal
    this._beginDate = this.getMinDate();
    if (this._timeline.isHorizontal()) {
      this._div.style.left = this._viewOffset + "px";//@@@@设置band的left 及 width
      this._div.style.width = (de._Band.SCROLL_MULTIPLES * this._viewLength) + "px";
    } else {
//      this._div.style.top = this._viewOffset + "px";
//      this._div.style.height = (Timeline._Band.SCROLL_MULTIPLES * this._viewLength) + "px";
    }
    this.layout();

  }


  de._Band.prototype.addEventBtn = function(){

    var self = this;
    $('#shift-btn').click(function(){
      var targetDate = new Date($('#shift-pix').val());

      var offsetPix = (self._currentDate.getTime() - targetDate.getTime())/1000/60

      self._moveEther(offsetPix);
    })

    $('#get-current-date').click(function(){
      alert(self._currentDate);
    })

  }

  de._Band.prototype.syncDatebox = function(){
    if(this._timeline._timelyDateInput){
      this._timeline._timelyDateInput.datebox('setDate', this._currentDate)
    }
  }

  /**
   * 填充timespinner
   */
  de._Band.prototype.computeTime = function(){

    var taskCon = this._timeline._taskContainer;

    var taskLeft = taskCon.style.left.split('px')[0];
    var taskWidth = taskCon.style.width.split('px')[0];

    var bandLeft = this._div.style.left.split('px')[0];

    var offsetX = Math.round(taskLeft-bandLeft-de.SIMTS_WIDTH);
    var offsetMillisecond = offsetX * this._timeline._seconds_pixel*1000;
    var startDate = this.getMinDate();
    var timeSpinner = this._timeline._timeSpinner;

    var currentTime = new Date(startDate.getTime()+offsetMillisecond)
    currentTime.setSeconds(0);
//    if(currentTime.getTime()<new Date().getTime()){
//      try{
//          this.fixToDate(new Date().getTime());
//          return ;
//      }catch(ex){
//
//      }
//      return ;
//    }
    var h = currentTime.getHours();
    var m = currentTime.getMinutes();
    var hhmm = (h<10 ? '0'+h: h)+':'+(m<10 ? '0'+m : m);
    this._currentDate = currentTime;
//    this._timeline._current
    $(timeSpinner).val(hhmm);
    $('#execute-date').datebox('setDate2', currentTime);
//    if($('#lastes-time').length == 1)$('#lastes-time').remove();
////    var a = $('<div id="lastes-time" style="color: red">').html(currentTime.getYear()+'-'+(currentTime.getMonth()+1)+'-'+currentTime.getDay()+' '+currentTime.getHours()+':'+currentTime.getMinutes()+":"+currentTime.getSeconds());

//    var a = $('<div id="lastes-time" style="color: red">').html(currentTime.toString());
//    $('.timeline-type-title').append(a);
    if(this._timeline._type != 'grq' && $("input[name='task-type']:checked").val() == 3)
      $('#detection-frequency').frequency('reClick')

  }

  de._Band.prototype.createLayerDiv = function(zIndex, className) {
    var div = this._timeline.getDocument().createElement("div");
    div.className = "timeline-band-layer" + (typeof className == "string" ? (" " + className) : "");
    div.style.zIndex = zIndex;
    this._innerDiv.appendChild(div);

    var innerDiv = this._timeline.getDocument().createElement("div");
    innerDiv.className = "timeline-band-layer-inner";
    if (Storm.Platform.browser.isIE) {
      innerDiv.style.cursor = "move";
    } else {
      innerDiv.style.cursor = "-moz-grab";
    }
    div.appendChild(innerDiv);

    return innerDiv;
  };

  de._Band.prototype.dateToPixelOffset = function(date) {
    return this._ether.dateToPixelOffset(date) - this._viewOffset;
  };

  de._Band.prototype.getIndex = function() {
    return this._index;
  };

  de._Band.prototype.getLabeller = function() {
    return this._labeller;
  };

  de._Band.prototype.getMinDate = function(){
    return this._ether.pixelOffsetToDate(this._viewOffset);
  }

  de._Band.prototype.getMaxDate = function(){
    return this._ether.pixelOffsetToDate(this._viewOffset + de._Band.SCROLL_MULTIPLES * this._viewLength);
  }

  de._Band.prototype.getEventSource = function() {
    return this._eventSource;
  };
  de._Band.prototype.getTimezone = function() {
    return this._timezone;
  };

  de._Band.prototype.getMinVisibleDate = function() {
    return this._ether.pixelOffsetToDate(0);
  };

  de._Band.prototype.getMinVisibleDateAfterDelta = function(delta) {
    return this._ether.pixelOffsetToDate(delta);
  };

  de._Band.prototype.getMaxVisibleDate = function() {
    // Max date currently visible on band
    return this._ether.pixelOffsetToDate(this._viewLength);
  };

  de._Band.prototype.getMaxVisibleDateAfterDelta = function(delta) {
    // Max date visible on band after delta px view change is applied
    return this._ether.pixelOffsetToDate(this._viewLength + delta);
  };

  /**
   *
   * @param date
   * @param noanimate true不使用动画
   */
  de._Band.prototype.fixToDate = function(date, noanimate, callback){
//    TODO
//    this._currentDate = date;
    //TODO 60
    var offsetPix = Math.round((this._currentDate.getTime() - date.getTime())/1000/60);

    if(noanimate){
      this._moveEther(offsetPix)
    }else{
      if(Math.abs(offsetPix) < 1500){
//      不用透明度渐变
        this._moveEther2(offsetPix, callback,false);
      }else{
        this._moveEther2(offsetPix, callback);
      }
    }




  }
  de._Band.prototype.layout= function(){
    this._etherPainter.paint();//画刻度
    this._eventPainter.paint();
//    console.log(this._currentDate+'layout')
  }

  de._Band.prototype.removeLayerDiv = function(div) {
    this._innerDiv.removeChild(div.parentNode);
  };
  de._Band.prototype.setViewLength= function(length){
    this._viewLength = length;
    this._recenterDiv();
//    this._onChanging();
  }



//  de._Band.prototype.= function(){}




})(StormDetection);

