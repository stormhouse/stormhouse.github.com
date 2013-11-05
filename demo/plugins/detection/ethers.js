/**
 * ether.js
 *  映射 像素坐标 <-> 时间
 *  an ether, whose sole responsibility is mapping between pixel coordinates and dates/times;
 */

(function(de){
  var ether = function(params){
    this._params = params;
    this._interval = params.interval;//间隔，StromDetection.DateTime.YEAR, MONTH ... ...
    this._pixelsPerInterval = params.pixelsPerInterval;
  };

  ether.prototype.initialize = function(band, timeline){
    this._band = band;
    this._timeline = timeline;
    this._unit = timeline.getUnit();

    if ("startsOn" in this._params) {
      this._start = this._unit.parseFromObject(this._params.startsOn);
    } else if ("endsOn" in this._params) {
      this._start = this._unit.parseFromObject(this._params.endsOn);
      this.shiftPixels(-this._timeline.getPixelLength());
    } else if ("centersOn" in this._params) {
      this._start = this._unit.parseFromObject(this._params.centersOn);
      this.shiftPixels(-this._timeline.getPixelLength() / 2);
    } else {
      this._start = this._unit.makeDefaultValue();
      this.shiftPixels(-this._timeline.getPixelLength() / 2);
    }
  }




  ether.prototype.dateToPixelOffset = function(date) {
    var numeric = this._unit.compare(date, this._start);
    return this._pixelsPerInterval * numeric / this._interval;
  };
  ether.prototype.pixelOffsetToDate = function(pixels) {
    var numeric = pixels * this._interval / this._pixelsPerInterval;
    return this._unit.change(this._start, numeric);
  };

  ether.prototype.shiftPixels = function(pixels) {
    var numeric = this._interval * pixels / this._pixelsPerInterval;
    this._start = this._unit.change(this._start, numeric);
  };





  StormDetection.LinearEther = ether;
})(StormDetection);

