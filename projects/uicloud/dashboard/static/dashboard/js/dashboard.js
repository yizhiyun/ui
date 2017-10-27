// 记录拖拽到行列等的数据
var drag_row_column_data = {
	"row":{
		"dimensionality":[],
		"measure":[]
	},
	"column":{
		"dimensionality":[],
		"measure":[]
	}
}

var drag_measureCalculateStyle = {};

var view_name = null;

// 记录当前操作的数据块数据
var current_cube_name = null;
// 对象中以表名作为 key 值存储，表的数据
var _cube_all_data = {};


//记录当前当前拖拽的到底是行 还是列
// 行为：row，列为 column
var _drag_message = {
	"position":null, // 行还是列
	"type":null, // 维度还是度量
	"index":null // 拖拽的下标。。可能暂时不用
};

//用户名
var username = "liuyue";
//视图保存的数据
var post_dict ={};
var now_build_tables = [];

//存储视图对应的数据生成图形
var view_homo_data = {};

//视图标题对应的下标
var view_title_index =null;


var loc_storage=window.localStorage;

// var ses_storage=window.sessionStorage;
//记录ajax传递过来的数据
var ajax_data_post = null;


var if_or_load = false;

// 算法对象
var editor = null;
// 记录当前点击哪个度量进行计算
var currentHandleMeasureCalculate = null;
var editMeasureCalculateView_isFirstShow = true;

//存放当前给定的默认指标

var getIndexName = [];


var noDrop = false;

//记录上一次生成的视图是否需要和编辑视图相同 避免重复编辑

var savePreDictId  = {};


var isDisaed = true;


 //记录多窗口报表名称

var changeManyWall = {};


var add_view_count = 0;

//记录标签页上一个点击对应的内容视图
var clickWallPre = null;

var preClickView = {};

//记录当前要保存的元素对应的视图

var nowDeleteElement = null;

//维度度量转换记录类型
var saveTypeElement = null;

//保存视图触发事件
function save_btn_fun(){
	$("#dashboard_content #action_box #action_box_ul #action_save").unbind("click");
	//保存按钮下拉框
	$("#dashboard_content #action_box #action_box_ul #action_save").on("click", function() {
	
	$("#action_save_view").stop(true).toggle();
	
	});
	
	$("#dashboard_content #action_box #action_box_ul #action_save").on("mouseleave", function() {
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

function dashboardReadySumFunction(isOnlyLoad){
	$.ajax({
		url:"/cloudapi/v1/tables",
		type:"get",
		dataType:"json",
		contentType: "application/json; charset=utf-8",
		success:function(data){
			
			if (data["status"] == "success") {
				if(sessionStorage.getItem("edit_view_now")){
					//获取编辑的视图
					var hava_view_edit_old = sessionStorage.getItem("edit_view_now");
					var have_view_edit = sessionStorage.getItem("edit_view_now").split(",");
					// 创建数据块

				cubeSelectContent_fun(data["results"],have_view_edit[3]);
				}else{
					// 创建数据块

				cubeSelectContent_fun(data["results"]);
				}

				save_data_sum_handle = data["results"];

			}	
		}
		
	});
	
	
	//编辑跳回后对颜色 小数点等对应的修改
	function editView_change_color(colorArr,filterArr){
		//修改对应颜色
		var getColor_arr = allColorsDict[colorArr.split("_YZY_")[0]];
		$("#project_chart #project_style .defaultColors .color_flag").text(colorArr.split("_YZY_")[0]);
		for(var i =0; i < 5;i++){
			$("#project_chart #project_style .defaultColors .selectedColors span").eq(i).css("background",getColor_arr[i]);
		};

		//小数点的切换
		$("#project_chart #project_style .module_style .normalUnit .content span").add($("#project_chart #project_style .module_style .valueUnit .content span")).removeClass("active");
		$("#project_chart #project_style .module_style .normalUnit .content span[unit="+colorArr.split("_YZY_")[1]+"]").addClass("active");

		//值单位的切换
		$("#project_chart #project_style .module_style .valueUnit .content span").each(function(index,ele){
			if($(ele).text() == colorArr.split("_YZY_")[2]){
				$(ele).addClass("active");
			}
		})

		//右侧筛选器显示
		rightFilterListDraw();
		
	}

	$("#dashboard_content #view_show_area #view_show_area_content .MoMInfo .monHeader .unitSelectDiv select").comboSelect();

//视图清空 页面初始化
	function empty_viem_init(change_or_click){
		$("#operational_view .annotation_text .drag_text").show();
		//清空维度度量里面的数据
		$("#operational_view .annotation_text").find(".list_wrap").remove();
		$("#operational_view .annotation_text").find("li").remove();
		
		if(change_or_click == "click"){
		//选择块恢复默认
		$('#lateral_title .custom-select').find("option").removeAttr("selected");
		$('#lateral_title .custom-select').find("option").eq(0).attr("selected","selected");
		$('#lateral_title .custom-select').comboSelect();
		
		}	
		drag_row_column_data = {
			"row":{
				"dimensionality":[],
				"measure":[]
			},
			"column":{
				"dimensionality":[],
				"measure":[]
			}
		}
		//清空视图展示区域
		$("#view_show_wrap #main").hide();
		$("#view_show_wrap #text_table_need_show").hide();
		$("#view_show_area_content #view_show_empty").show();
		initTable_name();
		$("#project_chart ul li").data("if_show","").css("border","").css("opacity","0.3");


		drag_measureCalculateStyle = {};

		// 移除表格的数据
		emptyAllTable();

		isagainDrawTable = true;

		save_row_de_wrap =[];
		save_row_me_wrap = [];
		save_col_de_wrap = [];
		save_col_me_wrap = [];
		row_if_me = [];
		row_if_de = [];
		col_if_me = [];
		col_if_de = [];

		click_view_icon = false;

		editView_change_color("默认_YZY_-1_YZY_个");
		
		currentColorGroupName = "默认";

		normalUnitValue = -1;

		valueUnitValue = "个";

		customCalculate = {};
	
		noDrop = false;	

		view_name = null;

		//移除指标恢复拖拽滚动
		var disabled = $(".drop_view").droppable("option", "disabled");

		$(".drop_view").droppable("option", "disabled", false);

		$(".drop_view").sortable({ disabled: false });

		$(".drop_view,#drop_zb_view").css("background", "");

		if($("#drag_zb .annotation_text").hasClass("ui-droppable")){
			var disabled = $("#drag_zb .annotation_text").droppable("option", "disabled");

			$("#drag_zb .annotation_text").droppable("option", "disabled", false);

			$("#drag_zb .annotation_text").sortable({ disabled: false });
		}


		$("#view_show_area_content").droppable({disabled:true});

		$("#drag_zb .annotation_text").data("nowShowIndex","");


		//视图保存恢复
		$("#dashboard_content #action_box #action_box_ul #action_save").css("opacity","0.6");
		$("#dashboard_content #action_box #action_box_ul #action_save").unbind("click");

		//判断之前存在视图 清空视图
		if(echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0))){

			echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0)).clear();

		}

	}

	//根据已有的维度度量恢复数据展示
	function reason_old_show(ele_wrap,current_cube_name,now_title_handle_view,drag_measureCalculateStyle,indexEdit){
		$("#operational_view #drag_row .annotation_text .drag_text,#operational_view #drag_col .annotation_text .drag_text").hide();
		$("#drag_wrap_content #drag_row .annotation_text .list_wrap,#drag_wrap_content #drag_row .annotation_text li").remove();
		$("#drag_wrap_content #drag_col .annotation_text .list_wrap,#drag_wrap_content #drag_col .annotation_text li").remove();
		for (col_or_row in ele_wrap){
			//遍历对应的维度度量是否存在数据
			for(view_data_md in ele_wrap[col_or_row]){
				//判断得到的数组不为空
				if(ele_wrap[col_or_row][view_data_md].length != 0){
					for(var i = 0; i < ele_wrap[col_or_row][view_data_md].length; i++){

						//创建元素
					var reason_old_content = $("<div class='list_wrap'><li class='drog_row_list date_list bj_information' id='"+view_data_md+":"+ele_wrap[col_or_row][view_data_md][i]+"'><div class='drop_main clear set_style "+view_data_md+"_list_text ui-draggable ui-draggable-handle'><span class='"+view_data_md+"_list_text_left'></span><div class='moreSelectBtn'><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'></div></div></li></div>");

					reason_old_content.find(".set_style").on("mouseenter",function(){$(this).find(".moreSelectBtn").show()});
					reason_old_content.find(".set_style").on("mouseleave",function(){$(this).find(".moreSelectBtn").hide()});
					if(view_data_md == "dimensionality"){
						reason_old_content.find("li").css("background","#c5e0ff");
						reason_old_content.find("."+view_data_md+"_list_text_left").text(ele_wrap[col_or_row][view_data_md][i].split(":")[0])
						if(col_or_row == "row"){
							reason_old_content.appendTo($("#drag_wrap_content #drag_row .annotation_text"));
						}else{
							reason_old_content.appendTo($("#drag_wrap_content #drag_col .annotation_text"));
						}
					}else{
						reason_old_content.find("li").css("background","#ffcc9a").data("field_name",ele_wrap[col_or_row][view_data_md][i].split(":")[0]).data("pop_data_handle",username+"_YZY_"+ $("#lateral_bar #lateral_title .combo-select ul").find(".option-selected").text()+"_YZY_"+ ele_wrap[col_or_row][view_data_md][i].split(":")[0]);
						reason_old_content.find("."+view_data_md+"_list_text_left").text(drag_measureCalculateStyle[ele_wrap[col_or_row][view_data_md][i].split(":")[0]]);
						if(col_or_row == "row"){
							reason_old_content.appendTo($("#drag_wrap_content #drag_row .annotation_text"));
						}else{
							reason_old_content.appendTo($("#drag_wrap_content #drag_col .annotation_text"));
						}
					}


					$(reason_old_content).find("li").css({
						width: $(".annotation_text").width() * 0.91+ "px",
						height: "23px",
						lineHeight: "23px",
						margin: "5px auto 0",
						listStyle: "none",
					});
					$(reason_old_content).find(".set_style").css({
						width: "94%",
						height: "23px",
						background: "",
						padding: "0px 5px",
						color: "black"
					});
					$(reason_old_content).find(".set_style").find("span").css({
						float: "left",
						display: "block",
					});
					$(reason_old_content).find("img").css({
						display: "block",
					})


					}
				}
			}
		}
		//度量更多操作过程
		md_click_show($(".annotation_text .measure_list_text_left").parent().find(".moreSelectBtn"),{"编辑计算_YZY_edit_calculation":null,"度量_YZY_measure":["计数_YZY_pop_count_all","求和_YZY_pop_total","平均值_YZY_pop_mean","最大值_YZY_pop_max","最小值_YZY_pop_min"],"移除_YZY_deleting":null});
		if(indexEdit && indexEdit != "noLocation"){
			var viewIndexStyle = "indexstyle";
			var viewIndexType = "indextype";
		}else{
			var viewIndexStyle = "viewstyle";
			var viewIndexType = "viewtype";
		}

		currentColorGroupName = now_title_handle_view[viewIndexStyle].split("_YZY_")[0];
		normalUnitValue = now_title_handle_view[viewIndexStyle].split("_YZY_")[1];
		valueUnitValue = now_title_handle_view[viewIndexStyle].split("_YZY_")[2];
		if(now_title_handle_view[viewIndexStyle].split("_YZY_")[3] != undefined){
			$("#view_show_area .tableView_name").css("color","#000");
			$("#view_show_area .tableView_name h4").html(now_title_handle_view[viewIndexStyle].split("_YZY_")[3]);
		}
		customCalculate = JSON.parse(now_title_handle_view["customcalculate"]);
		editView_change_color(now_title_handle_view[viewIndexStyle],ele_wrap["row"]["dimensionality"].concat(ele_wrap["column"]["dimensionality"]));
		switch_chart_handle_fun(now_title_handle_view[viewIndexType]);
		}

	//根据编辑过的视图重新展示
	function edit_view_show(edit_view,result,second,indexEdit){

		if(indexEdit || indexEdit == "noLocation"){
			var now_title_handle_view = result;
		}else{
			//当前操作的数据
			var now_handle_view = edit_view.data("edit_view").split(",");
			//当前标题对应视图的数据
			var now_title_handle_view =result[now_handle_view[0]][now_handle_view[1]][now_handle_view[2]];
		}



		if(second == "noedit"){
			if_or_load = true;
			//更改数据源展示
			cubeSelectContent_fun(save_data_sum_handle,now_title_handle_view["tablename"]);
		}

		//获取维度度量
		drag_row_column_data["row"] = JSON.parse(now_title_handle_view["row"]);

		drag_row_column_data["column"] = JSON.parse(now_title_handle_view["column"]);


		current_cube_name = now_title_handle_view["tablename"];


		// //....
		// if(now_title_handle_view["viewtype"] != "many_de_many_me_handle(radarChart)" || "many_de_many_me_handle(save_data_handle)"){
		// 	_drag_message["position"] = null;
		// 	if(drag_row_column_data["row"]["dimensionality"].length != 0){
		// 		_drag_message["type"] ="sortable_row";
		// 	}else{
		// 		_drag_message["type"] ="sortable_column";
		// 	}
		// }
		$("#view_show_empty").hide();
		$("#view_show_area #view_show_area_content .tableView_name").show();
		drag_measureCalculateStyle = JSON.parse(now_title_handle_view["calculation"]);
		reason_old_show(drag_row_column_data,current_cube_name,now_title_handle_view,drag_measureCalculateStyle,indexEdit);
	}



	function dashboard_edit_view_handle(){
		if(isOnlyLoad){
			$("#dashboard_content #new_view ul .edit_list").remove();
		}
		$.post("../dashboard/getAllData",{"username":username},function(result){

		if(Object.getOwnPropertyNames(result).length != 0){
			
			ajax_data_post = result;
			if(sessionStorage.getItem("edit_view_now")){
					//获取编辑的视图
					var hava_view_edit_old = sessionStorage.getItem("edit_view_now");
					var have_view_edit = sessionStorage.getItem("edit_view_now").split(",");
				}
		
			for(folder in result){
				for(folder_view in result[folder]){
					for(folder_view_name in result[folder][folder_view]){
						if(result[folder][folder_view][folder_view_name]["viewname"] == null){
							var tableViewName = folder_view +"-"+folder_view_name;
						}else{
							var tableViewName = folder_view +"-"+result[folder][folder_view][folder_view_name]["viewname"];
						}
						preClickView[tableViewName] = result[folder][folder_view][folder_view_name];
					//显示名称
						var add_view_post_name = folder_view+"-"+folder_view_name;
						view_homo_data[add_view_post_name] = result[folder][folder_view][folder_view_name];
						if(result[folder][folder_view][folder_view_name]["viewname"] != null){
							var changeViewName = result[folder][folder_view][folder_view_name]['viewname'];
						}else{
							var changeViewName = folder_view_name;
						}
						if(view_homo_data[add_view_post_name]["isopen"]){
							if(sessionStorage.getItem("edit_view_now")){
								if(view_homo_data[add_view_post_name]["id"] == result[have_view_edit[0]][have_view_edit[1]][have_view_edit[2]]["id"]){
									//获取编辑的视图
									var hava_view_edit_old = sessionStorage.getItem("edit_view_now");
									var have_view_edit = sessionStorage.getItem("edit_view_now").split(",");
									folder_view_add_show(have_view_edit[1]+"-"+changeViewName,"edit",hava_view_edit_old,result[have_view_edit[0]][have_view_edit[1]][have_view_edit[2]]["id"]);
									continue;
							   }
							}
							folder_view_add_show(folder_view+"-"+changeViewName,"new",folder+","+folder_view+","+folder_view_name+","+result[folder][folder_view][folder_view_name]["tablename"],result[folder][folder_view][folder_view_name]["id"]);
					
					}

				}
			}
			
		}
		
		}
	})


	}

	 // 创建左侧列表一个指标元素
 function createAIndexElementToLeftList(indexContent,isnewAdd){
 	var indexLi = $("<li class='index_li'><p class='index_list_text'><span class='index_list_text_left'>"+indexContent+"</span></p>"+"<input class='userinput' value="+indexContent+"></li>");
 	$("#dashboard_content #lateral_bar #indicator #index_show ul").prepend(indexLi);
 	indexLi.find(".userinput").data("originalValue",indexContent).css("textIndent","5px");
 	
 	indexLi.find(".index_list_text").on("mouseenter", function(event) {
 			event.stopPropagation();
 			$(this).css("background", "#a7eff4");
 			$(this).css({
				height: "21px",
				border: "1px solid #86a9d1",
				lineHeight: "21px",
				padding: "0px 4px"
			});
	})

	indexLi.find(".index_list_text").on("mouseleave", function() {
		$(this).css({
			background: "white",
			height: "23px",
			lineHeight: "23px",
			padding: "0px 5px",
			border: "none",
		});
	});
	
 	if(!isnewAdd){
 		indexLi.find(".index_list_text").show();
 		indexLi.find(".userinput").hide();
 	}else{
 		indexLi.find(".index_list_text").hide();
 		indexLi.find(".userinput").show();
 	}
 	indexLi.find(".userinput").change(function(event){
 		if(!$(this).val()){
 			$(this).css("border","1px solid red");
 			$(this).get(0).focus();
 			return;
 		}
 		var originalVal = $(this).data("originalValue");
 		var newValue = $(this).val();
 		$.ajax({
 			url:"/dashboard/indexGet",
 			type:"post",
			dataType:"json",
			contentType: "application/json; charset=utf-8",
			async: true,
			data:JSON.stringify({"username":"yzy","tablename":current_cube_name,"indexname":originalVal,"newname":newValue}),
			success:function(data){
				console.log("changeName:",data);
				getIndexName[$.inArray(originalVal,getIndexName)] = newValue;
			}
 		});
 	});
 	indexLi.find(".userinput").focusout(function(event){
 		if(!$(this).val()){
 			$(this).css("border","1px solid red");
 			$(this).get(0).focus();
 			return;
 		}
 		$(this).hide();
 		$(this).css("border","0px");
 		$(this).siblings(".index_list_text").children("span").text($(this).val());
 		$(this).siblings(".index_list_text").show();

 		//记录当前数据对应的指标
 		$("#drag_zb .annotation_text").data("nowShowIndex",$(this).val());

 	});
 	indexLi.find(".userinput").focusin(function(event){
 		event.stopPropagation();
 		//记录之前的名字
 		$(this).data("originalValue",$(this).val());
 	});
 	indexLi.find(".index_list_text").dblclick(function(event){
 		event.stopPropagation();
 		$(this).hide();
 		$(this).siblings(".userinput").show();
 		$(this).siblings(".userinput").get(0).focus();
 	});
 	indexLi.find(".userinput").get(0).focus();
 	indexDrog();
 }


   	//.......................指标操作
  function indexDrog(){
	//指标拖拽
	$(".index_list_text").each(function(index, ele) {

	$(ele).draggable({
		addClasses: false,
		appendTo: "body",
		helper: "clone",
		start: function() {
			$(".type_wic").remove();
			//恢复滚动
			enable_scroll();
			//恢复绑定事件
			$(".dimensionality_datatype").css("background", "");
		}
	});

	$("#drop_zb_view").droppable({
		activeClass: "ui-state-default_z",
		// hoverClass: "ui-state-hover_z",
		// accept: $(".index_list_text"),

		drop: function(event,ui) {

			if($(event.target).attr("id") == "drop_zb_view" && !noDrop){
				noDrop = true;
				$("#sizer_mpt").hide();
				$("#view_show_empty").hide();
				$("#view_show_area #view_show_area_content .tableView_name").show();

				var disabled = $(".drop_view").droppable("option", "disabled");
				$("#drag_zb .annotation_text").droppable("option", "disabled", true);

				// $("#drag_zb .annotation_text").sortable({ disabled: true });

				$("#drag_zb .annotation_text").css("background", "rgba(0,0,0,0.2)");

				$(this).find(".drag_text").css("display", "none");
				$(ui.draggable).parent().find(".userinput").remove();
				$("<li class='index_row_list'></li>").html($(ui.draggable).parent().html()).appendTo(this);

				$(".index_row_list").each(function(index, ele) {
					if($(ele).parent().attr("class") != "list_wrap") {
						$(ele).wrap("<div class='list_wrap'></div>");
					}
				})
				$(this).find("li").css({
					width: $(".annotation_text").width() * 0.91 + "px",
				});
				$(this).find("li p").css("background","#a7eff4").css("padding","0px").css("margin-left","0px");

				//判断拖拽的指标是否是已经显示的数据
				if(ui.draggable.find("span").text() != $("#drag_zb .annotation_text").data("nowShowIndex")){
					 	$.ajax({
							url:"/dashboard/indexGet",
							type:"post",
							dataType:"json",
							contentType: "application/json; charset=utf-8",
							async: true,
							data:JSON.stringify({"username":"yzy","tablename":current_cube_name,"indexname":ui.draggable.find("span").text()}),
							success:function(result){
								edit_view_show(null,result.data,"noedit",true);
							//	$(".rightConent #dashboard_content #new_view ul .auto_show .folderview_li_span").text("指标-"+ui.draggable.find("span").text()).attr("title","指标-"+ui.draggable.find("span").text());
							}
						});
				}
				}

			
		}

	}).sortable({
			zIndex: "2000",
			items: ".index_row_list",
			connectWith: "#view_show_area_content",
			tolerance: "pointer",
			start:function(event,ui){
				$("#view_show_area_content").css("border","1px solid #000");
			},
			update:function(event,ui){
					noDrop = true;
					event.stopPropagation();
					//判断拖入视图展示区域移除指标
					if($("#view_show_area_content").find(".index_row_list").length > 0){
						empty_viem_init();
						$(".handleAll_wrap #operational_view #drag_zb .annotation_text,#view_show_area_content").css("background","").css("border","none");
						$("#drag_zb .annotation_text").droppable("option", "disabled", false);
					}
			},
			stop:function(){
					$(".handleAll_wrap #operational_view #drag_zb .annotation_text,#view_show_area_content").css("border","none");
					$("#drag_zb .annotation_text").droppable("option", "disabled", false);
			}

	}).disableSelection();

})
}

