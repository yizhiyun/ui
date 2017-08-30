
Description
-----------
This document describe the RESTful API of how to upload the csv file to hdfs
-------------
### 1. Request URI: cloudapi/v1/uploadcsv
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data Schema:
```
{
    "header": <True/False>,   # Optional. It's True by default.
    "delimiter": <delimiter>, # Optional.
    "quote": <quote>          # Optional.
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
> {"status": "success", "results": <tableList>}
* if failed, it will response as follows
> { "status":"faild", "reason": ... }



Get All Temp CSV Tables From Current User
-------------
### 1. Request URI: /cloudapi/v1/uploadedcsvs
### 2. Request Method: GET
### 3. Request Data Schema:NULL
### 4. Support Format: JSON
### 5. Response Data:
* if successful, it will response as follows
```
{
    "status": "success",
    "results": {
        <filename>: <tableList>,
        ...
    }
}
```
* if failed, it will response as follows
```
{ 
    "status": "failed",
    "reason": "Please see the logs for details."
}
```
### 6. Response Example:
If successful, it will response as follows
```
{
    "status": "success",
    "results": {
        "mycsv": [ "customizedTable1" ]
    }
}
```

Get all information about the specified file
-------------
### 1. Request URI: cloudapi/v1/uploadedcsv/<fileName>/<tableName>/['all', 'data', 'schema']
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data Schema:
NULL if you don't need to filter the data. Or else, please specify the following json format for the filter.

```
   {
       # "columns" is optional. If this item don't be given, all columns are reserved.
       "columns": {
           <columnName1>: {
               "type": <columnType>,
               "nullable": "yes/no",
               "primary": "yes/no",
               "unique": "yes/no",
               "foreign": "no"
           },
           <columnName2>: {
               ...
           },
           ...
       },
       "conditions": [
           {
               # types: ">",">=","=","<","<=","!=",'like','startswith','notstartswith',
               # 'endswith','notendswith','contains','notcontains','isin','isnotin'.
               # note: if type is 'isin' or 'isnotin', the value should be a list.
               "type":<conditionTypeValue>,
               "columnName": <columnName>,
               "value": <value>
           },
           {
               "type":"limit",
               "value": <value>
           },
           {
               "type":"isnull", # or 'isnotnull'
               "columnName": "<columnName>"
           },
           ...
       ],
       <otherProperty>:<otherValue>,
       ...
   }
```

### 5. Request Examples:
* Example
```
```

### 6. Response Data:
* As for /cloudapi/v1/getuploadedcsv/<fileName>/<tableName>/all, it will response as follows if successful
```
{
    "status": "success",
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
            {"field":<columnName1>, "mappedfield":<mappedColumnName1>, "type":<columnType1>},
            {"field":<columnName2>, "mappedfield":<mappedColumnName2>, "type":<columnType2>},
            ...
        ]
    }
}
```
* As for /cloudapi/v1/getuploadedcsv/<fileName>/<tableName>/schema, it will response as follows if successful
```
{
    "status": "success",
    "results": {
        "schema": [
            {"field":<columnName1>, "mappedfield":<mappedColumnName1>, "type":<columnType1>},
            {"field":<columnName2>, "mappedfield":<mappedColumnName2>, "type":<columnType2>},
            ...
        ]
    }
}
```
* As for /cloudapi/v1/getuploadedcsv/<fileName>/<tableName>/data, it will response as follows if successful
```
{
    "status": "success",
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
        ]
    }
}
```
* if failed, it will response as follows
```
{
    "status": "failed",
    "reason": <reason>
}
```
