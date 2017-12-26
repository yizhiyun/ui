/**
 * Created by guoxiaomin on 2017/6/14.
 */
(function(doc,win){
	window.onload = function(){
		win.onresize = function(){
		initWindowSize(doc,win);
	}
	initWindowSize(doc,win);

	}

})(document,window);

function initWindowSize(doc,win,paHeight){
		var main = doc.getElementsByClassName("main")[0];
		var leftNav = doc.getElementsByClassName("leftNav")[0];

		main.style.height = (doc.offsetHeight | doc.body.offsetHeight) - 50 + "px";
		leftNav.style.height = (doc.offsetHeight | doc.body.offsetHeight) - 50 + "px";

}

//数组去重
Array.prototype.unique3 = function(){
 var res = [];
 var json = {};
 for(var i = 0; i < this.length; i++){
  if(!json[this[i]]){
   res.push(this[i]);
   json[this[i]] = 1;
  }
 }
 return res;
}


//获取隐藏元素的宽度
;( function ( factory ) {
if ( typeof define === 'function' && define.amd ) {
    // AMD. Register module depending on jQuery using requirejs define.
    define( ['jquery'], factory );
} else {
    // No AMD.
    factory( jQuery );
}
}( function ( $ ){
  $.fn.addBack = $.fn.addBack || $.fn.andSelf;

  $.fn.extend({

    actual : function ( method, options ){
      // check if the jQuery method exist
      if( !this[ method ]){
        throw '$.actual => The jQuery method "' + method + '" you called does not exist';
      }

      var defaults = {
        absolute      : false,
        clone         : false,
        includeMargin : false,
        display       : 'block'
      };

      var configs = $.extend( defaults, options );

      var $target = this.eq( 0 );
      var fix, restore;

      if( configs.clone === true ){
        fix = function (){
          var style = 'position: absolute !important; top: -1000 !important; ';

          // this is useful with css3pie
          $target = $target.
            clone().
            attr( 'style', style ).
            appendTo( 'body' );
        };

        restore = function (){
          // remove DOM element after getting the width
          $target.remove();
        };
      }else{
        var tmp   = [];
        var style = '';
        var $hidden;

        fix = function (){
          // get all hidden parents
          $hidden = $target.parents().addBack().filter( ':hidden' );
          style   += 'visibility: hidden !important; display: ' + configs.display + ' !important; ';

          if( configs.absolute === true ) style += 'position: absolute !important; ';

          // save the origin style props
          // set the hidden el css to be got the actual value later
          $hidden.each( function (){
            // Save original style. If no style was set, attr() returns undefined
            var $this     = $( this );
            var thisStyle = $this.attr( 'style' );

            tmp.push( thisStyle );
            // Retain as much of the original style as possible, if there is one
            $this.attr( 'style', thisStyle ? thisStyle + ';' + style : style );
          });
        };

        restore = function (){
          // restore origin style values
          $hidden.each( function ( i ){
            var $this = $( this );
            var _tmp  = tmp[ i ];

            if( _tmp === undefined ){
              $this.removeAttr( 'style' );
            }else{
              $this.attr( 'style', _tmp );
            }
          });
        };
      }

      fix();
      // get the actual value with user specific methed
      // it can be 'width', 'height', 'outerWidth', 'innerWidth'... etc
      // configs.includeMargin only works for 'outerWidth' and 'outerHeight'
      var actual = /(outer)/.test( method ) ?
        $target[ method ]( configs.includeMargin ) :
        $target[ method ]();

      restore();
      // IMPORTANT, this plugin only return the value of the first element
      return actual;
    }
  });
}));




// 分层下钻移入移出
function peterDrillDown(){
			//移入移出事件
		$(".drog_row_list .peterMouse").not($(".clickActive")).each(function(index,ele){
			$(ele).unbind("mouseenter");
			$(ele).mouseenter(function(event){
				event.stopPropagation();
				$(ele).css("borderColor","#86a9d1");
			});


			$(ele).unbind("mouseleave");
			$(ele).mouseleave(function(event){
				event.stopPropagation();
				$(ele).css("borderColor","#DEDEDE");
			});
		})
}




function inputSearch(ele,activeClass,showContent,md){
    //报表弹窗筛选功能
  $(ele).on("input",function(){

    //搜索里输入的值
    var search_input_data  = $(ele).val();

    if(search_input_data == ""){
      $(showContent).children().css("display","block");
      	if(md != "md" && md != "filter"){
      		$("#analysisContainer .leftSlide #dataSet .detailDataSetList .nowConnectedTables .tablesList .tablesOfaData").get(0).style.maxHeight = $("#analysisContainer .leftSlide").height() - ($("#analysisContainer .leftSlide #connectDirector").height() + 16) - $("#analysisContainer .leftSlide #dataSet .dataSetTitle").height() - $("#analysisContainer .leftSlide #dataSet .detailDataSetList #baseSetTemplate .didBuildTables").height() - $("#analysisContainer .leftSlide #dataSet .detailDataSetList #baseSetTemplate .nowConnectedTables .title").height() - 35  + "px";
      	}
      return;
    }

    $(showContent).children().css("display","none");
      var reg_str = "/"+search_input_data+"/gi";

      var list_p=$(showContent).find("."+activeClass+"");

      for(var i = 0 ; i < list_p.length;i++){

      var reg = eval(reg_str);

      (function(index){

        var list_li_text = list_p.eq(index).text();
        if(reg.test(list_li_text) == true){
          if(md == "md"){
          	list_p.eq(index).parents(".leftNav_list").css("display","block");
          }else{
          	list_p.eq(index).css("display","block");
          }

        }
      })(i);

    }

   	if(md != "md" && md != "filter"){
   		$("#analysisContainer .leftSlide #dataSet .detailDataSetList .nowConnectedTables .tablesList .tablesOfaData").get(0).style.maxHeight = $("#analysisContainer .leftSlide").height() - ($("#analysisContainer .leftSlide #connectDirector").height() + 16) - $("#analysisContainer .leftSlide #dataSet .dataSetTitle").height() - $("#analysisContainer .leftSlide #dataSet .detailDataSetList #baseSetTemplate .didBuildTables").height() - $("#analysisContainer .leftSlide #dataSet .detailDataSetList #baseSetTemplate .nowConnectedTables .title").height() - 35  + "px";
   	}

  })
}

function deleteCookie(){
	$.post("../dashboard/getAllData",function(result){
		if(sessionStorage.getItem("edit_view_now")){
			//获取编辑的视图
			var hava_view_edit_old = sessionStorage.getItem("edit_view_now");
			var have_view_edit = sessionStorage.getItem("edit_view_now").split(",");
			if(Object.getOwnPropertyNames(result).length == 0 || result[have_view_edit[0]][have_view_edit[1]][have_view_edit[2]] == undefined){
				sessionStorage.removeItem("edit_view_now");
			}
		}
	});
}
deleteCookie();
//获取指定form中的所有的<input>对象
function getElements(formId) {
  var form = document.getElementById(formId);
  var elements = new Array();
  var tagElements = form.getElementsByTagName('input');
  for (var j = 0; j < tagElements.length; j++){
     elements.push(tagElements[j]);

  }
  return elements;
}

//获取单个input中的【name,value】数组
function inputSelector(element) {
 if (element.checked)
   return [element.name, element.value];
}

function input(element) {
  switch (element.type.toLowerCase()) {
   case 'submit':
   case 'hidden':
   case 'password':
   case 'text':
    return [element.name, element.value];
   case 'checkbox':
   case 'radio':
    return inputSelector(element);
  }
  return false;
}

//组合URL
function serializeElement(element) {
  var method = element.tagName.toLowerCase();
  var parameter = input(element);

  if (parameter) {
   var key = parameter[0];
   if (key.length == 0) return;
   var values = parameter[1];
   var results = [key,values];
   return results;
  }
 }

