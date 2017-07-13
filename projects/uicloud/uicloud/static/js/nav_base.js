/**
 * Created by guoxiaomin on 2017/6/14.
 */
(function(doc,win){
	win.onload = function(){
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


// 帅选器功能
$(function(){
/*-------------- 内容选择器--折叠切换,-----------------------、*/
/*-------------- 数值选择器--折叠切换,-----------------------、*/
	$("#filter-model .common-fold-module").tabs();
	

	// 选择器单选按钮
	$("#filter-model .radio").click(function(){
		if ($(this).attr("belong") == "condition") {
			 $("#contentChooser #condition .conditionSelectRadio").removeClass("active");	
		}else if($(this).attr("belong") == "headpiece"){
			$("#contentChooser #headpiece .radio").removeClass("active");
		}else if($(this).attr("belong") == "filter-number-special"){
			 $(this).siblings(".radio").removeClass("active")
		}else if($(this).attr("belong") == "filter-date-relative"){
			 $("#date-filter #relative-date-box .date-detail-range-radios .radio").removeClass("active")
		}else{
			 $(this).siblings("p").removeClass("active");
		}
		
		 $(this).addClass("active");
	});
	//条件里面的+按钮
	$("#contentChooser #condition .byFiledConditionSelectDiv .topTitle .add").eq(0).click(function(event){
		event.stopPropagation();
		
		
		$.ajax({
			type:"post",
			url:"/filterConditionAdd",
			data:{"flag":"content-term"},
			success:function(data){
				var ele = $(data);
				ele.css("padding-top","20px");
				$(ele).find("select").comboSelect();
				$("#contentChooser #condition .byFiledConditionSelectDiv .scrollBody-box").eq(0).append(ele);
			}
		});
	});
	
	// 顶部里面的+按钮
	$("#contentChooser #headpiece .headpiece-body .headpiece-body-filed-title .add").eq(0).click(function(event){
		event.stopPropagation();		
		$.ajax({
			type:"post",
			url:"/filterConditionAdd",
			data:{"flag":"content-top"},
			success:function(data){
				var ele = $(data);
				ele.css("padding-top","20px");
				$(ele).find("select").comboSelect();
				$("#contentChooser #headpiece .headpiece-body .headpiece-scroll-box").eq(0).append(ele);
			}
		});
	});
	
	
	
	/*数值选择器部分配置-------------------*/
	// 值范围
	$("#number-filter .fold-module #value-range-box .value-slider-box .slider-ranage").eq(0).slider({
		range:true,
		min:0,
		max:500,
		values:[100,300],
		slide:function(event,ui){
			$("#number-filter .fold-module #value-range-box .value-input-box .min-value-input").eq(0).val(ui.values[0]);
			$("#number-filter .fold-module #value-range-box .value-input-box .max-value-input").eq(0).val(ui.values[1]);
		}
	});
	// 至多
	$("#number-filter .fold-module #at-most-box .value-slider-box .slider-ranage").eq(0).slider({
		range:"min",
		min:0,
		max:500,
		value:250,
		slide:function(event,ui){
			$("#number-filter .fold-module #at-most-box .value-input-box .max-value-input").eq(0).val(ui.value);
		}
	});
	// 至少
	$("#number-filter .fold-module #at-least-box .value-slider-box .slider-ranage").eq(0).slider({
		range:"max",
		min:0,
		max:500,
		value:250,
		slide:function(event,ui){
			$("#number-filter .fold-module #at-least-box .value-input-box .min-value-input").eq(0).val(ui.value);
		}
	});
	
	
	
	//  设置中文
	 $.datepicker.regional['zh-CN'] = {  
        closeText: '关闭',  
        prevText: '<上月',  
        nextText: '下月>',  
        currentText: '今天',  
        monthNames: ['一月','二月','三月','四月','五月','六月',  
        '七月','八月','九月','十月','十一月','十二月'],  
        monthNamesShort: ['一','二','三','四','五','六',  
        '七','八','九','十','十一','十二'],  
        dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],  
        dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],  
        dayNamesMin: ['日','一','二','三','四','五','六'],  
        weekHeader: '周',  
        dateFormat: 'yy-mm-dd',  
        firstDay: 1,  
        isRTL: false,  
        showMonthAfterYear: true,  
        yearSuffix: '年'};  
    $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
//  
	// 日期选择器部分配置
	// 相对日期--按钮点击设置
	$("#date-filter .date-filter-body #relative-date-box .date-unit-btns a").click(function(){
		$(this).siblings("a").removeClass("active");
		$(this).addClass("active");
	});
	// 日期范围--日期选择
	$("#date-filter .date-filter-body #range-date-box .date-input-select-box .input-box input").datepicker({
		dateFormat:"yy/mm/dd",
     	 changeYear: true
	});
	// 开始--日期选择
	$("#date-filter .date-filter-body #date-start-box .date-input-select-box .min-date-input-box input").datepicker({
		dateFormat:"yy/mm/dd",
     	 changeYear: true
	});
	// 结束日期选择
	$("#date-filter .date-filter-body #date-finish-box .date-input-select-box .max-date-input-box input").datepicker({
		dateFormat:"yy/mm/dd",
     	 changeYear: true
	});
	
	// 滑动条
	$("#date-filter #range-date-box .date-slider-box .slider-ranage").eq(0).slider({
		range:true,
		min:20171001,
		max:20171031,
		values:[20171005,20171024],
		slide:function(event,ui){
//			$("#number-filter .fold-module #at-least-box .value-input-box .min-value-input").eq(0).val(ui.value);
		}
	});
	
	$("#date-filter #date-start-box .date-slider-box .slider-ranage").eq(0).slider({
		range:"max",
		min:20171001,
		max:20171031,
		value:20171024,
		slide:function(event,ui){
//			$("#number-filter .fold-module #at-least-box .value-input-box .min-value-input").eq(0).val(ui.value);
		}
	});
	
	
	$("#date-filter #date-finish-box .date-slider-box .slider-ranage").eq(0).slider({
		range:"min",
		min:20171001,
		max:20171031,
		value:20171024,
		slide:function(event,ui){
//			$("#number-filter .fold-module #at-least-box .value-input-box .min-value-input").eq(0).val(ui.value);
		}
	});
});
