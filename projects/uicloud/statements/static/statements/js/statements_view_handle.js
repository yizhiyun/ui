
var current_data = null;

var drag_measureCalculateStyle = {};

var isagainDrawTable = null;
//显示对应视图展示的图形
function view_handle_switch_statements(viewshow_class,show_if_or,state_view_show_type,lodingNum,save_allTable,saveIndexPage){


	if(echarts.getInstanceByDom($("."+viewshow_class+"").get(0))){
		echarts.getInstanceByDom($("."+viewshow_class+"").get(0)).clear();
	}

	var viewshow_class = viewshow_class;

	isagainDrawTable = true;
	if(state_view_show_type == "showTable_by_dragData()"){
		reporting_showTable_by_dragData(save_allTable);
	}else if(state_view_show_type == "col_card()"){
		reporting_col_card(saveIndexPage);
	}else{
		eval("reporting_"+state_view_show_type.replace(/\)/,","+viewshow_class.match(/\d+/g)[1])+")");
	}


	// eval(state_view_show_type.replace(/\)/,","+viewshow_class.match(/\d+/g)[1])+")");

	if(!show_if_or){
		$("."+viewshow_class+"").parent().css("display","none");
	}

}