//调用方法
function serializeForm(formId) {
  var elements = getElements(formId);
  var queryComponents = {};

  for (var i = 0; i < elements.length; i++) {
   var queryComponent = serializeElement(elements[i]);
   if (queryComponent)
	queryComponents[queryComponent[0]] = queryComponent[1];
  }

  return queryComponents;
}


// 获取一个对象的所有属性
function allKeys(obj){
	var keys = [];
	for(var key in obj){
		keys.push(key);
	}
	return keys;
}
// 获取一个对象的所有值
function allValues(obj){
	var values = [];
	for(var key in obj){
		values.push(obj[key]);
	}
	return values;
}

Array.prototype.hasObject = function(key,value){
	for(var i = 0;i < this.length;i++){

		if(this[i][key] == value){
			return i;
		}

	}
	return -1;
}

Array.prototype.isHasObjects = function(keys,values){
	for(var i = 0;i < this.length;i++){

		for (var k = 0;k < keys.length;k++) {
			if(this[i][keys[k]] != values[k]){
				break;
			}
		}
		if (k == keys.length) {
			return i;
		}

	}
	return -1;
}

// 对象的深度拷贝
function objectDeepCopy(source) {
	return  JSON.parse(JSON.stringify(source));
}
// 判断俩个对象是否相等,非对象也可以判断，这里会比较类型，1 和“1”比较会返回 false
function equalCompare(objA, objB)

{
    if (typeof arguments[0] != typeof arguments[1])
        return false;

    //数组
    if (arguments[0] instanceof Array)
    {
        if (arguments[0].length != arguments[1].length)
            return false;

        var allElementsEqual = true;
        for (var i = 0; i < arguments[0].length; i++)
        {
            if (typeof arguments[0][i] != typeof arguments[1][i])
                return false;

            if (typeof arguments[0][i] == 'number' && typeof arguments[1][i] == 'number')
                allElementsEqual = (arguments[0][i] == arguments[1][i]);
            else if(typeof arguments[0][i] == 'string' && typeof arguments[1][i] == 'string')
            	allElementsEqual = (arguments[0][i] == arguments[1][i]);
            else
                allElementsEqual = arguments.callee(arguments[0][i], arguments[1][i]);            //递归判断对象是否相等
          	 if(!allElementsEqual){
           		return  allElementsEqual;
          	 }
        }
        return allElementsEqual;
    }

    //对象
    if (arguments[0] instanceof Object && arguments[1] instanceof Object)
    {
        var result = true;
        var attributeLengthA = 0, attributeLengthB = 0;
        for (var o in arguments[0])
        {
            //判断两个对象的同名属性是否相同（数字或字符串）
            if (typeof arguments[0][o] == 'number' || typeof arguments[0][o] == 'string')
                result = eval("arguments[0]['" + o + "'] == arguments[1]['" + o + "']");
                if(result == false){
                		return result;
                }
            else {
                //如果对象的属性也是对象，则递归判断两个对象的同名属性
                //if (!arguments.callee(arguments[0][o], arguments[1][o]))
                if (!arguments.callee(eval("arguments[0]['" + o + "']"), eval("arguments[1]['" + o + "']")))
                {
                    result = false;
                    return result;
                }
            }
            ++attributeLengthA;
        }

        for (var o in arguments[1]) {
            ++attributeLengthB;
        }

        //如果两个对象的属性数目不等，则两个对象也不等
        if (attributeLengthA != attributeLengthB)
            result = false;
        return result;
    }
    return arguments[0] == arguments[1];

}

