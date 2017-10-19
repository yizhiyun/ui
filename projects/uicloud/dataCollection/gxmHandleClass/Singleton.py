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

    # 添加数据库平台信息

    def addPalt(self, palt, username):
        info = md5(palt.dbPaltName + palt.dbLocation + str(palt.dbPort) + palt.dbUserPwd + palt.dbUserPwd)

        if username not in self.dataPaltForm.keys():
            self.dataPaltForm[username] = {}
        for key in self.dataPaltForm[username].keys():
            if key == info:
                return False
        self.dataPaltForm[username][info] = palt
        return True

    # 删除某个数据库平台

    def deletePalt(self, source, username):
        try:
            for item in self.dataPaltForm[username].keys():
                if item == source:
                    self.dataPaltForm[username].pop(item)
                    return True
                else:
                    return False
        except Exception as f:
            logger.error(f)
            return False

    def recordColType(self, username, tablename, column, coltype):
        '''
        '''
        if username not in self.colTypeForm.keys():
            self.colTypeForm[username] = {}
        if tablename not in self.colTypeForm[username].keys():
            self.colTypeForm[username][tablename] = {}
        self.colTypeForm[username][tablename][column] = coltype
        return True
