
Description
-----------
This document describe the RESTful API of how to upload the file to hdfs
-------------
### 1. url: dataCollection/cloudapi/v1/upload
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data Schema:
```
{
    "header": <True/False>,
    "delimiter": <delimiter>,
    "quote": <quote>  # notice: add '\' before ' or ".
}
```

### 5. Request Examples:
* Example
```
{
    "header": False,
    "delimiter": ",",
    "quote": "\""
}
```

### 6. Response Data:
* if successful, it will response as follows
```
{
    "status": "ok",
    "data": {
        "db": {
            "md5aefaekfnaeaeu": {
                "dbtype": "mysql",
                "dbport": "3306",
                "dbuser": "yzy",
                "dblist": ["django", "yzy", "test"]
            }
        },
        "panel": {
            "终极测试.csv": [
                "终极测试.csv"
            ],
            "zaq.csv": [
                "zaq.csv"
            ],
            "your_csv.csv": [
                "your_csv.csv"
            ]
        }
    }
}
```
* if failed, it will response as follows
> { "status":"faild", "reason": ... }



Returns all information about the specified file
-------------
### 1. url: dataCollection/cloudapi/v1/getPanel
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data Schema:
```
{
    "username": <username>,
    "filename": <filename>
}
```

### 5. Request Examples:
* Example
```
{
    "username": "myfolder",
    "filename": "zaq.csv"
}
```

### 6. Response Data:
* if successful, it will response as follows
```
{
    "status": "ok",
    "results": {
        "data": [
            {
                <columnName1>: <column1Value1>,
                <columnName2>: <column2Value1>,
                ...
            },
            {
                <columnName1>: <column1Value2>,
                <columnName2>: <column2Value2>,
                ...
            },
            ...
        ],
        "schema": [
            {"field":<columnName1>, "type":<columnType1>},
            {"field":<columnName2>, "type":<columnType2>},
            ...
        ]
    }
}
```
* if failed, it will response as follows
> { "status":"failed", "reason": ... }