// 切换页面
$(function(){
	$(".main .rightConent .pageModuleNav").each(function(index,ele){
		$(ele).data("isFirstInto",true);
	});
	pallasdaraFunctionNavBtnHandle();

	// 连接数据库关闭按钮
	$("#connectDataBaseInfo .common-head .close").unbind("click");
	$("#connectDataBaseInfo .common-head .close").click(function(event){
		event.stopPropagation();
		$("#connectDataBaseInfo").hide();
		$(".maskLayer").hide();
	});

	doProhibit();
});
	function doProhibit() {
		if(window.Event)
			document.captureEvents(Event.MOUSEUP);

		function nocontextmenu() {
			event.cancelBubble = true
			event.returnvalue = false;
			return false;
		}

		function norightclick(e) {
			if(window.Event) {
				if(e.which == 2 || e.which == 3)
					return false;
			} else if(event.button == 2 || event.button == 3) {
				event.cancelBubble = true
				event.returnvalue = false;
				return false;
			}
		}
		document.oncontextmenu = nocontextmenu; // for IE5+
		document.onmousedown = norightclick; //
	}

	//分层下钻默认给定存储数据
	function drillDownNoClick(save){
		$(".peterMouse span").each(function(index,ele){
			if(saveDrillDownTemp[$(ele).text()] == undefined){
				var freeHandleViewData = JSON.parse(JSON.stringify(drag_row_column_data));
				var freeStyle;
				if(index > 0){
					if(freeHandleViewData["row"]["dimensionality"].length > 0){
						freeHandleViewData["row"]["dimensionality"].splice(0,freeHandleViewData["row"]["dimensionality"].length,$(ele).text());
						freeStyle = "默认_YZY_-1_YZY_个";
					}else{
						freeHandleViewData["column"]["dimensionality"].splice(0,freeHandleViewData["column"]["dimensionality"].length,$(ele).text());
						freeStyle = objectDeepCopy(currentColorGroupName)+"_YZY_"+objectDeepCopy(normalUnitValue)+"_YZY_"+objectDeepCopy(valueUnitValue);
					}
				}
				if(save == "save"){
					saveDrillDownTemp[$(ele).text()] = {"viewdata":JSON.parse(JSON.stringify(freeHandleViewData)),"viewType":"show_bar","calculateStyle":objectDeepCopy(drag_measureCalculateStyle),"dragViewStyle":freeStyle};
				}else{
					saveDrillDownTemp[$(ele).text()] = {"viewdata":JSON.parse(JSON.stringify(freeHandleViewData)),"viewType":save_now_show_view_text.attr("id"),"calculateStyle":objectDeepCopy(drag_measureCalculateStyle),"dragViewStyle":freeStyle};
				}
				
			}
		})
	}

	//编辑跳回后对颜色 小数点等对应的修改
	function editView_change_color(colorArr,filterArr){
		//修改对应颜色
		var getColor_arr = allColorsDict[colorArr.split("_YZY_")[0]];
		$("#project_chart #project_style .defaultColors .color_flag").text(colorArr.split("_YZY_")[0]);
		for(var i =0; i < 5;i++){
			$("#project_chart #project_style .defaultColors .selectedColors span").eq(i).css("background",getColor_arr[i]);
		};

		//小数点的切换
		$("#project_chart #project_style .module_style .normalUnit .content span").add($("#project_chart #project_style .module_style .valueUnit .content span")).removeClass("active");
		$("#project_chart #project_style .module_style .normalUnit .content span[unit="+colorArr.split("_YZY_")[1]+"]").addClass("active");

		//值单位的切换
		$("#project_chart #project_style .module_style .valueUnit .content span").each(function(index,ele){
			if($(ele).text() == colorArr.split("_YZY_")[2]){
				$(ele).addClass("active");
			}
		})

		//右侧筛选器显示
		rightFilterListDraw();

	}

	//实时保存修改标签页对应的数据
	function realSaveData(){
		//存储当前窗口对应的数据
			var saveNowWallDict = {};
			//判断表标题是否为空
			if($("#view_show_area #view_show_area_content .tableView_name h4").text() == "添加表标题"){
				if($("#pageDashboardModule #dashboard_content .peterMouse").length > 1){
					saveNowWallDict["viewstyle"] = saveDrillDownTemp[$(".peterMouse").eq(0).find("span").text()]["dragViewStyle"];
				}else{
					saveNowWallDict["viewstyle"] = currentColorGroupName+"_YZY_"+normalUnitValue+"_YZY_"+valueUnitValue;
				}
			}else{
				if($("#pageDashboardModule #dashboard_content .peterMouse").length > 1){
					saveNowWallDict["viewstyle"] = saveDrillDownTemp[$(".peterMouse").eq(0).find("span").text()]["dragViewStyle"]+"_YZY_"+ $("#view_show_area #view_show_area_content .tableView_name h4").text();
				}else{
					saveNowWallDict["viewstyle"] = currentColorGroupName+"_YZY_"+normalUnitValue+"_YZY_"+valueUnitValue+"_YZY_"+ $("#view_show_area #view_show_area_content .tableView_name h4").text();
				}
				
			}
			
			var showListView = {};
			
			if($("#pageDashboardModule #dashboard_content .peterMouse").length <= 0 && $("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul li").length > 1){
				var freeListData = [];
				$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul li:gt(0)").children("p").each(function(index,ele){
					freeListData.push($(ele).text());
				})
				showListView["showList"] = objectDeepCopy(freeListData);
			}


			if($("#pageDashboardModule #dashboard_content .peterMouse").length > 1){
				if(allKeys(saveDrillDownTemp).length <= 1){
					drillDownNoClick("save");
					saveNowWallDict["handledatapost"] = JSON.stringify(handleDataPost);
				}else{
					saveNowWallDict["handledatapost"] = JSON.stringify(saveEveryViewPostData[$(".peterMouse").eq(0).find("span").text()]);
				}

				var freePeterData = [];
				var viewTypeChange = [];
				$("#pageDashboardModule #dashboard_content .peterMouse").each(function(index,ele){
					freePeterData.push($(ele).find("span").attr("datatype"));
					if(saveEveryViewPostData[$(ele).find("span").text()] == undefined){
						var tempHandlePostData = JSON.parse(JSON.stringify(saveEveryViewPostData[$(".peterMouse").eq(index -1).find("span").text()]));
						// tempHandlePostData["conditions"].push({"columnName":$(".peterMouse").eq(index -1).find("span").text(),"type":"=","value":"yzy"});
						tempHandlePostData["expressions"]["groupby"] = specialRemoveDataTypeHandle(objectDeepCopy(saveDrillDownTemp[$(ele).find("span").text()]["viewdata"]["row"]["dimensionality"]).concat(objectDeepCopy(saveDrillDownTemp[$(ele).find("span").text()]["viewdata"]["column"]["dimensionality"])));
						tempHandlePostData["expressions"]["orderby"] = specialRemoveDataTypeHandle(objectDeepCopy(saveDrillDownTemp[$(ele).find("span").text()]["viewdata"]["row"]["dimensionality"]).concat(objectDeepCopy(saveDrillDownTemp[$(ele).find("span").text()]["viewdata"]["column"]["dimensionality"])));
						saveEveryViewPostData[$(ele).find("span").text()] = objectDeepCopy(tempHandlePostData);

					}

				})
				showListView["peterList"] = freePeterData;

				for(type in saveDrillDownTemp){
					viewTypeChange.push(type+"_YZYPD_"+$("#"+saveDrillDownTemp[type]["viewType"]+"").data("show_view_fun"));
				}
			}


			
			if(allKeys(saveDrillDownTemp).length > 0 && $(".peterMouse").length > 1){
					if(drillElementCount[$(".peterMouse").eq(0).find("span").text()] == undefined){
						$(".peterMouse").parents(".annotation_text").find("li").each(function(index,ele){
							if($(ele).find(".peterMouse").length > 0){
								drillElementCount[$(".peterMouse").eq(0).find("span").text()] = index;
							}
						});
					}
					saveNowWallDict["row"]= JSON.stringify(JSON.parse(JSON.stringify(saveDrillDownTemp[$(".peterMouse").eq(0).find("span").text()]["viewdata"]["row"])));
					saveNowWallDict["column"]= JSON.stringify(JSON.parse(JSON.stringify(saveDrillDownTemp[$(".peterMouse").eq(0).find("span").text()]["viewdata"]["column"])));
					saveNowWallDict["viewtype"] = $("#"+saveDrillDownTemp[$(".peterMouse").eq(0).find("span").text()]["viewType"]+"").data("show_view_fun");
				var tempHandleData = {
					"saveDimeData":saveDimeData,
					"showList":showListView,
					"saveDrillCount":saveDrillCount,
					"saveDrillDownTemp":saveDrillDownTemp,
					"showType":viewTypeChange,
					"drillElementCount":drillElementCount,
					"saveEveryViewPostData":saveEveryViewPostData,
					"saveDrillDownDict":saveDrillDownDict,
				}

				
			}else{
				if($("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul li").length > 1){
					//记录上下钻数据
					var tempHandleData = {
						"dirllConditions":dirllConditions,
						"saveDimeData":saveDimeData,
						"showList":showListView,
						"saveDataAndView":saveDataAndView,
						"viewClickChange":viewClickChange,
						"saveDrillPreView":saveDrillPreView,
					};
					saveNowWallDict["row"]= JSON.stringify(drag_row_column_data["row"]);
					saveNowWallDict["column"]= JSON.stringify(drag_row_column_data["column"]);
				}else{
					var tempHandleData = {};
					saveNowWallDict["row"]= JSON.stringify(drag_row_column_data["row"]);
					saveNowWallDict["column"]= JSON.stringify(drag_row_column_data["column"]);
				}


				saveNowWallDict["viewtype"] = view_name;
				saveNowWallDict["handledatapost"] = JSON.stringify(handleDataPost);
			}

			saveNowWallDict["drilldowndata"] = JSON.stringify(tempHandleData);
			saveNowWallDict["tablename"] = current_cube_name;
			saveNowWallDict["defaultparent"] = "default";
			saveNowWallDict["calculation"] = JSON.stringify(drag_measureCalculateStyle);
			saveNowWallDict["customcalculate"] = JSON.stringify(customCalculate);
			
			//记录同环比
			var contactTH = [];
			contactTH.push(showTongbiMeasureArray);
			contactTH.push(showHuanbiMeasureArray);
			saveNowWallDict["sequential"] = JSON.stringify(contactTH);

			return saveNowWallDict;
	}

 //移除函数
function remove_viewHandle(type,sortable){
	// isNeedShowHuanBiOption = false;
	// isNeedShowTongBiOption = false;
	if(dirllConditions && dirllConditions.length > 0 && sortable != "get" && sortable != "only" && sortable != "drill"){
		if($(".drillDownHandle").length > 0){
			drag_row_column_data = saveDrillPreView["viewdata"];
			save_now_show_view_text = $("#"+saveDrillPreView["viewType"]+"");
		}

		if($(".peterDownHandle").length > 0){
			// drag_row_column_data = JSON.parse(JSON.stringify(saveDrillDownTemp[$(".clickActive").find("span").text()]["viewdata"]));
			// save_now_show_view_text = $("#"+ saveDrillDownTemp[$(".clickActive").find("span").text()]["viewType"]+"");
			saveDrillCount = [];
			saveDrillDownDict = {};
			saveDrillDownTemp = {};
		}

		deleteDrillFun();
	}
	if(type == "column"){
		drag_row_column_data["column"]["measure"]= [];
		drag_row_column_data["column"]["dimensionality"] =[];
		//遍历所有行里的li 排序后更新数据
		for(var i = 0; i < $("#drop_col_view").find("li").length;i++){
			if($("#drop_col_view").find("li").eq(i).find(".drop_main").hasClass("peterMouse")){
				var data_id = $("#drop_col_view").find("li").eq(i).find(".clickActive span").attr("handledata").split(":");
			}else{
				//获取数据字段
				var data_id = $("#drop_col_view").find("li").eq(i).attr("id").split(":");
			}

			//判断元素的类型
			var data_wd_type = data_id[0];
			//对应的数据
			var sortable_data = data_id[1]+":"+data_id[2];

			drag_row_column_data["column"][data_wd_type].push(sortable_data)
		}
	}else{
			drag_row_column_data["row"]["measure"]= [];
			drag_row_column_data["row"]["dimensionality"] =[];
		//遍历所有行里的li 排序后更新数据
		for(var i = 0; i < $("#drop_row_view").find("li").length;i++){
			if($("#drop_row_view").find("li").eq(i).find(".drop_main").hasClass("peterMouse")){
				var data_id = $("#drop_row_view").find("li").eq(i).find(".clickActive span").attr("handledata").split(":");
			}else{
				//获取数据字段
				var data_id = $("#drop_row_view").find("li").eq(i).attr("id").split(":");
			}
			//判断元素的类型
			var data_wd_type = data_id[0];
			//对应的数据
			var sortable_data = data_id[1]+":"+data_id[2];

			drag_row_column_data["row"][data_wd_type].push(sortable_data)
		}
	}
		if(sortable != "sortable" && sortable != "drill" && sortable != "get"){
			// 移除筛选列
			rightFilterListDraw();
			switch_chart_handle_fun();
		}

}




