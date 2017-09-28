//1、瀑布图的处理

// 一个维度一个度量处理函数
// chart_type_need:waterWall,cake
function one_de_one_me_handle (chart_type_need) {
	var drag_measureCalculateStyle = JSON.parse($("."+viewshow_class+"").data("view_num_or"));
	var mycharts = echarts.init($("."+viewshow_class+"").get(0));
 	var need_handle_measureName = specialRemoveDataTypeHandle(drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]))[0];
 	var need_handle_dimensionalityName = specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]))[0];
	 // 一个维度一个度量
	function waterWall_generate_fun(){
		measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,function(data){
			var dimensionality_need_show = [];
			var measure_need_show = [];
			var measure_help_show =[];
			var count_help = 0;
			for(var i =0 ; i < data.length;i++){
				var aData = data[i];
				var value = aData[drag_measureCalculateStyle[need_handle_measureName]];
				dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
				measure_need_show.push(value);
				measure_help_show.push(count_help);
				count_help += value;
			}
			dimensionality_need_show.push("全部");
			measure_need_show.push(count_help);
			measure_help_show.push(0);
			var option = {
			    title: {
			        text: '瀑布图',
			    },
			    legend:{
			   	 	data:[need_handle_measureName]
			    },
			 	tooltip : {
			     trigger: 'axis',
			     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			         type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			     },
			     formatter: function (params) {
			         var tar;
			         if (params[1].value != '-') {
			             tar = params[1];
			         }
			         else {
			             tar = params[0];
			         }
			         return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
			     }
			 	},
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: {
			        type : 'category',
			        splitLine: {show:false},
					data:dimensionality_need_show,
					axisLabel:{
						interval:0,
					}
			    },
			    yAxis: {
			        type : 'value'
			    },
			    series: [
			        {
			            name: '辅助',
			            type: 'bar',
			            stack: '总量',
			            itemStyle: {
			                normal: {
			                    barBorderColor: 'rgba(0,0,0,0)',
			                    color: 'rgba(0,0,0,0)'
			                },
			                emphasis: {
			                    barBorderColor: 'rgba(0,0,0,0)',
			                    color: 'rgba(0,0,0,0)'
			                }
			            },
						data:measure_help_show
			        },
			        {
			            name: need_handle_measureName,
			            type: 'bar',
			            stack: '总量',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'top',
			                }
			            },
			            itemStyle:{
			            	normal: {
			                    barBorderColor: '#fbb860',
			                    color: "#fbb860"
			                },
			            },
						data:measure_need_show
			        },
			    ]
		
				};
				//清除上一个图例
				mycharts.clear();
		
				mycharts.setOption(option);
		});
	}

	//  饼图
	function  cake_generate_fun () {
		
		measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,function(data){
			var dimensionality_need_show = [];
			var measure_need_show = [];
			for (var i = 0; i < data.length;i++) {
				var aData = data[i];
				dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
				measure_need_show.push({"name":aData[need_handle_dimensionalityName],"value":aData[drag_measureCalculateStyle[need_handle_measureName]]});
			}
				var option = {
					title: {
						text: '饼图',
						x: "center"
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						data: dimensionality_need_show
					},
					color: ['#e85e77', "#fbb860", "#19a4a2", "#60cbf2", "#1a7fc5"],
					series: [{
						name: need_handle_measureName,
						type: "pie",
						radius: "80%",
						center: ["50%", "55%"],
						data: measure_need_show,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
					};
				//清除上一个图例
				mycharts.clear();
		
				mycharts.setOption(option)
		});
			
		
		
	

	}
	 // cake_generate_fun();
	
	// 4、面积图
	function area_generate_fun (argument) {

		measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,function(data){
			var dimensionality_need_show = [];
			var  measure_need_show = [];
			for(var i = 0;i < data.length;i++){
				var aData = data[i];
				dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
				measure_need_show.push(aData[drag_measureCalculateStyle[need_handle_measureName]]);
			}
			var option = {
				title:{
					text:"面积图"
				},
				tooltip:{
					trigger:"axis"
				},
				legend:{
					data:[need_handle_measureName]
				},
				xAxis:[
					{
						type:"category",
						boundaryGap:false,
						data:dimensionality_need_show
					}
				],
				yAxis:[
					{
						type:"value"
					}
				],
				series:[
					{
						name:need_handle_measureName,
						type:"line",
						smooth:"true",
						areaStyle:{
							normal:{
								color:"#e85e77",
								opacity:0.5,
							}
						},
						data:measure_need_show
					},
				]		
			}
			//清除上一个图例
			mycharts.clear();
	
			mycharts.setOption(option);
		});
		
		
	}
	
	// area_generate_fun();


 function gantt_generate_fun(){
 	
		measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,function(data){
				var dimensionality_need_show = [];
				var measure_need_show = [];
				var measure_help_show =[];
				var count_help = 0;
				for(var i = 0;i < data.length;i++){
					var aData = data[i];
					var value = aData[drag_measureCalculateStyle[need_handle_measureName]];
					dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
					measure_need_show.push(value);
					measure_help_show.push(count_help);
					count_help += value;
				}
				measure_help_show.unshift(0);
				measure_need_show.unshift(count_help);
				dimensionality_need_show.unshift("全部");
				var option = {
				    title: {
				        text: '甘特图',
				    },
				    legend:{
				    		data:[need_handle_measureName]
				    },
				 	tooltip : {
				     trigger: 'axis',
				     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				         type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				     },
				     formatter: function (params) {
				         var tar;
				         if (params[1].value != '-') {
				             tar = params[1];
				         }
				         else {
				             tar = params[0];
				         }
				         return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
				     }
				 	},
				    xAxis: {
				     	 type : 'value',
				    },
				    yAxis: {
				        type : 'category',
				        splitLine: {show:false},
						data:dimensionality_need_show,
				    },
				    series: [
				        {
				            name: '辅助',
				            type: 'bar',
				            stack: '总量',
				            itemStyle: {
				                normal: {
				                    barBorderColor: 'rgba(0,0,0,0)',
				                    color: 'rgba(0,0,0,0)'
				                },
				                emphasis: {
				                    barBorderColor: 'rgba(0,0,0,0)',
				                    color: 'rgba(0,0,0,0)'
				                }
				            },
							data:measure_help_show
				        },
				        {
				            name: need_handle_measureName,
				            type: 'bar',
				            stack: '总量',
				            label: {
				                normal: {
				                    show: true,
				                    position: 'top',
				                }
				            },
				            itemStyle:{
				            	normal: {
				                    barBorderColor: '#e85e77',
				                    color: "#e85e77"
				                },
				            },
							data:measure_need_show
				        },
				    ]
			
					};
			 	//清除上一个图例
					mycharts.clear();
			
			 		mycharts.setOption(option);
		});
		
 }
 // gantt_generate_fun();



