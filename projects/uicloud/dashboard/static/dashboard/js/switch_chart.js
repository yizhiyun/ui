// 当前操作表的 数据
var current_data = null;
function switch_chart_handle_fun(){
	current_data = _cube_all_data[current_cube_name];
	// showTable_by_dragData(); // 表格
//	histogram_show(); // 条形图
//	one_de_one_me_handle(); // 一个维度一个度量

	many_de_many_me_handle(); // 多维度多度量
}
