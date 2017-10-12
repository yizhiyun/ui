var isNeedCalculateMoM = false;
var momTheDateScale = [];
var isCanShowMonCount = 0;
var monAllData = null;
$(function(){
	
	$("#dashboard_content #view_show_area  .momshowArea").draggable({
		containment:"#dashboard_content #view_show_area"
	});
	
	
	$("#dashboard_content #view_show_area .MoMInfo .monHeader .productBtn").click(function(){
		var value = $("#dashboard_content #view_show_area .MoMInfo .monHeader .filedSelectdiv input").val();
		var allSchema = _cube_all_data[current_cube_name].schema;
		var tipUser = true;
		if(value){
			var index = allSchema.hasObject("field",value);
			if(index != -1){
				var typeInfo = allSchema[index].type;
				if(typeInfo.isTypeDate){
					tipUser = false;
					isNeedCalculateMoM = true;
					// 执行同比操作
					var str = GetDateStr(0,$("#dashboard_content #view_show_area .MoMInfo .monHeader .unitSelectDiv select").val());
					var dateArr = str.split(" 至 ");
					momTheDateScale.push({"type":">=","columnName":value,"value":dateArr[0],"datatype":"date"});
					momTheDateScale.push({"type":"<=","columnName":value,"value":dateArr[1],"datatype":"date"});
					switch_chart_handle_fun();
					showMonFunction();
				}
			}
		}	
		if(tipUser){
			alert("请检查输入");
		}
	
	});
});

function showMonFunction(){
	
	var dimensionality_array = specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]));
	var measure_name_arr = specialRemoveDataTypeHandle(drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]));
	
	var filterNotWorkArr = getColumnFilterNotWorkedColumns(current_cube_name);
	getCurrentTableFilterData(current_cube_name,filterNotWorkArr);

	var conditions = conditionFilter_record[current_cube_name]["common"].concat(conditionFilter_record[current_cube_name]["condition"]);
	var str = GetDateStr(-1,$("#dashboard_content #view_show_area .MoMInfo .monHeader .unitSelectDiv select").val());
	var dateArr = str.split(" 至 ");
	var temp = [];
	var value = $("#dashboard_content #view_show_area .MoMInfo .monHeader .filedSelectdiv input").val();
	temp.push({"type":">=","columnName":value,"value":dateArr[0],"datatype":"date"});
	temp.push({"type":"<=","columnName":value,"value":dateArr[1],"datatype":"date"});
	conditions = conditions.concat(temp);
	

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
				var obj = {"alias":drag_measureCalculateStyle[measure_name_arr[i]],"exprstr":customCalculate[measure_name_arr[i]]}
				expressions["exprlist"].push(obj);
			}
		}

	}else{
		var obj = {"alias":"count("+groupby[0]+")","exprstr":"count("+groupby[0]+")"};
		expressions["exprlist"] = [obj];
	}
	
	
	
	var handleDataPost = {
		"conditions":conditions,
	};
	
	if(expressions["exprlist"] && expressions["exprlist"].length > 0){
		expressions["groupby"]  = groupby;
		expressions["orderby"] = groupby;
		handleDataPost["expressions"] = expressions;
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
				isCanShowMonCount++;
				monAllData = data.results.data;
				momneedDateDidFinish();
			}
		}
	});
}
// dataDidFinish
function momneedDateDidFinish(){
	if(isCanShowMonCount >= 2){
		$("#dashboard_content #view_show_area .momshowArea").show();
		var dimensionality_array = specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]));
		var measure_name_arr = specialRemoveDataTypeHandle(drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]));
		var th = $("<th>"+dimensionality_array[dimensionality_array.length - 1]+"</th>");
		var theTable = $("#dashboard_content #view_show_area .momshowArea  table").eq(0);
		var theTableHead = theTable.children("thead").eq(0);
		var theTableBody = theTable.children("tbody").eq(0);
		theTableHead.find("tr.use").append(th);
		theTableHead.find("tr.title th").attr("colspan",measure_name_arr.length + 1);
		for(var i= 0;i < measure_name_arr.length;i++){
			var th = $("<th>"+drag_measureCalculateStyle[measure_name_arr[i]]+"</th>");
			theTableHead.find("tr.use").append(th);
		}
		for(var i =0;i < preAllData.length;i++){
			var aNowData = preAllData[i];
			var aMomData = monAllData[i];
			var tr = $("<tr></tr>");
			theTableBody.append(tr);
			var td = $("<td>"+aNowData[dimensionality_array[dimensionality_array.length - 1]]+"</td>");
			tr.append(td);
			for(var j = 0;j < measure_name_arr.length;j++){
				var theMeasureNow = aNowData[drag_measureCalculateStyle[measure_name_arr[j]]];
				var theMeasureMom = aMomData[drag_measureCalculateStyle[measure_name_arr[j]]];
				var td = $("<td>"+((theMeasureNow - theMeasureMom) / theMeasureMom * 100).toFixed(2) + "%</td>");
				tr.append(td);
			}
		}
		 isNeedCalculateMoM = false;
		 momTheDateScale = [];
		 isCanShowMonCount = 0;
		 monAllData = null;
		 $("#dashboard_content #view_show_area .MoMInfo .monHeader .filedSelectdiv input").val("");
	}
	
}
