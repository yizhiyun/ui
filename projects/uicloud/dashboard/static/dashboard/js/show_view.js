

		

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

				

					bar_data_save.push(col_row_me_add);

					
				}
				return bar_data_save;

			}



			

			//动态添加echarts  serise数据
			function addSerise(data,dataName){
				var serise = [];
				for(var i = 0 ; i<data.length;i++){
					var item = {
						name:dataName[i],
						type:"bar",
						data:data[i],

					}
					 serise.push(item );
				}
				return serise;
			}


			//动态添加echarts x轴数据

			function  addXais(axisData,axisName,col_repeat,xchangey){
				//col_repeat 判断第一个维度是否有重复元素
				if(col_repeat == "true"){
					var xAxis = [];
				for(var i = 0; i < axisData.length;i++){
					if(xchangey[1] == "left"){
						rotate = 90;
						if(i == 0 ){
						bar_pre = "left";
						show_bol = true;
					}else if( i == 1){
						bar_pre = "right";
						show_bol = true;

					}else{
						bar_pre = "right";
						show_bol = false;
					}
					}

					if(xchangey[1] == "top"){
						rotate = 0;
						//坐标轴的位置
						if(i == 0 ){
						bar_pre = "bottom";
						show_bol = true;
					}else if( i == 1){
						bar_pre = "top";
						show_bol = true;

					}else{
						bar_pre = "top";
						show_bol = false;
					}
					}
				
					var item = {
						show:true,
						name:axisName[i],
						nameLocation:xchangey[0],
						nameGap:10,
						nameRotate:rotate,
						position:bar_pre,
						offset: i * 30,
						type:xchangey[2],
						data:axisData[i],
						//坐标轴刻度设置
						axisTick:{
							show:show_bol,
							inside:true,
							interval: function (index, value) {return value!=='';},
							length:10,
						},
						// axisLabel:{
						// 	interval:0,
						// 	rotate:60,
						// 	formatter:function(val){
						// 		return val.split("").join("\n"); //横轴信息文字竖直显示
						// 	}
						// },
						//坐标轴名称样式
						nameTextStyle:{
							color:"#000",
							fontStyle:"oblique",
							fontWeight:"bold",

						}
					}
					xAxis.push(item)
				}
				return xAxis
			}
			if(col_repeat == "false"){
				var xAxis = [];
				for(var i = 0; i < axisData.length;i++){
					//判断是条形图使用还是柱状图
					if(xchangey[1] == "bottom"){
						rotate = 0;
						//坐标轴的位置
						if(i == 0 ){
						bar_pre = "bottom";
						show_bol = true;
					}else if( i == 1){
						bar_pre = "top";
						show_bol = true;

					}else{
						bar_pre = "top";
						show_bol = false;
					}
					}else if(xchangey[1] == "top"){
						rotate = 90;
						if(i == 0 ){
						bar_pre = "left";
						show_bol = true;
					}else if( i == 1){
						bar_pre = "right";
						show_bol = true;

					}else{
						bar_pre = "right";
						show_bol = false;
					}
					}
					var item = {
						show:true,
						name:axisName[i],
						nameLocation:xchangey[0],
						nameGap:10,
						position:bar_pre,
						nameRotate:rotate,
						offset: i * 30,
						type:xchangey[2],
						data:axisData[i],
						//坐标轴刻度设置
						axisTick:{
							show:show_bol,
							inside:true,
							interval: function (index, value) {return value!=='';},
							length:10,

						},
						// axisLabel:{
						// 	interval:0,
						// 	rotate:60,
						// 	formatter:function(val){
						// 		return val.split("").join("\n"); //横轴信息文字竖直显示
						// 	}
						// },
						//坐标轴名称样式
						nameTextStyle:{
							color:"#000",
							fontStyle:"oblique",
							fontWeight:"bold",

						}
					}
					xAxis.push(item)
				}
				return xAxis
			}else if(col_repeat == "only"){
						//只有度量默认坐标轴
					var only_me = [{
			    		show:false,
			       	 	type:"category",
			        	data:[""],
			   		 	}];
				return   only_me;
			}


			}



			//splice 问题修改


	//条形图展示
			function barChart(xType,xShow,xTitle,data,dataName,axisData,axisName,col_repeat,xchangey){

				$("#main").css("display","block");
				var mycharts = echarts.init($("#main").get(0));

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
			        left: '5%',
			        right: '8%',
			        bottom: '3%',
			        containLabel: true
			    },
			    yAxis: addXais(axisData,axisName,col_repeat,xchangey),
			    xAxis: [{
			    	show:xShow,
			        type: xType,
			        name: xTitle,
			        nameLocation:"middle",
			        nameGap:"20",
			        axisLabel: {
			            formatter: '{value}'
			        },
					
			    },
			    {
			            show:false,
			            type: 'value',
			            min: 10, max: 80
			        }
			    ],
			    series:addSerise(data,dataName)
			};

				//清除上一个图形的图例
				mycharts.clear();

				//使用刚指定的配置项和数据显示图标
				mycharts.setOption(option);



			}
