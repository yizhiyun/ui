
Description
-----------
This document describe how to judge Icon.
-------------
### 1. Request URI: /dataCollection/judgeIcon
### 2. Request Method: POST
### 3. Request Data Schema: JSON
### 4. Request Data:
```
{
    "dashusername": <dashboardUserName>
}
```
### 5. Request Example:
```
{
    "dashusername": "liuyue"
}
```
### 6. Support Format: JSON

### 7. Response Data:
* it will response as follows if successful
```
{
    "status": "success",
    "results": {
    	"constructview": 1,
    	"dashboardview": 1,
    	"statementview": 0
    }
}
```
