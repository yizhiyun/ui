var numberColumn_needValueInfo = {}; // 某个表格的数值类型列，需要的一些数值
var copyCurrentTableData = null; // 对当前 table 数据的一份拷贝
// fieldtype 为数字 numberType 、日期、dateType 俩种类型
function dataHandleWork(tableInfo,field,fieldtype,finish){
	console.log(tableInfo);
	if(numberColumn_needValueInfo[tableInfo] && numberColumn_needValueInfo[tableInfo][field]){
		 finish(numberColumn_needValueInfo[tableInfo][field]);
		return;
	}
	setTimeout(function(){
		if (!copyCurrentTableData) {
			copyCurrentTableData = filterNeedAllData;
		}
		if(fieldtype == "numberType"){
			var sum = 0;
			var averge = 0; // 平均数
			var numArr = [];
			// 排序
			copyCurrentTableData.sort(function(value1,value2){
				return Number(value1[field]) - Number(value2[field]);
			});
			var len = copyCurrentTableData.length;
			var min = Number(copyCurrentTableData[0][field]); // 最小数
			var max = Number(copyCurrentTableData[len - 1][field]); // 最大数
			var median = copyCurrentTableData[parseInt(len / 2)][field]; // 中位数
			
			var maxtemp=1,maxcount=0,modeArr= []; // 众数
			for (var i = 0;i < len;i++) {
				var item =  Number(copyCurrentTableData[i][field]);
				numArr.push(item);
				sum += item;
				if(i > 0) {
					if(copyCurrentTableData[i - 1][field] == copyCurrentTableData[i][field]) {
						maxtemp++;
					}else {
						if(maxtemp > maxcount && maxtemp > 1) {
							maxcount = maxtemp;
							modeArr = [copyCurrentTableData[i - 1][field]];
						} else if(maxtemp == maxcount && maxtemp > 1) {
							modeArr.push(copyCurrentTableData[i - 1][field]);
						}
						maxtemp = 1;
					}
					if(i == len - 1) {
						if(maxtemp > maxcount && maxtemp > 1) {
							maxcount = maxtemp;
							modeArr = [copyCurrentTableData[i - 1][field]];
						} else if(maxtemp == maxcount && maxtemp > 1) {
							modeArr.push(copyCurrentTableData[i - 1][field]);
						}
						maxtemp = 1;
					}
				}
			}
			averge = sum / len;
			
			if(!numberColumn_needValueInfo[tableInfo]){
				numberColumn_needValueInfo[tableInfo] = {};
			}
			numberColumn_needValueInfo[tableInfo][field] = {
					"averge":averge,
					"max":max,
					"min":min,
					"median":median,
					"modeArr":modeArr,
					"len":len,
					"allNum":numArr
			}
		}else if(fieldtype == "dateType"){
			var len = copyCurrentTableData.length;
			var firstDate = copyCurrentTableData[0][field];
			var min = null;
			if(firstDate){
				min =  {
				"year":firstDate.split("T")[0].split("-")[0],
				"month":firstDate.split("T")[0].split("-")[1],
				"day":firstDate.split("T")[0].split("-")[2],
				}
			}
			var max = min;
			for(var i = 0;i < len ;i++){
				var aDate = copyCurrentTableData[i][field];
				if(!aDate){
					continue;
				}
				var aDate_year = aDate.split("T")[0].split("-")[0];
				var aDate_month = aDate.split("T")[0].split("-")[1];
				var aDate_day = aDate.split("T")[0].split("-")[2];
				var calculateDate = {"year":aDate_year,"month":aDate_month,"day":aDate_day};
				if(!min || !max){
					min = calculateDate;
					max = min;
					continue;
				}
				if(compareTwoDateMax(calculateDate,max,["year","month","day"]) == "bigger"){
					max = calculateDate;
				}
				if(compareTwoDateMax(calculateDate,min,["year","month","day"]) == "smaller"){
					min = calculateDate;
				}
			}
			if(!numberColumn_needValueInfo[tableInfo]){
				numberColumn_needValueInfo[tableInfo] = {};
			}
			
			numberColumn_needValueInfo[tableInfo][field] ={
				"min":min,
				"max":max,
				"len":len
			}
		}
		
		
		finish(numberColumn_needValueInfo[tableInfo][field]);
		
	},0);
	
}

// date1>date2 返回bigger，date1 < date2 返回 smaller，date1=date2 返回 equal
function compareTwoDateMax(date1,date2,propertyArr){
	for (var i = 0;i < propertyArr.length;i++) {
		if(date1[propertyArr[i]] > date2[propertyArr[i]]){
			return "bigger";
		}else if(date1[propertyArr[i]] < date2[propertyArr[i]]){
			return "smaller";
		}else{
			if(i == propertyArr.length - 1){
				return "equal"
			}else{
				continue;
			}
		}
	}
	
}
