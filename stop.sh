#!/bin/bash	

docker rmi `docker images | awk '$1=="<none>" || NR==0 {printf "%-1s ",$3}'`

#stop django at first
docker-compose -p spark stop;
docker-compose -p spark rm -f;

#stop mysql 
docker-compose -p spark -f docker-compose-mysql.yml stop;
docker-compose -p spark -f docker-compose-mysql.yml rm -f;