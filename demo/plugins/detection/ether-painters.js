/**
 * ether-painter.js
 * 用于画label backgroud
 * an ether painter, which paints date/time labels and the background of the band as well as the highlight
 *  (the lighter part of the lower band in the first timeline above);
 *
 */
(function(de){
  var gep = function(params){
    this._params = params;
    this._theme = params.theme;
    this._unit = params.unit;
    this._multiple = ("multiple" in params) ? params.multiple : 1;
  }

  gep.prototype.initialize = function(band, timeline){
    this._band = band;
    this._timeline = timeline;
    this._backgroundLayer = band.createLayerDiv(0);
    this._backgroundLayer.setAttribute("name", "ether-background"); // for debugging
    this._backgroundLayer.className = 'timeline-ether-bg';

    this._markerLayer = null;

    var align = ("align" in this._params && this._params.align != undefined) ? this._params.align :
      this._theme.ether.interval.marker[timeline.isHorizontal() ? "hAlign" : "vAlign"];
    var showLine = ("showLine" in this._params) ? this._params.showLine :
      this._theme.ether.interval.line.show;

    this._intervalMarkerLayout = new de.EtherIntervalMarkerLayout(
      this._timeline, this._band, this._theme, align, showLine);


  }
  //@@@@画label
  gep.prototype.paint = function(){

    if (this._markerLayer) {
      this._band.removeLayerDiv(this._markerLayer);
    }
    this._markerLayer = this._band.createLayerDiv(100);
    this._markerLayer.setAttribute("name", "ether-markers"); // for debugging
    this._markerLayer.style.display = "none";

    if (this._lineLayer) {
      this._band.removeLayerDiv(this._lineLayer);
    }
    this._lineLayer = this._band.createLayerDiv(1);
    this._lineLayer.setAttribute("name", "ether-lines"); // for debugging
    this._lineLayer.style.display = "none";

    var minDate = this._band.getMinDate();
    var maxDate = this._band.getMaxDate();

//    this._timeline._beginDate = new Date(minDate.getTime());
    var timezone = this._band.getTimezone();
    var labeller = this._band.getLabeller();
    //@@@@band最小刻度日期
    Storm.DateTime.roundDownToInterval(minDate, this._unit, timezone, this._multiple, this._theme.firstDayOfWeek);


    var p = this;
    var incrementDate = function(date) {
      for (var i = 0; i < p._multiple; i++) {
        Storm.DateTime.incrementByInterval(date, p._unit);
      }
    };
    //
    while (minDate.getTime() < maxDate.getTime()) {
      //
      this._intervalMarkerLayout.createIntervalMarker(
        minDate, labeller, this._unit, this._markerLayer, this._lineLayer);

      incrementDate(minDate);
    }
//    @@@@
    var sim_tsinfo_size = this._timeline._simTs.length;
    var offset = StormDetection.SIMTS_TITLE_HEIGHT;
    for(var si = 0; si<sim_tsinfo_size; si++){
      var divLine = this._timeline.getDocument().createElement("div");
      divLine.className = "timeline-storm-ether-lines";
//      Storm.Graphics.setOpacity(divLine, 25);

//      if (horizontal) {
      if (true) {
        divLine.className += " timeline-storm-horizontal";
        divLine.style.top = offset + "px";
      } else {
      }
      offset += StormDetection.SIMTS_HEIGHT;
        this._lineLayer.appendChild(divLine);
    }



    this._markerLayer.style.display = "block";
    this._lineLayer.style.display = "block";


  }

  de.GregorianEtherPainter = gep;

  de.EtherIntervalMarkerLayout = function(timeline, band, theme, align, showLine) {
    var horizontal = timeline.isHorizontal();
    if (horizontal) {
      if (align == "Top") {
        this.positionDiv = function(div, offset) {
          div.style.left = offset + "px";
          div.style.top = "0px";
        };
      } else {
        this.positionDiv = function(div, offset) {
          div.style.left = offset + "px";
          div.style.bottom = "0px";
        };
      }
    } else {
      if (align == "Left") {
        this.positionDiv = function(div, offset) {
          div.style.top = offset + "px";
          div.style.left = "0px";
        };
      } else {
        this.positionDiv = function(div, offset) {
          div.style.top = offset + "px";
          div.style.right = "0px";
        };
      }
    }

    var markerTheme = theme.ether.interval.marker;
    var lineTheme = theme.ether.interval.line;
    var weekendTheme = theme.ether.interval.weekend;

    var stylePrefix = (horizontal ? "h" : "v") + align;
    var labelStyler = markerTheme[stylePrefix + "Styler"];
    var emphasizedLabelStyler = markerTheme[stylePrefix + "EmphasizedStyler"];
    var day = Storm.DateTime.gregorianUnitLengths[Storm.DateTime.DAY];
    //画刻度
    this.createIntervalMarker = function(date, labeller, unit, markerDiv, lineDiv) {
      var offset = Math.round(band.dateToPixelOffset(date));

      if (showLine && unit != Storm.DateTime.WEEK) {
        var divLine = timeline.getDocument().createElement("div");
        divLine.className = "timeline-ether-lines";

        if (lineTheme.opacity < 100) {
          Storm.Graphics.setOpacity(divLine, lineTheme.opacity);
        }

        if (horizontal) {
          divLine.className += " timeline-vertical";
//          divLine.className += " timeline-ether-lines-vertical";
          divLine.style.left = offset + "px";
        } else {
//          divLine.className += " timeline-ether-lines-horizontal";
          divLine.style.top = offset + "px";
        }
        lineDiv.appendChild(divLine);
      }
      if (unit == Storm.DateTime.WEEK) {
        var firstDayOfWeek = theme.firstDayOfWeek;

        var saturday = new Date(date.getTime() + (6 - firstDayOfWeek - 7) * day);
        var monday = new Date(saturday.getTime() + 2 * day);

        var saturdayPixel = Math.round(band.dateToPixelOffset(saturday));
        var mondayPixel = Math.round(band.dateToPixelOffset(monday));
        var length = Math.max(1, mondayPixel - saturdayPixel);

        var divWeekend = timeline.getDocument().createElement("div");
        divWeekend.className = 'timeline-ether-weekends'

        if (weekendTheme.opacity < 100) {
//          Storm.Graphics.setOpacity(divWeekend, weekendTheme.opacity);
        }

        if (horizontal) {
          divWeekend.style.left = saturdayPixel + "px";
          divWeekend.style.width = length + "px";
        } else {
          divWeekend.style.top = saturdayPixel + "px";
          divWeekend.style.height = length + "px";
        }
        lineDiv.appendChild(divWeekend);
      }

      //@@@@横项刻度

      //刻度label
      var label = labeller.labelInterval(date, unit);

      var div = timeline.getDocument().createElement("div");
      div.innerHTML = label.text;

      div.className = 'timeline-date-label'
      if(label.emphasized) div.className += ' timeline-date-label-em'

      this.positionDiv(div, offset);
      markerDiv.appendChild(div);

      return div;
    };
  };


})(StormDetection);

