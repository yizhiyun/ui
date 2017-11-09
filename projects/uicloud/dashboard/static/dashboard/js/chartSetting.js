var colorGroupName = ["默认","清爽","自然","轻快","美学","灰色","优美","冷静","绿色","蓝色"];
var allColorsDict = {
		"默认":["#e75f76","#fbb860","#19a5a2","#60ccf3","#1a80c5","#608EFB","#FBDD60","#F29161","#19A464","#2BA4CA"],
		"清爽":["#45a4cb","#42cd75","#8fede0","#c0ecca","#849cff","#A4EAB6","#88E79E","#75B7FE","#46DFE0","#62D0FE"],
		"自然":["#84ac34","#c4d64e","#8ec685","#d8ad4a","#efad6a","#649E5C","#E2C682","#8FDE82","#FFC583","#BDA364"],
		"轻快":["#ba221d","#f69566","#f5e939","#da9327","#2cb7d3","#DC504A","#E1753F","#E6DA1F","#EB8F00","#35CDEB"],
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


function dahboardSetting_function(){	
	// 设置默认的颜色
	$("#project_style .module_style .color_control .selectedColors span").each(function(index,ele){
		$(ele).css("background",allColorsDict[currentColorGroupName][index]);
	});
	$("#project_style .module_style .color_control .otherColorsModule").data("openOrColse","close");
	
	
	
	// 点击查看更多颜色的时候
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
		  			 // console.log(currentColorGroupName);
		  			 currentColorGroupName = $(this).siblings(".colorName").text();
		  			 console.log(currentColorGroupName);

		  			 // 图形改变颜色
		  			 var mycharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
		  			 if(mycharts){
		  			 	colorsPanelDidSelectedColor();
		  			 }
		  			 // 默认显示改变颜色
		  			 $("#project_style .module_style .color_control .defaultColors span.color_flag").text(currentColorGroupName);
		  			 $("#project_style .module_style .color_control .selectedColors span").each(function(index,ele){
		  			 	// console.log(allColorsDict[currentColorGroupName][index]);
		  			 	console.log(index);
						$(ele).css("background",allColorsDict[currentColorGroupName][index]);
					});


					// 隐藏更多颜色的展示面板
					$("#project_style .module_style .color_control .otherColorsModule").hide();
		  			$("#project_style .module_style .color_control .otherColorsModule").data("openOrColse","close"); 
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
			valueUnitDidChangedValue();
		}
	});
	
}