// 当前操作表的 数据
var current_data = null;

//拖拽元素存储数据

var save_data_handle;


//记录当前要展示的视图
var save_now_show_view_text = null;


//判断点击图标后不切换图形

var click_view_icon  = false;

var drawChartTimer = null;


function switch_chart_handle_fun(edit_view){
	
	if(!edit_view){
		if(drawChartTimer){
			clearTimeout(drawChartTimer);
		}
		drawChartTimer = setTimeout(function(){
			beginDrawChart(edit_view);
		},200);
	}else{
		beginDrawChart(edit_view);
	}
}


function beginDrawChart(edit_view){

	var target =  $("#view_show_wrap").get(0);
    spinner.spin(target);
    $(".maskLayer").show();
	if(echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0))){
			echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0)).clear();
		}
	$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection").hide();
	//行里维度度量的数量
	var switch_row_di = drag_row_column_data["row"]["dimensionality"].length,

	switch_row_me = drag_row_column_data["row"]["measure"].length,

	//列里维度度量的数量
	switch_col_di = drag_row_column_data["column"]["dimensionality"].length,

	switch_col_me = drag_row_column_data["column"]["measure"].length;

	current_data = _cube_all_data[current_cube_name];
	//console.log(current_data);
	//所有视图点击按钮
	var show_btn_change = $("#project_chart ul li");
	show_btn_change.removeClass("clicked");
	show_btn_change.css("border","");
	//满足条件给定指定样式
	function change_view_css(element){
		// return $(element).css("border","1px solid #0d53a4").css("opacity","1");
		return $(element).css("opacity","1");
	}


	//初始化图例
	function view_init(){
		show_btn_change.data("if_show","").css("border","").css("opacity","0.3");
		$("#text_table_need_show").hide();
		$("#view_show_area #view_show_area_content #view_show_wrap #card").hide();
	}

	show_btn_change.data("if_show","").css("border","").css("opacity","0.3");

	if(switch_col_di ==  0 && switch_col_me == 0 && switch_row_di == 0 && switch_row_me == 0){
			view_init();
			//隐藏其他视图
			$("#main").css("display","none");
			$("#view_show_empty").show();
			$("#view_show_area #view_show_area_content .tableView_name h4").html("添加表标题");
			$("#view_show_area #view_show_area_content .tableView_name").css("color","#B4B4B4").hide();
			save_now_show_view_text =  null;
			click_view_icon =false;
			spinner.stop();
			$(".maskLayer").hide();
			return;
		}
	

	//只拖入维度或行里或列里同时存在维度度量时跳转到展示文本表
		if((switch_col_di > 0 && switch_col_me == 0 && switch_row_di == 0 && switch_row_me == 0) || (switch_row_di > 0 && switch_row_me == 0 && switch_col_di == 0 && switch_col_me == 0) || (switch_col_di > 0 && switch_col_me == 0 && switch_row_di > 0 && switch_row_me == 0) || (switch_row_di > 0 && switch_row_me == 0 && switch_col_di > 0 && switch_col_me == 0)){
			//隐藏其他视图
			$("#main").css("display","none");
			change_view_css("#show_table");

			if(!click_view_icon){
				save_now_show_view_text = $("#show_table");
			}
		}


		if((switch_col_di > 0 && switch_col_me > 0 ) || (switch_row_di > 0 && switch_row_me > 0)){
			show_btn_change.data("if_show","").css("border","").css("opacity","0.5");

			//隐藏其他视图
			$("#main").css("display","none");

			change_view_css("#show_table");

			if(!click_view_icon){
				save_now_show_view_text = $("#show_table");
			}
		}


	// 文本表end----------------------------------------------
	function handleTableShow(){
			$("#view_show_wrap #card").hide();
			$("#text_table_need_show").show();
			$("#view_show_area #view_show_area_content #view_show_wrap #main").hide();
			$("#show_bar,#show_histogram").css("opacity","1");
			change_view_css("#show_table");
			if(!click_view_icon){
				save_now_show_view_text = $("#show_table");
			}
	}

	//只拖入度量显示柱状图或者条形图表格
	// 度量
	if((switch_row_me > 0 && switch_col_di ==0 && switch_col_me == 0 && switch_row_di == 0) || (switch_col_me > 0 && switch_col_di ==0 && switch_row_me == 0 && switch_row_di == 0)){
		view_init();
		if(switch_col_me > 2 || switch_row_me > 2 ){
				handleTableShow();

		}else{
			if(save_now_show_view_text == null || (save_now_show_view_text.attr("id") != "show_bar" && save_now_show_view_text.attr("id") != "show_histogram" && save_now_show_view_text.attr("id") != "show_table")){
					$("#view_show_wrap #card").show();
					$("#text_table_need_show").hide();
					$("#view_show_area #view_show_area_content #view_show_wrap #main").hide();
					$("#show_bar,#show_histogram,#show_card,#show_table").css("opacity","1");
					change_view_css("#show_card");
					if(!click_view_icon){
						save_now_show_view_text = $("#show_card");
					}
				}else{
					$("#view_show_wrap #card").hide();
					$("#show_bar,#show_histogram,#show_card,#show_table").css("opacity","1");
					change_view_css("#show_card");
				}


		}
	}
	// 维度
	if((switch_row_me == 0 && switch_col_di > 0 && switch_col_me == 0 && switch_row_di == 0) || (switch_col_me == 0 && switch_col_di == 0 && switch_row_me == 0 && switch_row_di > 0)){
		view_init();
		$("#text_table_need_show").show();
		$("#view_show_area #view_show_area_content #view_show_wrap #main").hide();
		// $("#show_bar,#show_histogram").css("opacity","1");
			change_view_css("#show_table");
			if(!click_view_icon){
				save_now_show_view_text = $("#show_table");
			}
	}
	

	//1维度1度量展示
	if((switch_col_di == 1 && switch_row_me ==1 && switch_col_me == 0 && switch_row_di == 0 ) || (switch_row_di == 1 && switch_col_me ==1 && switch_row_me ==0 && switch_col_di == 0)){
		
		view_init();
		
		show_btn_change.not($("#show_storehis,#show_percontrasth,#show_storebar,#show_contrastbar,#prestorebar,#show_histogram,#show_bar,#show_treemap,#show_card")).css("opacity","1");
		//判断是条形图还是柱状图为默认
		if(switch_col_me > 0){
			change_view_css("#show_bar");
			if(!click_view_icon){
				save_now_show_view_text = $("#show_bar");
			}
		}else{
			change_view_css("#show_histogram");
			if(!click_view_icon){
				save_now_show_view_text = $("#show_histogram");
			}
		}

	}


	// 1维度多度量
	if(switch_col_di == 1 && switch_col_me == 0 && switch_row_me >1 && switch_row_di ==0 || switch_col_di == 0 && switch_col_me >1 && switch_row_me ==0 && switch_row_di ==1){
		view_init();
		$("#view_show_wrap #card").hide();
		// $("#card .right_module .content_body #data_list_for_body .measureDiv").remove();

		// showTable_by_dragData();
		$("#show_table,#show_polyline,#show_randar,#show_polyline").css("opacity","1");

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

			$("#show_storehis,#show_percontrasth,#show_table,#show_histogram,#show_polyline").css("opacity","1");
			// $("#show_storehis").css("border","1px solid #0d53a4");
		}

		if(switch_row_di > 1 && switch_row_di < 4){

			$("#show_storebar,#prestorebar,#show_table,#show_bar,#show_polyline").css("opacity","1");
			// $("#show_storebar").css("border","1px solid #0d53a4");
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
				
				$("#show_table,#show_polyline").css("opacity","1");
				if(switch_col_me > 1){
					change_view_css("#show_bar");
				}else{
					change_view_css("#show_histogram");
						
				}
	}



	if((switch_col_di > 3 && switch_col_me == 0 && switch_row_me >= 1 && switch_row_di ==0) || (switch_col_di == 0 && switch_col_me >= 1 && switch_row_me ==0 && switch_row_di > 3)){
		view_init();
		$("#show_table,#show_polyline").css("opacity","1");
		if(switch_row_me  == 1 || switch_col_me == 1){
			$("#show_treemap,#show_polyline").css("opacity","1");
		}
				if(switch_col_me >= 1){
					change_view_css("#show_bar");
				}else{
					change_view_css("#show_histogram");
						
				}
	}



	//1个维度2个度量展示对比条形图
	if((switch_row_di == 1 && switch_col_me == 2 && switch_row_me == 0 && switch_col_di == 0) || (switch_row_di == 0 && switch_col_me == 0 && switch_row_me == 2 && switch_col_di == 1)){
		$("#show_contrastbar,#show_polyline").css("opacity","1");
	}else{
		$("#show_contrastbar").css("opacity","0.3");
	}

	


	//存储视图切换按钮对应的方法

