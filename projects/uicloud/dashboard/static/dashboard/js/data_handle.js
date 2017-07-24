//数组去重取得对应元素的和
Array.prototype.unique3 = function(b_arr){
 var json = {};
 var save_add = {};
 var ceshis = [];
 for(var i = 0; i < this.length; i++){
  if(!json[this[i]]){
   save_add[this[i]] = parseInt(b_arr[i]);
   json[this[i]] = 1;
  }else{
  	var a = parseInt(save_add[this[i]]);
  	var b = parseInt(b_arr[i]);
  	save_add[this[i]] = a+b;

  }
 }
 for(key in save_add){
  		ceshis.push(save_add[key])
  	}
 return ceshis;
}


//判断数组中是否有重复元素
Array.prototype.ifUnique = function(){
	var json  = {};

	for(var i =0; i < this.length;i++){
		if(!json[this[i]]){
			json[this[i]] = 1;
		}else{
			return false;
		}
	}
}

//数组去重
Array.prototype.unique4 = function(){
 var res = [];
 var json = {};
 for(var i = 0; i < this.length; i++){
  if(!json[this[i]]){
   res.push(this[i]);
   json[this[i]] = 1;
  }else{
  	res.push("")
  }
 }
 return res;
}

//去除数组里的空元素
Array.prototype.notempty = function(){
    return this.filter(t => t!="");
}








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

				ceshiArr = [],
				save_row_temp_de = [],
				save_row_temp_me = [],
				save_col_temp_de = [],
				save_col_temp_me = [],
				save_data_ga = [];



function data_handle(){

			


				var  data = {};
				var row_data_change_de = drag_row_column_data["row"]["dimensionality"];
				var row_data_change_me = drag_row_column_data["row"]["measure"];
				var col_data_change_de = drag_row_column_data["column"]["dimensionality"];
				var col_data_change_me = drag_row_column_data["column"]["measure"];

				// 当前操作表的 数据
				var current_data = _cube_all_data[current_cube_name];
				
					var row_data = [],

					col_data = [],
					//判断拖入的是行还是列
					row_if_col = _drag_message["position"],

					//判断拖入的是维度还是度量

					row_col_type = _drag_message["type"];

					//二维数组保存数据
			 		
			 		
			 		
				
					 if( row_if_col == "row"){
					 	save_row_temp_de = [];
						save_row_temp_me = [];
			
					 	row_if_de = [];
					 	row_if_me = [];
					 	// 依照行维度进行排序
					 	if(row_col_type == "dimensionality"){
					 		current_data["data"].XMsort(drag_row_column_data["row"]["dimensionality"]);
					 	}

					 	row_data_change_de.filter(function(ele){

					 		row_if_de.push(ele.split(":")[0])
					 	})

					 	row_data_change_me.filter(function(ele){
					 		row_if_me.push(ele.split(":")[0])
					 	})


					 }else if(row_if_col == "column"){
					 	
					 		save_col_temp_de = [];
							save_col_temp_me = [];
					 	// 依照列维度进行排序
					 	if(row_col_type == "dimensionality"){
					 		current_data["data"].XMsort(drag_row_column_data["column"]["dimensionality"]);
					 	}
				 		
					 	col_if_de = [];
					 	col_if_me = [];
					 	
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
			 				
			 				
			 				save_row_temp_de.push(cube_temp[row_if_de[row_data_change_de.length-1]])

			 				
			 			}else if(row_if_col == "row" && row_col_type == "measure"){
			 			
			 				save_row_temp_me.push(cube_temp[row_if_me[row_data_change_me.length-1]]);

			 			}
				// .......................................
						// 存储列里的数据
						if(row_if_col == "column" && row_col_type == "dimensionality"){
	
							save_col_temp_de.push(cube_temp[col_if_de[col_data_change_de.length-1]]);


						}else if(row_if_col == "column" && row_col_type == "measure"){
							
							save_col_temp_me.push(cube_temp[col_if_me[col_data_change_me.length-1]]);

						}

						
			 	}

			 		

			 			//判断数组不为空存储
			 			if(save_row_temp_de.length != 0 && row_if_col == "row"){
			 				save_row_de_wrap.push(save_row_temp_de);
			 			}

			 			if(save_row_temp_me.length != 0 && row_if_col == "row"){

			 				save_row_me_wrap.push(save_row_temp_me);
			 			}

			 			if(save_col_temp_me.length != 0 && row_if_col == "column"){

			 				save_col_me_wrap.push(save_col_temp_me);
			 			}

			 			if(save_col_temp_de.length != 0 && row_if_col == "column"){
			 				save_col_de_wrap.push(save_col_temp_de);
			 			}

			 			//.........

			 		if(row_if_col == "column" && row_col_type == "dimensionality"){

			 			var save_temp = [];
			 		
			 			for(var i = 0; i < row_if_me.length;i++){
			 				var for_temp =[];
			 				var temp = row_if_me[i];
			 				for(var j = 0; j < _cube_all_data[current_cube_name]["data"].length;j++){
			 					var temp_two = _cube_all_data[current_cube_name]["data"][j];
			 					var bj = temp_two[temp];
			 					for_temp.push(bj);
			 				}
			 				save_temp.push(for_temp);
			 			}

			 			save_row_me_wrap = save_temp;
			 		}


			 		//定义字典存储处理过的数据
			 		var data_save_dict = {};
			 		data_save_dict["row_de"] = row_if_de;
			 		data_save_dict["row_me"] = row_if_me;
			 		data_save_dict["row_me_wrap"] = save_row_me_wrap;
			 		data_save_dict["row_de_wrap"] = save_row_de_wrap;
			 		data_save_dict["col_de"] = col_if_de;
			 		data_save_dict["col_me"] = col_if_me;
			 		data_save_dict["col_me_wrap"] = save_col_me_wrap;
			 		data_save_dict["col_de_wrap"] = save_col_de_wrap;

			 		return  data_save_dict;
}