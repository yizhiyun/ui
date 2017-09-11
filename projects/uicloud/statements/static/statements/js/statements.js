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


var drag_row_column_data = {
		"row":{},
		"column":{}
	}

//记录当前当前拖拽的到底是行 还是列
// 行为：row，列为 column
var _drag_message = {
	"position":null, // 行还是列
	"type":null, // 维度还是度量
	"index":null // 拖拽的下标。。可能暂时不用
};

//展示图表的类型
var state_view_show_type = null;

//图表显示的区域
var viewshow_class = null;

//记录每个表的名称
var current_cube_name = null;
//新建视图cont
var view_count_save = 0;
//新建文件夹count
var folder_count = 0;

//判断是否重命名文件报表
var change_if_name = true;

var pre_changeName;

//重命名是文件夹还是报表类型判断
var folder_or_view;

//记录小视图的oldname
var small_view_show_text;

//记录修改默认的name
var small_view_handle_text;

var username = "liuyue";


var save_old_name_view;
 
//存储视图对象的表
var _cube_all_data={};

//存储表格名字的数组
var _cube_all_data_table =[];

var view_count = 0;

//判断table隐藏还是显示
var table_show_hide;

var loc_storage=window.localStorage;

//第一次进入页面只显示默认选中的报表
var table_auto_show  = true;


