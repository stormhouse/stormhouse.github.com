/**
 * dom.js
 * TODO
 * 不用dom.js,转用jquery
 *
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-3-4
 * Time: 下午4:01
 * To change this template use File | Settings | File Templates.
 */

//dependencies
//  platform.js
(function(storm){
  var platform = storm.Platform;
  var dom = {}

  dom.registerEventWithObject = function(elmt, eventName, obj, handlerName) {
    dom.registerEvent(elmt, eventName, function(elmt2, evt, target) {
      return obj[handlerName].call(obj, elmt2, evt, target);
    });
  };

  dom.registerEvent = function(elmt, eventName, handler) {
    var handler2 = function(evt) {
      evt = (evt) ? evt : ((event) ? event : null);
      if (evt) {
        var target = (evt.target) ?
          evt.target : ((evt.srcElement) ? evt.srcElement : null);
        if (target) {
          target = (target.nodeType == 1 || target.nodeType == 9) ?
            target : target.parentNode;
        }

        return handler(elmt, evt, target);
      }
      return true;
    }

    if (platform.browser.isIE) {
      elmt.attachEvent("on" + eventName, handler2);
    } else {
      elmt.addEventListener(eventName, handler2, false);
    }
  };

  storm.DOM = dom;
})(Storm);

