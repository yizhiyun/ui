var colorGroupName = ["默认","清爽","自然","轻快","美学","灰色","优美","冷静","绿色","蓝色"];
var allColorsDict = {
		"默认":["#1a80c5","#fbb860","#19a5a2","#60ccf3","#e75f76","#608EFB","#FBDD60","#F29161","#19A464","#2BA4CA"],
		// "默认":["#e75f76","#fbb860","#19a5a2","#60ccf3","#1a80c5","#608EFB","#FBDD60","#F29161","#19A464","#2BA4CA"],
		"清爽":["#45a4cb","#42cd75","#8fede0","#c0ecca","#849cff","#A4EAB6","#88E79E","#75B7FE","#46DFE0","#62D0FE"],
		// "自然":["#84ac34","#c4d64e","#8ec685","#d8ad4a","#efad6a","#649E5C","#E2C682","#8FDE82","#FFC583","#BDA364"],
		"自然":["#84ac34","#efad6a","#8ec685","#d8ad4a","#c4d64e","#649E5C","#E2C682","#8FDE82","#FFC583","#BDA364"],
		"轻快":["#2cb7d3","#f69566","#f5e939","#da9327","#ba221d","#DC504A","#E1753F","#E6DA1F","#EB8F00","#35CDEB"],
		// "轻快":["#ba221d","#f69566","#f5e939","#da9327","#2cb7d3","#DC504A","#E1753F","#E6DA1F","#EB8F00","#35CDEB"],
		"美学":["#E67A83","#F3AF7B","#9CCE80","#62BAA2","#A37CAE","#E76B74","#FCD871","#BAE0A5","#59D1B1","#BE8BCD"],
		"灰色":["#272727","#393939","#4A4A4A","#585858","#6E6E6E","#7C7C7C","#8D8D8D","#9E9E9E","#B1B1B1","#CDCDCD"],
		"优美":["#E97985","#EC897C","#7A7FB6","#C49AA9","#C19D9C","#EC6576","#EBA07C","#877BB4","#C39ABF","#D09F9E"],
		"冷静":["#00958C","#006896","#00488F","#0084B5","#5799CE","#00B4A8","#1F97CC","#1D66AE","#12ABE2","#51C2A9"],
		"绿色":["#008948","#009C52","#00B05B","#00BE62","#10CC73","#20DE82","#30EA92","#4EF4A5","#6DFEB8","#9DFED0"],
		"蓝色":["#0C54A3","#095FBF","#1469CC","#0A72E6","#288DFE","#4FA3FE","#6FB5FE","#88C1FF","#ABD4FF","#BDDDFF"]
}

var allValueUnitDict = {
	"个":1,
	"百":100,
	"千":1000,
	"万":10000,
	"百万":1000000,
	"千万":10000000,
	"亿":100000000,
	"百分比":0.01
}

var currentColorGroupName = "默认";

var normalUnitValue = -1;

var valueUnitValue = "个";


//预警
var yjSaveHandleArr = {};

