
Description
-----------
This document describe how to get users' tables information from hdfs via RESTful API.


Get All Tables From Current User
-------------
### 1. Request URI: /cloudapi/v1/tables
### 2. Request Method: GET
### 3. Request Data Schema:NULL
### 4. Support Format: JSON
### 5. Response Data:
* if successful, it will response as follows
```
{
    "status": "success",
    "results": <tableList>
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
    "results": [
        "customizedTable1",
        "customizedTable2"
    ]
}
```


Get Table From Current User Via Spark
-------------
### 1. Request URI: /cloudapi/v1/tables/{tableName}/['all','schema','data']
### 2. Request Method: POST
### 3. Request Data Schema:
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
       "trans": {
           "pretrans": [                 # Optional,
               {
                   # iterDict also has the same structure with the parent dict.
                   "col": <number> or <columnString> or <iterDict>,
                   "operations": [
                       # types: "+","-","*","/"
                       {
                           "type":<type>,
                           "col": <number> or <columnString> or <iterDict>,
                       },
                       ...
                   ],
                   "alias": <newColumnName>
                   ...
               },
               ...
           ],
           "groupby": <columnList>,
           "aggdict": {
               # aggTypes: "avg","max","min","sum","pivot"
               "column": <aggType>,
               "*": "count"               # if aggType is count, column is "*".
           },
           "aggregations": [
               {
                   # aggTypes: "avg","max","min","sum","count","approx_count_distinct"
                   "type":<aggType>,
                   "col": <column>,
                   "alias": <newName>     # Optional,
               },
               ...
           ],
           "posttrans": [                 # Optional,
               {
                   # iterDict also has the same structure with the parent dict.
                   "col": <number> or <columnString> or <iterDict>,
                   "operations": [
                       # types: "+","-","*","/"
                       {
                           "type":<type>,
                           "col": <number> or <columnString> or <iterDict>,
                       },
                       ...
                   ],
                   "alias": <newColumnName>
                   ...
               },
               ...
           ],
           "pivot": {                     # Optional
               "col": <column>,
               "values": <valueList>,     # Optional
           },
           "orderby": <columnList>,       # Optional,
       },
       <otherProperty>:<otherValue>,
       ...
   }
```
### 4. Support Format: JSON
### 5. Response Data:
* As for /cloudapi/v1/tables/{tableName}/all, it will response as follows if successful
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
            {"field":<columnName1>, "type":<columnType1>},
            {"field":<columnName2>, "type":<columnType2>},
            ...
        ]
    }
}
```
* As for /cloudapi/v1/tables/{tableName}/schema, it will response as follows if successful
```
{
    "status": "success",
    "results": {
        "schema": [
            {"field":<columnName1>, "type":<columnType1>},
            {"field":<columnName2>, "type":<columnType2>},
            ...
        ]
    }
}
```
* As for /cloudapi/v1/tables/{tableName}/data, it will response as follows if successful
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
### 6. Response Example:
* As for /cloudapi/v1/tables/{tableName}/all, it will response as follows if successful
```
{
    "status": "success",
    "results": {
        "data": [
            {
                "db1_table1_col2": "test2",
                "mycol2": "name2",
                "db2_table2_col1": 1002,
                "mycol1": 1002
            },
            {
                "db1_table1_col2": "test2",
                "mycol2": "name2",
                "db2_table2_col1": 1002,
                "mycol1": 1002
            },
            {
                "db1_table1_col2": "test0",
                "mycol2": "name1",
                "db2_table2_col1": 1000,
                "mycol1": 1000
            },
            {
                "db1_table1_col2": "test0",
                "mycol2": "name1",
                "db2_table2_col1": 1000,
                "mycol1": 1000
            }
        ],
        "schema": [
            {"field":"db1_table1_col2", "type":"StringType"},
            {"field":"mycol1", "type":"IntegerType"},
            {"field":"mycol2", "type":"StringType"},
            {"field":"db2_table2_col1", "type":"IntegerType"}
        ]
    }
}
```
* if failed, it will response as follows
```
{
    "status": "failed",
    "reason": {
        "status": "error",
        "execution_count": 0,
        "ename": "AnalysisException",
        "evalue": "u'Path does not exist: hdfs://spark-master0:9000/users/myfolder/mytable1;'",
        "traceback": [
            "Traceback (most recent call last):\n",
            "  File \"<stdin>\", line 11, in getTableSchema\n",
            "  File \"/opt/spark/python/lib/pyspark.zip/pyspark/sql/readwriter.py\", line 274, in parquet\n    return self._df(self._jreader.parquet(_to_seq(self._spark._sc, paths)))\n",
            "  File \"/opt/spark/python/lib/py4j-0.10.4-src.zip/py4j/java_gateway.py\", line 1133, in __call__\n    answer, self.gateway_client, self.target_id, self.name)\n",
            "  File \"/opt/spark/python/lib/pyspark.zip/pyspark/sql/utils.py\", line 69, in deco\n    raise AnalysisException(s.split(': ', 1)[1], stackTrace)\n",
            "AnalysisException: u'Path does not exist: hdfs://spark-master0:9000/users/myfolder/mytable1;'\n"
        ]
    }
}
```

Notes
-------------
1. Here are all column types
* StringType
* BinaryType
* BooleanType
* DateType
* TimestampType
* DecimalType
* DoubleType
* FloatType
* ByteType
* IntegerType
* LongType
* ShortType
* ArrayType
* MapType
* NullType