reflog ：引用的 log

reflog 是 "reference log" 的缩写，使用它可以查看 Git 仓库中的引用的移动记录。如果不指定引用，它会显示 HEAD 的移动记录。
```sh
# 找到删除的commit-id c08de9a
git checkout c08de9a
git checkout -b branch1 
```
删除的分支就回来了

```sh
# 查看其他引用的reflog
git reflog master
```