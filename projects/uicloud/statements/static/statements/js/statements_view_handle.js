
var current_data = null;

//显示对应视图展示的图形
function view_handle_switch_statements(viewshow_class){
	console.log(viewshow_class)
	current_data = _cube_all_data[current_cube_name];

	var viewshow_class = viewshow_class;
	

	isagainDrawTable = true;
	
	eval(state_view_show_type);

}