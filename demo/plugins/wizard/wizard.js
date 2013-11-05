/**
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 13-5-10
 * Time: 下午2:34
 * To change this template use File | Settings | File Templates.
 *
 * 创建任务向导插件
 */

(function($){
  //增强jquery.easing
  $.easing['jswing'] = $.easing['swing'];
  $.extend($.easing,
      {
        easeOutBounce: function (x, t, b, c, d) {
          if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
          } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
          } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
          } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
          }
        }
      });

  function init(target, opts){
    var self = $(target);
    self.addClass('taskcreate-wizard-container');
    self.append($('<div class="wizard-background-line"></div>'));
    var moveLine = $('<div class="wizard-move-line"></div>');
    self.append(moveLine);

    var w ;
    if(opts.width){
      w = opts.width;
      self.width(w);
    }


    self.find('.wizard-background-line').width(w-8);
    var stepNodes = [];
    if(!opts.nodeTitles || opts.nodeTitles.length != opts.stepsNum){
      opts.nodeTitles = [];
      for(var j=1; j<=opts.stepsNum; j++){
        opts.nodeTitles.push('step'+j);
      }
    }

    for(var i=0; i<opts.stepsNum; i++){
      stepNodes.push($('<span class="wizard-step" data-step-flag="'+(i+1)+'">'
                          +'<li class="outer-cycle"><span class="steps-tips"></span></li>'
                          +'<li class="inner-cycle"><span class="steps-tips"></span></li>'
                          +'<span class="node-title">'+opts.nodeTitles[i]+'</span>'
                      +'</span>'));
    }
    stepNodes[0].find('.inner-cycle').css('display', 'inline-block');
    stepNodes[0].find('.node-title').addClass('node-title-visited')
    var stepContainer = $('<ul class="wizard-node-container"></ul>');
    var temp = 0;
    for(var j in stepNodes){
      if(j == opts.stepsNum-1){
        stepNodes[j].css('right', '20px');
      }else{
        stepNodes[j].css('left', ((temp++/(opts.stepsNum-1))*100)+'%');
      }

      stepContainer.append(stepNodes[j]);
    }
    self.append(stepContainer);

    var nodes = self.find('.node-title');
    for(var k=1; k<nodes.length; k++){
      var selfNode = $(nodes[k])
      if(k === parseInt(nodes.length-1)){
        selfNode.css('left', '-'+(selfNode.width()-20)+'px')
      }else{
        selfNode.css('left', '-'+(selfNode.width()-20)/2+'px')
      }
    }
    $.data(target, '.tcwizard', {
      options: opts,
      currentStep: 1,
      stepNodes: stepNodes,
      moveLine: moveLine,
      stepContainer: stepContainer
    })
  }

  function bindEvents(target){
    var data = $.data(target, '.tcwizard');
    var opts = data.options;
    var stepContainer = data.stepContainer;
    var moveLine = data.moveLine;
    var stepNodes = data.stepNodes;
    stepContainer.unbind('click.tcwizard').bind('click.tcwizard', function(event){
      var spanNode = $(event.target).parent();
      var toStep = spanNode.attr('data-step-flag');
      var _width;
      if(toStep == 1){
        _width = '0'
      }else if(toStep == opts.stepsNum){
        _width = self.width()-8;
      }else{
        _width = (toStep-1)/(opts.stepsNum-1)*100 + '%';
      }
//      for(var i=1; i<opts.stepsNum; i++){
//        if(i<toStep){
//          stepNodes[i].find('.inner-cycle').css('display', 'inline-block');
//        }else{
//          stepNodes[i].find('.inner-cycle').css('display', 'none');
//        }
//
//      }

      moveLine.animate({
        width: _width
      },opts.timeDelay, null, function(){
        for(var i=1; i<opts.stepsNum; i++){
          if(i<toStep){
            stepNodes[i].find('.inner-cycle').css('display', 'inline-block');
          }else{
            stepNodes[i].find('.inner-cycle').css('display', 'none');
          }
        }
      });
    });
  }

  function next(target){
    var data = $.data(target, '.tcwizard');
    var opts = data.options;
    var cStep = data.currentStep;
    var moveLine = data.moveLine;
    var stepNodes = data.stepNodes;

    if(cStep == opts.stepsNum) return ;

    data.currentStep = cStep+1;

    if(cStep == opts.stepsNum-1){
      var _width = $(target).width()-8;
    }else{
      var _width = ((cStep/(opts.stepsNum-1))*100)+'%';
    }

    moveLine.animate({
      width: _width
    },opts.timeDelay, null, function(){
      stepNodes[cStep].find('.inner-cycle').css('display', 'inline-block');
      stepNodes[cStep].find('.node-title').addClass('node-title-visited');
    });

//    moveLine.animate({
//      width: [_width, 'easeOutBounce']
//    },500, 'swing', function(){console.log('moved')});
//    moveLine.animate({
//      width: [_width, 'easeOutBounce']
//    },opts.timeDelay, 'swing', function(){
//      stepNodes[cStep].find('.inner-cycle').css('display', 'inline-block');
//      stepNodes[cStep].find('.node-title').addClass('node-title-visited');
//    });
  }

  function back(target){
    var data = $.data(target, '.tcwizard');
    var opts = data.options;
    var cStep = data.currentStep;
    var moveLine = data.moveLine;
    var stepNodes = data.stepNodes;

    if(cStep == 1) return ;

    data.currentStep = cStep-1;
    if(cStep == 2)
      var _width = 0;
//    else if(cStep == opts.stepsNum)
//      var _width = (((cStep-2)/(opts.stepsNum-1))*100)+'%';
    else
      var _width = (((cStep-2)/(opts.stepsNum-1))*100)+'%';
    stepNodes[cStep-1].find('.inner-cycle').css('display', 'none');
    stepNodes[cStep-1].find('.node-title').removeClass('node-title-visited');
    moveLine.animate({
      width: _width
    },opts.timeDelay, null, function(){});
  }

  //TODO
  function to(target, stepNum){}

  $.fn.taskcreatewizard = function(opts, params){
    if(typeof opts === 'string'){
      var method = $.fn.taskcreatewizard.methods[opts];
      if(method)
        return method.call(this, params)
    }

    return this.each(function(){
      var state = $.data(this, '.tcwizard');
      if(state){}
      else{
        var options = $.extend({}, $.fn.taskcreatewizard.defaults, opts);
        init(this, options);

//        bindEvents(this);
      }

    });


  }

  $.fn.taskcreatewizard.methods = {
    next: function(){
      return this.each(function(){
        next(this);
      });
    },
    back: function(){
      return this.each(function(){
        back(this);
      });
    },
    to: function(stepNum){
      return this.each(function(){
        to(this, stepNum);
      });
    }
  }

  $.fn.taskcreatewizard.defaults = {
    stepsNum: 5,
    width: 800,
    timeDelay: 500
//    nodeTitles: ['step1', 'step2']
  }

})(jQuery);