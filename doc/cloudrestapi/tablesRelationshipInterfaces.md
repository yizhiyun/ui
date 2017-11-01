
Description
-----------
This document describe the store schema when operator provide the table relationships via UI.


The RESTful API Details of Verify those table relationships
-------------
### 1. Request URI: cloudapi/v1/mergetables/check
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data Schema:
```
{
    "tables": [
        {
            "database": <databaseName>, # It's the current user name if sourcetype is hdfs
            "tableName": <tableName>,
            "source": <sourceString>,   # Optional. DB source string. If sourcetype is db, it's required. Or else it's unnecessary.
            "sourcetype": <sourceType>  # Optional. "db","hdfs" or "tmptables". By default, it's db if this item doesn't exist.
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
            "expressions":{ ... },  # Please refer to getTableInfoFromCurrentUserInterfaces.md for the details.
            # If the "expressions" item exists, "trans" is invalid.
            "trans": { ... },       # Please refer to getTableInfoFromCurrentUserInterfaces.md for the details.
            <otherProperty>:<otherValue>,
            ...
        },
        ...
    ],

    "relationships": [
        {
            "fromTable": "<databaseName>.<tableName>",
            "toTable": "<databaseName>.<tableName>",
            "joinType": <connectionType>,
            "columnMap": [
                {
                    "fromCol": <columnName>,
                    "toCol": <columnName>
                },
                ...
            ]
        }
        ...
    ]

}
```
### 5. Request Examples:
```
{
    "tables": [
        {
            "source": "mysqlDB1",
            "database": "db1",
            "tableName": "table1",
            "columns": {
                "col1": {
                    "type": "number(3)",
                    "nullable": "yes",
                    "primary": "yes",
                    "unique": "yes"
                },
                "col2": {
                    "type": "VARCHAR2(64)"
                }
            },
            "conditions": [
                {
                    "type":"=",
                    "columnName": "col1",
                    "value": '1000'
                }
            ]
        },
        {
            "source": "mysqlDB2",
            "database": "db2",
            "tableName": "table2",
            "columns": {
                "col1": {
                    "type": "number(3)"
                },
                "col2": {
                    "type": "VARCHAR2(64)"
                },
                "col3": {
                    "type": "VARCHAR2(64)"
                }
            }
        }
    ],
    "relationships": [
        {
            "fromTable": "db1.table1",
            "toTable": "db2.table2",
            "joinType": "left join",
            "columnMap": [
                {
                    "fromCol": "col1",
                    "toCol": "col1"
                },
                {
                    "fromCol": "col2",
                    "toCol": "col2"
                }
            ]
        }
    ]
}
```
### 6. Response Data:
* if successful, it will response as follows
> { "status": "success",
"columns": [ "column1", "column2", ...] }
* if failed, it will response as follows
> { "status":"failed" }


The RESTful API Details of Generating New Table
-------------
### 1. Request URI: cloudapi/v1/mergetables/generate
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data Schema:
```
{
    "tables": [
        {
            "database": <databaseName>, # It's the current user name if sourcetype is hdfs
            "tableName": <tableName>,
            "source": <sourceString>,   # Optional. DB source string. If sourcetype is db, it's required. Or else it's unnecessary.
            "sourcetype": <sourceType>  # Optional. "db" or "hdfs". By default, it's db if this item doesn't exist.
            "columns": {
                <columnName1>: {
                    "columnType": <columnType>,
                    "nullable": "yes/no",
                    "primaryKey": "yes/no",
                    "uniqueKey": "yes/no",
                    "foreignKey": "no"
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
            "expressions":{ ... },  # Please refer to getTableInfoFromCurrentUserInterfaces.md for the details.
            # If the "expressions" item exists, "trans" is invalid.
            "trans": { ... },       # Please refer to getTableInfoFromCurrentUserInterfaces.md for the details.
            <otherProperty>:<otherValue>,
            ...
        },
        ...
    ],

    "relationships": [
        {
            "fromTable": "<databaseName>.<tableName>",
            "toTable": "<databaseName>.<tableName>",
            # joinTypes: "inner join", "full join", "left join" and "right join".
            "joinType": <connectionType>,
            "columnMap": [
                {
                    "fromCol": <columnName>,
                    "toCol": <columnName>
                },
                ...
            ]
        }
        ...
    ],

    "outputs":{
        "outputTableName": <tableName>,
        "columnsMapping": {
            "<databaseName>.<tableName>.<columnName>": <renamedColumnName>,
            ...
        },
        "removedColumns": ["<databaseName>.<tableName>.<columnName>", ...],
        ...
    },
    "maxchecknum": <NUM>,     # Optional. Set the max number to check the request state.
    "checkduration": <NUMRIC>   # Optional. Set how offen to check the request state.
}
```
### 5. Request Examples:
* Db sources example:
```
{
    "tables": [
        {
            "source": "mysqlDB1",
            "database": "db1",
            "tableName": "table1",
            "columns": {
                "col1": {
                    "type": "number(3)",
                    "nullable": "yes",
                    "primary": "yes",
                    "unique": "yes"
                },
                "col2": {
                    "type": "VARCHAR2(64)"
                }
            },
            "conditions": [
                {
                    "type":"=",
                    "columnName": "col1",
                    "value": '1000'
                }
            ]
        },
        {
            "source": "mysqlDB2",
            "database": "db2",
            "tableName": "table2",
            "columns": {
                "col1": {
                    "type": "number(3)"
                },
                "col2": {
                    "type": "VARCHAR2(64)"
                },
                "col3": {
                    "type": "VARCHAR2(64)"
                }
            }
        }
    ],
    "relationships": [
        {
            "fromTable": "db1.table1",
            "toTable": "db2.table2",
            "joinType": "left join",
            "columnMap": [
                {
                    "fromCol": "col1",
                    "toCol": "col1"
                },
                {
                    "fromCol": "col2",
                    "toCol": "col2"
                }
            ]
        }
    ],
    "outputs": {
        "outputTableName": "customizedTable1",
        "columnRenameMapping": {
            "db1.table1.col1": "mycol1",
            "db2.table2.col2": "mycol2"
        },
        "removedColumns": [
            "db2.table2.col3"
        ]
    }
}
```
* hdfs source example:
```
{
    "tables": [
        {
            "sourcetype": "hdfs",
            "database": "myfolder",
            "tableName": "tt1",
            "columns": {
                "idt1": {},
                "name": {},
                "score": {},
                "location": {}
            },
            "conditions": [
                {
                    "type":"=",
                    "columnName": "idt1",
                    "value": 1000
                }
            ]
        },
        {
            "sourcetype": "hdfs",
            "database": "myfolder",
            "tableName": "tt2",
            "columns": {
                "idt1": {},
                "name": {},
                "score": {}
            }
        }
    ],
    "relationships": [
        {
            "fromTable": "myfolder.tt1",
            "toTable": "myfolder.tt2",
            "joinType": "inner join",
            "columnMap": [
                {
                    "fromCol": "idt1",
                    "toCol": "idt1"
                }
            ]
        }
    ],
    "outputs": {
        "outputTableName": "ctable1",
        "columnRenameMapping": {
            "myfolder.tt2.score": "toscore"
        },
        "removedColumns": [
            "myfolder.tt2.name"
        ]
    }
}
```

### 6. Response Data:
* if successful, it will response as follows
> { "status":"success" }
* if failed, it will response as follows
> { "status":"failed", "reason": ... }



Notes
-------------
Here are the default value lists for the column attribute if you don't provide.
* type = VARCHAR2(32)
* nullable = yes
* primary = no
* unique = no
* foreign = no
