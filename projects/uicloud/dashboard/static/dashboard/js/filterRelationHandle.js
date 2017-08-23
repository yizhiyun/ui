// 处理仪表板界面 跟筛选器相关的内容
// 用来记录当前正在表详细中操作的列或者行元素
var currentHandleColOrRowEles = null;

var filterNeedAllData = null; // 筛选器需要全部的表格数据

$(function(){
	
	$('.custom-select').comboSelect();
	
	// 筛选器部分，顶部筛选按钮点击的时候
	$("#dashboard_content #sizer_place #sizer_content .filter_header_div div.filter_content_btn").click(function(){
		event.stopPropagation();
		editFilterViewShow_fun("dashBoard",filterSuccessFun);
	});
	// 筛选器筛选数据成功，回调函数
	function filterSuccessFun(){
		var tableInfo = current_cube_name;
		var conditions = [];
		if(conditionFilter_record[tableInfo]) {
			conditions = conditionFilter_record[tableInfo]["common"].concat(conditionFilter_record[tableInfo]["condition"]);
		}
//		console.log(conditions);
		var postFilterCondition = {
			"conditions": conditions
		}
		console.log(getFilterCondition);
		$.ajax({
			url:"/cloudapi/v1/tables/"+tableInfo+"/all",
			type:"post",
			dataType:"json",
			contentType: "application/json; charset=utf-8",
			async: true,
			data:JSON.stringify(postFilterCondition),
			success:function(data){
				console.log(data);
				_cube_all_data[tableInfo] = data["results"];
				switch_chart_handle_fun(null,true);
			}
		})
		
	}
	
});

// drawType:add,delete
function rightFilterListDraw(drawType){
	
}
