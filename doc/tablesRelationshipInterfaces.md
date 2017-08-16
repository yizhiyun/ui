
Description
-----------
This document describe the store schema when operator provide the table relationships via UI.


The RESTful API Details of Verify those table relationships
-------------
1. Support Format: JSON
2. Request Method: POST
3. Request Data Schema:

{
    "tables": [
        {
            "source": <sourceName or connectString>,
            "database": <databaseName>,
            "tableName": <tableName>,
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

4. Request Examples:
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

5. Response Data: 
5.1 if successful, it will response as follows
{ "status": "success", 
"columns": [ "column1", "column2", ...] }
5.2 if failed, it will response as follows
{ "status":"failed" }


The RESTful API Details of Generating New Table
-------------
1. Support Format: JSON
2. Request Method: POST
3. Request Data Schema:

{
    "tables": [
        {
            "source": <sourceName or connectString>,
            "database": <databaseName>,
            "tableName": <tableName>,
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
    }
}

4. Request Examples:
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

5. Response Data:
5.1 if successful, it will response as follows
{ "status":"success" }
5.2 if failed, it will response as follows
{ "status":"failed" }



Notes
-------------
Here are the default value lists for the column attribute if you don't provide.
* columnType = VARCHAR2(32)
* nullable = yes
* primaryKey = no
* uniqueKey = no
* foreignKey = no
