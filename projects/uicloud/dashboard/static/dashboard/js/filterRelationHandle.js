// 处理仪表板界面 跟筛选器相关的内容
// 用来记录当前正在表详细中操作的列或者行元素
var currentHandleColOrRowEles = null;
var checkSelectConditionDict = {};
var recordIsCanDrawTimter = null;
//  仪表板选择 复选框选择的记录
function saveSelectionCondtion(tableInfo,conditionsDict){
	var orgianlAllData = JSON.parse(window.localStorage.getItem("allTable_specialSelection"));
	if(!orgianlAllData){
		orgianlAllData = {};
	}
	orgianlAllData[tableInfo+"_specialSelection"] = conditionsDict;
	
	window.localStorage.setItem("allTable_specialSelection",JSON.stringify(orgianlAllData));
}
function getSelectionCondtion(tableInfo){
	var rs = JSON.parse(window.localStorage.getItem("allTable_specialSelection"));
	var finalRs = {};
	if(rs && rs[tableInfo+"_specialSelection"]){
		 finalRs = rs[tableInfo+"_specialSelection"];
	}
	return finalRs;
}

// 仪表板选择 开关选择是否要筛选生效
function saveColumnFilterNotWorkedColumns(tableInfo,columns){
	var orgianlAllData = JSON.parse(window.localStorage.getItem("allTable_notWorkedColumns"));
	if(!orgianlAllData){
		orgianlAllData = {};
	}
	orgianlAllData[tableInfo+"_NotWorkedColumns"] = columns;
	
	window.localStorage.setItem("allTable_notWorkedColumns",JSON.stringify(orgianlAllData));
}
function getColumnFilterNotWorkedColumns(tableInfo){
	var rs = JSON.parse(window.localStorage.getItem("allTable_notWorkedColumns"));
	var finalRs = [];
	if(rs && rs[tableInfo+"_NotWorkedColumns"]){
		 finalRs = rs[tableInfo+"_NotWorkedColumns"];
	}
	return finalRs;
}


$(function(){
	
	$('.custom-select').comboSelect();
	// 筛选器部分，顶部筛选按钮点击的时候
	$("#dashboard_content #sizer_place #sizer_content .filter_header_div div.filter_content_btn").click(function(event){
		event.stopPropagation();
		editFilterViewShow_fun("dashBoard",filterSuccessFun);
	});
		
});
// 筛选器筛选数据成功，回调函数
function filterSuccessFun(){
	isagainDrawTable = true;
	switch_chart_handle_fun();
}


