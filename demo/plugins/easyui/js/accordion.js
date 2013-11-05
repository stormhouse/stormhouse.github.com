/**
 * accordion - jQuery EasyUI
 *
 * Licensed under the GPL:
 *   http://www.gnu.org/licenses/gpl.txt
 *
 * Copyright 2010 stworthy [ stworthy@gmail.com ]
 *
 * Dependencies:
 * 	 panel
 *
 */

(function($){

  function setSize(container){
    var opts = $.data(container, 'accordion').options;
    var panels = $.data(container, 'accordion').panels;

    var cc = $(container);
    if (opts.fit == true){
      var p = cc.parent();
      opts.width = p.width();
      opts.height = p.height();
    }

    if (opts.width > 0){
      cc.width($.support.boxModel==true ? (opts.width-(cc.outerWidth()-cc.width())) : opts.width);
    }
    var panelHeight = 'auto';
    if (opts.height > 0){
      cc.height($.support.boxModel==true ? (opts.height-(cc.outerHeight()-cc.height())) : opts.height);
      // get the first panel's header height as all the header height
      var headerHeight = panels[0].panel('header').css('height', null).outerHeight();
      var panelHeight = cc.height() - (panels.length-1)*headerHeight;
    }
    for(var i=0; i<panels.length; i++){
      var panel = panels[i];
      var header = panel.panel('header');
      header.height($.support.boxModel==true ? (headerHeight-(header.outerHeight()-header.height())) : headerHeight);
      panel.panel('resize', {
        width: cc.width(),
        height: panelHeight
      });
    }

  }

  /**
   * get the current panel DOM element
   */
  function getCurrent(container){
    var panels = $.data(container, 'accordion').panels;
    for(var i=0; i<panels.length; i++){
      var panel = panels[i];
      if (panel.panel('options').collapsed == false){
        return panel;
      }
    }
    return null;
  }

  function wrapAccordion(container, opts){
    var cc = $(container);
    cc.addClass('eui-accordion');

    if (opts.border == false){
      cc.addClass('eui-accordion-noborder');
    } else {
      cc.removeClass('eui-accordion-noborder');
    }

    // the original panel DOM elements
    var panels = [];

    // if no panel selected set the first one active
    if (cc.find('>div[selected=true]').length == 0){
      cc.find('>div:first').attr('selected', 'true');
    }

    cc.find('>div').each(function(){
      var pp = $(this);
      var h = pp.attr('data-hide');
      panels.push(pp);
      pp.panel({
        cls: h ? 'none' :'',
        collapsible: true,
        minimizable: false,
        maximizable: false,
        closable: false,
        doSize: false,
        collapsed: opts.collapseAll == true ? true : pp.attr('selected') != 'selected',
        leftCheckbox: opts.leftCheckbox,

        onBeforeExpand: function(){
          var curr = getCurrent(container);
          if (curr){
            var header = $(curr).panel('header');
            header.removeClass('eui-accordion-header-selected');
            header.find('.eui-panel-tool-collapse').triggerHandler('click');
          }
          pp.panel('header').addClass('eui-accordion-header-selected');
        },
        onExpand: function(){
          pp.panel('body').find('>div').triggerHandler('_resize');
          opts.onExpand.call(pp, pp, panels)
        },
        onBeforeCollapse: function(){
          pp.panel('header').removeClass('eui-accordion-header-selected');
//          pp.panel('body').find('>div').triggerHandler('_resize');
        }
      });

      pp.panel('body').addClass('eui-accordion-body');
      pp.panel('header').addClass('eui-accordion-header').click(function(){
        $(this).find('.eui-panel-tool-collapse').triggerHandler('click');
        return false;
      });

    });
    cc.bind('_resize', function(){
      var opts = $.data(container, 'accordion').options;
      if (opts.fit == true){
        setSize(container);
      }
      return false;
    });
    return {
      accordion: cc,
      panels: panels
    }
  }

  /**
   * select and set the special panel active
   */
  function select(container, title){
    var panels = $.data(container, 'accordion').panels;
    var curr = getCurrent(container);
    if (curr && getTitle(curr) == title){
      return;
    }

    for(var i=0; i<panels.length; i++){
      var panel = panels[i];
      if (getTitle(panel) == title){
        $(panel).panel('header').triggerHandler('click');
        return;
      }
    }

//    curr = getCurrent(container);
    try{
      curr.panel('header').addClass('eui-accordion-header-selected');
    }catch(ex){}


    function getTitle(panel){
      return $(panel).panel('options').title;
    }
  }

  function activate(container, index){
    var panels = $.data(container, 'accordion').panels;
    if('number' === typeof index && index>=0 && index<panels.length){
      var p = panels[index];
      p.panel('header').trigger('click');
      return p;
    }
  }
  function getPanel(container, index){
    var panels = $.data(container, 'accordion').panels;
    if('number' === typeof index && index>=0 && index<panels.length){
      var p = panels[index];
      return p;
    }
    return p;
  }

  $.fn.accordion = function(options, param){
    if (typeof options == 'string'){
      switch(options){
        case 'select':
          return this.each(function(){
            select(this, param);
          });
        //自定义激活某个面板
        case 'activate':
          return this.each(function(){
            activate(this, param);
          });
        case 'getPanel':
          return getPanel(this[0], param);
      }
    }

    options = options || {};
    return this.each(function(){
      var state = $.data(this, 'accordion');
      var opts;
      if(state){
//        $.data();
      }else{
        var t = $(this);
        opts = $.extend({}, $.fn.accordion.defaults, {
          width: (parseInt(t.css('width')) || undefined),
          height: (parseInt(t.css('height')) || undefined),
          fit: (t.attr('fit') ? t.attr('fit') == 'true' : undefined),
          border: (t.attr('border') ? t.attr('border') == 'true' : undefined)
        }, options);
        var r = wrapAccordion(this, opts);
        $.data(this, 'accordion', {
          options: opts,
          accordion: r.accordion,
          panels: r.panels
        });
      }

      setSize(this);
      select(this);
    });
  }

  $.fn.accordion.defaults = {
    width: 'auto',
    height: 'auto',
    fit: false,
    collapseAll: false,
    border: false
  }
})(jQuery);