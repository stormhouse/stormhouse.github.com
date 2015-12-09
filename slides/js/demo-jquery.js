(function($){

  function create(target, options){
    options = $.extend({}, $.fn.plusMinus.defaults, options)
    var data  = $.data(target, 'plusMinus'),
      $target = $(target)

    $target.addClass('plus-minus-warpper')
      .html('<a class="minus">-</a>'+
      '<input type="text" value="0" />'+
      '<a class="plus">+</a>')

    // var input = $target.find('input')
    // $target.width(options.width)
    // input.width(options.width-27*2)
    $.data(target, 'plusMinus', {
      options: options,
      input: $(target).find('input')
    })
  }

  function bindEvents(target){
    var data  = $.data(target, 'plusMinus'),
      opts = data.options,
      $input = data.input
    $(target).on('click', '.plus', function(){
      var newValue = (+$input.val())+1
      $input.val(newValue)
      opts.onSelect.call(target, newValue)
    }).on('click', '.minus', function(){
      var newValue = (+$input.val())-1
      $input.val(newValue)
      opts.onSelect.call(target, newValue)
    })
  }

  function setValue(target, value){
    var $input = $.data(target, 'plusMinus').input
    $input.val(value || 0)
  }

  function getValue(target){
    var $input = $.data(target, 'plusMinus').input
    return $input.val()
  }

  $.fn.plusMinus = function(options, param){
    if(typeof options === 'string'){
      var m = $.fn.plusMinus.methods[options];
      if(m){
        return m(this, param)
      }
    }
    return this.each(function(){
      var state = $.data(this, 'plusMinus');
      if(state){
        $.extend(state.options, options);
      }else{
        create(this, options);
      }
      bindEvents(this);
    });
  }

  $.fn.plusMinus.methods = {
    setValue: function(jq, param){
      return jq.each(function(){
        setValue(this, param);
      });
    },
    getValue: function(jq, param){
      return getValue(jq[0]);
    }
  }

  $.fn.plusMinus.defaults = {
    width: 100,
    maxNum: 50,
    onSelect: function(value){}
  }
})(jQuery);

;(function(){
  var $pm = $('#demo-jquery').find('.plus-minus')
  $pm.plusMinus()
  $('.get-value').click(function(){
    alert($pm.plusMinus('getValue'))
  })
  $('.set-value').click(function(){
    $pm.plusMinus('setValue', 50)
  })
})()
