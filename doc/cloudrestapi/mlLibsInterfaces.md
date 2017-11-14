Description
-----------
This document describe the RESTful API of getting mllib information, e.g. statistics, classification, regression clustering and etc.

The RESTful API Details of Getting the basic statistics.
-------------
### 1. Request URI: cloudapi/v1/ml/basicstats
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data Schema:
```
{
  "sourcetype": <sourceType>  # "db" or "hdfs"
  "optypes": <outputTypeList>,# "count","sum","mean","median", "min","max","std","var","skew","kurt","quarterdev",
                                "range","sem", "cv", "mode","freq", "freqpercent"

  "database": <databaseName>, # Optional. If sourcetype is db, it's required. Or else it's unnecessary.
  "tableName": <tableName>,   # Optional. If sourcetype is db, it's required. Or else it's unnecessary.
  "hdfsurl": <hdfsUrl>,       # Optional. Only valid if sourcetype is hdfs. This attribute is just for testing currently.
  "dbsource": { ... },        # Please refer to tableRelationshipInterfaces.md for the details.
  "columns": { ... },         # Please refer to tableRelationshipInterfaces.md for the details.
  "conditions": [ ... ],      # Please refer to tableRelationshipInterfaces.md for the details.
  <otherProperty>:<otherValue>,
  ...
}
```

### 5. Request Examples:
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
### 6. Response Data:
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
### 1. Request URI: cloudapi/v1/ml/hyptest
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data Schema:
```
{
  "sourcetype": <sourceType>  # "db" or "hdfs"
  "inputparams": {
    "ttype": <tTestType>,   # "ttest_1samp", "ttest_ind", "ttest_rel", "chiSqtest"
    "popmean": <popmean>,   # Optional. Expected value in null hypothesis. Required if "ttest_1samp"
    "significance": <num>,  # Optional. Significance level. Required if ttest_ind type
    "col_a": <columnName>,  # Existed column name. Note, it's category data for "ttest_ind" and "ttest_rel".
    "col_b": <columnName>   # Optional. It's required if ttype is ttest_ind, ttest_rel or chiSqtest.
  }

  "database": <databaseName>, # Optional. If sourcetype is db, it's required. Or else it's unnecessary.
  "tableName": <tableName>,   # Optional. If sourcetype is db, it's required. Or else it's unnecessary.
  "hdfsurl": <hdfsUrl>,       # Optional. Only valid if sourcetype is hdfs. This attribute is just for testing currently.
  "dbsource": { ... },        # Please refer to tableRelationshipInterfaces.md for the details.
  "columns": { ... },         # Please refer to tableRelationshipInterfaces.md for the details.
  "conditions": [ ... ],      # Please refer to tableRelationshipInterfaces.md for the details.
  <otherProperty>:<otherValue>,
  ...
}
```

### 5. Request Examples:
* Example for db
```
{
  "sourcetype": "db",
  "inputparams": {
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
  "inputparams": {
    "ttype": "ttest_ind",
    "popmean": 32,
    "col_a": "col1",
    "col_b": "col2"
  },
  "database": "myfolder",
  "tableName": "AREA_DICT"
}
```
### 6. Response Data:
* if successful, it will response as follows
```
{
  "status": "success",
  "results": ...
}
```
* if failed, it will response as follows
> { "status":"failed", "reason": ... }


