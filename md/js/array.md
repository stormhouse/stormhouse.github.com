
## 伪数组

A JavaScript array is actually a specialized type of JavaScript object, with the indices being property names that can be integers used to represent offsets. However, when integers are used for indices, they are converted to strings internally in order to conform to the requirements for JavaScript objects. Because JavaScript arrays are just objects, they are not quite as efficient as the arrays of other programming languages.

    typeof([])            //"object"
    [] instanceof Array   //true
    [] instanceof Object  //true

## 创建数组

    var array = [1, 'storm', true, [], function(){}] //literal is more efficient than constructor
    var str = 'I am a young guy'
    var arr = str.split(' ')

## 下标读写元素

    var nums = []; for(vari=0;i<100;++i){
      nums[i] = i+1;
    }
## 访问方法

    //查找 indexOf(el), lastIndexOf(el)
    
    //转为字符串 join
    
    //连接数组 concat

## 修改方法

    //增加元素 push(el), unshift(el) or unshift(startIndex, els ...)
    
    //删除元素 pop(), shift()
    
    //不在首尾增删元素 splice(startIndex, addOrDel, els ...)
    
    //排序 reverse(), sort(compare)<注意：数字排序>

## 迭代方法

    //[].forEach(fun)
    //[].every(funBoolean)
    //[].some(funBoolean)
    //[].reduce(function(retVal, curVal, index, array){})  or reduceRight

## 返回新数组迭代方法

    //map(curVal, index, array)
    var a = [1,2,3,4,5].map(function(curVal, index, array){
        return curVal * curVal
    })  //[ 1, 4, 9, 16, 25 ]
    
    //filter()
    var a = [1,2,3,4,5].filter(function(curVal, index, array){
        return curVal%2 == 0
    })  //[ 2, 4 ]

## 复制数组

    //slice
    a = [1,2,3,4,5]
    b = a.slice()
    //concat
    c = a.concat()
    //for







from > 《Data Structures and Algorithms with JavaScript》
