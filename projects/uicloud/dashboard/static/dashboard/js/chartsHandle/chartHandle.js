//1、瀑布图的处理

// 一个维度一个度量处理函数
// chart_type_need:waterWall,cake
function one_de_one_me_handle (chart_type_need) {
	$("#main").css({
			"display":"block"
	});

	
	
	var mycharts = echarts.init($("#main").get(0));

	

 	var need_handle_measureName = null;
	var handle_index =drag_row_column_data["row"]["measure"].length - 1; 
		if (handle_index < 0) {
			handle_index = drag_row_column_data["column"]["measure"].length - 1;
			if (handle_index < 0) {
				return;
			}
			 need_handle_measureName =  drag_row_column_data["column"]["measure"][handle_index].split(":")[0];
		}else{
			 need_handle_measureName =  drag_row_column_data["row"]["measure"][handle_index].split(":")[0];
		}
	// 度量的数据
	 var needMeasureData = measure_Hanlde([need_handle_measureName]);

	 // 一个维度一个度量
	function waterWall_generate_fun(){
		var dimensionality_need_show = [];
		var measure_need_show = [];
		var measure_help_show =[];
		var dimensionalityArr = allKeys(needMeasureData).sort();
		var count_help = 0;
		for (var i = 0;i < dimensionalityArr.length;i++) {
			var value = needMeasureData[dimensionalityArr[i]][need_handle_measureName]["sum"];
			measure_need_show.push(value);
			measure_help_show.push(count_help);
			count_help += value;
			var the_dime = dimensionalityArr[i].replace(/_YZY_$/g,"");
			the_dime = the_dime.split("_equal_")[1];
			dimensionality_need_show.push(the_dime);
		}

		var option = {
	    title: {
	        text: '瀑布图',
	//      subtext: 'From ExcelHome',
	//      sublink: 'http://e.weibo.com/1341556070/Aj1J2x5a5'
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
	//  legend: {
	//      data:['支出','收入']
	//  },
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
	                    barBorderColor: '#1a7fc5',
	                    color: "#1a7fc5"
	                },
	            },
				data:measure_need_show
	        },
	    ]

		};
		//清除上一个图例
		mycharts.clear();

		mycharts.setOption(option);
	}

	//  饼图
	function  cake_generate_fun () {
		var dimensionality_need_show = [];
		var measure_need_show = [];
		var dimensionalityArr = allKeys(needMeasureData).sort();
		for (var i = 0;i < dimensionalityArr.length;i++) {
			var value = needMeasureData[dimensionalityArr[i]][need_handle_measureName]["sum"];
			
			var the_dime = dimensionalityArr[i].replace(/_YZY_$/g,"");
			the_dime = the_dime.split("_equal_")[1];
			dimensionality_need_show.push(the_dime);
			var obj = {"name":the_dime,"value":value};
			measure_need_show.push(obj);
		}

		var option = {
			title: {
	        	text: '饼图',
	       		x:"center"
	   		},
	   		tooltip : {
       		 trigger: 'item',
       		 formatter: "{a} <br/>{b} : {c} ({d}%)"
   			},
	   		legend: {
	        	orient: 'vertical',
	       		left: 'left',
	       		data: dimensionality_need_show
	    	},
	    	color:['#e85e77',"#fbb860","#19a4a2","#60cbf2","#1a7fc5"],
	    	series:[
	    		{
	    			name:need_handle_measureName,
	    			type:"pie",
	    			radius:"80%",
	    			center:["50%","55%"],
	    			data:measure_need_show,
	    			itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
            		}
	    		}
	    	]


		};
		//清除上一个图例
		mycharts.clear();

		mycharts.setOption(option)

	}
	 cake_generate_fun();
	
	// 3、范围图
	function scale_generate_fun(){
		
		var dimensionalityArr = allKeys(needMeasureData).sort();
		var minArr = [];
		var maxArr = [];
		var dimensionality_need_show = [];
		for (var i = 0;i < dimensionalityArr.length;i++) {
			 minArr.push(needMeasureData[dimensionalityArr[i]][need_handle_measureName]["min"]);	
			 maxArr.push(needMeasureData[dimensionalityArr[i]][need_handle_measureName]["max"]);	
			var the_dime = dimensionalityArr[i].replace(/_YZY_$/g,"");
			the_dime = the_dime.split("_equal_")[1];
			dimensionality_need_show.push(the_dime);
		}
		
		var option = {
			title:{
				text:"范围图"
			},
			tooltip:{
				trigger:"axis"
			},
			legend:{
				data:["最大值","最小值"]
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
					name:"最大值",
					type:"line",
					smooth:"true",
					areaStyle:{
						normal:{
							color:"#e85e77",
							opacity:0.5,
						}
					},
					data:maxArr
				},
				{
					name:"最小值",
					type:"line",
					smooth:"true",
					areaStyle:{
						normal:{
							color:"white",
							opacity:1,
						}
					},
					data:minArr
				}
			]
			
		}
		//清除上一个图例
		mycharts.clear();

		mycharts.setOption(option)
	}
	// scale_generate_fun();
	// 4、面积图
	function area_generate_fun (argument) {
		var dimensionalityArr = allKeys(needMeasureData).sort();
		var maxArr = [];
		var dimensionality_need_show = [];
		for (var i = 0;i < dimensionalityArr.length;i++) {
			 maxArr.push(needMeasureData[dimensionalityArr[i]][need_handle_measureName]["max"]);	
			var the_dime = dimensionalityArr[i].replace(/_YZY_$/g,"");
			the_dime = the_dime.split("_equal_")[1];
			dimensionality_need_show.push(the_dime);
		}
		
		var option = {
			title:{
				text:"面积图"
			},
			tooltip:{
				trigger:"axis"
			},
			legend:{
				data:["最大值"]
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
					data:maxArr
				},
			]		
		}
		//清除上一个图例
		mycharts.clear();

		mycharts.setOption(option)
	}
	
	// area_generate_fun();


 function gantt_generate_fun(){
 		var dimensionality_need_show = [];
		var measure_need_show = [];
		var measure_help_show =[];
		
		
		var dimensionalityArr = allKeys(needMeasureData).sort();
		var count_help = 0;
		for (var i = 0;i < dimensionalityArr.length;i++) {
			var value = needMeasureData[dimensionalityArr[i]][need_handle_measureName]["sum"];
			measure_need_show.push(value);
			measure_help_show.push(count_help);
			count_help += value;
			var the_dime = dimensionalityArr[i].replace(/_YZY_$/g,"");
			the_dime = the_dime.split("_equal_")[1];
			dimensionality_need_show.push(the_dime);
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
	                    barBorderColor: '#1a7fc5',
	                    color: "#1a7fc5"
	                },
	            },
				data:measure_need_show
	        },
	    ]

		};
 	//清除上一个图例
		mycharts.clear();

 		mycharts.setOption(option)
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
  	scale_generate_fun();
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
	$("#main").css({
			"display":"block",
	});

	//释放图表实例
	
	var mycharts = echarts.init($("#main").get(0));

	

	
	var all_dimensionality = drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]);
	var all_measure = drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]);
	// 1、折线图
	function polyLine_generate_fun(){
		
		
		if(all_dimensionality.length >= 1 && all_measure.length >= 1) { // 暂时性处理
			for (var i = 0;i < all_measure.length;i++) {
				all_measure[i] = all_measure[i].split(":")[0];
			}
			var needMeasureData = measure_Hanlde(all_measure);
		
			var sort_dimensionality = allKeys(needMeasureData).sort();
			var help = {};
			var dimensionality_arr= []; // 各个维度的数组,绘制图形需要使用
			var dime_name_arr = []; // 跟上面配合，记录对应的维度的名字
			var measure_show_arr = [];
			var measure_name_arr = [];
			for (var i = 0;i < sort_dimensionality.length;i++) {
				var dimensionality_info = sort_dimensionality[i];
				var measure_info = needMeasureData[dimensionality_info]; // 等会处理
				
				for (var m = 0; m < all_measure.length;m++) {
					var real_measure_name = all_measure[m];
					var value = measure_info[real_measure_name]["sum"];
					if(!measure_show_arr[m]){
						measure_show_arr[m] = [];
						measure_name_arr.push(real_measure_name);
					}
					measure_show_arr[m].push(value);
					
				}
				var dime_arr =  dimensionality_info.split("_needseprate_"); // 放有行维度和列维度
				var all_dime = dime_arr[0];
				if (dime_arr[1]) {
					all_dime = dime_arr[0].concat(dime_arr[1]);
				}
				all_dime = all_dime.replace(/_YZY_$/g,"");
				var  all_dime_arr = all_dime.split("_YZY_"); // 几层维度
				object_key_hanlde(help,all_dime_arr,dimensionality_arr,dime_name_arr);		
			}
			
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
       		 	data:[],
    			},
    			 xAxis:[],
    			 yAxis:[
    			 	{
    			 		type:"value"
    			 	},
    			 ],
    			 series:[]
			};
			
			for (var k = dimensionality_arr.length - 1;k >= 0;k--) {
				var obj = {
					name:dime_name_arr[k],
					nameLocation:"start",
					nameGap:25,
					type: 'category',
					boundaryGap:false,
					position:"bottom",
					offset:25*(dimensionality_arr.length - 1 - k),
					axisTick:{
						inside:true,
						interval:function(index,value){return !/^\s/.test(value)}
					},
					axisLabel:{
						interval:function(index,value){return !/^\s/.test(value)}
					},
					data:dimensionality_arr[k]	
				}
				option["xAxis"].push(obj);
				option["yAxis"].push({type:"value",show:false,min:10,max:80});
			}
		
			for (var f = 0; f < measure_show_arr.length;f++) {
           		var measure = measure_show_arr[f];
           		var obj = {name:measure_name_arr[f],type:"line",smooth:true,data:measure}
           		option["series"].push(obj);
           		option["legend"]["data"].push(measure_name_arr[f]);
			}
			
			
			option["tooltip"]["formatter"] = function(params){
				var dimeNames = "";
				var measureNames = "";
				for (var i = 0;i < params.length;i++) {
					if (i == 0) {
						for (var k = 0;k < dimensionality_arr.length;k++){
						dimeNames  +=  "<p style='font-size;12px;height:12px;padding:3px 0 3px 5px'>"+dimensionality_arr[k][params[i].dataIndex] + "<p/>";
						}
					}
					measureNames += "<p style='font-size;12px;height:12px;padding:3px 0 3px 0'><span style=width:12px;height:12px;border-radius:50%;float:left;line-height:12px;background:"+params[i].color + ">"+ "</span>" + "<span style='float:left;margin-left:5px;height:12px;line-height:12px'>"+params[i].seriesName + ":  " +  params[i].value + "</span></p>";
				}
				return dimeNames+measureNames;
			}
			
			//清除上一个图例
			mycharts.clear();
				
			mycharts.setOption(option);	
			
		}
					
	}
