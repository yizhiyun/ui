import MySQLdb
import sys
import cx_Oracle
import pymssql
import logging


# Get an instance of a logger
logger = logging.getLogger("uicloud.dataCollection.ConnectDataBase")
logger.setLevel(logging.DEBUG)


def specialBytes(dic):
    for key, value in dic.items():
        if type(value) == bytes:
            dic[key] = value.decode('utf8')
    return dic


class ConnectDataBase():
    def __init__(self, dbPaltName=None, dbLocation=None, dbPort=None,
                 dbUserName=None, dbUserPwd=None, dbSid=None, dbTime=None):
        self.dbPaltName = dbPaltName
        self.dbLocation = dbLocation
        self.dbPort = int(dbPort)
        self.dbUserName = dbUserName
        self.dbUserPwd = dbUserPwd
        self.dbSid = dbSid
        self.dbTime = dbTime
        self.con = None
        # 所有数据库的集合
        self.dataBasesRs = []
        # 某一个数据库下的表格集合
        self.tablesOfDataBase = {}
        # 记录拆分的字段
        self.list = {}
    # 连接到数据库

    def connectDB(self):
        # 转化数据平台 name 小写
        # print(self.dbPaltName.lower())
        if self.dbPaltName == "mysql":
            try:
                self.con = MySQLdb.connect(
                    host=self.dbLocation, port=self.dbPort, user=self.dbUserName, passwd=self.dbUserPwd, charset='utf8')
                return True
            except Exception:
                return False

        elif self.dbPaltName == 'oracle':
            try:
                self.con = cx_Oracle.connect('{0}/{1}@{2}:{3}/{4}'.format(
                    self.dbUserName, self.dbUserPwd, self.dbLocation, self.dbPort, self.dbSid))
                cursor = self.con.cursor()
                cursor.execute("select userenv('language') from dual")
                nls_lang = cursor.fetchone()[0]
                cursor.close()
                self.con.close()
                import os
                os.environ['NLS_LANG'] = nls_lang
                self.con = cx_Oracle.connect('{0}/{1}@{2}:{3}/{4}'.format(
                    self.dbUserName, self.dbUserPwd, self.dbLocation, self.dbPort, self.dbSid))
                return True
            except Exception:
                return False

        elif self.dbPaltName == 'sqlserver':
            try:
                self.con = pymssql.connect(
                    host='{0}:{1}'.format(self.dbLocation, self.dbPort), user=self.dbUserName, password=self.dbUserPwd)
                return True
            except Exception:
                return False

    # 获取当前数据库平台所有的数据库

    def fetchAllDabaBase(self):
        if self.dbPaltName == "mysql":
            self.con.query("show databases")
            rs = self.con.store_result()
            result = rs.fetch_row(0)
            self.dataBasesRs = []
            for obj in result:
                self.dataBasesRs.append(obj[0])

        elif self.dbPaltName == 'oracle':
            self.dataBasesRs = []
            self.dataBasesRs.append(self.dbUserName)

        elif self.dbPaltName == 'sqlserver':
            cursor = self.con.cursor()
            cursor.execute("select Name from Master..SysDatabases")
            rs = cursor.fetchall()
            self.dataBasesRs = []

            for obj in rs:
                self.dataBasesRs.append(obj[0])

    # 获取某个数据库下所有的表格

    def fetchTableBydataBaseName(self, dataBaseName=None):
        if self.dbPaltName == "mysql":
            try:
                if self.tablesOfDataBase.__contains__(dataBaseName):
                    self.con.select_db(dataBaseName)
                    return self.tablesOfDataBase[dataBaseName]
                self.con.select_db(dataBaseName)
                self.con.query("show tables")
                r = self.con.store_result()
                rs = r.fetch_row(0)
                tables = []
                for obj in rs:
                    tables.append(obj[0])
                self.tablesOfDataBase[dataBaseName] = tables
                return self.tablesOfDataBase[dataBaseName]

            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return 'failed'

        elif self.dbPaltName == 'oracle':
            try:
                cursor = self.con.cursor()
                rs = cursor.execute('select Table_name from User_tables').fetchall()
                tables = []
                for obj in rs:
                    tables.append(obj[0])
                self.tablesOfDataBase[self.dbSid] = tables
                return self.tablesOfDataBase[self.dbSid]

            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return 'failed'

        elif self.dbPaltName == 'sqlserver':
            try:
                self.con = pymssql.connect(
                    host=self.dbLocation, user=self.dbUserName, password=self.dbUserPwd, database=dataBaseName)
                cursor = self.con.cursor()
                cursor.execute('select Name from {0}.sys.tables'.format(dataBaseName))
                rs = cursor.fetchall()
                tables = []
                for obj in rs:
                    tables.append(obj[0])
                self.tablesOfDataBase[dataBaseName] = tables
                return self.tablesOfDataBase[dataBaseName]

            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return 'failed'

    # 根据条件查询. 返回表格数据

    def filterTableData(self, jsonData, mode, maxRowCount):
        '''
        '''
        sql = 'select * from {0} where 1=1 '.format(jsonData['tableName'])
        columnstr = None
        coldickey = '{0}_{1}'.format(jsonData['database'], jsonData['tableName'])
        if 'columns' in jsonData.keys() and jsonData['columns']:
            newcolnamelist = self.turnCols(list(jsonData['columns'].keys()), coldickey)
            columnstr = ', '.join(newcolnamelist)
            sql = 'select {0} from {1} where 1=1 '.format(columnstr, jsonData['tableName'])

        mysqlstr = ''
        sqlserverstr = ''
        oraclestr = ''
        oracleToDate = ''

        filtersql = ''

        count = 0
        if 'conditions' in jsonData.keys():
            for condIt in jsonData['conditions']:
                if 'columnName' in condIt.keys():
                    condIt['columnName'] = self.turnCols([condIt['columnName']], coldickey)[0].split(' as ')[0]

                if 'limit' == condIt['type']:
                    count += 1

                condType = condIt['type']
                if condType == 'limit' and type(condIt["value"]) == int:
                    mysqlstr = 'limit {0}'.format(condIt["value"])
                    sqlserverstr = ' top {0}'.format(condIt["value"])
                    oraclestr = 'and rownum<={0} '.format(condIt["value"])

                elif condType in [">", ">=", "=", "<=", "<", "!="]:
                    if 'datatype' in condIt.keys() and condIt['datatype'] == 'date' and self.dbPaltName == 'oracle':
                        oracleToDate = "and {0} {1} to_date('{2}', 'yyyy-mm-dd') ".format(
                            condIt['columnName'], condType, condIt["value"]
                        ) + oraclestr

                    else:
                        filtersql += "and {0} {1} '{2}' ".format(condIt['columnName'], condType, condIt["value"])

                elif condType == "like":
                    filtersql += "and {0} like '{1}' ".format(condIt['columnName'], condIt["value"])

                elif condType == "contains":
                    filtersql += "and {0} like '%{1}%' ".format(condIt['columnName'], condIt["value"])

                elif condType == "notcontains":
                    filtersql += "and {0} not like '%{1}%' ".format(condIt['columnName'], condIt["value"])

                elif condType == "isin":
                    valuestr = '(' + str(condIt["value"])[1:-1] + ')'
                    filtersql += 'and {0} in {1} '.format(condIt['columnName'], valuestr)

                elif condType == "isnotin":
                    valuestr = '(' + str(condIt["value"])[1:-1] + ')'
                    filtersql += 'and {0} not in {1} '.format(condIt['columnName'], valuestr)

                elif condType == "isnull":
                    filtersql += 'and {0} is null '.format(condIt['columnName'])

                elif condType == "isnotnull":
                    filtersql += 'and {0} is not null '.format(condIt['columnName'])

                elif condType == "startswith":
                    filtersql += "and {0} like '{1}%' ".format(condIt['columnName'], condIt["value"])

                elif condType == "notstartswith":
                    filtersql += "and {0} not like '{1}%' ".format(condIt['columnName'], condIt["value"])

                elif condType == "endswith":
                    filtersql += "and {0} like '%{1}' ".format(condIt['columnName'], condIt["value"])

                elif condType == "notendswith":
                    filtersql += "and {0} not like '%{1}' ".format(condIt['columnName'], condIt["value"])

        if count == 0:
            if 'expressions' not in jsonData.keys() or not jsonData['expressions']:
                mysqlstr = mysqlstr + 'limit {0}'.format(maxRowCount)
                sqlserverstr = sqlserverstr + ' top {0}'.format(maxRowCount)
                oraclestr += oraclestr + 'and rownum<={0} '.format(maxRowCount)

        results = {}

        if self.dbPaltName == "mysql":
            try:
                self.con.select_db(jsonData['database'])
                cursor = self.con.cursor(cursorclass=MySQLdb.cursors.DictCursor)

                if 'expressions' in jsonData.keys() and jsonData['expressions']:
                    expressions = jsonData['expressions']
                    exprStr = ''
                    for expr in expressions['exprlist']:
                        exprStr += expr['exprstr'] + ' as ' + expr['alias'] + ','
                    if 'groupby' in expressions.keys() and expressions['groupby']:
                        exprStr += ','.join(expressions['groupby'])
                        exprSql = "select {0} from {1} where 1=1 ".format(exprStr, jsonData['tableName'])
                    else:
                        exprSql = "select {0} from {1} where 1=1 ".format(exprStr[:-1], jsonData['tableName'])
                    exprSql += filtersql
                    if 'groupby' in expressions.keys() and expressions['groupby']:
                        exprSql += 'group by {0} '.format(','.join(expressions['groupby']))
                    if 'orderby' in expressions.keys() and expressions['orderby']:
                        exprSql += 'order by {0} '.format(','.join(expressions['orderby']))
                    exprSql += mysqlstr
                    logger.debug('exprSql: {0}'.format(exprSql))
                    cursor.execute(exprSql)
                    rs = cursor.fetchall()
                    return rs

                if mode == 'all' or mode == 'data':
                    sql += filtersql + mysqlstr
                    logger.debug('mysqlfiltersplitsql: {0}'.format(sql))
                    cursor.execute(sql)
                    results['data'] = cursor.fetchall()
                    logger.debug('results["data"]: {0}'.format(results['data']))

                if mode == 'all' or mode == 'schema':
                    results['schema'] = []
                    if columnstr:
                        for column in jsonData['columns'].items():
                            results['schema'].append({'field': column[0], 'type': column[1]["columnType"]})
                    else:
                        cursor.execute("show columns from " + jsonData['tableName'])
                        datas = cursor.fetchall()
                        for data in datas:
                            dic = {}
                            for key, value in data.items():
                                dic[key.lower()] = value
                            results['schema'].append(dic)
                    logger.debug('results["schema"]: {0}'.format(results['schema']))

            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return 'failed'

        elif self.dbPaltName == 'sqlserver':
            try:
                self.con = pymssql.connect(host=self.dbLocation, user=self.dbUserName,
                                           password=self.dbUserPwd, database=jsonData['database'])
                cursor = self.con.cursor()
                if mode == 'all' or mode == 'data':
                    sql = sql[:6] + sqlserverstr + sql[6:] + filtersql
                    cursor.execute(sql)
                    dataList = cursor.fetchall()

                    cursor.execute('sp_columns ' + jsonData['tableName'])
                    colList = cursor.fetchall()

                    results['data'] = []
                    for data in dataList:
                        dic = {}
                        for i in range(len(colList)):
                            dic[colList[i][3]] = data[i]
                        results['data'].append(dic)

                if mode == 'all' or mode == 'schema':
                    results['schema'] = []
                    if columnstr:
                        for column in jsonData['columns'].items():
                            results['schema'].append('{0}:{1}'.format(column[0], column[1]["columnType"]))
                    else:
                        cursor.execute('sp_columns ' + jsonData['tableName'])
                        rs = cursor.fetchall()
                        results['schema'] = []
                        for obj in rs:
                            results['schema'].append({
                                'field': obj[3],
                                'type': obj[5]
                            })

            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return 'failed'

        elif self.dbPaltName == 'oracle':
            try:
                cursor = self.con.cursor()
                if 'expressions' in jsonData.keys() and jsonData['expressions']:
                    expressions = jsonData['expressions']
                    exprStr = ''
                    for expr in expressions['exprlist']:
                        exprStr += '{0} as "{1}",'.format(expr['exprstr'], expr['alias'])
                    if 'groupby' in expressions.keys() and expressions['groupby']:
                        exprStr += ','.join(expressions['groupby'])
                        exprSql = "select {0} from {1} where 1=1 ".format(exprStr, jsonData['tableName'])
                    else:
                        exprSql = "select {0} from {1} where 1=1 ".format(exprStr[:-1], jsonData['tableName'])
                    exprSql += filtersql
                    if 'groupby' in expressions.keys() and expressions['groupby']:
                        exprSql += 'group by {0} '.format(','.join(expressions['groupby']))
                    if 'orderby' in expressions.keys() and expressions['orderby']:
                        exprSql += 'order by {0} '.format(','.join(expressions['orderby']))
                    exprSql += mysqlstr
                    logger.debug('exprSql: {0}'.format(exprSql))
                    cursor.execute(exprSql)
                    dataList = cursor.fetchall()
                    colList = cursor.description

                    results = []
                    for data in dataList:
                        dic = {}
                        for i in range(len(colList)):
                            dic[colList[i][0]] = data[i]
                        results.append(dic)
                    return results

                if mode == 'all' or mode == 'data':
                    sql += filtersql + oracleToDate + oraclestr
                    logger.debug('oraclesql: {0}'.format(sql))
                    cursor.execute(sql)
                    dataList = cursor.fetchall()
                    colList = cursor.description

                    results['data'] = []
                    for data in dataList:
                        dic = {}
                        for i in range(len(colList)):
                            dic[colList[i][0]] = data[i]
                        results['data'].append(dic)

                if mode == 'all' or mode == 'schema':
                    results['schema'] = []
                    if columnstr:
                        for column in jsonData['columns'].items():
                            results['schema'].append('{0}:{1}'.format(column[0], column[1]["columnType"]))
                    else:
                        rs = cursor.execute(
                            "select column_name,data_type From all_tab_columns where table_name='{0}'".format(
                                jsonData['tableName'])).fetchall()
                        for obj in rs:
                            results['schema'].append({
                                'field': obj[0],
                                'type': obj[1]
                            })

            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return 'failed'

        if mode == 'all' or mode == 'schema':
            if 'columns' not in jsonData.keys() or not jsonData['columns']:
                if coldickey in self.list.keys() and self.list[coldickey]:
                    addsql = ''
                    for i in self.list[coldickey]:
                        for key, value in i.items():
                            addsql += value + ', '
                            dic = {
                                "field": key,
                                "type": "VARCHAR"
                            }

                            list1 = key.split('_')
                            lastName = list1.pop(-1)
                            if lastName.startswith('PART'):
                                num = int(lastName[4:])
                                insertcol = '_'.join(list1)
                                for i in range(len(results['schema'])):
                                    if results['schema'][i]['field'] == insertcol:
                                        results['schema'].insert(i + num, dic)
                            elif lastName.startswith('MERGE'):
                                num = int(lastName[5:])
                                for i in range(len(results['schema'])):
                                    if results['schema'][i]['field'] == list1[0]:
                                        results['schema'].insert(i + num, dic)

        if mode == 'all' or mode == 'data':
            if 'columns' not in jsonData.keys() or not jsonData['columns']:
                if coldickey in self.list.keys() and self.list[coldickey]:
                    addsql = ''
                    for i in self.list[coldickey]:
                        for key, value in i.items():
                            addsql += value + ', '
                    logger.error('addsql: {0}'.format(addsql))
                    sql = 'select {0} from {1} where 1=1 '.format(
                        addsql[:-2], jsonData['tableName']) + filtersql + oracleToDate + eval(self.dbPaltName + 'str')

                    try:
                        cursor.execute(sql)
                    except Exception:
                        logger.error("Exception: {0}".format(sys.exc_info()))
                        return 'failed'

                    if self.dbPaltName == 'mysql':
                        newDataList = cursor.fetchall()
                        for i in range(len(results['data'])):
                            results['data'][i].update(specialBytes(newDataList[i]))
                    elif self.dbPaltName == 'oracle':
                        dataList = cursor.fetchall()
                        colList = cursor.description
                        updateList = []
                        for data in dataList:
                            dic = {}
                            for i in range(len(colList)):
                                dic[colList[i][0]] = data[i]
                            updateList.append(dic)
                        for i in range(len(results['data'])):
                            results['data'][i].update(updateList[i])

        if mode == 'all' and 'handleCol' in jsonData.keys() and jsonData['handleCol']:

            handleCol = jsonData['handleCol']
            if handleCol['method'] == 'split':
                countsql = "select length(replace({0},'{1}','--'))-length({0}) from {2}".format(
                    self.turnCols([handleCol['colname']], coldickey)[0].split(' as ')[0],
                    handleCol['cutsymbol'],
                    jsonData['tableName']
                )
                logger.debug('countsql: {0}'.format(countsql))

                try:
                    cursor.execute(countsql)
                except Exception:
                    logger.error("Exception: {0}".format(sys.exc_info()))
                    return 'failed'

                countNumList = cursor.fetchall()
                newCountNumList = []
                if self.dbPaltName == 'mysql':
                    for i in countNumList:
                        if list(i.values())[0]:
                            newCountNumList.append(list(i.values())[0])
                    newCountNumList.sort()

                else:
                    for i in countNumList:
                        if i[0]:
                            newCountNumList.append(i[0])
                    newCountNumList.sort()

                if newCountNumList:
                    handleCol['count'] = newCountNumList[-1]
                else:
                    handleCol['count'] = 0

                indexSql = "select instr({0}, '{1}') from {2}".format(
                    self.turnCols([handleCol['colname']], coldickey)[0].split(' as ')[0],
                    handleCol['cutsymbol'],
                    jsonData['tableName']
                )
                logger.debug('indexSql: {0}'.format(indexSql))

                try:
                    cursor.execute(indexSql)
                except Exception:
                    logger.error("Exception: {0}".format(sys.exc_info()))
                    return 'failed'

                indexNumList = cursor.fetchall()
                newIndexNumList = []
                if self.dbPaltName == 'mysql':
                    for i in indexNumList:
                        if list(i.values())[0]:
                            newIndexNumList.append(list(i.values())[0])
                    newIndexNumList.sort()

                else:
                    for i in indexNumList:
                        if i[0]:
                            newIndexNumList.append(i[0])
                    newIndexNumList.sort()

                if newIndexNumList and newIndexNumList[-1] <= 1:
                    handleCol['index'] = True
                else:
                    handleCol['index'] = False

            conversionList = self.conversionCols(handleCol, coldickey)
            if conversionList == 'name error' or conversionList == 'limit type':
                return conversionList

            logger.debug('conversionList: {0}'.format(conversionList))
            sql = 'select {0} from {1} where 1=1 '.format(
                ', '.join(conversionList), jsonData['tableName']) + filtersql + oracleToDate + \
                eval(self.dbPaltName + 'str')
            logger.debug('handleColSql: {0}'.format(sql))

            try:
                cursor.execute(sql)
            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return 'failed'

            if self.dbPaltName == 'mysql':
                newDataList = cursor.fetchall()
                for i in range(len(results['data'])):
                    results['data'][i].update(specialBytes(newDataList[i]))
            elif self.dbPaltName == 'oracle':
                dataList = cursor.fetchall()
                colList = cursor.description
                updateList = []
                for data in dataList:
                    dic = {}
                    for i in range(len(colList)):
                        dic[colList[i][0]] = data[i]
                    updateList.append(dic)
                for i in range(len(results['data'])):
                        results['data'][i].update(updateList[i])

            if handleCol['method'] == 'split' or handleCol['method'] == 'limit':
                countname = 0
                for j in self.list[coldickey]:
                    if list(j.keys())[0].startswith(handleCol['colname'] + '_PART'):
                        countname += 1

                for i in range(len(conversionList)):
                    dic = {
                        "field": handleCol['colname'] + '_PART{0}'.format(i + 1 + countname),
                        "type": 'VARCHAR'
                    }

                    count = 0
                    for j in range(len(results['schema'])):
                        if results['schema'][j]['field'] == handleCol['colname']:
                            results['schema'].insert(j + i + 1 + countname, dic)
                            count += 1
                    if count == 0:
                        results['schema'].append(dic)
                    self.list[coldickey].append({handleCol['colname'] + '_PART{0}'.format(
                        i + 1 + countname): conversionList[i]})

            elif handleCol['method'] == 'merge':
                countMergename = 0
                for j in self.list[coldickey]:
                    if list(j.keys())[0].startswith("_".join(handleCol['colnamelist']) + '_MERGE'):
                        countMergename += 1

                dic = {
                    "field": "_".join(handleCol['colnamelist']) + '_MERGE%s' % (1 + countMergename),
                    "type": 'VARCHAR'
                }

                count = 0
                for i in range(len(results['schema'])):
                    if results['schema'][i]['field'] == handleCol['colnamelist'][0]:
                        results['schema'].insert(i + 1 + countMergename, dic)
                        count += 1
                if count == 0:
                    results['schema'].append(dic)
                self.list[coldickey].append({
                    "_".join(handleCol['colnamelist']) + '_MERGE%s' % (1 + countMergename): conversionList[0]
                })

        return results

    def conversionCols(self, handleCol, key):
        '''
        '''
        logger.debug('handleCol: {0}'.format(handleCol))

        if key not in self.list.keys():
            self.list[key] = []

        if 'colname' in handleCol.keys() and handleCol['method'] == 'limit' or handleCol['method'] == 'split':
            colname = handleCol['colname']
            for i in self.list[key]:
                if colname in i.keys():
                    colname = i[colname].split(' as ')[0]

            countname = 0
            for j in self.list[key]:
                if list(j.keys())[0].startswith(handleCol['colname'] + '_PART'):
                    countname += 1

            conversionList = []

            if handleCol['method'] == 'split':

                if handleCol['count'] == 0:
                    prev = "{0} as {1}".format(
                        colname, handleCol['colname'] + '_PART%s' % (1 + countname)
                    )
                    conversionList.append(prev)

                else:
                    if not handleCol['index']:
                        for i in range(handleCol['count']):
                            prev = "substr({0}, 1, instr({0}, '{1}')-1) as {2}".format(
                                colname,
                                handleCol['cutsymbol'],
                                handleCol['colname'] + '_PART%s' % (1 + countname + i)
                            )

                            aft = "substr({0}, instr({0}, '{1}')+1) as {2}".format(
                                colname,
                                handleCol['cutsymbol'],
                                handleCol['colname'] + '_PART%s' % (2 + countname + i)
                            )
                            colname = aft.split(' as ')[0]

                            conversionList.append(prev)
                            if i == handleCol['count'] - 1:
                                conversionList.append(aft)
                    else:
                        for i in range(handleCol['count']):
                            prev = "substr({0}, 1, instr({0}, '{1}')-1) as {2}".format(
                                colname,
                                handleCol['cutsymbol'],
                                handleCol['colname'] + '_PART%s' % (countname + i)
                            )

                            aft = "substr({0}, instr({0}, '{1}')+1) as {2}".format(
                                colname,
                                handleCol['cutsymbol'],
                                handleCol['colname'] + '_PART%s' % (1 + countname + i)
                            )
                            colname = aft.split(' as ')[0]

                            if i != 0:
                                conversionList.append(prev)
                            if i == handleCol['count'] - 1:
                                conversionList.append(aft)

            elif handleCol['method'] == 'limit':

                limit = handleCol['cutsymbol']

                if len(limit) == 1:
                    prev = "substr({0}, 1, {1}) as {2}".format(
                        colname, limit[0], handleCol['colname'] + '_PART{0}'.format(1 + countname))
                    conversionList.append(prev)

                    aft = "substr({0}, {1}) as {2}".format(
                        colname, limit[0] + 1, handleCol['colname'] + '_PART{0}'.format(2 + countname))
                    conversionList.append(aft)

                else:
                    for i in range(len(limit)):
                        if i == 0:
                            sql = "substr({0}, 1, {1}) as {2}".format(
                                colname, limit[i], handleCol['colname'] + '_PART%s' % (i + 1 + countname))
                            conversionList.append(sql)

                        else:
                            sql = "substr({0}, {1}, {2}) as {3}".format(
                                colname, limit[i - 1] + 1,
                                limit[i] - limit[i - 1],
                                handleCol['colname'] + '_PART%s' % (i + 1 + countname))
                            conversionList.append(sql)

                            if i == len(limit) - 1:
                                sql = "substr({0}, {1}) as {2}".format(
                                    colname,
                                    limit[i] + 1,
                                    handleCol['colname'] + '_PART%s' % (i + 2 + countname))
                                conversionList.append(sql)

            logger.debug('limitsqllist: {0}'.format(conversionList))
            return conversionList

        elif handleCol['method'] == 'merge':
            colnamelist = handleCol['colnamelist']

            countMergename = 0
            for j in self.list[key]:
                if list(j.keys())[0].startswith("_".join(colnamelist) + '_MERGE'):
                    countMergename += 1

            aftlist = []
            for colname in colnamelist:
                for i in self.list[key]:
                    if colname in i.keys():
                        colname = i[colname].split(' as ')[0]
                aftlist.append(colname)
            logger.debug('trans_aftlist: {0}'.format(aftlist))
            concatsql = 'concat('
            for i in range(len(aftlist)):
                concatsql += aftlist[i] + ','
            concatsql = concatsql[:-1] + ") as " + "_".join(colnamelist) + '_MERGE%s' % (1 + countMergename)
            return [concatsql]

    def turnCols(self, colnamelist, key):
        newcolnamelist = []
        if key in self.list.keys():
            for colname in colnamelist:
                for i in self.list[key]:
                    if colname in i.keys():
                        colname = i[colname]
                newcolnamelist.append(colname)
            return newcolnamelist
        return colnamelist
