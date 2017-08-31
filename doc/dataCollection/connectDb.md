
Description
-----------
This document describe how to connect and add users' database.
-------------
### 1. Request URI: /dataCollection/connectDataBaseHandle
### 2. Request Method: POST
### 3. Request Data Schema: JSON
### 4. Request Data:
```
{
    "dataBaseName": <dbtype>,
    "location": <dbhost>,
    "port": <dbport>,
    "dbuserName": <dbusername>,
    "dbuserPwd": <dbpassword>
}
```
### 5. Request Example:
```
{
    "dataBaseName": "mysql",
    "location": "192.168.1.250",
    "port": "3306",
    "dbuserName": "root",
    "dbuserPwd": "password"
}
```
### 6. Support Format: JSON

### 7. Response Data:
* it will response as follows if successful
> {"status": "success"}
* it will response as follows if con't connect db
> {"status": "failed", "reason": "can't connect db"}
* it will response as follows if the db is already has
> {"status": "failed", "reason": "the palt is already has"}



-----------
This document describe return all database of a palt.
-------------
### 1. Request URI: /dataCollection/showAllDbOfPalt
### 2. Request Method: POST
### 3. Request Data Schema: NULL
### 4. Support Format: JSON
### 5. Response Data:
* it will response as follows if successful
```
{
    "status": "success",
    "results": {
        "md5": {
            "dbtype": <dbtype>,
            "dbport": <dbport>,
            "dbuser": <dbuser>,
            "dblist": <dblist>
        },
        ...
    }
}
```
* it will response as follows if con't connect db
> {"status": "failed", "reason": "can't connect db"}
* it will response as follows if search failed
> {"status": "failed", "reason": "Please see the detailed logs."}



-----------
This document describe return The table below the specific database.
-------------
### 1. Request URI: /dataCollection/tablesOfaDB
### 2. Request Method: POST
### 3. Request Data Schema: JSON
### 4. Request Data:
```
{
    "dbObjIndex": <dbMD5>,
    "theDBName": <dbname>
}
```
### 5. Request Example:
```
{
    "dbObjIndex": "MD5",
    "theDBName": "db1"
}
```
### 6. Support Format: JSON
### 7. Response Data:
* it will response as follows if successful
```
{
    "status": "success",
    "data": [
        "table1", "table2"
    ]
}
```
* it will response as follows if con't connect db
> {"status": "failed", "reason": "can't connect db"}
* it will response as follows if search failed
> {"status": "failed", "reason": "Please see the detailed logs."}
