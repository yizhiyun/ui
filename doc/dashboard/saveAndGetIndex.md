
Description
-----------
This document describe how to get users' index from RESTful API.


Save IndexInfo From Current User
-------------
### 1. Request URI: /dashboard/indexAdd
### 2. Request Method: POST
### 3. Request Data Schema:
```
{
    "username": <username>,
    "row": <row>,
    "column": <column>,
    "tablename": <tablename>,
    "indextype": <type>,
    "indexname": <indexname>,
    "calculation": <calculation>,
    "indexstyle": <style>,
    "customcalculate": <customcalculate>
}

```
### 4. Request Example:
```
{
    "username": "test",
    "row": "row",
    "column": "column",
    "tablename": "MD5_tablename",
    "indextype": "type",
    "indexname": "indexname",
    "calculation": "calculation",
    "indexstyle": "style",
    "customcalculate": "customcalculate"
}
```
### 5. Support Format: JSON
### 6. Response Data:
```
{
    "status": "success"
}
```
* if failed. it should be:
> {'status': 'failed', 'reason': 'the name has been used.'}



Get indexInfo Name Or Data From UserName And TableName
-------------
### 1. Request URI: /dashboard/indexGet
### 2. Request Method: POST
### 3. Request Data Schema:
* if you want the index name list.
```
{
    "username": <username>,
    "tablename": <tablename>
}
```
* if you want the index detail info.
```
{
    "username": <username>,
    "tablename": <tablename>,
    "indexname": <indxname>
}
```
* if you want to change the index name.
```
{
    "username": <username>,
    "tablename": <tablename>,
    "indexname": <indxname>,
    "newname": <newname>
}
```
* if you want to delete the index.
```
{
    "username": <username>,
    "tablename": <tablename>,
    "indexname": <indxname>,
    "remove": <yes>
}
```
### 4. Request Example:
```
{
    "username": "test",
    "tablename": "MD5_tablename",
    "indexname": "indexname",
    "remove": "yes"
}
```
### 5. Support Format: JSON
### 6. Response Data:
* if you want the index name list.
```
{
    "status": "success",
    "indexNameList": ["index1", "index2", ...]
}
```
* if you want the index detail info.
```
{
    "status": "success",
    "data": {
    	"username": "test",
	    "row": "row",
	    "column": "column",
	    "tablename": "MD5_tablename",
	    "indextype": "type",
	    "indexname": "indexname",
	    "calculation": "calculation",
	    "indexstyle": "style",
	    "customcalculate": "customcalculate"
    }
}
```
* as for change index name and delete index.
> {'status': 'success'}
* if failed. it should be:
> {'status': 'failed', 'reason': 'there is no this index.'}
