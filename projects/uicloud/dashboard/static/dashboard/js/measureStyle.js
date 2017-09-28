
$(function(){
	
//	$("#editMeasureCalculateView .edit_measure_body .calculate_input_box .arithmeticInputTextArea").change(function(event){
//		event.stopPropagation();
//		$("#editMeasureCalculateView .edit_measure_body #measure_show_title").val($(this).val());
//	});
	
//	searchTipHandle($("#editMeasureCalculateView .edit_measure_body .calculate_input_box .arithmeticInputTextArea"),["SUM","AVERAGE","MAX","MIN"]);
	 
	 
});

function searchTipHandle(needTipElement,allData){
	
	$(needTipElement).bind("input",function(){
			contentChangeHandle(this);
	});
	$(needTipElement).bind("propertychange",function(){
			contentChangeHandle(this);
	});
	var searchModule = $("<div class='searchModule'></div>");
	$(needTipElement).wrap(searchModule);
	var searchList = $("<ul class='searchReasultsList'></ul>");
	$(needTipElement).parent(".searchModule").append(searchList);
	$(needTipElement).data("allData",allData);
	function contentChangeHandle(ele){
		$(ele).parent(".searchModule").children(".searchReasultsList").empty();
		var pos = kingwolfofsky.getInputPositon(ele);
		$(ele).parent(".searchModule").children(".searchReasultsList").css({
			"top":pos.bottom +5+ "px",
			"left":pos.left + "px"
		});
		var cuurentVal= $(ele).val();
		var reg = eval("/^"+cuurentVal+"/i");
		var allData = $(ele).data("allData");
		for (var i = 0;i < allData.length;i++) {
			var aData = allData[i];
			(function(aData){
				if(reg.test(aData)){
					var li = $("<li><img/ src='/static/dashboard/img/F_03.png'><span>"+aData+"</span></li>");
					$(ele).parent(".searchModule").children(".searchReasultsList").append(li);
					li.click(function(event){
						event.stopPropagation();
						var clickValue = $(this).children("span").text();
						$("#editMeasureCalculateView .edit_measure_body .calculate_input_box .arithmeticInputTextArea").val(clickValue);
						$("#editMeasureCalculateView .edit_measure_body #measure_show_title").val(clickValue);
						$(this).parent(".searchReasultsList").empty();
					});
				}
			})(aData);
		}	
	}
	$(needTipElement).bind("focusout",function(event){
		event.stopPropagation();
//		$(this).parent(".searchModule").children(".searchReasultsList").empty();
	})
}

var kingwolfofsky = {
    /**
    * 获取输入光标在页面中的坐标
    * @param		{HTMLElement}	输入框元素        
    * @return		{Object}		返回left和top,bottom
    */
    getInputPositon: function (elem) {
        if (document.selection) {   //IE Support
            elem.focus();
            var Sel = document.selection.createRange();
            return {
                left: Sel.boundingLeft,
                top: Sel.boundingTop,
                bottom: Sel.boundingTop + Sel.boundingHeight
            };
        } else {
            var that = this;
            var cloneDiv = '{$clone_div}', cloneLeft = '{$cloneLeft}', cloneFocus = '{$cloneFocus}', cloneRight = '{$cloneRight}';
            var none = '<span style="white-space:pre-wrap;"> </span>';
            var div = elem[cloneDiv] || document.createElement('div'), focus = elem[cloneFocus] || document.createElement('span');
            var text = elem[cloneLeft] || document.createElement('span');
            var offset = that._offset(elem), index = this._getFocus(elem), focusOffset = { left: 0, top: 0 };

            if (!elem[cloneDiv]) {
                elem[cloneDiv] = div, elem[cloneFocus] = focus;
                elem[cloneLeft] = text;
                div.appendChild(text);
                div.appendChild(focus);
                document.body.appendChild(div);
                focus.innerHTML = '|';
                focus.style.cssText = 'display:inline-block;width:0px;overflow:hidden;z-index:-100;word-wrap:break-word;word-break:break-all;';
                div.className = this._cloneStyle(elem);
                div.style.cssText = 'visibility:hidden;display:inline-block;position:absolute;z-index:-100;word-wrap:break-word;word-break:break-all;overflow:hidden;';
            };
            div.style.left = this._offset(elem).left + "px";
            div.style.top = this._offset(elem).top + "px";
            var strTmp = elem.value.substring(0, index).replace(/</g, '<').replace(/>/g, '>').replace(/\n/g, '<br/>').replace(/\s/g, none);
            text.innerHTML = strTmp;

            focus.style.display = 'inline-block';
            try { focusOffset = this._offset(focus); } catch (e) { };
            focus.style.display = 'none';
            return {
                left: focusOffset.left,
                top: focusOffset.top,
                bottom: focusOffset.bottom
            };
        }
    },

    // 克隆元素样式并返回类
    _cloneStyle: function (elem, cache) {
        if (!cache && elem['${cloneName}']) return elem['${cloneName}'];
        var className, name, rstyle = /^(number|string)$/;
        var rname = /^(content|outline|outlineWidth)$/; //Opera: content; IE8:outline && outlineWidth
        var cssText = [], sStyle = elem.style;

        for (name in sStyle) {
            if (!rname.test(name)) {
                val = this._getStyle(elem, name);
                if (val !== '' && rstyle.test(typeof val)) { // Firefox 4
                    name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
                    cssText.push(name);
                    cssText.push(':');
                    cssText.push(val);
                    cssText.push(';');
                };
            };
        };
        cssText = cssText.join('');
        elem['${cloneName}'] = className = 'clone' + (new Date).getTime();
        this._addHeadStyle('.' + className + '{' + cssText + '}');
        return className;
    },

    // 向页头插入样式
    _addHeadStyle: function (content) {
        var style = this._style[document];
        if (!style) {
            style = this._style[document] = document.createElement('style');
            document.getElementsByTagName('head')[0].appendChild(style);
        };
        style.styleSheet && (style.styleSheet.cssText += content) || style.appendChild(document.createTextNode(content));
    },
    _style: {},

    // 获取最终样式
    _getStyle: 'getComputedStyle' in window ? function (elem, name) {
        return getComputedStyle(elem, null)[name];
    } : function (elem, name) {
        return elem.currentStyle[name];
    },

    // 获取光标在文本框的位置
    _getFocus: function (elem) {
        var index = 0;
        if (document.selection) {// IE Support
            elem.focus();
            var Sel = document.selection.createRange();
            if (elem.nodeName === 'TEXTAREA') {//textarea
                var Sel2 = Sel.duplicate();
                Sel2.moveToElementText(elem);
                var index = -1;
                while (Sel2.inRange(Sel)) {
                    Sel2.moveStart('character');
                    index++;
                };
            }
            else if (elem.nodeName === 'INPUT') {// input
                Sel.moveStart('character', -elem.value.length);
                index = Sel.text.length;
            }
        }
        else if (elem.selectionStart || elem.selectionStart == '0') { // Firefox support
            index = elem.selectionStart;
        }
        return (index);
    },

    // 获取元素在页面中位置
    _offset: function (elem) {
        var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement;
        var clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0;
        var top = box.top + (self.pageYOffset || docElem.scrollTop) - clientTop, left = box.left + (self.pageXOffset || docElem.scrollLeft) - clientLeft;
        return {
            left: left,
            top: top,
            right: left + box.width,
            bottom: top + box.height
        };
    }
};

function getPosition(ctrl) {
    var p = kingwolfofsky.getInputPositon(ctrl);
    document.getElementById('show').style.left = p.left + "px";
    document.getElementById('show').style.top = p.bottom + "px";
}