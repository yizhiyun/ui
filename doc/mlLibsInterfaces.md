
Description
-----------
This document describe the RESTful API of getting mllib information, e.g. statistics, classification, regression clustering and etc.

The RESTful API Details of Getting the basic statistics.
-------------
1. Support Format: JSON
2. Request Method: POST
3. Request Data Schema:

{
    "sourcetype": <sourceType>  # "db" or "hdfs"
    "optypes": <outputTypeList>,# "count","sum","mean","median", "min","max","std","var","skew","kurt","quarter1",
                                  "quarter3","range","freq", "freqpercent","sem", "cv", "mode"

    "database": <databaseName>, # Optional. If sourcetype is db, it's required. Or else it's unnecessary.
    "tableName": <tableName>,   # Optional. If sourcetype is db, it's required. Or else it's unnecessary.
    "hdfsurl": <hdfsUrl>,       # Optional. Only valid if sourcetype is hdfs. This attribute is just for testing currently.
    "dbsource": {               # Optional. If sourcetype is db, it's required. Or else it's unnecessary.
        "dbtype": <dbType>,     # "mysql", "oracle", "sqlserver"
        "dbserver": <dbServer>, # db server IP or host
        "dbport": <dbPort>,
        "user": <user>,
        "password": <password>,
        "sid": <sid>            # Optional. If dbtype is Oracle, it's required. Or else it's unnecessary.
    },
    "columns": {                # Optional. If it's not provided, all columns will be returned.
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
    <otherProperty>:<otherValue>,
    ...
}


4. Request Examples:
4.1 Example for db
{
    "sourcetype": "db",
    "optypes": ["count","sum","mean","median", "min","max"],
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
    }
}
4.1 Example for hdfs
{
    "sourcetype": "hdfs",
    "optypes": ["count","sum","mean","median", "min","max","std","var","skew","kurt","quarter1","quarter3"],
    "database": "myfolder",
    "tableName": "AREA_DICT"
}

5. Response Data:
5.1 if successful, it will response as follows
{
    "status": "success",
    "results": {
        "freqs": {
            "count": <value>
        }
        "stats": {
            "count": <value>
        }
    }
}
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