
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
            # types: "limit",">",">=","=","<","<=",'!=',like','startswith','notstartswith',
            # 'endswith','notendswith','contains','notcontains','isin','isnotin'.
            # notice! if type is 'isin' or 'isnotin', the value should be a list.
            # and if you want to filter the datetype, you should add an argument "datatype": "date".
            "type": <typevalue>,
            "value": <value>,
            "columnName": <columnName>
        },
        {
            "type": <type>,
            "value": <value>,
            "columnName": <columnName>
        },
        ...
    ]
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
    ]
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
            "<columnName1>:<columnType1>",
            "<columnName2>:<columnType2>",
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
            "<columnName1>:<columnType1>",
            "<columnName2>:<columnType2>",
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

### 8. if failed, it will response as follows
```
{
    "status": "failed",
    "reason": "the mode must one of ['all', 'data', 'schema']"
}
```
