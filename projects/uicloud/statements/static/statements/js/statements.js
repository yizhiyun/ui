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

var count = 0;
//新建视图cont
var view_count = 0;
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



 

		

$(function(){


	$(".view_folder_select").comboSelect();
	//侧边栏收起按钮top
	$("#statements_left_bar #statements_left_bar_btn_close").css("top",($("body").height()-$(".topInfo").height())/2 - $("#statements_left_bar_btn_close").height()/2 + "px");

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
			},300);
			state_left_bar_close = true;
		}else{
			
			$("#statements_left_bar").animate({
				"left":"0",
			},300);
			$("#right_folder_show_are").animate({
				"marginLeft":$("#statements_left_bar").width() + "px",
				"width":right_width_content + "px",
			},300);
			state_left_bar_close = false;
		}
		$("#statements_left_bar #statements_left_bar_btn_close").css("display","block");
	})

	var right_width_content = $("body").width()-$("#statements_left_bar").position().left - $("#statements_left_bar").width() - $(".leftNav").width();
	//右侧视图展示区域宽度
	$("#right_folder_show_are").css("width",right_width_content + "px").css("height",$("body").height() - $(".topInfo").height() + "px");

	//拿到构建报表的数据
	$.post("../dashboard/getAllData",{"username":username},function(result){

			console.log(result)
			//记录返回报表的结果
		// 	var data_result = {"default":{"报表测试":{
		// 		"table1":{
		// 			"column":"ceshi1",
		// 			"row":"ceshi2",
		// 			"tablename":"ceshitext",
		// 			"username":"liuyue",
		// 			"viewtype":"bar"
		// 		}
		// 	}
		// },

		// 	"文件夹1":{
		// 		"报表测试2":{
		// 		"table1":{
		// 			"column":"ceshi1",
		// 			"row":"ceshi2",
		// 			"tablename":"ceshitext",
		// 			"username":"liuyue",
		// 			"viewtype":"bar"
		// 		},
		// 		"table2":{
		// 			"column":"ceshi1",
		// 			"row":"ceshi2",
		// 			"tablename":"ceshitext",
		// 			"username":"liuyue",
		// 			"viewtype":"bar"
		// 		},
		// 		"table3":{
		// 			"column":"ceshi1",
		// 			"row":"ceshi2",
		// 			"tablename":"ceshitext",
		// 			"username":"liuyue",
		// 			"viewtype":"bar"
		// 		}
		// 	}
		// 	}

		// 		}

			var data_result = result;

			view_out_handle_init(data_result);

		})

	
	//点击报表更多按钮创建弹窗
