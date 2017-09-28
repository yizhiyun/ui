// 维度和数据处理
// 数组排序
Array.prototype.max = function(){ 
return Math.max.apply({},this); 
} 
Array.prototype.min = function(){ 
return Math.min.apply({},this); 
}
Array.prototype.XMsort = function(propertyNameArray){
		
	function createComparisonFunction(obj1,obj2){

		for (var i = 0; i < propertyNameArray.length;i++) {
			var value1 = obj1[propertyNameArray[i].split(":")[0]];
			var value2 = obj2[propertyNameArray[i].split(":")[0]];
			if (value1.localeCompare(value2) == 1) {
				return -1;
			}else if (value1.localeCompare(value2) == -1) {
				return 1;
			}else{
				continue;
			}
		}
		return 0;
	}
	this.sort(createComparisonFunction);
}
var customCalculate = {}
var preAllData = null;
var recordConditon = null;
// needColumns暂时未用到
function measure_Hanlde(dimensionality_array,measure_name_arr,needColumns,handleSuccessFunction){
	var filterNotWorkArr = getColumnFilterNotWorkedColumns(current_cube_name);
	getCurrentTableFilterData(current_cube_name,filterNotWorkArr);
	conditions = conditionFilter_record[current_cube_name]["common"].concat(conditionFilter_record[current_cube_name]["condition"]);
	var checkSelectConditionDict = getSelectionCondtion(current_cube_name);
	for(var key in checkSelectConditionDict){
		var valuesArr = checkSelectConditionDict[key];
		if(valuesArr && valuesArr.length >0 && filterNotWorkArr.indexOf(key) == -1){
			var filter = {"type":"isnotin","columnName":key,"value":valuesArr};
			conditions.push(filter);
		}
	}
	var groupby = dimensionality_array;
	var aggregations = [];
	var basic_opration = ["sum","max","min","avg"];
	if(measure_name_arr.length >0){
		for (var i = 0;i < measure_name_arr.length;i++) {
			for(var j = 0;j < basic_opration.length;j++){
				var obj = {
					"type":basic_opration[j],
					"col":measure_name_arr[i]
				}
				aggregations.push(obj);
			}	
		}
	}else{
		var obj = {
			"type":"first",
			"col":groupby[0]
		}
		aggregations.push(obj);
	}
	
	
	var trans = {
		"groupby":groupby,
		"aggregations":aggregations,
		"orderby":groupby
	};
	var handleDataPost = {
		"conditions":conditions,
		"trans":trans,
	};
	
	if(equalCompare(recordConditon,handleDataPost) && preAllData){
		handleSuccessFunction(preAllData);
		return;
	}

	$.ajax({
		url:"/cloudapi/v1/tables/" +current_cube_name+"/data",
		type:"post",
		dataType:"json",
		contentType: "application/json; charset=utf-8",
		async: true,
		data:JSON.stringify(handleDataPost),
		beforeSend:function(){
			console.log("startSend");
		},
		success:function(data){
			if(data.status == "success"){
				preAllData = data.results.data;
				recordConditon = objectDeepCopy(handleDataPost);
				handleSuccessFunction(data.results.data);
			}
		}
	});
	
}
