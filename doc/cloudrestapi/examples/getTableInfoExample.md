
Description
-----------
Here are some examples for getting table information.

-----------
### 1. "select max(movieId),max(userId + movieId + 50) + 50 from tags group by userId" using "trans" item
> curl -X POST http://192.168.1.21:8000/cloudapi/v1/tables/tags/data -d @tableTranstest.json --header 'Content-Type:application/json'
```
{
  "trans": {
    "pretrans": [
      {
        "col": "userId"
      },
      {
        "col": "movieId"
      },
      {
        "col": "userId",
        "operations": [
          {
            "type": "+",
            "col": "movieId"
          },
          {
            "type": "+",
            "col": 50
          }
        ],
        "alias": "movieUserId"
      }
    ],
    "groupby": [
      "userId"
    ],
    "orderby": [
      "userId"
    ],
    "aggregations": [
      {
        "type": "max",
        "col": "movieId",
        "alias": "maxMovieID"
      },
      {
        "type": "max",
        "col": "movieUserId",
        "alias": "maxmovieUserId"
      }
    ],
    "posttrans": [
      {
        "col": "userId"
      },
      {
        "col": "maxMovieID"
      },
      {
        "col": "maxmovieUserId",
        "operations": [
          {
            "type": "+",
            "col": 50
          }
        ],
        "alias": "postnewcol"
      }
    ]
  }
}
```
### 2. "select max(movieId),max(userId + movieId + 50) + 50 from tags group by userId" using "trans" item
> curl -X POST http://192.168.1.21:8000/cloudapi/v1/tables/tags/data -d @tableTranstest.json --header 'Content-Type:application/json'
```
{
  "trans": {
    "pretrans": [
      {
        "col": "userId"
      },
      {
        "col": {
          "col": "timestamp"
        },
        "unarytype": "from_unixtime",
        "alias": "dtime"
      },
      {
        "col": {
          "col": {
            "col": "timestamp"
          },
          "unarytype": "from_unixtime"
        },
        "unarytype": "hour",
        "alias": "hour"
      }
    ],
    "groupby": [
      "userId"
    ],
    "orderby": [
      "userId"
    ]
  }
}
```
### 3. Examples using the "expressions" item.
Given the category table data like below.
```
+----------+---+---+
|      date|num|cat|
+----------+---+---+
|2017-07-10| 10| a2|
|2017-07-20| 31| a2|
|2017-07-16| 11| a2|
|2017-07-10| 31| a1|
|2017-07-20| 13| a1|
|2017-07-16| 21| a1|
|2017-06-10| 20| a2|
|2016-07-10| 31| a2|
|2016-07-20| 11| a2|
|2016-07-20| 19| a2|
|2016-07-10| 16| a1|
|2016-07-08| 18| a1|
+----------+---+---+
```
> curl -X POST http://192.168.1.21:8000/cloudapi/v1/tables/category/data -d @tableExpr.json --header 'Content-Type:application/json'
```
1.
{
  "conditions": [
    {
      "type": "isin",
      "columnName": "date_format(date, 'yyyyMM')",
      "value": ["201607", "201707"]
    }
  ],
  "expressions":{
    "exprlist": [
      {"alias": "cur", "exprstr": "sum(if(date_format(date, 'yyyyMM') == '201707', num, 0))"},
      {"alias": "pre", "exprstr": "sum(if(date_format(date, 'yyyyMM') == '201607', num, 0))"},
      {"alias": "percentage", "exprstr": "sum(if(date_format(date, 'yyyyMM') == '201707', num, 0)) / sum(if(date_format(date, 'yyyyMM') == '201607', num, 0))"}
    ],
    "groupby": ["cat"]
  }
}
2.
{
  "conditions": [
    {
      "type": "isin",
      "columnName": "year(date)",
      "value": [2016, 2017]
    },
    {
      "type": "==",
      "columnName": "month(date)",
      "value": 7
    }
  ],
  "expressions":{
    "exprlist": [
      {"alias": "cur", "exprstr": "sum(if(datediff(date, '2017-07-01')>0 and datediff(date, '2017-07-31')<0, num, 0))"},
      {"alias": "pre", "exprstr": "sum(if(datediff(date, '2016-07-01')>0 and datediff(date, '2016-07-31')<0, num, 0))"},
      {"alias": "percentage", "exprstr": "sum(if(datediff(date, '2017-07-01')>0 and datediff(date, '2017-07-31')<0, num, 0)) / sum(if(datediff(date, '2016-07-01')>0 and datediff(date, '2016-07-31')<0, num, 0))"}
    ],
    "groupby": ["cat"]
  }
}
3.
{
  "conditions": [
    {
      "type": "isin",
      "columnName": "year(date)",
      "value": [2016, 2017]
    },
    {
      "type": "==",
      "columnName": "quarter(date)",
      "value": 3
    }
  ],
  "expressions":{
    "exprlist": [
      {"alias": "cur", "exprstr": "sum(if(year(date)==2017 and quarter(date)==3, num, 0)), num, 0))"},
      {"alias": "pre", "exprstr": "sum(if(year(date)==2016 and quarter(date)==3, num, 0)), num, 0))"},
      {"alias": "percentage", "exprstr": "sum(if(year(date)==2017 and quarter(date)==3, num, 0)), num, 0)) / sum(if(year(date)==2016 and quarter(date)==3, num, 0)), num, 0))"}
    ],
    "groupby": ["cat"]
  }
}
4. {
  "conditions": [
    {
      "type": "isin",
      "columnName": "year(date)",
      "value": [2016, 2017]
    },
    {
      "type": "==",
      "columnName": "weekofyear(date)",
      "value": 28
    }
  ],
  "expressions":{
    "exprlist": [
      {"alias": "cur", "exprstr": "sum(if(year(date)==2017 and weekofyear(date)==28, num, 0))"},
      {"alias": "pre", "exprstr": "sum(if(year(date)==2016 and weekofyear(date)==28, num, 0))"},
      {"alias": "percentage", "exprstr": "sum(if(year(date)==2017 and weekofyear(date)==28, num, 0)) / sum(if(year(date)==2016 and weekofyear(date)==28, num, 0))"}
    ],
    "groupby": ["cat"]
  }
}
```
BTW, here is the spark test code
```
df1 = spark.createDataFrame([("2017-07-10",10,'a2'),("2017-07-20",31,'a2'),("2017-07-16",11,'a2'),
                             ("2017-07-10",31,'a1'),("2017-07-20",13,'a1'),("2017-07-16",21,'a1'),
                             ("2017-06-10",20,'a2'),("2016-07-10",31,'a2'),("2016-07-20",11,'a2'),
                             ("2016-07-20",19,'a2'),("2016-07-10",16,'a1'),("2016-07-08",18,'a1')],
                            ['date','num','cat'])

df1.groupBy('cat').agg(F.expr('sum(if(date_format(date, "yyyyMM") == "201707", num, 0))').alias('cur'),
           F.expr('sum(if(date_format(date, "yyyyMM") == "201607", num, 0))').alias('pre'),
           F.expr('sum(if(date_format(date, "yyyyMM") == "201707", num, 0)) / sum(if(date_format(date, "yyyyMM") == "201607", num, 0))').alias('percentage')
          ).show()

df1.groupBy('cat').agg(F.expr('sum(if(date_format(date, "yyyyMM") == "201707", num, 0))').alias('cur'),
           F.expr('sum(if(date_format(date, "yyyyMM") == "201706", num, 0))').alias('pre'),
           F.expr('sum(if(date_format(date, "yyyyMM") == "201707", num, 0)) / sum(if(date_format(date, "yyyyMM") == "201706", num, 0))').alias('percentage')
          ).show()

df1.groupby('cat').agg(
    F.expr('sum(if(datediff(date, "2017-07-01")>0 and datediff(date, "2017-07-31")<0, num, 0))').alias('cur'),
    F.expr('sum(if(datediff(date, "2016-07-01")>0 and datediff(date, "2016-07-31")<0, num, 0))').alias('pre'),
    (F.expr('sum(if(datediff(date, "2017-07-01")>0 and datediff(date, "2017-07-31")<0, num, 0))') /
     F.expr('sum(if(datediff(date, "2016-07-01")>0 and datediff(date, "2016-07-31")<0, num, 0))')).alias('percentage')
    ).show()

df1.groupby('cat').agg(
    F.expr('sum(if(year(date)=="2017" and quarter(date)=="3", num, 0))').alias('cur'),
    F.expr('sum(if(year(date)=="2016" and quarter(date)=="3", num, 0))').alias('pre'),
    (F.expr('sum(if(year(date)=="2017" and quarter(date)=="3", num, 0))') /
     F.expr('sum(if(year(date)=="2016" and quarter(date)=="3", num, 0))')).alias('percentage')
    ).show()

df1.groupby('cat').agg(
    F.expr('sum(if(year(date)=="2017" and weekofyear(date)=="28", num, 0))').alias('cur'),
    F.expr('sum(if(year(date)=="2016" and weekofyear(date)=="28", num, 0))').alias('pre'),
    (F.expr('sum(if(year(date)=="2017" and weekofyear(date)=="28", num, 0))') /
     F.expr('sum(if(year(date)=="2016" and weekofyear(date)=="28", num, 0))')).alias('percentage')
    ).show()
```
> curl -X POST http://192.168.1.21:8000/cloudapi/v1/tables/Arthritis/data -d @tableExpr.json --header 'Content-Type:application/json'
```
{
  "expressions":{
    "exprlist": [
       {"alias": "sumID", "exprstr": "sum(ID)"},
       {"alias": "sumAge", "exprstr": "sum(Age)"},
       {"alias": "sumIDAge", "exprstr": "sum(ID+Age)"}
    ],
    "groupby": ["Sex", {"alias": "Sexlength", "exprstr": "length(Sex)"}, "Improved","Treatment"],
    "orderby": ["Sex","Improved","Treatment"]
  }
}
```

> curl -X POST http://192.168.1.21:8000/cloudapi/v1/tables/Arthritis/data -d @tableExpr.json --header 'Content-Type:application/json'
```
{
  "expressions":{
    "exprlist": [
       {"alias": "count", "exprstr": "count(Sex)"}
    ],
    "groupby": ["Sex", "Treatment"],
    "pivot": { "col": "Improved"},
    "orderby": ["Sex"]
  }
}
```
