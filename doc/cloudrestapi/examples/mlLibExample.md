Description
-----------
Here are some examples for getting hypothesis testing.

-----------
###  T-Test: ttest_1samp
* Request:
> curl -X POST http://192.168.1.21:8000/cloudapi/v1/ml/hyptest -d @mlhytest-ttest_1samp.json --header 'Content-Type:application/json'
```
{
    "sourcetype": "hdfs",
    "inputparams": {
        "ttype": "ttest_1samp",
        "popmean": 137,
        "col_a": "M"
    },
    "database": "myfolder",
    "tableName": "UScrime"
}
```
* Result:
{"ttest_1samp": {"pvalue": [0.3948638525265914], "statistic": [0.8588736343514123]}, "normaltest": {"pvalue": 0.03607600927352905, "W": 0.9479703307151794}}

* Request:
> curl -X POST http://192.168.1.21:8000/cloudapi/v1/ml/hyptest -d @mlhytest-ttest_1samp-2.json --header 'Content-Type:application/json'
```
{
    "sourcetype": "hdfs",
    "inputparams": {
        "ttype": "ttest_1samp",
        "popmean": 14.8,
        "col_a": "PRICE"
    },
    "database": "myfolder",
    "tableName": "hospital"
}
```
* Result:
{"ttest_1samp": {"pvalue": [0.5485668921083146], "statistic": [0.5999278188422766]}, "normaltest": {"pvalue": 0.2669375905615905, "statistic": 0.006914176040106246}}


###  T-Test: ttest_ind
* Request:
> curl -X POST http://192.168.1.21:8000/cloudapi/v1/ml/hyptest -d @mlhytest-ttest_ind.json --header 'Content-Type:application/json'
```
{
    "sourcetype": "hdfs",
    "inputparams": {
        "ttype": "ttest_ind",
        "significance": 0.05,
        "col_a": "So",
        "col_b": "Prob"
    },
    "database": "myfolder",
    "tableName": "UScrime"
}
```
* Result:
```
{"ttest_ind": {"pvalue": [0.00012364897266532775], "statistic": [4.202130736875173]}, "levenetest": {"pvalue": [0.289259569789092], "statistic": [1.1500342419028733]}, "normaltest": {"pvalue": 0.017905760556459427, "W": 0.9400550723075867}}
```

* Request:
> curl -X POST http://192.168.1.21:8000/cloudapi/v1/ml/hyptest -d @mlhytest-ttest_ind_2.json --header 'Content-Type:application/json'
```
{
    "sourcetype": "hdfs",
    "inputparams": {
        "ttype": "ttest_ind",
        "significance": 0.05,
        "col_a": "CHARGE_TYPE",
        "col_b": "PRICE"
    },
    "database": "myfolder",
    "tableName": "hospital"
}
```
* Result:
```
{"ttest_ind": {"pvalue": [0.9843942822717012], "statistic": [-0.019560565561319604]}, "levenetest": {"pvalue": [0.6425526070932888], "statistic": [0.21543133947083962]}, "normaltest": {"pvalue": 0.2669375905615905, "statistic": 0.006914176040106246}}
```


###  T-Test: ttest_rel
* Request:
> curl -X POST http://192.168.1.21:8000/cloudapi/v1/ml/hyptest -d @mlhytest-ttest_rel.json --header 'Content-Type:application/json'
```
{
    "sourcetype": "hdfs",
    "inputparams": {
        "ttype": "ttest_rel",
        "col_a": "Type",
        "col_b": "uptake"
    },
    "database": "myfolder",
    "tableName": "CO2"
}
```
* Result:
```
{"levenetest": {"pvalue": [0.6807986294735209], "statistic": [0.17043992871360306]}, "ttest_rel": {"pvalue": [2.936814561809266e-14], "statistic": [11.374232636010756]}, "normaltest": {"pvalue": 0.0007907912950031459, "W": 0.9410490393638611}}
```

* Request:
> curl -X POST http://192.168.1.21:8000/cloudapi/v1/ml/hyptest -d @mlhytest-ttest_rel_2.json --header 'Content-Type:application/json'
```
{
    "sourcetype": "hdfs",
    "inputparams": {
        "ttype": "ttest_rel",
        "col_a": "SEX",
        "col_b": "PRICE"
    },
    "database": "myfolder",
    "tableName": "hospital"
}
```
* Result:
```
{"levenetest": {"pvalue": [0.4424636834280946], "statistic": [0.5899280643926232]}, "ttest_rel": {"pvalue": [0.8377269487572738], "statistic": [-0.20481169294945129]}, "normaltest": {"pvalue": 0.2669375905615905, "statistic": 0.006914176040106246}}
```


###  chi-Square Test
* Request:
> curl -X POST http://192.168.1.21:8000/cloudapi/v1/ml/hyptest -d @mlhytest-chiSqtest.json --header 'Content-Type:application/json'
```
{
    "sourcetype": "hdfs",
    "inputParams": {
        "ttype": "chiSqtest",
        "col_a": "Treatment",
        "col_b": "Improved"
    },
    "database": "myfolder",
    "tableName": "Arthritis"
}
```
* Result:
```
{"chiSqtest": {"method": "pearson", "degreesOffreedom": 2, "nullhypothesis": "the occurrence of the outcomes is statistically independent.", "pvalue": 0.0014626434089526352, "statistic": 13.055019852524108}}
```
