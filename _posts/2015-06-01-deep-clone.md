---
layout: post
category: "frontend"
tag: [前端]
title: 深入剖析JavaScript的深复制
---
前一篇文章研究了JavaScript的深复制，其中也参考了很多大神的博文。当时，测试了其中一篇博文的方法后，发现了一些问题，给大神留言居然回复了，然后大神就又写了一篇。特意转载过来，表示感谢。

一年前我曾写过一篇 [Javascript 中的一种深复制实现](http://jerryzou.com/posts/deepcopy/)，当时写这篇文章的时候还比较稚嫩，有很多地方没有考虑仔细。为了不误人子弟，我决定结合 Underscore、lodash 和 jQuery 这些主流的第三方库来重新谈一谈这个问题。

##第三方库的实现

讲一句唯心主义的话，放之四海而皆准的方法是不存在的，不同的深复制实现方法和实现粒度有各自的优劣以及各自适合的应用场景，所以本文并不是在教大家改如何实现深复制，而是将一些在 JavaScript 中实现深复制所需要考虑的问题呈献给大家。我们首先从较为简单的 Underscore 开始：

###Underscore —— _.clone()

在 Underscore 中有这样一个方法：`_.clone()`，这个方法实际上是一种浅复制 (shallow-copy)，所有嵌套的对象和数组都是直接复制引用而并没有进行深复制。来看一下例子应该会更加直观：

{% highlight javascript %}
var x = {
    a: 1,
    b: { z: 0 }
};

var y = _.clone(x);

y === x       // false
y.b === x.b   // true

x.b.z = 100;
y.b.z         // 100
{% endhighlight %}

让我们来看一下 [Underscore 的源码](https://github.com/jashkenas/underscore/blob/e4743ab712b8ab42ad4ccb48b155034d02394e4d/underscore.js#L1068)：

{% highlight javascript %}
// Create a (shallow-cloned) duplicate of an object.
_.clone = function(obj) {
  if (!_.isObject(obj)) return obj;
  return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
};
{% endhighlight %}

如果目标对象是一个数组，则直接调用数组的`slice()`方法，否则就是用`_.extend()`方法。想必大家对`extend()`方法不会陌生，它的作用主要是将从第二个参数开始的所有对象，按键值逐个赋给第一个对象。而在 jQuery 中也有类似的方法。关于 Underscore 中的 `_.extend()` 方法的实现可以参考 [underscore.js #L1006](https://github.com/jashkenas/underscore/blob/e4743ab712b8ab42ad4ccb48b155034d02394e4d/underscore.js#L1006)。

Underscore 的 `clone()` 不能算作深复制，但它至少比直接赋值来得“深”一些，它创建了一个新的对象。另外，你也可以通过以下比较 tricky 的方法来完成**单层**嵌套的深复制：

{% highlight javascript %}
var _ = require('underscore');
var a = [{f: 1}, {f:5}, {f:10}];
var b = _.map(a, _.clone);       // <----
b[1].f = 55;
console.log(JSON.stringify(a));  // [{"f":1},{"f":5},{"f":10}]
{% endhighlight %}

###jQuery —— $.clone() / $.extend()

在 jQuery 中也有这么一个叫 `$.clone()` 的方法，可是它并不是用于一般的 JS 对象的深复制，而是用于 DOM 对象。这不是这篇文章的重点，所以感兴趣的同学可以参考[jQuery的文档](http://api.jquery.com/clone/)。与 Underscore 类似，我们也是可以通过 `$.extend()` 方法来完成深复制。值得庆幸的是，我们在 jQuery 中可以通过添加一个参数来实现**递归extend**。调用`$.extend(true, {}, ...)`就可以实现深复制啦，参考下面的例子：

{% highlight javascript %}
var x = {
    a: 1,
    b: { f: { g: 1 } },
    c: [ 1, 2, 3 ]
};

var y = $.extend({}, x),          //shallow copy
    z = $.extend(true, {}, x);    //deep copy

y.b.f === x.b.f       // true
z.b.f === x.b.f       // false
{% endhighlight %}

在 [jQuery的源码 - src/core.js #L121](https://github.com/jquery/jquery/blob/1472290917f17af05e98007136096784f9051fab/src/core.js#L121) 文件中我们可以找到`$.extend()`的实现，也是实现得比较简洁，而且不太依赖于 jQuery 的内置函数，稍作修改就能拿出来单独使用。

###lodash —— _.clone() / _.cloneDeep()

在lodash中关于复制的方法有两个，分别是`_.clone()`和`_.cloneDeep()`。其中`_.clone(obj, true)`等价于`_.cloneDeep(obj)`。使用上，lodash和前两者并没有太大的区别，但看了源码会发现，Underscore 的实现只有30行左右，而 jQuery 也不过60多行。可 lodash 中与深复制相关的代码却有上百行，这是什么道理呢？


{% highlight javascript %}
var $ = require("jquery"),
    _ = require("lodash");

var arr = new Int16Array(5),
    obj = { a: arr },
    obj2;
arr[0] = 5;
arr[1] = 6;

// 1. jQuery
obj2 = $.extend(true, {}, obj);
console.log(obj2.a);                            // [5, 6, 0, 0, 0]
Object.prototype.toString.call(arr2);           // [object Int16Array]
obj2.a[0] = 100;
console.log(obj);                               // [100, 6, 0, 0, 0]

//此处jQuery不能正确处理Int16Array的深复制！！！

// 2. lodash
obj2 = _.cloneDeep(obj);                       
console.log(obj2.a);                            // [5, 6, 0, 0, 0]
Object.prototype.toString.call(arr2);           // [object Int16Array]
obj2.a[0] = 100;
console.log(obj);                               // [5, 6, 0, 0, 0]
{% endhighlight %}

通过上面这个例子可以初见端倪，jQuery 无法正确深复制 JSON 对象以外的对象，而我们可以从下面这段代码片段可以看出 lodash 花了大量的代码来实现 ES6 引入的大量新的标准对象。更厉害的是，lodash 针对**存在环的对象**的处理也是非常出色的。因此相较而言，lodash 在深复制上的行为反馈比前两个库好很多，是更拥抱未来的一个第三方库。

{% highlight javascript %}
/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';
{% endhighlight %}

##借助 JSON 全局对象

相比于上面介绍的三个库的做法，针对纯 JSON 数据对象的深复制，使用 JSON 全局对象的 `parse` 和 `stringify` 方法来实现深复制也算是一个简单讨巧的方法。然而使用这种方法会有一些隐藏的坑，它能正确处理的对象只有 Number, String, Boolean, Array, 扁平对象，即那些能够被 json 直接表示的数据结构。

{% highlight javascript %}
function jsonClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
var clone = jsonClone({ a:1 });
{% endhighlight %}

##拥抱未来的深复制方法

我自己实现了一个深复制的方法，因为用到了`Object.create`、`Object.isPrototypeOf`等比较新的方法，所以基本只能在 IE9+ 中使用。而且，我的实现是**直接定义在 prototype 上**的，很有可能引起大多数的前端同行们的不适。(关于这个我还曾在知乎上提问过：[为什么不要直接在Object.prototype上定义方法？](http://www.zhihu.com/question/26924011)）只是实验性质的，大家参考一下就好，改成非 prototype 版本也是很容易的，不过就是要不断地去**判断对象的类型**了。~

这个实现方法具体可以看我写的一个小玩意儿——[Cherry.js](https://github.com/cherryjs/cherry.js)，使用方法大概是这样的：

{% highlight javascript %}
function X() {
    this.x = 5;
    this.arr = [1,2,3];
}
var obj = { d: new Date(), r: /abc/ig, x: new X(), arr: [1,2,3] },
    obj2,
    clone;

obj.x.xx = new X();
obj.arr.testProp = "test";
clone = obj.$clone();                  //<----
{% endhighlight %}

为了避免和源生方法冲突，我在方法名前加了一个 `$` 符号。而这个方法的具体实现很简单，就是递归深复制。其中我需要解释一下两个参数：`srcStack`和`dstStack`。它们的主要用途是对存在环的对象进行深复制。比如源对象中的子对象`srcStack[7]`在深复制以后，对应于`dstStack[7]`。该实现方法参考了 lodash 的实现。关于递归最重要的就是 Object 和 Array 对象：

{% highlight javascript %}

Object.defineProperties(Object.prototype, {
    "$clone": {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (srcStack, dstStack) {
            var obj = Object.create(Object.getPrototypeOf(this)),
                keys = Object.keys(this),
                index;

            srcStack = srcStack || [];
            dstStack = dstStack || [];
            srcStack.push(this);
            dstStack.push(obj);

            for (var i = 0; i < keys.length; i++) {
                if (typeof(this[keys[i]]) !== "function") {
                    if (this[keys[i]] === null) {
                        obj[keys[i]] = null;
                    }
                    else {
                        index = srcStack.indexOf(this[keys[i]]);
                        if (index > 0) {
                            obj[keys[i]] = dstStack[index];
                        } else {
                            obj[keys[i]] = this[keys[i]].$clone(srcStack, dstStack);
                        }
                    }
                }
            }
            return obj;
        }
    }
});

/*=====================================*
 * Array.prototype *
 *=====================================*/

Object.defineProperties(Array.prototype, {
    "$clone": {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (srcStack, dstStack) {
            var thisArr = this.valueOf(),
                newArr = [],
                keys = Object.keys(thisArr),
                index;

            srcStack = srcStack || [];
            dstStack = dstStack || [];
            srcStack.push(this);
            dstStack.push(newArr);

            for (var i = 0; i < keys.length; i++) {
                index = srcStack.indexOf(thisArr[keys[i]]);
                if (index > 0) {
                    newArr[keys[i]] = dstStack[index];
                } else {
                    newArr[keys[i]] = thisArr[keys[i]].$clone(srcStack, dstStack);
                }
            }
            return newArr;
        }
    }
});

{% endhighlight %}

接下来要针对 Date 和 RegExp 对象的深复制进行一些特殊处理：

{% highlight javascript %}

/*=====================================*
 * Date.prototype *
 *=====================================*/

Object.defineProperties(Date.prototype, {
    "$clone": {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () { return new Date(this.valueOf()); }
    }
});

/*=====================================*
 * RegExp.prototype *
 *=====================================*/

Object.defineProperties(RegExp.prototype, {
    "$clone": {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var pattern = this.valueOf();
            var flags = '';
            flags += pattern.global ? 'g' : '';
            flags += pattern.ignoreCase ? 'i' : '';
            flags += pattern.multiline ? 'm' : '';
            return new RegExp(pattern.source, flags);
        }
    }
});

{% endhighlight %}

接下来就是 Number, Boolean 和 String 的 `$clone` 方法，虽然很简单，但这也是必不可少的。这样就能防止像单个字符串这样的对象错误地去调用 `Object.prototype.$clone`。

{% highlight javascript %}

/*=====================================*
 * Number / Boolean / String *
 *=====================================*/

Object.defineProperties(Number.prototype, {
    "$clone": {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () { return this.valueOf(); }
    }
});

Object.defineProperties(Boolean.prototype, {
    "$clone": {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () { return this.valueOf(); }
    }
});

Object.defineProperties(String.prototype, {
    "$clone": {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () { return this.valueOf(); }
    }
});
{% endhighlight %}


##比较各个深复制方法

特性 | jQuery | lodash | JSON.parse | 所谓“拥抱未来的深复制实现”
--- | :------: | :-----: | :-----: | :-------:
浏览器兼容性 | IE6+ (1.x) & IE9+ (2.x) | IE6+ | IE8+ | IE9+
能够深复制存在环的对象 | 抛出异常 RangeError: Maximum call stack size exceeded | 可以出色地处理 | 抛出异常 TypeError: Converting circular structure to JSON | 支持
对 Date, RegExp 的深复制支持 | × | 支持 | × | 支持 |
对 ES6 新引入的标准对象的深复制支持 | × | 支持 | × | × |
复制数组的属性 | × | [仅支持RegExp#exec返回的数组结果](https://github.com/lodash/lodash/blob/5166064453ed6164b76fb20f8dd340d23dd334e5/lodash._baseclone/index.js#215) | × | 支持 |
是否保留非源生对象的类型 | × | × | × | 支持 |
复制不可枚举元素 | × | × | × | × |
复制函数 | × | × | × | × |

##执行效率

为了测试各种深复制方法的执行效率，我使用了如下的测试用例：

{% highlight javascript %}
var x = {};
for (var i = 0; i < 1000; i++) {
    x[i] = {};
    for (var j = 0; j < 1000; j++) {
        x[i][j] = Math.random();
    }
}

var start = Date.now();
var y = clone(x);
console.log(Date.now() - start);
{% endhighlight %}

下面来看看各个实现方法的具体效率如何，好吧，我承认看到下面的结果时，我是有些失望的。我猜测性能大量地消耗于从原型链中查找方法？具体原因等我有时间再慢慢探究吧，希望这篇文章对你们有帮助~

深复制方法 | jQuery | lodash | JSON.parse | 所谓“拥抱未来的深复制实现”
--- | :------: | :-----: | :-----: | :-------:
Test 1 | 475 | 341 | 630 | 4801
Test 2 | 505 | 270 | 690 | 4298
Test 3 | 456 | 268 | 650 | 4658
Average | 478.7 | 293 | 656.7 | 4585.7

##参考资料

- [Underscore - clone](http://underscorejs.org/#clone)
- [Stackoverflow - How do you clone an array of objects using underscore?](http://stackoverflow.com/questions/21003059/how-do-you-clone-an-array-of-objects-using-underscore)
- [jQuery API](http://api.jquery.com/)
- [lodash docs #clone](https://lodash.com/docs#clone)
- [MDN - JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)