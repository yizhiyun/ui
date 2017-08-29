
Description
-----------
This document describe how to connect and add users' database , and return user's db info. panel info.
-------------
1. URI: /dataCollection/connectDataBaseHandle
2. Request Method: POST
3. Request Data Schema: JSON
4. Request Data:
{
    "dataBaseName": <dbtype>,
    "location": <dbhost>,
    "port": <dbport>,
    "dbuserName": <dbusername>,
    "dbuserPwd": <dbpassword>,
    "username": <username>
}
5. Request Example:
{
    "dataBaseName": "mysql",
    "location": "192.168.1.250",
    "port": "3306",
    "dbuserName": "root",
    "dbuserPwd": "password",
    "username": "yzy"
}

6. Support Format: JSON
7. Response Data:
7.1 it will response as follows if successful
{
    "status": "ok",
    "data": {
        "db": {
            "md5": {
                "dbtype": <dbtype>,
                "dbport": <dbport>,
                "dbuser": <dbuser>,
                "dblist": <dblist>
            },
            ...
        },
        "panel": {
            "excelName": ["sheetname", "sheetname"],
            "csvName": ["csvname"],
            ...
        }
    }
}

7.21 it will response as follows if con't connect db
{
    "status": "false",
    "reason": "can't connect db"
}

7.22 it will response as follows if the db is already has
{
    "status": "false",
    "reason": "the palt is already has"
}



-----------
This document describe return The table below the specific database.
-------------
1. URI: /dataCollection/tablesOfaDB
2. Request Method: POST
3. Request Data Schema: JSON
4. Request Data:
{
    "dbObjIndex": <dbMD5>,
    "username": <username>,
    "theDBName": <dbname>
}
5. Request Example:
{
    "dbObjIndex": "MD5",
    "username": "yzy",
    "theDBName": "db1"
}

6. Support Format: JSON
7. Response Data:
7.1 it will response as follows if successful
{
    "status": "ok",
    "data": [
        "table1", "table2"
    ]
}



-----------
This document describe return All fields under a table.
-------------
1. URI: /dataCollection/tableFileds
2. Request Method: POST
3. Request Data Schema: JSON
4. Request Data:
{
    "dbObjIndex": <dbMD5>,
    "username": <username>,
    "tableName": <tablename>
}
5. Request Example:
{
    "dbObjIndex": "MD5",
    "username": "yzy",
    "tableName": "test1"
}

6. Support Format: JSON
7. Response Data:
7.1 it will response as follows if successful
{
    "status": "ok",
    "data": [
        {
            "field": <fieldname>,
            "type": <fieldtype>
        },
        {
            "field": <fieldname>,
            "type": <fieldtype>
        },
        ...
    ]
}



-----------
This document describe return All info under a table.
-------------
1. URI: /dataCollection/detailTableData
2. Request Method: POST
3. Request Data Schema: JSON
4. Request Data:
{
    "dbinfo": <dbinfo>,
    "username": <username>
}
5. Request Example:
{
    "dbinfo": "MD5_YZYPD_?_YZYPD_tablename",
    "username": "yzy"
}

6. Support Format: JSON
7. Response Data:
7.1 it will response as follows if successful
{
    "status": "ok",
    "data": [
        {
            "name": "xiaoli",
            "age": 18
        },
        {
            "name": "jack",
            "age": 11
        },
        ...
    ]
}