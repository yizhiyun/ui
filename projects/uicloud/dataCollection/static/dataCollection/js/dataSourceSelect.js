$(function () {
    $(".dataSelect-detail .getBtn").click(function(event){
		if (this.title == "panel") {
		}else if(this.title == "dataBase"){
			$("#dataList").show("explode",500,BindProgressToDetailBase);
			$(".maskLayer").show();
			$("#closeDataList").click(function(){
				$("#dataList").hide();
				$(".maskLayer").hide();
			});
		}
   })
    var dataBaseName = null;
    // 给具体的数据库平台按钮绑定事件函数
    function BindProgressToDetailBase(){
    		$("#dataList .baseDetail li").click(function(){
    			dataBaseName = $(this).html();
    			$("#dataList").hide();
    			$("#connectDataBaseInfo").show('shake',500,baseInfoShowCallBack);
    		})
    }
    //  连接数据库的弹框显示之后，处理里面的点击事件
    function baseInfoShowCallBack(){
    		$("#connectDataBaseInfo #dataBaseName").html(dataBaseName)
  			$("#connectDataBaseInfo #formPostDataBaseName").val(dataBaseName)
    		$("#loginBtn").click(function(event){
    			$("#dataBaseConnectForm").submit();
    			$("#connectDataBaseInfo").hide();
    			$("#dataList").hide();
    		})
    }
})