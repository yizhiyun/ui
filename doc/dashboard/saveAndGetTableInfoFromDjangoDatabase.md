
Description
-----------
This document describe how to get users' tables information from RESTful API.


Get All Tables From Current User
-------------
### 1. Request URI: /dashboard/getAllData
### 2. Request Method: POST
### 3. Request Data Schema:
* if you want all data:
```
{
    "username": <username>
}
```
* if you want just folder data:
```
{
    "username": <username>,
    "datatype": <datatype>
}
```
### 4. Request Example:
* if you want all data:
```
{
    "username": "yzy"
}
```
* if you want just folder data:
```
{
    "username": "yzy",
    "datatype": "folder"
}
```
### 5. Support Format: JSON
### 6. Response Data:
* if you want all data:
```
{
    <parentfoldername>: {
        <foldername>: {
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>,
                "show": <True/False>,
                "isopen": <True/False>
            },
           ...
        },
        ...

    },
    ...
}
```
* if you want just folder data:
```
{
    <parentfoldername>: [
        <foldername>,
        <foldername>,
        ...
    ],
    <parentfoldername>: [
        <foldername>,
        <foldername>,
        ...
    ],
    ...
}
```
* if failed. it should be:
> {'status': 'false', 'reason': 'Please see the detailed logs.'}



Save TableInfo From Current User And Return TableInfo
-------------
### 1. Request URI: /dashboard/dashboardTableAdd
### 2. Request Method: POST
### 3. Request Data Schema:
```
{
    "username": <username>,
    "foldername": <foldername>,
    "row": <row>,
    "column": <column>,
    "tablename": <tablename>,
    "viewtype": <viewtype>,
    "defaultparent": <defaultparentfoldername>
}
```
### 4. Request Example:
```
{
    "username": "yzy",
    "foldername": "folder1",
    "row": "rowdata",
    "column": "columndata",
    "tablename": "yzydb",
    "viewtype": "typedata",
    "defaultparent": "nmnf"
}
```
### 5. Support Format: JSON
### 6. Response Data:
```
{
    "status": "ok"
}
```
* if failed. it should be:
> {'status': 'false', 'reason': 'Please see the detailed logs.'}



Save Folder From Current User
-------------
### 1. Request URI: /dashboard/dashboardFolderAdd
### 2. Request Method: POST
### 3. Request Data Schema:
```
{
    "username": <username>,
    "foldername": <foldername>
}
```
### 4. Request Example:
```
{
    "username": "yzy",
    "foldername": "folder1"
}
```
### 5. Support Format: JSON
### 6. Response Data:
* if successful, it will response as follows
```
{
    "status": "ok"
}
```
* if failed, it will response as follows
```
{
    "status": "false",
    "reason": "the name has been used"
}
```



Add Folder to ParentFolder
-------------
### 1. Request URI: /dashboard/RelevanceFolder
### 2. Request Method: POST
### 3. Request Data Schema:
```
{
    "foldername": <foldername>,
    "parentfoldername": <parentfoldername>,
    "username": <username>
}
```
### 4. Request Example:
```
{
    "foldername": "folder1",
    "parentfoldername": "parentfolder",
    "username": "yzy"
}
```
### 5. Support Format: JSON
### 6. Response Data:
```
{
    <parentfoldername>: {
        <foldername>: {
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <viewid>,
                "show": <True/False>,
                "isopen": <True/False>
            },
           ...
        },
        ...

    },
    ...
}
```
* if failed. it should be:
> {'status': 'false', 'reason': 'Please see the detailed logs.'}



Change Name From Current User
-------------
### 1. Request URI: /dashboard/changeName
### 2. Request Method: POST
### 3. Request Data Schema:
* if you objtype is view, oldname should be view's id.
```
{
    "objtype": ["view", "folder", "parentfolder"],
    "oldname": <oldname>,
    "newname": <new>
}
```
* if you objtype is note, request schema should be this.
```
{
    "objtype": <note>,
    "note": <notedata>,
    "id": <viewid>,
    "username": <username>
}
```
### 4. Request Example:
```
{
    "objtype": "view",
    "oldname": "oldname",
    "newname": "newviewname"
}
```
### 5. Support Format: JSON
### 6. Response Data:
* if success:
```
{
    "status": "ok"
}
```
* if you objtype is note, success data should be this.
```
{
    <parentfoldername>: {
        <foldername>: {
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>,
                "show": <True/False>,
                "isopen": <True/False>
            },
           ...
        },
        ...

    },
    ...
}
```
* if name has been used:
```
{
    "status": "false", 
    "reason": "this name has been used"
}
```
* if failed. it should be:
> {'status': 'false', 'reason': 'Please see the detailed logs.'}



Delete Folder From Current User
-------------
### 1. Request URI: /dashboard/deleteFolder
### 2. Request Method: POST
### 3. Request Data Schema:
* if datatype is parentfolder and you want to delete all:
```
{
    "datatype": <foldertype>,
    "recursive": <yes/no>,
    "defaultparent": <defaultparentfoldername>,
    "username": <username>
}
```
* if datatype is parentfolder:
```
{
    "datatype": <foldertype>,
    "recursive": <yes/no>,
    "foldername": <foldername>,
    "defaultparent": <defaultparentfoldername>,
    "username": <username>
}
```
* if datatype is folder:
```
{
    "datatype": <foldertype>,
    "foldername": <foldername>,
    "username": <username>
}
```
* if datatype is view:
```
{
    "datatype": "view",
    "tableid": "tableid",
    "username": "username"
}
```
### 4. Request Example:
* if datatype is parentfolder
```
{
    "datatype": "parentfolder",
    "isdeleteall": "yes",
    "foldername": "testfolder",
    "defaultparent": "nmnf",
    "username": "yzy"
}
```
* if datatype is folder
```
{
    "datatype": "folder",
    "foldername": "testfolder",
    "username": "yzy"
}
```
* if datatype is view:
```
{
    "datatype": "view",
    "tableid": 333,
    "username": "yzy"
}
```
### 5. Support Format: JSON
### 6. Response Data:
```
{
    <parentfoldername>: {
        <foldername>: {
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>,
                "show": <True/False>,
                "isopen": <True/False>
            },
           ...
        },
        ...

    },
    ...
}
```
* if failed. it should be:
> {'status': 'false', 'reason': 'Please see the detailed logs.'}



Switch to remember User's state
-------------
### 1. Request URI: /dashboard/setSwitch
### 2. Request Method: POST
### 3. Request Data Schema:
* if switch is show and you want show all
```
{
    "switch": <show>,
    "username": <username>,
    "showall": <yes>
}
```
* if switch is show
```
{
    "id": <viewid>,
    "switch": <show>,
    "username": <username>
}
```
* if switch is isopen
```
{
    "id": <viewid>,
    "switch": <isopen>
}
```
### 4. Request Example:
```
{
    "id": 21,
    "switch": "show",
    "username": "yzy"
}
```
### 5. Support Format: JSON
### 6. Response Data:
* if switch is show
```
{
    <parentfoldername>: {
        <foldername>: {
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>,
                "show": <True/False>,
                "isopen": <True/False>
            },
           ...
        },
        ...

    },
    ...
}
```
* if switch is isopen
```
{
    "status": "ok"
}
```
* if failed. it should be:
> {'status': 'false', 'reason': 'Please see the detailed logs.'}
