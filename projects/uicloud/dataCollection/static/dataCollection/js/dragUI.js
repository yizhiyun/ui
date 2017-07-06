function dragUIHandle (sourceEle,targetEle,callBack){
	
	$(sourceEle).draggable({
		helper: "clone",
		scope: sourceEle+targetEle,
//		stack:targetEle
	});
	
	
	$(targetEle).droppable({
		scope: sourceEle+targetEle,
		drop:function(event,ui){
			callBack.call(this,ui,event);
		}
	});
	
}