//创建弹窗
function md_click_show(ele,data_dict){

				var open_or_close = true;

					$(ele).on("click",function(){
					//判断拖入的是否是计数
					if($(this).parent().hasClass("recordCount")){
						delete data_dict["度量_YZY_measure"];
					}
					// 表格中没有时间维度，则无法计算同比和环比
					if(currentSetTableDateFieldArray.length < 1){
						delete data_dict["同比_YZY_compared"];
						delete data_dict["环比_YZY_linkBack"];
						delete data_dict["移除对比_YZY_deleteCompared"];
					}
					if(open_or_close){
						open_or_close = false;
						currentHandleMeasureCalculate = $(ele).parent().parent(".drog_row_list");
							//创建最外层元素
						var out_wrap_click = $("<ul class='me_out_content'></ul>");
						var columnName = $(ele).parent().parent().data("field_name");

						out_wrap_click.appendTo($(ele).parent().parent()).data("pop_data_handle",username+"_YZY_"+ $("#lateral_bar #lateral_title .combo-select ul").find(".option-selected").text()+"_YZY_"+ columnName);

						if($(ele).parent().parent().attr("id").split(":")[0] == "dimensionality"){
							out_wrap_click.addClass("dimensionalityWrap");
						}

						out_wrap_click.css({
							"left":$(ele).parent().parent().offset().left + $(ele).parent().parent().width() - 60 -50+ "px",
							"top":$(ele).parent().parent().offset().top - 47+  "px",
						});
						for(out_wrap_count in data_dict){
							if(data_dict[out_wrap_count] != null){
							//创建单个元素
							var add_ele_evr = $("<li class='me_out_content_li "+out_wrap_count.split("_YZY_")[1]+"'><p>"+out_wrap_count.split("_YZY_")[0]+"</p><ul class='second_menu'><ul></li>");
							add_ele_evr.addClass("have_second_menu").appendTo(out_wrap_click);
								for(var i =0; i < data_dict[out_wrap_count].length;i++){
									$("<li class='second_li "+data_dict[out_wrap_count][i].split("_YZY_")[1]+"'><p>"+data_dict[out_wrap_count][i].split("_YZY_")[0]+"</p><li>").appendTo(add_ele_evr.find(".second_menu"));

								}

								//清除空元素
								add_ele_evr.find(".second_menu").children().each(function(index,ele){
									if($(ele).html() ==""){
										$(ele).remove();
									}
								})
							}else{
							//创建单个元素
							var add_ele_evr = $("<li class='me_out_content_li "+out_wrap_count.split("_YZY_")[1]+"'><p>"+out_wrap_count.split("_YZY_")[0]+"</p></li>");
							if(out_wrap_count.split("_YZY_")[0] == "同比" || out_wrap_count.split("_YZY_")[0] == "环比"){
								add_ele_evr.children("p").addClass("tonghuanClass").append($("<span class='clickImg'></span>"));
							}
							add_ele_evr.appendTo(out_wrap_click);

							}

						}

					if( showHuanbiMeasureArray.indexOf($(out_wrap_click).parents(".drog_row_list").eq(0).attr("id").split(":")[1]) != -1){
						out_wrap_click.find(".me_out_content_li p .clickImg").eq(1).css("visibility","visible");
					}

					if(showTongbiMeasureArray.indexOf($(out_wrap_click).parents(".drog_row_list").eq(0).attr("id").split(":")[1]) != -1){
						out_wrap_click.find(".me_out_content_li p .clickImg").eq(0).css("visibility","visible");
					}

						//移入事件
					$(".me_out_content li").on("mouseenter",function(){
						$(this).css("background","rgb(222,222,222)");
						if($(this).hasClass("have_second_menu")){
							$(".second_menu").css("display","block");
						}
					})
					$(".me_out_content li").on("mouseleave",function(){
						$(this).css("background","");
						if($(this).hasClass("have_second_menu")){
							$(".second_menu").css("display","none");
						}
					})

					$(".me_out_content").on("mouseleave",function(){
						$(this).remove();
						open_or_close = true;
					})
					}else{
						$(".me_out_content").remove();
						$(".me_out_content li").unbind("mouseenter mouseleave");
						open_or_close = true;
						return;
					}

					if(out_wrap_click.hasClass("dimensionalityWrap")){
							out_wrap_click.find(".me_out_content_li").not(".deleting").remove();
					}

					// 点击事件-------------
					//编辑计算
					out_wrap_click.find(".edit_calculation").on("click",function(){
;
						if($(this).parent(".me_out_content").hasClass("dimensionalityWrap")) return;
//							$("#editMeasureCalculateView").data("userCustomTile",false);


						$("#editMeasureCalculateView .dimensionalityFiled").hide();
						$("#editMeasureCalculateView .edit_measure_body").show();

						$("#editMeasureCalculateView").show(0,function(){
							if(editMeasureCalculateView_isFirstShow){
								editMeasureCalculateView_isFirstShow = false;
								CodeMirror.velocityContext = "sum avg max min count";  //提取到外部，方便从后台获取数据
//								      CodeMirror.velocityCustomizedKeywords = "server.ip server.cache software.conf software.version software.tags.count";
							      	editor = CodeMirror.fromTextArea($("#editMeasureCalculateView .edit_measure_body .calculate_input_box .arithmeticInputTextArea").get(0), {
							        lineNumbers: true,
							        extraKeys: {"Ctrl": "autocomplete"},
							        mode: "text/javascript",
							        indentWithTabs: true,
							        autoCloseTags: true,
							        autoCloseBrackets: true,
							        lineWrapping:true
							      });
							      editor.on('keypress', function() {
							          editor.showHint();  //满足自动触发自动联想功能
							      });
							}
						});
						$(".maskLayer").show();
						var measureList = $(this).parents(".me_out_content").eq(0);
						var measureInfo = measureList.data("pop_data_handle");
						$(".me_out_content").remove();
						open_or_close = true
						$("#editMeasureCalculateView").data("measureInfo",measureInfo);
						$("#editMeasureCalculateView .edit_measure_body #measure_show_title").unbind("change");
						$("#editMeasureCalculateView .edit_measure_body #measure_show_title").change(function(){
							if($(this).hasClass("warn")){
								$(this).removeClass("warn");
							}
						})
						$("#editMeasureCalculateView .common-head .close,#editMeasureCalculateView .common-filer-footer .cancleBtn").unbind("click");
						$("#editMeasureCalculateView .common-head .close,#editMeasureCalculateView .common-filer-footer .cancleBtn").click(function(event){
							event.stopPropagation();
							$("#editMeasureCalculateView").hide();
							$(".maskLayer").hide();
						});
						$("#editMeasureCalculateView .common-filer-footer .confirmBtn").unbind("click");
						$("#editMeasureCalculateView .common-filer-footer .confirmBtn").click(function(event){
							if($(this).parent(".me_out_content").hasClass("dimensionalityWrap")) return;
							event.stopPropagation();
							var  val = $("#editMeasureCalculateView .edit_measure_body #measure_show_title").val();
							if(!val||/^\s*$/.test(val)){
									$("#editMeasureCalculateView .edit_measure_body #measure_show_title").addClass("warn");
								return;
							}
							var meausureInfo = $(this).parents("#editMeasureCalculateView").data('measureInfo');
							var measureName = meausureInfo.split("_YZY_")[2];

							if(drag_measureCalculateStyle[measureName] == val && customCalculate[measureName] && customCalculate[measureName]["value"] == editor.getValue()){
								return;
							}
							drag_measureCalculateStyle[measureName] = val;
							if(!customCalculate[measureName]){
								customCalculate[measureName] = {};
							}
							customCalculate[measureName]["name"] = val;
							customCalculate[measureName]["value"] =  editor.getValue();


							currentHandleMeasureCalculate.children(".drop_main").children("span.measure_list_text_left").eq(0).html($("#editMeasureCalculateView .edit_measure_body #measure_show_title").val());
							switch_chart_handle_fun();
							$("#editMeasureCalculateView").hide();
							$(".maskLayer").hide();
						})

						//清除功能
						$("#editMeasureCalculateView .edit_measure_body .clearInputBtn").unbind("click");
						$("#editMeasureCalculateView .edit_measure_body .clearInputBtn").click(function(event){
							event.stopPropagation();
							$("#editMeasureCalculateView .edit_measure_body #measure_show_title").val("");
							$("#editMeasureCalculateView .edit_measure_body .cm-variable").text("");
						})

					});
					//同比环比弹窗
					out_wrap_click.find(".compared").add(out_wrap_click.find(".linkBack")).unbind("click");
					out_wrap_click.find(".compared").add(out_wrap_click.find(".linkBack")).click(function(event){
						event.stopPropagation();
						$("#text_table_need_show .content_body #data_list_for_body .measureDiv p").show();
						var measureInfo = $(this).parents(".drog_row_list").eq(0).attr("id").split(":")[1];

						if($(this).hasClass("linkBack")){
							// isNeedShowHuanBiOption = true;
							var index1 = showHuanbiMeasureArray.indexOf(measureInfo);
							if(index1 == -1){

								showHuanbiMeasureArray.push(measureInfo);

							}
						}else{
							// isNeedShowTongBiOption = true;
							var index2 = showTongbiMeasureArray.indexOf(measureInfo);
							if(index2 == -1){
								showTongbiMeasureArray.push(measureInfo);

							}
						}
						// showOrHidenSomeMeasureCompareOrLink();
						// $("#card .right_module .content_body #data_list_for_body .measureDiv>p").unbind('mouseenter');
						// $("#card .right_module .content_body #data_list_for_body .measureDiv>p").mouseenter(function(event){
						// 	event.stopPropagation();
						// 	showOrHide();
						// })
						// $("#card .right_module .content_body #data_list_for_body .measureDiv>p").unbind('mouseleave');
						// $("#card .right_module .content_body #data_list_for_body .measureDiv>p").mouseleave(function(event){
						// 	event.stopPropagation();
						// 	$("#card .content_body #data_list_for_body .measureDiv .cardInfo").hide();
						// })

						$(".me_out_content").remove();
						$(".me_out_content li").unbind("mouseenter mouseleave");
						open_or_close = true;
					});

				// 移除对比
				out_wrap_click.find(".deleteCompared").unbind("click");
				out_wrap_click.find(".deleteCompared").click(function(event){
					// console.log($(this).parents());
					event.stopPropagation();
					var measureInfo = $(this).parents(".drog_row_list").eq(0).attr("id").split(":")[1];
					var index1 = showHuanbiMeasureArray.indexOf(measureInfo);

					if(index1 != -1){
						showHuanbiMeasureArray.splice(index1,1);
					}
					var index2 = showTongbiMeasureArray.indexOf(measureInfo);
					if(index2 != -1){
						showTongbiMeasureArray.splice(index2,1);
					}
					showOrHidenSomeMeasureCompareOrLink();
					// $("#card .content_body #data_list_for_body .measureDiv .cardInfo .compareP").hide();
					// $("#card .content_body #data_list_for_body .measureDiv .cardInfo .linkP").hide();
					// showOrHide();
					// isNeedShowHuanBiOption = false;
					// isNeedShowTongBiOption = false;
					$(".me_out_content").remove();
					$(".me_out_content li").unbind("mouseenter mouseleave");
					open_or_close = true;
				});
				//移除
				out_wrap_click.find(".deleting").on("click",function(){
						var deleteInfo = $(this).parents(".drog_row_list").eq(0).attr("id").split(":");
						if(deleteInfo[0] == "measure"){
						var measureInfo = deleteInfo[1];
						var index1 = showHuanbiMeasureArray.indexOf(measureInfo);
						if(index1 != -1){
								showHuanbiMeasureArray.splice(index1,1);
							}
						var index2 = showTongbiMeasureArray.indexOf(measureInfo);
						if(index2 != -1){
								showTongbiMeasureArray.splice(index2,1);
							}
							showOrHidenSomeMeasureCompareOrLink();

						}
						if($(this).parents(".drag_main").attr("id") == "drag_col"){
							var clickAreaType = "column";
						}else{
							var clickAreaType = "row";
						}

					

					if($(this).parent().parent().parent().hasClass("list_wrap")){
						$(this).parent().parent().parent().remove();
					}else{
						$(this).parent().parent().remove();
					}

					remove_viewHandle(clickAreaType,"only");
					$(".me_out_content").remove();
					open_or_close = true;

					});

					//判断拖入的是否是计数
					if($(this).parent().hasClass("recordCount")){
						return;
					}
					//度量里点击事件
					out_wrap_click.find(".pop_count_all").click(function(event){
						event.stopPropagation();
						var measureList = $(this).parents(".me_out_content").eq(0);
						var measureInfo = measureList.data("pop_data_handle");
						var measureName = measureInfo.split("_YZY_")[2];
						if(drag_measureCalculateStyle[measureName] == "计数("+measureName+")"){
							return;
						}

						drag_measureCalculateStyle[measureName] = "计数("+measureName+")";
						measureList.siblings(".set_style.measure_list_text").children("span.measure_list_text_left").html("计数("+measureName+")");
						switch_chart_handle_fun();
					})

					//求和
					out_wrap_click.find(".pop_total").on("click",function(){

						var measureList = $(this).parents(".me_out_content").eq(0);
						var measureInfo = measureList.data("pop_data_handle");
						var measureName = measureInfo.split("_YZY_")[2];
						if(drag_measureCalculateStyle[measureName] == "求和("+measureName+")"){
							return;
						}
						drag_measureCalculateStyle[measureName] = "求和("+measureName+")";
						measureList.siblings(".set_style.measure_list_text").children("span.measure_list_text_left").html("求和("+measureName+")");
						switch_chart_handle_fun();
						$(".me_out_content").remove();
						$(".me_out_content li").unbind("mouseenter mouseleave");
						open_or_close = true;
					});
					//平均值
					out_wrap_click.find(".pop_mean").on("click",function(){
						var measureList = $(this).parents(".me_out_content").eq(0);
						var measureInfo = measureList.data("pop_data_handle");
						var measureName = measureInfo.split("_YZY_")[2];
						if(drag_measureCalculateStyle[measureName] == "平均值("+measureName+")"){
							return;
						}
						drag_measureCalculateStyle[measureName] = "平均值("+measureName+")";
						measureList.siblings(".set_style.measure_list_text").children("span.measure_list_text_left").html("平均值("+measureName+")");
						switch_chart_handle_fun();
						$(".me_out_content").remove();
						$(".me_out_content li").unbind("mouseenter mouseleave");
						open_or_close = true;
					});
					//最大值
					out_wrap_click.find(".pop_max").on("click",function(){
//							console.log("最大值");
						var measureList = $(this).parents(".me_out_content").eq(0);
						var measureInfo = measureList.data("pop_data_handle");
						var measureName = measureInfo.split("_YZY_")[2];
						if(drag_measureCalculateStyle[measureName] == "最大值("+measureName+")"){
							return;
						}
						drag_measureCalculateStyle[measureName] = "最大值("+measureName+")";
						measureList.siblings(".set_style.measure_list_text").children("span.measure_list_text_left").html("最大值("+measureName+")");
						switch_chart_handle_fun();
						$(".me_out_content").remove();
						$(".me_out_content li").unbind("mouseenter mouseleave");
						open_or_close = true;
					});
					//最小值
					out_wrap_click.find(".pop_min").on("click",function(){

						var measureList = $(this).parents(".me_out_content").eq(0);

						var measureInfo = measureList.data("pop_data_handle");
						var measureName = measureInfo.split("_YZY_")[2];
						if(drag_measureCalculateStyle[measureName] == "最小值("+measureName+")"){
							return;
						}
						drag_measureCalculateStyle[measureName] = "最小值("+measureName+")";
						measureList.siblings(".set_style.measure_list_text").children("span.measure_list_text_left").html("最小值("+measureName+")");
						switch_chart_handle_fun();
						$(".me_out_content").remove();
						$(".me_out_content li").unbind("mouseenter mouseleave");
						open_or_close = true;
					});
					// -------------------
					// -------------------
					})


					$(ele).parent().parent().on("mouseleave",function(){
						$(".me_out_content").remove();
						open_or_close = true;
					});

			}








