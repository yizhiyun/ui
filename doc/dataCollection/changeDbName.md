
Description
-----------
This document describe how to rename db.
-------------
### 1. Request URI: /dataCollection/changeDbName
### 2. Request Method: POST
### 3. Request Data Schema: JSON
### 4. Request Data:
```
{
    "source": <MD5>,
    "newname": <newDbName>
}
```
### 5. Request Example:
```
{
    "source": "ssrvsrvrlihelfm983y1oifmea;lcj",
    "newname": "mysql_1"
}
```
### 6. Support Format: JSON

### 7. Response Data:
* it will response as follows if successful
```
{
    "status": "success"
}
```
