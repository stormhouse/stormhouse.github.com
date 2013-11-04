/**
 * sorted-array.js
 *
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-3-13
 * Time: 下午4:03
 * To change this template use File | Settings | File Templates.
 */

(function(storm){

  var sorted = function(compare, initialArray){
    this._a = (initialArray instanceof Array) ? initialArray : [];
    this._compare = compare;
//    this._comparen2 = function(e){}
  }

  sorted.prototype.add = function(elmt) {
    var sa = this;
    var index = this.find(function(elmt2) {
      return sa._compare(elmt2, elmt);
    });

    if (index < this._a.length) {
      this._a.splice(index, 0, elmt);
    } else {
      this._a.push(elmt);
    }
  };

  sorted.prototype.remove = function(elmt) {
    var sa = this;
    var index = this.find(function(elmt2) {
      return sa._compare(elmt2, elmt);
    });

    while (index < this._a.length && this._compare(this._a[index], elmt) == 0) {
      if (this._a[index] == elmt) {
        this._a.splice(index, 1);
        return true;
      } else {
        index++;
      }
    }
    return false;
  };

  sorted.prototype.removeCurrentDateFlag = function() {
    var sa = this;
//    console.log(sa._a.length)
    for(var i=0; i<sa._a.length; i++){
      var el  = sa._a[i];
      if(el._instant){
        //TODO@@@@
        var lastPart = sa._a.splice(i, sa._a.length);
        sa._a = sa._a.splice(0,i);
//        sa._a.push(lastPart)
        break;
      }
    }


  };

  sorted.prototype.removeAll = function() {
    this._a = [];
  };

  sorted.prototype.elementAt = function(index) {
    return this._a[index];
  };

  sorted.prototype.length = function() {
    return this._a.length;
  };

  sorted.prototype.find = function(compare) {
    var a = 0;
    var b = this._a.length;

    while (a < b) {
      var mid = Math.floor((a + b) / 2);
      var c = compare(this._a[mid]);
      if (mid == a) {
        return c < 0 ? a+1 : a;
      } else if (c < 0) {
        a = mid;
      } else {
        b = mid;
      }
    }
    return a;
  };

  sorted.prototype.getFirst = function() {
    return (this._a.length > 0) ? this._a[0] : null;
  };

  sorted.prototype.getLast = function() {
    return (this._a.length > 0) ? this._a[this._a.length - 1] : null;
  };

  storm.SortedArray  = sorted

})(Storm);

