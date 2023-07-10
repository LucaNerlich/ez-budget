#!/bin/bash
# https://stackoverflow.com/questions/33357227/bash-doesnt-load-node-on-remote-ssh-command

## prepare environment
export PATH=$PATH:/usr/local/bin
export NODE_PATH=~/.nvm/versions/node/v14.15.2/bin
export USER=admin
export HOME=/home/admin

source $HOME/.nvm/nvm.sh

nvm use 14.15.2

cd ../ || exit

git pull
npm i
npm run build
pm2 restart ezbudget
