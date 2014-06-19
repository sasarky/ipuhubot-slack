#/bin/sh

uname -a
ssh -oStrictHostKeyChecking=no sasarky@sasarky.net "cd /home/sasarky/ipuhubot/; git pull --rebase origin master"
