
var reporting_preAllData = null;
var reporting_recordConditon = null;

var indexClass = null;
var storeClass = null;

// needColumns暂时未用到
function reporting_measure_Hanlde(dimensionality_array,measure_name_arr,needColumns,storeNum_toview,handleSuccessFunction,indexClass,storeClass){
	if(clickDrill){
		var handleDataPost = JSON.parse(saveDashboardPostData[storeNum_toview]);
	}else{
		var handleDataPost = freePostData;
	}
	


	if(equalCompare(reporting_recordConditon,handleDataPost) && reporting_preAllData){
		handleSuccessFunction(reporting_preAllData);
		return;
	}

	$.ajax({
		url:"/cloudapi/v1/tables/" +statements_current_cube_name+"/data",
		type:"post",
		dataType:"json",
		contentType: "application/json; charset=utf-8",
		async: true,
		data:JSON.stringify(handleDataPost),
		beforeSend:function(){
//			console.log("startSend");
			if($("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li .new_view_main").hasClass("new_view_indexPage")){
 				$("."+indexClass+"").find(".right_module .content_body .lf").show();
			}
			if($("#pageStatementsModule #right_folder_show_are .view_folder_show_area ul li .new_view_main").hasClass("new_view_table")){
 				$("."+storeClass+"").find(".tl").show();
 			}
		},
		success:function(data){
			if(data.status == "success"){
				if($("."+indexClass+"").find(".right_module .content_body .session_data_list_for_body .measureDiv").find("p").html() != '' || $("."+indexClass+"").find(".right_module .content_body .session_data_list_for_body .measureDiv").find("span").html() != ''){
					$("."+indexClass+"").find(".right_module .content_body .lf").hide();
				}
				if($("."+storeClass+"").find(".edit_table .left_row_container table tr td").html() != ''){
					$("."+storeClass+"").find(".tl").hide();
				}

				reporting_preAllData = data.results.data;
				reporting_recordConditon = objectDeepCopy(handleDataPost);
				handleSuccessFunction(data.results.data);
				clickDrill = true;
			}
		}
	});
}
