#!/bin/bash

#django-admin startproject uicloud
${USER_HOME}/projects/uicloud/manage.py makemigrations polls
${USER_HOME}/projects/uicloud/manage.py sqlmigrate polls 0001
${USER_HOME}/projects/uicloud/manage.py migrate
${USER_HOME}/projects/uicloud/manage.py runserver 0:8000

tail -f /dev/null