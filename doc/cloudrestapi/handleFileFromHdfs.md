
Description
-----------
This document describe the RESTful API of how to delete or rename the file from hdfs
-------------
### 1. Request URI: cloudapi/v1/handleHdfsFile/{fileName}
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data:
* if you want to delete the file.
```
{
	"filesource": <uploaded/generated>,
	"method": "delete"
}
```
* elif you want to rename the file.
```
{
	"filesource": <uploaded/generated>,
	"method": "rename",
	"newname": <newname>
}
```
### 5. Response Data:
* if success. it will response as follows:
> {"status": "success"}
* if failed. it will response as follows:
> {"status": "failed", "reason": ... }



-----------
This document describe the RESTful API of how to check the file's view or file's index from hdfs
-------------
### 1. Request URI: cloudapi/v1/checkGeneratedFile/{fileName}
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Response Data:
* if success. it will response as follows:
> {'exist': 'yes'}