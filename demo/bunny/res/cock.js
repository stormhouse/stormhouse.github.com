$(function(){
  
  //我是一只大公鸡
  var Cock = {
    head: [
      '0px -501px',    '-57px -501px',  '-114px -501px', '-171px -501px', 
      '-228px -501px', '-285px -501px', '-342px -501px', '-399px -501px',
      '-456px -501px', '-513px -501px', '-570px -501px', '-627px -501px'
    ],
    plumage1: [
      '0px -37px', '-44px -37px', '-88px -37px', '-132px -37px',
      '-176px -37px', '-220px -37px', '-264px -37px', '-308px -37px',
      '-352px -37px', '-396px -37px', '-440px -37px'
    ],
    plumage2: [
      '0 -252px', '-42px -252px', '-84px -252px', '-126px -252px', 
      '-168px -252px', '-210px -252px', '-252px -252px', '-294px -252px', 
      '-336px -252px', '-378px -252px', '-420px -252px', '-462px -252px'
    ],
    plumage3: [
      '0 -147px', '-42px -147px', '-84px -147px', '-126px -147px', 
      '-168px -147px', '-210px -147px', '-252px -147px', '-294px -147px', 
      '-336px -147px', '-378px -147px', '-420px -147px', '-462px -147px'
    ],
    plumage4: [
      '0 -371px', '-42px -371px', '-84px -371px', '-126px -371px', 
      '-168px -371px', '-210px -371px', '-252px -371px', '-294px -371px', 
      '-336px -371px', '-378px -371px', '-420px -371px'
    ],
    foot: [
      '0 0', '-88px 0', '-176px 0', '-264px 0',
      '-352px 0', '-440px 0', '-528px 0', '-616px 0', 
      '-704px 0', '-792px 0', '-880px 0', '-968px 0'
    ],
    wing: [
      '0 -646px', '-81px -646px', '-162px -646px', '-243px -646px', '-324px -646px',
      '-405px -646px', '-486px -646px', '-567px -646px', '-648px -646px',
      '-729px -646px', '-810px -646px', '-891px -646px', '-972px -646px',
    ]
  };
  //抖抖我的小羽毛
  var plumageShake = function(speed){
    speed = speed || 50; //默认100毫秒抖一下
    $('#plumage1').animate({top: '-=3'}, speed, function(){
      $('#plumage1').animate({top: '+=3'}, speed, function(){
        $('#plumage2').animate({top: '-=3'}, speed, function(){
          $('#plumage2').animate({top: '+=3'}, speed, function(){
            $('#plumage3').animate({top: '-=3'}, speed, function(){
              $('#plumage3').animate({top: '+=3'}, speed, function(){
                $('#plumage4').animate({top: '-=3'}, speed, function(){
                  $('#plumage4').animate({top: '+=3'}, speed);
                });
              });
            });
          });
        });
      });
    });
  };
  //眨眨我的小眼睛
  var eyeShake = function(){
    $('#face').css({'background-position': '-40px -457px'});
    setTimeout(function(){
      $('#face').css({'background-position': '0 -457px'});
    }, 200);
    if(Math.random()<.25){  //25%的机率再眨一次眼
      setTimeout(function(){
        $('#face').css({'background-position': '-40px -457px'});
      }, 400);
      setTimeout(function(){
        $('#face').css({'background-position': '0 -457px'});
      }, 600);
    }
  };
  //换换我的小衣服
  var changeStyle = function($this, type, maxNum){
    var i = 0;
    $this.one('click', function(){
      //开始换衣后就不再抖毛啦～
      clearInterval(autoPlumageShake);
    }).bind('click', function(){
      $(this).css('background-position', type[++i]);
      if(i==maxNum){i=0}
    });
  };
  //张张我的小嘴巴
  var mouthShake = function(){
    setTimeout(function(){
      $('#face').css({'background-position': '-80px -457px'});
    }, 400);
    setTimeout(function(){
      $('#face').css({'background-position': '0 -457px'});
    }, 600);
    setTimeout(function(){
      wingClick();
    }, 610);
  };
  //摇摇我的小翅膀
  var wingShake = function(num){
    $('#wing').css({'background-position': Cock.wing[13-num]});
    return function(){
      if(num--){
        setTimeout(wingShake(num), 60);
      }
    };
  };
  //其实哥自己也会挑衣服
  var autoChange = function(rand){
    $('#wing').unbind('click.cock');
    return function(){
      var rand11_1 = parseInt(12*Math.random()),
          rand11_2 = parseInt(12*Math.random()),
          rand12_1 = parseInt(13*Math.random()),
          rand12_2 = parseInt(13*Math.random()),
          rand12_3 = parseInt(13*Math.random()),
          rand12_4 = parseInt(13*Math.random());
      $('#head').css('background-position', Cock.head[rand12_1]);
      $('#plumage1').css('background-position', Cock.plumage1[rand11_1]);
      $('#plumage2').css('background-position', Cock.plumage2[rand12_2]);
      $('#plumage3').css('background-position', Cock.plumage3[rand12_3]);
      $('#plumage4').css('background-position', Cock.plumage4[rand11_2]);
      $('#foot').css('background-position', Cock.foot[rand12_4]);
      if(rand--){
        if(rand<10){
          setTimeout(autoChange(rand), 200-rand*17);
        }else{
          setTimeout(autoChange(rand), 30);
        }
      }else{
        //35%的机率哥才乐意张嘴的！
        if(Math.random()<.35){
          mouthShake();
        }else{
          wingClick();
        }
      }
    };
  };
  
  var wingClick = function(){
    
    $('#wing').one('click', function(){
      clearInterval(autoPlumageShake);
    }).bind('click.cock', function(){
      autoChange(50)(); 
      wingShake(13)();
    });
  };
  
  //每次刷新完先抖一下羽毛
  plumageShake();
  //然后大概每4秒会抖一次
  var autoPlumageShake = setInterval(plumageShake, 4000);
  //大概每7秒眨一次眼
  setInterval(eyeShake, 7000);
  
  //鼠标划过后羽毛等上下动
  $('#head,#plumage1,#plumage2,#plumage3,#plumage4,#foot').hover(
    function(){
      var current = $(this).offset();
      $(this).offset({top: current.top-3, left: current.left});
    },
    function(){
      var current = $(this).offset();
      $(this).offset({top: current.top+3, left: current.left});
    }
  );
  
  //鼠标划过翅膀时
  $('#wing').hover(
    function(){
      $(this).css('background-position', '-81px -646px');
    },
    function(){
      $(this).css('background-position', '0 -646px');
    }
  );
  
  //鼠标点击换羽毛、帽子、鞋子等
  changeStyle($('#head'), Cock.head, 12);
  changeStyle($('#plumage1'), Cock.plumage1, 11);
  changeStyle($('#plumage2'), Cock.plumage2, 12);
  changeStyle($('#plumage3'), Cock.plumage3, 12);
  changeStyle($('#plumage4'), Cock.plumage4, 11);
  changeStyle($('#foot'), Cock.foot, 12);
  
  //鼠标点击翅膀时自动生成一套鸡服
  wingClick();
  
});

