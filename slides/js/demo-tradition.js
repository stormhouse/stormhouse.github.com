$(function(){
  var $c = $('#demo-tradition'),
    $input = $c.find('input')
  $c.on('click', '.plus', function(e){
    $input.val((+$input.val())+1)
  })
  $c.on('click', '.minus', function(e){
    $input.val((+$input.val())-1)
  })
})
