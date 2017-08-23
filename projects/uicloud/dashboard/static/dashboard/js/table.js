
//表格展示
// 记录左侧 table 的宽度
//var left_table_width = 0;
// 重复合并辅助数组
var row_repeat_merge_help = [];
var column_repeat_merge_help = [];
var isagainDrawTable = false; // 是否需要重新绘制 table
var rescordCurrentTableData = null;

function showTable_by_dragData(isTabChart){
	//drag_row_column_data 拖到行列 列名
	//current_cube_name  当前操作的表名
	//_cube_all_data 所有表的数据
//	console.log(isagainDrawTable,isTabChart);
//	if(!isNeedSHidenTable){
	$("#text_table_need_show").show();
//	}
<<<<<<< HEAD
//	if(isTabChart && !isagainDrawTable){
//		return;
=======
//	if(isTabChart && !isagainDrawTable){
//		return;
>>>>>>> 5efc7f72de8d2605004946e24efebd188dffa094
//	}
	//1、处理列的维度
	function handle_column_drag_dimensionality(handle_index){
//	 	var handle_index =drag_row_column_data["column"]["dimensionality"].length - 1; 
	 	var need_handle_column =  drag_row_column_data["column"]["dimensionality"][handle_index];
	 // 创建对应的----”维度“---列
	 		var co_info = need_handle_column.split(":");
	 		var co_name = co_info[0];		
	 		/*全部都是处理列的维度*/
	 		// 顶部 p 标签显示内容
	 		var titleArr=[];
	 		 drag_row_column_data["column"]["dimensionality"].filter(function(ele){
	 				titleArr.push(ele.split(":")[0]);
	 				return true;
	 		});
	 		$("#text_table_need_show .right_module .top_column_container .top_column_name").eq(0).html(titleArr.join(" / "));
	 		// 创建列名
	 		var li = $("<li class="+co_name+"></li>");
	 		li.data("field_name",co_name);
	 		$("#text_table_need_show .top_column_container .column_data_list").eq(0).append(li);
	 		// 清楚 body 区域的竖线
	 		var span_width = 0;
	 		$("#text_table_need_show #data_list_for_body .vertical_line").remove();
	 		
	 		// 依照列进行排序
	 		current_data["data"].XMsort(drag_row_column_data["column"]["dimensionality"].slice(0,handle_index+1));
	 			 		
	 		for (var j = 0;j < current_data["data"].length;j++) {
	 			
	 			var theData = current_data["data"][j];
	 			var span = $("<span>"+theData[co_name]+"</span>");
	 			span.attr("index",j);  // 以备后续使用
	 			li.append(span);		
	 			if (!column_repeat_merge_help[j]) {
	 				column_repeat_merge_help[j] = "";
	 			}
	 			var isExit = column_repeat_merge_help.indexOf(column_repeat_merge_help[j]+co_name+ "_equal_"+theData[co_name] +"_YZY_");
	 			if (isExit != -1) {
	 				span.hide();
	 				span.css({
	 					"width":0,
	 					"height":0,
	 					"padding":0,
	 					"border":0
	 				});
	 				column_repeat_merge_help[j] +=	co_name+ "_equal_"+theData[co_name] + "_YZY_";
	 				
	 			}else{
	 				// 记录好对应的条件
					var pretr = $(li).prev("li").eq(0);
					if (pretr.length && !pretr.find("span[index=" + j +"]").is(":visible")){
						$(li).prevAll("li").find("span[index=" + j +"]").each(function(dex,ele){
							var handle_ele = $(ele).prevAll(".activeShow").eq(0);
							$(handle_ele).css({
								"width":$(handle_ele).width() + $(span).outerWidth()
							})
						});
					}
					column_repeat_merge_help[j] += co_name+ "_equal_"+theData[co_name] + "_YZY_";
					span.addClass("activeShow");
					// 竖线 	
	 				line_for_data_body(span_width);
	 				span_width+= span.outerWidth();					
	 			}
	 			span.addClass(column_repeat_merge_help[j]);
	 			
	 		}
	 		column_li_width_handle(span_width);
	 		line_for_data_body(span_width);
	 		if (drag_row_column_data["row"]["dimensionality"].length < 1) {
	 			// 如果没有拖入行		也需要创建 li
	 			handle_data_body("50px");
	 		} 		
	}

	
	// 2、处理行的维度
	 function handle_row_drag_dimensionality(handle_index){
//		var handle_index =drag_row_column_data["row"]["dimensionality"].length - 1; 
	 	var need_handle_row =  drag_row_column_data["row"]["dimensionality"][handle_index];
		// 创建对应的维度行
		
			var row_name = need_handle_row.split(":")[0];
			var table = $("<table cellspacing='0' cellpadding='0' class=" + row_name+"><thead><tr><th>"+row_name+"</th</tr></thead></table>");
			table.data("field_name",row_name);
			$("#text_table_need_show .left_row_container").eq(0).append(table);
			// 清楚 body 区域的li内容
			$("#text_table_need_show #data_list_for_body li").remove();
			
			
//			// 对数据排序
			current_data["data"].XMsort(drag_row_column_data["row"]["dimensionality"].slice(0,handle_index+1));
			
			
			for (var j = 0;j < current_data["data"].length;j++) {
				
				var theData = current_data["data"][j];
				var tr = $("<tr><td>"+theData[row_name]+"</td></tr>");
				tr.attr("index",j)// 以备后续使用
				table.append(tr)
				if (!row_repeat_merge_help[j]) {
					row_repeat_merge_help[j] = "";
				}
				if (row_repeat_merge_help.indexOf(row_repeat_merge_help[j]+row_name +"_equal_"+theData[row_name] +"_YZY_") != -1) {
					tr.hide();
					tr.css({
						"width":0,
						"height":0,
						"border":0
					});
					
					row_repeat_merge_help[j] += row_name +"_equal_"+theData[row_name] + "_YZY_";
					
				}else{
					// 记录好对应的条件
					var preTable = $(table).prev("table").eq(0);
					
					if (preTable.length && !preTable.find("tbody tr[index=" + j +"]").is(":visible")) {
						
						$(table).prevAll("table").find("tbody tr[index=" + j +"]").each(function(dex,ele){
							var handle_ele = $(ele).prevAll(".activeShow").eq(0);
							var the_td = $(handle_ele).find("td").eq(0);			
							$(the_td).css({
								"height":$(the_td).height() + $(tr).height()
							})
						});
					}
					row_repeat_merge_help[j] += row_name +"_equal_"+theData[row_name] + "_YZY_";
					tr.addClass("activeShow");
					
					handle_data_body(tr.height());
				}
				tr.addClass(row_repeat_merge_help[j]);
				
			}
			// 如果没有拖入列
			if (drag_row_column_data["column"]["dimensionality"].length < 1) {
				line_for_data_body(0);
				line_for_data_body(49);
			}							
	 }
	 
	
	//4、处理数据 body
	function handle_data_body(liHeight){
		var aLi = $("<li></li>");
		aLi.css("height",liHeight);
		$("#text_table_need_show #data_list_for_body").append(aLi);
	}
	//5、处理 body 里面的竖线
	function line_for_data_body(left_position){
		var vertical_line = $("<div class='vertical_line'></div>");
		vertical_line.css("left",left_position);
		$("#text_table_need_show #data_list_for_body").append(vertical_line);	
	}
	
	//6、处理列里面的度量
	function handle_column_drag_measure(handle_index){
//		var handle_index =drag_row_column_data["column"]["measure"].length - 1; 
		if (handle_index < 0) {
			return;
		}
	 	var need_handle_column =  drag_row_column_data["column"]["measure"][handle_index]; 
		handle_common_measure(need_handle_column);
	}
	//7、处理行里面的度量
	function handle_row_drag_measure(handle_index){
//		var handle_index =drag_row_column_data["row"]["measure"].length - 1; 
		if (handle_index < 0) {
			return;
		}
	 	var need_handle_row =  drag_row_column_data["row"]["measure"][handle_index]; 
		handle_common_measure(need_handle_row);
	}
	
	// 设置列区域的宽度
	function column_li_width_handle(_wdith){
		$("#text_table_need_show .top_column_container .column_data_list").css("width",_wdith);
	}
	
	//8 目前对于表格来说，不管度量是在列里面还是行里面处理机制是一样的
	function handle_common_measure(measure_name){
		measure_name = measure_name.split(":")[0];
	var needShowSpan = measure_Hanlde([measure_name]);
	for(var key in needShowSpan){
		
		var span = $("<span class="+measure_name+"></span>");
		span.html(needShowSpan[key][measure_name]["sum"]);
		var positionInfo = key.split("_needseprate_");
		var row_info = positionInfo[0];
		var column_info = positionInfo[1];
		var div = null;
		if($("#text_table_need_show .content_body #data_list_for_body ." + key).length && $("#text_table_need_show .content_body #data_list_for_body ." + key).length > 0){
			div = $("#text_table_need_show .content_body #data_list_for_body ." + key);
			$("#text_table_need_show .content_body #data_list_for_body ." + key).append("<span class='seperate'>/</span>");
			$("#text_table_need_show .content_body #data_list_for_body ." + key).append(span);
		}else{
			div = $("<div class='measureDiv'></div>");
			$("#text_table_need_show .content_body #data_list_for_body").append(div);
			div.addClass(key);
			div.append(span);
		}	
			var top_index = 0;
			var left_index = 0;
			if (row_info) {
				var lastTable = $("#text_table_need_show .left_row_container table:last tbody");
				lastTable.find("." + row_info).filter(".activeShow").eq(0).prevAll("tr").each(function(index,ele){
					top_index += $(ele).outerHeight();
				});
				
			}
			if (column_info) {
				var lastLi = $("#text_table_need_show .right_module .top_column_container .column_data_list li:last").eq(0);
				 lastLi.find("."+column_info).filter(".activeShow").eq(0).prevAll(".activeShow").each(function(index,ele){
				 	
				 	left_index += $(ele).outerWidth();
				 	
				 });
			}
			div.css({
				"left":left_index,
				"top":top_index
			});
	}			
					
}
		
	

	
	//开始函数
	function init(){
		
		$(function(){
			if(isagainDrawTable){
					// 清空 绘制 table 区域的内容
				$("#dashboard_content #view_show_area #view_show_wrap #text_table_need_show .left_row_container").empty();
				$("#dashboard_content #view_show_area #view_show_wrap #text_table_need_show .right_module .content_body #data_list_for_body").empty();
				$("#dashboard_content #view_show_area #view_show_wrap #text_table_need_show .right_module .top_column_container .top_column_name").empty();
				$("#dashboard_content #view_show_area #view_show_wrap #text_table_need_show .right_module .top_column_container .column_data_list").empty();
				row_repeat_merge_help = [];
				column_repeat_merge_help = [];
				//
				for(var i  = 0;i < drag_row_column_data["row"]["dimensionality"].length;i++){
					handle_row_drag_dimensionality(i)
				}
				for(var i = 0;i < drag_row_column_data["column"]["dimensionality"].length;i++){
					handle_column_drag_dimensionality(i);
				}
				
				for(var i =0;i < drag_row_column_data["column"]["measure"].length;i++){
					handle_column_drag_measure(i);
				}
				for(var i =0;i < drag_row_column_data["row"]["measure"].length;i++){
					handle_row_drag_measure(i);
				}
				isagainDrawTable = false;
				// 记录一下当前表格所存在的数据
				rescordCurrentTableData = objectDeepCopy(drag_row_column_data);
				
			}else{
				if(_drag_message["position"] == "row") {	
					console.log(rescordCurrentTableData);
					if(_drag_message["type"] == "dimensionality" && !equalCompare(rescordCurrentTableData,drag_row_column_data)) {
						handle_row_drag_dimensionality(drag_row_column_data["row"]["dimensionality"].length - 1);
						$("#text_table_need_show .content_body #data_list_for_body .measureDiv").remove();
						for(var i =0;i < drag_row_column_data["column"]["measure"].length;i++){
							handle_column_drag_measure(i);
						}
						for(var i =0;i < drag_row_column_data["row"]["measure"].length;i++){
							handle_row_drag_measure(i);
						}
						rescordCurrentTableData = objectDeepCopy(drag_row_column_data);
					} else if(_drag_message["type"] == "measure" && !equalCompare(rescordCurrentTableData,drag_row_column_data)) {
						handle_row_drag_measure(drag_row_column_data["row"]["measure"].length - 1);
						rescordCurrentTableData = objectDeepCopy(drag_row_column_data);
					}

				} else if(_drag_message["position"] == "column") {
					if(_drag_message["type"] == "dimensionality" && !equalCompare(rescordCurrentTableData,drag_row_column_data)) {
						handle_column_drag_dimensionality(drag_row_column_data["column"]["dimensionality"].length - 1);
						$("#text_table_need_show .content_body #data_list_for_body .measureDiv").remove();
						for(var i =0;i < drag_row_column_data["column"]["measure"].length;i++){
							handle_column_drag_measure(i);
						}
						for(var i =0;i < drag_row_column_data["row"]["measure"].length;i++){
							handle_row_drag_measure(i);
						}
						rescordCurrentTableData = objectDeepCopy(drag_row_column_data);
					} else if(_drag_message["type"] == "measure" && !equalCompare(rescordCurrentTableData,drag_row_column_data)) {
						handle_column_drag_measure(drag_row_column_data["column"]["measure"].length - 1);
						rescordCurrentTableData = objectDeepCopy(drag_row_column_data);
					}
				}				
			}
			// 处理布局
			layout_table_size();
			
		});	
	}
	init();
	
}