function dahboardSetting_function(){
	// 设置默认的颜色
	$("#project_style .module_style .color_control .selectedColors span").each(function(index,ele){
		$(ele).css("background",allColorsDict[currentColorGroupName][index]);
	});
	$("#project_style .module_style .color_control .otherColorsModule").data("openOrColse","close");
	
	
	
	// 点击查看更多颜色的时候
	$("#project_style .module_style .color_control .defaultColors .moreColorBtn").unbind("click");
	$("#project_style .module_style .color_control .defaultColors .moreColorBtn").click(function(event){
		event.stopPropagation();
		var otherColorModule = $("#project_style .module_style .color_control .otherColorsModule");
		var someColorList = otherColorModule.find(".someColorList");
		if(otherColorModule.data("openOrColse") == "close"){
			if(someColorList.children(".colorGroupItem").length < 1){
				for (var i = 0;i < colorGroupName.length;i++) {
					var colorName = colorGroupName[i];
					var colorsArray = allColorsDict[colorName];
					var colorGroupItem = $("<div class='colorGroupItem'><span class='colorName'>"+colorName+"</span><div class='colorsContainer'></div></div>");
					for (var j = 0;j < 5;j++) {
						var cubeSpan = $("<span class='colorCube'><span>");
						cubeSpan.css("background",colorsArray[j]);
						colorGroupItem.find(".colorsContainer").append(cubeSpan);
					}
					someColorList.append(colorGroupItem);
				}
				 someColorList.find(".colorGroupItem .colorsContainer").click(function(event){
		  			 event.stopPropagation();
		  			 currentColorGroupName = $(this).siblings(".colorName").text();

		  			 // 图形改变颜色
		  			 var mycharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
		  			 if(mycharts){
		  			 	colorsPanelDidSelectedColor();
		  			 }
		  			 // 默认显示改变颜色
		  			 $("#project_style .module_style .color_control .defaultColors span.color_flag").text(currentColorGroupName);
		  			 $("#project_style .module_style .color_control .selectedColors span").each(function(index,ele){
		  			 	// console.log(allColorsDict[currentColorGroupName][index]);

						$(ele).css("background",allColorsDict[currentColorGroupName][index]);
					});


					// 隐藏更多颜色的展示面板
					$("#project_style .module_style .color_control .otherColorsModule").hide();
		  			$("#project_style .module_style .color_control .otherColorsModule").data("openOrColse","close");
					if($(".clickActive") != undefined && $(".clickActive").length > 0){
						if($(".drillDownHandle").length > 0){
							return;
						}
						if(saveDrillDownTemp[$(".clickActive").find("span").text()] == undefined){
							saveDrillDownTemp[$(".clickActive").find("span").text()] = {"viewdata":JSON.parse(JSON.stringify(drag_row_column_data)),"viewType":save_now_show_view_text.attr("id"),"calculateStyle":objectDeepCopy(drag_measureCalculateStyle),"dragViewStyle":objectDeepCopy(currentColorGroupName)+"_YZY_"+objectDeepCopy(normalUnitValue)+"_YZY_"+objectDeepCopy(valueUnitValue)};
						}else{
							saveDrillDownTemp[$(".clickActive").find("span").text()]["dragViewStyle"] = objectDeepCopy(currentColorGroupName)+"_YZY_"+objectDeepCopy(normalUnitValue)+"_YZY_"+objectDeepCopy(valueUnitValue);
						}
						
					}
			 	 });
			}
		  otherColorModule.show();
		  otherColorModule.data("openOrColse","open"); 
		  
		 
		  
		}else{
		  $("#project_style .module_style .color_control .otherColorsModule").hide();
		  $("#project_style .module_style .color_control .otherColorsModule").data("openOrColse","close"); 
		}
		
	});
	
	
	
	// 单位部分
	$("#project_style .module_style .normalUnit .content span").click(function(event){
		event.stopPropagation();
		if(!$(this).hasClass("active")){
			$(this).siblings("span.active").removeClass("active");
			$(this).addClass("active");
			normalUnitValue = Number($(this).attr("unit"));
			if($(".clickActive") != undefined && $(".clickActive").length > 0){
				if($(".drillDownHandle").length > 0){
					return;
				}
				if(saveDrillDownTemp[$(".clickActive").find("span").text()] == undefined){
					saveDrillDownTemp[$(".clickActive").find("span").text()] = {"viewdata":JSON.parse(JSON.stringify(drag_row_column_data)),"viewType":save_now_show_view_text.attr("id"),"calculateStyle":objectDeepCopy(drag_measureCalculateStyle),"dragViewStyle":objectDeepCopy(currentColorGroupName)+"_YZY_"+objectDeepCopy(normalUnitValue)+"_YZY_"+objectDeepCopy(valueUnitValue)};
				}else{
					saveDrillDownTemp[$(".clickActive").find("span").text()]["dragViewStyle"] = objectDeepCopy(currentColorGroupName)+"_YZY_"+objectDeepCopy(normalUnitValue)+"_YZY_"+objectDeepCopy(valueUnitValue);
				}
				
			}
			normalUnitDidChangeValue();
		}
	});
	
	// 值单位部分
	$("#project_style .module_style .valueUnit .content span").click(function(event){
		event.stopPropagation();
		if(!$(this).hasClass("active")){
			$(this).siblings("span.active").removeClass("active");
			$(this).addClass("active");
			valueUnitValue = $(this).text();
			if($(".clickActive") != undefined && $(".clickActive").length > 0){
				if($(".drillDownHandle").length > 0){
					return;
				}
				if(saveDrillDownTemp[$(".clickActive").find("span").text()] == undefined){
					saveDrillDownTemp[$(".clickActive").find("span").text()] = {"viewdata":JSON.parse(JSON.stringify(drag_row_column_data)),"viewType":save_now_show_view_text.attr("id"),"calculateStyle":objectDeepCopy(drag_measureCalculateStyle),"dragViewStyle":objectDeepCopy(currentColorGroupName)+"_YZY_"+objectDeepCopy(normalUnitValue)+"_YZY_"+objectDeepCopy(valueUnitValue)};
				}else{
					saveDrillDownTemp[$(".clickActive").find("span").text()]["dragViewStyle"] = objectDeepCopy(currentColorGroupName)+"_YZY_"+objectDeepCopy(normalUnitValue)+"_YZY_"+objectDeepCopy(valueUnitValue);
				}
				
			}
			valueUnitDidChangedValue();
		}
	});

	//预警
	$("#yujing-show .yujing-add .add").unbind("click");
	$("#yujing-show .yujing-add .add").on("click",function(event){
		event.stopPropagation();
		yjInit();
		$(".maskLayer").show();
		$("#warningPanel").css("z-index","1000").show();
		$("#warningPanel .close").click(function(){
			$(".maskLayer").hide();
			$("#warningPanel").hide();
		})
	})


	// 预警初始化
	function yjInit(){
		$("#warningPanelSetting .warning-body .warning-name-input-div input").val("");
		$("#warningPanelSetting .warning-body .warning-setting .warning-setting-area .scrollBody-box .first-line-condition .detailConditionDiv input").val("0");
	}

	//预警线
	function yjLineDraw(yjSaveHandleArr){
		//获取展示图形的实例
		var mycharts_yj = echarts.getInstanceByDom($("#main").get(0));

		var tempEcharts = mycharts_yj.getOption();

		var tempDictHandleDate = [];

		for(var iKey in yjSaveHandleArr){
			var aDate = yjSaveHandleArr[iKey];
			tempDictHandleDate.push({"name":aDate.name,"xAxis":aDate.handleValue})
		}

		var tempDictHandleYj = {
		label: {
                normal: {
                    show: true,
                    position: 'end',
                    formatter:"{b} {c}"
                }
            },
            lineStyle: {
                normal: {
                    color: '#FF0000'
                }
            },
            symbol: 'none',
            data:tempDictHandleDate,
        };


        tempEcharts.series[0]["markLine"] = tempDictHandleYj;
		mycharts_yj.setOption(tempEcharts);
	}

	//编辑预警
	function editYjHandle(ele){
		var tempDate = yjSaveHandleArr[$(ele).parent().parent("p").attr("dataValue")];
		$("#warningPanelSetting .warning-body .warning-name-input-div input").val(tempDate.name);
		$("#warningPanelSetting .warning-body .warning-setting .warning-setting-area .scrollBody-box .first-line-condition .detailConditionDiv input").val(tempDate.handleValue);
		$("#warningPanelSetting .warning-body .warning-setting .warning-setting-area .scrollBody-box .line-condition .fieldSelctDiv .option-item").each(function(index,ele){
			if($(ele).attr("title") == tempDate.colName){
				$(ele).trigger("click");
			}
		})


		$("#warningPanelSetting .warning-body .warning-setting .warning-setting-area .scrollBody-box .first-line-condition .conditionSelectDiv .option-item").each(function(index,ele){
			if($(ele).attr("title") == tempDate.handle){
				$(ele).trigger("click");
			}
		})
		
		// $("#warningPanelSetting .warning-body .warning-setting .warning-setting-area .scrollBody-box .line-condition .fieldSelctDiv .option-item").trigger("click");
	}

	$("#warningPanel .common-filter-footer .cancleBtn").click(function(){
		$(".maskLayer").hide();
		$("#warningPanel").hide();
	})
	$("#warningPanel .common-filter-footer .confirmBtn").click(function(){
		yjLineDraw(yjSaveHandleArr);
		$(".maskLayer").hide()

		$("#warningPanel").hide();
		if($(".add-lists").find("li")){
			$(".view_folder_show_area .new_view_content .new_view_title .new_view_yujing img").attr("src","../static/statements/img/yujing_icon_show_03.png");
			$(".container .topInfo #loginInfo img.alert").attr("src","../static/statements/img/yujing_icon_new_03.png");
			var len = $("#warningPanel .add-lists li").length;
			for(var i=0;i<len;i++){
			    var listItem = "<li><div class='dot'></div><div class='msg-right'><div class='msg-note'>消息通知</div><div class='msg-time'>2018-03-10</div></div></li>"
			    $(".container .topInfo #yujing-bg .msg-lists").append(listItem);
			}
		}
	})



	$("#warningPanel .warning-body .add-warning").unbind("click");
	$("#warningPanel .warning-body .add-warning").bind("click",function(){

		$(".maskLayer").show();
		var listItem = "<li><div class='dot'></div><div class='msg-right'><div class='msg-note'>消息通知</div><div class='msg-time'>2018-03-14</div></div></li>"
		$(".container .topInfo #yujing-bg .msg-lists").append(listItem);
		$("#warningPanel").hide();
		$(".warning-setting-area .fieldSelctDiv .custom-select").html("");
		var need_handle_yj_measureName = specialRemoveDataTypeHandle(drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]))	;
		for(var i = 0; i < need_handle_yj_measureName.length;i++){
			var yjOption = "<option value="+drag_measureCalculateStyle[need_handle_yj_measureName[i]]+">"+drag_measureCalculateStyle[need_handle_yj_measureName[i]]+"</option>"
			$(".warning-setting-area .fieldSelctDiv .custom-select").append(yjOption);
		}
		var spinner = $( ".spinner" ).spinner();
		$(".warning-setting-area .fieldSelctDiv .custom-select").comboSelect();
		$("#warningPanelSetting").css("z-index","1000").show();
		$("#warningPanelSetting .warning-body .warning-name-input-div input").val(" ");
	})
	$("#warningPanelSetting .close").unbind("click");
	$("#warningPanelSetting .close").bind("click",function(){
		$(".maskLayer").hide();
		$("#warningPanelSetting").hide();
	})

	$("#warningPanelSetting .common-filter-footer .cancleBtn").unbind("click");
	$("#warningPanelSetting .common-filter-footer .cancleBtn").bind("click",function(){
		// $(".maskLayer").hide();
		$("#warningPanelSetting").hide();
		$("#warningPanel").css("z-index","1000").show();
	})
	$("#warningPanelSetting .common-filter-footer .confirmBtn").unbind("click");
	$("#warningPanelSetting .common-filter-footer .confirmBtn").bind("click",function(){
		// $(".maskLayer").hide();
		var yujingName = $("#warningPanelSetting .warning-body .warning-name-input-div input").val().replace(/\s/g,"");

		
		yjSaveHandleArr[yujingName] = {"name":yujingName,"colName":$("#warningPanelSetting .warning-body .warning-setting .warning-setting-area .scrollBody-box .first-line-condition .fieldSelctDiv .combo-select select").val(),"handle":$("#warningPanelSetting .warning-body .warning-setting .warning-setting-area .scrollBody-box .first-line-condition .conditionSelectDiv .combo-select select").val(),"handleValue":$("#warningPanelSetting .warning-body .warning-setting .warning-setting-area .scrollBody-box .first-line-condition .detailConditionDiv input").val()};

		$("#warningPanelSetting").hide();
		$("#warningPanel .warning-body .warning-addArea .add-lists").css({"padding":"10px 10px 0px 10px"});
		$("#warningPanel .warning-body .warning-addArea .add-lists").append("<li>"+yujingName+"<span class='yj-del'><img src='../static/statements/img/delete.png' title='删除'></span><span class='yj-edit'><img src='../static/statements/img/yj-edit.png' title='编辑'></span></li>");
		$("#warningPanel").css("z-index","1000").show();

		$("#yujing-show .yujing-lists").append("<p dataValue="+yujingName+">"+yujingName+"<span class='yj-del'><img src='../static/statements/img/delete.png' title='删除'></span><span class='yj-edit'><img src='../static/statements/img/yj-edit.png' title='编辑'></span></p>");


		$("#yujing-show .yujing-lists .yj-edit img").unbind("click");
		$("#yujing-show .yujing-lists .yj-edit img").click(function(){
			yjInit();
			editYjHandle(this);
			$(".warning-setting-area .fieldSelctDiv .custom-select").html("");
			var need_handle_yj_measureName = specialRemoveDataTypeHandle(drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]))	;
			for(var i = 0; i < need_handle_yj_measureName.length;i++){
				var yjOption = "<option value="+drag_measureCalculateStyle[need_handle_yj_measureName[i]]+">"+drag_measureCalculateStyle[need_handle_yj_measureName[i]]+"</option>"
				$(".warning-setting-area .fieldSelctDiv .custom-select").append(yjOption);
			}
			$(".warning-setting-area .fieldSelctDiv .custom-select").comboSelect();
			$("#warningPanelSetting,.maskLayer").show();

		})
		$("#yujing-show .yujing-lists .yj-del img").unbind("click");
		$("#yujing-show .yujing-lists .yj-del img").bind("click",function(){
			$(this).parent().parent().remove();
			if($("#yujing-show .yujing-lists p").length == 0){
				$("#warningPanel .warning-body .warning-addArea .add-lists").empty();
				$(".container .topInfo #loginInfo img.alert").attr("src","../static/statements/img/yujing_icon_03.png");
				$(".container .topInfo #yujing-bg .msg-lists").empty();
			}else{
				$(".container .topInfo #yujing-bg .msg-lists").find("li:last").remove();
				$("#warningPanel .warning-body .warning-addArea .add-lists").find("li:last").remove();
			}
		})

	})

	$("#warningPanelSetting .warning-time select").comboSelect();
}
