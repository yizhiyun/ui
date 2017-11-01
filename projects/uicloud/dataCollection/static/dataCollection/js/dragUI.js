function dragUIHandle (sourceEle,targetEle,callBack,leftType){
	
	$(sourceEle).draggable({
		appendTo: "body",
		helper: "clone",
		scope: sourceEle+targetEle,
		zIndex:303,
		drag:function(event,ui){
			if(leftType == "leftNav"){
				$(ui.helper).addClass("helperClass");
			}
		}
//		stack:targetEle
	});
	
	
	$(targetEle).droppable({
		scope: sourceEle+targetEle,
		drop:function(event,ui){
			callBack.call(this,ui,event);
		}
	});
	
}