//禁止滚动条滚动
	function preventDefault(e) {
		e = e || window.event;
		if(e.preventDefault)
			e.preventDefault();
		e.returnValue = false;
	}

	function wheel(e) {
		preventDefault(e);
	}

	function disable_scroll() {
		if(window.addEventListener) {
			window.addEventListener('DOMMouseScroll', wheel, false);
		}
		window.onmousewheel = document.onmousewheel = wheel;

	}

	function enable_scroll() {
		if(window.removeEventListener) {
			window.removeEventListener('DOMMouseScroll', wheel, false);
		}
		window.onmousewheel = document.onmousewheel = document.onkeydown = null;
	}

	//点击标签页 移除
	function clickViewTo(title){
		if($(".rightConent #dashboard_content #new_view ul li[title="+title+"]").attr("title_change") == $(".rightConent #dashboard_content #new_view ul li").length -1){
			var view_title_index = Number($(".rightConent #dashboard_content #new_view ul li[title="+title+"]").attr("title_change"))-1;
		}else{
			var view_title_index = Number($(".rightConent #dashboard_content #new_view ul li[title="+title+"]").attr("title_change"));
		}
		
		//删除视图对应的显示和关闭
		if(/-/gi.test(title)){
			$.post("../dashboard/setSwitch",{"switch":"isopen","id":$(".rightConent #dashboard_content #new_view ul li[title="+$("#pageDashboardModule #clickWallDelete").data("nowDeleteView")+"]").data("tableViewId")});
		}



		$(".rightConent #dashboard_content #new_view ul li[title="+title+"]").remove();

		for(var i = 0; i < $(".rightConent #dashboard_content #new_view ul li").length;i++){
			add_view_count = $(".rightConent #dashboard_content #new_view ul li").eq(i).attr("title").match(/\d+/g);
			if(add_view_count < $(".rightConent #dashboard_content #new_view ul li").eq(i).attr("title").match(/\d+/g)){
				add_view_count = $(".rightConent #dashboard_content #new_view ul li").eq(i).attr("title").match(/\d+/g);
			}
			$(".rightConent #dashboard_content #new_view ul li").eq(i).attr("title_change",i);

		}

		if(Math.ceil($("#new_view").width()/90) > $(".rightConent #dashboard_content #new_view ul li").length){
			$(".rightConent #dashboard_content #new_view ul li").css("width","90px");
			$(".rightConent #dashboard_content #new_view ul li .folderview_li_del_btn").css("display","block");
			}else{
			$(".rightConent #dashboard_content #new_view ul li").css("width",$("#new_view").width()/$(".rightConent #dashboard_content #new_view ul li").length + "px");
			}

			
			if($("#pageDashboardModule #clickWallDelete").data("nowViewIf")){
				$(".rightConent #dashboard_content #new_view ul li[title_change="+view_title_index+"]").addClass("auto_show");
				$(".rightConent #dashboard_content #new_view ul li[title_change="+view_title_index+"]").find(".folderview_li_del_btn").css("display","block");
				if($(".rightConent #dashboard_content #new_view ul li[title_change="+view_title_index+"]").data("edit_view") != undefined || (preClickView[$(".rightConent #dashboard_content #new_view ul li[title_change="+view_title_index+"]").find(".folderview_li_span").text()] != null && preClickView[$(".rightConent #dashboard_content #new_view ul li[title_change="+view_title_index+"]").find(".folderview_li_span").text()]["viewtype"] != null)){
					//视图保存事件
					$("#dashboard_content #action_box #action_box_ul #action_save").css("opacity","1");
					save_btn_fun();
					if($(".rightConent #dashboard_content #new_view ul li[title_change="+view_title_index+"]").data("edit_view") != undefined){
						sessionStorage.setItem("edit_view_now",$(".rightConent #dashboard_content #new_view ul li[title_change="+view_title_index+"]").data("edit_view"));
						edit_view_show($(".rightConent #dashboard_content #new_view ul li[title_change="+view_title_index+"]"),ajax_data_post,"noedit");
					}else{
						edit_view_show(null,preClickView[$(".rightConent #dashboard_content #new_view ul li[title_change="+view_title_index+"]").find(".folderview_li_span").text()],"noedit","noLocation");
					}
					
				}else{
					if($(".rightConent #dashboard_content #new_view ul li[title_change="+view_title_index+"]").data("edit_view") != undefined){
						sessionStorage.removeItem("edit_view_now");
					}
					
					empty_viem_init("click");
				}
			}

		delete preClickView[$("#pageDashboardModule #clickWallDelete").data("nowDeleteView")];

		//判断是否标签页是否全部删除
		if($(".rightConent #dashboard_content #new_view ul li").length == 0){
			preClickView = {};
			add_view_count = 0;
			folder_view_add_show("新建视图","old");
			preClickView["新建视图"] = null;
		}

	}


 //创建报表弹窗
function add_state_name(){
	$(".save_delect").remove();
	$("#key_search").css("display","none");
	$("#view_add_state").css("display","block");
	$("#view_add_state").find("input").val("");
	$("#btn_save_name").css("background","");
	$("#body_content_shadow").css("display","block");
	$(".show_view_if_hide").on("mouseenter",function(){
		$(".show_view_if_hide").css("borderBottom","1px solid #0d53a4");
	})
	$(".show_view_if_hide").on("mouseleave",function(){
		$(".show_view_if_hide").css("borderBottom","none");
	})


	$("#view_save_up").css({
		display:"block",
		left:$("body").width()  * 0.5 - $("#view_save_up").width()/2 -30 + "px",
		top:$("#dashboard_content").height() * 0.5 - $("#view_save_up").height()/2 + "px",
	});
	//保存视图按钮关闭点击
	$(".view_save_up_close img,#save_handle_close").on("click",function(){
		$("#body_content_shadow").css("display","none");
		$("#view_save_up").css("display","none");
	})
	//点击创建报表名称
	$("#btn_save_name").unbind("click");
	$("#btn_save_name").on("click",function(){
		$("#key_search").css("display","block");
		// $("#show_excel_name").html("");
		//输入框里面的值
		var action_input_data = $("#action_new_view").val();
		if(action_input_data == ""){
			$("#action_new_view").css("borderColor","red");
			return;
		}
		//输入框内容不为空创建对应元素
		$("#action_new_view").css("borderColor","#DEDEDED");

		var new_data_name = $("<div class='statement_li save_delect clear'><div class='statement_li_content'><img src=../static/dashboard/img/form_icon.png  class='view_show_icon'><div class='view_show_name_save filter_view_class'>"+action_input_data+"</div></div><div class='view_show_content'></div></div>");
		new_data_name.prependTo("#show_excel_name");
		new_data_name.addClass("only_folder");
		$(".filter_view_class").removeClass("active_folder_view");
		new_data_name.find(".view_show_name_save").addClass("active_folder_view");
		$("#view_save_show_search").css("display","block");
		$("#btn_save_name").css("background","#DEDEDE").unbind("click");
		$("#view_add_state").css("display","none");
		$(".show_view_if_hide").css("color","#808080").unbind("mouseenter mouseleave").css("cursor","default");

		//报表之间切换
	$(".filter_view_class").each(function(index,ele){
		$(ele).on("click",function(){
			$(".filter_view_class").removeClass("active_folder_view");
			$(ele).addClass("active_folder_view");
		})
	})
	})

	//报表弹窗筛选功能
	$("#key_search_input").on("input",function(){
	
		//搜索里输入的值
		var search_input_data  = $("#key_search_input").val();

		if(search_input_data == ""){
			$(".filter_view_class").removeClass("active_folder_view");
			$("#show_excel_name").children().css("display","block");

			return;
		}

		$("#show_excel_name").children().css("display","none");
			var reg_str = "/"+search_input_data+"/gi";

			var list_p=$("#show_excel_name .filter_view_class");

			for(var i = 0 ; i < list_p.length;i++){

			var reg = eval(reg_str);

			(function(index){

				var list_li_text = list_p.eq(index).text();
				
				if(reg.test(list_li_text) == true){
					if(list_p.eq(index).parent().parent().parent().attr("class") == "state_folder"){
						$(".filter_view_class").removeClass("active_folder_view");
						list_p.eq(index).addClass("active_folder_view");
						list_p.eq(index).parent().parent().parent().css("display","block");
					}else{
						$(".filter_view_class").removeClass("active_folder_view");
						list_p.eq(index).addClass("active_folder_view");
						list_p.eq(index).parent().parent().css("display","block");
					}
			
				// list_p.eq(index).css("display","block")
			}
			})(i);

		}

	})

	// end--
	}



