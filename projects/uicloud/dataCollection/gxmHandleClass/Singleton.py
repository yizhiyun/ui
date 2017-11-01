import threading
# from ..DataModels.PaltInfoModel import PaltInfoModel
# from ..DataModels.FileModel import FileModel
from ..gxmHandleClass.FMD5 import md5
import logging

# Get an instance of a logger
logger = logging.getLogger("dataCollection.gxmHandleClass.Singleton")
logger.setLevel(logging.DEBUG)

Lock = threading.Lock()


class Singleton(object):
    #  实例
    __instance = None

    def __init__(self):
        pass

    def __new__(cls, *args, **kwargs):
        if not cls.__instance:
            try:
                Lock.acquire()
                # double check
                if not cls.__instance:
                    cls.__instance = super(Singleton, cls).__new__(cls, *args, **kwargs)
                    cls.__instance.dataPaltForm = {}
                    cls.__instance.colTypeForm = {}
                    cls.__instance.currentDBObjIndex = None
            finally:
                Lock.release()

        return cls.__instance

    def addPalt(self, palt, username):
        '''
        添加数据库平台信息
        '''
        info = md5(palt.dbPaltName + palt.dbLocation + str(palt.dbPort) + palt.dbUserPwd + palt.dbUserPwd)

        if username not in self.dataPaltForm.keys():
            self.dataPaltForm[username] = {}
        for key in self.dataPaltForm[username].keys():
            if key == info:
                return False
        self.dataPaltForm[username][info] = palt
        return True

    def recordColType(self, username, tablename, column, coltype):
        '''
        记录构建后表的维度或者度量
        '''
        if username not in self.colTypeForm.keys():
            self.colTypeForm[username] = {}
        if tablename not in self.colTypeForm[username].keys():
            self.colTypeForm[username][tablename] = {}
        self.colTypeForm[username][tablename][column] = coltype
        return True

    def deleteTempSplit(self, username, tables=None):
        '''
        删除表格拆分后记录的被拆分字段
        '''
        if username not in self.dataPaltForm.keys():
            logger.error('{0} has not connected to any database'.format(username))
            return False

        if not tables:
            for key, value in self.dataPaltForm[username].items():
                value.list.clear()
        else:
            for table in tables:
                dbObjIndex = table['source']
                if dbObjIndex not in self.dataPaltForm[username].keys():
                    logger.error('This source is not yet connected')
                    return False

                dataBaseObj = self.dataPaltForm[username][dbObjIndex]
                coldickey = table['coldickey'].replace('_YZYPD_', '_')
                if coldickey in dataBaseObj.list.keys():
                    dataBaseObj.list[coldickey].clear()
        return True

    def deletePalt(self, username, index=None):
        '''
        删除用户连接数据库串
        '''
        if username not in self.dataPaltForm.keys():
            logger.error('{0} has not connected to any database'.format(username))
            return False

        if not index:
            for key, value in self.dataPaltForm[username].items():
                try:
                    value.con.close()
                except Exception:
                    pass
            self.dataPaltForm[username].clear()
        else:
            if index not in Singleton().dataPaltForm[username].keys():
                logger.error('This source is not yet connected')
                return False
            dataBaseObj = Singleton().dataPaltForm[username][index]
            try:
                dataBaseObj.con.close()
            except Exception:
                pass
            Singleton().dataPaltForm[username].pop(index)
        return True


def judgeConn(conn):
    '''
    判断conn是否还活着
    '''
    try:
        conn.commit()
        return True

    except Exception:
        return False
