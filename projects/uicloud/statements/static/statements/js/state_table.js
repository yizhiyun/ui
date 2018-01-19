
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


//记录传递过来的className

var storeClass = null;

var indexClass = null;
function reporting_showTable_by_dragData(save_allTable){

	for(var i = 0; i < save_allTable.length;i++){
		(function(index){
			manyTable(save_allTable[index])
		})(i);
	}
}

function manyTable(storeClass){
	storeClass = storeClass;

	var storeNum_toview = storeClass.match(/\d+/g)[1];

	// var target =  $("."+storeClass+"").get(0);

 //  	spinner.spin(target);
 	$("."+storeClass+"").append("<div class=tl><div class=loader></div><div class=sm>数据获取中</div></div>");
	if($(".tl").css("display") == 'block'){
		$("."+storeClass+"").css("opacity","0.8");
	}
	if($("."+storeClass+"").find(".tl").length > 1){
		$("."+storeClass+"").find("div").remove(".tl:not(:first)");
	}

  	emptyAllTable();
	// 绘制行数据
	function function_draw_row_data(needAllData){
		var need_Handle_drag_row_dimensionality = drag_row_column_data_arr[storeNum_toview]["row"]["dimensionality"];
		var rowLeftTable = $("."+storeClass+" .left_row_container table").eq(0);
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
		var need_Handle_drag_column_dimensionality = drag_row_column_data_arr[storeNum_toview]["column"]["dimensionality"];
		$("."+storeClass+" .top_column_container .column_data_list tbody").empty();
		for (var i = 0;i < needAllData.length;i++) {
			var aData = needAllData[i];
			var topTitle = "";
				for(var column_i = 0;column_i < need_Handle_drag_column_dimensionality.length;column_i++){
					var aColumnName = need_Handle_drag_column_dimensionality[column_i].split(":")[0];
					if(i == 0){
						topTitle += aColumnName+"/";
						var tr = $("<tr class="+aColumnName+"></tr>");
						$("."+storeClass+" .top_column_container .column_data_list tbody").eq(0).append(tr);
					}


					var className = "";
					for (var class_i = 0;class_i <=column_i; class_i++) {
						var oneColumnName = need_Handle_drag_column_dimensionality[class_i].split(":")[0];
						className += aData[oneColumnName]+"_YZYPD_";
					}
					className = md5(className);
					if($("."+storeClass+" .top_column_container .column_data_list tbody tr."+aColumnName + " td."+className).length&&$("."+storeClass+" .top_column_container .column_data_list tbody tr."+aColumnName + " td."+className).length > 0){
						var colsSpan = Number($("."+storeClass+" .top_column_container .column_data_list tbody tr."+aColumnName + " td."+className).attr("colspan"));
						$("."+storeClass+" .top_column_container .column_data_list tbody tr."+aColumnName + " td."+className).attr("colspan",colsSpan+1);
					}else{
						var td = $("<td colspan='1'>"+aData[aColumnName]+"</td>");
						td.addClass(className);
						$("."+storeClass+" .top_column_container .column_data_list tbody tr."+aColumnName).eq(0).append(td);
					}


				}
				if(i == 0){
					topTitle = topTitle.slice(0,-1);
					$("."+storeClass+" .right_module .top_column_container .top_column_name").eq(0).html(topTitle);
				}
		}
	}

	function function_draw_row_line(){
		$("."+storeClass+" #data_list_for_body li").remove();
		// 创建 li
		var columnInfo = $("."+storeClass+" .top_column_container .column_data_list tbody tr").length;
		 $("."+storeClass+" .left_row_container table tbody tr").each(function(index,ele){
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
			$("."+storeClass+" #data_list_for_body").append(aLi);
		});

		if($("."+storeClass+" .left_row_container table tbody tr").length < 1 && columnInfo > 0){
			var ali = $("<li></li>");
			ali.css("minHeight","25px");
			ali.css("height",$("."+storeClass+" #data_list_for_body .measureDiv").eq(0).actual("outerHeight"));
			$("."+storeClass+" #data_list_for_body").append(ali);
		}

	}
	function function_draw_column_line(){
		$("."+storeClass+" #data_list_for_body div.vertical_line").remove();
		$("."+storeClass+" .top_column_container .column_data_list tbody tr:last td").each(function(index,ele){

			var vertical_line = $("<div class='vertical_line'></div>");
			vertical_line.css("left",(index+1)*$(ele).actual("outerWidth"));
			$("."+storeClass+" #data_list_for_body").append(vertical_line);

		});
	}

	// 处理度量，进行绘制
	function function_draw_measure_data(needAllData){
		$("."+storeClass+" .content_body #data_list_for_body .measureDiv").remove();
		var allMeasure = specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["row"]["measure"].concat(drag_row_column_data_arr[storeNum_toview]["column"]["measure"]));
		var allRowDemi = specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["row"]["dimensionality"]);
		var allColumnDemi = specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["column"]["dimensionality"]);
		var unitFinalWidth = 0;
		for(var i = 0;i < needAllData.length;i++){
			var aData = needAllData[i];
			var measureDiv = $("<div class='measureDiv'></div>");
			var theWidth = 0;
			for(var j = 0;j < allMeasure.length;j++){
				var aMeasure = allMeasure[j];
				var aP = $("<p>"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]+":"+aData[drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]]+"</p>");
				measureDiv.append(aP);
				var tongbiShowNum = 0;
				var huanbiShowNum = 0;
				if(aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]]){
					tongbiShowNum = (Number(aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]]) * 100).toFixed(2);
				}
				if(aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]]){
					huanbiShowNum = (Number(aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]]) * 100).toFixed(2);
				}
				var tongbiAp = $("<p style='display:none' class='compareP'>同比("+aMeasure+"):"+tongbiShowNum+"%</p>");
				var huanbiAp = $("<p style='display:none' class='linkP'>环比("+aMeasure+"):"+huanbiShowNum+"%</p>");
				tongbiAp.addClass(aMeasure);
				huanbiAp.addClass(aMeasure);
				if(eval(statements_tonghuanbi_arr[storeNum_toview])[0].indexOf(aMeasure) != -1){
					tongbiAp.show();
				}
				if(eval(statements_tonghuanbi_arr[storeNum_toview])[1].indexOf(aMeasure) != -1){
					huanbiAp.show();
				}
				measureDiv.append(tongbiAp);
				measureDiv.append(huanbiAp);
				theWidth = threeMaxOfNumber($(aP).text().visualLength(12)+10,$(tongbiAp).text().visualLength(12)+10,$(huanbiAp).text().visualLength(12)+10);
			}
			$("."+storeClass+" .content_body #data_list_for_body").append(measureDiv);
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
				var topHelpTr = $("."+storeClass+" .left_row_container table tbody tr td."+rowClass).parent("tr").eq(0);
				topHelpTr.css("height",measureDiv.actual("outerHeight"));
				topValue = topHelpTr.actual("outerHeight") * topHelpTr.index();
				measureDiv.data("topIndex",topHelpTr.index());
				if(topHelpTr.index() < 0){
					measureDiv.data("topIndex",0);
					topValue = 0;
				}

			}else{
				measureDiv.data("topIndex",0);
			}
			if(columnClass !=""){
				var leftHelpTd = $("."+storeClass+" .top_column_container .column_data_list tbody tr td."+columnClass).eq(0);
				if(leftHelpTd[0] && leftHelpTd.actual("outerWidth") > theWidth){
					theWidth = leftHelpTd.actual("outerWidth");
				}
				if(leftHelpTd.index() >= 0){
					// leftValue = theWidth * leftHelpTd.index();
					measureDiv.data("leftIndex",leftHelpTd.index());
				}
				var tableWidth = $("."+storeClass+" .top_column_container .column_data_list tbody tr:last td").length;
				$("."+storeClass+" .top_column_container .column_data_list tbody tr td").css("width",theWidth);
				$("."+storeClass+" .top_column_container .column_data_list").css("width",theWidth*tableWidth+"px");
				if(tableWidth < 1 && $("."+storeClass+" #data_list_for_body").actual("outerWidth") < theWidth){
					$("."+storeClass+" #data_list_for_body").css("width",theWidth+5+"px");
				}else if(tableWidth > 0){
					$("."+storeClass+" #data_list_for_body").css("width","");
				}
				unitFinalWidth = theWidth;
			}else{
				measureDiv.data("leftIndex",0);
			}
			measureDiv.css({
				"top":topValue,
			})
		}
		$("."+storeClass+" .content_body #data_list_for_body .measureDiv").each(function(index,ele){
			$(ele).css("left",$(ele).data("leftIndex") *unitFinalWidth-1);
		});
	}

	function init(needData){
		//1、处理维度
		 var current_all_measure = drag_row_column_data_arr[storeNum_toview]["column"]["measure"].concat(drag_row_column_data_arr[storeNum_toview]["row"]["measure"]);
		var isRowDemiEqual =  equalCompare(record_table_now_row_dimensionaluty,drag_row_column_data_arr[storeNum_toview]["row"]["dimensionality"]);
		var isColumnDemiEqual = equalCompare(record_table_now_column_dimensionaluty,drag_row_column_data_arr[storeNum_toview]["column"]["dimensionality"]);
		var isMeasureEqual = equalCompare(record_table_measure,drag_row_column_data_arr[storeNum_toview]["row"]["measure"].concat(drag_row_column_data_arr[storeNum_toview]["column"]["measure"]));
		var isCalculateMeasureEqual = equalCompare(record_table_calculate_measure,drag_measureCalculateStyle_arr[storeNum_toview]);
		var isCustomCalculateStyleEqual = equalCompare(record_table_custom_calculate,customCalculate);

		function recordData(){
			record_table_now_row_dimensionaluty = objectDeepCopy(drag_row_column_data_arr[storeNum_toview]["row"]["dimensionality"]);
			record_table_now_column_dimensionaluty = objectDeepCopy(drag_row_column_data_arr[storeNum_toview]["column"]["dimensionality"]);
			record_table_measure = objectDeepCopy(drag_row_column_data_arr[storeNum_toview]["row"]["measure"].concat(drag_row_column_data_arr[storeNum_toview]["column"]["measure"]));
			record_table_calculate_measure = objectDeepCopy(drag_measureCalculateStyle_arr[storeNum_toview]);
			record_table_custom_calculate = objectDeepCopy(customCalculate);
			isagainDrawTable = false;
		}

		function measureNeedDraw(finish){
			if(specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["row"]["dimensionality"].concat(drag_row_column_data_arr[storeNum_toview]["column"]["dimensionality"])).length > 0 && specialRemoveDataTypeHandle(current_all_measure).length >0){
					recordData();
					reporting_measure_Hanlde(specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["row"]["dimensionality"].concat(drag_row_column_data_arr[storeNum_toview]["column"]["dimensionality"])),specialRemoveDataTypeHandle(current_all_measure),null,storeNum_toview,function(data){
						function_draw_measure_data(data);
						function_draw_row_line();
						function_draw_column_line();
						layout_table_size();
						if(finish){
							finish();
						}
				},storeClass);
			}
		}
		function rowNeedDraw(finish){
			if(specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["row"]["dimensionality"]).length > 0){
				recordData();
				reporting_measure_Hanlde(specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["row"]["dimensionality"]),[],null,storeNum_toview,function(data){
			 	function_draw_row_data(data);
			 	layout_table_size();
				// spinner.stop(target);
				$("."+storeClass+"").find("div").remove(".tl");

			 	 if(finish){
			 	 	finish();
			 	 }
				},storeClass);
			}else{
				var rowLeftTable = $("."+storeClass+" .left_row_container table").eq(0);
				rowLeftTable.find("thead tr").empty();
				rowLeftTable.find("tbody").empty();
				if(finish){
					finish("noNeed");
				}
			}

		}

		function columnNeedDraw(finish){
			if(specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["column"]["dimensionality"]).length > 0){
				recordData();
				reporting_measure_Hanlde(specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["column"]["dimensionality"]),[],null,storeNum_toview,function(data){
		 	 	function_draw_column_data(data);
		 	 	layout_table_size();
				// spinner.stop(target);
				$("."+storeClass+"").find("div").remove(".tl");

		 	 	 if(finish){
		 	 	 	finish();
		 	 	 }
		 		 },storeClass);
			}else{
				$("."+storeClass+" .top_column_container .column_data_list tbody").empty();
				if(finish){
					finish("noNeed");
				}
			}
		}
		function spinnerIsNeedStopFunction(){
			if(isRowFinished && isColumnFinished){
				// spinner.stop();
				$("."+storeClass+"").find("div").remove(".tl");
			}
		}
		$("."+storeClass+"").show();
		if(isagainDrawTable){
			isRowFinished = false;
			isColumnFinished = false;
			rowNeedDraw(function(){
				isRowFinished = true;
				if(isRowFinished&&isColumnFinished){
					measureNeedDraw(spinnerIsNeedStopFunction);
				}
			});
			columnNeedDraw(function(){
				isColumnFinished = true;
				if(isRowFinished&&isColumnFinished){
					measureNeedDraw(spinnerIsNeedStopFunction);
				}
			});

		}else{
			if(isRowDemiEqual && isColumnDemiEqual&&isMeasureEqual&&isCalculateMeasureEqual&&isCustomCalculateStyleEqual){
				// 直接显示
				// spinner.stop(target);
				$("."+storeClass+"").find("div").remove(".tl");
			}else if(isRowDemiEqual && isColumnDemiEqual){
				measureNeedDraw(function(){
					// spinner.stop();
				$("."+storeClass+"").find("div").remove(".tl");
				});
			}else if(!isRowDemiEqual && isColumnDemiEqual){
				rowNeedDraw(function(){
					measureNeedDraw(function(){
						// spinner.stop();
						$("."+storeClass+"").find("div").remove(".tl");
					});
				});

			}else if(isRowDemiEqual && !isColumnDemiEqual){
				columnNeedDraw(function(){
					measureNeedDraw(function(){
						// spinner.stop();
						$("."+storeClass+"").find("div").remove(".tl");
					});
				});

			}else{
				isRowFinished = false;
				isColumnFinished = false;
				rowNeedDraw(function(){
					isRowFinished = true;
					if(isRowFinished&&isColumnFinished){
						measureNeedDraw(spinnerIsNeedStopFunction);
					}
				});
				columnNeedDraw(function(){
					isColumnFinished = true;
					if(isRowFinished&&isColumnFinished){
						measureNeedDraw(spinnerIsNeedStopFunction);
					}
				});
			}

		}


	}
	init();










