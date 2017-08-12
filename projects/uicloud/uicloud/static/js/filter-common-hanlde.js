/*筛选器的处理*/
var conditionFilter_record = {};// 存储某个表格的帅选条件
var filter_from_in = null; // “buildData” "dashboard",主要为了区分筛选器从哪进入
var finishCallBackFun = null; // 筛选完成之后回调的函数
$(function(){
	
/*-------------- 折叠切换,-----------------------、*/
	$("#filter-model .common-fold-module").tabs();
	// 选择器单选按钮
	$("#filter-model .radio").click(function(){
		if ($(this).attr("belong") == "condition") {
			if(!$(this).hasClass("active")){
				$("#contentChooser #condition .radio").removeClass("active");
			  	$(this).addClass("active");
			}
			 
		}else if($(this).attr("belong") =="number-filter"){
			if(!$(this).hasClass("active")){
				$("#filter-model #number-filter .number-filter-body .condition-select-box .radiosBtns .radio").removeClass("active");
				 $(this).addClass("active");
			}
		}else if($(this).attr("belong") == "filter-date-relative"){
			if(!$(this).hasClass("active")){
				 $("#date-filter #relative-date-box .date-detail-range-radios .radio").removeClass("active")
				  $(this).addClass("active");
				 bottom_date_indictor_label_fun();
			}
		}else{
			if(!$(this).hasClass("active")){
				 $(this).siblings("p").removeClass("active");
				  $(this).addClass("active");
			 }
		}
		
		
	});
	
		/*数值选择器部分配置-------------------*/	
	$("#filter-model #number-filter .number-filter-body .condition-select-box .radiosBtns .userInput_box").focusin(function(event){
		
		event.stopPropagation();
		$("#filter-model #number-filter .number-filter-body .condition-select-box .radiosBtns .radio").removeClass("active");
		$("#filter-model #number-filter .number-filter-body .condition-select-box .radiosBtns .userInput_box .radio").addClass("active");
	});
	
	$("#filter-model #number-filter .number-filter-body .condition-select-box .radiosBtns .userSelect_div").focusin(function(event){
		event.stopPropagation();
		$("#filter-model #number-filter .number-filter-body .condition-select-box .radiosBtns .radio").removeClass("active");
		$("#filter-model #number-filter .number-filter-body .condition-select-box .radiosBtns .userSelect_div .radio").addClass("active");
	});
	/*end-----------数值选择器部分配置-------------------*/
	
	
	
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
		if(!$(this).hasClass("active")){
			$(this).siblings("a").removeClass("active");
			$(this).addClass("active");
			// 页面的变化处理
			if($(this).attr("class") == "day"){
				$("#date-filter .date-filter-body #relative-date-box .date-detail-range-radios .radio-group:eq(0) .flexibleOp").hide();
			}else{
				$("#date-filter .date-filter-body #relative-date-box .date-detail-range-radios .radio-group:eq(0) .flexibleOp").show();
			}
			$("#date-filter .date-filter-body #relative-date-box .radio-group span.unit").html($(this).html());
			bottom_date_indictor_label_fun();
		}
	});
	// 数值选择旋转器
	$("#date-filter .date-filter-body #relative-date-box .radio-group input.spinner").spinner({
		min:0,
		step:1,
		start:1,
		numberFormat:"n",
		icons:{
			down:"spinnerDownIcon",
			up: "spinnerUpIcon"
		}
	});
	// 限制只能输入数字
	$("#date-filter .date-filter-body #relative-date-box .radio-group input.spinner").keyup(function(event){
		event.stopPropagation();
		if(this.value.length==1){
			this.value=this.value.replace(/[^0-9]/g,'')
		}else{
			this.value=this.value.replace(/\D/g,'');
		}
		bottom_date_indictor_label_fun();
	});	
	
	// 日期上方 tab 切换的时候
	$("#date-filter .date-filter-body .fold-select-btns li>a").click(function(){
		if($(this).attr("data") == "range"){
			$("#date-filter #range-date-box .date-slider-box .slider-ranage").eq(0).dateRangeSlider("resize");
		}
		if($("#date-filter p.bottomDateIndictor."+$(this).attr("data")).html().length < 5){
			bottom_date_indictor_label_fun();
		}else{
			dateBottomLableShow($(this).attr("data"));
		}
		
		
		
	})
	// 底部指示 label的显示选择
	function dateBottomLableShow(whichLabel){
		if(whichLabel == "releative" && $("#date-filter p.bottomDateIndictor.range").is(":visible")){
			$("#date-filter p.bottomDateIndictor.range").hide();
			$("#date-filter p.bottomDateIndictor.releative").show();	
		}else if(whichLabel == "range" && $("#date-filter p.bottomDateIndictor.releative").is(":visible")){
			$("#date-filter p.bottomDateIndictor.releative").hide();
			$("#date-filter p.bottomDateIndictor.range").show();	
		}
	}
	
	//日期输入框变化的时候
	$("#date-filter .date-filter-body #range-date-box .date-input-select-box .input-box input.minDate").change(function(){
		var dateValueArr = $(this).val().split("/");
		$("#date-filter #range-date-box .date-slider-box .slider-ranage").eq(0).dateRangeSlider("min",new Date( dateValueArr[0], Number(dateValueArr[1]) - 1, dateValueArr[2]));
		
		$("#date-filter #range-date-box .date-slider-box .range-flag .min-date-flag").html(dateValueArr[0] + "/" + dateValueArr[1]+"/"+dateValueArr[2]);
		bottom_date_indictor_label_fun();
	});
	
	$("#date-filter .date-filter-body #range-date-box .date-input-select-box .input-box input.maxDate").change(function(){
		var dateValueArr = $(this).val().split("/");
		$("#date-filter #range-date-box .date-slider-box .slider-ranage").eq(0).dateRangeSlider("max",new Date( dateValueArr[0], Number(dateValueArr[1]) - 1, dateValueArr[2]));
		$("#date-filter #range-date-box .date-slider-box .range-flag .max-date-flag").html(dateValueArr[0] + "/" + dateValueArr[1]+"/"+dateValueArr[2]);	
		bottom_date_indictor_label_fun();
	});
	
	
	// 日期选择器  摘要显示内容
	function bottom_date_indictor_label_fun(){
		var dateActiveMode = $("#date-filter .date-filter-body ul.fold-select-btns li.ui-state-active a").eq(0);
		if (dateActiveMode.html() == "相对日期") {
			var activeRadio = $("#date-filter .date-filter-body #relative-date-box .radio-group .radio.active");
			
			var type = activeRadio.attr("data"); // 用来区分单选按钮
			
			var unit = $("#date-filter .date-filter-body #relative-date-box .date-unit-btns a.active").eq(0).html(); // 当前单位
			var primaryText = null; // 要显示的文字	
			switch (type){
				case "full":	
				primaryText = GetDateStr(0,unit);
					break;
				case "now":
				primaryText = GetDateStr(null,unit);
					break;
				case "preOne":
				primaryText = GetDateStr(-1,unit);
					break;
				case "preSome":
				primaryText = GetDateStr(-Number(activeRadio.find(".spinner").val()),unit);
					break;
				case "nextOne":
				primaryText = GetDateStr(1,unit);
					break;
				case "nextSome":
				primaryText = GetDateStr(Number(activeRadio.find(".spinner").val()),unit);
					break;
				default:
					break;
			}
			dateBottomLableShow("releative");
			$("#date-filter p.bottomDateIndictor.releative").eq(0).html(primaryText);
			
		}else{
			dateBottomLableShow("range");
			var startDate = $("#date-filter #range-date-box .date-slider-box .range-flag .min-date-flag").html();
			var endDate =  $("#date-filter #range-date-box .date-slider-box .range-flag .max-date-flag").html();
			$("#date-filter p.bottomDateIndictor.range").eq(0).html(startDate + " 至 " + endDate);
			
		}
	}
	function GetDateStr(AddCount,unit) {   
	   var dd = new Date(); // 当前日期
	   var currentYear = dd.getFullYear();
	   var currentMonth = dd.getMonth();
	   var currentDay = dd.getDate();
	   var currentWeek = dd.getDay();
	   var currQuarter = Math.floor( ((currentMonth+1) % 3 == 0 ? ( (currentMonth+1) / 3 ) : ( (currentMonth+1) / 3 + 1 ) ) );	
	   var startDate = null; // 下方显示的开始日期
	   var endDate  = null;  // 下方显示的结束日期
	   if(unit == "年"){
	   	 if(AddCount == 0 || AddCount == -1 || AddCount == 1){
	   	 	startDate = new Date(currentYear + AddCount,0,1);
	   	  	endDate =  new Date(currentYear + AddCount,11,31);
	   	 }else if(AddCount > 1){
	   	 	startDate = new Date(currentYear+ 1,0,1);
	   	 	endDate =  new Date(currentYear+ AddCount,11,31);
	   	 }else if(AddCount < -1){
	   	 	startDate = new Date(currentYear+ AddCount,0,1);
	   	 	endDate =  new Date(currentYear - 1,11,31);
	   	 }else{
	   	 	startDate = new Date(currentYear,0,1);
	   	 	endDate = dd;
	   	 } 	  
	   }else if(unit == "季"){
	   		if(AddCount == 0 || AddCount == -1 || AddCount == 1){
	   			startDate = new Date(currentYear,(currQuarter-1 + AddCount)*3,1);
	   			endDate = new Date(currentYear,(currQuarter + AddCount)*3 - 1,getDaysInOneMonth(currentYear,(currQuarter + AddCount)*3 - 1));
	   		}else if(AddCount > 1){
	   			startDate = new Date(currentYear,currQuarter*3,1);
	   			endDate = new Date(currentYear,(currQuarter + AddCount)*3 - 1,getDaysInOneMonth(currentYear,(currQuarter + AddCount)*3 - 1));
	   		}else if(AddCount < -1){
	   			startDate = new Date(currentYear,(currQuarter -1 + AddCount)*3,1);
	   			endDate = new Date(currentYear,(currQuarter -1)*3 - 1,getDaysInOneMonth(currentYear,(currQuarter -1)*3 - 1));
	   		}else{
	   			startDate = new Date(currentYear,(currQuarter -1)*3,1);
	   			endDate = new Date(currentYear,currentMonth,currentDay);
	   		}
	   		
	   }else if(unit == "月"){
	   		if(AddCount == 0 || AddCount == -1 || AddCount == 1){
	   			startDate = new Date(currentYear,currentMonth+AddCount,1);
	   			endDate = new Date(currentYear,currentMonth+AddCount,getDaysInOneMonth(currentYear,currentMonth+AddCount));
	   		}else if(AddCount > 1){
	   			startDate = new Date(currentYear,currentMonth+1,1);
	   			endDate = new Date(currentYear,currentMonth + AddCount,getDaysInOneMonth(currentYear,currentMonth + AddCount));
	   		}else if(AddCount < -1){
	   			startDate = new Date(currentYear,currentMonth + AddCount,1);
	   			endDate = new Date(currentYear,currentMonth - 1,getDaysInOneMonth(currentYear,currentMonth - 1));
	   		}else{
	   			startDate = new Date(currentYear,currentMonth,1);
	   			endDate = new Date(currentYear,currentMonth,currentDay);
	   		}
	   		
	   }else if(unit == "周"){
	   		var num = AddCount * 7;
	   		
	   		if(AddCount == 0){
	   		 	startDate = new Date(currentYear,currentMonth,currentDay - currentWeek);
	   		 	endDate = new Date(currentYear,currentMonth,currentDay + (6 - currentWeek));
	   		}else if(AddCount > 0){
	   			startDate = new Date(currentYear,currentMonth,currentDay + (6 - currentWeek));
	   			endDate = new Date(currentYear,currentMonth,currentDay + (6 - currentWeek) + num);
	   		}else if(AddCount < 0){
	   			startDate = new Date(currentYear,currentMonth,currentDay - currentWeek + num);
	   			endDate = new Date(currentYear,currentMonth,currentDay -currentWeek - 1);
	   		}else{
	   			startDate = new Date(currentYear,currentMonth,currentDay - currentWeek);
	   			endDate = new Date(currentYear,currentMonth,currentDay + (6 - currentWeek));
	   		}
	   		
	   }else if(unit == "天"){
	   	if(AddCount == 0 || AddCount == -1 || AddCount == 1){
	   	 	startDate = new Date(currentYear,currentMonth,currentDay + AddCount);
	   	  	endDate =  new Date(currentYear,currentMonth,currentDay + AddCount);
	   	 }else if(AddCount > 1){
	   	 	startDate = new Date(currentYear,currentMonth,currentDay + 1);
	   	 	endDate =  new Date(currentYear,currentMonth,currentDay + AddCount);
	   	 }else if(AddCount < -1){
	   	 		startDate = new Date(currentYear,currentMonth,currentDay + AddCount);
	   	 		endDate =  new Date(currentYear,currentMonth,currentDay - 1);
	   	 }  
	   }
	   return formatDate(startDate) + " 至 " + formatDate(endDate);
	   
	} 
   function formatDate(aDate){
   	 var y = aDate.getFullYear();   
	 var m = (aDate.getMonth()+1)<10?"0"+(aDate.getMonth()+1):(aDate.getMonth()+1);//获取当前月份的日期，不足10补0  
	 var d = aDate.getDate()<10?"0"+aDate.getDate():aDate.getDate();//获取当前几号，不足10补0  
	 return y+"/"+m+"/"+d;   
   }
	   
   function getDaysInOneMonth(year, month){
		month = parseInt(month+1,10);
		var d= new Date(year,month,0);  //这个是都可以兼容的
		return d.getDate();
	}
	
	// 筛选器的位置
	$(window).resize(function(){
		//  调整筛选器的大小和位置
		size_of_screeningWasher_fun();
	});
	
	/*编辑-选择字段的时候-筛选器*/
	$("#filter-model #user-filter-select .addBtn").click(function(){
		loading_data_of_select_fields_fun();
		$("#filter-model #fileds-content-select").show();
		$("#filter-model #user-filter-select").css("opacity",0.2);
		$("#filter-model #fileds-content-select").css({
			top:($("body").outerHeight() - $("#filter-model #fileds-content-select").outerHeight()) / 2,
			left:($("body").outerWidth() - $("#filter-model #fileds-content-select").outerWidth()) / 2,
		});
	});
	
	// 编辑--取消的时候
	$("#filter-model #user-filter-select .cancleBtn").add("#filter-model #user-filter-select .close").click(function(event){
		event.stopPropagation();
		$("#filter-model #user-filter-select").hide();
		$(".maskLayer").hide();
	});
	
	// 取消关闭按钮点击的时候
	$("#filter-model #fileds-content-select .close").add("#filter-model #fileds-content-select .common-filer-footer .cancleBtn").click(function(){
		$("#filter-model #fileds-content-select").hide();
		$("#filter-model #user-filter-select").css("opacity",1);
	});
	// 确定按钮点击的时候
	$("#filter-model #fileds-content-select .confirmBtn").click(function(){
		var type = $("#filter-model #fileds-content-select .fileds-list .active").eq(0).data("type");
		if (type.isTypeString()) {
			content_screeningWasher_fun();
		}else if (type.isTypeDate()){
			date_screeningWasher_fun();
		}else if(type.isTypeNumber()){
			number_screeningWasher_fun();
		}else if(type.isTypeSpace()){
			content_screeningWasher_fun();
		}
		$("#filter-model #fileds-content-select").hide();
		$("#filter-model #user-filter-select").css("opacity",1);
	});
	
	// 加载选择字段-弹框-的数据
	function loading_data_of_select_fields_fun(){
		
		$("#filter-model #fileds-content-select .fileds-list").html("");
			for (var i = 0;i < bottom_panel_fileds.length;i++){
	   			if (bottom_panel_fileds[i]["isable"] == "yes"){
	   				var li = $("<li>"+bottom_panel_fileds[i]["Field"]+"</li>");
	   				li.data("type",bottom_panel_fileds[i]["Type"]);
	   				if(currentHandleColOrRowEles){
	   					var currentSelectColumnName = currentHandleColOrRowEles.eq(0).children("span").eq(0).html();
		   				if(bottom_panel_fileds[i]["Field"] == currentSelectColumnName){
		   					li.addClass("active");
		   				}
	   				}
	   				
	   				$("#filter-model #fileds-content-select .fileds-list").append(li);
	   			}	
	   		}
			if(!$("#filter-model #fileds-content-select .fileds-list .active").length || $("#filter-model #fileds-content-select .fileds-list .active").length < 1){
				$("#filter-model #fileds-content-select .fileds-list li:first").addClass("active");
			}
			
		// 给所有li绑定点击事件
		$("#filter-model #fileds-content-select .fileds-list li").click(function(){
			$(this).siblings("li").removeClass("active");
			$(this).addClass("active");
		});
	}
	
	
	// 点击每个筛选器上的关闭按钮的时候
	$("#filter-model .screeningWasher .common-head .close").click(function(event){
		event.stopPropagation();
		$(this).parents(".screeningWasher").eq(0).hide();
		$(".maskLayer").hide();	
	});
	// 点击每个筛选器上的取消按钮的时候
	$("#filter-model .screeningWasher .common-filer-footer .cancleBtn").click(function(event){
		event.stopPropagation();
		$(this).parents(".screeningWasher").eq(0).hide();
		$(".maskLayer").hide();	
	});
	
	//点击每个筛选器上的确定按钮的时候
	$("#filter-model .screeningWasher .common-filer-footer .confirmBtn").click(function(event){
		event.stopPropagation();
		// 判断当前是哪个选择器
		var filterID = $(this).parents(".screeningWasher").eq(0).attr("id");
			// 取出所有条件 处理数据
		screeningWasher_did_finish_filter_handle_data_fun(filterID);
	});

	
	/*内容选择器*/
	// 记录内容选择器复选框的选择情况
	var content_select_count = 0;
	var content_select_max = 0;
	// 内容选择器
	function content_screeningWasher_fun(){
		$("#filter-model .screeningWasher").hide();
		$("#filter-model #contentChooser").show();
			size_of_screeningWasher_fun();
			var repeat_record = [];
			content_select_count = 0;
			// 清空
			$("#filter-model #contentChooser #common .detailSearchData .dataList").empty();
			
		//1、创建常规区域的选择列表
		var field = $("#filter-model #fileds-content-select .fileds-list .active").eq(0).html();
		
		for (var i = 0;i <  filterNeedAllData.length;i++) {
			if(repeat_record.indexOf(filterNeedAllData[i][field]) == -1){
				repeat_record.push(filterNeedAllData[i][field]);
				
				var li = $("<li><label><input type='checkbox' checked='checked'/><span>"+filterNeedAllData[i][field]+"</span></label></li>");
				li.find("input").attr("value",filterNeedAllData[i][field]);
				$("#filter-model #contentChooser #common .detailSearchData .dataList").append(li);
				// 每个复选框绑定事件
				li.find("input").change(function(){
					if (this.checked) {
						content_select_count++
					}else{
						content_select_count--;
					}
					if (content_select_count === content_select_max) {
						$("#filter-model #contentChooser #common #selectAllInCommon").prop("checked",true);
					}else{
						$("#filter-model #contentChooser #common #selectAllInCommon").attr("checked",false);
					}
					content_common_summary_show_fun("common");
				});
			}
		}
		content_select_max = repeat_record.length;
		content_select_count = content_select_max;
		//2、摘要 字段填充数据
		content_common_summary_show_fun("common",field);
			//3、条件部分 按字段填充
		condition_by_field_dataFill_fun();
		
			// 第一次调用，显示具体的选择条件内容
		detailSelectConidtion_content_generate_fun($("#contentChooser #condition .byFiledConditionSelectDiv .scrollBody-box .line-condition:eq(0) .conditionSelectDiv select"));
		
		
	}
	
	// 全选按钮
	$("#filter-model #contentChooser #common #selectAllInCommon").change(function(event){
		event.stopPropagation();
		if (this.checked) {
			$("#filter-model #contentChooser #common .detailSearchData .dataList li input").prop("checked",true);
			content_select_count = content_select_max;
		}else{
			$("#filter-model #contentChooser #common .detailSearchData .dataList li input").attr("checked",false);
			content_select_count = 0;
		}
		content_common_summary_show_fun("common");
	});
	// 剔除按钮
	$("#filter-model #contentChooser #common #cancleSelectedInCommmon").change(function(event){
		event.stopPropagation();
		content_common_summary_show_fun("common")
	});
	// 摘要部分 条件 按钮点击的时候
	$("#filter-model #contentChooser #common .summaryPanel .summary-list .conditionLi a").eq(0).click(function(event){
		event.stopPropagation();
		$("#filter-model #contentChooser ul.btns li a.conditionBtn").trigger("click");
	});
	
	// 摘要部分显示计算
	function content_common_summary_show_fun(from,field){
		/*
		 * from = common/condition
		 */
		if (from == "common") {
				// 全选按钮
			var SelectAllBtn = $("#filter-model #contentChooser #common #selectAllInCommon");
			// 剔除按钮
			var eliminateBtn = $("#filter-model #contentChooser #common #cancleSelectedInCommmon");
			if(field){
				$("#filter-model #contentChooser #common .summaryPanel .summary-list .filedLi span").html(field);
			}
			
			// 摘要部分所选内容
			var  select_content = $("#filter-model #contentChooser #common .summaryPanel .summary-list .selectedContentLi span").eq(0);		
			if(SelectAllBtn.get(0).checked && !eliminateBtn.get(0).checked){
				select_content.html("全部 (总共"+content_select_max+"项)");
			}else if(SelectAllBtn.get(0).checked && eliminateBtn.get(0).checked){
				select_content.html("0项 (总共"+content_select_max+"项)");
			}else if(!SelectAllBtn.get(0).checked && !eliminateBtn.get(0).checked){
				select_content.html(content_select_count + "项 (总共"+content_select_max+"项)");
			}else if(!SelectAllBtn.get(0).checked && eliminateBtn.get(0).checked){
				select_content.html(content_select_max - content_select_count + "项 (总共"+content_select_max+"项)");
			}
		}else if(from == "condition"){
			var condition_content = $("#filter-model #contentChooser #common .summaryPanel .summary-list .conditionLi a").eq(0);
			var currentCondition = $("#filter-model #contentChooser #condition .radio.active").eq(0);
			if (currentCondition.html() == "无") {
				condition_content.html("无");
			}else if (currentCondition.html() == "按字段") {
				var allLineCondition = $("#contentChooser #condition .byFiledConditionSelectDiv .scrollBody-box .line-condition");
				var str = "";
				allLineCondition.each(function(index,ele){
					var relation_eleValue = $(ele).find(".conditionSelectDiv .condition-selct").val();
					if($(ele).find(".relation_and_or_div span.active") && $(ele).find(".relation_and_or_div span.active").length && $(ele).find(".relation_and_or_div span.active").length > 0){
						str += "<span style='color:#ff7e00'>"+$(ele).find(".relation_and_or_div span.active").html()+"</span>";
					}
					
					if(!(relation_eleValue == "前N个" || relation_eleValue == "后N个")){
						str += $(ele).find(".fieldSelctDiv .field-selct").val() + " " + relation_eleValue;
					}
					if (relation_eleValue == "=" || relation_eleValue == "!=") {
						str +=  $(ele).find(".detailConditionDiv .detail-condition").val();
					}else if(relation_eleValue == "前N个" || relation_eleValue == "后N个"){
						str += "前" + $(ele).find(".detailConditionDiv .flagUserInputLabel input").val() + "个";
					}else if (relation_eleValue == "为空" || relation_eleValue == "非空") {	
					}else{
						str += $(ele).find(".detailConditionDiv .simpleUserInputLabel input").val();
					}
				});
				condition_content.html(str);
			}
			
		}
		
		
	}
	// 条件部分
	$("#filter-model #contentChooser #condition .radio").click(function(event){
		event.stopPropagation();
		if ($(this).html() == "无") {
			$("#contentChooser #condition .byFiledConditionSelectDiv .scrollBody-box .mask_cover").show();
			
		}else if($(this).html() == "按字段"){
			$("#contentChooser #condition .byFiledConditionSelectDiv .scrollBody-box .mask_cover").hide();
		}
		content_common_summary_show_fun("condition");
		
	});
	//条件部分 按字段  填充数据
	function condition_by_field_dataFill_fun(){
		var parent = $("#contentChooser #condition .byFiledConditionSelectDiv .scrollBody-box .line-condition .fieldSelctDiv select");
		parent.eq(parent.length - 1).empty();
		for (var i = 0;i < bottom_panel_fileds.length;i++){
			if (bottom_panel_fileds[i]["isable"] == "yes"){
				var op = $("<option>"+bottom_panel_fileds[i]["Field"]+"</option>");
				parent.eq(parent.length - 1).append(op);				
			}	
		}
		parent.eq(parent.length - 1).comboSelect();
		
		
		// select 选项变化的时候
		parent.eq(parent.length - 1).change(function(){
			detailSelectConidtion_content_generate_fun($(this).parents(".fieldSelctDiv:eq(0)").siblings(".conditionSelectDiv").find(".condition-selct").eq(0));
		});
		
	}
	// 条件部分添加按钮
	$("#contentChooser #condition .byFiledConditionSelectDiv .topTitle .add").eq(0).click(function(event){
			event.stopPropagation();
			contentChooser_condition_addBtn_fun(function(){
				// 填充数据
				condition_by_field_dataFill_fun();
				// 监测 条件 select 的变化
				contidon_value_change_fun();
				// 决定具体 的选择内容
				detailSelectConidtion_content_generate_fun($("#contentChooser #condition .byFiledConditionSelectDiv .scrollBody-box .line-condition:last .conditionSelectDiv select"));
				// 每个条件上关闭按钮点击的时候
				lineCondition_closeBtnDidClicked_fun();
		});	
		
	});
	// 每个条件上关闭按钮点击的时候
	function lineCondition_closeBtnDidClicked_fun(){
		$("#contentChooser #condition .byFiledConditionSelectDiv .scrollBody-box .line-condition:last .close").click(function(){
			$(this).parent(".line-condition").remove();
		});
	}
	lineCondition_closeBtnDidClicked_fun();
	// 条件部分具体选择内容的显示和数据填充等
	function detailSelectConidtion_content_generate_fun(relation_select_ele){
		var val = $(relation_select_ele).val();
		var detailConditionDiv = $(relation_select_ele).parents(".conditionSelectDiv").eq(0).next(".detailConditionDiv");
		detailConditionDiv.children().hide();
		
		if (val== "=" || val == "!=") {
			var field_selct = detailConditionDiv.siblings(".fieldSelctDiv").eq(0).find(".field-selct");
			var field = field_selct.val();
			detailConditionDiv.find(".detail-condition").empty();
				var repeat_record = [];
				for (var i = 0;i <  filterNeedAllData.length;i++) {
					if(repeat_record.indexOf(filterNeedAllData[i][field]) == -1){
						repeat_record.push(filterNeedAllData[i][field]);	
						var op = $("<option>"+filterNeedAllData[i][field]+"</option>");
						op.attr("value",filterNeedAllData[i][field]);
						detailConditionDiv.find(".detail-condition").append(op);
					}
			}
			detailConditionDiv.find(".detail-condition").comboSelect();
			detailConditionDiv.children(".combo-select").show();
			
		}else if(val == "前N个" || val == "后N个"){
			detailConditionDiv.children(".flagUserInputLabel").show();
		}else if(val == "为空" || val == "非空"){	
		}else{
			detailConditionDiv.children(".simpleUserInputLabel").show();
		}
		
	}
	// 等于、不等于等关系条件变化的时候
	function contidon_value_change_fun(){
		var parent = $("#contentChooser #condition .byFiledConditionSelectDiv .scrollBody-box .line-condition:last .conditionSelectDiv select");
		
		parent.change(function(){
			
		  detailSelectConidtion_content_generate_fun($(this));
		
		});
	}
	contidon_value_change_fun();
	/*end-内容选择器*/
	
	/*数值选择器*/
	function number_screeningWasher_fun(){
		// 当前选择的数值类型字段
		var field = $("#filter-model #fileds-content-select .fileds-list .active").eq(0).html();
		$("#filter-model #number-filter .number-filter-head span.logo").eq(0).html("筛选器 " + field);
		// 处理筛选器上的数据
		dataHandleWork($("#tableDataDetailListPanel").attr("nowShowTable"),field,"numberType",function(data){
			
			// 众数处理
			var userSelect_num =  $("#number-filter .number-filter-body .condition-select-box .radiosBtns .userSelect_div .custom-select");
			if(data.modeArr.length > 0){
				userSelect_num.find("#modeOption").attr("disabled","false");
			}else{
				userSelect_num.find("#modeOption").prop("disabled","true");
			}
			
			// 滑块
			$("#number-filter  #value-range-box .value-slider-box .slider-ranage").eq(0).slider({
				range:true,
				min:data.min,
				max:data.max,
				values:[data.min,data.max],
				slide:function(event,ui){
					$("#number-filter  #value-range-box .value-input-box .min-value-input").eq(0).val(ui.values[0]);
					$("#number-filter  #value-range-box .value-input-box .max-value-input").eq(0).val(ui.values[1]);
				}
			});
			// 最大值最小值
			$("#number-filter .number-filter-body  .slider-common-setting .value-slider-box .range-flag .min-value-flag").html(data.min);
			$("#number-filter .number-filter-body  .slider-common-setting .value-slider-box .range-flag .max-value-flag").html(data.max);
			
			$("#number-filter  #value-range-box .value-input-box .min-value-input").eq(0).val(data.min);
			$("#number-filter  #value-range-box .value-input-box .max-value-input").eq(0).val(data.max);
			
			
			
		});
		
		
		$("#filter-model .screeningWasher").hide();
		$("#filter-model #number-filter").show();
		size_of_screeningWasher_fun();	
	}

	// 数值筛选器  滑块和输入框同步函数
	function number_filter_sliderAndInput_synchro(){
		$("#number-filter  #value-range-box .value-input-box .min-value-input").eq(0).bind('input propertychange',function(){
		$("#number-filter  #value-range-box .value-slider-box .slider-ranage").eq(0).slider("values",[$	(this).val(),$("#number-filter  #value-range-box .value-input-box .max-value-input").eq(0).val()]);
	});
	
		$("#number-filter  #value-range-box .value-input-box .max-value-input").eq(0).bind('input propertychange',function(){
		$("#number-filter  #value-range-box .value-slider-box .slider-ranage").eq(0).slider("values",[$("#number-filter  #value-range-box .value-input-box .min-value-input").eq(0).val(),$(this).val()]);
	});
	}
	number_filter_sliderAndInput_synchro();

	/*end--数值选择器*/
	/* 日期选择器*/
	
	
	function date_screeningWasher_fun(){
		var field = $("#filter-model #fileds-content-select .fileds-list .active").eq(0).html();
		$("#filter-model #date-filter .date-filter-head span.logo").eq(0).html("筛选器 " + field);
		
		bottom_date_indictor_label_fun(); // 第一次计算相对日期里面的数据
		// 计算日期范围里面的数据
		dataHandleWork($("#tableDataDetailListPanel").attr("nowShowTable"),field,"dateType",function(data){
			
			$("#date-filter .date-filter-body #range-date-box .date-input-select-box .input-box input.minDate").val(data.min.year+"/"+data.min.month+"/"+data.min.day);
			$("#date-filter .date-filter-body #range-date-box .date-input-select-box .input-box input.maxDate").val(data.max.year+"/"+data.max.month+"/"+data.max.day);
			
			$("#date-filter #range-date-box .date-slider-box .range-flag .min-date-flag").html(data.min.year+"/"+data.min.month+"/"+data.min.day);
			$("#date-filter #range-date-box .date-slider-box .range-flag .max-date-flag").html(data.max.year+"/"+data.max.month+"/"+data.max.day);
			
			// 日期范围--日期选择
			$("#date-filter .date-filter-body #range-date-box .date-input-select-box .input-box input.minDate").datepicker({
				dateFormat:"yy/mm/dd",
	     		 changeYear: true,
	     		 minDate:new Date(data.min.year,Number(data.min.month)-1,data.min.day),
	     		 maxDate:new Date(data.max.year,Number(data.max.month)-1,data.max.day),
	     		 defaultDate:new Date(data.min.year,Number(data.min.month)-1,data.min.day),
	     		 buttonImage:"/static/images/contentFilter/calendar.png",
	     		 buttonText:"选择开始日期",
	     		 showOn: "both",
	     		 buttonImageOnly: true
			});
			$("#date-filter .date-filter-body #range-date-box .date-input-select-box .input-box input.maxDate").datepicker({
				dateFormat:"yy/mm/dd",
	     		 changeYear: true,
	     		 minDate:new Date(data.min.year,Number(data.min.month)-1,data.min.day),
	     		 maxDate:new Date(data.max.year,Number(data.max.month)-1,data.max.day),
	     		 defaultDate:new Date(data.max.year,Number(data.max.month)-1,data.max.day),
	     		 buttonImage:"/static/images/contentFilter/calendar.png",
	     		 buttonText:"选择结束日期",
	     		 showOn: "both",
	     		 buttonImageOnly: true
			});
				// 滑动条					
				$("#date-filter #range-date-box .date-slider-box .slider-ranage").eq(0).dateRangeSlider({
					defaultValues:{min:new Date(data.min.year,Number(data.min.month)-1 ,data.min.day), max:new Date(data.max.year,Number(data.max.month)-1 ,data.max.day)},
					bounds:{min:new Date(data.min.year,Number(data.min.month)-1 ,data.min.day), max:new Date(data.max.year,Number(data.max.month)-1 ,data.max.day)},
					wheelMode: null,
					valueLabels:"hide",
					step:{
						days:1
					}
				});
				$(".ui-rangeSlider .ui-rangeSlider-handle").css("top","-3px");
				$("#date-filter #range-date-box .date-slider-box .slider-ranage").eq(0).unbind("userValuesChanged");
				$("#date-filter #range-date-box .date-slider-box .slider-ranage").eq(0).bind("userValuesChanged",function(e,data){
					
					$("#date-filter .date-filter-body #range-date-box .date-input-select-box .input-box input.minDate").val(formatDate(data.values.min));
					$("#date-filter .date-filter-body #range-date-box .date-input-select-box .input-box input.maxDate").val(formatDate(data.values.max));
			
					$("#date-filter #range-date-box .date-slider-box .range-flag .min-date-flag").html(formatDate(data.values.min));
					$("#date-filter #range-date-box .date-slider-box .range-flag .max-date-flag").html(formatDate(data.values.max));			
					
					$("#date-filter .date-filter-body #range-date-box .date-input-select-box .input-box input.mindate").datepicker("setDate",data.values.min);
					$("#date-filter .date-filter-body #range-date-box .date-input-select-box .input-box input.maxDate").datepicker("setDate",data.values.max);
					
					bottom_date_indictor_label_fun();
				});	
		});

		$("#filter-model .screeningWasher").hide();
		$("#filter-model #date-filter").show();
		if($("#date-filter #range-date-box .date-slider-box .slider-ranage").eq(0).is(":visible")){
			$("#date-filter #range-date-box .date-slider-box .slider-ranage").eq(0).dateRangeSlider("resize");
		}
		size_of_screeningWasher_fun();	
	}
	
   /*end--- 日期选择器*/

});

