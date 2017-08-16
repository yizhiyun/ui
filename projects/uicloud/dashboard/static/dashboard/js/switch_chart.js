// 当前操作表的 数据
var current_data = null;

//拖拽元素存储数据

var save_data_handle;

function switch_chart_handle_fun(drag_sortable,isagainDrawTable){

	function save_btn_fun(){
	

	$("#action_save").unbind("click");
	//保存按钮下拉框
	$("#action_save").on("click", function() {

		$("#action_save_view").stop(true).toggle();
	
	});

	$("#action_save").on("mouseleave", function() {
		$("#action_save_view").css("display", "none")
	})
		
	$("#action_save_view p").each(function(index, ele) {
		$(ele).on("mouseenter", function() {
			$(ele).css("background", "#DEDEDE")
		})

		$(ele).on("mouseleave", function() {
			$(ele).css("background", "white")
		})
	})
	}



	

	//记录拖入行列里维度度量的数量

	//行里维度度量的数量
	var switch_row_di = drag_row_column_data["row"]["dimensionality"].length,

	switch_row_me = drag_row_column_data["row"]["measure"].length,

	//列里维度度量的数量
	switch_col_di = drag_row_column_data["column"]["dimensionality"].length,

	switch_col_me = drag_row_column_data["column"]["measure"].length;

	current_data = _cube_all_data[current_cube_name];

	//所有视图点击按钮
	var show_btn_change = $("#project_chart ul li");
	//满足条件给定指定样式
	function change_view_css(element){
		return $(element).css("border","1px solid #0d53a4").css("opacity","1").data("if_show","true");
	}


	//初始化图例
	function view_init(){
		show_btn_change.data("if_show","").css("border","").css("opacity","0.3");
		$("#text_table_need_show").css("display","none");
	}

	//拖拽元素存储数据
	save_data_handle = data_handle(drag_sortable);

	if(switch_col_di ==  0 && switch_col_me == 0 && switch_row_di == 0 && switch_row_me == 0){
			view_init();
			//隐藏其他视图
			$("#main").css("display","none");
			$("#view_show_empty").css("display","block");
		}
	

	

	//只拖入维度或行里或列里同时存在维度度量时跳转到展示文本表
		if((switch_col_di > 0 && switch_col_me == 0 && switch_row_di == 0 && switch_row_me == 0) || (switch_row_di > 0 && switch_row_me == 0 && switch_col_di == 0 && switch_col_me == 0) || (switch_col_di > 0 && switch_col_me == 0 && switch_row_di > 0 && switch_row_me == 0) || (switch_row_di > 0 && switch_row_me == 0 && switch_col_di > 0 && switch_col_me == 0)){
			//隐藏其他视图
			$("#main").css("display","none");
			//跳转到文本表
			showTable_by_dragData(isagainDrawTable);

			view_name = "showTable_by_dragData";
			
			change_view_css("#show_table");
		}


		if((switch_col_di > 0 && switch_col_me > 0 ) || (switch_row_di > 0 && switch_row_me > 0)){
			show_btn_change.data("if_show","").css("border","").css("opacity","0.3");

			//隐藏其他视图
			$("#main").css("display","none");
			//跳转到文本表
			showTable_by_dragData(isagainDrawTable);

			view_name = "showTable_by_dragData";

			change_view_css("#show_table");
		}


	// 文本表end----------------------------------------------


	//只拖入度量显示柱状图或者条形图
	if((switch_row_me > 0 && switch_col_di ==0 && switch_col_me == 0 && switch_row_di == 0) || (switch_col_me > 0 && switch_col_di ==0 && switch_row_me == 0 && switch_row_di == 0)){
		view_init();
		histogram_show(save_data_handle);

		view_name = "histogram_show";

		$("#show_table").css("opacity","1");
		//判断是条形图还是柱状图为默认
		if(switch_col_me > 0){
			change_view_css("#show_bar");
		}else{
			change_view_css("#show_histogram");
		}
	}

	//1维度1度量展示
	if((switch_col_di == 1 && switch_row_me ==1 && switch_col_me == 0 && switch_row_di == 0 ) || (switch_row_di == 1 && switch_col_me ==1 && switch_row_me ==0 && switch_col_di == 0)){
		view_init();
		histogram_show(save_data_handle);
		view_name = "histogram_show";

		show_btn_change.not($("#show_storehis,#show_percontrasth,#show_storebar,#show_contrastbar,#prestorebar,#show_histogram,#show_bar,#show_treemap")).css("opacity","1");
		//判断是条形图还是柱状图为默认
		if(switch_col_me > 0){
			change_view_css("#show_bar");
		}else{
			change_view_css("#show_histogram");
			
		}

	}


	// 1维度多度量
	if(switch_col_di == 1 && switch_col_me == 0 && switch_row_me >1 && switch_row_di ==0 || switch_col_di == 0 && switch_col_me >1 && switch_row_me ==0 && switch_row_di ==1){
		view_init();
		//调用柱状图
		histogram_show(save_data_handle);

		view_name = "histogram_show";

		$("#show_table,#show_polyline,#show_randar").css("opacity","1");

		if(switch_col_me > 1){
			change_view_css("#show_bar");
		}else{
			change_view_css("#show_histogram");
		}
	}

	//2-3维度1度量展示堆积条柱图
	if(switch_col_di > 1 && switch_col_di < 4 && switch_col_me == 0 && switch_row_me == 1 && switch_row_di ==0 || switch_col_di == 0 && switch_col_me == 1 && switch_row_me ==0 && switch_row_di >1 && switch_row_di <4){
		view_init();
		if(switch_col_di > 1 && switch_col_di < 4){
			//展示堆积柱状图,百分比堆积柱状图
			many_de_many_me_handle('number_bar');

			view_name = "many_de_many_me_handle('number_bar')";

			$("#show_storehis,#show_percontrasth,#show_table,#show_histogram").css("opacity","1");
			$("#show_storehis").css("border","1px solid #0d53a4").data("if_show","true");
		}

		if(switch_row_di > 1 && switch_row_di < 4){
			//展示堆积条形图,百分比堆积条形图
			many_de_many_me_handle('number_liner');

			view_name = "many_de_many_me_handle('number_liner')";

			$("#show_storebar,#prestorebar,#show_table,#show_bar").css("opacity","1");
			$("#show_storebar").css("border",	"1px solid #0d53a4").data("if_show","true");
		}

	}

	//2或多个维度1个度量展示树状图
	if((switch_col_di > 1 && switch_col_me ==0 && switch_row_me == 1 && switch_row_di == 0) || (switch_row_di > 1 && switch_row_me == 0 && switch_col_di == 0 && switch_col_me ==1)){
		$("#show_treemap").css("opacity","1")
	}else{
		$("#show_treemap").css("opacity","0.3")
	}


	//多维度多度量
	if(switch_col_di > 1 && switch_col_me == 0 && switch_row_me >1 && switch_row_di ==0 || switch_col_di == 0 && switch_col_me > 1 && switch_row_me ==0 && switch_row_di > 1){
		view_init();
				//调用柱条图
				histogram_show(save_data_handle);
				view_name = "histogram_show";

				$("#show_table").css("opacity","1");
				if(switch_col_me > 1){
					change_view_css("#show_bar");
				}else{
					change_view_css("#show_histogram");
						
				}
	}



	if((switch_col_di > 3 && switch_col_me == 0 && switch_row_me >= 1 && switch_row_di ==0) || (switch_col_di == 0 && switch_col_me >= 1 && switch_row_me ==0 && switch_row_di > 3)){
		view_init();
		$("#show_table").css("opacity","1");
		if(switch_row_me  == 1 || switch_col_me == 1){
			$("#show_treemap").css("opacity","1");
		}
			histogram_show(save_data_handle);

			view_name = "histogram_show";

				if(switch_col_me >= 1){
					change_view_css("#show_bar");
				}else{
					change_view_css("#show_histogram");
						
				}
	}



	//1个维度2个度量展示对比条形图
	if((switch_row_di == 1 && switch_col_me == 2 && switch_row_me == 0 && switch_col_di == 0) || (switch_row_di == 0 && switch_col_me == 0 && switch_row_me == 2 && switch_col_di == 1)){
		$("#show_contrastbar").css("opacity","1");
	}else{
		$("#show_contrastbar").css("opacity","0.3");
	}



	//存储视图切换按钮对应的方法

	var save_show_click_change = ["showTable_by_dragData()","one_de_one_me_handle('cake')","many_de_many_me_handle('polyline')","histogram_show(save_data_handle)","many_de_many_me_handle('number_bar')","one_de_one_me_handle('waterWall')","many_de_many_me_handle('percentage_bar')","histogram_show(save_data_handle)","many_de_many_me_handle('number_liner')","many_de_many_me_handle('comparisonStrip')","many_de_many_me_handle('percentage_liner')","one_de_one_me_handle('area')","one_de_one_me_handle('scale')","one_de_one_me_handle('gantt')","drag_radarChart(save_data_handle)","many_de_many_me_handle('reliationTree')"]

	//[文本表,饼图,折线图,柱状图,堆积柱状图,瀑布图,百分比堆积柱状图,条形图,堆积条形图,对比条形图,百分比堆积条形图,面积图,范围图,甘特图,雷达图,树状图]



		//遍历所有视图按钮给定绘图方法
		show_btn_change.each(function(index,ele){
			$(ele).on("click",function(){
				if($(ele).css("opacity") == 1){
					if($(ele).data("if_show") != "true"){
						show_btn_change.data("if_show","");
						$(ele).data("if_show","true");
						switch(index)
							{
							//点击文本表隐藏其他视图
							case 0:
							$("#main").css("display","none");
							showTable_by_dragData(false,true);
							view_name = "showTable_by_dragData";
							break;
							case 3:
							$("#text_table_need_show").css("display","none");
							histogram_show(save_data_handle);
							view_name = "histogram_show";
							break;
							case 7:
							$("#text_table_need_show").css("display","none");
							histogram_show(save_data_handle);
							view_name = "histogram_show";
							break;
							case 14:
							$("#text_table_need_show").css("display","none");
							drag_radarChart(save_data_handle);
							view_name = "drag_radarChart";

							break;
							default:
							$("#text_table_need_show").css("display","none");
							Function(save_show_click_change[index])();
							view_name = save_show_click_change[index];
							break;
						}
					}
				}
			})
		})
	

	if($("#main").css("display") != "none" || $("#text_table_need_show").css("display") != "none"){

		$("#action_save").css("opacity","1");
		save_btn_fun();
	}

	if($("#main").css("display") == "none" && $("#text_table_need_show").css("display") == "none"){
		
		$("#action_save").css("opacity","0.5").unbind("mouseleave");

		$("#action_save").unbind("click");

	}

// end-----------
}