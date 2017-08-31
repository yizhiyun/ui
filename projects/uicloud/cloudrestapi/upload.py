import pyhdfs
import os
import csv
import sys
import logging
import codecs
import shutil
import traceback
import pandas as pd

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.upload")
logger.setLevel(logging.DEBUG)


def preUploadFile(fileStream, userName="myfolder", csvOpts={}):
    """
    pre-process the uploaded csv, xls or xlsx file to csv.
    """
    fileName = fileStream.name
    abbrFileName = os.path.splitext(fileName)[0]
    fileDict = {}

    tmpFolder = "/tmp/csv/{0}/{1}".format(userName, abbrFileName)
    if os.path.exists(tmpFolder):
        shutil.rmtree(tmpFolder)
    os.makedirs(tmpFolder)
    fileDict["path"] = tmpFolder
    fileDict["tables"] = []

    logger.debug("csvOpts:{0}".format(csvOpts))
    hasHeader = True
    if "header" in csvOpts.keys():
        hasHeader = convertBool(csvOpts["header"])

    if fileName.endswith("xls") or fileName.endswith("xlsx"):
        xls = pd.ExcelFile(fileStream)
        for shName in xls.sheet_names:
            df = xls.parse(sheetname=shName)
            csvFileName = "{0}/{1}".format(tmpFolder, shName)
            df.to_csv(csvFileName, header=True, index=False, encoding='utf-8', escapechar='\\')
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
            if not hasHeader:
                r1 = rcsv.__next__()
                # write one header to be used
                wcsv.writerow(["col_{0}".format(i) for i in range(len(r1))])
                wcsv.writerow(r1)

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
    client = pyhdfs.HdfsClient(hosts="{0}:{1}".format(hdfsHost, nnPort))
    if len(fileDict["tables"]) == 0:
        logger.warn("There is no tables in the fileDict.")
        return False
    # remove if the csv file exists
    fileName = fileDict["path"].split("/")[-1]
    csvFolderUri = "{0}/{1}/csv/{2}".format(rootFolder, userName, fileName)
    if client.exists(csvFolderUri):
        client.delete(csvFolderUri, recursive=True)
    # remove if the parquet file exists
    parquetFolderUri = "{0}/{1}/parquet/{2}".format(rootFolder, userName, fileName)
    if client.exists(parquetFolderUri):
        client.delete(parquetFolderUri, recursive=True)

    uploadedCsvList = []
    for tableItem in fileDict["tables"]:
        filePath = "{0}/{1}".format(fileDict["path"], tableItem)
        uploadedCsvUri = "{0}/{1}/csv/{2}/{3}".format(rootFolder, userName, fileName, tableItem)
        try:
            logger.debug("filePath:{0}, uploadedCsvUri:{1}".format(filePath, uploadedCsvUri))
            client.copy_from_local(filePath, uploadedCsvUri, overwrite=True)
            uploadedCsvList.append(uploadedCsvUri)
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
