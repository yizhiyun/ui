#!/bin/bash

#django-admin startproject uicloud
python ${USER_HOME}/projects/uicloud/manage.py makemigrations polls
python ${USER_HOME}/projects/uicloud/manage.py sqlmigrate polls 0001
python ${USER_HOME}/projects/uicloud/manage.py migrate
python ${USER_HOME}/projects/uicloud/manage.py createsuperuser --username django --email test@test.com --noinput
python ${USER_HOME}/projects/uicloud/manage.py shell -c 'from django.contrib.auth.models import User;u=User.objects.get(username__exact="django");u.set_password("aaaa1111");u.save()'
python ${USER_HOME}/projects/uicloud/manage.py runserver 0:8000

tail -f /dev/null