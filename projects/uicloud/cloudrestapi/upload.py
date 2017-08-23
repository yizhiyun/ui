import re
import time
import os
import pyhdfs
import logging

from .models import FileNameMap

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.upload")


def uploadToHdfs(file, hdfsHost, nNPort, rootFolder, username):
    '''
    先判断文件为csv的情况. 若有别的文件. 后续再做别的判断处理. 多个文件处理
    '''

    csvPathUrl = '/{0}/{1}/csv/'.format(rootFolder, username)
    fileName = file.name
    if os.path.splitext(fileName)[1] == '.csv':
        client = pyhdfs.HdfsClient(hosts='{0}:{1}'.format(hdfsHost, nNPort))
        if client.exists(csvPathUrl):
            client.create(csvPathUrl + fileName, file, overwrite=True)
        else:
            client.mkdirs(csvPathUrl)
            client.create(csvPathUrl + fileName, file, overwrite=True)
        if fileName in client.listdir(csvPathUrl):
            return True
        else:
            logger.error("con't upload csvFile to hdfs")
            return False
    else:
        logger.error("it's not a csvFile")
        return False


def fileFormat(file):
    fileName = file.name
    if re.match('[ \u4e00 -\u9fa5]+', fileName) is not None:
        fileList = FileNameMap.objects.filter(filename=fileName)
        if fileList:
            file.name = fileList[0].idname
        else:
            obj = FileNameMap()
            obj.filename = fileName
            obj.idname = "table{0}_{1}.csv".format(obj.id, str(time.time()).replace('.', '_'))
            obj.save()

            file.name = "table{0}_{1}.csv".format(obj.id, str(time.time()).replace('.', '_'))
        return file

    else:
        return file


def realName(filename):
    fileList = FileNameMap.objects.filter(filename=filename)
    if fileList:
        return fileList[0].idname
    return filename
