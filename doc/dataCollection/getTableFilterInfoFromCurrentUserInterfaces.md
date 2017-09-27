
Description
-----------
This document describe how to get users' tables filter information.
-------------
### 1. Request URI: /dataCollection/filterTable/['all','schema','data']
### 2. Request Method: POST
### 3. Request Data Schema: JSON
### 4. Request Data:
```
{
    # you can send "maxrowcount" if you want to set the number of rows returned. else. you needn't send
    "maxrowcount": <number of rows returned>,
    "source": <sourceName or connectString>,
    "database": <databasename>,
    "tableName": <tablename>,
    "columns": {
                <columnName1>: {
                    "columnType": <columnType>,
                    ...
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
    # handleCol if you want to split column, if not. you don't need to send it
    "handleCol":
        {
            "colname": <colname>,
            "method": <split/limit>,
            "cutsymbol": <cutsymbol>
        }
    
}
```
### 5. Request Example:
```
{
    "source": "mysqlDB1",
    "database": "db1",
    "tableName": "table1",
    "columns": {
                "col1": {
                    "columnType": "VARCHAR2(64)"
                },
                "col2": {
                    "columnType": "number(3)"
                }
            },
    "conditions": [
        {
            "type": "limit",
            "value": 5
        },
        {
            "type": ">",
            "value": 1,
            "columnName": "col1"
        },
        {
            "type": ">=",
            "value": "2012-01-03",
            "columnName": "col1",
            "datatype": "date"
        }
    ],
    "handleCol":
        {
            "colname": "table1col",
            "method": "limit",
            "cutsymbol": [2,5]
        }

}
```
### 6. Support Format: JSON
### 7. Response Data:
* As for /dataCollection/filterTable/all, it will response as follows if successful
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
            <columnName1>:<columnType1>,
            <columnName2>:<columnType2>,
            ...
        ]
    }
}
```
* As for /dataCollection/filterTable/schema, it will response as follows if successful
```
{
    "status": "success",
    "results": {
        "schema": [
            <columnName1>:<columnType1>,
            <columnName2>:<columnType2>,
            ...
        ]
    }
}
```
* As for /dataCollection/filterTable/data, it will response as follows if successful
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
* it will response as follows if failed
```
{
    "status": "failed",
    "reason": "the mode must one of ['all', 'data', 'schema']"
}
```
* it will response as follows if con't connect db
> {"status": "failed", "reason": "can't connect db"}
* it will response as follows if search failed
> {"status": "failed", "reason": "Please see the detailed logs."}



-----------
This document describe return The table below the specific database.
-------------
### 1. Request URI: /dataCollection/deleteTempCol
### 2. Request Method: POST
### 3. Request Data Schema: JSON
### 4. Request Data:
```
{
    "tables": [
        {
            "source": <MD5>,
            "coldickey": <db_table>
        }
        ...
    ]
}
```
### 5. Request Example:
```
{
    "tables": [
        {
            "source": "1fd70ca1e56f040006a2e5b445a4196c",
            "coldickey": "db1_table1"
        }
        ...
    ]
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