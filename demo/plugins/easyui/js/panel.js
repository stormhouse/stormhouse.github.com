/**
 * panel - jQuery EasyUI
 *
 * Licensed under the GPL:
 *   http://www.gnu.org/licenses/gpl.txt
 *
 * Copyright 2010 stworthy [ stworthy@gmail.com ]
 *
 */
(function($){

  function removeNode(node){
    node.each(function(){
      $(this).remove();
      if ($.browser.msie){
        this.outerHTML = '';
      }
    });
  }

  function setSize(target, param){
    var opts = $.data(target, 'panel').options;
    var panel = $.data(target, 'panel').panel;
    var pheader = panel.find('>div.eui-panel-header');
    var pbody = panel.find('>div.eui-panel-body');

    if(param){
      if(param.width) opts.width = param.width;
      if(param.height) opts.height = param.height;
      if (param.left != null) opts.left = param.left;
      if (param.top != null) opts.top = param.top;
    }

//    自适应父级元素
    if (opts.fit == true){
      var p = panel.parent();
      opts.width = p.width();
      opts.height = p.height();
    }

    panel.css({
      left: opts.left,
      top: opts.top
    });
    panel.css(opts.style);
    panel.addClass(opts.cls);
    pheader.addClass(opts.headerCls);
    pbody.addClass(opts.bodyCls);

    if (!isNaN(opts.width)){
      //标准盒子模型
      if ($.support.boxModel == true){
        panel.width(opts.width - (panel.outerWidth() - panel.width()));
        pheader.width(panel.width() - (pheader.outerWidth() - pheader.width()));
        pbody.width(panel.width() - (pbody.outerWidth() - pbody.width()));
        //IE 6 7怪癖模式
      } else {
        panel.width(opts.width);
        pheader.width(panel.width());
        pbody.width(panel.width());
      }
    }else{
      panel.width('auto');
      pbody.width('auto');
    };
    if (!isNaN(opts.height)){
      //传统盒子模型
      if ($.support.boxModel == true){
//        panel.height(opts.height - (panel.outerHeight() - panel.height()));
        pbody.height(panel.height() - pheader.outerHeight() - (pbody.outerHeight() - pbody.height()));
      } else {
        panel.height(opts.height);
        pbody.height(panel.height() - pheader.outerHeight());
      }
    } else {
      pbody.height('auto');
    }
    panel.css('height', null);
    opts.onResize.call(target, opts.width, opts.height);
    panel.find('>div.eui-panel-body>div').triggerHandler('_resize');
  }

  function movePanel(target, param){
    var opts = $.data(target, 'panel').options;
    var panel = $.data(target, 'panel').panel;
    if (param){
      if (param.left != null) opts.left = param.left;
      if (param.top != null) opts.top = param.top;
    }
    panel.css({
      left: opts.left,
      top: opts.top
    });
    opts.onMove.apply(target, [opts.left, opts.top]);
  }

  function wrapPanel(target){
    var panel = $(target).addClass('eui-panel-body').wrap('<div class="eui-panel"></div>').parent();
    //TODO 自适应
    panel.bind('_resize', function(){
      var opts = $.data(target, 'panel').options;
      if (opts.fit == true){
        setSize(target);
      }
      return false;
    });
    return panel;
  }

  function addHeader(target){
    var opts = $.data(target, 'panel').options;
    var panel = $.data(target, 'panel').panel;
    removeNode(panel.find('>div.eui-panel-header'));
    if (opts.title && !opts.noheader){
      var header = $('<div class="eui-panel-header"><div class="eui-panel-title">'+opts.title+'</div></div>').prependTo(panel);
      if (opts.iconCls){
        header.find('.eui-panel-title').addClass('eui-panel-with-icon');
        $('<div class="eui-panel-icon"></div>').addClass(opts.iconCls).appendTo(header);
      }
      var tool = $('<div class="eui-panel-tool"></div>').appendTo(header);
      if (opts.closable){
        $('<a class="eui-panel-tool-close"></a>').appendTo(tool).bind('click', onClose);
      }
      if (opts.maximizable){
        $('<a class="eui-panel-tool-max"></div>').appendTo(tool).bind('click', onMax);
      }
      if (opts.minimizable){
        $('<a class="eui-panel-tool-min"></a>').appendTo(tool).bind('click', onMin);
      }
      if (opts.collapsible){
        $('<a class="eui-panel-tool-collapse"></a>').appendTo(tool).bind('click', onToggle);
      }
//      原生的tools
      if (opts.tools){
        for(var i=opts.tools.length-1; i>=0; i--){
          var t = $('<div></div>').addClass(opts.tools[i].iconCls).appendTo(tool);
          if (opts.tools[i].handler){
            t.bind('click', eval(opts.tools[i].handler));
          }
        }
      }
      /*
       TODO 自定义操作，checkbox（位置）
       ==1. checkbox 单击回调函数（全选或全去选）
       ==2. checkbox 重置状态方法（全选，全去选，部分选择）
       =3. title单击回调函数
       ==4. 展开某accordion方法

       */
//      ====================================================
      if(opts.leftCheckbox){
        header.find('.eui-panel-title').addClass('eui-panel-with-icon');
        var t = $('<a></a>').addClass(opts.leftCheckbox.iconCls).prependTo(header);
        if (opts.leftCheckbox.handler){
          t.bind('click', eval(opts.leftCheckbox.handler));
        }
      }
//      ====================================================


      tool.find('div').hover(
        function(){$(this).addClass('eui-panel-tool-over');},
        function(){$(this).removeClass('eui-panel-tool-over');}
      );
      panel.find('>div.eui-panel-body').removeClass('eui-panel-body-noheader');

    }else{
      panel.find('>div.eui-panel-body').addClass('eui-panel-body-noheader');
    }
//    TODO tools函数
    function onToggle(){
      if ($(this).hasClass('eui-panel-tool-expand')){
        expandPanel(target, true);
      } else {
        collapsePanel(target, true);
      }
      return false;
    }

    function onMin(){
      minimizePanel(target);
      return false;
    }

    function onMax(){
      if ($(this).hasClass('panel-tool-restore')){
        restorePanel(target);
      } else {
        maximizePanel(target);
      }
      return false;
    }
    function onClose(){
      closePanel(target);
      return false;
    }
  }

  /**
   * load content from remote site if the href attribute is defined
   */
  function loadData(target){
    var state = $.data(target, 'panel');
    if (state.options.href && (!state.isLoaded || !state.options.cache)){
      state.isLoaded = false;
      var pbody = state.panel.find('>div.eui-panel-body');
      pbody.html($('<div class="eui-panel-loading"></div>').html(state.options.loadingMessage));
      pbody.load(state.options.href, null, function(){
        if ($.parser){
          $.parser.parse(pbody);
        }
        state.options.onLoad.apply(target, arguments);
        state.isLoaded = true;
      });
    }
  }

  function openPanel(target, forceOpen){
    var opts = $.data(target, 'panel').options;
    var panel = $.data(target, 'panel').panel;

    if (forceOpen != true){
      if (opts.onBeforeOpen.call(target) == false) return;
    }
    panel.show();
    opts.closed = false;
    opts.onOpen.call(target);

    if (opts.maximized == true) maximizePanel(target);
    if (opts.minimized == true) minimizePanel(target);
    if (opts.collapsed == true) collapsePanel(target);

    if (!opts.collapsed){
      loadData(target);
    }
  }

  function closePanel(target, forceClose){
    var opts = $.data(target, 'panel').options;
    var panel = $.data(target, 'panel').panel;

    if (forceClose != true){
      if (opts.onBeforeClose.call(target) == false) return;
    }
    panel.hide();
    opts.closed = true;
    opts.onClose.call(target);

  }

  function destroyPanel(target, forceDestroy){
    var opts = $.data(target, 'panel').options;
    var panel = $.data(target, 'panel').panel;
    $.data(target, 'panel', null);

    if (forceDestroy != true){
      if (opts.onBeforeDestroy.call(target) == false) return;
    }
    removeNode(panel);
    opts.onDestroy.call(target);
  }

  function collapsePanel(target, animate){
    var opts = $.data(target, 'panel').options;
    var panel = $.data(target, 'panel').panel;
    var body = panel.find('>div.eui-panel-body');
    var tool = panel.find('>div.eui-panel-header .eui-panel-tool-collapse');

    if (tool.hasClass('eui-panel-tool-expand')) return;

    body.stop(true, true);	// stop animation
    if (opts.onBeforeCollapse.call(target) == false) return;

    tool.addClass('eui-panel-tool-expand');
    if (animate == true){
      body.slideUp('normal', function(){
        opts.collapsed = true;
        opts.onCollapse.call(target);
      });
    } else {
      body.hide();
      opts.collapsed = true;
      opts.onCollapse.call(target);
    }
  }

  function expandPanel(target, animate){
    var opts = $.data(target, 'panel').options;
    var panel = $.data(target, 'panel').panel;
    var body = panel.find('>div.eui-panel-body');
    var tool = panel.find('>div.eui-panel-header .eui-panel-tool-collapse');

    if (!tool.hasClass('eui-panel-tool-expand')) return;

    body.stop(true, true);	// stop animation
    if (opts.onBeforeExpand.call(target) == false) return;

    tool.removeClass('eui-panel-tool-expand');
    if (animate == true){
      body.slideDown('normal', function(){
        opts.collapsed = false;
        opts.onExpand.call(target);
        loadData(target);
      });
    } else {
      body.show();
      opts.collapsed = false;
      opts.onExpand.call(target);
      loadData(target);
    }
  }

  function maximizePanel(target){
    var opts = $.data(target, 'panel').options;
    var panel = $.data(target, 'panel').panel;
    var tool = panel.find('>div.panel-header .panel-tool-max');

    if (tool.hasClass('panel-tool-restore')) return;

    tool.addClass('panel-tool-restore');

    $.data(target, 'panel').original = {
      width: opts.width,
      height: opts.height,
      left: opts.left,
      top: opts.top,
      fit: opts.fit
    };
    opts.left = 0;
    opts.top = 0;
    opts.fit = true;
    setSize(target);
    opts.minimized = false;
    opts.maximized = true;
    opts.onMaximize.call(target);
  }

  function minimizePanel(target){
    var opts = $.data(target, 'panel').options;
    var panel = $.data(target, 'panel').panel;
    panel.hide();
    opts.minimized = true;
    opts.maximized = false;
    opts.onMinimize.call(target);
  }

  function restorePanel(target){
    var opts = $.data(target, 'panel').options;
    var panel = $.data(target, 'panel').panel;
    var tool = panel.find('>div.panel-header .panel-tool-max');

    if (!tool.hasClass('panel-tool-restore')) return;

    panel.show();
    tool.removeClass('panel-tool-restore');
    var original = $.data(target, 'panel').original;
    opts.width = original.width;
    opts.height = original.height;
    opts.left = original.left;
    opts.top = original.top;
    opts.fit = original.fit;
    setSize(target);
    opts.minimized = false;
    opts.maximized = false;
    opts.onRestore.call(target);
  }

  function setBorder(target){
    var opts = $.data(target, 'panel').options;
    var panel = $.data(target, 'panel').panel;
    if(opts.border == true){
      panel.find('>div.eui-panel-header').removeClass('eui-panel-header-noborder');
      panel.find('>div.eui-panel-body').removeClass('eui-panel-body-noborder');
    }else{
      panel.find('>div.eui-panel-header').addClass('eui-panel-header-noborder');
      panel.find('>div.eui-panel-body').addClass('eui-panel-body-noborder');
    }
  }

  function setTitle(target, title){
    $.data(target, 'panel').options.title = title;
    $(target).panel('header').find('div.panel-title').html(title);
  }

  //checkbox点击事件,激活panel
  function activate(target){
    var panel = $.data(target, 'panel').panel;
    var c = panel.find('.eui-panel-tool-collapse');
    if (c.hasClass('eui-panel-tool-expand')){
      expandPanel(target, true);
    } else {
      return ;
    }
  }

  $(window).unbind('.panel').bind('resize.panel', function(){
    var layout = $('body.layout');
    if (layout.length){
      layout.layout('resize');
    } else {
      $('body>div.eui-panel').triggerHandler('_resize');
    }
  });

  /**
   *
   * @param target
   * @param p 全选：   all
   *           部分选择 part
   *           一个没选 none
   */
  function changeCheckboxClass(target, p){
//    如果panel header没有加checkbox，不做操作
    var b = $.data(target, 'panel');//options.leftCheckbox;
    if(!$.data(target, 'panel').options.leftCheckbox) return ;
    var checkbox = $(target).panel('header').children(':first');
    if(p === 'all'){
      checkbox.removeClass().addClass('eui-panel-head-checkAll');
    }else if(p === 'part'){
      checkbox.removeClass().addClass('eui-panel-head-checkPart');
    }else if(p === 'none'){
      checkbox.removeClass().addClass('eui-panel-head-checkNone');
    }

  }

  $.fn.panel = function(options, params){
    if('string' === (typeof options)){
      switch(options){
        case 'options':
          return $.data(this[0], 'panel').options;
        case 'panel':
          return $.data(this[0], 'panel').panel;
        case 'header':
          return $.data(this[0], 'panel').panel.find('>div.eui-panel-header');
        case 'body':
          return $.data(this[0], 'panel').panel.find('>div.eui-panel-body');
        case 'open':
          return this.each(function(){
            openPanel(this, params);
          });
        case 'close':
          return this.each(function(){
            closePanel(this, params);
          });
        case 'destroy':
          return this.each(function(){
            destroyPanel(this, params);
          });
        case 'resize':
          return this.each(function(){
            setSize(this, params);
          });
        case 'move':
          return this.each(function(){
            movePanel(this, params);
          });
        case 'changeCheckboxClass':
          return this.each(function(){
            changeCheckboxClass(this, params);
          });
        case 'activate':
          return this.each(function(){
            activate(this, params);
          });
      }
    }


    options = options || {};
    return this.each(function(){
      var state = $.data(this, 'panel');
      var opts;
      if(state){
        opts = $.extend(state.options, options);
      }else{
        var t = $(this);
        opts = $.extend({}, $.fn.panel.defaults, {
          width: (parseInt(t.css('width')) || undefined),
          height: (parseInt(t.css('height')) || undefined),
          left: (parseInt(t.css('left')) || undefined),
          top: (parseInt(t.css('top')) || undefined),
          title: t.attr('title'),
          iconCls: t.attr('icon'),
          cls: t.attr('cls'),
          headerCls: t.attr('headerCls'),
          bodyCls: t.attr('bodyCls'),
          href: t.attr('href'),
          cache: (t.attr('cache') ? t.attr('cache') == 'true' : undefined),
          fit: (t.attr('fit') ? t.attr('fit') == 'true' : undefined),
          border: (t.attr('border') ? t.attr('border') == 'true' : undefined),
          noheader: (t.attr('noheader') ? t.attr('noheader') == 'true' : undefined),
          collapsible: (t.attr('collapsible') ? t.attr('collapsible') == 'true' : undefined),
          minimizable: (t.attr('minimizable') ? t.attr('minimizable') == 'true' : undefined),
          maximizable: (t.attr('maximizable') ? t.attr('maximizable') == 'true' : undefined),
          closable: (t.attr('closable') ? t.attr('closable') == 'true' : undefined),
          collapsed: (t.attr('collapsed') ? t.attr('collapsed') == 'true' : undefined),
          minimized: (t.attr('minimized') ? t.attr('minimized') == 'true' : undefined),
          maximized: (t.attr('maximized') ? t.attr('maximized') == 'true' : undefined),
          closed: (t.attr('closed') ? t.attr('closed') == 'true' : undefined)
        }, options);
        t.attr('title', '');
        state = $.data(this, 'panel', {
          options: opts,
          panel: wrapPanel(this),
          isLoaded: false
        });
      }

      if (opts.content){
        $(this).html(opts.content);
        if ($.parser){
          $.parser.parse(this);
        }
      }

      addHeader(this);
      setBorder(this);

      if (opts.doSize == true){
        state.panel.css('display','block');
        setSize(this);
      }
      if (opts.closed == true){
        state.panel.hide();
      } else {
        openPanel(this);
      }

    });

  }

  $.fn.panel.defaults = {
    title: null,
    iconCls: null,
    width: 'auto',
    height: 'auto',
    left: null,
    top: null,
    cls: null,
    headerCls: null,
    bodyCls: null,
    style: {},
    href: null,
    cache: true,
    fit: false,
    border: true,
    doSize: true,	// true to set size and do layout
    noheader: false,
    content: null,	// the body content if specified

    collapsible: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    collapsed: false,
    minimized: false,
    maximized: false,
    closed: false,

    // custom tools, every tool can contain two properties: iconCls and handler
    // iconCls is a icon CSS class
    // handler is a function, which will be run when tool button is clicked
    tools: [],

    href: null,
    loadingMessage: 'Loading...',
    onLoad: function(){},
    onBeforeOpen: function(){},
    onOpen: function(){},
    onBeforeClose: function(){},
    onClose: function(){},
    onBeforeDestroy: function(){},
    onDestroy: function(){},
    onResize: function(width,height){},
    onMove: function(left,top){},
    onMaximize: function(){},
    onRestore: function(){},
    onMinimize: function(){},
    onBeforeCollapse: function(){},
    onBeforeExpand: function(){},
    onCollapse: function(){},
    onExpand: function(){}
  }

})(jQuery);