//	var save_show_click_change = ["showTable_by_dragData()","one_de_one_me_handle('cake')","many_de_many_me_handle('polyline')","histogram_show(save_data_handle)","many_de_many_me_handle('number_bar')","one_de_one_me_handle('waterWall')","many_de_many_me_handle('percentage_bar')","histogram_show(save_data_handle)","many_de_many_me_handle('number_liner')","many_de_many_me_handle('comparisonStrip')","many_de_many_me_handle('percentage_liner')","one_de_one_me_handle('area')","one_de_one_me_handle('scale')","one_de_one_me_handle('gantt')","drag_radarChart(save_data_handle)","many_de_many_me_handle('reliationTree')"]

	//[文本表,饼图,折线图,柱状图,堆积柱状图,瀑布图,百分比堆积柱状图,条形图,堆积条形图,对比条形图,百分比堆积条形图,面积图,范围图,甘特图,雷达图,树状图]



		
	

	
show_btn_change.removeClass("show_view_success");
// end-----------
for(var i = 0 ; i < show_btn_change.length;i++){
	if(show_btn_change.eq(i).css("opacity") == "1"){
		show_btn_change.eq(i).addClass("show_view_success");
	}
}



//遍历所有视图按钮给定绘图方法
		show_btn_change.each(function(index,ele){
			$(ele).on("click",function(){
				show_btn_change.removeClass("clicked");
				show_btn_change.css({"background":"","border":""});
				$(".project_icon_hint_wrap").remove();
				if($(ele).css("opacity") == 1){
					$(ele).addClass("clicked");
					if($(ele).data("if_show") != "true"){
						show_btn_change.data("if_show","");
						$(ele).data("if_show","true");
						click_view_icon = true;
						save_now_show_view_text = $(ele);
						if(save_now_show_view_text.attr("id") == "show_table"){
								
								$("#view_show_area #view_show_area_content #view_show_wrap #main").hide();
								$("#view_show_area #view_show_area_content #view_show_wrap #card").hide();

							}else if(save_now_show_view_text.attr("id") == "show_card"){
								$("#view_show_area #view_show_area_content #view_show_wrap #main").hide();
								$("#view_show_area #view_show_area_content #view_show_wrap #text_table_need_show").hide();
							}else{
								$("#view_show_area #view_show_area_content #view_show_wrap #card").hide();
								$("#view_show_area #view_show_area_content #view_show_wrap #text_table_need_show").hide();
							}
						spinner.spin(target);
						$(".maskLayer").show();
//						console.log(save_now_show_view_text)
						eval(save_now_show_view_text.data("show_view_fun"));
						var target =  $("#view_show_wrap").get(0);
    					
						view_name = save_now_show_view_text.data("show_view_fun");

						return;
					}
				}
			})
		})