//  调整筛选器的大小和位置
function size_of_screeningWasher_fun() {
	if($(".screeningWasher").is(":visible")) {

		$(".screeningWasher").map(function(index, ele) {
			$(ele).css({
				top: ($("body").outerHeight() - $(ele).outerHeight()) / 2,
				left: ($("body").outerWidth() - $(ele).outerWidth()) / 2,
			});
		});
	}
	if($("#filter-model #user-filter-select").is(":visible")) {
		$("#filter-model #user-filter-select").css({
			top: ($("body").outerHeight() - $("#filter-model #user-filter-select").outerHeight()) / 2,
			left: ($("body").outerWidth() - $("#filter-model #user-filter-select").outerWidth()) / 2,
		})
	}

	if($("#filter-model #fileds-content-select").is(":visible")) {
		$("#filter-model #fileds-content-select").css({
			top: ($("body").outerHeight() - $("#filter-model #fileds-content-select").outerHeight()) / 2,
			left: ($("body").outerWidth() - $("#filter-model #fileds-content-select").outerWidth()) / 2,
		})
	}
}



//  内容选择器加号按钮实现的功能函数
function contentChooser_condition_addBtn_fun(finishCallBack){
	$.ajax({
			type:"post",
			url:"/filterConditionAdd",
			data:{"flag":"content-term"},
			success:function(data){
				var ele = $(data);
				$(ele).find(".custom-select").comboSelect();
				$("#contentChooser #condition .byFiledConditionSelectDiv .scrollBody-box").eq(0).append(ele);
				finishCallBack();
			}
	});
}

