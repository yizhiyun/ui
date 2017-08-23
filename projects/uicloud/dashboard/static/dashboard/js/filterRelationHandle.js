// 处理仪表板界面 跟筛选器相关的内容
// 用来记录当前正在表详细中操作的列或者行元素
var currentHandleColOrRowEles = null;
var filterNotWorkArr = [];
var checkSelectConditionDict = {};
$(function(){
	
	$('.custom-select').comboSelect();
	
	// 筛选器部分，顶部筛选按钮点击的时候
	$("#dashboard_content #sizer_place #sizer_content .filter_header_div div.filter_content_btn").click(function(){
		event.stopPropagation();
		editFilterViewShow_fun("dashBoard",filterSuccessFun);
	});
		
});
// 筛选器筛选数据成功，回调函数
function filterSuccessFun(){
	var tableInfo = current_cube_name;
	var conditions = [];
	if(conditionFilter_record[tableInfo]) {
		conditions = conditionFilter_record[tableInfo]["common"].concat(conditionFilter_record[tableInfo]["condition"]);
	}
	for(var key in checkSelectConditionDict){
		var valuesArr = checkSelectConditionDict[key];
		if(valuesArr && valuesArr.length >0){
			var filter = {"type":"isnotin","columnName":key,"value":valuesArr};
			conditions.push(filter);
		}
	}
	if(conditions.length < 1){ // 没有条件就不进行筛选
		_cube_all_data[tableInfo]["data"] = filterNeedAllData.slice(0);
		isagainDrawTable = true;
		switch_chart_handle_fun("sortable");
		return;
	}
	var postFilterCondition = {
		"conditions": conditions
	}
	$.ajax({
		url:"/cloudapi/v1/tables/"+tableInfo+"/all",
		type:"post",
		dataType:"json",
		contentType: "application/json; charset=utf-8",
		async: true,
		data:JSON.stringify(postFilterCondition),
		success:function(data){
			_cube_all_data[tableInfo] = data["results"];
			var schema = _cube_all_data[tableInfo]["schema"];
			for(var i = 0;i < schema.length;i++){
				schema[i]["isable"] = "yes";
			}
			isagainDrawTable = true;
			switch_chart_handle_fun("sortable");
		}
	});
	
}

// drawType:add,delete；columnNameInfo:维度列名；
function rightFilterListDraw(drawType,columnNameInfo){
	
	var columnInfoArr = columnNameInfo.split(":");
	if(drawType == "add"){
		$("#dashboard_content #sizer_place #sizer_content .filter_body_div .cubeTableName").html(current_cube_name);
	
		var li = $("<li openFlag='on' class='filterLI'><div class='field_header_div'><img class='openAndCloseImg' src='/static/dataCollection/images/left_40.png'/><div class='fieldWholeDiv'><span class='fieldName'>"+columnInfoArr[0]+"</span><div class='filterSelectImgDiv'><img/></div><div class='filterDetailImgDiv'><img src='/static/dashboard/img/3filter_details.png'/></div></div></div></li>");
		li.addClass(columnInfoArr[0]);
		li.data("fieldInfo",columnNameInfo);
		if(columnInfoArr[1].isTypeString()){
			li.find(".filterSelectImgDiv img").attr("src","/static/dashboard/img/3filter_text.png");
		}else if(columnInfoArr[1].isTypeNumber()){
			li.find(".filterSelectImgDiv img").attr("src","/static/dashboard/img/3filter_value.png");
		}else if(columnInfoArr[1].isTypeDate()){
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
		
		var fieldDetailContent_ul = $("<ul class='field_detail_list'></ul");
		fieldDetailContent_ul.click(function(event){event.stopPropagation();});
		
		li.append(fieldDetailContent_ul);
		var currentData = _cube_all_data[current_cube_name]["data"];
		var help_remove_repeatArr = [];
		for (var i =0;i < currentData.length;i++) {
			var lineItem = currentData[i];
			if(help_remove_repeatArr.indexOf(lineItem[columnInfoArr[0]]) != -1){
				continue;
			}
			var detail_li = $("<li><label><input type='checkbox' checked/><span class='filedContentName'>"+lineItem[columnInfoArr[0]]+"</span></label></li>");
			help_remove_repeatArr.push(lineItem[columnInfoArr[0]]);
			fieldDetailContent_ul.append(detail_li);
			detail_li.find("input").change(function(event){
				var column = $(this).parents("li.filterLI").eq(0).data("fieldInfo").split(":")[0];
				var columnContent = $(this).parent("label").children("span.filedContentName").html();
				var arr = checkSelectConditionDict[column];
				if (this.checked) {
					if(arr){
						var index = checkSelectConditionDict[column].indexOf(columnContent);
						if ( index != -1) {
							checkSelectConditionDict[column].splice(index,1);
						}
					}
					
				}else{
					if(!arr){
						checkSelectConditionDict[column] = [];
					}
					var index = checkSelectConditionDict[column].indexOf(columnContent);
					if ( index == -1) {
						checkSelectConditionDict[column].push(columnContent);
					}
				}
				getCurrentTableFilterData(current_cube_name);
				filterSuccessFun();
			});
		}
		delete help_remove_repeatArr;
		
		var filterDetialShowDiv = $("<div class='filterBox' showOrHiden ='hiden'><p class='detail_logo'>筛选明细</p><ul class='filter_list'></ul><div class='bottomHandleDiv'><div class='switchDiv' switch='on'><img src='/static/dashboard/img/open.png'/></div><div class='deleteRecordDiv'><img src='/static/dashboard/img/delete_small.png'/></div></div></div>");
		filterDetialShowDiv.insertBefore(fieldDetailContent_ul);
		filterDetialShowDiv.click(function(event){event.stopPropagation();});
		
		filterDetialShowDiv.find(".bottomHandleDiv .switchDiv").click(function(event){
			event.stopPropagation();
			var column = $(this).parents(".filterBox").parents(".filterLI").eq(0).data("fieldInfo").split(":")[0];
			if($(this).attr("switch") == "on"){
				$(this).attr("switch","off");
				$(this).children("img").eq(0).attr("src","/static/dashboard/img/close.png");	
				if(filterNotWorkArr.indexOf(column) == -1){
					filterNotWorkArr.push(column);
					getCurrentTableFilterData(current_cube_name,filterNotWorkArr);
					filterSuccessFun();
				}
				
			}else{
				$(this).attr("switch","on");
				$(this).children("img").eq(0).attr("src","/static/dashboard/img/open.png");
				var index=  filterNotWorkArr.indexOf(column)
				if( index != -1){
					filterNotWorkArr.splice(index,1);
					getCurrentTableFilterData(current_cube_name,filterNotWorkArr);
					filterSuccessFun();
				}
			}
		});
		
		filterDetialShowDiv.find(".bottomHandleDiv .deleteRecordDiv").click(function(event){
			event.stopPropagation();
			var needDeleteLi = $(this).parents(".filterBox").find("ul.filter_list li.active").eq(0);
			needDeleteLi.remove();
			localStoragedeleteData(current_cube_name,needDeleteLi.attr("index"));
			getCurrentTableFilterData(current_cube_name);
			filterSuccessFun();
		});
		
		
	}else if(drawType == "delete"){
		$("#dashboard_content #sizer_place #sizer_content .filter_body_div .table_field_list ."+columnInfoArr[0]).eq(0).hide("blind",200,function(){
			$(this).remove();
		});
	}
}
