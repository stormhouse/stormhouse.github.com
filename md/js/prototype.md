## 空对象 与 空的对象

```
null //什么也没有
{}   //拥有方法

//属于对象类型
typeof null 
//为空值
for(var key in null){
  console.log(key)
}
//可参与运算，+null;
//没有属性，方法，也没有原型
//不是Object构造器而来
(null instanceof Object)
```

```
{}
new Object()

//有原型，valueOf, toString

```

## 原型基本性质
Object Instance 没有原型(构造自某个原型)，
Constructor 有原型
原型也是一个对象，构造器有一个原型A，通过该构造器创建的实例，复制A