// drawType:add,delete；columnNameInfo:维度列名；
function rightFilterListDraw(){
	
	if(!(filterNeedAllData && allKeys(filterNeedAllData).length > 0)){
		recordIsCanDrawTimter = setTimeout(function(){
			rightFilterListDraw();
		},150);
		return;
	}
	clearTimeout(recordIsCanDrawTimter);
	checkSelectConditionDict = getSelectionCondtion(current_cube_name);
	var allDemiArray = drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]);
	var pureDemiArray =  specialRemoveDataTypeHandle(allDemiArray);
	for(var i = 0 ;i < allDemiArray.length;i++){
		var aDemi = allDemiArray[i];
		var columnInfoArr = aDemi.split(":");
		if($("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+columnInfoArr[0].replace(/\./g,"YZY")).length > 0){
			if(freeHandleDiData != null && freeHandleDiData[$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+columnInfoArr[0].replace(/\./g,"YZY")).find(".fieldName").text()] != undefined && freeHandleDiData[$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+columnInfoArr[0].replace(/\./g,"YZY")).find(".fieldName").text()].length <= $("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+columnInfoArr[0].replace(/\./g,"YZY")).children(".field_detail_list").children("li").length){
				$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+columnInfoArr[0].replace(/\./g,"YZY")).children(".field_detail_list").children("li").each(function(index,ele){
					if($.inArray($(ele).find(".filedContentName").text(),freeHandleDiData[$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+columnInfoArr[0].replace(/\./g,"YZY")).find(".fieldName").text()]) == -1){
						$(ele).remove();
					}
				})
			}else{
					$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+columnInfoArr[0].replace(/\./g,"YZY")).remove();
					addAFilterItemFunction(columnInfoArr[0],columnInfoArr[1]);
					preHandleDataCheck = objectDeepCopy(preAllData);
				}
			continue;
		}else{
			addAFilterItemFunction(columnInfoArr[0],columnInfoArr[1]);
			preHandleDataCheck = objectDeepCopy(preAllData);
		}
	}
	$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list>li").each(function(index,ele){
		// if(pureDemiArray != undefined){return false}
		if(pureDemiArray.indexOf($(ele).data("fieldInfo").split(":")[0]) == -1){
			$(ele).hide("blind",200,function(){
				checkSelectConditionDict = getSelectionCondtion(current_cube_name);
				delete checkSelectConditionDict[$(ele).data("fieldInfo").split(":")[0]];
				saveSelectionCondtion(current_cube_name,checkSelectConditionDict);
				$(this).remove();
			});
		}
	});
	
	function addAFilterItemFunction(aDemi,demiType){
		$("#dashboard_content #sizer_place #sizer_content .filter_body_div .cubeTableName").html(current_cube_name);
		var li = $("<li openFlag='on' class='filterLI'><div class='field_header_div'><img class='openAndCloseImg' src='/static/dataCollection/images/left_40.png'/><div class='fieldWholeDiv'><span class='fieldName'>"+aDemi+"</span><div class='filterSelectImgDiv'><img/></div><div class='filterDetailImgDiv'><img src='/static/dashboard/img/3filter_details.png'/></div></div></div></li>");
		li.addClass(aDemi.replace(/\./g,"YZY"));
		li.data("fieldInfo",aDemi+":"+demiType);
		if(demiType.isTypeString()){
			li.find(".filterSelectImgDiv img").attr("src","/static/dashboard/img/3filter_text.png");
		}else if(demiType.isTypeNumber()){
			li.find(".filterSelectImgDiv img").attr("src","/static/dashboard/img/3filter_value.png");
		}else if(demiType.isTypeDate()){
			li.find(".filterSelectImgDiv img").attr("src","/static/dashboard/img/3filter_time.png");
		}
		$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list").append(li);
		
		$(li).siblings("li[openFlag=on]").each(function(index,ele){
			$(ele).attr("openFlag","off");
			$(ele).find(".field_header_div img.openAndCloseImg").attr("src","/static/dataCollection/images/left_35.png");
			$(ele).find("ul.field_detail_list").hide();
		});
		li.click(function(event){
			event.stopPropagation();
			if($(this).attr("openFlag") == "on"){
				$(this).attr("openFlag","off");
				$(this).find(".field_header_div img.openAndCloseImg").attr("src","/static/dataCollection/images/left_35.png");
				$(this).find("ul.field_detail_list").hide("blind",200);
			}else if($(this).attr("openFlag") == "off"){
				$(this).attr("openFlag","on");
				$(this).find(".field_header_div img.openAndCloseImg").attr("src","/static/dataCollection/images/left_40.png");
				$(this).siblings("li[openFlag=on]").each(function(index,ele){
					$(ele).attr("openFlag","off");
					$(ele).find(".field_header_div img.openAndCloseImg").attr("src","/static/dataCollection/images/left_35.png");
					$(ele).find("ul.field_detail_list").hide();
				});
				$(this).find("ul.field_detail_list").show("blind",200);
				
			}
		});	
		
		li.find(".field_header_div .filterSelectImgDiv").eq(0).click(function(event){
			event.stopPropagation();
			var fieldInfo = $(this).parents("li.filterLI").eq(0).data("fieldInfo");
			didSelectedField_needFilter(false,fieldInfo,filterSuccessFun);
		});
		li.find(".field_header_div .filterDetailImgDiv").eq(0).click(function(event){
			event.stopPropagation();
			var li = $(this).parents("li.filterLI").eq(0);
			var detailBox = li.find(".filterBox:eq(0)");
			var flag = detailBox.attr("showOrHiden");
			if(flag == "show"){
				detailBox.attr("showOrHiden","hiden");
				detailBox.hide("blind",200);
				$(this).removeClass("active");
			}else{
				var list = detailBox.find("ul.filter_list");
				list.empty();
				var arr = localStorageGetData(current_cube_name);
				var liColumnName = detailBox.parents(".filterLI").eq(0).data("fieldInfo").split(":")[0];
				for (var i = 0;i < arr.length;i++) {
					var obj = arr[i];
					if(obj.column == liColumnName){
						var li = $("<li>"+obj.indictorText+"</li>");
						li.attr("index",i);
						list.append(li);
						li.click(function(event){
							event.stopPropagation();
							if(!$(this).hasClass("active")){
								$(this).siblings("li").removeClass("active");
								$(this).addClass("active");
							}
						});
					}	
				}
				detailBox.attr("showOrHiden","show");
				detailBox.show("blind",200);
				$(this).addClass("active");
			}
		});
		
		var fieldDetailContent_ul = $("<ul class='field_detail_list clear'></ul");
		fieldDetailContent_ul.click(function(event){event.stopPropagation();});
		
		li.append(fieldDetailContent_ul);
		for (var i =0;i < filterNeedAllData[aDemi].length;i++) {
			var lineItem = filterNeedAllData[aDemi][i];
			if(freeHandleDiData != null && ($("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow").find("li").length > 1 || (currentSetTableDateMinDate != null && currentSetTableDateMaxDate != null))){
				if($.inArray(String(lineItem),freeHandleDiData[aDemi]) == -1){
					continue;
				}
			}
			if(i >= dataNumberControl){
				break;
			}
			var detail_li = $("<li checkValue="+lineItem+"><label><input type='checkbox'/><span class='filedContentName'>"+lineItem+"</span></label></li>");
			if(checkSelectConditionDict[aDemi]&&checkSelectConditionDict[aDemi].indexOf(lineItem) != -1){
				detail_li.find("input").eq(0).prop("checked",false);
			}else{
				detail_li.find("input").eq(0).prop("checked",true);
			}

			fieldDetailContent_ul.append(detail_li);
			detail_li.find("input").change(function(event){
				var column = $(this).parents("li.filterLI").eq(0).data("fieldInfo").split(":")[0];
				var columnType = $(this).parents("li.filterLI").eq(0).data("fieldInfo").split(":")[1];
				var columnContent = $(this).parent("label").children("span.filedContentName").html();
				var arr = checkSelectConditionDict[column];
				// var freeArr = localStorageGetData(current_cube_name);
				// if(freeArr.hasObject("column",column) != -1){
				// 	freeArr.splice(freeArr.hasObject("column",column),1);
				// 	window.localStorage.setItem(current_cube_name,JSON.stringify(freeArr));
				// }
				window.localStorage.removeItem(current_cube_name);
				checkedHandle = true;
				if (this.checked) {
					if(arr){
						if(columnType.isTypeDate()){
							var index = checkSelectConditionDict[column].indexOf(columnContent.replace(/T/g," "));
						}else{
							var index = checkSelectConditionDict[column].indexOf(columnContent);
						}
						
						if ( index != -1) {
							checkSelectConditionDict[column].splice(index,1);
							if($(this).parent().parent().attr("checkwithcount") != undefined && $(this).parent().parent().attr("checkwithcount") != ""){

								for(var z = 0; z < $(this).parent().parent().attr("checkwithcount").split("_YZYPD_").length; z++){
									checkSelectConditionDict[$(this).parent().parent().attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[0]].splice(checkSelectConditionDict[$(this).parent().parent().attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[0]].indexOf($(this).parent().parent().attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[1]),1);
									$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+$(this).parent().parent().attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[0].replace(/\./g,"YZY")).find(".field_detail_list li[checkvalue="+$(this).parent().parent().attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[1]+"]").find("input").eq(0).prop("checked",true);
									$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list li."+$(this).parent().parent().attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[0].replace(/\./g,"YZY")).find(".field_detail_list li[checkvalue="+$(this).parent().parent().attr("checkwithcount").split("_YZYPD_")[z].split("_YZY_")[1]+"]").removeAttr("checkwithcount");
								}
								$(this).parent().parent().removeAttr("checkwithcount");
							}
						}
					}
					
				}else{
					if(!arr){
						checkSelectConditionDict[column] = [];
					}
					var index = checkSelectConditionDict[column].indexOf(columnContent);
					if ( index == -1) {
						if(checkSelectConditionDict[aDemi].length+1 >= fieldDetailContent_ul.children("li").length){
							$(this).prop("checked",true);
							return;
						}

						if(columnType.isTypeDate()){
							checkSelectConditionDict[column].push(columnContent.replace(/T/g," "));
						}else{
							checkSelectConditionDict[column].push(columnContent);
						}
						

					}
					
				}
				saveSelectionCondtion(current_cube_name,checkSelectConditionDict);
				filterSuccessFun();
			});
		}
		
		var filterDetialShowDiv = $("<div class='filterBox' showOrHiden ='hiden'><p class='detail_logo'>筛选明细</p><ul class='filter_list'></ul><div class='bottomHandleDiv'><div class='switchDiv' switch='on'><img src='/static/dashboard/img/open.png'/></div><div class='deleteRecordDiv'><img src='/static/dashboard/img/delete_small.png'/></div></div></div>");
		filterDetialShowDiv.insertBefore(fieldDetailContent_ul);
		filterDetialShowDiv.click(function(event){event.stopPropagation();});
		
		filterDetialShowDiv.find(".bottomHandleDiv .switchDiv").click(function(event){
			event.stopPropagation();
			var column = $(this).parents(".filterBox").parents(".filterLI").eq(0).data("fieldInfo").split(":")[0];
			
			var filterNotWorkArr = getColumnFilterNotWorkedColumns(current_cube_name);
			loc_storage.removeItem("allTable_specialSelection");
			checkedHandle =true;
			if($(this).attr("switch") == "on"){
				$(this).attr("switch","off");
				$(this).children("img").eq(0).attr("src","/static/dashboard/img/close.png");
				if(filterNotWorkArr.indexOf(column) == -1){
					filterNotWorkArr.push(column);
					saveColumnFilterNotWorkedColumns(current_cube_name,filterNotWorkArr);
					filterSuccessFun();
				}
				
			}else{
				$(this).attr("switch","on");
				$(this).children("img").eq(0).attr("src","/static/dashboard/img/open.png");
				var index=  filterNotWorkArr.indexOf(column)
				if( index != -1){
					filterNotWorkArr.splice(index,1);
					saveColumnFilterNotWorkedColumns(current_cube_name,filterNotWorkArr);
					filterSuccessFun();
				}
			}
		});
		
		filterDetialShowDiv.find(".bottomHandleDiv .deleteRecordDiv").click(function(event){
			event.stopPropagation();
			var needDeleteLi = $(this).parents(".filterBox").find("ul.filter_list li.active").eq(0);
			needDeleteLi.remove();
			localStoragedeleteData(current_cube_name,needDeleteLi.attr("index"));
			filterSuccessFun();
			loc_storage.removeItem("allTable_specialSelection");
			checkedHandle =true;
		});
		
	}
}
