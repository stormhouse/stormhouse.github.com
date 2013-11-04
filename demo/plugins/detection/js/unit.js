/**
 * js/unit.js
 *
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-3-13
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */
(function(storm){
  var ndu = new Object();


  ndu.makeDefaultValue = function() {
    return new Date();
  };

  ndu.cloneValue = function(v) {
    return new Date(v.getTime());
  };

  ndu.getParser = function(format) {
    if (typeof format == "string") {
      format = format.toLowerCase();
    }
    return (format == "iso8601" || format == "iso 8601") ?
        storm.DateTime.parseIso8601DateTime :
        storm.DateTime.parseGregorianDateTime;
  };

  ndu.parseFromObject = function(o) {
    return storm.DateTime.parseGregorianDateTime(o);
  };

  ndu.toNumber = function(v) {
    return v.getTime();
  };

  ndu.fromNumber = function(n) {
    return new Date(n);
  };

  ndu.compare = function(v1, v2) {
    var n1, n2;
    if (typeof v1 == "object") {
      n1 = v1.getTime();
    } else {
      n1 = Number(v1);
    }
    if (typeof v2 == "object") {
      n2 = v2.getTime();
    } else {
      n2 = Number(v2);
    }

    return n1 - n2;
  };

  ndu.earlier = function(v1, v2) {
    return ndu.compare(v1, v2) < 0 ? v1 : v2;
  };

  ndu.later = function(v1, v2) {
    return ndu.compare(v1, v2) > 0 ? v1 : v2;
  };

  ndu.change = function(v, n) {
    return new Date(v.getTime() + n);
  };

  storm.NativeDateUnit = ndu;

})(Storm);

