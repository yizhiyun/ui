import sqlite3
import os
import logging

logger = logging.getLogger(__name__)

class testDataHandler(object):

    def __init__(self, dbfile = os.path.dirname(os.path.realpath(__file__)) + '/dashboard.db'):

        self.dbfile = dbfile
    
    def getAlldata(self):
        conn = sqlite3.connect(self.dbfile)
        cur = conn.cursor()
        cur.execute("SELECT four FROM dashtemp WHERE id=18")
        data = cur.fetchall()

        cur.close()
        conn.close()

        return data;

    def getAjaxList(self):

        conn = sqlite3.connect(self.dbfile)
        cur = conn.cursor()

        cur.execute("PRAGMA table_info([dashtemp])")
        
        data1 = cur.fetchall()
        # weidu
        cur.execute("SELECT three FROM dashtemp Limit 20")
        # duliang
        dimensionality = cur.fetchall()
        
        cur.execute("SELECT three FROM dashtemp Limit 21,26;")
        
        measure = cur.fetchall()
        
        # zhibiao
        cur.execute("SELECT three FROM dashtemp limit 27,57;")
        
        index = cur.fetchall()
        # canshu
        
        cur.execute("SELECT two FROM dashtemp limit 10,45;")
        
        parameter = cur.fetchall()
        
        cur.execute("SELECT one FROM dashtemp")
        
        ceshi1 = cur.fetchall()
        
        cur.execute("SELECT two FROM dashtemp")
        
        ceshi2 = cur.fetchall()
        
        cur.execute("SELECT three FROM dashtemp")
        
        ceshi3 = cur.fetchall()

        cur.close()
        conn.close()

        dataDict = {};
        dataDict['dimensionality'] = dimensionality;
        dataDict['measure'] = measure;
        dataDict['index'] = index;
        dataDict['parameter'] = parameter;
        dataDict['ceshi1'] = ceshi1;
        dataDict['ceshi2'] = ceshi2;
        dataDict['ceshi3'] = ceshi3;
        return dataDict
