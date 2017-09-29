var numberColumn_needValueInfo = {}; // 某个表格的数值类型列，需要的一些数值
var copyCurrentTableData = null; // 对当前 table 数据的一份拷贝
// fieldtype 为数字 numberType 、日期、dateType 俩种类型
// handleType:数据构建之前和之后  buildData,dashboard
function dataHandleWork(handleType,tableInfo,field,fieldtype,finish){
	console.log(tableInfo);
	if(numberColumn_needValueInfo[tableInfo] && numberColumn_needValueInfo[tableInfo][field]){
		 finish(numberColumn_needValueInfo[tableInfo][field]);
		return;
	}
	if(handleType == "dashBoard"){
		var exprlist = [
					{
						"alias":"min","exprstr":"min("+field+")"
					},
					{
						"alias":"max","exprstr":"max("+field+")"
					},
					{
						"alias":"averge","exprstr":"avg("+field+")"
					},
					{
						"alias":"len","exprstr":"count("+field+")"
					}
				];
			if(fieldtype == "dateType"){
				 exprlist = [
					{
						"alias":"min","exprstr":"min("+field+")"
					},
					{
						"alias":"max","exprstr":"max("+field+")"
					},
					{
						"alias":"len","exprstr":"count("+field+")"
					}
				];
			}
		var handleDataPost = {
			"expressions":{
				"exprlist":exprlist
			}
		}
		
		$.ajax({
			url:"/cloudapi/v1/tables/" +tableInfo+"/data",
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
					var rs = data.results.data[0];
					if(!numberColumn_needValueInfo[tableInfo]){
						numberColumn_needValueInfo[tableInfo] = {};
					}
					numberColumn_needValueInfo[tableInfo][field] = rs;
					finish(numberColumn_needValueInfo[tableInfo][field]);
				}
				
			}
		});
		
		
		
	}else if(handleType == "buildData"){
			var exprlist = [
					{
						"alias":"min","exprstr":"min("+field+")"
					},
					{
						"alias":"max","exprstr":"max("+field+")"
					},
					{
						"alias":"averge","exprstr":"avg("+field+")"
					},
					{
						"alias":"len","exprstr":"count("+field+")"
					}
				];
			if(fieldtype == "dateType"){
				 exprlist = [
					{
						"alias":"min","exprstr":"min("+field+")"
					},
					{
						"alias":"max","exprstr":"max("+field+")"
					},
					{
						"alias":"len","exprstr":"count("+field+")"
					}
				];
			}
			var dbArr = tableInfo.split("_YZYPD_");
			var handleDataPost = {
			 "source":dbArr[0],
    			"database":dbArr[1],
    			"tableName":dbArr[2],
			"expressions":{
				"exprlist":exprlist
			}
		}
		$.ajax({
	      url:"/dataCollection/filterTable/data",
	      type:"post",
	      dataType:"json",
	      contentType: "application/json; charset=utf-8",
	      async: true,
	      data:JSON.stringify(handleDataPost),
	      success:function(data){
	      	if(data.status == "success"){
				var rs = data.results[0];
				if(!numberColumn_needValueInfo[tableInfo]){
					numberColumn_needValueInfo[tableInfo] = {};
				}
				numberColumn_needValueInfo[tableInfo][field] = rs;
				finish(numberColumn_needValueInfo[tableInfo][field]);
			}
	      }
	   	});
			
	}
	
	
}

// date1>date2 返回bigger，date1 < date2 返回 smaller，date1=date2 返回 equal
//function compareTwoDateMax(date1,date2,propertyArr){
//	for (var i = 0;i < propertyArr.length;i++) {
//		if(date1[propertyArr[i]] > date2[propertyArr[i]]){
//			return "bigger";
//		}else if(date1[propertyArr[i]] < date2[propertyArr[i]]){
//			return "smaller";
//		}else{
//			if(i == propertyArr.length - 1){
//				return "equal"
//			}else{
//				continue;
//			}
//		}
//	}
//	
//}
