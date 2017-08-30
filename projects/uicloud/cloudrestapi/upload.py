import pyhdfs
import xlrd
import os
import csv
import sys
import logging
import codecs
import shutil

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

    if fileName.endswith("xls") or fileName.endswith("xlsx"):
        workbook = xlrd.open_workbook(filename=None, file_contents=fileStream.read())
        all_worksheets = workbook.sheet_names()
        for wsName in all_worksheets:
            worksheet = workbook.sheet_by_name(wsName)
            csvFileName = "{0}/{1}".format(tmpFolder, wsName)
            with open(csvFileName, "w") as csvFile:
                csvWriter = csv.writer(csvFile, delimiter=",", doublequote=True, quotechar="\"",
                                       escapechar="\\", lineterminator="\r\n", quoting=csv.QUOTE_MINIMAL,
                                       skipinitialspace=True, strict=True)
                for rownum in range(worksheet.nrows):
                    csvWriter.writerow(worksheet.row_values(rownum))
                fileDict["tables"].append(wsName)
    elif fileName.endswith("csv"):
        csvFileName = "{0}/{1}".format(tmpFolder, abbrFileName)

        logger.debug("csvOpts:{0}".format(csvOpts))
        delimiter = csvOpts["delimiter"] if "delimiter" in csvOpts.keys() else ","
        doublequote = csvOpts["doublequote"] if "doublequote" in csvOpts.keys() else True
        quotechar = csvOpts["quote"] if "quote" in csvOpts.keys() else "\""
        escapechar = csvOpts["escapechar"] if "escapechar" in csvOpts.keys() else "\\"
        lineterminator = csvOpts["lineterminator"] if "lineterminator" in csvOpts.keys() else "\r\n"
        skipinitialspace = csvOpts["skipinitialspace"] if "skipinitialspace" in csvOpts.keys() else True
        strict = csvOpts["strict"] if "strict" in csvOpts.keys() else True

        with open(csvFileName, "w") as csvFile:
            rcsv = csv.reader(codecs.iterdecode(fileStream, 'utf-8'), delimiter=delimiter, doublequote=doublequote,
                              quotechar=quotechar, escapechar=escapechar, lineterminator=lineterminator,
                              skipinitialspace=skipinitialspace, strict=strict)
            wcsv = csv.writer(csvFile, delimiter=",", doublequote=True, quotechar="\"", escapechar="\\",
                              lineterminator="\r\n", quoting=csv.QUOTE_MINIMAL, skipinitialspace=True,
                              strict=True)
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
    # remove if the files' folder exists
    fileName = fileDict["path"].split("/")[-1]
    folderUri = "{0}/{1}/csv/{2}".format(rootFolder, userName, fileName)
    if client.exists(folderUri):
        client.delete(folderUri, recursive=True)

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
            logger.error("Exception: {0}".format(sys.exc_info()))
            return False
    return uploadedCsvList
