/**
 * Created with JetBrains WebStorm.
 * User: storm
 * Date: 14-2-21
 * Time: 下午6:18
 * To change this template use File | Settings | File Templates.
 */

var scripts = $('#code')
if(scripts.length == 1){
    var ss = scripts.html().split('/*')
    var body = $(document.body)

    for(var i=1; i<ss.length; i++){
        var sArray = ss[i].split('*/')
        var titleContentArray = sArray[0].split('\n')
        var title = titleContentArray[0]

        var code = sArray[1]
        // /*  为h2
        // /** 为h4
        if(title.indexOf('*') === 0){
            title = title.substring(1, title.length);
            if(title.length>0) body.append($('<h4></h4>').html(title));
        }else{
            if(title.length>0)  body.append($('<h2></h2>').html(title))

        }
        if(titleContentArray.length>1){
            for(var j=1; j<titleContentArray.length; j++){
                body.append($('<p></p>').html(titleContentArray[j]))
            }
        }
        body.append($('<pre class="brush: js"></pre>').text(code))
    }
}

//生成目录部分
var listContainer = $('<div class="list-container"></div>')
var hide = $('<a href="#"></a>').html('↗')
var ol = $('<ol></ol>')
hide.click(function(e){
    if(hide.hasClass('closed')){
        listContainer.width('auto').height('auto')
        hide.html('↗').removeClass('closed')
        ol.show()
    }else{
        listContainer.width(20).height(20)
        hide.html('↙').addClass('closed')
        ol.hide()
    }

})
listContainer.append(hide)

var h246 = $('h2,h4,h6')

var h2li,h2ol
var h4li,h4ol
for(var i=0; i<h246.length; i++){
    var ch = $(h246[i])
    if(h246[i].tagName === 'H2'){
        ch.attr('id', 'h2'+i)
        h2li = $('<li class="h2li"></li>').append($('<a href="#h2'+i+'"></a>').text($(h246[i]).html()))
        h2ol = $('<ol class="h2ol"></ol>')
        h2li.append(h2ol)
        ol.append(h2li)

    }else if(h246[i].tagName === 'H4'){
        ch.attr('id', 'h4'+i)
        h4li = $('<li class="h4li"></li>').append($('<a href="#h4'+i+'"></a>').text($(h246[i]).html()))
        h4ol = $('<ol class="h4ol"></ol>')
        h4li.append(h4ol)
        h2ol.append(h4li)
    }else if(h246[i].tagName === 'H6'){
        ch.attr('id', 'h6'+i)
        h6li = $('<li class="h6li"></li>').append($('<a href="#h6'+i+'"></a>').text($(h246[i]).html()))
        h4ol.append(h6li)
    }

}
listContainer.append(ol)
$(document.body).append(listContainer)
