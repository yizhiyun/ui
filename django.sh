#!/bin/bash
docker-compose stop dj1;
docker-compose rm -f dj1;
docker-compose build;
docker-compose -p spark up -d;