/* 处理筛选器选择好条件之后*/
function screeningWasher_did_finish_filter_handle_data_fun(filterID) {
	// 当前正在操作的表格
	var tableInfo = $("#tableDataDetailListPanel").attr("nowShowTable");
	if(!conditionFilter_record[tableInfo]) {
		conditionFilter_record[tableInfo] = {};
		conditionFilter_record[tableInfo]["common"] = [];
		conditionFilter_record[tableInfo]["condition"] = [];
	}
	if(filterID == "contentChooser") {
		// 全选按钮
		var SelectAllBtn = $("#filter-model #contentChooser #common #selectAllInCommon");
		// 剔除按钮
		var eliminateBtn = $("#filter-model #contentChooser #common #cancleSelectedInCommmon");

		// 常规里面选中的列
		var column_name = $("#filter-model #contentChooser #common .summaryPanel .summary-list .filedLi span").html();

		/*处理常规内容*/
		if(SelectAllBtn.get(0).checked && eliminateBtn.get(0).checked) {
			var index = conditionFilter_record[tableInfo]["common"].hasObject("columnName", column_name);
			if(index == -1) {
				var filter = {
					"type": "isin",
					"columnName": column_name,
					"value": []
				}
				conditionFilter_record[tableInfo]["common"].push(filter);
			}
		} else if(!SelectAllBtn.get(0).checked && !eliminateBtn.get(0).checked) {
			common_data_hanlde(false);

		} else if(!SelectAllBtn.get(0).checked && eliminateBtn.get(0).checked) {
			common_data_hanlde(true);
		}

		function common_data_hanlde(is_eliminate) {
			var index = conditionFilter_record[tableInfo]["common"].hasObject("columnName", column_name);
			var selectValue = [];
			var checkBoxs;
			if(is_eliminate) {
				checkBoxs = $("#filter-model #contentChooser #common .detailSearchData .dataList li input:not(:checked)");
			} else {
				checkBoxs = $("#filter-model #contentChooser #common .detailSearchData .dataList li input:checked");
			}
			checkBoxs.each(function(number, ele) {
				selectValue.push($(ele).val());
			});
			if(index == -1) {
				var filter = {
					"type": "isin",
					"columnName": column_name,
					"value": selectValue
				};
				conditionFilter_record[tableInfo]["common"].push(filter);
			} else {
				conditionFilter_record[tableInfo]["common"][index]["value"] = selectValue;
			}
		}
		/*end----------处理常规内容*/
		if($("#filter-model #contentChooser #condition .radio.active").eq(0).html() == "按字段") {
			/*处理条件内容*/
			$("#contentChooser #condition .byFiledConditionSelectDiv .scrollBody-box .line-condition").each(function(number, ele) {
				var field = $(ele).find(".fieldSelctDiv .field-selct").eq(0).val();
				var relation = $(ele).find(".conditionSelectDiv .condition-selct").eq(0).find("option:selected").attr("data");
				var value = "";
				if(relation == "=" || relation == "!=") {
					value = $(ele).find(".detailConditionDiv .detail-condition").eq(0).val();
				} else if(relation == "limit") {
					value = Number($(ele).find(".detailConditionDiv .flagUserInputLabel input").eq(0).val());
				} else {
					value = $(ele).find(".detailConditionDiv .simpleUserInputLabel input").eq(0).val();
				}

				if(relation == "limit") {
					var index = conditionFilter_record[tableInfo]["condition"].hasObject("type", "limit");
					if(index == -1) {
						var filter = {
							"type": "limit",
							"value": value
						}
						conditionFilter_record[tableInfo]["condition"].push(filter);
					} else {
						conditionFilter_record[tableInfo]["condition"][index]["value"] = value;
					}
				} else if(relation == "isnull" || relation == "isnotnull") {
					var index = conditionFilter_record[tableInfo]["condition"].isHasObjects(["type", "columnName"], [relation, field]);
					if(index == -1) {
						var filter = {
							"type": relation,
							"columnName": field
						};
						conditionFilter_record[tableInfo]["condition"].push(filter);
					}
				} else {
					var index = conditionFilter_record[tableInfo]["condition"].isHasObjects(["type", "columnName"], [relation, field]);
					if(index == -1) {
						var filter = {
							"type": relation,
							"columnName": field,
							"value": value
						};
						conditionFilter_record[tableInfo]["condition"].push(filter);
					} else {
						conditionFilter_record[tableInfo]["condition"][index]["value"] = value;
					}
				}

			});
		}
		/*end-----处理条件内容*/
	} else if(filterID == "number-filter") {
		var field = $("#filter-model #fileds-content-select .fileds-list .active").eq(0).html(); // 当前数值字段
		var logic_relation = $("#filter-model #number-filter .number-filter-body .condition-select-box .logic_relation_select_div .custom-select").eq(0).val(); // 关系的值= !=等
		var relation_value = $("#filter-model #number-filter .number-filter-body .condition-select-box .radiosBtns .radio.active").parent().find(".relationvalue").eq(0).val();

		if(relation_value) {
			var index = conditionFilter_record[tableInfo]["condition"].isHasObjects(["type", "columnName"], [logic_relation, field]);

			if(index == -1) {
				var filter = {
					"type": logic_relation,
					"columnName": field,
					"value": relation_value
				};
				conditionFilter_record[tableInfo]["condition"].push(filter);
			} else {
				conditionFilter_record[tableInfo]["condition"][index]["value"] = relation_value;
			}
		}

		var sliderMinValue = $("#number-filter  #value-range-box .value-input-box .min-value-input").eq(0).val();
		var sliderMaxValue = $("#number-filter  #value-range-box .value-input-box .max-value-input").eq(0).val();
		if(sliderMinValue != $("#number-filter .number-filter-body  .slider-common-setting .value-slider-box .range-flag .min-value-flag").html()) {
			var index = conditionFilter_record[tableInfo]["condition"].isHasObjects(["type", "columnName"], [">=", field]);
			if(index == -1) {
				var filter = {
					"type": ">=",
					"columnName": field,
					"value": sliderMinValue
				};
				conditionFilter_record[tableInfo]["condition"].push(filter);
			} else {
				conditionFilter_record[tableInfo]["condition"][index]["value"] = sliderMinValue;
			}
		}
		if(sliderMaxValue != $("#number-filter .number-filter-body  .slider-common-setting .value-slider-box .range-flag .max-value-flag").html()) {
			var index = conditionFilter_record[tableInfo]["condition"].isHasObjects(["type", "columnName"], ["<=", field]);
			if(index == -1) {
				var filter = {
					"type": "<=",
					"columnName": field,
					"value": sliderMaxValue
				};
				conditionFilter_record[tableInfo]["condition"].push(filter);
			} else {
				conditionFilter_record[tableInfo]["condition"][index]["value"] = sliderMaxValue;
			}
		}

		var itemValue = $("#number-filter .number-filter-body .dataLimit_box .userInput_div input").val();
		if(itemValue) {
			var itemCondition = $("#number-filter .number-filter-body .dataLimit_box .sortSelect_div .custom-select").val();
			var unit = $("#number-filter .number-filter-body .dataLimit_box .unitSelect_div .custom-select").val();
			var value = null;
			var columnDataInfo = numberColumn_needValueInfo[tableInfo][field];
			if(unit == "百分比") {
				itemValue = parseInt(columnDataInfo.len * (itemValue / 100));
			}

			if(itemCondition == "最小") {
				if(itemValue >= columnDataInfo.len - 1) {
					itemValue = columnDataInfo.len - 1;
				}
				value = columnDataInfo.allNum[itemValue];

				var index = conditionFilter_record[tableInfo]["condition"].isHasObjects(["type", "columnName"], ["<=", field]);
				if(index == -1) {
					var filter = {
						"type": "<=",
						"columnName": field,
						"value": value
					};
					conditionFilter_record[tableInfo]["condition"].push(filter);
				} else {
					conditionFilter_record[tableInfo]["condition"][index]["value"] = value;
				}

			} else {
				if(columnDataInfo.len - 1 - itemValue <= 0) {
					itemValue = columnDataInfo.len - 1;
				}
				value = columnDataInfo.allNum[columnDataInfo.len - 1 - itemValue];
				var index = conditionFilter_record[tableInfo]["condition"].isHasObjects(["type", "columnName"], [">=", field]);
				if(index == -1) {
					var filter = {
						"type": ">=",
						"columnName": field,
						"value": value
					};
					conditionFilter_record[tableInfo]["condition"].push(filter);
				} else {
					conditionFilter_record[tableInfo]["condition"][index]["value"] = value;
				}
			}
		}
	} else if(filterID == "date-filter") {
		
		var field = $("#filter-model #fileds-content-select .fileds-list .active").eq(0).html(); // 当前选择的字段
		var dateValueArr  = $("#date-filter p.bottomDateIndictor:visible").html().split(" 至 ");
		var startDate =  dateValueArr[0];
		startDate = startDate.replace("/","-");
		var endDate = dateValueArr[1];
		endDate =endDate.replace("/","-");
		var start_index = conditionFilter_record[tableInfo]["condition"].isHasObjects(["type", "columnName"], [">=", field]);
		if(start_index == -1) {
			var filter = {
						"type": ">=",
						"columnName": field,
						"value": startDate,
						"datatype":"date"
			};
			conditionFilter_record[tableInfo]["condition"].push(filter);
		}else{
			conditionFilter_record[tableInfo]["condition"][start_index]["value"] = startDate ;
		}
		
		var end_index = conditionFilter_record[tableInfo]["condition"].isHasObjects(["type", "columnName"], ["<=", field]);
		if(end_index == -1){
			var filter = {
						"type": "<=",
						"columnName": field,
						"value": endDate,
						"datatype":"date"
			};
			conditionFilter_record[tableInfo]["condition"].push(filter);
		}else{
			conditionFilter_record[tableInfo]["condition"][end_index]["value"] = endDate ;
		}	
	}
	// 如果筛选器是从构建数据页面进入的
		if(finishCallBackFun){
			finishCallBackFun(false);	
		}
		$("#filter-model #user-filter-select").hide();
		$("#filter-model .screeningWasher").hide();
		$(".maskLayer").hide();
}