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

function initWindowSize(doc,win){
		var main = doc.getElementsByClassName("main")[0];
		main.style.height = (doc.clientHeight | doc.body.clientHeight) - 70 + "px";
}