// barChart----end----


			//柱状图展示

			function histogram(xType,yType,yShow,yTitle,data,dataName,axisData,axisName,col_repeat,xchangey){
				$("#main").css("display","block");

				var mycharts = echarts.init($("#main").get(0));

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
			        left: '6%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: addXais(axisData,axisName,col_repeat,xchangey),
			    yAxis: [{
			    	show:yShow,
			        type: yType,
			        name: yTitle,
			        nameLocation:"middle",
			        nameGap:"35",
			        axisLabel: {
			            formatter: '{value}'
			        },
					
			    },
			    {
			            show:false,
			            type: 'value',
			            min: 10, max: 80
			        }
			    ],
			    series:addSerise(data,dataName)
			};
				
				//清除上一个图形的图例
				mycharts.clear();
				//使用刚指定的配置项和数据显示图标
				mycharts.setOption(option);
			}

		// end.....
			function histogram_show(data_handle){

			var row_if_col = _drag_message["position"],
				//判断拖入的是维度还是度量
			row_col_type = _drag_message["type"];
				//拿到处理后的数据
			

			 var row_if_de = data_handle["row_de"],
	 		 row_if_me = data_handle["row_me"],
	 		 save_row_me_wrap = data_handle["row_me_wrap"],
	 		 save_row_de_wrap = data_handle["row_de_wrap"],
	 	     col_if_de = data_handle["col_de"],
	 		 col_if_me = data_handle["col_me"],
	 		 save_col_me_wrap = data_handle["col_me_wrap"],
	 		 save_col_de_wrap = data_handle["col_de_wrap"],
	 		 drag_or_sortable = data_handle["sortable_if"];

			 		//.........
			 		//柱状图的拖拽方式不同操作判断
			function histogram_handle(where_de,col_if_row){

				if(where_de.length > 0){
							//存放第一个维度去重后的数组
							var col_content = [];

							//判断列里第一个维度是否有重复元素
							if(save_col_de_wrap[0].ifUnique() == false){
								//只有一个有重复元素的维度 需要对度量进行求和处理
								if(col_if_de.length == 1){
									var row_data_add = [];
					
									for(var i =0; i < save_row_me_wrap.length;i++){
										var temp_row_wrap = save_row_me_wrap[i];
										
										row_data_add.push(save_col_de_wrap[0].unique3(temp_row_wrap))
									}
						
									col_content.push(save_col_de_wrap[0].unique4().notempty());
									
									//重复维度只有一个
									histogram("category","value",true,row_if_me.join("/"),row_data_add,row_if_me,col_content,col_if_de,"true",["start","top","category"]);
								}else{

									// 重复维度下多个维度
									save_col_de_wrap[0] = save_col_de_wrap[0].unique4();
									histogram("category","value",true,row_if_me.join("/"),save_row_me_wrap,row_if_me,save_col_de_wrap,col_if_de,"false",["start","bottom","category"]);
								}

							}else{
									
									//维度没有重复元素调用
									histogram("category","value",true,row_if_me.join("/"),save_row_me_wrap,row_if_me,save_col_de_wrap,col_if_de,"true",["start","top","category"]);

						}
					}
					if(col_if_row = "col"){
						if(col_if_de.length == 0){
							
							//只拖入度量显示数值的总和
							histogram("category","value",true,row_if_me.join("/"),row_data,row_if_me,null,null,"only",["","",""]);
						}
					}
					 
			}
			// histogram_handle--end-------------


			//barChart_handle_start
			function barChart_handle(where_de,col_if_row){
				//判断行里是否存在维度
							if(where_de.length>0){
								//存放第一个维度去重后的数组
								var  row_content =[];
								//判断行维度第一个维度是否有重复元素

							if(save_row_de_wrap[0].ifUnique() == false){
						
								//只有一个维度对相应度量进行求和处理
								if(row_if_de.length == 1){
									var col_data_add = [];
									//遍历列里度量的数据进行去重存在相应数组
									for(var i =0; i < save_col_me_wrap.length;i++){
										var temp_col_wrap = save_col_me_wrap[i];
										
										col_data_add.push(save_row_de_wrap[0].unique3(temp_col_wrap))
									}
									
									row_content.push(save_row_de_wrap[0].unique4().notempty());

									//只存在一个重复维度
								barChart("value",true,col_if_me.join("/"),col_data_add,col_if_me,row_content,row_if_de,"true",["end","left","category"]);
								}else{
									//重复维度下有多个维度
									save_row_de_wrap[0] = save_row_de_wrap[0].unique4();
									barChart("value",true,col_if_me.join("/"),save_col_me_wrap,col_if_me,save_row_de_wrap,row_if_de,"false",["end","top","category"]);
								}

							}else{
								//拖入的维度不重复
								barChart("value",true,col_if_me.join("/"),save_col_me_wrap,col_if_me,save_row_de_wrap,row_if_de,"true",["end","left","category"]);
							}
// ....................
							}
							if(col_if_row == "col"){
							 if(row_if_de.length == 0){
								//只有度量显示图形
								barChart("value",true,col_if_me.join("/"),col_data,col_if_me,null,null,"only",["","",""]);
							}
						}



			}
			//barchart_handle ------end-------
			 		if(row_if_col == "row" && row_col_type == "dimensionality"){

			 			var save_temp = [];
			 		
			 			for(var i = 0; i < col_if_me.length;i++){
			 				var for_temp =[];
			 				var temp = col_if_me[i];
			 				for(var j = 0; j < _cube_all_data[current_cube_name]["data"].length;j++){
			 					var temp_two = _cube_all_data[current_cube_name]["data"][j];
			 					var bj = temp_two[temp];
			 					for_temp.push(bj);
			 				}
			 				save_temp.push(for_temp);
			 			}

			 			save_col_me_wrap = save_temp;
			 		}



				//只拖入行里度量的求和 显示柱状图
				row_data = col_row_me_math(save_row_me_wrap,row_if_me);

				
				//只拖入列里度量的求和 显示条形图
				col_data = col_row_me_math(save_col_me_wrap,col_if_me);

		// histogram_handle -----end
				//判断拖入方式展示不同图形
				//判断拖入行中展示图形
				if(row_if_col == "row"){
					//判断拖入度量展示柱状图
					if(row_col_type == "measure"){
						//柱状图的展示
						histogram_handle(col_if_de,"col");
				//条形图的展示
				}else if(row_col_type == "dimensionality"){
						//展示条形图
						barChart_handle(col_if_me,"row")
			}
				}
			//拖入列里图形展示
				if(row_if_col == "column"){
					//判断列里拖入度量展示条形图
						if(row_col_type == "measure"){
							//展示条形图
							barChart_handle(row_if_de,"col")
						//柱状图的展示
						}else if(row_col_type == "dimensionality"){
							//柱状图的展示
							histogram_handle(row_if_me,"row");

					}
			}

			//排序时调用图形
			if(drag_or_sortable == "true"){
				if(drag_row_column_data["column"]["dimensionality"].length > 0){
				
					histogram_handle(row_if_me,"col");
				}


				if(drag_row_column_data["row"]["dimensionality"].length > 0 ){
			
					barChart_handle(col_if_me,"col");
				}
				if(col_if_me.length > 0 && col_if_de == 0 && row_if_me ==0 && row_if_de == 0){
					//只有度量显示图形
					barChart("value",true,col_if_me.join("/"),col_data,col_if_me,null,null,"only",["","",""]);
			}

				if(row_if_me.length > 0 && row_if_de == 0 && col_if_me == 0 && col_if_de == 0){
				//只拖入度量显示数值的总和
					histogram("category","value",true,row_if_me.join("/"),row_data,row_if_me,null,null,"only",["","",""]);
			}
			}

			

		}



