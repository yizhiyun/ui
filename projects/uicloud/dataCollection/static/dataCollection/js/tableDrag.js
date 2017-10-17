
jsPlumb.ready(function(){
instance = jsPlumb.getInstance({
		DragOptions: { cursor: "pointer", zIndex: 2000 },
		ConnectionsDetachable:true,
	 	ReattachConnections:true,
		ConnectionOverlays:[
			["Custom",{
				create:function(component){return $("<img src='/static/dataCollection/images/breakoff.png'/>")},
				loaction:0.5,
				cssClass:"connectionImg",
				id:"connFlag"
			}]
		],
		Container:"mainDragArea"
});
	// 监听连接
		instance.bind("connection",function(conInfo,originalEvent){
			
			connectDetailSelect(conInfo,originalEvent);
			
		})
			
});

// 连接框显示
function modalPromptShowToPage(conInfo){
 	$("#connectModalprompt").css({
		"left":(conInfo.source[0].offsetLeft + conInfo.target[0].offsetLeft) / 2 + "px",
		"top":(conInfo.source[0].offsetTop + conInfo.target[0].offsetTop) / 2 + "px",
	});
 	// 显示连接框
	$("#connectModalprompt").show("pulsate",100,function(){
		
		//确定按钮绑定事件
		$("#confirmRelationBtn").unbind("click");
		$("#confirmRelationBtn").on("click",function(event){
			
			event.stopPropagation();	
			var lineInfo = conInfo.connection.getOverlay("connFlag");
			var connectType = $("#connectModalprompt .btnSelects .active").children("p").attr("data");
			if(connectType == "delete"){
				instance.detach(conInfo);
				$("#connectModalprompt").hide();
				return;
			}
			
			// 更换图片
			lineInfo.canvas.src =$ ("#connectModalprompt .btnSelects .active").children("img").attr("src");
			
			
			var releationShipArr = [];
			$("#connectModalprompt .selectInfoDiv .selectContent .selectDiv").each(function(index,ele){
				var relation = $(ele).children("div").eq(0).find(".select_sourceList").val() + "===" + $(ele).children("div").eq(2).find(".select_targetList").val();
				releationShipArr.push(relation);
			})
			
			
			lineInfo.setParameters({
				 "type":connectType,
				 "relation":{
				 	"sourceInfo":conInfo.sourceId,
				 	"targetInfo":conInfo.targetId,
				 	"connections":releationShipArr
				 }
				
			})
			
			$("#connectModalprompt").hide();
			
		});
		// 取消按钮绑定事件
		$("#cancleRelationBtn").unbind("click");
		$("#cancleRelationBtn").on("click",function(event){
			$("#connectModalprompt").hide()
			event.stopPropagation();	
		});
		
	});
 }


//连接条件选择
function connectDetailSelect(conInfo,originalEvent){
	
	
	// 线条显示的图片
	var lineInfo = conInfo.connection.getOverlay("connFlag");
//	console.log(lineInfo);
	lineInfo.unbind("click");
	lineInfo.bind("click",function(){
		 modalPromptShowToPage(conInfo);
	});
	

	$("#connectModalprompt").css({
		"left":(conInfo.source[0].offsetLeft + conInfo.target[0].offsetLeft) / 2 + "px",
		"top":(conInfo.source[0].offsetTop + conInfo.target[0].offsetTop) / 2 + "px",
	});
	// 调用连接框显示的函数
	modalPromptShowToPage(conInfo);
	
	var sourceDataInfo = conInfo.sourceId.split("_YZYPD_");
	var  sourceDBName =  sourceDataInfo[1];
	var  sourceTBName = sourceDataInfo[2];
	
	
	
	var targetDataInfo = conInfo.targetId.split("_YZYPD_");
	var  targetDBName =  targetDataInfo[1];
	var targetTBName = targetDataInfo[2];
	
	
	$("#connectModalprompt .selectInfoDiv .selectHeader p").eq(0).html(sourceTBName);
	$("#connectModalprompt .selectInfoDiv .selectHeader p").eq(2).html(targetTBName);
	
	
	var sourceSelect = $("#connectModalprompt .selectInfoDiv .selectContent .selectDiv div .select_sourceList");
	if(sourceSelect.children("option").length > 0){
		sourceSelect.empty();
	}
	
	// 创建源点的选项卡
	for (var i = 0; i < didShowDragAreaTableInfo[conInfo.sourceId].length;i++) {
		// 具体的字段
		var dataInfo =  didShowDragAreaTableInfo[conInfo.sourceId][i];
		if (dataInfo["isable"] == "no") {
			continue
		}
		var op = $("<option value="+dataInfo["field"]+">"+dataInfo["field"]+"</option>")
		sourceSelect.append(op);
	}
	sourceSelect.comboSelect();
	
	var targetSelect = $("#connectModalprompt .selectInfoDiv .selectContent .selectDiv div .select_targetList");
	if(targetSelect.children("option").length > 0){
		targetSelect.empty();
	}
	for (var i = 0; i < didShowDragAreaTableInfo[conInfo.targetId].length;i++) {
		var dataInfo =  didShowDragAreaTableInfo[conInfo.targetId][i];
		if (dataInfo["isable"] == "no") {
			continue
		}
		var op = $("<option value="+dataInfo["field"]+">"+dataInfo["field"]+"</option>")
		targetSelect.append(op);
		
	}
	targetSelect.comboSelect();
	

// 内联、外联等按钮点击事件
$("#connectModalprompt .btnSelects div").click(function(){
	$(this).siblings("div").removeClass("active");
	$(this).addClass("active");	
})
	
}


// 表格之间连线弹框 点击-----“取消”----按钮之后
function connectionRelationCancle(event){
	event.stopPropagation();
	$("#connectModalprompt").hide();
}


function tableDrag(tableDrags){

		var exampleDropOptions = {  
		        hoverClass: "dropHover",//释放时指定鼠标停留在该元素上使用的css class  
		        activeClass: "dragActive"//可拖动到的元素使用的css class  
		 };
	
	  		var color1 = "#316b31";  
            var endppintStyle = {  
                endpoint: ["Dot", { radius: 5 }],//设置连接点的形状为圆形  
                paintStyle: { fillStyle: color1 },//设置连接点的颜色  
                isSource: true, //是否可以拖动（作为连线起点）  
                scope: "green dot",//连接点的标识符，只有标识符相同的连接点才能连接  
                connectorStyle: { strokeStyle: "#3b73b5", lineWidth: 1 },//连线颜色、粗细  
                connector: ["Bezier", { curviness: 100 } ],//设置连线为贝塞尔曲线  
                maxConnections: -1,//设置连接点最多可以连接几条线  
                isTarget: true, //是否可以放置（作为连线终点）  
                dropOptions: exampleDropOptions//设置放置相关的css  
            }; 
            
		if (tableDrags.length > 0) {
			instance.addEndpoint(tableDrags[tableDrags.length - 1], { anchors: "RightMiddle" }, endppintStyle);
			instance.addEndpoint(tableDrags[tableDrags.length - 1], { anchors: "LeftMiddle" }, endppintStyle);
		}
				
	
			
}

