//function tableDrag(tableDragrecords){	
//	//初始化  
//      jsPlumb.ready(function () {  
////			alert(11);
//          //首先，我们给jsPlumb设一些默认值，然后声明一个exampleDropOptions变量。  
//          jsPlumb.importDefaults({  
//              DragOptions: { cursor: 'pointer',zIndex:2000},  //拖动时鼠标停留在该元素上显示指针，通过css控制  
//              PaintStyle: { strokeStyle: '#666' },//元素的默认颜色  
//              EndpointStyle: { width: 20, height: 16, strokeStyle: '#567567' },//连接点的默认颜色  
//              Endpoint: [ "Dot", { radius: 5 } ],//连接点的默认形状  
//              Connector: [ "Bezier", { curviness: 150 } ],  
//              Anchors: [ "TopCenter", "BottomCenter" ],//连接点的默认位置  
//              ConnectionOverlays: [//连接覆盖图  
////                  ["Arrow", {  
////                      location: 1,  
////                      id: "arrow",  
////                      length: 14,  
////                      foldback: 1  
////                  }],  
//                  ["Label", {  
//                      location: 0.5,  
//                      id: "label",  
//                      cssClass: "aLabel"  
//                  }]  
//              ],
//              Container: "mainDragArea"
//          });  
//          var exampleDropOptions = {  
//              hoverClass: "dropHover",//释放时指定鼠标停留在该元素上使用的css class  
//              activeClass: "dragActive"//可拖动到的元素使用的css class  
//          };  
//
//          // 绑定到连接/ connectionDetached事件,和更新的列表在屏幕上的连接。  
//          jsPlumb.bind("connection", function (info, originalEvent) {  
//              updateConnections(info.connection);  
//          });  
//          jsPlumb.bind("connectionDetached", function (info, originalEvent) {  
//              updateConnections(info.connection, true);  
//          });  
//
//          function updateConnections(info) {  
////              alert("连接线ID:" + info.id + "\n连接线sourceID:" + info.sourceId + "\n连接线targetID:" + info.targetId);  
////            alert(info.endpoints[0].getUuid().substr(info.endpoints[0].getUuid().indexOf('-') + 1));  
//          }  
//
//
//          //添加jsPlumb连接点  
//          var color1 = "#316b31";  
//          var exampleEndpoint1 = {  
//              endpoint: ["Dot", { radius: 5 }],//设置连接点的形状为圆形  
//              paintStyle: { fillStyle: color1 },//设置连接点的颜色  
//              isSource: true, //是否可以拖动（作为连线起点）  
//              scope: "green dot",//连接点的标识符，只有标识符相同的连接点才能连接  
//              connectorStyle: { strokeStyle: color1, lineWidth: 1 },//连线颜色、粗细  
//              connector: ["Bezier", { curviness: 10 } ],//设置连线为贝塞尔曲线  
//              maxConnections: -1,//设置连接点最多可以连接几条线  
//              isTarget: true, //是否可以放置（作为连线终点）  
//              dropOptions: exampleDropOptions//设置放置相关的css  
//          };  
//
////          var color2 = "rgba(229,219,61,0.5)";  
////          var exampleEndpoint2 = {  
////              endpoint: "Rectangle",  //设置连接点的形状为矩形  
////              paintStyle: {//设置连接点的大小、颜色、透明度  
////                  width: 25,  
////                  height: 21,  
////                  fillStyle: "red",  
////                  opacity: 0.5  
////              },  
////              anchor: "TopCenter",   //设置连接点的位置，左下角  
////              isSource: true, //是否可以拖动（作为连线起点）  
////              scope: 'yellow dot',    //连接点的标识符，只有标识符相同的连接点才能连接  
////              connectorStyle: { strokeStyle: color2, lineWidth: 4},//连线颜色、粗细  
//////                connector: "Straight",    //设置连线为直线  
//////              connector: "Flowchart",//设置为流程图线  
////connector: ["Flowchart", {stub: 30, gap: 0, coenerRadius: 0, alwaysRespectStubs: true, midpoint: 0.5 }],
////              isTarget: true,//是否可以放置（作为连线终点）  
////              maxConnections: 3,//设置连接点最多可以连接几条线  [-1为无限制]  
////              dropOptions: exampleDropOptions,//设置放置相关的css  
////              beforeDetach: function (conn) { //绑定一个函数，在连线前弹出确认框  
////                  return confirm("断开连接?");  
////              },  
////              onMaxConnections: function (info) {//绑定一个函数，当到达最大连接个数时弹出提示框  
////                  alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);  
////              }  
////          };  
////
////          var exampleEndpoint3 = {  
////              endpoint: "Rectangle",  //设置连接点的形状为矩形  
////              paintStyle: {//设置连接点的大小、颜色、透明度  
////                  width: 25,  
////                  height: 21,  
////                  fillStyle: "blue",  
////                  opacity: 0.5  
////              },  
////              anchor: "BottomLeft",   //设置连接点的位置，左下角  
////              isSource: true, //是否可以拖动（作为连线起点）  
////              scope: 'blue dot',  //连接点的标识符，只有标识符相同的连接点才能连接  
////              connectorStyle: { strokeStyle: color2, lineWidth: 4},//连线颜色、粗细  
////              //connector: "Straight",    //设置连线为直线  
////              connector: "Flowchart",//设置为流程图线  
////              isTarget: true,//是否可以放置（作为连线终点）  
////              maxConnections: -1,//设置连接点最多可以连接几条线  [-1为无限制]  
////              dropOptions: exampleDropOptions,//设置放置相关的css  
////              beforeDetach: function (conn) { //绑定一个函数，在连线前弹出确认框  
////                  return confirm("断开连接?");  
////              },  
////              onMaxConnections: function (info) {//绑定一个函数，当到达最大连接个数时弹出提示框  
////                  alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);  
////              }  
////          };  
//
//
//          //将连接点绑定到html元素上  
////          var anchors = [  
////                      [1, 0.2, 1, 0],  
////                      [0.8, 1, 0, 1],  
////                      [0, 0.8, -1, 0],  
////                      [0.2, 0, 0, -1]  
////                  ],  
////                  maxConnectionsCallback = function (info) {  
////                      alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);  
////                  };  
////
////
////          var e1 = jsPlumb.addEndpoint("state2", { anchor: "LeftMiddle" }, exampleEndpoint1);//将exampleEndpoint1类型的点绑定到id为state2的元素上  
////          e1.bind("maxConnections", maxConnectionsCallback);//也可以在加到元素上之后绑定函数  
//
////          jsPlumb.addEndpoint("state1", exampleEndpoint1);//将exampleEndpoint1类型的点绑定到id为state1的元素上  
////          jsPlumb.addEndpoint("state3", exampleEndpoint2);//将exampleEndpoint2类型的点绑定到id为state3的元素上  
////          jsPlumb.addEndpoint("state1", {anchor: anchors}, exampleEndpoint2);//将exampleEndpoint2类型的点绑定到id为state1的元素上，指定活动连接点  
////
////          jsPlumb.addEndpoint("state3", {anchor: anchors}, exampleEndpoint3);//将exampleEndpoint2类型的点绑定到id为state1的元素上，指定活动连接点  
////          jsPlumb.addEndpoint("state4", {anchor: anchors}, exampleEndpoint3);//将exampleEndpoint2类型的点绑定到id为state1的元素上，指定活动连接点  
//
//          //设置连接线  
////          jsPlumb.connect({  
////              source: "state3",  
////              target: "state2"  
////          });  
//			
//			
////			//端点样式设置
////var hollowCircle = {
////	endpoint: ["Dot",{ cssClass: "endpointcssClass"}], //端点形状
////	connectorStyle: connectorPaintStyle,
////	paintStyle: {
////		fill: "#62A8D1",
////		radius: 6
////	},		//端点的颜色样式
////	isSource: true, //是否可拖动（作为连接线起点）
////	connector: ["Flowchart", {stub: 30, gap: 0, coenerRadius: 0, alwaysRespectStubs: true, midpoint: 0.5 }],
////	isTarget: true, //是否可以放置（连接终点）
////	maxConnections: -1
////};
//////基本连接线样式
////var connectorPaintStyle = {
////	stroke: "#62A8D1",
////	strokeWidth: 2
////};
//			
//			
//			for (var key in tableDragrecords) {
//				jsPlumb.addEndpoint(tableDragrecords[key], exampleEndpoint1);
//			}					
//			
//      });  
//	
//	
//}
//








