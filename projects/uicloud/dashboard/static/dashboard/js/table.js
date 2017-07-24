
//表格展示
// 记录左侧 table 的宽度
var left_table_width = 0;
// 重复合并辅助数组
var row_repeat_merge_help = [];
var column_repeat_merge_help = [];
function showTable_by_dragData(){
	//drag_row_column_data 拖到行列 列名
	//current_cube_name  当前操作的表名
	//_cube_all_data 所有表的数据
	//
	$("#text_table_need_show").css('display', 'block');

	//1、处理列的维度
	function handle_column_drag_dimensionality(){
	 	var handle_index =drag_row_column_data["column"]["dimensionality"].length - 1; 
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
	 		current_data["data"].XMsort(drag_row_column_data["column"]["dimensionality"]);
	 		
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
	 		
	 		line_for_data_body(span_width);
	 		if (drag_row_column_data["row"]["dimensionality"].length < 1) {
	 			// 如果没有拖入行		也需要创建 li
	 			handle_data_body("50px");
	 		} 		
	}

	
	// 2、处理行的维度
	 function handle_row_drag_dimensionality(){
		var handle_index =drag_row_column_data["row"]["dimensionality"].length - 1; 
	 	var need_handle_row =  drag_row_column_data["row"]["dimensionality"][handle_index];
		// 创建对应的维度行
		
			var row_name = need_handle_row.split(":")[0];
			var table = $("<table cellspacing='0' cellpadding='0' class=" + row_name+"><thead><tr><th>"+row_name+"</th</tr></thead></table>");
			table.data("field_name",row_name);
			$("#text_table_need_show .left_row_container").eq(0).append(table);
			// 清楚 body 区域的li内容
			$("#text_table_need_show #data_list_for_body li").remove();
			
			
//			// 对数据排序
			current_data["data"].XMsort(drag_row_column_data["row"]["dimensionality"]);
			
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
						"height":0
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
			left_table_width += table.outerWidth();					
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
	function handle_column_drag_measure(){
		var handle_index =drag_row_column_data["column"]["measure"].length - 1; 
		if (handle_index < 0) {
			return;
		}
	 	var need_handle_column =  drag_row_column_data["column"]["measure"][handle_index]; 
		handle_common_measure(need_handle_column);
	}
	//7、处理行里面的度量
	function handle_row_drag_measure(){
		var handle_index =drag_row_column_data["row"]["measure"].length - 1; 
		if (handle_index < 0) {
			return;
		}
	 	var need_handle_row =  drag_row_column_data["row"]["measure"][handle_index]; 
		handle_common_measure(need_handle_row);
	}
	
	//8 目前对于表格来说，不管度量是在列里面还是行里面处理机制是一样的
	function handle_common_measure(measure_name){
		measure_name = measure_name.split(":")[0];
//		 1、首先决定创建多个个 span，也即是多少个条件，即显示多少个度量显示值
//	var column_obj = $("#text_table_need_show .right_module .top_column_container .column_data_list li:last span:last").attr("index");
//	var row_obj = $("#text_table_need_show .left_row_container table:last tr:last").attr("index");
//	column_max = column_obj ? column_obj.intValue() + 1 :0;
//	row_max =  row_obj  ? row_obj.intValue() + 1 :0;
//	var num_sum = Math.max(column_max,row_max);
	
	
//	var row_filter_condition = [];
//	var column_filter_condition = [];
//	for (var i = 0;i < drag_row_column_data["row"]["dimensionality"].length;i++) {
//		row_filter_condition.push(drag_row_column_data["row"]["dimensionality"][i].split(":")[0]);
//	}
//	for (var i = 0;i < drag_row_column_data["column"]["dimensionality"].length;i++) {
//		column_filter_condition.push(drag_row_column_data["column"]["dimensionality"][i].split(":")[0]);
//	}
//		
//	var needShowSpan = {};
//	for (var i = 0;i < current_data["data"].length;i++) {
//		var theData = current_data["data"][i];
//		var key = "";
//		if (row_filter_condition.length > 0) {
//			for (var j = 0;j < row_filter_condition.length;j++) {
//			key += row_filter_condition[j] + "_equal_"+theData[row_filter_condition[j]]+"_YZY_";
//			}
//		}
//		
//		if (column_filter_condition.length > 0) {
//			key += "_needseprate_"
//			for (var j = 0;j < column_filter_condition.length;j++) {
//			key += column_filter_condition[j] + "_equal_"+theData[column_filter_condition[j]]+"_YZY_";
//			}
//		}	
//		if (needShowSpan[key]) {
//			needShowSpan[key] += theData[measure_name];
//		}else{
//			needShowSpan[key] = theData[measure_name];
//		}	
//		console.log(key);
//	}
	var needShowSpan = measure_Hanlde([measure_name]);
	
	console.log(needShowSpan);
	for(var key in needShowSpan){
		
		var span = $("<span class="+measure_name+"></span>");
		span.html(needShowSpan[key][measure_name]["sum"]);
		var positionInfo = key.split("_needseprate_");
		var row_info = positionInfo[0];
		var column_info = positionInfo[1];

		if ($("#text_table_need_show .content_body #data_list_for_body .measureDiv").length && $("#text_table_need_show .content_body #data_list_for_body .measureDiv").length >= allKeys(needShowSpan[measure_name]).length) {
			$("#text_table_need_show .content_body #data_list_for_body ." + key).append("<span class='seperate'>/</span>");
			$("#text_table_need_show .content_body #data_list_for_body ." + key).append(span);
			
		}else{
				var div = $("<div class='measureDiv'></div>");
				$("#text_table_need_show .content_body #data_list_for_body").append(div);
				div.addClass(key);
				div.append(span);
				var top_index = 0;
				var left_index = 0;
			if (row_info) {
				var lastTable = $("#text_table_need_show .left_row_container table");
				
				lastTable.find("." + row_info).filter(".activeShow").prevAll("tr").each(function(index,ele){
					top_index += $(ele).outerHeight();
				})
				
			}
			if (column_info) {
				var lastLi = $("#text_table_need_show .right_module .top_column_container .column_data_list li:last");
				 lastLi.find("."+column_info).filter(".activeShow").prevAll("span").each(function(index,ele){
				 	left_index += $(ele).outerWidth();
				 })
			}
			div.css({
				"left":left_index,
				"top":top_index
			})
		}	
	}			
					
}
		
	

	
	//开始函数
	function init(){
//		var sort = drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]);
		if (_drag_message["position"] == "row") {
			if(_drag_message["type"] == "dimensionality"){
				handle_row_drag_dimensionality();
				handle_row_drag_measure();
				handle_column_drag_measure();
			}else if(_drag_message["type"] == "measure"){
				handle_row_drag_measure();
			}
		
		}else if(_drag_message["position"] == "column"){
			if(_drag_message["type"] == "dimensionality"){
				handle_column_drag_dimensionality();
				handle_column_drag_measure();
				handle_row_drag_measure();
			}else if(_drag_message["type"] == "measure"){
				handle_column_drag_measure();
			}	
		}
		// 处理布局
		layout_table_size();
	}
	init();
	
}



//	布局 autoSize
	function layout_table_size(){
		// 为了让浮动不换行，动态计算左侧模块的宽度
		$("#text_table_need_show .left_row_container").eq(0).css("width",left_table_width);
		// 1、计算左侧行的宽度
		var left_row_width = $("#text_table_need_show .left_row_container").eq(0).width();
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






