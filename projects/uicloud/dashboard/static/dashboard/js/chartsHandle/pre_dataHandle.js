// 维度和数据处理
// 数组排序
Array.prototype.max = function(){ 
return Math.max.apply({},this) 
} 
Array.prototype.min = function(){ 
return Math.min.apply({},this) 
} 
Array.prototype.XMsort = function(propertyNameArray){
		
	function createComparisonFunction(obj1,obj2){
		for (var i = 0; i < propertyNameArray.length;i++) {
			var value1 = obj1[propertyNameArray[i].split(":")[0]];
			var value2 = obj2[propertyNameArray[i].split(":")[0]];
			if (value1 > value2) {
				return true;
			}else if (value1 <  value2) {
				return false;
			}else{
				continue;
			}
		}		
		return true;
	}
	this.sort(createComparisonFunction);
}

// 给定维度，处理度量的计算，目前做的是求和运算
function measure_Hanlde(measure_name_arr,pop_last_dimensionality){
	var row_filter_condition = [];
	var column_filter_condition = [];
	for (var i = 0;i < drag_row_column_data["row"]["dimensionality"].length;i++) {
		row_filter_condition.push(drag_row_column_data["row"]["dimensionality"][i].split(":")[0]);
	}
	for (var i = 0;i < drag_row_column_data["column"]["dimensionality"].length;i++) {
		column_filter_condition.push(drag_row_column_data["column"]["dimensionality"][i].split(":")[0]);
	}
	if (pop_last_dimensionality == true) {
		if (column_filter_condition.length > 0) {
			column_filter_condition.pop();
		}else{
			row_filter_condition.pop();
		}
	}
		
	var needShowData = {};
	for (var i = 0;i < current_data["data"].length;i++) {
		var theData = current_data["data"][i];
		var key = "";
		if (row_filter_condition.length > 0) {
			for (var j = 0;j < row_filter_condition.length;j++) {
			key += row_filter_condition[j] + "_equal_"+theData[row_filter_condition[j]]+"_YZY_";
			}
		}
		
		if (column_filter_condition.length > 0) {
			key += "_needseprate_"
			for (var j = 0;j < column_filter_condition.length;j++) {
			key += column_filter_condition[j] + "_equal_"+theData[column_filter_condition[j]]+"_YZY_";
			}
		}	
		if (needShowData[key]) {
			for (var k = 0;k < measure_name_arr.length;k++ ) {
				needShowData[key][measure_name_arr[k]]["allValue"].push(Number(theData[measure_name_arr[k]]));
			}
			
		}else{
			needShowData[key] = {};
			for (var k = 0;k < measure_name_arr.length;k++ ) {
				needShowData[key][measure_name_arr[k]] = {};
				needShowData[key][measure_name_arr[k]]["allValue"] = [];
				needShowData[key][measure_name_arr[k]]["allValue"].push(Number(theData[measure_name_arr[k]]));
			}	
		}	
	}

	for(var key in needShowData){
		var data = needShowData[key];
		for (var measureName in data) {
			var sum = eval(data[measureName]["allValue"].join("+"));
			data[measureName]["sum"] = sum;  // 总值
			data[measureName]["average"] = (sum / data[measureName]["allValue"].length).toFixed(2); // 平均值
			data[measureName]["min"] = data[measureName]["allValue"].min();
			data[measureName]["max"] = data[measureName]["allValue"].max();
		}
		
	}
	return needShowData;
}
