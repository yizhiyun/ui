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
		
		main.style.height = (doc.offsetHeight | doc.body.offsetHeight) - 70 + "px";
		leftNav.style.height = (doc.offsetHeight | doc.body.offsetHeight) - 70 + "px";		
}
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
        for (var i = 0; i < arguments[0].length; ++i)
        {
            if (typeof arguments[0][i] != typeof arguments[1][i])
                return false;

            if (typeof arguments[0][i] == 'number' && typeof arguments[1][i] == 'number')
                allElementsEqual = (arguments[0][i] == arguments[1][i]);
            else
                allElementsEqual = arguments.callee(arguments[0][i], arguments[1][i]);            //递归判断对象是否相等                
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

function pallasdaraFunctionNavBtnHandle(){
	
	var currentPath = window.location.pathname;

	if(/dataCollection\/dataBuildView/.test(currentPath)){
		$(".container .main .leftNav #navBuildDataViewBtn").siblings(".functionBtn").children("div.active").removeClass("active");
		$(".container .main .leftNav #navBuildDataViewBtn").children("div").addClass("active");
	}
	
	if(/dashboard\/pallasdata2/.test(currentPath)){
		$(".container .main .leftNav #navDashBoardViewBtn").siblings(".functionBtn").children("div.active").removeClass("active");
		$(".container .main .leftNav #navDashBoardViewBtn").children("div").addClass("active");
	}
	
	if(/statements\/pallasdata3/.test(currentPath)){
		$(".container .main .leftNav #navReporttingViewBtn").siblings(".functionBtn").children("div.active").removeClass("active");
		$(".container .main .leftNav #navReporttingViewBtn").children("div").addClass("active");
	}
	
	
	var navArr = navBtnAbleAndDisablegetHandle();
	if(navArr.indexOf("navBuildDataViewBtn") != -1){
		buildDataFunction_able();
	}
	if(navArr.indexOf("navDashBoardViewBtn") != -1){
		dashBoradFunction_able();
	}
	if(navArr.indexOf("navReporttingViewBtn") != -1){
		reporttingFunction_abale();
	}
	
	$(".container .main .leftNav .ableFlag").unbind("click");
	$(".container .main .leftNav .ableFlag").click(function(event){
		if ($(this).children("div").hasClass("active")) {
			event.preventDefault();
			return;
		}
		switch ($(this).attr("id")){
			case"navDataBaseAndPanleFileConnectionViewBtn":
				window.location.href = "/dataCollection/pallasdata";
				break;
			case "navBuildDataViewBtn":
				window.location.href = "/dataCollection/dataBuildView";
				break;
			case "navDashBoardViewBtn":
				window.location.href = "/dashboard/pallasdata2";
				break;
			case "navReporttingViewBtn":
				window.location.href = "/statements/pallasdata3";
				break;
			default:
				break;
		}
	});
}

function buildDataFunction_able(){
	$(".container .main .leftNav #navBuildDataViewBtn").find("img").attr("src","/static/images/icon_nor_06.png");
	$(".container .main .leftNav #navBuildDataViewBtn").removeClass("disableFlag");
	$(".container .main .leftNav #navBuildDataViewBtn").addClass("ableFlag");

}
function dashBoradFunction_able(){
	$(".container .main .leftNav #navDashBoardViewBtn").find("img").attr("src","/static/images/icon_nor_08.png");
	$(".container .main .leftNav #navDashBoardViewBtn").removeClass("disableFlag");
	$(".container .main .leftNav #navDashBoardViewBtn").addClass("ableFlag");

}
function reporttingFunction_abale(){
	$(".container .main .leftNav #navReporttingViewBtn").find("img").attr("src","/static/images/icon_nor_10.png");
	$(".container .main .leftNav #navReporttingViewBtn").removeClass("disableFlag");
	$(".container .main .leftNav #navReporttingViewBtn").addClass("ableFlag");
}

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

function navBtnAbleAndDisablesaveHandle(info){
	var arr = navBtnAbleAndDisablegetHandle();
	if(arr.indexOf(info) == -1){
		arr.push(info)
	}
	window.localStorage.setItem("navAbleAndDisable",JSON.stringify(arr));
}
function navBtnAbleAndDisablegetHandle(){
	var res =  JSON.parse(window.localStorage.getItem("navAbleAndDisable"));
	if(!res){res= []};
	return res; 
}
function navBtnAbleAndDisabledeleteHandle(){
	window.localStorage.removeItem("navAbleAndDisable");
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
