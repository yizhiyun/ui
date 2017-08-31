$(function () {
    $(".dataSelect-detail #getBtn").click(function(event){
			$("#dataList").show("explode",500,BindProgressToDetailBase);
			$(".maskLayer").show();
			$("#closeDataList").click(function(){
				$("#dataList").hide();
				$(".maskLayer").hide();
			});
   })
    var dataBaseName = null;
    // 给具体的数据库平台按钮绑定事件函数
    function BindProgressToDetailBase(){
    		$("#dataList .baseDetail li").click(function(){
    			dataBaseName = $(this).html();
    			$("#dataList").hide();
    			if(dataBaseName == "ORACLE"){
    				$("#connectDataBaseInfo #dataBaseConnectForm .userDiv label.dbSid").show();
    			}else{
    				$("#connectDataBaseInfo #dataBaseConnectForm .userDiv label.dbSid").hide();
    			}
    			$("#connectDataBaseInfo").show('shake',500,baseInfoShowCallBack);
    		})
    }
    //  连接数据库的弹框显示之后，处理里面的点击事件
    function baseInfoShowCallBack(){
		$("#connectDataBaseInfo .common-head span.flag").html(dataBaseName);
		
  		$("#connectDataBaseInfo #formPostDataBaseName").val(dataBaseName);
  		
    		$("#loginBtn").click(function(event){
    			
			var formData = new FormData($("#dataBaseConnectForm").get(0));
			$.ajax({
				url:"/dataCollection/connectDataBaseHandle",
				type:"POST",
				processData: false,
	            contentType:false,
	            data:formData,
	            success:function(data){
					if(data.status == "success"){
//						dbAndPanelInfoSaveHandle(data.data);
						window.location.href = "/dataCollection/dataBuildView";
						navBtnAbleAndDisablesaveHandle("navBuildDataViewBtn");
					}else{
						alert("请检查数据库是否开启");
					}
	            }
			});
    			
    			$("#connectDataBaseInfo").hide();
    			$("#dataList").hide();
    		});
    		
    }
    
   
   $("#panelFileSettingOption .close,#panelFileSettingOption a.cancleBtn").click(function(){
   		$(".maskLayer").hide();
  		$("#panelFileSettingOption").hide();
   });
   
   $("#panelFileSettingOption a.confirmBtn").click(function(event){
   		var delimiter = $("#panelFileSettingOption .fileSettingBody .topOption .delimiterOption input").val();
   		var quote = $("#panelFileSettingOption .fileSettingBody .topOption .quoteOption input").val();
   		var header = $("#panelFileSettingOption .fileSettingBody .bottomOption  input").get(0).checked;
		var formData = new FormData();
		var fileInfo = $("#selectedPanelFile").get(0).files[0];
		formData.append("file",fileInfo);
		formData.append("delimiter",delimiter);
		formData.append("quote",	 quote);
		formData.append("header",header);
		$.ajax({
			url:"/cloudapi/v1/uploadcsv",
			type:"POST",
			processData: false,
            contentType:false,
            data:formData,
            success:function(data){
            		if(data.status == "success"){
//          			dbAndPanelInfoSaveHandle(data.data);
					window.location.href = "/dataCollection/dataBuildView";
					navBtnAbleAndDisablesaveHandle("navBuildDataViewBtn");
            		}else{
            			alert("上传文件失败:"+data.reason);
            		}
            }
		})
   		
   });
   
  // 点击选择平面文件，选中一个或者多个文件后
	  $("#selectedPanelFile").change(function(){
		$(".maskLayer").show();
		$("#panelFileSettingOption").show();	
	  });
	$("#panelFileSettingOption .common-head .close,#panelFileSettingOption a.cancleBtn").click(function(event){
			$("#panelFileSettingOption").hide();
			$(".maskLayer").hide();
			$("#selectedPanelFile").val("");
	});
  
})