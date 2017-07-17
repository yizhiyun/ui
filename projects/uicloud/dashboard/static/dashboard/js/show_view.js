
	//存放行里的维度元素的数据
var save_row_de_wrap =[],

//存放行里的度量元素的数据

	save_row_me_wrap = [],

//存放列里的维度元素的数据

	save_col_de_wrap = [],

//存放列里的度量元素的数据
	save_col_me_wrap = [],

// 表内行里数据的保存

	table_row_data_save = [],

//表内列里数据的保存

	table_col_data_save = [],


	row_if_me = [],

	row_if_de = [],
	col_if_me = [],

	col_if_de = [],
	//只有度量默认坐标轴
	ceshiArr = [{
    		show:false,
       	 	type:"category",
        	data:[""],
   		 	}];

	function col_row_me_math(me_arr,col_row_if_me){
	//me_arr 存放度量数据的二维数组
	//放置求和后的度量数据的数组
	var col_row_me_add = [];
	var bar_data_save =[];

	for(var i = 0; i <me_arr.length;i++){
		var me_temp = me_arr[i];
		col_row_me_add = [];
		//遍历度量数组进行求和运算
		col_row_me_add.push(me_temp.reduce(function(sum, value){return sum + value},0));

		//生成图形字典存储
		var bar_data_dict = {name:col_row_if_me[i],type:"bar",data:col_row_me_add}

		bar_data_save.push(bar_data_dict);

		
	}
	return bar_data_save;

}



	//条形图展示
function barChart(xType,yType,xShow,yShow,xTitle,yTitle,xText,bar_data_save){
	$("#main").css("display","block");

	//基于准备好的dom，初始化echarts
	var myChart = echarts.init(document.getElementById("main"));

	option = {
    title: {
        text: current_cube_name,
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: row_if_me,
        align: 'right',
        right: 10
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    yAxis: [{
    	show:xShow,
        type: xType,
        name:xTitle,
        nameLocation:"middle",
        nameGap:"15",
        data: xText
    }],
    xAxis: [{
    	show:yShow,
        type: yType,
        name: yTitle,
        nameLocation:"middle",
        nameGap:"35",
        axisLabel: {
            formatter: '{value}'
        }
    }],
    series:bar_data_save
};

	//使用刚指定的配置项和数据显示图标
	myChart.setOption(option);



}

//柱状图展示

function histogram(xType,yType,xShow,yShow,yTitle,xText,bar_data_save,ceshiArr){
	$("#main").css("display","block");
	
	//基于准备好的dom，初始化echarts
	var myChart = echarts.init(document.getElementById("main"));

	option = {
    title: {
        text: current_cube_name,
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: row_if_me,
        align: 'right',
        right: 10
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: ceshiArr,
    yAxis: [{
    	show:yShow,
        type: yType,
        name: yTitle,
        nameLocation:"middle",
        nameGap:"35",
        axisLabel: {
            formatter: '{value}'
        }
    }],
    series:bar_data_save
};

	//使用刚指定的配置项和数据显示图标
	myChart.setOption(option);



}


function histogram_show(all_col_data,all_row_data){
		var row_data = [],

		col_data = [],
		//判断拖入的是行还是列
		row_if_col = _drag_message["position"],

		//判断拖入的是维度还是度量

		row_col_type = _drag_message["type"];

		//二维数组保存数据
 		var save_row_temp_de = [],
 		save_row_temp_me = [],
 		save_col_temp_de = [],
 		save_col_temp_me = [];
	
		 if( row_if_col == "row"){
		 	row_if_de = [];
		 	row_if_me = [];
		 	var row_data_change_de = drag_row_column_data["row"]["dimensionality"];
		 	var row_data_change_me = drag_row_column_data["row"]["measure"];

		 	row_data_change_de.filter(function(ele){
		 		row_if_de.push(ele.split(":")[0])
		 	})

		 	row_data_change_me.filter(function(ele){
		 		row_if_me.push(ele.split(":")[0])
		 	})


		 }else if(row_if_col == "column"){
		 	col_if_de = [];
		 	col_if_me = [];
		 	var col_data_change_de = drag_row_column_data["column"]["dimensionality"];
		 	var col_data_change_me = drag_row_column_data["column"]["measure"];
		 	col_data_change_de.filter(function(ele){
		 		col_if_de.push(ele.split(":")[0])
		 	})
		 	
		 	col_data_change_me.filter(function(ele){
		 		col_if_me.push(ele.split(":")[0])
		 	})
		 }


	//循环遍历数据获取对应维度度量的数据

	
	for(var i = 0; i < _cube_all_data[current_cube_name]["data"].length;i++){
 		var cube_temp = _cube_all_data[current_cube_name]["data"][i];
 		
 		//判断拖入行列数据的过滤
 			if(row_if_col == "row" &&  row_col_type == "dimensionality"){
 				save_row_temp_de.push(cube_temp[row_if_de[all_row_data[1]-1]])
 				
 			}else if(row_if_col == "row" && row_col_type == "measure"){
 				save_row_temp_me.push(cube_temp[row_if_me[all_row_data[0]-1]]);

 			}
	// .......................................
			// 存储列里的数据
			if(row_if_col == "column" && row_col_type == "dimensionality"){
				save_col_temp_de.push(cube_temp[col_if_de[all_col_data[1]-1]]);

			}else if(row_if_col == "column" && row_col_type == "measure"){
				save_col_temp_me.push(cube_temp[col_if_me[all_col_data[0]-1]]);

			}
			
			
 	}
 			//判断数组不为空存储
 			if(save_row_temp_de.length != 0){
 				save_row_de_wrap.push(save_row_temp_de);
 			}else if(save_row_temp_me.length != 0){
 				save_row_me_wrap.push(save_row_temp_me);

 			}else if(save_col_temp_me.length != 0){
 				save_col_me_wrap.push(save_col_temp_me);
 			}else if(save_col_temp_de != 0){
 				save_col_de_wrap.push(save_col_temp_de);
 			}

	//只拖入行里度量的求和 显示柱状图
	row_data = col_row_me_math(save_row_me_wrap,row_if_me);


	//只拖入列里度量的求和 显示条形图
	col_data = col_row_me_math(save_col_me_wrap,col_if_me);

	

	
	//判断拖入方式展示不同图形
	//判断拖入行中展示图形
	if(row_if_col == "row"){
		//判断拖入度量展示柱状图
		if(row_col_type == "measure"){
			//只拖入度量显示数值的总和
			histogram("category","value",false,true,row_if_me.join("/"),[""],row_data,ceshiArr);
			//判断如果有维度存在，展示正常柱状图
			if(col_if_de.length > 0){
				histogram()
			}
		}

		
	}


	//拖入列里图形展示
	if(row_if_col == "column"){
		//判断拖入度量展示柱状图
			if(row_col_type == "measure"){
			
				barChart("category","value",false,true,"category",row_if_me.join("/"),[""],col_data);
			
			}

	}




}