//	布局 autoSize
	function layout_table_size(){
		// 为了让浮动不换行，动态计算左侧模块的宽度
		// 1、计算左侧行的宽度

		var left_row_width = $("."+storeClass+" .left_row_container").eq(0).actual("outerWidth");
		$("."+storeClass+" .right_module").css("margin-left",left_row_width + 30 + "px").css("margin-top","30px");
		// 左侧行设置 th 的高度
		var top_height = $("."+storeClass+" .right_module .top_column_container").eq(0).height();
		$("."+storeClass+" .left_row_container table th").css("height",top_height -1);
		$("."+storeClass+" .content_body #data_list_for_body li").css("width","100%");
		$("."+storeClass+" .edit_table").width(200).height(200).css("background","white");
}



function emptyAllTable(){
	$("."+storeClass+" .top_column_container .column_data_list tbody").empty();
	var rowLeftTable = $("."+storeClass+" .left_row_container table").eq(0);
	rowLeftTable.find("thead tr").empty();
	rowLeftTable.find("tbody").empty();
	$("."+storeClass+" #data_list_for_body div.vertical_line").remove();
	$("."+storeClass+" #data_list_for_body li").remove();
}


}




// 指标卡

function reporting_col_card(saveIndexPage){
	for(var j = 0; j < saveIndexPage.length;j++){
		(function(index){
			runIndexPage(saveIndexPage[index])
		})(j);
	}

}

