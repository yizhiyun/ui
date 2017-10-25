import re
import logging


from dataCollection.gxmHandleClass.Singleton import Singleton

# Get an instance of a logger
logger = logging.getLogger("uicloud.cloudrestapi.addColType")
logger.setLevel(logging.DEBUG)


def handleType(ctype):
    '''
    Determine data type.
    '''
    strList = ['text', 'varchar', 'char', 'tinytext', 'mediumtext', 'longtext', 'binary',
               'varbinary', 'tinyblob', 'blob', 'mediumblob', 'longblob', 'enum', 'set',
               'StringType', 'BinaryType']

    intList = ['int', 'tinyint', 'smallint', 'mediumint', 'bigint', 'decimal', 'float',
               'double', 'real', 'bit', 'serial', 'BooleanType', 'DecimalType', 'DoubleType',
               'FloatType', 'ByteType', 'IntegerType', 'LongType', 'ShortType', 'number']

    dateList = ['date', 'datetime', 'year', 'time', 'timestamp', 'DateType', 'TimestampType',
                'smalldatetime', 'datetime2', 'datetimeoffset']

    spaceList = ['point', 'geometry', 'linestring', 'polygon', 'multipoint', 'multilinestrin',
                 'multiplygon', 'geometrycollection', 'MapType']

    noneList = ['NullType', 'null', 'none']
    if not ctype:
        return 'nothing'
    else:
        if re.search(ctype, '|'.join(strList), re.IGNORECASE):
            return 'str'

        elif re.search(ctype, '|'.join(intList), re.IGNORECASE):
            return 'int'

        elif re.search(ctype, '|'.join(dateList), re.IGNORECASE):
            return 'date'

        elif re.search(ctype, '|'.join(spaceList), re.IGNORECASE):
            return 'space'

        elif re.search(ctype, '|'.join(noneList), re.IGNORECASE):
            return 'none'

        else:
            logger.error('unknownType: {0}'.format(ctype))
            return 'unknownType'


def addColType(username, tablename, data):
    '''
    add argument coltype.
    '''

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
                    dtype = handleType(i['type'])
                    if dtype == 'str' or dtype == 'date' or dtype == 'space':
                        i['coltype'] = 'dimensionality'
                    elif dtype == 'int' or dtype == 'none':
                        i['coltype'] = 'measure'
                    else:
                        i['coltype'] = 'dimensionality'
    return data


def handleColTypeForm(username, tablename, colMapList):
    '''
    table coltype by user empty. add new default coltype.
    '''
    colList = []
    for colMap in colMapList:
        colList += list(colMap.values())
    colList = list(set(colList))

    if username not in Singleton().colTypeForm.keys():
        Singleton().colTypeForm[username] = {}
    Singleton().colTypeForm[username][tablename] = {}

    for col in colList:
        Singleton().colTypeForm[username][tablename][col] = 'dimensionality'
