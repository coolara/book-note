
> `JavaScript`（后面简称`JS`）是浏览器的主要语言，虽然现在的`JS`引擎已经优化了很多，比如多次修改标签不会一个一个处理，而是放到任务队列一次处理；`ES6`的尾递归优化，但是，我们仍然可以通过良好的编码得到更高性能的`JS`程序。

## 一、JS的加载与执行
通常`JS`引擎只有一个主线程（`UI`线程），不是在渲染页面就是在加载或执行`JS`,如果大部分时间都在做`JS`的事情不渲染页面的话，那么将会出现长时间的空白页，对于用户体验不友好。

使用无阻塞`Script`：
1. 将自定义的脚本放到`body`结束标签之前的位置
2. `script`标签使用`defer`属性，这样加载JS的同时不会影响页面渲染，执行的时候会推迟到页面加载完成执行
3. 使用`document.createElement('script')`，动态插入脚本

##  二、数据存取
数据存取和两个方便有关系：作用域和对象成员
`JS`里的变量通常通过作用域链的方式查找，如果这个查找的路径很长，那么这个查找过程会很耗时。

大家都知道在查找某个对象属性的值的时候，如果该对象没有对应的ownProperty会顺着原型链找，这个耗时和作用域链是一个道理。

优化点：
1. 使用直接量（如：1, 'str', false）
2. 使用局部变量（避免通过作用域链或原型链查找的耗时）

## 三、DOM编程
都知道`DOM`是操作`HTML`文档的`API`，操作`DOM`是非常耗时的，为什么这么说呢？浏览器通常会分开实现`DOM`和`JS`

|浏览器|DOM(渲染引擎)|JS(引擎)|
|---|---|---|
|IE|mshtml.dll(Trident)|jscript.dll(JScript)
|谷歌|WebCore|V8|
|Safari|WebCore|JavaScriptCore(新版SquirrelFish)|
|火狐|Gecko|SpiderMonkey(新版TraceMonkey)

看到这里就能想到，如果需要`JS`操作`DOM`，就需要一个桥梁，通过要收"过路费"，这就是`DOM`操作昂贵的地方。

优化点：
1. DOM的访问和修改
    - 节点克隆：使用节点克隆来更新比创建元素更有效率
    - HTML集合：（1）考虑把集合换成数族；（2）考虑把DOM用局部变量保存起来（这样避免在DOM访问的时候损耗）
    - 遍历DOM：
        - 元素节点：
            | 属性名| 被替代的属性 |
            | ---|---|
            | children | childNodes |
            | childElementCount | childNodes.length |
            | firstElementChild | firstChild|
            | lastElementChild | lastChild|
            | nextElementSibling | nextSibling|
            | previousElementSibling | previousSibling|

            在只需要获取元素节点的时候尽量使用前者，前者的`API`只包含元素节点，不包含其他节点（文本节点，注释节点）
        - 选择`API`
    `querySelector('#menu a')` => 需组合使用`getElementById()`和 g`etElementsByTagName()`
    好处：① 使用简介；② 返回一个`NodeList`数组对象，静态的节点集合，性能更高
2. 重绘与重排

   - 重排发生的条件：添加或删除显示的元素等
   - 渲染树排队与刷新: `offsetTop`这类的`API`会需要知道元素最新的数据，所以加入队列的那些`DOM`操作要立即执行，导致队列刷新，所以比较耗时。避免频繁使用。推荐`InteractionObservable`
   - 最小化重绘和重排：处理` css`：可以使用 `cssText` 或者类名；批量处理`DOM`：先让元素脱离文档流(隐藏`DOM`、`fragment`、拷贝)-> 修改 -> 将元素带回HTML文档（显示`DOM`、【无】、替换）
   - 缓存布局信息：将布局信息存储到局部变量

3. 事件委托
   多个子元素的事件利用委托或者冒泡给父元素统一处理成一个事件

## 四、算法和流程控制

- 循环 `for while do..while`

- 条件语句 `if else switch`
  缩小 `if else` `条件范围；switch` 比 `if else` 性能更好；查找表
- 递归
  堆栈溢出的 尽量可以使用迭代的方式处理；使用缓存减少重复的循环

## 五、字符串和正则表达式

- 字符串连接

  - `+` 和` +=` 的操作

  ```js
  str += "one" + "two";

  str += "one";
  str += "two";
  // 等价
  str = str + "one" + "two";
  // 如果顺序调换，优化失效：上面情况是str拷贝'one'附加到str后面，考虑下方这种情况 拷贝字符串str到'one'后面，如果str很大，拷贝过程就会有性能损耗
  str = "one" + str + "two";
  ```