//绘制分层上钻添加的维度
function dragDrillDimen(datatype,datacount){
			var tempList = $("<div class='list_wrap'><li class='drog_row_list date_list bj_information' id='dimensionality:"+datatype+"'><div class='drop_main clear set_style dimensionality_list_text ui-draggable ui-draggable-handle noPerter'><span class='dimensionality_list_text_left' datatype="+datatype+">"+datatype.split(":")[0]+"</span><div class='moreSelectBtn'><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'></div></div></li></div>");
			if(datacount == 0){
				$(".clickActive").parents(".annotation_text").prepend(tempList);
			}else{
				if($(".clickActive").parents(".annotation_text").find("li").eq(datacount - 1).parent().hasClass("list_wrap")){
					$(".clickActive").parents(".annotation_text").find("li").eq(datacount - 1).parent().after(tempList);
				}else{
					$(".clickActive").parents(".annotation_text").find("li").eq(datacount - 1).after(tempList);
				}
				
			}

		tempList.find(".set_style").on("mouseenter",function(){$(this).find(".moreSelectBtn").show()});
		tempList.find(".set_style").on("mouseleave",function(){$(this).find(".moreSelectBtn").hide()});
		tempList.find("li .set_style").css("background","#c5e0ff").css("border","1px solid #86a9d1");
			$(tempList).find("li").css({
			width: $(".annotation_text").width() * 0.91+ "px",
			margin: "5px auto 0",
			listStyle: "none",
		});
		$(tempList).find(".set_style").css({
			width: "94%",
			height: "23px",
			padding: "0px 5px",
			color: "black"
		});
		$(tempList).find(".set_style").find("span").css({
			float: "left",
			display: "block",
		});
		$(tempList).find("img").css({
			display: "block",
		})

		md_click_show(tempList.find("li").find(".moreSelectBtn"),{"编辑计算_YZY_edit_calculation":null,"度量_YZY_measure":["计数_YZY_pop_count_all","求和_YZY_pop_total","平均值_YZY_pop_mean","最大值_YZY_pop_max","最小值_YZY_pop_min"],"同比_YZY_compared":null,"环比_YZY_linkBack":null,"移除对比_YZY_deleteCompared":null,"移除_YZY_deleting":null});

}

