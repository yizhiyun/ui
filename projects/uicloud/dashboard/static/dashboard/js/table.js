//表格展示

function table_Show(drop_text_arr,drop_list_save_arr,drop_or) {
	var abc= [];
	var ceshi = [];
	
	var dataset= [];
//	console.log(drop_list_save_arr)
	for(key in drop_text_arr){
		abc=(drop_text_arr[key]);
		
	}
	
	switch (drop_or){
		//判断拖入行展示
		case "row":
			for(var i =0; i< abc.length;i++){
	
		var data_dict = {"data":abc[i],"title":abc[i]};
		
		dataset.push(data_dict);
	}
//	console.log(ceshi)
	//创建一个table
	if($("#view_show_wrap").data("table") == "false") {
	
		$("#view_show_wrap").html( '<table cellpadding="0" cellspacing="0" border="0" class="cell-border hover display table table-striped table-bordered" id="example"></table>' );

		$("#view_show_wrap").data("table", "true");

		$("#example").dataTable({
			"searching":false, //禁止搜索功能
			"paging":false,  //禁止分页器
			"info":false, //禁止每页显示多少条数据
			"ordering":false, //禁止排序功能
			"bAutoWidth":false,
			"data":drop_list_save_arr,
			
			
			"columns":dataset,
		
//			"columns":ceshi,
			
		
			
		});
	}
	
	
			break;
			
			//判断拖入列
		case "col":
	var jilu = [];
	var ceshiha = [];
	var title  = abc.join("/");
	for(keyv in drop_list_save_arr)	{
		jilu.push(drop_list_save_arr[keyv][title])
	}
	var jilu2 = jilu.join(",").split(",");
	
	for(var i =0; i< jilu2.length;i++){
		var ceshi_dict = {"title":jilu2[i]};
		ceshiha.push(ceshi_dict)
	}
	
	//创建一个table
	if($("#view_show_wrap").data("table") == "false") {
		
		$("#view_show_wrap").html( '<table cellpadding="0" cellspacing="0" border="0" class="cell-border hover display table table-striped table-bordered" id="example"></table>' );
		
	
		$("#view_show_wrap").data("table", "true");
		
		
		
	var t =$("#example").DataTable({
			"searching":false, //禁止搜索功能
			"paging":false,  //禁止分页器
			"info":false, //禁止每页显示多少条数据
			"ordering":false, //禁止排序功能
			"bAutoWidth":false,
			
			
			
			"columns":ceshiha,
		});
		
		
		
	}
	
			
		
		
			break;
		default:
			break;
	}
	
	
}