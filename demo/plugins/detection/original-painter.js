/**
 * original-painter.js
 *
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-3-13
 * Time: 下午1:55
 * To change this template use File | Settings | File Templates.
 */

(function(de){


  var oep = function(params) {
    this._params = params;
    this._onSelectListeners = [];
    this._eventPaintListeners = [];

    this._filterMatcher = null;
    this._highlightMatcher = null;
    this._frc = null;

    this._eventIdToElmt = {};
  };

  oep.prototype.initialize = function(band, timeline) {
    this._band = band;
    this._timeline = timeline;

    this._backLayer = null;
    this._eventLayer = null;
    this._lineLayer = null;
    this._highlightLayer = null;

    this._eventIdToElmt = null;
  };

  oep.prototype._encodeEventElID = function(elType, evt) {
    return de.EventUtils.encodeEventElID(this._timeline, this._band, elType, evt);
  };

  oep.prototype._prepareForPainting = function() {
    // Remove everything previously painted: highlight, line and event layers.
    // Prepare blank layers for painting.
    var band = this._band;

    if (this._backLayer == null) {
      this._backLayer = this._band.createLayerDiv(0, "timeline-band-events");
      this._backLayer.style.visibility = "hidden";

      var eventLabelPrototype = document.createElement("span");
      eventLabelPrototype.className = "timeline-event-label";
      this._backLayer.appendChild(eventLabelPrototype);
//      this._frc = Storm.Graphics.getFontRenderingContext(eventLabelPrototype);
    }
//    this._frc.update();
    this._tracks = [];

    if (this._highlightLayer != null) {
      band.removeLayerDiv(this._highlightLayer);
    }
    this._highlightLayer = band.createLayerDiv(105, "timeline-band-highlights");
    this._highlightLayer.style.display = "none";

    if (this._lineLayer != null) {
      band.removeLayerDiv(this._lineLayer);
    }
    this._lineLayer = band.createLayerDiv(110, "timeline-band-lines");
    this._lineLayer.style.display = "none";

    if (this._eventLayer != null) {
      band.removeLayerDiv(this._eventLayer);
    }
    this._eventLayer = band.createLayerDiv(115, "timeline-band-events");
//    this._eventLayer.style.display = "none";
  };

//  @@@@EventTape
  oep.prototype._paintEventTape = function(evt, iconTrack, startPixel, endPixel, color, opacity, metrics, theme, tape_index) {

    var tapeWidth = endPixel - startPixel;
//    var tapeHeight = theme.event.tape.height;
    var tapeHeight = de.SIMTS_HEIGHT;

//    var top = metrics.trackOffset + iconTrack * metrics.trackIncrement;

    var orIndex = evt.getOrIndex();
    var top = de.SIMTS_TITLE_HEIGHT + orIndex*de.SIMTS_HEIGHT;


    var tapeDiv = this._timeline.getDocument().createElement("div");
    tapeDiv.className = this._getElClassName('timeline-event-tape', evt, 'tape');
    tapeDiv.id = this._encodeEventElID('tape' + tape_index, evt);
    tapeDiv.style.left = startPixel + "px";
    tapeDiv.style.width = tapeWidth + "px";
    tapeDiv.style.height = tapeHeight + "px";
    tapeDiv.style.top = top + "px";

    if(evt._title != null)
      tapeDiv.title = evt._title;

    if(color != null) {
      tapeDiv.style.backgroundColor = color;
    }

    var backgroundImage = evt.getTapeImage();
    var backgroundRepeat = evt.getTapeRepeat();
    backgroundRepeat = backgroundRepeat != null ? backgroundRepeat : 'repeat';
    if(backgroundImage != null) {
      tapeDiv.style.backgroundImage = "url(" + backgroundImage + ")";
      tapeDiv.style.backgroundRepeat = backgroundRepeat;
    }

//    Storm.Graphics.setOpacity(tapeDiv, opacity);

    this._eventLayer.appendChild(tapeDiv);

    return {
      left:   startPixel,
      top:    top,
      width:  tapeWidth,
      height: tapeHeight,
      elmt:   tapeDiv
    };
  }

  oep.prototype._fireEventPaintListeners = function(op, evt, els) {
    for (var i = 0; i < this._eventPaintListeners.length; i++) {
      this._eventPaintListeners[i](this._band, op, evt, els);
    }
  };

  oep.prototype._getLabelDivClassName = function(evt) {
    return this._getElClassName('timeline-event-label', evt, 'label');
  };

  oep.prototype._getElClassName = function(elClassName, evt, prefix) {
    // Prefix and '_' is added to the event's classname. Set to null for no prefix
    var evt_classname = evt.getClassName(),
        pieces = [];

    if (evt_classname) {
      if (prefix) {pieces.push(prefix + '-' + evt_classname + ' ');}
      pieces.push(evt_classname + ' ');
    }
    pieces.push(elClassName);
    return(pieces.join(''));
  };

  oep.prototype._findFreeTrack = function(event, rightEdge) {
    var trackAttribute = event.getTrackNum();
    if (trackAttribute != null) {
      return trackAttribute; // early return since event includes track number
    }

    // normal case: find an open track
    for (var i = 0; i < this._tracks.length; i++) {
      var t = this._tracks[i];
      if (t > rightEdge) {
        break;
      }
    }
    return i;
  };
//
  oep.prototype.paint = function(){
    // Paints the events for a given section of the band--what is
    // visible on screen and some extra.
    var eventSource = this._band.getEventSource();
    if (eventSource == null) {
      return;
    }
//    if(!this._eventLayer)
//      return ;
//    @@@@删除所有的busy
//    $(this._eventLayer).empty();
//    $('.timeline-band-events').children().first().empty();

    this._eventIdToElmt = {};
    this._fireEventPaintListeners('paintStarting', null, null);
    this._prepareForPainting();

    var eventTheme = this._params.theme.event;
//    var trackHeight = Math.max(eventTheme.track.height, eventTheme.tape.height +this._frc.getLineHeight());
    var metrics = {
      trackOffset: eventTheme.track.offset,
//      trackHeight: trackHeight,
      trackGap: eventTheme.track.gap,
//      trackIncrement: trackHeight + eventTheme.track.gap,
      icon: eventTheme.instant.icon,
      iconWidth: eventTheme.instant.iconWidth,
      iconHeight: eventTheme.instant.iconHeight,
      labelWidth: eventTheme.label.width,
      maxLabelChar: eventTheme.label.maxLabelChar,
      impreciseIconMargin: eventTheme.instant.impreciseIconMargin
    }

    var minDate = this._band.getMinDate();
    var maxDate = this._band.getMaxDate();

    var filterMatcher = (this._filterMatcher != null) ?
        this._filterMatcher :
        function(evt) { return true; };
    var highlightMatcher = (this._highlightMatcher != null) ?
        this._highlightMatcher :
        function(evt) { return -1; };

    var iterator = eventSource.getEventReverseIterator(minDate, maxDate);
    while (iterator.hasNext()) {
      var evt = iterator.next();
      if (filterMatcher(evt)) {
//          @@@@ 画事件
        this.paintEvent(evt, metrics, this._params.theme, highlightMatcher(evt));
      }
    }

    this._highlightLayer.style.display = "block";
    this._lineLayer.style.display = "block";
    this._eventLayer.style.display = "block";
    // update the band object for max number of tracks in this section of the ether
//    this._band.updateEventTrackInfo(this._tracks.length, metrics.trackIncrement);
    this._fireEventPaintListeners('paintEnded', null, null);
  }

  oep.prototype.paintEvent = function(evt, metrics, theme, highlightIndex) {
    if (evt.isInstant()) {
//        时间点
      this.paintInstantEvent(evt, metrics, theme, highlightIndex);
    } else {
//        时间段
      this.paintDurationEvent(evt, metrics, theme, highlightIndex);
    }
  };

  oep.prototype.paintInstantEvent = function(evt, metrics, theme, highlightIndex) {
    if (evt.isImprecise()) {
//      this.paintImpreciseInstantEvent(evt, metrics, theme, highlightIndex);
    } else {
      this.paintPreciseInstantEvent(evt, metrics, theme, highlightIndex);
    }
  }

  oep.prototype.paintDurationEvent = function(evt, metrics, theme, highlightIndex) {
    if (evt.isImprecise()) {
//      不精确的
//      this.paintImpreciseDurationEvent(evt, metrics, theme, highlightIndex);
    } else {
//      精确的
      this.paintPreciseDurationEvent(evt, metrics, theme, highlightIndex);
    }
  }

  oep.prototype.paintPreciseDurationEvent = function(evt, metrics, theme, highlightIndex) {
    var doc = this._timeline.getDocument();
    var text = evt.getText();

    var startDate = evt.getStart();
    var endDate = evt.getEnd();
    var startPixel = Math.round(this._band.dateToPixelOffset(startDate));
    var endPixel = Math.round(this._band.dateToPixelOffset(endDate));

    var labelDivClassName = this._getLabelDivClassName(evt);
//    var labelSize = this._frc.computeSize(text, labelDivClassName);
//    var labelLeft = startPixel;
//    var labelRight = labelLeft + labelSize.width;

//    var rightEdge = Math.max(labelRight, endPixel);
//    var track = this._findFreeTrack(evt, rightEdge);
//    var labelTop = Math.round(
//        metrics.trackOffset + track * metrics.trackIncrement + theme.event.tape.height);

    var color = evt.getColor();
    color = color != null ? color : theme.event.duration.color;

//    @@@@
    var tapeElmtData = this._paintEventTape(evt, 'ff', startPixel, endPixel, color, 100, metrics, theme, 0);
//    var labelElmtData = this._paintEventLabel(evt, text, labelLeft, labelTop, labelSize.width,
//        labelSize.height, theme, labelDivClassName, highlightIndex);
//    var els = [tapeElmtData.elmt, labelElmtData.elmt];
//
//    var self = this;
//    var clickHandler = function(elmt, domEvt, target) {
//      return self._onClickDurationEvent(tapeElmtData.elmt, domEvt, evt);
//    };
//    SimileAjax.DOM.registerEvent(tapeElmtData.elmt, "mousedown", clickHandler);
//    SimileAjax.DOM.registerEvent(labelElmtData.elmt, "mousedown", clickHandler);
//
//    var hDiv = this._createHighlightDiv(highlightIndex, tapeElmtData, theme, evt);
//    if (hDiv != null) {els.push(hDiv);}
//    this._fireEventPaintListeners('paintedEvent', evt, els);
//
//    this._eventIdToElmt[evt.getID()] = tapeElmtData.elmt;
//    this._tracks[track] = startPixel;
  };

  oep.prototype.paintPreciseInstantEvent = function(evt, metrics, theme, highlightIndex) {
    var doc = this._timeline.getDocument();
    var text = evt.getText();

    var startDate = evt.getStart();
    var startPixel = Math.round(this._band.dateToPixelOffset(startDate));
    var iconRightEdge = Math.round(startPixel + metrics.iconWidth / 2);
//    var iconLeftEdge = Math.round(startPixel - metrics.iconWidth / 2);
    var iconLeftEdge = Math.round(startPixel-1);

    var labelDivClassName = this._getLabelDivClassName(evt);
//    var labelSize = this._frc.computeSize(text, labelDivClassName);
    var labelLeft = iconRightEdge + theme.event.label.offsetFromLine;
//    var labelRight = labelLeft + labelSize.width;
    var labelRight = labelLeft;

    var rightEdge = labelRight;
//    var track = this._findFreeTrack(evt, rightEdge);

//    var labelTop = Math.round(
//        metrics.trackOffset + track * metrics.trackIncrement +
//            metrics.trackHeight / 2 - labelSize.height / 2);

    var iconElmtData = this._paintEventIcon(evt, '', iconLeftEdge, metrics, theme, 0);
//    var labelElmtData = this._paintEventLabel(evt, text, labelLeft, labelTop, labelSize.width,
//        labelSize.height, theme, labelDivClassName, highlightIndex);
//    var els = [iconElmtData.elmt, labelElmtData.elmt];

//    var self = this;
//    var clickHandler = function(elmt, domEvt, target) {
//      return self._onClickInstantEvent(iconElmtData.elmt, domEvt, evt);
//    };
//    SimileAjax.DOM.registerEvent(iconElmtData.elmt, "mousedown", clickHandler);
//    SimileAjax.DOM.registerEvent(labelElmtData.elmt, "mousedown", clickHandler);

    var hDiv = this._createHighlightDiv(highlightIndex, iconElmtData, theme, evt);
//    if (hDiv != null) {els.push(hDiv);}
//    this._fireEventPaintListeners('paintedEvent', evt, els);
//
//
//    this._eventIdToElmt[evt.getID()] = iconElmtData.elmt;
//    this._tracks[track] = iconLeftEdge;
  };

  oep.prototype._paintEventIcon = function(evt, iconTrack, left, metrics, theme, tapeHeight) {
    // If no tape, then paint the icon in the middle of the track.
    // If there is a tape, paint the icon below the tape + impreciseIconMargin
//    var icon = evt.getIcon();
//    icon = icon != null ? icon : metrics.icon;

//    var top; // top of the icon
//    if (tapeHeight > 0) {
//      top = metrics.trackOffset + iconTrack * metrics.trackIncrement +
//          tapeHeight + metrics.impreciseIconMargin;
//    } else {
//      var middle = metrics.trackOffset + iconTrack * metrics.trackIncrement +
//          metrics.trackHeight / 2;
//      top = Math.round(middle - metrics.iconHeight / 2);
//    }
//    var img = SimileAjax.Graphics.createTranslucentImage(icon);
    var iconDiv = this._timeline.getDocument().createElement("div");
    iconDiv.className = this._getElClassName('timeline-event-icon', evt, 'icon');
    iconDiv.id = this._encodeEventElID('icon', evt);
    iconDiv.style.left = left + "px";
    iconDiv.style.top = top + "px";
    iconDiv.style.width = 1 + "px";
    iconDiv.style.height = '100%';
    iconDiv.style.backgroundColor = 'red'
//    iconDiv.appendChild(img);

    if(evt._title != null)
      iconDiv.title = evt._title;

    this._eventLayer.appendChild(iconDiv);

    return {
      left:   left,
      top:    top,
      width:  metrics.iconWidth,
      height: metrics.iconHeight,
      elmt:   iconDiv
    };
  };

  oep.prototype._createHighlightDiv = function(highlightIndex, dimensions, theme, evt) {
    var div = null;
    if (highlightIndex >= 0) {
      var doc = this._timeline.getDocument();
      var color = this._getHighlightColor(highlightIndex, theme);

      div = doc.createElement("div");
      div.className = this._getElClassName('timeline-event-highlight', evt, 'highlight');
      div.id = this._encodeEventElID('highlight0', evt); // in future will have other
      // highlight divs for tapes + icons
      div.style.position = "absolute";
      div.style.overflow = "hidden";
      div.style.left =    (dimensions.left - 2) + "px";
      div.style.width =   (dimensions.width + 4) + "px";
      div.style.top =     (dimensions.top - 2) + "px";
      div.style.height =  (dimensions.height + 4) + "px";
      div.style.background = color;

      this._highlightLayer.appendChild(div);
    }
    return div;
  };

  de.OriginalEventPainter = oep;
})(StormDetection);

