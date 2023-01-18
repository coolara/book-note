### HEAD、master 与 branch

HEAD:指向当前 commit 的引用

branch: HEAD 除了可以指向 commit，还可以指向一个 branch

> branch指的是从初始 commit 到 branch 所指向的 commit 之间所有的 commits

git commit效果如下图 
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/20/15fd779f983c81e7~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/20/15fd779f5c191a3f~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

1. HEAD 是指向当前 commit 的引用，它具有唯一性，每个仓库中只有一个 HEAD。在每次提交时它都会自动向前移动到最新的 commit 。
2. branch 是一类引用。HEAD 除了直接指向 commit，也可以通过指向某个 branch 来间接指向 commit。当 HEAD 指向一个 branch 时，commit 发生时，HEAD 会带着它所指向的 branch 一起移动。
3. master 是 Git 中的默认 branch，它和其它 branch 的区别在于：
- 新建的仓库中的第一个 commit 会被 master 自动指向；
- 在 git clone 时，会自动 checkout 出 master。
4. branch 的创建、切换和删除：
- 创建 branch 的方式是 git branch 名称 或 git checkout -b 名称（创建后自动切换）；
- 切换的方式是 git checkout 名称；
- 删除的方式是 git branch -d 名称。