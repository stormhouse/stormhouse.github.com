/**
 * sources.js
 *
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-3-13
 * Time: 下午3:12
 * To change this template use File | Settings | File Templates.
 */

(function(de){

  var ds = function(eventIndex){
    this._events = (eventIndex instanceof Object) ? eventIndex : new Storm.EventIndex();
    this._listeners = [];
  }

  ds.prototype.changeDateTimezone = function(date, fromtz, totz){
    if(typeof date == 'number'){
      return new Date(date+(parseFloat(fromtz)-parseFloat(totz))*3600*1000);
    }
    return new Date(date.getTime()+(parseFloat(fromtz)-parseFloat(totz))*3600*1000);
  }

  ds.prototype.loadJSON = function(data, url, timezone) {
//    var base = this._getBaseURL(url);
    var added = false;
    if (data && data.events){
      var wikiURL = ("wikiURL" in data) ? data.wikiURL : null;
      var wikiSection = ("wikiSection" in data) ? data.wikiSection : null;

      var dateTimeFormat = ("dateTimeFormat" in data) ? data.dateTimeFormat : null;
//      var parseDateTimeFunction = this._events.getUnit().getParser(dateTimeFormat);

//      if(!move){
//        this._events.clear();
//      }
      for (var i=0; i < data.events.length; i++){
        var event = data.events[i];
        // Fixing issue 33:
        // instant event: default (for JSON only) is false. Or use values from isDuration or durationEvent
        // isDuration was negated (see issue 33, so keep that interpretation
        var instant = event.isDuration || (event.durationEvent != null && !event.durationEvent);

        if(event.end){
          try{
//            var s = Storm.DateTime.parseGregorianDateTime(event.start).changeTimezone(0, window.timezone);
//            var e = Storm.DateTime.parseGregorianDateTime(event.end).changeTimezone(0, window.timezone);
            var s = Storm.DateTime.parseGregorianDateTime(event.start);
            var e = Storm.DateTime.parseGregorianDateTime(event.end);
          }catch(ex){}
        }else{
          var s = event.start;
        }

        s = this.changeDateTimezone(s.getTime(), 0, timezone);
        e = this.changeDateTimezone(e.getTime(), 0, timezone);
        var evt = new ds.Event({
          id: ("id" in event) ? event.id : undefined,
//          start: parseDateTimeFunction(event.start),
//          end: parseDateTimeFunction(event.end),
//          latestStart: parseDateTimeFunction(event.latestStart),
//          earliestEnd: parseDateTimeFunction(event.earliestEnd),
          start: s,
          end: e,
          latestStart: Storm.DateTime.parseGregorianDateTime(event.latestStart),
          earliestEnd: Storm.DateTime.parseGregorianDateTime(event.earliestEnd),
          instant: instant,
          text: event.title,
          description: event.description,
//          image: this._resolveRelativeURL(event.image, base),
//          link: this._resolveRelativeURL(event.link , base),
//          icon: this._resolveRelativeURL(event.icon , base),
          color: event.color,
          textColor: event.textColor,
          hoverText: event.hoverText,
          classname: event.classname,
          tapeImage: event.tapeImage,
          tapeRepeat: event.tapeRepeat,
          caption: event.caption,
          eventID: event.eventID,
          trackNum: event.trackNum,
          orizontalIndex: event.orizontalIndex
        });
        evt._obj = event;
        evt.getProperty = function(name) {
          return this._obj[name];
        };
//        evt.setWikiInfo(wikiURL, wikiSection);

        this._events.add(evt);
        added = true;
      }
    }

    if (added) {
      this._fire("onAddMany", []);
    }
  };

  ds.prototype._fire = function(handlerName, args) {
    for (var i = 0; i < this._listeners.length; i++) {
      var listener = this._listeners[i];
      if (handlerName in listener) {
        try {
          listener[handlerName].apply(listener, args);
        } catch (e) {
//          SimileAjax.Debug.exception(e);
        }
      }
    }
  };

  ds.prototype.addListener = function(listener) {
    this._listeners.push(listener);
  };

  ds.prototype.getEventReverseIterator = function(startDate, endDate) {
    return this._events.getReverseIterator(startDate, endDate);
  };

  ds.prototype.getReverseIterator = function(startDate, endDate) {
    if (!this._indexed) {
      this._index();
    }
    return new ds._ReverseIterator(this._events, startDate, endDate, this._unit);
  };

  ds.prototype.removeListener = function(listener) {
    for (var i = 0; i < this._listeners.length; i++) {
      if (this._listeners[i] == listener) {
        this._listeners.splice(i, 1);
        break;
      }
    }
  };

  ds.prototype.updateCurrentDateFlag = function(){
    this._events.removeCurrentDateFlag();
  }

  ds.Event = function(args) {
    //
    // Attention developers!
    // If you add a new event attribute, please be sure to add it to
    // all three load functions: loadXML, loadSPARCL, loadJSON.
    // Thanks!
    //
    // args is a hash/object. It supports the following keys. Most are optional
    //   id            -- an internal id. Really shouldn't be used by events.
    //                    Timeline library clients should use eventID
    //   eventID       -- For use by library client when writing custom painters or
    //                    custom fillInfoBubble
    //   start
    //   end
    //   latestStart
    //   earliestEnd
    //   instant      -- boolean. Controls precise/non-precise logic & duration/instant issues
    //   text         -- event source attribute 'title' -- used as the label on Timelines and in bubbles.
    //   description  -- used in bubbles
    //   image        -- used in bubbles
    //   link         -- used in bubbles
    //   icon         -- on the Timeline
    //   color        -- Timeline label and tape color
    //   textColor    -- Timeline label color, overrides color attribute
    //   hoverText    -- deprecated, here for backwards compatibility.
    //                   Superceeded by caption
    //   caption      -- tooltip-like caption on the Timeline. Uses HTML title attribute
    //   classname    -- used to set classname in Timeline. Enables better CSS selector rules
    //   tapeImage    -- background image of the duration event's tape div on the Timeline
    //   tapeRepeat   -- repeat attribute for tapeImage. {repeat | repeat-x | repeat-y }

    this._orizontalIndex = args.orizontalIndex;

    function cleanArg(arg) {
      // clean up an arg
      return (args[arg] != null && args[arg] != "") ? args[arg] : null;
    }

    var id = args.id ? args.id.trim() : "";
//    this._id = id.length > 0 ? id : de.EventUtils.getNewEventID();

    this._instant = args.instant || (args.end == null);

    this._start = args.start;
    this._end = (args.end != null) ? args.end : args.start;

    this._latestStart = (args.latestStart != null) ?
        args.latestStart : (args.instant ? this._end : this._start);
    this._earliestEnd = (args.earliestEnd != null) ? args.earliestEnd : this._end;

    // check sanity of dates since incorrect dates will later cause calculation errors
    // when painting
    var err=[];
    if (this._start > this._latestStart) {
      this._latestStart = this._start;
      err.push("start is > latestStart");}
    if (this._start > this._earliestEnd) {
      this._earliestEnd = this._latestStart;
      err.push("start is > earliestEnd");}
    if (this._start > this._end) {
      this._end = this._earliestEnd;
      err.push("start is > end");}
    if (this._latestStart > this._earliestEnd) {
      this._earliestEnd = this._latestStart;
      err.push("latestStart is > earliestEnd");}
    if (this._latestStart > this._end) {
      this._end = this._earliestEnd;
      err.push("latestStart is > end");}
    if (this._earliestEnd > this._end) {
      this._end = this._earliestEnd;
      err.push("earliestEnd is > end");}

    this._eventID = cleanArg('eventID');
//    this._text = (args.text != null) ? SimileAjax.HTML.deEntify(args.text) : ""; // Change blank titles to ""
    if (err.length > 0) {
      this._text += " PROBLEM: " + err.join(", ");
    }

//    this._description = SimileAjax.HTML.deEntify(args.description);
    this._image = cleanArg('image');
    this._link =  cleanArg('link');
    this._title = cleanArg('hoverText');
    this._title = cleanArg('caption');

    this._icon = cleanArg('icon');
    this._color = cleanArg('color');
    this._textColor = cleanArg('textColor');
    this._classname = cleanArg('classname');
    this._tapeImage = cleanArg('tapeImage');
    this._tapeRepeat = cleanArg('tapeRepeat');
    this._trackNum = cleanArg('trackNum');
    if (this._trackNum != null) {
      this._trackNum = parseInt(this._trackNum);
    }

    this._wikiURL = null;
    this._wikiSection = null;
  };

  ds.Event.prototype = {
    getOrIndex:     function() { return this._orizontalIndex;},

    getID:          function() { return this._id; },

    isInstant:      function() { return this._instant; },
    isImprecise:    function() { return this._start != this._latestStart || this._end != this._earliestEnd; },

    getStart:       function() { return this._start; },
    getEnd:         function() { return this._end; },

    getText:        function() { return this._text; }, // title


    getColor:       function() { return this._color; },
    getTapeImage:   function() { return this._tapeImage; },
    getTapeRepeat:  function() { return this._tapeRepeat; },
    getClassName:   function() { return this._classname; },
    getTrackNum:    function() { return this._trackNum; }
  }

//
//  ds._ReverseIterator = function(events, startDate, endDate, unit) {
//    this._events = events;
//    this._startDate = startDate;
//    this._endDate = endDate;
//    this._unit = unit;
//
//    this._minIndex = events.find(function(evt) {
//      return unit.compare(evt.getStart(), startDate);
//    });
//    if (this._minIndex - 1 >= 0) {
//      this._minIndex = this._events.elementAt(this._minIndex - 1)._earliestOverlapIndex;
//    }
//
//    this._maxIndex = events.find(function(evt) {
//      return unit.compare(evt.getStart(), endDate);
//    });
//
//    this._currentIndex = this._maxIndex;
//    this._hasNext = false;
//    this._next = null;
//    this._findNext();
//  };
//
//  ds._ReverseIterator.prototype = {
//    hasNext: function() { return this._hasNext; },
//    next: function() {
//      if (this._hasNext) {
//        var next = this._next;
//        this._findNext();
//
//        return next;
//      } else {
//        return null;
//      }
//    },
//    _findNext: function() {
//      var unit = this._unit;
//      while ((--this._currentIndex) >= this._minIndex) {
//        var evt = this._events.elementAt(this._currentIndex);
//        if (unit.compare(evt.getStart(), this._endDate) < 0 &&
//            unit.compare(evt.getEnd(), this._startDate) > 0) {
//
//          this._next = evt;
//          this._hasNext = true;
//          return;
//        }
//      }
//      this._next = null;
//      this._hasNext = false;
//    }
//  };

  de.DefaultEventSource = ds;

})(StormDetection);

