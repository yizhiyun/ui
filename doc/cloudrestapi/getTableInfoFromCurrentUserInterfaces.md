
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
* if successful, it will response as follows
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
      # types: ">",">=","==","=","<","<=","!=",'like','startswith','notstartswith',
      # 'endswith','notendswith','contains','notcontains','isin','isnotin'.
      # note: if type is 'isin' or 'isnotin', the value should be a list.
      # As for the expr item, please refer to the "operators", "unary type", "binary types" and
      # "ternary types" of the "expressions.exprlist" item.
      "type":<conditionTypeValue>,
      "columnName": <columnName> or <expr>,
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
  "expressions":{
    "exprlist": [
      # valid keywords in the expression string
      # operators: "+","-","*","/"
      # aggregate types:
      #   "approx_count_distinct", "avg", "collect_list", "collect_set",
      #   "count", "max","min", "first", "last", "sum"
      # unary type:   (The below notes provide some types' decriptions.)
      #   "abs","acos","coalesce(*cols)","concat(*cols)","cos",dayofmonth","dayofyear","exp",
      #   "factorial","from_unixtime","hour","initcap","isnan","isnull","length","log10","log1p",
      #   "log2","lower","ltrim","minute","month","quarter","reverse","rtrim",
      #   "second","sin","sqrt","tan","to_date","to_timestamp","trim","upper",
      #   "weekofyear","year"
      # binary types: (The below notes provide some types' decriptions.)
      #   "date_add(start, days)","date_format(date, format)","date_sub(start, days)","datediff(end, start)",
      #   "format_string(format, *cols)","format_number(col, d)","instr(str, substr)","split(str, pattern)"
      # ternary types: (The below notes provide some types' decriptions.)
      #   "regexp_replace(str, pattern, replacement)","substring(str, pos, len)","substring_index(str, delim, count)",
      #   "if(condition, yes_val, no_val)"
      {"alias":<columnName>, "exprstr": <expressionString>},
      ...
    ],
    "groupby": [
      <columnName>,
      {"alias":<columnName>, "exprstr": <expressionString>},
      ...
    ],
    "pivot": {                     # Optional
      "col": <column>,
      "values": <valueList>,     # Optional
    },
    "orderby": <columnList>,       # Optional,
    "postagg": [                 # Optional,
      {
        # aggTypes:
        #   "median","mode"
        "type":<aggType>,
        "col": <column> or <columnList>,
        "alias": <newName>     # Optional,
      },
      ...
    ],
    ...
  },
  # If the "expressions" item exists, "trans" is invalid.
  "trans": {
    # Optional, "append", "drop"
    # "append" means to reserve all the previous fields and append new fields.
    # "drop" means to drop all the previous fields and just use new fields.
    "transmode": <mode>,
    "pretrans": [                 # Optional,
      {
        # iterDict also has the same structure with the parent dict.
        # unarytype:
        #   "abs","acos","cos","dayofmonth","dayofyear","exp","factorial",
        #   "from_unixtime","hour","initcap","isnan","isnull","length","log10","log1p",
        #   "log2","lower","ltrim","minute","month","quarter","reverse","rtrim",
        #   "second","sin","sqrt","tan","to_date","to_timestamp","trim","upper",
        #   "weekofyear","year"
        "col": <number> or <columnString> or <iterDict>,
        "unarytype":<unaryType>,
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
        # aggTypes:
        #   "approx_count_distinct", "avg", "collect_list", "collect_set",
        #   "count", "max","min", "first", "last", "sum", "sumDistinct"
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
        "unarytype":<unaryType>,
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
  "customized": [
    {
      "col": <columnString> or <iterDict>,
      # parameters of "splitbydelim":
      #   delimter
      # parameters of "splitbyposition":
      #   [pos1, pos2, ..., posN]
      "customizedfuncs": {
           "type": <type>, "splitbydelim", "splitbyposition"
           "parameters": <list>
    },
  ]

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
      {"field":<columnName1>, "type":<columnType1>, "coltype":<coltype>},
      {"field":<columnName2>, "type":<columnType2>, "coltype":<coltype>},
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
      {"field":<columnName1>, "type":<columnType1>, "coltype":<coltype>},
      {"field":<columnName2>, "type":<columnType2>, "coltype":<coltype>},
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
      {"field":"db1_table1_col2", "type":"StringType", "coltype":"dimensionality"},
      {"field":"mycol1", "type":"IntegerType", "coltype":"measure"},
      {"field":"mycol2", "type":"StringType", "coltype":"dimensionality"},
      {"field":"db2_table2_col1", "type":"IntegerType", "coltype":"measure"}
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


Change Column Type From Current User
-------------
### 1. Request URI: /cloudapi/v1/recordCol/{tablename}
### 2. Request Method: POST
### 3. Request Data Schema:
```
{
  "column": <column>,
  "coltype": <coltype>
}
```
### 4. Support Format: JSON
### 5. Response Data:
* if successful, it will response as follows
```
{
  "status": "success"
}
```
### 6. Response Example:
* if successful, it will response as follows
```
{
  "status": "success"
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

2. If the "expression" item exists, "trans" is invalid.
3. Here are some types' descriptions.
* coalesce(*cols), Returns the first column that is not null.
* collect_list(col), Aggregate function: returns a list of objects with duplicates.
* collect_set(col), Aggregate function: returns a set of objects with duplicate elements eliminated.
* concat(*cols), Concatenates multiple input string columns together into a single string column.
* concat_ws(sep, *cols), Concatenates multiple input string columns together into a single string column, using the given separator.
* date_add(start, days), Returns the date that is days days after start
* date_format(date, format), Converts a date/timestamp/string to a value of string in the format specified by the date format given by the second argument.A pattern could be for instance dd.MM.yyyy and could return a string like ‘18.03.1993’.
* date_sub(start, days), Returns the date that is days days before start
* datediff(end, start), Returns the number of days from start to end.
* format_number(col, d),Formats the number X to a format like ‘#,–#,–#.–’, rounded to d decimal places with HALF_EVEN round mode, and returns the result as a string. E.g. format_number('a', 4)
* format_string(format, *cols), Formats the arguments in printf-style and returns the result as a string column. E.g. format_string('%d %s', a, b)
* initcap(col), Translate the first letter of each word to upper case in the sentence.
* instr(str, substr), Locate the position of the first occurrence of substr column in the given string. Returns null if either of the arguments are null.
* isnan(col), An expression that returns true iff the column is NaN.
* isnull(col), An expression that returns true iff the column is null.
* regexp_replace(str, pattern, replacement), Replace all substrings of the specified string value that match regexp with rep.
* split(str, pattern), Splits str around pattern (pattern is a regular expression). E.g. split(df.s, '[0-9]+')
* substring(str, pos, len), Substring starts at pos and is of length len when str is String type or returns the slice of byte array that starts at pos in byte and is of length len when str is Binary type
* substring_index(str, delim, count), Returns the substring from string str before count occurrences of the delimiter delim. If count is positive, everything the left of the final delimiter (counting from left) is returned. If count is negative, every to the right of the final delimiter (counting from the right) is returned. substring_index performs a case-sensitive match when searching for delim.
