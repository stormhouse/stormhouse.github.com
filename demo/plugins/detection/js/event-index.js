/**
 * event-index.js
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-3-13
 * Time: 下午4:49
 * To change this template use File | Settings | File Templates.
 */

(function(storm){
  var eventIndex = function(unit) {
    var eventIndex = this;

    this._unit = (unit != null) ? unit : storm.NativeDateUnit;
    this._events = new storm.SortedArray(
        function(event1, event2) {
          return eventIndex._unit.compare(event1.getStart(), event2.getStart());
        }
    );
    this._idToEvent = {};
    this._indexed = true;
  };

  eventIndex.prototype.add = function(evt) {
    this._events.add(evt);
    this._idToEvent[evt.getID()] = evt;
    this._indexed = false;
  };
  eventIndex.prototype.clear = function(evt) {
    this._events.removeAll();
    this._idToEvent = {};
    this._indexed = true;
//    this._idToEvent[evt.getID()] = evt;
//    this._indexed = false;
  };

  eventIndex.prototype.getReverseIterator = function(startDate, endDate) {
    if (!this._indexed) {
      this._index();
    }
    return new eventIndex._ReverseIterator(this._events, startDate, endDate, this._unit);
  };

  eventIndex.prototype._index = function() {
    /*
     *  For each event, we want to find the earliest preceding
     *  event that overlaps with it, if any.
     */

    var l = this._events.length();
    for (var i = 0; i < l; i++) {
      var evt = this._events.elementAt(i);
      evt._earliestOverlapIndex = i;
    }

    var toIndex = 1;
    for (var i = 0; i < l; i++) {
      var evt = this._events.elementAt(i);
      var end = evt.getEnd();

      toIndex = Math.max(toIndex, i + 1);
      while (toIndex < l) {
        var evt2 = this._events.elementAt(toIndex);
        var start2 = evt2.getStart();

        if (this._unit.compare(start2, end) < 0) {
          evt2._earliestOverlapIndex = i;
          toIndex++;
        } else {
          break;
        }
      }
    }
    this._indexed = true;
  };
  eventIndex.prototype.removeCurrentDateFlag = function(){
    this._events.removeCurrentDateFlag();
  }

  eventIndex._ReverseIterator = function(events, startDate, endDate, unit) {
    this._events = events;
    this._startDate = startDate;
    this._endDate = endDate;
    this._unit = unit;

    this._minIndex = events.find(function(evt) {
      return unit.compare(evt.getStart(), startDate);
    });
    if (this._minIndex - 1 >= 0) {
      this._minIndex = this._events.elementAt(this._minIndex - 1)._earliestOverlapIndex;
    }

    this._maxIndex = events.find(function(evt) {
      return unit.compare(evt.getStart(), endDate);
    });

    this._currentIndex = this._maxIndex;
    this._hasNext = false;
    this._next = null;
    this._findNext();
  };

  eventIndex._ReverseIterator.prototype = {
    hasNext: function() { return this._hasNext; },
    next: function() {
      if (this._hasNext) {
        var next = this._next;
        this._findNext();

        return next;
      } else {
        return null;
      }
    },
    _findNext: function() {
      var unit = this._unit;
      while ((--this._currentIndex) >= this._minIndex) {
        var evt = this._events.elementAt(this._currentIndex);
        if (unit.compare(evt.getStart(), this._endDate) < 0 &&
            unit.compare(evt.getEnd(), this._startDate) > 0) {

          this._next = evt;
          this._hasNext = true;
          return;
        }
      }
      this._next = null;
      this._hasNext = false;
    }
  };

  storm.EventIndex  = eventIndex;

})(Storm);