//判断传入参数不同调用不同图形

switch(chart_type_need)
{
case "waterWall":
	//调用瀑布图
	waterWall_generate_fun();
  break;
case "cake":
	//调用饼图
  	cake_generate_fun();
  break;
  case "scale":
  //调用范围图
//	scale_generate_fun();
  	area_generate_fun();
  break;
  case "area":
  //调用面积图
  	area_generate_fun();
  break;
  case "gantt":
  //调用甘特图
  	gantt_generate_fun();
  	break;
default:

}





}




// end------------------
// 多个维度多个度量
function many_de_many_me_handle(chart_type_need){
	var drag_measureCalculateStyle = JSON.parse($("."+viewshow_class+"").data("view_num_or"))
	//释放图表实例
	var mycharts = echarts.init($("."+viewshow_class+"").get(0));
	
	var all_dimensionality = specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]));
	var all_measure = specialRemoveDataTypeHandle(drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]));
	// 1、折线图
	function polyLine_generate_fun(){
			measure_Hanlde(all_dimensionality,all_measure,null,function(data){
				
				var option = {
					title:{
					text:"折线图"
					},
					tooltip: {
	       			trigger: 'axis',
	        			axisPointer: {
	            			type: 'cross',
	       			},
	       			textStyle:{
	       				fontSize:12
	       			}
	    			 }, 	
	    			legend: {
	       		 	data:all_measure,
	    			},
	    			 xAxis:[],
	    			 yAxis:[
	    			 	{
	    			 		type:"value"
	    			 	},
	    			 ],
	    			 series:[]
				};
				var measure_show_data_arr = [];
				var dimensionality_show_data_arr = [];
				
				for(var i = 0; i < data.length;i++){
					var aData = data[i];
					for(var measure_i = 0;measure_i < all_measure.length;measure_i++){
						var aMeasure = all_measure[measure_i];
						if(!measure_show_data_arr[measure_i]){
							measure_show_data_arr[measure_i] = [aData[drag_measureCalculateStyle[aMeasure]]];
						}else{
							measure_show_data_arr[measure_i].push(aData[drag_measureCalculateStyle[aMeasure]]);
						}
					}
					for(var dimensionality_i = 0;dimensionality_i < all_dimensionality.length;dimensionality_i++){
						var aDimensionality = all_dimensionality[dimensionality_i];
						if(!dimensionality_show_data_arr[dimensionality_i]){
							dimensionality_show_data_arr[dimensionality_i] = [aData[aDimensionality]];
						}else{
							dimensionality_show_data_arr[dimensionality_i].push(aData[aDimensionality]);
						}
					}
				}
				for(var i = dimensionality_show_data_arr.length - 1;i >= 0;i--){
						var obj = {
						name:all_dimensionality[i],
						nameLocation:"start",
						nameGap:25,
						type: 'category',
						boundaryGap:false,
						position:"bottom",
						offset:25*(dimensionality_show_data_arr.length - 1 - i),
//						axisTick:{
//							inside:true,
//							interval:function(index,value){return !/^\s/.test(value)}
//						},
//						axisLabel:{
//							interval:function(index,value){return !/^\s/.test(value)}
//						},
						data:dimensionality_show_data_arr[i]	
					}
					option["xAxis"].push(obj);
					option["yAxis"].push({type:"value",show:false,min:10,max:80});
				}
				for(var i = 0; i < measure_show_data_arr.length;i++){
					var measure = measure_show_data_arr[i];
           			var obj = {name:all_measure[i],type:"line",smooth:true,data:measure}
           			option["series"].push(obj);
				}
				
				//清除上一个图例
				mycharts.clear();
				
				mycharts.setOption(option);	
			});
		
			
//			option["tooltip"]["formatter"] = function(params){
//				var dimeNames = "";
//				var measureNames = "";
//				for (var i = 0;i < params.length;i++) {
//					if (i == 0) {
//						for (var k = 0;k < dimensionality_arr.length;k++){
//						dimeNames  +=  "<p style='font-size;12px;height:12px;padding:3px 0 3px 5px'>"+dimensionality_arr[k][params[i].dataIndex] + "<p/>";
//						}
//					}
//					measureNames += "<p style='font-size;12px;height:12px;padding:3px 0 3px 0'><span style=width:12px;height:12px;border-radius:50%;float:left;line-height:12px;background:"+params[i].color + ">"+ "</span>" + "<span style='float:left;margin-left:5px;height:12px;line-height:12px'>"+params[i].seriesName + ":  " +  params[i].value + "</span></p>";
//				}
//				return dimeNames+measureNames;
//			}
			
					
	}
