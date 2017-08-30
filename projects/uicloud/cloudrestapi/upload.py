import pyhdfs
import xlrd
import os
import csv
import sys
import logging
import codecs

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.upload")
logger.setLevel(logging.DEBUG)


def preUploadFile(fileStream, csvOpts={}):
    """
    pre-process the uploaded csv, xls or xlsx file to csv.
    """
    fileName = fileStream.name
    fnStr = os.path.splitext(fileName)[0]
    fileList = []

    tmpFolder = "/tmp/csv/{0}".format(fnStr)
    if not os.path.exists(tmpFolder):
        os.makedirs(tmpFolder)

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
                fileList.append(csvFileName)
    elif fileName.endswith("csv"):
        csvFileName = "{0}/{1}".format(tmpFolder, fnStr)

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
            fileList.append(csvFileName)
    else:
        logger.error("At present, only 'csv','xls' and 'xlsx' can be supported.")

    return fileList


def uploadToHdfs(filePath, hdfsHost="spark-master0", nnPort="50070", rootFolder="/tmp/users", userName="myfolder"):
    """
    upload file into hdfs server.
    filePath must has the format of <rootFolder>/<parentFolder>/<fileName>, e.g. /tmp/csv/test/test1
    """

    folderName, fileName = filePath.split("/")[-2:]
    uploadedCsvUri = "{0}/{1}/csv/{2}/{3}".format(rootFolder, userName, folderName, fileName)
    client = pyhdfs.HdfsClient(hosts="{0}:{1}".format(hdfsHost, nnPort))
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
