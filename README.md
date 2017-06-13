Django
==================

Description
-----------
This repository contains a Dockerfile for building a docker image that runs the django web server


Prerequisites
-------------
* Recommend installing the Java 8 update 20 or later, or Java 7 update 55 or later.
* install docker and docker-compose
* install git

How To Start
-----
#### 1. download the project into local machine.
```
git clone https://github.com/hongchhe/mypython.git
```
#### 2. go to django folder
```
cd mypython/django
```
#### 3. Start docker image using docker-compose
```
docker-compose up -d
```
Note: it might spend a long time to download and build image at the first time.

How To Detect
-----
#### 1. go to container to see the details using container id
```
docker exec -it dj1 bash
```

#### 2. check the running the logs using container id
```
docker logs dj1
```
#### 3. test if it works
```
curl http://127.0.0.1:8000
```

How To Restart if some file has been modified
-----
#### 1. stop the docker images
```
docker-compose stop dj1
```
#### 2. remove the old docker container
```
docker-compose rm -f dj1
```
#### 3. re-build the docker images
```
docker-compose build
```
#### 4. Start the docker container
```
docker-compose up -d
```
