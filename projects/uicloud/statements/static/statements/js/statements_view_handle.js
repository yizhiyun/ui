
var current_data = null;

// var drag_measureCalculateStyle = {};
//显示对应视图展示的图形
function view_handle_switch_statements(viewshow_class,show_if_or){

	if(echarts.getInstanceByDom($("."+viewshow_class+"").get(0))){
		echarts.getInstanceByDom($("."+viewshow_class+"").get(0)).clear();
	}

	var viewshow_class = viewshow_class;

	if(state_view_show_type == "showTable_by_dragData()"){
		isagainDrawTable = true;
	}

	eval(state_view_show_type);

	if(!show_if_or){
		$("."+viewshow_class+"").parent().css("display","none");
	}

}