- 正则优化 ***（这个部分我觉得是比较有意思的）***
  - 正则表达式工作原理
    1. 编译：浏览器会验证你的表达式，然后转换成原生代码程序，执行匹配工作，如果你的正则对象赋值给变量，可以避免重复这一步骤
    2. 设置起始位置
       当开始匹配的时候，确定目标字符串起始搜索位置（字符串的起始字符或者由 `lastIndex` 指定），如果匹配失败，此位置在最后一次匹配的起始位置下一个字符位置上（浏览器引擎优化如果由^开始，匹配失败不会搜索后续位置；匹配第三个字母'`x`'会先找到 `x`，然后回退两个字符）
    3. 匹配每个正则表达式字元: 一旦知道起始位置，逐个检查文本和正则模式，当匹配失败，会回溯之前尝试匹配的位置，然后尝试其他可能路径
    4. 匹配成功或失败：完全匹配就宣布成功，如果没有匹配到，回退到第二步，当每个字符都匹配失败，就宣布匹配失败
  - 理解回溯
    回溯是正则的基础组成部分，然而它往往会产生昂贵的计算消耗，遇到量词`(\*,+?,{2,})`分支（|从可选项中选择一个尝试匹配），每当做了决定记录其选择，已备返回时使用。如果当前匹配成功就继续扫描，如果其他部分也成功，匹配结束。如果当前匹配失败，，或者后面的部分匹配失败，正则会回溯到最后一个决策点，然后再剩余选项中选择一个，这种过程一直进行，直到所有分支量词尝试失败，转而移到下个字符，重复此过程。
    ```js
    // 分支与回溯
    /h(ello|appy) hippo/.test("hello there, happy hippo");
    //　重复与回溯
    var str =
      "<p> Para 1.</p>" +
      "<img src='smile.jpg'>" +
      "<p> Para 2.</p> " +
      "<div>Div.</div>";
    /<p>.*<\/p>/i.test(str); //　贪婪匹配
    /<p>.?*<\/p>/i.test(str); // 惰性匹配：回溯恰恰相反，匹配完<p>接着会匹配</p>，因为*?是匹配0次或多次，次数尽可能少，最小重复是0
    ```
  - 回溯失控
    正则表达式导致你的浏览器假死，很可能回溯失控了
    解决方案：取反的方式减少回溯的情况；
  - 更多提高正则表达式效率的方法
    - 让匹配更快失败
    - 以简单、必需的字元开始
    - 使用量词模式，使他们后面的字元互斥
    - 减少分支数量、缩小分支范围
    - 使用合适的量词
    - 正则表达式赋值给变量
    - 复杂的拆分简单片段
  - 何时不使用正则
    - `/;$/`: 获取`;`之前的字符串，可以直接使用字符串`API`，二正则需要从第一个开始逐个匹配，不如`API`来的快

## 六、用户界面

- UI 线程
  - 主线程执行 `UI` 更新和 `JavaScript` 代码
  - `JavaScript` 不超过 `100ms` 算是快的
  - 分割任务：将一个函数分割多个函数执行
- 定时器（让出 `UI` 控制权）
  第二个参数的意思是,多少 `ms` 后加入 `UI` 队列
- `Web Workers` 独立于 `UI` 线程的一个线程

## 七、编程实践

- 避免双重求值
  允许执行包含代码的字符串
  ```js
  var n1 = 5,
    n2 = 6,
    result = eval("n1 + n2"),
    sum = new Function("arg1", "arg2", "return arg1+arg2");
  setTimeout("sum=n1+n2", 100);
  setInterval("sum=n1+n2", 100);
  ```
  当在`JavaScript`代码中执行另一段`JavasScript`代码，会导致双重求值
- 使用 Object/Array 直接量运行更快
  ```js
  var obj = new Object();
  obj.name = "foo";
  var obj = { name: "foo" }; //直接量
  var arr = new Array();
  arr[0] = "bar";
  var arr = ["bar"];
  ```
- 避免重复工作（延迟加载、预加载）

```js
function addHandler(target, eventType, handler) {
  if (target.addEventListener) {
    target.addEventListener(eventType, handler);
  } else {
    //IE
    target.attachEvent("on" + eventType, handler);
  }
}
function removeHandler(target, eventType, handler) {
  if (target.removeEventListener) {
    target.removeEventListener(eventType, handler);
  } else {
    //IE
    target.detachEvent("on" + eventType, handler);
  }
}
//每次函数调用时做了重复工作，检查过程都相同，看指定方法是否存在
// 延迟加载方式优化(第一次加载时间较长，后续就会立刻调用)
function addHandler(target, eventType, handler) {
  if (target.addEventListener) {
    addHander = function (target, eventType, handler) {
      target.addEventListener(eventType, handler);
    };
  } else {
    addHander = function (target, eventType, handler) {
      target.attahEvent("on" + eventType, handler);
    };
  }
}
// 条件预加载  在加载时候就检测不会等到函数调用
var addHander = document.body.addEventListener
  ? function (target, eventType, handler) {
      target.addEventListener(eventType, handler);
    }
  : function (target, eventType, handler) {
      target.attahEvent("on" + eventType, handler);
    };
```

- 使用速度快的部分
  - 位操作符 `1.3 | 0`
  - 原生方法 `Math.E, querySelector()`

## 八、构建并部署高性能应用

- 合并多个 `JS` 文件
- 预处理 `JS` 文件
- `JS` 压缩
- `JS HTTP` 压缩 `gzip compress deflate identity`
- 缓存 JS 文件（http缓存）


