import MySQLdb
import sys
import cx_Oracle
import pymssql
import logging


# Get an instance of a logger
logger = logging.getLogger("uicloud.dataCollection.ConnectDataBase")
logger.setLevel(logging.DEBUG)


class ConnectDataBase():
    # 新增一个Sid（数据库名称）参数
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

    # 返回表格数据

    def fetchTableData(self, tableName, modeName, dataBaseName=None):
        if self.dbPaltName == "mysql":
            try:
                self.con.select_db(dataBaseName)
                results = {}
                cur = self.con.cursor(cursorclass=MySQLdb.cursors.DictCursor)
                if modeName == 'all' or modeName == 'schema':
                    cur.execute("show columns from " + tableName)
                    datas = cur.fetchall()

                    results['schema'] = []
                    for data in datas:
                        dic = {}
                        for key, value in data.items():
                            dic[key.lower()] = value
                        results['schema'].append(dic)

                if modeName == 'all' or modeName == 'data':
                    cur.execute("select * from " + tableName)
                    results['data'] = cur.fetchall()
                return results

            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return 'failed'

        elif self.dbPaltName == 'oracle':
            try:
                results = {}
                cursor = self.con.cursor()
                if modeName == 'all' or 'schema':
                    rs = cursor.execute(
                        "select column_name,data_type From all_tab_columns where table_name='{0}'".format(
                            tableName)).fetchall()
                    results['schema'] = []
                    for obj in rs:
                        results['schema'].append({
                            'field': obj[0],
                            'type': obj[1]
                        })

                if modeName == 'all' or 'data':
                    cursor.execute('select * from ' + tableName)
                    dataList = cursor.fetchall()
                    colList = cursor.description

                    results['data'] = []
                    for data in dataList:
                        dic = {}
                        for i in range(len(colList)):
                            dic[colList[i][0]] = data[i]
                        results['data'].append(dic)
                return results

            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return 'failed'

        elif self.dbPaltName == 'sqlserver':
            try:
                self.con = pymssql.connect(
                    host=self.dbLocation, user=self.dbUserName, password=self.dbUserPwd, database=dataBaseName)
                cursor = self.con.cursor()
                results = {}
                if modeName == 'all' or 'schema':
                    cursor.execute('sp_columns ' + tableName)
                    rs = cursor.fetchall()
                    results['schema'] = []
                    for obj in rs:
                        results['schema'].append({
                            'field': obj[3],
                            'type': obj[5]
                        })

                if modeName == 'all' or 'data':
                    cursor.execute('select * from ' + tableName)
                    dataList = cursor.fetchall()

                    cursor.execute('sp_columns ' + tableName)
                    colList = cursor.fetchall()

                    results['data'] = []
                    for data in dataList:
                        dic = {}
                        for i in range(len(colList)):
                            dic[colList[i][3]] = data[i]
                        results['data'].append(dic)
                return results

            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return 'failed'

    # 根据条件查询. 返回表格数据

    def filterTableData(self, jsonData, mode):
        columnstr = ', '.join(jsonData['columns'].keys())
        if columnstr:
            sql = 'select {0} from {1} where 1=1 '.format(columnstr, jsonData['tableName'])
        else:
            sql = 'select * from {0} where 1=1 '.format(jsonData['tableName'])
        mysqlstr = ''
        sqlserverstr = ''
        oraclestr = ''

        for condIt in jsonData['conditions']:
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
                    sql += 'and {0} {1} "{2}" '.format(condIt['columnName'], condType, condIt["value"])

            elif condType == "like":
                sql += "and {0} like '{1}' ".format(condIt['columnName'], condIt["value"])

            elif condType == "contains":
                sql += "and {0} like '%{1}%' ".format(condIt['columnName'], condIt["value"])

            elif condType == "notcontains":
                sql += "and {0} not like '%{1}%' ".format(condIt['columnName'], condIt["value"])

            elif condType == "isin":
                valuestr = '(' + str(condIt["value"])[1:-1] + ')'
                sql += 'and {0} in {1} '.format(condIt['columnName'], valuestr)

            elif condType == "isnotin":
                valuestr = '(' + str(condIt["value"])[1:-1] + ')'
                sql += 'and {0} not in {1} '.format(condIt['columnName'], valuestr)

            elif condType == "isnull":
                sql += 'and {0} is null '.format(condIt['columnName'])

            elif condType == "isnotnull":
                sql += 'and {0} is not null '.format(condIt['columnName'])

            elif condType == "startswith":
                sql += "and {0} like '{1}%' ".format(condIt['columnName'], condIt["value"])

            elif condType == "notstartswith":
                sql += "and {0} not like '{1}%' ".format(condIt['columnName'], condIt["value"])

            elif condType == "endswith":
                sql += "and {0} like '%{1}' ".format(condIt['columnName'], condIt["value"])

            elif condType == "notendswith":
                sql += "and {0} not like '%{1}' ".format(condIt['columnName'], condIt["value"])

        results = {}

        if self.dbPaltName == "mysql":
            try:
                self.con.select_db(jsonData['database'])
                cursor = self.con.cursor(cursorclass=MySQLdb.cursors.DictCursor)
                if mode == 'all' or mode == 'data':
                    sql += mysqlstr
                    cursor.execute(sql)
                    results['data'] = cursor.fetchall()

                if mode == 'all' or mode == 'schema':
                    results['schema'] = []
                    if columnstr:
                        for column in jsonData['columns'].items():
                            results['schema'].append('{0}:{1}'.format(column[0], column[1]["columnType"]))
                    else:
                        cursor.execute("show columns from " + jsonData['tableName'])
                        datas = cursor.fetchall()
                        for data in datas:
                            dic = {}
                            for key, value in data.items():
                                dic[key.lower()] = value
                            results['schema'].append(dic)

            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return 'failed'

        elif self.dbPaltName == 'sqlserver':
            try:
                self.con = pymssql.connect(host=self.dbLocation, user=self.dbUserName,
                                           password=self.dbUserPwd, database=jsonData['database'])
                cursor = self.con.cursor()
                if mode == 'all' or mode == 'data':
                    sql = sql[:6] + sqlserverstr + sql[6:]
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
                    sql += oraclestr
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
                    if columnstr:
                        for column in jsonData['columns'].items():
                            results['schema'].append('{0}:{1}'.format(column[0], column[1]["columnType"]))
                    else:
                        rs = cursor.execute(
                            "select column_name,data_type From all_tab_columns where table_name='{0}'".format(
                                jsonData['tableName'])).fetchall()
                        results['schema'] = []
                        for obj in rs:
                            results['schema'].append({
                                'field': obj[0],
                                'type': obj[1]
                            })

            except Exception:
                logger.error("Exception: {0}".format(sys.exc_info()))
                return 'failed'
