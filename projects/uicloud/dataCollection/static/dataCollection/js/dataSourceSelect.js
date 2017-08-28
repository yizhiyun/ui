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
    			if(dataBaseName == "ORACLE" && !$("#connectDataBaseInfo #dataBaseConnectForm .userDiv label.dbSid").is(":visible")){
    				$("#connectDataBaseInfo #dataBaseConnectForm .userDiv label.dbSid").show();
    			}else{
    				$("#connectDataBaseInfo #dataBaseConnectForm .userDiv label.dbSid").hide();
    			}
    			$("#connectDataBaseInfo").show('shake',500,baseInfoShowCallBack);
    		})
    }
    //  连接数据库的弹框显示之后，处理里面的点击事件
    function baseInfoShowCallBack(){
    		$("#connectDataBaseInfo #dataBaseName").html(dataBaseName)
  			$("#connectDataBaseInfo #formPostDataBaseName").val(dataBaseName)
    		$("#loginBtn").click(function(event){
//  			$("#dataBaseConnectForm").submit();
			var formData = new FormData($("#dataBaseConnectForm").get(0));
			formData.append("username","yzy");
			$.ajax({
				url:"/dataCollection/connectDataBaseHandle",
				type:"POST",
				processData: false,
	            contentType:false,
	            data:formData,
	            success:function(data){
					if(data.status == "ok"){
						dbAndPanelInfoSaveHandle(data.data);
						window.location.href = "/dataCollection/dataBuildView";
						navBtnAbleAndDisablesaveHandle("navBuildDataViewBtn");
					}
	            }
			})
    			
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
			url:"cloudapi/v1/upload",
			type:"POST",
			processData: false,
            contentType:false,
            data:formData,
            success:function(data){
            		if(data.status == "ok"){
            			dbAndPanelInfoSaveHandle(data.data);
					window.location.href = "/dataCollection/dataBuildView";
					navBtnAbleAndDisablesaveHandle("navBuildDataViewBtn");
            		}
            }
		})
   		
   });
   
  // 点击选择平面文件，选中一个或者多个文件后
  $("#selectedPanelFile").change(function(){
  		$(".maskLayer").show();
  		$("#panelFileSettingOption").show();	
  });
  
})