// 数值单位操作
function drillNumHandle(){
			drag_row_column_data = JSON.parse(JSON.stringify(saveDrillDownTemp[$(".clickActive").find("span").text()]["viewdata"]));
			save_now_show_view_text = $("#"+ saveDrillDownTemp[$(".clickActive").find("span").text()]["viewType"]+"");
			currentColorGroupName = saveDrillDownTemp[$(".clickActive").find("span").text()]["dragViewStyle"].split("_YZY_")[0];
			normalUnitValue = saveDrillDownTemp[$(".clickActive").find("span").text()]["dragViewStyle"].split("_YZY_")[1];
			valueUnitValue = saveDrillDownTemp[$(".clickActive").find("span").text()]["dragViewStyle"].split("_YZY_")[2];
			editView_change_color(saveDrillDownTemp[$(".clickActive").find("span").text()]["dragViewStyle"],objectDeepCopy(saveDrillDownTemp[$(".clickActive").find("span").text()]["viewdata"])["row"]["dimensionality"].concat(objectDeepCopy(saveDrillDownTemp[$(".clickActive").find("span").text()]["viewdata"])["column"]["dimensionality"]));	
}



//上下钻点击事件
function drillDownClick(theElement,peter){
			if($(theElement).parent().attr("datavalue") == $("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul li").length -1){
				return;
			}
			var freeSaveClass = $(theElement).parent().hasClass("drillDownHandle");
			$("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul li:gt("+$(theElement).parent().attr("datavalue")+")").remove();
			if($(".drillDownHandle").length == 0){
				peter = "peter";
			}

			if(peter == "peter"){
					if(onlyGetDrillDown){
						saveDrillDownTemp[$(".clickActive").find("span").text()] = {"viewdata":JSON.parse(JSON.stringify(drag_row_column_data)),"viewType":save_now_show_view_text.attr("id"),"calculateStyle":objectDeepCopy(drag_measureCalculateStyle),"dragViewStyle":objectDeepCopy(currentColorGroupName)+"_YZY_"+objectDeepCopy(normalUnitValue)+"_YZY_"+objectDeepCopy(valueUnitValue)};
					}
					editView_change_color("默认_YZY_-1_YZY_个");
					if($(".peterMouse").parents(".annotation_text").find(".noPerter").length > 0){

						$(".noPerter").parents(".drog_row_list").remove();
						$(".peterMouse").parents(".annotation_text").find(".list_wrap").each(function(index,ele){
							if($(ele).find("li").length == 0){
								$(ele).remove();
							}
						})
					}
					$(".peterMouse").removeClass("clickActive");
					$(".peterMouse[datavalue="+$(theElement).parent().attr("datavalue")+"]").addClass("clickActive");

					handleMiChange();
					if($(".clickActive").length > 0 && saveDrillDownDict[$(".clickActive").find("span").text()] != undefined && saveDrillDownDict[$(".clickActive").find("span").text()].length > 0){
						for(var i = 0; i < saveDrillDownDict[$(".clickActive").find("span").text()].length;i++){
							dragDrillDimen(saveDrillDownDict[$(".clickActive").find("span").text()][i].split("_YZYPD_")[0],saveDrillDownDict[$(".clickActive").find("span").text()][i].split("_YZYPD_")[1]);
						}
						
					}
					peterDrillDown();
					drillNumHandle();
			}else{
				//记录当前上钻的数据
				saveHandleViewData = JSON.parse(JSON.stringify(saveDataAndView[Number($(theElement).parent().attr("datavalue"))]));				
				drag_row_column_data = saveHandleViewData["viewdata"];
				save_now_show_view_text = $("#"+saveHandleViewData["viewType"]+"");
				saveDataAndView.splice($(theElement).parent().attr("datavalue"));
			}

			
			var spliceCount = saveDimeData.splice($(theElement).parent().attr("datavalue"));
			dirllConditions.splice(dirllConditions.length - spliceCount.reduce((prev,curr) => prev + curr));
			valueCount = $(theElement).parent().attr("datavalue");

			
			if($(".drillDownHandle").length == 0){

				onlyGetDrillDown = true;
			}
			switch_chart_handle_fun();
	
}


