FROM hongchhe/python:3.6.1
MAINTAINER Hongchuang <hehongchuang@hotmail.com>

ENV        USER_HOME=/home/django

RUN        pip install django mysqlclient
#        && useradd -r django

# note 8088 is for jupyter notebook
EXPOSE     8000 8088

COPY       scripts/ ${USER_HOME}/scripts/
COPY       projects/ ${USER_HOME}/projects/

#RUN        chown -R django ${USER_HOME} && chgrp -R django ${USER_HOME}

WORKDIR    ${USER_HOME}

#USER       django

ENTRYPOINT ["scripts/entrypoint.sh"]