//	polyLine_generate_fun();

//2、对比条形图
function comparisonStrip_generate_fun(){

			measure_Hanlde(all_dimensionality,all_measure,null,function(data){
				var measure_show_data = [];
				var dimensionality_show_data = [];
				for (var i = 0;i < data.length;i++) {
					var aData = data[i];
					dimensionality_show_data.push(aData[all_dimensionality[0]]);
					for (var j = 0;j < all_measure.length;j++) {
						var aMeasure = all_measure[j];
						if(!measure_show_data[j]){
							measure_show_data[j] = [aData[drag_measureCalculateStyle[aMeasure]]];
						}else{
							measure_show_data[j].push(aData[drag_measureCalculateStyle[aMeasure]]);
						}
					}
				}
				var option = {
					title: {
						text: "对比条形图"
					},
					legend: {
						data: all_measure,
						top: 4,
						right: '20%',
						textStyle: {
							color: '#00000',
						},
					},
					tooltip: {
						show: true,
						trigger: 'axis',
						axisPointer: {
							type: 'shadow',
						}
					},
					grid: [{
						show: false,
						left: '4%',
						top: 60,
						bottom: 60,
						containLabel: true,
						width: '46%',
					}, {
						show: false,
						left: '50.5%',
						top: 80,
						bottom: 60,
						width: '0%',
					}, {
						show: false,
						right: '4%',
						top: 60,
						bottom: 60,
						containLabel: true,
						width: '46%',
					}, ],
					xAxis: [{
						gridIndex: 0,
						type: 'value',
						inverse: true,
						axisLine: {
							show: false,
						},
						axisTick: {
							show: false,
						},
						position: 'top',
						 axisLabel: {
						     show: true,
						     textStyle: {
						         color: '#B2B2B2',
						         fontSize: 12,
						     },
						 },
						splitLine: {
							show: true,
							lineStyle: {
								color: '#1F2022',
								width: 1,
								type: 'solid',
							},
						},
					}, {
						gridIndex: 1,
						show: false,
					}, {
						gridIndex: 2,
						type: 'value',
						axisLine: {
							show: false,
						},
						axisTick: {
							show: false,
						},
						position: 'top',
						axisLabel: {
							show: true,
							textStyle: {
								color: '#B2B2B2',
								fontSize: 12,
							},
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: '#1F2022',
								width: 1,
								type: 'solid',
							},
						},
					}, ],
				
					yAxis: [{
							gridIndex: 0,
							type: 'category',
							inverse: true,
							position: 'right',
							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								show: false,
								margin: 8,
								textStyle: {
									color: '#9D9EA0',
									fontSize: 12,
								},
				
							},
							data: dimensionality_show_data,
						}, {
							gridIndex: 1,
							type: 'category',
							inverse: true,
							position: 'left',
							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								show: true,
								textStyle: {
									color: '#9D9EA0',
									fontSize: 12,
								},
				
							},
							data: dimensionality_show_data.map(function(value) {
								return {
									value: value,
									textStyle: {
										align: 'center',
									}
								}
							}),
						}, {
							gridIndex: 2,
							type: 'category',
							inverse: true,
							position: 'left',
							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								show: false,
								textStyle: {
									color: '#9D9EA0',
									fontSize: 12,
								},
				
							},
							data: dimensionality_show_data,
						},
				
					],
					series: [{
						name: all_measure[0],
						type: 'bar',
						xAxisIndex: 0,
						yAxisIndex: 0,
						barGap: 20,
		//				barWidth: 20,
						label: {
							normal: {
								show: false,
							},
							emphasis: {
								show: true,
								position: 'left',
								offset: [0, 0],
								textStyle: {
									color: '#fff',
									fontSize: 14,
								},
							},
						},
						itemStyle: {
							normal: {
								color: '#659F83',
							},
							emphasis: {
								color: '#08C7AE',
							},
						},
						data: measure_show_data[0],
					}, {
						name: all_measure[1],
						type: 'bar',
						barGap: 20,
		//				barWidth: 20,
						xAxisIndex: 2,
						yAxisIndex: 2,
						label: {
							normal: {
								show: false,
							},
							emphasis: {
								show: true,
								position: 'right',
								offset: [0, 0],
								textStyle: {
									color: '#fff',
									fontSize: 14,
								},
							},
						},
						itemStyle: {
							normal: {
								color: '#F68989',
							},
							emphasis: {
								color: '#F94646',
							},
						},
						data: measure_show_data[1],
					}],
				};
				//清除上一个图例
				mycharts.clear();
		
				mycharts.setOption(option);
			});	
}







 // 3、堆积柱状图 2-3个维度，1个度量
 //	type：number_bar、number_liner、percentage_bar、percentage_liner
 	function stackedBar_generate_fun(bar_type){

 		var  chartTile = {"number_bar":"堆积柱状图","number_liner":"堆积条形图","percentage_bar":"百分比堆积柱","percentage_liner":"百分比堆积条形"}
 					
			measure_Hanlde(all_dimensionality,all_measure,null,function(data){
				var measureName = all_measure[0];
				var needMeasureData = data;
				var dimensionality_arr= []; // 各个维度的数组,绘制图形需要使用
				var need_show_dimensionality_arr = [];
				var need_show_dime_name_arr = all_dimensionality.slice(0,all_dimensionality.length-1);
				
				var confir_max_obj = {};
				var max = 1;
				var groupArr = [];
				var measure_Data_arr = [];
				
				for(var i =0; i <  data.length;i++){
					var aData = data[i];
					for(var j = 0;j < all_dimensionality.length - 1;j++){
						if(!need_show_dimensionality_arr[j]){
							need_show_dimensionality_arr[j] = [aData[all_dimensionality[j]]];
						}else{
							if(need_show_dimensionality_arr[j].indexOf(aData[all_dimensionality[j]]) == -1){
								need_show_dimensionality_arr[j].push(aData[all_dimensionality[j]]);
							}
						}
					}
					
					var dime = aData[all_dimensionality[all_dimensionality.length - 2]];
					var nowdime = aData[all_dimensionality[all_dimensionality.length - 1]];
					if(i > 0){	
						var predime = data[i-1][all_dimensionality[all_dimensionality.length - 1]];
					}
					if (!confir_max_obj[dime]){
						confir_max_obj[dime] = 1;
						groupArr.push([nowdime]);
						measure_Data_arr.push([aData[drag_measureCalculateStyle[all_measure[0]]]]);
					}else{
						if(i > 0){
							if(predime != nowdime){
								confir_max_obj[dime] ++;
								groupArr[groupArr.length - 1].push(nowdime);
								measure_Data_arr[measure_Data_arr.length - 1].push(aData[drag_measureCalculateStyle[all_measure[0]]]);
								max = max > confir_max_obj[dime] ? max:confir_max_obj[dime];
							}
						}
					}
				}
				
				var option = {
					title:{
						text:chartTile[bar_type]
					},
					tooltip : {
	        				trigger: 'item',
	        				formatter:function(params){
	        					var dimeNames = "<p style='font-size;12px;height:12px;padding:3px 0 3px 5px'>" + params["data"]["name"] + "</p>";
	        					var val = params.value;
	        					if (bar_type == "percentage_liner" || bar_type == "percentage_bar") {
	        						val = (Number(val) * 100).toFixed(2) + "%";
	        						console.log("--------",val);
	        					}
							var measureNames = "<p style='font-size;12px;height:12px;padding:3px 0 3px 0'><span style=width:12px;height:12px;border-radius:50%;float:left;line-height:12px;background:"+params.color + ">"+ "</span>" + "<span style='float:left;margin-left:5px;height:12px;line-height:12px'>" +measureName+":  " + val+"</span></p>";
							
							return dimeNames + measureNames;
	        				}
				  	},
	    				 xAxis:[
	    				 	
	    				 ],
	    				 yAxis:[
	    				 ],
	    				 series:[]
				};
			//number_liner、percentage_bar、percentage_liner
			var axisLabelSetteing = 	{type:"value"};
			if(bar_type == "percentage_liner" || bar_type == "percentage_bar"){
				axisLabelSetteing["min"] = 0;
				axisLabelSetteing["max"] = 1;
				axisLabelSetteing["axisLabel"] = {};
				axisLabelSetteing["axisLabel"]["formatter"] = function(value,index){
					if (value > 0) {
						return (value * 100) + "%";
					}else{
						return 0;
					}
					
				}
			}
			if (bar_type == "number_bar" || bar_type == "percentage_bar") {
				option["yAxis"].push(axisLabelSetteing);
			}else{
				option["xAxis"].push(axisLabelSetteing);
			}
			//  坐标轴设置值
			for (var k = need_show_dimensionality_arr.length - 1;k >= 0;k--){
				var obj = {
					name:need_show_dime_name_arr[k],
					nameLocation:"start",
					nameGap:25,
					type: 'category',
//					boundaryGap:false,
					position:"bottom",
					offset:25*(need_show_dimensionality_arr.length - 1 - k),
					axisTick:{
						inside:false,
						interval:function(index,value){return !/^\s/.test(value)}
					},
					axisLabel:{
						interval:function(index,value){return !/^\s/.test(value)}
					},
					data:need_show_dimensionality_arr[k]	
				}
				if (bar_type == "number_bar" || bar_type == "percentage_bar") {
					option["xAxis"].push(obj);
					option["yAxis"].push({type:"value",show:false,min:10,max:80});
				}else{
					option["yAxis"].push(obj);
					option["xAxis"].push({type:"value",show:false,min:10,max:80});
				}		
			}
				// 造多少行数据(几个去堆叠)
			for (var i = 0;i < max;i++) {
				var name;
				var stack;
				var data = [];
				var helpSum = 0;
				for (var j =0;j < groupArr.length;j++) {
					
						name = "a" + i;
						stack = "use";
						var val = measure_Data_arr[j][i]
						if (bar_type == "percentage_liner" || bar_type == "percentage_bar") {
							val = (val / eval(measure_Data_arr[j].join("+"))).toFixed(4);
						}
						data.push({value:val,name:groupArr[j][i]});
				}
				
				var obj = {
					name:name,
					type:"bar",
					stack:stack,
					data:data
				}
				option["series"].push(obj);
			}
				//清除上一个图例
				mycharts.clear();
		
				mycharts.setOption(option);	
			});
			
 			
 }


