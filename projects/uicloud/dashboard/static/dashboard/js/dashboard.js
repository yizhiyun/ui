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
				};

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

				var recordConditon = null;
				//记录下钻时维度的数量信息
				var saveDimeData = [];

				var saveHandleViewData = [];
				//用户名
				var username = "yzy";
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


				//存放每个表对应的指标
				var getIndexNameDict = {};


				//存放当前给定的默认指标

				var getIndexName = [];

				//记录分层下钻对应拖入的维度

				var saveDrillDownDict = {};

				//记录上钻的视图数据
				var saveDrillDownTemp = {};

				var noDrop = false;

				//记录上一次生成的视图是否需要和编辑视图相同 避免重复编辑

				var savePreDictId  = {};


				var isDisaed = true;

				//记录维度度量框的宽度
				var mideiCountData = null;

				//分层下钻不同层数对应的维度

				var savePerterDict = {};

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


				//判断仪表板是否删除过视图

				var statementsToView =  null;

				//存放数据源的数组
				var save_data_sum_handle = [];

				// 记录当前集合表中的日期字段
				var currentSetTableDateFieldArray = [];
				var currentSetTableDateFieldName = null;
				var currentSetTableDateMinDate = null;
				var currentSetTableDateMaxDate = null;

				//编辑视图post的数据
				var editViewPostData = null;

				var oldViewToShow = false;

				var addNewViewHandle = true;

				//分层下钻返回编辑维度显示的位置
				var editViewDimenCount = null;

				// 删除后数据的更改
				var deleteDataHandleArr;

				// 复选框点击同步多维度关系
				var checkedHandle = false;

				var freeHandleCheck = false;

				var preAllData = null;
				
				var preHandleDataCheck = null;

				var dateClickHandle = false;

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
						$(ele).css("background", "#DEDEDE");

					})

					$(ele).on("mouseleave", function() {
						$(ele).css("background", "white");
						})
					})
				}


				//移入移出事件
				function eachMouse(theElement){
					theElement.unbind("mouseenter");
					theElement.mouseenter(function(event){
						event.stopPropagation();
						$(theElement).css("background", "#c5e0ff").css("border","1px solid #86a9d1").css("line-height","21px").css("text-indent","2px");
					})


					theElement.unbind("mouseleave");
					theElement.mouseleave(function(event){
						event.stopPropagation();
						$(theElement).css("background","").css("border","none").css("line-height","23px").css("text-indent","3px");
					})
				}


					//重新绘制分层结构
					function onlyDragPeter(data){
						$("#parameter_show").html("");
						for(var i =0; i < data.length;i++){
							var tempData = data[i];
							for(var j = 0;j < eval(tempData["structure"]).length;j++){
								if(j == 0){
									var freeList = $("<div class='parameterElement clear' handleid="+tempData["id"]+"></div>").html("<div class='parameterChlid' dataValue='0'><div class='imageShowContent imageShowTra'><img src='/static/dashboard/img/left_35.png' alt='tra' class='pereterTra'></div><div class='imageShowContent'><img src='/static/dashboard/img/dashboard_icon3.png' alt='hierarchyImg'></div><span class='perterSpan' datatype="+eval(tempData["structure"])[j]+">"+eval(tempData["structure"])[j
										].split(":")[0]+"</span></div><div class='pereterArea clear'></div>");
									eachMouse(freeList.find("span"));
									peterHandleCommon(freeList,eval(tempData["structure"])[j].split(":")[1]);
									
								}else{
									$(freeList).find(".imageShowTra").show();
									$(freeList).find(".parameterChlid span").css("width","131px");
									var freeChildren = $("<div class='currentChildren clear' dataValue="+(freeList.find(".currentChildren").length+1)+"></div>").html("<div class='imageShowContent'><img src="+eval(tempData["structure"])[j].split(":")[1].image_Name_Find("dimensionality")+" alt='hierarchyImg'></div><span class='perterSpan' datatype="+eval(tempData["structure"])[j]+">"+eval(tempData["structure"])[j].split(":")[0]+"</span>");
									
									eachMouse(freeChildren.find("span"));
									freeChildren.css({
										"marginLeft":45 + ($(freeList).find(".currentChildren").length * 23) + "px",
										"width":131 - ($(freeList).find(".currentChildren").length * 23) + "px",
									});
									freeChildren.find("span").css("width",103 - ($(freeList).find(".currentChildren").length * 23) + "px");
									
									//拖拽
									freeChildren.find("span").data("type",eval(tempData["structure"])[j].split(":")[1]).draggable({
										appendTo: "body",
										helper: "clone",
										containment:$("body"),
										start:function(event,ui){
											$(".drop_view").not($(".handle_one,#handle_color_text")).each(function(index,ele){
												$(ele).droppable( "option", "accept", ".dimensionality_list_text,.measure_list_text,.perterSpan");
											})
											$("#view_show_area_content").droppable({disabled:false});
											$("#drop_row_view,#drop_col_view").droppable({disabled:true});
										},
										stop:function(event,ui){
											$("#view_show_area_content").droppable({disabled:true});
											$("#drop_row_view,#drop_col_view").droppable({disabled:false});
										}

									});

									freeList.find(".pereterArea").append(freeChildren);
								}
								$("#parameter_show").append(freeList);
								
								}

						}
					}

					var postPeterDict = null;
					//拖拽层级结构的增删改操作
					function peterAddChange(postPeterDict,element){
					   	$.ajax({
					   		url:"/dashboard/layoutHandle",
					   		type:"post",
							dataType:"json",
							contentType: "application/json; charset=utf-8",
							async: true,
							data:JSON.stringify(postPeterDict),
							success:function(data){
								if(data["status"] == "success"){
									if($(element) != undefined){
										$(element).attr("handleId",data["id"]);
									}
								}
							}
					   	})
					}

					//获取层级关系
					function getPeterOnly(element){
						var tempHandleData = [];
						$(element).find(".perterSpan").each(function(index,ele){
							tempHandleData.push($(ele).attr("datatype"));
						})
						return tempHandleData;
					}

					//层级结构的拖拽公共事件
					function peterHandleCommon(current_li,element){
						current_li.find(".imageShowTra").unbind("click");
						current_li.find(".imageShowTra").click(function(event){
							event.stopPropagation();
							$(this).parents(".parameterElement").find(".pereterArea").toggle(300,function(){
								if($(this).parents(".parameterElement").find(".pereterArea").css("display") == "block"){
									$(this).parents(".parameterElement").find(".imageShowTra img").attr("src","/static/dashboard/img/left_35.png");
								}else{
									$(this).parents(".parameterElement").find(".imageShowTra img").attr("src","/static/dashboard/img/left_40.png");
								}
							});
						})
						//拖拽
						current_li.find("span").data("type",element).draggable({
							appendTo: "body",
							helper: "clone",
							containment:$("body"),
							addClasses:false,

							start:function(event,ui){
								$(".drop_view").not($(".handle_one,#handle_color_text")).each(function(index,ele){
									$(ele).droppable( "option", "accept", ".dimensionality_list_text,.measure_list_text,.perterSpan");
									
								})
								$("#view_show_area_content").droppable({disabled:false});
							},
							stop:function(event,ui){
								$("#view_show_area_content").droppable({disabled:true});
							}

					});

					current_li.droppable({
							activeClass: "preter-ui-state-default_z",
							hoverClass: "ui-state-hover_z",
							accept:$(".dimensionality_list_text"),
							greedy:true,
							drop:function(event,ui){
								if($(event.target).hasClass("parameterElement")){
									
									if($(this).find(".currentChildren").length > 1){
										return;
									}
									$(this).find(".imageShowTra").show();
									$(this).find(".parameterChlid span").css("width","131px");
									var currentChildren = $("<div class='currentChildren clear' dataValue="+($(this).find(".currentChildren").length+1)+"></div>").html("<div class='imageShowContent'><img src="+$(ui.draggable).parents(".dimensionality_li").find(".dimensionality_datatype img").attr("src")+" alt='hierarchyImg'></div><span class='perterSpan' datatype="+$(ui.draggable).find(".dimensionality_list_text_left").attr("datatype")+">"+$(ui.draggable).text()+"</span>");

									currentChildren.css({
										"marginLeft":45 + ($(this).find(".currentChildren").length * 23) + "px",
										"width":131 - ($(this).find(".currentChildren").length * 23) + "px",
									});
									eachMouse(currentChildren.find("span"));
									//拖拽
									currentChildren.find("span").data("type",$(ui.draggable).data("type")).draggable({
										appendTo: "body",
										helper: "clone",
										containment:$("body"),
										start:function(event,ui){
											$(".drop_view").not($(".handle_one,#handle_color_text")).each(function(index,ele){
												$(ele).droppable( "option", "accept", ".dimensionality_list_text,.measure_list_text,.perterSpan");
											})
											$("#view_show_area_content").droppable({disabled:false});
											$("#drop_row_view,#drop_col_view").droppable({disabled:true});
										},
										stop:function(event,ui){
											$("#view_show_area_content").droppable({disabled:true});
											$("#drop_row_view,#drop_col_view").droppable({disabled:false});
										}

									});
									currentChildren.find("span").css("width",103 - ($(this).find(".currentChildren").length * 23) + "px");
									currentChildren.appendTo($(this).find(".pereterArea"));
									postPeterDict = {"statu":"change","structure":getPeterOnly($(this)),"id":$(this).attr("handleId")}
									peterAddChange(postPeterDict);
								}
							}
						})

					}


				// 分层下钻展现样式
				function peterDrillShowHandle(element,content){
							onlyGetDrillDown = true;
							var current_li = $("<div class='list_wrap clear'><li class='drog_row_list' id="+"dimensionality:"+element[0]+"><div class='drop_main clear set_style dimensionality_list_text peterMouse' dataValue='0'><div class='downImgContent'><img src='/static/dashboard/img/dashboard_icon2.png' alt='downup'></div><span class='dimensionality_list_text_left perterHandle' datatype="+element[0]+">"+element[0].split(":")[0]+"</span></div><div class='perterWallContent'></div></li></div>");
							current_li.find(".drop_main").css("border","1px solid #DEDEDE").addClass("clickActive");
							current_li.unbind("click");
							for(var i = 1; i < element.length;i++){
								if(i == 1){
									current_li.find(".perterWallContent").append($("<div class='perterWallContentList perterSecond peterMouse' dataValue='1'><div class='downImgContent'><img src='/static/dashboard/img/dashboard_icon2.png' alt='downup'></div><span class='secondMenuText' datatype="+element[1]+">"+element[1].split(":")[0]+"</span></div><div class='perterThree'></div>"))
								}else{
									
									current_li.find(".perterWallContent").find(".perterThree").append($("<div class='perterWallContentList peterMouse' dataValue='2'><div class='downImgContent threeView'><img src='/static/dashboard/img/dashboard_icon2.png' alt='downup'></div><span class='secondMenuText' datatype="+element[2]+">"+element[2].split(":")[0]+"</span></div>"));
								}
							}
							

							current_li.find(".peterMouse span").each(function(index,ele){
								$(ele).attr("handledata","dimensionality:"+$(ele).attr("datatype"));
								$(ele).unbind("click");
								$(ele).click(function(event){
									event.stopPropagation();
									if(onlyGetDrillDown && !$(ele).parent(".peterMouse").hasClass("clickActive")){
										freeTemp = "peter";
										if($(ele).parent(".peterMouse").attr("datavalue") == 0){
											$(".deleteDrill").children("p").trigger("click");
										}else{
											$(".peterDownHandle[datavalue="+$(ele).parent(".peterMouse").attr("datavalue")+"]").children("p").trigger("click");	
										}
										
									}
								})
							})

							$(content).append(current_li);

							if(element.length  == 2){
								current_li.find(".drop_main .downImgContent").show();
								current_li.find(".perterWallContent .perterSecond .downImgContent").css("display","inherit").css("visibility","hidden");
								
							}else if(element.length  == 3){
								current_li.find(".drop_main .downImgContent").show();
								current_li.find(".perterWallContent .perterSecond .downImgContent").css("display","block").css("visibility","visible");
							}

							//移入移出事件
							peterDrillDown();

							//层级结构点击收起放下
							$("#drop_row_view .downImgContent,#drop_col_view .downImgContent").each(function(index,ele){
								$(ele).unbind("click");
								$(ele).click(function(event){
									event.stopPropagation();
									if($(ele).parent().hasClass("drop_main")){
										$(ele).parents(".drog_row_list").find(".perterWallContent").toggle(300,function(){
											if($(ele).parents(".drog_row_list").find(".perterWallContent").css("display") == "block"){
												$(ele).find("img").attr("src","/static/dashboard/img/dashboard_icon1.png");
												// $(ele).parents(".drog_row_list").find(".perterThree").show();
												// $(ele).parents(".drog_row_list").find(".perterWallContent .perterSecond .downImgContent img").attr("src","/static/dashboard/img/dashboard_icon1.png");														
											}else{
												$(ele).find("img").attr("src","/static/dashboard/img/dashboard_icon2.png");
												// $(ele).parents(".drog_row_list").find(".perterThree").hide();
												// $(ele).parents(".drog_row_list").find(".perterWallContent .perterSecond .downImgContent img").attr("src","/static/dashboard/img/dashboard_icon2.png");
											}


										});
									}else{
										$(ele).parents(".perterWallContent").find(".perterThree").toggle(300,function(){
											if($(ele).parents(".perterWallContent").find(".perterThree").css("display") == "block"){
												$(ele).find("img").attr("src","/static/dashboard/img/dashboard_icon1.png");
											}else{
												$(ele).find("img").attr("src","/static/dashboard/img/dashboard_icon2.png");
											}
										});
									}
								})
							})


							//拖拽删除
							$(".drog_row_list .perterWallContentList").each(function(index,ele){
								$(ele).draggable({
									appendTo: "body",
									helper: "clone",
									containment:$("body"),
									addClasses:false,
									create:function(event,ui){

									$("#view_show_area_content").droppable( "option", "accept", ".dimensionality_list_text,.measure_list_text,.perterSpan,.perterWallContentList");

									},
									start:function(event,ui){
										$(ui.helper).css({
											"width":$(event.target).width() + "px",
										});

										$(ui.helper).find(".downImgContent").css({
											"display":"inherit",
											"visibility":"hidden",
										});
										$("#view_show_area_content").droppable({disabled:false});
										$("#drop_row_view,#drop_col_view").droppable({disabled:true});
									},
									stop:function(){
										$("#view_show_area_content").droppable({disabled:true});
										$("#drop_row_view,#drop_col_view").droppable({disabled:false});														
									}
								});
							})


						return current_li;
				}




				//清除下钻功能
				function deleteDrillFun(){
					if($("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow").css("display") == "block"){
						$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area #view_show_area_content").height($("body").height() - $(".container .topInfo").height() - $(".rightConent #dashboard_content #new_view").height() - $(".rightConent #dashboard_content #action_box").height() - Number($("#drag_wrap_content").css("paddingTop").match(/\d+/g))*2 - $("#operational_view").height());
						$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow").hide();
					}
					$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul li:gt(0)").remove();
					
					dirllConditions = [];
					valueCount = 0;
					saveDimeData =[];
					saveDataAndView = [];
					getFilterAllData();
				}

				//获得删除后的数据放置在数组
				function getDeleteData(){
					var freeHandleDeleteData = [];
					$(".noDelete").each(function(index,ele){
						if($.inArray($(ele).attr("title"),tempSaveDeleteViewDict["onlyFolder"]) == -1 && $.inArray($(ele).attr("title").split("-")[0],tempSaveDeleteViewDict["onlyFolder"]) == -1){
							freeHandleDeleteData.push($(ele).find("span").text());
						}else{
							$(ele).removeClass("noDelete");
						}
					})
					return freeHandleDeleteData;
				}



				function dashboardReadySumFunction(isOnlyLoad){
					//删除视图后重新给定默认显示
					function deleteViewChangeShowFunction(){
						if(saveViewTableDataDelete == false){
							if($(".rightConent #dashboard_content #new_view ul li.auto_show").length > 0 && preClickView[$(".rightConent #dashboard_content #new_view ul li.auto_show").attr("title")] != undefined && preClickView[$(".rightConent #dashboard_content #new_view ul li.auto_show").attr("title")]["tablename"] == nowDeleteTableView){
								empty_viem_init("change");
							}
							saveViewTableDataDelete = true;
						}
						if($(".rightConent #dashboard_content #new_view ul li.auto_show").length  == 0){
							$(".rightConent #dashboard_content #new_view ul li[title_change=0]").addClass("auto_show");
							$(".rightConent #dashboard_content #new_view ul li[title_change=0]").find(".folderview_li_del_btn").css("display","block");

							if(preClickView[$(".rightConent #dashboard_content #new_view ul li[title_change=0]").find(".folderview_li_span").text()] != null){
								empty_viem_init("change");
								edit_view_show(null,preClickView[$(".rightConent #dashboard_content #new_view ul li[title_change=0]").find(".folderview_li_span").text()],"noedit","noLocation");
							}else{
								empty_viem_init("change");
							}
						}
					}
					// $("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow").hide();

					//判断在视图库是否删除过视图 使仪表板同步
					if(statementsToView){
						deleteDataHandleArr = getDeleteData();
						$("#dashboard_content #new_view ul .edit_list").not(".noDelete").each(function(index,ele){
							//构建数据返回到仪表板
							if(saveViewTableDataDelete == false && $(".statementsDelete").length > 0){
								if($(ele).hasClass("statementsDelete")){
									$(ele).find(".folderview_li_del_btn").trigger("click");
									delete preClickView[$(ele).attr("title")];
									// console.log(preClickView)
								}
							}

							//视图库返回到仪表板
							if(tempSaveDeleteViewDict["all"] != undefined && tempSaveDeleteViewDict["all"].length > 0){
									if($(ele).data("edit_view").split(",")[0] != "default"){
										$(ele).addClass("statementsDelete");
										$(ele).find(".folderview_li_del_btn").trigger("click");
										delete preClickView[$(ele).attr("title")];
									}

							}

							if(tempSaveDeleteViewDict["onlyFolder"] != undefined && tempSaveDeleteViewDict["onlyFolder"].length > 0){
									if($.inArray($(ele).attr("title"),tempSaveDeleteViewDict["onlyFolder"]) != -1 || $.inArray($(ele).attr("title").split("-")[0],tempSaveDeleteViewDict["onlyFolder"]) != -1){
										$(ele).addClass("statementsDelete");
										$(ele).find(".folderview_li_del_btn").trigger("click");
										delete preClickView[$(ele).attr("title")];
									}
							}


							if(index == $("#dashboard_content #new_view ul .edit_list").length){
								$.post("../dashboard/getAllData",function(result){
									ajax_data_post = result;
								})
							}
						})

						$(".noDelete").each(function(index,ele){
							if($(ele).find("span").text() != $(ele).attr("title")){
								preClickView[$(ele).find("span").text()] = preClickView[$(ele).attr("title")];
								delete preClickView[$(ele).attr("title")];
								$(ele).attr("title",$(ele).find("span").text());
								
							}
						})

						$("#dashboard_content #new_view ul .edit_list").removeClass("noDelete");

						deleteViewChangeShowFunction();
						tempSaveDeleteViewDict = {};
						deleteDataHandleArr  = [];
						statementsToView = false;
					}

					
					if(saveAddNewFile){
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
										if($("#dashboard_content #new_view ul li[tableshowid="+have_view_edit[have_view_edit.length - 1]+"]").length > 0){
											$("#dashboard_content #new_view ul li").removeClass("auto_show").data("view_btn","true");
											$("#dashboard_content #new_view ul li[tableshowid="+have_view_edit[have_view_edit.length -1]+"]").addClass("auto_show").data("view_btn","false");
											if(saveNewAddViewFun){
												save_data_sum_handle = data["results"];
												cubeSelectContent_fun(data["results"],have_view_edit[3],"addNewFile");
											}
											return;
										}
										cubeSelectContent_fun(data["results"],have_view_edit[3]);
									}else if(Object.getOwnPropertyNames(preClickView).length != 0 && preClickView[$("#pageDashboardModule #dashboard_content #new_view .auto_show").find(".folderview_li_span").text()] != null  && preClickView[$("#pageDashboardModule #dashboard_content #new_view .auto_show").find(".folderview_li_span").text()]["viewtype"] != null){
										edit_view_show(null,preClickView[$("#pageDashboardModule #dashboard_content #new_view .auto_show").attr("title")],"noedit","noLocation");
										if(saveNewAddViewFun){
											save_data_sum_handle = data["results"];
											cubeSelectContent_fun(data["results"],preClickView[$("#pageDashboardModule #dashboard_content #new_view .auto_show").attr("title")]["tablename"],"addNewFile");
										}
									}else{
										// 创建数据块
										cubeSelectContent_fun(data["results"]);
									}

									save_data_sum_handle = data["results"];

								}
								saveAddNewFile = false;
							},
						});

					}


				if($("#pageDashboardModule").hasClass("handleTrue")){
					return;
				}

				//...................默认给定的样式
				function leftBar_sizeW_function(){
						var leftBarW = $("body").height() - $(".container .topInfo").height() - $(".rightConent #dashboard_content #new_view").height() - $(".rightConent #dashboard_content #action_box").height() - Number($("#drag_wrap_content").css("paddingTop").match(/\d+/g))*2;
						//	var leftbarW_second = $(".leftNav").height()
						$("#lateral_bar").height(leftBarW + Number($("#drag_wrap_content").css("paddingTop").match(/\d+/g))*2);
						$("#dimensionality,#measurement,#indicator,#parameter").height((leftBarW-20) / 4);

						$("#view_show_area").height(leftBarW - $("#operational_view").height());
						if($(".drillDownShow").css("display") == "none"){
							$("#view_show_area_content").height(leftBarW - $("#operational_view").height());
						}else{
							$("#view_show_area_content").height(leftBarW - $("#operational_view").height() - 30);
						}
						
						$("#dimensionality_show,#measure_show,#index_show,#parameter_show").height($("#dimensionality").height() - 32);
						$("#action_box").width($("body").width() - 62 - $(".rightConent #dashboard_content #sizer").width());
						$("#dashboard_content").width($("body").width() - 60);
						//..
						var barHeight = $("body").height() - $(".topInfo").height() - $("#new_view").height() - $("#action_box").height();
						var view_show_height = barHeight - $("#operational_view").height();
						var nowContentW = $("#action_box").width();

						$(".handleAll_wrap").width(nowContentW - 201);
						$("#view_show_area_content").width($("#drag_wrap_content").width());

						//筛选器高度
						$("#sizer").height($("#lateral_bar").height() + 50);
						$("#sizer_place").height($("#lateral_bar").height()-20);
						$("#sizer_place #sizer_mpt").css("marginTop",$("#sizer").height()/2 - $("#sizer_place #sizer_mpt").height()/2 + "px");

						$("#sizer_content .filter_body_div").height($("#sizer_place").height()-$("#sizer_content .filter_header_div").height() - $("#sizer_content .dateSelectDataModule").height());

						$("#dashboard_content #new_view ul li").each(function(index,ele){
							if($(ele).attr("title") != $(ele).find("span").text()){
								$(ele).attr("title",$(ele).find("span").text());
							}
						})

						mideiCountData = $("#drop_row_view").width() * 0.91;
				}

						leftBar_sizeW_function();



				        $(window).resize(function(){
				        	if($("#pageDashboardModule").css("display") == "block"){
						          leftBar_sizeW_function();
						          $("#pageDashboardModule #dashboard_content #operational_view .annotation_text .drog_row_list").width($("#drop_row_view").width() * 0.91);
						          $("#pageDashboardModule #dashboard_content #operational_view #handle_color_text .list_wrap").width($("#drop_row_view").width()*0.91);
						          $("#pageDashboardModule #dashboard_content #operational_view #handle_color_text .drog_row_list").width($("#drop_row_view").width()*0.91 * 0.85);
						          if($("#view_show_area #view_show_area_content #view_show_wrap #main").css("display") == "block"){
						          	var freeEcharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
						          	freeEcharts.resize();
						          }
						          if($("#view_show_area #view_show_area_content #view_show_wrap #card").css("display") == "block"){
						          		$(".measureDiv").css({"marginLeft":$("#view_show_wrap").actual("width")/2-$(".measureDiv").actual("width")/2+'px',"marginTop":$("#view_show_wrap").actual("height")/2-$(".measureDiv").actual("height")/2+'px'});
						          }
				        	}

				        })



					$("#dashboard_content #view_show_area #view_show_area_content .MoMInfo .monHeader .unitSelectDiv select").comboSelect();

					// 撤销
					$("#prev").click(function(){
					    if($(".view_folder_show_area").height() == 0){
							changePageTo_navBuildDataView();	
						}else{
							changePageTo_navReporttingView();
						}
					})

					// // 下一步
					// $("#next").click(function(){
						
					// })

					//运行更新
					$("img[alt='update']").click(function(){
					    switch_chart_handle_fun();
					})

					//视图清空 页面初始化
					function empty_viem_init(change_or_click){
						$("#operational_view .annotation_text .drag_text").show();
						//清空维度度量里面的数据
						$("#operational_view .annotation_text").find(".list_wrap").remove();
						$("#operational_view .annotation_text").find("li").remove();

						// if(change_or_click == "click"){
						// 	//选择块恢复默认
						// 	$('#lateral_title .custom-select').find("option").removeAttr("selected");
						// 	$('#lateral_title .custom-select').find("option").eq(0).attr("selected","selected");
						// 	$('#lateral_title .custom-select').comboSelect();
						// 	load_measurement_module($('#lateral_title .custom-select').val())

						// }
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
						$("#view_show_area #view_show_area_content #view_show_wrap #card").hide();
						$("#view_show_area_content #view_show_empty").show();
						initTable_name();
						$("#project_chart ul li").data("if_show","").css("border","").css("opacity","0.3");

						if(currentSetTableDateFieldArray.length  == 0){
							$("#sizer_content").hide();
							$("#sizer_content .filter_body_div .table_field_list").empty();
							$("#view_show_empty").add($("#sizer_mpt")).show();
						}else{
							$("#sizer_content .filter_body_div .table_field_list").empty();
						}

						drag_measureCalculateStyle = {};
						if(dirllConditions.length > 0){
							//清除下钻功能
							deleteDrillFun();
						}

						saveDrillCount = [];
						saveDrillDownDict = {};
						saveDrillDownTemp = {};

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

						rightFilterListDraw();

						currentColorGroupName = "默认";

						normalUnitValue = -1;

						valueUnitValue = "个";

						customCalculate = {};

						noDrop = false;

						view_name = null;

						save_now_show_view_text =  null;

						click_view_icon = false;
						//移除指标恢复拖拽滚动
						if($(".drop_view").hasClass("ui-droppable")){
							var disabled = $(".drop_view").droppable("option", "disabled");

							$(".drop_view").droppable("option", "disabled", false);

							$(".drop_view").sortable({ disabled: false });

							$(".drop_view,#drop_zb_view").css("background", "");
						}

						if($("#drag_zb .annotation_text").hasClass("ui-droppable")){
							var disabled = $("#drag_zb .annotation_text").droppable("option", "disabled");

							$("#drag_zb .annotation_text").droppable("option", "disabled", false);

							$("#drag_zb .annotation_text").sortable({ disabled: false });
						}


						if($("#view_show_area_content").hasClass("ui-droppable")){
							$("#view_show_area_content").droppable({disabled:true});
						}

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
					function reason_old_show(ele_wrap,current_cube_name,now_title_handle_view,drag_measureCalculateStyle,indexEdit,editViewDimenCount){
						$("#operational_view #drag_row .annotation_text .drag_text,#operational_view #drag_col .annotation_text .drag_text").hide();
						$("#drag_wrap_content #drag_row .annotation_text .list_wrap,#drag_wrap_content #drag_row .annotation_text li").remove();
						$("#drag_wrap_content #drag_col .annotation_text .list_wrap,#drag_wrap_content #drag_col .annotation_text li").remove();
						for (col_or_row in ele_wrap){
							//遍历对应的维度度量是否存在数据
							for(view_data_md in ele_wrap[col_or_row]){
								//判断得到的数组不为空
								if(ele_wrap[col_or_row][view_data_md].length != 0){
									for(var i = 0; i < ele_wrap[col_or_row][view_data_md].length; i++){
										if(view_data_md == "dimensionality" && editViewDimenCount != null && $.inArray(i,[editViewDimenCount[JSON.parse(now_title_handle_view["drilldowndata"])["showList"]["peterList"][0].split(":")[0]]]) != -1){
											if(col_or_row == "row"){
												var handleContent = $("#drag_wrap_content #drag_row .annotation_text");
											}else{
												var handleContent = $("#drag_wrap_content #drag_col .annotation_text");
											}
											var reason_old_content = peterDrillShowHandle(JSON.parse(now_title_handle_view["drilldowndata"])["showList"]["peterList"],handleContent);

										}else{
											//创建元素
											var reason_old_content = $("<div class='list_wrap clear'><li class='drog_row_list date_list bj_information' id='"+view_data_md+":"+ele_wrap[col_or_row][view_data_md][i]+"'><div class='drop_main clear set_style "+view_data_md+"_list_text ui-draggable ui-draggable-handle'><span class='"+view_data_md+"_list_text_left'></span><div class='moreSelectBtn'><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'></div></div></li></div>");

											reason_old_content.find(".set_style").on("mouseenter",function(){$(this).find(".moreSelectBtn").show()});
											reason_old_content.find(".set_style").on("mouseleave",function(){$(this).find(".moreSelectBtn").hide()});
											if(view_data_md == "dimensionality"){
												reason_old_content.find("li .set_style").css("background","#c5e0ff").css("border","1px solid #86a9d1").addClass("noPerter");
												reason_old_content.find("."+view_data_md+"_list_text_left").text(ele_wrap[col_or_row][view_data_md][i].split(":")[0])
												if(col_or_row == "row"){
													reason_old_content.appendTo($("#drag_wrap_content #drag_row .annotation_text"));
												}else{
													reason_old_content.appendTo($("#drag_wrap_content #drag_col .annotation_text"));
												}
											}else{
												reason_old_content.find("li .set_style").css("background","#ffcc9a").css("border","1px solid #ffbe7f");
												reason_old_content.find("li").data("field_name",ele_wrap[col_or_row][view_data_md][i].split(":")[0]).data("pop_data_handle",username+"_YZY_"+ $("#lateral_bar #lateral_title .combo-select ul").find(".option-selected").text()+"_YZY_"+ ele_wrap[col_or_row][view_data_md][i].split(":")[0]);
												reason_old_content.find("."+view_data_md+"_list_text_left").text(drag_measureCalculateStyle[ele_wrap[col_or_row][view_data_md][i].split(":")[0]]);
												if(col_or_row == "row"){
													reason_old_content.appendTo($("#drag_wrap_content #drag_row .annotation_text"));
												}else{
													reason_old_content.appendTo($("#drag_wrap_content #drag_col .annotation_text"));
												}
											}

											md_click_show(reason_old_content.find("li").find(".moreSelectBtn"),{"编辑计算_YZY_edit_calculation":null,"度量_YZY_measure":["计数_YZY_pop_count_all","求和_YZY_pop_total","平均值_YZY_pop_mean","最大值_YZY_pop_max","最小值_YZY_pop_min"],"同比_YZY_compared":null,"环比_YZY_linkBack":null,"移除对比_YZY_deleteCompared":null,"移除_YZY_deleting":null});	
										}

											$(reason_old_content).find("li").css({
												width: mideiCountData+ "px",
												margin: "5px auto 0",
												listStyle: "none",
											});
											$(reason_old_content).find(".set_style").css({
												width: "94%",
												height: "23px",
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

						var freeHandleDragData;

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

						//同比环比显示
						var tempGetData = JSON.parse(now_title_handle_view["sequential"]);

						showTongbiMeasureArray = tempGetData[0];

						showHuanbiMeasureArray = tempGetData[1];

						current_cube_name = now_title_handle_view["tablename"];

						if(JSON.parse(now_title_handle_view["drilldowndata"])["showList"] != undefined&& JSON.parse(now_title_handle_view["drilldowndata"])["showList"]["showList"] != undefined){
							if(JSON.parse(now_title_handle_view["drilldowndata"])["showList"]["showList"].length > 0){
								editViewDimenCount = null;

								viewClickChange = JSON.parse(now_title_handle_view["drilldowndata"])["viewClickChange"];
								
								dirllConditions = JSON.parse(now_title_handle_view["drilldowndata"])["dirllConditions"];

								saveDimeData = JSON.parse(now_title_handle_view["drilldowndata"])["saveDimeData"];

								saveDataAndView = JSON.parse(now_title_handle_view["drilldowndata"])["saveDataAndView"];

								saveDrillPreView =  JSON.parse(now_title_handle_view["drilldowndata"])["saveDrillPreView"];
								$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow").show();
								$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area #view_show_area_content").height($("body").height() - $(".container .topInfo").height() - $(".rightConent #dashboard_content #new_view").height() - $(".rightConent #dashboard_content #action_box").height() - Number($("#drag_wrap_content").css("paddingTop").match(/\d+/g))*2 - $("#operational_view").height() - 30);
								for(var i = 0; i <JSON.parse(now_title_handle_view["drilldowndata"])["showList"]["showList"].length; i++){
									var showList = $("<li datavalue="+(i+1)+" class='drillDownHandle'><img src='/static/statements/img/jt.png' alt='jt'><p>"+JSON.parse(now_title_handle_view["drilldowndata"])["showList"]["showList"][i]+"</p></li>");
									$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul").append(showList);
								}
							}else{
								$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow").hide();
								$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area #view_show_area_content").height($("body").height() - $(".container .topInfo").height() - $(".rightConent #dashboard_content #new_view").height() - $(".rightConent #dashboard_content #action_box").height() - Number($("#drag_wrap_content").css("paddingTop").match(/\d+/g))*2 - $("#operational_view").height());
							}

							$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul li:gt(0)").children("p").each(function(index,ele){
								$(ele).unbind("click");
								$(ele).click(function(event){
									event.stopPropagation();
									drillDownClick($(ele));
								})
							})

							freeHandleDragData = JSON.parse(now_title_handle_view["drilldowndata"])["viewClickChange"];

						}else if(JSON.parse(now_title_handle_view["drilldowndata"])["showList"] != undefined && JSON.parse(now_title_handle_view["drilldowndata"])["showList"]["peterList"] != undefined){
							editViewDimenCount = JSON.parse(now_title_handle_view["drilldowndata"])["drillElementCount"];
							freeHandleDragData = drag_row_column_data;
							saveDimeData = JSON.parse(now_title_handle_view["drilldowndata"])["saveDimeData"];
							saveDrillDownTemp = JSON.parse(now_title_handle_view["drilldowndata"])["saveDrillDownTemp"];
							saveDrillCount = JSON.parse(now_title_handle_view["drilldowndata"])["saveDrillCount"];
							saveDrillDownDict = JSON.parse(now_title_handle_view["drilldowndata"])["saveDrillDownDict"];
						}else{
							editViewDimenCount = null;
							freeHandleDragData = drag_row_column_data;
						}

						editViewPostData = JSON.parse(now_title_handle_view["handledatapost"]);

						oldViewToShow = true;

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
						reason_old_show(freeHandleDragData,current_cube_name,now_title_handle_view,drag_measureCalculateStyle,indexEdit,editViewDimenCount);
					}



					function dashboard_edit_view_handle(){
						if(isOnlyLoad){
							$("#dashboard_content #new_view ul .edit_list").remove();
						}
						$.post("../dashboard/getAllData",function(result){

						if(Object.getOwnPropertyNames(result).length != 0){

							ajax_data_post = result;
							// if(sessionStorage.getItem("edit_view_now")){

							// 	}
							view_homo_data = {};
							for(folder in result){
								for(folder_view in result[folder]){
									for(folder_view_name in result[folder][folder_view]){
										if(result[folder][folder_view][folder_view_name]["viewname"] == null){
											var tableViewName = folder_view +"-"+folder_view_name;
											var changeViewName = folder_view_name;
										}else{
											var tableViewName = folder_view +"-"+result[folder][folder_view][folder_view_name]["viewname"];
											var changeViewName = result[folder][folder_view][folder_view_name]['viewname'];
										}
										preClickView[tableViewName] = result[folder][folder_view][folder_view_name];
									//显示名称
										var add_view_post_name = folder_view+"-"+folder_view_name;
										view_homo_data[add_view_post_name] = result[folder][folder_view][folder_view_name];

										if(view_homo_data[add_view_post_name]["isopen"]){
											if(sessionStorage.getItem("edit_view_now")){
												//获取编辑的视图
												var hava_view_edit_old = sessionStorage.getItem("edit_view_now");
												var have_view_edit = sessionStorage.getItem("edit_view_now").split(",");
												if(view_homo_data[add_view_post_name]["id"] == result[have_view_edit[0]][have_view_edit[1]][have_view_edit[2]]["id"]){
													folder_view_add_show(have_view_edit[1]+"-"+changeViewName,"edit",hava_view_edit_old,result[have_view_edit[0]][have_view_edit[1]][have_view_edit[2]]["id"]);
													continue;
											   }
											}
											// folder_view_add_show(folder_view+"-"+changeViewName,"new",folder+","+folder_view+","+folder_view_name+","+result[folder][folder_view][folder_view_name]["tablename"],result[folder][folder_view][folder_view_name]["id"]);

									}

								}
							}

						}

						}
					})

					if_or_load = true;
					}

					 // 创建左侧列表一个指标元素
				 function createAIndexElementToLeftList(indexContent,isnewAdd){

				 	var indexLi = $("<li class='index_li'><div class='index_list_text'><span class='index_list_text_left'>"+indexContent+"</span><div class='moreSelectBtn'><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'/></div></div>"+"<input class='userinput' value="+indexContent+"></li>");

				 	$("#dashboard_content #lateral_bar #indicator #index_show ul").prepend(indexLi);
				 	indexLi.find(".userinput").data("originalValue",indexContent).css("textIndent","5px");
				 	indexLi.unbind("mouseenter");
				 	indexLi.on("mouseenter", function(event) {
				 			event.stopPropagation();
				 			$(this).find(".index_list_text").css({
								height: "21px",
								border: "1px solid #2ee1ed",
								lineHeight: "21px",
								padding: "0px 4px",
								background:"#a7eff4"
							});
							$(this).find(".moreSelectBtn").show();
					})

					indexLi.on("mouseleave", function() {
						$(this).find(".index_list_text").css({
							background: "white",
							height: "23px",
							lineHeight: "23px",
							padding: "0px 5px",
							border: "none",
						});
						$(this).find(".moreSelectBtn").hide();
						$(this).find("#indexHandle").remove();
					});

					//更多按钮点击事件
					indexLi.find(".moreSelectBtn").unbind("click");
					indexLi.find(".moreSelectBtn").click(function(event){
						event.stopPropagation();
						var showIndexWall = $("<ul id='indexHandle'><li class='indexChangeName'>重命名</li><li class='indexRename'>移除</li></ul>");
						showIndexWall.appendTo($(this).parents(".index_li"));
						$(showIndexWall).css({
							"top":$(this).parents("li").eq(0).offset().top-47+'px',
						});

						//重命名
						showIndexWall.children(".indexChangeName").unbind("click");
						showIndexWall.children(".indexChangeName").click(function(event){
							event.stopPropagation();
							$(this).parents(".index_li").find(".index_list_text").hide();
				 			$(this).parents(".index_li").find(".index_list_text").siblings(".userinput").show();
				 			$(this).parents(".index_li").find(".index_list_text").siblings(".userinput").get(0).focus();
				 			$(this).parent("#indexHandle").remove();
						})

						//移除
						showIndexWall.children(".indexRename").unbind("click");
						showIndexWall.children(".indexRename").click(function(event){
							var tempThis = $(this);
							event.stopPropagation();
							$.ajax({
								url:"/dashboard/indexGet",
								type:"post",
								dataType:"json",
								contentType: "application/json; charset=utf-8",
								async: true,
								data:JSON.stringify({"tablename":current_cube_name,"indexname":$(this).parents(".index_li").find(".index_list_text .index_list_text_left").text(),"remove":"yes"}),
								success:function(result){
									if(result["status"] == "success"){
										tempThis.parents(".index_li").remove();

										var originalValueInput = tempThis.parents(".index_li").find(".index_list_text .index_list_text_left").text();

										getIndexNameDict[current_cube_name].splice($.inArray(originalValueInput,getIndexNameDict[current_cube_name]),1);

										//指标如果正在展示移除
										if($("#dashboard_content .handleAll_wrap #operational_view #drag_wrap_content #drag_zb #drop_zb_view li[title="+originalValueInput+"]").length > 0){
											$("#dashboard_content .handleAll_wrap #operational_view #drag_wrap_content #drag_zb #drop_zb_view li[title="+originalValueInput+"]").remove();
											if($("#dashboard_content .handleAll_wrap #operational_view #drag_wrap_content #drag_zb #drop_zb_view li[title="+originalValueInput+"]").parent().hasClass("list_wrap")){
												$("#dashboard_content .handleAll_wrap #operational_view #drag_wrap_content #drag_zb #drop_zb_view li[title="+originalValueInput+"]").parent().remove();
											}
											empty_viem_init("change");
										}
									}
								}
							});
						})

					})

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
							data:JSON.stringify({"tablename":current_cube_name,"indexname":originalVal,"newname":newValue}),
							success:function(data){
								// console.log("changeName:",data);
								getIndexNameDict[current_cube_name][$.inArray(originalVal,getIndexNameDict[current_cube_name])] = newValue;
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
				 		indexLi.attr("tablename",$('#lateral_title .custom-select').val());

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
						containment:$("body"),
						start: function() {
							$(".type_wic").remove();
							//恢复滚动
							enable_scroll();
							//恢复绑定事件
							$(".dimensionality_datatype").css("background", "");
						}
					});

					$("#drop_zb_view").droppable({
						accept:".index_list_text",
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
								$("<li class='index_row_list' title="+ui.draggable.find("span").text()+"></li>").html($(ui.draggable).parent().html()).appendTo(this);

								$(".index_row_list").each(function(index, ele) {
									if($(ele).parent().attr("class") != "list_wrap") {
										$(ele).wrap("<div class='list_wrap'></div>");
									}
								})
								$(this).find("li").css({
									width: mideiCountData + "px",
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
											data:JSON.stringify({"tablename":current_cube_name,"indexname":ui.draggable.find("span").text()}),
											success:function(result){
												deleteDrillFun();
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
								$("#view_show_area_content").css("border","1px solid #4169E1");
							},
							update:function(event,ui){
									noDrop = true;
									event.stopPropagation();
									//判断拖入视图展示区域移除指标
									if($("#view_show_area_content").find(".index_row_list").length > 0){
										$("#view_show_area_content").find(".index_row_list").remove();
										$(".handleAll_wrap #operational_view #drag_zb .annotation_text,#view_show_area_content").css("border","none");
										empty_viem_init();
										$(".handleAll_wrap #operational_view #drag_zb .annotation_text,#view_show_area_content").css("background","").css("border","none");
										$("#drag_zb .annotation_text").droppable("option", "disabled", false);
									}
							},
							stop:function(){

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

					function deleteBtnClickDash(title,view_title_index){
							$(".rightConent #dashboard_content #new_view ul li[title="+title+"]").remove();
							for(var i = 0; i < $(".rightConent #dashboard_content #new_view ul li").length;i++){
								add_view_count = $(".rightConent #dashboard_content #new_view ul li").eq(i).attr("title").match(/\d+/g);
								if(add_view_count < $(".rightConent #dashboard_content #new_view ul li").eq(i).attr("title").match(/\d+/g)){
									add_view_count = $(".rightConent #dashboard_content #new_view ul li").eq(i).attr("title").match(/\d+/g);
								}
								$(".rightConent #dashboard_content #new_view ul li").eq(i).attr("title_change",i);

							}
							$("#new_view").width($("#pageDashboardModule #dashboard_content").width());
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
										deleteDrillFun();
										// empty_viem_init();
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

										empty_viem_init("change");
									}
								}
								if($.inArray($("#pageDashboardModule #clickWallDelete").data("nowDeleteView"),deleteDataHandleArr) == -1){
									if(preClickView[$("#pageDashboardModule #clickWallDelete").data("nowDeleteView")] != undefined){
										delete preClickView[$("#pageDashboardModule #clickWallDelete").data("nowDeleteView")];
									}
								}
								//判断是否标签页是否全部删除
								if($(".rightConent #dashboard_content #new_view ul li").length == 0){
									preClickView = {};
									add_view_count = 0;
									folder_view_add_show("新建视图","old");
									preClickView["新建视图"] = null;
								}
					}

					//点击标签页 移除
					function clickViewTo(title){

						if($(".rightConent #dashboard_content #new_view ul li[title="+title+"]").attr("title_change") == $(".rightConent #dashboard_content #new_view ul li").length -1){
							var view_title_index = Number($(".rightConent #dashboard_content #new_view ul li[title="+title+"]").attr("title_change"))-1;
						}else{
							var view_title_index = Number($(".rightConent #dashboard_content #new_view ul li[title="+title+"]").attr("title_change"));
						}
						if($(".rightConent #dashboard_content #new_view ul li[title="+title+"]").hasClass("statementsDelete")){
							deleteBtnClickDash(title,view_title_index);
							return;
						}
						//删除视图对应的显示和关闭
						if(/-/gi.test(title)){
							$.post("../dashboard/setSwitch",{"switch":"isopen","id":$(".rightConent #dashboard_content #new_view ul li[title="+$("#pageDashboardModule #clickWallDelete").data("nowDeleteView")+"]").data("tableViewId")},function(result){
								if(result["status"] == "ok"){
									var freeDashboardData = $(".rightConent #dashboard_content #new_view ul li[title="+$("#pageDashboardModule #clickWallDelete").data("nowDeleteView")+"]").data("edit_view").split(",");
									$("#pageStatementsModule .statement_li[tableCount="+freeDashboardData[freeDashboardData.length -3]+"]").find(".view_show_handle").eq(freeDashboardData[freeDashboardData.length -2]).find(".small_view_text").data("setopen",false);
									deleteBtnClickDash(title,view_title_index);
								}
							});

						}else{
							deleteBtnClickDash(title,view_title_index);
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

						var new_data_name = $("<div class='dashboard_statement_li save_delect clear'><div class='dashboard_statement_li_content'><img src=../static/dashboard/img/form_icon.png  class='view_show_icon'><div class='view_show_name_save filter_view_class'>"+action_input_data+"</div></div><div class='view_show_content'></div></div>");
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

										var oDiv = $("<div class='dashboard_statement_li clear'><div class='dashboard_statement_li_content'><img src=../static/dashboard/img/form_icon.png  class='view_show_icon'><div class='view_show_name_save filter_view_class'>"+small_view_show+"</div></div><div class='view_show_content'></div></div>");
										if(erv_data != "default" && small_view_show != ""){
											oDiv.find(".view_show_name_save").parent().parent().addClass("floder_view_wrap");
											oDiv.appendTo(folder);
											folder.find(".dashboard_statement_li").find(".view_show_name_save").css("width","324px");

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
							$(ele).parent().parent().find(".dashboard_statement_li").toggle("blind",200,function(){
								if($(ele).parent().parent().find(".dashboard_statement_li").css("display") == "none"){
								$(ele).attr("src","/static/dashboard/img/left_40.png");
								}else{
								$(ele).attr("src","/static/dashboard/img/left_35.png");
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

							$.post("../dashboard/getAllData",function(result){
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

									 mideiCountData = $("#drop_row_view").width() * 0.91;
									 clickViewTo($(nowDeleteElement).attr("title"));
									 $(".main .rightConent #pageStatementsModule").data("isFirstInto",true);
									 if($("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li").length > 0){
										 changePageTo_navReporttingView(true);
										 changeEditViewFunction(editChangeView);
									 }else{
									 	changePageTo_navReporttingView(false);
									 }

									 $("#pageDashboardModule #view_save_up").hide();
									 $("#pageDashboardModule #view_save_up #show_excel_name").html("");
									 $("#pageDashboardModule #body_content_shadow").hide();
									 preClickView[$("#pageDashboardModule #dashboard_content #new_view .auto_show").find(".folderview_li_span").text()] = realSaveData();

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

					//判断两个视图对象的内容是否相等
					function SecondDict(obj1,obj2){
						if(obj2 == null && obj1["viewtype"] != null){
							return false;
						}
						if(obj2["id"] != undefined){
							delete obj2["viewname"];
							delete obj2["id"];
							delete obj2["isopen"];
							delete obj2["note"];
							delete obj2["show"];
							delete obj2["username"];
							delete obj2["status"];
							obj2["defaultparent"] = "default";
						}

						if(obj1["viewtype"] == null || equalCompare(obj1,obj2)){
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
							folderview_li.addClass("edit_list").prependTo($(".rightConent #dashboard_content #new_view ul")).attr("tableShowId",tableViewId);
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

							if_or_load = true;

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
									empty_viem_init("click");
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

							if($(this).parent().hasClass("statementsDelete")){
								$("#pageDashboardModule #clickWallDelete").data("nowViewIf",false).data("nowDeleteView",$(this).parents(".folderview_li_show").attr("title"));
							}else{
								$("#pageDashboardModule #clickWallDelete").data("nowViewIf",nowViewShow).data("nowDeleteView",$(this).parents(".folderview_li_show").attr("title"));
							}
							

							
							//判断标签页视图是否正在显示
							if(nowViewShow && $.inArray($(this).parents(".folderview_li_show").attr("title"),deleteDataHandleArr) == -1){
								var deleteNowView = realSaveData();
								preClickView[$(this).parents(".folderview_li_show").attr("title")] = deleteNowView;
							}

							if($(this).parent().hasClass("edit_list")){
								var equalView = SecondDict(preClickView[$(this).parents(".folderview_li_show").attr("title")],ajax_data_post[$(this).parent().data("edit_view").split(",")[0]][$(this).parent().data("edit_view").split(",")[1]][$(this).parent().data("edit_view").split(",")[2]]);
							}else{
								var equalView = false;
							}

							if((preClickView[$(this).parents(".folderview_li_show").attr("title")] != null && preClickView[$(this).parents(".folderview_li_show").attr("title")]["viewtype"] != null) && equalView == false && saveViewTableDataDelete && !$(this).parent().hasClass("statementsDelete")){
								$("#body_content_shadow,#pageDashboardModule #clickWallDelete").show().data("titleChange",$(this).parent().attr("title"));
								$("#pageDashboardModule #clickWallDelete .clickWallDelete_viewName").text($(this).parents(".folderview_li_show").attr("title"));
							}else{
								clickViewTo($(this).parent().attr("title"));
							}

						})
						
					}

				/*gxm-----start*/
					$("#view_show_wrap").data("table", "false");

					// 数据块选择 创建
					function cubeSelectContent_fun(build_tables,click_val,newFile){
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
							if(newFile == "addNewFile"){
								return;
							}
							// 展示维度和度量等
							load_measurement_module(click_val)
						}else{
							// 展示维度和度量等
							load_measurement_module(cube_select.val())
						}

						// 数据选择 select 变化的时候，去获取新的数据
						// cube_select.unbind("change");
						cube_select.change(function(event){
							$("#pageDashboardModule #dashboard_content #lateral_bar #indicator #index_show ul").html("");
							event.stopPropagation();
							if($(this).val() && now_build_tables.indexOf($(this).val()) != -1){
								// console.log("c")
								loc_storage.removeItem(current_cube_name);
								if_or_load = true;
								checkedHandle = false;
								empty_viem_init("change");
								isDisaed = false;
								saveScameView =true;
								load_measurement_module(cube_select.val(),"changeData");
							}
							// $("#pageDashboardModule #dashboard_content #lateral_bar #dimensionality .dimensionality_search").hide();
							// $("#pageDashboardModule #dashboard_content #lateral_bar #measurement .dimensionality_search").hide();
						});
					}



					// 加载维度、度量等，需要在 select 加载完毕之后
					function load_measurement_module(current_cube,changeData){
						// 之前选择过的数据块  内存保存一份
						// 记录当前操作数据块的名称
						current_cube_name = current_cube;
						$("#dashboard_content #sizer_place #sizer_content .filter_header_div span.cubeTableName").html(current_cube_name);

						if (_cube_all_data[current_cube_name]) {
							var schema = _cube_all_data[current_cube_name]["schema"];
							filterNeedAllData = null;
							factory_create_li_to_measurement_module(schema);
							return;
						}else{
							saveScameView = true;
						}

						if(saveScameView){
								//1、需要加载这个表格的 column schema
								$.ajax({
									url:"/cloudapi/v1/tables/" +current_cube+"/schema",
									type:"post",
									dataType:"json",
									beforeSend:function(){
										var target =  $("#view_show_wrap").get(0);
										 if(spinner.el == undefined){
							                spinner.spin(target);
							                $(".maskLayer").show();
							              }
									},
									success:function(data){
										if (data["status"] == "success") {
											var cube_all_data = data["results"];

											var schema = cube_all_data["schema"];

											for(var i = 0;i < schema.length;i++){
												schema[i]["isable"] = "yes";
											}
											_cube_all_data[current_cube_name] = cube_all_data;

											filterNeedAllData = null;
											
											factory_create_li_to_measurement_module(_cube_all_data[current_cube_name].schema);
										}

									}
								});
						}
						// 清空右侧智能筛选选择的日期
						function emptySetTableDateSelectRecordFunction(){
							 currentSetTableDateFieldArray = [];
							 currentSetTableDateFieldName = null;
							 currentSetTableDateMinDate = null;
							 currentSetTableDateMaxDate = null;
						}

						//2、工厂，根据数据去创建 维度和度量等的 Li
						function factory_create_li_to_measurement_module(schema){
							// 清空展示区域
						$("#dimensionality #dimensionality_show ul").html("");
						
						$("#measurement #measure_show ul").html("");
							emptySetTableDateSelectRecordFunction();
							showTongbiMeasureArray = [];
							showHuanbiMeasureArray = [];
							for (var i = 0; i < schema.length;i++) {
								var column_name_info = schema[i];
								var  _name = column_name_info["field"]; // 字段名
								var _data_type = column_name_info["type"];  // 字段的数据类型
								if(_data_type.isTypeDate()){
									currentSetTableDateFieldArray.push(_name);
								}
								var _show_type = column_name_info["coltype"]; // 维度还是度量，返回值是一个字符串
								var type_indictot_img_path = _data_type.image_Name_Find(_show_type);	 // 数据类型指示图片的路径

					var aLi = $("<li class='" + _show_type+"_li leftNav_list'>"+"<div class='dimensionality_datatype'><img alt='datatype' src="+type_indictot_img_path+"/></div><div class='drop_list_main " + _show_type + "_list_main'"+"><div class='drop_main clear set_style " + _show_type + "_list_text'><span class=" + _show_type + "_list_text_left" + " dataType = "+_name+":"+_data_type+">"+_name+"</span></div></div></li>");
					aLi.find(".set_style").append("<div class='moreSelectBtn'><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'/></div>");

								// 用来记录数据类型
								aLi.find(".drop_main").eq(0).data("type",_data_type);


								$("#"+_show_type+"_show ul").append(aLi);

							}

							// 特殊处理，判断显示筛选器部分还是显示图形部分
							decideSizeWrapAndProjectShowModuleFunction();

							var specialLi= $("<li class='" + "measure"+"_li leftNav_list'>"+"<div class='dimensionality_datatype'><img alt='datatype' src="+"/static/dataCollection/images/tableDataDetail/Integer.png"+"/></div><div class='drop_list_main " + "measure" + "_list_main'"+"><div class='recordCount drop_main clear set_style " + "measure" + "_list_text'><span class=" + "measure" + "_list_text_left" + " dataType = "+_name+":"+_data_type+">"+"记录数"+"</span></div></div></li>");
							specialLi.find(".set_style").append("<div class='moreSelectBtn'><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'/></div>");
							specialLi.find(".drop_main").eq(0).data("type","number");
							$("#measure_show ul").append(specialLi);
							if(currentSetTableDateFieldArray.length == 0){
									getFilterAllData();
									if(!if_or_load){
										empty_viem_init("change");
										//视图编辑修改
										dashboard_edit_view_handle();
									}
							}
							// 调用页面默认初始化
							if(isDisaed){
								navDashboardEventInit();
							}else{
								navDashboardEventInit(true);
							}

							//加载分层结构
							$.ajax({
								url:"/dashboard/layoutHandle",
								type:"post",
								dataType:"json",
								contentType: "application/json; charset=utf-8",
							    "data":JSON.stringify({"statu":"search","tablename":current_cube_name}),
								success:function(data){
									if(data["status"] == "success"){
										if(data["data"].length > 0){
											onlyDragPeter(data["data"]);
										}else{
											$("#parameter_show").html("");
										}
										
									}

								}
							})


						if(getIndexNameDict[current_cube_name] != undefined && getIndexNameDict[current_cube_name].length > 0 && $("#dashboard_content #lateral_bar #indicator #index_show ul .index_li").length == 0){
							
							for(var i =0;i < getIndexNameDict[current_cube_name].length;i++){
									createAIndexElementToLeftList(getIndexNameDict[current_cube_name][i],false);
							}
							return;
						}

						if(getIndexNameDict[current_cube_name] == undefined){
							//加载指标
							$.ajax({
								url:"/dashboard/indexGet",
								type:"post",
								dataType:"json",
								contentType: "application/json; charset=utf-8",
							    "data":JSON.stringify({"tablename":current_cube_name}),
								success:function(data){
									if (data.status == "success") {
										getIndexNameDict[current_cube_name]= data.indexNameList;
										// $("#pageDashboardModule #dashboard_content #lateral_bar #indicator #index_show ul").html("");
										for(var i =0;i < data.indexNameList.length;i++){
											createAIndexElementToLeftList(data.indexNameList[i],false);
										}
									}
								}
							})
						}



						}



					}


				//初始化表标题
				function initTable_name(){
						$("#view_show_area #view_show_area_content .tableView_name h4").html("添加表标题");
						$("#view_show_area #view_show_area_content .tableView_name").css("color","#B4B4B4").hide();
					}
					// 如果当前构建的集合表存在日期字段，判断筛选器和图形界面怎么显示
					function decideSizeWrapAndProjectShowModuleFunction(){
							if(currentSetTableDateFieldArray.length > 0){
								$("#sizer_content .dateSelectDataModule .fieldSelectPart>.fieldSelect-box .custom-select").html("");
								$("#sizer_content .dateSelectDataModule").show();
								for (var i =0;i < currentSetTableDateFieldArray.length;i++) {
									var op = $("<option value="+currentSetTableDateFieldArray[i]+">"+currentSetTableDateFieldArray[i]+"</option>");
									$("#sizer_content .dateSelectDataModule .fieldSelectPart>.fieldSelect-box .custom-select").eq(0).append(op);
								}
								$("#sizer_content .dateSelectDataModule .fieldSelectPart>.fieldSelect-box .custom-select").eq(0).comboSelect();
								$("#sizer_content .dateSelectDataModule .fieldSelectPart>.fieldSelect-box .custom-select").eq(0).change(function(event){
										$(".startDateInput-box").html("").append("<input  type='text' class='startDateInput' />");
										$(".endDateInput-box").html("").append("<input  type='text' class='endDateInput' />");
										sizeWrapModuleDateHandleFunction("change");

								});
								sizeWrapModuleDateHandleFunction();
								showSizeWrapModule_function();
								$("#sizer_content .filter_body_div").height($("#sizer_place").height()-$("#sizer_content .filter_header_div").height() - $("#sizer_content .dateSelectDataModule").height());
							}else{
								$("#sizer_content .filter_body_div").height($("#sizer_place").height()-$("#sizer_content .filter_header_div").height());
								$("#sizer_content .dateSelectDataModule").hide();
								showProjectModule_function();
								// getFilterAllData();
							}
					}
					// 默认显示一个月的时间
					function sizeWrapModuleDateHandleFunction(change){
							var theSelect = $("#sizer_content .dateSelectDataModule .fieldSelectPart>.fieldSelect-box .custom-select").eq(0);
							currentSetTableDateFieldName = theSelect.val();
							dataHandleWork("dashBoard",current_cube_name,theSelect.val(),"dateType",function(data){

								var backgroundMinDate = new Date(data.min);
								var backgroundMaxDate = new Date(data.max);
								var backgroundMaxDate_year = backgroundMaxDate.getFullYear();
								var backgroundMaxDate_month = backgroundMaxDate.getMonth();
								var backgroundMaxDate_day = backgroundMaxDate.getDate();

								var today = new Date();
								var today_year = today.getFullYear();
								var today_month = today.getMonth();
								var today_day = today.getDate();
								var defaultMinDate = null;
								var defaultMaxDate = null;
								if(backgroundMaxDate > today){
									defaultMinDate = new Date(today_year,today_month,1);
									defaultMaxDate = new Date(today_year,today_month,getDaysInOneMonth(today_year,today_month));
								}else{
									defaultMinDate = new Date(backgroundMaxDate_year,backgroundMaxDate_month,1);
									defaultMaxDate = new Date(backgroundMaxDate_year,backgroundMaxDate_month,backgroundMaxDate_day);
								}
								$("#sizer_content .dateSelectDataModule .startDatePart>.startDateInput-box input").val(formatDate(defaultMinDate).replace(/-/g,"/"));
								$("#sizer_content .dateSelectDataModule .endDatePart>.endDateInput-box input").val(formatDate(defaultMaxDate).replace(/-/g,"/"));
								
								// 开始日期
								$("#sizer_content .dateSelectDataModule .startDatePart>.startDateInput-box input").datepicker({
									dateFormat:"yy/mm/dd",
										 changeYear: true,
										 minDate:backgroundMinDate,
										 maxDate:backgroundMaxDate,
										 defaultDate:defaultMinDate,
										 buttonImage:"/static/images/contentFilter/calendar.png",
										 buttonText:"选择开始日期",
										 showOn: "both",
										 buttonImageOnly: true,
								});

								// 结束日期
								$("#sizer_content .dateSelectDataModule .endDatePart>.endDateInput-box input").datepicker({
									dateFormat:"yy/mm/dd",
										 changeYear: true,
										 minDate:backgroundMinDate,
										 maxDate:backgroundMaxDate,
										 defaultDate:defaultMaxDate,
										 buttonImage:"/static/images/contentFilter/calendar.png",
										 buttonText:"选择结束日期",
										 showOn: "both",
										 buttonImageOnly: true
									});
								currentSetTableDateMinDate = $("#sizer_content .dateSelectDataModule .startDatePart>.startDateInput-box input").val();
								currentSetTableDateMaxDate = $("#sizer_content .dateSelectDataModule .endDatePart>.endDateInput-box input").val();

								if(change == undefined){
									getFilterAllData();
								}else{
									isagainDrawTable = true;
									switch_chart_handle_fun();
									getFilterAllData();
								}
								
								if(!if_or_load){
									empty_viem_init("change");
									//视图编辑修改
									dashboard_edit_view_handle();
								}
								// 监测日期发生变化的时候
								$("#sizer_content .dateSelectDataModule .startDatePart>.startDateInput-box input,#sizer_content .dateSelectDataModule .endDatePart>.endDateInput-box input").unbind("change");
								$("#sizer_content .dateSelectDataModule .startDatePart>.startDateInput-box input,#sizer_content .dateSelectDataModule .endDatePart>.endDateInput-box input").change(function(){
			 					  currentSetTableDateMinDate = $("#sizer_content .dateSelectDataModule .startDatePart>.startDateInput-box input").val().replace(/\//g,"-");
			 					  currentSetTableDateMaxDate = $("#sizer_content .dateSelectDataModule .endDatePart>.endDateInput-box input").val().replace(/\//g,"-");
			 					  isagainDrawTable = true;
			 					  switch_chart_handle_fun();
			 					  getFilterAllData();
								});
							},change);
					}

					function showProjectModule_function(){
						$("#project").find("img").attr("src","/static/dashboard/img/design_sel.png");
						$("#sizer_wrap").find("img").attr("src","/static/dashboard/img/sxq.png")
						$("#sizer_wrap .sizer_line").css("background", "#DEDEDE");
						$("#project .sizer_line").css("background", "#0d53a4");
						$("#sizer_content").hide();
						$("#project_chart").show();
						$("#sizer_mpt").hide();
					}
					function showSizeWrapModule_function(){
						$("#sizer_wrap").find("img").attr("src","/static/dashboard/img/sxq-sel.png");
						$("#project").find("img").attr("src","/static/dashboard/img/design.png");
						$("#project .sizer_line").css("background", "#DEDEDE");
						$("#sizer_wrap .sizer_line").css("background", "#0d53a4");
						$("#sizer_content").show();
						$("#project_chart").hide();
						if($(".drog_row_li st").length < 1 && currentSetTableDateFieldArray.length  < 1) {
							$("#sizer_mpt").show();
							$("#view_show_empty").show();
							initTable_name();
							$("#sizer_content").hide();
						}
					}


				 //仪表板功能操作初始化
				 function navDashboardEventInit(autoDrag){
				 	if(autoDrag && $("#pageDashboardModule").hasClass("handleTrue")){
				 		drag();
				 		return;
				 	}
				 	//.........................仪表板工具栏操作
				 	isDisaed = false;
					//小部件操作栏事件
					function small_handle_btn(){

						if("新建视图" in preClickView == false){
							preClickView["新建视图"] = null;
							folder_view_add_show("新建视图","old");
						}
						// if($(".rightConent #dashboard_content #new_view ul li").find("span").text() == "新建视图"){
						// 		$(".rightConent #dashboard_content #new_view ul li").addClass("auto_show");
						// 	}
						//添加视图
						$("#action_box .action_add_view").unbind("click");
						$("#action_box .action_add_view").on("click",function(){
							var saveNowWallAllNew = realSaveData();
							if(addNewViewHandle){
								if(add_view_count == 0){
									preClickView["新建视图"] = saveNowWallAllNew;
								}else{
									preClickView["新建视图"+add_view_count+""] = saveNowWallAllNew;
								}
							}


							add_view_count++;
							folder_view_add_show("新建视图"+add_view_count+"","old");
							preClickView["新建视图"+add_view_count+""] = null;
							empty_viem_init("change");
							addNewViewHandle = true;
						})

						//清空视图
						$("#action_box .action_delect_view").unbind("click");
						$("#action_box .action_delect_view").on("click",function(){
							empty_viem_init("change");
							$("#project_chart ul .show_view_success").removeClass("clicked");
							delete preClickView[$(".auto_show").find("span").text()];
							// console.log(preClickView);
						})
					}
					small_handle_btn();
					closeViewSave();


					//下钻弹窗搜索功能
					inputSearch($("#dashboard_content #view_show_area #view_show_area_content .drillUpAndDrillDownSelection .drillDownSearch .drillDownSearchInput"),"drillDownShowLi",$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList ul"),"filter");


					$("#pageDashboardModule").addClass("handleTrue");
					//维度度量操作功能部分
					function mdHandleFun(){
						//搜索功能
						$("#pageDashboardModule #dashboard_content #lateral_bar .search").click(function(event){
							event.stopPropagation();
							if($(this).parents(".mdContent").find(".dimensionality_search").css("display") == "block"){
								$(this).parents(".mdContent").find(".dimensionality_search").hide(300);

								$(this).parents(".mdContent").find(".viewTableShow").stop(true).animate({
									"height":$(this).parents(".mdContent").height() - 32 + "px",
								},300);

							}else{
								$(this).parents(".mdContent").find(".dimensionality_search_input").focus();
								$(this).parents(".mdContent").find(".dimensionality_search").show(300);
								$(this).parents(".mdContent").find(".viewTableShow").stop(true).animate({
									"height":$(this).parents(".mdContent").height() - 22 - 32 + "px",
								},300);
							}
						})
						inputSearch($("#pageDashboardModule #dashboard_content #lateral_bar #dimensionality .dimensionality_search_input"),"dimensionality_list_text_left",$("#pageDashboardModule #dashboard_content #lateral_bar #dimensionality #dimensionality_show ul"),"md");
						inputSearch($("#pageDashboardModule #dashboard_content #lateral_bar #measurement .dimensionality_search_input"),"measure_list_text_left",$("#pageDashboardModule #dashboard_content #lateral_bar #measurement #measure_show ul"),"md");


						// $("#pageDashboardModule #dashboard_content #lateral_bar #dimensionality .dimensionality_search_input").on("focusout",function(event){
						// 	$("#pageDashboardModule #dashboard_content #lateral_bar #dimensionality .dimensionality_search").hide(300,function(){
						// 		$("#pageDashboardModule #dashboard_content #lateral_bar #dimensionality .viewTableShow").height($("#pageDashboardModule #dashboard_content #lateral_bar #measurement").height() -32);
						// 	});
						// })

						// $("#pageDashboardModule #dashboard_content #lateral_bar #measurement .dimensionality_search_input").on("focusout",function(){
						// 	$("#pageDashboardModule #dashboard_content #lateral_bar #measurement .dimensionality_search").hide(300,function(){
						// 		$("#pageDashboardModule #dashboard_content #lateral_bar #measurement .viewTableShow").height($("#pageDashboardModule #dashboard_content #lateral_bar #measurement")-32);
						// 	});
						// })


					}
					mdHandleFun();


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
						showProjectModule_function();
					});
					$("#sizer_wrap").on("click", function() {
						showSizeWrapModule_function();
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


				function drag(){
						// var view_show = $(".annotation_text").width() * 0.91;

						$("#lateral_bar .set_style").each(function(index,ele){
								//移入事件
								$(ele).parent().on("mouseenter", function() {
									switch($(ele).find("span").attr("class")) {
										case "dimensionality_list_text_left":
											$(ele).css("background", "#c5e0ff").css("border","1px solid #86a9d1");
											break;
										case "measure_list_text_left":
											$(ele).css("background", "#ffcc9a").css("border","1px solid #ffbe7f");
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
												success:function(data){console.log(data);}
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
									containment:$("body"),
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
													top: $(ele).parent().offset().top - 50 + 22 + "px",
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


								//层级结构放置
								$("#parameter_show").droppable({
									accept: $(".dimensionality_list_text"),
									greedy: true,
									drop:function(event,ui){
											if($(event.target).hasClass("parameterContent")){
													var current_li = $("<div class='parameterElement clear'></div>").html("<div class='parameterChlid' dataValue='0'><div class='imageShowContent imageShowTra'><img src='/static/dashboard/img/left_35.png' alt='tra' class='pereterTra'></div><div class='imageShowContent'><img src='/static/dashboard/img/dashboard_icon3.png' alt='hierarchyImg'></div><span class='perterSpan' datatype="+$(ui.draggable).find(".dimensionality_list_text_left").attr("datatype")+">"+$(ui.draggable).text()+"</span></div><div class='pereterArea clear'></div>");
													current_li.appendTo($(this));
													postPeterDict = {"statu":"add","tablename":current_cube_name,"structure":getPeterOnly(current_li)};
													peterAddChange(postPeterDict,current_li);
													eachMouse(current_li.find("span"));
													peterHandleCommon(current_li,$(ui.draggable).data("type"));

											}

									}
								});


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
											if($(ui.draggable).hasClass("perterSpan") && $(".peterMouse").length != 0){
												return;
											}

			
											if($(".peterMouse").length  <= 1){
												if(dirllConditions && dirllConditions.length > 0 && $(".clickActive").length == 0){
													
													drag_row_column_data = saveDrillPreView["viewdata"];
													save_now_show_view_text = $("#"+saveDrillPreView["viewType"]+"");
													deleteDrillFun();
												}
											}
											$("#sizer_mpt").hide();
											$("#view_show_empty").hide();
											$("#view_show_area #view_show_area_content .tableView_name").show();
											if($("#project_chart").css("display") == "none") {
												$("#sizer_content").css("display", "block");
											}
											$(this).find(".drag_text").css("display", "none");

											if($(this).attr("id") == "view_show_area_content"){
													
													//拖到此区域删除元素
													if($(ui.draggable).parent().hasClass("parameterChlid")){
														var freeElement = $(ui.draggable).parents(".parameterElement");
														$(ui.draggable).parents(".parameterElement").remove();
														postPeterDict = {"statu":"remove","id":freeElement.attr("handleId")};
														peterAddChange(postPeterDict);
													}else if($(ui.draggable).parent().hasClass("currentChildren")){
														var freeElement = $(ui.draggable).parents(".parameterElement");
														if($(ui.draggable).parents(".currentChildren").attr("dataValue") == 2){
															$(ui.draggable).parents(".currentChildren").remove();
														}else{
															$(ui.draggable).parents(".parameterElement").find(".parameterChlid .imageShowTra").hide();
															$(ui.draggable).parents(".parameterElement").find(".parameterChlid .perterSpan").width(148);
															$(ui.draggable).parents(".pereterArea").html("");
															
														}
														postPeterDict = {"statu":"change","structure":getPeterOnly(freeElement),"id":freeElement.attr("handleId")};
														peterAddChange(postPeterDict);
													}else if($(ui.draggable).hasClass("perterWallContentList")){
														//分层下钻恢复初始化
														saveDrillCount = [];
														$(".peterMouse").removeClass("clickActive");
														$(".peterMouse[datavalue='0']").addClass("clickActive");
														peterDrillDown();
														deleteDrillFun();
														$(ui.draggable).parent().find(".secondMenuText").each(function(index,ele){
															delete saveDrillDownDict[$(ele).text()];
															delete saveDrillDownTemp[$(ele).text()];
														})

														if($(ui.draggable).attr("dataValue") == 2){
															$(ui.draggable).parents(".perterWallContent").find(".perterSecond .downImgContent").css("display","inherit").css("visibility","hidden");
															$(ui.draggable).remove();

														}else{
															$(ui.draggable).parents(".drog_row_list").find(".drop_main .downImgContent").hide();
															$(ui.draggable).parent(".perterWallContent").html("");
															
														}
														drag_row_column_data = JSON.parse(JSON.stringify(saveDrillDownTemp[$(".clickActive").find("span").text()]["viewdata"]));
														save_now_show_view_text = $("#"+ saveDrillDownTemp[$(".clickActive").find("span").text()]["viewType"]+"");														
														switch_chart_handle_fun();
													}
													return;
											}



											if($(ui.draggable).hasClass("perterSpan")){
												var freeElementArr = [];
												$("#pageDashboardModule #dashboard_content #lateral_bar #parameter #parameter_show .perterSpan").each(function(index,ele){
													freeElementArr.push($(ele).attr("datatype"));
												})
												var current_li = peterDrillShowHandle(freeElementArr,$(this));

												var _field_name =$(ui.draggable).text(); // 字段名
											}else{

												var current_li = $("<li class='drog_row_list'></li>").html($(ui.draggable).parent().html());
												current_li.find(".set_style").on("mouseenter",function(){$(this).find(".moreSelectBtn").show()});
												current_li.find(".set_style").on("mouseleave",function(){$(this).find(".moreSelectBtn").hide()});
												$(current_li).data("field_name",$(ui.draggable).find("span.measure_list_text_left").text());
												$(this).find("img").css({
													display: "block",
												})
												current_li.appendTo($(this));
												var _field_name =$(ui.draggable).children("span").eq(0).html(); // 字段名
											}


											$(".drog_row_list").each(function(index, ele) {
												if(!$(ele).parent().hasClass("list_wrap")) {
													$(ele).wrap("<div class='list_wrap clear'></div>");
												}
											});




											//判断拖拽元素颜色
											if(current_li.find(".set_style span").hasClass("dimensionality_list_text_left")){
												var elementToType = "dimensionality";
												if(current_li.find(".set_style span").hasClass("perterHandle")){
													current_li.css("background","");
													current_li.find(".drop_main").not($(".clickActive")).css("border","1px solid #DEDEDE");
												}else{
													current_li.find(".drop_main").addClass("noPerter").css("background","#c5e0ff").css("border","1px solid #86a9d1");
												}
												
											}
											if(current_li.find(".set_style span").hasClass("measure_list_text_left")) {
												var elementToType = "measure";
												current_li.find(".drop_main").css("background","#ffcc9a").css("border","1px solid #ffbe7f");
											}
											$(this).find("li").css({
												width: mideiCountData + "px",
												lineHeight: "23px",
												margin: "5px auto 0",
												listStyle: "none",
											}).addClass("drog_row_list date_list bj_information");
											$(this).find(".set_style").css({
												width: "94%",
												height: "23px",
												padding: "0px 5px",
												color: "black"
											});
											$(this).find(".set_style").find("span").css({
												float: "left",
												display: "block",
											});


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
													width: mideiCountData + "px",
													
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
														width: mideiCountData * 0.85 + "px",
													}).addClass("date_list").addClass("bj_color");

												})

												markShow();

											}

											//提示
											if($(this).attr("id") == "reminder") {
												//遍历展示窗有没有重复的元素
												$("#handle_color_text").find(".color_icon_wrap").find("img[alt=" + $(this).find(".handle_bj").text() + "]").parent().parent().remove();
												$(this).find(".list_wrap").css({
													width: mideiCountData + "px",
													
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
														width: mideiCountData * 0.85 + "px",
													}).addClass("date_list").addClass("bj_prompt");

												})

												markShow();

											}
											//详细
											if($(this).attr("id") == "information") {
												//
												$(this).find(".list_wrap").css({
													width: mideiCountData + "px",
													
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
														width: mideiCountData * 0.85 + "px",
													}).addClass("date_list").addClass("bj_information");

												});

												markShow();

											}

											var _dataType = ui["draggable"].data("type");// 元素数据类型
											var _wd_type = elementToType;// 维度还是度量。。。
											
											_drag_message["type"] = _wd_type;
											if(_wd_type == "measure"){
												if(allKeys(drag_measureCalculateStyle).indexOf(_field_name) == -1){
													drag_measureCalculateStyle[_field_name] = "求和("+_field_name+")";
													$(current_li).find("span.measure_list_text_left").html("求和("+_field_name+")");
													if(_field_name == "记录数"){
														drag_measureCalculateStyle[_field_name] = "计数("+_field_name+")";
														$(current_li).find("span.measure_list_text_left").html("计数("+_field_name+")");
													}
												}else{
													$(current_li).find("span.measure_list_text_left").html(drag_measureCalculateStyle[_field_name]);
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
													var bz_margin = ($("#handle_color_text").width() - mideiCountData) / 2;

													$(this).find(".list_wrap").css({
														width: mideiCountData + "px",
														
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
														width: mideiCountData * 0.85 + "px",
													}).addClass("date_list").addClass("bj_information");


													break;

												default:
													break;
											}


									// 展现 table
									switch_chart_handle_fun();
									//度量更多操作过程
									md_click_show(current_li.find(".moreSelectBtn"),{"编辑计算_YZY_edit_calculation":null,"度量_YZY_measure":["计数_YZY_pop_count_all","求和_YZY_pop_total","平均值_YZY_pop_mean","最大值_YZY_pop_max","最小值_YZY_pop_min"],"同比_YZY_compared":null,"环比_YZY_linkBack":null,"移除对比_YZY_deleteCompared":null,"移除_YZY_deleting":null})

										}

									}).sortable({
										zIndex: "2000",
										items: ".list_wrap",
										// cancel:".list_wrap",
										connectWith: ".drop_view",
										tolerance: "pointer",
										sort: function() {
											$(".drop_view").not($("#view_show_area_content")).addClass("ui-state-default_z");
											$("#view_show_area_content").css("border","1px solid #4169E1");
											if($(this).attr("id") == "handle_color_text") {
												$(this).find("li").css({
													width: mideiCountData * 0.85 + "px",
												});
											};

											$(".list_wrap").find(".label_icon_wrap").parent().remove();


										},
										beforeStop: function(event,ui) {
											$(".drop_view").removeClass("ui-state-default_z");
											$("#view_show_area_content").css("border","");
										},

										// over: function() {
										// 	$(this).css("background", "#DEDEDE")
										// },
										// out: function() {
										// 	$(this).css("background", "");
										// },
										update: function(event,ui) {
											
											event.stopPropagation();
											//排序后重新存储数据

											// function for_row_col(ele){
											// 	//遍历所有行里的li 排序后更新数据
											// 	for(var i = 0; i < $(ele).find("li").length;i++){
											// 		//获取数据字段
											// 		var data_id = $(ele).find("li").eq(i).attr("id").split(":");
											// 		//判断元素的类型
											// 		var data_wd_type = data_id[0];
											// 		//对应的数据
											// 		var sortable_data = data_id[1]+":"+data_id[2];

											// 		drag_row_column_data["column"][data_wd_type].push(sortable_data)
											// 	}
											// }
											onlyGetDrillDown = true;
											if(dirllConditions && dirllConditions.length > 0 && $(".peterMouse").length  <= 1){
													drag_row_column_data = saveDrillPreView["viewdata"];
													save_now_show_view_text = $("#"+saveDrillPreView["viewType"]+"");
													deleteDrillFun();
											}
											
											//判断展示窗是否为空
											if($(this).find("li").length == 0) {
												$(this).find(".drag_text").css("display", "block");
											} else {
												$(this).find(".drag_text").css("display", "none");
											}

											//判断拖拽元素颜色
											if($(ui.item).find(".drog_row_list").find("span").hasClass("dimensionality_list_text_left")) {
												if($(ui.item).find(".drog_row_list").find("span").hasClass("perterHandle")){
													$(ui.item).find(".drog_row_list").css("background", "");
												}else{
													$(ui.item).find(".drog_row_list").find(".drop_main").css("background", "#c5e0ff");
												}
											}
											if($(ui.item).find(".drog_row_list").find("span").hasClass("measure_list_text_left")) {
												$(ui.item).find(".drog_row_list").find(".drop_main").css("background", "#ffcc9a");
											}

											//移出拖拽元素wrap
											$(".list_wrap").each(function(index, ele) {
												if($(ele).html() == "" || $(ele).find("li").length == "0") {
													$(ele).remove();
												};
											});

											$(this).find("li").css({
												width: mideiCountData + "px",
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

													$(this).find("li").wrap("<div class='list_wrap clear'></div>");

													//遍历展示窗有没有重复的元素
													$("#handle_color_text").find(".color_icon_wrap").find("img[alt=" + $(this).find(".handle_bj").text() + "]").parent().parent().remove();
													$(this).find(".list_wrap").css({
														width: mideiCountData + "px",
														
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
														width: mideiCountData * 0.85 + "px",
													}).addClass("date_list").addClass("bj_color");

													})

													markShow();
													break;
												case "reminder":
													$(this).find("li").wrap("<div class='list_wrap clear'></div>");
													//遍历展示窗有没有重复的元素
													$("#handle_color_text").find(".color_icon_wrap").find("img[alt=" + $(this).find(".handle_bj").text() + "]").parent().parent().remove();
													$(this).find(".list_wrap").css({
														width: mideiCountData + "px",
														
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
														width: mideiCountData * 0.85 + "px",
													}).addClass("date_list").addClass("bj_prompt");

													})

													markShow();

													break;
												case "information":
													$(this).find("li").wrap("<div class='list_wrap clear'></div>");
													$(this).find(".list_wrap").css({
														width: mideiCountData + "px",
														
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
														width: mideiCountData * 0.85 + "px",
													}).addClass("date_list").addClass("bj_information");

													})

													markShow();

													break;
												case "drop_row_view":
													if($(ui.item).find(".color_icon_wrap").length > 0){
														$(ui.item).find(".color_icon_wrap").remove();
													}
													if($(ui.item).find(".drop_main").hasClass("peterMouse") && $(ui.item).find(".peterMouse").length > 1 && ui.sender != null){
														if($(this).find($(ui.item)).length > 0){
															$(".peterMouse").removeClass("clickActive");
															$(".peterMouse[datavalue='0']").addClass("clickActive");
															saveDrillCount = [];
															saveDrillDownDict = {};
															saveDrillDownTemp = {};
															peterDrillDown();
															deleteDrillFun();
														}
													}
													$(this).find("li").removeClass().addClass("drog_row_list date_list bj_information");
													drag_row_column_data["row"]["dimensionality"] = [];
													drag_row_column_data["row"]["measure"] = [];
													//排序拖拽走元素 删除存储的数据
													if($(this).find(".measure_list_text").length  == 0){
														drag_row_column_data["row"]["measure"] = [];
													}

													if($(this).find(".dimensionality_list_text").length == 0){
														drag_row_column_data["row"]["dimensionality"] = [];
													}

													//遍历所有行里的li 排序后更新数据
													for(var i = 0; i < $(ele).find("li").length;i++){
														
														//获取数据字段
														if($(ele).find("li").eq(i).find(".drop_main").hasClass("peterMouse")){
															var data_id = $(ele).find("li").eq(i).find(".clickActive span").attr("handledata").split(":");
														}else{
															//获取数据字段
															var data_id = $(ele).find("li").eq(i).attr("id").split(":");
														}

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
													if($(ui.item).find(".color_icon_wrap").length > 0){
														$(ui.item).find(".color_icon_wrap").remove();
													}
													if($(ui.item).find(".drop_main").hasClass("peterMouse") && $(ui.item).find(".peterMouse").length > 1 && ui.sender != null){
														if($(this).find($(ui.item)).length > 0){
															$(".peterMouse").removeClass("clickActive");
															$(".peterMouse[datavalue='0']").addClass("clickActive");
															saveDrillCount = [];
															saveDrillDownDict = {};
															saveDrillDownTemp = {};															
															peterDrillDown();
															deleteDrillFun();
															
														}
													}
													
													drag_row_column_data["column"]["dimensionality"] = [];
													drag_row_column_data["column"]["measure"] = [];
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
														if($(ele).find("li").eq(i).find(".drop_main").hasClass("peterMouse")){
															var data_id = $(ele).find("li").eq(i).find(".clickActive span").attr("handledata").split(":");
														}else{
															//获取数据字段
															var data_id = $(ele).find("li").eq(i).attr("id").split(":");
														}
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
														var listWall = $("<div class='list_wrap clear'></div>");
														$(listWall).appendTo($("#handle_color_text"));
														$(ele).appendTo($(listWall));
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
														width: mideiCountData + "px",
														
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
														width: mideiCountData * 0.85 + "px",
														
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
												if($(ui.item).hasClass("index_row_list")){
													return;
												}
												var deleteInfo = $(ui.item).find(".drog_row_list").attr("id").split(":");
												if(deleteInfo[0] == "measure"){
													var measureInfo = deleteInfo[1];
													var index1 = showHuanbiMeasureArray.indexOf(measureInfo);
													if(index1 != -1){
														showHuanbiMeasureArray.splice(index1,1);
													}
													var index2 = showTongbiMeasureArray.indexOf(measureInfo);
													if(index2 != -1){
														showTongbiMeasureArray.splice(index2,1);
													}
												}
												showOrHidenSomeMeasureCompareOrLink();
												// showOrHide();
													if($(ui.sender).parents(".drag_main").attr("id") == "drag_col"){
														var clickAreaType = "column";
													}else{
														var clickAreaType = "row";
													}

													if($(this).find(".index_row_list").length > 0){
														$(this).find(".index_row_list").remove();
														return;
													}
													if($(ui.item).find(".clickActive").length > 0){
														var deleteDrill = "sortable";
													}else{
														var deleteDrill = "drill";
													}
													$(this).find(".list_wrap").remove();
													$(this).find(".ui-draggable").parent().remove();

													$(this).find($(ui.item).find(".drog_row_list")).remove();
													remove_viewHandle(clickAreaType,deleteDrill);
													// 移除筛选列
													// var fieldInfoArr= ui.item.attr("id").split(":");
													rightFilterListDraw();

													break;
												default:

													break;
											}

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
											var elementTop = $(ele).offset().top - 74 + "px";
											type_wicket.addClass("moreClickBtn");
										}else{
											var elementLeft = "5px";
											var elementTop = $(ele).offset().top - 48 + "px";
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


			//设计视图icon
				var project_icon = [["文本表","1或多个维度","1或多个度量","show_table"],["指标卡","0个维度","1或2个度量","show_card"],["饼图","1个维度","1个度量","show_cake"],["折线图","1个维度","1或多个度量","show_polyline"], ["柱状图","0或多个维度","1或多个度量","show_histogram"],["堆积柱状图","2或3个维度","1个度量","show_storehis"], ["瀑布图","1个维度","1个度量","show_waterfall"],["百分比堆积柱状图","2或3个维度","1个度量","show_percontrasth"], ["条形图","0或多个维度","1或多个度量","show_bar"], ["堆积条形图","2或3个维度","1个度量","show_storebar"], ["对比条形图","1个维度","2个度量","show_contrastbar"], ["百分比堆积条形图","2或3个维度","1个度量","prestorebar"], ["面积图","1个维度","1个度量","show_area"], ["范围图","1个维度","1个度量","show_scale"],["甘特图","1个维度","1个度量","show_gantt"],["雷达图","1或多个维度","1或多个度量","show_randar"], ["树状图","2或多个维度","1个度量","show_treemap"],["地图","1个维度","1个度量","show_addressmap"]];

				//图表对应生成的视图
				var save_show_click_change_das = ["showTable_by_dragData()","col_card()","one_de_one_me_handle('cake')","many_de_many_me_handle('polyline')","many_de_many_me_handle('histogram')","many_de_many_me_handle('number_bar')","one_de_one_me_handle('waterWall')","many_de_many_me_handle('percentage_bar')","many_de_many_me_handle('barChart')","many_de_many_me_handle('number_liner')","many_de_many_me_handle('comparisonStrip')","many_de_many_me_handle('percentage_liner')","one_de_one_me_handle('area')","one_de_one_me_handle('scale')","one_de_one_me_handle('gantt')","many_de_many_me_handle('radarChart')","many_de_many_me_handle('reliationTree')","one_de_one_me_handle('addressMap')"];



					for(var i = 0; i < project_icon.length;i++) {




					var project_icon_list = $("<li class='project_icon_hover'><img alt=" + project_icon[i][0] + "></li>");

					project_icon_list.attr("id",project_icon[i][3]).data("show_view_fun",save_show_click_change_das[i]);

					if(i == 1){
						project_icon_list.find("img").attr("src", "/static/dashboard/img/chart_222.png");
					}else if(i == 0){
						project_icon_list.find("img").attr("src", "/static/dashboard/img/chart_" + (i + 1) + ".png");
					}else{
						project_icon_list.find("img").attr("src", "/static/dashboard/img/chart_" + i + ".png");
					}


						project_icon_list.appendTo($("#project_chart ul"));




				}


					
					$(".project_icon_hover").each(function(index, ele) {

						$(ele).find('img[alt="条形图"]').css("marginLeft","5px");
						
						$(ele).on("mouseenter", function() {
							$(ele).css("background", "white")

							if($(ele).css("opacity") != 0.3){
								$(ele).css({"background":"white","border":"1px solid rgb(13,83,164)"});
							}

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
							if(!$(ele).hasClass("clicked")){
								$(ele).css("background", "")
								if($(ele).css("opacity") != 0.3){
									$(ele).css({"background":"","border":""});
								}
								$(".project_icon_hint_wrap").remove();
							}else{
								$(".project_icon_hint_wrap").remove();
							}
						})

					});

					// end------------------


				 	//..........................点击清除维度度量指标操作

				 	//行列title移入移出事件
				 	$(".drap_row_title_content").each(function(index,ele){
				 		$(ele).on("mouseenter",function(){
				 			$(ele).find(".drag_main_icon_second").show();
				 		})

				 		$(ele).on("mouseleave",function(){
				 			$(ele).find(".drag_main_icon_second").hide();
				 		})
				 	})


				 	//点击清除维度度量
					$(".drag_main_icon_second").not($("#drag_zb .drag_main_icon_second")).each(function(index, ele) {
						$(ele).on("click", function() {
							if($(ele).parents(".drag_main").find(".annotation_text .drog_row_list").length != 0){
								var needDeleteCompareMeasue = null;
								if($(this).parents(".drag_main").attr("id") == "drag_col"){
									var clickAreaType = "column";
									needDeleteCompareMeasue = specialRemoveDataTypeHandle(drag_row_column_data["column"]["measure"]);
								}else{
									var clickAreaType = "row";
									needDeleteCompareMeasue = specialRemoveDataTypeHandle(drag_row_column_data["row"]["measure"]);
								}
								for(var i = 0;i < needDeleteCompareMeasue.length;i++){
									var measureInfo = needDeleteCompareMeasue[i];
									var index1 = showHuanbiMeasureArray.indexOf(measureInfo);
									if(index1 != -1){
										showHuanbiMeasureArray.splice(index1,1);
									}
									var index2 = showTongbiMeasureArray.indexOf(measureInfo);
									if(index2 != -1){
										showTongbiMeasureArray.splice(index2,1);
									}
								}
								showOrHidenSomeMeasureCompareOrLink();
								
								// showOrHide();
								$(".annotation_text").eq(index).find(".list_wrap").remove();
								$(".annotation_text").eq(index).find("li").remove();

								remove_viewHandle(clickAreaType,"delete");
								$(".drag_text").eq(index).show();
								//			if($("#project_chart").css("display") == "none"){
								//				$("#sizer_mpt").css("display", "block");
								//				console.log("123")
								//			}

								if($(".drog_row_list").length < 0 && $("#project_chart").css("display") == "none" && currentSetTableDateFieldArray.length < 1) {
									$("#sizer_mpt").show();
									$("#view_show_empty").show();
									initTable_name();
									$("#sizer_content").hide();
								}
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

				 	var nowIndexName = folder_name_sum("新指标",getIndexNameDict[current_cube_name]);
				 	event.stopPropagation();
				 	postIndexDic = realSaveData();

					postIndexDic["indexname"] = nowIndexName;
					postIndexDic["indexstyle"] = objectDeepCopy(postIndexDic["viewstyle"]);
					postIndexDic["indextype"] = objectDeepCopy(postIndexDic["viewtype"]);
					delete postIndexDic["viewstyle"];
					delete postIndexDic["viewtype"];
					delete postIndexDic["defaultparent"];
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

					 			getIndexNameDict[current_cube_name].push(nowIndexName);
								}
							}
					   	})
					 });

				function saveViewToWall(post_dict,type){
							//将数据存储数据库
							$.post("/dashboard/dashboardTableAdd",post_dict,function(result){
							if(result["status"] == "ok"){
								reporttingFunction_abale();
								$(".main .rightConent #pageStatementsModule").data("isFirstInto",true);
								mideiCountData = $("#drop_row_view").width() * 0.91;
								if(type == "pull" && $("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li").length > 0){
									changePageTo_navReporttingView(true);
									changeEditViewFunction(post_dict);
								}else{
									changePageTo_navReporttingView(false);
								}
								
								loc_storage.setItem("now_add_view",post_dict["foldername"]);
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
									changePageTo_navReporttingView(false);
								 	$("#pageDashboardModule #view_save_up").hide();
									$("#pageDashboardModule #view_save_up #show_excel_name").html("");
									$("#pageDashboardModule #body_content_shadow").hide();

									return;
								}

								if($(".active_folder_view").text() != $(".auto_show").data("edit_view").split(",")[1]){
										post_dict["foldername"] = $(".active_folder_view").text();
										$("#pageStatementsModule .gridster").html("");
										$("#pageStatementsModule .gridster").append($("<ul></ul>"));
										saveViewToWall(post_dict,"add");
										return;
									}

								if(viewWallChangeSave == false && $(".active_folder_view").text() == $(".auto_show").data("edit_view").split(",")[1]){
									post_dict["id"] = JSON.stringify($(".auto_show").data("tableViewId"));
									post_dict["foldername"] =  $(".auto_show").data("edit_view").split(",")[1];
									delete post_dict["defaultparent"];

									saveViewToWall(post_dict,"pull");
									return;
								}

							}

							post_dict["foldername"] =$(".active_folder_view").text();
							if(loc_storage.getItem("now_add_view") != $(".active_folder_view").text()){
								$("#pageStatementsModule .gridster").html("");
								$("#pageStatementsModule .gridster").append($("<ul></ul>"));
							}

							saveViewToWall(post_dict,"change");


						}else{
							$("#btn_save_name").css("background","#DEDEDE");
						}

					})



				  	// ......................刷新操作
				  		//页面刷新清除刷选条件
				 	window.onbeforeunload = function(){
				    	loc_storage.removeItem("allTable_specialSelection");
				  		loc_storage.removeItem("allTable_notWorkedColumns");
				  		loc_storage.removeItem(current_cube_name);
				  	}




		  	//点击全部清除下钻
			$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul .deleteDrill p").unbind("click");
			$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul .deleteDrill p").click(function(event){
				event.stopPropagation();
				if($(".peterMouse").length > 1){
						editView_change_color("默认_YZY_-1_YZY_个");
						getNodrillIndex();
						saveDrillDownTemp[$(".clickActive").find("span").text()] =  {"viewdata":JSON.parse(JSON.stringify(drag_row_column_data)),"viewType":save_now_show_view_text.attr("id"),"calculateStyle":objectDeepCopy(drag_measureCalculateStyle),"dragViewStyle":objectDeepCopy(currentColorGroupName)+"_YZY_"+objectDeepCopy(normalUnitValue)+"_YZY_"+objectDeepCopy(valueUnitValue)};
						saveDrillDownDict[$(".clickActive").find("span").text()] = [];
						$(".peterMouse").parents(".annotation_text").find("li").each(function(index,ele){
							if($(ele).find(".peterMouse").length == 0){
								saveDrillCount.push(dirllConditions.length + index);
								saveDrillDownDict[$(".clickActive").find("span").text()] = saveDrillDownDict[$(".clickActive").find("span").text()] || [];
								saveDrillDownDict[$(".clickActive").find("span").text()].push($(ele).find(".drop_main span").attr("datatype")+"_YZYPD_"+ index);

							}

						})
						if($(".peterMouse").parents(".annotation_text").find(".noPerter").length > 0){

							$(".noPerter").parents(".drog_row_list").remove();
							$(".peterMouse").parents(".annotation_text").find(".list_wrap").each(function(index,ele){
								if($(ele).find("li").length == 0){
									$(ele).remove();
								}
							})
						}
						$(".peterMouse").removeClass("clickActive");
						$(".peterMouse[datavalue='0']").addClass("clickActive");
						handleMiChange();
						if($(".clickActive").length > 0 && saveDrillDownDict[$(".clickActive").find("span").text()] != undefined && saveDrillDownDict[$(".clickActive").find("span").text()].length > 0){
							for(var i = 0; i < saveDrillDownDict[$(".clickActive").find("span").text()].length;i++){
								dragDrillDimen(saveDrillDownDict[$(".clickActive").find("span").text()][i].split("_YZYPD_")[0],saveDrillDownDict[$(".clickActive").find("span").text()][i].split("_YZYPD_")[1]);
							}
							saveDrillDownDict[$(".clickActive").find("span").text()] = [];
						}
						peterDrillDown();
						saveDrillCount = [];
						drillNumHandle();
						onlyGetDrillDown = true;
					}else{
						drag_row_column_data = JSON.parse(JSON.stringify(saveDataAndView[0]))["viewdata"];
						save_now_show_view_text = $("#"+JSON.parse(JSON.stringify(saveDataAndView[0]))["viewType"]+"");
						onlyGetDrillDown = true;
					}

						deleteDrillFun();
						loc_storage.removeItem("allTable_specialSelection");
				   		loc_storage.removeItem("allTable_notWorkedColumns");
				  		loc_storage.removeItem($("#lateral_bar #lateral_title .custom-select").val());
						switch_chart_handle_fun();
					})
				  }


				}