//显示服务器里操作保存过的数据
function show_view_save_dashbash(data_result){
		$("#show_excel_name").html("");
		for(erv_data in data_result){
			if(erv_data != "default"){
					var folder = $("<div class='state_folder'><div class='state_folder_content'><img src=../static/dashboard/img/folder.png  class='click_folder'/><div class='view_show_name_save'>"+erv_data+"</div></div></div>");
					folder.prependTo($("#show_excel_name"));
					folder.find(".view_show_name_save");

			}
				for(small_view_show in data_result[erv_data]){
					
				var oDiv = $("<div class='statement_li clear'><div class='statement_li_content'><img src=../static/dashboard/img/form_icon.png  class='view_show_icon'><div class='view_show_name_save filter_view_class'>"+small_view_show+"</div></div><div class='view_show_content'></div></div>");
				if(erv_data != "default" && small_view_show != ""){
					oDiv.find(".view_show_name_save").parent().parent().addClass("floder_view_wrap");
					oDiv.appendTo(folder);
					folder.find(".statement_li").find(".view_show_name_save").css("width","324px");

					$("<img src=../static/dashboard/img/left_35.png  class='click_tra click_tra_floder'/>").prependTo($(folder).find(".state_folder_content"));
				}else{
					oDiv.addClass("only_folder");

					oDiv.appendTo($("#show_excel_name"));
				}


				}
		}

	//报表之间切换
	$(".filter_view_class").each(function(index,ele){
		$(ele).on("click",function(){
			$(".filter_view_class").removeClass("active_folder_view");
			$(ele).addClass("active_folder_view");
		})
	})
	//点击收起放下
	$(".click_tra_floder").each(function(index,ele){
		$(ele).on("click",function(){
			$(ele).parent().parent().find(".statement_li").toggle("blind",200,function(){
				if($(ele).parent().parent().find(".statement_li").css("display") == "none"){
				$(ele).attr("src","../static/dashboard/img/left_40.png");
				}else{
				$(ele).attr("src","../static/dashboard/img/left_35.png");
				}
			});
			
		})
	})
	}






//点击保存视图事件
	function saveViewBtn(noWindows){
		if(noWindows){
			add_state_name();
			//获取之前是否有保存的文件夹和报表
			
			$.post("../dashboard/getAllData",{"username":username},function(result){
				//判断第一次新建报表
				if(!result["default"]){
					$(".show_view_if_hide").css("color","#808080").unbind("mouseenter mouseleave").css("cursor","default");
				}else{
					//判断操作的数据是否为空
					if(Object.getOwnPropertyNames(result["default"]).length == 0 && Object.getOwnPropertyNames(result).length == 1){
						//数据为空
						$(".show_view_if_hide").css("color","#808080").unbind("mouseenter mouseleave").css("cursor","default");
					}else{
						$("#view_add_state").css("display","none");
						$(".show_view_if_hide").css("color","#0d53a4");
						$("#view_save_show_search").css("display","block");
						$(".show_view_if_hide").on("mouseenter",function(){
							$(".show_view_if_hide").css("borderBottom","1px solid #0d53a4");
						})
						$(".show_view_if_hide").on("mouseleave",function(){
							$(".show_view_if_hide").css("borderBottom","none");
						})
						$("#key_search").css("display","block");
						//显示服务器里操作保存过的数据
						show_view_save_dashbash(result);
					}
				}
			})
		}else{

			var editChangeView = preClickView[$(nowDeleteElement).find(".folderview_li_span").text()];
			// delete editChangeView['username'];
			// delete editChangeView['foldername'];
			// delete editChangeView['defaultparent'];
			editChangeView["id"] = $(nowDeleteElement).data("tableViewId");
			//直接覆盖之前编辑过的视图
			$.post("/dashboard/dashboardTableAdd",editChangeView,function(result){
				if(result["status"] == "ok"){
					 $("#pageDashboardModule #view_save_up").hide();
					 $("#pageDashboardModule #view_save_up #show_excel_name").html("");
					 $("#pageDashboardModule #body_content_shadow").hide();
					 clickViewTo($(nowDeleteElement).attr("title"));
				}else{
					alert("保存失败");
				}
			});
		}

}

	//关闭保存视图的操作事件
	function closeViewSave(){
		//取消事件
		$("#pageDashboardModule #clickWallDelete #clickWallDelete_close").unbind("click");
		$("#pageDashboardModule #clickWallDelete #clickWallDelete_close").on("click",function(){
			$("#body_content_shadow,#pageDashboardModule #clickWallDelete").hide();
			$("#pageDashboardModule #clickWallDelete .clickWallDelete_viewNamef").text("");
		})


		//不保存
		$("#pageDashboardModule #clickWallDelete .clickWallDelete_ok .clickWallDelete_no").unbind("click");
		$("#pageDashboardModule #clickWallDelete .clickWallDelete_ok .clickWallDelete_no").on("click",function(){
			$("#body_content_shadow,#pageDashboardModule #clickWallDelete").hide();
			$("#pageDashboardModule #clickWallDelete .clickWallDelete_viewName").text("");
			clickViewTo($("#pageDashboardModule #clickWallDelete").data("titleChange"));

		})

		//保存操作
		$("#pageDashboardModule #clickWallDelete .clickWallDelete_ok .clickWallDelete_yes").unbind("click");
		$("#pageDashboardModule #clickWallDelete .clickWallDelete_ok .clickWallDelete_yes").on("click",function(){
			$("#body_content_shadow,#pageDashboardModule #clickWallDelete").hide();
			$("#pageDashboardModule #clickWallDelete .clickWallDelete_viewNamef").text("");
			//当前点击关闭保存的元素
			nowDeleteElement = $(".rightConent #dashboard_content #new_view ul li[title="+$("#pageDashboardModule #clickWallDelete").data("nowDeleteView")+"]");
			if(nowDeleteElement.hasClass("edit_list")){
				var noWindows = false;
			}else{
				var noWindows = true;
			}
			saveViewBtn(noWindows);
		})
	}

	//实时保存修改标签页对应的数据
	function realSaveData(){
		//存储当前窗口对应的数据
			var saveNowWallDict = {};
			//判断表标题是否为空
			if($("#view_show_area #view_show_area_content .tableView_name h4").text() == "添加表标题"){
				saveNowWallDict["viewstyle"] = currentColorGroupName+"_YZY_"+normalUnitValue+"_YZY_"+valueUnitValue;
			}else{
				saveNowWallDict["viewstyle"] = currentColorGroupName+"_YZY_"+normalUnitValue+"_YZY_"+valueUnitValue+"_YZY_"+ $("#view_show_area #view_show_area_content .tableView_name h4").text();
			}
			saveNowWallDict["row"]= JSON.stringify(drag_row_column_data["row"]);
			saveNowWallDict["column"]= JSON.stringify(drag_row_column_data["column"]);
			saveNowWallDict["username"] = username;
			saveNowWallDict["tablename"] = current_cube_name;
			saveNowWallDict["viewtype"] = view_name;
			saveNowWallDict["defaultparent"] = "default";
			saveNowWallDict["calculation"] = JSON.stringify(drag_measureCalculateStyle);
			saveNowWallDict["customcalculate"] = JSON.stringify(customCalculate);

			return saveNowWallDict;
	}


	//判断两个视图对象的内容是否相等
	function SecondDict(obj1,obj2){

		if(obj2 == null && obj1["viewtype"] != null){
			return false;
		}
		if(obj1["viewtype"] == null || (obj1["row"] == obj2["row"] && obj1["column"] == obj2["column"] && obj1["username"] == obj2["username"] && obj1["tablename"] == obj2["tablename"] && obj1["viewtype"] == obj2["viewtype"] && obj1["calculation"] == obj2["calculation"] && obj1["customcalculate"] == obj2["customcalculate"] && obj1["viewstyle"] == obj2["viewstyle"])){
			return true;
		}else{
			return false;
		}
	}

	//创建视图标题展示和新建
	function folder_view_add_show(add_view_name,new_or_old,edit_view_save_data,tableViewId){
		var folderview_li = $("<li class='folderview_li_show' title="+add_view_name+"><span class='folderview_li_span'>"+add_view_name+"</span><div class='folderview_li_del_btn'></div></li>");
		if(new_or_old == "new"){
			folderview_li.addClass("edit_list").prependTo($(".rightConent #dashboard_content #new_view ul"));
			folderview_li.data("edit_view",edit_view_save_data).data("tableViewId",tableViewId);
		}
		if(new_or_old == "old"){
			folderview_li.addClass("empty_list").appendTo($(".rightConent #dashboard_content #new_view ul"));
			$(".rightConent #dashboard_content #new_view ul li").removeClass("auto_show");
			folderview_li.addClass("auto_show");
		}
		if(new_or_old != "new" && new_or_old != "old"){
			folderview_li.addClass("edit_list").prependTo($(".rightConent #dashboard_content #new_view ul"));
			$(".rightConent #dashboard_content #new_view ul li").removeClass("auto_show");
			folderview_li.data("edit_view",edit_view_save_data).addClass("auto_show").data("tableViewId",tableViewId);
			$("#dashboard_content #action_box #action_box_ul #action_save").css("opacity","1");
			save_btn_fun();
			edit_view_show(folderview_li,ajax_data_post);
		}

		//视图标题展示区域的宽度
		var view_show_title_width = $("#new_view").width();
		//视图标题的数量
		var view_show_title_count = $(".rightConent #dashboard_content #new_view ul li").length;
		//视图标题的宽度
		var view_show_evy_width = $(".rightConent #dashboard_content #new_view ul li").width();

		for(var i = 0; i < $(".rightConent #dashboard_content #new_view ul li").length;i++){
			$(".rightConent #dashboard_content #new_view ul li").eq(i).attr("title_change",i);
		}

		if(view_show_title_count * view_show_evy_width >= view_show_title_width){
			$(".rightConent #dashboard_content #new_view ul li").css("width",view_show_title_width/view_show_title_count + "px");
		}

		if(view_show_evy_width <= 74){
			$(".rightConent #dashboard_content #new_view ul li .folderview_li_del_btn").not($(".rightConent #dashboard_content #new_view ul .auto_show .folderview_li_del_btn")).css("display","none");

		}
		$(".rightConent #dashboard_content #new_view ul li").data("view_btn","true");

		//添加视图点击事件
		folderview_li.unbind("click");
		folderview_li.on("click",function(e){
			if($(this).hasClass("auto_show")){
				return;
			}
			clickWallPre = $(".auto_show").attr("title");
			
			var saveNowWallAll = realSaveData();

			preClickView[clickWallPre] = saveNowWallAll;
	
			isDisaed = false;
			if($(this).data("view_btn") == "true" && !$(e.target).is($("#new_view ul li .folderview_li_del_btn"))){
				// if($(this).data("edit_view") == undefined || $(this).data("edit_view").split(",").length == 3){
				// 	sessionStorage.removeItem("edit_view_now");
				// }
				$(".rightConent #dashboard_content #new_view ul li").removeClass("auto_show").data("view_btn","true");
				// $(".rightConent #dashboard_content #new_view ul li .folderview_li_del_btn").css("display","none");
				$(this).addClass("auto_show").data("view_btn","false");
				$(this).find(".folderview_li_del_btn").css("display","block");
				if(folderview_li.width() <= 74){
					$(".rightConent #dashboard_content #new_view ul li .folderview_li_del_btn").css("display","none");
					$(".rightConent #dashboard_content #new_view ul .auto_show .folderview_li_del_btn").css("display","block");
				}
				if(!/-/gi.test($(this).find("span").text())){

					empty_viem_init("click");
					if(preClickView[$(this).find(".folderview_li_span").text()] !=null && preClickView[$(this).find(".folderview_li_span").text()]["viewtype"] != null){
						save_btn_fun();
						$("#dashboard_content #action_box #action_box_ul #action_save").css("opacity","1");
						edit_view_show(null,preClickView[$(this).find(".folderview_li_span").text()],"noedit","noLocation");	
					}else{
						sessionStorage.removeItem("edit_view_now");
					}
					
					return;
				}else{

					$("#dashboard_content #action_box #action_box_ul #action_save").css("opacity","1");
					save_btn_fun();
					sessionStorage.setItem("edit_view_now",$(this).data("edit_view"));
					//判断视图库图形是否有更改
					var viewWallChange = SecondDict(preClickView[$(this).find("span").text()],ajax_data_post[$(this).data("edit_view").split(",")[0]][$(this).data("edit_view").split(",")[1]][$(this).data("edit_view").split(",")[2]]);
					if(!viewWallChange){
						
						edit_view_show(null,preClickView[$(this).find("span").text()],"noedit","noLocation");

						return;
					}
					
					edit_view_show($(this),ajax_data_post,"noedit");
				}

			}
		})


		//删除视图
		folderview_li.find(".folderview_li_del_btn").unbind("click");
		folderview_li.find(".folderview_li_del_btn").on("click",function(){
			//判断视图是否在显示
			if($(this).parent().hasClass("auto_show")){
				var nowViewShow = true;
			}else{
				var nowViewShow = false;
			}

			$("#pageDashboardModule #clickWallDelete").data("nowViewIf",nowViewShow).data("nowDeleteView",$(this).siblings(".folderview_li_span").text());

			

			//判断标签页视图是否正在显示
			if(nowViewShow){
				var deleteNowView = realSaveData();
				preClickView[$(this).siblings(".folderview_li_span").text()] = deleteNowView;
			}
			
			if($(this).parent().hasClass("edit_list")){
				var equalView = SecondDict(preClickView[$(this).siblings(".folderview_li_span").text()],ajax_data_post[$(this).parent().data("edit_view").split(",")[0]][$(this).parent().data("edit_view").split(",")[1]][$(this).parent().data("edit_view").split(",")[2]]);
			}else{
				var equalView = false;
			}



			if((preClickView[$(this).siblings(".folderview_li_span").text()] != null && preClickView[$(this).siblings(".folderview_li_span").text()]["viewtype"] != null) && equalView == false){
				$("#body_content_shadow,#pageDashboardModule #clickWallDelete").show().data("titleChange",$(this).parent().attr("title"));
				$("#pageDashboardModule #clickWallDelete .clickWallDelete_viewName").text($(this).siblings(".folderview_li_span").text());
			}else{
				clickViewTo($(this).parent().attr("title"));
			}

		})
	}

