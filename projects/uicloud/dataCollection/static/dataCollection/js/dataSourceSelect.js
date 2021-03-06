	$(function () {
	    $(".dataSelect-detail #getBtn").click(function(event){
				$("#dataList").show("explode",500,BindProgressToDetailBase);
				$(".maskLayer").show();
				$("#closeDataList").click(function(){
					$("#dataList").hide();
					$(".maskLayer").hide();
				});
	   });
	   $("#dataBaseConnectForm .addressinput,#dataBaseConnectForm .portinput,#dataBaseConnectForm .usernameinput,#dataBaseConnectForm .userpwdinput,#dataBaseConnectForm .dbsidinput").change(function(event){
	   		event.stopPropagation();
	   		if(/^\s*$/.test($(this).val())){
	   			$(this).css("border","1px solid red");
	   		}else{
	   			$(this).css("border","1px solid #dedede");
	   		}
	   })

	    // 给具体的数据库平台按钮绑定事件函数
	    function BindProgressToDetailBase(){
	    		$("#dataList .baseDetail li").click(function(){
	    			var dataBaseName = $(this).find("span").eq(0).html();
	          var dataBaseImgSrc = $(this).find("img").eq(0).attr("src");
	    			$("#dataList").hide();
	    			if(dataBaseName == "ORACLE"){
	    				$("#connectDataBaseInfo").height(320);
	    				$("#connectDataBaseInfo #dataBaseConnectForm .locationDiv label.dbSid").show();
	    			}else{
	    				$("#connectDataBaseInfo").height(300);
	    				$("#connectDataBaseInfo #dataBaseConnectForm .locationDiv label.dbSid").hide();
	    			}
	    			$("#connectDataBaseInfo input").val("");
	          $("#connectDataBaseInfo .common-head span.flag").html(dataBaseName);
	      		$("#connectDataBaseInfo #formPostDataBaseName").val(dataBaseName);
	          $("#connectDataBaseInfo").data("dataBaseName",dataBaseName);
	          $("#connectDataBaseInfo .common-head img.logo").attr("src",dataBaseImgSrc);
	    			$("#connectDataBaseInfo").show('shake',500,baseInfoShowCallBack);
	    		})
	    }


	   //封装界面函数
	   function detail(dataBaseName){
	   		if(!$(".container .main .leftNav #navDataBaseAndPanleFileConnectionViewBtn").children("div").hasClass("active")){
	    				return;
	    			}
	    			 $("#dataBaseConnectForm .addressinput,#dataBaseConnectForm .portinput,#dataBaseConnectForm .usernameinput,#dataBaseConnectForm .userpwdinput,#dataBaseConnectForm .dbsidinput").css("border","1px solid #dedede");
				var formData = new FormData($("#dataBaseConnectForm").get(0));
				var allCheckCorrect = false;
				$("#dataBaseConnectForm .addressinput,#dataBaseConnectForm .portinput,#dataBaseConnectForm .usernameinput,#dataBaseConnectForm .userpwdinput").each(function(index,ele){
					if(/^\s*$/.test($(ele).val())){
						$(ele).css("border","1px solid red");
						allCheckCorrect = true;
						return;
					}
				});
	    		if(allCheckCorrect){
					return;
				}
				if(dataBaseName == "ORACLE" && /^(\s)*$/.test($("#dataBaseConnectForm .dbsidinput").val())){
					$("#dataBaseConnectForm .dbsidinput").css("border","1px solid red");
					return;
				}

				$.ajax({
					url:"/dataCollection/connectDataBaseHandle",
					type:"POST",
					processData: false,
		            contentType:false,
		            data:formData,
		            success:function(data){
						if(data.status == "success"){
							$(".maskLayer").hide();
							buildDataFunction_able();
							theRecordConnectionShouldShow = "database";
							dbOrFileTablesRefreshRecord["dbNeedRefresh"] = true;
							changePageTo_navBuildDataView();
						}else{
							if(data.reason == "the_palt_is_already_has"){
								$(".maskLayer").hide();
								buildDataFunction_able();
								changePageTo_navBuildDataView();
							}else{
								alert("请检查数据库是否开启");
								$(".maskLayer").hide();
							}

						}
		            }
				});

	    		$("#connectDataBaseInfo").hide();
	    		$("#dataList").hide();
	   }

	    //  连接数据库的弹框显示之后，处理里面的点击事件
	    function baseInfoShowCallBack(){
	      var dataBaseName = $("#connectDataBaseInfo").data("dataBaseName");
	  		$("#loginBtn").unbind("click");
	    	$("#loginBtn").click(function(event){
	    		detail(dataBaseName);
	    		});

	    	$("#connectDataBaseInfo").keydown(function(event){
		    	if(event.keyCode == 13){
		    		detail(dataBaseName);
		    	}
	    	});


	    }






	   $("#panelFileSettingOption .close,#panelFileSettingOption a.cancleBtn").click(function(){
	   		$(".maskLayer").hide();
	  		$("#panelFileSettingOption").hide();
	   });

	   $("#panelFileSettingOption a.confirmBtn").click(function(event){
	   		event.stopPropagation();
	   		if($(".container .main .leftNav #navDataBaseAndPanleFileConnectionViewBtn").children("div").hasClass("active")){
				var delimiter = $("#panelFileSettingOption .fileSettingBody .topOption .delimiterOption input").val();
				var quote = $("#panelFileSettingOption .fileSettingBody .topOption .quoteOption input").val();
		   		var header = $("#panelFileSettingOption .fileSettingBody .bottomOption  input").get(0).checked;
				var formData = new FormData();
				var fileInfo = $("#selectedPanelFile").get(0).files[0];
				formData.append("file",fileInfo);
				formData.append("delimiter",delimiter);
				formData.append("quote",	 quote);
				formData.append("header",header);
				uploadCSVFIleFunction(formData);
			}
	   });

	  // 点击选择平面文件，选中一个或者多个文件后
		  $("#selectedPanelFile").change(function(){
		  	var fileInfo = $("#selectedPanelFile").get(0).files[0];
			if (fileInfo.name.substring(fileInfo.name.indexOf(".")).toLowerCase() == ".csv") {
				$(".maskLayer").show();
				$("#panelFileSettingOption").show();
			}else{
				var formData = new FormData();
				formData.append("file",fileInfo);
				uploadCSVFIleFunction(formData);
			}

		  });

		  function uploadCSVFIleFunction(formData){
		  	$.ajax({
					url:"/cloudapi/v1/uploadcsv",
					type:"POST",
					processData: false,
		            contentType:false,
		            data:formData,
		            beforeSend:function(){
		            	 $("#panelFileSettingOption").hide();
		            	  var target =  $("body").get(0);
		            	  spinner.spin(target);
		            },
		            success:function(data){
		            		if(data.status == "success"){
		            			spinner.stop();
							$(".maskLayer").hide();
							theRecordConnectionShouldShow = "panelFile";
							dbOrFileTablesRefreshRecord["fileNeedRefresh"] = true;
							buildDataFunction_able();
							changePageTo_navBuildDataView();
		            		}else{
		            			alert("上传文件失败:"+data.reason);
		            		}
		            }
				});
		  }

		$("#panelFileSettingOption .common-head .close,#panelFileSettingOption a.cancleBtn").click(function(event){
				$("#panelFileSettingOption").hide();
				$(".maskLayer").hide();
				$("#selectedPanelFile").val("");
		});

	})
