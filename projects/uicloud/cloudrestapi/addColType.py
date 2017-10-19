import re
import logging


from dataCollection.gxmHandleClass.Singleton import Singleton

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.addColType")
logger.setLevel(logging.DEBUG)


def addColType(username, tablename, data):
    '''
    '''
    strList = ['text', 'varchar', 'char', 'tinytext', 'mediumtext', 'longtext', 'binary',
               'varbinary', 'tinyblob', 'blob', 'mediumblob', 'longblob', 'enum', 'set',
               'StringType', 'BinaryType']

    intList = ['int', 'tinyint', 'smallint', 'mediumint', 'bigint', 'decimal', 'float',
               'double', 'real', 'bit', 'serial', 'BooleanType', 'DecimalType', 'DoubleType',
               'FloatType', 'ByteType', 'IntegerType', 'LongType', 'ShortType', 'number']

    dateList = ['date', 'datetime', 'year', 'time', 'timestamp', 'DateType', 'TimestampType']

    spaceList = ['point', 'geometry', 'linestring', 'polygon', 'multipoint', 'multilinestrin',
                 'multiplygon', 'geometrycollection', 'MapType']

    noneList = ['NullType', 'null', 'none']

    if 'schema' in data.keys():
        schema = data['schema']
        for i in schema:
            if username in Singleton().colTypeForm.keys() and \
               tablename in Singleton().colTypeForm[username].keys() and \
               i['field'] in Singleton().colTypeForm[username][tablename].keys():
                i['coltype'] = Singleton().colTypeForm[username][tablename][i['field']]
            else:
                if re.search('id|name', i['field'], re.IGNORECASE):
                    i['coltype'] = 'dimensionality'
                else:
                    if re.search('|'.join(strList + dateList + spaceList), i['type'], re.IGNORECASE):
                        i['coltype'] = 'dimensionality'
                    elif re.search('|'.join(intList + noneList), i['type'], re.IGNORECASE):
                        i['coltype'] = 'measure'
                    else:
                        i['coltype'] = 'dimensionality'
                        logger.error('unknownType: {0}'.format(i['type']))
    return data


def handleColTypeForm(username, tablename, colMapList):
    '''
    '''
    # if username in Singleton().colTypeForm.keys() and \
    #    tablename in Singleton().colTypeForm[username].keys():
    #     Singleton().colTypeForm[username][tablename].clear()
    colList = []
    for colMap in colMapList:
        colList += list(colMap.values())
    colList = list(set(colList))

    if username not in Singleton().colTypeForm.keys():
        Singleton().colTypeForm[username] = {}
    Singleton().colTypeForm[username][tablename] = {}

    for col in colList:
        Singleton().colTypeForm[username][tablename][col] = 'dimensionality'
