
var reporting_preAllData = null;
var reporting_recordConditon = null;


// needColumns暂时未用到
function reporting_measure_Hanlde(dimensionality_array,measure_name_arr,needColumns,storeNum_toview,handleSuccessFunction){
	
	var handleDataPost = JSON.parse(saveDashboardPostData[storeNum_toview]);


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
		},
		success:function(data){
			if(data.status == "success"){

				reporting_preAllData = data.results.data;
				reporting_recordConditon = objectDeepCopy(handleDataPost);
				handleSuccessFunction(data.results.data);
			}
		}
	});
}
