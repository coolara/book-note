# 一、加载与执行

- 无阻塞 `Script`

# 二、数据存取

- 作用域
- 对象成员（直接量、对象、原型、闭包）

# 三、`DOM` 编程

1. `DOM` 访问与修改（减少 `DOM` 访问次数）

- `innerHTML`与`document.createElement()`对比
- 节点克隆`element.cloneNode()`
- `HTML`集合
  ```js
  var alldivs = document.getElementsByTagName("div");
  for (var i = 0; i < alldiv.length; i++) {
    document.body.appendChild(document.createElement("div"));
  }
  ```
  - 考虑把集合换成数组
  - 使用局部变量
- 遍历`DOM`
  - `nextSibling`和`childNodes`对比
  - 元素节点
    | 属性名| 被替代的属性 |
    | ----|----|
    | children | childNodes |
    | childElementCount | childNodes.length |
    | firstElementChild | firstChild|
    | lastElementChild | lastChild|
    | nextElementSibling | nextSibling|
    | previousElementSibling | previousSibling|
  - 选择`API`
    `querySelector('#menu a')` => 需组合使用`getElementById()`和 g`etElementsByTagName()`
    好处：① 使用简介；② 返回一个`NodeList`数组对象，静态的节点集合，性能更高

2. 重绘与重排

   - 重排发生的条件：添加或删除显示的元素等
   - 渲染树排队与刷新
   - 最小化重绘和重排：处理 css：可以使用 cssText 或者类名；批量处理 dom：先脱离文档流(隐藏、fragment、拷贝)-> 修改 -> 带回文档（显示、【无】、替换）
   - 缓存布局信息：将布局信息存储到局部变量

3. 事件委托
   多个子元素的事件利用委托或者冒泡给父元素统一处理成一个事件

# 四、算法和流程控制

- 循环 for while do..while

- 条件语句 if else switch
  缩小 if else 条件范围；switch 比 if else 性能更好；查找表
- 递归
  堆栈溢出的 尽量可以使用迭代的方式处理；使用缓存减少重复的循环

# 五、字符串和正则表达式

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

- 正则优化
  - 正则表达式工作原理
    1. 编译：浏览器会验证你的表达式，然后转换成原生代码程序，执行匹配工作，如果你的正则对象赋值给变量，可以避免重复这一步骤
    2. 设置起始位置
       当开始匹配的时候，确定目标字符串起始搜索位置（字符串的起始字符或者由 lastIndex 指定），如果匹配失败，此位置在最后一次匹配的起始位置下一个字符位置上（浏览器引擎优化如果由^开始，匹配失败不会搜索后续位置；匹配第三个字母'x'会先找到 x，然后回退两个字符）
    3. 匹配每个正则表达式字元: 一旦知道起始位置，逐个检查文本和正则模式，当匹配失败，会回溯之前尝试匹配的位置，然后尝试其他可能路径
    4. 匹配成功或失败：完全匹配就宣布成功，如果没有匹配到，回退到第二步，当每个字符都匹配失败，就宣布匹配失败
  - 理解回溯
    回溯是正则的基础组成部分，然而它往往会产生昂贵的计算消耗，遇到量词(\*,+?,{2,})分支（|从可选项中选择一个尝试匹配），每当做了决定记录其选择，已备返回时使用。如果当前匹配成功就继续扫描，如果其他部分也成功，匹配结束。如果当前匹配失败，，或者后面的部分匹配失败，正则会回溯到最后一个决策点，然后再剩余选项中选择一个，这种过程一直进行，直到所有分支量词尝试失败，转而移到下个字符，重复此过程。
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
    - /;$/

# 六、用户界面

- UI 线程
  - 主线程执行 `UI` 更新和 `JavaScript` 代码
  - `JavaScript` 不超过 `100ms` 算是快的
  - 分割任务
- 定时器（让出 `UI` 控制权）
  第二个参数的意思是,多少 ms 后加入 `UI` 队列
- Web Workers 独立于 UI 线程的一个线程

# 七、Ajax

与服务器交互。不需要重载页面

- 数据传输
  XHR：
  Dynamic script tag insertion:可以跨域
  Multipart XHR:
  (iframes、Comet 不常用)

- 数据格式
  XML\JSON\HTML\自定义
- Ajax 性能

# 八、编程实践

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
  - 位操作符 `1.3 |0`
  - 原生方法 `Math.E, querySelector()`

# 九、构建并部署高性能应用

- 合并多个 JavaScript 文件
- 预处理 JavaScript 文件
- JS 压缩
- JS HTTP 压缩 gzip compress deflate identity
- 缓存 JS 文件
- CDN

# 十、工具（略）
