
Description
-----------
This document describe the RESTful API of how to delete or rename the file from hdfs
-------------
### 1. Request URI: cloudapi/v1/handleHdfsFile/['csvfile', 'mergefile']/{fileName}
### 2. Support Format: JSON
### 3. Request Method: POST
### 4. Request Data:
* send it if you want to rename the file, else. you needn't send.
```
{
	"rename": <newname>
}
```
### 5. Response Data:
* if success. it will response as follows:
> {"status": "success"}
* if failed. it will response as follows:
> {"status": "failed", "reason": ... }
