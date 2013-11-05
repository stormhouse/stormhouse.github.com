(function ($) {
  function init(target) {
    $(target).addClass("tooltip-f");
  };
  function bindEvents(target) {
    var opts = $.data(target, "tooltip").options;

    $(document).unbind('.tooltip').bind('mousedown', function(e){
      hide(target, e);
    });
    $(target).unbind(".tooltip").bind(opts.showEvent + ".tooltip",function (e) {
//      e.stopPropagation();
      show(target, e);
    })
//        .bind(opts.hideEvent + ".tooltip",function (e) {
//          hide(target, e);
//    })
//        .bind("mousemove.tooltip", function (e) {
//          if (opts.trackMouse) {
//            opts.trackMouseX = e.pageX;
//            opts.trackMouseY = e.pageY;
//            resize(target);
//          }
//        })
        .bind('mousedown.tooltip', function(e){
          e.stopPropagation();
        });
    opts.content.bind('mousedown.tooltip', function(e){
      e.stopPropagation();
    });
  };
  function clearTimeout(target) {
    var opts = $.data(target, "tooltip");
    if (opts.showTimer) {
      clearTimeout(opts.showTimer);
      opts.showTimer = null;
    }
    if (opts.hideTimer) {
      clearTimeout(opts.hideTimer);
      opts.hideTimer = null;
    }
  };
  function resize(target) {
    var opts = $.data(target, "tooltip");
    if (!opts || opts.tip) {
      return;
    }
    var opts = opts.options;
    var tip = opts.tip;
    if (opts.trackMouse) {
      t = $();
      var left = opts.trackMouseX + opts.deltaX;
      var top = opts.trackMouseY + opts.deltaY;
    } else {
      var t = $(target);
      var left = t.offset().left + opts.deltaX;
      var top = t.offset().top + opts.deltaY;
    }
    switch (opts.position) {
      case "right":
        left += t.outerWidth() + 12 + (opts.trackMouse ? 12 : 0);
        top -= (tip.outerHeight() - t.outerHeight()) / 2;
        break;
      case "left":
        left -= tip.outerWidth() + 12 + (opts.trackMouse ? 12 : 0);
        top -= (tip.outerHeight() - t.outerHeight()) / 2;
        break;
      case "top":
        left -= (tip.outerWidth() - t.outerWidth()) / 2;
        top -= tip.outerHeight() + 12 + (opts.trackMouse ? 12 : 0);
        break;
      case "bottom":
        left -= (tip.outerWidth() - t.outerWidth()) / 2;
        top += t.outerHeight() + 12 + (opts.trackMouse ? 12 : 0);
        break;
    }
    tip.css({left: left, top: top, zIndex: (opts.zIndex != undefined ? opts.zIndex : ($.fn.window ? $.fn.window.defaults.zIndex++ : ""))});
    opts.onPosition.call(target, left, top);
  };
  function show(target, e) {
    var opts = $.data(target, "tooltip");
    var opts = opts.options;
    var tip = opts.tip;
    if (!tip) {
      tip = $("<div tabindex=\"-1\" class=\"tooltip\">" + "<div class=\"tooltip-content\"></div>" + "<div class=\"tooltip-arrow-outer\"></div>" + "<div class=\"tooltip-arrow\"></div>" + "</div>").appendTo("body");
      opts.tip = tip;
      updateContent(target);
    }
    tip.removeClass("tooltip-top tooltip-bottom tooltip-left tooltip-right").addClass("tooltip-" + opts.position);
    clearTimeout(target);
    opts.showTimer = setTimeout(function () {
      resize(target);
      tip.show();
      opts.onShow.call(target, e);
      var _1b8 = tip.children(".tooltip-arrow-outer");
      var _1b9 = tip.children(".tooltip-arrow");
      var bc = "border-" + opts.position + "-color";
      _1b8.add(_1b9).css({borderTopColor: "", borderBottomColor: "", borderLeftColor: "", borderRightColor: ""});
      _1b8.css(bc, tip.css(bc));
      _1b9.css(bc, tip.css("backgroundColor"));
    }, opts.showDelay);
  };
  function hide(target, e) {
    var opts = $.data(target, "tooltip").options;
    if (opts && opts.tip) {
      clearTimeout(target);
      opts.hideTimer = setTimeout(function () {
        opts.tip.hide();
        opts.onHide.call(target, e);
      }, opts.hideDelay);
    }
  };
  function updateContent(target, content) {
    var opts = $.data(target, "tooltip");
    var opts = opts.options;
    if (content) {
      opts.content = content;
    }
    if (!opts.tip) {
      return;
    }
    var cc = typeof opts.content == "function" ? opts.content.call(target) : opts.content;
    opts.tip.children(".tooltip-content").html(cc);
    opts.onUpdate.call(target, cc);
  };
  function destroy(target) {
    var opts = $.data(target, "tooltip");
    if (opts) {
      clearTimeout(target);
      var opts = opts.options;
      if (opts.tip) {
        opts.tip.remove();
      }
      if (opts._title) {
        $(target).attr("title", opts._title);
      }
      $.removeData(target, "tooltip");
      $(target).unbind(".tooltip").removeClass("tooltip-f");
      opts.onDestroy.call(target);
    }
  };
  $.fn.tooltip = function (option, param) {
    if (typeof option == "string") {
      return $.fn.tooltip.methods[option](this, param);
    }
    option = option || {};
    return this.each(function () {
      var _1c5 = $.data(this, "tooltip");
      if (_1c5) {
        $.extend(_1c5.options, option);
      } else {
        $.data(this, "tooltip", {options: $.extend({}, $.fn.tooltip.defaults, $.fn.tooltip.parseOptions(this), option)});
        init(this);
      }
      bindEvents(this);
      updateContent(this);
    });
  };

  $.fn.tooltip.methods = {
    options: function (jq) {
      return $.data(jq[0], "tooltip").options;
    },
    tip: function (jq) {
      return $.data(jq[0], "tooltip").options.tip;
    },
    arrow: function (jq) {
      return jq.tooltip("tip").children(".tooltip-arrow-outer,.tooltip-arrow");
    },
    show: function (jq, e) {
      return jq.each(function () {
        show(this, e);
      });
    },
    hide: function (jq, e) {
      return jq.each(function () {
        hide(this, e);
      });
    },
    update: function (jq, _1c6) {
      return jq.each(function () {
        updateContent(this, _1c6);
      });
    },
    reposition: function (jq) {
      return jq.each(function () {
        resize(this);
      });
    },
    destroy: function (jq) {
      return jq.each(function () {
        destroy(this);
      });
    }
  };

  $.fn.tooltip.parseOptions = function (_1c7) {
    var t = $(_1c7);
//    var opts = $.extend({}, $.parser.parseOptions(_1c7, ["position", "showEvent", "hideEvent", "content", {deltaX: "number", deltaY: "number", showDelay: "number", hideDelay: "number"}]), {_title: t.attr("title")});
    var opts = $.extend({}, {_title: t.attr("title")});
    t.attr("title", "");
    if (!opts.content) {
      opts.content = opts._title;
    }
    return opts;
  };
  $.fn.tooltip.defaults = {
    position: "bottom",
    content: null,
    trackMouse: false,
    deltaX: 0,
    deltaY: 0,
    showEvent: "mouseenter",
    hideEvent: "mouseleave",
    showDelay: 200,
    hideDelay: 100,
    onShow: function (e) {},
    onHide: function (e) {},
    onUpdate: function (_1c8) {},
    onPosition: function (left, top) {},
    onDestroy: function () {}};
})(jQuery);