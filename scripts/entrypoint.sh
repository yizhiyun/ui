#!/bin/bash

#django-admin startproject uicloud
python ${USER_HOME}/projects/uicloud/manage.py makemigrations
python ${USER_HOME}/projects/uicloud/manage.py migrate
python ${USER_HOME}/projects/uicloud/manage.py createsuperuser --username django --email test@test.com --noinput
python ${USER_HOME}/projects/uicloud/manage.py shell -c 'import uicloud.management.setPassword as pw; pw.updatePassword();'
#python ${USER_HOME}/projects/uicloud/manage.py shell -c 'import uicloud.management.addViewPermissions as perm; perm.add_view_permissions();'
python ${USER_HOME}/projects/uicloud/manage.py runserver 0:8000

tail -f /dev/null