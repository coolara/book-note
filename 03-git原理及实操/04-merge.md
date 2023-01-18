merge 的含义：从两个 commit「分叉」的位置起，把目标 commit 的内容应用到当前 commit（HEAD 所指向的 commit），并生成一个新的 commit；
merge 的适用场景：
单独开发的 branch 用完了以后，合并回原先的 branch；
git pull 的内部自动操作。
merge 的三种特殊情况：
冲突
原因：当前分支和目标分支修改了同一部分内容，Git 无法确定应该怎样合并；
应对方法：解决冲突后手动 commit。
HEAD 领先于目标 commit：Git 什么也不做，空操作；
HEAD 落后于目标 commit：fast-forward。