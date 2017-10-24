
//记录当前表格体现了哪些 行维度  元素
var  record_table_now_row_dimensionaluty = [];
// 记录当前表格体现了哪些 列维度元素
var record_table_now_column_dimensionaluty = [];
// 记录当前表格体现的度量数量
var record_table_measure = [];
// 记录当前表格度量的计算方式
var record_table_calculate_measure = {};

// 记录当前表格度量的具体计算方式
var  record_table_custom_calculate = {};

// 记录当前表格所用到的所有数据
var current_Table_allData = null;

// 通过设置此参数可以强制重新绘制 table
var isagainDrawTable = false;

// 用来保证度量的计算正确
var isRowFinished = false;
var isColumnFinished = false;

function showTable_by_dragData(){

	// 绘制行数据
	function function_draw_row_data(needAllData){

		var need_Handle_drag_row_dimensionality = drag_row_column_data["row"]["dimensionality"];
		var rowLeftTable = $("#text_table_need_show .left_row_container table").eq(0);
		rowLeftTable.find("thead tr").empty();
		rowLeftTable.find("tbody").empty();
		for (var i = 0;i < needAllData.length;i++) {
			var aData = needAllData[i];
				// 具体每行的数据
				var tr = $("<tr></tr>");
				$(rowLeftTable).find("tbody").append(tr);
				// 先处理行
				for(var row_i = 0;row_i < need_Handle_drag_row_dimensionality.length;row_i++){
					var row_name = need_Handle_drag_row_dimensionality[row_i].split(":")[0];
					if(i == 0){
						var th = $("<th>"+row_name+"</th>");
						rowLeftTable.find("thead tr").append(th);
					}
					var className = "";
					for (var class_i = 0;class_i <=row_i; class_i++) {
						var oneRowName = need_Handle_drag_row_dimensionality[class_i].split(":")[0];
						className += aData[oneRowName]+"_YZYPD_";
					}
					className = md5(className);
					if ($(rowLeftTable).find("tbody tr td."+className).length && $(rowLeftTable).find("tbody tr td."+className).length > 0) {
						var originrowspan = Number($(rowLeftTable).find("tbody tr td."+className).attr("rowspan"));
						$(rowLeftTable).find("tbody tr td."+className).attr("rowspan",originrowspan+1);
					}else{

						var td = $("<td class='"+className+"' rowspan='1'>"+aData[row_name]+"</td>");
						if(row_i == 0){
							td.addClass("firstRow");
						}
						tr.append(td);
					}	
				}
				if($(tr).children().length < 1){
					$(tr).remove();
				}
		}
	}
	// 绘制列数据
	function function_draw_column_data(needAllData){
		var need_Handle_drag_column_dimensionality = drag_row_column_data["column"]["dimensionality"];
		$("#text_table_need_show .top_column_container .column_data_list tbody").empty();
		for (var i = 0;i < needAllData.length;i++) {
			var aData = needAllData[i];
			var topTitle = "";
				for(var column_i = 0;column_i < need_Handle_drag_column_dimensionality.length;column_i++){
					var aColumnName = need_Handle_drag_column_dimensionality[column_i].split(":")[0];
					if(i == 0){
						topTitle += aColumnName+"/";
						var tr = $("<tr class="+aColumnName+"></tr>");
						$("#text_table_need_show .top_column_container .column_data_list tbody").eq(0).append(tr);
					}
					
					
					var className = "";
					for (var class_i = 0;class_i <=column_i; class_i++) {
						var oneColumnName = need_Handle_drag_column_dimensionality[class_i].split(":")[0];	
						className += aData[oneColumnName]+"_YZYPD_";
					}
					className = md5(className);
					if($("#text_table_need_show .top_column_container .column_data_list tbody tr."+aColumnName + " td."+className).length&&$("#text_table_need_show .top_column_container .column_data_list tbody tr."+aColumnName + " td."+className).length > 0){
						var colsSpan = Number($("#text_table_need_show .top_column_container .column_data_list tbody tr."+aColumnName + " td."+className).attr("colspan"));
						$("#text_table_need_show .top_column_container .column_data_list tbody tr."+aColumnName + " td."+className).attr("colspan",colsSpan+1);
					}else{
						var td = $("<td colspan='1'>"+aData[aColumnName]+"</td>");
						td.addClass(className);
						$("#text_table_need_show .top_column_container .column_data_list tbody tr."+aColumnName).eq(0).append(td);
					}
					
					
				}
				if(i == 0){
					topTitle = topTitle.slice(0,-1);
					$("#text_table_need_show .right_module .top_column_container .top_column_name").eq(0).html(topTitle);
				}
		}
	}
	
	function function_draw_row_line(){
		$("#text_table_need_show #data_list_for_body li").remove();
//		 创建 li
		var columnInfo = $("#text_table_need_show .top_column_container .column_data_list tbody tr").length;
		$("#text_table_need_show .left_row_container table tbody tr").each(function(index,ele){
			var aLi = $("<li></li>");
			aLi.css("height",$(ele).innerHeight());
			if(columnInfo < 1){
				if(index == 0){
					aLi.css({
					"border-top":"1px solid #dedede",
					"border-right":"1px solid #dedede"
					});
				}else{
					aLi.css({
					"border-right":"1px solid #dedede"
					});
				}	
			}
			$("#text_table_need_show #data_list_for_body").append(aLi);
		});		
		if($("#text_table_need_show .left_row_container table tbody tr").length < 1 && columnInfo > 0){
			var ali = $("<li></li>");
			ali.css("height","25px");
			$("#text_table_need_show #data_list_for_body").append(ali);
		}
		
	}
	function function_draw_column_line(){
		$("#text_table_need_show #data_list_for_body div.vertical_line").remove();
		$("#text_table_need_show .top_column_container .column_data_list tbody tr:last td").each(function(index,ele){
			
			var vertical_line = $("<div class='vertical_line'></div>");
			vertical_line.css("left",(index+1)*$(ele).outerWidth());
			$("#text_table_need_show #data_list_for_body").append(vertical_line);
			
		});
	}
	
	// 处理度量，进行绘制
	function function_draw_measure_data(needAllData){
		$("#text_table_need_show .content_body #data_list_for_body .measureDiv").remove();
		var allMeasure = specialRemoveDataTypeHandle(drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]));
		var allRowDemi = specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"]);
		var allColumnDemi = specialRemoveDataTypeHandle(drag_row_column_data["column"]["dimensionality"]);
		for(var i = 0;i < needAllData.length;i++){
			var aData = needAllData[i];
			var measureDiv = $("<div class='measureDiv'></div>");
			for(var j = 0;j < allMeasure.length;j++){
				var aMeasure = allMeasure[j];
				var span = $("<span>"+aData[drag_measureCalculateStyle[aMeasure]]+"</span>");
				measureDiv.append(span);
				if(j != allMeasure.length - 1){
					measureDiv.append("<span class='seperate'>/</span>");
				}	
			}
			$("#text_table_need_show .content_body #data_list_for_body").append(measureDiv);
			var rowClass = "";
			for(var row_i = 0;row_i < allRowDemi.length;row_i++){
				
				rowClass += aData[allRowDemi[row_i]]+"_YZYPD_";
			}
			var columnClass = "";
			for(var column_i = 0;column_i < allColumnDemi.length;column_i++){
				
				columnClass += aData[allColumnDemi[column_i]]+"_YZYPD_";
			}
			rowClass = md5(rowClass);
			columnClass = md5(columnClass);
			var topValue = 0;
			var leftValue = 0;
			if(rowClass!=""){
				var topHelpTr = $("#text_table_need_show .left_row_container table tbody tr td."+rowClass).parent("tr").eq(0);
				topValue = topHelpTr.outerHeight() * topHelpTr.index();
			}
			if(columnClass !=""){
				var leftHelpTd = $("#text_table_need_show .top_column_container .column_data_list tbody tr td."+columnClass).eq(0);
				leftValue = leftHelpTd.outerWidth() * leftHelpTd.index();
			}
			measureDiv.css({
				"top":topValue,
				"left":leftValue
			})
		}
		
	}
	
	function init(needData){
		//1、处理维度
		 var current_all_measure = drag_row_column_data["column"]["measure"].concat(drag_row_column_data["row"]["measure"]);
		var isRowDemiEqual =  equalCompare(record_table_now_row_dimensionaluty,drag_row_column_data["row"]["dimensionality"]);
		var isColumnDemiEqual = equalCompare(record_table_now_column_dimensionaluty,drag_row_column_data["column"]["dimensionality"]);
		var isMeasureEqual = equalCompare(record_table_measure,drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]));
		var isCalculateMeasureEqual = equalCompare(record_table_calculate_measure,drag_measureCalculateStyle);
		var isCustomCalculateStyleEqual = equalCompare(record_table_custom_calculate,customCalculate);
		
		function recordData(){
			record_table_now_row_dimensionaluty = objectDeepCopy(drag_row_column_data["row"]["dimensionality"]);
			record_table_now_column_dimensionaluty = objectDeepCopy(drag_row_column_data["column"]["dimensionality"]);
			record_table_measure = objectDeepCopy(drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]));
			record_table_calculate_measure = objectDeepCopy(drag_measureCalculateStyle);
			record_table_custom_calculate = objectDeepCopy(customCalculate);
			isagainDrawTable = false;
		}
		
		function measureNeedDraw(finish){
			if(specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"])).length >= 0 && specialRemoveDataTypeHandle(current_all_measure).length >0){
					recordData();
					measure_Hanlde(specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"])),specialRemoveDataTypeHandle(current_all_measure),null,function(data){
						function_draw_row_line();
						function_draw_column_line();
						function_draw_measure_data(data);
						layout_table_size();
						if(finish){
							finish();

						}
				});
			}else{
				recordData();
				$("#text_table_need_show .content_body #data_list_for_body .measureDiv").remove();
				$("#text_table_need_show #data_list_for_body div.vertical_line").remove();
				$("#text_table_need_show #data_list_for_body li").remove();
			}

		}
		function rowNeedDraw(finish){
			if(specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"]).length > 0){
				recordData();
				measure_Hanlde(specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"]),[],null,function(data){
			 	function_draw_row_data(data);
			 	layout_table_size();		 	
			 	 if(finish){
			 	 	finish();
			 	 }
				});
			}else{
				var rowLeftTable = $("#text_table_need_show .left_row_container table").eq(0);
				rowLeftTable.find("thead tr").empty();
				rowLeftTable.find("tbody").empty();
				if(finish){
					finish("noNeed");
				}
			}
			
		}
		
		function columnNeedDraw(finish){
			if(specialRemoveDataTypeHandle(drag_row_column_data["column"]["dimensionality"]).length > 0){
				recordData();
				measure_Hanlde(specialRemoveDataTypeHandle(drag_row_column_data["column"]["dimensionality"]),[],null,function(data){
		 	 	function_draw_column_data(data);
		 	 	layout_table_size(); 	
		 	 	 if(finish){
		 	 	 	finish();
		 	 	 }
		 		 });
			}else{
				$("#text_table_need_show .top_column_container .column_data_list tbody").empty();
				if(finish){
					finish("noNeed");
				}
			}
			
		}
		$("#text_table_need_show").show();
		if(isagainDrawTable){
			isRowFinished = false;
			isColumnFinished = false;
			rowNeedDraw(function(){
				isRowFinished = true;
				if(isRowFinished&&isColumnFinished){
					measureNeedDraw();
				}
			});
			columnNeedDraw(function(){
				isColumnFinished = true;
				if(isRowFinished&&isColumnFinished){
					measureNeedDraw();
				}
			});
			
		}else{
			if(isRowDemiEqual && isColumnDemiEqual&&isMeasureEqual&&isCalculateMeasureEqual&&isCustomCalculateStyleEqual){
				// 直接显示
			}else if(isRowDemiEqual && isColumnDemiEqual){
				measureNeedDraw();

			}else if(!isRowDemiEqual && isColumnDemiEqual){
				rowNeedDraw(function(){
					measureNeedDraw();
				});
				
			}else if(isRowDemiEqual && !isColumnDemiEqual){
				columnNeedDraw(function(){
					measureNeedDraw();
				});
				
			}else{
				isRowFinished = false;
				isColumnFinished = false;
				rowNeedDraw(function(){
					isRowFinished = true;
					if(isRowFinished&&isColumnFinished){
						measureNeedDraw();
					}
				});
				columnNeedDraw(function(){
					isColumnFinished = true;
					if(isRowFinished&&isColumnFinished){
						measureNeedDraw();
					}
				});
			}
			
		}
		
		// spinner.stop();
	}
	init();
	
}



//	布局 autoSize
function layout_table_size(){
		// 为了让浮动不换行，动态计算左侧模块的宽度
		// 1、计算左侧行的宽度
		
		var left_row_width = $("#text_table_need_show .left_row_container").eq(0).outerWidth();
		$("#text_table_need_show .right_module").css("margin-left",left_row_width + "px");
		// 左侧行设置 th 的高度
		var top_height = $("#text_table_need_show .right_module .top_column_container").eq(0).height();
		$("#text_table_need_show .left_row_container table th").css("height",top_height -1);
		// setTimeout(function(){
		// 	 spinner.stop();
		// },100)
}



function emptyAllTable(){
	$("#text_table_need_show .top_column_container .column_data_list tbody").empty();
	var rowLeftTable = $("#text_table_need_show .left_row_container table").eq(0);
	rowLeftTable.find("thead tr").empty();
	rowLeftTable.find("tbody").empty();
	$("#text_table_need_show #data_list_for_body div.vertical_line").remove();
	$("#text_table_need_show #data_list_for_body li").remove();
}






