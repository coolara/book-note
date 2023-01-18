### push
> 上传本地提交

在 Git 中（2.0 及它之后的版本），默认情况下，你用不加参数的 git push 只能上传那些之前从远端 clone 下来或者 pull 下来的分支，而如果需要 push 你本地的自己创建的分支，则需要手动指定目标仓库和目标分支（并且目标分支的名称必须和本地分支完全相同），就像上面这样。

1. push 是把当前的分支上传到远程仓库，并把这个 branch 的路径上的所有 commits 也一并上传。
2. push 的时候，如果当前分支是一个本地创建的分支，需要指定远程仓库名和分支名，用 git push origin branch_name 的格式，而不能只用 git push；或者可以通过 git config 修改 push.default 来改变 push 时的行为逻辑。
3. push 的时候之后上传当前分支，并不会上传 HEAD；远程仓库的 HEAD 是永远指向默认分支（即 master）的。