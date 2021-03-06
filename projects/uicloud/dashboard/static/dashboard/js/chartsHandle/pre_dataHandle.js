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
var handleDataPost = {};
var freeHandleCheckData = {};
//使用筛选器后获取所有数据的关联
var dimiFreeDataHandle = {};

var handleValue = null;

var freeToPost = null;

var onlyClickDrill = null;

var handleChangeCol = false;

var saveManyDataHandle = null;
// 定义一个对象用来记录拖拽的度量是否需要计算同比或者环比
// var
function strMatch(str, startStr, item) {
    var counter = 0,
        end = -1,
        matchLeft = item.charAt(0),
        matchRight = item.charAt(1),
        start = str.indexOf(startStr) + startStr.length;
    search(start + 1);

    function search(position) {
        end = str.indexOf(matchRight, position);
        if (end != -1) {
            counter++;
            var subStr = str.substring(start + 1, end).match(eval("/\\" + matchLeft + "/g"));
            if (subStr !== null) {
                var numsOfMatchLeft = subStr.length;
            } else if (subStr === null) {
                return;
            }

            if (counter > numsOfMatchLeft) {
                return;
            } else {
                arguments.callee(end + 1);
            }
        } else {
            // console.warn('输入的配对符号有误');
        }
    }

    return [start, end];
}
function generateMeasureExpression(originExpression,dateName,dateMin,dateMax){
	 if(!dateName || currentSetTableDateFieldArray.length < 1 || !dateMin || !dateMax){
		 return originExpression;
	 }
	  var str = originExpression;
	  var result = "";
   	  var rs = str.match(/sum\(|count\(|max\(|min\(|avg\(/);
      while(rs&&rs.index > -1){

      var needChange = strMatch(str,rs[0],"()");
      if(needChange[1]!=-1){
            var temp1  = str.substring(0,needChange[0]);
            var temp2 = str.substring(needChange[0],needChange[1]);
						if(rs[0] == "count("){
							temp1 = temp1.replace(/count\(/,"sum(");
							result += temp1 + "if(datediff("+dateName+","+"'"+dateMin.replace(/\//g,"-")+"'"+")>=0 and datediff("+dateName+","+"'"+dateMax.replace(/\//g,"-")+"'"+")<=0"+","+1+","+0+"))";
						}else{
							result += temp1 + "if(datediff("+dateName+","+"'"+dateMin.replace(/\//g,"-")+"'"+")>=0 and datediff("+dateName+","+"'"+dateMax.replace(/\//g,"-")+"'"+")<=0"+","+temp2+","+0+"))";
						}

            str = str.substring(needChange[1]+1);
        }
       rs = str.match(/sum\(|count\(|max\(|min\(|avg\(/);
    }
    result+=str
		return result;
}

function calculteTongBiAyearAgoDate(theDate){
	var aDate = new Date(theDate);
	var rsDate =new Date(aDate.getFullYear()-1,aDate.getMonth(),aDate.getDate());
	return formatDate(rsDate);
}
function calculteHuanBiAyearAgoDate(theDate,distance){
	var aDate =  new Date(theDate);
	aDate = aDate.setDate(aDate.getDate()-distance);
	return formatDate(new Date(aDate));
}

function twoDateDistance(dateStr1,dateStr2){
	var date1 = new Date(dateStr1);
	var date2 = new Date(dateStr2);
	return parseInt(Math.abs(date1-date2) / (1000 * 60 * 60 * 24));
}

//判断数组里是否含有已有的对象
Array.prototype.hasAllObject = function(obj){
	for(var i = 0; i < this.length;i++){
		if(equalCompare(this[i],obj)){
			return true;
		}
	}
	return false;
}


// needColumns暂时未用到
function measure_Hanlde(dimensionality_array,measure_name_arr,needColumns,handleSuccessFunction,str){
	if(oldViewToShow){
		handleDataPost = editViewPostData;
	}else{
		var dimensionality_array = objectDeepCopy(dimensionality_array);
		var filterNotWorkArr = getColumnFilterNotWorkedColumns(current_cube_name);
		getCurrentTableFilterData(current_cube_name,filterNotWorkArr);

		var conditions = conditionFilter_record[current_cube_name]["common"].concat(conditionFilter_record[current_cube_name]["condition"]);

	  	if(currentSetTableDateMinDate != null && currentSetTableDateMaxDate != null){
	  		if(new Date(currentSetTableDateMinDate).getTime() > new Date(currentSetTableDateMaxDate).getTime()){
	  			var tempDate = currentSetTableDateMinDate;
	  			currentSetTableDateMinDate = currentSetTableDateMaxDate;
	  			currentSetTableDateMaxDate = tempDate;
	  		}
	  		conditions.push({"type":">=","columnName":"`" + $("#sizer_content .dateSelectDataModule .fieldSelectPart .fieldSelect-box .combo-select select").val() + "`","value":new Date(currentSetTableDateMinDate).format("yyyy-MM-dd") + " 00:00:00","datatype":"date"});
	  		conditions.push({"type":"<=","columnName":"`" + $("#sizer_content .dateSelectDataModule .fieldSelectPart .fieldSelect-box .combo-select select").val() + "`","value":new Date(currentSetTableDateMaxDate).format("yyyy-MM-dd") + " 23:59:59","datatype":"date"});
	  	}

	  	conditions = conditions.concat(conditionFilter_record[current_cube_name]["dateCondition"]);

		checkSelectConditionDict = getSelectionCondtion(current_cube_name);
		for(var key in checkSelectConditionDict){
			if(dirllConditions && $.inArray(key,specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]))) == -1){
				continue;
			}
			var valuesArr = checkSelectConditionDict[key];
			if(valuesArr && valuesArr.length >0 && filterNotWorkArr.indexOf(key) == -1){
				if($("#sizer_content .dateSelectDataModule .fieldSelectPart .fieldSelect-box .combo-select select option[value="+key+"]").length > 0){
					valuesArr.forEach(function(v,i){return valuesArr[i] = v.replace(/T/g," ")});
				}
				var filter = {"type":"isnotin","columnName":"`"+key+"`","value":valuesArr};
				if(!conditions.hasAllObject(filter)){
					conditions.push(filter);
				}
			}
		}
		if(dirllConditions && dirllConditions.length > 0){
			var tempSaveTableName = [];
			// dimensionality_array.splice(dimensionality_array.length-1,1,dirllConditions[dirllConditions.length - 1].drillField);
			for(var i = 0;i <  dirllConditions.length;i++){
				var obj = dirllConditions[i];
				if($.inArray(i,saveDrillCount) != -1){
					continue;
				}
				if(obj.currentField != "全部" && obj.currentValue != "全部"){
					conditions.push({"type":"=","columnName": "`"+ obj.currentField + "`","value":obj.currentValue});
				}
			}
		}

		dimensionality_array.forEach(function(item,index){
			dimensionality_array[index] = "`"+item+"`";
		});
		var groupby = dimensionality_array;
		var basic_opration = ["sum(","max(","min(","avg(","count("];
		var basic_names = ["求和(","最大值(","最小值(","平均值(","计数("];
		var expressions = {};
		if(measure_name_arr.length >0){
			for (var i = 0;i < measure_name_arr.length;i++) {
				if(measure_name_arr[i] == "记录数"){
					var exprstr = "count("+dimensionality_array[dimensionality_array.length - 1]+")";
					if(!dimensionality_array[dimensionality_array.length - 1]){
						exprstr = "count(1)";
					}
					var exprstr1 = generateMeasureExpression(exprstr,currentSetTableDateFieldName,currentSetTableDateMinDate,currentSetTableDateMaxDate);
					var obj = {"alias":"计数("+measure_name_arr[i]+")","exprstr":exprstr1};
					if(expressions["exprlist"]){
						expressions["exprlist"].push(obj);
					}else{
						expressions["exprlist"] = [obj];
					}
					if(currentSetTableDateFieldName&&currentSetTableDateMinDate&&currentSetTableDateMaxDate&&currentSetTableDateFieldArray.length>0){
							var tongbiExpre = generateMeasureExpression(exprstr,currentSetTableDateFieldName,calculteTongBiAyearAgoDate(currentSetTableDateMinDate),calculteTongBiAyearAgoDate(currentSetTableDateMaxDate));
							var distance = twoDateDistance(currentSetTableDateMinDate,currentSetTableDateMaxDate);
							var huanbiExpre = generateMeasureExpression(exprstr,currentSetTableDateFieldName,calculteHuanBiAyearAgoDate(currentSetTableDateMinDate,distance),calculteHuanBiAyearAgoDate(currentSetTableDateMaxDate,distance));
							var obj1 = {"alias":"同比计数("+measure_name_arr[i]+")","exprstr":"(("+exprstr1+")/"+"("+tongbiExpre+"))-1"};
							var obj2 = {"alias":"环比计数("+measure_name_arr[i]+")","exprstr":"(("+exprstr1+")/"+"("+huanbiExpre+"))-1"};
							expressions["exprlist"].push(obj1);
							expressions["exprlist"].push(obj2);
					}

				}else{
					for(var j = 0;j < basic_opration.length;j++){
					var exprstr = basic_opration[j]+measure_name_arr[i]+")";
					var exprstr1 = generateMeasureExpression(exprstr,currentSetTableDateFieldName,currentSetTableDateMinDate,currentSetTableDateMaxDate);
					var obj = {"alias":basic_names[j]+measure_name_arr[i]+")","exprstr":exprstr1};
					if(expressions["exprlist"]){
						expressions["exprlist"].push(obj);
					}else{
						expressions["exprlist"] = [obj];
					}
					if(currentSetTableDateFieldName&&currentSetTableDateMinDate&&currentSetTableDateMaxDate&&currentSetTableDateFieldArray.length>0){
							var tongbiExpre = generateMeasureExpression(exprstr,currentSetTableDateFieldName,calculteTongBiAyearAgoDate(currentSetTableDateMinDate),calculteTongBiAyearAgoDate(currentSetTableDateMaxDate));
							var distance = twoDateDistance(currentSetTableDateMinDate,currentSetTableDateMaxDate);
							var huanbiExpre = generateMeasureExpression(exprstr,currentSetTableDateFieldName,calculteHuanBiAyearAgoDate(currentSetTableDateMinDate,distance),calculteHuanBiAyearAgoDate(currentSetTableDateMaxDate,distance));
							var obj1 = {"alias":"同比"+basic_names[j]+measure_name_arr[i]+")","exprstr":"(("+exprstr1+")/"+"("+tongbiExpre+"))-1"};
							var obj2 = {"alias":"环比"+basic_names[j]+measure_name_arr[i]+")","exprstr":"(("+exprstr1+")/"+"("+huanbiExpre+"))-1"};
							expressions["exprlist"].push(obj1);
							expressions["exprlist"].push(obj2);
					}
					}
				}

				if(customCalculate[measure_name_arr[i]]){
					var exprstr = customCalculate[measure_name_arr[i]]["value"];
					var exprstr1 = generateMeasureExpression(exprstr,currentSetTableDateFieldName,currentSetTableDateMinDate,currentSetTableDateMaxDate);
					var obj = {"alias":customCalculate[measure_name_arr[i]]["name"],"exprstr":exprstr1};
					expressions["exprlist"].push(obj);
					if(currentSetTableDateFieldName&&currentSetTableDateMinDate&&currentSetTableDateMaxDate&&currentSetTableDateFieldArray.length>0){
							var tongbiExpre = generateMeasureExpression(exprstr,currentSetTableDateFieldName,calculteTongBiAyearAgoDate(currentSetTableDateMinDate),calculteTongBiAyearAgoDate(currentSetTableDateMaxDate));
							var distance = twoDateDistance(currentSetTableDateMinDate,currentSetTableDateMaxDate);
							var huanbiExpre = generateMeasureExpression(exprstr,currentSetTableDateFieldName,calculteHuanBiAyearAgoDate(currentSetTableDateMinDate,distance),calculteHuanBiAyearAgoDate(currentSetTableDateMaxDate,distance));
							var obj1 = {"alias":"同比("+customCalculate[measure_name_arr[i]]["name"]+")","exprstr":"(("+exprstr1+")/"+"("+tongbiExpre+"))-1"};
							var obj2 = {"alias":"环比("+customCalculate[measure_name_arr[i]]["name"]+")","exprstr":"(("+exprstr1+")/"+"("+huanbiExpre+"))-1"};
							expressions["exprlist"].push(obj1);
							expressions["exprlist"].push(obj2);
					}
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


		handleDataPost = {
			"conditions":conditions,
		};
		if(expressions["exprlist"] && expressions["exprlist"].length > 0){
			expressions["groupby"]  = groupby;
			expressions["orderby"] = groupby;
			handleDataPost["expressions"] = expressions;
		}
	}

	if((equalCompare(recordConditon,handleDataPost) && preAllData) || (equalCompare(recordConditon,handleDataPost) && preAllData && str == "graph")  || handleChangeCol){

		if(handleChangeCol){
			if(equalCompare(recordConditon,handleDataPost)){
				if(str != "noStop"){
					spinner.stop();
					$(".maskLayer").hide();
				}
				return;
			}
			commonChangeClickBtn(preAllData);
			handleChangeCol = false;
			return;
		}

		handleSuccessFunction(preAllData);
		rightFilterListDraw();
		oldViewToShow =false;
		if($(".clickActive") != undefined && $(".clickActive").length > 0){
			if($(".drillDownHandle").length == 0){
				getNodrillIndex();
				saveEveryViewPostData[$(".clickActive").find("span").text()] = objectDeepCopy(handleDataPost);
				saveDrillDownTemp[$(".clickActive").find("span").text()] = {"viewdata":JSON.parse(JSON.stringify(drag_row_column_data)),"viewType":save_now_show_view_text.attr("id"),"calculateStyle":objectDeepCopy(drag_measureCalculateStyle),"dragViewStyle":objectDeepCopy(currentColorGroupName)+"_YZY_"+objectDeepCopy(normalUnitValue)+"_YZY_"+objectDeepCopy(valueUnitValue)};
			}

		}else{
			saveEveryViewPostData = {};
			drillElementCount = {};
		}

		return;

	}


//遍历操作过后返回的数据
function forDataFunctionPost(handleData,drill,type,handleCount){
	var saveArr = null;
	if((dirllConditions && dirllConditions.length > 0) || drill == "over"){
		saveArr = {};
		for(var z = 0; z < handleCount.length;z++){
		if(saveArr[handleCount[z].replace(/\`/g,"")] == undefined){
				saveArr[handleCount[z].replace(/\`/g,"")] = [];
				for(var j = 0; j < handleData.length;j++){
					var aData = handleData[j];
					if($.inArray(String(aData[handleCount[z].replace(/\`/g,"")]),saveArr[handleCount[z].replace(/\`/g,"")]) == -1){
						saveArr[handleCount[z].replace(/\`/g,"")].push(String(aData[handleCount[z].replace(/\`/g,"")]));
					}
					
				}
			
		}
	}
	}

	if(type == "check"){
		freeHandleCheckData = saveArr;
	}else if(type == "dataChange"){
		saveManyDataHandle = saveArr;
	}


}



//复选框取消获取数据
function deleteCheckFunction(preHandleDataCheck,fun,text,countArr){
	var checkHandleValue = [];
	for(var i = 0; i < preHandleDataCheck.length;i++){
		var freeViewD = preHandleDataCheck[i];
		if(freeViewD[fun] == text){
			for(var j = 0; j < countArr.length; j++){
				if(countArr[j] != fun){
					if($.inArray(countArr[j]+"_YZY_"+freeViewD[countArr[j]],checkHandleValue) == -1){
						checkHandleValue.push(countArr[j]+"_YZY_"+freeViewD[countArr[j]]);
					}
					
				}
			}
			
		}

	}
	return checkHandleValue;
}

function commonHeaderFunction(checkView,freeHandleCheckData){
	for(checkView in freeHandleCheckData){
		checkSelectConditionDict[checkView] = objectDeepCopy(filterNeedAllData[checkView]);
		if($("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+checkView.replace(/\./g,"YZY")).data("fieldInfo").split(":")[1].isTypeDate()){
			checkSelectConditionDict[checkView].forEach(function(v,i){
				checkSelectConditionDict[checkView][i] = checkSelectConditionDict[checkView][i].replace(/T/g," ");
			})
		}
		$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+checkView.replace(/\./g,"YZY")).find(".field_detail_list li").each(function(index,ele){
			if($.inArray($(ele).attr("checkvalue"),freeHandleCheckData[checkView]) == -1){
				$(ele).find("input").eq(0).prop("checked",false);

				handleValue = deleteCheckFunction(dimiFreeDataHandle[current_cube_name],checkView,$(ele).attr("checkvalue"),allKeys(freeHandleCheckData)).join("_YZYPD_");
				$(ele).attr("checkWithCount",handleValue);
			}else{
				$(ele).find("input").eq(0).prop("checked",true);
				if($(ele).parents(".filterLI").data("fieldInfo").split(":")[1].isTypeDate()){
					var index = checkSelectConditionDict[checkView].indexOf($(ele).attr("checkvalue").replace(/T/g," "));
				}else if($(ele).parents(".filterLI").data("fieldInfo").split(":")[1].isTypeNumber()){
					var index = checkSelectConditionDict[checkView].indexOf(eval($(ele).attr("checkvalue")));
				}else{
					var index = checkSelectConditionDict[checkView].indexOf($(ele).attr("checkvalue"));
				}
				if(index != -1){
					checkSelectConditionDict[checkView].splice(index,1);
					if($(ele).attr("checkwithcount") != undefined && $(ele).attr("checkwithcount") != ""){

						for(var z = 0; z < $(ele).attr("checkwithcount").split("_YZYPD_").length; z++){
							if(checkSelectConditionDict[$(ele).attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[0]] != undefined){
								checkSelectConditionDict[$(ele).attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[0]].splice(checkSelectConditionDict[$(ele).attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[0]].indexOf($(ele).attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[1]),1);
								$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+$(ele).attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[0].replace(/\./g,"YZY")).find(".field_detail_list li[checkvalue="+$(ele).parent().attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[1]+"]").find("input").eq(0).prop("checked",true);
								$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+$(ele).attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[0].replace(/\./g,"YZY")).find(".field_detail_list li[checkvalue="+$(ele).parent().attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[1]+"]").removeAttr("checkwithcount");								
							}

						}
						$(ele).removeAttr("checkwithcount");
					}
				}
			}
		})

	}
	saveSelectionCondtion(current_cube_name,checkSelectConditionDict);
}





//点击复选框处理多维度的显示问题
function checkHandleFunction(checkData,handleCount){
	freeHandleCheckData = null;
	forDataFunctionPost(checkData,"over","check",handleCount);
	// $("#sizer_content .filter_body_div .table_field_list .field_detail_list li input").prop("checked",false);
	if(dimiFreeDataHandle[current_cube_name] == undefined){
		var postData = {};
		if(currentSetTableDateMinDate != null && currentSetTableDateMaxDate != null){
			postData["conditions"] = [];
			postData["conditions"].push({"type":">=","columnName":"`" + $("#sizer_content .dateSelectDataModule .fieldSelectPart .fieldSelect-box .combo-select select").val() + "`","value":new Date(currentSetTableDateMinDate).format("yyyy-MM-dd") + " 00:00:00","datatype":"date"});
			postData["conditions"].push({"type":"<=","columnName":"`" + $("#sizer_content .dateSelectDataModule .fieldSelectPart .fieldSelect-box .combo-select select").val() + "`","value":new Date(currentSetTableDateMaxDate).format("yyyy-MM-dd") + " 23:59:59","datatype":"date"});
		}
		filterTableAll(postData,"all",checkData,freeHandleCheckData,handleCount);
	}else{
		commonHeaderFunction(checkData,freeHandleCheckData,handleCount);
	}


}



//选择筛选后表格存在行列里都存在维度post多个维度之间的关联
function filterTableAll(postData,type,checkData,freeHandleCheckData,handleCount){
	$.ajax({
		url:"/cloudapi/v1/tables/" +current_cube_name+"/data",
		type:"post",
		dataType:"json",
		contentType: "application/json; charset=utf-8",
		async: true,
		// async:false,
		data:JSON.stringify(postData),
		success:function(data){
			if(data.status == "success"){
				if(type == "only"){
					checkHandleFunction(data.results.data,objectDeepCopy(postData["expressions"]["groupby"]));
				}else if(type == "all"){
					dimiFreeDataHandle[current_cube_name] = data.results.data;
					commonHeaderFunction(checkData,freeHandleCheckData,handleCount);
				}
			}
		}
	});
}


function commonChangeClickBtn(data){
				if(!freeHandleCheck){
					checkedHandle = false;
				}
				if(checkedHandle){
					var checkHanleFree = "true";
					if(drag_row_column_data["column"]["dimensionality"].length > 0 && drag_row_column_data["row"]["dimensionality"].length > 0){
						var postData = objectDeepCopy(handleDataPost);
						postData["expressions"]["orderby"] = specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]));
						postData["expressions"]["groupby"] = specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]));	
						filterTableAll(postData,"only");
					}else{
						checkHandleFunction(data,objectDeepCopy(handleDataPost["expressions"]["groupby"]));
					}
					checkedHandle = false;
					freeHandleCheck = false;
				}
				
				if($(".clickActive") != undefined && $(".clickActive").length > 0){
					if($(".drillDownHandle").length == 0){
						saveEveryViewPostData[$(".clickActive").find("span").text()] = objectDeepCopy(handleDataPost);
						saveDrillDownTemp[$(".clickActive").find("span").text()] = {"viewdata":JSON.parse(JSON.stringify(drag_row_column_data)),"viewType":save_now_show_view_text.attr("id"),"calculateStyle":objectDeepCopy(drag_measureCalculateStyle),"dragViewStyle":objectDeepCopy(currentColorGroupName)+"_YZY_"+objectDeepCopy(normalUnitValue)+"_YZY_"+objectDeepCopy(valueUnitValue)};
						getNodrillIndex();
					}

				}else{
					
					saveEveryViewPostData = {};
					drillElementCount = {};
				}

				if($("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul li").length > 1 && checkHanleFree != "true" && (onlyClickDrill == null || dirllConditions.length != onlyClickDrill.length)){
					getFilterAllData(conditions);
					onlyClickDrill = objectDeepCopy(dirllConditions);
					if(str != "noStop"){
						spinner.stop();
						$(".maskLayer").hide();
					}
					return;
				}

				rightFilterListDraw();
				if(str != "noStop"){
					spinner.stop();
					$(".maskLayer").hide();
				}
}



	$.ajax({
		url:"/cloudapi/v1/tables/" +current_cube_name+"/data",
		type:"post",
		dataType:"json",
		contentType: "application/json; charset=utf-8",
		async: true,
		data:JSON.stringify(handleDataPost),
		beforeSend:function(){
			// console.log(handleDataPost);
			var target =  $("#view_show_wrap").get(0);
		    spinner.spin(target);
		 	$(".maskLayer").show();
		},
		success:function(data){
			if(data.status == "success"){

				var freeHandlePostFun = objectDeepCopy(recordConditon);
				preAllData = data.results.data;
				recordConditon = objectDeepCopy(handleDataPost);
				handleSuccessFunction(data.results.data);
				oldViewToShow = false;
				commonChangeClickBtn(data.results.data);

			}
		},
	});

}