//视图修改编辑修改方法
function changeEditViewFunction(editChangeView){

	//获得视图区域
	var editViewEcherts = echarts.getInstanceByDom($("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").get(0));
	var statementsViewToChangeNum = $("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").attr("class").match(/\d+/g)[1];
	var freeHandleStateDragData = {
		"row":JSON.parse(editChangeView["row"]),
		"column":JSON.parse(editChangeView["column"])
	}
	drag_row_column_data_arr[statementsViewToChangeNum] = objectDeepCopy(freeHandleStateDragData);
	drag_measureCalculateStyle_arr[statementsViewToChangeNum] = objectDeepCopy(JSON.parse(editChangeView["calculation"]));
	currentColorGroupName_arr[statementsViewToChangeNum] = objectDeepCopy(editChangeView["viewstyle"].split("_YZY_")[0]);
	normalUnitValue_arr[statementsViewToChangeNum] = objectDeepCopy(editChangeView["viewstyle"].split("_YZY_")[1]);
	valueUnitValue_arr[statementsViewToChangeNum] = objectDeepCopy(editChangeView["viewstyle"].split("_YZY_")[2]);
	saveDashboardPostData[statementsViewToChangeNum] = objectDeepCopy(editChangeView["handledatapost"]);
	statements_tonghuanbi_arr[statementsViewToChangeNum] = objectDeepCopy(editChangeView["sequential"]);
	statements_current_cube_name = objectDeepCopy(editChangeView["tablename"]);
	//获取对应容器的class
	var getClassContent = $("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").attr("class").split(" ").splice($("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").attr("class").split(" ").length -2);
	if(editChangeView["viewtype"] == "showTable_by_dragData()"){
		isagainDrawTable = true;
		if($("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main .edit_table").length == 0){
			$("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").empty().append($("<div class='edit_table'><div class='right_module' style='display: inline-block;'> <div class='top_column_container' style='display: inline-block'><p class='top_column_name'></p><table class='column_data_list' cellspacing='0' cellpadding='0'><tbody></tbody></table></div><div class='content_body'><ul id='data_list_for_body'></ul></div></div><div class='left_row_container'><table cellspacing='0' cellpadding='0'><thead><tr></tr></thead><tbody></tbody></table></div></div></div>"));
			$("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").removeClass().addClass("new_view_main clear new_view_table "+getClassContent[0]+" "+getClassContent[1]+"").removeAttr("_echarts_instance_");
		}
		$("#pageStatementsModule .view_show_handle[viewId="+editChangeView["id"]+"]").removeClass().addClass("view_show_handle clear view_handle_table");
		manyTable($("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").attr("class").split(" ")[$("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").attr("class").split(" ").length -2]);
	}else if(editChangeView["viewtype"] == "col_card()"){
		if($("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main .cardInfo").length == 0){
			$("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").empty().append($("<div class='right_module'><div class='content_body'><ul class='session_data_list_for_body'></ul></div></div>"));
			$("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").removeClass().addClass("new_view_main clear new_view_indexPage "+getClassContent[0]+" "+getClassContent[1]+"").removeAttr("_echarts_instance_");
		}
		$("#pageStatementsModule .view_show_handle[viewId="+editChangeView["id"]+"]").removeClass().addClass("view_show_handle clear view_handle_indexPage");
		runIndexPage($("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").attr("class").split(" ")[$("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").attr("class").split(" ").length -2]);
		$("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_indexPage .right_module").css("marginTop",($("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").height()-30)/2 - 80 + "px");
	}else{
		if($("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main canvas").length == 0){
			$("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").html("");
		}
		if(allKeys(JSON.parse(editChangeView["drilldowndata"])["saveDrillDownTemp"]).length > 0){
			console.log("abcd")
		}
		$("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li[viewId="+editChangeView["id"]+"]").find(".new_view_main").removeClass().addClass("new_view_main clear "+getClassContent[0]+" "+getClassContent[1]+"");
		$("#pageStatementsModule .view_show_handle[viewId="+editChangeView["id"]+"]").removeClass().addClass("view_show_handle clear");
		viewshow_class = getClassContent[0];
		eval("reporting_"+editChangeView["viewtype"].replace(/\)/,","+statementsViewToChangeNum)+")");
	}

	$.post("../dashboard/getAllData",function(result){
		ajax_data_post = result;
	})

}




function pallasdaraFunctionNavBtnHandle(){
	// 获取当前可用的导航选项
//	var arr = navBtnAbleAndDisablegetHandle();
	$.ajax({
		 url:"/dataCollection/judgeIcon",
          type:"POST",
          dataType:"json",
          contentType: "application/json; charset=utf-8",
          async: true,
          data:JSON.stringify(),
          success:function(data){
       		if(data.status == 'success'){
       			var res = data.results;
			    if(res.constructview == 1) {
					buildDataFunction_able();
				}
				if(res.dashboardview == 1) {
					dashBoradFunction_able();
				}else{
					$(".container .main .leftNav #navDashBoardViewBtn").find("img").attr("src","/static/images/dashboard-disable.png");
					$(".container .main .leftNav #navDashBoardViewBtn").removeClass("ableFlag").addClass("disableFlag");
				}
				if(res.statementview == 1) {
					reporttingFunction_abale();
				}else{
					$(".container .main .leftNav #navReporttingViewBtn").find("img").attr("src","/static/images/statements-disable.png");
					$(".container .main .leftNav #navReporttingViewBtn").removeClass("ableFlag").addClass("disableFlag");
				}
				$(".container .main .leftNav .functionBtn").unbind("click");
				$(".container .main .leftNav .functionBtn").click(function(event){
					// alert(1);

					if($(this).children("div").hasClass("active") || $(this).hasClass("disableFlag") ) {

						event.preventDefault();

						return;
					}
					if($(this).attr("id") != "navDashBoardViewBtn"){
							var preClickViewNav = preClickView || {} ;
							preClickView[$("#pageDashboardModule #dashboard_content #new_view .auto_show").find(".folderview_li_span").text()] = realSaveData();

					}

					switch ($(this).attr("id")){
						case"navDataBaseAndPanleFileConnectionViewBtn":
							changePageTo_DataBaseAndPanleFileConnectionView();
							break;
						case "navBuildDataViewBtn":
							$(".main .rightConent #pageDashboardModule").data("isFirstInto",false);
							changePageTo_navBuildDataView();
							break;
						case "navDashBoardViewBtn":
							changePageTo_navDashBoardView();
							break;
						case "navReporttingViewBtn":
							changePageTo_navReporttingView(true);
							break;
						default:
							break;
					}
				});
       		}
          }
	});



}

function buildDataFunction_able(){
	$(".container .main .leftNav #navBuildDataViewBtn").find("img").attr("src","/static/images/buildData-able.png");
	$(".container .main .leftNav #navBuildDataViewBtn").removeClass("disableFlag");
	$(".container .main .leftNav #navBuildDataViewBtn").addClass("ableFlag");
}
function dashBoradFunction_able(){
	$(".container .main .leftNav #navDashBoardViewBtn").find("img").attr("src","/static/images/dashboard-able.png");
	$(".container .main .leftNav #navDashBoardViewBtn").removeClass("disableFlag");
	$(".container .main .leftNav #navDashBoardViewBtn").addClass("ableFlag");

}
function reporttingFunction_abale(){
	$(".container .main .leftNav #navReporttingViewBtn").find("img").attr("src","/static/images/statements-able.png");
	$(".container .main .leftNav #navReporttingViewBtn").removeClass("disableFlag");
	$(".container .main .leftNav #navReporttingViewBtn").addClass("ableFlag");
}

