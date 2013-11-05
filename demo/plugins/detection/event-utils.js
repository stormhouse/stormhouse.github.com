/**
 * event-utils.js
 *
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-3-14
 * Time: 下午2:37
 * To change this template use File | Settings | File Templates.
 */

(function(de){

  var EventUtils = {};

  EventUtils.getNewEventID = function() {
    // global across page
    if (this._lastEventID == null) {
      this._lastEventID = 0;
    }

    this._lastEventID += 1;
    return "e" + this._lastEventID;
  };

  EventUtils.decodeEventElID = function(elementID) {
    /*==================================================
     *
     * Use this function to decode an event element's id on a band (label div,
     * tape div or icon img).
     *
     * Returns {band: <bandObj>, evt: <eventObj>}
     *
     * To enable a single event listener to monitor everything
     * on a Timeline, a set format is used for the id's of the
     * elements on the Timeline--
     *
     * element id format for labels, icons, tapes:
     *   labels: label-tl-<timelineID>-<band_index>-<evt.id>
     *    icons: icon-tl-<timelineID>-<band_index>-<evt.id>
     *    tapes: tape1-tl-<timelineID>-<band_index>-<evt.id>
     *           tape2-tl-<timelineID>-<band_index>-<evt.id>
     *           // some events have more than one tape
     *    highlight: highlight1-tl-<timelineID>-<band_index>-<evt.id>
     *               highlight2-tl-<timelineID>-<band_index>-<evt.id>
     *           // some events have more than one highlight div (future)
     * Note: use split('-') to get array of the format's parts
     *
     * You can then retrieve the timeline object and event object
     * by using Timeline.getTimeline, Timeline.getBand, or
     * Timeline.getEvent and passing in the element's id
     *
     *==================================================
     */

    var parts = elementID.split('-');
    if (parts[1] != 'tl') {
      alert("Internal Timeline problem 101, please consult support");
      return {band: null, evt: null}; // early return
    }

    var timeline = Timeline.getTimelineFromID(parts[2]);
    var band = timeline.getBand(parts[3]);
    var evt = band.getEventSource.getEvent(parts[4]);

    return {band: band, evt: evt};
  };

  EventUtils.encodeEventElID = function(timeline, band, elType, evt) {
    // elType should be one of {label | icon | tapeN | highlightN}
    return elType + "-tl-" + timeline.timelineID +
        "-" + band.getIndex() + "-" + evt.getID();
  };

  de.EventUtils = EventUtils;
})(StormDetection);

