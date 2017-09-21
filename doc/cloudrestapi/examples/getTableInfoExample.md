
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
