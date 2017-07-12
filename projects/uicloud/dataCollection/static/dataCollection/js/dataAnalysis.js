//var tableDragsRecords = []; // 记录拖拽的表格 id
var didShowDragAreaTableInfo= {}; // 用来记录拖拽到拖拽区域的所有表格信息
var currentTableAllData = null;// 当前操作表格的所有数据
var preBuildDataName = null; // 之前构建数据集的名称
$(function(){
//	$( document ).tooltip({
//		position:{
////			my:"left top",
////			at:"right bottom"
//		}
//	}); // 提示框
	
// select选项卡问题
	$('.custom-select').comboSelect();	
	
	
	function ElementAutoSize(){
		$("#analysisContainer .leftSlide").css("height",(document.offsetHeight | document.body.offsetHeight) - 70 + "px");
$("#analysisContainer .mainDragArea").css({"margin-left":$("#analysisContainer .leftSlide").width() + "px","height":(document.offsetHeight | document.body.offsetHeight) - 70 + "px"});
	$("#foldSideBtn").css("top",($("#analysisContainer .leftSlide").height() - 38) / 2 + "px");
	}
	ElementAutoSize();
	// 窗口调整的时候
	$(window).resize(function(){
		ElementAutoSize();
	})
	
	// 左侧边栏拖拽缩小和放大
   	$("#analysisContainer .leftSlide").resizable({
   			maxWidth:300,
   			minWidth:200,
//			animate: true
			handles:"e" , // 只能作用在右边栏
			resize:function(event,ui){
				// 动态调整右边可拖拽区域的大小
				$("#analysisContainer .mainDragArea").css("margin-left",ui.size.width);
				$("#foldSideBtn").css({
					left:ui.size.width - 7 + "px",
				});
				$("#dataList").css("width",ui.size.width);
			}
   	})
	
	// 左侧边栏隐藏和显示
	$("#foldSideBtn").click(function(event){
		$("#analysisContainer .leftSlide").toggle("fold",{horizFirst:true},50,function(){
			
			if ($("#analysisContainer .leftSlide").is(":visible")) {
				$("#foldSideBtn").children("img").attr("src","/../../../static/dataCollection/images/nr_47.png")
				$("#foldSideBtn").css("left",  $("#analysisContainer .leftSlide").width() - 7 + "px");
				$("#analysisContainer .mainDragArea").css("margin-left",$("#analysisContainer .leftSlide").width() + "px");
			}else{
				$("#foldSideBtn").children("img").attr("src","/../../../static/dataCollection/images/pull_.png")
				$("#foldSideBtn").css("left", "-7px")
				$("#analysisContainer .mainDragArea").css("margin-left","0px");
			}
			//看具体情况。。。。。要不要处理
//			autoSizetableDataDetailListPanel();
		});
	})

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
	if (!theSelect[0]) {
		return;
	}
//	alert($(theSelect)[0].title);
	$.ajax({
		url: "/dataCollection/tablesOfaDB",
		type: "post",
		data: {
			"theDBName": $(theSelect).val(),
			"dbObjIndex": $(theSelect).attr("dbIndex")
		},
		success: function(data) {
			var rs = $.parseJSON(data);
			$(theSelect).next(".tablesOfaData").html("");
			for(var i = 0; i < rs.data.length; i++) {
				var p = $("<p>" + rs.data[i] + "</p>");
				$(theSelect).next(".tablesOfaData").append(p);
			}
			bindEventToPerTable($(theSelect).val(),$(theSelect).attr("dbIndex"));
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
			if (allKeys(didShowDragAreaTableInfo).indexOf(dbPaltIndexForBack + "_YZYPD_"+ dataBaseName + "_YZYPD_" + tableName) != -1) {
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
 				boxDiv[0].id = dbPaltIndexForBack + "_YZYPD_"+ dataBaseName + "_YZYPD_" + tableName;				
// 				tableDragsRecords.push(boxDiv[0].id);
 				
 				boxDiv.append($("<div class='tableTitle'>" + "<img src=" + "/../../../static/dataCollection/images/left_40.png"+"/>"+"<p title="+tableName+">"+tableName+"</p>"+ "</div>"));
 				
 				boxDiv.append("<div class='clear'></div>")
 				
 				var tableList = $("<ul class='fields'></ul>");
 				boxDiv.append(tableList);
 				for (var i = 0;i < data.length;i++) {
   					var aLi = $("<li>" + "<input type='checkbox' name='name' value='' checked='checked'>"+"<span>"+data[i]["Field"]+"</span>"+"</li>");
   					aLi[0].index = i; // 自定义属性，记录当前是第几个 li
   					// 默认所有字段选中，都是可用的
   					data[i]["isable"] = "yes";
   					tableList.append(aLi);
 				}
 			}
 			
   			$(targetEle).append(boxDiv);
   			// 可拖拽
   			$(".boxDiv").draggable({ containment: "#analysisContainer .mainDragArea", scroll: true,
   				drag:function(){
   					$(".ui-tooltip").hide(); //title 提示关闭
   					$("#analysisContainer .mainDragArea #dragTableDetailInfo").hide(); // 表信息隐藏
   					instance.repaintEverything();
   				},
   				stop:function(){
   					instance.repaintEverything();
   					$("#analysisContainer .mainDragArea #dragTableDetailInfo").css({
 					left:this.offsetLeft + "px",
 					top:this.offsetTop - 40 + "px" 
 			})
   					$("#analysisContainer .mainDragArea #dragTableDetailInfo").show();
   			}
   		}); 			
   	
   			
   			 
   			 // 记录已经拖拽的表格数据
   			 didShowDragAreaTableInfo[boxDiv[0].id] = data;
   			 
   			 
   			 tableDrag(allKeys(didShowDragAreaTableInfo));
   			  
   			 // 选择框绑定事件
   			 bindEventToBoxDivFiledsCheckBox();
   			
   			// 鼠标移入移出绑定事件
   			dragBoxBindMosueOver()
   			
 		}
 		
 		
 //---- 点击数据集收回列表		
 		$("#dataSet .detailDataSetList  li .dataSetItemTitle").click(function(event){
 			event.stopPropagation();
 			if (this.getAttribute("openFlag") == "on") {
 				
 				hideDataSetList(this);
 			}else{
 				showDataSetList(this);
 			}
 			
 		});
 
   	// 显示数据集列表
 	function showDataSetList(ele){
 		ele.setAttribute("openFlag","on");
 		$(ele).children("img").attr("src","/../../../static/dataCollection/images/left_40.png");
 		$(ele).next(".theDataSetContent").show("blind",300);
 		$(ele).css("color","#005eca");
 	}
 	//隐藏数据集列表
 	function hideDataSetList(ele){
 		ele.setAttribute("openFlag","off");
 		$(ele).children("img").attr("src","/../../../static/dataCollection/images/left_35.png");
 		$(ele).next(".theDataSetContent").hide("blind",300);
 		$(ele).css("color","#202020");
 	}
 
 
	function bindEventToBoxDivFiledsCheckBox(){
		 // 拖拽区域每个表格中的复选框进行选择时候触发的方法
	$("#mainDragArea .boxDiv .fields input[type='checkbox']").unbind("change");
   	$("#mainDragArea .boxDiv .fields input[type='checkbox']").change(function(event){
   		var index = $(this).parent()[0].index;
   		var filed = didShowDragAreaTableInfo[$(this).parents(".boxDiv").eq(0)[0].id][index];
   		if (this.checked && filed["isable"] == "no") {
   			filed["isable"] = "yes";
   		}else if (!this.checked && filed["isable"] == "yes") {
   			filed["isable"] = "no";
   			// 如果当前底部显示的正是操作的这个表格
	   		if ($("#tableDataDetailListPanel").attr("nowShowTable") == $(this).parents(".boxDiv").eq(0)[0].id && currentTableAllData) {		
	   			setshowHiddenEles_btn_notSelected();	   			  			
	   		}
   			
   		}
   		
   		// 如果当前底部显示的正是操作的这个表格
   		if ($("#tableDataDetailListPanel").attr("nowShowTable") == $(this).parents(".boxDiv").eq(0)[0].id && currentTableAllData) {
   			
   			createTableDetailView($("#tableDataDetailListPanel").attr("nowShowTable"),currentTableAllData);
   			  			
   		}
   		  		
  	 });
  	 
}
 
 
 // 构建数据传递的参数
 var postData = null;
 // 构建数据点击事件
 	$("#constructData").click(function(event){		
 		var tables = [];
 		for (var key in didShowDragAreaTableInfo) {
 			var aTable = {};
 			var dbArr = key.split("_YZYPD_");
   			aTable["source"] = dbArr[0];
   			aTable["database"] = dbArr[1];
   			aTable["tableName"] = dbArr[2];
   			aTable["columns"] = {};
   			for (var i = 0;i < didShowDragAreaTableInfo[key].length;i++) {
				var originalFileds = didShowDragAreaTableInfo[key];
				if (originalFileds[i]["isable"] == "yes") {
					var columnName = originalFileds[i]["Field"];
					aTable["columns"][columnName] = {
						"columnType":originalFileds[i]["Type"],
						"nullable": originalFileds[i]["Null"],
                    		"primaryKey": (originalFileds[i]["key"] == "PRI" ? "yes":"no"),
                    		"uniqueKey": "no"
					};
				}
			}
   			tables.push(aTable);		
 		} 		
 		var relationships = [];
 		// 获取所有连接
		var cons = instance.getAllConnections();
		var postConsParama = [];
		for (var i = 0;i <  cons["green dot"].length; i++) {
			var con =  cons["green dot"][i];
			var line = con.getOverlay("connFlag");
			var linePa = line.getParameters();
			var aRelation = {};
			var sourceInfo = linePa["relation"]["sourceInfo"].split("_YZYPD_");
			aRelation["fromTable"] = sourceInfo[1] + "." + sourceInfo[2];
			
			var targetInfo = linePa["relation"]["targetInfo"].split("_YZYPD_");
			aRelation["toTable"] = targetInfo[1] + "." + targetInfo[2];
			
			aRelation["joinType"] = "left join";
			aRelation["columnMap"] = [];
			for(var i  = 0;i < linePa["relation"]["connections"].length;i ++){
				var aMap = {};
				var mapInfo =  linePa["relation"]["connections"][i].split("===");
				aMap["fromCol"] = mapInfo[0];
				aMap["toCol"] = mapInfo[1];
				aRelation["columnMap"].push(aMap);
			}
			relationships.push(aRelation);
		}
   		
     	// 需要传递的数据
 		postData = {
 			"tables":tables,
 			"relationships":relationships,
 			"conditions":[],
 		};
 		
		$.ajax({
			url:"/cloudapi/v1/mergetables/check",
			type:"post",
			dataType:"json",
			contentType: "application/json; charset=utf-8",
			async: true,
			data:JSON.stringify(postData),
			success:function(data){
//				console.log(data);
//				var rs = data;
				if(data["status"] == "failed"){
					alert("请检查表格之间的联系")
					return;
				}
				if (preBuildDataName == null) {
					var ele = $("#buildDataPanelView .build-body .cube-name-radio .new-cube");
					ele.siblings(".radio").removeClass("active");
					ele.addClass("active");		
					$("#buildDataPanelView .build-body .cube-name-input-div").eq(0).show();
					$("#buildDataPanelView .build-body .cube-name-radio .cover-original-cube").eq(0).hide();
					ele.css("margin-left","20px");
				}else{	
					var ele = $("#buildDataPanelView .build-body .cube-name-radio .cover-original-cube");
					ele.show();
					ele.siblings(".radio").removeClass("active");
					ele.addClass("active");
					
					$("#buildDataPanelView .build-body .cube-name-radio .new-cube").eq(0).css("margin-left","40px");
					ele.html("覆盖 " + preBuildDataName);
					$("#buildDataPanelView .build-body .cube-name-input-div").eq(0).hide();
				}
				
				$(".maskLayer").show();
				$("#buildDataPanelView").css({
					left:($("body").width() - $("#buildDataPanelView").width()) / 2,
					top:($("body").height() - $("#buildDataPanelView").height()) / 2
				});
				$("#buildDataPanelView .build-body .cube-name-input-div input").eq(0).css("border","1px solid #dedede");
				$("#buildDataPanelView").show("shake",200);
				
			}
		})
 		
 		
 	});
 
// 数据集弹框功能按钮
$("#buildDataPanelView .build-body .cube-name-radio .radio").click(function(){
	if (!$(this).hasClass("active")) {
		$(this).siblings(".radio").removeClass("active");
		$(this).addClass("active");
		showOrHidencubeNamenputiv(this);
	}
})

// 是否显示 输入 cube 名称
function showOrHidencubeNamenputiv(ele){
	if ($(ele).hasClass("new-cube") && !$("#buildDataPanelView .build-body .cube-name-input-div").eq(0).is(":visible")) {
		$("#buildDataPanelView .build-body .cube-name-input-div").eq(0).show("blind",200);
	}else if ($(ele).hasClass("cover-original-cube")) {
		$("#buildDataPanelView .build-body .cube-name-input-div").eq(0).hide("blind",200);
	}
}

$("#buildDataPanelView .build-body .build-options .save-type .radio").click(function(){
	if (!$(this).hasClass("active")) {
		$(this).siblings(".radio").removeClass("active");
		$(this).addClass("active");
	}
});

// 更多设置按钮
$("#buildDataPanelView .build-footer .moreSetting").eq(0).click(function(){
	if (!$("#buildDataPanelView .build-body .build-options .more-content-div").eq(0).is(":visible")) {
		$("#buildDataPanelView .build-body .build-options .more-content-div").eq(0).show("blind",200);
	}
});

// 取消按钮+x 按钮
$("#buildDataPanelView .build-footer .cancleBtn").add("#buildDataPanelView .common-head .close").click(function(){
	$("#buildDataPanelView").hide("shake",100,function(){
		$(".maskLayer").hide();
	});
})
// 确定按钮
$("#buildDataPanelView .build-footer .confirmBtn").click(function(){
	if ($("#buildDataPanelView .build-body .cube-name-radio .new-cube").hasClass("active")) {
		if (!$("#buildDataPanelView .build-body .cube-name-input-div input").eq(0).val()) {
			$("#buildDataPanelView .build-body .cube-name-input-div input").eq(0).css("border","1px solid red");
			return;
		}
		postData["outputs"] = {"outputTableName":$("#buildDataPanelView .build-body .cube-name-input-div input").eq(0).val(),"removedColumns":[],"columnRenameMapping":{}};
	}else{
		postData["outputs"] = {"outputTableName":preBuildDataName,"removedColumns":[],"columnRenameMapping":{}};
	}
	// 记录
	preBuildDataName = postData["outputs"]["outputTableName"];
	if ($("#buildDataPanelView .build-body .build-options .more-content-div .check-label input").eq(0).is(':checked') && $("#buildDataPanelView .build-body .build-options .more-content-div .text-label input").eq(0).val() && $("#buildDataPanelView .build-body .build-options .more-content-div").eq(0).is(":visible")) {
		var condition = {"type":"limit","value":$("#buildDataPanelView .build-body .build-options .more-content-div .text-label input").eq(0).val()}
		postData["conditions"].push(condition);		
	}
	console.log(postData);
	$.ajax({
			url:"/cloudapi/v1/mergetables/generate",
			type:"post",
			dataType:"json",
			contentType: "application/json; charset=utf-8",
			async: true,
			data:JSON.stringify(postData),
			success:function(data){
				// 构建。。。。完成
				console.log(data);
			}
	});	
	
});

 	// 创建新数据集按钮的点击
 	$("#newSet").click(function(event){
 		event.stopPropagation();
 		$(".maskLayer").show();
 		$("#newSetPrompt").css({
   			left:((document.offsetWidth | document.body.offsetWidth) -$("#analysisContainer .leftSlide").width() - $("#newSetPrompt").width()) / 2,
 			top:((document.offsetHeight | document.body.offsetHeight) -2*$("#baseTopInfo").height() - $("#newSetPrompt").height()) / 2
 		});
 		$("#newSetPrompt").show();
 		
 	})
 	
 	// 创建数据集弹框内部的事件处理
 	
 	// 关闭按钮
 	$("#newSetPrompt #closeNewSetPrompt").click(function(event){
 		event.stopPropagation();
 		$(".maskLayer").hide();
 		$("#newSetPrompt").hide();
 	})
 	// 确定按钮
 	$("#newSetPrompt #newSetConfirmBtn").click(function(event){
 		event.stopPropagation();
 		$(".maskLayer").hide();
 		$("#newSetPrompt").hide();
 		// 处理html
		var theNewSet = $(".detailDataSetList #baseSetTemplate").clone(true);
		theNewSet.removeAttr("id");
		theNewSet.children(".dataSetItemTitle").children("span").eq(0).html($("#setNameInput").val());
		$(".detailDataSetList").append(theNewSet);
		$("#dataSet .detailDataSetList  li .dataSetItemTitle").each(function(index,ele){
			hideDataSetList(ele);
		});
		showDataSetList(theNewSet.children(".dataSetItemTitle").eq(0).get(0));
			
 	})
 	
 	// 增加数据源按钮
 	$("#analysisContainer .leftSlide #addDataSourceBtn").click(function(event){
 		event.stopPropagation();
 		$("#connectDirector #addSourceSelects").show();
 	})
 	
 	// 数据源选择按钮点击事件
 	$("#analysisContainer .leftSlide #addSourceSelects p").click(function(event){
 		event.stopPropagation();
 		if ($(this).html() == "新增数据平台") {
 			$("#analysisContainer .leftSlide #addSourceSelects").hide();
 			$("#dataList").show("explode",500,BindProgressToDetailBase);
			$(".maskLayer").show();
			$("#closeDataList").click(function(){
				$("#dataList").hide();
				$(".maskLayer").hide();
			});
 			
 		}else if ($(this).html() == "新增本地文件") {
 			
 		}
 	});
 	
 	 // 给具体的数据库平台按钮绑定事件函数
    function BindProgressToDetailBase(){
    		$("#dataList .baseDetail li").click(function(){
    			dataBaseName = $(this).html();
    			$("#dataList").hide();
    			$("#connectDataBaseInfo").show('shake',500,baseInfoShowCallBack);
    		})
    }
 	
 	//  连接数据库的弹框显示之后，处理里面的点击事件
    function baseInfoShowCallBack(){
    		$("#connectDataBaseInfo #dataBaseName").html(dataBaseName)
  			$("#connectDataBaseInfo #formPostDataBaseName").val(dataBaseName)
    		$("#loginBtn").click(function(event){
    			// 待处理
    			$("#dataBaseConnectForm").submit();
		
//		var rs = serializeForm("dataBaseConnectForm");
//		console.log(rs);
//			上面是链接数据库的字段信息
    			$("#connectDataBaseInfo").hide();
    			$(".maskLayer").hide();
    		})
    }
 	
 	// 给拖拽区域的表格绑定鼠标移入事件
 	function dragBoxBindMosueOver(){
 		$("#analysisContainer .mainDragArea .boxDiv").unbind("mouseenter");
 		$("#analysisContainer .mainDragArea .boxDiv").mouseenter(function(event){
 			$("#analysisContainer .mainDragArea #dragTableDetailInfo").css({
 				left:this.offsetLeft + "px",
 				top:this.offsetTop - 40 + "px" 
 			})
 			// 记录一下当前的详情是哪个表格的
 			if ($("#analysisContainer .mainDragArea #dragTableDetailInfo").attr("record") != this.id) {
 				
 				$("#analysisContainer .mainDragArea #dragTableDetailInfo").attr("record",this.id);
 			}
 			// 详情显示
 			$("#analysisContainer .mainDragArea #dragTableDetailInfo").show();
 		});	
 	}
 	
 	// 表格详情按钮的点击
 	$("#analysisContainer .mainDragArea #dragTableDetailInfo .imgBox").click(function(){
 		$(this).siblings(".imgBox").removeClass("active");
 		$(this).addClass("active");
 		var dbInfo = $(this).parent("#dragTableDetailInfo").attr("record");
 		if ($(this).attr("flag") == "detail") {	
 			// 再次点击之前点击过的表格
 			if ($("#tableDataDetailListPanel").attr("nowShowTable") == dbInfo) {
 				// 如果当前正在显示,不作出处理
 				if ($("#tableDataDetailListPanel").is(":visible")) {
 					return; 
 				}else{
 					$("#tableDataDetailListPanel").show("blind",{"direction":"down"},200);
 					return;
 				}
 			}
 			
 			var tablesSelect = {};
// 			// 记录当前是展示的哪个表格的数据
   			$("#tableDataDetailListPanel").attr("nowShowTable",dbInfo);
			tablesSelect["dbInfo"] = dbInfo;
 			$.ajax({
 				url:"/dataCollection/detailTableData",
 				type:"post",
 				data:tablesSelect,
   				traditional:true,
   				async: true,
 				dataType:'json',
 				success:function(data){
   					currentTableAllData = data.data;
					createTableDetailView(dbInfo,currentTableAllData);
					
 				}
 			});	
 			
 		}else if($(this).attr("flag") == "deleteTable"){
 			
 			// 移除线
   			instance.detachAllConnections($(".mainDragArea #"+dbInfo));	
   			// 移除点
   			var endPonints = instance.getEndpoints($(".mainDragArea #"+dbInfo));
   			for (var i = 0; i < endPonints.length;i++) {
   				instance.deleteEndpoint(endPonints[i]);
   			}
   			
 			// 移除元素这个
 			$(".mainDragArea #"+dbInfo).remove();
 			// 移除详情按钮等
 			$("#analysisContainer .mainDragArea #dragTableDetailInfo").hide(); // 表信息隐藏
 			// 数据的移除
 			delete didShowDragAreaTableInfo[dbInfo];
 			
 		}else if($(this).attr("flag") == "deleteCon"){
 			// 移除线
   			instance.detachAllConnections($(".mainDragArea #"+dbInfo));
   			
 		}
 	});
 	
 	
 	
 	// 创建下方展示的表格详情视图
 	function createTableDetailView(dbInfo,rs,isAllFields){
 		// 需要---dbInfo
 		
 		
 		var fileds = [];
 		var originalFileds =didShowDragAreaTableInfo[dbInfo];
 			if(isAllFields == true){
 				fileds = originalFileds;
 			}else{
 				// 过滤未选择的字段
				for (var i = 0;i < originalFileds.length;i++) {
					if (originalFileds[i]["isable"] == "yes") {
						fileds.push(originalFileds[i]);
					}
				}
 			}
		
		// 清空
   					$("#tableDataDetailListPanel .mainContent table thead tr").html("");
   					$("#tableDataDetailListPanel .mainContent table tbody").html("");
   					
					for (var i= 0;i < fileds.length;i++) {
						var img = $("<img/>");
						var th = $("<th title='双击选中列'><span>" +fileds[i]["Field"]+"</span></th>");
						if (fileds[i]["Type"].isTypeString()) {
							img.attr("src","/../../../static/dataCollection/images/tableDataDetail/String.png");
						}else if (fileds[i]["Type"].isTypeDate()) {
							img.attr("src","/../../../static/dataCollection/images/tableDataDetail/date.png");
						}else if(fileds[i]["Type"].isTypeNumber()){
							img.attr("src","/../../../static/dataCollection/images/tableDataDetail/Integer.png");
						}else if(fileds[i]["Type"].isTypeSpace()){
							img.attr("src","/../../../static/dataCollection/images/tableDataDetail/geography.png");
						}
						img.insertBefore(th.children("span").eq(0));
						$("#tableDataDetailListPanel .mainContent table thead tr").append(th);
					}
					for (var i = 0; i < rs.length;i++) {
						var tr = $("<tr></tr>");
						var lineData = rs[i];
						for (var j = 0;j < fileds.length;j++) {
							var theFiled = fileds[j]["Field"];
							var td = $("<td>" + lineData[theFiled] + "</td>");
							td.addClass(fileds[j]["Field"]);
							tr.append(td);
						}
						$("#tableDataDetailListPanel .mainContent table tbody").append(tr);
					}
		
		// 自动调整弹出窗口的大小
					autoSizetableDataDetailListPanel(fileds.length);
					if (!$("#tableDataDetailListPanel").is(":visible")){
						$("#tableDataDetailListPanel").show("blind",{"direction":"down"},200);
					}
					//绑定按钮功能操作事件
					bindHandlefunctionTotableDataDetailListPanel();
		
 	}
 	
 	
 	// 数据详情关闭按钮的点击
 	$("#tableDataDetailListPanel #closeableDataDetailListPanel").click(function(){
 		$("#tableDataDetailListPanel").hide("blind",{"direction":"down"},200);
 	})
 	
 	// 调整下面展示的表格数据弹框视图的大小
 	function autoSizetableDataDetailListPanel(filedNumber){
 		if($("#analysisContainer .leftSlide").eq(0).is(":visible")){
 			var  w = $(document).width() - $(".container .main .leftNav").eq(0).width() - $("#analysisContainer .leftSlide").eq(0).width();
 		}else{
 			var  w = $(document).width() - $(".container .main .leftNav").eq(0).width();
 		}
 		
 		$("#tableDataDetailListPanel").css({
			width:w
		});
		$("#tableDataDetailListPanel .mainContent table thead tr th").css({
			width:w / filedNumber
		});
		$("#tableDataDetailListPanel .mainContent table tbody tr td").css({
			width:w / filedNumber
		});
 	}
 	
 
 // 用来记录当前正在表详细中操作的列或者行元素
 var  currentHandleColOrRowEles = null;
 
 //  底层弹出的表格详细信息视图中的选中功能
function bindHandlefunctionTotableDataDetailListPanel(){
	// 隐藏列功能
 $("#tableDataDetailListPanel .mainContent table thead tr th").click(function(event){
 	event.stopPropagation();
 		
 		var isSelected = $(this).attr("isSelect");
 		
 		if (isSelected == "true") {
 			currentHandleColOrRowEles.css("background","");
 			$(this).attr("isSelect","false");
 			currentHandleColOrRowEles = null;
 		}else{
 			// 清除上一个选中的的列
 			if (currentHandleColOrRowEles) {
 				currentHandleColOrRowEles.css("background","");
   				currentHandleColOrRowEles.eq(0).attr("isSelect","false");
 				currentHandleColOrRowEles = null;
 			}
 			
 			currentHandleColOrRowEles = $(this).add("#tableDataDetailListPanel .mainContent table tbody tr ." + $(this).children("span").eq(0).html());
 			currentHandleColOrRowEles.css("background","#ffeac6");
 			$(this).attr("isSelect","true");
 		}
 	 	
 });
 
 
 
}
// 隐藏按钮的功能
$("#tableDataDetailListPanel #hiddenEle").mousedown(function(event){
	event.stopPropagation();
	$(this).children("img").eq(0).attr("src","/../../../static/dataCollection/images/tableDataDetail/handle_35.png");
	
});
$("#tableDataDetailListPanel #hiddenEle").mouseup(function(event){
	$(this).children("img").eq(0).attr("src","/../../../static/dataCollection/images/tableDataDetail/handle_33.png");
	event.stopPropagation();
	
	if (currentHandleColOrRowEles) {
	// 当前正在操作的表格---
	var dbInfo =	$("#tableDataDetailListPanel").attr("nowShowTable");
	// 当前正在操作的字段
	var field = currentHandleColOrRowEles.eq(0).children("span").html();
	$(".mainDragArea #" +dbInfo + " .fields li span:contains(" + field+")").prev("input").trigger("click");	
	
	// 显示“隐藏内容的按钮” 可以进行点击了
	setshowHiddenEles_btn_notSelected();
			// 隐藏
	currentHandleColOrRowEles.hide("blind",{"direction":"left"},300);
	
	
	}
	
});

// 显示隐藏按钮的功能
$("#tableDataDetailListPanel .topInfo  #showHiddenEles").click(function(event){
	event.stopPropagation();
	var dbInfo	= $("#tableDataDetailListPanel").attr("nowShowTable");
	// 如果当前已经是选中状态
	if($("#tableDataDetailListPanel .topInfo #showHiddenEles").attr("isSelected") == "did"){
//		createTableDetailView(dbInfo,currentTableAllData);
		return;
	};
	
	if ($("#tableDataDetailListPanel").is(":visible")) {
		
		var  fileds = didShowDragAreaTableInfo[dbInfo];
		for (var i = 0;i < fileds.length;i++){
   			if (fileds[i]["isable"] == "no"){
   				fileds[i]["isable"] = "yes";
   				$(".mainDragArea #" +dbInfo + " .fields li span:contains(" + fileds[i]["Field"]+")").prev("input").get(0).checked = true;
   			}
   		}
		
		setshowHiddenEles_btn_didSelected(); // 变成选中状态
		createTableDetailView(dbInfo,currentTableAllData,true);
		
	}
	
});


// 显示按钮设置为未选中状态
function setshowHiddenEles_btn_notSelected(){
	$("#tableDataDetailListPanel .topInfo #showHiddenEles").attr("isSelected","not");
	$("#tableDataDetailListPanel .topInfo #showHiddenEles").children("img").eq(0).attr("src","/../../../static/dataCollection/images/tableDataDetail/handle_33.png");
}
// 显示按钮设置为选中状态
function setshowHiddenEles_btn_didSelected(){
	$("#tableDataDetailListPanel .topInfo #showHiddenEles").attr("isSelected","did");
	$("#tableDataDetailListPanel .topInfo #showHiddenEles").children("img").eq(0).attr("src","/../../../static/dataCollection/images/tableDataDetail/handle_35.png");
}


})



