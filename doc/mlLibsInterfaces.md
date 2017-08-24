
Description
-----------
This document describe the RESTful API of getting mllib information, e.g. statistics, classification, regression clustering and etc.

The RESTful API Details of Getting the basic statistics.
-------------
### 1. Support Format: JSON
### 2. Request Method: POST
### 3. Request Data Schema:
```
{
    "sourcetype": <sourceType>  # "db" or "hdfs"
    "optypes": <outputTypeList>,# "count","sum","mean","median", "min","max","std","var","skew","kurt","quarterdev",
                                  "range","sem", "cv", "mode","freq", "freqpercent"

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
    "conditions": [             # Optional. If it's not provided, all columns will be returned.
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

### 4. Request Examples:
* Example for db
```
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
```
* Example for hdfs
```
{
    "sourcetype": "hdfs",
    "optypes": ["count","sum","mean","median", "min","max","std","var","skew","kurt","quarterdev"],
    "database": "myfolder",
    "tableName": "AREA_DICT"
}
```
### 5. Response Data:
* if successful, it will response as follows
```
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
```
* if failed, it will response as follows
> { "status":"failed", "reason": ... }



The RESTful API Details of Getting the hypothesis testing information.
-------------
### 1. Support Format: JSON
### 2. Request Method: POST
### 3. Request Data Schema:
```
{
    "sourcetype": <sourceType>  # "db" or "hdfs"
    "inputParams": {
        "ttype": <tTestType>,   # "ttest_1samp", "ttest_ind", "ttest_rel", "chiSqtest"
        "popmean": <popmean>,   # expected value in null hypothesis
        "col_a": <columnName>,  # Existed column name
        "col_b": <columnName>   # Optional. It's required if ttype is ttest_ind, ttest_rel or chiSqtest.
    }

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
    "conditions": [             # Optional. If it's not provided, all columns will be returned.
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

### 4. Request Examples:
* Example for db
```
{
    "sourcetype": "db",
    "inputParams": {
        "ttype": "ttest_ind",
        "popmean": 32,
        "col_a": "col1",
        "col_b": "col2
    }
    "source": "mysqlDB1",
    "database": "db1",
    "tableName": "table1",
    "columns": {
        "col1": {},
        "col2": {}
    }
}
```
* Example for hdfs
```
{
    "sourcetype": "hdfs",
    "inputParams": {
        "ttype": "ttest_ind",
        "popmean": 32,
        "col_a": "col1",
        "col_b": "col2
    }
    "database": "myfolder",
    "tableName": "AREA_DICT"
}
```
### 5. Response Data:
* if successful, it will response as follows
```
{
    "status": "success",
    "results": ...
}
```
* if failed, it will response as follows
> { "status":"failed", "reason": ... }


Notes
-------------

Method        | Description
------------- | -------------
"count"       | Number of non-null observations
"sum"         | Sum of values
"mean"        | Mean of values
"median"      | Arithmetic median of values
"min"         | Minimum
"max"         | Maximum
"std"         | Bessel-corrected sample standard deviation
"var"         | Unbiased variance
"skew"        | Sample skewness (3rd moment)
"kurt"        | Sample kurtosis (4th moment)
"quarterdev"  | Sample quantile (value at 75% - value at 25%)
"range"       | The value of max - min
"sem"         | Unbiased standard error of the mean
"cv"          | Coefficient of Variation(std/mean)
"mode"        | The mode(s) for numeric type
"freq"        | Frequency
"freqpercent" | Frequency percentage
"cov"         | Unbiased covariance (binary)
"corr"        | Correlation (binary)


Method        | Description
------------- | -------------
"ttest_1samp" | Calculates the T-test for the mean of ONE group of scores.
"ttest_ind"   | Calculates the T-test for the means of two independent samples of scores.
"ttest_rel"   | Calculates the T-test on TWO RELATED samples of scores, a and b.
"chiSqtest"   | The null hypothesis is that the occurrence of the outcomes is statistically independent.
