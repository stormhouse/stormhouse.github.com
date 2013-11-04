/**
 * unit.js
 */
/*==================================================
 *  Default Unit
 *==================================================
 */
(function(de, storm){
  de.NativeDateUnit = new Object();

  de.NativeDateUnit.createLabeller = function(locale, timezone) {
    return new de.GregorianDateLabeller(locale, timezone);
  };

  de.NativeDateUnit.makeDefaultValue = function() {
    return new Date();
  };

  de.NativeDateUnit.cloneValue = function(v) {
    return new Date(v.getTime());
  };

  de.NativeDateUnit.getParser = function(format) {
    if (typeof format == "string") {
      format = format.toLowerCase();
    }
    return (format == "iso8601" || format == "iso 8601") ?
        storm.DateTime.parseIso8601DateTime :
        storm.DateTime.parseGregorianDateTime;
  };

  de.NativeDateUnit.parseFromObject = function(o) {
    return storm.DateTime.parseGregorianDateTime(o);
  };

  de.NativeDateUnit.toNumber = function(v) {
    return v.getTime();
  };

  de.NativeDateUnit.fromNumber = function(n) {
    return new Date(n);
  };

  de.NativeDateUnit.compare = function(v1, v2) {
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

  de.NativeDateUnit.earlier = function(v1, v2) {
    return de.NativeDateUnit.compare(v1, v2) < 0 ? v1 : v2;
  };

  de.NativeDateUnit.later = function(v1, v2) {
    return de.NativeDateUnit.compare(v1, v2) > 0 ? v1 : v2;
  };

  de.NativeDateUnit.change = function(v, n) {
    return new Date(v.getTime() + n);
  };

})(StormDetection, Storm);

