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
                    cls.__instance.currentDBObjIndex = None
            finally:
                Lock.release()

        return cls.__instance

    # 添加数据库平台信息

    def addPalt(self, palt, username):
        info = md5(palt.dbPaltName + palt.dbLocation + str(palt.dbPort) + palt.dbUserPwd + palt.dbUserPwd)

        if username not in self.dataPaltForm.keys():
            self.dataPaltForm[username] = {}
        if 'db' not in self.dataPaltForm[username].keys():
            self.dataPaltForm[username]['db'] = {}
        for key in self.dataPaltForm[username]['db'].keys():
            if key == info:
                return False
        self.dataPaltForm[username]['db'][info] = palt
        return True

    # 删除某个数据库平台

    def deletePalt(self, source, username):
        try:
            for item in self.dataPaltForm[username]["db"]:
                if item == source:
                    self.dataPaltForm[username]["db"].pop(item)
                    return True
                else:
                    return False
        except Exception as f:
            logger.error(f)
            return False

    # 添加平面文件

    def addPanelFile(self, afile, username):
        if username not in self.dataPaltForm.keys():
            self.dataPaltForm[username] = {}
        if 'panel' not in self.dataPaltForm[username].keys():
            self.dataPaltForm[username]['panel'] = []
        for file in self.dataPaltForm[username]['panel']:
            if file.name == afile.name:
                return False
        self.dataPaltForm[username]['panel'].append(afile)
        return True
