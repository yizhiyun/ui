import MySQLdb
import logging
logger = logging.getLogger(__name__)
class ConnectDataBase():
    def __init__(self,dbPaltName=None,dbLocation=None,dbPort=None,dbUserName=None,dbUserPwd=None):
        self.dbPaltName = dbPaltName
        self.dbLocation = dbLocation
        self.dbPort = int(dbPort)
        self.dbUserName = dbUserName
        self.dbUserPwd = dbUserPwd
        self.con = None
        # 所有数据库的集合
        self.dataBasesRs = [];
        # 某一个数据库下的表格集合
        self.tablesOfDataBase = {};
    # 连接到数据库
    def connectDB(self):
        # 转化数据平台 name 小写
        # print(self.dbPaltName.lower())
        if(self.dbPaltName.lower() == "mysql"):
            try:
                self.con = MySQLdb.connect(host=self.dbLocation,port=self.dbPort,user=self.dbUserName,passwd=self.dbUserPwd)
            except Exception:
                self.con = False;
    #获取当前数据库平台所有的数据库
    def fetchAllDabaBase(self):
        if(self.con):
            dataBases = self.con.query("show databases")
            rs = self.con.store_result()
            result = rs.fetch_row(0)
            self.dataBasesRs = [];

            for obj in result:
                self.dataBasesRs.append(obj[0])

            return self.dataBasesRs
        return  None

    #获取某个数据库下所有的表格
    def fetchTableBydataBaseName(self,dataBaseName):
        if(self.con and dataBaseName):
            if  self.tablesOfDataBase.__contains__(dataBaseName):
                self.con.select_db(dataBaseName)
                return  self.tablesOfDataBase[dataBaseName]
            self.con.select_db(dataBaseName)
            self.con.query("show tables")
            r = self.con.store_result()
            rs = r.fetch_row(0)
            tables = []
            for obj in rs:
                tables.append(obj[0])
            self.tablesOfDataBase[dataBaseName] = tables
            return  self.tablesOfDataBase[dataBaseName]
    # 获取某个表格下面的所有字段
    def fetchFiledsOfATable(self,tableName):
        if(self.con):
            cur = self.con.cursor(cursorclass = MySQLdb.cursors.DictCursor)
            cur.execute("show columns from " + tableName)
            rows = cur.fetchall()
            logger.warn(rows)
            return  rows
    # 获取某个表格指定字段的所有数据, filedsArr
    def fetchAllDataOfaTableByFields(self,dataBaseName,tableName):
        if(self.con):
            #  选择数据库
            self.con.select_db(dataBaseName)
            cur = self.con.cursor(cursorclass = MySQLdb.cursors.DictCursor)
            cur.execute("select  *from " + tableName)
            rows = cur.fetchall()
            return rows
