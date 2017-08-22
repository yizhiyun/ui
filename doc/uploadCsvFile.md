
Description
-----------
This document describe the RESTful API of how to upload the file to hdfs
-------------
### 1. Support Format: JSON
### 2. Request Method: POST
### 3. Request Data Schema:
```
{
    "hdfshost": <hdfshost>,
    "nnport": <nameNodePort>,
    "port": <port>,
    "rootfolder": <rootfolder>,
    "username": <username>,
    "header": <True/False>
}
```

### 4. Request Examples:
* Example
```
{
    "hdfshost": "spark-master0",
    "nnport": "50070",
    "port": "9000",
    "rootfolder": "tmp/users",
    "username": "myfolder",
    "header": True
}
```

### 5. Response Data:
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
