import pyhdfs
import os
import csv
import sys
import logging
import codecs
import shutil
import traceback
import pandas as pd

from dashboard.checkView import checkOrDeleteView

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.upload")
logger.setLevel(logging.DEBUG)


def preUploadFile(fileStream, userName="myfolder", csvOpts={}):
    """
    pre-process the uploaded csv, xls or xlsx file to csv.
    """
    fileName = fileStream.name
    logger.debug("uploading file. fileName: {0}, csvOpts: {1}, ".format(fileName, csvOpts))
    abbrFileName = os.path.splitext(fileName)[0]
    fileDict = {}

    tmpFolder = "/tmp/csv/{0}/{1}".format(userName, abbrFileName)
    if os.path.exists(tmpFolder):
        shutil.rmtree(tmpFolder)
    os.makedirs(tmpFolder)
    fileDict["path"] = tmpFolder
    fileDict["tables"] = []
    hasHeader = True
    if "header" in csvOpts.keys():
        hasHeader = convertBool(csvOpts["header"])

    if fileName.endswith("xls") or fileName.endswith("xlsx"):

        xls = pd.ExcelFile(fileStream)
        for i in range(len(xls.sheet_names)):
            shName = xls.sheet_names[i]
            logger.debug(u"parsing the sheet, shName: {0}".format(shName))
            try:
                df = xls.parse(i)
                csvFileName = "{0}/{1}".format(tmpFolder, shName)
                df.to_csv(csvFileName, header=True, index=False, encoding='utf-8', escapechar='\\')
            except Exception:
                logger.error("Exception: {0}, Traceback: {1}".format(sys.exc_info(), traceback.format_exc()))
                return False
            fileDict["tables"].append(shName)
    elif fileName.endswith("csv"):
        csvFileName = "{0}/{1}".format(tmpFolder, abbrFileName)

        delimiter = csvOpts["delimiter"] if "delimiter" in csvOpts.keys() else ","
        doublequote = convertBool(csvOpts["doublequote"]) if "doublequote" in csvOpts.keys() else True
        quotechar = csvOpts["quote"] if "quote" in csvOpts.keys() else "\""
        escapechar = csvOpts["escapechar"] if "escapechar" in csvOpts.keys() else "\\"
        lineterminator = csvOpts["lineterminator"] if "lineterminator" in csvOpts.keys() else "\n"
        skipinitialspace = convertBool(csvOpts["skipinitialspace"]) if "skipinitialspace" in csvOpts.keys() else True
        strict = convertBool(csvOpts["strict"]) if "strict" in csvOpts.keys() else True

        with open(csvFileName, "w") as csvFile:
            rcsv = csv.reader(codecs.iterdecode(fileStream, 'utf-8'), delimiter=delimiter, doublequote=doublequote,
                              quotechar=quotechar, escapechar=escapechar, lineterminator=lineterminator,
                              skipinitialspace=skipinitialspace, strict=strict)
            wcsv = csv.writer(csvFile, delimiter=",", doublequote=True, quotechar="\"", escapechar="\\",
                              lineterminator="\n", quoting=csv.QUOTE_MINIMAL, skipinitialspace=True,
                              strict=True)
            r0 = rcsv.__next__()
            if hasHeader:
                wcsv.writerow([col.replace(" ", "_") for col in r0])
            else:
                # write one header to be used
                wcsv.writerow(["col_{0}".format(i) for i in range(len(r0))])

            for row in rcsv:
                wcsv.writerow(row)
            fileDict["tables"].append(abbrFileName)
    else:
        logger.error("At present, only 'csv','xls' and 'xlsx' can be supported.")

    return fileDict


