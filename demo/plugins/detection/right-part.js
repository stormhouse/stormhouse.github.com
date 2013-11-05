/**
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-3-25
 * Time: 下午3:41
 * To change this template use File | Settings | File Templates.
 */

(function(de){


  de._RightPart = function(timeline, bandInfo) {
    this._timeline = timeline;
    this._bandInfo = bandInfo;
    this._mainHeight = 132;
    this._pieceHeight = 21;
//    this._date = null;

  }
  de._RightPart.PIECE_WIDTH = 70;

  de._RightPart.prototype.initialize = function(){
    var self = this;
    var rightContainer = $('<div class="timeline-rightband-container" style="display: none;"></div>');
    rightContainer.width(de._RightPart.PIECE_WIDTH)
    rightContainer.height((self._timeline._simTs.length+1)*(de.SIMTS_HEIGHT-1));

    var top = $('<div class="timeline-right-band-top"></div>');
    var bottom = $('<div class="timeline-right-band-bottom"></div>');

    var main =  $('<div class="timeline-rightband-main"></div>');

    this._holeMonth = $('<div class="timeline-rightband-month"></div>');
//    for(var i=1; i<32; i++){
//      var temp = $('<div class="timeline-rightband-month-unit" value="'+ i +'">'+i+'</div>');
//      this._holeMonth.append(temp);
//    }
    main.append(this._holeMonth);

    rightContainer.append(top).append(main).append(bottom);

    $(this._timeline._mainBandContainer).append(rightContainer);

    this._holeMonth.bind('click', function(e){
      var d = $(e.target).attr('value');
      if(d){
        var date = new Date(d);
        self._holeMonth.find('.timeline-rightband-month-unit-selected').removeClass('timeline-rightband-month-unit-selected');
        $(e.target).addClass('timeline-rightband-month-unit-selected');
        self._timeline._mainBand.fixToDate(date);
      }
    })
//    this._bandHeight = this._holeMonth.css('height').split('px')[0];

    var self = this;
    top.unbind('.timeline').bind('click.timeline', function(event){
      self.moveDown(self);
    });

    bottom.unbind('.timeline').bind('click.timeline', function(event){
      self.moveUp(self);
    });

  }

  de._RightPart.prototype.getBandHeight = function(){
    return this._holeMonth.height();
  }
  de._RightPart.prototype.getBandOffsetTop = function(){
    var top = this._holeMonth.css('top');
    if(top == 'auto')
      return 0;
    return top.split('px')[0];
  }
  de._RightPart.prototype.moveUp = function(self){
    if(!self)
      self = this;
    var bandHeight = self.getBandHeight();
    var bandTop = self.getBandOffsetTop();

    var top;
    if((bandHeight-Math.abs(bandTop)-self._mainHeight)<self._mainHeight){
      top = self._mainHeight - bandHeight;
    }else{
      top = bandTop-self._mainHeight;
    }
    self.move(top);
  }
  de._RightPart.prototype.moveDown = function(self){
    if(!self)
      self = this;
    var bandHeight = self.getBandHeight();
    var bandTop = self.getBandOffsetTop();

    var top;
    if(Math.abs(bandTop)<self._mainHeight){
      top = 0;
    }else{
      top = parseInt(bandTop)+self._mainHeight;
    }
    self.move(top);
  }

  de._RightPart.prototype.move = function(top){
    this._holeMonth.animate({top: top}, 500);
  }

  de._RightPart.prototype.setDate = function(date){

    this._date = date;
    this._year = date.getYear();
    this._month = date.getMonth();
    this._day = date.getDate();

    console.log(this._day);

    this.setPosition(this._day);
    this.setIndexColor([this._day])

  }

  de._RightPart.prototype.setPosition = function(day){
    var offset = this._getOffsetTop(day);
    this.setTop(offset);
  }

  de._RightPart.prototype.setTop = function(top){
    this._holeMonth.animate({top: -top}, 1000);
  }

  de._RightPart.prototype._getOffsetTop = function(day){

    if(day<6){
      return 0;
    }
    else if(day>26){
      return this._bandHeight - this._mainHeight;
    }
    else{
      return day*20- Math.round(this._mainHeight/2);
    }

  }

  de._RightPart.prototype.setDate = function(date, isHour){
    var index;

    if(this._dates && this._dates.length>0){
      if(!isHour){
        for(var i=0; i<this._dates.length; i++){
          var offset = Math.abs(this._dates[i].getTime()-date.getTime());
          //TODO
          if(offset<1000*60*60*24){
            index = i;
            break;
          }
        }
      }else{
        for(var i=0; i<this._dates.length; i++){
          var offset = Math.abs(this._dates[i].getTime()-date.getTime());
          //TODO
          if(offset<1000*60*60){
            index = i;
            break;
          }
        }
      }
    }

    this.setIndexColor(index);
  }

  de._RightPart.prototype.setIndexColor = function(index){
    this._holeMonth.children('.timeline-rightband-month-unit-selected').removeClass('timeline-rightband-month-unit-selected');
    var children = this._holeMonth.children();
    $(children.eq(index)).addClass('timeline-rightband-month-unit-selected');
  }

  /**
   * 根据拆分循环任务的每个时间点，更新右侧的时间片
   * Hour: 04/27 5:30
   * Day:  04/27
   * Week: 04/27
   * Month:04/27
   *
   * @param dates
   * @param current
   */
  de._RightPart.prototype.updateTimePiece = function(dates, current){

    this._dates = dates;

    this.clearTimeSegment();

    for(var i=0; i<dates.length; i++){
      if(current){
        if(dates[i].getTime() == current.getTime()){
          var temp = $('<div class="timeline-rightband-month-unit timeline-rightband-month-unit-selected" data-value="'+i+'" value="'+ dates[i] +'">'+getLabel(dates[i])+'</div>');
        }else{
          var temp = $('<div class="timeline-rightband-month-unit" data-value="'+i+'" value="'+ dates[i] +'">'+getLabel(dates[i])+'</div>');
        }
      }else{
        var temp = $('<div class="timeline-rightband-month-unit" data-value="'+i+'" value="'+ dates[i] +'">'+getLabel(dates[i])+'</div>');
      }
//      temp.width(de._rightPart.PIECE_WIDTH);
      this._holeMonth.append(temp);
      this._holeMonth.css('top', '0');
    }
    $('.timeline-rightband-container').show();

    function getLabel(date){

      var mon = date.getMonth()+1;
      if(mon<10)
        mon = '0'+mon;
      var d = date.getDate()<10 ? ('0'+date.getDate()) : date.getDate()
      var h = date.getHours()<10 ? ('0'+date.getHours()) : date.getHours()
      var min = date.getMinutes()<10 ? ('0'+date.getMinutes()) : date.getMinutes()

      return mon+'/'+d+' '+h+':'+min;
    }
  }



  de._RightPart.prototype.clearTimeSegment = function(){
    this._holeMonth.html('');
  }

//  de._RightPart.prototype.setIndex = function(day){}

})(StormDetection);