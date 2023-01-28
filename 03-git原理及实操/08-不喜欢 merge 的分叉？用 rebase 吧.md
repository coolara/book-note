不喜欢 merge 的分叉？用 rebase 吧

rebase 是带着当前 commit 移到别的 commit 上「去」，而 merge 则是把别的 commit 合并过「来」
`git rebase 目标基础点`
> rebase 的意思是，给你的 commit 序列重新设置基础点（也就是父 commit）。展开来说就是，把你指定的 commit 以及它所在的 commit 串，以指定的目标 commit 为基础，依次重新提交一次。

- merge
```
git merge branch1
```
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/21/15fdea7b6646a1f3~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)
- rebase
```sh
git checkout branch1
git rebase master
```
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/30/1600abd620a8e28c~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)
```
git checkout master
git merge branch1
```
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/2/160149e054fe485c~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

如果直接从 master 执行 rebase 的话，就会是下面这样：
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/2/16014b5a6919c0b7~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

这就导致 master 上之前的两个最新 commit 被剔除了。如果这两个 commit 之前已经在中央仓库存在，这就会导致没法 push 了：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/2/16014bc64d4337f8~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)



