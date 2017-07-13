//表格展示
function showTable_by_dragData(drag_row_column_data){
	//drag_row_column_data 拖到行列 列名
	//current_cube_name  当前操作的表名
	//_cube_all_data 所有表的数据
	
	
}









//同时拥有行和列的时候保存数据
	var have_row_col = [];
	
function table_Show(drop_text_arr, drop_list_save_arr,title_num) {
	
	
	//保存传递过来的数据
	var save_come_data = [];
	
	//拖拽行里的元素个数
	var row_number = !drop_text_arr["drop_row_view"] ? 0 : drop_text_arr["drop_row_view"].length;

	//拖拽列里的元素个数
	
	var col_number = !drop_text_arr["drop_col_view"] ? 0 : drop_text_arr["drop_col_view"].length;
	//转换数据展现方式
	var dataset = [];
	
	
	//记录拖拽到行里的数据
	var drag_row_data = [];
	
	//记录拖拽到列里的数据
	var drag_col_data = [];
	
	var save_row_data = [];
	
	
	var save_every_data = [];
	
	
	//保存列里的数据
	var row_have_row_col = [];
	
	//保存行里的数据
	var col_have_row_col = [];
	
	//记录拖入行里的数据
	if(row_number){
		 row_have_row_col = [];
		//创建一个二维数组记录每个元素的数据
			for(var i = 0; i <drop_text_arr["drop_row_view"].length;i++){
				//记录单个元素的数据
				var get_row_data = [];
				get_row_data.unshift(drop_text_arr["drop_row_view"][0]);
				for(keyr in drop_list_save_arr){
					var datar = drop_list_save_arr[keyr][drop_text_arr["drop_row_view"][0]].join("");
					
					get_row_data.push(datar);
				}
				save_row_data.push(get_row_data);
			}
			
			
			
		//遍历数组创建行元素的数据让其每行展示
			for(var i = 0; i < save_row_data.length;i++){
				var ceshi  = save_row_data[i];
				for(var j =0; j < ceshi.length;j++){
					var one_data = ceshi[j].split(",");
					row_have_row_col.push(one_data)
				}
			}
		


	}
	

	//拖进列里保存数据
	if(col_number){
	 col_have_row_col = [];
		for(var i = 0; i <drop_text_arr["drop_col_view"].length;i++){
				var get_col_data = [];
				get_col_data.unshift(drop_text_arr["drop_col_view"][i]);
					for(keyrol in drop_list_save_arr) {
					var ac = drop_list_save_arr[keyrol][drop_text_arr["drop_col_view"][i]].join("");
					get_col_data.push(ac);
				}
				col_have_row_col.push(get_col_data)
				
			}
		
		
	}
	
	//合并行列数据
	
	have_row_col = col_have_row_col.concat(row_have_row_col);
	
//	console.log(have_row_col)
	
	for(key in drop_text_arr) {
		save_come_data = (drop_text_arr[key]);

	}
	
	
	
	//只拖入行里
	if(row_number>"0" && col_number =="0"){
		//保存行里每条数据
	
		for(var i = 0; i < save_come_data.length; i++) {
				
				var data_dict = { "data": save_come_data[i], "title": save_come_data[i] };

				dataset.push(data_dict);
				
				
				
			}
			
				
		

			//创建一个table
			if($("#view_show_wrap").data("table") == "false") {

				$("#view_show_wrap").html('<table cellpadding="0" cellspacing="0" border="0" class="cell-border hover display table table-striped table-bordered" id="example"></table>');

				$("#view_show_wrap").data("table", "true");

				$("#example").dataTable({
					"searching": false, //禁止搜索功能
					"paging": false, //禁止分页器
					"info": false, //禁止每页显示多少条数据
					"ordering": false, //禁止排序功能
					"bAutoWidth": false,
					select: true, //点击选中行
					"processing":true, //显示加载效果
					"data": drop_list_save_arr,
			
					"columns": dataset,

				});

			}

	}else{
		//行列里都存在元素
			
			//存放每个字段的数据
			var save_each_text = [];
			//动态创建表头
			var table_head = [];
			for(var i = 0; i < save_come_data.length; i++) {
				//获取每个字段数据
				var get_each_text = [];
				get_each_text.unshift(save_come_data[i]);
				for(keyv in drop_list_save_arr) {
					var ac = drop_list_save_arr[keyv][save_come_data[i]].join("");
					get_each_text.push(ac);
				}
				save_each_text.push(get_each_text)
				
				
			}
			
			for(var i = 0; i < title_num+1; i++) {

				var ceshi_dict = { "title": "11111" };

				table_head.push(ceshi_dict)
			}

			//创建一个table
			if($("#view_show_wrap").data("table") == "false") {

				$("#view_show_wrap").html('<table cellpadding="0" cellspacing="0" border="0" class="cell-border hover display table table-striped table-bordered" id="example"></table>');

				$("#view_show_wrap").data("table", "true");
				
				
				var t = $("#example").DataTable({
					"searching": false, //禁止搜索功能
					"paging": false, //禁止分页器
					"info": false, //禁止每页显示多少条数据
					"ordering": false, //禁止排序功能
					"bAutoWidth": false,
					select: true,
					
					"columns": table_head,

				});
				$.fn.dataTable.ext.errMode = 'none';  //禁止警告窗
				//动态创建行
			
				if(col_number>"0" && row_number =="0"){
					for(var i = 0; i < col_number; i++) {
						t.row.add(save_each_text[i]).draw();
					}
				}else{
					$("tbody").html("");
//					console.log(have_row_col)
					for(var i = 0; i < have_row_col.length; i++) {
						t.row.add(have_row_col[i]).draw();
					}
				}

			}

			$("#view_show_wrap").find("table").find("thead").hide();
			
				
				$("tbody tr:lt("+col_number+")").find("td:eq(0)").css("background", "rgba(0,0,0,0.2)").attr("colspan","4");
				$("tbody tr").eq(col_number).find("td:eq(0)").css("background", "deepskyblue")
		
	}
	
	

	
		
		
	
}



