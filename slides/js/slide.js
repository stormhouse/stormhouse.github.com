document.addEventListener("impress:starttransition", function (event) {
  if(event.target.id == 'lang-end'){
    console.log(111)
  }
});

document.addEventListener("impress:stepenter", function (event) {
  var id = event.target.id
  if(event.target.id == 'lang-end'){
    $('#lang-end').css('visibility', 'visible')
  }else if(id == 'demo-end'){
    $('#demo-end').css('visibility', 'visible')
  }else if(id == 'io-end'){
    $('#io-end').css('visibility', 'visible')
  }else if(id == 'end'){
    $('#end').css('visibility', 'visible')
  }
  // console.log(event.target.id);
});

$('#dom-operate').click(function(e){
  var $this = $(e.target)
  if($this.width()>300){
    $(e.target).css({
      width: 200,
      position: 'relative',
      zIndex: 9999
    })
  }else{
    $(e.target).css({
      width: 840,
      position: 'absolute',
      zIndex: 9999
    })
  }
})
$('#io-switch').click(function(e){
  var $img = $(e.target)
  if($img.attr('src') == 'io.png'){
    $img.attr('src', 'io2.png')
    $img.parent().next().find('a').attr('href', 'http://www.ruanyifeng.com/blog/2013/10/register.html')
  }else{
    $img.attr('src', 'io.png')
    $img.parent().next().find('a').attr('href', 'https://book.douban.com/subject/5333562/')
  }
})
