
var current_data = null;

var save_data_handle = null;
//显示对应视图展示的图形
function view_handle_switch_statements(viewshow_class){
	
	var viewshow_class = viewshow_class;

	if(state_view_show_type != "showTable_by_dragData()"){
		save_data_handle = data_handle("sortable");
	}
	


	current_data = _cube_all_data[current_cube_name];
	
	isagainDrawTable = true;
	
	eval(state_view_show_type);

}