$(function(){


	//侧边栏收起按钮top
	$("#statements_left_bar #statements_left_bar_btn_close").css("top",($("body").height()-$(".topInfo").height())/2 - $("#statements_left_bar_btn_close").height()/2 + "px");

	

	var right_width_content = $("body").width()-$("#statements_left_bar").position().left - $("#statements_left_bar").width() - $(".leftNav").width();
	//右侧视图展示区域宽度
	$("#right_folder_show_are").css("width",right_width_content + "px").css("height",$("body").height() - $(".topInfo").height() + "px");

	//右侧视图展示区域高度
	$(".view_folder_show_area").css("height",$("body").height() - $(".topInfo").height() - 64 + "px");
	//拿到构建报表的数据
	$.post("../dashboard/getAllData",{"username":username},function(result){
		console.log(result)
		view_out_handle_init(result);
	//侧边栏关闭按钮点击收起
	var state_left_bar_close = false;
	$("#statements_left_bar #statements_left_bar_btn_close img").on("click",function(){
		if(!state_left_bar_close){
			$("#statements_left_bar").animate({
				"left":-$("#statements_left_bar").width() + "px",
			},300);
			$("#right_folder_show_are").animate({
				"marginLeft":"0px",
				"width":$("body").width() - $(".leftNav").width() + "px",
			},300,function(){
				reason_view_drag(result,$(".cookie_handle_view").find(".statement_li_content .view_fun_content"));
			});
			
			state_left_bar_close = true;
		}else{
			
			$("#statements_left_bar").animate({
				"left":"0",
			},300);
			$("#right_folder_show_are").animate({
				"marginLeft":$("#statements_left_bar").width() + "px",
				"width":right_width_content + "px",
			},300,function(){
				reason_view_drag(result,$(".cookie_handle_view").find(".statement_li_content .view_fun_content"));
			});
			// .....
			
			state_left_bar_close = false;
		}
		$("#statements_left_bar #statements_left_bar_btn_close").css("display","block");
	})
		

		})

	
	//点击报表更多按钮创建弹窗
function click_state_show(thele){
	if($(thele).parent().find("#new_state_wrap").length == 0){
		$("#new_state_wrap").remove();
		var new_state_show = $("<div id='new_state_wrap'><div class='new_state_content' id='change_name'>重命名</div><div class='new_state_content' id='show_hide_img'>显示隐藏视图</div><div class='new_state_content' id='delete_view'>删除</div></div>")

		new_state_show.appendTo($(thele).parent());
		//删除按钮点击事件
		new_state_show.find("#delete_view").on("click",function(){
			$(".delete_area_input").html("");
			// $("#right_c")
			//记录报表当前的名字
			var now_folder_name = thele.parent().parent().find(".view_show_name_save").text();
			//点击删除弹出框提示内容
			$(".delete_area_text h4").text('确定删除报表 "'+now_folder_name+'"  ?');
			$(".delete_checked p").text("同时删除报表和包含的所有内容");
			$(".delete_area_input").find(".deltete_input_wrap").css("display","none");
			$(".delete_area_input").append("<img src='../static/statements/img/gt_03.png' alt='waring'>");
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
				$.post("../dashboard/deleteFolder",{"datatype":"folder","foldername":now_folder_name,"username":username},function(result){{
					if(result != ""){
						if(sessionStorage.getItem("edit_view_now")){
								if(sessionStorage.getItem("edit_view_now").split(",")[1] == now_folder_name){
									 sessionStorage.removeItem("edit_view_now");
								}
							}
							if(now_folder_name == $(".cookie_handle_view .statement_li_content .view_fun_content").text()){
								//删除记录视图位置信息的cookie
									if(loc_storage.getItem("view_location_data")){
											loc_storage.removeItem("view_location_data");
											save_handle_count = -1;
									}
							}
						$("#statements_left_bar_area").html("");
						view_out_handle_init(result);
						$("#delete_area").css("display","none");
						$(".maskLayer").css("display","none");
						$(".gridster").html("");
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

		$(thele).parent().parent().find(".open_btn").find("img").unbind("click");
		$(thele).parent().parent().find(".open_btn").find("img").on("click",function(){
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
			$.post("../dashboard/setSwitch",{"username":username,"switch":"show","id":$(ele).find(".small_view_text").data("table_id")},function(result){
					if(result != ""){

						ajax_count_ele++;

						if(ajax_count_ele == $(".table_hide_false").length){
							reason_view_drag(result,$(ele).parent().parent().find(".view_fun_content"));
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
function delete_parentfolder_common(ajax_dict_yes,ajax_dict_no,ele){
	//点击删除弹出框提示内容
			if(ele){
				$(".delete_area_text h4").text('确定删除文件夹 "'+$(ele).parent().parent().find(".view_show_name_save").text()+'"  ?');
			}else{
				$(".delete_area_text h4").text('确定删除全部文件夹  ?');
			}
			$(".delete_area_input").find("img").remove();
			$(".delete_area_input").find(".deltete_input_wrap").css("display","block");
			$(".delete_checked p").text("同时删除文件夹和包含的所有内容")
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
					$.post("../dashboard/deleteFolder",ajax_dict_yes,function(result){
						console.log(result)
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
											save_handle_count = -1;
										}else{
											var loc_session = JSON.parse(loc_storage.getItem("view_location_data"));
											loc_session.splice(index,1);
											loc_storage.setItem("view_location_data",JSON.stringify(loc_session));
											save_handle_count = -1;
										}
										
									}
							}
							$("#statements_left_bar_area").html("");
							view_out_handle_init(result);
							$("#delete_area").css("display","none");
							$(".maskLayer").css("display","none");
							$(".gridster").html("");

						}
					});

				}else{
					
					$.post("../dashboard/deleteFolder",ajax_dict_no,function(result){
						console.log(result)
						if(result != ""){
							$("#statements_left_bar_area").html("");
							view_out_handle_init(result);
							$("#delete_area").css("display","none");
							$(".maskLayer").css("display","none");
						}
					});
					
					
				}
			})
}


//删除文件夹点击事件
function delete_btn_handle(){
	$(".click_delete").unbind("click");
	$(".click_delete").each(function(index,ele){
		$(ele).on("click",function(){
			var ajax_dict_yes = {"username":username,"datatype":"parentfolder","recursive":"yes","foldername":$(ele).parent().parent().find(".view_show_name_save").text(),"defaultparent":"default"};
			var ajax_dict_no = {"username":username,"datatype":"parentfolder","recursive":"no","foldername":$(ele).parent().parent().find(".view_show_name_save").text(),"defaultparent":"default"};
			
			delete_parentfolder_common(ajax_dict_yes,ajax_dict_no,$(ele));
		})
	})
}



	//记录操作对应元素
	var save_handle_count = -1;


	//动态创建每个视图
	function fun_add_view(view_type,now_view_folder,right_view_show,viewshow_class,viewshow_class_arr,view_note,count,view_location){
		
		save_handle_count++;
		
		if(view_note == null){
			view_note = "";
		}
		//获取当前容器的图例
		var gridster;

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
                         	loc_storage.setItem("view_location_data",JSON.stringify(gridster.serialize()));
                         }
                 },
                 resize:{
                         	enabled:true,
                         	min_size:[2,2],
                         	resize:function(event,ui){

                         		$(".new_view_content").find(".textarea").eq(ui.$player.parent().attr("data-value")).css("width",$(".new_view_content").eq(ui.$player.parent().attr("data-value")).width()-18 + "px");
                         		$(".new_view_content").find(".new_view_main").eq(ui.$player.parent().attr("data-value")).css("height",$(".new_view_content").eq(ui.$player.parent().attr("data-value")).height()-30 + "px");
                         	},
                         	stop:function(event,ui){
                         		var show_table_location_arr = ui.$player.parent().find(".new_view_main").attr("class").match(/\d+/g);
           
                         		//记录视图位置信息
                         		loc_storage.setItem("view_location_data",JSON.stringify(gridster.serialize()));
                         	
                         		$(".new_view_content").find(".textarea").eq(ui.$player.parent().attr("data-value")).css("width",$(".new_view_content").eq(ui.$player.parent().attr("data-value")).width()-18 + "px");
                         		$(".new_view_content").find(".new_view_main").eq(ui.$player.parent().attr("data-value")).css("height",$(".new_view_content").eq(ui.$player.parent().attr("data-value")).height()-30 + "px");
                         				for(var i = 0; i < viewshow_class_arr.length;i++){
                         				var now_view_img=echarts.getInstanceByDom($("."+viewshow_class_arr[i]+"").get(0));

						 				now_view_img.resize();
                         			}
                         	},
                         	
                         },


                 }).data('gridster');
		  //视图对应的位置信息
		  var view_data_info = {};

		 //判断之前是否存在保存过的位置信息
		 if(view_location == null || view_location[save_handle_count] == undefined){
		 	gridster.destroy();
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
                         	loc_storage.setItem("view_location_data",JSON.stringify(gridster.serialize()));
                         }
                 },
                 resize:{
                         	enabled:true,
                         	min_size:[2,2],
                         	resize:function(event,ui){

                         		$(".new_view_content").find(".textarea").eq(ui.$player.parent().attr("data-value")).css("width",$(".new_view_content").eq(ui.$player.parent().attr("data-value")).width()-18 + "px");
                         		$(".new_view_content").find(".new_view_main").eq(ui.$player.parent().attr("data-value")).css("height",$(".new_view_content").eq(ui.$player.parent().attr("data-value")).height()-30 + "px");
                         	},
                         	stop:function(event,ui){
                         		var show_table_location_arr = ui.$player.parent().find(".new_view_main").attr("class").match(/\d+/g);
           
                         		//记录视图位置信息
                         		loc_storage.setItem("view_location_data",JSON.stringify(gridster.serialize()));
                         	
                         		$(".new_view_content").find(".textarea").eq(ui.$player.parent().attr("data-value")).css("width",$(".new_view_content").eq(ui.$player.parent().attr("data-value")).width()-18 + "px");
                         		$(".new_view_content").find(".new_view_main").eq(ui.$player.parent().attr("data-value")).css("height",$(".new_view_content").eq(ui.$player.parent().attr("data-value")).height()-30 + "px");
                         				for(var i = 0; i < viewshow_class_arr.length;i++){
                         				var now_view_img=echarts.getInstanceByDom($("."+viewshow_class_arr[i]+"").get(0));

						 				now_view_img.resize();
                         			}
                         	},
                         	
                         },


                 }).data('gridster');
		 	if(view_type == "showTable_by_dragData()"){
		 		view_data_info["data-sizex"] =6;
		 	}else{
		 		view_data_info["data-sizex"] =3;
		 	}
		 	
		 	view_data_info["data-sizey"] = 3;
		 }else{
		 	
		 	view_data_info["data-col"] = view_location[save_handle_count]["col"];
		 	view_data_info["data-row"] = view_location[save_handle_count]["row"];
		 	view_data_info["data-sizex"] =view_location[save_handle_count]["size_x"];
		 	view_data_info["data-sizey"] = view_location[save_handle_count]["size_y"];
		 	
		 }

		if(view_type == "showTable_by_dragData()"){
				
				gridster.add_widget("<li class='new_view_content right_view_table'  data-value="+count+"><header class='new_view_title'><div class='new_view_table_name'>"+right_view_show+"</div><div class='new_view_right_icon'><div class='new_view_hide add_css_img'><img src='../static/statements/img/hide.png' alt='show_or_hide' title='隐藏视图'></div><div class='new_view_tille_know add_css_img'><img src='../static/statements/img/title.png' alt='title' title='标题'></div><div class='new_view_edit add_css_img'><img src='../static/statements/img/edit.png' alt='edit' title='编辑'></div><div class='new_view_remarks add_css_img'><img src='../static/statements/img/remarks.png' alt='remarks' title='备注'></div><div class='new_view_delete add_css_img'><img src='../static/statements/img/delete1.png' alt='delete' title='删除视图'></div></div></header><div class='new_view_main new_view_table clear "+viewshow_class+" view_handle_count"+count+"'><div class='right_module' style='display: inline-block;'> <div class='top_column_container' style='display: inline-block'><p class='top_column_name'></p><ul class='column_data_list'></ul></div><div class='content_body'><ul id='data_list_for_body'></ul></div></div><div class='left_row_container'></div></div></div><div class='textarea'><textarea class='table_view_textarea' placeholder='仅对次视图增加文案备注说明不做任何图表改变' maxlength='160'>"+view_note+"</textarea></div></li>", view_data_info["data-sizex"],view_data_info["data-sizey"]);
				if(view_location != null && view_location[save_handle_count] != undefined){
					$(".new_view_content").eq(count).attr("data-col",view_data_info["data-col"]).attr("data-row",view_data_info["data-row"]);
				}
				var text =$(".table_view_textarea").get(0);
				autoTextarea(text,0,46);
				
		}else{
			
				gridster.add_widget("<li class='new_view_content'  data-value="+count+"><header class='new_view_title'><div class='new_view_table_name'>"+right_view_show+"</div><div class='new_view_right_icon'><div class='new_view_hide add_css_img'><img src='../static/statements/img/hide.png' alt='show_or_hide' title='隐藏视图'></div><div class='new_view_tille_know add_css_img'><img src='../static/statements/img/title.png' alt='title' title='标题'></div><div class='new_view_edit add_css_img'><img src='../static/statements/img/edit.png' alt='edit' title='编辑'></div><div class='new_view_remarks add_css_img'><img src='../static/statements/img/remarks.png' alt='remarks' title='备注'></div><div class='new_view_delete add_css_img'><img src='../static/statements/img/delete1.png' alt='delete' title='删除视图'></div></div></header><div class='new_view_main clear "+viewshow_class+" view_handle_count"+count+"'></div><div class='textarea'><textarea class='table_view_textarea' placeholder='仅对次视图增加文案备注说明不做任何图表改变' maxlength='60'>"+view_note+"</textarea></div></li>",view_data_info["data-sizex"],view_data_info["data-sizey"]);
				
				if(view_location != null && view_location[save_handle_count] != undefined){
					$(".new_view_content").eq(count).attr("data-col",view_data_info["data-col"]).attr("data-row",view_data_info["data-row"]);
				}
				var text = $(".table_view_textarea").get(0);
				autoTextarea(text,0,46);
			
		}
		$(".new_view_content").find(".new_view_main").eq(save_handle_count).css("height",$(".new_view_content").eq(save_handle_count).height()-30 + "px");

		$(".new_view_content").find(".textarea").eq(save_handle_count).css("width",$(".new_view_content").eq(save_handle_count).width()-18 + "px");
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
				$("#statements_left_bar_area .statement_li .view_show_content .view_show_handle").not($(ele)).not($(".table_hide_false")	).find(".hide_or_show").css("display","none");
				$(".new_view_main").parent().css("border","none");
				$(ele).css("background","#F5F5F5").addClass("now_click_view");
				$(ele).unbind("mouseenter mouseleave");
				if($(ele).data("table_show") != "false" && $(ele).parent().parent().hasClass("cookie_handle_view")){
					$(ele).on("mouseenter",function(){
					if(!$(ele).hasClass("view_handle_table")){
							creat_thumbnail($(ele));
					}
					
		 		})

		 		$(ele).on("mouseleave",function(){
		 			$(".thumbnail_wrap").remove();
		 		})
				}
				
				
				$("."+$(ele).data("save_view_class")+"").parent().css("border","1px solid #0D53A4");
				if($("."+$(ele).data("save_view_class")+"").parent().length != 0){

					$(".view_folder_show_area").scrollTop($("."+$(ele).data("save_view_class")+"").parent().offset().top-144)
				}
				
			}
		}


		function cookie_view_each(){
			$("#statements_left_bar_area .statement_li .view_show_content .view_show_handle").unbind("mouseenter mouseleave");
			$(".cookie_handle_view .view_show_handle").each(function(index,ele){
				$(ele).on("mouseenter",function(){
					$(ele).find(".hide_or_show").css("display","block");
					$(ele).css("background","#F5F5F5");
		 		})

		 		$(ele).on("mouseleave",function(){
		 			$(ele).find(".hide_or_show").css("display","none");
					$(ele).css("background","");
		 		})
			
			if($(ele).data("table_show") == "false"){
				$(ele).unbind("mouseenter mouseleave");
			}

			if($(ele).data("table_show") != "false" && $(ele).parent().parent().hasClass("cookie_handle_view")){
				
				$(ele).on("mouseenter",function(){
					$(ele).find(".hide_or_show").css("display","block");
					$(ele).css("background","#F5F5F5");
					if(!$(ele).hasClass("view_handle_table")){
							creat_thumbnail($(ele));
					}
					
		 		})

		 		$(ele).on("mouseleave",function(){
		 			
		 			$(".thumbnail_wrap").remove();
		 			$(ele).find(".hide_or_show").css("display","none");
					$(ele).css("background","");
		 		})
			}

		})
			//小部件移入移出事件
		$("#statements_left_bar_area .statement_li .view_show_content .view_show_handle").each(function(index,ele){
			$(ele).on("mouseenter",function(){
				$(ele).find(".hide_or_show").css("display","block");
				$(ele).css("background","#F5F5F5");
			})
			$(ele).on("mouseleave",function(){
				$(ele).find(".hide_or_show").css("display","none");
				$(ele).css("background","");
			})

			if($(ele).data("table_show") == "false"){
				$(ele).unbind("mouseenter mouseleave");
			}
			})
		}



		//创建视图相对应的缩略图
		function creat_thumbnail(ele){

			var view_thumbnail = $("<div class='thumbnail_wrap'><img src="+ echarts.getInstanceByDom($("."+$(ele).data("save_view_class")+"").get(0)).getDataURL({pixelRatio:2,backgroundColor:'#fff',type:'jpeg'})+" alt='vie_thumb'/></div>");
			
			view_thumbnail.appendTo(ele);
			//缩略图显示的宽高比
			var thumbnail_width_hei = 200/($("."+$(ele).data("save_view_class")+"").width()/$("."+$(ele).data("save_view_class")+"").height());
			view_thumbnail.find("img").height(thumbnail_width_hei).css("marginTop",(200-thumbnail_width_hei)/2 + "px");
		}


	//根据报表显示其中的视图
	function reason_view_drag(data_result,now_click_ele,click_view_btn){
		
		$("#statements_left_bar_area .statement_li .view_show_content .view_show_handle").removeClass("now_click_view");
		so_over =null;
		view_count_save = 0;
		//清空选择框
		$(".view_folder_select").html("");
		$(".gridster").html("");
		$(".gridster").append($("<ul></ul>"));

		var count = -1;

		//当前报表的文件夹
		var now_view_folder;

		var viewshow_class_arr =[];

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
				view_count_save++;
				var select_opt = $("<option value="+view_in_folder+">"+view_in_folder+"</option>");
				select_opt.appendTo($(".view_folder_select"));
				if(view_in_folder == now_click_ele.text()){
					select_opt.attr("selected","selected");
				}

				
				if(data_result[now_view_folder][now_click_ele.text()] == data_result[now_view_folder][view_in_folder]){
					for(right_view_show in data_result[now_view_folder][view_in_folder]){
						var change_view_show_click = data_result[now_view_folder][view_in_folder];
						count++;
						if(!change_view_show_click[right_view_show]["show"]){
							continue;
						}
						viewshow_class = "bbv"+view_count_save+"view_show_class" + count;
						
						if(change_view_show_click[right_view_show]["viewtype"] != "showTable_by_dragData()"){
							viewshow_class_arr.push(viewshow_class);
						}
						
						if(loc_storage.getItem("view_location_data")){
							var view_session = JSON.parse(loc_storage.getItem("view_location_data"))
						}else{
							var view_session = null;
						}
						//创建容器
						fun_add_view(change_view_show_click[right_view_show]["viewtype"],now_view_folder,now_click_ele.parent().parent().find(".small_view_text").eq(count).text(),viewshow_class,viewshow_class_arr,change_view_show_click[right_view_show]["note"],count,view_session);
					
						var out_into_view = $("."+viewshow_class+"").parent();

						drag_row_column_data["row"] = JSON.parse(change_view_show_click[right_view_show]["row"]);

						drag_row_column_data["column"] = JSON.parse(change_view_show_click[right_view_show]["column"]);

						current_cube_name = change_view_show_click[right_view_show]["tablename"];

						state_view_show_type = change_view_show_click[right_view_show]["viewtype"];

						view_handle_switch_statements(viewshow_class);
					}
				}
				
			}
			$(".view_folder_select").comboSelect();
			$(".right_folder_view_name").find(".combo-dropdown").find(".option-item").each(function(index,ele){
				$(ele).on("click",function(){
					if(!$(ele).hasClass("option-selected")){

						loc_storage.setItem("now_add_view",$(ele).text());
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
	}

	//视图展示部分功能事件
	function view_drag_resize_handle(){
			
			$(".new_view_right_icon").each(function(index,ele){
				//获取存储报表和视图下标的数组
				var show_table_arr = $(ele).parent().parent().find(".new_view_main").attr("class").match(/\d+/g);

				var new_view_table_name_save;
				//图表按钮点击显示隐藏
				$(ele).find(".new_view_hide").on("click",function(){
					
					click_or_show($(".statement_li").eq(show_table_arr[0]-1).find(".view_show_handle").eq(show_table_arr[1]));

				})
				//标题隐藏显示
				$(ele).find(".new_view_tille_know").on("click",function(){
					$(ele).parent().find(".new_view_table_name").toggle();
				})
				//标题名点击事件修改名字

				$(ele).parent().find(".new_view_table_name").dblclick(function(){
					new_view_table_name_save = $(ele).parent().find(".new_view_table_name").text();
					
					if($(ele).parent().find(".new_view_table_name").find("input").length == 0){
						$(this).html($("<input class='title_name_input' placeholder="+$(this).text()+"></input>")).css("textIndent","0").after("<div class='title_name_change_btn'></div>");
					}

				//点击确定修改名称
				$(ele).parent().find(".title_name_change_btn").on("click",function(){

					//判断输入值不为空
					if($(".title_name_input").val() == ""){
						$(ele).parent().find(".new_view_table_name").css("borderColor","red");
						return;
					}else{

					//更新服务器数据
					$.post("../dashboard/changeName",{"objtype":"view","oldname":$(".statement_li").eq(show_table_arr[0]-1).find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").data("table_id"),"newname":$(".title_name_input").val()},function(result){
						 	if(result["status"] == "ok"){
						 		$(".statement_li").eq(show_table_arr[0]-1).find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").html($(".title_name_input").val());
						 		$(ele).parent().find(".new_view_table_name").html($(".title_name_input").val()).css("textIndent","3px").css("borderColor","#DEDEDE");
								$(".title_name_change_btn").remove();
						 	}
						});
					}
				})

				$(".title_name_input").on("input",function(){
						$(ele).parent().find(".new_view_table_name").css("borderColor","#DEDEDE");
					})
				})
				//备注输入存储展示
				$(ele).find(".new_view_remarks").on("click",function(){
					$(ele).parent().parent().find(".textarea").stop(true).toggle(500);
				})

				$(ele).parent().parent().find(".textarea textarea").blur(function(){
					if($(this).val() != ""){
						$.post("../dashboard/changeName",{"objtype":"note","username":username,"note":$(this).val(),"id":$(".statement_li").eq(show_table_arr[0]-1).find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").data("table_id")},function(result){
							console.log(result)
						});
					}else{
						$(this).parent().stop(true).toggle(500);
					}
				})

				//视图的删除事件
				$(ele).find(".new_view_delete").on("click",function(){
						$(".delete_area_input").html("");
						//点击删除弹出框提示内容
						$(".delete_area_text h4").text('确定删除视图 "'+$(ele).parent().find(".new_view_table_name").text()+'"  ?');
						$(".delete_checked p").text("此视图删除后,数据将无法恢复");
						$(".delete_area_input").find(".deltete_input_wrap").css("display","none");
						$(".delete_area_input").append("<img src='../static/statements/img/gt_03.png' alt='waring'>");
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
							$.post("../dashboard/deleteFolder",{"datatype":"view","tableid":$(".statement_li").eq(show_table_arr[0]-1).find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").data("table_id"),"username":username},function(result){{
								if(result != ""){
									if(sessionStorage.getItem("edit_view_now")){
										if(sessionStorage.getItem("edit_view_now") == $(".statement_li").eq(show_table_arr[0]-1).find(".view_show_handle").eq(show_table_arr[1]).data("data_result_content")){
											 sessionStorage.removeItem("edit_view_now");
										}
									}

									//删除记录视图位置信息的cookie
									if(loc_storage.getItem("view_location_data")){
										if(JSON.parse(loc_storage.getItem("view_location_data")).length == 1){
											loc_storage.removeItem("view_location_data");
											save_handle_count = -1;
										}else{
											var loc_session = JSON.parse(loc_storage.getItem("view_location_data"));
											loc_session.splice(index,1);
											loc_storage.setItem("view_location_data",JSON.stringify(loc_session));
											save_handle_count = -1;
										}
										
									}
									view_out_handle_init(result);
									$("#delete_area").css("display","none");
									$(".maskLayer").css("display","none");
									$(".gridster").html("");
								}
							}})
						})
					})

				//视图编辑功能
				$(ele).find(".new_view_edit").on("click",function(){
					if($(".statement_li").eq(show_table_arr[0]-1).find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").data("setopen") == false){
						$.post("../dashboard/setSwitch",{"switch":"isopen","id":$(".statement_li").eq(show_table_arr[0]-1).find(".view_show_handle").eq(show_table_arr[1]).find(".small_view_text").data("table_id")});
					}
					
					sessionStorage.setItem("edit_view_now",$(".statement_li").eq(show_table_arr[0]-1).find(".view_show_handle").eq(show_table_arr[1]).data("data_result_content"));
					window.location.href="../dashboard/pallasdata2";
				})

				// document点击关闭输入框
			$(document).on("click",function(e){
				if($(ele).parent().find(".title_name_input").length != 0){
					if(!$(e.target).is($(ele).parent().find(".title_name_input")) && !$(e.target).is($(ele).parent().find(".title_name_change_btn")) && !$(e.target).is($(ele).parent().find(".new_view_table_name"))){
						$(ele).parent().find(".new_view_table_name").html(new_view_table_name_save).css("textIndent","3px").css("borderColor","#DEDEDE");
						$(".title_name_change_btn").remove();
					}
				}
				})
			})
	}

// view_drag_end-------

//用户操作过程中修改cookie对应的报表
function user_handle_change_cookie(ele,click_view_btn){
		$(".right_folder_name_show").css("display","block");
		$(".click_out_handle").css("display","block");
		//请求所有数据集合
		$.post("../dashboard/getAllData",{"username":username},function(data_result){
			if(data_result != ""){
				$(".statement_li").removeClass("cookie_handle_view");
				$(".statement_li").find(".view_show_name_save").css("color","");
				// $(".statement_li").find(".view_show_content").not($(ele).parent().parent().find(".view_show_content")).hide("blind",200);
				$(ele).parent().parent().addClass("cookie_handle_view");
				if($(ele).parent().parent().find(".view_show_content").css("display") == "none"){
					$(ele).parent().parent().find(".view_show_content").show("blind",200);
					$(ele).parent().parent().find(".statement_li_content .click_tra_statement").attr("src","../static/statements/img/left_35.png");
				}
				
				// $(".statement_li .statement_li_content .click_tra_statement").not($(ele).parent().parent().find(".statement_li_content .click_tra_statement")).attr("src","../static/statements/img/left_40.png");
              
				
				loc_storage.setItem("now_add_view",$(ele).text());
				reason_view_drag(data_result,$(ele),click_view_btn);
				small_view_click_hide();
			}
		})
	
}	

	//视图单击切换显示
	function click_view_change_view(){
		$(".view_fun_content").not($(".cookie_handle_view .view_fun_content")).data("if_click","");
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
		$(ele).find(".view_show_name_save").dblclick(function(){
			//记录之前的名字
			pre_changeName = $(ele).find(".view_show_name_save").text();
			change_name_btn(pre_changeName,$(ele),"view_show_name_save",index);

			//保存重命名


		$(ele).find(".open_btn").find("img").unbind("click");
		$(ele).find(".open_btn").find("img").on("click",function(){
			double_click_change_name($(ele),"view_show_name_save",img_type,img_src,"true");
			
			$("#new_state_wrap").remove();
			
		})

		$(document).on("click",function(e){
			if(!$(e.target).is($(ele).find(".click_new_folder_input"))){
				double_click_change_name($(ele),"view_show_name_save",img_type,img_src,"false");
			
				$("#new_state_wrap").remove();
			}
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
			$(".click_new_folder_input").val(pre_changeName).css("border","none").css("borderBottom","1px solid #E1E1E1");
			$(ele).find(".view_show_img_content").addClass("open_btn").find("img").removeClass().attr("src","../static/statements/img/right-icon_03.png").css("display","block");

			$(ele).unbind("mouseenter mouseleave");
			$(ele).find(".open_btn").on("mouseenter",function(){
				$(".open_btn").css("background","#f5f5f5");
			})

			$(ele).find(".open_btn").on("mouseleave",function(){
				$(".open_btn").css("background","");
			})
	}

		//重命名双击btn
	function double_click_change_name(ele,sonName,img_type,img_src,if_over){
				if(if_over == "true"){
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
					if(input_value == ""){
						$(ele).find(".click_new_folder_input").css("borderColor","red");
						return;
					}else if(input_value == save_old_name_view){
						$(ele).find(".click_new_folder_input").css("borderColor","");
					 		over_handle();
					 		more_handle_click();
							delete_btn_handle();
						
					}else{
						//修改名称向服务器发送请求
					
					 $.post("../dashboard/changeName",{"username":username,"objtype":folder_or_view,"oldname":old_name,"newname":input_value},function(result){
					 	
					 	if(result["status"] == "false"){
					 		$(ele).find(".click_new_folder_input").css("borderColor","red");
					 		return;
					 	}else{
					 		$(ele).find(".view_show_name_save").text(input_value);
					 		if(folder_or_view == "folder"){
					 			loc_storage.setItem("now_add_view",input_value);
					 			reason_view_drag(result,$(ele).find(".view_fun_content"));
					 		}else{
					 			view_out_handle_init(result);
					 		}
					
					 		$(ele).find(".click_new_folder_input").css("borderColor","");
					 		over_handle();
					 		

					 		
					 	}
					 });
						
					}
				}else{
					if($(".click_new_folder_input").length != 0 ){
						over_handle();
					}
					
				}
				function over_handle(){
					var save_input_value;
					if(if_over == "true"){
						save_input_value = input_value;
					}else{
						save_input_value = $(ele).find("."+sonName+"").data("save_text_over");
					}
					
					$(ele).find(".click_new_folder_input").remove();
					$(ele).find("."+sonName+"").html(save_input_value).data("record_name",save_input_value);
					$(ele).find(".view_show_img_content").find("img").unbind("click").removeClass().attr("src","../static/statements/img/"+img_src+".png").addClass(img_type);


					if($(ele).parent().parent().attr("class") != "state_folder" && $(ele).find(".click_tra_statement").length == 0 && $(ele).find(".click_tra_floder").length == 0){
						$(ele).find(".view_show_name_save").css("width","137px");
					}

					if($(ele).find(".click_tra_statement").length != 0){
						$(ele).find(".click_tra_statement").css("display","block");
					}

					if($(ele).find(".click_tra_floder").length != 0){
						$(ele).find(".click_tra_floder").css("display","block");
					}
				
					$(ele).find(".open_btn").unbind("mouseenter mouseleave click").css("background","").removeClass("open_btn");
					
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

	//创建报表显示li的工厂函数
	function statements_li_add(data_result){

		//获取存在cookie中操作报表的名称
		var cookie_view_name = loc_storage.getItem("now_add_view");
		$(".rightConent #statements_left_bar_area").html("");
		// $(".rightConent #right_folder_show_are").html("");
		var save_view_class_name = -1;
		for(erv_data in data_result){
			
			if(erv_data != "default"){
					    var folder = $("<div class='state_folder'><div class='state_folder_content'><img src=../static/statements/img/folder.png  class='click_folder'/><div class='view_show_name_save'>"+erv_data+"</div><div class='view_show_img_content'><img src=../static/statements/img/delete1.png  class='click_delete'/></div></div></div>");
						folder.prependTo($("#statements_left_bar_area"));
						folder.find(".state_folder_content").find(".view_show_name_save").data("record_name",erv_data);
						folder.find(".view_show_name_save").css("width","103px");
						if(Object.getOwnPropertyNames(data_result[erv_data]).length != 0){
							folder.find(".click_tra_floder").css("display","block");
							folder.find(".state_folder_content").find(".view_show_name_save").css("width","120px");
							for(small_view_show in data_result[erv_data]){
								save_view_class_name = -1;
								var oDiv = $("<div class='statement_li folder_in_view clear'><div class='statement_li_content'><img src=../static/statements/img/form_icon.png  class='view_show_icon'><div class='view_show_name_save view_fun_content'>"+small_view_show+"</div><div class='view_show_img_content'><img src=../static/statements/img//more.png class='click_more'/></div></div><div class='view_show_content'></div></div>");
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
									save_view_class_name++;
									//将视图对应表存储起来
									if(_cube_all_data_table.indexOf(data_result[erv_data][small_view_show][view_show]["tablename"]) == -1){
										
										_cube_all_data_table.push(data_result[erv_data][small_view_show][view_show]["tablename"]);
									}
									//判断是否有修改过的名字 而不使用默认的展现形式

									if(data_result[erv_data][small_view_show][view_show]["viewname"] != null){
										
										small_view_show_text = data_result[erv_data][small_view_show][view_show]["viewname"];
									}else{
										
										small_view_show_text = view_show;
									}
								
									var view_handle = $("<div class='view_show_handle clear'><div class='small_view_text'>"+small_view_show_text+"</div><div class='hide_or_show_wrap'><img src=../static/statements/img/hide.png class='hide_or_show'></div></div>");
									if(!data_result[erv_data][small_view_show][view_show]["show"]){
										view_handle.find(".hide_or_show").attr("src","../static/statements/img/show.png");
										view_handle.css("background","#F5F5F5").css("opacity","0.5").data("table_show","false");
										view_handle.find(".hide_or_show_wrap img").css("display","block");
										table_show_hide = false;
									} 
									oDiv.find(".statement_li_content").find(".click_tra_statement").remove();
									



									// 判断是否是table
									if(data_result[erv_data][small_view_show][view_show]["viewtype"] == "showTable_by_dragData()"){
										view_handle.addClass("view_handle_table");
									}



									view_handle.find(".small_view_text").css("width","122px").data("table_id",data_result[erv_data][small_view_show][view_show]["id"]).data("setopen",data_result[erv_data][small_view_show][view_show]["isopen"]);
									view_handle.data("data_result_content",erv_data+","+small_view_show+","+view_show+","+data_result[erv_data][small_view_show][view_show]["tablename"]).appendTo(oDiv.find(".view_show_content")).data("save_view_class","view_handle_count"+save_view_class_name+"");
									$("<img src=../static/statements/img/left_35.png  class='click_tra click_tra_statement'/>").prependTo(oDiv.find(".statement_li_content"));
									oDiv.find(".view_show_name_save").css("width","103px");

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
						save_view_class_name = -1;
						var oDiv = $("<div class='statement_li clear'><div class='statement_li_content'><img src=../static/statements/img/form_icon.png  class='view_show_icon'><div class='view_show_name_save view_fun_content'>"+small_view_show+"</div><div class='view_show_img_content'><img src=../static/statements/img//more.png class='click_more'/></div></div><div class='view_show_content'></div></div>");
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

									save_view_class_name++;
									//将视图对应表存储起来
									if(_cube_all_data_table.indexOf(data_result[erv_data][small_view_show][view_show]["tablename"]) == -1){
										
										_cube_all_data_table.push(data_result[erv_data][small_view_show][view_show]["tablename"]);
									}
									
									//判断是否有修改过的名字 而不使用默认的展现形式

									if(data_result[erv_data][small_view_show][view_show]["viewname"] != null){
										
										small_view_show_text = data_result[erv_data][small_view_show][view_show]["viewname"];
									}else{
										
										small_view_show_text = view_show;
									}
									
									var view_handle = $("<div class='view_show_handle clear'><div class='small_view_text'>"+small_view_show_text+"</div><div class='hide_or_show_wrap'><img src=../static/statements/img/hide.png class='hide_or_show'></div></div>");
									if(!data_result[erv_data][small_view_show][view_show]["show"]){
										view_handle.find(".hide_or_show").attr("src","../static/statements/img/show.png");
										view_handle.css("background","#F5F5F5").css("opacity","0.5").data("table_show","false");
										view_handle.find(".hide_or_show_wrap img").css("display","block");
										table_show_hide=false;
									}
									oDiv.find(".statement_li_content").find(".click_tra_statement").remove();
									// 判断是否是table
									if(data_result[erv_data][small_view_show][view_show]["viewtype"] == "showTable_by_dragData()"){
										view_handle.addClass("view_handle_table");
									}
									$("<img src=../static/statements/img/left_35.png  class='click_tra click_tra_statement'/>").prependTo(oDiv.find(".statement_li_content"));
									view_handle.find(".small_view_text").css("width","139px").data("table_id",data_result[erv_data][small_view_show][view_show]["id"]).data("setopen",data_result[erv_data][small_view_show][view_show]["isopen"]);
									view_handle.data("data_result_content",erv_data+","+small_view_show+","+view_show+","+data_result[erv_data][small_view_show][view_show]["tablename"]).appendTo($(oDiv).find(".view_show_content")).data("save_view_class","view_handle_count"+save_view_class_name+"");;

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

	
	if($(".cookie_handle_view").length != 0){
		$(".right_folder_name_show").css("display","block");
		$(".click_out_handle").css("display","block");
		if($(".view_show_handle").length == 0){
			reason_view_drag(data_result,$(".cookie_handle_view").find(".view_show_name_save"));
			return;
		}
		table_name_post(data_result);
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

	//创建文件夹点击显示
	$("#statements_left_tra img").on("click",function(){
		$("#statements_add_folder").toggle();
	})

	$("#statements_add_folder").on("mouseleave",function(){
		$("#statements_add_folder").hide();
	})

	$(".statements_add_folder_son").on("click",function(){
		$("#statements_add_folder").hide();
	})

	function table_name_post(data_result){
		
		var len  = _cube_all_data_table.length;
		table_into_post(len);
		function table_into_post(l){
				if(l < 1){
					reason_view_drag(data_result,$(".cookie_handle_view").find(".view_show_name_save"));
					return;
				}
					$.ajax({
					url:"/cloudapi/v1/tables/" +_cube_all_data_table[len-l]+"/all",
					type:"post",
					dataType:"json",
					success:function(data){
						if (data["status"] == "success") {
							// reason_view_drag(data_result,$(".cookie_handle_view").find(".view_show_name_save"));
							var cube_all_data = data["results"];
							_cube_all_data[_cube_all_data_table[len - l]] = cube_all_data;
							return table_into_post(--l);
						}
					
					}
				});
		}

	}

	//新建文件夹新建视图方法
	function new_folder_view(type,text,tra_type,tra_class,btn_type,type_content,type_wrap){
		var post_dict ={}
			if($(".statement_li").length == 0){
				view_count = 0;
			}
			if($(".state_folder").length == 0){
				folder_count = 0;
			}
			if($("#statements_left_bar_area").find(".click_new_folder_input").length == 0){
				
			var new_folder= $("<div class='clear "+type_content+"'><div class='empty_folder "+type_wrap+"'><img src='../static/statements/img/"+type+".png'  class='click_folder'/><div class='view_show_name_save new_element'><input type='text' class='click_new_folder_input' placeholder="+text+" maxlength='10'></div><div class='mouse_img "+btn_type+"'><img src=../static/statements/img/right-icon_03.png/></div></div></div>")
			
			new_folder.prependTo($("#statements_left_bar_area"));
			if(type == "folder"){
						folder_count++;

						$(".click_new_folder_input").val(text+folder_count);
						
						new_folder.find(".view_show_name_save").addClass("floder_content").data("record_name",text+folder_count);

				}else{
					view_count++;
					$(".click_new_folder_input").val(text+view_count);
					
					new_folder.find(".view_show_name_save").addClass("view_fun_content").data("record_name",text+view_count);
				}


			//open按钮移入移出事件
			$(".mouse_img").each(function(index,ele){
				$(ele).on("mouseenter",function(){
					$(ele).css("background","#f5f5f5");
			})

				$(ele).on("mouseleave",function(){
					$(ele).css("background","");
				})
			})
			
			//点击btn创建文件夹
			$(".mouse_img").find("img").on("click",function(){

				change_if_name = false;
				if($(".click_new_folder_input").val() == ""){
					$(".click_new_folder_input").css("borderColor","red");
				}else{
					//文件夹名字
					var input_val_name =$(".click_new_folder_input").val();
					
					if(type == "folder"){
						//新建文件夹后台保存
						$.post("../dashboard/dashboardFolderAdd",{"username":username,"foldername":input_val_name},function(result){
							console.log(result)
							if(result["status"] == "false"){
								$(".click_new_folder_input").css("borderColor","red");
								return;
							}else{
								new_view_show_and(result);

								click_view_change_view();
								//报表更多按钮点击事件
								more_handle_click();
								//文件夹重命名
								handle_change_result("state_folder_content","click_delete","delete1");
								
							}
						})

					}else{
						post_dict["foldername"] = input_val_name;
						post_dict["row"] = "row";
						post_dict["column"]= "null";
						post_dict["username"] = username;
						post_dict["tablename"] ="null";
						post_dict["viewtype"] ="null";
						post_dict["defaultparent"] = "default";
						$.post("../dashboard/dashboardTableAdd",post_dict,function(result){
							
							if(result["status"] == "false"){
								$(".click_new_folder_input").css("borderColor","red");
								return;
							}else{

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
						$(".mouse_img").find("img").unbind("click").attr("src","../static/statements/img/"+tra_type+".png").removeClass().addClass(tra_class);
						$("."+btn_type+"").removeClass("mouse_img");

						$("."+type_content+"").find(".new_element").html(input_val_name).removeClass("new_element");
						$("."+type_content+"").find(".click_folder").removeClass().addClass("click_or");

					 	$("."+btn_type+"").css("background","").unbind("mouseenter");

					 //报表的移入移出事件
					 
					    ele_each($("."+type_wrap+""),$("."+tra_class+""));

						delete_btn_handle();
						//报表拖入到文件夹中
						view_dragable_folder();

						

					}

					// new_show_end----------------

				}

				// $(".mouse_img").unbind("click");
			})
		}else{
			$(".click_new_folder_input").css("borderColor","red");
		}

		$(".click_new_folder_input").on("input",function(){
			$(".click_new_folder_input").css("borderColor","#E1E1E1");
		})


		
	}

// function_____-


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
		// $(ele).droppable("destroy");
		$(ele).droppable({
			activeClass: "ui-state-default_z",
		    hoverClass: "ui-state-hover_z",
			accept:$(".view_fun_content").not($(ele).find(".view_fun_content")),
			drop:function(event,ui){
				
				$.post("../dashboard/RelevanceFolder",{"foldername":loc_storage.getItem("now_add_view"),"parentfoldername":$(ele).find(".state_folder_content").find(".view_show_name_save").text(),"username":username},function(result){
						console.log(result)
						//根据数据库存储的数据展示
						 view_out_handle_init(result)
				})
			}

		});
	})
}

	//点击创建文件夹
	$("#statements_add_folder #add_folder_btn").on("click",function(){
		new_folder_view("folder","新建文件夹","delete1","click_delete","view_show_img_content","state_folder","state_folder_content");
	})

	//点击新建视图
	$("#statements_add_folder #add_view_btn").on("click",function(){
		new_folder_view("form_icon","新建报表","more","click_more","view_show_img_content","statement_li","statement_li_content");
	})

	//点击删除全部文件夹
	
		$("#statements_add_folder #remove_all_folder").on("click",function(){
			if($(".state_folder").length != 0){
				var ajax_dict_yes_s = {"username":username,"datatype":"parentfolder","recursive":"yes","defaultparent":"default"};
				var ajax_dict_no_s = {"username":username,"datatype":"parentfolder","recursive":"no","defaultparent":"default"};
			
				delete_parentfolder_common(ajax_dict_yes_s,ajax_dict_no_s,false);
			}
		})
	

	//显示全部隐藏视图
	$("#statements_add_folder #show_all_hide").on("click",function(){
		$.post("../dashboard/setSwitch",{"switch":"show","username":username,"showall":"yes"},function(result){
			if(result != ""){
				$(".cookie_handle_view .view_show_content .view_show_handle").find("img").attr("src","../static/statements/img/hide.png");
				$(".cookie_handle_view .view_show_content .view_show_handle").css("opacity","1").data("table_show","true").removeClass("table_hide_false");
				$(".cookie_handle_view .view_show_content .view_show_handle").on("mouseenter",function(){$(".cookie_handle_view .view_show_content .view_show_handle").css("background","#F5F5F5");$(".cookie_handle_view .view_show_content .view_show_handle").find("img").css("display","block")});
				$(".cookie_handle_view .view_show_content .view_show_handle").on("mouseleave",function(){$(".cookie_handle_view .view_show_content .view_show_handle").css("background","");$(".cookie_handle_view .view_show_content .view_show_handle").find("img").css("display","none")});
				reason_view_drag(result,$(".cookie_handle_view .statement_li_content .view_fun_content"));
			}
		})
	})

	//隐藏显示点击切换
	function click_or_show(ele){
		var handle_show_h = null;
		if($(ele).find("img").attr("src") == '../static/statements/img/show.png'){
			$(ele).find("img").attr("src","../static/statements/img/hide.png");
			$(ele).css("opacity","1").data("table_show","true").removeClass("table_hide_false");
			$(ele).on("mouseenter",function(){$(ele).css("background","#F5F5F5");$(ele).find("img").css("display","block")});
			$(ele).on("mouseleave",function(){$(ele).css("background","");$(ele).find("img").css("display","none")});
		
		}else{
			$(ele).find("img").attr("src","../static/statements/img/show.png").css("display","block");	
			$(ele).css("background","#F5F5F5").css("opacity","0.5").data("table_show","false").addClass("table_hide_false");
			$(".thumbnail_wrap").remove();
			$("#statements_left_bar_area .statement_li .view_show_content .view_show_handle").removeClass("now_click_view");
			$(ele).unbind("mouseenter mouseleave");
			
		}
		$.post("../dashboard/setSwitch",{"switch":"show","username":username,"id":$(ele).find(".small_view_text").data("table_id")},function(result){
			if(result != ""){
	//			$(".statement_li .view_show_content .view_show_handle").not($(ele)).on("mouseenter",function(){$(this).css("background","#F5F5F5");$(this).find("img").css("display","block")});
//				$(".statement_li .view_show_content .view_show_handle").not($(ele)).on("mouseleave",function(){$(this).css("background","");$(this).find("img").css("display","none")});
				reason_view_drag(result,$(ele).parent().parent().find(".view_fun_content"));
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
			$(ele).find(".small_view_text").on("dblclick",function(){
				if($(ele).data("table_show") != "false"){

				if($(".click_new_folder_input").length != 0){
						$(".click_new_folder_input").css("borderColor","red");
						return;
					}
				//记录当前视图的名称
				var now_name = $(ele).text();
				$(ele).unbind("mouseenter mouseleave").css("background","");
				$(ele).find("img").unbind("click");
				$(ele).find(".hide_or_show_wrap").find("img").attr("src","../static/statements/img/right-icon_03.png").removeClass();

				$(ele).find(".hide_or_show_wrap").on("mouseenter",function(){$(ele).find(".hide_or_show_wrap").css("background","#F5F5F5");});
				$(ele).find(".hide_or_show_wrap").on("mouseleave",function(){$(ele).find(".hide_or_show_wrap").css("background","");});

				// 替换成input标签
				$(ele).find(".small_view_text").html("").append($("<input type='text' class='click_new_folder_input' placeholder='请输入...'  onfocus='javascript:this.select()' maxlength='10'>"));
				$(ele).find(".click_new_folder_input").css("width","100%").val(now_name).css("border","none").css("borderBottom","1px solid #E1E1E1");

				//点击保存更改后的名字
				$(ele).find(".hide_or_show_wrap").find("img").on("click",function(){
					
				//记录输入框里面的值
				var input_small_view_val = $(ele).find(".click_new_folder_input").val();

				if(input_small_view_val == ""){
					$(".click_new_folder_input").css("borderColor","red");
					return;
				}else{
						
					//更新服务器数据
					 $.post("../dashboard/changeName",{"objtype":"view","oldname":$(ele).find(".small_view_text").data("table_id"),"newname":input_small_view_val},function(result){
						 if(result["status"] == "ok"){
						 	$(".new_view_content .new_view_title .new_view_table_name").eq(index).html(input_small_view_val);
						 }
					 });
				}

				$(ele).find(".small_view_text").html(input_small_view_val).data("record_name",input_small_view_val);

				$(ele).find(".hide_or_show_wrap").find("img").unbind("click").attr("src","../static/statements/img/hide.png").addClass("hide_or_show");
			
				$(ele).find(".hide_or_show_wrap").unbind("mouseenter mouseleave click").css("background","");

				$(ele).on("mouseenter",function(){$(ele).css("background","#F5F5F5");$(ele).find("img").css("display","block")});
				$(ele).on("mouseleave",function(){$(ele).css("background","");$(ele).find("img").css("display","none")});


				$(".statement_li .view_show_content .view_show_handle img").unbind("click");
				//显示隐藏点击
				$(".cookie_handle_view .view_show_content .view_show_handle img").on("click",function(){
					click_or_show($(this).parent().parent());
				})
				$(ele).css("background","#F5F5F5").unbind("mouseenter mouseleave");
			})


				}


		})
	})

	}


//新建视图 下载 操作部分
function view_content_right_handle(){
	//新建视图
	$(".rightConent #right_folder_show_are .click_out_handle .click_new_view").on("click",function(){
		window.location.href= "../dashboard/pallasdata2";
	})

	//下载视图区域为pdf格式
	$(".rightConent #right_folder_show_are .click_out_handle .theme_down").on("click",function(){
		html2canvas($(".view_folder_show_area ul").parent().get(0), {
        onrendered: function(canvas) {
        	console.log(canvas)
            //通过html2canvas将html渲染成canvas，然后获取图片数据
            var imgData = canvas.toDataURL('image/jpeg');

            //初始化pdf，设置相应格式
            var doc = new jsPDF("p", "mm", "moren");

            //这里设置的是a4纸张尺寸
            doc.addImage(imgData, 'JPEG', 0, 0,$(".view_folder_show_area").width(),$(".view_folder_show_area").height());


            //输出保存命名为content的pdf
            doc.save('content.pdf');
        },
        background: "#fff",
     
    });

	})
}




//初始化
	function view_out_handle_init(data_result){
	
	//根据数据库存储的数据展示
	 statements_li_add(data_result);


	 //单击视图点击切换
	click_view_change_view();

	///报表拖入到文件夹中
	view_dragable_folder();

	//小视图点击 更换名称
	small_view_click_hide();

	 //报表更多按钮点击事件
	more_handle_click();

	//删除文件夹按钮点击事件
	delete_btn_handle();

	//报表重命名
	 handle_change_result("statement_li_content","click_more","more");

	// //文件夹重命名
	 handle_change_result("state_folder_content","click_delete","delete1");

	//新建视图 下载 操作部分
	view_content_right_handle();

	save_handle_count = -1;

	
	}

	// end-----
})

