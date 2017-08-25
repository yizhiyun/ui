import time
import pyhdfs
import xlrd
import os
import csv
import logging

from .models import FileNameMap

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.upload")
logger.setLevel(logging.DEBUG)


def uploadToHdfs(file, hdfsHost, nNPort, rootFolder, username):
    '''
    先判断文件为csv的情况. 若有别的文件. 后续再做别的判断处理. 多个文件处理
    '''

    csvPathUrl = '/{0}/{1}/csv/'.format(rootFolder, username)
    fileName = os.path.split(file.name)[1]
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


def fileFormat(file):
    fileName = file.name
    if fileName.endswith('.csv'):
        if check_contain_chinese(fileName):
            fileList = FileNameMap.objects.filter(filename=fileName)
            if fileList:
                file.name = fileList[0].idname
            else:
                nowtime = time.time()
                obj = FileNameMap()
                obj.filename = fileName
                obj.save()
                obj.idname = "table{0}_{1}.csv".format(str(obj.id), str(nowtime).replace('.', '_'))
                obj.save()

                file.name = "table{0}_{1}.csv".format(str(obj.id), str(nowtime).replace('.', '_'))
            return [file]

        else:
            return [file]
    elif fileName.endswith('xls') or fileName.endswith('xlsx'):
        workbook = xlrd.open_workbook(filename=None, file_contents=file.read())
        all_worksheets = workbook.sheet_names()
        fileList = []
        for worksheet_name in all_worksheets:
            worksheet = workbook.sheet_by_name(worksheet_name)
            csv_file = open('/tmp/{0}_{1}.csv'.format(os.path.splitext(fileName)[0], worksheet_name), 'w')
            wr = csv.writer(csv_file)
            for rownum in range(worksheet.nrows):
                wr.writerow([entry for entry in worksheet.row_values(rownum)])
            csv_file.close()
            fileList.append(open('/tmp/{0}_{1}.csv'.format(os.path.splitext(fileName)[0], worksheet_name), 'rb'))
        return fileList


def check_contain_chinese(check_str):
    for ch in check_str:
        if u'\u4e00' <= ch <= u'\u9fff':
            return True
    return False


def chName(name):
    fileList = FileNameMap.objects.filter(idname=name)
    if fileList:
        return fileList[0].filename
    return name


def idName(name):
    fileList = FileNameMap.objects.filter(filename=name)
    if fileList:
        return fileList[0].idname
    return name
