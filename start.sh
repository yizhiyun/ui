#!/bin/bash

#run mysql at first
docker-compose -f docker-compose-mysql.yml build;docker-compose -f docker-compose-mysql.yml -p spark up -d;
#wait 60 seconds to make sure that mysql service has been started-up
echo "waitting 60 seconds for mysql startup ... ... ..."
sleep 60s
#create djangodb database using the below command.
docker exec -it mysql1 mysql -uroot -ppassword -e 'CREATE DATABASE djangodb CHARACTER SET utf8;'
docker exec -it mysql1 mysql -uroot -ppassword -e 'show databases;'

#start django.
docker-compose build;
docker-compose -p spark up -d;