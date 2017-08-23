
Description
-----------
This document describe how to get users' tables information from RESTful API.


Get All Tables From Current User
-------------
1. URI: /dashboard/getAllData
2. Request Method: POST
3. Request Data Schema:
3.1 if you want all data:
{
    "username": <username>
}
3.2 if you want just folder data:
{
    "username": <username>,
    "datatype": <datatype>
}
4. Request Example:
4.1 if you want all data:
{
    "username": "yzy"
}
4.2 if you want just folder data:
{
    "username": "yzy",
    "datatype": "folder"
}
5. Support Format: JSON
6. Response Data:
6.1 if you want all data:
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
                "id": <itabled>
            },
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
            },
            <tablename>: {
                "row" <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
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
                "id": <itabled>
            },
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
            },
            <tablename>: {
                "row" <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
            },
           ...
        },
        ...

    },
    ...
}
6.2 if you want just folder data:
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



Save TableInfo From Current User And Return TableInfo
-------------
1. URI: /dashboard/dashboardTableAdd
2. Request Method: POST
3. Request Data Schema:
{
    "username": <username>,
    "foldername": <foldername>,
    "row": <row>,
    "column": <column>,
    "tablename": <tablename>,
    "viewtype": <viewtype>,
    "defaultparent": <defaultparentfoldername>
}
4. Request Example:
{
    "username": "yzy",
    "foldername": "folder1",
    "row": "rowdata",
    "column": "columndata",
    "tablename": "yzydb",
    "viewtype": "typedata",
    "defaultparent": "nmnf"
}
5. Support Format: JSON
6. Response Data:
{
    "status": "ok"
}



Save Folder From Current User
-------------
1. URI: /dashboard/dashboardFolderAdd
2. Request Method: POST
3. Request Data Schema:
{
    "username": <username>,
    "foldername": <foldername>
}
4. Request Example:
{
    "username": "yzy",
    "foldername": "folder1"
}
5. Support Format: JSON
6. Response Data:
6.1 if successful, it will response as follows
{
    "status": "ok"
}
6.2 if failed, it will response as follows
{
    "status": "false",
    "reason": "the name has been used"
}



 Relevance Folder And ParentFolder From Current User
-------------
1. URI: /dashboard/RelevanceFolder
2. Request Method: POST
3. Request Data Schema:
{
    "foldername": <foldername>,
    "parentfoldername": <parentfoldername>,
    "username": <username>
}
4. Request Example:
{
    "foldername": "folder1",
    "parentfoldername": "parentfolder",
    "username": "yzy"
}
5. Support Format: JSON
6. Response Data:
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
                "id": <itabled>
            },
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
            },
            <tablename>: {
                "row" <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
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
                "id": <itabled>
            },
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
            },
            <tablename>: {
                "row" <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
            },
           ...
        },
        ...

    },
    ...
}



update Name From Current User
-------------
1. URI: /dashboard/changeViewName
2. Request Method: POST
3. Request Data Schema:
notice: if you objtype is view, oldname should be table's id!
{
    "objtype": <type>,
    "oldname": <oldname>,
    "newname": <new>
}
4. Request Example:
{
    "objtype": "view/folder/parentfolder",
    "oldname": "oldname/table's id",
    "newname": "newviewname"
}
5. Support Format: JSON
6. Response Data:
if success:
{
    "status": "ok"
}
if faild:
{
    "status": "false", 
    "reason": "this name has been used"
}



Delete Folder From Current User
-------------
1. URI: /dashboard/deleteFolder
2. Request Method: POST
3. Request Data Schema:
3.1 if datatype is parentfolder:
{
    "datatype": <foldertype>,
    "isdeleteall": <yes/no>,
    "foldername": <foldername>,
    "defaultparent": <defaultparentfoldername>,
    "username": <username>
}
3.2 if datatype is folder:
{
    "datatype": <foldertype>,
    "foldername": <foldername>,
    "username": <username>
}
3.3 if datatype is view:
{
    "datatype": "view",
    "tableid": "tableid",
    "username": "username"
}
4. Request Example:
4.1 if datatype is parentfolder
{
    "datatype": "parentfolder",
    "isdeleteall": "yes",
    "foldername": "testfolder",
    "defaultparent": "nmnf",
    "username": "yzy"
}
4.2 if datatype is folder
{
    "datatype": "folder",
    "foldername": "testfolder",
    "username": "yzy"
}
4.3 if datatype is view:
{
    "datatype": "view",
    "tableid": 333,
    "username": "yzy"
}
5. Support Format: JSON
6. Response Data:
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
                "id": <itabled>
            },
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
            },
            <tablename>: {
                "row" <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
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
                "id": <itabled>
            },
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
            },
            <tablename>: {
                "row" <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
            },
           ...
        },
        ...

    },
    ...
}



Save User's Note
-------------
1. URI: /dashboard/addNote
2. Request Method: POST
3. Request Data Schema:
3.1 if foldertype is parentfolder
{
    "note": <note>,
    "id": <tableid>,
    "username": <username>
}
4. Request Example:
4.1 if viewtype is parentfolder
{
    "note": "it's for Patients with cough",
    "id": 21,
    "username": "yzy"
}
5. Support Format: JSON
6. Response Data:
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
                "id": <itabled>
            },
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
            },
            <tablename>: {
                "row" <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
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
                "id": <itabled>
            },
            <tablename>: {
                "row": <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
            },
            <tablename>: {
                "row" <row>,
                "column": <column>,
                "username": <username>,
                "tablename": <tablename>,
                "viewtype": <viewtype>,
                "viewname": <viewname>,
                "note": <note>,
                "id": <itabled>
            },
           ...
        },
        ...

    },
    ...
}