/*gxm-----start*/
	$("#view_show_wrap").data("table", "false");

	// 数据块选择 创建
	function cubeSelectContent_fun(build_tables,click_val){
		$('#lateral_title .custom-select').empty();
		var cube_select = $('#lateral_title .custom-select');
		for (var i =0; i < build_tables.length;i++) {
			var val = build_tables[i];
			var op = $("<option value="+val+">"+val+"</option>");
			if(click_val){
				if(click_val == val){

				op.attr("selected","selected");
				}
			}
			cube_select.append(op);
		}	
		now_build_tables = build_tables;
		
		// select选项卡
		cube_select.comboSelect();
		
		if(click_val){
			// 展示维度和度量等
			load_measurement_module(click_val)
		}else{
			// 展示维度和度量等
			load_measurement_module(cube_select.val())
		}
		
		// 数据选择 select 变化的时候，去获取新的数据
		// cube_select.unbind("change");
		cube_select.change(function(event){
			event.stopPropagation();
			if($(this).val() && now_build_tables.indexOf($(this).val()) != -1){
				if_or_load = true;
				empty_viem_init("change");
				isDisaed = false;
				load_measurement_module(cube_select.val());
			}
		});	
	}
	
	function getFilterAllData(){
		var exprlist = []; 
		for(var i = 0;i < _cube_all_data[current_cube_name].schema.length;i++ ){
			var aSchema = _cube_all_data[current_cube_name].schema[i];
			var obj = {"alias":aSchema["field"],"exprstr":"collect_set("+aSchema["field"]+")"};
			exprlist.push(obj);
		}
		var handleDataPost = {
			"expressions":{
				"exprlist":exprlist,
			}
		};
		
		$.ajax({
			url:"/cloudapi/v1/tables/" +current_cube_name+"/data",
			type:"post",
			dataType:"json",
			contentType: "application/json; charset=utf-8",
			async: true,
			data:JSON.stringify(handleDataPost),
			success:function(data){
				if(data.status == "success"){
					filterNeedAllData = data.results.data[0];
				}
			}
		})	
	}
	
	
	// 加载维度、度量等，需要在 select 加载完毕之后
	function load_measurement_module(current_cube){
		// 之前选择过的数据块  内存保存一份
		// 记录当前操作数据块的名称
		current_cube_name = current_cube;
		$("#dashboard_content #sizer_place #sizer_content .filter_header_div span.cubeTableName").html(current_cube_name);
		
		if (_cube_all_data[current_cube_name]) {
			var schema = _cube_all_data[current_cube_name]["schema"];
			factory_create_li_to_measurement_module(schema);
			if(!if_or_load){
				// $("#dashboard_content #new_view ul").html("");
				empty_viem_init("change");
				//视图编辑修改
				dashboard_edit_view_handle();
				}
			return;
		}

		//1、需要加载这个表格的 column schema
		$.ajax({
			url:"/cloudapi/v1/tables/" +current_cube+"/schema",
			type:"post",
			dataType:"json",
			success:function(data){
				if (data["status"] == "success") {
					var cube_all_data = data["results"];
					
					var schema = cube_all_data["schema"];

					for(var i = 0;i < schema.length;i++){
						schema[i]["isable"] = "yes";
					}
					_cube_all_data[current_cube_name] = cube_all_data;
					
					filterNeedAllData = null;
					getFilterAllData();
					
					factory_create_li_to_measurement_module(_cube_all_data[current_cube_name].schema);
					
					
					if(!if_or_load){
					// $("#dashboard_content #new_view ul").html("");

					empty_viem_init("change");
					//视图编辑修改
					dashboard_edit_view_handle();

					}
				}
			
			}
		});
		
		//2、工厂，根据数据去创建 维度和度量等的 Li
		function factory_create_li_to_measurement_module(schema){
			// 清空展示区域
		$("#dimensionality #dimensionality_show ul").html("");
		$("#measurement #measure_show ul").html("");
		
			for (var i = 0; i < schema.length;i++) {
				var column_name_info = schema[i];
				var  _name = column_name_info["field"]; // 字段名
				var _data_type = column_name_info["type"];  // 字段的数据类型
				var _show_type = column_name_info["coltype"]; // 维度还是度量，返回值是一个字符串		
				var type_indictot_img_path = _data_type.image_Name_Find(_show_type);	 // 数据类型指示图片的路径
				
	var aLi = $("<li class='" + _show_type+"_li leftNav_list'>"+"<div class='dimensionality_datatype'><img alt='datatype' src="+type_indictot_img_path+"/></div><div class='drop_list_main " + _show_type + "_list_main'"+"><div class='drop_main clear set_style " + _show_type + "_list_text'><span class=" + _show_type + "_list_text_left" + ">"+_name+"</span></div></div></li>");
	aLi.find(".set_style").append("<div class='moreSelectBtn'><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'/></div>");
				
				// 用来记录数据类型
				aLi.find(".drop_main").eq(0).data("type",_data_type);
				
				
				$("#"+_show_type+"_show ul").append(aLi);
							
			}
			
			var specialLi= $("<li class='" + "measure"+"_li leftNav_list'>"+"<div class='dimensionality_datatype'><img alt='datatype' src="+"/static/dataCollection/images/tableDataDetail/Integer.png"+"/></div><div class='drop_list_main " + "measure" + "_list_main'"+"><div class='recordCount drop_main clear set_style " + "measure" + "_list_text'><span class=" + "measure" + "_list_text_left" + ">"+"记录数"+"</span></div></div></li>");
			specialLi.find(".set_style").append("<div class='moreSelectBtn'><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'/></div>");
			specialLi.find(".drop_main").eq(0).data("type","number");
			$("#measure_show ul").append(specialLi);
			
			// 调用页面默认初始化
			if(isDisaed){
				navDashboardEventInit();
			}else{
				navDashboardEventInit(true);
			}
		if(getIndexName.length  == $("#pageDashboardModule #dashboard_content #lateral_bar #indicator #index_show .index_li").length && getIndexName.length != 0){
			return;
		}
		//加载指标
		$.ajax({
			url:"/dashboard/indexGet",
			type:"post",
			dataType:"json",
			contentType: "application/json; charset=utf-8",
		    "data":JSON.stringify({"username":'yzy',"tablename":current_cube_name}),
			success:function(data){
				if (data.status == "success") {
					getIndexName= data.indexNameList;
					$("#pageDashboardModule #dashboard_content #lateral_bar #indicator #index_show ul").html("");
					for(var i =0;i < data.indexNameList.length;i++){
						createAIndexElementToLeftList(data.indexNameList[i],false);
					}
				}
			}
		})


		}
		

			
	}

	 	//移除函数
	function remove_viewHandle(){
			drag_row_column_data["column"]["measure"]= [];
			drag_row_column_data["column"]["dimensionality"] =[];
			//遍历所有行里的li 排序后更新数据
			for(var i = 0; i < $("#drop_col_view").find("li").length;i++){
				//获取数据字段
				var data_id = $("#drop_col_view").find("li").eq(i).attr("id").split(":");
				//判断元素的类型
				var data_wd_type = data_id[0];
				//对应的数据
				var sortable_data = data_id[1]+":"+data_id[2];

				drag_row_column_data["column"][data_wd_type].push(sortable_data)
			}

			drag_row_column_data["row"]["measure"]= [];
			drag_row_column_data["row"]["dimensionality"] =[];

			//遍历所有行里的li 排序后更新数据
			for(var i = 0; i < $("#drop_row_view").find("li").length;i++){
				//获取数据字段
				var data_id = $("#drop_row_view").find("li").eq(i).attr("id").split(":");
				//判断元素的类型
				var data_wd_type = data_id[0];
				//对应的数据
				var sortable_data = data_id[1]+":"+data_id[2];

				drag_row_column_data["row"][data_wd_type].push(sortable_data)
			}

			
			// 移除筛选列
			rightFilterListDraw();
			switch_chart_handle_fun();
	}

	//创建弹窗
	function md_click_show(ele,data_dict){
				
					var open_or_close = true;
					
						$(ele).on("click",function(){
						//判断拖入的是否是计数
						if($(this).parent().hasClass("recordCount")){
							delete data_dict["度量_YZY_measure"];
						}
						if(open_or_close){
							open_or_close = false;
							currentHandleMeasureCalculate = $(ele).parent().parent(".drog_row_list");
								//创建最外层元素
							var out_wrap_click = $("<ul class='me_out_content'></ul>");
							var columnName = $(ele).parent().parent().data("field_name");
							
							out_wrap_click.appendTo($(ele).parent().parent()).data("pop_data_handle",username+"_YZY_"+ $("#lateral_bar #lateral_title .combo-select ul").find(".option-selected").text()+"_YZY_"+ columnName);
							
							out_wrap_click.css({
								"left":$(ele).parent().parent().offset().left + $(ele).parent().parent().width() - 60 -50+ "px",
								"top":$(ele).parent().parent().offset().top - 47+  "px",
							})
							for(out_wrap_count in data_dict){
								if(data_dict[out_wrap_count] != null){
								//创建单个元素
								var add_ele_evr = $("<li class='me_out_content_li "+out_wrap_count.split("_YZY_")[1]+"'><p>"+out_wrap_count.split("_YZY_")[0]+"</p><ul class='second_menu'><ul></li>");
								add_ele_evr.addClass("have_second_menu").appendTo(out_wrap_click);
									for(var i =0; i < data_dict[out_wrap_count].length;i++){
										$("<li class='second_li "+data_dict[out_wrap_count][i].split("_YZY_")[1]+"'><p>"+data_dict[out_wrap_count][i].split("_YZY_")[0]+"</p><li>").appendTo(add_ele_evr.find(".second_menu"));
									}

									//清除空元素
									add_ele_evr.find(".second_menu").children().each(function(index,ele){
										if($(ele).html() ==""){
											$(ele).remove();
										}
									})
								}else{
								//创建单个元素
								var add_ele_evr = $("<li class='me_out_content_li "+out_wrap_count.split("_YZY_")[1]+"'><p>"+out_wrap_count.split("_YZY_")[0]+"</p></li>");
								add_ele_evr.appendTo(out_wrap_click);
								}
								
							}
							//移入事件
						$(".me_out_content li").on("mouseenter",function(){
							$(this).css("background","rgb(222,222,222)");
							if($(this).hasClass("have_second_menu")){
								$(".second_menu").css("display","block");
							}
						})
						$(".me_out_content li").on("mouseleave",function(){
							$(this).css("background","");
							if($(this).hasClass("have_second_menu")){
								$(".second_menu").css("display","none");
							}
						})

						$(".me_out_content").on("mouseleave",function(){
							$(this).remove();
							open_or_close = true;
						})
						}else{
							$(".me_out_content").remove();
							$(".me_out_content li").unbind("mouseenter mouseleave");
							open_or_close = true;
							return;
						}


						// 点击事件-------------
						//编辑计算
						out_wrap_click.find(".edit_calculation").on("click",function(){
//							$("#editMeasureCalculateView").data("userCustomTile",false);
							$("#editMeasureCalculateView").show(0,function(){
								if(editMeasureCalculateView_isFirstShow){
									editMeasureCalculateView_isFirstShow = false;
									CodeMirror.velocityContext = "sum avg max min count";  //提取到外部，方便从后台获取数据  
//								      CodeMirror.velocityCustomizedKeywords = "server.ip server.cache software.conf software.version software.tags.count";  
								      	editor = CodeMirror.fromTextArea($("#editMeasureCalculateView .edit_measure_body .calculate_input_box .arithmeticInputTextArea").get(0), {  
								        lineNumbers: true,  
								        extraKeys: {"Ctrl": "autocomplete"},  
								        mode: "text/javascript",
								        indentWithTabs: true,
								        autoCloseTags: true,
								        autoCloseBrackets: true,
								        lineWrapping:true
								      });  
								      editor.on('keypress', function() {  
								          editor.showHint();  //满足自动触发自动联想功能  
								      });
								}  
							});
							$(".maskLayer").show();
							var measureList = $(this).parents(".me_out_content").eq(0);
							var measureInfo = measureList.data("pop_data_handle");
							$("#editMeasureCalculateView").data("measureInfo",measureInfo);
							$("#editMeasureCalculateView .edit_measure_body #measure_show_title").unbind("change");
							$("#editMeasureCalculateView .edit_measure_body #measure_show_title").change(function(){
								if($(this).hasClass("warn")){
									$(this).removeClass("warn");
								}
							})
							$("#editMeasureCalculateView .common-head .close,#editMeasureCalculateView .common-filer-footer .cancleBtn").unbind("click");
							$("#editMeasureCalculateView .common-head .close,#editMeasureCalculateView .common-filer-footer .cancleBtn").click(function(event){
								event.stopPropagation();
								$("#editMeasureCalculateView").hide();
								$(".maskLayer").hide();
							});
							$("#editMeasureCalculateView .common-filer-footer .confirmBtn").unbind("click");
							$("#editMeasureCalculateView .common-filer-footer .confirmBtn").click(function(event){
								event.stopPropagation();
								var  val = $("#editMeasureCalculateView .edit_measure_body #measure_show_title").val();
								if(!val||/^\s*$/.test(val)){
										$("#editMeasureCalculateView .edit_measure_body #measure_show_title").addClass("warn");
									return;
								}
								var meausureInfo = $(this).parents("#editMeasureCalculateView").data('measureInfo');
								var measureName = meausureInfo.split("_YZY_")[2];
								if(drag_measureCalculateStyle[measureName] === val && customCalculate[measureName] == editor.getValue()){
									return;
								}
								drag_measureCalculateStyle[measureName] = val;
								customCalculate[measureName] = editor.getValue();
								
								currentHandleMeasureCalculate.children(".drop_main").children("span.measure_list_text_left").eq(0).html($("#editMeasureCalculateView .edit_measure_body #measure_show_title").val());
								switch_chart_handle_fun();
								$("#editMeasureCalculateView").hide();
								$(".maskLayer").hide();
							})
							
						});

						//移除
						out_wrap_click.find(".deleting").on("click",function(){
									
									if($(this).parent().parent().parent().hasClass("list_wrap")){
										$(this).parent().parent().parent().remove();
									}else{
										$(this).parent().parent().remove();
									}
									remove_viewHandle();
						});

						//判断拖入的是否是计数
						if($(this).parent().hasClass("recordCount")){
							return;
						}
						//度量里点击事件
						out_wrap_click.find(".pop_count_all").click(function(event){
							event.stopPropagation();
							var measureList = $(this).parents(".me_out_content").eq(0);
							var measureInfo = measureList.data("pop_data_handle");
							var measureName = measureInfo.split("_YZY_")[2];
							if(drag_measureCalculateStyle[measureName] == "计数("+measureName+")"){
								return;
							}
							
							drag_measureCalculateStyle[measureName] = "计数("+measureName+")";
							measureList.siblings(".set_style.measure_list_text").children("span.measure_list_text_left").html("计数("+measureName+")");
							switch_chart_handle_fun();
						})
						
						//求和
						out_wrap_click.find(".pop_total").on("click",function(){
							
							var measureList = $(this).parents(".me_out_content").eq(0);
							var measureInfo = measureList.data("pop_data_handle");
							var measureName = measureInfo.split("_YZY_")[2];
							if(drag_measureCalculateStyle[measureName] == "求和("+measureName+")"){
								return;
							}
							drag_measureCalculateStyle[measureName] = "求和("+measureName+")";
							measureList.siblings(".set_style.measure_list_text").children("span.measure_list_text_left").html("求和("+measureName+")");
							switch_chart_handle_fun();
						});
						//平均值
						out_wrap_click.find(".pop_mean").on("click",function(){
							var measureList = $(this).parents(".me_out_content").eq(0);
							var measureInfo = measureList.data("pop_data_handle");
							var measureName = measureInfo.split("_YZY_")[2];
							if(drag_measureCalculateStyle[measureName] == "平均值("+measureName+")"){
								return;
							}
							drag_measureCalculateStyle[measureName] = "平均值("+measureName+")";
							measureList.siblings(".set_style.measure_list_text").children("span.measure_list_text_left").html("平均值("+measureName+")");
							switch_chart_handle_fun();
						});
						//最大值
						out_wrap_click.find(".pop_max").on("click",function(){
//							console.log("最大值");
							var measureList = $(this).parents(".me_out_content").eq(0);
							var measureInfo = measureList.data("pop_data_handle");
							var measureName = measureInfo.split("_YZY_")[2];
							if(drag_measureCalculateStyle[measureName] == "最大值("+measureName+")"){
								return;
							}
							drag_measureCalculateStyle[measureName] = "最大值("+measureName+")";
							measureList.siblings(".set_style.measure_list_text").children("span.measure_list_text_left").html("最大值("+measureName+")");
							switch_chart_handle_fun();
						});
						//最小值
						out_wrap_click.find(".pop_min").on("click",function(){
							
							var measureList = $(this).parents(".me_out_content").eq(0);
							
							var measureInfo = measureList.data("pop_data_handle");
							var measureName = measureInfo.split("_YZY_")[2];
							if(drag_measureCalculateStyle[measureName] == "最小值("+measureName+")"){
								return;
							}
							drag_measureCalculateStyle[measureName] = "最小值("+measureName+")";
							measureList.siblings(".set_style.measure_list_text").children("span.measure_list_text_left").html("最小值("+measureName+")");
							switch_chart_handle_fun();
						});
						// -------------------
						// -------------------
						})


						$(ele).parent().parent().on("mouseleave",function(){
							$(".me_out_content").remove();
							open_or_close = true;
						})

				}



