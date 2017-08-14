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