// 关系图
	function reliationTree_generate_fun(){
			var need_all_link = [];
			var need_all_nodes = []; // 所需要的所有节点
			var categorysHelp = []; 
			var categorys = [];// 分类，主要用作图例
			var categoryName = "";
		measure_Hanlde(all_dimensionality,all_measure,null,function(data){
			for (var i = 0;i < data.length;i++) {
				var aData = data[i];
				for(var j = 1;j < all_dimensionality.length;j++){
					var dimensionalityPre =  all_dimensionality[j - 1];
					var dimensionalityNext =  all_dimensionality[j];
					var obj = {"source":aData[dimensionalityPre],"target":aData[dimensionalityNext]};
					need_all_link.push(obj);
					if(!categorysHelp[j-1]){
						categorysHelp[j-1] = [{"name":aData[dimensionalityPre]}];
					}else if(categorysHelp[j-1].hasObject("name",aData[dimensionalityPre]) == -1){
						categorysHelp[j-1].push({"name":aData[dimensionalityPre]});
					}
					if(!categorysHelp[j]){
						categorysHelp[j] = [{"name":aData[dimensionalityNext]}];
					}else if(categorysHelp[j].hasObject("name",aData[dimensionalityNext]) == -1){
						categorysHelp[j].push({"name":aData[dimensionalityNext]});
					}
				}
			}
			categoryName = all_dimensionality[0];
			var min = 0;
			for(var k =0;k<categorysHelp.length;k++){
				if(categorysHelp[min].length > categorysHelp[k].length){
					min = k;
				}
			}
			categorys = objectDeepCopy(categorysHelp[min]);
			categoryName = all_dimensionality[min];
			delete categorysHelp;
			getNodeFunction();
		});
		function getNodeFunction(){
			var allColumns_need= drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"],drag_row_column_data["row"]["measure"],drag_row_column_data["column"]["measure"]);
			var needColumns = {};
			for(var k = 0;k < allColumns_need.length;k++){
				var infoArr = allColumns_need[k].split(":");
				needColumns[infoArr[0]] = {"type":infoArr[1]};
			}
			var count = 0
			for(var i = 0;i < all_dimensionality.length;i++){
				(function(index){
					measure_Hanlde(all_dimensionality[index],all_measure,needColumns,function(data){
					for(var j = 0;j < data.length;j++){
						var aData = data[j];
						var aNode = {
							"value":aData[drag_measureCalculateStyle[all_measure[0]]],
							"name":aData[all_dimensionality[index]],
							"fixed":false,
							"symbolSize":[50,20],
							"draggable":true,
							"category":categorys.hasObject("name",aData[categoryName]),
							label:{normal:{show:true,formatter:function(params){return params["name"];}}}
							
						}
						need_all_nodes.push(aNode);
					}
					count++;
					if(count == all_dimensionality.length){
						draw();
					}	
				 });
				})(i);
			}
		}
		
		function draw(){
			var option = {
				title:{
					text:"关系图",
				},
				legend:[{
					data:categorys.map(function(ele){
						return ele.name;
					})
				}],
				tooltip:{
					formatter:function(params){
						if(params["dataType"] == "edge"){
							var name = params["name"];
							var nameArr = name.split(" > ");
							var ori = nameArr[0].split("_YZY_");
							var target = nameArr[1].split("_YZY_");
							return ori[ori.length - 1].split("_equal_")[1] + " > "+ target[target.length - 1].split("_equal_")[1];
						}else{
							var names = params["name"].split("_YZY_");
							return params["seriesName"]+ "<br/>" + params["marker"]+ names[names.length - 1].split("_equal_")[1] + ": " + params["value"];
						}
						
					}
				},
		
				series:[
					{
						name:all_measure[0],
						type:"graph",
						layout:"force",
						data:need_all_nodes,
						roam:true,
						links:need_all_link,
						categories:categorys,
						force:{
							repulsion: 100
						},
					}
				]	
			}
			mycharts.clear();
	
			mycharts.setOption(option);
		}
	}

