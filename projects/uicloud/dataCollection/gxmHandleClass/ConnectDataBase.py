import MySQLdb
import sys
import cx_Oracle
import pymssql
import logging


# Get an instance of a logger
logger = logging.getLogger("uicloud.dataCollection.ConnectDataBase")
logger.setLevel(logging.DEBUG)


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
                    mysqlstr = mysqlstr + 'limit {0}'.format(condIt["value"])
                    sqlserverstr = sqlserverstr + ' top {0}'.format(condIt["value"])
                    oraclestr += oraclestr + 'and rownum<={0} '.format(condIt["value"])

                elif condType in [">", ">=", "=", "<=", "<", "!="]:
                    if 'datatype' in condIt.keys() and condIt['datatype'] == 'date' and self.dbPaltName == 'oracle':
                        oraclestr = "and {0} {1} to_date('{2}', 'yyyy-mm-dd') ".format(
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
            mysqlstr = mysqlstr + 'limit {0}'.format(maxRowCount)
            sqlserverstr = sqlserverstr + ' top {0}'.format(maxRowCount)
            oraclestr += oraclestr + 'and rownum<={0} '.format(maxRowCount)

        results = {}

        if self.dbPaltName == "mysql":
            try:
                self.con.select_db(jsonData['database'])
                cursor = self.con.cursor(cursorclass=MySQLdb.cursors.DictCursor)

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
                if mode == 'all' or mode == 'data':
                    sql += filtersql + oraclestr
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

        if mode == 'all' and 'columns' not in jsonData.keys() or \
                'columns' in jsonData.keys() and not jsonData['columns']:
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
                        num = int(list1.pop(-1)[2:])
                        insertcol = '_'.join(list1)
                        for i in range(len(results['schema'])):
                            if results['schema'][i]['field'].lower() == insertcol:
                                results['schema'].insert(i + num, dic)
                logger.error('addsql: {0}'.format(addsql))
                sql = 'select {0} from {1} where 1=1 '.format(
                    addsql[:-2], jsonData['tableName']) + filtersql + eval(self.dbPaltName + 'str')
                cursor.execute(sql)
                if self.dbPaltName == 'mysql':
                    newDataList = cursor.fetchall()
                    for i in range(len(results['data'])):
                        results['data'][i].update(newDataList[i])
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

        if mode == 'all' and 'expressions' in jsonData.keys():
            for expressions in jsonData['expressions']:
                conversionList = self.conversionCols({'expressions': expressions}, coldickey)
                if conversionList == 'name error' or conversionList == 'limit type':
                    return conversionList

                logger.debug('conversionList: {0}'.format(conversionList))
                sql = 'select {0} from {1} where 1=1 '.format(
                    ', '.join(conversionList), jsonData['tableName']) + filtersql + eval(self.dbPaltName + 'str')
                logger.debug('expressionsSql: {0}'.format(sql))

                cursor.execute(sql)
                if self.dbPaltName == 'mysql':
                    newDataList = cursor.fetchall()
                    for i in range(len(results['data'])):
                        results['data'][i].update(newDataList[i])
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

                for i in range(len(conversionList)):
                    dic = {
                        "field": expressions['colname'] + '_拆分{0}'.format(i + 1),
                        "type": 'VARCHAR'
                    }
                    count = 0
                    for j in range(len(results['schema'])):
                        if results['schema'][j]['field'] == expressions['colname']:
                            results['schema'].insert(j + i + 1, dic)
                            count += 1
                    if count == 0:
                        results['schema'].append(dic)
                    self.list[coldickey].append({expressions['colname'] + '_拆分{0}'.format(i + 1): conversionList[i]})

        elif mode == 'all' and 'trans' in jsonData.keys():
            for trans in jsonData['trans']:
                conversionStr = self.conversionCols({'trans': trans}, coldickey)
                if conversionStr == 'name error':
                    return conversionStr

                sql = 'select {0} from {1} where 1=1 '.format(
                    conversionStr, jsonData['tableName']) + filtersql + eval(self.dbPaltName + 'str')
                logger.debug('transSql: {0}'.format(sql))
                cursor.execute(sql)
                if self.dbPaltName == 'mysql':
                    newDataList = cursor.fetchall()
                    logger.debug('newDataList: {0}'.format(newDataList))
                    for i in range(len(results['data'])):
                        results['data'][i].update(newDataList[i])
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

                dic = {
                    "field": trans['newcolname'],
                    "type": 'VARCHAR'
                }
                results['schema'].append(dic)
                self.list[coldickey].append({trans['newcolname']: conversionStr})

        return results

    def conversionCols(self, dic, key):
        '''
        '''
        logger.debug('dic: {0}'.format(dic))

        if key not in self.list.keys():
            self.list[key] = []

        if list(dic.keys())[0] == 'expressions':
            colname = dic['expressions']['colname']
            for i in self.list[key]:
                if colname in i.keys():
                    colname = i[colname].split(' as ')[0]

            if list(dic['expressions']['cutmethod'].keys())[0] == 'split':
                split = dic['expressions']['cutmethod']['split']
                conversionList = []

                for k, v in split.items():
                    for i in range(v):

                        prev = "substr({0}, 1, instr({0}, '{1}')-1) as {2}".format(
                            colname, k, dic['expressions']['colname'] + '_拆分%s' % (i + 1)
                        )

                        aft = "substr({0}, instr({0}, '{1}')+1) as {2}".format(
                            colname, k, dic['expressions']['colname'] + '_拆分%s' % (i + 2)
                        )
                        colname = aft.split(' as ')[0]
                        conversionList.append(prev)
                        if i == v - 1:
                            conversionList.append(aft)

                return conversionList

            if list(dic['expressions']['cutmethod'].keys())[0] == 'limit' and type(
                    dic['expressions']['cutmethod']['limit']) == int:

                limit = dic['expressions']['cutmethod']['limit']

                prev = "substr({0}, 1, {1}) as {2}".format(colname, limit, colname + '_拆分1')
                aft = "substr({0}, {1}) as {2}".format(colname, limit + 1, colname + '_拆分2')

                conversionList = [prev, aft]
                return conversionList
            else:
                return 'limit type'

        elif list(dic.keys())[0] == 'trans':
            logger.debug('trans: {0}'.format(dic['trans']))
            colnamelist = dic['trans']['colnamelist']

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
            concatsql = concatsql[-1] + ") as " + "_".join(aftlist) + '_合并'
            return concatsql

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
