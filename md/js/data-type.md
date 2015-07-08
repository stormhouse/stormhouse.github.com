[JavaScript面向对象精要(一)][0]

## typeof
typeof 运算符的返回值有这么6种:

- undefined  //未定义
- boolean    //
- string     //
- number     //
- object     //是对象或null
- function   //

## 5种基本类型

- undefined: undefined, undefined == null -> true, undefined === null -> false
- null: null, typeof null -> object
- boolean: true or false
- number: 浮点值
- string: var name = 'storm'; name instanceof String -> false, 用typeof

## 引用类型
typeof 均返回object; 使用instanceof检测引用类型
- Object
- Array
- Date
- RegExp
- Function
- Error: 运行时错误

## function
函数就是对象。使函数不同于其他对象的决定性特性是函数存在一个被称为[[Call]]的内部属性。内部属性无法通过代码访问而是定义了代码执行时的行为。

[0]:http://segmentfault.com/a/1190000002890067