//	布局 autoSize
	function layout_table_size(){
		// 为了让浮动不换行，动态计算左侧模块的宽度
		// 1、计算左侧行的宽度
		var leftWidth = 0;
		
//		$("#text_table_need_show .left_row_container table").map(function(index,ele){
//			leftWidth += $(ele).outerWidth();
//			
//		});
//		$("#text_table_need_show .left_row_container").css("width","2000px");
		var left_row_width = $("#text_table_need_show .left_row_container").eq(0).outerWidth();
		$("#text_table_need_show .right_module").css("margin-left",left_row_width + "px");
		// 左侧行设置 th 的高度
		var top_height = $("#text_table_need_show .right_module .top_column_container").eq(0).height();
		$("#text_table_need_show .left_row_container table th").css("height",top_height -1);
				
		// 设置 body 区域的  ul 的宽度
		var ui_width = 0
		var top_border = 0;
		if ($("#text_table_need_show .top_column_container .column_data_list").eq(0).find("li").length < 1) {
			ui_width = "50px";
			top_border = 1;
		}else{
			ui_width = $("#text_table_need_show .top_column_container .column_data_list").eq(0).outerWidth();
		}
		$("#text_table_need_show #data_list_for_body").css({"width":ui_width,"border-top":top_border +"px solid #dedede"});
		
}



function compareTwoObjectEqualFun(obj1,obj2){
	
	
}


