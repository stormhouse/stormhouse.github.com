/**
 * labeller.js
 */
(function(de){

  //GregorianDateLabeller

  var gdl = function(locale, timezone) {
    this._locale = locale;
    this._timezone = timezone;
  };

  gdl.monthNames = [];
  gdl.dayNames = [];
  gdl.labelIntervalFunctions = [];

  gdl.prototype.labelInterval = function(date, intervalUnit) {
    var f = gdl.labelIntervalFunctions[this._locale];
    if (f == null) {
      f = gdl.prototype.defaultLabelInterval;
    }
    return f.call(this, date, intervalUnit);
  };

  gdl.prototype.defaultLabelInterval = function(date, intervalUnit) {
    var text;
    var emphasized = false;

//    date = Storm.DateTime.removeTimeZoneOffset(date, this._timezone);

    switch(intervalUnit) {
      case Storm.DateTime.MILLISECOND:
        text = date.getUTCMilliseconds();
        break;
      case Storm.DateTime.SECOND:
        text = date.getUTCSeconds();
        break;
      case Storm.DateTime.MINUTE:
        var m = date.getUTCMinutes();
        if (m == 0) {
          text = date.getUTCHours() + ":00";
          emphasized = true;
        } else {
          text = m;
        }
        break;
      case Storm.DateTime.HOUR:
        if(this._locale == 'zh_cn'){
          if(date.getHours() === 0){
            text = date.getMonth()+1+de.i18n.month+date.getDate()+de.i18n.day;
          }else{
            text = date.getHours() + ":00";
          }
//          英文
        }else{
          if(date.getHours() === 0){
            text = de.i18n.month[date.getMonth()]+' '+date.getDate();
          }else{
            text = date.getHours() + ":00";
          }
        }

//        if(date.getUTCHours() === 0){
//          text = date.getUTCMonth()+1+'月'+date.getUTCDate()+'日'
//        }else{
//          text = date.getUTCHours() + "hr";
//        }
        break;
      case Storm.DateTime.DAY:
        text = Timeline.GregorianDateLabeller.getMonthName(date.getUTCMonth(), this._locale) + " " + date.getUTCDate();
        break;
      case Storm.DateTime.WEEK:
        text = Timeline.GregorianDateLabeller.getMonthName(date.getUTCMonth(), this._locale) + " " + date.getUTCDate();
        break;
      case Storm.DateTime.MONTH:
        var m = date.getUTCMonth();
        if (m != 0) {
          text = Timeline.GregorianDateLabeller.getMonthName(m, this._locale);
          break;
        } // else, fall through
      case Storm.DateTime.YEAR:
      case Storm.DateTime.DECADE:
      case Storm.DateTime.CENTURY:
      case Storm.DateTime.MILLENNIUM:
        var y = date.getUTCFullYear();
        if (y > 0) {
          text = date.getUTCFullYear();
        } else {
          text = (1 - y) + "BC";
        }
        emphasized =
          (intervalUnit == Storm.DateTime.MONTH) ||
            (intervalUnit == Storm.DateTime.DECADE && y % 100 == 0) ||
            (intervalUnit == Storm.DateTime.CENTURY && y % 1000 == 0);
        break;
      default:
        text = date.toUTCString();
    }
    return { text: text, emphasized: emphasized };
  }

  de.GregorianDateLabeller = gdl;

})(StormDetection);

