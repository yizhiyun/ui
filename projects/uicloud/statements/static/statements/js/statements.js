		//each遍历方法
		function ele_each(thele,theleSon){
			$(thele).unbind("mouseenter mouseleave");
			thele.each(function(index,ele){
				$(ele).on("mouseenter",function(){
					thele.find(theleSon).eq(index).css("display","block");
				})

				$(ele).on("mouseleave",function(){
					thele.find(theleSon).eq(index).css("display","none");
				})
			})
		}


		var drag_row_column_data_arr = [];

		// var drag_measureCalculateStyle = {};

		//记录当前当前拖拽的到底是行 还是列
		// 行为：row，列为 column
		var _drag_message = {
			"position":null, // 行还是列
			"type":null, // 维度还是度量
			"index":null // 拖拽的下标。。可能暂时不用
		};

		var arr = [];
		var count = 0;

		var nameArr = [];
		var newArr = [];


		//进度条定时器
	    var loading_inter;


		//存放仪表板处理过的数据JSON

		var saveDashboardPostData = [];
		//图表显示的区域
		var viewshow_class = null,

		viewshow_class_arr =[],
		//记录每个表的名称
		statements_current_cube_name = null,

		//记录同环比信息
		statements_tonghuanbi_arr = [],

		//每个视图对应的颜色
		currentColorGroupName_arr = [],

		//每个视图对应的小数点
		normalUnitValue_arr = [],

		//每个视图对应的值单位
		valueUnitValue_arr = [],

		drag_measureCalculateStyle_arr = [],

		//新建视图cont
		view_count_save = 0,

		//判断是否重命名文件报表
		change_if_name = true,

		pre_changeName = null,

		//重命名是文件夹还是报表类型判断
		folder_or_view,

		//记录小视图的oldname
		small_view_show_text,

		//记录修改默认的name
		small_view_handle_text,

		save_old_name_view,

		//判断table隐藏还是显示
		table_show_hide,

		loc_storage=window.localStorage,
		//第一次进入页面只显示默认选中的报表
		table_auto_show  = true,
		//记录是否有存储过的位置信息
		view_session = null,
		//存取视图展示区域视图对应的id
		view_show_id_arr = [],

		//存放所有的文件夹名字

		folder_name_arr = [],

		//存放所有的报表的名字

		menu_folder_name_arr =[],

		gridster = null,

		//记录视图库已经绘制的图形

		saveViewShowArr = {},

		right_width_content,

		state_left_bar_close = false,

		toIfChangeSecond = true,

		onlyRunOne = true,

		//记录已经删除的视图
		tempSaveDeleteView = [],

		tempSaveDeleteViewDict = {},

		statementListCount = 0;
		//容器不同修改视图展示
		function elementContent(ele,option){
			if(option != null){
				for(var v = 0; v < option.series.length;v++){
                	if(option.series[v].label != undefined){
                		$(ele).data("dataShow",option.series[v].label.normal.show);
                	}
                }
			}
			if($(ele).height() < 320 || $(ele).width() < 400){
		            var myChartsChange = echarts.getInstanceByDom($(ele).get(0));
					var opp = myChartsChange.getOption();
z
					opp.toolbox[0].show = false;

					//雷达图缩小调整
					if(opp.radar){
						// console.log(opp.radar[0].indicator);
						if(opp.radar[0].indicator.length > 20 && opp.radar[0].indicator.length < 80){		
							opp.radar[0].name.formatter = function(params){
								// console.log(params);
								count++;
		         				if(count % 6 == 0){
		         					return params;
		         				}else{
		         					arr.push(params);
		         					return '';
		         				}
							}
						}else if(opp.radar[0].indicator.length > 80 && opp.radar[0].indicator.length < 200){
							opp.radar[0].name.formatter = function(params){
								// console.log(params);
								count++;
		         				if(count % 13 == 0){
		         					return params;
		         				}else{
		         					arr.push(params);
		         					return '';
		         				}
							}
						}else if(opp.radar[0].indicator.length > 200){
							opp.radar[0].name.formatter = function(params){
								// console.log(params);
								count++;
		         				if(count % 18 == 0){
		         					return params;
		         				}else{
		         					arr.push(params);
		         					return '';
		         				}
							}
						}else{
							opp.radar[0].name.formatter = function(params){
								// console.log(params);
								return params;
							}
						}	
					}


					for(var i = 0; i < opp.series.length;i++){
						if(opp.series[i].label != undefined){

						opp.series[i].label.normal.show = false;
						}
					}

					if(opp.xAxis == undefined && opp.yAxis == undefined){
						if(opp.series[0].labelLine != undefined){
							opp.series[0].labelLine.normal.show = false;
						}
						myChartsChange.setOption(opp);
						return;
					}


					for(var j = 0; j < opp.xAxis.length; j++){
						// opp.xAxis[j].axisTick.interval = 2;
						// opp.xAxis[j].axisLabel.interval = 2;
						if(opp.xAxis[j].data){
							var len = opp.xAxis[j].data.length;
							opp.xAxis[j].axisTick.interval = function(index,value){
								if(index % 2 == 0 && len > 10) {
									return !/^YZYPD/.test(value);
								}else if(len < 10){
									return !/^YZYPD/.test(value);
									// return value;
								}else{
									return '';
								}

							};
							opp.xAxis[j].axisLabel.interval = function(index,value){
								if(index % 2 == 0 && len > 10) {
									return !/^YZYPD/.test(value);
								}else if(len < 10){
									return !/^YZYPD/.test(value);
									// return value;
								}else{
									return '';
								}
							};
						}else{
							opp.xAxis[j].axisTick.interval = function(index,value){return !/^YZYPD/.test(value)};
							opp.xAxis[j].axisLabel.interval = function(index,value){return !/^YZYPD/.test(value)};
						}
					}


					for(var z = 0; z < opp.yAxis.length; z++){
						// opp.yAxis[z].axisTick.interval = 2;
						// opp.yAxis[z].axisLabel.interval = 2;

						if(opp.yAxis[z].data){
							var len = opp.yAxis[z].data.length;
							opp.yAxis[z].axisTick.interval = function(index,value){
								if(index % 2 == 0 && len > 10) {
									return !/^YZYPD/.test(value);
								}else if(len < 10){
									return !/^YZYPD/.test(value);
									// return value;
								}else{
									return '';
								}};
							opp.yAxis[z].axisLabel.interval = function(index,value){
								if(index % 2 == 0 && len > 10) {
									return !/^YZYPD/.test(value);
								}else if(len < 10){
									return !/^YZYPD/.test(value);
									// return value;
								}else{
									return '';
								}
							};
						}else{
							opp.yAxis[z].axisTick.interval = function(index,value){return !/^YZYPD/.test(value)};
							opp.yAxis[z].axisLabel.interval = function(index,value){return !/^YZYPD/.test(value)};
						}
					}

					myChartsChange.setOption(opp);
		          }


			}

		//正常显示视图部件
		function successShowView(ele){
			if($(ele).height() > 320 && $(ele).width() > 400){
				var myChartsChange = echarts.getInstanceByDom($(ele).get(0));
				var opp = myChartsChange.getOption();
				opp.toolbox[0].show = true;

				if(opp.radar){
					// console.log(opp.radar[0].indicator);
					if(opp.radar[0].indicator.length > 20 && opp.radar[0].indicator.length < 80){		
						opp.radar[0].name.formatter = function(params){
							// console.log(params);
							count++;
	         				if(count % 4 == 0){
	         					return params;
	         				}else{
	         					arr.push(params);
	         					return '';
	         				}
						}
					}else if(opp.radar[0].indicator.length > 80 && opp.radar[0].indicator.length < 200){
						opp.radar[0].name.formatter = function(params){
							// console.log(params);
							count++;
	         				if(count % 10 == 0){
	         					return params;
	         				}else{
	         					arr.push(params);
	         					return '';
	         				}
						}
					}else{
						opp.radar[0].name.formatter = function(params){
							// console.log(params);
							count++;
	         				if(count % 15 == 0){
	         					return params;
	         				}else{
	         					arr.push(params);
	         					return '';
	         				}
						}
					}
				}

				for(var i = 0; i < opp.series.length;i++){
					if(opp.series[i].label != undefined){

						opp.series[i].label.normal.show = $(ele).data("dataShow");
					}
				}

				if(opp.xAxis == undefined && opp.yAxis == undefined){
					if(opp.series[0].labelLine != undefined){
						opp.series[0].labelLine.normal.show = $(ele).data("dataShow");
					}

					myChartsChange.setOption(opp);

					return;
				}


				for(var j = 0; j < opp.xAxis.length; j++){
					// opp.xAxis[j].axisTick.interval = 0;
					// opp.xAxis[j].axisLabel.interval = 0;
					opp.xAxis[j].axisTick.interval = function(index,value){return !/^YZYPD/.test(value)};
					opp.xAxis[j].axisLabel.interval = function(index,value){return !/^YZYPD/.test(value)};
				}

				for(var z = 0; z < opp.yAxis.length; z++){
					// opp.yAxis[z].axisTick.interval = 0;
					// opp.yAxis[z].axisLabel.interval = 0;
					opp.yAxis[z].axisTick.interval = function(index,value){return !/^YZYPD/.test(value)};
					opp.yAxis[z].axisLabel.interval = function(index,value){return !/^YZYPD/.test(value)};
				}

				myChartsChange.setOption(opp);
			}
		}

		function satetementsReadySumFunction(isOnlyLaod){

		// drag_row_column_data_arr = [];

		// //每个视图对应的颜色
		// currentColorGroupName_arr = [];

		// //每个视图对应的小数点
		// normalUnitValue_arr = [];

		// //每个视图对应的值单位
		// valueUnitValue_arr = [];

		// drag_measureCalculateStyle_arr = [];

		// //存取视图展示区域视图对应的id
		// view_show_id_arr = [];

		// statements_tonghuanbi_arr = [];

		// saveDashboardPostData = [];

		function statementsinit(resize){
			//侧边栏收起按钮top
			$("#statements_left_bar #statements_left_bar_btn_close").css("top",($("body").height()-$(".topInfo").height())/2 - $("#statements_left_bar_btn_close").height()/2 + "px");
			right_width_content = $("body").width()-$("#statements_left_bar").position().left - $("#statements_left_bar").width() - $(".leftNav").width();
			//右侧视图展示区域宽度
			$("#right_folder_show_are").css("width",right_width_content +"px").css("height",$("body").height() - $(".topInfo").height() + "px");

			//右侧视图展示区域高度
			$(".view_folder_show_area").css("height",$("body").height() - $(".topInfo").height() - 54+ "px");
			if((isOnlyLaod == false || onlyRunOne) && resize  == undefined){
				//拿到构建报表的数据
				$.post("/dashboard/getAllData",function(result){
					ajax_data_post = result;
					toIfChangeSecond = true;
					view_out_handle_init(result);
				})
			}

			$(".rightConent #statements_left_bar #statements_left_bar_area").height($("body").height()-$(".topInfo").height()-$(".rightConent #statements_left_bar #state_left_bar_title").height());
		}
		statementsinit();

        // $(window).resize(function(){
        // 	if($("#pageStatementsModule").css("display") == "block"){
        // 		statementsinit("resize");
        //   		gridster_handle();
        // 	}
        // })
		//搜索功能
		function searchFun(){
			$("#pageStatementsModule #statements_left_bar #state_left_bar_title #statements_left_search").unbind("click");
			$("#pageStatementsModule #statements_left_bar #state_left_bar_title #statements_left_search").click(function(event){
				event.stopPropagation();
				if($(this).parents("#statements_left_bar").find(".view_search").css("display") == "block"){
					$(this).parents("#statements_left_bar").find(".view_search").hide(300);

					$(this).parents("#statements_left_bar").find(".viewTableShow").animate({
						"height":$(this).parents("#statements_left_bar").height() - 38 + "px",
					},300);

				}else{
					// $(this).parents("#statements_left_bar").find(".view_search_input").focus();
					$(this).parents("#statements_left_bar").find(".view_search").show(300);
					$(this).parents("#statements_left_bar").find(".viewTableShow").stop(true).animate({
						"height":$(this).parents("#statements_left_bar").height() - 22 - 38 + "px",
					},300);
				}
			})
			Search($("#pageStatementsModule #statements_left_bar .view_search .view_search_input"),"view_show_name_save",$("#pageStatementsModule #statements_left_bar #statements_left_bar_area"));
		}
		searchFun();

		function Search(ele,activeClass,showContent){
			$("#pageStatementsModule #statements_left_bar .view_search .view_search_input").val('');
		    //报表弹窗筛选功能
		  $(ele).on("input",function(){
		    //搜索里输入的值
		    var search_input_data  = $(ele).val();

		    if(search_input_data != ""){
      			$(showContent).children().css("display","none");

		      	var reg_str = "/"+search_input_data+"/gi";

		      	var list_p=$(showContent).find("."+activeClass+"");

			    for(var i = 0 ; i < list_p.length;i++){

			    	var reg = eval(reg_str);

			      (function(index){
			        var list_li_text = list_p.eq(index).text();
			        if(reg.test(list_li_text) == true){
			          	list_p.eq(index).parent().parent().css("display","block");
			        }
			      })(i);

			    }
		    }else{
      			$(showContent).children().css("display","block");
		    }
		  })
		}

		// if(isOnlyLaod){
		// 	return;
		// }
		function gridster_handle(){
			 		 if(gridster != null){
			 		  	gridster.destroy();
			 		  }
				 	  gridster = $(".gridster ul").gridster({        //通过jquery选择DOM实现gridster
		                  // widget_margins: [10,0],
		                 widget_selector:".new_view_content",
		                 widget_base_dimensions: [($(".view_folder_show_area").width()-120)/6,($("body").height())/6.5],
		                 autogenerate_stylesheet:true,
		                 avoid_overlapped_widgets:false,
		                 draggable: {
		                         handle: 'header',
		                         start:function(event,ui){
		                         	// console.log(ui.$player.data("coords").coords,ui.$player.data("coords").coords.width)
		                         	// ui.$player.data("coords").coords.width = ui.$player.parent().width();
		                         	// ui.$player.data("coords").coords.height = ui.$player.parent().height();
		                         	$(".preview-holder").css({
		                         		"width":$(".new_view_content").eq(ui.$player.attr("data-value")).width() + "px",
		                         		"height":$(".new_view_content").eq(ui.$player.attr("data-value")).height() + "px"
		                         	})
		                         },
		                         stop:function(event,ui){
		                         	//获取所有视图的位置大小信息
		                         	var gridster_view_location = gridster.serialize();
		//                       	console.log(view_show_id_arr)
		                         	//遍历视图对应的id数组
		                         	for(var i = 0; i < view_show_id_arr.length;i++){
		                         		var view_save_id_o = String(view_show_id_arr[i]);
		                         		tablelist_location["a"+view_save_id_o] = JSON.stringify(gridster_view_location[i]);
		                         	}

		                         	$.post("../dashboard/setSwitch",{"switch":"status","tablelist":JSON.stringify(tablelist_location)},function(result){
		                         		if(result["status"] == "ok"){
		//                       			console.log("保存位置信息成功")
		                         		}
		                         	});
		                         }
		                 },
		                 resize:{
		                         	enabled:true,
		                         	min_size:[2,2],
		                         	resize:function(event,ui){
		//                       		console.log(ui.$player.parent())
		                         		$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".textarea").css("width",$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").width()-18 + "px");
		                         		$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main").css("height",$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").height()-30 + "px");
		                         		if($(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_indexPage").hasClass("new_view_indexPage")){
		                         			$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_indexPage").find(".right_module").css("marginTop",($("."+viewshow_class+"").parent().height()-30)/2 - 80 + "px");
		                         		}
		                         	},
		                         	start:function(event,ui){
		//                       		console.log(ui.$player.parent())
		                         		$(".preview-holder").css({
		                         		"width":$(".new_view_content").eq(ui.$player.attr("data-value")).width() + "px",
		                         		"height":$(".new_view_content").eq(ui.$player.attr("data-value")).height() + "px"
		                         		})
		                         	},
		                         	stop:function(event,ui){
		                         		//获取所有视图的位置大小信息
		                         	var gridster_view_location = gridster.serialize();

		                         	//遍历视图对应的id数组
		                         	for(var i = 0; i < view_show_id_arr.length;i++){
		                         		var forArr = String(view_show_id_arr[i]);
		                         		tablelist_location["a"+forArr] = JSON.stringify(gridster_view_location[i]);

		                         	}

		                         	$.post("../dashboard/setSwitch",{"switch":"status","tablelist":JSON.stringify(tablelist_location)},function(result){
		                         		if(result["status"] == "ok"){
		//                       			console.log('保存位置信息成功')
		                         		}
		                         	});

		                         		$(".new_view_content").find(".textarea").eq(ui.$player.parent().attr("data-value")).css("width",$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").width()-18 + "px");
		                         		$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main").css("height",$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").height()-30 + "px");
		                         			$("#right_folder_show_are .view_folder_show_area ul li .new_view_main").each(function(index,ele){
													if(!$(ele).hasClass("new_view_table") && !$(ele).hasClass("new_view_indexPage")){
															var now_view_img=echarts.getInstanceByDom($(ele).get(0));
			 												now_view_img.resize();

											}
										})

		                        		if($(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main").hasClass("new_view_table") == false && $(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main").hasClass("new_view_indexPage") == false){

		                         			//判断视图区域过小隐藏小部件

		                         			elementContent($(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main"),null);

		                         			successShowView($(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main"));
		                         		}

		                         	},

		                         },

		                 }).data('gridster');

				 	  $("#right_folder_show_are .view_folder_show_area ul li .new_view_main").each(function(index,ele){
								$(ele).css("height",$(ele).parent().height() - 30 + "px");
								if(!$(ele).hasClass("new_view_table") && !$(ele).hasClass("new_view_indexPage")){
										var now_view_img=echarts.getInstanceByDom($(ele).get(0));
			 							now_view_img.resize();
								}
							})
		}





		//侧边栏点击事件
		function leftNavClick(){
			//侧边栏关闭按钮点击收起
			$("#statements_left_bar #statements_left_bar_btn_close img").unbind("click");
			$("#statements_left_bar #statements_left_bar_btn_close img").on("click",function(){
				if(!state_left_bar_close){
					$("#statements_left_bar").animate({
						"left":-$("#statements_left_bar").width() + "px",
					},300);
					$("#right_folder_show_are").animate({
						"marginLeft":"0px",
						"width":$("body").width() - $(".leftNav").width() + "px",
					},300,function(){
						$("#right_folder_show_are .view_folder_show_area ul li .new_view_main canvas").css("width","100%").css("height","100%");
						$("#right_folder_show_are .view_folder_show_area ul li .new_view_main canvas").parent().css("width","100%").css("height","100%");
						gridster_handle();
					});

					state_left_bar_close = true;
				}else{

					$("#statements_left_bar").animate({
						"left":"0",
					},300);
					$("#right_folder_show_are").animate({
						"marginLeft":$("#statements_left_bar").width() + "px",
						"width":$("body").width() - 200 - $(".leftNav").width() + "px",
					},300,function(){
						$("#right_folder_show_are .view_folder_show_area ul li .new_view_main canvas").css("width","100%").css("height","100%");
						$("#right_folder_show_are .view_folder_show_area ul li .new_view_main canvas").parent().css("width","100%").css("height","100%");
						gridster_handle();
					});

					state_left_bar_close = false;
				}
				$("#statements_left_bar #statements_left_bar_btn_close").css("display","block");
			})

			if(onlyRunOne){
				//创建文件夹点击显示
				$("#statements_left_tra img").unbind("click");
				$("#statements_left_tra img").on("click",function(){
					$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder").toggle();
				})

				$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder").unbind("mouseleave");
				$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder").on("mouseleave",function(){
					$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder").hide();
				})

				$(".statements_add_folder_son").unbind("click");
				$(".statements_add_folder_son").on("click",function(){
					$("#statements_add_folder").hide();
				})


				//点击创建文件夹
				$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder #add_folder_btn").unbind("click");
				$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder #add_folder_btn").on("click",function(){
					new_folder_view("folder","新建文件夹","delete1","click_delete","view_show_img_content","state_folder","state_folder_content");
				})

				//点击新建视图
				$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder #add_view_btn").unbind("click");
				$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder #add_view_btn").on("click",function(){
					new_folder_view("form_icon","新建报表","more","click_more","view_show_img_content","statement_li","statement_li_content");
				})

				//点击删除全部文件夹
				$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder #remove_all_folder").unbind("click");
				$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder #remove_all_folder").on("click",function(){
						if($(".state_folder").length != 0){
							var ajax_dict_yes_s = {"datatype":"parentfolder","recursive":"yes","defaultparent":"default"};
							var ajax_dict_no_s = {"datatype":"parentfolder","recursive":"no","defaultparent":"default"};
							delete_parentfolder_common(ajax_dict_yes_s,ajax_dict_no_s,false,"all");
						}
					})


				//显示全部隐藏视图
				$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder #show_all_hide").unbind("click");
				$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder #show_all_hide").on("click",function(){
					$.post("/dashboard/setSwitch",{"switch":"show","showall":"yes"},function(result){
						if(result != ""){
							$(".cookie_handle_view .view_show_content .view_show_handle").find("img").attr("src","../static/statements/img/hide.png");
							$(".cookie_handle_view .view_show_content .view_show_handle").css("opacity","1").data("table_show","true").removeClass("table_hide_false").css("background","");
							$(".cookie_handle_view .view_show_content .view_show_handle img").hide();
							$(".cookie_handle_view .view_show_content .view_show_handle").each(function(index,ele){
								$(ele).unbind("mouseenter");
								$(ele).on("mouseenter",function(){$(this).css("background","#F5F5F5");$(this).find("img").show()});

								$(ele).unbind("mouseleave");
								$(ele).on("mouseleave",function(){$(this).css("background","");$(this).find("img").hide()});
							})

							$(".view_folder_show_area ul li").show();
						}
					})
				})
				onlyRunOne = false;
			}


		}

		//移除报表更换默认显示报表
		function deleteFolderChangeNew(now_folder_name){
			if($("#pageStatementsModule .statement_li").length < 2){return;}
			$("#pageStatementsModule .statement_li").each(function(index,ele){
				if($(ele).children(".statement_li_content").children(".view_show_name_save").text() == now_folder_name){
					if(index+1 >= $("#pageStatementsModule .statement_li").length){
						loc_storage.setItem("now_add_view",$("#pageStatementsModule .statement_li").eq(0).children(".statement_li_content").children(".view_show_name_save").text());
					}else{
						loc_storage.setItem("now_add_view",$("#pageStatementsModule .statement_li").eq(index+1).children(".statement_li_content").children(".view_show_name_save").text());
					}
					
				}
			})
		}




		//点击报表更多按钮创建弹窗
		function click_state_show(thele){

			if($(thele).parent().find("#new_state_wrap").length == 0){
				$("#new_state_wrap").remove();
				var new_state_show = $("<div id='new_state_wrap'><div class='new_state_content' id='change_name'>重命名</div><div class='new_state_content' id='show_hide_img'>显示隐藏视图</div><div class='new_state_content' id='delete_view'>删除</div></div>");

				new_state_show.appendTo($(thele).parent());

				//删除按钮点击事件
				new_state_show.find("#delete_view").on("click",function(){
					$(".delete_area_input .deltete_input_wrap").hide();
					//记录报表当前的名字
					var now_folder_name = thele.parent().parent().find(".view_show_name_save").text();
					//点击删除弹出框提示内容
					$(".delete_area_text h4").text('确定删除报表 "'+now_folder_name+'"  ?');
					$(".delete_checked p").text("同时删除报表和包含的所有内容").css("color","#808080").css("left","95px");
					$(".delete_area_input").find(".deltete_input_wrap").css("display","none");
					if($(".delete_area_input").find("img").length == 0){
						$(".delete_area_input").append("<img src='../static/statements/img/gt_03.png' alt='waring'>");
					}
					$(".delete_area_input").find("img").css("marginTop","3px");
					$("#delete_area").css("display","block");
					$(".maskLayer").css("display","block");
					$("#delete_area_close img").on("click",function(){
						$("#delete_area").css("display","none");
						$(".maskLayer").css("display","none");
					})
					//确定删除按钮点击事件
					$(".delete_area_ok_btn").unbind("click");
					$(".delete_area_ok_btn").on("click",function(){
						//服务器更新数据
						$.post("/dashboard/deleteFolder",{"datatype":"folder","foldername":now_folder_name},function(result){{
							if(result != ""){
								if($("#dashboard_content #new_view ul .edit_list").length > 0){
									tempSaveDeleteView = [];
									tempSaveDeleteViewDict["onlyFolder"] = tempSaveDeleteViewDict["onlyFolder"] || [];
									for(viewKey in preClickView){
										if(viewKey.split("-")[0] == now_folder_name){
											if($.inArray(viewKey.split("-")[0],tempSaveDeleteView) == -1){
												tempSaveDeleteView.push(viewKey.split("-")[0]);
											}
											
											statementsToView = true;
										}
									}

									tempSaveDeleteViewDict["onlyFolder"] = tempSaveDeleteViewDict["onlyFolder"].concat(tempSaveDeleteView);
									
								}

								
								if(loc_storage.getItem("now_add_view") == now_folder_name){
									loc_storage.removeItem("now_add_view");
									deleteFolderChangeNew(now_folder_name);
									$(".gridster").html("");
									$(".gridster").append($("<ul></ul>"));
								}

								if(sessionStorage.getItem("edit_view_now")){
										if(sessionStorage.getItem("edit_view_now").split(",")[1] == now_folder_name){
											 sessionStorage.removeItem("edit_view_now");
										}
								}
								delete saveViewShowArr[now_folder_name];
								$("#statements_left_bar_area").html("");
								$("#delete_area").css("display","none");
								$(".maskLayer").css("display","none");
								toIfChangeSecond = true;
								view_out_handle_init(result);

							}
						}})
					})
				})

					// 重命名按钮点击事件
					new_state_show.find("#change_name").on("click",function(){
					//记录之前的名字
					var pre_change = $(thele).parent().parent().find(".view_show_name_save").text();
					change_name_btn(pre_change,$(thele).parent().parent(),"view_show_name_save","1");

					//保存重命名
					$(thele).parent().parent().find(".click_new_folder_input").unbind("focusout");
					$(thele).parent().parent().find(".click_new_folder_input").on("focusout",function(){
					double_click_change_name($(thele).parent().parent(),"view_show_name_save","click_more","more","true");
					ele_each($(thele).parent().parent(),$(".click_more"));
					$("#new_state_wrap").remove();

					more_handle_click();
					// delete_btn_handle();
					})
				// ....
				})

				//显示全部隐藏按钮
				new_state_show.find("#show_hide_img").on("click",function(){
				var ele = $(thele).parent().parent().parent().find(".view_show_handle").find(".hide_or_show_wrap");


				//ajax运行在最后才执行函数
				var ajax_count_ele = null;
				$(".table_hide_false").each(function(index,ele){
					$.post("/dashboard/setSwitch",{"switch":"show","id":$(ele).find(".small_view_text").data("table_id")},function(result){
							if(result != ""){

								ajax_count_ele++;

								if(ajax_count_ele == $(".table_hide_false").length){
									if($(ele).parent().parent().hasClass("cookie_handle_view")){
										$(".view_folder_show_area ul li").show();
									}
									$(".view_show_handle").removeClass("table_hide_false");
								}
							}
						})
				})

				$(".hide_or_show_wrap").find("img").attr("src","../static/statements/img/hide.png");
				$(".view_show_handle").css("opacity","1").css("background","").data("table_show","true");

				ele.parent().each(function(index,ele){
					$(ele).on("mouseenter",function(){
						$(ele).css("background","#F5F5F5");
						$(ele).find("img").css("display","block");
					})
					$(ele).on("mouseleave",function(){
						$(ele).css("background","");
						$(ele).find("img").css("display","none");
					})
				})


				})
				thele.parent().on("mouseleave",function(){
					new_state_show.remove();
				})
			}else{
				$("#new_state_wrap").remove();
			}

		}

		$(document).on("click",function(e){
			if(!$(e.target).is($(".click_more"))){
				$("#new_state_wrap").remove();
			}

		})

		function more_handle_click(){
			$(".click_more").unbind("click");
			$(".click_more").each(function(index,ele){
				$(ele).on("click",function(){

				if(change_if_name){
					click_state_show($(ele));
				}else{
					change_if_name = true;
					}
				})
			})
		}

		//删除文件夹公共方法
		function delete_parentfolder_common(ajax_dict_yes,ajax_dict_no,ele,parentFolder){
			//点击删除弹出框提示内容
					if(ele){
						$(".delete_area_text h4").text('确定删除文件夹 "'+$(ele).parent().parent().find(".view_show_name_save").text()+'"  ?');
					}else{
						$(".delete_area_text h4").text('确定删除全部文件夹  ?');
					}
					$(".delete_area_input").find("img").remove();
					$(".delete_area_input").find(".deltete_input_wrap").css("display","block");
					$(".delete_checked p").text("同时删除文件夹和包含的所有内容").css("color","#808080").css("left","95px");
					$("#delete_area").css("display","block");
					$(".maskLayer").css("display","block");
					$("#delete_area_close img").on("click",function(){
					$("#delete_area").css("display","none");
					$(".maskLayer").css("display","none");
					})

					//确定删除按钮点击事件
					// console.log($(".deltete_input_wrap").find("label").css("backgroundColor"))

					$(".delete_area_ok_btn").unbind("click");
					$(".delete_area_ok_btn").on("click",function(){
						if($(".deltete_input_wrap").find("label").css("backgroundColor") == "rgb(13, 83, 164)"){
							$.post("/dashboard/deleteFolder",ajax_dict_yes,function(result){
								if(parentFolder != "all" && parentFolder != undefined){
									tempSaveDeleteView = [];
									tempSaveDeleteViewDict["onlyFolder"] = tempSaveDeleteViewDict["onlyFolder"] || [];
									statementsToView = true;
									$(parentFolder).find(".statement_li").each(function(index,ele){
										tempSaveDeleteView.push($(ele).find(".statement_li_content .view_show_name_save").text());
									})
									tempSaveDeleteViewDict["onlyFolder"] = tempSaveDeleteViewDict["onlyFolder"].concat(tempSaveDeleteView);
								}else{

									tempSaveDeleteView = [];
									tempSaveDeleteViewDict["all"] = tempSaveDeleteViewDict["all"] || [];
									statementsToView = true;
									tempSaveDeleteView.push("all");
									tempSaveDeleteViewDict["all"] = tempSaveDeleteViewDict["all"].concat(tempSaveDeleteView);
								}


								if(result != ""){
									if(sessionStorage.getItem("edit_view_now")){
										if(ele){
											if($(".cookie_handle_view").parent().hasClass("state_folder")){
											 sessionStorage.removeItem("edit_view_now");
										}
										}
									}

									if($(".cookie_handle_view").parent().hasClass("state_folder")){
										//删除记录视图位置信息的cookie
											if(loc_storage.getItem("view_location_data")){
												if(JSON.parse(loc_storage.getItem("view_location_data")).length == 1){
													loc_storage.removeItem("view_location_data");

												}else{
													var loc_session = JSON.parse(loc_storage.getItem("view_location_data"));
													loc_session.splice(index,1);
													loc_storage.setItem("view_location_data",JSON.stringify(loc_session));

												}

											}
											$(".gridster").html("");
											$(".gridster").append($("<ul></ul>"));
									}

									$("#statements_left_bar_area").html("");
									$("#delete_area").css("display","none");
									$(".maskLayer").css("display","none");
									toIfChangeSecond = true;
									view_out_handle_init(result);


								}
							});

						}else{

							$.post("/dashboard/deleteFolder",ajax_dict_no,function(result){

								if(result != ""){
									$("#statements_left_bar_area").html("");
									toIfChangeSecond = true;
									view_out_handle_init(result);
									$("#delete_area").css("display","none");
									$(".maskLayer").css("display","none");
								// 	if($("#dashboard_content #new_view ul .edit_list").length != 0){
								// 		for(var i = 0 ; i < )


								// 		for(viewKey in preClickView){
								// 			if(viewKey.split("-")[0] == now_folder_name){
								// 				tempSaveDeleteView.push(viewKey);
								// 				statementsToView = true;

								// 			}
								// 		}
								// }

								}
							});


						}
					})
		}

		//存储视图对应位置的idct
		var tablelist_location = {};

		//删除文件夹点击事件
		function delete_btn_handle(){
			$(".click_delete").unbind("click");
			$(".click_delete").each(function(index,ele){
				$(ele).on("click",function(){
					var ajax_dict_yes = {"datatype":"parentfolder","recursive":"yes","foldername":$(ele).parent().parent().find(".view_show_name_save").text(),"defaultparent":"default"};
					var ajax_dict_no = {"datatype":"parentfolder","recursive":"no","foldername":$(ele).parent().parent().find(".view_show_name_save").text(),"defaultparent":"default"};

					delete_parentfolder_common(ajax_dict_yes,ajax_dict_no,$(ele),$(ele).parents(".state_folder"));
				})
			})
		}

		//textarea使用
		function textAreaHandle(view_location,count,view_data_info){
						if(view_location != null){
							$(".new_view_content").eq(count).attr("data-col",view_data_info["data-col"]).attr("data-row",view_data_info["data-row"]);
						}
						var text = $(".table_view_textarea").get(0);
						autoTextarea(text,0,46);
		}


			//获取当前容器的图例
			 // gridster = $(".gridster ul").gridster().data('gridster');


			//动态创建每个视图
		function fun_add_view(view_type,right_view_show,viewshow_class,view_note,count,view_location,view_num_or,hide_show_if,saveTableName,toDrill,drillHandle,viewId){
				if(view_note == null){
					view_note = "";
				}

				 	 if(gridster != null){
				 	 	 gridster.destroy();
				 	 }
				 	  gridster = $(".gridster ul").gridster({        //通过jquery选择DOM实现gridster
		                  // widget_margins: [10,0],
		                 widget_selector:".new_view_content",
		                 widget_base_dimensions: [($(".view_folder_show_area").width()-120)/6,($("body").height())/6.5],
		                 autogenerate_stylesheet:true,
		                 avoid_overlapped_widgets:false,
		                 draggable: {
		                         handle: 'header',
		                         stop:function(event,ui){
		                         	//记录视图对应的位置信息
		                         	// loc_storage.setItem("view_location_data",JSON.stringify(gridster.serialize()));
		                         	//获取所有视图的位置大小信息
		                         	var gridster_view_location = gridster.serialize();

		                         	//遍历视图对应的id数组
		                         	for(var i = 0; i < viewshow_class_arr.length;i++){

		                         		if($(".view_show_handle").eq($("."+viewshow_class_arr[i]+"").parent().attr("data-value")).hasClass("table_hide_false")){
		                         			continue;
		                         		}

		                         		var view_str = String(view_show_id_arr[i-$(".table_hide_false").length]);
		                         		tablelist_location["a"+view_str] = JSON.stringify(gridster_view_location[i]);
		                         	}

		                         	$.post("/dashboard/setSwitch",{"switch":"status","tablelist":JSON.stringify(tablelist_location)},function(result){
		                         		if(result["status"] == "ok"){
		//                       			console.log("保存位置信息成功")
		                         		}
		                         	});
		                         }
		                 },
		                 resize:{
		                         	enabled:true,
		                         	min_size:[2,2],
		                         	resize:function(event,ui){

		                         		$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".textarea").css("width",$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").width()-18 + "px");
		                         		$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main").css("height",$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").height()-30 + "px");

		                         		if($(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main").hasClass("new_view_indexPage")){
		                         			$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_indexPage").find(".right_module").css("marginTop",($(".new_view_indexPage").parent().height()-30)/2 - 80 + "px");
		                         		}


		                         	},
		                         	stop:function(event,ui){
		                         	//获取所有视图的位置大小信息
		                         	var gridster_view_location = gridster.serialize();

		                         	//遍历视图对应的id数组
		                         	for(var i = 0; i < viewshow_class_arr.length;i++){

		                         		if($(".view_show_handle").eq($("."+viewshow_class_arr[i]+"").parent().attr("data-value")).hasClass("table_hide_false")){
		                         			continue;
		                         		}

		                         		var view_str = String(view_show_id_arr[i-$(".table_hide_false").length]);
		                         		tablelist_location["a"+view_str] = JSON.stringify(gridster_view_location[i]);
		                         	}

		                         	$.post("/dashboard/setSwitch",{"switch":"status","tablelist":JSON.stringify(tablelist_location)},function(result){
		                         		if(result["status"] == "ok"){
		//                       			console.log('保存位置信息成功')
		                         		}
		                         	});

		                         		$(".new_view_content").find(".textarea").eq(ui.$player.parent().attr("data-value")).css("width",$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").width()-18 + "px");
		                         		$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main").css("height",$(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").height()-30 + "px");
		                         				for(var i = 0; i < viewshow_class_arr.length;i++){
		                         					if(!$("."+viewshow_class_arr[i]+"").hasClass("new_view_table") && !$("."+viewshow_class_arr[i]+"").hasClass("new_view_indexPage") ){
		                         						var now_view_img=echarts.getInstanceByDom($("."+viewshow_class_arr[i]+"").get(0));
								 						now_view_img.resize();

		                         					}
		                         				}

		                         		if($(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main").hasClass("new_view_table") == false && $(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main").hasClass("new_view_indexPage") == false){

		                         			//判断视图区域过小隐藏小部件

		                         			elementContent($(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main"),null);

		                         			successShowView($(".new_view_content[data-value="+ui.$player.parent().attr("data-value")+"]").find(".new_view_main"));
		                         		}



		                         	},

		                         },

		                 }).data('gridster');
				  //视图对应的位置信息
				  var view_data_info = {};

				 //判断之前是否存在保存过的位置信息
				 if(view_location == null){
				 	if(view_type == "showTable_by_dragData()"){
				 		view_data_info["data-sizex"] =6;
				 	}else{
				 		view_data_info["data-sizex"] =3;
				 	}
				 	view_data_info["data-sizey"] = 3;
				 }else{
				 	view_data_info["data-col"] = view_location["col"];
				 	view_data_info["data-row"] = view_location["row"];
				 	view_data_info["data-sizex"] = view_location["size_x"];
				 	view_data_info["data-sizey"] = view_location["size_y"];
				 }
				if(view_type == "showTable_by_dragData()"){
						gridster.add_widget("<li class='new_view_content right_view_table' data-value="+count+"><header class='new_view_title'><div class='new_view_table_name'>"+right_view_show+"</div><div class='new_view_right_icon'><div class='new_view_hide add_css_img'><img src='../static/statements/img/hide.png' alt='show_or_hide' title='隐藏视图'></div><div class='new_view_tille_know add_css_img'><img src='../static/statements/img/title.png' alt='title' title='标题'></div><div class='new_view_edit add_css_img'><img src='../static/statements/img/edit.png' alt='edit' title='编辑'></div><div class='new_view_remarks add_css_img'><img src='../static/statements/img/remarks.png' alt='remarks' title='备注'></div><div class='new_view_delete add_css_img'><img src='../static/statements/img/delete1.png' alt='delete' title='删除视图'></div></div></header><div class='new_view_main new_view_table clear "+viewshow_class+" view_handle_count"+count+"'><div class='edit_table'><div class='right_module' style='display: inline-block;'> <div class='top_column_container' style='display: inline-block'><p class='top_column_name'></p><table class='column_data_list' cellspacing='0' cellpadding='0'><tbody></tbody></table></div><div class='content_body'><ul id='data_list_for_body'></ul></div></div><div class='left_row_container'><table cellspacing='0' cellpadding='0'><thead><tr></tr></thead><tbody></tbody></table></div></div></div></div><div class='textarea'><textarea class='table_view_textarea' placeholder='仅对次视图增加文案备注说明不做任何图表改变' maxlength='160'>"+view_note+"</textarea></div></li>", view_data_info["data-sizex"],view_data_info["data-sizey"]);
						textAreaHandle(view_location,count,view_data_info);
				}else if(view_type == "col_card()"){
						gridster.add_widget("<li class='new_view_content indexPage' data-value="+count+"><header class='new_view_title'><div class='new_view_table_name'>"+right_view_show+"</div><div class='new_view_right_icon'><div class='new_view_hide add_css_img'><img src='../static/statements/img/hide.png' alt='show_or_hide' title='隐藏视图'></div><div class='new_view_tille_know add_css_img'><img src='../static/statements/img/title.png' alt='title' title='标题'></div><div class='new_view_edit add_css_img'><img src='../static/statements/img/edit.png' alt='edit' title='编辑'></div><div class='new_view_remarks add_css_img'><img src='../static/statements/img/remarks.png' alt='remarks' title='备注'></div><div class='new_view_delete add_css_img'><img src='../static/statements/img/delete1.png' alt='delete' title='删除视图'></div></div></header><div class='new_view_main clear new_view_indexPage "+viewshow_class+" view_handle_count"+count+"'><div class='right_module'><div class='content_body'><ul class='session_data_list_for_body'></ul></div></div></div><div class='textarea'><textarea class='table_view_textarea' placeholder='仅对次视图增加文案备注说明不做任何图表改变' maxlength='60'>"+view_note+"</textarea></div></li>",view_data_info["data-sizex"],view_data_info["data-sizey"]);
						textAreaHandle(view_location,count,view_data_info);
						$(".new_view_content").find("."+viewshow_class+"").find(".right_module").css("marginTop",($("."+viewshow_class+"").parent().height()-30)/2 - 80 + "px");
				}else{
						gridster.add_widget("<li class='new_view_content'  data-value="+count+"><header class='new_view_title'><div class='new_view_table_name'>"+right_view_show+"</div><div class='new_view_right_icon'><div class='new_view_hide add_css_img'><img src='../static/statements/img/hide.png' alt='show_or_hide' title='隐藏视图'></div><div class='new_view_tille_know add_css_img'><img src='../static/statements/img/title.png' alt='title' title='标题'></div><div class='new_view_edit add_css_img'><img src='../static/statements/img/edit.png' alt='edit' title='编辑'></div><div class='new_view_remarks add_css_img'><img src='../static/statements/img/remarks.png' alt='remarks' title='备注'></div><div class='new_view_delete add_css_img'><img src='../static/statements/img/delete1.png' alt='delete' title='删除视图'></div></div></header><div class='new_view_main clear "+viewshow_class+" view_handle_count"+count+"'></div><div class='textarea'><textarea class='table_view_textarea' placeholder='仅对次视图增加文案备注说明不做任何图表改变' maxlength='60'>"+view_note+"</textarea></div></li>",view_data_info["data-sizex"],view_data_info["data-sizey"]);
						textAreaHandle(view_location,count,view_data_info);
				}

				if(saveTableName != undefined){
					 $(".new_view_content").eq(count).append($("<div class='saveTable_class'><h4>"+saveTableName+"</h4></div>"));
				}

				if(toDrill["saveDrillDownTemp"] != undefined){
					statementsAddClickFunction($(".new_view_content").eq(count),toDrill,drillHandle);
				}
				
				// if(!hide_show_if){
				// 	 $(".new_view_content").eq(count).css("display","none");
				// }
				$(".new_view_content").eq(count).attr("viewId",viewId);

				$(".new_view_content").find("."+viewshow_class+"").css("height",$("."+viewshow_class+"").parent().height()-30 + "px").data("view_num_or",view_num_or).css("top","30px");

				$("."+viewshow_class+"").parent().find(".textarea").css("width",$("."+viewshow_class+"").parent().width()-18 + "px");
				$(".new_view_content .new_view_right_icon .add_css_img").each(function(index,ele){
					$(ele).on("mouseenter",function(){
						$(ele).css("background","#DEDEDE");
					})

					$(ele).on("mouseleave",function(){
						$(ele).css("background","");
					})
				})

			}
		function view_change_click_mou(ele){
					if(!$(ele).hasClass("now_click_view") && $(ele).data("table_show") != "false"){
						cookie_view_each();
						$("#statements_left_bar_area .statement_li .view_show_content .view_show_handle").removeClass("now_click_view");
						$("#statements_left_bar_area .statement_li .view_show_content .view_show_handle").not($(".table_hide_false")).css("background","");
						$("#statements_left_bar_area .statement_li .view_show_content .view_show_handle").not($(ele)).not($(".table_hide_false")).find(".hide_or_show").css("display","none");
						$(".new_view_main").parent().css("border","none");
						$(ele).css("background","#F5F5F5").addClass("now_click_view");
						$(ele).unbind("mouseenter mouseleave");

						$(ele).on("mouseenter",function(){
						   if($(ele).data("table_show") != "false" && $(ele).parent().parent().hasClass("cookie_handle_view")){
								creat_thumbnail($(ele));
							}
				 		})

				 		$(ele).on("mouseleave",function(){
				 		   if($(ele).data("table_show") != "false" && $(ele).parent().parent().hasClass("cookie_handle_view")){
				 				$(".thumbnail_wrap").remove();
				 			}
				 		})

						$("."+$(ele).data("save_view_class")+"").parent().css("border","1px solid #0D53A4");
						if($("."+$(ele).data("save_view_class")+"").parent().length != 0){

							$(".view_folder_show_area").scrollTop($("."+$(ele).data("save_view_class")+"").parent().offset().top-144)
						}

					}else{
						if($(ele).find(".hide_or_show_wrap .hide_or_show").attr("src") == "../static/statements/img/hide.png"){
								$("."+$(ele).data("save_view_class")+"").parent().css("border","none");
								$(ele).css("background","").removeClass("now_click_view");
								// $(ele).find(".hide_or_show_wrap .hide_or_show").hide();
								cookie_view_each();
						}

					}
				}


		function cookie_view_each(){
					//小部件移入移出事件
				$("#statements_left_bar_area .statement_li .view_show_content .view_show_handle").each(function(index,ele){
					if($(ele).data("table_show") == "false"){
						$(ele).unbind("mouseenter mouseleave");
					}
					$(ele).unbind("mouseenter");
					$(ele).on("mouseenter",function(){
						$(ele).find(".hide_or_show").show();
						$(ele).css("background","#F5F5F5");
						if($(ele).parents(".statement_li").hasClass("cookie_handle_view")){
							creat_thumbnail($(ele));
						}
					})
					$(ele).unbind("mouseleave");
					$(ele).on("mouseleave",function(){
						$(ele).find(".hide_or_show").hide();
						$(ele).css("background","");
						if($(ele).parents(".statement_li").hasClass("cookie_handle_view")){
							$(".thumbnail_wrap").remove();
						}
					})


					})


				}



				//创建视图相对应的缩略图
		function creat_thumbnail(ele){
				var view_img_src= null;
				if($(ele).hasClass("view_handle_table") || $(ele).hasClass("view_handle_indexPage")){
					if($(ele).hasClass("view_handle_table")){
						var tempElement = $("."+$(ele).data("save_view_class")+"").children(".edit_table").clone(true);
						tempElement.css({
							"overFlow":"auto",
							"position":"absolute",
							"fontSize":"12px",
						});
						tempElement.find(".right_module").css("margin-left","90px").css("margin-top","37px");
					}else{
						var tempElement = $("."+$(ele).data("save_view_class")+"").clone(true);
						tempElement.css({
							"background":"white",
							"position":"absolute",
							"zIndex":"-3",
						});
					}

					$("body").append(tempElement);
					html2canvas(tempElement, {
				         onrendered: function (canvas) {

				                    view_img_src = canvas.toDataURL('image/jpeg');
				                    // console.log(view_img_src)
				                    // canvas.getContext("2d").drawImage(view_img_src,0,0,100,100);
				                    // view_aImg.src = view_img_src;
									var view_thumbnail = $("<div class='thumbnail_wrap'></div>");
									var view_aImg = $("<div class='thumbnail_img'></div>");
									view_aImg.css({
										background:"url("+view_img_src+") no-repeat center",
										backgroundSize:"cover",
									});
									view_thumbnail.append(view_aImg);
									view_thumbnail.appendTo(ele);
									//缩略图显示的宽高比
									// var thumbnail_width_hei = 200/($("."+$(ele).data("save_view_class")+"").width()/$("."+$(ele).data("save_view_class")+"").height());
									// view_thumbnail.find("img").css("height","140px").css("margin","30px 10px 0px 10px").width(180);
				                	tempElement.remove();
				                },
				        background: "#fff",
				    	});
					var view_aImg = new Image();


					}else{
						view_img_src = echarts.getInstanceByDom($("."+$(ele).data("save_view_class")+"").get(0)).getDataURL({pixelRatio:2,backgroundColor:'#fff',type:'jpeg'});
							var view_aImg = new Image();
							view_aImg.src = view_img_src;
							var view_thumbnail = $("<div class='thumbnail_wrap'></div>");
							view_thumbnail.css("background","white");
							view_thumbnail.append(view_aImg);
							view_thumbnail.appendTo(ele);
							//缩略图显示的宽高比
							var thumbnail_width_hei = 200/($("."+$(ele).data("save_view_class")+"").width()/$("."+$(ele).data("save_view_class")+"").height());
							view_thumbnail.find("img").height(thumbnail_width_hei).css("marginTop",(200-thumbnail_width_hei)/2 + "px");
					}



				}

		

		//根据报表显示其中的视图
		function reason_view_drag(data_result,now_click_ele,click_view_btn){
				if(saveViewShowArr[$(now_click_ele).text()] != undefined){
					saveViewShowArr[$(now_click_ele).text()] = saveViewShowArr[$(now_click_ele).text()] || [];
				}else{
					saveViewShowArr = saveViewShowArr || {};
					saveViewShowArr[$(now_click_ele).text()] = [];
					$("#pageStatementsModule .gridster").html("");
					$("#pageStatementsModule .gridster").append($("<ul></ul>"));
				}

				var view_true_show = [];
				var view_true_false = [];
				tablelist_location = {};
				view_show_id_arr = [];

				drag_row_column_data_arr = [];

				//每个视图对应的颜色
				currentColorGroupName_arr = [];

				//每个视图对应的小数点
				normalUnitValue_arr = [];

				//每个视图对应的值单位
				valueUnitValue_arr = [];

				drag_measureCalculateStyle_arr = [];

				//存取视图展示区域视图对应的id
				view_show_id_arr = [];

				statements_tonghuanbi_arr = [];

				saveDashboardPostData = [];
				//存取所有表格的信息
				var save_allTable = [];

				//存取所有指标卡信息
				var saveIndexPage = [];

				$("#statements_left_bar_area .statement_li .view_show_content .view_show_handle").removeClass("now_click_view");
				so_over = null;
				view_count_save = $("#pageStatementsModule .cookie_handle_view").attr("tableCount");
				//清空选择框
				$(".view_folder_select").html("");
				// $(".gridster").html("");
				// $(".gridster").append($("<ul></ul>"));

				var count = -1;

				var tableNum = -1;

				//当前报表的文件夹
				var now_view_folder;

				viewshow_class_arr =[];

				if(now_click_ele.parent().parent().parent().hasClass("state_folder")){
					now_view_folder = now_click_ele.parent().parent().parent().find(".state_folder_content").find(".view_show_name_save").text();
				}else{
					now_view_folder = "default";
				}

				if(now_view_folder != ""){
					//判断是否存在文件夹展示
				if(now_view_folder == "default"){
					$(".right_if_have_parentfolder").css("display","none");
					$(".right_folder_name_show_img").css("marginRight","5px");
					$(".right_folder_name_show_img").find("img").attr("src","../static/statements/img/form_icon.png");
				}else{

					$(".right_if_have_parentfolder").css("display","block");
					$(".right_folder_name_show_img").css("marginRight","10px");
					$(".right_folder_name_show_img").find("img").attr("src","../static/statements/img/file_icon.png");
					$(".right_if_have_parentfolder").find("span").html(now_view_folder);
				}

					// view_count = $(".statement_li").length;
					//创建文件夹下包含的报表展示
					for(view_in_folder in data_result[now_view_folder]){
						var select_opt = $("<option value="+view_in_folder+">"+view_in_folder+"</option>");
						select_opt.appendTo($(".view_folder_select"));
						if(view_in_folder == now_click_ele.text()){
							select_opt.attr("selected","selected");
						}

						if(data_result[now_view_folder][now_click_ele.text()] == data_result[now_view_folder][view_in_folder]){
							for(right_view_show in data_result[now_view_folder][view_in_folder]){
								tableNum++;
								var free_drag_row_column_data = {};

								if(data_result[now_view_folder][view_in_folder][right_view_show]["show"] == false){
									view_true_false.push(data_result[now_view_folder][view_in_folder][right_view_show]);
								}else{
									view_true_show.push(data_result[now_view_folder][view_in_folder][right_view_show]);
								}

								view_show_id_arr.push(data_result[now_view_folder][view_in_folder][right_view_show]["id"]);

								currentColorGroupName_arr.push(data_result[now_view_folder][view_in_folder][right_view_show]["viewstyle"].split("_YZY_")[0]);

								normalUnitValue_arr.push(data_result[now_view_folder][view_in_folder][right_view_show]["viewstyle"].split("_YZY_")[1]);

								valueUnitValue_arr.push(data_result[now_view_folder][view_in_folder][right_view_show]["viewstyle"].split("_YZY_")[2]);

								drag_measureCalculateStyle_arr.push(JSON.parse(data_result[now_view_folder][view_in_folder][right_view_show]["calculation"]));


								free_drag_row_column_data["row"] = JSON.parse(data_result[now_view_folder][view_in_folder][right_view_show]["row"]);

								free_drag_row_column_data["column"] = JSON.parse(data_result[now_view_folder][view_in_folder][right_view_show]["column"]);

								drag_row_column_data_arr.push(free_drag_row_column_data);

								statements_tonghuanbi_arr.push(data_result[now_view_folder][view_in_folder][right_view_show]["sequential"]);

								saveDashboardPostData.push(data_result[now_view_folder][view_in_folder][right_view_show]["handledatapost"]);

								if(data_result[now_view_folder][view_in_folder][right_view_show]["viewtype"] == "showTable_by_dragData()"){
									save_allTable.push("bbv"+view_count_save+"view_show_class" + tableNum);
								}else if(data_result[now_view_folder][view_in_folder][right_view_show]["viewtype"] == "col_card()"){
									saveIndexPage.push("bbv"+view_count_save+"view_show_class" + tableNum);
								}

							}
							var view_contact = view_true_show.concat(view_true_false);

							for(var i = 0; i < view_contact.length;i++){

								(function(i){

								var change_view_show_click = view_contact[i];

								count++;
								// if(!change_view_show_click["show"]){
								// 	continue;
								// }
								viewshow_class = "bbv"+view_count_save+"view_show_class" + count;

								viewshow_class_arr.push(viewshow_class);

								var view_session = change_view_show_click["status"];

								var out_into_view = $("."+viewshow_class+"").parent();

								// drag_row_column_data["row"] = JSON.parse(change_view_show_click["row"]);

								// drag_row_column_data["column"] = JSON.parse(change_view_show_click["column"]);

								statements_current_cube_name = change_view_show_click["tablename"];

								// customCalculate = JSON.parse(change_view_show_click["customcalculate"]);

								// state_view_show_type = change_view_show_click["viewtype"];

								// drag_measureCalculateStyle = JSON.parse(change_view_show_click["calculation"]);

								

								//颜色样式
								// currentColorGroupName = change_view_show_click["viewstyle"].split("_YZY_")[0];
								// //小数点
								// normalUnitValue = change_view_show_click["viewstyle"].split("_YZY_")[1];

								// //值单位
								// valueUnitValue = change_view_show_click["viewstyle"].split("_YZY_")[2];

								if($.inArray(change_view_show_click["id"],saveViewShowArr[$(now_click_ele).text()]) != -1){
									return;
								}


								//创建容器
								fun_add_view(change_view_show_click["viewtype"],now_click_ele.parent().parent().find(".small_view_text").eq(count).text(),viewshow_class,change_view_show_click["note"],count,JSON.parse(view_session),change_view_show_click["calculation"],change_view_show_click["show"],change_view_show_click["viewstyle"].split("_YZY_")[3],JSON.parse(change_view_show_click["drilldowndata"]),change_view_show_click["handledatapost"],change_view_show_click["id"]);
								view_handle_switch_statements(viewshow_class,change_view_show_click["show"],change_view_show_click["viewtype"],view_contact.length-1,save_allTable,saveIndexPage);
								saveViewShowArr[$(now_click_ele).text()].push(change_view_show_click['id']);
								})(i);

							}
						}

					}
					$(".view_folder_select").comboSelect();
					$(".right_folder_view_name").find(".combo-dropdown").find(".option-item").each(function(index,ele){
						$(ele).on("click",function(){
							if(!$(ele).hasClass("option-selected")){

								loc_storage.setItem("now_add_view",$(ele).text());
								saveViewShowArr = {};
								saveViewShowArr[$(ele).text()] = [];
								$(".gridster").html("");
								$(".gridster").append($("<ul></ul>"));
								toIfChangeSecond = true;
								view_out_handle_init(data_result);
							}
						})
					})


				}

				//获取点击视图的data记录class名
				var get_view_save_data = null;

				var get_view_save = null;

				view_drag_resize_handle();

				cookie_view_each();

				if(click_view_btn != undefined){
					if(click_view_btn.hasClass("small_view_text") || click_view_btn.hasClass("hide_or_show_wrap")){
						get_view_save_data = click_view_btn.parent().data("save_view_class");

						get_view_save = click_view_btn.parent();
					}

					if(click_view_btn.hasClass("hide_or_show")){
						get_view_save_data = click_view_btn.parent().parent().data("save_view_class");
						get_view_save = click_view_btn.parent().parent();
					}

					view_change_click_mou(get_view_save);
				}


				//视图header操作栏的显示和隐藏
				$(".view_folder_show_area >ul li .new_view_title").css("visibility","hidden");

				$(".view_folder_show_area >ul li").each(function(index,ele){
					$(ele).on("mouseenter",function(){
						$(ele).find(".new_view_title").css("visibility","visible");
					})

					$(ele).on("mouseleave",function(){
						$(ele).find(".new_view_title").css("visibility","hidden");
					})

				})


			}

		//修改视图名字更新仪表板内容
		function changNameToChangeDashboard(numArr,new_view_table_name_save,newName,handle){
		 		$(".edit_list span").each(function(index,eleList){
			 		if($(eleList).text() == $(".statement_li[tableCount="+numArr[0]+"]").find(".statement_li_content .view_show_name_save").eq(0).text() + "-"+ new_view_table_name_save){
			 			$(eleList).text($(".statement_li[tableCount="+numArr[0]+"]").find(".statement_li_content .view_show_name_save").eq(0).text() + "-" + newName);
			 			if(handle != undefined){
			 				$(eleList).parents(".edit_list").addClass("noDelete");
			 			}
			 			// $(eleList).parent().attr("title",$(".statement_li").eq(numArr[0]-1).find(".statement_li_content .view_show_name_save").text() + "-" + newName);
			 		}
		 		})
		}


		

		//视图展示部分功能事件
		function view_drag_resize_handle(){

					$(".new_view_right_icon").each(function(index,ele){
						//获取存储报表和视图下标的数组
						var show_table_arr;

						var new_view_table_name_save;
						//图表按钮点击显示隐藏
						$(ele).find(".new_view_hide").unbind("click");
						$(ele).find(".new_view_hide").on("click",function(){
							show_table_arr = $(ele).parent().parent().find(".new_view_main").attr("class").match(/\d+/g)
							click_or_show($(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle").eq(show_table_arr[1]));

						})
						//标题隐藏显示
						$(ele).find(".new_view_tille_know").unbind("click");
						$(ele).find(".new_view_tille_know").on("click",function(){
							$(ele).parent().find(".new_view_table_name").toggle();
						})
						//标题名点击事件修改名字
						$(ele).parent().find(".new_view_table_name").unbind("dblclick");
						$(ele).parent().find(".new_view_table_name").dblclick(function(){
							if($(this).find(".title_name_input").length > 0){
								return;
							}
							$(ele).parents(".new_view_content").unbind("mouseenter mouseleave");
							show_table_arr = $(ele).parent().parent().find(".new_view_main").attr("class").match(/\d+/g)
							$(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle").eq(show_table_arr[1]).removeAttr("tablename");
							new_view_table_name_save = $(ele).parent().find(".new_view_table_name").text();
							if($(ele).parent().find(".new_view_table_name").find("input").length == 0){
								var freeHandleEle = $("<input class='title_name_input' type='text' placeholder="+$(this).text()+"></input>");
								$(this).html("").append(freeHandleEle).css("textIndent","0");
								freeHandleEle.focus();
								freeHandleEle.on("input",function(){
									$(ele).parent().find(".new_view_table_name").css("borderColor","#DEDEDE");
								})
							}

						//点击确定修改名称
						$(ele).parent().find(".title_name_input").unbind("focusout");
						$(ele).parent().find(".title_name_input").on("focusout",function(){
							//判断输入值不为空
							if($(".title_name_input").val() == "" || $(".title_name_input").val() == new_view_table_name_save){
								$(ele).parent().find(".new_view_table_name").html(new_view_table_name_save).css("textIndent","3px").css("borderColor","#DEDEDE");
								return;
							}else{

							//更新服务器数据
							$.post("/dashboard/changeName",{"objtype":"view","oldname":$(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").data("table_id"),"newname":$(".title_name_input").val()},function(result){
								 	if(result["status"] == "ok"){
										if($(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle[tablename="+$(".title_name_input").val()+"]").length > 0){
											$(ele).parent().find(".new_view_table_name").css("borderColor","red").focus();
											return;
										}
								 		$(ele).parents(".new_view_content").on("mouseenter",function(){$(this).find(".new_view_title").css("visibility","visible")});
								 		$(ele).parents(".new_view_content").on("mouseleave",function(){$(this).find(".new_view_title").css("visibility","hidden")});
								 		//重新存入对应视图的名称
								 		var changeNameViewS = $(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle").eq(show_table_arr[1]).data("data_result_content").split(",");
								 		if(changeNameViewS.length == 6){
								 			changeNameViewS.push($(".title_name_input").val());
								 		}else{
								 			changeNameViewS[4] = $(".title_name_input").val();
								 		}
								 		if(preClickView[$(".statement_li[tableCount="+show_table_arr[0]+"]").find(".statement_li_content .view_show_name_save").eq(0).text() + "-"+ new_view_table_name_save] != undefined){
								 			preClickView[$(".statement_li[tableCount="+show_table_arr[0]+"]").find(".statement_li_content .view_show_name_save").eq(0).text() + "-"+ $(".title_name_input").val()] = preClickView[$(".statement_li[tableCount="+show_table_arr[0]+"]").find(".statement_li_content .view_show_name_save").eq(0).text() + "-"+ new_view_table_name_save];
								 			delete preClickView[$(".statement_li[tableCount="+show_table_arr[0]+"]").find(".statement_li_content .view_show_name_save").eq(0).text() + "-"+ new_view_table_name_save];
								 		}
								 		changNameToChangeDashboard(show_table_arr,new_view_table_name_save,$(".title_name_input").val());
								 		$(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle").eq(show_table_arr[1]).data("data_result_content",changeNameViewS.join(",")).attr("tablename",$(".title_name_input").val());
								 		$(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").html($(".title_name_input").val());
								 		$(ele).parent().find(".new_view_table_name").html($(".title_name_input").val()).css("textIndent","3px").css("borderColor","#DEDEDE").data("changeName","true");

								 	}else{
								 		$(ele).parent().find(".new_view_table_name").css("borderColor","red").focus();
								 	}
								});
							}
						})

						})
						//备注输入存储展示
						$(ele).find(".new_view_remarks").unbind("click");
						$(ele).find(".new_view_remarks").on("click",function(){
							show_table_arr = $(ele).parent().parent().find(".new_view_main").attr("class").match(/\d+/g)
							$(ele).parent().parent().find(".textarea").stop(true).toggle(500);
						})

						$(ele).parent().parent().find(".textarea textarea").blur(function(){
							if($(this).val() != ""){
								$.post("/dashboard/changeName",{"objtype":"note","note":$(this).val(),"id":$(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").data("table_id")},function(result){
		//							console.log(result)
								});
							}else{
								$(this).parent().stop(true).toggle(500);
							}
						})

						//视图的删除事件
						$(ele).find(".new_view_delete").unbind("click");
						$(ele).find(".new_view_delete").on("click",function(){
								// $(".delete_area_input").html("");
								
								//点击删除弹出框提示内容
								$(".delete_area_text h4").text('确定删除视图 "'+$(ele).parent().find(".new_view_table_name").text()+'"  ?');
								$(".delete_checked p").text("此视图删除后,数据将无法恢复").css("color","#808080").css("left","95px");
								$(".delete_area_input").find(".deltete_input_wrap").css("display","none");
								if($(".delete_area_input").find("img").length == 0){
									$(".delete_area_input").append("<img src='../static/statements/img/gt_03.png' alt='waring'>");
								}
								$(".delete_area_input").find("img").css("marginTop","3px");
								$("#delete_area").css("display","block");
								$(".maskLayer").css("display","block");
								$("#delete_area_close img").on("click",function(){
								$("#delete_area").css("display","none");
								$(".maskLayer").css("display","none");
									})

								//确定删除按钮点击事件
								$(".delete_area_ok_btn").unbind("click");
								$(".delete_area_ok_btn").on("click",function(){
									var show_table_arr_one = $(ele).parent().parent().find(".new_view_main").attr("class").match(/\d+/g);
									//服务器更新数据
									$.post("/dashboard/deleteFolder",{"datatype":"view","tableid":$(".statement_li[tableCount="+show_table_arr_one[0]+"]").find(".view_show_handle").eq(show_table_arr_one[1]).find(".small_view_text").data("table_id")},function(result){{
										if(result != ""){
											if($("#dashboard_content #new_view ul .edit_list").length > 0){
												tempSaveDeleteView = [];
												tempSaveDeleteViewDict["onlyFolder"] = tempSaveDeleteViewDict["onlyFolder"] || [];
												tempSaveDeleteView.push($(".statement_li[tableCount="+show_table_arr_one[0]+"]").find(".view_show_name_save").text()+"-"+$(".statement_li[tableCount="+show_table_arr_one[0]+"]").find(".view_show_handle").eq(show_table_arr_one[1]).find(".small_view_text").text());
												statementsToView = true;
												tempSaveDeleteViewDict["onlyFolder"] = tempSaveDeleteViewDict["onlyFolder"].concat(tempSaveDeleteView);
											}
											
											if(sessionStorage.getItem("edit_view_now")){
												if(sessionStorage.getItem("edit_view_now") == $(".statement_li[tableCount="+show_table_arr_one[0]+"]").find(".view_show_handle").eq(show_table_arr_one[1]).data("data_result_content")){
													 sessionStorage.removeItem("edit_view_now");
												}
											}

											gridster.remove_widget($(ele).parent().parent(),function(){
												view_show_id_arr.splice(show_table_arr_one[2],1);
												$(".statement_li[tableCount="+show_table_arr_one[0]+"]").find(".view_show_handle").eq(show_table_arr_one[1]).remove();
												$("#delete_area").css("display","none");
												$(".maskLayer").css("display","none");
												viewshow_class_arr = [];
												$("#right_folder_show_are .view_folder_show_area ul .new_view_content").each(function(index,ele){
													var freeViewChangeDataState = $(ele).find(".new_view_main").attr("class").match(/\d+/g);
													if($(ele).find(".edit_table").length > 0){
														$(ele).find(".new_view_main").removeClass().addClass("new_view_main clear new_view_table bbv"+show_table_arr_one[0]+"view_show_class"+index+" view_handle_count"+index+"");
														$(".statement_li[tableCount="+freeViewChangeDataState[0]+"]").find(".view_show_handle").eq(freeViewChangeDataState[1]-1).removeClass().addClass("view_show_handle clear view_handle_table");
													}else if($(ele).find(".cardInfo").length > 0){
														$(ele).find(".new_view_main").removeClass().addClass("new_view_main clear new_view_indexPage bbv"+show_table_arr_one[0]+"view_show_class"+index+" view_handle_count"+index+"");
														$(".statement_li[tableCount="+freeViewChangeDataState[0]+"]").find(".view_show_handle").eq(freeViewChangeDataState[1]-1).removeClass().addClass("view_show_handle clear view_handle_indexPage");
													}else{
														$(ele).find(".new_view_main").removeClass().addClass("new_view_main clear bbv"+show_table_arr_one[0]+"view_show_class"+index+" view_handle_count"+index+"");
														$(".statement_li[tableCount="+freeViewChangeDataState[0]+"]").find(".view_show_handle").eq(freeViewChangeDataState[1]-1).removeClass().addClass("view_show_handle clear");
													}
													viewshow_class_arr.push("bbv" + show_table_arr_one[0]+"view_show_class"+index);
													$(ele).attr("data-value",index);
													if($(ele).find(".new_view_table_name").attr("changeName") == undefined && $(ele).find(".new_view_table_name").attr("changeName") != "true"){
														var preTextState = JSON.parse(JSON.stringify($(ele).find(".new_view_table_name").text()));
														$(ele).find(".new_view_table_name").text("视图"+(index+1));
														
														var freeChangeNameHave = JSON.parse(JSON.stringify($(".statement_li[tableCount="+freeViewChangeDataState[0]+"]").find(".view_show_handle").eq(freeViewChangeDataState[1]-1).find(".small_view_text").text()));
														$(".statement_li[tableCount="+freeViewChangeDataState[0]+"]").find(".view_show_handle").eq(freeViewChangeDataState[1]-1).find(".small_view_text").text("视图"+(index+1));
														$(".statement_li[tableCount="+freeViewChangeDataState[0]+"]").find(".view_show_handle").eq(freeViewChangeDataState[1]-1).data("save_view_class","view_handle_count"+index);
														$(".statement_li[tableCount="+freeViewChangeDataState[0]+"]").find(".view_show_handle").eq(freeViewChangeDataState[1]-1).data("data_result_content",$(".statement_li[tableCount="+freeViewChangeDataState[0]+"]").find(".view_show_handle").eq(freeViewChangeDataState[1]-1).data("data_result_content").replace(preTextState,"视图"+(index+1)));
														changNameToChangeDashboard(freeViewChangeDataState,freeChangeNameHave,"视图"+(index+1),"noDelete");
													}
												})


												cookie_view_each();

											});


											// console.log(gridster,view_show_id_arr)
											
											// setTimeout(function(){

											// 	var delete_view_location = gridster.serialize();
											// 	var delete_view_save_dict = [];
											// 	for(var i = 0 ; i < view_show_id_arr.length;i++){
											// 		var delete_view_id = String(view_show_id_arr[i]);
											// 		delete_view_save_dict["a"+delete_view_id] = JSON.stringify(delete_view_location[i]);
											// 	}

											// 	 $.post("../dashboard/setSwitch",{"switch":"status","tablelist":JSON.stringify(delete_view_save_dict)},function(result){
				       //                     			 if(result["status"] == "ok"){
				       //                         			 console.log("保存位置信息成功")
				       //                     			 }
				       //                			  });
											// },1000)


										}
									}})
								})
							})

						//视图编辑功能
						$(ele).find(".new_view_edit").unbind("click");
						$(ele).find(".new_view_edit").on("click",function(){
							show_table_arr = $(ele).parent().parent().find(".new_view_main").attr("class").match(/\d+/g);
							// console.log(preClickView[$(".statement_li").eq(show_table_arr[0]-1).find(".view_show_name_save").text()+"-"+$(".statement_li").eq(show_table_arr[0]-1).find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").text()])
							if($(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").data("setopen") == false){
								$.post("/dashboard/setSwitch",{"switch":"isopen","id":$(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").data("table_id")},function(result){
									if(result["status"] == "ok"){
										$(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").data("setopen",true);
									}
								});
							}

							var tempSaveViewEdit = $(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle").eq(show_table_arr[1]).data("data_result_content");
							sessionStorage.setItem("edit_view_now",tempSaveViewEdit+","+String(show_table_arr[0])+","+String(show_table_arr[1])+","+$(".statement_li[tableCount="+show_table_arr[0]+"]").find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").data("table_id"));
							$(".main .rightConent #pageDashboardModule").data("isFirstInto",true);
							isDisaed = false;
							if_or_load = false;
							saveAddNewFile = true;
							saveScameView = true;
							// statementsToView = false;
							$("#project_style .module_style .color_control .otherColorsModule").data("openOrColse","close");
							// $("#dashboard_content #new_view ul .edit_list").remove();
							changePageTo_navDashBoardView(); 
						})

						// document点击关闭输入框
					// $(document).on("click",function(e){
					// 	if($(ele).parent().find(".title_name_input").length != 0){
					// 		if(!$(e.target).is($(ele).parent().find(".title_name_input")) && !$(e.target).is($(ele).parent().find(".title_name_change_btn")) && !$(e.target).is($(ele).parent().find(".new_view_table_name"))){
					// 			$(ele).parent().find(".new_view_table_name").html(new_view_table_name_save).css("textIndent","3px").css("borderColor","#DEDEDE");
					// 			$(".title_name_change_btn").remove();
					// 		}
					// 	}
					// 	})
					})
			}

		// view_drag_end-------

		//用户操作过程中修改cookie对应的报表
		function user_handle_change_cookie(ele,click_view_btn){
				$(".right_folder_name_show").css("display","block");
				$(".click_out_handle").css("display","block");
				//请求所有数据集合
				$.post("/dashboard/getAllData",function(data_result){
					if(data_result != ""){
						$(".statement_li").removeClass("cookie_handle_view");
						$(".statement_li").find(".view_show_name_save").css("color","");
						$(".statement_li .view_fun_content").data("if_click","");
						// $(".statement_li").find(".view_show_content").not($(ele).parent().parent().find(".view_show_content")).hide("blind",200);
						$(ele).parents(".statement_li").addClass("cookie_handle_view");
						$(ele).data("if_click","true");
						if($(ele).parent().parent().find(".view_show_content").css("display") == "none"){
							$(ele).parent().parent().find(".view_show_content").show("blind",200);
							$(ele).parent().parent().find(".statement_li_content .click_tra_statement").attr("src","../static/statements/img/left_35.png");
						}

						// $(".statement_li .statement_li_content .click_tra_statement").not($(ele).parent().parent().find(".statement_li_content .click_tra_statement")).attr("src","../static/statements/img/left_40.png");

						loc_storage.setItem("now_add_view",$(ele).text());
						saveViewShowArr = {};
						saveViewShowArr[$(ele).text()] = [];
						$(".gridster").html("");
						$(".gridster").append($("<ul></ul>"));
						reason_view_drag(data_result,$(ele),click_view_btn);
						small_view_click_hide();
					}
				})

		}

			//视图单击切换显示
		function click_view_change_view(){
				$(".view_fun_content").not($(".cookie_handle_view .view_fun_content")).data("if_click","");
				$(".rightConent #statements_left_bar #statements_left_bar_area").unbind("click");
				$(".rightConent #statements_left_bar #statements_left_bar_area").on("click",function(e){
						if($(e.target).hasClass("view_fun_content") && $(e.target).data("if_click") == ""){
							user_handle_change_cookie($(e.target));
							$(".view_fun_content").data("if_click","");
							$(e.target).data("if_click","true");
						}

						if(($(e.target).parent().hasClass("view_show_handle") && $(e.target).parent().parent().parent().find(".view_fun_content").data("if_click") == "")){
							user_handle_change_cookie($(e.target).parent().parent().parent().find(".view_fun_content"),$(e.target));
							$(".view_fun_content").data("if_click","");
							$(e.target).parent().parent().parent().find(".view_fun_content").data("if_click","true");

						}

						if(($(e.target).parent().parent().hasClass("view_show_handle") && $(e.target).parent().parent().parent().parent().find(".view_fun_content").data("if_click") == "")){
							user_handle_change_cookie($(e.target).parent().parent().parent().parent().find(".view_fun_content"),$(e.target));
							$(".view_fun_content").data("if_click","");
							$(e.target).parent().parent().parent().parent().find(".view_fun_content").data("if_click","true");
							// view_change_click_mou($(e.target).parent().parent().parent().parent());
						}

						if($(e.target).parent().hasClass("view_show_handle")){
							//获取当前点击事件触发的父元素
							var view_click_to_ele = null;
							if($(e.target).parent().hasClass("view_show_handle")){view_click_to_ele = $(e.target).parent();view_change_click_mou(view_click_to_ele)};
							//if($(e.target).parent().parent().hasClass("view_show_handle")){view_click_to_ele = $(e.target).parent().parent();view_change_click_mou(view_click_to_ele)};


						}
				})
			}
			//调用重命名方法
		function handle_change_result(content_ele,img_type,img_src){

				$("."+content_ele+"").each(function(index,ele){
				$(ele).find(".view_show_name_save").unbind("dblclick");
				$(ele).find(".view_show_name_save").dblclick(function(){
					//记录之前的名字
					pre_changeName = $(ele).find(".view_show_name_save").text();
					change_name_btn(pre_changeName,$(ele),"view_show_name_save",index);

				//保存重命名
				$(ele).find(".view_show_name_save").find(".click_new_folder_input").unbind("focusout");
				$(ele).find(".view_show_name_save").find(".click_new_folder_input").focusout(function(){
					double_click_change_name($(ele),"view_show_name_save",img_type,img_src);
					more_handle_click();
					delete_btn_handle();
					// $("#new_state_wrap").remove();

				})


				})

				})

			}
			//重命名点击
		function change_name_btn(pre_changeName,ele,sonName,index){
					// change_if_name = false;
					if($(".click_new_folder_input").length != 0){
						$(".click_new_folder_input").css("borderColor","red");
						return;
					}
					if($(ele).find(".click_tra_floder").length != 0){
						$(ele).find(".click_tra_floder").css("display","none");
					}
					if($(ele).find(".click_tra_statement").length != 0){
						$(ele).find(".click_tra_statement").css("display","none");
					}
					save_old_name_view = $(ele).find("."+sonName+"").text();
					$(ele).find("."+sonName+"").data("save_text_over",save_old_name_view).html("");
					$(ele).find("."+sonName+"").append($("<input type='text' class='click_new_folder_input' placeholder='请输入...'  onfocus='javascript:this.select()' maxlength='10'>"));

					if($(ele).parent().parent().hasClass("state_folder")){
						$(".click_new_folder_input").css("width","120px");
					}else{
						$(".click_new_folder_input").css("width","137px");
					}
					$(".click_new_folder_input").val(pre_changeName).focus();
					$(ele).find(".view_show_img_content").find("img").hide();

					$(ele).unbind("mouseenter mouseleave");
			}

		//修改视图对应存储的数据
		function changeViewItem(parents,type,newName){
			$(parents).find(".view_show_handle").each(function(index,ele){
				var newFolderItem = $(ele).data("data_result_content").split(",");
				if(type == "folder"){
					$(".edit_list span").each(function(index,eleList){
				 		if($(eleList).text() == newFolderItem[1] + "-"+ $(ele).children(".small_view_text").text()){
				 			$(eleList).text(newName + "-"+ $(ele).children(".small_view_text").text());
				 			$(eleList).parent().attr("title",newName + "-"+ $(ele).children(".small_view_text").text());
				 		}
				 	})

					preClickView[newName + "-"+ $(ele).children(".small_view_text").text()] = preClickView[newFolderItem[1] + "-"+ $(ele).children(".small_view_text").text()];

					delete preClickView[newFolderItem[1] + "-"+ $(ele).children(".small_view_text").text()];
				 	newFolderItem[1] = newName;
				 	$(ele).data("data_result_content",newFolderItem.join(","));
				}else{
					newFolderItem[0] = newName;
					$(ele).data("data_result_content",newFolderItem.join(","));
				}

			})
		}

		//重命名双击btn
		function double_click_change_name(ele,sonName,img_type,img_src){
							//保存重命名
							// change_if_name = false;
							var input_value = $(ele).find(".click_new_folder_input").val();
							;
							if($(ele).hasClass("statement_li_content")){
								folder_or_view ="folder";
							}else if($(ele).hasClass("state_folder_content")){
								folder_or_view = "parentfolder";
							}

							var old_name = $(ele).find(".view_show_name_save").data("record_name");

							//判断不能为空
							if(input_value == "" || input_value == save_old_name_view){
								var changeNameText = save_old_name_view;
								over_handle();
							 	more_handle_click();
								delete_btn_handle();
								return;
							}else{
								var changeNameText = input_value;
							}
							//修改名称向服务器发送请求

							 $.post("/dashboard/changeName",{"objtype":folder_or_view,"oldname":old_name,"newname":changeNameText},function(result){

							 	if(result["status"] == "false"){
							 		// console.log("修改失败");
							 		return;
							 	}else{
							 		$(ele).find(".view_show_name_save").text(changeNameText);
							 		if(folder_or_view == "folder"){
							 			loc_storage.setItem("now_add_view",changeNameText);
							 			changeViewItem($(ele).parent(),"folder",changeNameText)
							 			menu_folder_name_arr[$.inArray(old_name,menu_folder_name_arr)] = changeNameText;
							 			$(ele).find(".view_show_name_save").data("record_name",changeNameText).data("save_text_over",changeNameText);
							 			over_handle();
							 			//判断是否重绘图形
							 			if($(ele).parent().hasClass("cookie_handle_view")){
							 				if(old_name == $("#pageStatementsModule .combo-select .view_folder_select option[value="+old_name+"]").text()){
							 					$("#pageStatementsModule .combo-select .view_folder_select option[value="+old_name+"]").html(changeNameText).attr("value",changeNameText);
							 					$(".view_folder_select").comboSelect();
							 					$(".right_folder_view_name").find(".combo-dropdown").find(".option-item").each(function(index,ele){
													$(ele).on("click",function(){
													if(!$(ele).hasClass("option-selected")){
													loc_storage.setItem("now_add_view",$(ele).text());
													toIfChangeSecond = true;
													view_out_handle_init(result);
													}
												})
											})
							 				}

							 			}else{
							 				reason_view_drag(result,$(ele).find(".view_fun_content"));
							 			}

							 			more_handle_click();
							 		}else{
							 			folder_name_arr[$.inArray(old_name,folder_name_arr)] = changeNameText;
							 			changeViewItem($(ele).parent(),"parentfolder",changeNameText);
							 			$(ele).find(".view_show_name_save").data("record_name",changeNameText).data("save_text_over",changeNameText);
							 			over_handle();
							 			delete_btn_handle();

							 			if($(".right_if_have_parentfolder span").text() == old_name){
							 				$(".right_if_have_parentfolder span").html(changeNameText);
							 			}

							 		}



							 	}
							 });

						function over_handle(){
							$(ele).find(".click_new_folder_input").remove();
							$(ele).find("."+sonName+"").html(changeNameText).data("record_name",changeNameText);
							// $(ele).find(".view_show_img_content").find("img").unbind("click").removeClass().attr("src","../static/statements/img/"+img_src+".png").addClass(img_type).show();


							if($(ele).parent().parent().attr("class") != "state_folder" && $(ele).find(".click_tra_statement").length == 0 && $(ele).find(".click_tra_floder").length == 0){
								$(ele).find(".view_show_name_save").css("width","137px");
							}

							if($(ele).find(".click_tra_statement").length != 0){
								$(ele).find(".click_tra_statement").css("display","block");
							}

							if($(ele).find(".click_tra_floder").length != 0){
								$(ele).find(".click_tra_floder").css("display","block");
							}


							$(".view_show_name_save").each(function(index,ele){
								if($(ele).parent().parent().hasClass("state_folder") || $(ele).parent().parent().parent().hasClass("state_folder")){
										$(ele).css("width","103px");
									}else{
										$(ele).css("width","120px");
									}
								})
							ele_each($(ele),$("."+img_type+""));
						}
			}


		//拖拽到文件夹存储的信息改变
		function dragTableToFolderFunction(newFolder,oldView){
			var nowShowViewData = sessionStorage.getItem("edit_view_now");
			if(nowShowViewData != undefined){
				if(oldView == nowShowViewData.split(",")[1]+"-"+nowShowViewData.split(",")[2]){
					var freeSession = nowShowViewData.split(",");
					freeSession[0] = newFolder;
					sessionStorage.setItem("edit_view_now",freeSession.join());
				}
			}

			$("#dashboard_content #new_view ul .edit_list").each(function(index,ele){
				if($(ele).attr("title") == oldView){
					var freeDataChangeSe = $(ele).data("edit_view").split(",");
					freeDataChangeSe[0] = newFolder;
					$(ele).data("edit_view",freeDataChangeSe.join());
				}
			})
		}

			//创建报表显示li的工厂函数
		function statements_li_add(data_result,dropTo){
				statementListCount = 0;
				//存放所有的文件夹名字
				folder_name_arr = [];
				//存放所有的报表的名字
				menu_folder_name_arr =[];
				//获取存在cookie中操作报表的名称
				var cookie_view_name = loc_storage.getItem("now_add_view");
				$(".rightConent #statements_left_bar_area").html("");
				// $(".rightConent #right_folder_show_are").html("");
				var save_view_class_name = -1;
				for(erv_data in data_result){
					//存放所有存在的文件夹的名字
					folder_name_arr.push(erv_data);

					if(erv_data != "default"){
							    var folder = $("<div class='state_folder'><div class='state_folder_content'><img src=../static/statements/img/folder.png  class='click_folder'/><div class='view_show_name_save'>"+erv_data+"</div><div class='view_show_img_content'><img src=../static/statements/img/delete1.png  class='click_delete'/></div></div></div>");
								folder.prependTo($("#statements_left_bar_area"));
								folder.find(".state_folder_content").find(".view_show_name_save").data("record_name",erv_data);
								folder.find(".view_show_name_save").css("width","103px");
								if(Object.getOwnPropertyNames(data_result[erv_data]).length != 0){
									folder.find(".click_tra_floder").css("display","block");
									folder.find(".state_folder_content").find(".view_show_name_save").css("width","120px");
									for(small_view_show in data_result[erv_data]){
										//保存视图按顺序调整好后的位置
										var save_sum_li_arr = [];
										//保存视图的名称
										var view_show_sa = [];
										//status存在数据时存放的数组
										var statement_li_save_true = [];
										//status不存在数据时时存放的数组
										var statement_li_save_false = [];

										var view_show_sa_true = [];

										var view_show_sa_false = [];
																//存放所有的报表名字
										menu_folder_name_arr.push(small_view_show);
										save_view_class_name = -1;
										statementListCount++;
										var oDiv = $("<div class='statement_li folder_in_view clear' tableCount="+statementListCount+"><div class='statement_li_content'><img src=../static/statements/img/form_icon.png  class='view_show_icon'><div class='view_show_name_save view_fun_content'>"+small_view_show+"</div><div class='view_show_img_content'><img src=../static/statements/img//more.png class='click_more'/></div></div><div class='view_show_content'></div></div>");
										//根据cookie找到对应的报表
										if(small_view_show == cookie_view_name){
											$(".statement_li").removeClass("cookie_handle_view");
											$(".statement_li").find(".view_show_name_save").css("color","");
											oDiv.addClass("cookie_handle_view");
											oDiv.find(".view_fun_content").data("if_click","true");
											folder.addClass("have_view_content");
										}
										oDiv.appendTo(folder);
										oDiv.find(".view_fun_content").data("record_name",small_view_show);
										oDiv.find(".view_fun_content").parent().parent().addClass("floder_view_wrap");
										$(".state_folder_content").find(".click_tra_floder").remove();
										$("<img src=../static/statements/img/left_35.png  class='click_tra click_tra_floder'/>").prependTo($(".state_folder_content"));

									if(Object.getOwnPropertyNames(data_result[erv_data][small_view_show]).length != 0){
										oDiv.find("click_tra").css("display","block");
										oDiv.find(".view_show_name_save").css("width","103px");
										for(view_show in data_result[erv_data][small_view_show]){
											if(data_result[erv_data][small_view_show][view_show]["show"] == false){
												statement_li_save_false.push(data_result[erv_data][small_view_show][view_show]);
												view_show_sa_false.push(view_show);
											}else{
												statement_li_save_true.push(data_result[erv_data][small_view_show][view_show]);
												view_show_sa_true.push(view_show);
											}

										}

										save_sum_li_arr = statement_li_save_true.concat(statement_li_save_false);
										view_show_sa = view_show_sa_true.concat(view_show_sa_false);

										for(var i = 0; i < save_sum_li_arr.length;i++){
											save_view_class_name++;
											(function(i){
											//判断是否有修改过的名字 而不使用默认的展现形式
											if(save_sum_li_arr[i]["viewname"] != null){

												small_view_show_text = save_sum_li_arr[i]["viewname"];
											}else{

												small_view_show_text = view_show_sa[i];
											}

											var view_handle = $("<div class='view_show_handle clear'><div class='small_view_text'>"+small_view_show_text+"</div><div class='hide_or_show_wrap'><img src=../static/statements/img/hide.png class='hide_or_show'></div><input class='view_show_handle_input' type='text'></div>");
											if(!save_sum_li_arr[i]["show"]){
												view_handle.find(".hide_or_show").attr("src","../static/statements/img/show.png");
												view_handle.css("background","#F5F5F5").css("opacity","0.5").data("table_show","false");
												view_handle.find(".hide_or_show_wrap img").css("display","block");
												table_show_hide = false;
											}
											oDiv.find(".statement_li_content").find(".click_tra_statement").remove();

											// 判断是否是table
											if(save_sum_li_arr[i]["viewtype"] == "showTable_by_dragData()"){
												view_handle.addClass("view_handle_table");
											}else if(save_sum_li_arr[i]["viewtype"] == "col_card()"){
												view_handle.addClass("view_handle_indexPage");
											}

											view_handle.find(".small_view_text").css("width",$(".view_show_content").width() * 0.91 - 23 + "px").data("table_id",save_sum_li_arr[i]["id"]).data("setopen",save_sum_li_arr[i]["isopen"]);
											view_handle.data("data_result_content",erv_data+","+small_view_show+","+view_show_sa[i]+","+save_sum_li_arr[i]["tablename"]).appendTo(oDiv.find(".view_show_content")).data("save_view_class","view_handle_count"+save_view_class_name+"").attr("viewId",save_sum_li_arr[i]["id"]).attr("tableName",small_view_show_text);
											if(dropTo != undefined){
												dragTableToFolderFunction(erv_data,small_view_show+"-"+view_show_sa[i]);
											}
											
											$("<img src=../static/statements/img/left_35.png  class='click_tra click_tra_statement'/>").prependTo(oDiv.find(".statement_li_content"));
											oDiv.find(".view_show_name_save").css("width","103px");
											})(i);
										}

									}else{
										oDiv.find("click_tra").css("display","none");
										oDiv.find(".view_show_name_save").css("width","120px");
									}

								  }
								}else{
									folder.find(".click_tra_floder").css("display","none");
									folder.find(".state_folder_content").find(".view_show_name_save").css("width","137px");
								}

					}else{
						if(Object.getOwnPropertyNames(data_result[erv_data]).length != 0){
							for(small_view_show in data_result[erv_data]){
								//保存视图按顺序调整好后的位置
								var save_sum_li_arr = [];
								//保存视图的名称
								var view_show_sa = [];
								//status存在数据时存放的数组
								var statement_li_save_true = [];
								//status不存在数据时时存放的数组
								var statement_li_save_false = [];

								var view_show_sa_true = [];

								var view_show_sa_false = [];
								//存放所有的报表名字
								menu_folder_name_arr.push(small_view_show);

								save_view_class_name = -1;
								statementListCount++;
								var oDiv = $("<div class='statement_li clear' tableCount="+statementListCount+"><div class='statement_li_content'><img src=../static/statements/img/form_icon.png  class='view_show_icon'><div class='view_show_name_save view_fun_content'>"+small_view_show+"</div><div class='view_show_img_content'><img src=../static/statements/img//more.png class='click_more'/></div></div><div class='view_show_content'></div></div>");
								//根据cookie找到对应的报表
								if(small_view_show == cookie_view_name){
									$(".statement_li").removeClass("cookie_handle_view");
									$(".statement_li").find(".view_show_name_save").css("color","");
									oDiv.addClass("cookie_handle_view");
									oDiv.find(".view_fun_content").data("if_click","true");
								}

								oDiv.find(".view_fun_content").data("record_name",small_view_show);

								oDiv.appendTo($("#statements_left_bar_area"));
								if(Object.getOwnPropertyNames(data_result[erv_data][small_view_show]).length != 0){
										oDiv.find("click_tra").css("display","block");
										oDiv.find(".view_show_name_save").css("width","120px");
										for(view_show in data_result[erv_data][small_view_show]){
											if(data_result[erv_data][small_view_show][view_show]["show"] == false){
												statement_li_save_false.push(data_result[erv_data][small_view_show][view_show]);
												view_show_sa_false.push(view_show);
											}else{
												statement_li_save_true.push(data_result[erv_data][small_view_show][view_show]);
												view_show_sa_true.push(view_show);
											}

										}

										save_sum_li_arr = statement_li_save_true.concat(statement_li_save_false);
										view_show_sa = view_show_sa_true.concat(view_show_sa_false);

									 for(var i = 0; i < save_sum_li_arr.length;i++){
									 		save_view_class_name++;
											(function(index){
											//判断是否有修改过的名字 而不使用默认的展现形式
											if(save_sum_li_arr[index]["viewname"] != null){

												small_view_show_text = save_sum_li_arr[index]["viewname"];
											}else{

												small_view_show_text = view_show_sa[i];
											}

											var view_handle = $("<div class='view_show_handle clear'><div class='small_view_text'>"+small_view_show_text+"</div><div class='hide_or_show_wrap'><img src=../static/statements/img/hide.png class='hide_or_show'></div><input class='view_show_handle_input' type='text'></div>");
											if(!save_sum_li_arr[index]["show"]){
												view_handle.find(".hide_or_show").attr("src","../static/statements/img/show.png");
												view_handle.css("background","#F5F5F5").css("opacity","0.5").data("table_show","false");
												view_handle.find(".hide_or_show_wrap img").css("display","block");
												table_show_hide = false;
											}
											oDiv.find(".statement_li_content").find(".click_tra_statement").remove();

											// 判断是否是table
											if(save_sum_li_arr[index]["viewtype"] == "showTable_by_dragData()"){
												view_handle.addClass("view_handle_table");
											}else if(save_sum_li_arr[i]["viewtype"] == "col_card()"){
												view_handle.addClass("view_handle_indexPage");
											}

											view_handle.find(".small_view_text").css("width",$(".view_show_content").width()*0.91 - 23 + "px").data("table_id",save_sum_li_arr[index]["id"]).data("setopen",save_sum_li_arr[index]["isopen"]);
											view_handle.data("data_result_content",erv_data+","+small_view_show+","+view_show_sa[index]+","+save_sum_li_arr[index]["tablename"]).appendTo(oDiv.find(".view_show_content")).data("save_view_class","view_handle_count"+save_view_class_name+"").attr("viewId",save_sum_li_arr[i]["id"]).attr("tableName",small_view_show_text);
											if(dropTo != undefined){
												dragTableToFolderFunction(erv_data,small_view_show+"-"+view_show_sa[index]);
											}
											$("<img src=../static/statements/img/left_35.png  class='click_tra click_tra_statement'/>").prependTo(oDiv.find(".statement_li_content"));
											// oDiv.find(".view_show_name_save").css("width","103px");
											})(i)
										}

									}else{
										oDiv.find("click_tra").css("display","none");
										oDiv.find(".view_show_name_save").css("width","137px");
									}

							}
						}

					}

				}



				if(table_show_hide == false){
					$(".view_show_handle").unbind("mouseenter mouseleave");
				}
				//报表的移入移出事件
				ele_each($(".statement_li_content"),$(".click_more"));

				//文件夹的移入移出事件
				ele_each($(".state_folder_content"),$(".click_delete"));

			//点击收起放下
			//文件夹
			$(".click_tra_floder").each(function(index,ele){
				$(ele).on("click",function(){
					$(ele).parent().parent().find(".statement_li").toggle("blind",200,function(){
						if($(ele).parent().parent().find(".statement_li").css("display") == "none"){
						$(ele).attr("src","../static/statements/img/left_40.png");
						}else{
						$(ele).attr("src","../static/statements/img/left_35.png");
						}
					});

				})
			})

			//报表
			$(".click_tra_statement").each(function(index,ele){
				$(ele).on("click",function(){
					$(ele).parent().parent().find(".view_show_content").toggle("blind",200,function(){
						if($(ele).parent().parent().find(".view_show_content").css("display") == "none"){
						$(ele).attr("src","../static/statements/img/left_40.png");
						}else{
						$(ele).attr("src","../static/statements/img/left_35.png");
						}
					});


				})
			})

			$(".state_folder").each(function(index,ele){
				if($(ele).find(".statement_li").length == 0){
					$(ele).find(".click_tra_floder").remove();
				}
			})

			if($(".cookie_handle_view").length == 0 && $("#pageStatementsModule .statement_li").length > 0){
				 $("#pageStatementsModule .statement_li[tableCount=1]").addClass("cookie_handle_view");
				 loc_storage.setItem("now_add_view",$("#pageStatementsModule .statement_li[tableCount=1]").find(".statement_li_content .view_show_name_save").text());
			}
			if($(".cookie_handle_view").length != 0){
				$(".right_folder_name_show").css("display","block");
				$(".click_out_handle").css("display","block");
				if($(".view_show_handle").length == 0 && (dropTo || dropTo == undefined)){
					reason_view_drag(data_result,$(".cookie_handle_view").find(".view_show_name_save"));
					return;
				}
				if(dropTo || dropTo == undefined){
					reason_view_drag(data_result,$(".cookie_handle_view").find(".view_show_name_save"));
				}

				// table_name_post(data_result);
			}else{
				$(".right_folder_name_show").css("display","none");
				$(".click_out_handle").css("display","none");

			}


			if(table_auto_show){
				if($(".statement_li").find(".view_show_handle").length != 0){
				$(".statement_li").not($(".cookie_handle_view")).find(".view_show_content").css("display","none");
				$(".statement_li").not($(".cookie_handle_view")).find(".statement_li_content .click_tra_statement").attr("src","../static/statements/img/left_40.png");
			}

			if($(".state_folder")){
				$(".state_folder").not($(".have_view_content")).find(".statement_li").css("display","none");
				$(".state_folder").not($(".have_view_content")).find(".statement_li").find(".statement_li_content .click_tra_statement").attr("src","../static/statements/img/left_40.png");
			}
			table_auto_show = false;
			}

			}
			//statements_li_add-end---------



			//动态判断新建文件夹报表对应的num
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

			//新建文件夹新建视图方法
			function new_folder_view(type,text,tra_type,tra_class,btn_type,type_content,type_wrap){

					var post_dict ={};
					if($("#statements_left_bar_area").find(".click_new_folder_input").length == 0){

					var new_folder= $("<div class='clear "+type_content+"'><div class='empty_folder "+type_wrap+"'><img src='../static/statements/img/"+type+".png'  class='click_folder'/><div class='view_show_name_save new_element'><input type='text' class='click_new_folder_input' placeholder="+text+" maxlength='10'></div><div class="+btn_type+"><img class="+tra_class+" src=../static/statements/img/"+tra_type+".png /></div></div></div>")

					new_folder.find("."+btn_type+"").hide();
					new_folder.prependTo($("#statements_left_bar_area"));

					new_folder.find(".click_new_folder_input").focus();

					$(".rightConent #statements_left_bar #state_left_bar_title #statements_left_tra #statements_add_folder").hide();

					if(type == "folder"){

								var folder_name_cs = folder_name_sum(text,folder_name_arr);

								$(".click_new_folder_input").val(folder_name_cs);

								new_folder.find(".view_show_name_save").addClass("floder_content").data("record_name",folder_name_cs);

						}else{

								var menu_folder_name = folder_name_sum(text,menu_folder_name_arr);

								$(".click_new_folder_input").val(menu_folder_name);

								new_folder.find(".view_show_name_save").addClass("view_fun_content").data("record_name",menu_folder_name);
						}

					//点击btn创建文件夹
					$("#statements_left_bar_area").find(".click_new_folder_input").unbind("focusout")
					$("#statements_left_bar_area").find(".click_new_folder_input").on("focusout",function(){

						change_if_name = false;
						if($(".click_new_folder_input").val() == ""){
							var input_val_name = folder_name_cs;
						}else{
							//文件夹名字
							var input_val_name =$(".click_new_folder_input").val();
						}

											if(type == "folder"){
								//新建文件夹后台保存
								$.post("/dashboard/dashboardFolderAdd",{"foldername":input_val_name},function(result){
									if(result["status"] == "false"){
										$(".click_new_folder_input").css("borderColor","red");
										return;
									}else{

										//存放添加的文件夹名字
										folder_name_arr.push(folder_name_cs);

										new_view_show_and(result);

										click_view_change_view();
										//报表更多按钮点击事件
										delete_btn_handle();
										//文件夹重命名
										handle_change_result("state_folder_content","click_delete","delete1");

									}
								})

							}else{
								post_dict["foldername"] = input_val_name;
								post_dict["row"] = "row";
								post_dict["column"]= "null";
								post_dict["tablename"] ="null";
								post_dict["viewtype"] ="null";
								post_dict["defaultparent"] = "default";
								post_dict["calculation"] = "null";
								post_dict["viewstyle"] = "null";
								post_dict["customcalculate"] = "null";
								post_dict["sequential"] = "null";
								post_dict["handledatapost"] = "null";
								post_dict["drilldowndata"] = "null";
								post_dict["filterconditions"] = "null";
								$.post("/dashboard/dashboardTableAdd",post_dict,function(result){
									if(result["status"] == "false"){
										$(".click_new_folder_input").css("borderColor","red");
										return;
									}else{

										menu_folder_name_arr.push(input_val_name);

										new_view_show_and(result);

										user_handle_change_cookie(new_folder.find(".view_show_name_save"));

										click_view_change_view();

										//报表更多按钮点击事件
										more_handle_click();
										//报表重命名
										handle_change_result("statement_li_content","click_more","more");


									}
								});
								change_if_name = true;

							}

							// .....
							function new_view_show_and(result){
								$("."+type_content+"").find("."+btn_type+"").show();
								$("."+type_content+"").find(".new_element").html(input_val_name).removeClass("new_element");
								$("."+type_content+"").find(".click_folder").removeClass().addClass("click_or");

								//报表的移入移出事件
							    ele_each($("."+type_wrap+""),$("."+tra_class+""));

								delete_btn_handle();
								//报表拖入到文件夹中
								view_dragable_folder();


							}

							// new_show_end----------------

						// $(".mouse_img").unbind("click");
					})
				}

			}

		// function_____-

		//判断拖拽时是否重绘图形
		var dropTo  = null;

		//报表拖拽到文件夹中
		function view_dragable_folder(){
			$(".statement_li_content").find(".view_show_name_save").each(function(index,ele){
				// $(ele).draggable("destroy");
				$(ele).draggable({
					appendTo:"body",
					helper:"clone",
					start:function(event,ui){
						$(ui.helper).css("background","rgba(245,245,245,0.7)").css("lineHeight","25px");
					}
				});
			})

			$(".state_folder").each(function(index,ele){
				$(ele).droppable({
					activeClass: "ui-state-default_z",
				    hoverClass: "ui-state-hover_z",
					accept:$(".view_fun_content").not($(ele).find(".view_fun_content")),
					drop:function(event,ui){
						loc_storage.setItem("now_add_view",$(ui.draggable).text());
						console.log($(ui.draggable).parents(".statement_li").find(".view_show_handle"))
						$.post("/dashboard/RelevanceFolder",{"foldername":loc_storage.getItem("now_add_view"),"parentfoldername":$(ele).find(".state_folder_content").find(".view_show_name_save").text()},function(result){
							if(loc_storage.getItem("now_add_view") == $(".cookie_handle_view .statement_li_content .view_fun_content").text()){
								$(".right_if_have_parentfolder").css("display","block");
								$(".right_folder_name_show_img").css("marginRight","10px");
								$(".right_folder_name_show_img").find("img").attr("src","../static/statements/img/file_icon.png");
								$(".right_if_have_parentfolder").find("span").html($(ele).find(".state_folder_content").find(".view_show_name_save").text());
								dropTo = false;
							}else{
								dropTo = true;
								saveViewShowArr = {};
								saveViewShowArr[$(".cookie_handle_view .statement_li_content .view_fun_content").text()] = [];
								$(".gridster").html("");
								$(".gridster").append($("<ul></ul>"));
							}
							toIfChangeSecond = true;
							change_if_name = true;
							//根据数据库存储的数据展示
							view_out_handle_init(result,dropTo);
							ajax_data_post = result;
						})
					}

				});
			})

		}


			//隐藏显示点击切换
			function click_or_show(ele){
				var handle_show_h = null;
				$.post("/dashboard/setSwitch",{"switch":"show","id":$(ele).find(".small_view_text").data("table_id")},function(result){
					if(result != ""){
						if($(ele).find("img").attr("src") == '../static/statements/img/show.png'){
							$(ele).find("img").attr("src","../static/statements/img/hide.png");
							$(ele).css("opacity","1").data("table_show","true").removeClass("table_hide_false");
							$(ele).on("mouseenter",function(){$(ele).css("background","#F5F5F5");$(ele).find("img").css("display","block")});
							$(ele).on("mouseleave",function(){$(ele).css("background","");$(ele).find("img").css("display","none")});
							$("."+$(ele).data("save_view_class")+"").parent().css("display","block");
							$(ele).on("mouseenter",function(){
								if($(ele).data("table_show") != "false" && $(ele).parent().parent().hasClass("cookie_handle_view")){
								$(ele).find(".hide_or_show").css("display","block");
								$(ele).css("background","#F5F5F5");
								if(!$(ele).hasClass("view_handle_table") && !$(ele).hasClass("view_handle_indexPage")){
										creat_thumbnail($(ele));
								}
							}
				 		})

				 		$(ele).on("mouseleave",function(){
					 		if($(ele).data("table_show") != "false" && $(ele).parent().parent().hasClass("cookie_handle_view")){
					 			$(".thumbnail_wrap").remove();
					 			$(ele).find(".hide_or_show").css("display","none");
								$(ele).css("background","");
							}
				 		})


					}else{
							$(ele).find("img").attr("src","../static/statements/img/show.png").css("display","block");
							$(ele).css("background","#F5F5F5").css("opacity","0.5").data("table_show","false").addClass("table_hide_false").unbind("mouseenter mouseleave");
							$(".thumbnail_wrap").remove();
							$("#statements_left_bar_area .statement_li .view_show_content .view_show_handle").removeClass("now_click_view");
							$("."+$(ele).data("save_view_class")+"").parent().css("display","none");
							view_show_id_arr.splice($(ele).data("save_view_class"),1)
				}

			//			$(".statement_li .view_show_content .view_show_handle").not($(ele)).on("mouseenter",function(){$(this).css("background","#F5F5F5");$(this).find("img").css("display","block")});
		//				$(".statement_li .view_show_content .view_show_handle").not($(ele)).on("mouseleave",function(){$(this).css("background","");$(this).find("img").css("display","none")});
						// reason_view_drag(result,$(ele).parent().parent().find(".view_fun_content"));

					}
				})

			}


			//小视图点击隐藏显示
			function small_view_click_hide(){
				$(".statement_li .view_show_content .view_show_handle img").unbind("click");
				$(".cookie_handle_view .view_show_content .view_show_handle img").on("click",function(){
						click_or_show($(this).parent().parent());
				})
				$(".cookie_handle_view .view_show_content .view_show_handle").each(function(index,ele){
					//小视图重命名
					$(ele).find(".small_view_text").unbind("dblclick");
					$(ele).find(".small_view_text").on("dblclick",function(){
						if($(this).find(".click_new_folder_input").length > 0){
							return;
						}
						$("#statements_left_bar_area .thumbnail_wrap").remove();
						if($(ele).data("table_show") != "false"){
						//记录当前视图的名称
						var now_name = $(ele).text();
						$(ele).unbind("mouseenter mouseleave").css("background","").removeAttr("tablename");
						$(ele).find("img").unbind("click");
						// $(ele).find(".hide_or_show_wrap").find("img").attr("src","../static/statements/img/right-icon_03.png").removeClass();

						$(ele).find(".hide_or_show_wrap").hide();

						// 替换成input标签
						$(ele).find(".small_view_text").html("").append($("<input type='text' class='click_new_folder_input' placeholder='请输入...'  onfocus='javascript:this.select()' maxlength='10'>"));
						$(ele).find(".click_new_folder_input").css("width","100%").val(now_name).focus();
						$(ele).find(".click_new_folder_input").on("input",function(){
							$(this).css("borderColor","#000");
						})
						//点击保存更改后的名字
						$(ele).find(".click_new_folder_input").unbind("focusout");
						$(ele).find(".click_new_folder_input").focusout(function(){

						if($(ele).parents(".statement_li").find(".view_show_handle[tablename="+$(ele).find(".click_new_folder_input").val()+"]").length > 0){
							$(ele).find(".click_new_folder_input").css("borderColor","red");
							return;
						}

						//记录输入框里面的值
						if($(ele).find(".click_new_folder_input").val() == ""){
							var input_small_view_val = now_name;
						}else{
							var input_small_view_val = $(ele).find(".click_new_folder_input").val();
						}
						$(ele).find(".hide_or_show_wrap").show();
							//更新服务器数据
							 $.post("/dashboard/changeName",{"objtype":"view","oldname":$(ele).find(".small_view_text").data("table_id"),"newname":input_small_view_val},function(result){
								 if(result["status"] == "ok"){
								 	$(".new_view_content .new_view_title .new_view_table_name").eq(index).html(input_small_view_val).data("changeName","true");
								 	//重新存入对应视图的名称
								 	var changeNameView = $(ele).data("data_result_content").split(",");
								 	if(changeNameView.length == 6){
								 		changeNameView.push(input_small_view_val);
								 	}else{
								 		changeNameView[4] = input_small_view_val;
								 	}

								 	$(ele).data("data_result_content",changeNameView.join(",")).attr("tablename",input_small_view_val);
								 	if(preClickView[$(ele).parents(".statement_li").find(".statement_li_content .view_show_name_save").eq(0).text() + "-"+ now_name] != undefined){
								 		preClickView[$(ele).parents(".statement_li").find(".statement_li_content .view_show_name_save").eq(0).text() + "-"+ input_small_view_val] = preClickView[$(ele).parents(".statement_li").find(".statement_li_content .view_show_name_save").eq(0).text() + "-"+ now_name];
								 		delete preClickView[$(ele).parents(".statement_li").find(".statement_li_content .view_show_name_save").eq(0).text() + "-"+ now_name];
								 	}
								 	$(".edit_list span").each(function(index,eleList){
								 		if($(eleList).text() == $(ele).parent().parent().find(".statement_li_content .view_show_name_save").text() + "-"+ now_name){
								 			$(eleList).text($(ele).parent().parent().find(".statement_li_content .view_show_name_save").text() + "-" + input_small_view_val);
								 			//$(eleList).parent().attr("title",$(ele).parent().parent().find(".statement_li_content .view_show_name_save").text() + "-" + input_small_view_val);
								 		}
								 	})

								 }
							 });


						$(ele).find(".small_view_text").html(input_small_view_val).data("record_name",input_small_view_val);

						$(ele).find(".hide_or_show_wrap").find("img").unbind("click").attr("src","../static/statements/img/hide.png").addClass("hide_or_show").hide();

						$(ele).find(".hide_or_show_wrap").unbind("mouseenter mouseleave click").css("background","");

						cookie_view_each();

						$(".statement_li .view_show_content .view_show_handle img").unbind("click");
						//显示隐藏点击
						$(".cookie_handle_view .view_show_content .view_show_handle img").on("click",function(){
							click_or_show($(this).parent().parent());
						})
						// $(ele).css("background","#F5F5F5").unbind("mouseenter mouseleave");
					})


						}


				})
			})

			}


		//新建视图 下载 操作部分
		function view_content_right_handle(){
			//新建视图
			$("#pageStatementsModule #right_folder_show_are .click_out_handle .click_new_view").unbind("click");
			$("#pageStatementsModule #right_folder_show_are .click_out_handle .click_new_view").on("click",function(){
				changePageTo_navDashBoardView();
				addNewViewHandle = false;
				$("#pageDashboardModule .action_add_view").trigger("click");
			})

			//下载视图区域为pdf格式
			$("#pageStatementsModule #right_folder_show_are .click_out_handle .theme_down").unbind("click");
			$("#pageStatementsModule #right_folder_show_are .click_out_handle .theme_down").on("click",function(){

				$("#pageStatementsModule .gridster>ul>li").css("border","1px solid #DEDEDE");
				// console.log($(".gridster ul li").width()/$(".gridster ul li").height())
				// console.log($(".gridster").width()/(210/297))
				// $(".gridster").height($(".gridster").width()/(210/297));
			//	$(".gridster ul").height(210*3.78/$(".gridster").width() * $(".gridster ul li").height());
				//$(".gridster ul li").width(210* 3.78/$(".gridster").width()*$(".gridster ul li").width()).height(210*3.78/$(".gridster").width() * $(".gridster ul li").height());
				//$(".gridster ul li").find(".new_view_main").width(210* 3.78/$(".gridster").width()*$(".gridster ul li").width()).height(210* 3.78/$(".gridster").width()*$(".gridster ul li").height() - 30);
			//	$(".gridster ul li").find(".new_view_main").find("div,canvas").css("width","100%").css("height","100%");
					var targetDom = $("#pageStatementsModule .gridster");
		            //把需要导出的pdf内容clone一份，这样对它进行转换、微调等操作时才不会影响原来界面
		            var copyDom = targetDom.clone();

		            copyDom.find(".new_view_main").each(function(index,ele){
		             			if(!$(ele).hasClass("new_view_table") && !$(ele).hasClass("new_view_indexPage")){
		             				var aImg = new Image();
		                    		aImg.src = echarts.getInstanceByDom($("#right_folder_show_are .view_folder_show_area ul li .new_view_main").eq(index).get(0)).getDataURL({pixelRatio:2,backgroundColor:'#fff',type:'png'});
		                    		$(aImg).css("width","100%").css("height","100%");
		                    		$(ele).html("").append(aImg);
		             			}
		                    })

		             var folderTitle = $("<div>"+$("#pageStatementsModule .combo-input").val()+"</div>");

		             folderTitle.css({
		             	fontSize:"18px",
		             	color:"#202020",
		             	margin:"20px 0px 10px 20px",
		             })

		             folderTitle.prependTo(copyDom);

		            //新的div宽高跟原来一样，高度设置成自适应，这样才能完整显示节点中的所有内容（比如说表格滚动条中的内容）
		            copyDom.width(targetDom.width() + 20 + "px");
		            copyDom.height(targetDom.find("ul").height()+ 69 + "px");

		            $('body').append(copyDom);//ps:这里一定要先把copyDom append到body下，然后再进行后续的glyphicons2canvas处理，不然会导致图标为空
		            copyDom.attr("id","testetst");
		            copyDom.find(".new_view_title").remove();
		            copyDom.find(".new_view_main").css("margin-top","15px");
		            copyDom.find(".saveTable_class").css("top","20px");
		            copyDom.css({
		            	position:"absolute",
		            	left:0,
		            })
		            // var canvas = document.createElement("canvas");
		            // canvas.width = copyDom.width()*2;
		            // canvas.height = copyDom.height()*2;
		            // canvas.style.width = copyDom.width() + "px";
		            // canvas.style.height = copyDom.height() + "px";
		            // var context = canvas.getContext("2d");
		            // context.scale(2,2);

				html2canvas($(copyDom), {

					// canvas:canvas,
		        // onrendered: function(canvas) {

		        //     //通过html2canvas将html渲染成canvas，然后获取图片数据
		        //     var imgData = canvas.toDataURL('image/jpeg');

		        //     //初始化pdf，设置相应格式
		        //     var doc = new jsPDF("p", "mm", "b1");

		        //     //这里设置的是a4纸张尺寸
		        //     doc.addImage(imgData, 'JPEG', 0, 0,210,297);


		        //     //输出保存命名为content的pdf
		        //     doc.save('content.pdf');

		        //     $(".gridster ul li").css("border","none");
		        // },

		         onrendered: function (canvas) {
		                    var imgData = canvas.toDataURL('image/png');
		                    var img = new Image();
		                    img.src = imgData;
		                    //根据图片的尺寸设置pdf的规格，要在图片加载成功时执行，之所以要*0.225是因为比例问题
		                    img.onload = function () {
		                        //此处需要注意，pdf横置和竖置两个属性，需要根据宽高的比例来调整，不然会出现显示不完全的问题

		                        if (this.width > this.height) {
		                            var doc = new jsPDF('l', 'mm', [$("body").width()/3.78, $("body").width()/($("#pageStatementsModule .view_folder_show_area").width()/($("#pageStatementsModule .view_folder_show_area ul").height()+69))/3.78]);
		                        } else {
		                            var doc = new jsPDF('p', 'mm', [$("body").width()/3.78, $("body").width()/($("#pageStatementsModule .view_folder_show_area").width()/($("#pageStatementsModule .view_folder_show_area ul").height()+69))/3.78]);
		                        }
		                        doc.addImage(imgData, 'png', 0, 0, $("body").width()/3.78, $("body").width()/($("#pageStatementsModule .view_folder_show_area").width()/($("#pageStatementsModule .view_folder_show_area ul").height()+69))/3.78);
		                        //根据下载保存成不同的文件名
		                        doc.save('pdf_' +$("#pageStatementsModule .combo-input").val()+ '.pdf');
		                    };
		                    //删除复制出来的div
		                    copyDom.remove();
		                    // $("#pageStatementsModule .gridster>ul>li").css("border","none");
		                },
		        background: "#fff",
		        logging:true,
		        allowTaint: false //避免一些不识别的图片干扰，默认为false，遇到不识别的图片干扰则会停止处理html2canvas

		    });

			})
		}




		//初始化
			function view_out_handle_init(data_result,dropTo){

				if(toIfChangeSecond){
					//根据数据库存储的数据展示
					statements_li_add(data_result,dropTo);

					//单击视图点击切换
					click_view_change_view();

					//小视图点击 更换名称
					small_view_click_hide();

					//报表更多按钮点击事件
					more_handle_click();

					//新建视图 下载 操作部分
					view_content_right_handle();

					cookie_view_each();

					//报表拖入到文件夹中
					view_dragable_folder();

					//报表重命名
					handle_change_result("statement_li_content","click_more","more");

					//文件夹重命名
					handle_change_result("state_folder_content","click_delete","delete1");

					//删除文件夹按钮点击事件
					delete_btn_handle();


					//侧边栏点击事件
					leftNavClick();

					toIfChangeSecond = false;
				}


			}

			// end-----
		}
