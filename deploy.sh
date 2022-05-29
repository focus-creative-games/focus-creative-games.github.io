#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# deploy to github pages
echo 'b.walon.com' > CNAME

if [ -z "$GITHUB_TOKEN" ]; then
  msg='[deploy] manual'
  githubUrl=git@github.com:focus-creative-games/focus-creative-games.github.io.git
else
  msg='[deploy] auto from github actions'
  githubUrl=https://ShuaiGao:${GITHUB_TOKEN}@github.com/focus-creative-games/focus-creative-games.github.io.git
  git config --global user.name "Dongua"
  git config --global user.email "597449675@qq.com"
fi
git init
git add -A
git commit -m "${msg}"
git push -f $githubUrl master:pages # 推送到github gh-pages分支

# deploy to coding pages
# echo 'www.walon.com\nwalon.com' > CNAME  # 自定义域名
# echo 'google.com, pub-7828333725993554, DIRECT, f08c47fec0942fa0' > ads.txt # 谷歌广告相关文件

# if [ -z "$CODING_TOKEN" ]; then  # -z 字符串 长度为0则为true；$CODING_TOKEN来自于github仓库`Settings/Secrets`设置的私密环境变量
#   codingUrl=git@e.coding.net:xgy/xgy.git
# else
#   codingUrl=https://HmuzsGrGQX:${CODING_TOKEN}@e.coding.net/xgy/xgy.git
# fi
# git add -A
# git commit -m "${msg}"
# git push -f $codingUrl master # 推送到coding

cd -
rm -rf docs/.vuepress/dist
