var didShowDragAreaTableInfo= {}; // 用来记录拖拽到拖拽区域的所有表格信息
//临时存储拖拽表的数据
var free_didShowDragAreaTableInfo = {};

var currentTableAllData = null;// 当前操作表格的所有数据
//var current
var preBuildDataName = null; // 之前构建数据集的名称
var bottom_panel_fileds = []; // 底部表格详情，所需要的字段
 // 用来记录当前正在表详细中操作的列或者行元素
var currentHandleColOrRowEles = null;

//存储当前选中列的对应数据
var save_col_text = {};

//记录当前点击的列名

var col_name_click = null;

//记录当前是拆分还是依据固定宽度去拆分

var save_handel_split_way = null;


var store_split_tableName_free = [];
//记录进行拆分过的表格

var store_split_tableArr = [];


//记录按固定宽度拆分对应数据的最大长度
var storeArr_maxlength = null;
  /**
 * description : 得到字符串的字节长度;
 * @version 0.2;
 * @return 返回字符串的字节长度(eg:"一二12"的字节长度是6);
 */
String.prototype.getLength=function(){
 var text=this.replace(/[^\x00-\xff]/g,"**");
 return text.length;
}


// 数据连接操作页面整体函数
function dataAnalysisFunction(isOnlyLoad){

 	getDBAndPannelList();
	// select选项卡问题
   $('.custom-select').comboSelect();
   ElementAutoSize();
   drag_fixedWidth();
   	// 连接框可拖动帮
	$("#connectModalprompt").draggable({
	 containment:"#analysisContainer  .mainDragArea"
	});
if(isOnlyLoad){
	return;
}

function isExitInCurrentConnection(key,dbinfo){
  var currentConnect =  $("#analysisContainer .leftSlide #connectDirector ul.paltFormList li");
  var res = -1;
  currentConnect.each(function(index,ele){
    var exitDB = $(ele).data(key);
    if(exitDB == dbinfo){
      res = index;
      return;
    }
  });
  return res;
}
// 删除数据库已经不存在的连接,flagKey为删除的标识
function deleteDBConnection(flagKey){
  
  $("#analysisContainer .leftSlide #connectDirector ul.paltFormList li.dbtype[dbIndex="+flagKey+"]").remove();
  $("#analysisContainer .leftSlide #dataSet .detailDataSetList li .theDataSetContent .dataSetDetail .dbDataShow[dbIndex="+flagKey+"]").remove();
  // 删除已经拖拽的表格
  $("#analysisContainer .mainDragArea .boxDiv").each(function(index,ele){
    var idInfo = $(ele).attr("id");
    if(idInfo.split("_YZYPD_")[0] == flagKey){
      // 移除线
        instance.detachAllConnections($("#analysisContainer .mainDragArea #"+idInfo));  
        // 移除点
        var endPonints = instance.getEndpoints($("#analysisContainer .mainDragArea #"+idInfo));
        for (var i = 0; i < endPonints.length;i++) {
          instance.deleteEndpoint(endPonints[i]);
        }
        
      // 移除元素这个
      $("#analysisContainer .mainDragArea #"+idInfo).remove();
      // 移除详情按钮等
      $("#analysisContainer .mainDragArea #dragTableDetailInfo").hide(); // 表信息隐藏
      // 数据的移除
      delete didShowDragAreaTableInfo[idInfo];
      delete free_didShowDragAreaTableInfo[idInfo];
    }
  })
  
}
// 删除 文件已经不需要的连接
function deleteFileConnection(fileName){
  $("#analysisContainer .leftSlide #connectDirector ul.paltFormList li.filetype[panelName="+fileName+"]").remove();
  $("#analysisContainer .leftSlide #dataSet .detailDataSetList li .theDataSetContent .dataSetDetail .panelDataShow[panelName="+fileName+"]");
  $("#analysisContainer .mainDragArea .boxDiv").each(function(index,ele){
    var idInfo = $(ele).attr("id");
    if(idInfo.split("_YZYPD_")[0] == fileName){
      // 移除线
        instance.detachAllConnections($("#analysisContainer .mainDragArea #"+idInfo));  
        // 移除点
        var endPonints = instance.getEndpoints($("#analysisContainer .mainDragArea #"+idInfo));
        for (var i = 0; i < endPonints.length;i++) {
          instance.deleteEndpoint(endPonints[i]);
        }
        
      // 移除元素这个
      $("#analysisContainer .mainDragArea #"+idInfo).remove();
      // 移除详情按钮等
      $("#analysisContainer .mainDragArea #dragTableDetailInfo").hide(); // 表信息隐藏
      // 数据的移除
      delete didShowDragAreaTableInfo[idInfo];
      delete free_didShowDragAreaTableInfo[idInfo];
    }
  });
  
}
// 检测当前所有的 db 连接是否需要删除
function checkCurrentDBConnectionNeedDelete(backgroundExitsConnections){
  $("#analysisContainer .leftSlide #connectDirector ul.paltFormList li.dbtype").each(function(index,ele){
    if(backgroundExitsConnections.indexOf($(ele).data("dbIndex")) == -1){
      deleteDBConnection($(ele).data("dbIndex"));
    }
  });
}
// 检测当前所有的 panel 文件连接是否需要删除
function checkCurrentPanelFileConnectionNeedDelete(backgroundExitsConnections){
  $("#analysisContainer .leftSlide #connectDirector ul.paltFormList li.filetype").each(function(index,ele){
    if(backgroundExitsConnections.indexOf($(ele).data("panelName")) == -1){
      deleteFileConnection($(ele).data("panelName"));
    }
  })
}


// 获取最新的数据库连接情况
function updateDBListFromNetwork(){
  $.ajax({
    url:"/dataCollection/showAllDbOfPalt",
    type:"POST",
    dataType:"json",
    contentType: "application/json; charset=utf-8",
    success:function(data){
      if(data.status == "success"){
        var dbPaltList = data.results;
        for(var key in dbPaltList){
          if (isExitInCurrentConnection("dbIndex",key) != -1) {
            continue;
          }
          var detailInfo = dbPaltList[key];
          var li = $("<li class='dbtype'><img src= '/static/dataCollection/images/data.png' alt='' /><span>"+detailInfo.dbtype+"-"+detailInfo.dbuser+"-"+detailInfo.dbport+"</span></li>");
          $("#analysisContainer .leftSlide #connectDirector ul.paltFormList").append(li);
          li.data("dbIndex",key);
          li.attr("dbIndex",key);
          var dbDataShow_div = $("<div class='dbDataShow'><select class='custom-select'></select><div class='tablesOfaData'></div></div>");
          $("#analysisContainer .leftSlide #dataSet .detailDataSetList li .theDataSetContent .dataSetDetail").append(dbDataShow_div);
          var dbselect =  dbDataShow_div.find(".custom-select");
          dbselect.attr("dbIndex",key);
          dbDataShow_div.attr("dbIndex",key);
          for (var i = 0;i < detailInfo.dblist.length;i++) {
            var dbVal = detailInfo.dblist[i];
            var selectoption = $("<option value="+dbVal+">"+dbVal+"</option>");
            dbselect.append(selectoption);
          } 
          dbselect.comboSelect();
          dbselect.change(function(event){
            event.stopPropagation();
            getTablesOfaDataBase($(this));
          });
          getTablesOfaDataBase($(dbselect));
        }
        
        checkCurrentDBConnectionNeedDelete(allKeys(dbPaltList));
        
        bindEventToPerTable();
      }else{
//      alert("获取数据库信息失败");
      }
    }
  });
}

// 获取最新的文件连接情况
function updatePanelFileListFromNetwork(){
  $.ajax({
    url:"/cloudapi/v1/uploadedcsvs",
    type:"GET",
    dataType:"json",
    contentType: "application/json; charset=utf-8",
    success:function(data){
      if(data.status =="success"){
        var panelList = data.results;
        for(var key in panelList){
          if(isExitInCurrentConnection("panelName",key) != -1){
            continue;
          }
          var detialInfo = panelList[key];
          var li = $("<li class='filetype'><img src= '/static/dataCollection/images/file.png' alt='' /><span>"+key+"</span></li>");
          $("#analysisContainer .leftSlide #connectDirector ul.paltFormList").append(li);
          li.data("panelName",key);
          li.attr("panelName",key);
          var paneFileShow = $("<div class='panelDataShow'><p class='panelTitle'>"  + key + "</p><div class='panelFileSheetData'></div></div>");
          paneFileShow.attr("panelName",key);
          for (var i = 0; i < detialInfo.length;i++) {
            var p  = $("<p>"+detialInfo[i]+"</p>");
            p.data("sourcetype","tmptables");
            p.data("filename",key);
            paneFileShow.find(".panelFileSheetData").append(p);
          }
          $("#analysisContainer .leftSlide #dataSet .detailDataSetList li .theDataSetContent .dataSetDetail").append(paneFileShow);
        }
        checkCurrentPanelFileConnectionNeedDelete(allKeys(panelList));
        bindEventToPerTable();
      }else{
//      alert("获取文件信息失败");
      }
    }
  })
}
// 获取当前已经构建的数据表
function getCurrentDidBuildDataTable(){
  $.ajax({
      url:"/cloudapi/v1/tables",
      type:"get",
      dataType:"json",
      contentType: "application/json; charset=utf-8",
      success:function(data){
        if (data["status"] == "success") {
          $("#analysisContainer .leftSlide #dataSet .detailDataSetList li .theDataSetContent .dataSetDetail .didBuildTables ul.tablesList").empty();
          for (var i = 0;i < data.results.length;i++) {
            var li = $("<li>"+data.results[i]+"</li>");
            li.data("sourcetype","hdfs");
            $("#analysisContainer .leftSlide #dataSet .detailDataSetList li .theDataSetContent .dataSetDetail .didBuildTables ul.tablesList").append(li);
          }
          bindEventToPerTable();
        } 
      } 
  });
}

// 获取数据分析连接页面的连接情况
function getDBAndPannelList(){
  updateDBListFromNetwork();
  updatePanelFileListFromNetwork();
  getCurrentDidBuildDataTable();
}

  //进度条定时器
  var loading_inter;
  //进度条初始化
  function loading_init(){
    $("#loading_percentage span").text(0);
    $("#loading_progress_bar_active").width(0);
    $("#prompt_message .prompt_message_text").text("构建数据中");
    $("#prompt_message .prompt_message_upload").css("display","block")
    $("#prompt_message #data_success_content").css("display","none");
    $("#loading_percentage").removeClass().addClass("loading_percentage_ac");
    $("#loading_percentage").css("right","-40px");
    $("#loading_circle").css("marginRight","-6px");
    $("#build_false_btn").css("display","none");
  }


  

  //构建数据进度条
function loading_bar(){
    var speed_handle;
    //清除定时器
    clearInterval(loading_inter);
    
    //隐藏构建数据输入框
    $("#buildDataPanelView").css("display","none")
    //点击出现进度条
    $("#build_upload").css("display","block");
    var i = 0;
    var speed = 0;

    //进度条总宽度
    var loading_bar_width = $("#loading_progress_bar").width();
    loading_inter = setInterval(function(){
      speed_handle = Math.floor(Math.random()*35 + 60);
      i+=Math.ceil(Math.random()*10 + 50);
      speed= ((i/loading_bar_width)*100).toFixed(0);
      if(speed >= speed_handle){
        // speed = speed_handle;
        i = loading_bar_width * speed/100;
        clearInterval(loading_inter);
      }
      if(speed > 0){
        $("#loading_percentage span").text(speed);
        $("#loading_progress_bar_active").width(i);
        $("#loading_percentage").css("right","-16px");
        $("#loading_circle").css("marginRight","1.5px");
      }
      
      
    },600)
  }

  //构建成功显示集合表
function handle_success_show_table(){
        $.ajax({
          url:"/cloudapi/v1/tables/" +preBuildDataName+"/all",
          type:"post",
          // data:tablesSelect,
          // traditional:true,
          async: true,
          dataType:'json',
          beforeSend:function(){
            var target =  $("body").get(0);
            spinner.spin(target);
          },
          success:function(result){
            if(result["status"] == "success"){
                var gather_table_schema = result["results"]["schema"];
                currentTableAllData = result["results"]["data"];
                filterNeedAllData = result["results"]["data"];
                for(var i = 0 ; i < gather_table_schema.length;i++){
                  gather_table_schema[i]["isable"] = "yes";
                }
                didShowDragAreaTableInfo["hdfs_YZYPD_myfolder_YZYPD_"+preBuildDataName+""] = gather_table_schema;
                free_didShowDragAreaTableInfo["hdfs_YZYPD_myfolder_YZYPD_"+preBuildDataName+""] = gather_table_schema;
                createTableDetailView("hdfs_YZYPD_myfolder_YZYPD_"+preBuildDataName+"",result["results"]["data"]);

                spinner.stop();



      }
          }
        }); 
  }

  //集合表添加功能的点击事件
function expression_click_handle(){
    //重构数据点击事件
    $(".rightConent #analysisContainer #tableDataDetailListPanel .topInfo #data_reconstruction a").click(function(){
      $("._jsPlumb_endpoint").css("visibility","visible")
      $(".rightConent #analysisContainer #tableDataDetailListPanel").removeClass("expression_show").css("width",$(".rightConent").width()-$("#analysisContainer .leftSlide").width() + 'px').hide().removeAttr("nowshowtable");
      $("#analysisContainer .leftSlide").eq(0).css("display","block");
      $(".rightConent #analysisContainer").css("visibility","visible");
      $(".rightConent #analysisContainer #tableDataDetailListPanel #closeableDataDetailListPanel").css("display","inline");
      //移除多余的功能
      $(".rightConent #analysisContainer #tableDataDetailListPanel .topInfo #top_expression").add($(".rightConent #analysisContainer #tableDataDetailListPanel .topInfo #expression_save,.rightConent #analysisContainer #tableDataDetailListPanel .topInfo #data_reconstruction,.rightConent #analysisContainer #tableDataDetailListPanel .topInfo #table_export_excel,.rightConent #analysisContainer #tableDataDetailListPanel .topInfo #table_add_field,.rightConent #analysisContainer #tableDataDetailListPanel .topInfo #merge_table")).remove();
      $(".rightConent #analysisContainer #tableDataDetailListPanel .topInfo").css("borderLeft","1px solid #DEDEDE");
      $(".rightConent #analysisContainer #tableDataDetailListPanel .mainContent table thead tr").css("background","#F5F5F5");
      $(".rightConent #analysisContainer #tableDataDetailListPanel .mainContent").css("maxHeight","440px");
      //创建相对应的已构建的数据表

      $("<li>"+preBuildDataName+"</li>").data("sourcetype","hdfs").appendTo($("#analysisContainer .leftSlide #dataSet .detailDataSetList li .theDataSetContent .dataSetDetail .didBuildTables ul.tablesList"));
      
      // 数据的移除
      delete didShowDragAreaTableInfo["hdfs_YZYPD_myfolder_YZYPD_"+preBuildDataName+""];
      delete free_didShowDragAreaTableInfo["hdfs_YZYPD_myfolder_YZYPD_"+preBuildDataName+""];
      bindEventToPerTable();

    })
  }

  //构建完成对布局的调整
  function element_chanage_success(){
      $(".maskLayer").hide();
      $("#analysisContainer .leftSlide").eq(0).css("display","none");
      $(".rightConent #analysisContainer #tableDataDetailListPanel #closeableDataDetailListPanel").css("display","none");
      handle_success_show_table();
      $("._jsPlumb_endpoint").css("visibility","hidden");
      $(".rightConent #analysisContainer #tableDataDetailListPanel").css({
        "width":$(".rightConent").width() + "px",
      }).attr("nowShowTable","hdfs_YZYPD_myfolder_YZYPD_"+preBuildDataName+"").addClass("expression_show");

      $(".rightConent #analysisContainer #tableDataDetailListPanel .mainContent").css("maxHeight", $(".rightConent #analysisContainer #tableDataDetailListPanel").height()-$(".topInfo").height() + "px");
      $(".rightConent #analysisContainer #tableDataDetailListPanel .mainContent table thead tr").css("background","white");
      $(".rightConent #analysisContainer #tableDataDetailListPanel .topInfo").css("borderLeft","none");

      //创建之前显示表格不具有的功能
      //集合表名称显示
      var expression_other_handle = $("<div id='top_expression'>"+preBuildDataName+"</div><div id='data_reconstruction'><a>重构数据</a></div><div id='table_export_excel'><img src='/../../../static/dataCollection/images/tableDataDetail/export_excel.png' title='导出excel'></div><div id='table_add_field'><img src='/../../../static/dataCollection/images/tableDataDetail/add_field_ico.png' title='添加字段'></div><div id='merge_table'><img src='/../../../static/dataCollection/images/tableDataDetail/Merge_field_ico.png' title='合并'></div>");

      expression_other_handle.prependTo($(".rightConent #analysisContainer #tableDataDetailListPanel .topInfo"));
      
      //集合表添加功能的点击事件
      expression_click_handle();

  }

  //构建失败
  function data_error_show(){
    clearInterval(loading_inter);
    $("#loading_percentage").removeClass().addClass("loading_error_percentage");
    $("#build_upload #prompt_message #data_success_content").removeClass().addClass("loading_error_img_class");
    $("#build_upload #prompt_message #data_success_content").css("display","block");
    $("#prompt_message .prompt_message_text").text("数据构建失败");
    $("#prompt_message .prompt_message_upload").css("display","none");
    $("#build_false_btn").css("display","block");
    $("#loading_percentage").css("right","-20px");
  }
  //构建成功
  function data_success_show(){
    clearInterval(loading_inter);
    $("#loading_percentage span").text(100);
    $("#loading_progress_bar_active").width($("#loading_progress_bar").width());
    $("#prompt_message .prompt_message_text").text("数据构建成功");
    $("#prompt_message .prompt_message_upload").css("display","none")
    $("#prompt_message #data_success_content").css("display","block");
    $("#prompt_message #data_success_content").removeClass().addClass("data_success_img");
    $("#loading_percentage").css("right","-10px");
    //构建数据成功隐藏构建数据弹窗--显示选择进入模块弹窗
//  navBtnAbleAndDisablesaveHandle("navDashBoardViewBtn");
//  pallasdaraFunctionNavBtnHandle();
	dashBoradFunction_able();
    $("#build_upload").hide("blind",1000,function(){
      $(".rightConent #analysisContainer").css("visibility","hidden");
      //构建成功显示集合表
      element_chanage_success();
    });
    
  }
  // end---------------------
  
  function ElementAutoSize(){
    $("#analysisContainer .leftSlide").css("height",(document.offsetHeight | document.body.offsetHeight) - 70 + "px");
    $("#analysisContainer .mainDragArea").css({"margin-left":$("#analysisContainer .leftSlide").width() + "px","height":(document.offsetHeight | document.body.offsetHeight) - 70 + "px"});
    $("#foldSideBtn").css("top",($("#analysisContainer .leftSlide").height() - 38) / 2 + "px");
  }

  // 窗口调整的时候
  $(window).resize(function(){
    ElementAutoSize();
  })
  
  // 左侧边栏拖拽缩小和放大
  $("#analysisContainer .leftSlide").resizable({
        maxWidth:300,
        minWidth:200,
      handles:"e" , // 只能作用在右边栏
      resize:function(event,ui){
        // 动态调整右边可拖拽区域的大小
        $("#analysisContainer .mainDragArea").css("margin-left",ui.size.width);
        $("#foldSideBtn").css({
          left:ui.size.width - 7 + "px",
        });
        $("#analysis_dataList").css("width",ui.size.width);
      }
    })
  
  // 左侧边栏隐藏和显示
  $("#foldSideBtn").click(function(event){
    $("#analysisContainer .leftSlide").toggle("fold",{horizFirst:true},50,function(){
      
      if ($("#analysisContainer .leftSlide").is(":visible")) {
        $("#foldSideBtn").children("img").attr("src","/../../../static/dataCollection/images/nr_47.png")
        $("#foldSideBtn").css("left",  $("#analysisContainer .leftSlide").width() - 7 + "px");
        $("#analysisContainer .mainDragArea").css("margin-left",$("#analysisContainer .leftSlide").width() + "px");
      }else{
        $("#foldSideBtn").children("img").attr("src","/../../../static/dataCollection/images/pull_.png")
        $("#foldSideBtn").css("left", "-7px")
        $("#analysisContainer .mainDragArea").css("margin-left","0px");
      }
      //看具体情况。。。。。要不要处理
//      autoSizetableDataDetailListPanel();
    });
  })

// 取消滑动事件的冒泡行为
$("#analysisContainer .tablesOfaData").scroll(function(event){
  event.stopPropagation();
})

var tableDragrecords = {};

// 展示某个数据库下方的数据表格
function getTablesOfaDataBase(theSelect){
  
  if (!theSelect.length || theSelect.length < 1) {
    return;
  } 
  $.ajax({
    url: "/dataCollection/tablesOfaDB",
    type: "post",
    data: {
      "theDBName": $(theSelect).val(),
      "dbObjIndex": $(theSelect).attr("dbIndex"),
//      "username":"yzy"
    },
    success: function(data) {
      $(theSelect).parents(".dbDataShow").children(".tablesOfaData").eq(0).empty();
      for(var i = 0; i < data.data.length; i++) {
        var p = $("<p>" + data.data[i] + "</p>");
        p.data("sourcetype","db");
        $(theSelect).parents(".dbDataShow").children(".tablesOfaData").eq(0).append(p);
      }
      bindEventToPerTable();
    }
  })
}
  
//getTablesOfaDataBase($(".dataSetDetail select"));

// 处理表格的拖拽和点击事件
//dbPaltIndexForBack 主要记录了这个数据库表格在后台属于哪个数据连接平台下的，是一个下标，后台通过这个索引值去寻找
  function bindEventToPerTable(){
      
      dragUIHandle($(".tablesOfaData p").add("#analysisContainer .leftSlide #dataSet .detailDataSetList li .theDataSetContent .dataSetDetail .didBuildTables ul.tablesList li").add("#analysisContainer .leftSlide #dataSet .detailDataSetList li .theDataSetContent .dataSetDetail .panelDataShow .panelFileSheetData p"),$("#analysisContainer .mainDragArea"),function(ui,event){
      event.stopPropagation();
      event.preventDefault();
      tableName = $(ui.draggable).html();
      var sourceType = $(ui.draggable).data("sourcetype");
      var dataBaseName = null;
      var dbPaltIndexForBack = null;
      var dataUrl ="";
      var postData = {};
      if(sourceType == "db"){
        dataBaseName = $(ui.draggable).parents(".dbDataShow").find(".custom-select").val();
        dbPaltIndexForBack = $(ui.draggable).parents(".dbDataShow").find(".custom-select").attr("dbindex");
        dataUrl = "/dataCollection/filterTable/schema";
        postData = {"tableName":tableName,"source":dbPaltIndexForBack,"database":dataBaseName,"columns":{},"conditions":[]};
        
      }else if(sourceType == "hdfs"){
        dataBaseName = "myfolder"; // 当前用户名
        dbPaltIndexForBack = "hdfs";
        dataUrl = "/cloudapi/v1/tables/" +tableName+"/schema";
        
      }else if(sourceType == "tmptables"){
        var fileName = $(ui.draggable).data("filename");
        dataUrl = "/cloudapi/v1/uploadedcsv/"+fileName+"/"+tableName+"/schema";
        dbPaltIndexForBack = "tmptables";
        dataBaseName = fileName;
      }
      
      targetEle = this;
      // 已近存在的表格
      if (allKeys(didShowDragAreaTableInfo).indexOf(dbPaltIndexForBack + "_YZYPD_"+ dataBaseName + "_YZYPD_" + tableName) != -1) {
        return;
      }
      // 请求后端，获取表格的具体信息
      $.ajax({
          url:dataUrl,
          type:"POST",
          dataType:"json",
          contentType: "application/json; charset=utf-8",
          async: true,
          data:JSON.stringify(postData),
          success:function(data){
            if(data.status == "success"){
              showDataTables(dataBaseName,tableName,data.results.schema,ui.offset.left,ui.offset.top,targetEle,dbPaltIndexForBack);
            }
          }
      });
    });
  }
  
  var fixedSPlit_data =null;


 // 创建可视化的表格
 function showDataTables(dataBaseName,tableName,data,uiLeft,uiTop,targetEle,dbPaltIndexForBack,if_or){
      
      if (data.length > 0) {
        var boxDiv = $("<div class='boxDiv'></div>");
        
        boxDiv.css({
          left:(uiLeft - $(targetEle).offset().left) < 10 ? 10 : (uiLeft - $(targetEle).offset().left),
          top:(uiTop - $(targetEle).offset().top) < 10 ? 10 :(uiTop - $(targetEle).offset().top)
        }).data("split_record",dataBaseName+"_YZY_"+tableName+"_YZY_"+uiLeft+"_YZY_"+uiTop+"_YZY_"+dbPaltIndexForBack);

        // 主要为了 ID 不重复---同时给后端去传递相应的数据
        boxDiv[0].id = dbPaltIndexForBack + "_YZYPD_"+ dataBaseName + "_YZYPD_" + tableName;
//        tableDragsRecords.push(boxDiv[0].id);
        
        boxDiv.append($("<div class='tableTitle'>" + "<img src=" + "/static/dataCollection/images/left_40.png"+"/>"+"<p title="+tableName+">"+tableName+"</p>"+ "</div>"));
        
        boxDiv.append("<div class='clear'></div>")
        
        var tableList = $("<ul class='fields'></ul>");
        boxDiv.append(tableList);
        for (var i = 0;i < data.length;i++) {
            var aLi = $("<li>" + "<input type='checkbox' name='name' value='' checked='checked'>"+"<span>"+data[i]["field"]+"</span>"+"</li>");
            aLi[0].index = i; // 自定义属性，记录当前是第几个 li
            // 默认所有字段选中，都是可用的
            data[i]["isable"] = "yes";
            tableList.append(aLi);
        }
      }
      
        $(targetEle).append(boxDiv);
        // 可拖拽
        $(".boxDiv").draggable({ containment: "#analysisContainer  .mainDragArea", scroll: true,
          drag:function(){
            $(".ui-tooltip").hide(); //title 提示关闭
            $("#analysisContainer .mainDragArea #dragTableDetailInfo").hide(); // 表信息隐藏
            instance.repaintEverything();
          },
          stop:function(){
            instance.repaintEverything();
            $("#analysisContainer .mainDragArea #dragTableDetailInfo").css({
          	left:this.offsetLeft + "px",
         	 top:this.offsetTop - 40 + "px" 
     	 });
            $("#analysisContainer .mainDragArea #dragTableDetailInfo").show();
        }
      });       
    
        
         

         if(if_or != "if_or"){
           // 记录已经拖拽的表格数据
           didShowDragAreaTableInfo[boxDiv[0].id] = data;
         
           free_didShowDragAreaTableInfo[boxDiv[0].id] = data;
           tableDrag(allKeys(didShowDragAreaTableInfo));
         }else{
         	 instance.repaintEverything();
         }
 		
          
         // 选择框绑定事件
         bindEventToBoxDivFiledsCheckBox();
        
        // 鼠标移入移出绑定事件
        dragBoxBindMosueOver()
        
    }
    
    
 //---- 点击数据集收回列表   
  $("#dataSet .detailDataSetList  li .dataSetItemTitle").click(function(event){
    event.stopPropagation();
    if (this.getAttribute("openFlag") == "on") {
      
      hideDataSetList(this);
    }else{
      showDataSetList(this);
    }
    
  });
 
    // 显示数据集列表
  function showDataSetList(ele){
    ele.setAttribute("openFlag","on");
    $(ele).children("img").attr("src","/static/dataCollection/images/left_40.png");
    $(ele).next(".theDataSetContent").show("blind",300);
    $(ele).css("color","#005eca");
  }
  //隐藏数据集列表
  function hideDataSetList(ele){
    ele.setAttribute("openFlag","off");
    $(ele).children("img").attr("src","/static/dataCollection/images/left_35.png");
    $(ele).next(".theDataSetContent").hide("blind",300);
    $(ele).css("color","#202020");
  }
 
 
  function bindEventToBoxDivFiledsCheckBox(){
     // 拖拽区域每个表格中的复选框进行选择时候触发的方法
  $("#mainDragArea .boxDiv .fields input[type='checkbox']").unbind("change");
    $("#mainDragArea .boxDiv .fields input[type='checkbox']").change(function(event){
      var index = $(this).parent()[0].index;
      var filed = didShowDragAreaTableInfo[$(this).parents(".boxDiv").eq(0)[0].id][index];
      if (this.checked && filed["isable"] == "no") {
        filed["isable"] = "yes";
      }else if (!this.checked && filed["isable"] == "yes") {
        filed["isable"] = "no";
        // 如果当前底部显示的正是操作的这个表格
        if ($("#tableDataDetailListPanel").attr("nowShowTable") == $(this).parents(".boxDiv").eq(0)[0].id && currentTableAllData) {   
          setshowHiddenEles_btn_notSelected();                  
        }         
      }
      
      // 如果当前底部显示的正是操作的这个表格
      if ($("#tableDataDetailListPanel").attr("nowShowTable") == $(this).parents(".boxDiv").eq(0)[0].id && currentTableAllData) {
//      console.log(currentTableAllData)
        createTableDetailView($("#tableDataDetailListPanel").attr("nowShowTable"),currentTableAllData);
                
      }
            
     });
     
}
 
 
 // 构建数据传递的参数
 var postData = null;
 var outName_of_check = null;
 // 构建数据点击事件
  $("#constructData").click(function(event){
    var tables = [];
    for (var key in free_didShowDragAreaTableInfo) {
      var aTable = {};
      var dbArr = key.split("_YZYPD_");
      var source = dbArr[0];
      if(source == "hdfs"){
          aTable["sourcetype"] = source;
      }else if(source == "tmptables"){
        aTable["sourcetype"] = source;
      }else{
        aTable["source"] = source;
        aTable["sourcetype"] = "db";
      }
        aTable["database"] = dbArr[1];
        aTable["tableName"] = dbArr[2];
        aTable["columns"] = {};
        aTable["conditions"] = [];
        if(conditionFilter_record[key]){
          aTable["conditions"] = conditionFilter_record[key]["common"].concat(conditionFilter_record[key]["condition"],conditionFilter_record[key]["dateCondition"]);
        }else{
          aTable["conditions"] = [];
        }
        
        
        for (var i = 0;i < free_didShowDragAreaTableInfo[key].length;i++) {
        var originalFileds = free_didShowDragAreaTableInfo[key];
        if (originalFileds[i]["isable"] == "yes") {
          var columnName = originalFileds[i]["field"];
          if(originalFileds[i]["mappedfield"]){
            columnName = originalFileds[i]["mappedfield"];
          }
          aTable["columns"][columnName] = {
            "columnType":originalFileds[i]["type"],
            "nullable": originalFileds[i]["Null"],
                        "primaryKey": (originalFileds[i]["key"] == "PRI" ? "yes":"no"),
                        "uniqueKey": "no"
          };
        }
      }
        tables.push(aTable);    
    }     
    var relationships = [];
    // 获取所有连接
    var cons = instance.getAllConnections();
    var postConsParama = [];
    if(cons["green dot"]){
      for (var i = 0;i <  cons["green dot"].length; i++) {
      var con =  cons["green dot"][i];
      var line = con.getOverlay("connFlag");
      var linePa = line.getParameters();
      var aRelation = {};
      var sourceInfo = linePa["relation"]["sourceInfo"].split("_YZYPD_");
      aRelation["fromTable"] = sourceInfo[1] + "." + sourceInfo[2];
      
      var targetInfo = linePa["relation"]["targetInfo"].split("_YZYPD_");
      aRelation["toTable"] = targetInfo[1] + "." + targetInfo[2];
      
      aRelation["joinType"] = linePa["type"];
      aRelation["columnMap"] = [];
      for(var j  = 0;j < linePa["relation"]["connections"].length;j ++){
        var aMap = {};
        var mapInfo =  linePa["relation"]["connections"][j].split("===");
        aMap["fromCol"] = mapInfo[0];
        aMap["toCol"] = mapInfo[1];
        aRelation["columnMap"].push(aMap);
      }
      relationships.push(aRelation);
      }
    } 
      // 需要传递的数据
    postData = {
      "tables":tables,
      "relationships":relationships,
    };
    
    $.ajax({
      url:"/cloudapi/v1/mergetables/check",
      type:"post",
      dataType:"json",
      contentType: "application/json; charset=utf-8",
      async: true,
      data:JSON.stringify(postData),
      success:function(data){
//        var rs = data;
        if(data["status"] == "failed"){
          alert("请检查表格之间的联系");
          return;
        }
        outName_of_check = data["columns"];
        if (preBuildDataName == null) {
          var ele = $("#buildDataPanelView .build-body .cube-name-radio .new-cube");
          ele.siblings(".radio").removeClass("active");
          ele.addClass("active");   
          $("#buildDataPanelView .build-body .cube-name-input-div").eq(0).show();
          $("#buildDataPanelView .build-body .cube-name-radio .cover-original-cube").eq(0).hide();
          ele.css("margin-left","20px");
        }else{  
          var ele = $("#buildDataPanelView .build-body .cube-name-radio .cover-original-cube");
          ele.show();
          ele.siblings(".radio").removeClass("active");
          ele.addClass("active");
          
          $("#buildDataPanelView .build-body .cube-name-radio .new-cube").eq(0).css("margin-left","40px");
          ele.html("覆盖 " + preBuildDataName);
          $("#buildDataPanelView .build-body .cube-name-input-div").eq(0).hide();
        }
        
        $(".maskLayer").show();
        $("#buildDataPanelView").css({
          left:($("body").width() - $("#buildDataPanelView").width()) / 2,
          top:($("body").height() - $("#buildDataPanelView").height()) / 2
        });
        $("#buildDataPanelView .build-body .cube-name-input-div input").eq(0).css("border","1px solid #dedede");
        $("#buildDataPanelView").show("shake",200);
      }
    })
    
    
  });
// 数据集弹框功能按钮
$("#buildDataPanelView .build-body .cube-name-radio .radio").click(function(){
  if (!$(this).hasClass("active")) {
    $(this).siblings(".radio").removeClass("active");
    $(this).addClass("active");
    showOrHidencubeNamenputiv(this);
  }
})

// 是否显示 输入 cube 名称
function showOrHidencubeNamenputiv(ele){
  if ($(ele).hasClass("new-cube") && !$("#buildDataPanelView .build-body .cube-name-input-div").eq(0).is(":visible")) {
    $("#buildDataPanelView .build-body .cube-name-input-div").eq(0).show("blind",200);
  }else if ($(ele).hasClass("cover-original-cube")) {
    $("#buildDataPanelView .build-body .cube-name-input-div").eq(0).hide("blind",200);
  }
}

$("#buildDataPanelView .build-body .build-options .save-type .radio").click(function(){
  if (!$(this).hasClass("active")) {
    $(this).siblings(".radio").removeClass("active");
    $(this).addClass("active");
  }
});

// 更多设置按钮
$("#buildDataPanelView .build-footer .moreSetting").eq(0).click(function(){
  if (!$("#buildDataPanelView .build-body .build-options .more-content-div").eq(0).is(":visible")) {
    $("#buildDataPanelView .build-body .build-options .more-content-div").eq(0).show("blind",200);
  }
});

// 取消按钮+x 按钮
$("#buildDataPanelView .build-footer .cancleBtn").add("#buildDataPanelView .common-head .close").click(function(){
  $("#buildDataPanelView").hide("shake",100,function(){
    $(".maskLayer").hide();
  });
})
// 确定按钮
$("#buildDataPanelView .build-footer .confirmBtn,#build_upload .confirmBtn").click(function(){
    // remove_splitData(store_split_tableArr);
  if ($("#buildDataPanelView .build-body .cube-name-radio .new-cube").hasClass("active")) {
    if (!$("#buildDataPanelView .build-body .cube-name-input-div input").eq(0).val()) {
      $("#buildDataPanelView .build-body .cube-name-input-div input").eq(0).css("border","1px solid red");
      return;
    }
    postData["outputs"] = {"outputTableName":$("#buildDataPanelView .build-body .cube-name-input-div input").eq(0).val(),"removedColumns":[],"columnRenameMapping":outName_of_check};
  }else{
    postData["outputs"] = {"outputTableName":preBuildDataName,"removedColumns":[],"columnRenameMapping":outName_of_check};
  }
  
  // 记录
  preBuildDataName = postData["outputs"]["outputTableName"];

  
  if ($("#buildDataPanelView .build-body .build-options .more-content-div .check-label input").eq(0).is(':checked') && $("#buildDataPanelView .build-body .build-options .more-content-div .text-label input").eq(0).val() && $("#buildDataPanelView .build-body .build-options .more-content-div").eq(0).is(":visible")) {
    var value = Number($("#buildDataPanelView .build-body .build-options .more-content-div .text-label input").eq(0).val());
//    console.log("--------",value);
    for (var k = 0;k < postData["tables"].length;k++) {
      var aTable = postData["tables"][k];
      var conditions = aTable["conditions"];
      var index = conditions.hasObject("type", "limit");
      if(index == -1){
        var filter = {"type":"limit","value":value};
        conditions.push(filter);
      }else{
        conditions[index]["value"] = value;
      }
    }
  }
  loading_init();
  //进度条
  loading_bar();
  
  
  var xhr = $.ajax({
      url:"/cloudapi/v1/mergetables/generate",
      type:"post",
      dataType:"json",
      contentType: "application/json; charset=utf-8",
      async: true,
      data:JSON.stringify(postData),
      success:function(data){
//      console.log(data)
//      console.log("success")
        // 构建。。。。完成
        data_success_show();
        // end-------------------
      },
      error:function(){
//      console.log("error")
        //构建失败
        data_error_show();
      }
  });

  //进度条关闭按钮
  $("#build_upload #loding_close").click(function(){
    $("#build_upload").hide("shake",100,function(){
      $(".maskLayer").hide();
    });
    loading_init();
    xhr.abort();
  })
  
});

  // 创建新数据集按钮的点击
  $("#newSet").click(function(event){
    event.stopPropagation();
    $(".maskLayer").show();
    $("#newSetPrompt").css({
        left:((document.offsetWidth | document.body.offsetWidth) -$("#analysisContainer .leftSlide").width() - $("#newSetPrompt").width()) / 2,
      top:((document.offsetHeight | document.body.offsetHeight) -2*$("#baseTopInfo").height() - $("#newSetPrompt").height()) / 2
    });
    $("#newSetPrompt").show();
  })
  
  // 创建数据集弹框内部的事件处理
  
  // 关闭按钮
  $("#newSetPrompt #closeNewSetPrompt").click(function(event){
    event.stopPropagation();
    $(".maskLayer").hide();
    $("#newSetPrompt").hide();
  })
  // 确定按钮
  $("#newSetPrompt #newSetConfirmBtn").click(function(event){
    event.stopPropagation();
    $(".maskLayer").hide();
    $("#newSetPrompt").hide();
    // 处理html
    var theNewSet = $(".detailDataSetList #baseSetTemplate").clone(true);
    theNewSet.removeAttr("id");
    theNewSet.children(".dataSetItemTitle").children("span").eq(0).html($("#setNameInput").val());
    $(".detailDataSetList").append(theNewSet);
    $("#dataSet .detailDataSetList  li .dataSetItemTitle").each(function(index,ele){
      hideDataSetList(ele);
    });
    showDataSetList(theNewSet.children(".dataSetItemTitle").eq(0).get(0));
      
  })
  
  // 增加数据源按钮
  $("#analysisContainer .leftSlide #addDataSourceBtn").click(function(event){
    event.stopPropagation();
    $("#connectDirector #addSourceSelects").show();
  });
  
  // 数据源选择按钮点击事件
  $("#analysisContainer .leftSlide #addSourceSelects p.addDataBase").click(function(event){
    event.stopPropagation();
    
      $("#analysisContainer .leftSlide #addSourceSelects").hide();
      $("#analysis_dataList").show("explode",500,BindProgressToDetailBase);
      $(".maskLayer").show();
      $("#analysiscloseDataList").click(function(){
        $("#analysis_dataList").hide();
        $(".maskLayer").hide();
      });
  });
  
  $("#analysisContainer .leftSlide #addSourceSelects #addPanelFileInput").change(function(){
    $(".maskLayer").show();
    var fileInfo = $(this).get(0).files[0];
    if (fileInfo.name.substring(fileInfo.name.indexOf(".")).toLowerCase() == ".csv"){
      $("#panelFileSettingOption").show();  
    }else{
      var formData = new FormData();
      formData.append("file",fileInfo);
      analysis_uploadCSVFileFun(formData);
    }
    
  });
  
  $("#panelFileSettingOption .common-head .close,#panelFileSettingOption a.cancleBtn").click(function(event){
      $("#panelFileSettingOption").hide();
      $(".maskLayer").hide();
      $("#analysisContainer .leftSlide #addSourceSelects #addPanelFileInput").val("");
  });
    
  function analysis_uploadCSVFileFun(formData){
    $.ajax({
      url:"/cloudapi/v1/uploadcsv",
      type:"POST",
      processData: false,
          contentType:false,
          data:formData,
          beforeSend:function(){
              $("#panelFileSettingOption").hide();
              $("#connectDirector #addSourceSelects").hide();
              var target =  $("body").get(0);
                spinner.spin(target);
          },
          success:function(data){
              if(data.status == "success"){
                $(".maskLayer").hide();
                spinner.stop();
                updatePanelFileListFromNetwork();
                  }
              }
    });
  }
    
    $("#panelFileSettingOption a.confirmBtn").click(function(event){
    var delimiter = $("#panelFileSettingOption .fileSettingBody .topOption .delimiterOption input").val();
    var quote = $("#panelFileSettingOption .fileSettingBody .topOption .quoteOption input").val();
    var header = $("#panelFileSettingOption .fileSettingBody .bottomOption  input").get(0).checked;
    var formData = new FormData();
    var fileInfo = $("#analysisContainer .leftSlide #addSourceSelects #addPanelFileInput").get(0).files[0];
    formData.append("file",fileInfo);
    formData.append("delimiter",delimiter);
    formData.append("quote",   quote);
    formData.append("header",header);
    analysis_uploadCSVFileFun(formData);
        
     });
  
  
   // 给具体的数据库平台按钮绑定事件函数
    function BindProgressToDetailBase(){
        $("#analysis_dataList .baseDetail li").click(function(){
          dataBaseName = $(this).html();
          if(dataBaseName == "ORACLE"){
            $("#connectDataBaseInfo #dataBaseConnectForm .userDiv label.dbSid").show();
          }else{
            $("#connectDataBaseInfo #dataBaseConnectForm .userDiv label.dbSid").hide();
          }
          $("#analysis_dataList").hide();
          $("#connectDataBaseInfo").show('shake',500,baseInfoShowCallBack);
        })
    }
  
  //  连接数据库的弹框显示之后，处理里面的点击事件
    function baseInfoShowCallBack(){
        $("#connectDataBaseInfo .common-head span.flag").html(dataBaseName);
      $("#connectDataBaseInfo #formPostDataBaseName").val(dataBaseName);
        $("#loginBtn").click(function(event){
          // 待处理
      var formData = new FormData($("#dataBaseConnectForm").get(0));
      formData.append("username","yzy");
      $.ajax({
        url:"/dataCollection/connectDataBaseHandle",
        type:"POST",
        processData: false,
              contentType:false,
              data:formData,
              success:function(data){
          if(data.status == "success"){
            updateDBListFromNetwork();
          }
              }
      });
        
//      上面是链接数据库的字段信息
          $("#connectDataBaseInfo").hide();
          $(".maskLayer").hide();
        })
    }
  
  // 给拖拽区域的表格绑定鼠标移入事件
  function dragBoxBindMosueOver(){
    $("#analysisContainer .mainDragArea .boxDiv").unbind("mouseenter");
    $("#analysisContainer .mainDragArea .boxDiv").mouseenter(function(event){
      $("#analysisContainer .mainDragArea #dragTableDetailInfo").css({
        left:this.offsetLeft + "px",
        top:this.offsetTop - 40 + "px" 
      })
      // 记录一下当前的详情是哪个表格的
      if ($("#analysisContainer .mainDragArea #dragTableDetailInfo").attr("record") != this.id) {
        
        $("#analysisContainer .mainDragArea #dragTableDetailInfo").attr("record",this.id);
      }
      // 详情显示
      $("#analysisContainer .mainDragArea #dragTableDetailInfo").show();
    }); 
  }
  
  // 表格详情按钮的点击
  $("#analysisContainer .mainDragArea #dragTableDetailInfo .imgBox").click(function(){
    $(this).siblings(".imgBox").removeClass("active");
    $(this).addClass("active");
    var dbInfo = $(this).parent("#dragTableDetailInfo").attr("record");
    if ($(this).attr("flag") == "detail") { 
      // 再次点击之前点击过的表格
      if ($("#tableDataDetailListPanel").attr("nowShowTable") == dbInfo) {
        // 如果当前正在显示,不作出处理
        if ($("#tableDataDetailListPanel").is(":visible")) {
          return; 
        }else{
          $("#tableDataDetailListPanel").show("blind",{"direction":"down"},200);
          return;
        }
      }
      
//      // 记录当前是展示的哪个表格的数据
        $("#tableDataDetailListPanel").attr("nowShowTable",dbInfo);
        // 获取相应的表格数据数据
        filterSuccessFun(true);
      
    }else if($(this).attr("flag") == "deleteTable"){
      
      // 移除线
        instance.detachAllConnections($(".mainDragArea #"+dbInfo)); 
        // 移除点
        var endPonints = instance.getEndpoints($(".mainDragArea #"+dbInfo));
        for (var i = 0; i < endPonints.length;i++) {
          instance.deleteEndpoint(endPonints[i]);
        }
        
      // 移除元素这个
      $(".mainDragArea #"+dbInfo).remove();
      // 移除详情按钮等
      $("#analysisContainer .mainDragArea #dragTableDetailInfo").add("#tableDataDetailListPanel").hide(); // 表信息隐藏
      // 数据的移除
      delete didShowDragAreaTableInfo[dbInfo];
      // 移除筛选条件
      deleteATableAllConditions(dbInfo);
      // 设置当前显示的 table 为空
	 $("#tableDataDetailListPanel").attr("nowShowTable","none");
	 // 清楚底部的表格
	  $("#tableDataDetailListPanel .mainContent table thead tr").html("");
      $("#tableDataDetailListPanel .mainContent table tbody").html("");

      if(store_split_tableName_free.indexOf(dbInfo.split("_YZYPD_")[2]) != -1){
        var nowDelete_split_father = [];

        var free_handle_table =store_split_tableArr[store_split_tableName_free.indexOf(dbInfo.split("_YZYPD_")[2])];

        nowDelete_split_father.push(store_split_tableArr[store_split_tableName_free.indexOf(dbInfo.split("_YZYPD_")[2])]);
        //移除拆分的记录
        store_split_tableArr.splice(store_split_tableName_free.indexOf(dbInfo.split("_YZYPD_")[2]),1);

        store_split_tableName_free.splice(store_split_tableName_free.indexOf(dbInfo.split("_YZYPD_")[2]),1);

        remove_splitData(nowDelete_split_father);

        //判断当前显示table为清空拆分后的数据
        if($("#tableDataDetailListPanel").attr("nowshowtable") == free_handle_table["source"]+"_YZYPD_"+free_handle_table["coldickey"].split("_YZYPD_")[0]+"_YZYPD_"+free_handle_table["coldickey"].split("_YZYPD_")[1]){
          $("#tableDataDetailListPanel .mainContent table tbody").html("");
          $("#tableDataDetailListPanel").attr("nowshowtable","");
        }
        

      }
    
    }else if($(this).attr("flag") == "deleteCon"){
      // 移除线
        instance.detachAllConnections($(".mainDragArea #"+dbInfo));
        
    }
  });
  
  
    //移除或刷新关闭页面删除拆分数据
    function remove_splitData(now_click_delete){
      var post_splitData_arr = {
        "tables":now_click_delete,
      };

       $.ajax({
      url:"/dataCollection/deleteTempCol",
      type:"post",
      dataType:"json",
      contentType: "application/json; charset=utf-8",
      async: true,
      data:JSON.stringify(post_splitData_arr),
      success:function(result){
        if(result["status"] == "success"){
//        console.log("删除成功");
        }
      }
  });
    }
  
  // 创建下方展示的表格详情视图
  function createTableDetailView(dbInfo,rs,isAllFields){
    // 需要---dbInfo
     bottom_panel_fileds = [];
    var originalFileds =didShowDragAreaTableInfo[dbInfo];
      if(isAllFields == true){
         bottom_panel_fileds = originalFileds;
      }else{
        // 过滤未选择的字段
        for (var i = 0;i < originalFileds.length;i++) {
          if (originalFileds[i]["isable"] == "yes") {
             bottom_panel_fileds.push(originalFileds[i]);
          }
        }
      }
    
    // 清空
            $("#tableDataDetailListPanel .mainContent table thead tr").html("");
            $("#tableDataDetailListPanel .mainContent table tbody").html("");
            
          for (var i= 0;i <  bottom_panel_fileds.length;i++) {
            var img = $("<img/>");
            var th = $("<th title='单击选中列'><span>" + bottom_panel_fileds[i]["field"]+"</span></th>");
            th.data("type",bottom_panel_fileds[i]["type"]);
            if (bottom_panel_fileds[i]["type"].isTypeString()) {
              img.attr("src","/../../../static/dataCollection/images/tableDataDetail/String.png");
            }else if (bottom_panel_fileds[i]["type"].isTypeDate()) {
              img.attr("src","/../../../static/dataCollection/images/tableDataDetail/date.png");
            }else if(bottom_panel_fileds[i]["type"].isTypeNumber()){
              img.attr("src","/../../../static/dataCollection/images/tableDataDetail/Integer.png");
            }else if(bottom_panel_fileds[i]["type"].isTypeSpace()){
              img.attr("src","/../../../static/dataCollection/images/tableDataDetail/geography.png");
            }
            img.insertBefore(th.children("span").eq(0));
            $("#tableDataDetailListPanel .mainContent table thead tr").append(th);
          }
          for (var i = 0; i < rs.length;i++) {
            var tr = $("<tr></tr>");
            var lineData = rs[i];
            for (var j = 0;j < bottom_panel_fileds.length;j++) {
              var theFiled = bottom_panel_fileds[j]["field"];
              
              var td = $("<td>" + lineData[theFiled] + "</td>");
              td.addClass(bottom_panel_fileds[j]["field"]);
              tr.append(td);
            }
            $("#tableDataDetailListPanel .mainContent table tbody").append(tr);
          }
    
    // 自动调整弹出窗口的大小
          autoSizetableDataDetailListPanel(bottom_panel_fileds.length);
          if (!$("#tableDataDetailListPanel").is(":visible")){
            $("#tableDataDetailListPanel").show("blind",{"direction":"down"},200);
          }
          //绑定按钮功能操作事件
          bindHandlefunctionTotableDataDetailListPanel();
    
  }
  
  
  // 数据详情关闭按钮的点击
  $("#tableDataDetailListPanel #closeableDataDetailListPanel").click(function(){
    $("#tableDataDetailListPanel").hide("blind",{"direction":"down"},200);
  })
  
  // 调整下面展示的表格数据弹框视图的大小
  function autoSizetableDataDetailListPanel(filedNumber){
    if($("#analysisContainer .leftSlide").eq(0).is(":visible")){
      var  w = $(document).width() - $(".container .main .leftNav").eq(0).width() - $("#analysisContainer .leftSlide").eq(0).width();
    }else{
      var  w = $(document).width() - $(".container .main .leftNav").eq(0).width();
    }
    
    $("#tableDataDetailListPanel").css({
      width:w
    });
    $("#tableDataDetailListPanel .mainContent table thead tr th").css({
      width:w / filedNumber
    });
    $("#tableDataDetailListPanel .mainContent table tbody tr td").css({
      width:w / filedNumber
    });
  }
  
 //绘制固定宽度的标尺
 function drag_fixedWidth(){
  var scaleplate_num = 340;
  for(var i =0; i < Math.ceil(scaleplate_num/6);i++){
    var scaleplate_one = $("<li class='scaleplate_li'></li>");
    if(i%5 == 0){
      $(scaleplate_one).height(10);
    }else{
      $(scaleplate_one).height(5)
    }
    scaleplate_one.appendTo($(".split_fileds .splitFileds_handle_area .split_manner .fixedWidth_scaleplate ul"));
  }

 }


//刻度线双击 拖动方法
function scaleLine_drag_dbl(){
  $(".splitWidth_line_only").each(function(index,ele){
    $(ele).dblclick(function(){
      $(ele).remove();
    })
    
    //拖动
    $(ele).draggable({
      // appendTo:"body",
      revert:false,
      helper:"clone",
      axis:"x",
      grid:[6,6],
      drag:function(event,ui){
        ui.helper.css("borderLeft","1px dashed red");
      },
      stop:function(event,ui){
        $(ele).css("left",ui.helper.position().left);
      }
    });

  })

}

//固定宽度区域点击显示区域间隔刻度
function fixedWidth_drag_click(){
  $(".split_fileds .splitFileds_handle_area .split_manner .fixedWidth_content .splitPreview_area").unbind("click");
  $(".split_fileds .splitFileds_handle_area .split_manner .fixedWidth_content .splitPreview_area").on("click",function(e){
    if($(e.target).hasClass("splitWidth_line_only")){
      return;
    }
    var splitWidth_line = $("<div class='splitWidth_line_only'></div>");
    splitWidth_line.appendTo($(this));

    splitWidth_line.css("left",Math.round((e.clientX-$(this).offset().left)/6)*6 -1 + "px").height($(this).find("ul").height());
    scaleLine_drag_dbl();
  })
} 

// 判断当前拆分选择的类型
function table_if_type(){
  //记录当前选择拆分的字符
  var save_table_temporary = null;

  //存储固定宽度选择的宽度
  var fixedWIdth_savearr = [];
  //判断如果类型为默认分隔符号
  if($(".splitFileds_handle_area .split_manner label[name='splitWay_separ'][class='checked']").attr("id") == "label_separ"){
    if($(".splitFileds_handle_area .split_manner label[name='label_check'][class='checked']").get(0).hasAttribute("splitSymbol")){
      save_table_temporary = $(".splitFileds_handle_area .split_manner label[name='label_check'][class='checked']").attr("splitSymbol").split("_YZY_")[1];  
    }else{
      save_table_temporary = $("#label_input_textarea").val();
    }
    save_handel_split_way = "split";

    return save_table_temporary;
  }else{
    save_handel_split_way = "limit";

    var textNum = null;
    if(if_chtext){
      textNum = 10;
    }else{
      textNum = 5;
    }
    $(".splitWidth_line_only").each(function(index,ele){

      if(Math.floor($(ele).position().left/textNum) < storeArr_maxlength){
        fixedWIdth_savearr.push(Math.floor($(ele).position().left/textNum));
      }
    })

    return fixedWIdth_savearr;
  }

  
  
}

//拆分弹窗初始化
function splitWall_init(){
    $(".split_fileds").add(".maskLayer").hide();
    $('.split_fileds .splitFileds_handle_area .split_manner #label_fixed').removeClass("checked");
    $('.split_fileds .splitFileds_handle_area .split_manner #label_separ').addClass("checked");
    $(".split_fileds .splitFileds_handle_area .split_manner #label_input_textarea").blur().val("");
    $("#tableDataDetailListPanel .topInfo #splitFileds_btn").css("opacity","0.5");
    // $(".split_fileds .splitFileds_handle_area .split_preview .splitPreview_area ul").html("");
          // 清除上一个选中的的列
    if (currentHandleColOrRowEles) {
          currentHandleColOrRowEles.css("background","");
          currentHandleColOrRowEles.eq(0).attr("isSelect","false");
          currentHandleColOrRowEles = null;
    }
    $(".split_error").remove();
    $(".split_fileds .splitFileds_handle_area .split_manner .fixedWidth_content .splitPreview_area").html("");
    $('label[name="label_check"]').removeAttr('class') && $(".split_fileds .splitFileds_handle_area .split_manner #splitSe_label").addClass("checked");
}

//拆分后展示scame变化
function split_change_schame(split_table_name,data,now_click_table_name){
  
  $("#analysisContainer .mainDragArea .boxDiv .tableTitle p").each(function(index,ele){
    if($(ele).text() == split_table_name){
      var fixedSPlit_data = $(ele).parent().parent().data("split_record").split("_YZY_");
      $(ele).parent().parent().remove();
      currentTableAllData = data["results"]["data"];
      var gather_table_schema_split = data["results"]["schema"];
      filterNeedAllData = data["results"]["data"];
      for(var i = 0 ; i < gather_table_schema_split.length;i++){
        gather_table_schema_split[i]["isable"] = "yes";
      }
      didShowDragAreaTableInfo[now_click_table_name] = gather_table_schema_split;
      
      showDataTables(fixedSPlit_data[0],fixedSPlit_data[1],data["results"]["schema"],fixedSPlit_data[2],fixedSPlit_data[3],$(".mainDragArea"),fixedSPlit_data[4],"if_or");

      // console.log($(ele).parent().parent().children(),$(ele).parent().parent().position().left)
      createTableDetailView(now_click_table_name,data["results"]["data"]);
    }
  })
}


//记录上一个点击显示的列名
 var pre_click_table_name = null;

 var everyTable_split_dict = {};

 //判断是否是汉字

 var if_chtext = false;
 //拆分按钮点击事件
 function splitFileds_handle_table(save_col_text,col_name_click){
 
  //获取当前操作的文件名
  var now_click_table_name = $("#tableDataDetailListPanel").attr("nowshowtable");

  getCurrentTableFilterData(now_click_table_name);
  
  //获取当前表的筛选结果
  var now_table_filter_dict = conditionFilter_record[now_click_table_name];

  $(".split_fileds .splitFileds_handle_area .split_preview .splitPreview_area").scrollTop(0);
  $(".split_fileds").show();
  $(".maskLayer").show();
  // 关闭按钮点击事件
  $(".split_fileds .common-head .close").add(".split_fileds .splitFileds_footer .cancleBtn").click(function(){
    $(".split_fileds").hide("shake",100,function(){
      splitWall_init();
      $(".maskLayer").hide();
    })
  })

  //确定按钮点击post
  $(".split_fileds .splitFileds_footer .confirmBtn").unbind("click");
  $(".split_fileds .splitFileds_footer .confirmBtn").on("click",function(event){
    event.stopPropagation();
    if($(".splitFileds_handle_area .split_manner #label_other").hasClass("checked") && $(".split_fileds .splitFileds_handle_area .split_manner #label_input_textarea").val() == "" && $(".splitFileds_handle_area .split_manner #label_separ").hasClass("checked") ){
      $(".split_fileds .splitFileds_handle_area .split_manner #label_input_textarea").css("border","1px solid red");
      return;
    }

    var dbArr_split = now_click_table_name.split("_YZYPD_");


    var expressions_free_dict = {};

    //用于拆分的字符
    var table_split_symbol = table_if_type();


    expressions_free_dict["colname"] = col_name_click;

    expressions_free_dict["method"] = save_handel_split_way;

    expressions_free_dict["cutsymbol"] = table_split_symbol;

   

    var postFilterCondition_split = {
    "source":dbArr_split[0],
    "database":dbArr_split[1],
    "tableName":dbArr_split[2],
    "columns":{},
    "conditions":now_table_filter_dict["common"].concat(now_table_filter_dict["condition"]),
    "handleCol":expressions_free_dict,
    }
//   console.log(postFilterCondition_split)


      $.ajax({
      url:"/dataCollection/filterTable/all",
      type:"post",
      dataType:"json",
      contentType: "application/json; charset=utf-8",
      async: true,
      data:JSON.stringify(postFilterCondition_split),
      beforeSend:function(){
        var target =  $("body").get(0);
                spinner.spin(target);
      },
      success:function(data){
//      console.log(data)
        $(".split_error").remove();
        spinner.stop();

        //拆分弹窗初始化
        splitWall_init();

        //拆分后改变schame
        split_change_schame(dbArr_split[2],data,now_click_table_name);

        if(everyTable_split_dict["coldickey"] != dbArr_split[1]+"_YZYPD_"+dbArr_split[2]){
          everyTable_split_dict = {};

          everyTable_split_dict["source"] = dbArr_split[0];
          everyTable_split_dict["coldickey"] = dbArr_split[1]+"_YZYPD_"+dbArr_split[2];
          //保存拆分的表格
          store_split_tableArr.push(everyTable_split_dict);

          store_split_tableName_free.push(dbArr_split[2]);
        }
        
      },
      error:function(){
        spinner.stop();
        $("<p class='split_error'>拆分失败</p>").appendTo($(".split_fileds .splitFileds_footer"));
      }
  });
  })

  //其他按钮点击输入框事件
  $(".split_fileds .splitFileds_handle_area .split_manner #label_input_textarea").focus(function(){
    $('label[name="splitWay_separ"]').removeAttr('class') && $('label[name="label_check"]').removeAttr('class') && $(".split_fileds .splitFileds_handle_area .split_manner #label_other").addClass("checked") && $(".split_fileds .splitFileds_handle_area .split_manner #label_separ").addClass("checked");
  })

  $(".split_fileds .splitFileds_handle_area .split_manner #label_input_textarea").on("input",function(){
    $(".split_fileds .splitFileds_handle_area .split_manner #label_input_textarea").css("borderColor","#DEDEDE");
  })

  //单选按钮点击事件
  $('.split_fileds .splitFileds_handle_area .split_manner label[name="splitWay_separ"]').add('.split_fileds .splitFileds_handle_area .split_manner label[name="label_check"]').click(function(){
      if($(this).attr("id") == "label_fixed" && !$(this).hasClass("checked")){
        $(".split_fileds .splitFileds_handle_area .split_manner .fixedWidth_content .splitPreview_area").append($(".split_fileds .splitFileds_handle_area .split_preview .splitPreview_area ul").clone(true));
        fixedWidth_drag_click();
      }

      if($(this).attr("id") == "label_separ" && !$(this).hasClass("checked")){
        $(".split_fileds .splitFileds_handle_area .split_manner .fixedWidth_content .splitPreview_area").html("");  
      }
      
      var radioId = $(this).attr('name');
      if(radioId  == "splitWay_separ"){
        $('label[name="splitWay_separ"]').removeAttr('class') && $(this).attr('class', 'checked');
        $('input[type="radio"]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
      }else{
        $('label[name="label_check"]').removeAttr('class') && $(this).attr('class', 'checked');
        $('input[type="radio"]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
      }

    });

    $('.split_fileds .splitFileds_handle_area .split_manner input[name="splitSe_checked"]').click(function(){
      if($(this).attr("id") == "other"){
        $(".split_fileds .splitFileds_handle_area .split_manner #label_input_textarea").focus();
      }
      $(".split_fileds .splitFileds_handle_area .split_manner .fixedWidth_content .splitPreview_area").html("");
    $('.split_fileds .splitFileds_handle_area .split_manner #label_fixed').removeClass("checked");
      $('.split_fileds .splitFileds_handle_area .split_manner #label_separ').addClass("checked");
    })
      
        $('.split_fileds .splitFileds_handle_area .split_manner #label_fixed').removeClass("checked");
      $('.split_fileds .splitFileds_handle_area .split_manner #label_separ').addClass("checked");


    if(pre_click_table_name == col_name_click){

      return;

    }else{

      $(".split_fileds .splitFileds_handle_area .split_preview .splitPreview_area ul").html("");
      $(".split_fileds .splitFileds_handle_area .split_manner .fixedWidth_content .splitPreview_area").html("");

      if_chtext = false;
      var strHandle = /[^\x00-\xff]/g;
      //预览里写入对应列的数据
      for(var i = 0; i < save_col_text[col_name_click].length;i++){
           if(strHandle.test(save_col_text[col_name_click][i])){
              if_chtext = true;
          }
        storeArr_maxlength = save_col_text[col_name_click][i].getLength();
        if(save_col_text[col_name_click][i].getLength() > storeArr_maxlength){

          if(i != 0 ){
            storeArr_maxlength.phsh(save_col_text[col_name_click][i].getLength());
          }
        }

        var pre_show_list = $("<li class='pre_show_class'><span>"+save_col_text[col_name_click][i]+"</span></li>");

        pre_show_list.appendTo($(".split_fileds .splitFileds_handle_area .split_preview .splitPreview_area ul"));
      }
      pre_click_table_name = col_name_click;
    }


    //临时处理
     // $("#free_handle").unbind("click");

 }
 // 用来记录当前正在表详细中操作的列或者行元素
  currentHandleColOrRowEles = null;
 
 //  底层弹出的表格详细信息视图中的选中功能
function bindHandlefunctionTotableDataDetailListPanel(){
 // 隐藏列功能
 $("#tableDataDetailListPanel .mainContent table thead tr th").click(function(event){
    event.stopPropagation();
    $("#tableDataDetailListPanel .topInfo #splitFileds_btn").css("opacity","1");
    var isSelected = $(this).attr("isSelect");
    
    if (isSelected == "true") {
      currentHandleColOrRowEles.css("background","");
      $(this).attr("isSelect","false");
      currentHandleColOrRowEles = null;
      $("#tableDataDetailListPanel .topInfo #splitFileds_btn").css("opacity","0.5");
    }else{
      //存储点击列对应的数据
      var save_click_col_data = [];
      // 清除上一个选中的的列
      if (currentHandleColOrRowEles) {
        currentHandleColOrRowEles.css("background","");
          currentHandleColOrRowEles.eq(0).attr("isSelect","false");
        currentHandleColOrRowEles = null;
      }
      
      currentHandleColOrRowEles = $(this).add("#tableDataDetailListPanel .mainContent table tbody tr ." + $(this).children("span").eq(0).html());
      
      currentHandleColOrRowEles.css("background","#ffeac6");
      $(this).attr("isSelect","true");

    }
    
 });
 
}
 //拆分按钮点击显示
$("#tableDataDetailListPanel #splitFileds_btn").click(function(){
    if($(this).css("opacity") == "0.5"){
      return;
    }

    //存储点击列对应的数据
    var save_click_col_data = [];

    col_name_click = currentHandleColOrRowEles.eq(0).text();

    currentHandleColOrRowEles.each(function(index,ele){
         save_click_col_data.push($(ele).text()) ;
        })

      save_col_text[currentHandleColOrRowEles.eq(0).text()] = save_click_col_data;
    splitFileds_handle_table(save_col_text,col_name_click);
  })

// 隐藏按钮的功能
$("#tableDataDetailListPanel #hiddenEle").mousedown(function(event){
  event.stopPropagation();
  $(this).children("img").eq(0).attr("src","/../../../static/dataCollection/images/tableDataDetail/handle_35.png");
  
});
$("#tableDataDetailListPanel #hiddenEle").mouseup(function(event){
  $(this).children("img").eq(0).attr("src","/../../../static/dataCollection/images/tableDataDetail/handle_33.png");
  event.stopPropagation();
  
  if (currentHandleColOrRowEles) {
  // 当前正在操作的表格---
  var dbInfo =  $("#tableDataDetailListPanel").attr("nowShowTable");
  // 当前正在操作的字段
  var field = currentHandleColOrRowEles.eq(0).children("span").html();
  $(".mainDragArea #" +dbInfo + " .fields li span:contains(" + field+")").prev("input").trigger("click"); 
  
  // 显示“隐藏内容的按钮” 可以进行点击了
  setshowHiddenEles_btn_notSelected();
  // 隐藏
  currentHandleColOrRowEles.hide("blind",{"direction":"left"},300);
  }
  
});

// 显示隐藏按钮的功能
$("#tableDataDetailListPanel .topInfo  #showHiddenEles").click(function(event){
  event.stopPropagation();
  var dbInfo  = $("#tableDataDetailListPanel").attr("nowShowTable");
  // 如果当前已经是选中状态
  if($("#tableDataDetailListPanel .topInfo #showHiddenEles").attr("isSelected") == "did"){
    return;
  };
  
  if ($("#tableDataDetailListPanel").is(":visible")) {
    
    var  fileds = didShowDragAreaTableInfo[dbInfo];
    for (var i = 0;i < fileds.length;i++){
        if (fileds[i]["isable"] == "no"){
          fileds[i]["isable"] = "yes";
          $(".mainDragArea #" +dbInfo + " .fields li span:contains(" + fileds[i]["field"]+")").prev("input").get(0).checked = true;
        }
    }
    setshowHiddenEles_btn_didSelected(); // 变成选中状态
//  console.log(currentTableAllData)
    createTableDetailView(dbInfo,currentTableAllData,true);
  }

});


// 显示按钮设置为未选中状态
function setshowHiddenEles_btn_notSelected(){
  $("#tableDataDetailListPanel .topInfo #showHiddenEles").attr("isSelected","not");
  $("#tableDataDetailListPanel .topInfo #showHiddenEles").children("img").eq(0).attr("src","/../../../static/dataCollection/images/tableDataDetail/handle_33.png");
}
// 显示按钮设置为选中状态
function setshowHiddenEles_btn_didSelected(){
  $("#tableDataDetailListPanel .topInfo #showHiddenEles").attr("isSelected","did");
  $("#tableDataDetailListPanel .topInfo #showHiddenEles").children("img").eq(0).attr("src","/../../../static/dataCollection/images/tableDataDetail/handle_35.png");
}


// 底部菜单筛选器按钮点击的时候
$("#tableDataDetailListPanel #screeningWasher").click(function(){
    editFilterViewShow_fun("buildData",filterSuccessFun);
});

// 筛选完毕之后的回调函数
function filterSuccessFun(isNeedAllData){
  var dbInfo = $("#tableDataDetailListPanel").attr("nowShowTable");
  var dbArr = dbInfo.split("_YZYPD_");
  var conditions = [];
  getCurrentTableFilterData(dbInfo);

  if(conditionFilter_record[dbInfo]){
    conditions = conditionFilter_record[dbInfo]["common"].concat(conditionFilter_record[dbInfo]["condition"],conditionFilter_record[dbInfo]["dateCondition"]);
  }
  var postFilterCondition = {
    "source":dbArr[0],
    "database":dbArr[1],
    "tableName":dbArr[2],
    "columns":{},
    "conditions":conditions,
  }
  var postURL = "/dataCollection/filterTable/data";
  if(dbArr[0] == "hdfs"){
    postURL = "/cloudapi/v1/tables/"+dbArr[2]+"/data";
    postFilterCondition = {
      "conditions":conditions
    }
  }else if(dbArr[0] == "tmptables"){
    postURL = "/cloudapi/v1/uploadedcsv/"+dbArr[1]+"/"+dbArr[2]+"/data"
    postFilterCondition = {
      "conditions":conditions,
    }
  }
  
  $.ajax({
      url:postURL,
      type:"post",
      dataType:"json",
      contentType: "application/json; charset=utf-8",
      async: true,
      data:JSON.stringify(postFilterCondition),
      beforeSend:function(){
        var target =  $("body").get(0);
                spinner.spin(target);
      },
      success:function(data){
        spinner.stop();
        currentTableAllData = data.results.data;
        if(isNeedAllData){
          if(conditions.length < 1){
            filterNeedAllData = data.results.data;
            createTableDetailView(dbInfo,currentTableAllData);  
            
          }else{
            getFilterNeedAllData_fun(dbInfo);
          }
        }else{
        
          createTableDetailView(dbInfo,currentTableAllData);  
        }
      }
  });
}

function getFilterNeedAllData_fun(dbInfo){
      var dbArr = dbInfo.split("_YZYPD_");  
      if(dbArr[0] == "hdfs"){
        $.ajax({
          url:"/cloudapi/v1/tables/"+dbArr[2]+"/data",
          type:"post",
          dataType:"json",
          contentType: "application/json; charset=utf-8",
          async: true,
          beforeSend:function(){
            var target =  $("body").get(0);
            spinner.spin(target);
          },
          success:function(data){
            spinner.stop();
            filterNeedAllData = data.results.data;
            
              createTableDetailView(dbInfo,currentTableAllData);
          }
        })
        
      }else if(dbArr[0] == "tmptables"){
        var postdata = {"filename":dbArr[2],"username":dbArr[1]}
        $.ajax({
          url:"/cloudapi/v1/uploadedcsv/"+dbArr[1]+"/"+dbArr[2]+"/data",
          type:"post",
          dataType:"json",
          contentType: "application/json; charset=utf-8",
          async: true,
          beforeSend:function(){
            var target =  $("body").get(0);
                    spinner.spin(target);
          },
          success:function(data){
            spinner.stop();
            filterNeedAllData = data.results.data;
          
              createTableDetailView(dbInfo,currentTableAllData);  
          }
        })
        
      }else{
        
        var tablesSelect = {"source":dbArr[0],"database":dbArr[1],"tableName":dbArr[2],"columns":{},"conditions":[]};
//      console.log(tablesSelect);
        $.ajax({
          url:"/dataCollection/filterTable/data",
          type:"post",
          data:JSON.stringify(tablesSelect),
          contentType: "application/json; charset=utf-8",
          async: true,
          dataType:'json',
          beforeSend:function(){
            var target =  $("body").get(0);
            spinner.spin(target);
          },
          success:function(data){
            if(data.status == "success"){
              spinner.stop();
              filterNeedAllData = data.results.data;
//            console.log(currentTableAllData)
                createTableDetailView(dbInfo,currentTableAllData);  
            }
          }
        }); 
      }   
  }

  //页面刷新时清除拆分保存的数据
  window.onbeforeunload = function(){
    remove_splitData(store_split_tableArr);
  }

}