function runIndexPage(indexClass){
				indexClass = indexClass;
				
				// var target =  $("."+indexClass+"").get(0);
    // 			spinner.spin(target);
    			// $("."+indexClass+"").append("<div class=loader></div>");
				$("."+indexClass+"").find(".right_module .content_body").append("<div class=lf><div class=loader></div><div class=sm>数据获取中</div></div>");
				if($(".lf").css("display") == 'block'){
					$("new_view_main").css("opacity","0.8");
				}
				if($("."+indexClass+"").find(".right_module .content_body .lf").length > 1){
					$("."+indexClass+"").find(".right_module .content_body div").remove(".lf:not(:first)");
				}

				var indexNum_toview = indexClass.match(/\d+/g)[1];
				$("."+indexClass+"").show();
				$("."+indexClass+"").find(".right_module .content_body .session_data_list_for_body").html("");
				var current_all_measure = drag_row_column_data_arr[indexNum_toview]["column"]["measure"].concat(drag_row_column_data_arr[indexNum_toview]["row"]["measure"]);

				reporting_measure_Hanlde(specialRemoveDataTypeHandle(drag_row_column_data_arr[indexNum_toview]["row"]["dimensionality"].concat(drag_row_column_data_arr[indexNum_toview]["column"]["dimensionality"])),specialRemoveDataTypeHandle(current_all_measure),null,indexNum_toview,function(data){

					// $("#text_table_need_show").hide();
					// $("#view_show_area #view_show_area_content #view_show_wrap #main").hide();
					$("."+indexClass+" .right_module .content_body .session_data_list_for_body .measureDiv1").remove();
					var allMeasure = specialRemoveDataTypeHandle(drag_row_column_data_arr[indexNum_toview]["row"]["measure"].concat(drag_row_column_data_arr[indexNum_toview]["column"]["measure"]));
					var needAllData = data;
					for(var i = 0;i < needAllData.length;i++){
						//console.log(needAllData);
						var aData = needAllData[i];
						//console.log(aData);
						var measureDiv = $("<div class='measureDiv1'></div>");
						//console.log(allMeasure.length);
						$("."+indexClass+"").find(".right_module .content_body .session_data_list_for_body").append(measureDiv);

						if(allMeasure.length < 3){
						for(var j = 0;j < allMeasure.length;j++){
							var aMeasure = allMeasure[j];
							//console.log(aMeasure);
							var tit = drag_measureCalculateStyle_arr[indexNum_toview][aMeasure];
								var p = $("<p class=p"+j+">" + tit +"</p>");
								var span = $("<span class=sp"+j+">"+aData[drag_measureCalculateStyle_arr[indexNum_toview][aMeasure]]+"</span>");
								measureDiv.append(p);
								measureDiv.append(span);
								$(p).data("measureInfo",aMeasure);

								var div = $("<div class='cardInfo' style='display:none'></div>");
								div.addClass(aMeasure);
								measureDiv.append(div);
								$(p).unbind("mouseover");
								$(p).mouseover(function(event){
									event.stopPropagation();
									var MeasureInfo = $(this).data("measureInfo");
									var compareDiv = $(this).siblings(".cardInfo."+MeasureInfo).eq(0)
									if(eval(statements_tonghuanbi_arr[indexNum_toview])[0].indexOf(MeasureInfo) != -1){
											$("."+indexClass+" .right_module .content_body .session_data_list_for_body .measureDiv1 .cardInfo").hide();
											$(compareDiv).show();
											compareDiv.find("p.compareP").show();
											if($(this).hasClass('p0')){
												$(compareDiv).css({"left":$(this).position().left + 'px',"top":$(this).position().top - 70 + 'px'});
											}else{
												$(compareDiv).css({"left":$(this).position().left + 'px',"top":$(this).position().top + 50 + 'px'});
											}
									}
									if(eval(statements_tonghuanbi_arr[indexNum_toview])[1].indexOf(MeasureInfo) != -1){
										$("."+indexClass+" .right_module .content_body .session_data_list_for_body .measureDiv1 .cardInfo").hide();
										$(compareDiv).show();
										compareDiv.find("p.linkP").show();
										if($(this).hasClass('p0')){
											$(compareDiv).css({"left":$(this).position().left + 'px',"top":$(this).position().top - 70 + 'px'});
										}else{
											$(compareDiv).css({"left":$(this).position().left + 'px',"top":$(this).position().top + 50 + 'px'});
										}
									}
								});
								$(p).unbind("mouseleave");
								$(p).mouseleave(function(event){
									event.stopPropagation();
									var MeasureInfo = $(this).data("measureInfo");
									var compareDiv = $(this).siblings(".cardInfo."+MeasureInfo).eq(0);
									$("."+indexClass+" .right_module .content_body .session_data_list_for_body .measureDiv1 .cardInfo").hide();
									compareDiv.find("p").hide();
								});


								var tongbiShowNum = 0;
								var huanbiShowNum = 0;
								if(aData["同比"+drag_measureCalculateStyle_arr[indexNum_toview][aMeasure]]){
									tongbiShowNum = (Number(aData["同比"+drag_measureCalculateStyle_arr[indexNum_toview][aMeasure]]) * 100).toFixed(2);
								}
								if(aData["环比"+drag_measureCalculateStyle_arr[indexNum_toview][aMeasure]]){
									huanbiShowNum = (Number(aData["环比"+drag_measureCalculateStyle_arr[indexNum_toview][aMeasure]]) * 100).toFixed(2);
								}
								var tongbiAp = $("<p style='display:none' class='compareP'>同比("+aMeasure+"):"+tongbiShowNum+"%</p>");
			 					var huanbiAp = $("<p style='display:none' class='linkP'>环比("+aMeasure+"):"+huanbiShowNum+"%</p>");
			 					tongbiAp.addClass(aMeasure);
			 					huanbiAp.addClass(aMeasure);

								div.append(tongbiAp);
								div.append(huanbiAp);
								// measureDiv.css({"marginLeft":$(".new_view_main").width()/2-measureDiv.width()/2+'px',"marginTop":$(".new_view_main").height()/2-measureDiv.height()/2+'px'})


								if(eval(statements_tonghuanbi_arr[indexNum_toview])[0].indexOf(aMeasure) != -1){
									tongbiAp.show();
								}
								if(eval(statements_tonghuanbi_arr[indexNum_toview])[1].indexOf(aMeasure) != -1){
									huanbiAp.show();
								}

							
							// if(j != allMeasure.length - 1){
							// 	// measureDiv.append("<span class='seperate'>/</span>");
							// 	measureDiv.append("<br>");
							// }
							var br = $("<br>");
							measureDiv.append(br);
						}
						}
						// spinner.stop(target);
						$("div").remove(".lf");
					}
				},indexClass);
	}


