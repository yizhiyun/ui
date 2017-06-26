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