//编辑视图直接生成对应视图
	if(edit_view != undefined){
		$("#main").css("display","none");
		eval(edit_view);
		view_name = edit_view;
		show_btn_change.data("if_show","");
		for(var i = 0 ; i < show_btn_change.length;i++){
		if(show_btn_change.eq(i).data("show_view_fun") == edit_view){
			show_btn_change.eq(i).data("if_show","true").addClass("show_view_success");
			click_view_icon = true;
			save_now_show_view_text = show_btn_change.eq(i);

			}
		}



		return;
	}else{
		
		if(!save_now_show_view_text.hasClass("show_view_success")){
			if($("#show_histogram").css("opacity") == "1"){
				$("#view_show_area #view_show_area_content #view_show_wrap #text_table_need_show").css("display","none");
				save_now_show_view_text = $("#show_histogram");
			}else if($("#show_bar").css("opacity") == "1"){
				$("#view_show_area #view_show_area_content #view_show_wrap #text_table_need_show").css("display","none");
				save_now_show_view_text = $("#show_bar");
			}else{
				$("#view_show_area #view_show_area_content #view_show_wrap #main").css("display","none");
				save_now_show_view_text = $("#show_table");
			}
		}

		eval(save_now_show_view_text.data("show_view_fun"));
		view_name = save_now_show_view_text.data("show_view_fun");
		save_now_show_view_text.data("if_show","true");
		show_btn_change.not(save_now_show_view_text).data("if_show","");

	}


	if(switch_col_di !=  0 || switch_col_me != 0 || switch_row_di != 0 || switch_row_me != 0){
	
			$("#dashboard_content #action_box #action_box_ul #action_save").css("opacity","1");
			save_btn_fun();
		}
	
	if(switch_col_di ==  0 && switch_col_me == 0 && switch_row_di == 0 && switch_row_me == 0){
		$("#dashboard_content #action_box #action_box_ul #action_save").css("opacity","0.5").unbind("mouseleave click");
	}


}