// 切换页面
function changePageTo_DataBaseAndPanleFileConnectionView(){
	hidenSomeElementsWhenChangePage();

	$(".container .main .leftNav .functionBtn").children("div.active").removeClass("active");
	$(".container .main .leftNav #navDataBaseAndPanleFileConnectionViewBtn").children("div").addClass("active");
	$(".container .main .leftNav .functionBtn.ableFlag").each(function(index,ele){
		var imgSrc = $(ele).children("img").eq(0).attr("src");
		imgSrc = imgSrc.replace("-select.png", "-able.png");
		$(ele).children("img").eq(0).attr("src",imgSrc);
	});
	$(".container .main .leftNav #navDataBaseAndPanleFileConnectionViewBtn").find("img").attr("src","/static/images/connect-select.png");
	$(".main .rightConent .pageModuleNav").hide();
	$(".main .rightConent #dataSourceConnectSelectDiv").show();



}
function changePageTo_navBuildDataView(){

	hidenSomeElementsWhenChangePage();
	var currentPageId = $(".container .main .leftNav .functionBtn").children("div.active").eq(0).parent().attr("id");
	$(".container .main .leftNav .functionBtn").children("div.active").removeClass("active");
	$(".container .main .leftNav #navBuildDataViewBtn").children("div").addClass("active");
	$(".container .main .leftNav .functionBtn.ableFlag").each(function(index,ele){
		var imgSrc = $(ele).children("img").eq(0).attr("src");
		imgSrc = imgSrc.replace("-select.png", "-able.png");
		$(ele).children("img").eq(0).attr("src",imgSrc);
	});
	$(".container .main .leftNav #navBuildDataViewBtn").find("img").attr("src","/static/images/buildData-select.png");
	$(".main .rightConent .pageModuleNav").hide();
	$(".main .rightConent #analysisContainer").show();

	if($(".main .rightConent #analysisContainer").data("isFirstInto")){
		dataAnalysisFunction();
//		navBtnAbleAndDisablesaveHandle("navBuildDataViewBtn");
		$(".main .rightConent #analysisContainer").data("isFirstInto",false);
	}else{
		if(currentPageId == "navDataBaseAndPanleFileConnectionViewBtn"){
			dataAnalysisFunction(true);
		}
	}
}
function changePageTo_navDashBoardView(){
	hidenSomeElementsWhenChangePage();
	var currentPageId = $(".container .main .leftNav .functionBtn").children("div.active").eq(0).parent().attr("id");
	$(".container .main .leftNav .functionBtn").children("div.active").removeClass("active");
	$(".container .main .leftNav #navDashBoardViewBtn").children("div").addClass("active");
	$(".container .main .leftNav .functionBtn.ableFlag").each(function(index,ele){
		var imgSrc = $(ele).children("img").eq(0).attr("src");
		imgSrc = imgSrc.replace("-select.png", "-able.png");
		$(ele).children("img").eq(0).attr("src",imgSrc);
	});
	$(".container .main .leftNav #navDashBoardViewBtn").find("img").attr("src","/static/images/dashboard-select.png");
	$(".main .rightConent .pageModuleNav").hide();
	$(".main .rightConent #pageDashboardModule").show();


	if($(".main .rightConent #pageDashboardModule").data("isFirstInto")){
		dashboardReadySumFunction();
//		navBtnAbleAndDisablesaveHandle("navDashBoardViewBtn");
		$(".main .rightConent #pageDashboardModule").data("isFirstInto",false);
	}else{
		if(currentPageId == "navBuildDataViewBtn" || currentPageId == "navReporttingViewBtn"){
			dashboardReadySumFunction(true);
		}
	}

}

function changePageTo_navReporttingView(unloadPage){
	hidenSomeElementsWhenChangePage();
	var currentPageId = $(".container .main .leftNav .functionBtn").children("div.active").eq(0).parent().attr("id");
	$(".container .main .leftNav .functionBtn").children("div.active").removeClass("active");
	$(".container .main .leftNav #navReporttingViewBtn").children("div").addClass("active");
	$(".container .main .leftNav .functionBtn.ableFlag").each(function(index,ele){
		var imgSrc = $(ele).children("img").eq(0).attr("src");
		imgSrc = imgSrc.replace("-select.png", "-able.png");
		$(ele).children("img").eq(0).attr("src",imgSrc);
	});
	$(".container .main .leftNav #navReporttingViewBtn").find("img").attr("src","/static/images/statements-select.png");
	$(".main .rightConent .pageModuleNav").hide();
	$(".main .rightConent #pageStatementsModule").show();

	if($(".main .rightConent #pageStatementsModule").data("isFirstInto")){
		satetementsReadySumFunction(unloadPage);
//		navBtnAbleAndDisablesaveHandle("navReporttingViewBtn");
		$(".main .rightConent #pageStatementsModule").data("isFirstInto",false);
	}else{
		if(currentPageId == "navDashBoardViewBtn"){
			satetementsReadySumFunction(true);
		}
	}
}



function hidenSomeElementsWhenChangePage(){
	$("#buildDataPanelView").hide();
	$(".maskLayer").hide();
	$("#connectDataBaseInfo").hide();
	$(".rightConent #dataSourceConnectSelectDiv #dataList").hide();
	$(".rightConent #analysisContainer .leftSlide #analysis_dataList").hide();
	$("#user-filter-select").hide();
	// $("#sizer_content").hide();
}

// 进行判断,如果已经显示弹窗并点击的时候隐藏
// if($(".filter_content_btn").clicked == true && $(this).id == "navDashBoardViewBtn"){
// 	$("sizer_content").hide();
// }


// $(".filter_content_btn").click(function(){
// 	alert("123ljdflaj");
// 	//$("#navDashBoardViewBtn").click(function(){
// 	// 	alert(1);
// 	// 	// $("sizer_content").hide();
// 	// })
// })

//function navBtnAbleAndDisablesaveHandle(info){
//	var arr = navBtnAbleAndDisablegetHandle();
//	if(arr.indexOf(info) == -1){
//		arr.push(info)
//	}
//	window.localStorage.setItem("navAbleAndDisable",JSON.stringify(arr));
//}
//function navBtnAbleAndDisablegetHandle(){
//	var res =  JSON.parse(window.localStorage.getItem("navAbleAndDisable"));
//	if(!res){res= []};
//	return res;
//}

function dbAndPanelInfoSaveHandle(info){

	window.localStorage.setItem("dbandPanelInfo",JSON.stringify(info));

}
function dbAndPanelInfoGetHandle(){
	var res =  JSON.parse(window.localStorage.getItem("dbandPanelInfo"));
	if(!res){res= ""};
	return res;
}

function dbAndPanelInfoDeleteHandle(){
	window.localStorage.removeItem("dbandPanelInfo");
}


window.getAbsCoordinates=function(e){
	e = e[0];
    var pos = {top: 0, left: 0};
    while(e && e.tagName != "HTML"){
        pos.left += e.offsetLeft;
        pos.top += e.offsetTop;
        e=e.offsetParent;
    }
    return pos;
};
 var opts = {
    lines: 13, // 花瓣数目
    length: 10, // 花瓣长度
    width: 5, // 花瓣宽度
    radius: 15, // 花瓣距中心半径
    corners: 1, // 花瓣圆滑度 (0-1)
    rotate: 0, // 花瓣旋转角度
    direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
    color: '#dedede', // 花瓣颜色
    speed: 1, // 花瓣旋转速度
    trail: 60, // 花瓣旋转时的拖影(百分比)
    shadow: false, // 花瓣是否显示阴影
    hwaccel: false, //spinner 是否启用硬件加速及高速旋转
    className: 'spinner', // spinner css 样式名称
    zIndex: 2e9, // spinner的z轴 (默认是2000000000)
};

var spinner = new Spinner(opts);
// 去除度量和维度后面保存的 数据类型
function specialRemoveDataTypeHandle(obj){
	var rs = [];
	for (var i  = 0;i < obj.length;i++) {
		var ele = obj[i].split(":")[0];
		rs.push(ele);
	}
	return rs;
}


//input  onfoucs 事件
function toInputStyle(ele){
	$(ele).css("borderColor","#0d53a4");
}

function toInputStyleBlur(ele){
	$(ele).css("borderColor","#DEDEDE");
}
