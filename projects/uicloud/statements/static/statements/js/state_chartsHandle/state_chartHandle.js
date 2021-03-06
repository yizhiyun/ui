var currentChatType = "none";
var radarDiemension = "none";
var showTongbiMeasureArray = [];
var showHuanbiMeasureArray = [];

var freePostData;
var clickDrill = true;
var count = 0;
var array = [];

var oneClickLoading = true;
var manyClickLoading = true;
// 一个维度一个度量处理函数
// chart_type_need:waterWall,cake
function reporting_one_de_one_me_handle (chart_type_need,storeNum_toview,freeCount,drill) {
	if(freeCount != undefined){
		var mycharts = echarts.getInstanceByDom($(".new_view_main[_echarts_instance_="+freeCount+"]").get(0));
	}else{
		var mycharts = echarts.getInstanceByDom($("."+viewshow_class+"").get(0));
		if(!mycharts){
				mycharts = 	echarts.init($("."+viewshow_class+"").get(0));
		}
		if(currentChatType != chart_type_need){
			if(echarts.getInstanceByDom($("."+viewshow_class+"").get(0))){
				echarts.getInstanceByDom($("."+viewshow_class+"").get(0)).clear();
			}
		}
		
	}
	

	
	mycharts.off("click");
	mycharts.on("click",function(params){
		    //地图
		    if(params.seriesType == "map"){
		    	if(params.name == "临清市"){
					if(mycharts._loadingFX == undefined){
						mycharts.showLoading({
							 text: '数据获取中',
								 color: '#c23531',
								 textColor: '#000',
								 maskColor: 'rgba(255, 255, 255, 0.8)',
								 zlevel: 0
						});
					}
		    		if(params.color != "rgba(222,222,222,1)"){
		    			address_map_fun(storeNum_toview,"drill");
		    		}else{
						address_map_fun(storeNum_toview);
		    		}
		    	}
		    	return;
		    }		

			if(oneClickLoading){
				oneClickLoading = false;
				clickDrillStatementsFunction(params,$(params.event.event.target).parents(".new_view_content"),JSON.parse(JSON.stringify(storeNum_toview)),JSON.parse(JSON.stringify(viewshow_class)));
			}
			setTimeout(function(){oneClickLoading = true;},500)
	});
 	var need_handle_measureName = specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["row"]["measure"].concat(drag_row_column_data_arr[storeNum_toview]["column"]["measure"]))[0];
 	var need_handle_dimensionalityName = specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["row"]["dimensionality"].concat(drag_row_column_data_arr[storeNum_toview]["column"]["dimensionality"]))[0];
 	
	if(mycharts._loadingFX == undefined){
		mycharts.showLoading({
			 text: '数据获取中',
				 color: '#c23531',
				 textColor: '#000',
				 maskColor: 'rgba(255, 255, 255, 0.8)',
				 zlevel: 0
		});
	}
 	
	 // 一个维度一个度量
	function waterWall_generate_fun(storeNum_toview){
		if(statements_tonghuanbi_arr[storeNum_toview] != undefined){
			var tempThData = JSON.parse(statements_tonghuanbi_arr[storeNum_toview]);
			showTongbiMeasureArray = tempThData[0];
			showHuanbiMeasureArray = tempThData[1];
		}
		var tempSaveClassName = viewshow_class;
		reporting_measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,storeNum_toview,function(data){
			var dimensionality_need_show = [];
			var measure_need_show = [];
			var measure_help_show =[];
			var count_help = 0;
			for(var i =0 ; i < data.length;i++){
				var aData = data[i];
				var value = aData[drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]];
				dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
				measure_need_show.push({"value":value / allValueUnitDict[valueUnitValue],"originValue":value,"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]},"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]],"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]]});
				measure_help_show.push({"value":count_help / allValueUnitDict[valueUnitValue],"originValue":count_help});
				count_help += value;
			}
			dimensionality_need_show.push("全部");
			measure_need_show.push({"value":count_help / allValueUnitDict[valueUnitValue],"originValue":count_help,"dirllInfo":{"currentField":"全部","currentValue":"全部"},"tongbi":0,"huanbi":0});
			measure_help_show.push({"value":0,"originValue":0});
			var option = {
				title: [{
						text: '瀑布图',
						show:false,
				},
				{
					  	text: "单位: "+valueUnitValue,
					  	show:false,
					  	bottom:dimensionality_need_show.length > 15 ? 40 : 20,
					  	// bottom:40,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
					  	}
					  }
				],
			    legend:{
			   	 	data:[drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]],
			   	 	left:"center",
			   	 	// bottom:40,
			   	 	// bottom:dimensionality_need_show.length > 15 ? 40 : 20,
			   	 	bottom:dimensionality_need_show.length > 15 ? "8%" : "6%" ,
			   	 	width:"60%",

			    },
			    color:allColorsDict[currentColorGroupName_arr[storeNum_toview]],
			 	tooltip : {
			     trigger: 'axis',
			     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			         type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
			     },
			     backgroundColor:'rgba(255,255,255,0.95)',
			     extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
			     formatter: function (params) {

			         var tar;
			         // if (params[1].value != '-') {
			         //     tar = params[1];
			         // }
			         // else {
			         //     tar = params[0];
			         // }
			         if(params[1]){
			         	if(params[1].value != '-'){
			         		tar = params[1];
			         	}else{
			         		tar = params[0];
			         	}
			         }else{
			         	return ;
			         }
					var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+need_handle_dimensionalityName+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+tar.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+tar.seriesName+":</span></p>";
			         var needValue = tar.value;
			         if(normalUnitValue_arr[storeNum_toview] != -1){
			         	needValue = needValue.toFixed(normalUnitValue_arr[storeNum_toview]);
			         }
			         var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+tar.name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";

							 var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
							 var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
							 var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(tar.data.tongbi)*100).toFixed(2)+"%</p>";
							 var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(tar.data.huanbi)*100).toFixed(2)+"%</p>";
							 if(showTongbiMeasureArray.indexOf(need_handle_measureName)!=-1){
								 leftDiv += leftTongbi;
								 rightDiv += rightTongbi;
							 }
							 if(showHuanbiMeasureArray.indexOf(need_handle_measureName)!=-1){
								 leftDiv += leftHuanbi;
								 rightDiv += rightHuanbi;
							 }
							 leftDiv += "</div>";
							 rightDiv += "</div>";

			         return leftDiv + rightDiv;


			     }
			 	},
			    grid: {
			        containLabel: true,
			        // left:50,
			        // bottom:dimensionality_need_show.length > 15 ? 120 : 80
			        left:30,
			        bottom:dimensionality_need_show.length > 15 ? "25%" : "20%",
			        top:"6%"
			        // bottom:120
			    },
			    toolbox: {
			        show: true,
			        feature: {
			            // dataView: {readOnly: true},
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
			    	// name:need_handle_dimensionalityName,
					nameLocation:"start",
					nameGap:25,
					nameRotate:-15,
			        type : 'category',
			        splitLine: {show:false},
					data:dimensionality_need_show,
					axisLabel:{
						rotate:-25,
						fontSize:10,
						interval:0,
						color:"black",
						formatter:function(value){
							if(value.length > 6){
								value =  value.substring(0,6) + '...';
							}
							return value;
						}
						// formatter:function(value)  
      //                          {  
      //                              return value.split("").join("\n");  
      //                          }  
					},
			    },
			    dataZoom:[
			    			{
			    		type: 'slider',
           			 	show: dimensionality_need_show.length > 15,
           			 	filterMode:"filter",
           			 	backgroundColor:"#f5f5f5",
           			 	fillerColor:"#dedede",
           			 	borderColor:"#f5f5f5",
           			 	showDataShadow:false,
			            xAxisIndex: [0],
			            height:10,
			            handleStyle:{
			            		color:"#dedede"
			            },
			            bottom:0,
			            startValue:0,
			            endValue:dimensionality_need_show.length > 15 ? 15 : null,
			            handleSize:12,
			            maxValueSpan:15,
			            throttle:100,
			            handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
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
			            name: drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName],
			            type: 'bar',
			            stack: '总量',
			            label: {
			                normal: {
			                	show:false,
			                    // show:dimensionality_need_show.length < 25 ,
			                    position: 'top',
			                    formatter:function(params){
			                    		if(normalUnitValue_arr[storeNum_toview] != -1){
			                    			return params.value.toFixed(normalUnitValue_arr[storeNum_toview]);
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
			setTimeout(function (){
                mycharts.hideLoading();
                mycharts.setOption(option);
                elementContent($("."+tempSaveClassName+""),option);	
                
                
            }, 200)
		});
	}



	// 地图
  function address_map_fun(storeNum_toview,drillChange){
	if(statements_tonghuanbi_arr[storeNum_toview] != undefined && statements_tonghuanbi_arr[storeNum_toview].length > 0){
		var tempThData = JSON.parse(statements_tonghuanbi_arr[storeNum_toview]);
		showTongbiMeasureArray = tempThData[0];
		showHuanbiMeasureArray = tempThData[1];
	}
	var tempSaveClassName = viewshow_class;
    reporting_measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,storeNum_toview,function(data){
      if(data.length == 0){
        return;
      }
      var markPointData = [];
      var measure_need_show = [];
      var addressDateMax = [];
      for (var i = 0; i < data.length;i++) {
        var aData = data[i];
        var mapIndex = i;
        if(mapIndex > 9){
        	mapIndex = i - 10;
        }

        // measure_need_show.push({"name":aData[need_handle_dimensionalityName],"value":aData[drag_measureCalculateStyle[need_handle_measureName]] / allValueUnitDict[valueUnitValue],"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]},"originValue":aData[drag_measureCalculateStyle[need_handle_measureName]],"tongbi":aData["同比"+drag_measureCalculateStyle[need_handle_measureName]],"huanbi":aData["环比"+drag_measureCalculateStyle[need_handle_measureName]]});
        addressDateMax.push(aData[drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]] / allValueUnitDict[valueUnitValue_arr[storeNum_toview]]);
      	markPointData.push({"name":aData[need_handle_dimensionalityName],"coord":[Number(qingshuiIP[aData[need_handle_dimensionalityName]].split(",")[0]),Number(qingshuiIP[aData[need_handle_dimensionalityName]].split(",")[1])],"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]] / allValueUnitDict[valueUnitValue_arr[storeNum_toview]] > 0 ? aData[drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]] / allValueUnitDict[valueUnitValue_arr[storeNum_toview]] : 0,"itemStyle":{"normal":{"color":"rgba("+hex2Rgb(allColorsDict[currentColorGroupName_arr[storeNum_toview]][mapIndex])+",0.4)","borderColor":allColorsDict[currentColorGroupName_arr[storeNum_toview]][mapIndex]}}})
      }

    if(drillChange == undefined){
    	echarts.registerMap(name,liaochengMap);
    }else{
    	echarts.registerMap(name,liaocheng);
    }
    
    //清除上一个图例
    mycharts.clear();
    linoptions = {
            title: [{
                text: "地图",
                left: 'center',
                show:false
            },
            {
          text: "单位: "+valueUnitValue_arr[storeNum_toview],
          bottom:40,
          show:false,
          textStyle:{
            fontSize:14,
            color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
          }
      }],
	    tooltip: {
	        show: true,
	        trigger: 'item',
	        backgroundColor:'rgba(255,255,255,0.95)',
	        extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
	        formatter:function(params){
	          var needValue = params.value;
	            if(normalUnitValue_arr[storeNum_toview] != -1){
	               needValue = needValue.toFixed(normalUnitValue_arr[storeNum_toview]);
	            }
	                var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+need_handle_dimensionalityName+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
	                var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
	                var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
	                var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
	                var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
	                var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
	                if(showTongbiMeasureArray.indexOf(params.data.measureName) != -1){
	                  leftDiv += leftTongbi;
	                  rightDiv += rightTongbi;
	                }
	                if(showHuanbiMeasureArray.indexOf(params.data.measureName) != -1){
	                  leftDiv += leftHuanbi;
	                  rightDiv += rightHuanbi;
	                }
	                leftDiv+= "</div>";
	                rightDiv+= "</div>";
	                 return leftDiv + rightDiv;
	        }
	    },

            visualMap: {
                min: addressDateMax.min(),
                max: addressDateMax.max(),
                left: 'left',
                top: 'bottom',
                text: ['高', '低'], // 文本，默认为数值文本
                calculable: true,
                show:false,
                inRange:{
                  color:["#DEDEDE"],
                }
            },
            toolbox: {
            show: true,
            feature: {
                // dataView: {readOnly: true},
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
            series: [{
            	name:drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName],
                type: 'map',
                mapType: name,
                label: {
                    normal: {
                  		show:true,
                  		fontSize:14,
            			color:"#000"
                    },
                    emphasis: {
                        textStyle: {
                            color: '#000000'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: '#DEDEDE',
                        areaColor: '#fff',

                    },
                    emphasis: {
                        areaColor: '#DEDEDE',
                        borderWidth: 0
                    }
                },
                animation: false,

                data:[{name:"临清市",value:addressDateMax.arrSum()}],
               	"markPoint": {
		            "symbol": "circle",
		            "symbolSize":function(s){
		            	return s/addressDateMax.min()*23
		            },
		            "animation":true,
		            "label": {
		                "normal": {
		                    "show": true,
		                    formatter:function(d){
		                    	return d.name;
		                    },
		                    "color":"rgba(0,0,0,1)",
		                    "fontSize":12,
		                    // "position":"bottom",
		                },
		                "emphasis": {
		                    show: false,
		                }
		            },
		            "itemStyle": {
		                "normal": {
		                    // "color":'rgba(12, 84, 163,0.6)',
		                    // "borderColor":"rgb(96, 204, 243)",
		                    "borderWidth":1,
		                }
		            },
		            "data": markPointData
	        },

	        hoverAnimation: true,
            }],

        };

         liaooptions = {

            title: [{
                text: "地图",
                left: 'center',
                show:false
            },
            {
          text: "单位: "+valueUnitValue_arr[storeNum_toview],
          bottom:40,
          show:false,
          textStyle:{
            fontSize:14,
            color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
          }
      }],
            tooltip: {
	            show: true,
	            trigger: 'item',
	            backgroundColor:'rgba(255,255,255,0.95)',
	            extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
	            formatter:function(params){
	              var needValue = params.value;
	                if(normalUnitValue_arr[storeNum_toview] != -1){
	                   needValue = needValue.toFixed(normalUnitValue_arr[storeNum_toview]);
	                }
	                    var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+need_handle_dimensionalityName+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
	                    var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
	                    var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
	                    var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
	                    var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
	                    var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
	                    if(showTongbiMeasureArray.indexOf(params.data.measureName) != -1){
	                      leftDiv += leftTongbi;
	                      rightDiv += rightTongbi;
	                    }
	                    if(showHuanbiMeasureArray.indexOf(params.data.measureName) != -1){
	                      leftDiv += leftHuanbi;
	                      rightDiv += rightHuanbi;
	                    }
	                    leftDiv+= "</div>";
	                    rightDiv+= "</div>";
	                     return leftDiv + rightDiv;
	            }
            },

            visualMap: {
                min: 0,
                max: addressDateMax.max(),
                left: 'left',
                top: 'bottom',
                text: ['高', '低'], // 文本，默认为数值文本
                calculable: true,
                show:false,
                inRange:{
                  color:[allColorsDict[currentColorGroupName_arr[storeNum_toview]][9],allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]],
                }
            },
            toolbox: {
            show: true,
            feature: {
                // dataView: {readOnly: true},
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
            series: [{
            	name:drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName],
                type: 'map',
                mapType: name,
                label: {
                    normal: {
                  		show:true,
                  		fontSize:14,
            			color:"#000"
                    },
                    emphasis: {
                        textStyle: {
                            color: '#000000'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: '#000',
                        areaColor: '#fff',

                    },
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                },
                animation: false,

                data:[{name:"临清市",value:addressDateMax.arrSum()},{name:"冠县",value:0},{name:"莘县",value:0},{name:"阳谷县",value:0},{name:"东昌府区",value:0},{name:"东阿县",value:0},{name:"茌平县",value:0},{name:"高唐县",value:0}],

	        hoverAnimation: true,
            }],

        };


      // -------------------------
	setTimeout(function (){
        mycharts.hideLoading();
        var option = null;
	    if(drillChange == undefined){
	    	option = liaooptions;
	    }else{
	    	option = linoptions;
	   	}
	   	mycharts.setOption(option);
       // $("."+tempSaveClassName+"").data("dataShow",option.series.label.normal.show);
        elementContent($("."+tempSaveClassName+""),option);

    }, 200)

    });
  }

	//  饼图
	function  cake_generate_fun (storeNum_toview) {
		if(statements_tonghuanbi_arr[storeNum_toview] != undefined){
			var tempThData = JSON.parse(statements_tonghuanbi_arr[storeNum_toview]);
			showTongbiMeasureArray = tempThData[0];
			showHuanbiMeasureArray = tempThData[1];
		}

		var tempSaveClassName = viewshow_class;
		reporting_measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,storeNum_toview,function(data){
			var dimensionality_need_show = [];
			var measure_need_show = [];
			for (var i = 0; i < data.length;i++) {
				var aData = data[i];
				dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
				measure_need_show.push({"name":aData[need_handle_dimensionalityName],"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]] / allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]},"originValue":aData[drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]],"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]],"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]]});
			}
				var option = {
					title: [{
						text: '饼图',
						show:false,
					},
					  {
					  	text: "单位: "+valueUnitValue_arr[storeNum_toview],
					  	bottom:20,
					  	show:false,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
					  	}
					  }
					],
					tooltip: {
						show:true,
						trigger: 'item',
						backgroundColor:'rgba(255,255,255,0.95)',
			    		extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
						formatter:function (params){
						  var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+need_handle_dimensionalityName+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>占比:</p>";
						  var needValue = params.value;
						  if(normalUnitValue_arr[storeNum_toview] != -1){
						  	 needValue = needValue.toFixed(normalUnitValue_arr[storeNum_toview]);
						  }
						 var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>"+"<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.percent+"%</p>";
						 var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
						 var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
						 var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
						 var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
						 if(showTongbiMeasureArray.indexOf(need_handle_measureName)!=-1){
							 leftDiv += leftTongbi;
							 rightDiv += rightTongbi;
						 }
						 if(showHuanbiMeasureArray.indexOf(need_handle_measureName)!=-1){
							 leftDiv += leftHuanbi;
							 rightDiv += rightHuanbi;
						 }
						 leftDiv += "</div>";
						 rightDiv += "</div>";
			       return leftDiv + rightDiv;
						}
					},
					toolbox: {
				        show: true,
				        feature: {
				            // dataView: {readOnly: true},
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
						bottom:"9%",
						data: dimensionality_need_show,
						width:"60%",
					},
					color:allColorsDict[currentColorGroupName_arr[storeNum_toview]],
					series: [{
						name: drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName],
						type: "pie",
						radius: "65%",
						center: ["50%", "40%"],
						data: measure_need_show,
						label: {
			                normal: {
			                	show:false,
			                	position:dimensionality_need_show.length < 25 ? 'outside' : 'inside',
			                    // show:dimensionality_need_show.length < 25,
			                    formatter:function(params){
			                    		if(normalUnitValue_arr[storeNum_toview] != -1){
			                    			return params.name+":"+params.value.toFixed(normalUnitValue_arr[storeNum_toview]);
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

			setTimeout(function (){
                mycharts.hideLoading();
                mycharts.setOption(option);
               // $("."+tempSaveClassName+"").data("dataShow",option.series.label.normal.show);
                elementContent($("."+tempSaveClassName+""),option);

            }, 200)
				
				
		});
	
	}
	
	// 4、面积图
	function area_generate_fun (storeNum_toview) {
		if(statements_tonghuanbi_arr[storeNum_toview] != undefined){
			var tempThData = JSON.parse(statements_tonghuanbi_arr[storeNum_toview]);
			showTongbiMeasureArray = tempThData[0];
			showHuanbiMeasureArray = tempThData[1];
		}
		var tempSaveClassName = viewshow_class;
		reporting_measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,storeNum_toview,function(data){
			var dimensionality_need_show = [];
			var  measure_need_show = [];
			for(var i = 0;i < data.length;i++){
				var aData = data[i];
				dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
				measure_need_show.push({"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]] / allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]},"originValue":aData[drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]],"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]],"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]]});

			}
			var option = {
				title:[{
					text:"面积图",
					show:false
				},
				{
					  	text: "单位: "+valueUnitValue_arr[storeNum_toview],
					  	// bottom:40,
					  	bottom:dimensionality_need_show.length > 15 ? 40 : 20,
					  	show:false,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
					  	}
					  }
				],
				tooltip:{
					trigger:"axis",
					backgroundColor:'rgba(255,255,255,0.95)',
			    	extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
					formatter:function(params){

						  var needValue = params[0].value;
						  if(normalUnitValue_arr[storeNum_toview] != -1){
						  	 needValue = needValue.toFixed(normalUnitValue_arr[storeNum_toview]);
						  }
						  var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+need_handle_dimensionalityName+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params[0].color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params[0].seriesName+":</span></p>";
						var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params[0].name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
						var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
						var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
						var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params[0].data.tongbi)*100).toFixed(2)+"%</p>";
						var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params[0].data.huanbi)*100).toFixed(2)+"%</p>";
						if(showTongbiMeasureArray.indexOf(need_handle_measureName)!=-1){
							leftDiv += leftTongbi;
							rightDiv += rightTongbi;
						}
						if(showHuanbiMeasureArray.indexOf(need_handle_measureName)!=-1){
							leftDiv += leftHuanbi;
							rightDiv += rightHuanbi;
						}
						leftDiv += "</div>";
						rightDiv += "</div>";

			        		 return leftDiv + rightDiv;
					}
				},
				color:allColorsDict[currentColorGroupName_arr[storeNum_toview]],
				legend:{
					data:[drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]],
					left: 'center',
					// bottom:40,
					// bottom:dimensionality_need_show.length > 15 ? 40 : 20,
					bottom:dimensionality_need_show.length > 15 ? "8%" : "6%",
					width:"60%",
				},
				toolbox: {
			        show: true,
			        feature: {
			            // dataView: {readOnly: true},
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
			        containLabel: true,
			        left:30,
			        // bottom:120
					// bottom:dimensionality_need_show.length > 15 ? 120 : 80,
					bottom:dimensionality_need_show.length > 15 ? "22%" : "20%",
					top:"10%"
			    },
				xAxis:[
					{
						// name:need_handle_dimensionalityName,
						nameLocation:"start",
						nameGap:25,
						nameRotate:-15,
						type:"category",
						boundaryGap:false,
						data:dimensionality_need_show,
						axisLabel:{
							rotate:-15,
							fontSize:10,
							interval:0,
							color:"black",
							formatter:function(value){
								if(value.length > 6){
									value = value.substring(0,6) + '...';
								}
								return value;
							}
						},
					}
				],
				 dataZoom:[
			    			{
			    		type: 'slider',
           			 	show: dimensionality_need_show.length > 15,
           			 	filterMode:"filter",
           			 	backgroundColor:"#f5f5f5",
           			 	fillerColor:"#dedede",
           			 	borderColor:"#f5f5f5",
           			 	showDataShadow:false,
			            xAxisIndex: [0],
			            height:10,
			            handleStyle:{
			            		color:"#dedede"	
			            },
			            bottom:0,
			            startValue:0,
			            endValue:dimensionality_need_show.length > 15 ? 15 : null,
			          	handleSize:12,
			            maxValueSpan:15,
			            throttle:100,
			            handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",			            
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
						name:drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName],
						type:"line",
						smooth:"true",
						areaStyle:{
							normal:{
								opacity:0.5,
							}
						},
						label:{
							normal:{
								show:false,
								// show:dimensionality_need_show.length < 25,
								position:"top",
								formatter:function(params){
			                    		if(normalUnitValue_arr[storeNum_toview] != -1){
			                    			return params.value.toFixed(normalUnitValue_arr[storeNum_toview]);
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
	
			setTimeout(function (){
                mycharts.hideLoading();
                mycharts.setOption(option);
               // $("."+tempSaveClassName+"").data("dataShow",option.series.label.normal.show);
                elementContent($("."+tempSaveClassName+""),option);
            }, 200)
		});
		
		
	}
	
	// area_generate_fun();


 function gantt_generate_fun(storeNum_toview){
		if(statements_tonghuanbi_arr[storeNum_toview] != undefined){
			var tempThData = JSON.parse(statements_tonghuanbi_arr[storeNum_toview]);
			showTongbiMeasureArray = tempThData[0];
			showHuanbiMeasureArray = tempThData[1];
		}
 		var tempSaveClassName = viewshow_class;
		reporting_measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,storeNum_toview,function(data){
				var dimensionality_need_show = [];
				var measure_need_show = [];
				var measure_help_show =[];
				var count_help = 0;
				for(var i = 0;i < data.length;i++){
					var aData = data[i];
					var value = aData[drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]];
					dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
					measure_need_show.push({"value":value / allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":value,"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]},"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]],"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]]});
					measure_help_show.push({"value":count_help/allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":count_help});
					count_help += value;
				}
				measure_help_show.unshift({"value":0,"originValue":0});
				measure_need_show.unshift({"value":count_help/allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":count_help,"dirllInfo":{"currentField":"全部","currentValue":"全部"},"tongbi":0,"huanbi":0});
				dimensionality_need_show.unshift("全部");
				var option = {
				    title: [{
				        text: '甘特图',
				        show:false
				    },
				    	{
					  	text: "单位: "+valueUnitValue_arr[storeNum_toview],
					  	// bottom:40,
					  	bottom:dimensionality_need_show.length > 15 ? 40 : 20,
					  	show:false,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
					  	}
					  }
				    ],
				    legend:{
				    		data:[drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]],
				    		left:"center",
				    		// bottom:40,
					  		// bottom:dimensionality_need_show.length > 15 ? 40 : 20,
					  		bottom:dimensionality_need_show.length > 15 ? "8%" : "6%",
				    		width:"60%",
				    },
				    color:allColorsDict[currentColorGroupName_arr[storeNum_toview]],
					toolbox: {
				        show: true,
				        feature: {
				            // dataView: {readOnly: true},
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
				     backgroundColor:'rgba(255,255,255,0.95)',
			    	 extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
					 formatter: function (params) {
			         var tar;
			         // if (params[1].value != '-') {
			         //     tar = params[1];
			         // }
			         // else {
			         //     tar = params[0];
			         // }
			         if(params[1]){
			         	if(params[1].value  != '-'){
			         		tar = params[1];
			         	}else{
			         		tar = params[0];
			         	}
			         }else{
			         	return ;
			         }
			         var needValue = tar.value;
					 if(normalUnitValue_arr[storeNum_toview] != -1){
						 needValue = needValue.toFixed(normalUnitValue_arr[storeNum_toview]);
					}
			          var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+need_handle_dimensionalityName+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+tar.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+tar.seriesName+":</span></p>";
						var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+tar.name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";

						var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
						var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
						var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(tar.data.tongbi)*100).toFixed(2)+"%</p>";
						var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(tar.data.huanbi)*100).toFixed(2)+"%</p>";
						if(showTongbiMeasureArray.indexOf(need_handle_measureName)!=-1){
							leftDiv += leftTongbi;
							rightDiv += rightTongbi;
						}
						if(showHuanbiMeasureArray.indexOf(need_handle_measureName)!=-1){
							leftDiv += leftHuanbi;
							rightDiv += rightHuanbi;
						}
						leftDiv += "</div>";
						rightDiv += "</div>";

			         return leftDiv + rightDiv;
			    		 }
				 	},
				    xAxis: {
				     	 type : 'value',
				     	// name:need_handle_measureName,
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
							color:"black",
							formatter:function(value){
								if(value.length > 6){
									value = value.substring(0,6) + '...';
								}
								return value;
							}
						},
						// name:need_handle_dimensionalityName,
						nameGap:10,
						nameLocation:"end",
				    },
				    grid: {
			      		  containLabel: true,
			      		  left:30,
			      		  // bottom:120
					  	// bottom:dimensionality_need_show.length > 15 ? 120 : 80
					  	bottom:dimensionality_need_show.length > 15 ? "20%" : "18%",
					  	top:"8%"

			  		  },
				      dataZoom:[
			    			{
				    		type: 'slider',
	           			 	show: dimensionality_need_show.length > 15,
	           			 	filterMode:"filter",
	           			 	backgroundColor:"#f5f5f5",
	           			 	fillerColor:"#dedede",
	           			 	borderColor:"#f5f5f5",
	           			 	showDataShadow:false,
				            yAxisIndex: [0],
				            height:10,
				            handleStyle:{
				            		color:"#dedede"	
				            },
				            startValue:0,
				            endValue:dimensionality_need_show.length > 15 ? 15 : null,
				            orient:"horizontal",
				            // bottom:35,
				            bottom:0,
			          		handleSize:12,
			            	maxValueSpan:15,
			            	throttle:100,
			            	handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",				            
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
				            name: [drag_measureCalculateStyle_arr[storeNum_toview][need_handle_measureName]],
				            type: 'bar',
				            stack: '总量',
				            label: {
				                normal: {
				                	show:false,
				                    // show: dimensionality_need_show.length < 25,
				                    position: 'right',
				                    formatter:function(params){
				                    		if(normalUnitValue_arr[storeNum_toview] != -1){
				                    			return params.value.toFixed(normalUnitValue_arr[storeNum_toview]);
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
			
			setTimeout(function (){
                mycharts.hideLoading();
                mycharts.setOption(option);
                // $("."+tempSaveClassName+"").data("dataShow",option.series.label.normal.show);
                elementContent($("."+tempSaveClassName+""),option);
            }, 200)
		});
		
 }
 // gantt_generate_fun();



//判断传入参数不同调用不同图形

switch(chart_type_need)
{
case "waterWall":
	//调用瀑布图
	waterWall_generate_fun(storeNum_toview);
  break;
case "cake":
	//调用饼图
  	cake_generate_fun(storeNum_toview);
  break;
  case "scale":
  //调用范围图
//	scale_generate_fun();
  	area_generate_fun(storeNum_toview);
  break;
  case "area":
  //调用面积图
  	area_generate_fun(storeNum_toview);
  break;
  case "gantt":
  //调用甘特图
  	gantt_generate_fun(storeNum_toview);
  	break;
  // 地图
  case "addressMap":
   if(drill == undefined){
   	 address_map_fun(storeNum_toview);
   	}else{
   	address_map_fun(storeNum_toview,"drill");
   	}
    break;
default:

}
// 记录当前图形的类型
currentChatType = chart_type_need;

}




// end------------------
// 多个维度多个度量
function reporting_many_de_many_me_handle(chart_type_need,storeNum_toview,freeCount){
		var all_dimensionality = specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["row"]["dimensionality"].concat(drag_row_column_data_arr[storeNum_toview]["column"]["dimensionality"]));
		var all_measure = specialRemoveDataTypeHandle(drag_row_column_data_arr[storeNum_toview]["row"]["measure"].concat(drag_row_column_data_arr[storeNum_toview]["column"]["measure"]));
	//释放图表实例
	if(freeCount != undefined){
		var mycharts = echarts.getInstanceByDom($(".new_view_main[_echarts_instance_="+freeCount+"]").get(0));
	}else{
		var mycharts = echarts.getInstanceByDom($("."+viewshow_class+"").get(0));
		if(!mycharts){
				mycharts = 	echarts.init($("."+viewshow_class+"").get(0));
		}
		if(currentChatType != chart_type_need){
			if(echarts.getInstanceByDom($("."+viewshow_class+"").get(0))){
				echarts.getInstanceByDom($("."+viewshow_class+"").get(0)).clear();
			}
		}
		var commonLegend = [];
		for (var k = 0;k <  all_measure.length;k++) {
			commonLegend.push(drag_measureCalculateStyle_arr[storeNum_toview][all_measure[k]])
		}
	}	




	mycharts.off("click");
	mycharts.on("click",function(params){
		if(manyClickLoading){
			manyClickLoading = false;
			clickDrillStatementsFunction(params,$(params.event.event.target).parents(".new_view_content"),JSON.parse(JSON.stringify(storeNum_toview)),JSON.parse(JSON.stringify(viewshow_class)));
		}
		setTimeout(function(){manyClickLoading = true;},500)
	});

	if(mycharts._loadingFX == undefined){
		mycharts.showLoading({
			 text: '数据获取中',
				 color: '#c23531',
				 textColor: '#000',
				 maskColor: 'rgba(255, 255, 255, 0.8)',
				 zlevel: 0
		});
	}
	
	// console.log(drag_row_column_data_arr[storeNum_toview])


	var last_dimensionaity = all_dimensionality[all_dimensionality.length - 1];
	
	// 1、折线图
	function polyLine_generate_fun(storeNum_toview){
		if(statements_tonghuanbi_arr[storeNum_toview] != undefined){
			var tempThData = JSON.parse(statements_tonghuanbi_arr[storeNum_toview]);
			showTongbiMeasureArray = tempThData[0];
			showHuanbiMeasureArray = tempThData[1];
		}
			var tempSaveClassName = viewshow_class;
			reporting_measure_Hanlde(all_dimensionality,all_measure,null,storeNum_toview,function(data){
				var option = {
					title:[{
					text:"折线图",
					show:false
					},
					{
					  	text: "单位: "+valueUnitValue_arr[storeNum_toview],
					  	bottom:40,
					  	show:false,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
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
	       			backgroundColor:'rgba(255,255,255,0.95)',
			    		extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
	       			formatter:function(params){
						var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'>";
						var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'>";
						for(var i = 0;i < all_dimensionality.length;i++){
							var aP = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_dimensionality[i]+":</p>";
							leftDiv+=aP;
						}
       					for(var i = 0;i < params.length;i++){
       						var needValue = params[i].value;
       						if(normalUnitValue_arr[storeNum_toview] != -1){
					  	 			needValue = needValue.toFixed(normalUnitValue_arr[storeNum_toview]);
					 		 		}
       						leftDiv += "<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params[i].color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params[i].seriesName+":</span></p>";
									if(i == 0){
										for(var k = 0;k < params[i].data.theDimeInfo.length;k++){
											rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params[i].data.theDimeInfo[k]+"</p>";
										}
									}
									rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
									var leftTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params[i].color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+"同比"+":</span></p>";
									var leftHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params[i].color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+"环比"+":</span></p>";
									var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params[i].data.tongbi)*100).toFixed(2)+"%</p>";
									var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params[i].data.huanbi)*100).toFixed(2)+"%</p>";
									if(showTongbiMeasureArray.indexOf(params[i].data.measureName) != -1){
										leftDiv += leftTongbi;
										rightDiv += rightTongbi;
									}
									if(showHuanbiMeasureArray.indexOf(params[i].data.measureName) != -1){
										leftDiv += leftHuanbi;
										rightDiv += rightHuanbi;
									}
       					}
								// for(var i = 0;i < params.length;i++){
                //
								// }
       					leftDiv+= "</div>";
       					rightDiv+= "</div>";
			        	return leftDiv + rightDiv;
					}
	    			 }, 
	    			legend: {
	       		 	data:commonLegend,
	       		 	left:"center",
	       		 	bottom:"6%",
	       		 	width:"60%",
	    			},
	    		// 	 grid: {
			    //     containLabel: true,
			    //     bottom:120
			    // },
			    grid:[],
			    color:allColorsDict[currentColorGroupName_arr[storeNum_toview]],
				toolbox: {
			        show: true,
			        feature: {
			            // dataView: {readOnly: true},
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
	    			 	// {
	    			 	// 	type:"value"
	    			 	// },
	    			 ],
	    			 series:[]
				};
				var measure_show_data_arr = [];
				var dimensionality_show_data_arr = [];
				var  valueMax = data[0][drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]];
				
				for(var i = 0; i < data.length;i++){
					var aData = data[i];
					var theDimeInfo = [];
					for(var k = 0;k < all_dimensionality.length;k++){
						theDimeInfo.push(aData[all_dimensionality[k]]);
					}
					for(var measure_i = 0;measure_i < all_measure.length;measure_i++){
						var aMeasure = all_measure[measure_i];
						if(valueMax < aData[drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]]){
							valueMax = aData[drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]];
						}
						if(!measure_show_data_arr[measure_i]){
							measure_show_data_arr[measure_i] = [{"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]]/allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":aData[drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"theDimeInfo":theDimeInfo,"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]],"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]],"measureName":aMeasure}];
						}else{
							measure_show_data_arr[measure_i].push({"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]]/allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":aData[drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"theDimeInfo":theDimeInfo,"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]],"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]],"measureName":aMeasure});
						}
					}
					for(var dimensionality_i = 0;dimensionality_i < all_dimensionality.length;dimensionality_i++){
						var aDimensionality = all_dimensionality[dimensionality_i];
						if(!dimensionality_show_data_arr[dimensionality_i]){
							dimensionality_show_data_arr[dimensionality_i] = [aData[aDimensionality]];
						}else{
							dimensionality_show_data_arr[dimensionality_i].push(aData[aDimensionality]);

							// var index = dimensionality_show_data_arr[dimensionality_i].indexOf(aData[aDimensionality]);
							// if(index == -1){
							// 	dimensionality_show_data_arr[dimensionality_i].push(aData[aDimensionality]);
							// }else if(index != -1){
							// 	if(all_dimensionality[dimensionality_show_data_arr.length - 1] != all_dimensionality[dimensionality_i]){
							// 		var lastVal = dimensionality_show_data_arr[dimensionality_i][dimensionality_show_data_arr[dimensionality_i].length-1];
							// 		if(/YZYPD/.test(lastVal)){
							// 			lastVal = lastVal.split("YZYPD")[1];
							// 		}
							// 		if(lastVal == aData[aDimensionality]){
							// 		// if(dimensionality_show_data[k][dimensionality_show_data[k].length-1] == aData[all_dimensionality[k]]){
							// 			dimensionality_show_data_arr[dimensionality_i].push("YZYPD" + aData[aDimensionality]);
							// 		}else{
							// 			dimensionality_show_data_arr[dimensionality_i].push(aData[aDimensionality]);
							// 		}
							// 	}else{
							// 		dimensionality_show_data_arr[dimensionality_i].push(aData[aDimensionality]);
							// 	}
							// }
						}
					}
				}
				var dataZoomXindexArray = [];
				for(var i = dimensionality_show_data_arr.length - 1;i >= 0;i--){
					var obj = {
						// name:all_dimensionality[i],
						nameLocation:"start",
						nameGap:15,
						nameRotate:-15,
						type: 'category',
						boundaryGap:false,
						data:dimensionality_show_data_arr[i],
						axisLabel:{
							show:true,
							rotate:-15,
							fontSize:10,
							interval:0,
							color:"black",
							interval:function(index,value){return !/^YZYPD/.test(value)},
							formatter:function(value){
								if(value.length > 6){
									value = value.substring(0,6) + '...';
								}
								return value;
							}
						},

						gridIndex:dimensionality_show_data_arr.length - 1 - i

					}
					var aGrid = {
						containLabel:true,
					}
					aGrid["left"] = "7%";
					// aGrid["bottom"] = 60 + 30 * i;
					aGrid["bottom"] = (18 + 10 * i) + '%';
					aGrid["top"] = "5%";
					if(i != dimensionality_show_data_arr.length - 1){
						aGrid["tooltip"] = {show:false};
					}
					option["grid"].push(aGrid);
					option["xAxis"].push(obj);
					option["yAxis"].push({type:"value",show:i == dimensionality_show_data_arr.length - 1,min:0,max:valueMax,gridIndex:dimensionality_show_data_arr.length - 1 - i});
					dataZoomXindexArray.push(i);
				}
				for(var i = 0; i < measure_show_data_arr.length;i++){
					var measure = measure_show_data_arr[i];
           			var obj = {name:drag_measureCalculateStyle_arr[storeNum_toview][all_measure[i]],type:"line",smooth:true,data:measure,label:{
           				normal:{
           					show:false,
           					// show:dimensionality_show_data_arr[dimensionality_show_data_arr.length - 1].length < 25 && all_measure.length < 3,
           					position:"top",
           					offset:[10,0],
           					formatter:function(params){
		                    		// if(normalUnitValue_arr[storeNum_toview] != -1){
		                    		// 	return params.value.toFixed(normalUnitValue_arr[storeNum_toview]);
		                    		// }else{
		                    		// 	return params.value;
		                    		// }
		                    		if(normalUnitValue_arr[storeNum_toview] != -1){
		                    			return params.value.toFixed(normalUnitValue_arr[storeNum_toview]);
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
           			 	backgroundColor:"#f5f5f5",
           			 	fillerColor:"#dedede",
           			 	borderColor:"#f5f5f5",
           			 	showDataShadow:false,
			            xAxisIndex: dataZoomXindexArray,
			            height:10,
			            handleStyle:{
			            		color:"#dedede"	
			            },
			            bottom:0,
			            startValue:0,
			            endValue:dimensionality_show_data_arr[dimensionality_show_data_arr.length - 1].length > 15 ? 15 : null,
			          	handleSize:12,
			            maxValueSpan:15,
			            throttle:100,
			            handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
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
				
			setTimeout(function (){
                mycharts.hideLoading();
                mycharts.setOption(option);
                // $("."+tempSaveClassName+"").data("dataShow",option.series.label.normal.show);
                elementContent($("."+tempSaveClassName+""),option);
            }, 200)
			});
					
	}

//2、对比条形图
function comparisonStrip_generate_fun(storeNum_toview){
		if(statements_tonghuanbi_arr[storeNum_toview] != undefined){
			var tempThData = JSON.parse(statements_tonghuanbi_arr[storeNum_toview]);
			showTongbiMeasureArray = tempThData[0];
			showHuanbiMeasureArray = tempThData[1];
		}
			var tempSaveClassName = viewshow_class;
			reporting_measure_Hanlde(all_dimensionality,all_measure,null,storeNum_toview,function(data){
				var measure_show_data = [];
				var dimensionality_show_data = [];
				for (var i = 0;i < data.length;i++) {
					var aData = data[i];
					dimensionality_show_data.push(aData[all_dimensionality[0]]);
					for (var j = 0;j < all_measure.length;j++) {
						var aMeasure = all_measure[j];
						if(!measure_show_data[j]){
							measure_show_data[j] = [{"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]] / allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":aData[drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]],"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]],"measureName":aMeasure}];
						}else{
							measure_show_data[j].push({"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]] / allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":aData[drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]],"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][aMeasure]],"measureName":aMeasure});
						}
					}
				}
				var option = {
					title: [{
						text: "对比条形图",
						show:false
					},
					{
					  	text: "单位: "+valueUnitValue_arr[storeNum_toview],
					  	// bottom:40,
					  	bottom:dimensionality_show_data.length > 15 ? 40 : 20,
					  	show:false,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
					  	}
					  }
					],
					legend: {
						data: commonLegend,
						left:"center",
						// bottom:40,
					  	// bottom:dimensionality_show_data.length > 15 ? 40 : 20,
					  	bottom:dimensionality_show_data.length > 15 ? "7%" : "6%",
						width:"60%",
						textStyle: {
							color: '#00000',
						},
					},
					color:allColorsDict[currentColorGroupName_arr[storeNum_toview]],
					toolbox: {
				        show: true,
				        feature: {
				            // dataView: {readOnly: true},
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
						backgroundColor:'rgba(255,255,255,0.95)',
			    		    extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
						formatter:function(params){
							var needValue = params.value;
							  if(normalUnitValue_arr[storeNum_toview] != -1){
							  	 needValue = needValue.toFixed(normalUnitValue_arr[storeNum_toview]);
							  }
			       		  	var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_dimensionality[0]+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
										var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
										var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
										var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
										var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
										var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
										if(showTongbiMeasureArray.indexOf(params.data.measureName) != -1){
											leftDiv += leftTongbi;
											rightDiv += rightTongbi;
										}
										if(showHuanbiMeasureArray.indexOf(params.data.measureName) != -1){
											leftDiv += leftHuanbi;
											rightDiv += rightHuanbi;
										}
										leftDiv+= "</div>";
		       					rightDiv+= "</div>";
			        			 return leftDiv + rightDiv;
						}
					},
					grid: [{
						show: false,
						left: '4%',
					  	bottom:dimensionality_show_data.length > 14 ? "23%" : "20%",
						top:"6%",
						containLabel: true,
						width: '47%',
					}, {
						show: false,
						left: '51%',
					  	bottom:dimensionality_show_data.length > 14 ? "23%" : "20%",
					  	top:"12%",
						width: '0%',
					}, {
						show: false,
						right: '4%',
					  	bottom:dimensionality_show_data.length > 14 ? "23%" : "20%",
						top:"6%",
						containLabel: true,
						width: '47%',
					}, ],
					xAxis: [{
						gridIndex: 0,
						type: 'value',
						inverse: true,
						splitNumber:4,
						// minInterval:4,
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
						splitNumber:3,
						// minInterval:4,
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
					}],
				
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
									fontSize: 11,
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
           			 	backgroundColor:"#f5f5f5",
           			 	fillerColor:"#dedede",
           			 	borderColor:"#f5f5f5",
           			 	showDataShadow:false,
			            yAxisIndex: [0,1,2],
			            height:10,
			            handleStyle:{
			            		color:"#dedede"	
			            },
			            startValue:0,
			            endValue:dimensionality_show_data.length > 15 ? 15 : null,
			            orient:"horizontal",
				        // bottom:35,
				        bottom:0,
				        left:"4%",
				        right:"4%",
			          	handleSize:12,
			            maxValueSpan:15,
			            throttle:100,
			            handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",				        
			    			},
			    			{
			    			type: 'slider',
           			 	show: false,
           			 	filterMode:"empty",
			            xAxisIndex: [0,1,2],
			    			}
			    		],
					series: [{
						name: drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]],
						type: 'bar',
						xAxisIndex: 0,
						yAxisIndex: 0,
						barGap: 20,
						label: {
							normal: {
								show:false,
								// show: dimensionality_show_data.length < 25,
								position:"left",
								formatter:function(params){
			                    		if(normalUnitValue_arr[storeNum_toview] != -1){
			                    			return params.value.toFixed(normalUnitValue_arr[storeNum_toview]);
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
						name: drag_measureCalculateStyle_arr[storeNum_toview][all_measure[1]],
						type: 'bar',
						barGap: 20,
						xAxisIndex: 2,
						yAxisIndex: 2,
						label: {
							normal: {
								show: false,
								position:"right",
								formatter:function(params){
			                    		if(normalUnitValue_arr[storeNum_toview] != -1){
			                    			return params.value.toFixed(normalUnitValue_arr[storeNum_toview]);
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
		
			setTimeout(function (){
                mycharts.hideLoading();
                mycharts.setOption(option);
                // $("."+tempSaveClassName+"").data("dataShow",option.series.label.normal.show);
                elementContent($("."+tempSaveClassName+""),option);
            }, 200)
			});	
}







 // 3、堆积柱状图 2-3个维度，1个度量
 //	type：number_bar、number_liner、percentage_bar、percentage_liner
 	function stackedBar_generate_fun(bar_type,storeNum_toview){
		if(statements_tonghuanbi_arr[storeNum_toview] != undefined){
			var tempThData = JSON.parse(statements_tonghuanbi_arr[storeNum_toview]);
			showTongbiMeasureArray = tempThData[0];
			showHuanbiMeasureArray = tempThData[1];
		}
 		var tempSaveClassName = viewshow_class;
 		var  chartTile = {"number_bar":"堆积柱状图","number_liner":"堆积条形图","percentage_bar":"百分比堆积柱","percentage_liner":"百分比堆积条形"}

		reporting_measure_Hanlde(all_dimensionality,all_measure,null,storeNum_toview,function(data){
				var measureName = all_measure[0];
				var needMeasureData = data;
				var dimensionality_arr= []; // 各个维度的数组,绘制图形需要使用
				var need_show_dimensionality_arr = [];
				var need_show_dime_name_arr = all_dimensionality.slice(0,all_dimensionality.length-1);
				var preChangeData = null;
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
										// need_show_dimensionality_arr[j].push(({"value":" ","count":1}));
										need_show_dimensionality_arr[j].push(({"value":"YZYPD"+aData[all_dimensionality[j]],"count":1}));
									}
								}else{

									if(j != 0 && need_show_dimensionality_arr[j-1].length > need_show_dimensionality_arr[j].length){
										need_show_dimensionality_arr[j].push(({"value":aData[all_dimensionality[j]],"count":1}));
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
						preChangeData = aData[all_dimensionality[0]];
						measure_Data_arr.push([{"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]],"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]],"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]]}]);
					}else{
						if(i > 0){
							if(predime != nowdime){
								if(preChangeData != aData[all_dimensionality[0]]){
									groupArr.push([nowdime]);
									measure_Data_arr.push([{"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]],"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]],"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]]}]);
									preChangeData = aData[all_dimensionality[0]];
								}else{
									confir_max_obj[dime] ++;
									groupArr[groupArr.length - 1].push(nowdime);
									measure_Data_arr[measure_Data_arr.length - 1].push({"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]],"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]],"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]]});
									max = max > confir_max_obj[dime] ? max:confir_max_obj[dime];
								}

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
					  	text: "单位: "+valueUnitValue_arr[storeNum_toview],
					  	bottom:40,
					  	show:false,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
					  	}
					  }
					],
					legend:{
						data:[drag_measureCalculateStyle_arr[storeNum_toview][measureName]],
						left:'center',
						bottom:"8%",
						width:"60%",
					},
					 grid: [],
					toolbox: {
				        show: true,
				        feature: {
				            // dataView: {readOnly: true},
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
   					color:allColorsDict[currentColorGroupName_arr[storeNum_toview]],
					tooltip : {
	        				trigger: 'item',
	        				backgroundColor:'rgba(255,255,255,0.95)',
			    		    extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
	        				formatter:function(params){
	        					var val = params.value;
	        					if (bar_type == "percentage_liner" || bar_type == "percentage_bar") {
	        						val = (Number(val) * 100).toFixed(2) + "%";

	        					}else{
	        						if(normalUnitValue_arr[storeNum_toview] != -1){
						  	 		val = val.toFixed(normalUnitValue_arr[storeNum_toview]);
						 		 }
	        					}
	        		var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'>";
							var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'>";
							for(var i = 0;i < all_dimensionality.length;i++){
								var aP = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_dimensionality[i]+":</p>";
								leftDiv+=aP;
							}
      					leftDiv += "<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
      					for(var k = 0;k < params.data.theDimeInfo.length;k++){
									rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.data.theDimeInfo[k]+"</p>";
								}
								rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+val+"</p>";
								var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
 							 var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
 							 var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
 							 var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
 							 if(showTongbiMeasureArray.indexOf(all_measure[0]) != -1){
 								 leftDiv += leftTongbi;
 								 rightDiv += rightTongbi;
 							 }
 							 if(showHuanbiMeasureArray.indexOf(all_measure[0]) != -1){
 								 leftDiv += leftHuanbi;
 								 rightDiv += rightHuanbi;
 							 }
								leftDiv+= "</div>";
       					rightDiv+= "</div>";
			        			 return leftDiv + rightDiv;
	        			}
				  	},
	    				 xAxis:[

	    				 ],
	    				 yAxis:[
	    				 ],
	    				 series:[]
				};
			//number_liner、percentage_bar、percentage_liner
			var axisLabelSetteing = 	{type:"value",gridIndex:0,nameLocation:"end",nameGap:10};
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
				var seriesdata = [];
				var helpSum = 0;
				name = drag_measureCalculateStyle_arr[storeNum_toview][measureName];
				stack = "use";
				for (var j =0;j < groupArr.length;j++) {
						var val = null;
						var tongbiVal = null;
						var huanbiVal = null;
						if(measure_Data_arr[j][i]){
							val = measure_Data_arr[j][i].value;
							tongbiVal = measure_Data_arr[j][i].tongbi;
							huanbiVal = measure_Data_arr[j][i].huanbi;
						}
						var valueSum = calculateArraySpecialFieldSum(measure_Data_arr[j],"value");
						if (bar_type == "percentage_liner" || bar_type == "percentage_bar") {
							val = (val / valueSum.toFixed(4));
						}else{
							if(valueMax < valueSum){
								valueMax = valueSum;
							}
						}
						var theDimeInfo = [];
						for(var k =0;k < all_dimensionality.length;k++){
							var index = i;
							if(j > 0){
								for(var kk = 0;kk < j;kk ++){
									index +=  groupArr[kk].length;
								}
							}
							if(data[index]){
								theDimeInfo.push(data[index][all_dimensionality[k]]);
							}
						}
						seriesdata.push({value:val / allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":val,name:groupArr[j][i],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":groupArr[j][i]},"theDimeInfo":theDimeInfo,"tongbi":tongbiVal,"huanbi":huanbiVal});
				}

				var obj = {
					name:name,
					type:"bar",
					stack:stack,
					xAxisIndex:0,
					yAxisIndex:0,
					itemStyle:{
						normal:{
							color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][i % allColorsDict[currentColorGroupName_arr[storeNum_toview]].length]
						}
					},
					label:{
						normal:{
							show:false,
							// show:need_show_dimensionality_arr[need_show_dimensionality_arr.length - 1].length < 25,
							position:"insideRight",
							formatter:function(params){
			                    		if(normalUnitValue_arr[storeNum_toview] != -1){
			                    			return params.value.toFixed(normalUnitValue_arr[storeNum_toview]);
			                    		}else{
			                    			return params.value;
			                    		}
			                 },
						}
					},
					"data":seriesdata,
					z:3
				}
				option["series"].push(obj);
			}

//  坐标轴设置值
			for (var k = need_show_dimensionality_arr.length - 1;k >= 0;k--){
				var obj = {
					// name:need_show_dime_name_arr[k],
					// nameLocation:"end",
					// nameGap:25,
					// nameRotate:25,
					nameGap:10,
					nameRotate:15,
					type: 'category',
					axisTick:{
						inside:false,
						interval:function(index,value){return !/^YZYPD/.test(value)}
					},
					axisLabel:{
						color:"black",
						rotate:25,
						fontSize:10,
						interval:function(index,value){return !/^YZYPD/.test(value)},
						formatter:function(value){
							if(value.length > 3){
								value = value.substring(0,3) + '...';
							}
							return value;
						}
					},
					data:need_show_dimensionality_arr[k],
					gridIndex:need_show_dimensionality_arr.length - 1 - k,
				}

				var aGrid = {
					show:false,
					containLabel:true,
				}

				if (bar_type == "number_bar" || bar_type == "percentage_bar") {
					obj["nameLocation"] = "start";
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
							"data":[{"value":valueMax / allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":valueMax}],
							itemStyle:{
								normal:{
									opacity:0
								}
							},
							cursor:"default"
						}
						option["series"].push(aSeriesData);

					}
					aGrid["left"] = "5%";
					aGrid["bottom"] = (20 + 10 * k) +'%';
					// aGrid["bottom"] = 60 + 35*k;
					aGrid["top"] = "5%";


				}else{
					obj["nameLocation"] = "end";
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
							"data":[{"value":valueMax / allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":valueMax}],
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
					// aGrid["left"] =  60 + 70*k;

					aGrid["left"] =  70 + 50 * k;

					aGrid["bottom"] = "26%";
					aGrid["top"] = "6%";

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
           			 	backgroundColor:"#f5f5f5",
           			 	fillerColor:"#dedede",
           			 	borderColor:"#f5f5f5",
           			 	showDataShadow:false,
			            xAxisIndex: dataZoomXindexArray,
			            height:10,
			            handleStyle:{
			            		color:"#dedede"
			            },
			            bottom:0,
			            startValue:0,
			            endValue:need_show_dimensionality_arr[need_show_dimensionality_arr.length - 1].length >15 ? 15 : null,
						handleSize:12,
			            maxValueSpan:15,
			            throttle:100,
			            handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
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
           			 	backgroundColor:"#f5f5f5",
           			 	fillerColor:"#dedede",
           			 	borderColor:"#f5f5f5",
           			 	showDataShadow:false,
			            yAxisIndex: dataZoomXindexArray,
			            height:10,
			            handleStyle:{
			            		color:"#dedede"
			            },
			            startValue:0,
			            endValue:need_show_dimensionality_arr[need_show_dimensionality_arr.length - 1].length >15 ? 15 : null,
			            orient:"horizontal",
				        bottom:0,
			          	handleSize:12,
			            maxValueSpan:15,
			            throttle:100,
			            handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
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
			setTimeout(function (){
                mycharts.hideLoading();
                mycharts.setOption(option);
                // $("."+tempSaveClassName+"").data("dataShow",option.series.label.normal.show);
                elementContent($("."+tempSaveClassName+""),option);
            }, 200)
				
			});
			
 			
 }


// 关系图
	function reliationTree_generate_fun(storeNum_toview){
		if(statements_tonghuanbi_arr[storeNum_toview] != undefined){
			var tempThData = JSON.parse(statements_tonghuanbi_arr[storeNum_toview]);
			showTongbiMeasureArray = tempThData[0];
			showHuanbiMeasureArray = tempThData[1];
		}
		var tempSaveClassName = viewshow_class;
		var categorys = [];// 分类，主要用作图例
		var need_all_nodes = []; // 所需要的所有节点
		var need_all_link = [];
		var count = 0;
		var arr = [];
		// var tempArr = [];

		for(var i =0;i < all_dimensionality.length;i++){
			(function(index){
				var need_dimensionality = all_dimensionality.slice(0,index+1);
				reporting_measure_Hanlde(need_dimensionality,all_measure,null,storeNum_toview,function(data){
					for(var j = 0;j < data.length;j++){
						var aData = data[j];
						var name = "";
						var str = "";

						for(var k =0;k < need_dimensionality.length;k++){
							name += aData[need_dimensionality[k]] +"_YZYPD_"; 
							// console.log(name);
						}

						//关系图报错dataIndex 有重复节点或id解决方法
						if(arr[arr.length-1] != name){
							arr.push(name);
							// console.log(arr);
							for(var l=0;l<arr.length;l++){
								str = arr[l];
							}
							// console.log(str);
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
							"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]]/allValueUnitDict[valueUnitValue_arr[storeNum_toview]],
							"originValue":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]],
							// "name":name,
							"name":str,
							"fixed":false,
							"draggable":true,
							"category":categorys.hasObject("name",aData[need_dimensionality[0]]),
							// "dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},
							"dirllInfo":{"currentField":all_dimensionality[index],"currentValue":aData[all_dimensionality[index]]},
							"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]],
							"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]],
							"viewtype":"relational",
							label:{
								normal:
								{
									// show:false,
									show:need_dimensionality.length < 25,
									formatter:function(params){
										// console.log(params);
										var names = params["name"].split("_YZYPD_");
										var needValue = params.value;
										  if(normalUnitValue_arr[storeNum_toview] != -1){
						  	 				needValue = needValue.toFixed(normalUnitValue_arr[storeNum_toview]);
										  }
										return names[names.length - 2]+":"+needValue;
									}
								}
							}
						}
						// console.log(aNode)
						// need_all_nodes.push(aNode);
						if(aNode["name"] != ""){
							need_all_nodes.push(aNode);
						}
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
					  	text: "单位: "+valueUnitValue_arr[storeNum_toview],
					  	bottom:40,
					  	show:false,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
					  	}
					  }
				],
				legend:[{
					data:categorys,
					left:"center",
					bottom:"6%",
					width:"60%",
					type:'scroll',
				}],
				toolbox: {
			        show: true,
			        feature: {
			            // dataView: {readOnly: true},
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
				color:allColorsDict[currentColorGroupName_arr[storeNum_toview]],
				tooltip:{
					backgroundColor:'rgba(255,255,255,0.95)',
			    		extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
					formatter:function(params){
						if(params["dataType"] == "edge"){
//							var name = params["name"];
//							var nameArr = name.split(" > ");
//							var ori = nameArr[0].split("_YZYPD_");
//							var target = nameArr[1].split("_YZYPD_");
//							return ori[ori.length - 2] + " > "+ target[target.length - 2];
						}else{
							var needValue = params.value;
							// if(normalUnitValue != -1){
						 //  	 needValue = needValue.toFixed(normalUnitValue);
						 //  	}
						 	if(normalUnitValue_arr[storeNum_toview] != -1){
		  	 					needValue = needValue.toFixed(normalUnitValue_arr[storeNum_toview]);
						  	}
							var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+params.data.dirllInfo.currentField+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";

							var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.data.dirllInfo.currentValue+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";

							var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
							var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
							var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
							var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
							if(showTongbiMeasureArray.indexOf(all_measure[0]) != -1){
								leftDiv += leftTongbi;
								rightDiv += rightTongbi;
							}
							if(showHuanbiMeasureArray.indexOf(all_measure[0]) != -1){
								leftDiv += leftHuanbi;
								rightDiv += rightHuanbi;
							}
							leftDiv+= "</div>";
							rightDiv+= "</div>";

							return leftDiv + rightDiv;

						}

					},
					textStyle:{
						fontSize:12
					}
				},
		
				series:[
					{
						name:drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]],
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
							// console.log(params);
							var names = params["name"].split("_YZYPD_");
							var rs = names[names.length - 2]+":"+params.value;
							return [rs.visualLength(12)+15,20]
						},
					}
				]	
			}
			mycharts.clear();
			
			setTimeout(function (){
                mycharts.hideLoading();
                mycharts.setOption(option);
                // $("."+tempSaveClassName+"").data("dataShow",option.series.label.normal.show);
                elementContent($("."+tempSaveClassName+""),option);
            }, 200)
		}
	}

// 柱状图
	function histogram_generate_fun(storeNum_toview){
		if(statements_tonghuanbi_arr[storeNum_toview] != undefined){
			var tempThData = JSON.parse(statements_tonghuanbi_arr[storeNum_toview]);
			showTongbiMeasureArray = tempThData[0];
			showHuanbiMeasureArray = tempThData[1];
		}
		var tempSaveClassName = viewshow_class;
		reporting_measure_Hanlde(all_dimensionality,all_measure,null,storeNum_toview,function(data){
			var series = [];
			var dimensionality_show_data = [];
			var needXais = [];
			var gridArr = [];
			var needYais = [{
			    	show:true,
			        type: "value",
			        //name: commonLegend.join("/"),
			        nameLocation:"middle",
			        nameGap:60,
			        gridIndex:0,
			        z:1
					
			    }];
			 var valueMax = 0;
			for(var i = 0;i < data.length;i++){
				var aData = data[i];
				var theDimeInfo = [];
				for(var k = 0;k < all_dimensionality.length;k++){
					theDimeInfo.push(aData[all_dimensionality[k]]);
				}
				for(var j = 0;j < all_measure.length;j++){ // 计算出series
					if(valueMax < aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]]){
						valueMax = aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]];
					}		
					if(!series[j]){
						series[j] = {
							"name":drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]],
							"type":"bar",
							"xAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
							"yAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
							"data":[{"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]] / allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]],"theDimeInfo":theDimeInfo,"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]],
							"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]],"measureName":all_measure[j]}],
							label:{
								normal:{
									show:false,
									// show:all_dimensionality.length < 25 && all_measure.length < 3,
									position:"top",
									formatter:function(params){
				                    		if(normalUnitValue_arr[storeNum_toview] != -1){
				                    			return params.value.toFixed(normalUnitValue_arr[storeNum_toview]);
				                    		}else{
				                    			return params.value;
				                    		}
			                   		},
								}
							},
							z:3
						};
					}else{
						series[j]["data"].push({"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]]/allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]],"theDimeInfo":theDimeInfo,"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]],
						"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]],"measureName":all_measure[j]});
					}
				}
				var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
				for(var k = 0;k < dimension_length;k++){
					if(!dimensionality_show_data[k]){
						dimensionality_show_data[k] = [aData[all_dimensionality[k]]];
					}else{
						dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						// var index = dimensionality_show_data[k].indexOf(aData[all_dimensionality[k]]);
						// if(index == -1){
						// 	dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						// }else if(index != -1){
						// 	// dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
						// 	//dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						// 	// if(all_dimensionality[dimensionality_show_data.length - 1] != all_dimensionality[k]){
						// 	// 	dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
						// 	// }else{
						// 	// 	dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						// 	// }
						// 	if(all_dimensionality[dimensionality_show_data.length - 1] != all_dimensionality[k]){
						// 		var lastVal = dimensionality_show_data[k][dimensionality_show_data[k].length-1];
						// 		if(/YZYPD/.test(lastVal)){
						// 			lastVal = lastVal.split("YZYPD")[1];
						// 		}
						// 		if(lastVal == aData[all_dimensionality[k]]){
						// 		// if(dimensionality_show_data[k][dimensionality_show_data[k].length-1] == aData[all_dimensionality[k]]){
						// 			dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
						// 		}else{
						// 			dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						// 		}
						// 	}else{
						// 		dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						// 	}
						// }	
					}
				}
			}
			
			for(var i = 0;i < dimensionality_show_data.length;i++){
				var aX = {
					"show":true,
					// "name":all_dimensionality[i],
					"nameGap":30,
					"nameLocation":"start",
					// "nameLocation":"end",
					"nameRotate":15,
					"type":"category",
					
					axisTick:{
						inside:false,
						interval:function(index,value){return !/^YZYPD/.test(value)}
					},
					axisLabel:{
						color:"black",
						rotate:15,
						fontSize:10,
						interval:function(index,value){return !/^YZYPD/.test(value)},
						formatter:function(value){
							if(value.length > 3){
								value = value.substring(0,3) + '...';
							}
							if(value == 'und...'){
								return '';
							}else{
								return value;
							}
						}
					},
					position:"bottom",
					"data":dimensionality_show_data[i],
					gridIndex:dimensionality_show_data.length - i - 1
				}
				var aGrid = {
					containLabel:true,
				}
				aGrid["left"] = "5%";
				aGrid["bottom"] = (18 + 9 * (dimensionality_show_data.length -1 - i)) + '%';
				// aGrid["bottom"] = 60 + 35*(dimensionality_show_data.length - 1 - i);
				aGrid["top"] = "5%";		
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
						"data":[{"value":valueMax/allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":valueMax}],
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
					  	text: "单位: "+valueUnitValue_arr[storeNum_toview],
					  	bottom:40,
					  	show:false,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
					  	}
					  }
			    ],
			    tooltip: {
			        trigger: 'item',
			        axisPointer: { // 坐标轴指示器，坐标轴触发有效
			            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			        },
			        backgroundColor:'rgba(255,255,255,0.95)',
			    		extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
			        formatter:function(params){
			        		var needValue = params.value;
								  if(normalUnitValue_arr[storeNum_toview] != -1){
								  	 needValue = needValue.toFixed(normalUnitValue_arr[storeNum_toview]);
								  }
									var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'>";
									var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'>";
									for(var i = 0;i < all_dimensionality.length;i++){
										var aP = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_dimensionality[i]+":</p>";
										leftDiv+=aP;
									}
									leftDiv+="<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
									for(var k = 0;k < params.data.theDimeInfo.length;k++){
                     rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.data.theDimeInfo[k]+"</p>";
                  }
                  rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
									var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
									var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
									var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
									var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
									if(showTongbiMeasureArray.indexOf(params.data.measureName) != -1){
										leftDiv += leftTongbi;
										rightDiv += rightTongbi;
									}
									if(showHuanbiMeasureArray.indexOf(params.data.measureName) != -1){
										leftDiv += leftHuanbi;
										rightDiv += rightHuanbi;
									}
									leftDiv+= "</div>";
	       					rightDiv+= "</div>";
                 return leftDiv+rightDiv;
			        },
			        textStyle:{
			        		fontSize:12
			        }
			    },
			   legend: {
			        data: commonLegend,
					left:"center",
					bottom:"8%",
					width:"90%",
			    },
			    	color:allColorsDict[currentColorGroupName_arr[storeNum_toview]],
			    dataZoom:[
			    			{
			    		type: 'slider',
           			 	show: dimensionality_show_data[dimensionality_show_data.length - 1].length >15,
           			 	filterMode:"filter",
           			 	backgroundColor:"#f5f5f5",
           			 	fillerColor:"#dedede",
           			 	borderColor:"#f5f5f5",
           			 	showDataShadow:false,
			            xAxisIndex: dataZoomXindexArray,
			            height:10,
			            handleStyle:{
			            		color:"#dedede"	
			            },
			            bottom:0,
			            startValue:0,
			            endValue:dimensionality_show_data[dimensionality_show_data.length - 1].length >15 ? 15 : null,
			          	handleSize:12,
			            maxValueSpan:15,
			            throttle:100,
			            handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",			            
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
			            // dataView: {readOnly: true},
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

			setTimeout(function (){
                mycharts.hideLoading();
                mycharts.setOption(option);
                // $("."+tempSaveClassName+"").data("dataShow",option.series.label.normal.show);
                elementContent($("."+tempSaveClassName+""),option);
            }, 200)			
		});
	}
	// var maxLength = 0;
	
	// 条形图 
	function barChart_generate_fun(storeNum_toview){
		if(statements_tonghuanbi_arr[storeNum_toview] != undefined){
			var tempThData = JSON.parse(statements_tonghuanbi_arr[storeNum_toview]);
			showTongbiMeasureArray = tempThData[0];
			showHuanbiMeasureArray = tempThData[1];
		};
		var tempSaveClassName = viewshow_class;
		reporting_measure_Hanlde(all_dimensionality,all_measure,null,storeNum_toview,function(data){
			var series = [];
			var dimensionality_show_data = [];
			var needYais = [];
			var needXais = [
				{
			   	 	show:true,
			        type: "value",
					gridIndex:all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
					//name: commonLegend.join("\n"),
			        nameLocation:"end",
			        nameGap:10,
			    }
			];
			var gridArr = [];
			var valueMax = 0;
			
			for(var i = 0;i < data.length;i++){
				var aData = data[i];
				var theDimeInfo = [];
				for(var k = 0;k < all_dimensionality.length;k++){
					theDimeInfo.push(aData[all_dimensionality[k]]);
					// console.log(typeof(String(aData[all_dimensionality[k]])),String(aData[all_dimensionality[k]]))

				}
				for(var j = 0;j < all_measure.length;j++){ // 计算出series
					if(valueMax < aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]]){
						valueMax = aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]];
					}					
					if(!series[j]){
						series[j] = {
							"name":drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]],
							"type":"bar",
							"yAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
							"xAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
							"data":[{"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]]/allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]],"theDimeInfo":theDimeInfo,"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]],"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]],"measureName":all_measure[j]}],
							z:3,
							label:{
								normal:{
									show:false,
									// show:dimensionality_show_data.length < 25 && all_measure.length < 3,
									position:"right",
									formatter:function(params){
				                    		if(normalUnitValue_arr[storeNum_toview] != -1){
				                    			return params.value.toFixed(normalUnitValue_arr[storeNum_toview]);
				                    		}else{
				                    			return params.value;
				                    		}
			                  		 },
								}
							},};
					}else{
						series[j]["data"].push({"value":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]]/allValueUnitDict[valueUnitValue_arr[storeNum_toview]],"originValue":aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]],"theDimeInfo":theDimeInfo,"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]],
						"huanbi":aData["环比"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]],"measureName":all_measure[j]});
					}
				}
				var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
				for(var k = 0;k < dimension_length;k++){
					if(!dimensionality_show_data[k]){
						dimensionality_show_data[k] = [aData[all_dimensionality[k]]];
					}else{
						dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						// var index = dimensionality_show_data[k].indexOf(aData[all_dimensionality[k]]);
						// if(index == -1){
						// 	dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						// }else if(index != -1){
						// 	// dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
						// 	//dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						// 	// if(all_dimensionality[dimensionality_show_data.length - 1] != all_dimensionality[k]){
						// 	// 	dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
						// 	// }else{
						// 	// 	dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						// 	// }
						// 	if(all_dimensionality[dimensionality_show_data.length - 1] != all_dimensionality[k]){
						// 		var lastVal = dimensionality_show_data[k][dimensionality_show_data[k].length-1];
						// 		if(/YZYPD/.test(lastVal)){
						// 			lastVal = lastVal.split("YZYPD")[1];
						// 		}
						// 		if(lastVal == aData[all_dimensionality[k]]){
						// 		// if(dimensionality_show_data[k][dimensionality_show_data[k].length-1] == aData[all_dimensionality[k]]){
						// 			dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
						// 		}else{
						// 			dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						// 		}
						// 	}else{
						// 		dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
						// 	}
						// }	
					}
				}
			}
			
			
			
			for(var i = 0;i < dimensionality_show_data.length;i++){
				// var arr = [];
				// for(var j = 0;j < dimensionality_show_data[i].length; j ++){
				// 	// arr.push(dimensionality_show_data[i][j].length);
				// 	var dataLen = dimensionality_show_data[i][j];
				// 	if(dataLen){
				// 		if(/YZYPD/.test(dataLen)){
				// 			dataLen = dataLen.split("YZYPD")[1];
				// 		}
				// 		arr.push(dataLen.length);
				// 	}
				// }
				// var maxLength = Math.max.apply(null, arr);
				var aY = {
					"show":true,
					// "name":all_dimensionality[i],
					"nameGap":10,
					"nameRotate":15,
					"nameLocation":"end",
					"type":"category",
					axisTick:{
						inside:false,
						interval:function(index,value){return !/^YZYPD/.test(value)},
						// length: /^YZYPD/.test(dimensionality_show_data[i])? 0 : 70  + i,
					},
					axisLabel:{
						color:"black",
						rotate:15,
						fontSize:10,
						interval:function(index,value){return !/^YZYPD/.test(value)},
						formatter:function(value){
							if(value.length > 3){
								value = value.substring(0,3) + '...';
							}
							if(value == 'und...'){
								return '';
							}
							return value;
						}
					},
					axisLine: {
						show:true,   //去掉垂直线
			          	// lineStyle: {color: '#ccc'}
			        },
			        splitLine:{
			        	show:false
			        },
					"data":dimensionality_show_data[i],
					gridIndex:i
				}
				needYais.push(aY);
				
				var aGrid = {
					containLabel:false,
					show:false,
					
				}
				aGrid["left"] = 70 + i * (47 + i);
				// aGrid["left"] = 150 + i * 60;
				// if(maxLength > 0){
				// 	aGrid["left"] = 80 + (maxLength * 5) + i * (maxLength * 5 + 60);
				// }else{
				// 	aGrid["left"] = 100 + i * (60 + i);
				// }
				aGrid["bottom"] = "25%";	
				aGrid["top"] = "8%";
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
						// barCategoryGap:"80%",
						xAxisIndex:i-1,
						yAxisIndex:i-1,
						"data":[{"value":valueMax/valueUnitValue_arr[storeNum_toview],"originValue":valueMax}],
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
					  	text: "单位: "+valueUnitValue_arr[storeNum_toview],
					  	bottom:40,
					  	show:false,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
					  	}
					  }
			    ],
			    tooltip: {
			        trigger: 'item',
			        axisPointer: { // 坐标轴指示器，坐标轴触发有效
			            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			        },
			       backgroundColor:'rgba(255,255,255,0.95)',
			    	   extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
			       formatter:function(params){
			        		var needValue = params.value;
								  if(normalUnitValue_arr[storeNum_toview] != -1){
								  	 needValue = needValue.toFixed(normalUnitValue_arr[storeNum_toview]);
								  }
				       	 	var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'>";
									var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'>";
									for(var i = 0;i < all_dimensionality.length;i++){
										var aP = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_dimensionality[i]+":</p>";
										leftDiv+=aP;
									}
									leftDiv+="<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
									for(var k = 0;k < params.data.theDimeInfo.length;k++){
	                   rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.data.theDimeInfo[k]+"</p>";
	                }
                  rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
									var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
									 var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
									 var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
									 var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
									 if(showTongbiMeasureArray.indexOf(params.data.measureName) != -1){
										 leftDiv += leftTongbi;
										 rightDiv += rightTongbi;
									 }
									 if(showHuanbiMeasureArray.indexOf(params.data.measureName) != -1){
										 leftDiv += leftHuanbi;
										 rightDiv += rightHuanbi;
									 }
									 leftDiv+= "</div>";
									 rightDiv+= "</div>";
	                 return leftDiv+rightDiv;
			        },
			        textStyle:{
			        		fontSize:12
			        }
			    },
			    legend: {
			        data: commonLegend,
			        left:"center",
			        bottom:"6%",
			        width:"90%",
			    },
			    color:allColorsDict[currentColorGroupName_arr[storeNum_toview]],
				toolbox: {
			        show: true,
			        feature: {
			            // dataView: {readOnly: true},
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
	           			 	backgroundColor:"#f5f5f5",
	           			 	fillerColor:"#dedede",
	           			 	borderColor:"#f5f5f5",
	           			 	showDataShadow:false,
				            yAxisIndex: dataZoomXindexArray,
				            height:10,
				            handleStyle:{
				            		color:"#dedede"	
				            },
				            startValue:0,
				            endValue:dimensionality_show_data[dimensionality_show_data.length - 1].length > 15 ? 15 : null,
				            orient:"horizontal",
				            bottom:0,
			          		handleSize:12,
			            	maxValueSpan:15,
			            	throttle:100,
			            	handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",				            
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
			setTimeout(function (){
                mycharts.hideLoading();
                mycharts.setOption(option);
                // $("."+tempSaveClassName+"").data("dataShow",option.series.label.normal.show);
                elementContent($("."+tempSaveClassName+""),option);
            }, 200)


		});
	}
	//  雷达图
	function radarChart_generate_fun(storeNum_toview){
		if(statements_tonghuanbi_arr[storeNum_toview] != undefined){
			var tempThData = JSON.parse(statements_tonghuanbi_arr[storeNum_toview]);
			showTongbiMeasureArray = tempThData[0];
			showHuanbiMeasureArray = tempThData[1];
		}
		var tempSaveClassName = viewshow_class;
		reporting_measure_Hanlde(all_dimensionality,all_measure,null,storeNum_toview,function(data){
			radarDiemension = all_dimensionality[0];
			var indicator = [];
			var series = [{"name":all_measure.join("/"),"type":"radar","data":[]}];
			var recordArr = [];
			var maxArr = [];
			for(var i =0;i < data.length;i++){
				var aData = data[i];
				var max = aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]] / allValueUnitDict[valueUnitValue_arr[storeNum_toview]];
				for(var j = 0;j <  all_measure.length;j++){					
					if(!series[0]["data"][j]){
						series[0]["data"][j] = {
							"name":drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]],
							"value":[aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]]/allValueUnitDict[valueUnitValue_arr[storeNum_toview]]]
							};
						recordArr[j] = [aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]]];
					}else{
						series[0]["data"][j]["value"].push(aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]]/allValueUnitDict[valueUnitValue_arr[storeNum_toview]]);
						recordArr[j].push(aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]]);
					}
					if(max < aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]]/allValueUnitDict[valueUnitValue_arr[storeNum_toview]]){
						max  = aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[j]]]/allValueUnitDict[valueUnitValue_arr[storeNum_toview]];
					}
				}
				// var str = "";
				// for(var k=0;k<all_dimensionality.length;k++){
				// 	// console.log(all_dimensionality[k],aData[all_dimensionality[k]]);
				// 	if(aData[all_dimensionality[k]].length > 3){
				// 		aData[all_dimensionality[k]] = aData[all_dimensionality[k]].substring(0,3) + '...';
				// 	}
				// 	str +=  aData[all_dimensionality[k]] + "-";
				// 	//console.log(str);
				// 	var re = str.substring(0,str.length-1);
				// 	//console.log(re);
					
				// }

				var maxVal = (max / allValueUnitDict[valueUnitValue]) * 1.2;
				maxArr.push(maxVal);
				// console.log(maxArr);
			}

			var maxNum = Math.max.apply(null, maxArr);

			for(var i=0;i<data.length;i++){
				var aData = data[i];
				var max = aData[drag_measureCalculateStyle_arr[storeNum_toview][all_measure[0]]] / allValueUnitDict[valueUnitValue_arr[storeNum_toview]];
				
				var str = "";
				for(var k=0;k<all_dimensionality.length;k++){
					if(aData[all_dimensionality[k]].length > 3 && all_dimensionality.length > 1){
						aData[all_dimensionality[k]] = aData[all_dimensionality[k]].substring(0,3) + '...';
					}
					str +=  aData[all_dimensionality[k]] + "-";
					var re = str.substring(0,str.length-1);		
				}

				indicator.push({
					"name":re,
					"max":maxNum,
					"originalMax":max
           	 	});
			}


			
		var option = {
		    title: [{
		        text: "雷达图",
		        show:false
		    },
		    	{
					  	text: "单位: "+valueUnitValue_arr[storeNum_toview],
					  	top:10,
					  	right:70,
					  	show:false,
					  	textStyle:{
					  		fontSize:14,
					  		color:allColorsDict[currentColorGroupName_arr[storeNum_toview]][0]
					  	}
					  }
		    ],
		    tooltip: {
		    		trigger:"axis",
		    		textStyle:{
		    			fontSize:12	
		    		},
		    		backgroundColor:'rgba(255,255,255,0.95)',
			    	extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
		   //  		formatter:function(params){
					// var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'>";
					// var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'>";
					// for(var i = 0;i < all_measure.length;i++){
					// 	var aP = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_measure[i]+":</p>";
					// 	leftDiv+=aP;
					// 	var aStyle = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+drag_measureCalculateStyle_arr[storeNum_toview][all_measure[i]]+"</p>";
					// 	rightDiv+=aStyle;
					// }

   		// 			for(var i = 0;i < params.value.length;i++){
   		// 				var needValue = params.value[i];
   		// 				if(normalUnitValue != -1){
				 //  	 		needValue = needValue.toFixed(normalUnitValue);
				 // 		 }
					// 	leftDiv+="<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+indicator[i].name+":</span></p>";
					// 	rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
   		// 			}
   		// 			leftDiv+="</div>";
     //                 rightDiv+= "</div>";
	    //     			 return leftDiv + rightDiv;

		   //  		}
		    		
		    },
		    legend: {
		    	type: 'scroll',
		    	orient: 'vertical',
		        // bottom:60,
		        top:0,
		        right:"3%",
		        data: commonLegend,
		        // left:"center",
		        width:"60%"
		    },
		    	color:allColorsDict[currentColorGroupName_arr[storeNum_toview]],
			toolbox: {
		        show: true,
		        feature: {
		            // dataView: {readOnly: true},
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
		        // shape: 'circle',
		        center:["50%","48%"],
		        radius:"75%",
		        indicator:indicator,
		        triggerEvent:true,
		        axisLine:{
		        	show:true
		        	// show:data.length < 80,
		        },
		        splitLine:{
		        	show:true,
		        },
		        name:{
		        	formatter:function(params){
	         			count++;
	         			if(data.length > 20 && data.length < 80){
	         				if(count % 4 == 0){
	         					return params;
	         				}else{
	         					array.push(params);
	         					return  '';
	         				}
	         			}else if(data.length > 80 && data.length < 200){
	         				if(count % 10 == 0){
	         					return params;
	         				}else{
	         					array.push(params);
	         					return '';
	         				}
	         			}else if(data.length > 200){
	         				if(count % 15 == 0){
	         					return params;
	         				}else{
	         					array.push(params);
	         					return '';
	         				}
	         			}else{
	         				return params;
	         			}
	         			// if(data.length > 20){
	         			// 	if(count % 3 == 0){
	         			// 		return params;
	         			// 	}else{
	         			// 		array.push(params);
	         			// 	//	console.log(array);
	         			// 		return '';
	         			// 	}
	         			// }else{
	         			// 	return params;
	         			// }
	         		}
		        }
		    }],
		    "record":recordArr,
		    series: series
		};
		//清除上一个图例
		mycharts.clear();
	
			setTimeout(function (){
                mycharts.hideLoading();
                mycharts.setOption(option);
                // $("."+tempSaveClassName+"").data("dataShow",option.series.label.normal.show);
                elementContent($("."+tempSaveClassName+""),option);
            }, 200)
			
		});
	}


	//判断传入参数不同调用不同图形
	switch(chart_type_need)
	{
		case "polyline":
			//调用折线图
			polyLine_generate_fun(storeNum_toview);
		  break;
		case "comparisonStrip":
			//调用对比条形图
		  	comparisonStrip_generate_fun(storeNum_toview);
		  break;
		  case "number_bar":
		  //调用堆积柱状图
		  	stackedBar_generate_fun("number_bar",storeNum_toview);
		  break;
		  case "number_liner":
		  //调用堆积条形图
		  	stackedBar_generate_fun("number_liner",storeNum_toview);
		  break;
		  case "percentage_bar":
		  //调用百分比堆积柱状图
		  	stackedBar_generate_fun("percentage_bar",storeNum_toview);
		  break;
		   case "percentage_liner":
		  //调用百分比堆积条形图
		  	stackedBar_generate_fun("percentage_liner",storeNum_toview);
		  break;
		  case "reliationTree":
		  //调用树状图
		 	reliationTree_generate_fun(storeNum_toview);
		  break;
		  //调用雷达图
		  case "radarChart":
		  radarChart_generate_fun(storeNum_toview);
		  break;
		  //调用条形图
		  case "barChart":
		  barChart_generate_fun(storeNum_toview);
		  break;
		  //调用柱状图
		  case "histogram":
		  histogram_generate_fun(storeNum_toview);
		  break;

		default:

	}
	// 记录当前图形的类型
	currentChatType = chart_type_need;
}



	//点击下钻
	function clickDrillStatementsFunction(params,element,storeNum_toview){
		
		if(!$(element).hasClass("drillToClick") || $(element).attr("clickcount") >= allKeys(JSON.parse($(element).data("drillEvery"))).length-1) return;
		if($(element).attr("clickcount") == 0){
			freePostData = JSON.parse($(element).data("drillData"));
		}
		var freeShowType = $(element).data("showtype");

		var freeDrillCount = $(element).data("drillDownCount")[freeShowType[Number($(element).attr("clickcount"))].split("_YZYPD_")[0]];

		var freeDrillPost = $(element).data("drillElementPost");
		//判断单维度和多维度获取点击的value
		if(params.data.theDimeInfo == undefined || params.data.theDimeInfo.length == 1){
			var statementsValue = objectDeepCopy(params.name);
		}else{
			if(freeDrillCount == undefined){
				var statementsValue =objectDeepCopy( params.data.theDimeInfo[0]);
			}else{
				var statementsValue = objectDeepCopy(params.data.theDimeInfo[freeDrillCount]);
			}
			
		}

		var freeType = JSON.parse($(element).data("drillEvery"));
		
		$(element).find(".drillDownState ul li p").eq(Number($(element).attr("clickcount"))).data("viewHandleFun",JSON.parse(JSON.stringify(freePostData))).data("viewHandleType","reporting_"+freeShowType[Number($(element).attr("clickcount"))].split("_YZYPD_")[1].replace(/\)/,","+storeNum_toview+",'"+$(element).find(".new_view_main").attr("_echarts_instance_"))+"')").data("viewHandleData",JSON.parse(JSON.stringify(freeType[freeShowType[Number($(element).attr("clickcount"))].split("_YZYPD_")[0]]))).data("viewHandleCount",JSON.parse(JSON.stringify(storeNum_toview)));
		$(element).attr("clickcount",Number($(element).attr("clickcount"))+1);
		var freeCount = Number($(element).attr("clickcount"));
		$(element).find(".drillDownState ul li p").eq(freeCount).text(statementsValue);
		$(element).find(".drillDownState ul li:lt("+(freeCount+1)+")").show();
		$(element).attr("showText",freeShowType[freeCount].split("_YZYPD_")[0]);
		if(freeDrillPost[freeShowType[freeCount].split("_YZYPD_")[0]] != undefined){
			var tempShowHandleData = JSON.parse(JSON.stringify( freeDrillPost[freeShowType[freeCount].split("_YZYPD_")[0]]));
			tempShowHandleData["conditions"] = JSON.parse(JSON.stringify(freePostData))["conditions"];
			tempShowHandleData["conditions"].push({"columnName":freeShowType[freeCount-1].split("_YZYPD_")[0],"type":"=","value":statementsValue})
			freePostData = JSON.parse(JSON.stringify(tempShowHandleData));
		}
		drag_row_column_data_arr[storeNum_toview] = objectDeepCopy(freeType[freeShowType[freeCount].split("_YZYPD_")[0]]["viewdata"]);
		drag_measureCalculateStyle_arr[storeNum_toview] = objectDeepCopy(freeType[freeShowType[freeCount].split("_YZYPD_")[0]]["calculateStyle"]);
		currentColorGroupName_arr[storeNum_toview] = objectDeepCopy(freeType[freeShowType[freeCount].split("_YZYPD_")[0]]["dragViewStyle"]).split("_YZY_")[0];
		normalUnitValue_arr[storeNum_toview] = objectDeepCopy(freeType[freeShowType[freeCount].split("_YZYPD_")[0]]["dragViewStyle"]).split("_YZY_")[1];
		valueUnitValue_arr[storeNum_toview] = objectDeepCopy(freeType[freeShowType[freeCount].split("_YZYPD_")[0]]["dragViewStyle"]).split("_YZY_")[2];
		clickDrill =false;
		var clickLoding = echarts.getInstanceByDom($(".new_view_main[_echarts_instance_="+$(element).find(".new_view_main").attr("_echarts_instance_")+"]").get(0));
		clickLoding.showLoading({
			  text: '数据获取中',
				  color: '#c23531',
				 textColor: '#000',
				 maskColor: 'rgba(255, 255, 255, 0.8)',
				 zlevel: 0
		});
		eval("reporting_"+freeShowType[freeCount].split("_YZYPD_")[1].replace(/\)/,","+storeNum_toview+",'"+$(element).find(".new_view_main").attr("_echarts_instance_"))+"')");

		}