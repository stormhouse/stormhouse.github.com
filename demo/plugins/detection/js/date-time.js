/**
 * date-time.js
 * http://www.simile-widgets.org/wiki/Timeline_Basics
 */

(function(storm){
  //info
  storm.auther = 'stormhouse';
  storm.email = 'stormhouse@yeah.net';


  /**
   * 得到用户浏览器的当前时间，格式为MM/dd/yyyy hh:mm:ss
   * @return
   */
  Date.prototype.current = function() {
    var x = this;
    var y = 'MM/dd/yyyy hh:mm:ss';
    var z = {
      M : x.getMonth() + 1,
      d : x.getDate(),
      h : x.getHours(),
      m : x.getMinutes(),
      s : x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
      return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1)))
          .slice(-2)
    });
    return y.replace(/(y+)/g, function(v) {
      return x.getFullYear().toString().slice(-v.length)
    });
  }
  /**
   * 将当前操作的时间变更时区(主要用于转换一个其他时区的时间)
   *
   * @param {int} tzo 原时区 -12~13
   * @param {tzn} tzn 目标时区 -12~13 默认为当前时区
   *
   * 示例: 把东8区的转为东5.5区的时间
   * var a = new Date();
   * var result = a.changeTimezone(8, 5.5)
   */
  Date.prototype.changeTimezone = function(tzo,tzn) {
    tzo = tzo * 60;
    tzn = tzn ? tzn * 60 : -this.getTimezoneOffset();
    this.setTime(this.getTime() - (tzo - tzn) * 60 * 1000);
    return this;
  };
  Date.prototype.change2Timezone = function(tzone){
    var localOffset = this.getTimezoneOffset() * 60000;
    var utc = this.getTime() + localOffset;
    var t = utc + (3600000*tzone);
    this.setTime(t);
    return this;
  }

  //constants
  var dt = new Object();
  dt.MILLISECOND    = 0,
    dt.SECOND         = 1,
    dt.MINUTE         = 2,
    dt.HOUR           = 3,
    dt.DAY            = 4,
    dt.WEEK           = 5,
    dt.MONTH          = 6,
    dt.YEAR           = 7,
    dt.DECADE         = 8,
    dt.CENTURY        = 9,
    dt.MILLENNIUM     = 10,
    dt.EPOCH          = -1,
    dt.ERA            = -2;
  dt.gregorianUnitLengths = [];
    (function() {
      var d = dt;
      var a = d.gregorianUnitLengths;

      a[d.MILLISECOND] = 1;
      a[d.SECOND]      = 1000;
      a[d.MINUTE]      = a[d.SECOND] * 60;
      a[d.HOUR]        = a[d.MINUTE] * 60;
      a[d.DAY]         = a[d.HOUR] * 24;
      a[d.WEEK]        = a[d.DAY] * 7;
      a[d.MONTH]       = a[d.DAY] * 31;
      a[d.YEAR]        = a[d.DAY] * 365;
      a[d.DECADE]      = a[d.YEAR] * 10;
      a[d.CENTURY]     = a[d.YEAR] * 100;
      a[d.MILLENNIUM]  = a[d.YEAR] * 1000;
    })();


  storm.DateTime = dt;

  /**
   * Takes a string containing a Gregorian date and time and returns a newly
   * instantiated date object with the parsed date and time information from the
   * string.  If the param is actually an instance of Date instead of a string,
   * simply returns the given date instead.
   *
   * @param {Object} o an object, to either return or parse as a string
   * @return {Date} the date object
   */
  storm.DateTime.parseGregorianDateTime = function(o) {
    if (o == null) {
      return null;
    } else if (o instanceof Date) {
      return o;
    }
    if(o.length == 13){
      return new Date(parseFloat(o));
    }

    var s = o.toString();
    if (s.length > 0 && s.length < 8) {
      var space = s.indexOf(" ");
      if (space > 0) {
        var year = parseInt(s.substr(0, space));
        var suffix = s.substr(space + 1);
        if (suffix.toLowerCase() == "bc") {
          year = 1 - year;
        }
      } else {
        var year = parseInt(s);
      }

      var d = new Date(0);
      d.setUTCFullYear(year);

      return d;
    }

    try {
      return new Date(Date.parse(s));
    } catch (e) {
      return null;
    }
  };

  /**
   * Rounds date objects down to the nearest interval or multiple of an interval.
   * This method modifies the given date object, converting it to the given
   * timezone if specified.
   *
   * @param {Date} date the date object to round
   * @param {Number} intervalUnit a constant, integer index specifying an
   *   interval, e.g. storm.DateTime.HOUR
   * @param {Number} timeZone a timezone shift, given in hours
   * @param {Number} multiple a multiple of the interval to round by
   * @param {Number} firstDayOfWeek an integer specifying the first day of the
   *   week, 0 corresponds to Sunday, 1 to Monday, etc.
   */
  storm.DateTime.roundDownToInterval = function(date, intervalUnit, timeZone, multiple, firstDayOfWeek) {
    var timeShift = timeZone *
      storm.DateTime.gregorianUnitLengths[storm.DateTime.HOUR];

    var date2 = new Date(date.getTime() + timeShift);
    var clearInDay = function(d) {
      d.setUTCMilliseconds(0);
      d.setUTCSeconds(0);
      d.setUTCMinutes(0);
      d.setUTCHours(0);
    };
    var clearInYear = function(d) {
      clearInDay(d);
      d.setUTCDate(1);
      d.setUTCMonth(0);
    };

    switch(intervalUnit) {
      case storm.DateTime.MILLISECOND:
        var x = date2.getUTCMilliseconds();
        date2.setUTCMilliseconds(x - (x % multiple));
        break;
      case storm.DateTime.SECOND:
        date2.setUTCMilliseconds(0);

        var x = date2.getUTCSeconds();
        date2.setUTCSeconds(x - (x % multiple));
        break;
      case storm.DateTime.MINUTE:
        date2.setUTCMilliseconds(0);
        date2.setUTCSeconds(0);

        var x = date2.getUTCMinutes();
        date2.setTime(date2.getTime() -
          (x % multiple) * storm.DateTime.gregorianUnitLengths[storm.DateTime.MINUTE]);
        break;
      case storm.DateTime.HOUR:
        date2.setUTCMilliseconds(0);
        date2.setUTCSeconds(0);
        date2.setUTCMinutes(0);

        var x = date2.getUTCHours();
        date2.setUTCHours(x - (x % multiple));
        break;
      case storm.DateTime.DAY:
        clearInDay(date2);
        break;
      case storm.DateTime.WEEK:
        clearInDay(date2);
        var d = (date2.getUTCDay() + 7 - firstDayOfWeek) % 7;
        date2.setTime(date2.getTime() -
          d * storm.DateTime.gregorianUnitLengths[storm.DateTime.DAY]);
        break;
      case storm.DateTime.MONTH:
        clearInDay(date2);
        date2.setUTCDate(1);

        var x = date2.getUTCMonth();
        date2.setUTCMonth(x - (x % multiple));
        break;
      case storm.DateTime.YEAR:
        clearInYear(date2);

        var x = date2.getUTCFullYear();
        date2.setUTCFullYear(x - (x % multiple));
        break;
      case storm.DateTime.DECADE:
        clearInYear(date2);
        date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 10) * 10);
        break;
      case storm.DateTime.CENTURY:
        clearInYear(date2);
        date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 100) * 100);
        break;
      case storm.DateTime.MILLENNIUM:
        clearInYear(date2);
        date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 1000) * 1000);
        break;
    }

    date.setTime(date2.getTime() - timeShift);
  };

  /**
   * Increments a date object by a specified interval, taking into
   * consideration the timezone.
   *
   * @param {Date} date the date object to increment
   * @param {Number} intervalUnit a constant, integer index specifying an
   *   interval, e.g. SimileAjax.DateTime.HOUR
   * @param {Number} timeZone the timezone offset in hours
   */
  storm.DateTime.incrementByInterval = function(date, intervalUnit, timeZone) {
    timeZone = (typeof timeZone == 'undefined') ? 0 : timeZone;

    var timeShift = timeZone *
      storm.DateTime.gregorianUnitLengths[storm.DateTime.HOUR];

    var date2 = new Date(date.getTime() + timeShift);

    switch(intervalUnit) {
      case dt.MILLISECOND:
        date2.setTime(date2.getTime() + 1)
        break;
      case dt.SECOND:
        date2.setTime(date2.getTime() + 1000);
        break;
      case dt.MINUTE:
        date2.setTime(date2.getTime() +
          dt.gregorianUnitLengths[dt.MINUTE]);
        break;
      case dt.HOUR:
        date2.setTime(date2.getTime() +
          dt.gregorianUnitLengths[dt.HOUR]);
        break;
      case dt.DAY:
        date2.setUTCDate(date2.getUTCDate() + 1);
        break;
      case dt.WEEK:
        date2.setUTCDate(date2.getUTCDate() + 7);
        break;
      case dt.MONTH:
        date2.setUTCMonth(date2.getUTCMonth() + 1);
        break;
      case dt.YEAR:
        date2.setUTCFullYear(date2.getUTCFullYear() + 1);
        break;
      case dt.DECADE:
        date2.setUTCFullYear(date2.getUTCFullYear() + 10);
        break;
      case dt.CENTURY:
        date2.setUTCFullYear(date2.getUTCFullYear() + 100);
        break;
      case dt.MILLENNIUM:
        date2.setUTCFullYear(date2.getUTCFullYear() + 1000);
        break;
    }

    date.setTime(date2.getTime() - timeShift);
  };


})(Storm);