function click_state_show(thele){
	if($(thele).parent().find("#new_state_wrap").length == 0){
		$("#new_state_wrap").remove();
		var new_state_show = $("<div id='new_state_wrap'><div class='new_state_content' id='change_name'>重命名</div><div class='new_state_content' id='show_hide_img'>显示隐藏视图</div><div class='new_state_content' id='delete_view'>删除</div></div>")

		new_state_show.appendTo($(thele).parent());
		//删除按钮点击事件
		new_state_show.find("#delete_view").on("click",function(){
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
				$.post("../dashboard/deleteFolder",{"foldertype":"folder","foldername":now_folder_name,"username":username},function(result){{
					if(result != ""){
						$("#statements_left_bar_area").html("");
						view_out_handle_init(result);
						$("#delete_area").css("display","none");
						$(".maskLayer").css("display","none");
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
			double_click_change_name($(thele).parent().parent(),"view_show_name_save","click_more","more");
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
		
		ele.find("img").attr("src","../static/statements/img/hide.png");
		ele.parent().css("opacity","1").css("background","");
		ele.parent().each(function(index,ele){
			$(ele).on("mouseenter",function(){
				$(ele).css("background","#F5F5F5");ele.parent().find("img").css("display","block");
			})
			$(ele).on("mouseleave",function(){
				$(ele).css("background","");ele.parent().find("img").css("display","none");
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

//删除文件夹点击事件
function delete_btn_handle(){
	$(".click_delete").unbind("click");
	$(".click_delete").each(function(index,ele){
		$(ele).on("click",function(){

			//点击删除弹出框提示内容
			$(".delete_area_text h4").text('确定删除文件夹 "'+$(ele).parent().parent().find(".view_show_name_save").text()+'"  ?');
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
					$.post("../dashboard/deleteFolder",{"username":username,"foldertype":"parentfolder","isdeleteall":"yes","foldername":$(ele).parent().parent().find(".view_show_name_save").text(),defaultparent:"default"},function(result){
						
						if(result != ""){
							$("#statements_left_bar_area").html("");
							view_out_handle_init(result);
							$("#delete_area").css("display","none");
							$(".maskLayer").css("display","none");

						}
					});

				}else{
					
					$.post("../dashboard/deleteFolder",{"username":username,"foldertype":"parentfolder","isdeleteall":"no","foldername":$(ele).parent().parent().find(".view_show_name_save").text(),defaultparent:"default"},function(result){
						if(result != ""){
							$("#statements_left_bar_area").html("");
							view_out_handle_init(result);
							$("#delete_area").css("display","none");
							$(".maskLayer").css("display","none");
						}
					});
					
					
				}
			})
			
		})
	})
}

	
	//动态创建每个视图
	function fun_add_view(){
		var new_ele_view = $("<div class='new_view_content'><div class='new_view_title'><div class='new_view_table_name'>表标题</div><div class='new_view_right_icon'><div class='new_view_hide add_css_img'><img src='../static/statements/img/hide.png' alt='show_or_hide'></div><div class='new_view_tille_know add_css_img'><img src='../static/statements/img/title.png' alt='title'></div><div class='new_view_edit add_css_img'><img src='../static/statements/img/edit.png' alt='edit'></div><div class='new_view_remarks add_css_img'><img src='../static/statements/img/remarks.png' alt='remarks'></div><div class='new_view_delete add_css_img'><img src='../static/statements/img/delete1.png' alt='delete'></div></div></div><div class='new_view_main clear'>视图展示区域</div></div>")
		new_ele_view.appendTo($(".view_folder_show_area"));
		$(".new_view_content").css("width",$(".view_folder_show_area").width()/2 - 40);
		$(".new_view_content  .new_view_right_icon .add_css_img").each(function(index,ele){
			$(ele).on("mouseenter",function(){
				$(ele).css("background","#DEDEDE");
			})

			$(ele).on("mouseleave",function(){
				$(ele).css("background","");
			})
		})
	}
	//根据报表显示其中的视图
	function reason_view_drag(data_result,now_click_ele){
		//当前报表的文件夹
		var now_view_folder;
		// console.log(data_result)
		
		if(now_click_ele.parent().parent().parent().hasClass("state_folder")){
			now_view_folder = now_click_ele.parent().parent().parent().find(".state_folder_content").find(".view_show_name_save").text();
		}else{
			now_view_folder = "default";
		}
		if(now_view_folder != ""){
			//点击切换的报表
			var change_view_show_click = data_result[now_view_folder][now_click_ele.text()];
			for(right_view_show in change_view_show_click){
				fun_add_view();
				for(table_view in change_view_show_click[right_view_show]){
					console.log(table_view)
				}
			}
		}
	}
	//调用重命名方法
	function handle_change_result(content_ele,img_type,img_src,data_result){
		
		$("."+content_ele+"").each(function(index,ele){
			//单击事件
			$(ele).find(".view_show_name_save").one("click",function(){
				$(".view_show_name_save").css("color","");
				$(ele).find(".view_show_name_save").css("color","#0d53a4");
				reason_view_drag(data_result,$(ele).find(".view_show_name_save"));
			})

		$(ele).find(".view_show_name_save").dblclick(function(){
			//记录之前的名字
			pre_changeName = $(ele).find(".view_show_name_save").text();
			change_name_btn(pre_changeName,$(ele),"view_show_name_save",index);

			//保存重命名


		$(ele).find(".open_btn").find("img").unbind("click");
		$(ele).find(".open_btn").find("img").on("click",function(){
			double_click_change_name($(ele),"view_show_name_save",img_type,img_src);
			ele_each($("."+content_ele+""),$("."+img_type+""));
			$("#new_state_wrap").remove();

			more_handle_click();
			delete_btn_handle();
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
					$(ele).find("."+sonName+"").html("");
					$(ele).find("."+sonName+"").append($("<input type='text' class='click_new_folder_input' placeholder='请输入...'  onfocus='javascript:this.select()' maxlength='10'>"));
						

					if($(ele).parent().parent().attr("class") == "state_folder"){
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
					if(input_value == ""){
						$(ele).find(".click_new_folder_input").css("borderColor","red");
						return;
					}else{
						//修改名称向服务器发送请求
					 $.post("../dashboard/changeViewName",{"objtype":folder_or_view,"oldname":old_name,"newname":input_value},function(result){
					 	if(result["status"] == "false"){
					 		$(ele).find(".click_new_folder_input").css("borderColor","red");
					 		return;
					 	}
					 });
						$(ele).find(".click_new_folder_input").css("borderColor","");
					}
					$(ele).find(".click_new_folder_input").remove();
					$(ele).find("."+sonName+"").html(input_value).data("record_name",input_value);
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
						if($(ele).parent().parent().attr("class") == "state_folder"){
								$(ele).find(".view_show_name_save").css("width","103px");
							}else{
								$(ele).find(".view_show_name_save").css("width","120px");
							}
						})
	}


	//创建报表显示li的工厂函数
	function statements_li_add(data_result){
		
		for(erv_data in data_result){
			if(erv_data != "default"){
					var folder = $("<div class='state_folder'><div class='state_folder_content'><img src=../static/statements/img/folder.png  class='click_folder'/><div class='view_show_name_save'>"+erv_data+"</div><div class='view_show_img_content'><img src=../static/statements/img/delete1.png  class='click_delete'/></div></div></div>");
					folder.prependTo($("#statements_left_bar_area"));
					folder.find(".view_show_name_save").data("record_name",erv_data);

			}
				for(small_view_show in data_result[erv_data]){
					
					var oDiv = $("<div class='statement_li clear'><div class='statement_li_content'><img src=../static/statements/img/form_icon.png  class='view_show_icon'><div class='view_show_name_save'>"+small_view_show+"</div><div class='view_show_img_content'><img src=../static/statements/img//more.png class='click_more'/></div></div><div class='view_show_content'></div></div>");
				if(erv_data != "default" && small_view_show != ""){
					oDiv.find(".view_show_name_save").parent().parent().addClass("floder_view_wrap");
					oDiv.appendTo(folder);
					folder.find(".view_show_name_save").css("width","103px");
					$("<img src=../static/statements/img/left_35.png  class='click_tra click_tra_floder'/>").prependTo($(".state_folder_content"));
				}else{
					oDiv.find(".view_show_name_save").data("record_name",small_view_show);

					oDiv.appendTo($("#statements_left_bar_area"));
				}


				// ..
				for(view_show in data_result[erv_data][small_view_show]){
	
				if(view_show.indexOf("table") == 0){
					count++;
					//判断是否有修改过的名字 而不使用默认的展现形式

					if(data_result[erv_data][small_view_show][view_show]["viewname"] != null){
						
						small_view_show_text = data_result[erv_data][small_view_show][view_show]["viewname"];
					}else{
						
						small_view_show_text = "视图"+count;
					}
					//创建视图小部件
					
					// small_view_show_text = "视图"+count;

					small_view_handle_text = "table"+count;

					var view_handle = $("<div class='view_show_handle'><div class='small_view_text'>"+small_view_show_text+"</div><div class='hide_or_show_wrap'><img src=../static/statements/img/hide.png class='hide_or_show'></div></div>");
					if(erv_data != "default"){

						oDiv.find(".statement_li_content").find(".click_tra_statement").remove();
						view_handle.find(".small_view_text").css("width","122px").data("record_name",$(oDiv).find(".small_view_text").text());
						view_handle.appendTo(folder.find(".statement_li").find(".view_show_content"));
						$("<img src=../static/statements/img/left_35.png  class='click_tra click_tra_statement'/>").prependTo(oDiv.find(".statement_li_content"));
						
					}else{
						oDiv.find(".statement_li_content").find(".click_tra_statement").remove();
						console.log(small_view_show_text);
						$("<img src=../static/statements/img/left_35.png  class='click_tra click_tra_statement'/>").prependTo(oDiv.find(".statement_li_content"));
						view_handle.find(".small_view_text").css("width","139px").data("record_name",small_view_show_text);
						view_handle.appendTo($(oDiv).find(".view_show_content"));
					}
						
						
				}else{
					return;
				}
			}



				}
				

				
		
		}
		
		//判断视图报表里是否存在子视图
		$(".statement_li").each(function(index,ele){
			if($(ele).find(".view_show_handle").length == 0){
				$(ele).find(".click_tra").css("display","none");
				$(ele).find(".view_show_name_save").css("width","137px");
			}
		})
		

		$(".state_folder").each(function(index,ele){
			if($(ele).find(".statement_li").length == 0){
				$(ele).find(".click_delete").css("display","none");
				$(ele).find(".view_show_name_save").css("width","137px");
			}
		})

		//小部件移入移出事件
		// ele_each($(".view_show_handle"),$(".hide_or_show"))
		$(".view_show_handle").each(function(index,ele){
			$(ele).on("mouseenter",function(){
				$(ele).find(".hide_or_show").css("display","block");
				$(ele).css("background","#F5F5F5");
			})
			$(ele).on("mouseleave",function(){
				$(ele).find(".hide_or_show").css("display","none");
				$(ele).css("background","");
			})

		})

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
				console.log("123")
				$(ele).attr("src","../static/statements/img/left_40.png");
				}else{
				$(ele).attr("src","../static/statements/img/left_35.png");
				}
			});

			
		})
	})

	//报表更多按钮点击事件
	// $(".click_more").each(function(index,ele){
	// 	console.log("123")
	// 	$(ele).on("click",function(){
	// 		console.log(change_if_name)
	// 		if(change_if_name){
	// 			click_state_show($(ele));
	// 		}else{
	// 			change_if_name = true;
	// 		}
	// 	})
	// })

	$(".state_folder").each(function(index,ele){
		if($(ele).find(".statement_li").length == 0){
			$(ele).find(".click_tra_floder").remove();
		}
	})

	$(".statement_li").eq(0).find(".view_show_name_save").css("color","#0d53a4");
	
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



	
	//新建文件夹新建视图方法
	function new_folder_view(type,text,tra_type,tra_class,btn_type,type_content,type_wrap){
		var post_dict ={}

			if($("#statements_left_bar_area").find(".click_new_folder_input").length == 0){
				
			var new_folder= $("<div class="+type_content+"><div class='empty_folder "+type_wrap+"'><img src='../static/statements/img/"+type+".png'  class='click_folder'/><div class='view_show_name_save new_element'><input type='text' class='click_new_folder_input' placeholder="+text+" maxlength='10'></div><div class='mouse_img "+btn_type+"'><img src=../static/statements/img/right-icon_03.png/></div></div></div>")
			

			new_folder.prependTo($("#statements_left_bar_area"));
			if(type == "folder"){
						folder_count++;

						$(".click_new_folder_input").val(text+folder_count);
						
						new_folder.find(".view_show_name_save").addClass("floder_content").data("record_name",text+folder_count);

				}else{
					view_count++;
					$(".click_new_folder_input").val(text+view_count);
					console.log(new_folder.find(".view_show_name_save"))
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
							if(result["status"] == "false"){
								$(".click_new_folder_input").css("borderColor","red");
								return;
							}else{
								new_view_show_and(result);
								//报表更多按钮点击事件
								more_handle_click();
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
								//报表更多按钮点击事件
								more_handle_click();
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

					


						
						//报表重命名
						handle_change_result("statement_li_content","click_more","more",result);

						//文件夹重命名
						handle_change_result("state_folder_content","click_delete","delete1",result);

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
	// console.log(statements_li_adda)
	$(".statement_li_content").find(".view_show_name_save").each(function(index,ele){
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
			accept:$(".statement_li_content").find(".view_show_name_save").not($(ele).find(".view_show_name_save")),
			drop:function(event,ui){
				$.post("../dashboard/RelevanceFolder",{"foldername":ui.helper.text(),"parentfoldername":$(ele).find(".view_show_name_save").text(),"username":username},function(result){
						$("#statements_left_bar_area").html("");
						//根据数据库存储的数据展示
						view_out_handle_init(result);
						// console.log(statements_li_adda,result)
				})
			
				// console.log(statements_li_adda,result)
			}

		});
	})
}
	

	//点击创建文件夹
	$("#add_folder_btn").on("click",function(){
		new_folder_view("folder","新建文件夹","delete1","click_delete","view_show_img_content","state_folder","state_folder_content");


	})

	//点击新建视图
	$("#add_view_btn").on("click",function(){
		new_folder_view("form_icon","新建视图","more","click_more","view_show_img_content","statement_li","statement_li_content");
	})



	//小视图点击隐藏显示
	function small_view_click_hide(){
		$(".view_show_handle").each(function(index,ele){
			//隐藏显示点击切换
			function click_or_show(ele){
				$(ele).find("img").on("click",function(){
					console.log($(ele).find("img").attr("src"))
				if($(ele).find("img").attr("src") == '../static/statements/img/show.png'){
					$(ele).find("img").attr("src","../static/statements/img/hide.png");
					$(ele).css("opacity","1");
					$(ele).on("mouseenter",function(){$(ele).css("background","#F5F5F5");$(ele).find("img").css("display","block")});
					$(ele).on("mouseleave",function(){$(ele).css("background","");$(ele).find("img").css("display","none")});
					
				}else{
					$(ele).find("img").attr("src","../static/statements/img/show.png");
					$(ele).unbind("mouseenter mouseleave");
					$(ele).css("background","#F5F5F5").css("opacity","0.5");
				}
			})
			}

			click_or_show($(ele));
			//小视图重命名
			$(ele).find(".small_view_text").on("dblclick",function(){

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
					console.log($(ele).find(".small_view_text").data("record_name"))
					//记录输入框里面的值
					var input_small_view_val = $(ele).find(".click_new_folder_input").val();



					if(input_small_view_val == ""){
						$(".click_new_folder_input").css("borderColor","red");
						return;
					}else{
						console.log("view",small_view_handle_text,input_small_view_val)
						//更新服务器数据
						 $.post("../dashboard/changeViewName",{"objtype":"view","oldname":small_view_handle_text,"newname":input_small_view_val},function(result){console.log(result)});
					}

					$(ele).find(".small_view_text").html(input_small_view_val).data("record_name",input_small_view_val);

					$(ele).find(".hide_or_show_wrap").find("img").unbind("click").attr("src","../static/statements/img/hide.png").addClass("hide_or_show");
				
					$(ele).find(".hide_or_show_wrap").unbind("mouseenter mouseleave click").css("background","");

					$(ele).on("mouseenter",function(){$(ele).css("background","#F5F5F5");$(ele).find("img").css("display","block")});
					$(ele).on("mouseleave",function(){$(ele).css("background","");$(ele).find("img").css("display","none")});

					//显示隐藏点击
					click_or_show($(ele));
				})


			})
		})


	

	}

		//初始化
			function view_out_handle_init(data_result){
			//根据数据库存储的数据展示
			statements_li_add(data_result);

			//小视图点击 更换名称
			small_view_click_hide();
			//报表重命名
			handle_change_result("statement_li_content","click_more","more",data_result);

			//文件夹重命名
			handle_change_result("state_folder_content","click_delete","delete1",data_result);

			
			//删除文件夹按钮点击事件
			delete_btn_handle();

			//报表拖入到文件夹中
			view_dragable_folder();

			//报表更多按钮点击事件
			more_handle_click();
			}

	// end-----
})


//获取对象的长度
	// Object.prototype.length_add = function(){
	// 	var count= 0;
	// 	for(var i in this){
	// 		count++;
	// 	}
	// 	return count-1;
	// }
