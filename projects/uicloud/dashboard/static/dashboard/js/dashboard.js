
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

// 记录当前操作的数据块数据
var current_cube_name = null;
// 对象中以表名作为 key 值存储，表的数据
var _cube_all_data = {};

//记录当前当前拖拽的到底是行 还是列
// 行为：row，列为 column
var  _drag_message = {
	"position":null, // 行还是列
	"type":null, // 维度还是度量
	"index":null // 拖拽的下标。。可能暂时不用
};


//记录当前当前拖拽的到底是行 还是列
// 行为：row，列为 column
var _drag_message = {
	"position":null, // 行还是列
	"type":null, // 维度还是度量
	"index":null // 拖拽的下标。。可能暂时不用
};

$(function() {

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

	// 筛选器和图形按钮切换
	$("#project").on("click", function() {
		$("#sizer_wrap .sizer_line").css("background", "#DEDEDE");
		$("#project .sizer_line").css("background", "#0d53a4");
		$("#sizer_content").css("display", "none");

		$("#project_chart").css("display", "block");
		$("#sizer_mpt").css("display", "none");
	})

	$("#sizer_wrap").on("click", function() {
		$("#project .sizer_line").css("background", "#DEDEDE");
		$("#sizer_wrap .sizer_line").css("background", "#0d53a4");
		$("#sizer_content").css("display", "block");
		$("#project_chart").css("display", "none");

		if($(".drog_row_list").length == "0") {
			$("#sizer_mpt").css("display", "block")
			$("#view_show_empty").css("display", "block");
			$("#sizer_content").css("display", "none");
		}
	})
	//end----- 筛选器和图形按钮切换
/*gxm-----start*/	
	
	$("#view_show_wrap").data("table", "false");
	
	$.ajax({
		url:"/cloudapi/v1/tables",
		type:"get",
		dataType:"json",
		contentType: "application/json; charset=utf-8",
		success:function(data){
			console.log(data);
			if (data["status"] == "success") {
				// 创建数据块
				cubeSelectContent_fun(data["results"]);
			}	
		}
		
	});
	// 数据块选择 创建
	function	 cubeSelectContent_fun(build_tables){
		var cube_select = $('#lateral_title .custom-select');
		for (var key in build_tables) {
			var val = build_tables[key];
			var op = $("<option value="+val+">"+val+"</option>");
			cube_select.append(op);
		}	
		// select选项卡
		cube_select.comboSelect();
		
		// 展示维度和度量等
		load_measurement_module(cube_select.val())
		
	}
	

	// 加载维度、度量等，需要在 select 加载完毕之后
	function load_measurement_module(current_cube){
		// 之前选择过的数据块  内存保存一份
		// 记录当前操作数据块的名称
		current_cube_name = current_cube;
		if (_cube_all_data[current_cube_name]) {
			var schema = _cube_all_data[current_cube_name]["schema"];	
			factory_create_li_to_measurement_module(schema);
			return;
		}
		
		//1、需要加载这个表格的 column schema
		$.ajax({
			url:"/cloudapi/v1/tables/" +current_cube+"/all",
			type:"get",
			dataType:"json",
			success:function(data){
				console.log(data);
				if (data["status"] == "success") {
					var cube_all_data = data["results"];
					var schema = cube_all_data["schema"];	
					_cube_all_data[current_cube_name] = cube_all_data;
					factory_create_li_to_measurement_module(schema);
					
				}
			
			}
		});
		
		//2、工厂，根据数据去创建 维度和度量等的 Li
		function factory_create_li_to_measurement_module(schema){
			
			for (var i = 0; i < schema.length;i++) {
				var column_name_info = schema[i];
				var arr = column_name_info.split(":");
				var  _name = arr[0]; // 字段名
				var _data_type = arr[1];  // 字段的数据类型
				var _show_type = _data_type.w_d_typeCat(); // 维度还是度量，返回值是一个字符串		
				var type_indictot_img_path = _data_type.image_Name_Find();	 // 数据类型指示图片的路径
				
	var aLi = $("<li class=" + _show_type+"_li>"+"<div class='dimensionality_datatype'><img alt='datatype' src="+type_indictot_img_path+"/></div><div class='drop_list_main " + _show_type + "_list_main'"+"><p class='drop_main clear set_style " + _show_type + "_list_text'><span class=" + _show_type + "_list_text_left" + ">"+_name+"</span><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'></p></div></li>");
				
				// 用来记录数据类型
				aLi.find(".drop_main").eq(0).data("type",_data_type);
				
				
				$("#"+_show_type+"_show ul").append(aLi);
				

				

				
			}
			// 启动拖拽功能
			drag();
		}
			
	}
	
	
	function drag(){
		
		
		var view_show = $(".annotation_text").width() * 0.91;
		$(".set_style").each(function(index,ele){
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
					$(ele).find("img").css("display", "block");
				})

				//移出事件
				$(ele).parent().on("mouseleave", function() {

					$(ele).css({
						background: "white",
						height: "23px",
						lineHeight: "23px",
						padding: "0px 5px",
						border: "none",
					});
					$(ele).find("img").css("display", "none");
				})
		})
		
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
						imgMouse()

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

						//			mark_dict[$(ele).parent().find("li").find("p").text()] = $(ele).find("img").attr("src");

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


					$(ele).droppable({
						activeClass: "ui-state-default_z",
						hoverClass: "ui-state-hover_z",
						accept: $(".dimensionality_list_text,.measure_list_text"),
						activate: function(event, ui) {

							$(ele).find(".label_icon_content").remove();
							$("#handle_color_text").removeClass("ui-state-default_z")
						},
						drop: function(event, ui) {
							$("#sizer_mpt").css("display", "none");
							$("#view_show_empty").css("display", "none")
							if($("#project_chart").css("display") == "none") {
								$("#sizer_content").css("display", "block");
							}
							$(this).find(".drag_text").css("display", "none");
							$("<li class='drog_row_list'></li>").html($(ui.draggable).parent().html()).appendTo(this);

							$(".drog_row_list").each(function(index, ele) {
								if($(ele).parent().attr("class") != "list_wrap") {
									$(ele).wrap("<div class='list_wrap'></div>");
								}
							})

							//判断拖拽元素颜色
							if($(this).find("span").hasClass("dimensionality_list_text_left")) {
								$(this).find(".dimensionality_list_text_left").parent().parent().css("background", "#c5e0ff");
							}
							if($(this).find("span").hasClass("measure_list_text_left")) {
								$(this).find(".measure_list_text_left").parent().parent().css("background", "#ffcc9a");
							}
							$(this).find("li").css({
								width: view_show + "px",
								height: "23px",
								lineHeight: "23px",
								margin: "5px auto 0",
								listStyle: "none",
							}).addClass("drog_row_list date_list bj_information");
							$(this).find("p").css({
								width: "94%",
								height: "23px",
								background: "",
								padding: "0px 5px",
								color: "black"
							});
							$(this).find("p").find("span").css({
								float: "left",
								display: "block"
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
						
								})

								markShow();

							}

							var dragObj = ui["draggable"];// 拖动的元素
							var _dataType = dragObj.data("type");// 元素数据类型
							var _wd_type = _dataType.w_d_typeCat();// 维度还是度量。。。
							var _field_name =dragObj.children("span").eq(0).html(); // 字段名
								_drag_message["type"] = _wd_type;
							//判断拖入的区域
							switch($(this).attr("id")) {
								
								//判断拖入行
								case 'drop_row_view':

								// 判断是维度还是度量
								drag_row_column_data["row"][_wd_type].push(_field_name + ":" + _dataType);
								_drag_message["position"] = "row";
								_drag_message["type"] = _wd_type;	
								//判断在满足条件下展示条形图或者柱状图		

									break;

									//判断拖入列

								case 'drop_col_view':

								
									drag_row_column_data["column"][_wd_type].push(_field_name + ":" + _dataType);
								
									_drag_message["position"] = "column";
									_drag_message["type"] = _wd_type;	
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
								default:
									break;
							}
			
							// 展现 table
//							showTable_by_dragData();

			switch_chart_handle_fun();

						}

					}).sortable({
						zIndex: "2000",
						items: ".drog_row_list",
						connectWith: ".drop_view",
						tolerance: "pointer",

						sort: function() {
							$(".drop_view").not($("#view_show_area_content")).addClass("ui-state-default_z")
							$("#view_show_area_content").css("border","1px solid #000")
							if($(this).attr("id") == "handle_color_text") {
								$(this).find("li").css({
									width: view_show * 0.85 + "px",
								});
							};

							$(".list_wrap").find(".label_icon_wrap").parent().remove();
							$(this).find("li").css({
								//								background:"c5e0ff",
								height: "23px",
							});
						},
						beforeStop: function() {
							$(".drop_view").removeClass("ui-state-default_z");
							$("#view_show_area_content").css("border","")
						},
						over: function() {
							$(this).css("background", "#DEDEDE")
						},
						out: function() {
							$(this).css("background", "");

//							console.log($(this).attr("id"))

						},
						update: function() {
							var ceshi = $(this).sortable("toArray");
					

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
									break;

								case "drop_col_view":
									$(this).find("li").removeClass().addClass("drog_row_list date_list bj_information");
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
									$(this).find("li").remove();
								default:

									break;
							}

						}

					}).disableSelection();

					

				})
			});

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
						imgMouse()
					}
				});

				$("#drop_zb_view").droppable({
					activeClass: "ui-state-default_z",
					hoverClass: "ui-state-hover_z",
					accept: $(".index_list_text"),

					drop: function(event, ui) {
						$("#sizer_mpt").css("display", "none");
						$("#view_show_empty").css("display", "none");

						$("#sizer_content").css("display", "block");

						var disabled = $(".drop_view").droppable("option", "disabled");
						$(".drop_view").droppable("option", "disabled", true);

						$(".drop_view").sortable({ disabled: true });

						$(".drop_view").css("background", "rgba(0,0,0,0.2)");

						$(this).find("span").css("display", "none");
						$("<li class='index_row_list'></li>").html($(ui.draggable).parent().html()).appendTo(this);

						$(".index_row_list").each(function(index, ele) {
							if($(ele).parent().attr("class") != "list_wrap") {
								$(ele).wrap("<div class='list_wrap'></div>");
							}
						})
						$(this).find("li").css({
							width: view_show + "px",
						});
					}

				}).sortable().disableSelection();

			})
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
			//创建一个类型弹窗			
			$(".dimensionality_datatype").each(function(index, ele) {
				$(ele).on("click", function(event) {
					//...
					$(".dimensionality_datatype").css("background", "");
					$(ele).css("background", "#ADADAD");

					event.stopPropagation();
					if($(ele).parent().find(".click_type").length == "0") {
						//禁止滚动
						disable_scroll();

						//删除移入事件
						$(".dimensionality_datatype").unbind("mouseenter").unbind("mouseleave");
						$(".type_wic").not($(ele).parent().find(".type_wic")).remove();
						var type_wicket = $("<div class='type_wic'><ul class='click_type'><li><span class='default'></span>默认值</li><li><span class='num_system'></span>数字(二进制)</li><li><span class='num_ten'></span>数字(十进制)</li><li><span class='show_num_integer'></span>数字(整数)</li><li><span class='show_date_time'></span>日期和时间</li><li><span class='show_date'></span>日期</li><li><span class='show_string'></span>字符串</li></ul></div>");
						type_wicket.appendTo($(ele).parent());

						$(type_wicket).find("span").css({
							width:"25px",
							height:"22px",
							float:"left",
						});

						type_wicket.find(".click_type").css({
							top: $(ele).offset().top - 45 + "px",
							left: "5px",
						}).addClass("type_wic_click_type");
						type_wicket.find("ul").addClass("type_wic_ul");

						type_wicket.find("li").addClass("type_wic_li");

						type_wicket.find("li").on("click", function() {
							//点击更换类型
							switch($(this).text()) {
								case "默认值":
									if($(this).parent().parent().parent().attr("class") == "measure_li") {
										$(this).parent().parent().parent().find(".dimensionality_datatype img").attr("src", "/static/dashboard/img/Integer.png").removeClass().addClass("default_img");
									} else {
										$(this).parent().parent().parent().find(".dimensionality_datatype img").attr("src", "/static/dashboard/img/String.png").removeClass().addClass("default_img");
									}

									break;
								case "数字(二进制)":
									$(this).parent().parent().parent().find(".dimensionality_datatype img").attr("src", "/static/dashboard/img/Integer.png").removeClass().addClass("system_num_second");
									break;
								case "数字(十进制)":
									$(this).parent().parent().parent().find(".dimensionality_datatype img").attr("src", "/static/dashboard/img/Integer.png").removeClass().addClass("system_num_ten");
									break;
								case "数字(整数)":
									$(this).parent().parent().parent().find(".dimensionality_datatype img").attr("src", "/static/dashboard/img/Integer.png").removeClass().addClass("integer_num");
									break;
								case "日期和时间":
									$(this).parent().parent().parent().find(".dimensionality_datatype img").attr("src", "/static/dashboard/img/date-time.png").removeClass().addClass("data_time");
									break;
								case "日期":
									$(this).parent().parent().parent().find(".dimensionality_datatype img").attr("src", "/static/dashboard/img/date.png").removeClass().addClass("date_img");
									break;
								case "字符串":
									$(this).parent().parent().parent().find(".dimensionality_datatype img").attr("src", "/static/dashboard/img/String.png").removeClass().addClass("string_img");
									break;
								default:
									break;
							}
							//恢复滚动
							enable_scroll();
							$(ele).parent().find(".type_wic").remove();
							$(ele).css("background", "");
							imgMouse()

						})

						//判断数据类型显示图标
						switch($("#dimensionality_show").find($(ele)).find("img").attr("class")) {
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
						switch($("#measure_show").find($(ele)).find("img").attr("class")) {
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

					} else {
						$(ele).parent().find(".type_wic").remove();
						//恢复滚动
						enable_scroll();
						$(ele).css("background", "");
						imgMouse()
					}
				})

			})
	}
	
	
/*gxm-----end*/	
	
	
	
	
	
	
	
	
	// ------------- 请求维度和度量数据数据


	//设计视图icon
	var project_icon = ["文本表", "指标卡", "饼图", "仪表盘", "环形图", "折线图", "柱状图", "堆积柱状图", "瀑布图", "对比柱状图", "百分比堆积柱状图", "条形图", "堆积条形图", "对比条形图", "百分比堆积条形图", "组合图", "面积图", "堆积面积图", "百分比堆积面积图", "范围图", "矩阵散点图", "气泡图", "矩阵图", "甘特图", "地图(面积)", "地图(气泡)", "地标", "雷达图", "树状图"];
	//title  dimensionality
	var dimensionality_arr = { "文本表": "1个或多个维度", "指标卡": "0个维度", "饼图": "1个维度", "仪表盘": "0个维度", "环形图": "2个或多个维度", "折线图": "1个或多个维度", "柱状图": "0个或多个维度", "堆积柱状图": "1个或多个维度", "瀑布图": "1个维度", "对比柱状图": "0个或2个维度", "百分比堆积柱状图": "1个或多个维度", "条形图": "0个或多个维度", "堆积条形图": "1个或多个维度", "对比条形图": "1个维度", "百分比堆积条形图": "1个或多个维度", "组合图": "1个或多个维度", "面积图": "1个维度", "堆积面积图": "2个维度", "百分比堆积面积图": "2个维度", "范围图": "1个维度", "矩阵散点图": "0个或1个维度", "气泡图": "0个维度", "矩阵图": "1个或多个维度", "甘特图": "2个维度", "地图(面积)": "1个地理位置", "地图(气泡)": "1个地理位置", "地标": "1个地理位置", "雷达图": "1个或多个维度", "树状图": "1个或多个维度" };

	//title measure
	var measure_arr = { "文本表": "1个或多个度量", "指标卡": "1个或2个度量", "饼图": "1个度量", "仪表盘": "1个度量", "环形图": "1个度量", "折线图": "1个或多个度量", "柱状图": "1个或多个度量", "堆积柱状图": "1个或多个度量", "瀑布图": "1个度量", "对比柱状图": "2个或多个度量", "百分比堆积柱状图": "1个或多个度量", "条形图": "1个或多个度量", "堆积条形图": "1个或多个度量", "对比条形图": "2个度量", "百分比堆积条形图": "1个或多个度量", "组合图": "2个度量", "面积图": "1个度量", "堆积面积图": "1个度量", "百分比堆积面积图": "1个度量", "范围图": "1个度量", "矩阵散点图": "1个或多个度量", "气泡图": "2个度量", "矩阵图": "1个或2个度量", "甘特图": "1个度量", "地图(面积)": "0个或多个维度", "地图(气泡)": "0个或多个维度", "地标": "0个或多个维度", "雷达图": "1个或多个度量", "树状图": "1个或多个度量" };

	//title map
	var map_measure = { "地图(面积)": "0个或多个度量", "地图(气泡)": "0个或多个度量", "地标": "0个或多个度量" }
	for(var i = 0; i < project_icon.length; i++) {
		var project_icon_list = $("<li class='project_icon_hover'><img alt=" + project_icon[i] + "></li>");

		project_icon_list.appendTo($("#project_chart ul"));

		project_icon_list.css({
			width: "40px",
			height: "40px",
			float: "left",
			marginLeft: "6px",
			marginTop: "5px",
			cursor: "pointer",
			//			border:"1px solid #000"
		});
		project_icon_list.find("img").attr("src", "/static/dashboard/img/chart_" + (i + 1) + ".png");
	}

	$(".project_icon_hover").each(function(index, ele) {

		$(ele).on("mouseenter", function() {
			$(ele).css("background", "white")
			//动态创建提示框
			var project_icon_hint = $("<div class='project_icon_hint_wrap'><p class='project_icon_hint_p_one'></p><p class='project_icon_hint_p_two'></p><p class='project_icon_hint_p_three'></p><p class='project_icon_hint_p_four'></p><img src='/static/dashboard/img/sanjiao_03.png' alt='project_tran'></div>")

			project_icon_hint.find("p").css({
				fontSize: "12px",
				padding: "0px 25px 0px 11px",
			});

			project_icon_hint.find("p").eq(0).text(project_icon[index]).css({
				color: "#000",
				paddingTop: "10px",
			});

			project_icon_hint.find("p").eq(1).text(dimensionality_arr[project_icon[index]]).css({
				color: "#808080",
				paddingTop: "7px",
			});

			project_icon_hint.find("p").eq(2).text(measure_arr[project_icon[index]]).css({
				color: "#808080",
				paddingTop: "7px",

			});

			project_icon_hint.find("p").eq(3).text(map_measure[project_icon[index]]).css({
				color: "#808080",
				paddingTop: "7px",
				paddingBottom: "15px",
			});

			project_icon_hint.css({
				position: "absolute",
				background: "white",
				width: "auto",
				boxShadow: "0 3px 3px 2px #DEDEDE",
				zIndex: "999",
				borderRadius: "2px"
			});

			project_icon_hint.appendTo($("body"));

			project_icon_hint.find("img").css({
				position: "absolute",
				right: "-6px",
				top: "28.5px"
			});
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

	})

	//点击清除维度度量
	$(".drag_main_icon_second").each(function(index, ele) {
		$(ele).on("click", function() {
			$(".annotation_text").eq(index).find(".list_wrap").remove();
			$(".annotation_text").eq(index).find("li").remove();

			$(".drag_text").eq(index).css("display", "block");
			//			if($("#project_chart").css("display") == "none"){
			//				$("#sizer_mpt").css("display", "block");
			//				console.log("123")
			//			}

			if($(".drog_row_list").length == "0" && $("#project_chart").css("display") == "none") {
				$("#sizer_mpt").css("display", "block");
				$("#view_show_empty").css("display", "block");
				$("#sizer_content").css("display", "none");
			}

		})
	})

	$("#index_icon_tra").on("click", function() {
		if($(".drog_row_list ").length == "0" && $("#project_chart").css("display") == "none") {
			$("#sizer_mpt").css("display", "block");
			$("#sizer_content").css("display", "none");
		}
		var disabled = $(".drop_view").droppable("option", "disabled");
		$(".drop_view").droppable("option", "disabled", false);

		$(".drop_view").sortable({ disabled: false });

		$(".drop_view").css("background", "");

		$("#drop_zb_view").find("li").remove();
		$("#drop_zb_view").find(".drag_text").css("display", "block");
	})

	//侧边栏

	var leftBarW = $("body").height() - 70 - 80 - 40;
	//	var leftbarW_second = $(".leftNav").height()
	$("#lateral_bar").height(leftBarW + 40);
	$("#dimensionality,#measurement,#indicator,#parameter").height(leftBarW / 4);

	$("#view_show_area").height(leftBarW + 10 - $("#operational_view").height());
	$("#view_show_area_content").height(leftBarW + 40 - $("#operational_view").height() - 30);
	$("#dimensionality_show,#measure_show,#index_show,#parameter_show").height($("#dimensionality").height() - 32);
	$("#action_box").width($("body").width() - 60 - 210);
	$("#dashboard_content").width($("body").width() - 60);
	//..
	var barHeight = $("body").height() - $(".topInfo").height() - $("#new_view").height() - $("#action_box").height();
	var view_show_height = barHeight - $("#operational_view").height();
	var nowContentW = $("#action_box").width();
	$("#operational_view").width(nowContentW - 201);
	$("#view_show_area").width(nowContentW - 201);
	$("#view_show_area_content").width($("#drag_wrap_content").width());

	//筛选器高度
	$("#sizer").height($("#lateral_bar").height() + 50);
	$("#sizer_place").height($("#sizer").height());

	//浏览器高度
	var bodyHeight = $("body").height();

	var titleW = $("#action_box").width();

})