FROM hongchhe/python:3.6.1
MAINTAINER Hongchuang <hehongchuang@hotmail.com>

ENV        USER_HOME=/home/django

# refer to http://www.django-rest-framework.org, djangorestframework markdown and django-filter is used for django REST API
# django-sql-explorer is a single app,
RUN        pip install django requests psycopg2 mysqlclient djangorestframework markdown django-filter django-excel
#        && useradd -r django

# note 8088 is for jupyter notebook
EXPOSE     8000 8088

COPY       scripts/ ${USER_HOME}/scripts/
COPY       projects/ ${USER_HOME}/projects/

#RUN        chown -R django ${USER_HOME} && chgrp -R django ${USER_HOME}

WORKDIR    ${USER_HOME}

#USER       django

ENTRYPOINT ["scripts/entrypoint.sh"]
