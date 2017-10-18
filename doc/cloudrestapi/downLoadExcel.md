
Description
-----------
This document describe the RESTful API of how to down load the excel file from hdfs

Upload The Specified CSV/XLS/XLSX File
-------------
### 1. Request URI: cloudapi/v1/downLoadExcel/<tablename>
### 2. Support Format: JSON
### 3. Request Method: GET
### 4. Response Data:
* if successful, you will download this file as excel
* if failed, it will response as follows
> { "status":"faild", "reason": ... }
