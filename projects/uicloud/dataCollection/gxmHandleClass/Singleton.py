import threading
from ..DataModels.PaltInfoModel import PaltInfoModel
from ..DataModels.FileModel import FileModel
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
                    cls.__instance.dataPaltForm = {"db":[],"panel":[]}
                    cls.__instance.currentDBObjIndex = 0;
            finally:
                Lock.release()

        return cls.__instance

    # 添加数据库平台信息
    def addPalt(self,palt):
        for item  in self.dataPaltForm["db"]:
            if(item.dbPaltName == palt.dbPaltName and item.dbLocation == palt.dbLocation and
               item.dbPort == palt.dbPort and item.dbUserName == palt.dbUserName and
                       item.dbUserPwd == palt.dbUserPwd):
                return
        self.dataPaltForm["db"].append(palt)
    #删除某个数据库平台
    def deletePalt(self,palt):
        for item  in self.dataPaltForm["db"]:
            if (item.dbPaltName == palt.dbPaltName and item.dbLocation == palt.dbLocation and
                        item.dbPort == palt.dbPort and item.dbUserName == palt.dbUserName and
                        item.dbUserPwd == palt.dbUserPwd):
                self.dataPaltForm["db"].remove(item)
                return

    #添加平面文件
    def addPanelFile(self,afile):
        for item  in self.dataPaltForm["panel"]:
            if(item.fileName == afile.fileName):
                return
        self.dataPaltForm["panel"].append(afile)