def uploadToHdfs(fileDict, hdfsHost="spark-master0", nnPort="50070", rootFolder="/tmp/users", userName="myfolder"):
    """
    upload file into hdfs server.
    fileDict["tables"]'s item has the format of <rootFolder>/<parentFolder>/<fileName>, e.g. /tmp/csv/test/test1
    """
    try:
        client = pyhdfs.HdfsClient(hosts="{0}:{1}".format(hdfsHost, nnPort))
    except Exception:
        logger.error("Exception: {0}, Traceback: {1}"
                     .format(sys.exc_info(), traceback.format_exc()))
        return False

    if len(fileDict["tables"]) == 0:
        logger.warn("There is no tables in the fileDict.")
        return False
    fileName = fileDict["path"].split("/")[-1]
    handleFileFromHdfs(fileName, rootFolder, jsonData={"method": "delete"})

    uploadedCsvList = []
    for tableItem in fileDict["tables"]:
        filePath = "{0}/{1}".format(fileDict["path"], tableItem)
        uploadedCsvUri = "{0}/{1}/csv/{2}/{3}".format(rootFolder, userName, fileName, tableItem)
        try:
            logger.debug("filePath:{0}, uploadedCsvUri:{1}".format(filePath, uploadedCsvUri))
            client.copy_from_local(filePath, uploadedCsvUri, overwrite=True)
            uploadedCsvList.append(uploadedCsvUri.encode(encoding="utf-8", errors="strict"))
        except FileNotFoundError:
            logger.error("cannot find the file of {0}".format(filePath))
            return False
        except Exception:
            logger.error("Exception: {0}, Traceback: {1}"
                         .format(sys.exc_info(), traceback.format_exc()))
            return False
    return uploadedCsvList


def convertBool(v1):
    """
    """
    if (isinstance(v1, bool) and (not v1)) or \
       (isinstance(v1, str) and (v1.lower().strip() == 'false')):
        return False
    return True


def handleFileFromHdfs(fileName, rootFolder, jsonData={}, userName='myfolder', hdfsHost="spark-master0", nnPort="50070"):
    '''
    remove or rename the file from hdfs
    '''
    try:
        client = pyhdfs.HdfsClient(hosts="{0}:{1}".format(hdfsHost, nnPort))
    except Exception:
        logger.error("Exception: {0}, Traceback: {1}"
                     .format(sys.exc_info(), traceback.format_exc()))
        return False

    if not jsonData:
        '''
        check the generated file if exist
        '''
        FolderUri = "{0}/{1}/{2}".format(rootFolder, userName, fileName)
        if client.exists(FolderUri):
            return True
        return False

    if rootFolder.startswith('/tmp/users'):
        csvFolderUri = "{0}/{1}/csv/{2}".format(rootFolder, userName, fileName)
        parquetFolderUri = "{0}/{1}/parquet/{2}".format(rootFolder, userName, fileName)

        if jsonData['method'] == 'delete':
            deleteHdfsFile(client, csvFolderUri)
            deleteHdfsFile(client, parquetFolderUri)
            return True

        elif jsonData['method'] == 'rename':
            newname = jsonData['newname']
            csvRs = renameHdfsFile(client, csvFolderUri, newname)
            parquetRs = renameHdfsFile(client, parquetFolderUri, newname)

            if csvRs and parquetRs:
                return True
            return False

    elif rootFolder.startswith('/users'):
        username = jsonData['username'] if 'username' in jsonData.keys() else 'yzy'
        FolderUri = "{0}/{1}/{2}".format(rootFolder, userName, fileName)

        if jsonData['method'] == 'delete':

            checkOrDeleteView(fileName, username, delete=True)
            return deleteHdfsFile(client, FolderUri)

        elif jsonData['method'] == 'rename':
            newname = jsonData['newname']
            return renameHdfsFile(client, FolderUri, newname, username=username)


def deleteHdfsFile(client, folderUri):
    '''
    '''
    if client.exists(folderUri):
        client.delete(folderUri, recursive=True)
    return True


def renameHdfsFile(client, folderUri, newname, username=None):
    '''
    '''
    newFolderUri = "{0}/{1}".format(os.path.split(folderUri)[0], newname)
    if client.exists(newFolderUri):
        logger.error("hdfs rename error: this new_name is used")
        return False
    if client.exists(folderUri):
        client.rename(folderUri, newFolderUri)
        if username:
            checkOrDeleteView(os.path.split(folderUri)[1], username, changeName=newname)
        return True
    else:
        logger.error("hdfs rename error: there is no this file")
        return False
