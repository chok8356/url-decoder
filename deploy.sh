#!/usr/bin/env sh

set -e

npm run build

cd dist

git init
git checkout -b main
git add -A -f
git commit -m 'deploy'

git push -f git@github.com:chok8356/url-decoder.git main:gh-pages

cd -
