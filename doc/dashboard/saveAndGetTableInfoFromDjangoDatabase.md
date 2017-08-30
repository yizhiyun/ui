
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
            <tablename>: {
                "row" <row>,
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
            <tablename>: {
                "row" <row>,
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



Relevance Folder And ParentFolder From Current User
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
                "id": <itabled>,
                "show": <True/False>,
                "isopen": <True/False>
            },
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
            <tablename>: {
                "row" <row>,
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
            <tablename>: {
                "row" <row>,
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



update Name From Current User
-------------
### 1. Request URI: /dashboard/changeViewName
### 2. Request Method: POST
### 3. Request Data Schema:
* if you objtype is view, oldname should be table's id.
```
{
    "objtype": <type>,
    "oldname": <oldname>,
    "newname": <new>
}
```
### 4. Request Example:
```
{
    "objtype": "view/folder/parentfolder",
    "oldname": "oldname/table's id",
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
* if faild:
```
{
    "status": "false", 
    "reason": "this name has been used"
}
```



Delete Folder From Current User
-------------
### 1. Request URI: /dashboard/deleteFolder
### 2. Request Method: POST
### 3. Request Data Schema:
* if datatype is parentfolder:
```
{
    "datatype": <foldertype>,
    "isdeleteall": <yes/no>,
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
            <tablename>: {
                "row" <row>,
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
            <tablename>: {
                "row" <row>,
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



Save User's Note
-------------
### 1. Request URI: /dashboard/addNote
### 2. Request Method: POST
### 3. Request Data Schema:
* if foldertype is parentfolder
```
{
    "note": <note>,
    "id": <tableid>,
    "username": <username>
}
```
### 4. Request Example:
```
{
    "note": "it's for Patients with cough",
    "id": 21,
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
            <tablename>: {
                "row" <row>,
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
            <tablename>: {
                "row" <row>,
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



remember User's Note is or not is show
-------------
### 1. Request URI: /dashboard/setShow
### 2. Request Method: POST
### 3. Request Data Schema:
* if foldertype is parentfolder
```
{
    "id": <tableid>,
    "username": <username>
}
```
### 4. Request Example:
```
{
    "id": 21,
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
            <tablename>: {
                "row" <row>,
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
            <tablename>: {
                "row" <row>,
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



remember User's view is or not is open
-------------
### 1. Request URI: /dashboard/setIsopen
### 2. Request Method: POST
### 3. Request Data Schema:
```
{
    "id": <tableid>
}
```
### 4. Request Example:
```
{
    "id": 21
}
```
### 5. Support Format: JSON
### 6. Response Data:
```
{
    "status": "ok"
}
```