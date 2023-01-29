checkout 本质上的功能其实是：签出（ checkout ）指定的 commit。

checkout 的目标也可以不是 branch，而直接指定某个 commit：

```sh
git checkout HEAD^^
git checkout master~5
git checkout 78a4bc
 # 撤销文件更改
git checkout -- 文件名
```

checkout 和 reset 都可以切换 HEAD 的位置，它们除了有许多细节的差异外，最大的区别在于：reset 在移动 HEAD 时会带着它所指向的 branch 一起移动，而 checkout 不会。当你用 checkout 指向其他地方的时候，HEAD 和 它所指向的 branch 就自动脱离了。

事实上，checkout 有一个专门用来只让 HEAD 和 branch 脱离而不移动 HEAD 的用法
```
git checkout --detach
```