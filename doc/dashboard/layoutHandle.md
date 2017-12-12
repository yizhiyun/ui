
Description
-----------
This document describe how to handle users' layout from RESTful API.

-------------
### 1. Request URI: /dashboard/layoutHandle
### 2. Request Method: POST
### 3. Request Data Schema:
* if status is add.
```
{
    "statu": <add/remove/change/search>,
    "tablename": <tableName>,
    "structure": <structure>
}
```
* elif status is remove.
```
{
    "statu": <add/remove/change/search>,
    "id": <id>
}
```
* elif status is change.
```
{
    "statu": <add/remove/change/search>,
    "structure": <structure>,
    "id": <id>
}
```
* elif status is search.
```
{
    "statu": <add/remove/change/search>,
    "tablename": <tableName>
}
```
### 4. Request Example:
```
{
    "statu": "remove",
    "id": 12
}
```
### 5. Support Format: JSON
### 6. Response Data:
* if successful, it will response as follows
```
{
    "status": "success",
    "id": 12, # if add.
    "data": [ 
		{
			"id": 12,
			"structure": "structure"
		}
		...
    ]
}
```
* if failed, it will response as follows
```
{
    "status": "failed",
    "reason": ...
}
```
