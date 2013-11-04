/**
 *
 * Thanks Kevin
 * His blog is here:
 * http://kevinleung.com/about-me/
 *
 */


(function ($) {

  //缓动函数及全局id
  var rafid;
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
    return window.setTimeout(function () {
      callback(+new Date());
    }, 1000 / 60);
  };

  //全局
  var timeline;

  //ajax请求数据
  var ra_lastMonth,ra_currentMonth, ra_nextMonth, ra_lastMonthEvents=[], ra_currentMonthEvents=[], ra_nextMonthEvents=[];

  var DAY_IN_MILLISECONDS = 86400000;
  //曲线的控制点
  var DROP_C_SIZE = 10;
  var DROP_INTERVAL_SIZE = 120;

  var targetEl;
  var targetElOpts;
  //动画
  var timeouter;
  //正在跳动的drop
  var currentAnimDrop;
  //正在跳动的drop的初始路径
  var currentAnimDropD;

  /**
   * 颜色
   *
   */
  var DROP_COLOR = {
    green: '#acf4bf',
    red: '#ffd2b3',
    blue: '#b3deff'
  }

  /**
   * 动画函数
   * setTimeout实现
   * @param wdEl
   */
  function animateWaterdrop(wdEl){
    //不是drop（绘制的水滴）
    if(wdEl.classList.length== 0 || wdEl.classList[0].indexOf('path-drop')<0) return ;

    if(wdEl == currentAnimDrop){
      return ;
    }else{
      clearTimeout(timeouter);
      if(currentAnimDrop){
        currentAnimDrop.setAttributeNS(null, 'd', currentAnimDropD);
      }
    }
    var currentWD = wdEl.getAttributeNS(null, 'd');
    currentAnimDrop = wdEl;
    currentAnimDropD = currentWD;

    //"M476,130C376,30,576,30,476,130"
    //IE
    //"M 320 130 C 220 50 420 50 320 130"
    if(currentWD.indexOf(',')<0){
      var ieds = currentWD.split(' ');
      currentWD = 'M'+ieds[1]+','+ieds[2]+'C'+ieds[4]+','+ieds[5]+','+ieds[6]+','+ieds[7]+','+ieds[8]+','+ieds[9]
    }
    var sWD = currentWD;
    var cxy = sWD.split('C')[1].split(',');
    var x = cxy[4];
    var y =cxy[5];
    var cx1 = cxy[0]-DROP_C_SIZE;
    var cy1 = cxy[1]-DROP_C_SIZE;
    var cx2 = parseInt(cxy[2])+DROP_C_SIZE;
    var cy2 = cxy[3]-DROP_C_SIZE;
    var bWD = "M"+x+","+y+"C"+cx1+","+cy1+","+cx2+","+cy2+","+x+","+y;
    var newWD = bWD;
    cycle_throb();

    function cycle_throb(){
      var currentWD = wdEl.getAttributeNS(null, 'd');

      if(currentWD.indexOf(',')<0){
        var ieds = currentWD.split(' ');
        currentWD = 'M'+ieds[1]+','+ieds[2]+'C'+ieds[4]+','+ieds[5]+','+ieds[6]+','+ieds[7]+','+ieds[8]+','+ieds[9]
      }
      if (newWD != currentWD) {
        var changed = false;

        var cArray = currentWD.split(',');
        var nArray = newWD.split(',');
        var descArray = []
        descArray.push(cArray[0]);
        descArray.push(cArray[1].split('C')[0])
        descArray.push('C'+(cArray[1].split('C')[1]))
        descArray.push(cArray[2]);
        descArray.push(cArray[3]);
        descArray.push(cArray[4]);
        descArray.push(cArray[5]);
        descArray.push(cArray[6]);

        var newArray = []
        newArray.push(nArray[0]);
        newArray.push(nArray[1].split('C')[0])
        newArray.push('C'+(nArray[1].split('C')[1]))
        newArray.push(nArray[2]);
        newArray.push(nArray[3]);
        newArray.push(nArray[4]);
        newArray.push(nArray[5]);
        newArray.push(nArray[6]);

//          var descArray = currentWD.split(' '); //.split(/\W+/);
//          var newArray = newWD.split(' ');

        for (var n = 0; descArray.length > n; n++) {
          if (descArray[n]) {

            header = descArray[n].match(/\D/);
            var eachDescNum = Number(descArray[n].match(/\d+/));
            var eachNewNum = Number(newArray[n].match(/\d+/));
            if(newArray[n].indexOf('-')>-1){
              eachNewNum = -eachNewNum;
            }

            if(descArray[n].indexOf('-')>-1){
              eachDescNum = -eachDescNum;
            }


            if (eachNewNum > eachDescNum) {
              eachDescNum++;
              changed = true;
            }
            else if (eachNewNum < eachDescNum) {
              eachDescNum--;
              changed = true;
            }

            if(header == 'C'){
              descArray[n] = header.toString()+eachDescNum;
            }else if(header == '-'){
              descArray[n] = eachDescNum;
            }else{
              descArray[n] = header + eachDescNum;
            }

          }
        }

//          var tempDesc = descArray.join(',');
        var tempDesc = descArray[0]+','+descArray[1]+descArray[2]+','+descArray[3]+','+descArray[4]+','+descArray[5]+','+x+','+y;
        wdEl.setAttributeNS(null, 'd', tempDesc);

        if (changed) {
          timeouter = setTimeout(cycle_throb, 40);
        }else{
          if(newWD == sWD){
            newWD = bWD;
          }else{
            newWD = sWD;
          }
          timeouter = setTimeout(cycle_throb,300);
        }
      }else{
        if(newWD == sWD){
          newWD = bWD;
        }else{
          newWD = sWD;
        }
        timeouter = setTimeout(cycle_throb,300);
      }
    }
  }

  function getLeft(elem) {
    // parseInt automatically tosses the "px" off the end
    return parseInt(elem.style.left);
  }

  // chronoline.js v0.1.1
  // by Kevin Leung for Zanbato, https://zanbato.com
  // MIT license at https://github.com/StoicLoofah/chronoline.js/blob/master/LICENSE.md

  /**
   *  初始化时间轴
   *
   * @param domElement
   * @param events
   * @param options
   * @constructor
   */
  function Chronoline(domElement, events, options, desc) {
    this.VERSION = "0.1.1";

    $(targetEl).html('');

    var defaults = {
      ctrlTopMargin: 100,
      dateLabelHeight: 50, // how tall the bottom margin for the dates is
      hashColor: '#b8b8b8',

      scrollable: true,
      draggable: false, // requires jQuery, allows mouse dragging

      continuousScroll: true,  // requires that scrollable be true, click-and-hold arrows
      continuousScrollSpeed: 1  // I believe this is px/s of scroll. There is no easing in it
    }
    var t = this;

    // FILL DEFAULTS
    for (var attrname in defaults) {
      t[attrname] = defaults[attrname];
    }
    for (var attrname in options) {
      t[attrname] = options[attrname];
    }


    // HTML elements to put everything in
    t.domElement = domElement;
    t.domElement.style.width='960px';

    t.wrapper = document.createElement('div');
    t.wrapper.className = 'chronoline-wrapper';
    t.domElement.appendChild(t.wrapper);

    /**
     * description
     */
    var descEl = $('<div style="text-align: center;" id="task-desc">');
    descEl.html(desc)
    t.domElement.appendChild(descEl[0]);

    t.events = events;

    // 2 handy utility functions
    t.pxToMs = function (px) {
      return t.startTime + px / t.pxRatio;
    }
    //TODO 还没看懂
    t.msToPx = function (ms) {
      return (ms - t.startTime) * t.pxRatio;
    }

    /**
     * 创建控制按钮
     */
    if(options.showRadio){
      t.controlRaio = $('<div class="chronoline-radio"><label class="chronoline-radio-selected"><s><b></b></s><span>'
          +targetElOpts.faultCases+'</span></label></div>');
      t.controlRaio.click(function(){
        if($('.chronoline-radio').hasClass('chronoline-radio-selected')){
          loadSubtaskinfo(false);
        }else{
          loadSubtaskinfo(true);
        }
      });
      t.wrapper.appendChild(t.controlRaio[0]);
    }

    /**
     * 创建图例
     */
    t.legend = $('<div class="timeline-extend"> <a id="timeline_help" class="timeline-help" href="javascript:void(0)"></a><div id="timeline_help_box" class="timeline-help-box" style="width: 0; display: hidden;"><div class="timeline-help-doc"><s class="g"></s><span>Pass</span><s class="r"></s><span>Fail</span><s class="b"></s><span>Recovery validation testing</span></div></div></div>')[0];
    t.wrapper.appendChild(t.legend);
    $('#timeline_help').toggle(function(){
      $('#timeline_help_box').show().animate({"width":"240px"});
    },function(){
      $('#timeline_help_box').animate({"width":"0"},function(){$('#timeline_help_box').hide();});
    });

    //移动控制区域显隐
    $(targetEl).mouseenter(function(event){
      if($(event.relatedTarget).parents('#'+targetEl.id).length == 0){
        $(targetEl).find('.move-region').css('background-color','#e4e4e4');
      }

//      if(event.target.id == targetEl.id){
//
//      }
//      if($(event.target).parents('#'+targetEl.id).length > 0){
//        return ;
//      }
    }).mouseout(function(event){
          if($(event.relatedTarget).parents('#'+targetEl.id).length == 0){
            $(targetEl).find('.move-region').css('background-color','#fff');
          }
//          if($(event.target).parents('#'+targetEl.id).length > 0){
//            return ;
//          }
//          console.log('out')
//          $(targetEl).find('.move-region').css('backgroud-color','#fff');
        });


    t.myCanvas = document.createElement('div');
    t.myCanvas.className = 'chronoline-canvas';

    t.wrapper.appendChild(t.myCanvas);

    //TODO 180高度
    t.totalHeight = 180;//svg高度
    t.displayWidth = 760;//展示svg的div宽度
    t.sidesWidth = 160;//两侧空白宽度，每侧80
    if(events.length<7){
      t.totalWidth = 760
    }else{
      t.totalWidth = (events.length-1)*DROP_INTERVAL_SIZE+t.sidesWidth;//svg总长度
    }

    t.maxLeftPx = t.totalWidth - t.displayWidth;

    t.paper = Raphael(t.myCanvas, t.totalWidth, t.totalHeight);
    $(t.paper.canvas).attr("id", "raphael-task");
    t.paperType = t.paper.raphael.type;
    t.paperElem = t.myCanvas.childNodes[0];
    $(t.paperElem).click(function(e){
      //点击中间文字
      if(e.target.tagName === 'tspan'){
        var dropPathEl = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling;
        animateWaterdrop(dropPathEl);
        targetElOpts.clickFun.call(this, dropPathEl.id);
        //点击气泡
      }else if(e.target.tagName === 'path'){
        animateWaterdrop(e.target);
        targetElOpts.clickFun.call(this, e.target.id);
      }
    });

    /*
     * defs中的定义的滤镜
     */
    var f_green = '<radialGradient id="rg-green" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">' +
        '<stop offset="0%" style="stop-color:#B8F6C5; stop-opacity:.5"/>' +
        '<stop offset="50%" style="stop-color:#B8F6C5;stop-opacity:.9"/>' +
        '</radialGradient>';

    // Create dummy svg with filter definition
    $("body").append('<svg id="dummy" style="display:none"><defs>' + f_green + '</defs></svg>');
    // Append filter definition to Raphael created svg
    $("#p defs").append($("#dummy").find('defs').children());
    // Remove dummy
    $("#dummy").remove();


    // DRAWING
    t.floatingSet = t.paper.set();
    t.sectionLabelSet = t.paper.set();

    /**
     * baseline
     *
     */
    var dateLineY = t.totalHeight - t.dateLabelHeight+2;
    var baseline = t.paper.path('M0,' + dateLineY + 'L' + t.totalWidth + ',' + dateLineY);
    //TODO 线和颜色
    baseline.attr('stroke', '#e3eff5');
    baseline.attr('stroke-width', 2);


    /**
     * 画子任务（水滴）
     * @param x
     * @param y
     * @param ax
     * @param ay
     * @param bx
     * @param by
     * @param zx
     * @param zy
     * @param color
     */
    function drawDrop(x, y, ax, ay, bx, by, zx, zy, color, text, innerText, id) {


      var path = [["M", x, y], ["C", ax, ay, bx, by, zx, zy]];
      var p = t.paper.path(path).attr({stroke: color || Raphael.getColor(), "stroke-width": 1,"fill": color});
      p.node.setAttribute("class","path-drop");
      p.node.setAttribute("id",id);

      t.paper.circle(x, 132, 3).attr({stroke: color, fill: color});
      t.paper.text(x, 150 ,text);

      var it = t.paper.text(x, 95, innerText);
      it.node.setAttribute("class","path-drop");
      it.node.setAttribute("data-id",id);

      //TODO
      return [p,it];
    }

    // drawing events
    var startX = 80;
    for(var j=0; j<events.length; j++){
      var elems = drawDrop(startX, 130, startX-100, 50, startX+100, 50, startX, 130, DROP_COLOR[events[j].dataColor], events[j].title, events[j].note, events[j].id);
      startX+=DROP_INTERVAL_SIZE;
    }

    t.drawnStartMs = null;
    t.drawnEndMs = null;

    t.isMoving = false;
    t.goToPx = function (finalLeft, isAnimated, isLabelsDrawn) {
      /*
       finalLeft is negative

       I tried several implementations here, including:
       - moving the left of the canvas within a wrapper (current strategy)
       - animating setViewbox using getAnimationFrame
       - animating each individual element using getAnimation frame

       - animating floating content using getAnimation (current strategy)
       - animating floating content using raphael.animate
       This solution is by far the smoothest and doesn't have any asynchrony problems. There's some twitching going on with floating content, but it's not THAT bad
       */
      if (t.isMoving) return false;

      isAnimated = typeof isAnimated !== 'undefined' ? isAnimated : t.animated;
      isLabelsDrawn = typeof isLabelsDrawn !== 'undefined' ? isLabelsDrawn : true;

      finalLeft = Math.max(Math.min(finalLeft, 0), -t.maxLeftPx);

//      if (isLabelsDrawn)
//        t.drawLabels(-finalLeft);

      var left = getLeft(t.paperElem);

      // hide scroll buttons if you're at the end
      if (t.scrollable) {
        if (finalLeft == 0) {
          t.moveRegionLeft.style.display = 'none';
          t.isScrolling = false;
        } else {
          t.moveRegionLeft.style.display = '';
        }
        if (finalLeft == t.displayWidth - t.totalWidth) {
          t.moveRegionRight.style.display = 'none';
          t.isScrolling = false;
        } else {
          t.moveRegionRight.style.display = '';
        }
      }

      var movingLabels = [];

      if (isAnimated) {
        t.isMoving = true;

        var start = null;
        var elem = t.paperElem;

        function step(timestamp) {
          if (start == null)
            start = timestamp;
          var progress = (timestamp - start) / 200;
          var pos = (finalLeft - left) * progress + left;
          elem.style.left = pos + "px";

          // move the labels
          for (var i = 0; i < movingLabels.length; i++) {
            movingLabels[i][0].attr('x', movingLabels[i][2] * progress + movingLabels[i][1]);
          }

          if (progress < 1) {  // keep going
            requestAnimationFrame(step);
          } else {  // put it in its final position
            t.paperElem.style.left = finalLeft + "px";
            for (var i = 0; i < movingLabels.length; i++) {
              movingLabels[i][0].attr('x', movingLabels[i][2] + movingLabels[i][1]);
            }
            t.isMoving = false;
          }
        }

        requestAnimationFrame(step);

      } else {  // no animation is just a shift
        t.paperElem.style.left = finalLeft + 'px';
        for (var i = 0; i < movingLabels.length; i++) {
          movingLabels[i][0].attr('x', movingLabels[i][2] + movingLabels[i][1]);
        }
      }

      return finalLeft != 0 && finalLeft != -t.maxLeftPx;
    }

    /**
     * left&right
     */
    if (t.scrollable) {
      //-----------------左侧控制区域--begin--------------------
      t.leftControl = document.createElement('div');
      t.leftControl.className = 'chronoline-left';
      t.leftControl.style.marginTop = t.ctrlTopMargin + 'px';

      var controlHeight = 60;//Math.max(t.eventsHeight, t.leftControl.clientHeight);

      //上一月按钮
      if(ra_lastMonth &&ra_lastMonth !=''){
        var prevMonth = document.createElement('div');
        t.prevMonth = prevMonth;
        prevMonth.className = 'prev'//'chronoline-left-icon';
        prevMonth.innerHTML = '‹'
        $(prevMonth).click(function(){
          if($('.chronoline-radio').hasClass('chronoline-radio-selected')){
            reLoadSubtaskinfo(false, ra_lastMonth, 'last');
          }else{
            reLoadSubtaskinfo(true, ra_lastMonth, 'last');
          }
        });
        t.leftControl.appendChild(prevMonth);
      }


//      移动控制区域
      var moveRegionLeft = document.createElement('div');
      t.moveRegionLeft = moveRegionLeft;
      moveRegionLeft.className = 'move-region move-region-left';
      moveRegionLeft.innerHTML=''
      t.leftControl.appendChild(moveRegionLeft);

      t.wrapper.appendChild(t.leftControl);
      t.leftControl.style.height = controlHeight + 'px';
      //-----------------左侧控制区域--end--------------------

      //-----------------右侧控制区域--begin--------------------
      t.rightControl = document.createElement('div');
      t.rightControl.className = 'chronoline-right';
      t.rightControl.style.marginTop = t.ctrlTopMargin + 'px';

//      var moveR = document.createElement('div');
//      moveR.style.width = '70px';
//      var divLineRight = document.createElement('div');
//      divLineRight.style.backgroundColor = '#e3eff5';
//      divLineRight.style.width='100%';
//      divLineRight.style.height='2px';
//      divLineRight.style.position='relative';
//      divLineRight.style.top='31px';
//      moveR.appendChild(divLineRight)

//      移动控制区域
      var moveRegionRight = document.createElement('div');
      t.moveRegionRight = moveRegionRight;
      moveRegionRight.className = 'move-region move-region-right';
//      moveRegionRight.innerHTML='›'
      t.rightControl.appendChild(moveRegionRight);
//      t.rightControl.appendChild(moveR);


//      下一月控制按钮
      if(ra_nextMonth && ra_nextMonth!=''){
        var nextMonth = document.createElement('div');
        nextMonth.className = 'next';
        nextMonth.innerHTML = '›';
        nextMonth.style.marginTop = prevMonth.style.marginTop;
        $(nextMonth).click(function(){
          if($('.chronoline-radio').hasClass('chronoline-radio-selected')){
            reLoadSubtaskinfo(false, ra_nextMonth, 'next');
          }else{
            reLoadSubtaskinfo(true, ra_nextMonth, 'next');
          }
        });
        t.rightControl.appendChild(nextMonth);
      }

      t.wrapper.appendChild(t.rightControl);
      //-----------------右侧控制区域--end--------------------




      t.scrollLeftDiscrete = function (e) {
        t.goToDate(t.scrollLeft(new Date(t.pxToMs(-getLeft(t.paperElem)))), -1);
        return false;
      };

      t.scrollRightDiscrete = function (e) {
        t.goToDate(t.scrollRight(new Date(t.pxToMs(-getLeft(t.paperElem)))), -1);
        return false;
      };

      // continuous scroll
      // left and right are pretty much the same but need to be flipped
      if (t.continuousScroll) {
        t.isScrolling = false;
        t.timeoutId = -1;

        t.scrollLeftContinuous = function (timestamp) {
          if (t.scrollStart == null)
            t.scrollStart = timestamp;
          if (t.isScrolling) {
            requestAnimationFrame(t.scrollLeftContinuous);
          }
          //不让有半个气泡出现
          else{
            var finalLeft = t.continuousScrollSpeed * (timestamp - t.scrollStart) + t.scrollPaperStart;
            var lLeft = (parseInt(finalLeft/DROP_INTERVAL_SIZE)+1)*DROP_INTERVAL_SIZE
            t.goToPx(lLeft, false, finalLeft > -t.msToPx(t.drawnStartMs));
            return ;
          }
          var finalLeft = t.continuousScrollSpeed * (timestamp - t.scrollStart) + t.scrollPaperStart;

          t.goToPx(finalLeft, false, finalLeft > -t.msToPx(t.drawnStartMs));
        };

        t.endScrollLeft = function (e) {
          clearTimeout(t.scrollTimeoutId);
          if (t.toScrollDiscrete) {
            t.toScrollDiscrete = false;
            t.scrollLeftDiscrete();
          }
          t.isScrolling = false;
        };

//        t.leftControl.onmousedown = function (e) {
//          t.toScrollDiscrete = true;
//          t.scrollPaperStart = getLeft(t.paperElem);
//          t.scrollTimeoutId = setTimeout(function () {
//            t.toScrollDiscrete = false;  // switched is flipped
//            t.scrollStart = null;
//            t.isScrolling = true;  // whether it's currently moving
//            requestAnimationFrame(t.scrollLeftContinuous);
//          }, 200);
//        };
//        t.leftControl.onmousemove = function (e) {
//          clearTimeout(t.scrollSpeedTimeoutId);
//          t.scrollSpeedTimeoutId = setTimeout(function () {
////            console.log(e);
//          }, 200);
//        };
//        t.leftControl.onmouseup = t.endScrollLeft;
//        t.leftControl.onmouseleave = t.endScrollLeft;


        t.scrollRightContinuous = function (timestamp) {
          if (t.scrollStart == null)
            t.scrollStart = timestamp;
          if (t.isScrolling) {
            rafid = requestAnimationFrame(t.scrollRightContinuous);
          }
          //不让有半个气泡出现
          else{
            var finalLeft = t.continuousScrollSpeed * (t.scrollStart - timestamp) + t.scrollPaperStart;
            var lLeft = (parseInt(finalLeft/DROP_INTERVAL_SIZE)-1)*DROP_INTERVAL_SIZE
            t.goToPx(lLeft, true, finalLeft - t.visibleWidth < -t.msToPx(t.drawnEndMs));
            return ;
          }
          var finalLeft = t.continuousScrollSpeed * (t.scrollStart - timestamp) + t.scrollPaperStart;
          t.goToPx(finalLeft, false, finalLeft - t.visibleWidth < -t.msToPx(t.drawnEndMs));
        };
//
        t.endScrollRight = function (e) {
          clearTimeout(t.scrollTimeoutId);
          if (t.toScrollDiscrete) {
            t.toScrollDiscrete = false;
            t.scrollRightDiscrete();
          }
          t.isScrolling = false;
        };

//        t.rightControl.onmousedown = function (e) {
//          t.toScrollDiscrete = true;
//          t.scrollPaperStart = getLeft(t.paperElem);
//          t.scrollTimeoutId = setTimeout(function () {
//            t.toScrollDiscrete = false;  // switched is flipped
//            t.scrollStart = null;
//            t.isScrolling = true;  // whether it's currently moving
//            requestAnimationFrame(t.scrollRightContinuous);
//          }, 200);
//        };
//        t.moveRegionRight.onmouseup = t.endScrollRight;
//        t.moveRegionRight.onmouseleave = t.endScrollRight;

        var oldOffsetLeft;


        $(t.moveRegionLeft).mousemove(function(event){
          var elLeft = $(event.target).offset().left;
          var elTop = $(event.target).offset().top;
          var offsetLeft = (event.clientX-elLeft);

          if(oldOffsetLeft){
            if(oldOffsetLeft === offsetLeft){
              oldOffsetLeft = offsetLeft;
              return ;
            }
            oldOffsetLeft = offsetLeft;
          }else{
            oldOffsetLeft = offsetLeft;
          }
          var num = 7-Math.round((offsetLeft/70)*(70/9));
          var contents='';
          for(var i=0; i<num;i++){
            contents+='‹';
          }
          /**
           *            num 为移动区域的量化数字0-7
           * 量化数字|  0     1    2    3    4     5    6     7
           * 移动速度|  0.25  0.5  0.75 1    1.25  1.5  1.75  2
           */
          t.continuousScrollSpeed=(num+1)*0.25
          clearTimeout(t.scrollTimeoutId);
//          cancelAnimationFrame(rafid)

          t.toScrollDiscrete = true;
          t.scrollPaperStart = getLeft(t.paperElem);

//          t.scrollTimeoutId = setTimeout(function () {
          t.toScrollDiscrete = false;  // switched is flipped
          t.scrollStart = null;
          t.isScrolling = true;  // whether it's currently moving
          rafid = requestAnimationFrame(t.scrollLeftContinuous);
//          }, 50);
          event.target.innerHTML = contents;
        });
        $(t.moveRegionLeft).mouseleave(function(event){
          event.target.innerHTML = '';
          t.isScrolling = false;
        })

        $(t.moveRegionRight).mousemove(function(event){
          var elLeft = $(event.target).offset().left;
          var elTop = $(event.target).offset().top;
          var offsetLeft = (event.clientX-elLeft);

          if(oldOffsetLeft){
            if(oldOffsetLeft === offsetLeft){
              oldOffsetLeft = offsetLeft;
              return ;
            }
            oldOffsetLeft = offsetLeft;
          }else{
            oldOffsetLeft = offsetLeft;
          }
          var num = Math.round((offsetLeft/70)*(70/9));
          var contents='';
          for(var i=0; i<num;i++){
            contents+='›';
          }
          /**
           *            num 为移动区域的量化数字0-7
           * 量化数字|  0     1    2    3    4     5    6     7
           * 移动速度|  0.25  0.5  0.75 1    1.25  1.5  1.75  2
           */
          t.continuousScrollSpeed=(num+1)*0.25
          clearTimeout(t.scrollTimeoutId);
//          cancelAnimationFrame(rafid)

          t.toScrollDiscrete = true;
          t.scrollPaperStart = getLeft(t.paperElem);

//          t.scrollTimeoutId = setTimeout(function () {
          t.toScrollDiscrete = false;  // switched is flipped
          t.scrollStart = null;
          t.isScrolling = true;  // whether it's currently moving
          rafid = requestAnimationFrame(t.scrollRightContinuous);
//          }, 50);
          event.target.innerHTML = contents;
        });
        $(t.moveRegionRight).mouseleave(function(event){
          event.target.innerHTML = '';
          t.isScrolling = false;
        })

      } else {  // just hook up discrete scrolling
        t.leftControl.onclick = t.scrollLeftDiscrete;
        t.rightControl.onclick = t.scrollLeftDiscrete;
      }

    }

    /**
     * 拖动事件
     */
    if (t.draggable) {
      t.stopDragging = function (e) {
        jQuery(t.wrapper).removeClass('dragging')
            .unbind('mousemove', t.mouseMoved)
            .unbind('mouseleave', t.stopDragging)
            .unbind('mouseup', t.stopDragging);
      }
      t.mouseMoved = function (e) {
        t.goToPx(t.dragPaperStart - (t.dragMouseStart - e.pageX), false, false);
      }
      t.wrapper.className += ' chronoline-draggable';
      jQuery(t.paperElem).mousedown(function (e) {
        e.preventDefault();
        t.dragMouseStart = e.pageX;
        t.dragPaperStart = getLeft(t.paperElem);
        jQuery(t.wrapper).addClass('dragging')
            .bind('mousemove', t.mouseMoved)
            .bind('mouseleave', t.stopDragging)
            .bind('mouseup', t.stopDragging);
      });
    }


    /**
     * 设置默认的位置
     *
     */
    t.paperElem.style.left = 0;
//    t.paperElem.style.left = -(t.totalWidth-760)+'px';
//    t.goToPx(getLeft(t.paperElem));
//    t.myCanvas.style.height = t.totalHeight + 'px';

    if(events.length<7){
      $(targetEl).find('.move-region').hide();
    }
    if(!t.currentId){
      t.paperElem.style.left = -(t.totalWidth-760)+'px';
      //默认选中最后一个
      $(t.paperElem.childNodes[t.paperElem.childNodes.length-4]).trigger('click');
    }
    var currrentDrop;
      if(t.currentId !== '' && t.currentId!==undefined && events.length > 7){
      for(var i=0; i<t.paperElem.childNodes.length; i++){
        if(t.currentId == t.paperElem.childNodes[i].id){
//          console.log(t.paperElem.childNodes[i].attributes.d.nodeValue);
          //TODO IE
          var left = (t.paperElem.childNodes[i].attributes.d.nodeValue.split(',')[0]).split('M')[1];
          var left = (left-320);
          var realLeft;
          if(left<0){
            realLeft = 0;
          }else if(left>t.totalWidth-760){
            realLeft = t.totalWidth-760;
          }else{
            realLeft = left;
          }
          t.paperElem.style.left = -realLeft+'px';
        }
      }
    }
    //选中给定的子任务
    if(t.currentId!==undefined){
      for(var i=0; i<t.paperElem.childNodes.length; i++){
        if(t.currentId == t.paperElem.childNodes[i].id){
          $(t.paperElem.childNodes[i]).trigger('click')
        }
      }
    }

    /*
     * radio只显示故障测例 显隐
     */
    if(options.showRadio){
      if(options.showType){
        $('.chronoline-radio').find('b').css('background', '#050608');
        $('.chronoline-radio').addClass('chronoline-radio-selected');
      }else{
        $('.chronoline-radio').find('b').css('background', 'wihte');
      }
    }
  }

  function init(target) {
    targetEl = target;
    var opts = $.data(targetEl, 'uicTime2Line').options;
    targetElOpts =opts;
    loadSubtaskinfo();
  }

  function loadSubtaskinfo(showType){
    var opts = targetElOpts;
    var data = {
      allShow: opts.allShow,
      showSize: opts.showSize,
      showType: targetElOpts.showType
    }
    if(targetElOpts.currentMonth){
      data.month =targetElOpts.currentMonth
    }
    $.ajax({
      type: opts.method,
      url: opts.url,
      dataType: 'json',
      data: data,
      contentType: 'application/x-www-form-urlencoded;charset="utf-8"',
      success: function (data) {
        paint(targetEl, data, showType? 1 : 0)
      },
      error: function (data) {
      }
    });
  }
  function reLoadSubtaskinfo(showType,month, lastOrNext){

    rePaint(targetEl, showType? 1 : 0, lastOrNext)
    var opts = targetElOpts;
    $.ajax({
      type: opts.method,
      url: opts.url,
      dataType: 'json',
      data: {
        month: month,
        allShow: opts.allShow,
        showSize: opts.showSize,
        showType: targetElOpts.showType
      },
      contentType: 'application/x-www-form-urlencoded;charset="utf-8"',
      success: function (data) {
        reData(data[0], lastOrNext);
      },
      error: function (data) {
      }
    });
  }

  function paint(target, data, showType) {

    if (!(data instanceof Array ) && data[0].result.length == 0){
      $(targetEl).width(960).height(180);
      var noData = $('<div style="margin: 80px auto;display: inline-block;text-align: center;width: 760px;">no data!</div>')
      $(targetEl).append(noData)
      return;
    }
    if(data.length == 0){
      $(targetEl).width(960).height(180);
      var noData = $('<div style="margin: 80px auto;display: inline-block;text-align: center;width: 760px;">no data!</div>')
      $(targetEl).append(noData)
      return;
    }
    data = data[0];


    var currentMMYY = data.datatime;// 09/2013
    var currentMMYYs = currentMMYY.split('/');
    if (currentMMYYs.length !== 2) {
      console.log('data.datatime format error!');
      return;
    }

    var description = data.description; //"Total 45 test(s), 0 failed in Aug."
    ra_lastMonth = data.lastMonth;
    ra_nextMonth = data.nextMonth;
    ra_currentMonth = data.datatime;


    var resultArray = data.result;

    if (!(resultArray instanceof Array && resultArray.length > 0)) {
      console.log('data.result is null or no value');
    }

    /**
     * 拼接子任務數據
     * TODO
     * 此次循環可去掉，提高性能
     */

    var lastMonth = ra_lastMonth.split('/')[0];
    var currentMonth = ra_currentMonth.split('/')[0];
    var nextMonth = ra_nextMonth.split('/')[0];
    for (var i = resultArray.length - 1; i > -1; i--) {
      var dt = resultArray[i].dateTime;
      var tempMM = dt.split('/')[0];
      if (currentMonth === tempMM) {
        ra_currentMonthEvents.push({
          dates: [new Date(currentMMYYs[1] + '/' + dt)],
          title: dt,
          dataColor: resultArray[i].dataColor,
          id: resultArray[i].id,
          note: resultArray[i].note,
          section: 1
        });
      } else if(lastMonth === tempMM) {
        ra_lastMonthEvents.push({
          dates: [new Date(currentMMYYs[1] + '/' + dt)],
          title: dt,
          dataColor: resultArray[i].dataColor,
          id: resultArray[i].id,
          note: resultArray[i].note,
          section: 0
        });
      } else if (nextMonth === tempMM) {
        ra_nextMonthEvents.push({
          dates: [new Date(currentMMYYs[1] + '/' + dt)],
          title: dt,
          dataColor: resultArray[i].dataColor,
          id: resultArray[i].id,
          note: resultArray[i].note,
          section: 0
        });
      }
    }


    timeline = new Chronoline(target, ra_currentMonthEvents,
        {
          visibleSpan: DAY_IN_MILLISECONDS * 7,
          showType: showType,
          animated: true,
          draggable: true,
          showRadio: targetElOpts.showRadio,
          currentId: targetElOpts.currentId
        }, data.description);
  }

  function reData(data, lastOrNext){

    var resultArray = data.result;

    if (!(resultArray instanceof Array && resultArray.length > 0)) {
      console.log('data.result is null or no value');
    }

    if(lastOrNext == 'last'){
      ra_lastMonthEvents = [];
      var lastMonth = ra_lastMonth.split('/')[0];
      for (var i = resultArray.length - 1; i > -1; i--) {
        var dt = resultArray[i].dateTime;
        var tempMM = dt.split('/')[0];
        if(lastMonth === tempMM) {
          ra_lastMonthEvents.push({
            title: dt,
            dataColor: resultArray[i].dataColor,
            id: resultArray[i].id,
            note: resultArray[i].note
          });
        }
      }

    }else if(lastOrNext == 'next'){
      ra_nextMonthEvents = [];
      var nextMonth = ra_nextMonth.split('/')[0];
      for (var i = resultArray.length - 1; i > -1; i--) {
        var dt = resultArray[i].dateTime;
        var tempMM = dt.split('/')[0];
        if(nextMonth === tempMM) {
          ra_nextMonthEvents.push({
            title: dt,
            dataColor: resultArray[i].dataColor,
            id: resultArray[i].id,
            note: resultArray[i].note
          });
        }
      }
    }

    $('#task-desc').html(data.description)
  }

  function rePaint(target, showType, lastOrNext) {

    if(lastOrNext == 'last'){
      ra_nextMonth = ra_currentMonth;
      ra_nextMonthEvents = ra_currentMonthEvents;
      ra_currentMonth = ra_lastMonth;
      ra_currentMonthEvents = ra_lastMonthEvents;

    }else if(lastOrNext == 'next'){
      ra_lastMonth = ra_currentMonth;
      ra_lastMonthEvents = ra_currentMonthEvents;
      ra_currentMonth = ra_nextMonth;
      ra_currentMonthEvents = ra_nextMonthEvents;
    }

    timeline = new Chronoline(target, ra_currentMonthEvents,
        {
          visibleSpan: DAY_IN_MILLISECONDS * 7,
          showType: showType,
          animated: true,
          draggable: true,
          showRadio: targetElOpts.showRadio
        }, '');
  }

  $.fn.uicTime2Line = function (options, param) {

    var opts;
    return this.each(function () {
      var state = $.data(this, 'uicTime2Line');
      if (state) {

      } else {
        opts = $.extend({}, $.fn.uicTime2Line.defaults, options);
        $.data(this, 'uicTime2Line', {
          options: opts
        });
        init(this);
      }
    })
  }

  $.fn.uicTime2Line.defaults = {
    faultCases: '只显示未处理的子任务222',
    method: 'GET',
    allShow: 1,
    showSize: 32,
    showType: 0,
    url: 'data.json',
    clickFun: function (subtaskid) {
      console.log(subtaskid+'callback')
    }
  }

})(jQuery);