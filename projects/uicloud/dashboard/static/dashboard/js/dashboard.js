$(function() {
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

	//单元格

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

	$("#project").on("click", function() {
		$("#sizer_wrap .sizer_line").css("background", "#DEDEDE");
		$("#project .sizer_line").css("background", "#0d53a4");
		$("#sizer_content").css("display","none");
		
		$("#project_chart").css("display","block");
		$("#sizer_mpt").css("display", "none")
		
	})

	$("#sizer_wrap").on("click", function() {
		$("#project .sizer_line").css("background", "#DEDEDE");
		$("#sizer_wrap .sizer_line").css("background", "#0d53a4");
			$("#sizer_content").css("display","block");
			$("#project_chart").css("display","none");
			
		if($(".drog_row_list").length == "0") {
				$("#sizer_mpt").css("display", "block")
				$("#view_show_empty").css("display", "block");
				$("#sizer_content").css("display","none");
			}
	})
	$("#view_show_wrap").data("table","false");
	//ajax请求
	$.ajax({
		type: "get",
		contentType: "application/json; charset=utf-8",
		url: "http://127.0.0.1:8000/dashboard/ajax-list/",
		async: true,
		success: function(data) {
			//遍历数据
			$.each(data, function(num, item) {
				for(var i = 0; i < data[num].length; i++) {
					switch(num) {
						case 'dimensionality':
							//展示元素
							var dimensionality_list = $("<li class='dimensionality_li'><div class='demensionality_datatype'><img alt='datatype'></div><div class='drop_list_main demensionality_list_main'><p class='dimensionality_list_text drop_main clear set_style'><span class='dimensionality_list_text_left'></span><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'></p></div></li>");
							dimensionality_list.appendTo($("#dimensionality_show ul"));
							break;
						case 'measure':
							//展示元素
							var dimensionality_list = $("<li class='measure_li'><div class='demensionality_datatype'><img alt='datatype'></div><div class='drop_list_main measure_list_main'><p class='dimensionality_list_text drop_main clear set_style'><span class='measure_list_text_left'></span><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'></p></div></li>");
							dimensionality_list.appendTo($("#measure_show ul"));
							break;
						case 'index':
							//展示元素
							var dimensionality_list = $("<li class='index_li'><div class='demensionality_datatype'><img alt='datatype'></div><div class='drop_list_main index_list_main'><p class='index_list_text drop_main clear set_style'><span class='index_list_text_left'></span><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'></p></div></li>");
							dimensionality_list.appendTo($("#index_show ul"));
							break;
						case 'parameter':
							//展示元素
							var dimensionality_list = $("<li class='parameter_li'><div class='demensionality_datatype'><img alt='datatype'></div><div class='drop_list_main parameter_list_main'><p class='parameter_list_text drop_main clear set_style'><span class='parameter_list_text_left'></span><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'></p></div></li>");
							dimensionality_list.appendTo($("#parameter_show ul"));
							break;
						default:
							break;
					}
				}
			})

			//显示样式
			$(".dimensionality_li,.index_li,.parameter_li,.measure_li").css({
				listStyle: "none",
				width: "100%",
				height: "23px",
				fontSize: "12px",
				//				position:"relative",
			});

			$(".dimensionality_li").find($(".demensionality_datatype img")).attr("src", "/static/dashboard/img/String.png");

			$(".index_li").find($(".demensionality_datatype img")).attr("src", "/static/dashboard/img/Integer-g.png");

			$(".parameter_li,.measure_li").find($(".demensionality_datatype img")).attr("src", "/static/dashboard/img/Integer.png");

			$(".measure_li").find($(".demensionality_datatype")).addClass("dimensionality_img_type");
			$(".dimensionality_li").find($(".demensionality_datatype")).addClass("dimensionality_img_type");

			$(".demensionality_datatype").css({
				padding: "0px 5px",
			});
			//图标类型移入移出事件
			function imgMouse() {
				$(".demensionality_datatype").each(function(index, ele) {
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

			$(".demensionality_datatype").css({
				width: "18px",
				height: "23px",
				float: "left",
				textAlign: "center",
				lineHeight: "20px",
				marginLeft: "7px",
				marginRight: "0px",
				cursor: "pointer",
			});
			$(".dimensionality_li img,.index_li img,.parameter_li img,.measure_li img").css({
				verticalAlign: "middle"
			});

			//展示区域宽度
			var view_show = $(".annotation_text").width() * 0.91;

			//............

			$(".dimensionality_list_text_left").each(function(index, ele) {
				$(ele).html(data["dimensionality"][index])
			})

			$(".measure_list_text_left").each(function(index, ele) {
				$(ele).html(data["measure"][index])
			})

			$(".index_list_text_left").each(function(index, ele) {
				$(ele).html(data["index"][index])
			})

			$(".parameter_list_text_left").each(function(index, ele) {
				$(ele).html(data["parameter"][index])
			})

			$(".set_style").each(function(index, ele) {
				$(ele).parent().css({
					width: "135px",
					height: "23px",
					float: "left",
					//					padding:"0px 5px",
				});

				$(ele).css({
					float: "left",
					width: "135px",
					height: "23px",
					lineHeight: "23px",
					padding: " 0px 5px",
					cursor: "pointer",
					borderRadius: "2px",
					fontSize: "12px"

				});

				$(ele).find("img").css({
					float: "right",
					marginTop: "9.5px",
					display: "none",
				});

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
			//
			$(".dimensionality_list_text").each(function(index, ele) {
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

						$(".demensionality_datatype").css("background", "");
					}
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
									width: "100px",
									height: "auto",
									border: "1px solid #DEDEDE",
									position: "absolute",
									top: $(ele).parent().offset().top - 70 + 22 + "px",
									background: "white"
								});

								$(labelIcon).find(".label_icon_wrap").find("li").css({
									width: "100px",
									height: "23px",
									borderBottom: "1px solid #DEDEDE"

								})
								$(labelIcon).find(".label_icon_wrap").find("li").find(".label_left_img").css({
									width: "25px",
									height: "23px",
									position: "absolute",
									left: "0px"
								});

								$(labelIcon).find(".label_icon_wrap").find("li").find(".label_right_text").css({
									width: "75px",
									height: "23px",
									position: "absolute",
									left: "25px",
									textAlign: "center",
									lineHeight: "25px",

								});

								$(labelIcon).find(".label_icon_wrap").find("li").find(".label_left_img").find("img").attr("src", "/static/dashboard/img/color.png").css({
									position: "absolute",
									top: "0px",
									right: "0px",
									bottom: "0px",
									left: "0px",
									margin: "auto"
								});

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

									//						if($("#handle_color_text").find(".color_icon_wrap").find("img").not($(ele).find("img")).attr("src") == bj_dict[$(this).find(".label_right_text").text()]){
									//							$(ele).parent().remove();
									//							
									//						}
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
						accept: $(".dimensionality_list_text"),
						activate: function(event, ui) {

							$(ele).find(".label_icon_content").remove();
							$("#handle_color_text").removeClass("ui-state-default_z")
						},
						drop: function(event, ui) {
							
							$("#sizer_mpt").css("display", "none");
							$("#view_show_empty").css("display", "none");
							if($("#project_chart").css("display") == "none"){
								$("#sizer_content").css("display","block");
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
								console.log($(ele))
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
										$(".color_icon_wrap").css({
											width: "13px",
											height: "13px",
											lineHeight: "13px",
											float: "left",
											marginTop: "4px",
											marginLeft: "5px",
										});

										$(".color_icon").css({
											marginTop: "5px",
											cursor: "pointer",
											//												verticalAlign: "middle",

										});
									}
									$(this).find("li").css({
										width: view_show * 0.85 + "px",
										height: "23px",
										lineHeight: "23px",
										float: "right",
										listStyle: "none",
										marginTop: "0px",

									}).addClass("date_list").addClass("bj_color");
									$(this).find("p").css({
										boxSizing: "border-box",
										width: "100%",
										float: "right"
									})
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
										$(".color_icon_wrap").css({
											width: "13px",
											height: "13px",
											lineHeight: "13px",
											float: "left",
											marginTop: "4px",
											marginLeft: "5px",
										});

										$(".color_icon").css({
											marginTop: "5px",
											cursor: "pointer",
											//												verticalAlign: "middle",

										});
									}
									$(this).find("li").css({
										width: view_show * 0.85 + "px",
										height: "23px",
										lineHeight: "23px",
										float: "right",
										listStyle: "none",
										marginTop: "0px",

									}).addClass("date_list").addClass("bj_prompt")
									$(this).find("p").css({
										boxSizing: "border-box",
										width: "100%",
										float: "right"
									})
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
										$(".color_icon_wrap").css({
											width: "13px",
											height: "13px",
											lineHeight: "13px",
											float: "left",
											marginTop: "4px",
											marginLeft: "5px",
										});

										$(".color_icon").css({
											marginTop: "5px",
											cursor: "pointer",
											//												verticalAlign: "middle",

										});
									}
									$(this).find("li").css({
										width: view_show * 0.85 + "px",
										height: "23px",
										lineHeight: "23px",
										float: "right",
										listStyle: "none",
										marginTop: "0px",

									}).addClass("date_list").addClass("bj_information");
									$(this).find("p").css({
										boxSizing: "border-box",
										width: "100%",
										float: "right"
									})
								})

								markShow();

							}
							
							//记录拖入维度的字段
							var drop_row_view_arr = [];
							
							var drop_col_view_arr = [];
							
							
							var random = Math.round(Math.random()*2+1);
							
							//判断拖入列里行里
							
							var drop_or;
							
							var request_data = data["ceshi"+random+""];
							
							//判断拖入的区域
							switch($(this).attr("id")) {
								//判断拖入行
								case 'drop_row_view':
									$(this).find(".list_wrap").find("li").each(function(index,ele){
										
										drop_row_view_arr.push($(ele).find("p").find("span").text());
										drop_text_arr["drop_row_view"] = drop_row_view_arr;
										var the_name = $(ele).find("p").find("span").text();
										//遍历添加数据
									
									
										if(lock == false){
											console.log("1")
											for(var i =0;i<request_data.length;i++){	
											var request_dict = new Object();	
											drop_list_save_arr.push(request_dict);

											}
											lock = true;
										}
										
										
										for(var j = 0; j <drop_list_save_arr.length;j++){
											temp  = request_data[j];
											drop_list_save_arr[j][the_name] = temp;
										}
//										console.log(drop_list_save_arr)
//								
										
									})
									drop_or = "row";
								break;
								
								//判断拖入列
								
								case 'drop_col_view':
									$(this).find(".list_wrap").find("li").each(function(index,ele){
											drop_row_view_arr.push($(ele).find("p").find("span").text());
											drop_text_arr["drop_col_view"] = drop_row_view_arr;
											var the_name = $(ele).find("p").find("span").text();
											
											
											
											
											if(lock == false){
											console.log("1")
											for(var i =0;i<request_data.length;i++){	
											var request_dict = new Object();	
											drop_list_save_arr.push(request_dict);

											}
											lock = true;
										}
										
										
										for(var j = 0; j <drop_list_save_arr.length;j++){
											temp  = request_data[j];
											drop_list_save_arr[j][the_name] = temp;
										}
									})	
									
									drop_or = "col";
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
											$(".color_icon_wrap").css({
												width: "13px",
												height: "13px",
												lineHeight: "13px",
												float: "left",
												marginTop: "4px",
												marginLeft: "5px",
											});

											$(".color_icon").css({
												marginTop: "5px",
												cursor: "pointer",
												//												verticalAlign: "middle",

											});
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

									}).addClass("date_list").addClass("bj_information");
									$(this).find("p").css({
										boxSizing: "border-box",
										width: "100%",
										float: "right"
									})

									break;
								default:
									break;
							}
							
				
							
							$("#example_wrapper").remove();
							$("#view_show_wrap").data("table","false");
							//表格展示
							table_Show(drop_text_arr,drop_list_save_arr,drop_or);
						}

					}).sortable({
						zIndex: "2000",
						items: ".drog_row_list",
						connectWith: ".drop_view",
						tolerance: "pointer",

						sort: function() {
							$(".drop_view").addClass("ui-state-default_z")
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
							$(".drop_view").removeClass("ui-state-default_z")
						},
						over: function() {
							$(this).css("background", "#DEDEDE")
						},
						out: function() {
							$(this).css("background", "");
							
							console.log($(this).attr("id"))

						},
						update: function() {

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

										console.log(!$(ele).find("img").hasClass("color_icon"))
										if(!$(ele).find("img").hasClass("color_icon")) {
											console.log("1")
											var zb_icon = $("<div class='color_icon_wrap'><img class='color_icon'></div>");
											$(zb_icon).find("img").attr("src", color_dict[$(this).parent().find(".handle_bj").text()]).attr("alt", $(this).parent().find(".handle_bj").text());
											zb_icon.prependTo($(ele));
											$(ele).appendTo($("#handle_color_text"));
											$(ele).find("li").data("show_num", index);
											mark_dict[$(ele).find("li").find("p").text() + $(ele).find("li").data("show_num")] = $(ele).find(".color_icon_wrap").find("img").attr("src");
											$("#handle_color_text").find(".drag_text").css("display", "none");
											$(".color_icon_wrap").css({
												width: "13px",
												height: "13px",
												lineHeight: "13px",
												float: "left",
												marginTop: "4px",
												marginLeft: "5px",
											});

											$(".color_icon").css({
												marginTop: "5px",
												cursor: "pointer",
												//												verticalAlign: "middle",

											});
										}
										$(this).find("li").css({
											width: view_show * 0.85 + "px",
											height: "23px",
											lineHeight: "23px",
											float: "right",
											listStyle: "none",
											marginTop: "0px",

										}).addClass("date_list").addClass("bj_color");
										$(this).find("p").css({
											boxSizing: "border-box",
											width: "100%",
											float: "right"
										})
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
											$(".color_icon_wrap").css({
												width: "13px",
												height: "13px",
												lineHeight: "13px",
												float: "left",
												marginTop: "4px",
												marginLeft: "5px",
											});

											$(".color_icon").css({
												marginTop: "5px",
												cursor: "pointer",
												//												verticalAlign: "middle",

											});
										}
										$(this).find("li").css({
											width: view_show * 0.85 + "px",
											height: "23px",
											lineHeight: "23px",
											float: "right",
											listStyle: "none",
											marginTop: "0px",

										}).addClass("date_list").addClass("bj_prompt")
										$(this).find("p").css({
											boxSizing: "border-box",
											width: "100%",
											float: "right"
										})
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
											$(".color_icon_wrap").css({
												width: "13px",
												height: "13px",
												lineHeight: "13px",
												float: "left",
												marginTop: "4px",
												marginLeft: "5px",
											});

											$(".color_icon").css({
												marginTop: "5px",
												cursor: "pointer",
												//												verticalAlign: "middle",

											});
										}
										$(this).find("li").css({
											width: view_show * 0.85 + "px",
											height: "23px",
											lineHeight: "23px",
											float: "right",
											listStyle: "none",
											marginTop: "0px",

										}).addClass("date_list").addClass("bj_information");
										$(this).find("p").css({
											boxSizing: "border-box",
											width: "100%",
											float: "right"
										})
									})

									markShow();

									break;
								case "drop_zb_view":
									$(this).find("li").addClass("zb_list");

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

											$(".color_icon_wrap").css({
												width: "13px",
												height: "13px",
												lineHeight: "13px",
												float: "left",
												marginTop: "4px",
												marginLeft: "5px",
											});

											$(".color_icon").css({
												marginTop: "5px",
												cursor: "pointer",
												//												verticalAlign: "middle",

											});
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
										//										background: "#c5e0ff",
										width: "100%",
										float: "right"
									})

									break;
								
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
						$(".demensionality_datatype").css("background", "");
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
					
						$("#sizer_content").css("display","block");
						
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
							height: "23px",
							lineHeight: "23px",
							margin: "5px auto 0",
							listStyle: "none",
							background: "#a7eff4",
						});
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

				$(".demensionality_datatype").css("background", "");
				//恢复绑定事件
				imgMouse()
			})
			//创建一个类型弹窗			
			$(".dimensionality_img_type").each(function(index, ele) {
				$(ele).on("click", function(event) {
					//...
					$(".demensionality_datatype").css("background", "");
					$(ele).css("background", "#ADADAD");

					event.stopPropagation();
					if($(ele).parent().find(".click_type").length == "0") {
						//禁止滚动
						disable_scroll();

						//删除移入事件
						$(".demensionality_datatype").unbind("mouseenter").unbind("mouseleave");
						$(".type_wic").not($(ele).parent().find(".type_wic")).remove();
						var type_wicket = $("<div class='type_wic'><ul class='click_type'><li><span class='default'></span>默认值</li><li><span class='num_system'></span>数字(二进制)</li><li><span class='num_ten'></span>数字(十进制)</li><li><span class='show_num_integer'></span>数字(整数)</li><li><span class='show_date_time'></span>日期和时间</li><li><span class='show_date'></span>日期</li><li><span class='show_string'></span>字符串</li></ul></div>");
						type_wicket.appendTo($(ele).parent());

						$(type_wicket).find("span").css({
							float: "left",
							width: "25px",
							height: "22px"
						});

						type_wicket.find(".click_type").css({
							width: "100px",
							position: "absolute",
							top: $(ele).offset().top - 45 + "px",
							left: "5px",
							zIndex: "9999",
							background: "white",
							border: "1px solid #DEDEDE",
						});
						type_wicket.find("ul").css({
							width: "100px",
						});

						type_wicket.find("li").css({
							borderBottom: "1px solid #DEDEDE",
							height: "22px",
							lineHeight: "22px",
							fontSize: "12px",
							cursor: "pointer"
						});

						type_wicket.find("li").on("click", function() {
							//点击更换类型
							switch($(this).text()) {
								case "默认值":
									if($(this).parent().parent().parent().attr("class") == "measure_li") {
										$(this).parent().parent().parent().find(".demensionality_datatype img").attr("src", "/static/dashboard/img/Integer.png").removeClass().addClass("default_img");
									} else {
										$(this).parent().parent().parent().find(".demensionality_datatype img").attr("src", "/static/dashboard/img/String.png").removeClass().addClass("default_img");
									}

									break;
								case "数字(二进制)":
									$(this).parent().parent().parent().find(".demensionality_datatype img").attr("src", "/static/dashboard/img/Integer.png").removeClass().addClass("system_num_second");
									break;
								case "数字(十进制)":
									$(this).parent().parent().parent().find(".demensionality_datatype img").attr("src", "/static/dashboard/img/Integer.png").removeClass().addClass("system_num_ten");
									break;
								case "数字(整数)":
									$(this).parent().parent().parent().find(".demensionality_datatype img").attr("src", "/static/dashboard/img/Integer.png").removeClass().addClass("integer_num");
									break;
								case "日期和时间":
									$(this).parent().parent().parent().find(".demensionality_datatype img").attr("src", "/static/dashboard/img/date-time.png").removeClass().addClass("data_time");
									break;
								case "日期":
									$(this).parent().parent().parent().find(".demensionality_datatype img").attr("src", "/static/dashboard/img/date.png").removeClass().addClass("date_img");
									break;
								case "字符串":
									$(this).parent().parent().parent().find(".demensionality_datatype img").attr("src", "/static/dashboard/img/String.png").removeClass().addClass("string_img");
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
	});

	//设计视图icon
	var project_icon = ["文本表", "指标卡", "饼图", "仪表盘", "环形图", "折线图", "柱状图", "堆积柱状图", "瀑布图", "对比柱状图", "百分比堆积柱状图", "条形图", "堆积条形图", "对比条形图", "百分比堆积条形图", "组合图", "面积图", "堆积面积图", "百分比堆积面积图", "范围图", "矩阵散点图", "气泡图", "矩阵图", "甘特图", "地图(面积)", "地图(气泡)", "地标", "雷达图", "树状图"];
	//title  dimensionality
	var dimensionality_arr = {"文本表":"1个或多个维度","指标卡":"0个维度","饼图":"1个维度","仪表盘":"0个维度","环形图":"2个或多个维度","折线图":"1个或多个维度","柱状图":"0个或多个维度","堆积柱状图":"1个或多个维度","瀑布图":"1个维度","对比柱状图":"0个或2个维度","百分比堆积柱状图":"1个或多个维度","条形图":"0个或多个维度","堆积条形图":"1个或多个维度","对比条形图":"1个维度","百分比堆积条形图":"1个或多个维度","组合图":"1个或多个维度","面积图":"1个维度","堆积面积图":"2个维度","百分比堆积面积图":"2个维度","范围图":"1个维度","矩阵散点图":"0个或1个维度","气泡图":"0个维度","矩阵图":"1个或多个维度","甘特图":"2个维度","地图(面积)":"1个地理位置","地图(气泡)":"1个地理位置","地标":"1个地理位置","雷达图":"1个或多个维度","树状图":"1个或多个维度"};

	//title measure
	var measure_arr = {"文本表":"1个或多个度量","指标卡":"1个或2个度量","饼图":"1个度量","仪表盘":"1个度量","环形图":"1个度量","折线图":"1个或多个度量","柱状图":"1个或多个度量","堆积柱状图":"1个或多个度量","瀑布图":"1个度量","对比柱状图":"2个或多个度量","百分比堆积柱状图":"1个或多个度量","条形图":"1个或多个度量","堆积条形图":"1个或多个度量","对比条形图":"2个度量","百分比堆积条形图":"1个或多个度量","组合图":"2个度量","面积图":"1个度量","堆积面积图":"1个度量","百分比堆积面积图":"1个度量","范围图":"1个度量","矩阵散点图":"1个或多个度量","气泡图":"2个度量","矩阵图":"1个或2个度量","甘特图":"1个度量","地图(面积)":"0个或多个维度","地图(气泡)":"0个或多个维度","地标":"0个或多个维度","雷达图":"1个或多个度量","树状图":"1个或多个度量"};
	
	//title map
	var map_measure = {"地图(面积)":"0个或多个度量","地图(气泡)":"0个或多个度量","地标":"0个或多个度量"}
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
			
			$(".drag_text").eq(index).css("display","block");
//			if($("#project_chart").css("display") == "none"){
//				$("#sizer_mpt").css("display", "block");
//				console.log("123")
//			}
			
			if($(".drog_row_list").length == "0" && $("#project_chart").css("display") == "none") {
				$("#sizer_mpt").css("display", "block");
				$("#view_show_empty").css("display", "block");
				$("#sizer_content").css("display","none");
			}

		})
	})

	$("#index_icon_tra").on("click", function() {
		if($(".drog_row_list ").length == "0" && $("#project_chart").css("display") == "none") {
			$("#sizer_mpt").css("display", "block");
			$("#sizer_content").css("display","none");
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

	//..
	//	$(window).resize(function() {
	//		var leftBarW = $("body").height() - 70 - 80;
	//		$("#lateral_bar").height(leftBarW + 40);
	//		$("#dimensionality,#measurement,#indicator,#parameter").height(leftBarW / 4);
	//
	//		if($("#drap_row_title").height() <= "30") {
	//			$("#drap_row_title_content span").css("line-height", "30px");
	//		}
	//	})

})