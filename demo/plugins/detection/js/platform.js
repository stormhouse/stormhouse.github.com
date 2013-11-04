/**
 * platform.js
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-3-4
 * Time: 下午3:59
 * To change this template use File | Settings | File Templates.
 */
(function(storm){

  var platform = {};
  platform.os = {
    isMac:   false,
    isWin:   false,
    isWin32: false,
    isUnix:  false
  }
  platform.browser = {
    isIE:           false,
    isNetscape:     false,
    isMozilla:      false,
    isFirefox:      false,
    isOpera:        false,
    isSafari:       false,

    majorVersion:   0,
    minorVersion:   0
  };
  (function() {
    var an = navigator.appName.toLowerCase();
    var ua = navigator.userAgent.toLowerCase();

    platform.os.isMac = (ua.indexOf('mac') != -1);
    platform.os.isWin = (ua.indexOf('win') != -1);
    platform.os.isWin32 = platform.isWin && (
      ua.indexOf('95') != -1 ||
        ua.indexOf('98') != -1 ||
        ua.indexOf('nt') != -1 ||
        ua.indexOf('win32') != -1 ||
        ua.indexOf('32bit') != -1
      );
    platform.os.isUnix = (ua.indexOf('x11') != -1);

    platform.browser.isIE = (an.indexOf("microsoft") != -1);
    platform.browser.isNetscape = (an.indexOf("netscape") != -1);
    platform.browser.isMozilla = (ua.indexOf("mozilla") != -1);
    platform.browser.isFirefox = (ua.indexOf("firefox") != -1);
    platform.browser.isOpera = (an.indexOf("opera") != -1);
    platform.browser.isSafari = (an.indexOf("safari") != -1);

    var parseVersionString = function(s) {
      var a = s.split(".");
      platform.browser.majorVersion = parseInt(a[0]);
      platform.browser.minorVersion = parseInt(a[1]);
    };
    var indexOf = function(s, sub, start) {
      var i = s.indexOf(sub, start);
      return i >= 0 ? i : s.length;
    };

    if (platform.browser.isMozilla) {
      var offset = ua.indexOf("mozilla/");
      if (offset >= 0) {
        parseVersionString(ua.substring(offset + 8, indexOf(ua, " ", offset)));
      }
    }
    if (platform.browser.isIE) {
      var offset = ua.indexOf("msie ");
      if (offset >= 0) {
        parseVersionString(ua.substring(offset + 5, indexOf(ua, ";", offset)));
      }
    }
    if (platform.browser.isNetscape) {
      var offset = ua.indexOf("rv:");
      if (offset >= 0) {
        parseVersionString(ua.substring(offset + 3, indexOf(ua, ")", offset)));
      }
    }
    if (platform.browser.isFirefox) {
      var offset = ua.indexOf("firefox/");
      if (offset >= 0) {
        parseVersionString(ua.substring(offset + 8, indexOf(ua, " ", offset)));
      }
    }

    if (!("localeCompare" in String.prototype)) {
      String.prototype.localeCompare = function (s) {
        if (this < s) return -1;
        else if (this > s) return 1;
        else return 0;
      };
    }
  })();

  storm.Platform = platform;
})(Storm);

