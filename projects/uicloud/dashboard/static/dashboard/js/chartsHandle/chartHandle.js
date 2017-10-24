var dirllConditions = [];
var currentChatType = "none";
var radarDiemension = "none";
// 一个维度一个度量处理函数
// chart_type_need:waterWall,cake
function one_de_one_me_handle (chart_type_need) {
	$("#main").css({
			"display":"block"
	});
	var mycharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
	if(!mycharts){
	mycharts = 	echarts.init($("#main").get(0));
	}
	
	mycharts.off("click");
	mycharts.on("click",function(params){
		chartAPartDidClickedFunction(params);
	});
 	var need_handle_measureName = specialRemoveDataTypeHandle(drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]))[0];
 	var need_handle_dimensionalityName = specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]))[0];
 	
 	if(currentChatType == chart_type_need && dirllConditions && dirllConditions.length > 0){
		need_handle_dimensionalityName = dirllConditions[dirllConditions.length - 1].drillField;
	}else if(currentChatType != chart_type_need && dirllConditions && dirllConditions.length > 0){
		dirllConditions = [];
	}
	if(currentChatType != chart_type_need){
		if(echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0))){
			echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0)).clear();
		}
	}
 	
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
				measure_need_show.push({"value":value / allValueUnitDict[valueUnitValue],"originValue":value,"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]}});
				measure_help_show.push({"value":count_help / allValueUnitDict[valueUnitValue],"originValue":count_help});
				count_help += value;
			}
			dimensionality_need_show.push("全部");
			measure_need_show.push({"value":count_help / allValueUnitDict[valueUnitValue],"originValue":count_help,"dirllInfo":{"currentField":"全部","currentValue":"全部"}});
			measure_help_show.push({"value":0,"originValue":0});
			var option = {
				title: [{
						text: '瀑布图',
						show:false,
				},
				{
					  	text: "单位: "+valueUnitValue,
					  	show:true,
					  	bottom:70,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName][0]
					  	}
					  }
				],
			    legend:{
			   	 	data:[drag_measureCalculateStyle[need_handle_measureName]],
			   	 	left:"center",
			   	 	bottom:0,
			    },
			    color:allColorsDict[currentColorGroupName],
			 	tooltip : {
			     trigger: 'axis',
			     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			         type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
			     },
			     formatter: function (params) {			     	
			         var tar;
			         if (params[1].value != '-') {
			             tar = params[1];
			         }
			         else {
			             tar = params[0];
			         }
			         var dimeNames = "<p style='font-size:12px;height:12px;padding:3px 0 3px 2px'>" + tar.name + "</p>";
			         var needValue = tar.value;
			         if(normalUnitValue != -1){
			         	needValue = needValue.toFixed(normalUnitValue);
			         }
			         var measureNames = "<p style='font-size:10px;height:12px;padding:3px 0 3px 0;margin-top:6px'><span style=width:8px;height:8px;border-radius:50%;float:left;margin-top:2./spx;line-height:12px;background:"+tar.color + ">"+ "</span>" + "<span style='float:left;margin-left:5px;height:12px;line-height:12px'>" +tar.seriesName+":  " + needValue+"</span></p>";
			         return dimeNames + measureNames;
			     }
			 	},
			    grid: {
			        containLabel: true
			    },
			    toolbox: {
			        show: true,
			        feature: {
			            dataView: {readOnly: true},
			            restore: {},
			            saveAsImage: {
			            	title:"保存为png"
			            }
			        },
			        orient:"vertical",
			        right:20,
			        top:"middle",
			        itemSize:20,
			        itemGap:30
   				},
   				
			    xAxis: {
			        type : 'category',
			        splitLine: {show:false},
					data:dimensionality_need_show,
					axisLabel:{
						rotate:15,
						fontSize:10,
						interval:0,
						color:"black"
					},
			    },
			    dataZoom:[
			    			{
			    			type: 'slider',
           			 	show: dimensionality_need_show.length > 15,
           			 	filterMode:"filter",
           			 	backgroundColor:"#dedede",
           			 	fillerColor:"#ff7e00",
           			 	showDataShadow:false,
			            xAxisIndex: [0],
			            height:8,
			            handleStyle:{
			            		color:"#ff7e00"	
			            },
			            startValue:0,
			            endValue:15,
			    			},
			    			{
			    			type: 'slider',
           			 	show: false,
           			 	filterMode:"empty",
			            yAxisIndex: [0],
			    			}
			    ],
			    yAxis: {
			        type : 'value'
			    },
			    series: [
			        {
			            name: 'help',
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
			            name: drag_measureCalculateStyle[need_handle_measureName],
			            type: 'bar',
			            stack: '总量',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'top',
			                    formatter:function(params){
			                    		if(normalUnitValue != -1){
			                    			return params.value.toFixed(normalUnitValue);
			                    		}
			                    		return params.value;
			                    }
			                }
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
				measure_need_show.push({"name":aData[need_handle_dimensionalityName],"value":aData[drag_measureCalculateStyle[need_handle_measureName]] / allValueUnitDict[valueUnitValue],"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]},"originValue":aData[drag_measureCalculateStyle[need_handle_measureName]]});
			}
				var option = {
					title: [{
						text: '饼图',
						show:false,
					},
					  {
					  	text: "单位: "+valueUnitValue,
					  	bottom:70,
					  	show:true,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName][0]
					  	}
					  }
					],
					tooltip: {
						trigger: 'item',
						formatter:function (params){
						  var dimeNames = "<p style='font-size:12px;height:12px;padding:3px 0 3px 2px'>" + params.name + "</p>";
						  var needValue = params.value;
						  if(normalUnitValue != -1){
						  	 needValue = needValue.toFixed(normalUnitValue);
						  }
			       		  var measureNames = "<p style='font-size:10px;height:12px;padding:3px 0 3px 0;margin-top:6px'><span style=width:8px;height:8px;border-radius:50%;float:left;margin-top:2./spx;line-height:12px;background:"+params.color + ">"+ "</span>" + "<span style='float:left;margin-left:5px;height:12px;line-height:12px'>" +params.seriesName+":  " + needValue +"</span></p>";
			       		  var percentInfo = "<p style='font-size:10px;height:12px;padding:3px 0 3px 0;margin-top:6px'>占比:   "+params.percent+"%</p>";
			        		 return dimeNames + measureNames+percentInfo;
						}
					},
					toolbox: {
				        show: true,
				        feature: {
				            dataView: {readOnly: true},
				            restore: {},
				            saveAsImage: {
				            	title:"保存为png"
				            }
				        },
				        orient:"vertical",
				        right:20,
				        top:"middle",
				        itemSize:20,
				        itemGap:30
   					},
   					
					legend: {
						type: 'scroll',
						left: 'center',
						bottom:0,
						data: dimensionality_need_show
					},
					color:allColorsDict[currentColorGroupName],
					series: [{
						name: drag_measureCalculateStyle[need_handle_measureName],
						type: "pie",
						radius: "65%",
						center: ["50%", "50%"],
						data: measure_need_show,
						label: {
			                normal: {
			                    show: true,
			                    formatter:function(params){
			                    		if(normalUnitValue != -1){
			                    			return params.name+":"+params.value.toFixed(normalUnitValue);
			                    		}else{
			                    			return params.name+":"+params.value;
			                    		}
			                    },
			                }
			            },
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
		
				mycharts.setOption(option);
				
		});
	
	}
	
	// 4、面积图
	function area_generate_fun (argument) {

		measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,function(data){
			var dimensionality_need_show = [];
			var  measure_need_show = [];
			for(var i = 0;i < data.length;i++){
				var aData = data[i];
				dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
				measure_need_show.push({"value":aData[drag_measureCalculateStyle[need_handle_measureName]] / allValueUnitDict[valueUnitValue],"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]},"originValue":aData[drag_measureCalculateStyle[need_handle_measureName]]});
			}
			var option = {
				title:[{
					text:"面积图",
					show:false
				},
				{
					  	text: "单位: "+valueUnitValue,
					  	bottom:70,
					  	show:true,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName][0]
					  	}
					  }
				],
				tooltip:{
					trigger:"axis",
					formatter:function(params){
						 var dimeNames = "<p style='font-size:12px;height:12px;padding:3px 0 3px 2px'>" + params[0].name + "</p>";
						  var needValue = params[0].value;
						  if(normalUnitValue != -1){
						  	 needValue = needValue.toFixed(normalUnitValue);
						  }
			       		  var measureNames = "<p style='font-size:10px;height:12px;padding:3px 0 3px 0;margin-top:6px'><span style=width:8px;height:8px;border-radius:50%;float:left;margin-top:2./spx;line-height:12px;background:"+params[0].color + ">"+ "</span>" + "<span style='float:left;margin-left:5px;height:12px;line-height:12px'>" +params[0].seriesName+":  " + needValue +"</span></p>";
			        		 return dimeNames + measureNames;
					}
				},
				color:allColorsDict[currentColorGroupName],
				legend:{
					data:[drag_measureCalculateStyle[need_handle_measureName]],
					left: 'center',
					bottom:0,
				},
				toolbox: {
			        show: true,
			        feature: {
			            dataView: {readOnly: true},
			            restore: {},
			            saveAsImage: {
			            	title:"保存为png"
			            }
			        },
			        orient:"vertical",
			        right:20,
			        top:"middle",
			        itemSize:20,
			        itemGap:30
				},
				 grid: {
			        containLabel: true
			    },
				xAxis:[
					{
						type:"category",
						boundaryGap:false,
						data:dimensionality_need_show,
						axisLabel:{
							rotate:-15,
							fontSize:10,
							interval:0,
							color:"black"
					},
					}
				],
				 dataZoom:[
			    			{
			    			type: 'slider',
           			 	show: dimensionality_need_show.length > 15,
           			 	filterMode:"filter",
           			 	backgroundColor:"#dedede",
           			 	fillerColor:"#ff7e00",
           			 	showDataShadow:false,
			            xAxisIndex: [0],
			            height:8,
			            handleStyle:{
			            		color:"#ff7e00"	
			            },
			            startValue:0,
			            endValue:15,
			    			},
			    			{
			    			type: 'slider',
           			 	show: false,
           			 	filterMode:"empty",
			            yAxisIndex: [0],
			    			}
			    ],
				yAxis:[
					{
						type:"value"
					}
				],
				series:[
					{
						name:drag_measureCalculateStyle[need_handle_measureName],
						type:"line",
						smooth:"true",
						areaStyle:{
							normal:{
								opacity:0.5,
							}
						},
						label:{
							normal:{
								show:true,
								position:"top",
								formatter:function(params){
			                    		if(normalUnitValue != -1){
			                    			return params.value.toFixed(normalUnitValue);
			                    		}else{
			                    			return params.value;
			                    		}
			                   },
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
					measure_need_show.push({"value":value / allValueUnitDict[valueUnitValue],"originValue":value,"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]}});
					measure_help_show.push({"value":count_help/allValueUnitDict[valueUnitValue],"originValue":count_help});
					count_help += value;
				}
				measure_help_show.unshift({"value":0,"originValue":0});
				measure_need_show.unshift({"value":count_help/allValueUnitDict[valueUnitValue],"originValue":count_help,"dirllInfo":{"currentField":"全部","currentValue":"全部"}});
				dimensionality_need_show.unshift("全部");
				var option = {
				    title: [{
				        text: '甘特图',
				        show:false
				    },
				    	{
					  	text: "单位: "+valueUnitValue,
					  	bottom:70,
					  	show:true,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName][0]
					  	}
					  }
				    ],
				    legend:{
				    		data:[drag_measureCalculateStyle[need_handle_measureName]],
				    		left:"center",
				    		bottom:0
				    },
				    color:allColorsDict[currentColorGroupName],
					toolbox: {
				        show: true,
				        feature: {
				            dataView: {readOnly: true},
				            restore: {},
				            saveAsImage: {
				            	title:"保存为png"
				            }
				        },
				        orient:"vertical",
				        right:20,
				        top:"middle",
				        itemSize:20,
				        itemGap:30
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
			         var needValue = tar.value;
					 if(normalUnitValue != -1){
						 needValue = needValue.toFixed(normalUnitValue);
					}
			         var dimeNames = "<p style='font-size:12px;height:12px;padding:3px 0 3px 2px'>" + tar.name + "</p>";
			         var measureNames = "<p style='font-size:10px;height:12px;padding:3px 0 3px 0;margin-top:6px'><span style=width:8px;height:8px;border-radius:50%;float:left;margin-top:2./spx;line-height:12px;background:"+tar.color + ">"+ "</span>" + "<span style='float:left;margin-left:5px;height:12px;line-height:12px'>" +tar.seriesName+":  " +needValue +"</span></p>";
			         return dimeNames + measureNames;
			    		 }
				 	},
				    xAxis: {
				     	 type : 'value',
				     	 name:need_handle_measureName,
						nameGap:10,
						nameLocation:"end",
				    },
				    yAxis: {
				        type : 'category',
				        splitLine: {show:false},
						data:dimensionality_need_show,
						axisLabel:{
							fontSize:10,
							interval:0,
							color:"black"
						},
						name:need_handle_dimensionalityName,
						nameGap:10,
						nameLocation:"end",
				    },
				    grid: {
			      		  containLabel: true
			  		  },
				      dataZoom:[
			    			{
				    			type: 'slider',
	           			 	show: dimensionality_need_show.length > 15,
	           			 	filterMode:"filter",
	           			 	backgroundColor:"#dedede",
	           			 	fillerColor:"#ff7e00",
	           			 	showDataShadow:false,
				            yAxisIndex: [0],
				            height:8,
				            handleStyle:{
				            		color:"#ff7e00"	
				            },
				            startValue:0,
				            endValue:15,
				            orient:"horizontal",
				            bottom:35
			    			},
			    			{
			    			type: 'slider',
           			 	show: false,
           			 	filterMode:"empty",
			            xAxisIndex: [0],
			    			}
			   	 ],
				    series: [
				        {
				            name: 'help',
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
				            name: [drag_measureCalculateStyle[need_handle_measureName]],
				            type: 'bar',
				            stack: '总量',
				            label: {
				                normal: {
				                    show: true,
				                    position: 'right',
				                    formatter:function(params){
				                    		if(normalUnitValue != -1){
				                    			return params.value.toFixed(normalUnitValue);
				                    		}else{
				                    			return params.value;
				                    		}
			                  		 },
				                }
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
// 记录当前图形的类型
currentChatType = chart_type_need;

}




// end------------------
// 多个维度多个度量
function many_de_many_me_handle(chart_type_need){
	$("#main").css({
			"display":"block",
	});

	//释放图表实例
	
	var mycharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
	if(!mycharts){
		mycharts = 	echarts.init($("#main").get(0));
	}
	mycharts.off("click");
	mycharts.on("click",function(params){
		
		if(currentChatType == "radarChart"){
			if(params.componentType == "radar"){
				chartAPartDidClickedFunction(params);
			}
		}else if(currentChatType == "reliationTree"){
			if(params.dataType == "node"){
				chartAPartDidClickedFunction(params);
			}
		}else{
			chartAPartDidClickedFunction(params);
		}
	});
	
	var all_dimensionality = specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]));
	var all_measure = specialRemoveDataTypeHandle(drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]));
	
	var commonLegend = [];
	for (var k = 0;k <  all_measure.length;k++) {
		commonLegend.push(drag_measureCalculateStyle[all_measure[k]])
	}
	
	if(currentChatType == chart_type_need && dirllConditions && dirllConditions.length > 0){
		
		all_dimensionality.splice(all_dimensionality.length-1,1,dirllConditions[dirllConditions.length - 1].drillField);
		
	}else if(currentChatType != chart_type_need && dirllConditions && dirllConditions.length > 0){
		dirllConditions = [];
		
	}
	
	if(currentChatType != chart_type_need){
		if(echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0))){
			echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0)).clear();
		}
	}
	
	
	var last_dimensionaity = all_dimensionality[all_dimensionality.length - 1];
	
	// 1、折线图
	function polyLine_generate_fun(){
			measure_Hanlde(all_dimensionality,all_measure,null,function(data){
				
				var option = {
					title:[{
					text:"折线图",
					show:false
					},
					{
					  	text: "单位: "+valueUnitValue,
					  	bottom:70,
					  	show:true,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName][0]
					  	}
					  }
					],
					tooltip: {
	       			trigger: 'axis',
	        			axisPointer: {
	            			type: 'cross',
	       			},
	       			textStyle:{
	       				fontSize:12
	       			},
	       			formatter:function(params){
	       				var sumMeasure = "";
	       				var dimeNames = "<p style='font-size:12px;height:12px;padding:3px 0 3px 2px'>" + params[0].name + "</p>";
	       					for(var i = 0;i < params.length;i++){
	       						var needValue = params[i].value;
	       						if(normalUnitValue != -1){
						  	 		needValue = needValue.toFixed(normalUnitValue);
						 		 }
	       						var measureNames = "<p style='font-size:10px;height:12px;padding:3px 0 3px 0;margin-top:6px'><span style=width:8px;height:8px;border-radius:50%;float:left;margin-top:2./spx;line-height:12px;background:"+params[i].color + ">"+ "</span>" + "<span style='float:left;margin-left:5px;height:12px;line-height:12px'>" +params[i].seriesName+":  " + needValue+"</span></p>";
	       						sumMeasure += measureNames;
	       					}
			        			 return dimeNames + sumMeasure;
					}
	    			 }, 	
	    			legend: {
	       		 	data:commonLegend,
	       		 	left:"center",
	       		 	bottom:0
	    			},
	    			 grid: {
			        containLabel: true
			    },
			    color:allColorsDict[currentColorGroupName],
			    
				toolbox: {
			        show: true,
			        feature: {
			            dataView: {readOnly: true},
			            restore: {},
			            saveAsImage: {
			            	title:"保存为png"
			            }
			        },
			        orient:"vertical",
			        right:20,
			        top:"middle",
			        itemSize:20,
			        itemGap:30
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
							measure_show_data_arr[measure_i] = [{"value":aData[drag_measureCalculateStyle[aMeasure]]/allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[aMeasure]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]}}];
						}else{
							measure_show_data_arr[measure_i].push({"value":aData[drag_measureCalculateStyle[aMeasure]]/allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[aMeasure]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]}});
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
				var dataZoomXindexArray = [];
				for(var i = dimensionality_show_data_arr.length - 1;i >= 0;i--){
						var obj = {
						name:all_dimensionality[i],
						nameLocation:"start",
						nameGap:25,
						type: 'category',
						boundaryGap:false,
						position:"bottom",
						offset:25*(dimensionality_show_data_arr.length - 1 - i),
						data:dimensionality_show_data_arr[i]	,
						axisLabel:{
							rotate:-15,
							fontSize:10,
							interval:0,
							color:"black"
						},
					}
					option["xAxis"].push(obj);
					option["yAxis"].push({type:"value",show:false,min:10,max:80});
					dataZoomXindexArray.push(i);
				}
				for(var i = 0; i < measure_show_data_arr.length;i++){
					var measure = measure_show_data_arr[i];
           			var obj = {name:drag_measureCalculateStyle[all_measure[i]],type:"line",smooth:true,data:measure,label:{
           				normal:{
           					show:true,
           					position:"top",
           					offset:[10,0],
           					formatter:function(params){
		                    		if(normalUnitValue != -1){
		                    			return params.value.toFixed(normalUnitValue);
		                    		}else{
		                    			return params.value;
		                    		}
			                },
           				}
           				
           			}}
           			option["series"].push(obj);
				}
				
				option["dataZoom"] = [
					{
			    			type: 'slider',
           			 	show: dimensionality_show_data_arr[dimensionality_show_data_arr.length - 1].length > 15,
           			 	filterMode:"filter",
           			 	backgroundColor:"#dedede",
           			 	fillerColor:"#ff7e00",
           			 	showDataShadow:false,
			            xAxisIndex: dataZoomXindexArray,
			            height:8,
			            handleStyle:{
			            		color:"#ff7e00"	
			            },
			            startValue:0,
			            endValue:15,
			    			},
			    			{
			    			type: 'slider',
           			 	show: false,
           			 	filterMode:"empty",
			            yAxisIndex: [0],
			    			}
				]
				
				
				
				//清除上一个图例
				mycharts.clear();
				
				mycharts.setOption(option);	
			});
					
	}

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
							measure_show_data[j] = [{"value":aData[drag_measureCalculateStyle[aMeasure]] / allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[aMeasure]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]}}];
						}else{
							measure_show_data[j].push({"value":aData[drag_measureCalculateStyle[aMeasure]] / allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[aMeasure]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]}});
						}
					}
				}
				var option = {
					title: [{
						text: "对比条形图",
						show:false
					},
					{
					  	text: "单位: "+valueUnitValue,
					  	bottom:70,
					  	show:true,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName][0]
					  	}
					  }
					],
					legend: {
						data: commonLegend,
						left:"center",
						bottom:0,
						textStyle: {
							color: '#00000',
						},
					},
					color:allColorsDict[currentColorGroupName],
					toolbox: {
				        show: true,
				        feature: {
				            dataView: {readOnly: true},
				            restore: {},
				            saveAsImage: {
				            	title:"保存为png"
				            }
				        },
				        orient:"vertical",
				        right:20,
				        top:"middle",
				        itemSize:20,
				        itemGap:30
   					},
					tooltip: {
						show: true,
						trigger: 'item',
						formatter:function(params){
							var dimeNames = "<p style='font-size:12px;height:12px;padding:3px 0 3px 2px'>" + params.name + "</p>";
							var needValue = params.value;
							  if(normalUnitValue != -1){
							  	 needValue = needValue.toFixed(normalUnitValue);
							  }
			       		  	var measureNames = "<p style='font-size:10px;height:12px;padding:3px 0 3px 0;margin-top:6px'><span style=width:8px;height:8px;border-radius:50%;float:left;margin-top:2./spx;line-height:12px;background:"+params.color + ">"+ "</span>" + "<span style='float:left;margin-left:5px;height:12px;line-height:12px'>" +params.seriesName+":  " + needValue+"</span></p>";
			        			 return dimeNames + measureNames;
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
					dataZoom:[
					{
			    			type: 'slider',
           			 	show: dimensionality_show_data.length > 15,
           			 	filterMode:"filter",
           			 	backgroundColor:"#dedede",
           			 	fillerColor:"#ff7e00",
           			 	showDataShadow:false,
			            yAxisIndex: [0,1,2],
			            height:8,
			            handleStyle:{
			            		color:"#ff7e00"	
			            },
			            startValue:0,
			            endValue:15,
			            orient:"horizontal",
				        bottom:35,
				        left:"4%",
				        right:"4%",
			    			},
			    			{
			    			type: 'slider',
           			 	show: false,
           			 	filterMode:"empty",
			            xAxisIndex: [0,1,2],
			    			}
			    		],
					series: [{
						name: drag_measureCalculateStyle[all_measure[0]],
						type: 'bar',
						xAxisIndex: 0,
						yAxisIndex: 0,
						barGap: 20,
						label: {
							normal: {
								show: true,
								position:"left",
								formatter:function(params){
			                    		if(normalUnitValue != -1){
			                    			return params.value.toFixed(normalUnitValue);
			                    		}else{
			                    			return params.value;
			                    		}
			                   },
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
						data: measure_show_data[0],
					}, {
						name: drag_measureCalculateStyle[all_measure[1]],
						type: 'bar',
						barGap: 20,
						xAxisIndex: 2,
						yAxisIndex: 2,
						label: {
							normal: {
								show: true,
								position:"right",
								formatter:function(params){
			                    		if(normalUnitValue != -1){
			                    			return params.value.toFixed(normalUnitValue);
			                    		}else{
			                    			return params.value;
			                    		}
			                   },
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
				var valueMax = 0;
				for(var i =0; i <  data.length;i++){
					var aData = data[i];
					for(var j = 0;j < all_dimensionality.length - 1;j++){				
						if(!need_show_dimensionality_arr[j]){
							need_show_dimensionality_arr[j] = [{"value":aData[all_dimensionality[j]],"count":1}];
						}else{
							var index = need_show_dimensionality_arr[j].hasObject("value",aData[all_dimensionality[j]]);
							if( index== -1){
								need_show_dimensionality_arr[j].push({"value":aData[all_dimensionality[j]],"count":1});
							}else{
								if(j < all_dimensionality.length - 2){
									if(need_show_dimensionality_arr[j+1].hasObject("value",aData[all_dimensionality[j+1]]) == -1){
										need_show_dimensionality_arr[j].push(({"value":" ","count":1}));
									}
								}
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
					title:[{
						text:chartTile[bar_type],
						show:false
					},
						{
					  	text: "单位: "+valueUnitValue,
					  	bottom:70,
					  	show:true,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName][0]
					  	}
					  }
					],
					legend:{
						data:[drag_measureCalculateStyle[measureName]],
						left:'center',
						bottom:0
					},
					 grid: [],
					toolbox: {
				        show: true,
				        feature: {
				            dataView: {readOnly: true},
				            restore: {},
				            saveAsImage: {
				            	title:"保存为png"
				            }
				        },
				        orient:"vertical",
				        right:20,
				        top:"middle",
				        itemSize:20,
				        itemGap:30
   					},
   					color:allColorsDict[currentColorGroupName],
					tooltip : {
	        				trigger: 'item',
	        				formatter:function(params){
	        					
	        					var dimeNames = "<p style='font-size:12px;height:12px;padding:3px 0 3px 2px'>" +  params["data"]["name"] + "</p>";
	        					var val = params.value;
	        					if (bar_type == "percentage_liner" || bar_type == "percentage_bar") {
	        						val = (Number(val) * 100).toFixed(2) + "%";
	        						
	        					}else{
	        						if(normalUnitValue != -1){
						  	 		val = val.toFixed(normalUnitValue);
						 		 }
	        					}
			       		  	var measureNames = "<p style='font-size:10px;height:12px;padding:3px 0 3px 0;margin-top:6px'><span style=width:8px;height:8px;border-radius:50%;float:left;margin-top:2./spx;line-height:12px;background:"+params.color + ">"+ "</span>" + "<span style='float:left;margin-left:5px;height:12px;line-height:12px'>" +params.seriesName+":  " + val+"</span></p>";
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
			var axisLabelSetteing = 	{type:"value",gridIndex:0,name:drag_measureCalculateStyle[measureName],nameLocation:"end",nameGap:10};
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
			
				// 造多少行数据(几个去堆叠)
			for (var i = 0;i < max;i++) {
				var name;
				var stack;
				var data = [];
				var helpSum = 0;
				name = drag_measureCalculateStyle[measureName];
				stack = "use";
				for (var j =0;j < groupArr.length;j++) {
						var val = measure_Data_arr[j][i]
						if (bar_type == "percentage_liner" || bar_type == "percentage_bar") {
							val = (val / eval(measure_Data_arr[j].join("+"))).toFixed(4);
						}else{
							if(valueMax < eval(measure_Data_arr[j].join("+"))){
								valueMax = eval(measure_Data_arr[j].join("+"));
							}
						}
						data.push({value:val / allValueUnitDict[valueUnitValue],"originValue":val,name:groupArr[j][i],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":groupArr[j][i]}});
				}
				
				var obj = {
					name:name,
					type:"bar",
					stack:stack,
					xAxisIndex:0,
					yAxisIndex:0,
					itemStyle:{
						normal:{
							color:allColorsDict[currentColorGroupName][i % allColorsDict[currentColorGroupName].length]
						}
					},
					label:{
						normal:{
							show:true,
							position:"insideRight",
							formatter:function(params){
			                    		if(normalUnitValue != -1){
			                    			return params.value.toFixed(normalUnitValue);
			                    		}else{
			                    			return params.value;
			                    		}
			                 },
						}
					},
					data:data,
					z:3
				}
				option["series"].push(obj);
			}
			
//  坐标轴设置值
			for (var k = need_show_dimensionality_arr.length - 1;k >= 0;k--){
				var obj = {
					name:need_show_dime_name_arr[k],
					nameLocation:"start",
					nameGap:25,
					nameRotate:-25,
					type: 'category',
					axisTick:{
						inside:false,
						interval:function(index,value){return !/^\s/.test(value)}
					},
					axisLabel:{
						color:"black",
						rotate:15,
						fontSize:10,
						interval:function(index,value){return !/^\s/.test(value)}
					},
					data:need_show_dimensionality_arr[k],
					gridIndex:need_show_dimensionality_arr.length - 1 - k,
				}
				
				var aGrid = {
					show:false,
					containLabel:true,
				}		
				
				if (bar_type == "number_bar" || bar_type == "percentage_bar") {
					obj["position"] = "bottom";
					option["xAxis"].push(obj);
					if(k > 0){
						var valueHelpAxis = {type:"value",show:false,min:0,gridIndex:need_show_dimensionality_arr.length  - k};
						if(bar_type == "percentage_bar"){
							valueMax = 1;
								valueHelpAxis["axisLabel"] = {"formatter":function(value,index){
									if (value > 0) {
											return (value * 100) + "%";
										}else{
											return 0;
										}
										
									}}
						}
						valueHelpAxis["max"] = valueMax;
						option["yAxis"].push(valueHelpAxis);
						
						
						var aSeriesData = {
							name:"help",
							type:"bar",
							xAxisIndex:k,
							yAxisIndex:k,
//							"barCategoryGap":5,
							"data":[{"value":valueMax / allValueUnitDict[valueUnitValue],"originValue":valueMax}],
							itemStyle:{
								normal:{
									opacity:0
								}
							},
							cursor:"default"
						}
						option["series"].push(aSeriesData);
						
					}
					aGrid["left"] = "10%";
					aGrid["bottom"] = 60 + 20*k;
					
					
				}else{
					obj["position"] = "left";
					option["yAxis"].push(obj);
					if(k > 0){
						var valueHelpAxis = {type:"value",show:false,min:0,gridIndex:need_show_dimensionality_arr.length  - k};
						if(bar_type == "percentage_bar"){
							valueMax = 1;
								valueHelpAxis["axisLabel"] = {"formatter":function(value,index){
									if (value > 0) {
											return (value * 100) + "%";
										}else{
											return 0;
										}
										
									}}
						}
						valueHelpAxis["max"] = valueMax;
						option["xAxis"].push(valueHelpAxis);
						var aSeriesData = {
							name:"help",
							type:"bar",
							xAxisIndex:k,
							yAxisIndex:k,
							"barCategoryGap":5,
							"data":[{"value":valueMax / allValueUnitDict[valueUnitValue],"originValue":valueMax}],
							itemStyle:{
								normal:{
									opacity:0
								}
							},
							cursor:"default"
						}
						option["series"].push(aSeriesData);
					}	
					aGrid["containLabel"] = false;
					aGrid["left"] =  150 + 50*k;
					aGrid["bottom"] = 60;
					
				}
				if(k != need_show_dimensionality_arr.length - 1){
					aGrid["tooltip"] = {show:false}
				}
				option["grid"].push(aGrid);
			}
			
				var dataZoomXindexArray = [];
				var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
				for(var k = 0; k < dimension_length -1;k++){
					dataZoomXindexArray.push(k);
				}
			if (bar_type == "number_bar" || bar_type == "percentage_bar"){
				
				option["dataZoom"] = [
					{
			    			type: 'slider',
           			 	show: need_show_dimensionality_arr[need_show_dimensionality_arr.length - 1].length >15,
           			 	filterMode:"filter",
           			 	backgroundColor:"#dedede",
           			 	fillerColor:"#ff7e00",
           			 	showDataShadow:false,
			            xAxisIndex: dataZoomXindexArray,
			            height:8,
			            handleStyle:{
			            		color:"#ff7e00"	
			            },
			            startValue:0,
			            endValue:15,
			    			},
			    			{
			    			type: 'slider',
           			 	show: false,
           			 	filterMode:"empty",
			            yAxisIndex: dataZoomXindexArray,
			    			}
				]
			}else{
				option["dataZoom"] = [
					{
			    			type: 'slider',
           			 	show: need_show_dimensionality_arr[need_show_dimensionality_arr.length - 1].length >15,
           			 	filterMode:"filter",
           			 	backgroundColor:"#dedede",
           			 	fillerColor:"#ff7e00",
           			 	showDataShadow:false,
			            yAxisIndex: dataZoomXindexArray,
			            height:8,
			            handleStyle:{
			            		color:"#ff7e00"	
			            },
			            startValue:0,
			            endValue:15,
			            orient:"horizontal",
				        bottom:25
			            
			    			},
			    			{
			    			type: 'slider',
           			 	show: false,
           			 	filterMode:"empty",
			            xAxisIndex: dataZoomXindexArray,
			    			}
				]
			}
			
				//清除上一个图例
				mycharts.clear();		
				mycharts.setOption(option);	
				
			});
			
 			
 }


// 关系图
	function reliationTree_generate_fun(){
		
		var categorys = [];// 分类，主要用作图例
		var need_all_nodes = []; // 所需要的所有节点
		var need_all_link = [];
		var count = 0;
		for(var i =0;i < all_dimensionality.length;i++){
			(function(index){
				var need_dimensionality = all_dimensionality.slice(0,index+1);
				measure_Hanlde(need_dimensionality,all_measure,null,function(data){
					for(var j = 0;j < data.length;j++){
						var aData = data[j];
						var name = "";
						for(var k =0;k < need_dimensionality.length;k++){
							name += aData[need_dimensionality[k]] +"_YZYPD_"; 
						}
						if(categorys.hasObject("name",aData[need_dimensionality[0]]) == -1){
							categorys.push({"name":aData[need_dimensionality[0]]});
						}
						if(index == all_dimensionality.length - 1){
							
							for(var m = 1;m < all_dimensionality.length;m++){
								var source = "";
								var target = "";
								for(var n = 0; n < m;n++){
									source+= aData[all_dimensionality[n]] +"_YZYPD_"; 
								}
								
								for(var n = 0;n <= m;n++){
									target+= aData[all_dimensionality[n]] +"_YZYPD_"; 
								}
								var obj = {"source":source,"target":target};
								need_all_link.push(obj);
							}
							
						}
						var aNode = {
							"value":aData[drag_measureCalculateStyle[all_measure[0]]]/allValueUnitDict[valueUnitValue],
							"originValue":aData[drag_measureCalculateStyle[all_measure[0]]],
							"name":name,
							"fixed":false,
							"draggable":true,
							"category":categorys.hasObject("name",aData[need_dimensionality[0]]),
							"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},
							label:{
								normal:
								{
									show:true,
									formatter:function(params){
										var names = params["name"].split("_YZYPD_");
										var needValue = params.value;
										  if(normalUnitValue != -1){
						  	 				needValue = needValue.toFixed(normalUnitValue);
										  }
										return names[names.length - 2]+":"+needValue;
									}
								}
							}
							
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
		
		function draw(){
			var option = {
				title:[{
					text:"关系图",
					show:false,
				},
					{
					  	text: "单位: "+valueUnitValue,
					  	bottom:70,
					  	show:true,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName][0]
					  	}
					  }
				],
				legend:[{
					data:categorys,
					left:"center",
					bottom:0,
					type:'scroll',
				}],
				toolbox: {
			        show: true,
			        feature: {
			            dataView: {readOnly: true},
			            restore: {},
			            saveAsImage: {
			            	title:"保存为png"
			            }
			        },
			        orient:"vertical",
			        right:20,
			        top:"middle",
			        itemSize:20,
			        itemGap:30
				},
				color:allColorsDict[currentColorGroupName],
				tooltip:{
					formatter:function(params){
						if(params["dataType"] == "edge"){
							var name = params["name"];
							var nameArr = name.split(" > ");
							var ori = nameArr[0].split("_YZYPD_");
							var target = nameArr[1].split("_YZYPD_");
							return ori[ori.length - 2] + " > "+ target[target.length - 2];
						}else{
							var names = params["name"].split("_YZYPD_");
							var needValue = params.value;
							if(normalUnitValue != -1){
						  	 needValue = needValue.toFixed(normalUnitValue);
						  	}
							return names[names.length - 2]+ "<br/>" + params["marker"]+ params["seriesName"] + ": " + needValue;
						}
						
					},
					textStyle:{
						fontSize:12
					}
				},
		
				series:[
					{
						name:drag_measureCalculateStyle[all_measure[0]],
						type:"graph",
						layout:"force",
						data:need_all_nodes,
						roam:true,
						links:need_all_link,
						categories:categorys,
						force:{
							repulsion: 100,
						},
						symbolSize:function(value,params){
							var names = params["name"].split("_YZYPD_");
							var rs = names[names.length - 2]+":"+params.value;
							return [rs.visualLength(12)+15,20]
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
			var gridArr = [];
			var needYais = [{
			    		show:true,
			        type: "value",
			        name: commonLegend.join("/"),
			        nameLocation:"middle",
			        nameGap:60,
			        gridIndex:0,
			        z:1
					
			    }];
			 var valueMax = 0;
			for(var i = 0;i < data.length;i++){
				var aData = data[i];
				for(var j = 0;j < all_measure.length;j++){ // 计算出series
					if(valueMax < aData[drag_measureCalculateStyle[all_measure[j]]]){
						valueMax = aData[drag_measureCalculateStyle[all_measure[j]]];
					}		
					if(!series[j]){
						series[j] = {
							"name":drag_measureCalculateStyle[all_measure[j]],
							"type":"bar",
							"xAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
							"yAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
							"data":[{"value":aData[drag_measureCalculateStyle[all_measure[j]]] / allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[all_measure[j]]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]}}],
							label:{
								normal:{
									show:true,
									position:"top",
									formatter:function(params){
				                    		if(normalUnitValue != -1){
				                    			return params.value.toFixed(normalUnitValue);
				                    		}else{
				                    			return params.value;
				                    		}
			                   		},
								}
							},
							z:3
						};
					}else{
						series[j]["data"].push({"value":aData[drag_measureCalculateStyle[all_measure[j]]] / allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[all_measure[j]]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]}});
					}
				}
				var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
				for(var k = 0;k < dimension_length;k++){
					if(!dimensionality_show_data[k]){
						dimensionality_show_data[k] = [aData[all_dimensionality[k]]];
					}else{
						var index = dimensionality_show_data[k].indexOf(aData[all_dimensionality[k]]);
						if(index == -1){
							dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						}else if(index != -1){
							dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
						}	
					}
				}
			}
			
			for(var i = 0;i < dimensionality_show_data.length;i++){
				var aX = {
					"show":true,
					"name":all_dimensionality[i],
					"nameGap":30,
					"nameLocation":"start",
					
					"type":"category",
					
					axisTick:{
						inside:false,
						interval:function(index,value){return !/^YZYPD/.test(value)}
					},
					axisLabel:{
						color:"black",
						rotate:15,
						fontSize:10,
						interval:function(index,value){return !/^YZYPD/.test(value)}
					},
					position:"bottom",
					"data":dimensionality_show_data[i],
					gridIndex:dimensionality_show_data.length - i - 1
				}
				var aGrid = {
					containLabel:true,
				}
				aGrid["left"] = "10%";
				aGrid["bottom"] = 60 + 20*(dimensionality_show_data.length - 1 - i);		
				if(i >0){
					aGrid["tooltip"] = {show:false}
					var obj = {
				    		show:false,
				        type: "value",
				        gridIndex:i,
				        axisLine:{
					        	lineStyle:{
					        		color:'#fff'
					        }
				        },
				        min:0,
				        max:valueMax,
				        splitLine:{
				        		show:false
			       		 },
					}
					needYais.unshift(obj);
					var aSeriesData = {
						name:"help",
						type:"bar",
						xAxisIndex:i -1,
						yAxisIndex:i -1,
						"data":[{"value":valueMax/allValueUnitDict[valueUnitValue],"originValue":valueMax}],
						itemStyle:{
							normal:{
								opacity:0
							}
						},
						cursor:"default"
					}
					series.push(aSeriesData);
				}
				gridArr.push(aGrid);
				needXais.push(aX);
			}
			
			var dataZoomXindexArray = [];
			var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
			for(var k = dimension_length - 1; k >= 0;k--){
				dataZoomXindexArray.push(k);
			}
			
			var option = {
			    title: [{
			        text: "柱状图",
			        show:false
			    },
			    	{
					  	text: "单位: "+valueUnitValue,
					  	bottom:70,
					  	show:true,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName][0]
					  	}
					  }
			    ],
			    tooltip: {
			        trigger: 'item',
			        axisPointer: { // 坐标轴指示器，坐标轴触发有效
			            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			        },
			        formatter:function(params){
			        		var needValue = params.value;
						  if(normalUnitValue != -1){
						  	 needValue = needValue.toFixed(normalUnitValue);
						  }
			       	 	return params.name+ "<br/>" + params["marker"]+ params["seriesName"] + ": " + needValue;
			        },
			        textStyle:{
			        		fontSize:12
			        }
			    },
			   legend: {
			        data: commonLegend,
					left:"center",
					bottom:0
			    },
			    	color:allColorsDict[currentColorGroupName],
			    dataZoom:[
			    			{
			    			type: 'slider',
           			 	show: dimensionality_show_data[dimensionality_show_data.length - 1].length >15,
           			 	filterMode:"filter",
           			 	backgroundColor:"#dedede",
           			 	fillerColor:"#ff7e00",
           			 	showDataShadow:false,
			            xAxisIndex: dataZoomXindexArray,
			            height:8,
			            handleStyle:{
			            		color:"#ff7e00"	
			            },
			            startValue:0,
			            endValue:15,
			    			},
			    			{
			    			type: 'slider',
           			 	show: false,
           			 	filterMode:"empty",
			            yAxisIndex:dataZoomXindexArray,
			    			}
			    ],
				toolbox: {
			        show: true,
			        feature: {
			            dataView: {readOnly: true},
			            restore: {},
			            saveAsImage: {
			            	title:"保存为png"
			            }
			        },
			        orient:"vertical",
			        right:20,
			        top:"middle",
			        itemSize:20,
			        itemGap:30
				},
			    grid:gridArr,
			    xAxis: needXais,
			    yAxis:needYais,
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
			var needXais = [
				{
			   	 	show:true,
			        type: "value",
					gridIndex:all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
					name: commonLegend.join("\n"),
			        nameLocation:"end",
			        nameGap:10,
			    }
			];
			var gridArr = [];
			var valueMax = 0;
			
			for(var i = 0;i < data.length;i++){
				var aData = data[i];
				for(var j = 0;j < all_measure.length;j++){ // 计算出series
					if(valueMax < aData[drag_measureCalculateStyle[all_measure[j]]]){
						valueMax = aData[drag_measureCalculateStyle[all_measure[j]]];
					}					
					if(!series[j]){
						series[j] = {
							"name":drag_measureCalculateStyle[all_measure[j]],
							"type":"bar",
							"yAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
							"xAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
							"data":[{"value":aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[all_measure[j]]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]}}],
							z:3,
							label:{
								normal:{
									show:true,
									position:"right",
									formatter:function(params){
				                    		if(normalUnitValue != -1){
				                    			return params.value.toFixed(normalUnitValue);
				                    		}else{
				                    			return params.value;
				                    		}
			                  		 },
								}
							},};
					}else{
						series[j]["data"].push({"value":aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[all_measure[j]]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]}});
					}
				}
				var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
				for(var k = 0;k < dimension_length;k++){
					if(!dimensionality_show_data[k]){
						dimensionality_show_data[k] = [aData[all_dimensionality[k]]];
					}else{
						var index = dimensionality_show_data[k].indexOf(aData[all_dimensionality[k]]);
						if(index == -1){
							dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						}else if(index != -1){
							dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
						}	
					}
				}
			}
			
			
			
			for(var i = 0;i < dimensionality_show_data.length;i++){
				var aY = {
					"show":true,
					"name":all_dimensionality[i],
					"nameGap":10,
					"nameRotate":15,
					"nameLocation":"end",
					"type":"category",
					axisTick:{
						inside:false,
						interval:function(index,value){return !/^YZYPD/.test(value)}
					},
					axisLabel:{
						color:"black",
						rotate:15,
						fontSize:10,
						interval:function(index,value){return !/^YZYPD/.test(value)}
					},
					"data":dimensionality_show_data[i],
					gridIndex:i
				}
				needYais.push(aY);
				
				var aGrid = {
					containLabel:false,
					show:false,
					
				}
				aGrid["left"] = 150 + i * 50;
				aGrid["bottom"] = 60;	
				if(i != dimensionality_show_data.length - 1){
					aGrid["tooltip"] = {show:false}
				}
				if(i > 0){
					var obj = {
				    		show:false,
				        type: "value",
				        gridIndex:dimensionality_show_data.length - 1 - i,
				        min:0,
				        max:valueMax,
					}
					needXais.unshift(obj);
					
					var aSeriesData = {
						name:"help",
						type:"bar",
						xAxisIndex:i-1,
						yAxisIndex:i-1,
						"data":[{"value":valueMax/valueUnitValue,"originValue":valueMax}],
						itemStyle:{
							normal:{
								opacity:0
							}
						},
						cursor:"default"
					}
					series.push(aSeriesData);
				}
				
				gridArr.push(aGrid);
				
			}
			var dataZoomXindexArray = [];
			var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
			for(var k = dimension_length - 1; k >= 0;k--){
				dataZoomXindexArray.push(k);
			}
			var option = {
			    title: [{
			        text: "条形图",
			        show:false
			    },
			    	{
					  	text: "单位: "+valueUnitValue,
					  	bottom:70,
					  	show:true,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName][0]
					  	}
					  }
			    ],
			    tooltip: {
			        trigger: 'item',
			        axisPointer: { // 坐标轴指示器，坐标轴触发有效
			            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			        },
			       formatter:function(params){
			        		var needValue = params.value;
						  if(normalUnitValue != -1){
						  	 needValue = needValue.toFixed(normalUnitValue);
						  }
			       	 	return params.name+ "<br/>" + params["marker"]+ params["seriesName"] + ": " + needValue;
			        },
			        textStyle:{
			        		fontSize:12
			        }
			    },
			    legend: {
			        data: commonLegend,
			        left:"center",
			        bottom:0
			    },
			    	color:allColorsDict[currentColorGroupName],
				toolbox: {
			        show: true,
			        feature: {
			            dataView: {readOnly: true},
			            restore: {},
			            saveAsImage: {
			            	title:"保存为png"
			            }
			        },
			        orient:"vertical",
			        right:20,
			        top:"middle",
			        itemSize:20,
			        itemGap:30
				},
				  dataZoom:[
			    			{
				    			type: 'slider',
	           			 	show: dimensionality_show_data[dimensionality_show_data.length - 1].length > 15,
	           			 	filterMode:"filter",
	           			 	backgroundColor:"#dedede",
	           			 	fillerColor:"#ff7e00",
	           			 	showDataShadow:false,
				            yAxisIndex: dataZoomXindexArray,
				            height:8,
				            handleStyle:{
				            		color:"#ff7e00"	
				            },
				            startValue:0,
				            endValue:15,
				            orient:"horizontal",
				            bottom:25
			    			},
			    			{
			    			type: 'slider',
           			 	show: false,
           			 	filterMode:"empty",
			            xAxisIndex: dataZoomXindexArray,
			    			}
			    ],
			    grid: gridArr,
			    yAxis: needYais,
			    xAxis:needXais,
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
			radarDiemension = all_dimensionality[0];
			var indicator = [];
			var series = [{"name":all_measure.join("/"),"type":"radar","data":[]}];
			var recordArr = [];
			for(var i =0;i < data.length;i++){
				var aData = data[i];
				var max = aData[drag_measureCalculateStyle[all_measure[0]]] / allValueUnitDict[valueUnitValue];
				for(var j = 0;j <  all_measure.length;j++){					
					if(!series[0]["data"][j]){
						series[0]["data"][j] = {
							"name":drag_measureCalculateStyle[all_measure[j]],
							"value":[aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue]]
							};
						recordArr[j] = [aData[drag_measureCalculateStyle[all_measure[j]]]];
					}else{
						series[0]["data"][j]["value"].push(aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue]);
						recordArr[j].push(aData[drag_measureCalculateStyle[all_measure[j]]]);
					}
					if(max < aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue]){
						max  = aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue];
					}
				}
				indicator.push({"name":aData[all_dimensionality[0]],"max":(max/allValueUnitDict[valueUnitValue])*1.2,"originalMax":max});
			}
			
		var option = {
		    title: [{
		        text: "雷达图",
		        show:false
		    },
		    	{
					  	text: "单位: "+valueUnitValue,
					  	bottom:70,
					  	show:true,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName][0]
					  	}
					  }
		    ],
		    tooltip: {
		    		trigger:"item",
		    		textStyle:{
		    			fontSize:12	
		    		},
		    		formatter:function(params){
					var sumMeasure = "";
	       			var dimeNames = "<p style='font-size:12px;height:12px;padding:3px 0 3px 2px'>" + params.name + "</p>";
   					for(var i = 0;i < params.value.length;i++){
   						var needValue = params.value[i];
   						if(normalUnitValue != -1){
				  	 		needValue = needValue.toFixed(normalUnitValue);
				 		 }
   						var measureNames = "<p style='font-size:10px;height:12px;padding:3px 0 3px 0;margin-top:6px'><span style=width:8px;height:8px;border-radius:50%;float:left;margin-top:2./spx;line-height:12px;background:"+params.color + ">"+ "</span>" + "<span style='float:left;margin-left:5px;height:12px;line-height:12px'>" +indicator[i].name+":  " + needValue+"</span></p>";
   						sumMeasure += measureNames;
   					}
	        			 return dimeNames + sumMeasure;
					
		    		}
		    		
		    },
		    legend: {
		        data: commonLegend,
		        left:"center",
		        bottom:0
		    },
		    	color:allColorsDict[currentColorGroupName],
			toolbox: {
		        show: true,
		        feature: {
		            dataView: {readOnly: true},
		            restore: {},
		            saveAsImage: {
		            	title:"保存为png"
		            }
		        },
		        orient:"vertical",
		        right:20,
		        top:"middle",
		        itemSize:20,
		        itemGap:30
			},
		    radar: [{
		        shape: 'circle',
		        indicator:indicator,
		        triggerEvent:true,
		    }],
		    "record":recordArr,
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
	// 记录当前图形的类型
	currentChatType = chart_type_need;
}



// 设置面板，设置了颜色
function colorsPanelDidSelectedColor(){
	var mycharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
	var op = mycharts.getOption();
	op.title[1] = {
		text: "单位: "+valueUnitValue,
		bottom:70,
		show:true,
		textStyle:{
			fontSize:14,
			color:allColorsDict[currentColorGroupName][0]
		}
	}
	mycharts.setOption({
		color:allColorsDict[currentColorGroupName],
		title:op.title
	});
	if(currentChatType == "number_bar" || currentChatType == "number_liner" || currentChatType == "percentage_bar" || currentChatType == "percentage_liner"){
		var op = mycharts.getOption();
		for(var i = 0;i < op.series.length;i++){
			var obj = op.series[i];
			obj.itemStyle ={
						normal:{
							color:allColorsDict[currentColorGroupName][i % allColorsDict[currentColorGroupName].length]
						}
				};
		}
		mycharts.setOption({"series":op.series});
	}
}
//设置面板，设置了单位（保留了几位小数)
function normalUnitDidChangeValue(){
	var mycharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
	var op = mycharts.getOption();
	mycharts.setOption(op);
}
// 设置面板，设置了值单位
function valueUnitDidChangedValue(){
	var mycharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
	var op = mycharts.getOption();
	op.title[1] = {
		text: "单位: "+valueUnitValue,
		bottom:70,
		show:true,
		textStyle:{
			fontSize:14,
			color:allColorsDict[currentColorGroupName][0]
		}
	}
	if(currentChatType != "percentage_bar" && currentChatType != "percentage_liner"){
		if(currentChatType == "radarChart"){
			
			var allValueData = op.series[0].data;
			for(var i = 0;i < allValueData.length;i++){
				var theValues = allValueData[i].value;
				for(var j = 0;j < theValues.length;j++){
					theValues[j] = op.record[i][j] / allValueUnitDict[valueUnitValue];
				}
			}
			for(var i = 0; i <  op["radar"][0].indicator.length;i++){
				var obj = op.radar[0].indicator[i];
				obj.max = (obj.originalMax / allValueUnitDict[valueUnitValue]) *1.2;
			}
		}else{
			for(var i = 0;i < op.series.length;i++){
				var theDatas = op.series[i].data;
				for(var j = 0;j <  theDatas.length;j++){
					var aData = theDatas[j];
					aData.value = aData.originValue / allValueUnitDict[valueUnitValue];
				}
			}
		}
	}
	
	
	mycharts.setOption(op);
	
}


// 公共函数，处理层级字典
// values是度量值
// needobj 辅助对象
// keys，需要过滤的维度的数组
//arr1：过滤好的数组，包含维度的各个值
//arr2：维度的名字
//function object_key_hanlde(needobj,keys,arr1,arr2){
//	var i = 0;
//	function  handle (obj) {
//	if(!obj[keys[i]]){
//		obj[keys[i]] = {};
//		if(!arr1[i]){
//			arr1[i] = [];
//			arr2.push(keys[i].split("_equal_")[0]);
//		}
//		arr1[i].push(keys[i].split("_equal_")[1]);
//	}else{
//		if(i + 1 < keys.length){
//			arr1[i].push(" " + keys[i].split("_equal_")[1]);
//		}	
//	}
//	i++;
//	if(i == keys.length){
//	   return;
//	}
//	obj = handle(obj[keys[i - 1]]);
//	
//}
// handle(needobj);
//}



// 图形下钻功能
function chartAPartDidClickedFunction(params){
	if(params.seriesName == "help"){
		return;
	}
	$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList").empty();
	$("#dashboard_content #dimensionality #dimensionality_show ul li.dimensionality_li div.dimensionality_list_main p span.dimensionality_list_text_left").each(function(index,ele){
		var li = $("<li>"+$(ele).text()+"</li>");
		$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList").append(li);
	});
	if(dirllConditions&&dirllConditions.length > 0){
		$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillUp").addClass("active");
	}else{
		$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillUp").removeClass("active");
	}
	
	if(currentChatType == "radarChart" && params.componentType == "radar"){
		$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .levelTitle").html(params.name);
	}else{
		$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .levelTitle").html(params.data.dirllInfo.currentField);
	}
	
	
	$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection").show();
	// 下钻按钮点击的时候
	$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillDown").unbind("click");
	$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillDown").click(function(event){
		event.stopPropagation();
		$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList").css("left",$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillUp").outerWidth() + $("#dashboard_content #view_show_area #view_show_area_content .drillUpAndDrillDownSelection .levelTitle").outerWidth());
		$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList").show();
	});
	// 下钻具体选项选择的时候
	$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList li").unbind("click");
	$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList li").click(function(event){
		event.stopPropagation();
		$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList").hide();
		$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection").hide();
		var aDrillcondtion = null;
		if(currentChatType == "radarChart" && params.componentType == "radar"){
			 aDrillcondtion = {"currentField":radarDiemension,"currentValue":params.name,"drillField":$(this).text()};
		}else{
			aDrillcondtion = {"currentField":params.data.dirllInfo.currentField,"currentValue":params.data.dirllInfo.currentValue,"drillField":$(this).text()};
		}
		
		dirllConditions.push(aDrillcondtion);
		
		switch_chart_handle_fun();
		
	});
	// 上钻按钮点击的时候
	$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillUp").unbind("click");
	$("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillUp").click(function(event){
		event.stopPropagation();
		if(dirllConditions&&dirllConditions.length > 0){
			dirllConditions.pop();
			switch_chart_handle_fun();
		}
	});
}





// 下钻功能，需要记录当前的条件
function saveDrillConditions(key,drillCondictions){
	
	window.localStorage.setItem(key,JSON.stringify(drillCondictions));
}
// 获取下钻的条件
function getDrillConditions(key){
	return JSON.parse(window.localStorage.getItem(key));
}
