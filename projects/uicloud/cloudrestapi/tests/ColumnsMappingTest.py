from django.test import TestCase


class ColumnsMappingTest(TestCase):
    """ Test module for Puppy model """

    def setUp(self):
        pass
    def testOutputColumns(self):
        pass
    def testExecuteSpark(self):
        requestData = '''
        {
            "tables": [
                {
                    "source": "mysqlDB1",
                    "database": "db1",
                    "tableName": "table1",
                    "columns": {
                        "col1": {
                            "columnType": "number(3)",
                            "nullable": "yes",
                            "primaryKey": "yes",
                            "uniqueKey": "yes"
                        },
                        "col2": {
                            "columnType": "VARCHAR2(64)"
                        }
                    }
                },
                {
                    "source": "mysqlDB2",
                    "database": "db2",
                    "tableName": "table2",
                    "columns": {
                        "col1": {
                            "columnType": "number(3)"
                        },
                        "col2": {
                            "columnType": "VARCHAR2(64)"
                        },
                        "col3": {
                            "columnType": "VARCHAR2(64)"
                        }
                    }
                }
            ],
            "relationships": [
                {
                    "fromTable": "db1.table1",
                    "toTable": "db2.table2",
                    "joinType": "left join",
                    "columnMap": [
                        {
                            "fromCol": "col1",
                            "toCol": "col1"
                        },
                        {
                            "fromCol": "col2",
                            "toCol": "col2"
                        }
                    ]
                }
            ],
            "outputs": {
                "outputTableName": "customizedTable1",
                "columnRenameMapping": {
                    "db1.table1.col1": "mycol1",
                    "db2.table2.col2": "mycol2"
                },
                "removedColumns": [
                    "db2.table2.col3"
                ]
            }
        }
        '''

        