//	polyLine_generate_fun();

//2、对比条形图
function comparisonStrip_generate_fun(){
	if(all_dimensionality.length == 1 && all_measure.length == 2) { // 暂时性处理
			for (var i = 0;i < all_measure.length;i++) {
				all_measure[i] = all_measure[i].split(":")[0];
			}
			var needMeasureData = measure_Hanlde(all_measure);
			
			var sort_dimensionality = allKeys(needMeasureData).sort();
			var help = {};
			var dimensionality_arr= []; // 各个维度的数组,绘制图形需要使用
			var dime_name_arr = []; // 跟上面配合，记录对应的维度的名字
			var measure_show_arr = [];
			var measure_name_arr = [];
			for (var i = 0;i < sort_dimensionality.length;i++) {
				var dimensionality_info = sort_dimensionality[i];
				var measure_info = needMeasureData[dimensionality_info]; // 等会处理
				
				for (var m = 0; m < all_measure.length;m++) {
					var real_measure_name = all_measure[m];
					var value = measure_info[real_measure_name]["sum"];
					if(!measure_show_arr[m]){
						measure_show_arr[m] = [];
						measure_name_arr.push(real_measure_name);
					}
					measure_show_arr[m].push(value);
					
				}
				var dime_arr =  dimensionality_info.split("_needseprate_"); // 放有行维度和列维度
				var all_dime = dime_arr[0];
				if (dime_arr[1]) {
					all_dime = dime_arr[0].concat(dime_arr[1]);
				}
				all_dime = all_dime.replace(/_YZY_$/g,"");
				var  all_dime_arr = all_dime.split("_YZY_"); // 几层维度
				object_key_hanlde(help,all_dime_arr,dimensionality_arr,dime_name_arr);		
			}
			
			var option = {
			title: {
				text: "对比条形图"
			},
			legend: {
				data: measure_name_arr,
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
					data: dimensionality_arr[0],
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
					data: dimensionality_arr[0].map(function(value) {
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
					data: dimensionality_arr[0],
				},
		
			],
			series: [{
				name: measure_name_arr[0],
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
				data: measure_show_arr[0],
			}, {
				name: measure_name_arr[1],
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
				data: measure_show_arr[1],
			}],
		};
		//清除上一个图例
		mycharts.clear();

		mycharts.setOption(option);
	}		
}
// comparisonStrip_generate_fun();






 // 3、堆积柱状图 2-3个维度，1个度量
 //	type：number_bar、number_liner、percentage_bar、percentage_liner
 	function stackedBar_generate_fun(bar_type){
 		
 		var  chartTile = {"number_bar":"堆积柱状图","number_liner":"堆积条形图","percentage_bar":"百分比堆积柱","percentage_liner":"百分比堆积条形"}
 		
		if(all_dimensionality.length > 1 && all_measure.length == 1) { // 暂时性处理
			for (var i = 0;i < all_measure.length;i++) {
				all_measure[i] = all_measure[i].split(":")[0];
			}
			var measureName = all_measure[0];
			
			var needMeasureData = measure_Hanlde(all_measure);
			var sort_dimensionality = allKeys(needMeasureData).sort();
			
			var help = {};
			var show_help = {};
			var dimensionality_arr= []; // 各个维度的数组,绘制图形需要使用
			var dime_name_arr = []; // 跟上面配合，记录对应的维度的名字
			var need_show_dimensionality_arr = [];
			var need_show_dime_name_arr = [];
			for (var i = 0;i < sort_dimensionality.length;i++) {
				var dimensionality_info = sort_dimensionality[i];
				var dime_arr =  dimensionality_info.split("_needseprate_"); // 放有行维度和列维度
				var all_dime = dime_arr[0];
				if (dime_arr[1]) {
					all_dime = dime_arr[0].concat(dime_arr[1]);
				}
				all_dime = all_dime.replace(/_YZY_$/g,"");
				var all_dime_arr = all_dime.split("_YZY_"); // 几层维度
				object_key_hanlde(help,all_dime_arr,dimensionality_arr,dime_name_arr);	
				// 为了显示坐标轴
				 all_dime_arr.pop();
				object_key_hanlde(show_help,all_dime_arr,need_show_dimensionality_arr,need_show_dime_name_arr);
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
			
			//1、确定多少行数据
			var confir_max_obj = {};
			var max = 1;
			var groupArr = [];
			var measure_Data_arr = [];
			
			for (var i = 0; i < dimensionality_arr[dimensionality_arr.length - 1].length;i++) {
				var dime = dimensionality_arr[dimensionality_arr.length - 2][i];
				var nowdime = dimensionality_arr[dimensionality_arr.length - 1][i].replace(/^\s/,"");
				if(i > 0){	
					var predime = dimensionality_arr[dimensionality_arr.length - 1][i-1].replace(/^\s/,"");
				}
				var name = dime.replace(/^\s/,"");
				if (!confir_max_obj[name]) {
					confir_max_obj[name] = 1;
					groupArr.push([nowdime]);
					measure_Data_arr.push([needMeasureData[sort_dimensionality[i]][measureName]["sum"]]);
				}else{
					if(i>0){
						if (predime != nowdime) {
							confir_max_obj[name] ++;
							groupArr[groupArr.length - 1].push(nowdime)
							measure_Data_arr[measure_Data_arr.length - 1].push(needMeasureData[sort_dimensionality[i]][measureName]["sum"]);
							max = max > confir_max_obj[name] ? max:confir_max_obj[name];
						}
					}
					
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
		}
 			
 	}
	stackedBar_generate_fun("number_bar");



	function reliationTree_generate_fun(){
		
		if(!(all_dimensionality.length > 1 && all_measure.length == 1)) { // 暂时性处理
			return;
		}
		for (var i = 0;i < all_measure.length;i++) {
				all_measure[i] = all_measure[i].split(":")[0];
		}
		var needMeasureData = measure_Hanlde(all_measure);
		var sort_dimensionality = allKeys(needMeasureData).sort();
		var need_all_nodes = {}; // 所需要的所有节点
		var need_all_link = [];
		var categorys = [];
	
		for (var i = 0;i < sort_dimensionality.length;i++) {
			var dimensionality_info = sort_dimensionality[i];
			var measure_info = needMeasureData[dimensionality_info]; // 等会处理	
			var value = measure_info[all_measure[0]]["sum"];
			var dime_arr =  dimensionality_info.split("_needseprate_"); // 放有行维度和列维度
			var all_dime = dime_arr[0];
			if (dime_arr[1]) {
				all_dime = dime_arr[0].concat(dime_arr[1]);
			}
			all_dime = all_dime.replace(/_YZY_$/g,"");
			var  all_dime_arr = all_dime.split("_YZY_"); // 几层维度
			var index = categorys.hasObject("name",all_dime_arr[0].split("_equal_")[1]);
			if(index == -1){
				categorys.push({"name":all_dime_arr[0].split("_equal_")[1]});
			}	
	
			var str = "";
			for(var j = 0;j < all_dime_arr.length;j++){
				str += "_YZY_" + all_dime_arr[j];
				if(j == 0){
					str=str.replace(/^_YZY_/g,"");
				}
				if(j < all_dime_arr.length - 1){
					var obj = {
						"source":str,
						"target":str + "_YZY_" + all_dime_arr[j + 1],
						"tooltip":{
							formatter:function(params){
								console.log(params);
							}
						}
					}
					need_all_link.push(obj);
				}
				if(need_all_nodes[str]){
					need_all_nodes[str]["value"] += value;
				}else{
					need_all_nodes[str] = {
						"value":value,
						"name":str,
						"draggable":true,
						"category":categorys.hasObject("name",all_dime_arr[0].split("_equal_")[1]),
						"fixed":false,
						"symbolSize":[50,20],
						label:{normal:{show:true,formatter:function(params){
							var names = params["name"].split("_YZY_");
							return names[names.length - 1].split("_equal_")[1];
						}}},
					}
				}
			}
		}	
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
					data:allValues(need_all_nodes),
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
	// reliationTree_generate_fun();

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



