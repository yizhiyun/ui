
Description
-----------
This document describe the RESTful API of how to upload the file to hdfs
-------------
### 1. url: dataCollection/cloudapi/v1/upload
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data Schema:
```
if you want to set the separator:
{
    "header": <True/False>,
    "delimiter": <delimiter>,
    "quote": <quote>  # notice: add '\' before ' or ".
}
```
if you dont't set the separator:
{
    "header": <True/False>
}
```
if you want to set the path yourself:
{
    "hdfshost": <hdfshost>,
    "nnport": <nameNodePort>,
    "port": <port>,
    "rootfolder": <rootfolder>,
    "username": <username>,
    "header": <True/False>,
    "delimiter": <delimiter>,
    "quote": <quote>  # notice: add '\' before ' or ".
}
```

### 5. Request Examples:
* Example
```
if you want to set the separator:
{
    "header": False,
    "delimiter": ",",
    "quote": "\""
}
```
if you dont't set the separator:
{
    "header": False
}
```
if you want to set the path yourself:
{
    "hdfshost": "spark-master0",
    "nnport": "50070",
    "port": "9000",
    "rootfolder": "tmp/users",
    "username": "myfolder",
    "header": False,
    "delimiter": ",",
    "quote": "\""
}
```

### 6. Response Data:
* if successful, it will response as follows
```
{
    "status": "success",
    "results": {
        "data": [
            {"column": <value>, "column": <value>, "column": <value>, "column": <value>},
            {"column": <value>, "column": <value>, "column": <value>, "column": <value>},
            {"column": <value>, "column": <value>, "column": <value>, "column": <value>},
            ...
        ],
        "schema": [
            {"field": <fieldname>, "type": <fieldtype>},
            {"field": <fieldname>, "type": <fieldtype>},
            {"field": <fieldname>, "type": <fieldtype>},
            ...
        ]
    }
}
```
* if failed, it will response as follows
> { "status":"failed", "reason": ... }