//初始化表标题
function initTable_name(){
		$("#view_show_area #view_show_area_content .tableView_name h4").html("添加表标题");
		$("#view_show_area #view_show_area_content .tableView_name").css("color","#B4B4B4").hide();
	}
 //仪表板功能操作初始化
 function navDashboardEventInit(autoDrag){
 	if(autoDrag){
 		drag();
 		return;
 	}
 	//.........................仪表板工具栏操作
 	isDisaed = false;
	//小部件操作栏事件
	function small_handle_btn(){
		folder_view_add_show("新建视图","old");
		if(!"新建视图" in preClickView){
			preClickView["新建视图"] = null;
		}
		// if($(".rightConent #dashboard_content #new_view ul li").find("span").text() == "新建视图"){
		// 		$(".rightConent #dashboard_content #new_view ul li").addClass("auto_show");
		// 	}
		//添加视图
		$("#action_box .action_add_view").unbind("click");
		$("#action_box .action_add_view").on("click",function(){
			
			var saveNowWallAllNew = realSaveData();
			if(add_view_count == 0){
				preClickView["新建视图"] = saveNowWallAllNew;
			}else{
				preClickView["新建视图"+add_view_count+""] = saveNowWallAllNew;
			}
			empty_viem_init("change");
			add_view_count++;
			folder_view_add_show("新建视图"+add_view_count+"","old");
			preClickView["新建视图"+add_view_count+""] = null;

		})

		//清空视图
		$("#action_box .action_delect_view").unbind("click");
		$("#action_box .action_delect_view").on("click",function(){
			empty_viem_init("change");
			delete preClickView[$(".auto_show").find("span").text()];
			console.log(preClickView);
		})
	}
	small_handle_btn();
	closeViewSave();
	//存放数据源的数组
	var save_data_sum_handle = [];
	/*视图大小调整  select 下拉框*/
	$(".buildOpa").each(function(index, ele) {
		$(ele).on("mouseenter", function() {
			$(ele).parent().css("background", "#DEDEDE");
		})

		$(ele).on("mouseleave", function() {
			$(ele).parent().css("background", "white");
		})

		//点击替换
		$(ele).on("click", function() {
			$("#select_show").html($(ele).html());
			$("#buildBoard_buildOpa").css("display", "none");
		})
	})

	//select 点击显示
	$("#buildBoard_content").on("click", function(ev) {
		$("#buildBoard_buildOpa").stop(true).toggle();
	})

	$(document).on("click", function(e) {
		if(!$(e.target).is($("#buildBoard")) && !$(e.target).is($("#build_show")) && !$(e.target).is($("#buildBoard_content")) && !$(e.target).is($("#select_show")) && !$(e.target).is($("#buildBoard_content img")) && $(e.target).parent("#buildBoard").length === 0) {
			$("#buildBoard_buildOpa").css("display", "none");
		}
	})
/*end---视图大小调整  select 下拉框*/

	//单元格---下拉框
	$("#cell_click").on("click", function() {
		$("#cell_wrap").stop(true).toggle();
	})

	$("#cell_click").on("mouseleave", function() {
		$("#cell_wrap").css("display", "none")
	})
		
	$(".cell_wrap_content p").each(function(index, ele) {
		$(ele).on("mouseenter", function() {
			$(ele).css("background", "#DEDEDE")
		})

		$(ele).on("mouseleave", function() {
			$(ele).css("background", "white")
		})
	})
	//end----单元格---下拉框

	//保存按钮下拉框end---

	// 筛选器和图形按钮切换
	$("#project").on("click", function() {
		$("#sizer_wrap .sizer_line").css("background", "#DEDEDE");
		$("#project .sizer_line").css("background", "#0d53a4");
		$("#sizer_content").hide();

		$("#project_chart").show();
		$("#sizer_mpt").hide();
	});

	$("#sizer_wrap").on("click", function() {
		$("#project .sizer_line").css("background", "#DEDEDE");
		$("#sizer_wrap .sizer_line").css("background", "#0d53a4");
		$("#sizer_content").show();
		$("#project_chart").hide();

		if($(".drog_row_list").length == "0") {
			$("#sizer_mpt").show();
			$("#view_show_empty").show();
			initTable_name();
			$("#sizer_content").hide();
		}
	});
	//end----- 筛选器和图形按钮切换

	//表标题的修改
	$("#view_show_area #view_show_area_content .tableView_name").dblclick(function(){
		//记录之前的名称
		var saveBefore = $(this).find("h4").text();

		if(saveBefore != "添加表标题"){
			$(this).html("").append($("<input type='text' class='viewName_input' placeholder='添加表标题'>"));
			$("#view_show_area #view_show_area_content .tableView_name .viewName_input").val(saveBefore);
		}else{
			$(this).html("").append($("<input type='text' class='viewName_input' placeholder="+saveBefore+">"));
		}
		
	})

	//点击区域外保存表标题
	$(document).click(function(ev){
		if($(".viewName_input").length > 0 && !$(ev.target).is($("#view_show_area #view_show_area_content .tableView_name")) && !$(ev.target).is($("#view_show_area #view_show_area_content .tableView_name input")) && !$(ev.target).is($("#view_show_area #view_show_area_content .tableView_name p"))){
			if($("#view_show_area #view_show_area_content .tableView_name input").val() != ""){
				//记录输入框的值
				var saveView_input = $("#view_show_area #view_show_area_content .tableView_name input").val();
				$("#view_show_area #view_show_area_content .tableView_name").css("color","#000");
			}else{
				var saveView_input = "添加表标题";
				$("#view_show_area #view_show_area_content .tableView_name").css("color","#B4B4B4");
			}
			$("#view_show_area #view_show_area_content .tableView_name").html("").append($("<h4>"+saveView_input+"</h4>"));
		}
	})



 	//............................默认给定的样式
 	function leftBar_sizeW_function(){
		var leftBarW = $("body").height() - $(".container .topInfo").height() - $(".rightConent #dashboard_content #new_view").height() - $(".rightConent #dashboard_content #action_box").height() - Number($("#drag_wrap_content").css("paddingTop").match(/\d+/g))*2;
		//	var leftbarW_second = $(".leftNav").height()
		$("#lateral_bar").height(leftBarW + Number($("#drag_wrap_content").css("paddingTop").match(/\d+/g))*2);
		$("#dimensionality,#measurement,#indicator,#parameter").height(leftBarW / 4);
	
		$("#view_show_area").height(leftBarW + 10 - $("#operational_view").height());
		$("#view_show_area_content").height(leftBarW + 40 - $("#operational_view").height() - 30);
		$("#dimensionality_show,#measure_show,#index_show,#parameter_show").height($("#dimensionality").height() - 32);
		$("#action_box").width($("body").width() - 50 - $(".rightConent #dashboard_content #sizer").width());
		$("#dashboard_content").width($("body").width() - 50);
		//..
		var barHeight = $("body").height() - $(".topInfo").height() - $("#new_view").height() - $("#action_box").height();
		var view_show_height = barHeight - $("#operational_view").height();
		var nowContentW = $("#action_box").width();
	
		$(".handleAll_wrap").width(nowContentW - 201);
		$("#view_show_area_content").width($("#drag_wrap_content").width());
	
		//筛选器高度
		$("#sizer").height($("#lateral_bar").height() + 50);
		$("#sizer_place").height($("#sizer").height());
		$("#sizer_place #sizer_mpt").css("marginTop",$("#sizer").height()/2 - $("#sizer_place #sizer_mpt").height()/2 + "px");
	}
	
	leftBar_sizeW_function();


function drag(){
		var view_show = $(".annotation_text").width() * 0.91;

		$("#lateral_bar .set_style").each(function(index,ele){
				//移入事件
				$(ele).parent().on("mouseenter", function() {
					switch($(ele).find("span").attr("class")) {
						case "dimensionality_list_text_left":
							$(ele).css("background", "#c5e0ff");
							break;
						case "measure_list_text_left":
							$(ele).css("background", "#ffcc9a");
							break;
						case "index_list_text_left":
							$(ele).css("background", "#a7eff4");
							break;
						case "parameter_list_text_left":
							$(ele).css("background", "#ffcc9a");
							break;
						default:
							break;
					}

					$(ele).css({
						height: "21px",
						border: "1px solid #86a9d1",
						lineHeight: "21px",
						padding: "0px 4px"
					});
					$(ele).find(".moreSelectBtn").css("display", "block");
					$(ele).find(".moreSelectBtn").unbind("click");
					$(ele).find(".moreSelectBtn").click(function(event){
						
						//判断点击的是维度还是度量
						if($(this).parent().hasClass("measure_list_text")){
							saveTypeElement = "转换为维度";
						}else{
							saveTypeElement = "转换为度量";
						}
						var moreActionModule = $("<ul id='dimeOrMeasureMoreActionList'><li class='change'>"+saveTypeElement+"</li><li class='typeLi'>转化类型</li></ul>");
						$(this).parents("li").append(moreActionModule);
						$(moreActionModule).css({
							"top":$(this).parents("li").eq(0).offset().top-47+'px',
						});
						$(moreActionModule).children("li.change").unbind("click");
						$(moreActionModule).children("li.change").click(function(event){
							event.stopPropagation();
							// 挪动相应的位置
							var needChangeEle = $(this).parents("#dimeOrMeasureMoreActionList").parent("li");
							var needChangeType ="";
							if(needChangeEle.hasClass("dimensionality_li")){
								needChangeEle.removeClass("dimensionality_li");
								needChangeEle.addClass("measure_li");
								needChangeEle.find(".drop_list_main").removeClass("dimensionality_list_main");
								needChangeEle.find(".drop_list_main").addClass("measure_list_main");
								needChangeEle.find(".drop_list_main .drop_main").removeClass("dimensionality_list_text");
								needChangeEle.find(".drop_list_main .drop_main .moreSelectBtn").hide();
								needChangeEle.find(".drop_list_main .drop_main").addClass("measure_list_text").css({"background":"","border":"none","padding":"0px 5px","height":"23px","lineHeight":"23px"});
								needChangeEle.find(".drop_list_main .drop_main>span").removeClass("dimensionality_list_text_left");
								needChangeEle.find(".drop_list_main .drop_main>span").addClass("measure_list_text_left");
								needChangeEle.find(".dimensionality_datatype img").attr("src",needChangeEle.find(".drop_main").eq(0).data("type").image_Name_Find("measure"));
								
								$("#measure_show ul").append(needChangeEle);
								needChangeType = "measure";
							}else if(needChangeEle.hasClass("measure_li")){
								needChangeEle.removeClass("measure_li");
								needChangeEle.addClass("dimensionality_li");
								needChangeEle.find(".drop_list_main").removeClass("measure_list_main");
								needChangeEle.find(".drop_list_main").addClass("dimensionality_list_main");
								needChangeEle.find(".drop_list_main .drop_main .moreSelectBtn").hide();
								needChangeEle.find(".drop_list_main .drop_main").removeClass("measure_list_text");
								needChangeEle.find(".drop_list_main .drop_main").addClass("dimensionality_list_text").css({"background":"","border":"none","padding":"0px 5px","height":"23px","lineHeight":"23px"});
								needChangeEle.find(".drop_list_main .drop_main>span").removeClass("measure_list_text_left");
								needChangeEle.find(".drop_list_main .drop_main>span").addClass("dimensionality_list_text_left");
								needChangeEle.find(".dimensionality_datatype img").attr("src",needChangeEle.find(".drop_main").eq(0).data("type").image_Name_Find("dimensionality"));
								$("#dimensionality_show ul").append(needChangeEle);
								needChangeType = "dimensionality";
							}
							$("#dimeOrMeasureMoreActionList").remove();
							$.ajax({
								url:" /cloudapi/v1/recordCol/"+current_cube_name,
								type:"post",
								dataType:"json",
								contentType: "application/json; charset=utf-8",
								async: true,
								data:JSON.stringify({"column":needChangeEle.find(".drop_list_main .drop_main>span").text(),"coltype":needChangeType}),
								success:function(data){}
							});
							
							
							delete _cube_all_data[$('#lateral_title .custom-select').val()];

						});

						$(moreActionModule).find(".typeLi").unbind("mouseover");
						$(moreActionModule).find(".typeLi").mouseover(function(event){
							event.stopPropagation();
							typeToShow($(this),"clickTra");
							// $(this).children(".changeTypeList").show();
						});
						
					});
				});
				

				//移出事件
				$(ele).parent().parent().on("mouseleave", function() {
					$(ele).css({
						background: "white",
						height: "23px",
						lineHeight: "23px",
						padding: "0px 5px",
						border: "none",
					});
					$(ele).find(".moreSelectBtn").css("display", "none");
					$("#dimeOrMeasureMoreActionList,.moreClickBtn").remove();
				});
		});
		
				//图标类型移入移出事件
			function imgMouse() {
				$(".dimensionality_datatype").each(function(index, ele) {
					$(ele).on("mouseenter", function() {
						$(ele).css("background", "#DEDEDE");

					})

					$(ele).on("mouseleave", function() {
						if($(ele).css("backgroundColor") == "rgb(222, 222, 222)") {
							$(ele).css("background", "");
						}
					})

				});
			}
			imgMouse();
	
			// 维度和度量拖拽
			$(".dimensionality_list_text,.measure_list_text").each(function(index, ele) {
				//拖拽
				$(ele).draggable({
					appendTo: "body",
					helper: "clone",
					start: function() {
						$(".type_wic").remove();
						//恢复滚动
						enable_scroll();

						//恢复绑定事件
						imgMouse();

						$(".dimensionality_datatype").css("background", "");
					},

				});
				//对象记录标记内容的刷新变化
				var mark_dict = {};
				//记录行列里放置的元素
				var drop_text_arr = [];

				//记录行列里元素存放的数据

				var drop_list_save_arr = [];
				$("#parameter_icon_tra").on("click", function() {
					mark_dict = {};
				})
				//标记展示
				function markShow() {
					//标记icon点击展示

					$("#drag_date").find(".color_icon_wrap").each(function(index, ele) {

						//mark_dict[$(ele).parent().find("li").find("p").text()] = $(ele).find("img").attr("src");

						$(ele).unbind("click");
						$(ele).parent().css("cursor", "pointer");
						$(ele).on("click", function(event) {

							event.stopPropagation();

							if($(ele).parent().find(".label_icon_content").length == 0) {

								var labelIcon = $("<div class='label_icon_content clear'><ul class='label_icon_wrap'><li class='label_list'><span class='label_left_img'><img alt='颜色'></span><span class='label_right_text'></span></li><li class='label_list'><span class='label_left_img'><img alt='提示'></span><span class='label_right_text'></span></li></ul></div>")
								$(".label_icon_content").not($(ele).parent().find(".label_icon_content")).remove();
								labelIcon.appendTo($(ele).parent());
								$(ele).parent().data("data-show", "true");
								//					console.log($(ele).parent().data("data-show"))
								//样式
								$(labelIcon).find(".label_icon_wrap").css({
									top: $(ele).parent().offset().top - 70 + 22 + "px",
								});


								$(labelIcon).find(".label_icon_wrap").find("li").find(".label_left_img").find("img").attr("src", "/static/dashboard/img/color.png");

								//移入移出事件
								$(labelIcon).find(".label_icon_wrap").find("li").on("mouseenter", function() {
									$(this).css("background", "#EAEAEA");
								})

								$(labelIcon).find(".label_icon_wrap").find("li").on("mouseleave", function() {
									$(this).css("background", "");
								})

								var bj_dict = {
									"颜色": "/static/dashboard/img/color.png",
									"详细": "/static/dashboard/img/details.png",
									"提示": "/static/dashboard/img/prompt.png",
								}

								delete(bj_dict[$(ele).find("img").attr("alt")]);
								var bj_dict_length = Object.keys(bj_dict);

								for(var i = 0; i < bj_dict_length.length; i++) {

									$(labelIcon).find(".label_icon_wrap").find("li").eq(i).find(".label_left_img").find("img").attr("src", bj_dict[bj_dict_length[i]]);
									$(labelIcon).find(".label_icon_wrap").find("li").eq(i).find(".label_right_text").text(bj_dict_length[i]);
								}

								//点击事件
								$(labelIcon).find(".label_icon_wrap").find("li").on("click", function() {
									$(ele).find("img").attr("src", bj_dict[$(this).find(".label_right_text").text()]).attr("alt", $(this).find(".label_right_text").text()).css("marginTop", "3px");

									//判断重复数据类型
									switch($(ele).find("img").attr("src")) {
										//颜色
										case "/static/dashboard/img/color.png":
											$(ele).parent().find("li").removeClass().addClass("drog_row_list date_list bj_information bj_color");
											if($(ele).find("img").attr("src") == "/static/dashboard/img/color.png") {
												$("#handle_color_text").find(".color_icon_wrap").find("img[src='/static/dashboard/img/color.png']").not($(ele).find("img")).parent().parent().remove();

												delete mark_dict[$(ele).parent().find("li").find("p").text() + $(ele).parent().find("li").data("show_num")]
											}

											break;
											//提示
										case "/static/dashboard/img/prompt.png":
											$(ele).parent().find("li").removeClass().addClass("drog_row_list date_list bj_information bj_prompt");
											if($(ele).find("img").attr("src") == "/static/dashboard/img/prompt.png") {
												$("#handle_color_text").find(".color_icon_wrap").find("img[src='/static/dashboard/img/prompt.png']").not($(ele).find("img")).parent().parent().remove();

												delete mark_dict[$(ele).parent().find("li").find("p").text() + $(ele).parent().find("li").data("show_num")]
											}

											break;

										case "/static/dashboard/img/details.png":
											$(ele).parent().find("li").removeClass().addClass("drog_row_list date_list bj_information");
											break;
										default:
											break;
									}

									$(ele).parent().find("li").data("show_num", index)
									mark_dict[$(ele).parent().find("li").find("p").text() + $(ele).parent().find("li").data("show_num")] = $(ele).find("img").attr("src");
								})

							} else {
								$(ele).parent().find(".label_icon_content").remove();
							}

						})
					})
				}


				var lock = false;
				$(".drop_view").each(function(index, ele) {
					//视图展示区域禁止拖拽放置
					$("#view_show_area_content").droppable({disabled:true});
					$(ele).droppable({
						activeClass: "ui-state-default_z",
						hoverClass: "ui-state-hover_z",
						accept: $(".dimensionality_list_text,.measure_list_text"),
						activate: function(event, ui) {

							$(ele).find(".label_icon_content").remove();
							$("#handle_color_text").removeClass("ui-state-default_z")
						},
						drop: function(event, ui) {
							$("#sizer_mpt").hide();
							$("#view_show_empty").hide();
							$("#view_show_area #view_show_area_content .tableView_name").show();
							if($("#project_chart").css("display") == "none") {
								$("#sizer_content").css("display", "block");
							}
							$(this).find(".drag_text").css("display", "none");
							var current_li = $("<li class='drog_row_list'></li>").html($(ui.draggable).parent().html());
							current_li.appendTo($(this));
							current_li.find(".set_style").on("mouseenter",function(){$(this).find(".moreSelectBtn").show()});
							current_li.find(".set_style").on("mouseleave",function(){$(this).find(".moreSelectBtn").hide()});
							$(current_li).data("field_name",$(ui.draggable).find("span.measure_list_text_left").text());
							
							$(".drog_row_list").each(function(index, ele) {
								if($(ele).parent().attr("class") != "list_wrap") {
									$(ele).wrap("<div class='list_wrap'></div>");
								}
							});

							//判断拖拽元素颜色
							if(current_li.find(".set_style span").hasClass("dimensionality_list_text_left")){
								var elementToType = "dimensionality";
								$(this).find(".dimensionality_list_text_left").parent().parent().css("background", "#c5e0ff");
							}
							if(current_li.find(".set_style span").hasClass("measure_list_text_left")) {
								var elementToType = "measure";
								$(this).find(".measure_list_text_left").parent().parent().css("background", "#ffcc9a");
							}
							$(this).find("li").css({
								width: view_show + "px",
								height: "23px",
								lineHeight: "23px",
								margin: "5px auto 0",
								listStyle: "none",
							}).addClass("drog_row_list date_list bj_information");
							$(this).find(".set_style").css({
								width: "94%",
								height: "23px",
								background: "",
								padding: "0px 5px",
								color: "black"
							});
							$(this).find(".set_style").find("span").css({
								float: "left",
								display: "block",
							});
							$(this).find("img").css({
								display: "block",
							})

							var color_dict = {
								"颜色": "/static/dashboard/img/color.png",
								"详细": "/static/dashboard/img/details.png",
								"提示": "/static/dashboard/img/prompt.png",
							}
							//判断是否拖入标记类型选择区
							if($(this).attr("id") == "handle_color") {
//								console.log($(ele))
								//遍历展示窗有没有重复的元素
								$("#handle_color_text").find(".color_icon_wrap").find("img[alt=" + $(this).find(".handle_bj").text() + "]").parent().parent().remove();
								$(this).find(".list_wrap").css({
									width: view_show + "px",
									height: "23px",
									margin: "5px auto 0",

								});
								$(this).find("img").css("display", "")
								//判断标记里是否有图标
								$($(this).find(".list_wrap")).each(function(index, ele) {

									if(!$(ele).find("img").hasClass("color_icon")) {
										var zb_icon = $("<div class='color_icon_wrap'><img class='color_icon'></div>");
										$(zb_icon).find("img").attr("src", color_dict[$(this).parent().find(".handle_bj").text()]).attr("alt", $(this).parent().find(".handle_bj").text());
										zb_icon.prependTo($(ele));
										$(ele).appendTo($("#handle_color_text"));
										$(ele).find("li").data("show_num", index);
										mark_dict[$(ele).find("li").find("p").text() + $(ele).find("li").data("show_num")] = $(ele).find(".color_icon_wrap").find("img").attr("src");
										$("#handle_color_text").find(".drag_text").css("display", "none");


									}

									$(this).find("li").css({
										width: view_show * 0.85 + "px",
									}).addClass("date_list").addClass("bj_color");
									
								})

								markShow();

							}

							//提示
							if($(this).attr("id") == "reminder") {
								//遍历展示窗有没有重复的元素
								$("#handle_color_text").find(".color_icon_wrap").find("img[alt=" + $(this).find(".handle_bj").text() + "]").parent().parent().remove();
								$(this).find(".list_wrap").css({
									width: view_show + "px",
									height: "23px",
									margin: "5px auto 0",

								});
								$(this).find("img").css("display", "")
								//判断标记里是否有图标
								$($(this).find(".list_wrap")).each(function(index, ele) {

									if(!$(ele).find("img").hasClass("color_icon")) {
										var zb_icon = $("<div class='color_icon_wrap'><img class='color_icon'></div>");
										$(zb_icon).find("img").attr("src", color_dict[$(this).parent().find(".handle_bj").text()]).attr("alt", $(this).parent().find(".handle_bj").text());
										zb_icon.prependTo($(ele));
										$(ele).appendTo($("#handle_color_text"));
										$(ele).find("li").data("show_num", index);
										mark_dict[$(ele).find("li").find("p").text() + $(ele).find("li").data("show_num")] = $(ele).find(".color_icon_wrap").find("img").attr("src");
										$("#handle_color_text").find(".drag_text").css("display", "none");
										
									}
									$(this).find("li").css({
										width: view_show * 0.85 + "px",
									}).addClass("date_list").addClass("bj_prompt");
						
								})

								markShow();

							}
							//详细
							if($(this).attr("id") == "information") {
								//
								$(this).find(".list_wrap").css({
									width: view_show + "px",
									height: "23px",
									margin: "5px auto 0",

								});
								$(this).find("img").css("display", "")
								//判断标记里是否有图标
								$($(this).find(".list_wrap")).each(function(index, ele) {

									if(!$(ele).find("img").hasClass("color_icon")) {
										var zb_icon = $("<div class='color_icon_wrap'><img class='color_icon'></div>");
										$(zb_icon).find("img").attr("src", color_dict[$(this).parent().find(".handle_bj").text()]).attr("alt", $(this).parent().find(".handle_bj").text());
										zb_icon.prependTo($(ele));
										$(ele).appendTo($("#handle_color_text"));
										$(ele).find("li").data("show_num", index);

										$("#handle_color_text").find(".drag_text").css("display", "none");
										
									}

									$(this).find("li").css({
										width: view_show * 0.85 + "px",
									}).addClass("date_list").addClass("bj_information");
						
								});

								markShow();

							}

							var dragObj = ui["draggable"];// 拖动的元素
							var _dataType = dragObj.data("type");// 元素数据类型
							console.log(elementToType)
							var _wd_type = elementToType;// 维度还是度量。。。
							var _field_name =dragObj.children("span").eq(0).html(); // 字段名
							_drag_message["type"] = _wd_type;
							if(_wd_type == "measure"){
								if(allKeys(drag_measureCalculateStyle).indexOf(_field_name) == -1){
									drag_measureCalculateStyle[_field_name] = "求和("+_field_name+")";
									$(current_li).find("span.measure_list_text_left").html("求和("+_field_name+")");
									if(_field_name == "记录数"){
										drag_measureCalculateStyle[_field_name] = "计数("+_field_name+")";
										$(current_li).find("span.measure_list_text_left").html("计数("+_field_name+")");
									}
								}
							}
							//给予li id名 记录元素对应的内容
							$(this).find("li").eq($(this).find("li").length-1).attr("id",_wd_type+":"+_field_name + ":" + _dataType);
							//判断拖入的区域
							switch($(this).attr("id")) {
								
								//判断拖入行
								case 'drop_row_view':

								// 判断是维度还是度量
								drag_row_column_data["row"][_wd_type].push(_field_name + ":" + _dataType);
								_drag_message["position"] = "row";
								
								break;

									//判断拖入列

								case 'drop_col_view':

								
									drag_row_column_data["column"][_wd_type].push(_field_name + ":" + _dataType);
								
									_drag_message["position"] = "column";
									break;

								case 'handle_color_text':

									//标记两边间距
									var bz_margin = ($("#handle_color_text").width() - view_show) / 2;

									$(this).find(".list_wrap").css({
										width: view_show + "px",
										height: "23px",
										margin: "5px auto 0",

									});
									//存放拖放的元素和放置的位置

									//判断标记里是否有图标
									$($(this).find(".list_wrap")).each(function(index, ele) {

										if(!$(ele).find("img").hasClass("color_icon")) {
											var zb_icon = $("<div class='color_icon_wrap'><img alt='详细' class='color_icon'></div>");
											$(zb_icon).find("img").attr("src", "/static/dashboard/img/details.png").addClass("label_detailedness");
											zb_icon.prependTo($(ele));
											
										}
									})

									markShow();


									$(this).find("li").css({
										width: view_show * 0.85 + "px",
									}).addClass("date_list").addClass("bj_information");
						

									break;

									// case "view_show_area_content":
									// 	//拖到此区域删除元素
									// 	$(this).find(".list_wrap").remove();
									// break;
								default:
									break;
							}
							// 展现 table
					rightFilterListDraw();		
					switch_chart_handle_fun();
					//度量更多操作过程
					md_click_show(current_li.find(".moreSelectBtn"),{"编辑计算_YZY_edit_calculation":null,"度量_YZY_measure":["计数_YZY_pop_count_all","求和_YZY_pop_total","平均值_YZY_pop_mean","最大值_YZY_pop_max","最小值_YZY_pop_min"],"移除_YZY_deleting":null})

						}

					}).sortable({
						zIndex: "2000",
						items: ".drog_row_list",
						connectWith: ".drop_view",
						tolerance: "pointer",
						sort: function() {
							$(".drop_view").not($("#view_show_area_content")).addClass("ui-state-default_z");
							$("#view_show_area_content").css("border","1px solid #000");
							if($(this).attr("id") == "handle_color_text") {
								$(this).find("li").css({
									width: view_show * 0.85 + "px",
								});
							};

							$(".list_wrap").find(".label_icon_wrap").parent().remove();
							$(this).find("li").css({
								//background:"c5e0ff",
								height: "23px",
							});
						},
						beforeStop: function(event,ui) {
							$(".drop_view").removeClass("ui-state-default_z");
							$("#view_show_area_content").css("border","");
						},

						over: function() {
							$(this).css("background", "#DEDEDE")
						},
						out: function() {
							$(this).css("background", "");
						},
						update: function(event,ui) {
							event.stopPropagation();
							//排序后重新存储数据
							function for_row_col(ele){
								//遍历所有行里的li 排序后更新数据
								for(var i = 0; i < $(ele).find("li").length;i++){
									//获取数据字段
									var data_id = $(ele).find("li").eq(i).attr("id").split(":");
									//判断元素的类型
									var data_wd_type = data_id[0];
									//对应的数据
									var sortable_data = data_id[1]+":"+data_id[2];

									drag_row_column_data["column"][data_wd_type].push(sortable_data)
								}
							}
											
							//判断展示窗是否为空
							if($(this).find("li").length == 0) {
								$(this).find(".drag_text").css("display", "block");
							} else {
								$(this).find(".drag_text").css("display", "none");
							}

							//判断拖拽元素颜色
							if($(this).find("span").hasClass("dimensionality_list_text_left")) {
								$(this).find(".dimensionality_list_text_left").parent().parent().css("background", "#c5e0ff");
							}
							if($(this).find("span").hasClass("measure_list_text_left")) {
								$(this).find(".measure_list_text_left").parent().parent().css("background", "#ffcc9a");
							}

							//移出拖拽元素wrap
							$(".list_wrap").each(function(index, ele) {
								if($(ele).html() == "" || $(ele).find("li").length == "0") {
									$(ele).remove();
								};
							});

							$(this).find("li").css({
								width: view_show + "px",
								height: "23px",
								lineHeight: "23px",
								float: "none",
								listStyle: "none",
								marginTop: "5px",
								//										background:"#c5e0ff",

							})
							$(this).find("p").css({
								background: "",
								width: "94%",
								float: "none",
								boxSizing: "content-box",
							});

							var color_dict = {
								"颜色": "/static/dashboard/img/color.png",
								"详细": "/static/dashboard/img/details.png",
								"提示": "/static/dashboard/img/prompt.png",
							}
							switch($(this).attr("id")) {
								case "handle_color":
									//									

									$(this).find("li").wrap("<div class='list_wrap'></div>");

									//遍历展示窗有没有重复的元素
									$("#handle_color_text").find(".color_icon_wrap").find("img[alt=" + $(this).find(".handle_bj").text() + "]").parent().parent().remove();
									$(this).find(".list_wrap").css({
										width: view_show + "px",
										height: "23px",
										margin: "5px auto 0",

									});
									$(this).find("img").css("display", "");
									//判断标记里是否有图标
									$($(this).find(".list_wrap")).each(function(index, ele) {

//										console.log(!$(ele).find("img").hasClass("color_icon"))
										if(!$(ele).find("img").hasClass("color_icon")) {
//											console.log("1")
											var zb_icon = $("<div class='color_icon_wrap'><img class='color_icon'></div>");
											$(zb_icon).find("img").attr("src", color_dict[$(this).parent().find(".handle_bj").text()]).attr("alt", $(this).parent().find(".handle_bj").text());
											zb_icon.prependTo($(ele));
											$(ele).appendTo($("#handle_color_text"));
											$(ele).find("li").data("show_num", index);
											mark_dict[$(ele).find("li").find("p").text() + $(ele).find("li").data("show_num")] = $(ele).find(".color_icon_wrap").find("img").attr("src");
											$("#handle_color_text").find(".drag_text").css("display", "none");
											
										}
										$(this).find("li").css({
										width: view_show * 0.85 + "px",
									}).addClass("date_list").addClass("bj_color");
						
									})

									markShow();
									break;
								case "reminder":
									$(this).find("li").wrap("<div class='list_wrap'></div>");
									//遍历展示窗有没有重复的元素
									$("#handle_color_text").find(".color_icon_wrap").find("img[alt=" + $(this).find(".handle_bj").text() + "]").parent().parent().remove();
									$(this).find(".list_wrap").css({
										width: view_show + "px",
										height: "23px",
										margin: "5px auto 0",

									});
									$(this).find("img").css("display", "")
									//判断标记里是否有图标
									$($(this).find(".list_wrap")).each(function(index, ele) {

										if(!$(ele).find("img").hasClass("color_icon")) {
											var zb_icon = $("<div class='color_icon_wrap'><img class='color_icon'></div>");
											$(zb_icon).find("img").attr("src", color_dict[$(this).parent().find(".handle_bj").text()]).attr("alt", $(this).parent().find(".handle_bj").text());
											zb_icon.prependTo($(ele));
											$(ele).appendTo($("#handle_color_text"));
											$(ele).find("li").data("show_num", index);
											mark_dict[$(ele).find("li").find("p").text() + $(ele).find("li").data("show_num")] = $(ele).find(".color_icon_wrap").find("img").attr("src");
											$("#handle_color_text").find(".drag_text").css("display", "none");
											
										}
										$(this).find("li").css({
										width: view_show * 0.85 + "px",
									}).addClass("date_list").addClass("bj_prompt");
						
									})

									markShow();

									break;
								case "information":
									$(this).find("li").wrap("<div class='list_wrap'></div>");
									$(this).find(".list_wrap").css({
										width: view_show + "px",
										height: "23px",
										margin: "5px auto 0",

									});
									$(this).find("img").css("display", "")
									//判断标记里是否有图标
									$($(this).find(".list_wrap")).each(function(index, ele) {

										if(!$(ele).find("img").hasClass("color_icon")) {
											var zb_icon = $("<div class='color_icon_wrap'><img class='color_icon'></div>");
											$(zb_icon).find("img").attr("src", color_dict[$(this).parent().find(".handle_bj").text()]).attr("alt", $(this).parent().find(".handle_bj").text());
											zb_icon.prependTo($(ele));
											$(ele).appendTo($("#handle_color_text"));
											$(ele).find("li").data("show_num", index);

											$("#handle_color_text").find(".drag_text").css("display", "none");
											
											}
											$(this).find("li").css({
										width: view_show * 0.85 + "px",
									}).addClass("date_list").addClass("bj_information");
						
									})

									markShow();

									break;
								case "drop_row_view":
									$(this).find("li").removeClass().addClass("drog_row_list date_list bj_information");
									drag_row_column_data["row"]["dimensionality"].splice(0,$(this).find(".dimensionality_list_text").length);
									//删除排序前存入的数据
									drag_row_column_data["row"]["measure"].splice(0,$(this).find(".measure_list_text").length);
									//排序拖拽走元素 删除存储的数据
									if($(this).find(".measure_list_text").length  == 0){
										drag_row_column_data["row"]["measure"] = [];
									}

									if($(this).find(".dimensionality_list_text").length == 0){
										drag_row_column_data["row"]["dimensionality"] = [];
									}

									//遍历所有行里的li 排序后更新数据
									for(var i = 0; i < $(ele).find("li").length;i++){
//										console.log($(ele).find("li").eq(i).attr("id"));
										//获取数据字段
										var data_id = $(ele).find("li").eq(i).attr("id").split(":");
										
										//判断元素的类型
										var data_wd_type = data_id[0];
										//对应的数据
										var sortable_data = data_id[1]+":"+data_id[2];

										drag_row_column_data["row"][data_wd_type].push(sortable_data)
									}
									_drag_message["position"] = null;
									_drag_message["type"] ="sortable_row";
									break;

								case "drop_col_view":
									drag_row_column_data["column"]["dimensionality"].splice(0,$(this).find(".dimensionality_list_text").length);
									drag_row_column_data["column"]["measure"].splice(0,$(this).find(".measure_list_text").length);
									$(this).find("li").removeClass().addClass("drog_row_list date_list bj_information");
									//排序拖拽走元素 删除存储的数据
									if($(this).find(".measure_list_text").length  == 0){
										drag_row_column_data["column"]["measure"] = [];
									}

									if($(this).find(".dimensionality_list_text").length == 0){
										drag_row_column_data["column"]["dimensionality"] = [];
									}
									//遍历所有行里的li 排序后更新数据
									for(var i = 0; i < $(ele).find("li").length;i++){
										//获取数据字段
										var data_id = $(ele).find("li").eq(i).attr("id").split(":");
										//判断元素的类型
										var data_wd_type = data_id[0];
										//对应的数据
										var sortable_data = data_id[1]+":"+data_id[2];

										drag_row_column_data["column"][data_wd_type].push(sortable_data)
									}
									_drag_message["position"] = null;
									_drag_message["type"] ="sortable_column";
									break;


								case "handle_color_text":

									$(ele).find("li").each(function(index, ele) {
										var abc = $("<div class='list_wrap'></div>");
										$(abc).appendTo($("#handle_color_text"));
										$(ele).appendTo($(abc));
									})

									$(".list_wrap").each(function(index, ele) {
										if($(ele).html() == "" || $(ele).find("li").length == "0") {
											$(ele).remove();
										};

									});
									//标记两边间距
									//									var bz_margin = ($("#handle_color_text").width()-view_show)/2;

									//判断拖拽元素颜色
									if($(this).find("span").hasClass("dimensionality_list_text_left")) {
										$(this).find(".dimensionality_list_text_left").parent().css("background", "#c5e0ff");
									}
									if($(this).find("span").hasClass("measure_list_text_left")) {
										$(this).find(".measure_list_text_left").parent().css("background", "#ffcc9a");
									}

									$(this).find(".list_wrap").css({
										width: view_show + "px",
										height: "23px",
										margin: "5px auto 0",

									});

									//判断标记里是否有图标
									$($(this).find(".list_wrap")).each(function(index, ele) {

										//图片alt对象
										alt_dict = {
											"/static/dashboard/img/details.png": "详细",
											"/static/dashboard/img/color.png": "颜色",
											"/static/dashboard/img/prompt.png": "提示",
										}
										if(!$(ele).find("img").hasClass("color_icon")) {
											var zb_icon = $("<div class='color_icon_wrap'><img  class='color_icon'></div>");
											zb_icon.prependTo($(ele));
											$(ele).find("li[class='drog_row_list date_list bj_information']").parent().find($(".color_icon_wrap")).find("img").attr("src", "/static/dashboard/img/details.png").attr("alt", "详细");
											$(ele).find("li[class='drog_row_list date_list bj_information bj_color']").parent().find($(".color_icon_wrap")).find("img").attr("src", "/static/dashboard/img/color.png").attr("alt", "颜色");
											$(ele).find("li[class='drog_row_list date_list bj_information bj_prompt']").parent().find($(".color_icon_wrap")).find("img").attr("src", "/static/dashboard/img/prompt.png").attr("alt", "提示");

											
										}

									})
									markShow();
									$(this).find("li").css({
										width: view_show * 0.85 + "px",
										height: "23px",
										lineHeight: "23px",
										float: "right",
										listStyle: "none",
										marginTop: "0px",
										background: "",

									});
									$(this).find("p").css({
										boxSizing: "border-box",
										width: "100%",
										float: "right"
									})

									break;
								
								//拖拽区域外消失
									
								case "view_show_area_content":
									console.log($(this).find(".index_row_list").length)
									if($(this).find(".index_row_list").length > 0){
										$(this).find(".index_row_list").remove();
										return;
									}
									$(this).find(".list_wrap").remove();
									$(this).find(".ui-draggable").parent().remove();
									if(ui["sender"].attr("id") == "drop_col_view"){
									drag_row_column_data["column"]["measure"]= [];
									drag_row_column_data["column"]["dimensionality"] =[];
									//遍历所有行里的li 排序后更新数据
									for(var i = 0; i < $("#drop_col_view").find("li").length;i++){
										//获取数据字段
										var data_id = $("#drop_col_view").find("li").eq(i).attr("id").split(":");
										//判断元素的类型
										var data_wd_type = data_id[0];
										//对应的数据
										var sortable_data = data_id[1]+":"+data_id[2];

										drag_row_column_data["column"][data_wd_type].push(sortable_data)
									}
									}



									// ....

									if(ui["sender"].attr("id") == "drop_row_view"){
									drag_row_column_data["row"]["measure"]= [];
									drag_row_column_data["row"]["dimensionality"] =[];
	
									//遍历所有行里的li 排序后更新数据
									for(var i = 0; i < $("#drop_row_view").find("li").length;i++){
										//获取数据字段
										var data_id = $("#drop_row_view").find("li").eq(i).attr("id").split(":");
										//判断元素的类型
										var data_wd_type = data_id[0];
										//对应的数据
										var sortable_data = data_id[1]+":"+data_id[2];

										drag_row_column_data["row"][data_wd_type].push(sortable_data)
									}
									}
									
									// 移除筛选列
									var fieldInfoArr = ui.item.attr("id").split(":");
									rightFilterListDraw();

									break;
								default:

									break;
							}
//							if(ui.)
							switch_chart_handle_fun();
							
						}


					}).disableSelection();

					

				})
			});
	

		
$(document).on("click", function(event) {
		event.stopPropagation();
		$(".type_wic").remove();
		$(".list_wrap").find(".label_icon_wrap").parent().remove();
		//恢复滚动
		enable_scroll();

		$(".dimensionality_datatype").css("background", "");
		//恢复绑定事件
		imgMouse();
	})

function typeToShow(ele,clickTra){
	$(".type_wic").not($(ele).parents(".leftNav_list").find(".type_wic")).remove();
						var type_wicket = $("<div class='type_wic'><ul class='click_type'><li><span class='default'></span>默认值</li><li><span class='num_system'></span>数字(二进制)</li><li><span class='num_ten'></span>数字(十进制)</li><li><span class='show_num_integer'></span>数字(整数)</li><li><span class='show_date_time'></span>日期和时间</li><li><span class='show_date'></span>日期</li><li><span class='show_string'></span>字符串</li></ul></div>");
						type_wicket.appendTo($(ele).parents(".leftNav_list"));

						$(type_wicket).find("span").css({
							width:"25px",	
							height:"22px",
							float:"left",
						});

						if(clickTra == "clickTra"){
							var elementLeft = $(ele).offset().left + 10 + "px";
							var elementTop = $(ele).offset().top - 71 + "px";
							type_wicket.addClass("moreClickBtn");
						}else{
							var elementLeft = "5px";
							var elementTop = $(ele).offset().top - 45 + "px";
						}


						type_wicket.find(".click_type").css({
							top: elementTop,
							left: elementLeft,
						}).addClass("type_wic_click_type");
						type_wicket.find("ul").addClass("type_wic_ul");

						type_wicket.find("li").addClass("type_wic_li");

						type_wicket.find("li").on("click", function() {
							//点击更换类型
							switch($(this).text()) {
								case "默认值":
									if($(this).parents(".leftNav_list").hasClass("measure_li")) {
										$(this).parents(".measure_li").find(".dimensionality_datatype img").attr("src", "/static/dataCollection/images/tableDataDetail/integer_duliang.png").removeClass().addClass("default_img");
									} else {
										$(this).parents(".dimensionality_li").find(".dimensionality_datatype img").attr("src", "/static/dataCollection/images/tableDataDetail/string_weidu.png").removeClass().addClass("default_img");
									}

									break;
								case "数字(二进制)":
									if($(this).parents(".leftNav_list").hasClass("measure_li")){
										$(this).parents(".measure_li").find(".dimensionality_datatype img").attr("src", "/static/dataCollection/images/tableDataDetail/integer_duliang.png").removeClass().addClass("system_num_second");
									}else{
										$(this).parents(".dimensionality_li").find(".dimensionality_datatype img").attr("src", "/static/dataCollection/images/tableDataDetail/integer_weidu.png").removeClass().addClass("system_num_second");
									}
									break;
								case "数字(十进制)":
									if($(this).parents(".leftNav_list").hasClass("measure_li")){
										$(this).parents(".measure_li").find(".dimensionality_datatype img").attr("src", "/static/dataCollection/images/tableDataDetail/integer_duliang.png").removeClass().addClass("system_num_ten");
									}else{
										$(this).parents(".dimensionality_li").find(".dimensionality_datatype img").attr("src", "/static/dataCollection/images/tableDataDetail/integer_weidu.png").removeClass().addClass("system_num_ten");
									}
									break;
								case "数字(整数)":
									if($(this).parents(".leftNav_list").hasClass("measure_li")){
										$(this).parents(".measure_li").find(".dimensionality_datatype img").attr("src", "/static/dataCollection/images/tableDataDetail/integer_duliang.png").removeClass().addClass("integer_num");
									}else{
										$(this).parents(".dimensionality_li").find(".dimensionality_datatype img").attr("src", "/static/dataCollection/images/tableDataDetail/integer_weidu.png").removeClass().addClass("integer_num");
									}
									break;
								case "日期和时间":
									$(this).parents(".leftNav_list").find(".dimensionality_datatype img").attr("src", "/static/dashboard/img/date-time.png").removeClass().addClass("data_time");
									break;
								case "日期":
									$(this).parents(".leftNav_list").find(".dimensionality_datatype img").attr("src", "/static/dashboard/img/date.png").removeClass().addClass("date_img");
									break;
								case "字符串":
									if($(this).parents(".leftNav_list").hasClass("measure_li")){
										$(this).parents(".measure_li").find(".dimensionality_datatype img").attr("src", "/static/dataCollection/images/tableDataDetail/string_duliang.png").removeClass().addClass("string_img");
									}else{
										$(this).parents(".dimensionality_li").find(".dimensionality_datatype img").attr("src", "/static/dataCollection/images/tableDataDetail/string_weidu.png").removeClass().addClass("string_img");
									}
									break;
								default:
									break;
							}
							if(clickTra != "clickTra"){
								//恢复滚动
								enable_scroll();
								$(ele).parents(".leftNav_list").find(".set_style").css({"background":"","padding":"0px 5px","border":"none","height":"23px","lineHeight":"23px"});
								$(ele).parents(".leftNav_list").find(".set_style .moreSelectBtn").hide();
								$(ele).parents(".leftNav_list").find(".type_wic").remove();
								$(ele).css("background", "");
								imgMouse()
							}else{
								$(ele).parents(".leftNav_list").find(".set_style").css({"background":"","padding":"0px 5px","border":"none","height":"23px","lineHeight":"23px"});
								$(ele).parents(".leftNav_list").find(".set_style .moreSelectBtn").hide();
								$("#dimeOrMeasureMoreActionList,.moreClickBtn").remove();

							}

						})

						//判断数据类型显示图标
						switch($("#dimensionality_show").find($(ele).parents(".leftNav_list")).find(".dimensionality_datatype img").attr("class")) {
							case "default_img":
								$(type_wicket).find("li").find(".default").addClass("change_type");
								$(type_wicket).find("li").find(".show_string").addClass("change_type_num");
								break;
							case "system_num_second":
								$("#dimensionality_show").find("li").find(".default").removeClass();
								$("#dimensionality_show").find("li").find(".show_string").removeClass();
								$(type_wicket).find("li").find(".num_system").addClass("change_type_num");
								break;
							case "system_num_ten":
								$("#dimensionality_show").find("li").find(".default").removeClass();
								$("#dimensionality_show").find("li").find(".show_string").removeClass();
								$(type_wicket).find("li").find(".num_ten").addClass("change_type_num");
								break;
							case "integer_num":
								$("#dimensionality_show").find("li").find(".default").removeClass();
								$("#dimensionality_show").find("li").find(".show_string").removeClass();
								$(type_wicket).find("li").find(".show_num_integer").addClass("change_type_num");
								break;
							case "data_time":
								$("#dimensionality_show").find("li").find(".default").removeClass();
								$("#dimensionality_show").find("li").find(".show_string").removeClass();
								$(type_wicket).find("li").find(".show_date_time").addClass("change_type_num");
								break;
							case "date_img":
								$("#dimensionality_show").find("li").find(".default").removeClass();
								$("#dimensionality_show").find("li").find(".show_string").removeClass();
								$(type_wicket).find("li").find(".show_date").addClass("change_type_num");
								break;
							case "string_img":
								$(type_wicket).find("li").find(".default").addClass("change_type");
								$(type_wicket).find("li").find(".show_string").addClass("change_type_num");
								break;

						}

						//判断数据类型显示图标
						switch($("#measure_show").find($(ele).parents(".leftNav_list")).find(".dimensionality_datatype img").attr("class")) {
							case "default_img":
								$(type_wicket).find("li").find(".default").addClass("change_type");
								$(type_wicket).find("li").find(".show_num_integer").addClass("change_type_num");
								break;
							case "system_num_second":
								$("#measure_show").find("li").find(".default").removeClass();
								$("#measure_show").find("li").find(".show_num_integer").removeClass();
								$(type_wicket).find("li").find(".num_system").addClass("change_type_num");
								break;
							case "system_num_ten":
								$("#measure_show").find("li").find(".default").removeClass();
								$("#measure_show").find("li").find(".show_num_integer").removeClass();
								$(type_wicket).find("li").find(".num_ten").addClass("change_type_num");
								break;
							case "integer_num":
								$(type_wicket).find("li").find(".default").addClass("change_type");
								$(type_wicket).find("li").find(".show_num_integer").addClass("change_type_num");
								break;
							case "data_time":
								$("#measure_show").find("li").find(".default").removeClass();
								$("#measure_show").find("li").find(".show_num_integer").removeClass();
								$(type_wicket).find("li").find(".show_date_time").addClass("change_type_num");
								break;
							case "date_img":
								$("#measure_show").find("li").find(".default").removeClass();
								$("#measure_show").find("li").find(".show_num_integer").removeClass();
								$(type_wicket).find("li").find(".show_date").addClass("change_type_num");
								break;
							case "string_img":
								$("#measure_show").find("li").find(".default").removeClass();
								$("#measure_show").find("li").find(".show_num_integer").removeClass();
								$(type_wicket).find("li").find(".show_string").addClass("change_type_num");
								break;

						}

						//数据类型默认值
						$("#dimensionality_show").find("li").find(".default").addClass("change_type");
						$("#dimensionality_show").find("li").find(".show_string").addClass("change_type_num");

						$("#measure_show").find("li").find(".default").addClass("change_type");
						$("#measure_show").find("li").find(".show_num_integer").addClass("change_type_num");

						type_wicket.find("li").on("mouseenter", function() {
							$(this).css("background", "#DEDEDE");
						})
						type_wicket.find("li").on("mouseleave", function() {
							$(this).css("background", "");
						});
}

//
function typeChangeWall(ele){

					$(".dimensionality_datatype").css("background", "");
					$(ele).css("background", "#ADADAD");

					event.stopPropagation();
					if($(ele).parents(".leftNav_list").find(".click_type").length == "0") {
						//禁止滚动
						disable_scroll();

						//删除移入事件
						$(".dimensionality_datatype").unbind("mouseenter").unbind("mouseleave");
						typeToShow(ele);

					}else{
						$(ele).parents(".leftNav_list").find(".type_wic").remove();
						//恢复滚动
						enable_scroll();
						$(ele).css("background", "");
						imgMouse()
					}
}






		//..........................创建类型转换弹窗
 	//创建一个类型弹窗			
			$(".dimensionality_datatype").each(function(index, ele) {
				$(ele).on("click", function(event) {
					typeChangeWall(ele);
				})

			})
	}
/*gxm-----end*/	
	drag();

 	
	//..........................右侧设计样式点击事件
		dahboardSetting_function();

 	//..........................视图图标的操作事件
	//设计视图icon
	var project_icon = [["文本表","1或多个维度","1或多个度量","show_table"], ["饼图","1个维度","1个度量","show_cake"],["折线图","1个维度","1或多个度量","show_polyline"], ["柱状图","0或多个维度","1或多个度量","show_histogram"],["堆积柱状图","2或3个维度","1个度量","show_storehis"], ["瀑布图","1个维度","1个度量","show_waterfall"],["百分比堆积柱状图","2或3个维度","1个度量","show_percontrasth"], ["条形图","0或多个维度","1或多个度量","show_bar"], ["堆积条形图","2或3个维度","1个度量","show_storebar"], ["对比条形图","1个维度","2个度量","show_contrastbar"], ["百分比堆积条形图","2或3个维度","1个度量","prestorebar"], ["面积图","1个维度","1个度量","show_area"], ["范围图","1个维度","1个度量","show_scale"],["甘特图","1个维度","1个度量","show_gantt"],["雷达图","1个维度","1或多个度量","show_randar"], ["树状图","2或多个维度","1个度量","show_treemap"]];


	//图表对应生成的视图
	var save_show_click_change_das = ["showTable_by_dragData()","one_de_one_me_handle('cake')","many_de_many_me_handle('polyline')","many_de_many_me_handle('histogram')","many_de_many_me_handle('number_bar')","one_de_one_me_handle('waterWall')","many_de_many_me_handle('percentage_bar')","many_de_many_me_handle('barChart')","many_de_many_me_handle('number_liner')","many_de_many_me_handle('comparisonStrip')","many_de_many_me_handle('percentage_liner')","one_de_one_me_handle('area')","one_de_one_me_handle('scale')","one_de_one_me_handle('gantt')","many_de_many_me_handle('radarChart')","many_de_many_me_handle('reliationTree')"];


	for(var i = 0; i < project_icon.length;i++) {

		var project_icon_list = $("<li class='project_icon_hover'><img alt=" + project_icon[i][0] + "></li>");

		project_icon_list.attr("id",project_icon[i][3]).data("show_view_fun",save_show_click_change_das[i]);
		project_icon_list.find("img").attr("src", "/static/dashboard/img/chart_" + (i + 1) + ".png");

		project_icon_list.appendTo($("#project_chart ul"));

	}

	$(".project_icon_hover").each(function(index, ele) {

		$(ele).find('img[alt="条形图"]').css("marginLeft","5px");

		$(ele).on("mouseenter", function() {
			$(ele).css("background", "white")
			//动态创建提示框
			var project_icon_hint = $("<div class='project_icon_hint_wrap'><p class='project_icon_hint_p_one'></p><p class='project_icon_hint_p_two'></p><p class='project_icon_hint_p_three'></p><p class='project_icon_hint_p_four'></p><img src='/static/dashboard/img/sanjiao_03.png' alt='project_tran'></div>")

			project_icon_hint.find("p").eq(0).text(project_icon[index][0]);

			project_icon_hint.find("p").eq(1).text(project_icon[index][1]);

			project_icon_hint.find("p").eq(2).text(project_icon[index][2]);
			

			project_icon_hint.appendTo($("body"));

			project_icon_hint.css({
				top: $(ele).offset().top - 15 + "px",
				left: $(ele).offset().left - project_icon_hint.width() - 3 + "px",
			});

		})

		//移出
		$(ele).on("mouseleave", function() {
			$(ele).css("background", "")
			$(".project_icon_hint_wrap").remove();
		})

	});

	// end------------------


 	//..........................点击清除维度度量指标操作
 		//点击清除维度度量
	$(".drag_main_icon_second").not($("#drag_zb .drag_main_icon_second")).each(function(index, ele) {
		$(ele).on("click", function() {
			$(".annotation_text").eq(index).find(".list_wrap").remove();
			$(".annotation_text").eq(index).find("li").remove();
			remove_viewHandle();
			$(".drag_text").eq(index).show();
			//			if($("#project_chart").css("display") == "none"){
			//				$("#sizer_mpt").css("display", "block");
			//				console.log("123")
			//			}

			if($(".drog_row_list").length == "0" && $("#project_chart").css("display") == "none") {
				$("#sizer_mpt").show();
				$("#view_show_empty").show();
				initTable_name();
				$("#sizer_content").hide();
			}

		})
	})

	//清除指标的数据
	$("#drag_zb .drag_main_icon_second").on("click", function() {
		if($("#drag_wrap_content #drag_zb #drop_zb_view").find("li").length > 0){
			if($(".drog_row_list").length == "0" && $("#project_chart").css("display") == "none") {
				$("#sizer_mpt").show();
				$("#sizer_content").hide();
			}

			empty_viem_init();
			$(".handleAll_wrap #operational_view #drag_zb .annotation_text,#view_show_area_content").css("background","").css("border","none");
			$("#drag_zb .annotation_text").droppable("option", "disabled", false);
			var disabled = $(".drop_view").droppable("option", "disabled");
	
			$(".drop_view").sortable({ disabled: false });

			$("#drop_zb_view").find(".drag_text").show();

			$("#drag_zb .annotation_text").data("nowShowIndex","");
		}
	})



//保存视图按钮点击事件
$("#click_save_view").unbind("click");
$("#click_save_view").on("click",function(){
	saveViewBtn(true);
	});


  //动态判断新建指标的默认名称
function folder_name_sum(text,sumArr){
		function count_sum(text,fv_count,sumArr1){
			var cs_view = fv_count;
			if($.inArray(text+cs_view,sumArr1) != -1){
				cs_view++;
				return count_sum(text,cs_view++,sumArr1);
			}else{
				return text+cs_view;
			}
		}

		return count_sum(text,1,sumArr);
		
	}

// 保存为指标
 $("#dashboard_content #action_box #action_box_ul #action_save #click_save_index").click(function(event){

 	var nowIndexName = folder_name_sum("新指标",getIndexName);
 	event.stopPropagation();
   	var postIndexDic = {
   		"username":"yzy",
   		"row":JSON.stringify(drag_row_column_data["row"]),
   		"column":JSON.stringify(drag_row_column_data["column"]),
   		"tablename":current_cube_name,
   		"indextype":view_name,
   		"indexname":nowIndexName,
   		"calculation":JSON.stringify(drag_measureCalculateStyle),
   		"indexstyle":currentColorGroupName+"_YZY_"+normalUnitValue+"_YZY_"+valueUnitValue,
   		"customcalculate":JSON.stringify(customCalculate)
   	};
   	// 请求保存指标
   	$.ajax({
   		url:"/dashboard/indexAdd",
   		type:"post",
		dataType:"json",
		contentType: "application/json; charset=utf-8",
		async: true,
		data:JSON.stringify(postIndexDic),
		success:function(data){
			if(data.status == "success"){
				// 指标框出现输入框
 			createAIndexElementToLeftList(nowIndexName,true);

 			getIndexName.push(nowIndexName);
			}
		}
   	})	
 });

function saveViewToWall(post_dict){
			//将数据存储数据库
			$.post("/dashboard/dashboardTableAdd",post_dict,function(result){
			if(result["status"] == "ok"){
				reporttingFunction_abale();
				$(".main .rightConent #pageStatementsModule").data("isFirstInto",true);
				changePageTo_navReporttingView(false);
				loc_storage.setItem("now_add_view",post_dict["foldername"]);
				saveViewShowArr = {};
				saveViewShowArr[post_dict["foldername"]] = [];
				$(".gridster").html("");
				$(".gridster").append($("<ul></ul>"));
				 //移除编辑视图storage
				 sessionStorage.removeItem("edit_view_now");
				 $("#pageDashboardModule #view_save_up").hide();
				 $("#pageDashboardModule #view_save_up #show_excel_name").html("");
				 $("#pageDashboardModule #body_content_shadow").hide();
				 preClickView[$("#pageDashboardModule #dashboard_content #new_view .auto_show").find(".folderview_li_span").text()] = realSaveData();
			}else{
				alert("保存失败");
			}
		});
}

//新建报表点击显示隐藏
$(".show_view_if_hide").on("click",function(){
		if($(".show_view_if_hide").css("color") == "rgb(13, 83, 164)"){
			$("#view_add_state").find("input").val("");
			$("#view_add_state").toggle();
		}
	})

//弹窗点击保存按钮向服务器传递保存数据
$("#save_handle_open").on("click",function(){
		if($("#show_excel_name").find(".active_folder_view").length != 0){
			post_dict = realSaveData();
			//判断当前要保存视图是视图库编辑视图
			if($(".auto_show").hasClass("edit_list")){
				//判断是否距上次是否有更改
				var viewWallChangeSave = SecondDict(post_dict,ajax_data_post[$(".auto_show").data("edit_view").split(",")[0]][$(".auto_show").data("edit_view").split(",")[1]][$(".auto_show").data("edit_view").split(",")[2]]);
				if(viewWallChangeSave && $(".active_folder_view").text() == $(".auto_show").data("edit_view").split(",")[1]){
					reporttingFunction_abale();
					$(".main .rightConent #pageStatementsModule").data("isFirstInto",true);
					changePageTo_navReporttingView(false);
					 //移除编辑视图storage
					 sessionStorage.removeItem("edit_view_now");
				 	$("#pageDashboardModule #view_save_up").hide();
					$("#pageDashboardModule #view_save_up #show_excel_name").html("");
					$("#pageDashboardModule #body_content_shadow").hide();
					return;
				}

				if($(".active_folder_view").text() != $(".auto_show").data("edit_view").split(",")[1]){
						post_dict["foldername"] = $(".active_folder_view").text();
						saveViewToWall(post_dict);
						return;
					}

				if(viewWallChangeSave == false && $(".active_folder_view").text() == $(".auto_show").data("edit_view").split(",")[1]){
					post_dict["id"] = JSON.stringify($(".auto_show").data("tableViewId"));
					post_dict["foldername"] =  $(".auto_show").data("edit_view").split(",")[1];
					delete post_dict["username"];
					delete post_dict["defaultparent"];
					saveViewToWall(post_dict);
					return;
				}
				
			}

			post_dict["foldername"] =$(".active_folder_view").text();
			saveViewToWall(post_dict);


		}else{
			$("#btn_save_name").css("background","#DEDEDE");
		}

	})



  	// ......................刷新操作
  		//页面刷新清除刷选条件
 		window.onbeforeunload = function(){
    		loc_storage.removeItem("allTable_specialSelection");
  			loc_storage.removeItem("allTable_notWorkedColumns");
  		}	
  }


}