// 柱状图
	function histogram_generate_fun(){
		
		measure_Hanlde(all_dimensionality,all_measure,null,function(data){
			var series = [];
			var dimensionality_show_data = [];
			var needXais = [];
			for(var i = 0;i < data.length;i++){
				var aData = data[i];
				for(var j = 0;j < all_measure.length;j++){ // 计算出series
					if(!series[j]){
						series[j] = {"name":all_measure[j],"type":"bar","xAxisIndex":"0","data":[aData[drag_measureCalculateStyle[all_measure[j]]]]};
					}else{
						series[j]["data"].push(aData[drag_measureCalculateStyle[all_measure[j]]]);
					}
				}
				for(var k = 0;k < all_dimensionality.length;k++){
					if(!dimensionality_show_data[k]){
						dimensionality_show_data[k] = [aData[all_dimensionality[k]]];
					}else if(dimensionality_show_data[k].indexOf(aData[all_dimensionality[k]]) == -1){
						dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
					}
				}
			}
			
			for(var i = 0;i < dimensionality_show_data.length;i++){
				var aX = {
					"show":true,
					"name":all_dimensionality[i],
					"nameGap":10,
					"nameLocation":"left",
					"offset": i * 30,
					"type":"category",
					"data":dimensionality_show_data[i]
				}
				needXais.push(aX);
			}
			
			
			var option = {
			    title: {
			        text: current_cube_name,
			    },
			    tooltip: {
			        trigger: 'item',
			        axisPointer: { // 坐标轴指示器，坐标轴触发有效
			            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			   legend: {
			        data: all_measure,
			        align: 'right',
			        right: 10
			    },
			    grid: {
			        left: '6%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis: needXais,
			    yAxis: [{
			    		show:true,
			        type: "value",
			        name: all_measure.join("/"),
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
			    series:series
			};
				
			mycharts.clear();
			mycharts.setOption(option);
			
		});
	}
	
	// 条形图 
	function barChart_generate_fun(){
		measure_Hanlde(all_dimensionality,all_measure,null,function(data){

			var series = [];
			var dimensionality_show_data = [];
			var needYais = [];
			
			for(var i = 0;i < data.length;i++){
				var aData = data[i];
				for(var j = 0;j < all_measure.length;j++){ // 计算出series
					if(!series[j]){
						series[j] = {"name":all_measure[j],"type":"bar","yAxisIndex":"0","data":[aData[drag_measureCalculateStyle[all_measure[j]]]]};
					}else{
						series[j]["data"].push(aData[drag_measureCalculateStyle[all_measure[j]]]);
					}
					
				}
				for(var k = 0;k < all_dimensionality.length;k++){
					if(!dimensionality_show_data[k]){
						dimensionality_show_data[k] = [aData[all_dimensionality[k]]];
					}else if(dimensionality_show_data[k].indexOf(aData[all_dimensionality[k]]) == -1){
						dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
					}
					
				}
			}
			for(var i = 0;i < dimensionality_show_data.length;i++){
				var aY = {
					"show":true,
					"name":all_dimensionality[i],
					"nameGap":10,
					"nameLocation":"left",
					"offset": i * 30,
					"type":"category",
					"data":dimensionality_show_data[i]
				}
				needYais.push(aY);
				
			}
			var option = {
			    title: {
			        text: current_cube_name,
			    },
			    tooltip: {
			        trigger: 'item',
			        axisPointer: { // 坐标轴指示器，坐标轴触发有效
			            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    legend: {
			        data: all_measure,
			        align: 'right',
			        right: 10
			    },
			    grid: {
			        left: '5%',
			        right: '8%',
			        bottom: '3%',
			        containLabel: true
			    },
			    yAxis: needYais,
			    xAxis: [{
			    	show:true,
			        type: "value",
			        name: all_measure.join("/"),
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
			    series:series
			};

				//清除上一个图形的图例
				mycharts.clear();

				//使用刚指定的配置项和数据显示图标
				mycharts.setOption(option);
		});
	}
	//  雷达图
	function radarChart_generate_fun(){
		measure_Hanlde(all_dimensionality,all_measure,null,function(data){
			var indicator = [];
			var legendData = all_measure;
			var series = [{"name":all_measure.join("/"),"type":"radar","data":[]}];
			for(var i =0;i < data.length;i++){
				var aData = data[i];
				var max = aData[drag_measureCalculateStyle[all_measure[0]]];
				for(var j = 0;j <  all_measure.length;j++){
					if(!series[0]["data"][j]){
						series[0]["data"][j] = {"name":all_measure[j],"value":[aData[drag_measureCalculateStyle[all_measure[j]]]]};
					}else{
						series[0]["data"][j]["value"].push(aData[drag_measureCalculateStyle[all_measure[j]]]);
					}
					if(max < aData[drag_measureCalculateStyle[all_measure[j]]]){
						max  = aData[drag_measureCalculateStyle[all_measure[j]]];
					}
				}
				indicator.push({"name":aData[all_dimensionality[0]],"max":max*1.2});
			}
			
		var option = {
		    title: {
		        text: current_cube_name,
		    },
		    tooltip: {},
		    legend: {
		        data: legendData,
		    },
		    radar: {
		        shape: 'circle',
		        indicator:indicator
		    },
		    series: series
		};
		//清除上一个图例
		mycharts.clear();
	
		mycharts.setOption(option);
			
		});
	}


	//判断传入参数不同调用不同图形
	switch(chart_type_need)
	{
		case "polyline":
			//调用折线图
			polyLine_generate_fun();
		  break;
		case "comparisonStrip":
			//调用对比条形图
		  	comparisonStrip_generate_fun();
		  break;
		  case "number_bar":
		  //调用堆积柱状图
		  	stackedBar_generate_fun("number_bar");
		  break;
		  case "number_liner":
		  //调用堆积条形图
		  	stackedBar_generate_fun("number_liner");
		  break;
		  case "percentage_bar":
		  //调用百分比堆积柱状图
		  	stackedBar_generate_fun("percentage_bar");
		  break;
		   case "percentage_liner":
		  //调用百分比堆积条形图
		  	stackedBar_generate_fun("percentage_liner");
		  break;
		  case "reliationTree":
		  //调用树状图
		 	reliationTree_generate_fun();
		  break;
		  //调用雷达图
		  case "radarChart":
		  radarChart_generate_fun();
		  break;
		  //调用条形图
		  case "barChart":
		  barChart_generate_fun();
		  break;
		  //调用柱状图
		  case "histogram":
		  histogram_generate_fun();
		  break;

		default:

	}
}



// 公共函数，处理层级字典
// values是度量值
// needobj 辅助对象
// keys，需要过滤的维度的数组
//arr1：过滤好的数组，包含维度的各个值
//arr2：维度的名字
function object_key_hanlde(needobj,keys,arr1,arr2){
	var i = 0;
	function  handle (obj) {
	if(!obj[keys[i]]){
		obj[keys[i]] = {};
		if(!arr1[i]){
			arr1[i] = [];
			arr2.push(keys[i].split("_equal_")[0]);
		}
		arr1[i].push(keys[i].split("_equal_")[1]);
	}else{
		if(i + 1 < keys.length){
			arr1[i].push(" " + keys[i].split("_equal_")[1]);
		}	
	}
	i++;
	if(i == keys.length){
	   return;
	}
	obj = handle(obj[keys[i - 1]]);
	
}
   handle(needobj);
}



