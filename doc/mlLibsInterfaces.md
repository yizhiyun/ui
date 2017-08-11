
Description
-----------
This document describe the RESTful API of getting mllib information, e.g. statistics, classification, regression clustering and etc.

The RESTful API Details of Getting the basic statistics.
-------------
1. Support Format: JSON
2. Request Method: POST
3. Request Data Schema:

{
    "sourceType": <sourceType>  # "db" or "hdfs"
    "opTypes": <outputTypeList>,# "count","sum","mean","median", "min","max","std","var","skew","kurt","quarter1","quarter3","range"
    "source": <sourceName>,     # Optional. if sourceType is db, it's useless.
    "database": <databaseName>, # Optional. if sourceType is hdfs and hdfsUrl is provided, it's useless.
    "tableName": <tableName>,   # Optional. if sourceType is hdfs and hdfsUrl is provided, it's useless.
    "hdfsUrl": <hdfsUrl>,       # Optional. Only valid if sourceType is hdfs. This attribute is just for testing currently.
    "columns": {                # Optional. If it's not provided, all columns will be returned.
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
    <otherProperty>:<otherValue>,
    ...
}


4. Request Examples:
4.1 Example for db
{
    "sourceType": "db",
    "opTypes": ["count","sum","mean","median", "min","max"],
    "source": "mysqlDB1",
    "database": "db1",
    "tableName": "table1",
    "columns": {
        "col1": {
            "columnType": "number(3)",
            "nullable": "yes",
            "primaryKey": "yes",
            "uniqueKey": "yes"
        },
        "col2": {
            "columnType": "VARCHAR2(64)"
        }
    }
}
4.1 Example for hdfs
{
    "sourceType": "hdfs",
    "opTypes": ["count","sum","mean","median", "min","max","std","var","skew","kurt","quarter1","quarter3"],
    "database": "myfolder",
    "tableName": "AREA_DICT"
}

5. Response Data:
5.1 if successful, it will response as follows
{ "status": "success",
"results": {...} }
5.2 if failed, it will response as follows
{ "status":"failed", "reason": ... }


Notes
-------------

Method,      Description
"count",     Number of non-null observations
"sum",       Sum of values
"mean",      Mean of values
"median",    Arithmetic median of values
"min",       Minimum
"max",       Maximum
"std",       Bessel-corrected sample standard deviation
"var",       Unbiased variance
"skew",      Sample skewness (3rd moment)
"kurt",      Sample kurtosis (4th moment)
"quarter1",  Sample quantile (value at 25%)
"quarter3",  Sample quantile (value at 75%)
"range",     max - min
"cov",       Unbiased covariance (binary)
"corr",      Correlation (binary)