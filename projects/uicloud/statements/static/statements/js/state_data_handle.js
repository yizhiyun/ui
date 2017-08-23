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


Array.prototype.change_data_for = function(data_all){
				var save_arr = [];
				var save_temp = [];
				for(var i = 0; i < this.length;i++){
					var temp = this[i];
					save_temp = [];
					for(var j = 0; j < data_all.length;j++){
						save_temp.push(data_all[j][temp])
					}

					save_arr.push(save_temp);

				}

				return save_arr
			}



//存放行里的维度元素的数据
			var save_row_de_wrap =[],

			//存放行里的度量元素的数据

				save_row_me_wrap = [],

			//存放列里的维度元素的数据

				save_col_de_wrap = [],

			//存放列里的度量元素的数据
				save_col_me_wrap = [],


				row_if_me = [],

				row_if_de = [],
				col_if_me = [],

				col_if_de = [],

				save_row_temp_de = [],
				save_row_temp_me = [],
				save_col_temp_de = [],
				save_col_temp_me = [];
				




	
		//排序后存储的数据
		var sortable_data= {};


function data_handle(drag_sortable){
			
				var  data = {};
				

				var row_data_change_de = drag_row_column_data["row"]["dimensionality"];
				var row_data_change_me = drag_row_column_data["row"]["measure"];
				var col_data_change_de = drag_row_column_data["column"]["dimensionality"];
				var col_data_change_me = drag_row_column_data["column"]["measure"];
				var if_or;



				// console.log(row_data_change_de,row_data_change_me,col_data_change_de,col_data_change_me)
				// 当前操作表的 数据
				var current_data = _cube_all_data[current_cube_name];
				
					var row_data = [],

					col_data = [],
					//判断拖入的是行还是列
					row_if_col = _drag_message["position"],

					//判断拖入的是维度还是度量

					row_col_type = _drag_message["type"];

			 		//拖拽排序元素处理
			 		if(drag_sortable == "sortable"){
			 			save_row_de_wrap =[];
						save_row_me_wrap = [];
						save_col_de_wrap = [];
						save_col_me_wrap = [];
						row_if_me = [];
						row_if_de = [];
						col_if_me = [];
						col_if_de = [];

						var change_xm;
						if(row_col_type == "sortable_column"){

							current_data["data"].XMsort(drag_row_column_data["row"]["dimensionality"]);
						}else if(row_col_type == "sortable_row"){
							change_xm=drag_row_column_data["row"]["dimensionality"]
							current_data["data"].XMsort(change_xm);
						}

						//..
						col_data_change_de.filter(function(ele){
					 		col_if_de.push(ele.split(":")[0]);
					 	})
					 	
					 	col_data_change_me.filter(function(ele){
					 		col_if_me.push(ele.split(":")[0]);
					 	
					 	})
					 	//...
					 	row_data_change_de.filter(function(ele){

					 		row_if_de.push(ele.split(":")[0]);
					 		
					 	})

					 	row_data_change_me.filter(function(ele){
					 		row_if_me.push(ele.split(":")[0]);
					 		
					 	})

					 	//....
					 	save_row_de_wrap = row_if_de.change_data_for(_cube_all_data[current_cube_name]["data"]);
					 	save_row_me_wrap = row_if_me.change_data_for(_cube_all_data[current_cube_name]["data"]);
					 	save_col_de_wrap = col_if_de.change_data_for(_cube_all_data[current_cube_name]["data"]);
					 	save_col_me_wrap = col_if_me.change_data_for(_cube_all_data[current_cube_name]["data"]);
					 	if_or = "true";


			 		}



			 		// save_row_me_wrap = save_row_me_wrap.splice(save_row_me_wrap.length-row_if_me.length);
			 		// save_row_de_wrap = save_row_de_wrap.splice(save_row_de_wrap.length-row_if_de.length);
			 		// save_col_me_wrap = save_col_me_wrap.splice(save_col_me_wrap.length-col_if_me.length);
			 		// save_col_de_wrap = save_col_de_wrap.splice(save_col_de_wrap.length-col_if_de.length);

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
			 		data_save_dict["sortable_if"] = if_or;

			 		
			 		return  data_save_dict;
}