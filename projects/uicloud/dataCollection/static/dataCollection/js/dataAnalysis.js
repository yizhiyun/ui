var tableDragsRecords = []; // 记录拖拽的表格 id
var didShowDragAreaTableInfo= {}; // 用来记录拖拽到拖拽区域的所有表格信息
$(function(){
$("#analysisContainer .leftSlide").css("height",(document.offsetHeight | document.body.offsetHeight) - 70 + "px");
$("#analysisContainer .mainDragArea").css({"margin-left":$("#analysisContainer .leftSlide").width() + "px","height":(document.offsetHeight | document.body.offsetHeight) - 70 + "px"});
// 数据平台下具体数据库变化的时候
$(".dataSetDetail select").change(function() {
	var theSelect = this;
	getTablesOfaDataBase(theSelect);
});

// 取消滑动事件的冒泡行为
$("#analysisContainer .tablesOfaData").scroll(function(event){
	event.stopPropagation();
})

var tableDragrecords = {};

// 展示某个数据库下方的数据表格
function getTablesOfaDataBase(theSelect){
	$.ajax({
		url: "/dataCollection/tablesOfaDB",
		type: "post",
		data: {
			"theDBName": $(theSelect).val(),
			"dbObjIndex": $(theSelect)[0].title
		},
		success: function(data) {
			var rs = $.parseJSON(data);
			$(theSelect).parent().next().html("");
			for(var i = 0; i < rs.data.length; i++) {
				var p = $("<p>" + rs.data[i] + "</p>");
				$(theSelect).parent().next().append(p);
			}
			bindEventToPerTable($(theSelect).val(),$(theSelect)[0].title);
		}
	})
}
getTablesOfaDataBase($(".dataSetDetail select"));



// 处理表格的拖拽和点击事件
//dbPaltIndexForBack 主要记录了这个数据库表格在后台属于哪个数据连接平台下的，是一个下标，后台通过这个索引值去寻找
	function bindEventToPerTable(dataBaseName,dbPaltIndexForBack){
		
		
		dragUIHandle($(".tablesOfaData p"),$("#analysisContainer .mainDragArea"),function(ui,event){
			event.stopPropagation();
			event.preventDefault();
			tableName = $(ui.draggable).html();
			targetEle = this;
			// 已近存在的表格
			if (tableDragsRecords.indexOf("T" +dbPaltIndexForBack + "_YZYPD_"+ dataBaseName + "_YZYPD_" + tableName) != -1) {
				return;
				
			}			
			
						// 请求后端，获取表格的具体信息
			$.ajax({
				url:"/dataCollection/tableFileds",
				type:"post",
				data:{"tableName":$(ui.draggable).html()},
				success:function(data){
					var rs = $.parseJSON(data);			
					showDataTables(dataBaseName,tableName,rs.data,ui,targetEle,dbPaltIndexForBack);
				}
			})	
			
			
		});
		
		// 点击出现表格	
		 
//		$(".tablesOfaData pppp").click(function(event){
//			event.stopPropagation();
//			event.preventDefault();
//			tableName = $(this).html();
//			// 已近存在的表格
//			if (tableDragsRecords.indexOf(dataBaseName + "_YZYPD_" + tableName) != -1) {
//				return;
//				
//			}
//			// 请求后端，获取表格的具体信息
//			$.ajax({
//				url:"/dataCollection/tableFileds",
//				type:"post",
//				data:{"tableName":$(this).html()},
//				success:function(data){
//					var rs = $.parseJSON(data);
//					showDataTables(dataBaseName,tableName,rs.data);
//				}
//			})	
//		})
	}
	
 // 创建可视化的表格
 		function showDataTables(dataBaseName,tableName,data,ui,targetEle,dbPaltIndexForBack){
 			if (data.length > 0) {
 				var boxDiv = $("<div class='boxDiv'></div>");
 				
 				boxDiv.css({
 					left:(ui.offset.left - $(targetEle).offset().left) < 10 ? 10 : (ui.offset.left - $(targetEle).offset().left),
 					top:(ui.offset.top - $(targetEle).offset().top) < 10 ? 10 :(ui.offset.top - $(targetEle).offset().top)
 				})
 				
 				
 				
 				// 主要为了 ID 不重复---同时给后端去传递相应的数据
 				boxDiv[0].id = "T" +dbPaltIndexForBack + "_YZYPD_"+ dataBaseName + "_YZYPD_" + tableName;				
 				tableDragsRecords.push(boxDiv[0].id);
 				
 				boxDiv.append($("<div class='tableTitle'>" + "<img src=" + "/../../../static/dataCollection/images/left_40.png"+"/>"+"<p>"+tableName+"</p>"+ "</div>"));
 				boxDiv.append("<div class='clear'></div>")
 				
 				var tableList = $("<ul class='fields'></ul>");
 				boxDiv.append(tableList);
 				for (var i = 0;i < data.length;i++) {
   					var aLi = $("<li>" + "<input type='checkbox' name='name' value='' checked='checked'>"+"<span>"+data[i][0]+"</span>"+"</li>");
   					aLi[0].index = i; // 自定义属性，记录当前是第几个 li
   					// 默认所有字段选中，都是可用的
   					data[i].push("able");
   					tableList.append(aLi);
 				}
 			}
 			
   			$(targetEle).append(boxDiv);
   			// 可拖拽
   			$(".boxDiv").draggable({ containment: "#analysisContainer .mainDragArea", scroll: false,
   				drag:function(){
   					instance.repaintEverything();
   				},
   				stop:function(){
   					instance.repaintEverything();
   				}
   		}); 			
   	
   			 tableDrag(tableDragsRecords);
   			 
   			 // 记录已经拖拽的表格数据
   			 didShowDragAreaTableInfo[boxDiv[0].id] = data;
   			 
   			 
   			 bindEventToBoxDivFiledsCheckBox();
   			
   			
 		}
 		
 		
 //---- 点击数据集收回列表		
 		$("#dataSet .detailDataSetList  li .dataSetItemTitle").click(function(event){
 			event.stopPropagation();
 			if (this.getAttribute("openFlag") == "on") {
 				this.setAttribute("openFlag","off");
 				$(this).children("img").attr("src","/../../../static/dataCollection/images/left_35.png");
 				$(this).next(".theDataSetContent").hide("blind",300);
 			}else{
 				this.setAttribute("openFlag","on");
 				$(this).children("img").attr("src","/../../../static/dataCollection/images/left_40.png");
 				$(this).next(".theDataSetContent").show("blind",300);
 			}
 			
 		});
 
 
	function bindEventToBoxDivFiledsCheckBox(){
		 // 拖拽区域每个表格中的复选框进行选择时候触发的方法
	$("#mainDragArea .boxDiv .fields input[type='checkbox']").unbind("change");
   	$("#mainDragArea .boxDiv .fields input[type='checkbox']").change(function(event){
// 		console.log($(this).parent(".boxDiv"));
   		var index = $(this).parent()[0].index;
   		var filed = didShowDragAreaTableInfo[$(this).parents(".boxDiv").eq(0)[0].id][index];
   		if (this.checked && filed[filed.length - 1] == "disable") {
   			filed[filed.length - 1] = "able"
   		}else if (!this.checked && filed[filed.length - 1] == "able") {
   			filed[filed.length - 1] = "disable"
   		}
  	 });
  	 
}
 
 
 
 
 // 构建数据点击事件
 	$("#constructData").click(function(event){
 		
 		// 过滤没有选择的字段
 		var tablesSelect = {};
 		for(var key in didShowDragAreaTableInfo){
			var fileds = [];
			for (var i = 0;i < didShowDragAreaTableInfo[key].length;i++) {
				var originalFileds = didShowDragAreaTableInfo[key];
				if (originalFileds[i][originalFileds[i].length - 1] == "able") {
					fileds.push(originalFileds[i]);
				}
			}
			tablesSelect[key] = fileds;
 		}
 		
 		// 获取所有连接
		var cons = instance.getAllConnections();
		var postConsParama = [];
		for (var i = 0;i <  cons["green dot"].length; i++) {
			var con =  cons["green dot"][i];
			var line = con.getOverlay("connFlag");
			postConsParama.push(line.getParameters());
			
		}
   		
   		
     	// 需要传递的数据
 		var  postData = {
 			"tables":tablesSelect,
 			"relations":postConsParama
 		};
 		
 		console.log(postData);
 		
 	})
 
})



