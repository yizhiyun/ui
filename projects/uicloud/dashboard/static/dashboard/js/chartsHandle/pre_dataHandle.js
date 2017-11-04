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

	var conditions = conditionFilter_record[current_cube_name]["common"].concat(conditionFilter_record[current_cube_name]["condition"]);
	if(isNeedCalculateMoM){
		conditions= 	conditions.concat(momTheDateScale);
	}else{
		conditions = conditions.concat(conditionFilter_record[current_cube_name]["dateCondition"]);
	}
	

	var checkSelectConditionDict = getSelectionCondtion(current_cube_name);
	for(var key in checkSelectConditionDict){
		var valuesArr = checkSelectConditionDict[key];
		if(valuesArr && valuesArr.length >0 && filterNotWorkArr.indexOf(key) == -1){
			var filter = {"type":"isnotin","columnName":key,"value":valuesArr};
			conditions.push(filter);
		}
	}
	if(dirllConditions && dirllConditions.length > 0){
		dimensionality_array.splice(dimensionality_array.length-1,1,dirllConditions[dirllConditions.length - 1].drillField);
		for(var i = 0;i <  dirllConditions.length;i++){
			var obj = dirllConditions[i];
			if(obj.currentField != "全部" && obj.currentValue != "全部"){
				conditions.push({"type":"=","columnName":obj.currentField,"value":obj.currentValue});
			}		
		}
	}
	
	var groupby = dimensionality_array;
	var basic_opration = ["sum(","max(","min(","avg(","count("];
	var basic_names = ["求和(","最大值(","最小值(","平均值(","计数("];
	var expressions = {};
	if(measure_name_arr.length >0){
		for (var i = 0;i < measure_name_arr.length;i++) {
			if(measure_name_arr[i] == "记录数"){
				var obj = {"alias":"计数("+measure_name_arr[i]+")","exprstr":"count("+dimensionality_array[dimensionality_array.length - 1]+")"};
				if(expressions["exprlist"]){
					expressions["exprlist"].push(obj);
				}else{
					expressions["exprlist"] = [obj];
				}
			}else{
				for(var j = 0;j < basic_opration.length;j++){
				var obj = {"alias":basic_names[j]+measure_name_arr[i]+")","exprstr":basic_opration[j]+measure_name_arr[i]+")"};
				if(expressions["exprlist"]){
					expressions["exprlist"].push(obj);
				}else{
					expressions["exprlist"] = [obj];
				}
			
				}
			}
			
			if(customCalculate[measure_name_arr[i]]){
				var obj = {"alias":customCalculate[measure_name_arr[i]]["name"],"exprstr":customCalculate[measure_name_arr[i]]["value"]}
				expressions["exprlist"].push(obj);
			}
		}

	}else{
		var obj = {"alias":"count("+groupby[0]+")","exprstr":"count("+groupby[0]+")"};
		expressions["exprlist"] = [obj];
	}
	
	if(needColumns){
		if(needColumns["notneed"]){
			for(var i =0;i < needColumns["notneed"].length;i++){
				delete trans[needColumns["notneed"][i]];
			}
		}
		if(needColumns["aggregations"]){
			trans["aggregations"] = needColumns["aggregations"];
		}
	}
	
	
	var handleDataPost = {
		"conditions":conditions,
	};
	
	if(expressions["exprlist"] && expressions["exprlist"].length > 0){
		expressions["groupby"]  = groupby;
		expressions["orderby"] = groupby;
		handleDataPost["expressions"] = expressions;
	}
	
	
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
//			console.log("startSend");
		},
		success:function(data){
			if(data.status == "success"){
				if(isNeedCalculateMoM){
					isNeedCalculateMoM = false;
					isCanShowMonCount++;
					momneedDateDidFinish();			
				}
				preAllData = data.results.data;
				recordConditon = objectDeepCopy(handleDataPost);
				handleSuccessFunction(data.results.data);
			}
		}
	});
	
}

