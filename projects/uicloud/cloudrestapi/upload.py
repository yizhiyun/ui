import pyhdfs
import xlrd
import os
import csv
import sys
import logging


# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.upload")
logger.setLevel(logging.DEBUG)


def preProUploadFile(fileStream):
    """
    pre-process the uploaded csv, xls or xlsx file to csv.
    """
    fileName = fileStream.name
    fnStr = os.path.splitext(fileName)[0]
    fileList = []

    tmpFolder = "/tmp/csv/{0}".format(fnStr)
    if not os.path.exists(tmpFolder):
        os.makedirs(tmpFolder)

    if fileName.endswith('xls'):
        workbook = xlrd.open_workbook(filename=None, file_contents=fileStream.read())
        all_worksheets = workbook.sheet_names()
        for wsName in all_worksheets:
            worksheet = workbook.sheet_by_name(wsName)
            csvFileName = "{0}/{1}".format(tmpFolder, wsName)
            with open(csvFileName, 'wb') as csvFile:
                csvWriter = csv.writer(csvFile, quoting=csv.QUOTE_ALL)
                for rownum in range(worksheet.nrows):
                    csvWriter.writerow(worksheet.row_values(rownum))
                fileList.append(csvFileName)
    elif fileName.endswith('xlsx'):
        pass
    elif fileName.endswith('csv'):
        csvFileName = "{0}/{1}".format(tmpFolder, fnStr)
        with open(csvFileName, 'wb') as csvFile:
            csvFile.write(fileStream.read())
            fileList.append(csvFileName)
    else:
        pass

    return fileList


def uploadToHdfs(filePath, hdfsHost="spark-master0", nnPort="50070", rootFolder="/tmp/users", userName="myfolder"):
    """
    upload file into hdfs server.
    filePath must has the format of <rootFolder>/<parentFolder>/<fileName>, e.g. /tmp/csv/test/test1
    """

    folderName, fileName = filePath.split("/")[-2:]
    uploadedCsvUri = '{0}/{1}/csv/{2}/{3}'.format(rootFolder, userName, folderName, fileName)
    client = pyhdfs.HdfsClient(hosts='{0}:{1}'.format(hdfsHost, nnPort))
    try:
        logger.debug("filePath:{0}, uploadedCsvUri:{1}".format(filePath, uploadedCsvUri))
        client.copy_from_local(filePath, uploadedCsvUri, overwrite=True)
        return uploadedCsvUri
    except FileNotFoundError:
        logger.error("cannot find the file of {0}".format(filePath))
        return False
    except Exception:
        logger.error("Exception: {0}".format(sys.exc_info()))
        return False
