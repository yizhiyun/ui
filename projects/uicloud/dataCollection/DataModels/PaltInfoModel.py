class PaltInfoModel(object):

    def __init__(self,paltName,location,port,userName,userPwd,baseList):
        #  数据库平台的名字
        self.paltName =paltName
        self.location = location
        self.port = port
        self.userName = userName
        self.userPwd = userPwd
        #数据库平台的数据库信息
        self.baseList = baseList