The RESTful API Details of Getting the correlation analysis information.
-------------
### 1. Request URI: cloudapi/v1/ml/correlation
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data Schema:
```
{
  "sourcetype": <sourceType>  # "db" or "hdfs"
  "inputparams": {
    "corrtype": <corrType>,   # "corr", "pcorr", "cca"
    "significance": <num>,  # Optional. Significance level.
    "cols_a": <columnName>,  # Existed column name. Note, it's category data for "ttest_ind" and "ttest_rel".
    "cols_b": <columnName>   # Optional. It's required if ttype is ttest_ind, ttest_rel or chiSqtest.
  }

  "database": <databaseName>, # Optional. If sourcetype is db, it's required. Or else it's unnecessary.
  "tableName": <tableName>,   # Optional. If sourcetype is db, it's required. Or else it's unnecessary.
  "hdfsurl": <hdfsUrl>,       # Optional. Only valid if sourcetype is hdfs. This attribute is just for testing currently.
  "dbsource": { ... },        # Please refer to tableRelationshipInterfaces.md for the details.
  "columns": { ... },         # Please refer to tableRelationshipInterfaces.md for the details.
  "conditions": [ ... ],      # Please refer to tableRelationshipInterfaces.md for the details.
  <otherProperty>:<otherValue>,
  ...
}
```

### 5. Request Examples:
* Example for db
```
{
  "sourcetype": "db",
  "inputparams": {
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
  "inputparams": {
    "ttype": "ttest_ind",
    "popmean": 32,
    "col_a": "col1",
    "col_b": "col2"
  },
  "database": "myfolder",
  "tableName": "AREA_DICT"
}
```
### 6. Response Data:
* if successful, it will response as follows
```
{
  "status": "success",
  "results": ...
}
```
* if failed, it will response as follows
> { "status":"failed", "reason": ... }



The RESTful API Details of Getting the regression information.
-------------
### 1. Request URI: cloudapi/v1/ml/regression
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data Schema:
```
{
  "sourcetype": <sourceType>,  # "db" or "hdfs"
  "inputparams": {
    "rtype": <rTestType>,     # "linearreg"
    "col_x": <columnName>,    # Existed column name. Note, it's category data for "ttest_ind" and "ttest_rel".
    "col_y": <columnName>,    # Optional. It's required if ttype is ttest_ind, ttest_rel or chiSqtest.
    "polynomial": <num>       # Optional. Range from 1 to 6. It's 1 by default.
    "lineartype": <linearType># Optional. "normal", "exponential", "logarithm", "power". It's "normal" by default.
  },
  "outputparams": {           # Optional.
    "maxiter": <num>          # It's 10 by default
    "pointsnum": <num>        # It's 100 by default
  },
  "database": <databaseName>, # Optional. If sourcetype is db, it's required. Or else it's unnecessary.
  "tableName": <tableName>,   # Optional. If sourcetype is db, it's required. Or else it's unnecessary.
  "hdfsurl": <hdfsUrl>,       # Optional. Only valid if sourcetype is hdfs. This attribute is just for testing currently.
  "dbsource": { ... },        # Please refer to tableRelationshipInterfaces.md for the details.
  "columns": { ... },         # Please refer to tableRelationshipInterfaces.md for the details.
  "conditions": [ ... ],      # Please refer to tableRelationshipInterfaces.md for the details.
  <otherProperty>:<otherValue>,
  ...
}
```

### 5. Request Examples:
* Example for db
```
{
  "sourcetype": "db",
  "inputparams": {
    "rtype": "linearreg",
    "polynomial": 2,
    "col_x": "x1",
    "col_y": "y1"
  },
  "source": "mysqlDB1",
  "database": "db1",
  "tableName": "table1",
  "columns": {
    "x1": {},
    "y1": {}
  }
}
```
* Example for hdfs
```
{
  "sourcetype": "hdfs",
  "inputparams": {
    "rtype": "linearreg",
    "polynomial": 2,
    "col_x": "x1",
    "col_y": "y1"
  },
  "database": "myfolder",
  "tableName": "polynomial"
}

```
### 6. Response Data:
* if successful, it will response as follows
```
{
  "status": "success",
  "results": {
    "linearreg": {
      "coefficients": <list>,
      "intercept": <value>,
      "r2": <value>,
      "pvalues": <list>,
      "tvalues": <list>,
      "standarderrors": <list>,
      "predictlist": [
        {
          "y": <value>,
          "x": <value>
        }
      ]
    }
  }
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
