FROM hongchhe/python:3.6.1
MAINTAINER Hongchuang <hehongchuang@hotmail.com>

ENV        USER_HOME=/home/django

# refer to http://www.django-rest-framework.org, djangorestframework markdown and django-filter is used for django REST API
# django-sql-explorer is a single app,
RUN         apt-get install -y freetds-dev libaio1 unzip \
         && pip install django requests psycopg2 mysqlclient djangorestframework markdown django-filter django-excel pymssql pyhdfs pandas \
         && pip install cx_Oracle --pre
#        && useradd -r django


# note 8088 is for jupyter notebook
EXPOSE     8000 8088

COPY       scripts/ ${USER_HOME}/scripts/
COPY       projects/ ${USER_HOME}/projects/
COPY       packages/ ${USER_HOME}/packages/

#RUN        chown -R django ${USER_HOME} && chgrp -R django ${USER_HOME}
RUN        cd /opt \
        && unzip ${USER_HOME}/packages/instantclient-basic-linux.x64-12.2.0.1.0.zip \
        && echo "export LD_LIBRARY_PATH=/opt/instantclient_12_2:$LD_LIBRARY_PATH" >> /root/.bashrc \
        && mkdir -p ${USER_HOME}/logs

WORKDIR    ${USER_HOME}

#USER       django

ENTRYPOINT ["scripts/entrypoint.sh"]
