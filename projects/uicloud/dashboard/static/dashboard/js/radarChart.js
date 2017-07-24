function serise(de_num,data_max){
	
        	var ceshiArr =[];
        	for(var i =0; i < de_num.length;i++){
        		var ceshi_dict = {name:de_num[i],max:data_max}
        		ceshiArr.push(ceshi_dict)
        	}
        	return ceshiArr
        
}



function data_wrap(save_me_wrap,save_me_name){
        	var ceshiH = [];
        	for(var i =0 ; i< save_me_wrap.length;i++){
        		var temp = {value:save_me_wrap[i],name:save_me_name[i]}
        		ceshiH.push(temp)
        	}

        	return ceshiH;
        }
//绘制雷达图
function drag_Chart(titleText,ledendData,de_num,data_max,save_me_wrap,save_me_name){

	$("#main").css("display","block");


	var myChart = echarts.init($("#main").get(0));


	option = {
    title: {
        text: titleText,
    },
    tooltip: {},
    legend: {
        data: ledendData,
    },
    radar: {
        shape: 'circle',
        //   axisLine:{
        //   show:true,
        // },
        // axisTick:{
        //   show:true,
        // },
        // axisLabel:{
        //   show:true,
        // },
        indicator:serise(de_num,data_max)
    },
    series: [{
        type: 'radar',
        // areaStyle: {normal: {}},
        data : data_wrap(save_me_wrap,save_me_name)

    }]
};


	myChart.setOption(option)
}































function drag_radarChart(){

	//获得处理后的数据
	var row_if_col = _drag_message["position"],
		//判断拖入的是维度还是度量
	row_col_type = _drag_message["type"];
		//拿到处理后的数据
	var data_save_dict = data_handle();
	//保存拖入行里维度度量的字段名和对应数据
	 row_if_de = data_save_dict["row_de"];
	 row_if_me = data_save_dict["row_me"];
	 save_row_me_wrap = data_save_dict["row_me_wrap"];
	 save_row_de_wrap = data_save_dict["row_de_wrap"];
	 //保存拖入列里维度度量的字段名和对应数据
     col_if_de = data_save_dict["col_de"];
	 col_if_me = data_save_dict["col_me"];
	 save_col_me_wrap = data_save_dict["col_me_wrap"];
	 save_col_de_wrap = data_save_dict["col_de_wrap"];

//计算数组最大值最小值
Array.prototype.data_max = function(){
return Math.max.apply({},this)
}
Array.prototype.data_min = function(){
return Math.min.apply({},this)
}


	
	 //将拖入的度量合并成一个数组,求最大值,最小值
	var all_me_data=save_row_me_wrap.reduce(function(a,b){
		return a.concat(b)
	},[]);


	var all_me_data_col = save_col_me_wrap.reduce(function(a,b){
		return a.concat(b)
	},[])

		//最小值
			var data_me_min = all_me_data.data_min();
			//最大值
			var data_me_max = all_me_data.data_max();
	//度量的组数

	var data_me_num;


function radar_row(){
		
			if(row_if_de.length > 0){
				//存放第一个重复维度的数组
				var radar_content=[];
			//判断拖入的第一个维度是否存在重复元素
			if(save_row_de_wrap[0].ifUnique() == false){
				//重复维度对应度量的值
				var radar_me_content= [];
				//存在重复元素
				if(row_if_de.length == 1){
					for(var i = 0 ; i <save_row_me_wrap.length;i++){
						var temp_row_wrap = save_row_me_wrap[i];
						radar_me_content.push(save_row_de_wrap[0].unique3(temp_row_wrap))
					}

					//雷达图维度的最大范围
					var all_me_data = radar_me_content.reduce(function(a,b){return a.concat(b)},[])
					var radar_de_max =  Math.ceil((all_me_data.data_max()-all_me_data.data_min())/radar_me_content.length)*radar_me_content.length+all_me_data.data_min();
					drag_Chart(current_cube_name,col_if_me,save_row_de_wrap[0].unique4().notempty(),radar_de_max,radar_me_content,col_if_me);
				//度量的组数
				}else{
					//重复维度下多个维度

				}
			}else{
				//最小值
			data_me_min = all_me_data_col.data_min();

			//最大值

			data_me_max = all_me_data_col.data_max();
				// console.log(save_col_de_wrap.changeData(save_row_me_wrap[0]))
				data_me_num = save_row_de_wrap[0].length;
				//雷达图最大值范围
				var no_change =  Math.ceil((data_me_max-data_me_min)/data_me_num)*data_me_num+data_me_min;

				console.log(no_change)
				// 没有重复元素正常显示图形
				drag_Chart(current_cube_name,col_if_me,save_row_de_wrap[0],no_change,save_col_me_wrap,col_if_me);
			}
			
			
			

			}else{
				//跳转到其他图形
			}

}


//拖入列
function radar_col(){	
			if(col_if_de.length > 0){
				//存放第一个重复维度的数组
				var radar_content=[];
			//判断拖入的第一个维度是否存在重复元素
			if(save_col_de_wrap[0].ifUnique() == false){
				//重复维度对应度量的值
				var radar_me_content= [];
				//存在重复元素
				if(col_if_de.length == 1){
					for(var i = 0 ; i <save_row_me_wrap.length;i++){
						var temp_row_wrap = save_row_me_wrap[i];
						radar_me_content.push(save_col_de_wrap[0].unique3(temp_row_wrap))
					}
					//雷达图维度的最大范围
					var all_me_data = radar_me_content.reduce(function(a,b){return a.concat(b)},[])
					var radar_de_max =  Math.ceil((all_me_data.data_max()-all_me_data.data_min())/radar_me_content.length)*radar_me_content.length+all_me_data.data_min();
					drag_Chart(current_cube_name,row_if_me,save_col_de_wrap[0].unique4().notempty(),radar_de_max,radar_me_content,row_if_me);
				//度量的组数
				}else{
					//重复维度下多个维度

				}
			}else{
				// console.log(save_col_de_wrap.changeData(save_row_me_wrap[0]))
				data_me_num = save_col_de_wrap[0].length;
				//雷达图最大值范围
				var no_change =  Math.ceil((data_me_max-data_me_min)/data_me_num)*data_me_num+data_me_min;
				// 没有重复元素正常显示图形
				drag_Chart(current_cube_name,row_if_me,save_col_de_wrap[0],no_change,save_row_me_wrap,row_if_me);
			}
			
			
			

			}else{
				//跳转到其他图形
			}
}




	


	if(row_if_col == "row"){

		if(row_col_type == "measure"){
			
			radar_col();
		
		}else{
			radar_row();
		}
	}


	if(row_if_col == "column"){
		if(row_col_type == "measure"){
			radar_row();
		}else{
			radar_col();
		}
	}






























}



// //二维数组字符串合并
// Array.prototype.numArray = function(){
// 	var len = this[0].length;
// 	var save_arr =[]
// 	for(var i = 0; i < len; i++){
// 		var str = "";
// 		for(var j=0; j < this.length; j++){
// 			str +=  " " + this[j][i];
// 		}
// 		save_arr.push(str);
// 	}
// 	return save_arr
// }