jsPlumb.ready(function(){
instance = jsPlumb.getInstance({
		DragOptions: { cursor: "pointer", zIndex: 2000 },
		ConnectionsDetachable:true,
	 	ReattachConnections:true,
		ConnectionOverlays:[
			["Custom",{
				create:function(component){return $("<img src='/../../../static/dataCollection/images/breakoff.png'/>")},
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
 	// 显示连接框
	$("#connectModalprompt").show("pulsate",100,function(){
		
		//确定按钮绑定事件
		$("#confirmRelationBtn").unbind("click");
		$("#confirmRelationBtn").on("click",function(event){
			
			event.stopPropagation();	
			var lineInfo = conInfo.connection.getOverlay("connFlag");
			// 更换图片
			lineInfo.canvas.src =$ ("#connectModalprompt .btnSelects .active").children("img").attr("src");
			
			
			var releationShipArr = [];
			$("#connectModalprompt .selectInfoDiv .selectContent .selectDiv").each(function(index,ele){
				var relation = $(ele).children("div").eq(0).children("span").html() + "===" + $(ele).children("div").eq(2).children("span").html();
				releationShipArr.push(relation);
			})
			
			
			lineInfo.setParameters({
				 "type":$("#connectModalprompt .btnSelects .active").children("p").html(),
				 
				 "relation":{
				 	"sourceInfo":conInfo.sourceId,
				 	"targetInfo":conInfo.targetId,
				 	"connections":releationShipArr
				 }
				
			})
			
//			console.log(lineInfo.getParameters());
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
	})
	

	$("#connectModalprompt").css({
		"left":(conInfo.source.offset().left + conInfo.source.offset().left) / 2 + "px",
		"top":(conInfo.source.offset().top + conInfo.source.offset().top) / 2 + "px",
	})
	// 调用连接框显示的函数
	modalPromptShowToPage(conInfo)
	
	var sourceDataInfo = conInfo.sourceId.split("_YZYPD_");
	var  sourceDBName =  sourceDataInfo[1];
	var  sourceTBName = sourceDataInfo[2];
	
	
	
	var targetDataInfo = conInfo.targetId.split("_YZYPD_");
	var  targetDBName =  targetDataInfo[1];
	var targetTBName = targetDataInfo[2];
	
	
	$("#connectModalprompt .selectInfoDiv .selectHeader p").eq(0).html(sourceTBName);
	$("#connectModalprompt .selectInfoDiv .selectHeader p").eq(2).html(targetTBName);
	
	

	// 创建源点的选项卡
	for (var i = 0; i < didShowDragAreaTableInfo[conInfo.sourceId].length;i++) {
		// 具体的字段
		var dataInfo =  didShowDragAreaTableInfo[conInfo.sourceId][i];
		if (dataInfo["isable"] == "no") {
			continue
		}
		var op = $("<option value="+dataInfo["Field"]+">"+dataInfo["Field"]+"</option>")
		$("#connectModalprompt .selectInfoDiv .selectContent .selectDiv div .select_sourceList").append(op);
		
	}
	
	for (var i = 0; i < didShowDragAreaTableInfo[conInfo.targetId].length;i++) {
		var dataInfo =  didShowDragAreaTableInfo[conInfo.targetId][i];
		if (dataInfo["isable"] == "no") {
			continue
		}
		var op = $("<option value="+dataInfo["Field"]+">"+dataInfo["Field"]+"</option>")
		$("#connectModalprompt .selectInfoDiv .selectContent .selectDiv div .select_targetList").append(op);
		
	}
	
	//  自定义选项卡数据同步
//connectPromptSelectynchronous($("#connectModalprompt .selectInfoDiv .selectContent .selectDiv div .select_sourceList"));
//connectPromptSelectynchronous($("#connectModalprompt .selectInfoDiv .selectContent .selectDiv div .select_targetList"));

$("#connectModalprompt .selectInfoDiv .selectContent .selectDiv div select").change(function(){
	connectPromptSelectynchronous(this);

	
	
});

// 内联、外联等按钮点击事件
$("#connectModalprompt .btnSelects div").click(function(){
	$(this).siblings("div").removeClass("active");
	$(this).addClass("active");	
})
	
}
// 选项卡改变的函数

function connectPromptSelectynchronous (ele){
	
	$(ele).prev("span").html($(ele).val());
}


// 表格之间连线弹框 点击-----“确定”----按钮之后
function connectionRelationConfirm(event){
	event.stopPropagation();
	
	
	$("#connectModalprompt").hide();	
		
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













//
//function tableDrag(tableDragsRecords){
//	//初始化  
//      jsPlumb.ready(function () {  
////			alert(11);
//          //首先，我们给jsPlumb设一些默认值，然后声明一个exampleDropOptions变量。  
//          jsPlumb.importDefaults({  
//              DragOptions: { cursor: 'pointer',zIndex:2000},  //拖动时鼠标停留在该元素上显示指针，通过css控制  
//              PaintStyle: { strokeStyle: '#666' },//元素的默认颜色  
//              EndpointStyle: { width: 20, height: 16, strokeStyle: '#567567' },//连接点的默认颜色  
//              Endpoint: [ "Dot", { radius: 5 } ],//连接点的默认形状  
//              Connector: [ "Bezier", { curviness: 150 } ],  
//              Anchors: [ "TopCenter", "BottomCenter" ],//连接点的默认位置  
//              ConnectionOverlays: [//连接覆盖图  
////                  ["Arrow", {  
////                      location: 1,  
////                      id: "arrow",  
////                      length: 14,  
////                      foldback: 1  
////                  }],  
//                  ["Label", {  
//                      location: 0.5,  
//                      id: "label",  
//                      cssClass: "aLabel"  
//                  }]  
//              ]  
//          });  
//          var exampleDropOptions = {  
//              hoverClass: "dropHover",//释放时指定鼠标停留在该元素上使用的css class  
//              activeClass: "dragActive"//可拖动到的元素使用的css class  
//          };  
//
//          // 绑定到连接/ connectionDetached事件,和更新的列表在屏幕上的连接。  
//          jsPlumb.bind("connection", function (info, originalEvent) {  
//              updateConnections(info.connection);  
//          });  
//          jsPlumb.bind("connectionDetached", function (info, originalEvent) {  
//              updateConnections(info.connection, true);  
//          });  
//
//          function updateConnections(info) {  
//              alert("连接线ID:" + info.id + "\n连接线sourceID:" + info.sourceId + "\n连接线targetID:" + info.targetId);  
////            alert(info.endpoints[0].getUuid().substr(info.endpoints[0].getUuid().indexOf('-') + 1));  
//          }  
//
//
//          //添加jsPlumb连接点  
//          var color1 = "#316b31";  
//          var exampleEndpoint1 = {  
//              endpoint: ["Dot", { radius: 5 }],//设置连接点的形状为圆形  
//              paintStyle: { fillStyle: color1 },//设置连接点的颜色  
//              isSource: true, //是否可以拖动（作为连线起点）  
//              scope: "green dot",//连接点的标识符，只有标识符相同的连接点才能连接  
//              connectorStyle: { strokeStyle: color1, lineWidth: 1 },//连线颜色、粗细  
//              connector: ["Bezier", { curviness: 10 } ],//设置连线为贝塞尔曲线  
//              maxConnections: 1,//设置连接点最多可以连接几条线  
//              isTarget: true, //是否可以放置（作为连线终点）  
//              dropOptions: exampleDropOptions//设置放置相关的css  
//          };  
//
//          var color2 = "rgba(229,219,61,0.5)";  
//          var exampleEndpoint2 = {  
//              endpoint: "Rectangle",  //设置连接点的形状为矩形  
//              paintStyle: {//设置连接点的大小、颜色、透明度  
//                  width: 25,  
//                  height: 21,  
//                  fillStyle: "red",  
//                  opacity: 0.5  
//              },  
//              anchor: "TopCenter",   //设置连接点的位置，左下角  
//              isSource: true, //是否可以拖动（作为连线起点）  
//              scope: 'yellow dot',    //连接点的标识符，只有标识符相同的连接点才能连接  
//              connectorStyle: { strokeStyle: color2, lineWidth: 4},//连线颜色、粗细  
////                connector: "Straight",    //设置连线为直线  
//              connector: "Flowchart",//设置为流程图线  
//              isTarget: true,//是否可以放置（作为连线终点）  
//              maxConnections: 3,//设置连接点最多可以连接几条线  [-1为无限制]  
//              dropOptions: exampleDropOptions,//设置放置相关的css  
//              beforeDetach: function (conn) { //绑定一个函数，在连线前弹出确认框  
//                  return confirm("断开连接?");  
//              },  
//              onMaxConnections: function (info) {//绑定一个函数，当到达最大连接个数时弹出提示框  
//                  alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);  
//              }  
//          };  
//
//          var exampleEndpoint3 = {  
//              endpoint: "Rectangle",  //设置连接点的形状为矩形  
//              paintStyle: {//设置连接点的大小、颜色、透明度  
//                  width: 25,  
//                  height: 21,  
//                  fillStyle: "blue",  
//                  opacity: 0.5  
//              },  
//              anchor: "BottomLeft",   //设置连接点的位置，左下角  
//              isSource: true, //是否可以拖动（作为连线起点）  
//              scope: 'blue dot',  //连接点的标识符，只有标识符相同的连接点才能连接  
//              connectorStyle: { strokeStyle: color2, lineWidth: 4},//连线颜色、粗细  
//              //connector: "Straight",    //设置连线为直线  
//              connector: "Flowchart",//设置为流程图线  
//              isTarget: true,//是否可以放置（作为连线终点）  
//              maxConnections: -1,//设置连接点最多可以连接几条线  [-1为无限制]  
//              dropOptions: exampleDropOptions,//设置放置相关的css  
//              beforeDetach: function (conn) { //绑定一个函数，在连线前弹出确认框  
//                  return confirm("断开连接?");  
//              },  
//              onMaxConnections: function (info) {//绑定一个函数，当到达最大连接个数时弹出提示框  
//                  alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);  
//              }  
//          };  
//
//
//          //将连接点绑定到html元素上  
////          var anchors = [  
////                      [1, 0.2, 1, 0],  
////                      [0.8, 1, 0, 1],  
////                      [0, 0.8, -1, 0],  
////                      [0.2, 0, 0, -1]  
////                  ],  
////                  maxConnectionsCallback = function (info) {  
////                      alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);  
////                  };  
////
////
////          var e1 = jsPlumb.addEndpoint("state2", { anchor: "LeftMiddle" }, exampleEndpoint1);//将exampleEndpoint1类型的点绑定到id为state2的元素上  
////          e1.bind("maxConnections", maxConnectionsCallback);//也可以在加到元素上之后绑定函数  
//
////          jsPlumb.addEndpoint("state1", exampleEndpoint1);//将exampleEndpoint1类型的点绑定到id为state1的元素上  
////          jsPlumb.addEndpoint("state3", exampleEndpoint2);//将exampleEndpoint2类型的点绑定到id为state3的元素上  
////          jsPlumb.addEndpoint("state1", {anchor: anchors}, exampleEndpoint2);//将exampleEndpoint2类型的点绑定到id为state1的元素上，指定活动连接点  
////
////          jsPlumb.addEndpoint("state3", {anchor: anchors}, exampleEndpoint3);//将exampleEndpoint2类型的点绑定到id为state1的元素上，指定活动连接点  
////          jsPlumb.addEndpoint("state4", {anchor: anchors}, exampleEndpoint3);//将exampleEndpoint2类型的点绑定到id为state1的元素上，指定活动连接点  
//
//          //设置连接线  
////          jsPlumb.connect({  
////              source: "state3",  
////              target: "state2"  
////          });  
//
//	
////	jsPlumb.addEndpoint("a", exampleEndpoint2);
////	jsPlumb.addEndpoint("b", exampleEndpoint2);
//	for (var key in tableDragsRecords) {
////		console.log(tableDragsRecords[key]);
//		jsPlumb.addEndpoint(tableDragsRecords[key], { anchors: "RightMiddle" }, exampleEndpoint1);
////				jsPlumb.addEndpoint(tableDragsRecords[key], { anchors: "LeftMiddle" }, exampleEndpoint1);
//		}
//});  
//
//}
