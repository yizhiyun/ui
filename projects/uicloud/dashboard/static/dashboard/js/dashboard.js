
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



var view_name;

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

//用户名
var username = "liuyue";
//视图保存的数据
var post_dict ={};

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
			$("#sizer_content").hide();
		}
	});
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
		for (var i =0; i < build_tables.length;i++) {
			var val = build_tables[i];
			var op = $("<option value="+val+">"+val+"</option>");
			cube_select.append(op);
		}	

		
		// select选项卡
		cube_select.comboSelect();
		
		// 展示维度和度量等
		load_measurement_module(cube_select.val())
		
		// 数据选择 select 变化的时候，去获取新的数据
		cube_select.unbind("change");
		cube_select.change(function(event){
			event.stopPropagation();
			if($(this).val() && now_build_tables.indexOf($(this).val()) != -1){
				
				load_measurement_module($(this).val());
			}
		});	
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
			type:"post",
			dataType:"json",
			success:function(data){
				console.log(data);
				if (data["status"] == "success") {
					var cube_all_data = data["results"];
					filterNeedAllData =  data["results"]["data"];
					var schema = cube_all_data["schema"];
					for(var i = 0;i < schema.length;i++){
						schema[i]["isable"] = "yes";
					}
					_cube_all_data[current_cube_name] = cube_all_data;
					factory_create_li_to_measurement_module(schema);
					
				}
			
			}
		});
		
		//2、工厂，根据数据去创建 维度和度量等的 Li
		function factory_create_li_to_measurement_module(schema){
			
			for (var i = 0; i < schema.length;i++) {
				var column_name_info = schema[i];
				var  _name = column_name_info["field"]; // 字段名
				var _data_type = column_name_info["type"];  // 字段的数据类型
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
							});

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
						
								})

								markShow();

							}

							var dragObj = ui["draggable"];// 拖动的元素
							var _dataType = dragObj.data("type");// 元素数据类型
							var _wd_type = _dataType.w_d_typeCat();// 维度还是度量。。。
							var _field_name =dragObj.children("span").eq(0).html(); // 字段名
								_drag_message["type"] = _wd_type;

								//给予li id名 记录元素对应的内容
								$(this).find("li").eq($(this).find("li").length-1).attr("id",_wd_type+":"+_field_name + ":" + _dataType)
							//判断拖入的区域
							switch($(this).attr("id")) {
								
								//判断拖入行
								case 'drop_row_view':

								// 判断是维度还是度量
								drag_row_column_data["row"][_wd_type].push(_field_name + ":" + _dataType);
								_drag_message["position"] = "row";
								_drag_message["type"] = _wd_type;	
								
								

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

									// case "view_show_area_content":
									// 	//拖到此区域删除元素
									// 	$(this).find(".list_wrap").remove();
									// break;
								default:
									break;
							}
			
							// 展现 table
//					showTable_by_dragData();
			
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
							$("#view_show_area_content").css("border","");

						},

						over: function() {
							$(this).css("background", "#DEDEDE")
						},
						out: function() {
							$(this).css("background", "");

//							console.log($(this).attr("id"))

						},

						update: function(event,ui) {
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
										console.log($(ele).find("li").eq(i).attr("id"));
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

									break;
								default:

									break;
							}
							
							switch_chart_handle_fun("sortable");
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
	var project_icon = [["文本表","1或多个维度","1或多个度量","show_table"], ["饼图","1个维度","1个度量","show_cake"],["折线图","1个维度","1或多个度量","show_polyline"], ["柱状图","0或多个维度","1或多个度量","show_histogram"],["堆积柱状图","2或3个维度","1个度量","show_storehis"], ["瀑布图","1个维度","1个度量","show_waterfall"],["百分比堆积柱状图","2或3个维度","1个度量","show_percontrasth"], ["条形图","0或多个维度","1或多个度量","show_bar"], ["堆积条形图","2或3个维度","1个度量","show_storebar"], ["对比条形图","1个维度","2个度量","show_contrastbar"], ["百分比堆积条形图","2或3个维度","1个度量","prestorebar"], ["面积图","1个维度","1个度量","show_area"], ["范围图","1个维度","1个度量","show_scale"],["甘特图","1个维度","1个度量","show_gantt"],["雷达图","1个维度","1或多个度量","show_randar"], ["树状图","2或多个维度","1个度量","show_treemap"]];

	for(var i = 0; i < project_icon.length;i++) {

		var project_icon_list = $("<li class='project_icon_hover'><img alt=" + project_icon[i][0] + "></li>");

		project_icon_list.attr("id",project_icon[i][3]);
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
	$("#btn_save_name").on("click",function(){
		$("#key_search").css("display","block");
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


	// state_end---



	//username

	//保存视图按钮点击事件
	$("#click_save_view").on("click",function(){
		add_state_name();
		//获取之前是否有保存的文件夹和报表

		$.post("../dashboard/getAllData",{"username":username},function(result){
			console.log(result);
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

		
	})

	//显示服务器里操作保存过的数据
	function show_view_save_dashbash(data_result){
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
					$("<img src=../static/dashboard/img/left_35.png  class='click_tra click_tra_floder'/>").prependTo($(".state_folder_content"));
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
			post_dict["row"]= JSON.stringify(drag_row_column_data["row"]);
			post_dict["column"]= JSON.stringify(drag_row_column_data["column"]);
			post_dict["foldername"] = $(".active_folder_view").text();
			post_dict["username"] = username;
			post_dict["tablename"] = current_cube_name;
			post_dict["viewtype"] = view_name;
			post_dict["defaultparent"] = "default";
			
			
			//将数据存储数据库
			$.post("/dashboard/dashboardTableAdd",post_dict,function(result){
				
			if(result["column"] != ""){
				 window.location.href="../statements/pallasdata3"
			}else{
				alert("保存失败");
			}
		});
		}else{
			$("#btn_save_name").css("background","#DEDEDE");
		}

	})



})