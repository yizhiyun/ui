var dirllConditions = [];
var currentChatType = "none";
var radarDiemension = "none";
var showTongbiMeasureArray = [];
var showHuanbiMeasureArray = [];
//下钻弹窗显示位置
var drillDownWallPositionLeft = null;
var drillDownWallPositionTop = null;

//存储下钻对应的data和视图
var saveDataAndView = [];

//记录下钻时维度的数量信息
var saveDimeData = [];

var saveHandleViewData = [];

var count = 0;
var array = [];
var tempArr = [];



//记录上钻前的数据和视图展现方式

var saveDrillPreView = null;

//判断单双击
var timeout;

var manytimeout;

var saveDrillCount = [];

//当前分层结构对应的下标
var nowDrillDownCount = null;

var free_drag_row_column_data = null;

//判断是否有图形下钻
var onlyGetDrillDown = true;


//记录图形下钻对应的post数据
var saveEveryViewPostData = {};

var drillElementCount = {};

//图形下钻初始数据存储
var viewClickChange;

//经纬度
var qingshuiIP = {"老赵庄镇":"115.872314,36.844769","唐园镇":"115.589094,36.759041","烟店镇":"115.492752,36.71174","潘庄镇":"115.535484,36.69597","八岔路镇":"115.622081,36.704276","刘垓子镇":"115.799203,36.743381","魏湾镇":"115.921213,36.703206","康庄镇":"115.927608,36.799103","松林镇":"115.866251,36.902944","尚店镇":"115.708558,36.730482","戴湾镇":"115.863338,36.758834","金郝庄镇":"115.999788,36.861557"};
var liaochengMap = {"type": "FeatureCollection", "features": [{"type":"Feature","properties":{"name":"东阿县","id":"371524"},"geometry":{"type":"MultiPolygon","coordinates":[[[[116.047345,36.1938430000001],[116.043922148438,36.1816506171876],[116.035152617188,36.1904201484375],[116.047345,36.1938430000001]]],[[[116.537345,36.413843],[116.537345,36.4238430000001],[116.547345,36.4238430000001],[116.547345,36.413843],[116.537345,36.413843]]],[[[116.537345,36.4238430000001],[116.527345,36.4238430000001],[116.532345,36.4366506171875],[116.537345,36.4238430000001]]],[[[116.527345,36.4238430000001],[116.527345,36.413843],[116.537345,36.413843],[116.530704375,36.4004836250001],[116.527345,36.3838430000001],[116.50197390625,36.3792153144531],[116.47267703125,36.3384145332032],[116.443316679688,36.3407741523438],[116.43271609375,36.3284706855469],[116.39197390625,36.3192153144532],[116.319210234375,36.2885720039063],[116.27271609375,36.2284706855469],[116.227345,36.173843],[116.209386015625,36.1664638496094],[116.159893828125,36.1762429023438],[116.166905546875,36.1407717109376],[116.111519804688,36.1296681953126],[116.103170195313,36.1180178046875],[116.097345,36.113843],[116.09326296875,36.1297585273438],[116.07142703125,36.1379274726563],[116.059176054688,36.1856740546875],[116.047345,36.1938430000001],[116.06068484375,36.2105019355469],[116.083155546875,36.2284963203125],[116.067345,36.283843],[116.070704375,36.2904836250001],[116.093985625,36.2972023750001],[116.104859648438,36.3186952949219],[116.096685820313,36.3354274726563],[116.114976835938,36.3584511542969],[116.109215117188,36.3702529121094],[116.153985625,36.3772023750001],[116.157345,36.3838430000001],[116.176553984375,36.3762905097656],[116.2476575,36.3912953925781],[116.265797148438,36.4147914863281],[116.328311796875,36.4403774238281],[116.354713164063,36.4845204902344],[116.38170046875,36.5194863105469],[116.397345,36.523843],[116.451217070313,36.4877162910157],[116.4620715625,36.4454189277344],[116.49435671875,36.4526564765625],[116.51142703125,36.4279274726563],[116.527345,36.4238430000001]]]]}},{"type":"Feature","properties":{"name":"东昌府区","id":"371502"},"geometry":{"type":"MultiPolygon","coordinates":[[[[115.832896757813,36.6893959785157],[115.842144804688,36.6778481269531],[115.869342070313,36.6938356757813],[115.881793242188,36.6782900214844],[115.907345,36.673843],[115.901905546875,36.618529279297],[115.913150664063,36.6088430000001],[115.894752226563,36.592993390625],[115.93572390625,36.5673317695313],[115.968565703125,36.5292153144531],[116.00271609375,36.5384706855469],[116.023326445313,36.5499697089844],[116.062345,36.5468337226562],[116.094400664063,36.54940940625],[116.091300078125,36.5108571601563],[116.102022734375,36.4984157539063],[116.12779421875,36.5004860664063],[116.1327746875,36.4385195136719],[116.11271609375,36.4212404609375],[116.12197390625,36.4084706855469],[116.157345,36.3838430000001],[116.153985625,36.3772023750001],[116.109215117188,36.3702529121094],[116.114976835938,36.3584511542969],[116.096685820313,36.3354274726563],[116.104859648438,36.3186952949219],[116.093985625,36.2972023750001],[116.070704375,36.2904836250001],[116.067345,36.283843],[116.051519804688,36.2796681953126],[116.022095976563,36.2675771308595],[115.993170195313,36.2896681953126],[115.942413359375,36.2998439765625],[115.927345,36.2968666816406],[115.887935820313,36.3046547675781],[115.824635039063,36.2854262519531],[115.801910429688,36.2899172187501],[115.77802859375,36.2747548652344],[115.752345,36.2798305488282],[115.742056914063,36.2777980781251],[115.727345,36.283843],[115.721339140625,36.287837140625],[115.713350859375,36.3098488593751],[115.700904570313,36.3181252265626],[115.7107434375,36.3571681953126],[115.680875273438,36.3680055976563],[115.685943632813,36.3881252265626],[115.677345,36.393843],[115.68170046875,36.4294863105469],[115.70427859375,36.4469118476563],[115.72306765625,36.4928212714844],[115.78045046875,36.5371157050781],[115.761549101563,36.568452375],[115.767139921875,36.6062831855469],[115.751314726563,36.6184987617188],[115.763375273438,36.6491872382812],[115.742008085938,36.6656801582031],[115.737345,36.703843],[115.748546171875,36.7178322578125],[115.781793242188,36.6982900214844],[115.832896757813,36.6893959785157]]]]}},{"type":"Feature","properties":{"name":"高唐县","id":"371526"},"geometry":{"type":"MultiPolygon","coordinates":[[[[116.397345,36.813843],[116.409537382813,36.8104201484375],[116.400767851563,36.8016506171875],[116.397345,36.813843]]],[[[116.397345,36.813843],[116.378111601563,36.8019924140625],[116.400518828125,36.7700820136719],[116.387047148438,36.7268325019532],[116.397345,36.703843],[116.403546171875,36.6786025214844],[116.397345,36.663843],[116.397345,36.6538430000001],[116.36627078125,36.6470644355469],[116.282633085938,36.6992678046876],[116.252022734375,36.6968080878907],[116.232667265625,36.7192702460938],[116.222345,36.7184413886719],[116.212345,36.7192446113282],[116.187345,36.7172365546875],[116.1466809375,36.7205031562501],[116.094757109375,36.7062917304687],[116.05271609375,36.7392153144532],[116.0319153125,36.7484963203126],[116.0327746875,36.759204328125],[116.007345,36.7638430000001],[116.0120715625,36.8053847480469],[116.03326296875,36.8379274726563],[116.042393828125,36.8735207343751],[116.057345,36.8838430000001],[116.122906523438,36.8949806953126],[116.16162234375,36.9248647285156],[116.174605742188,36.9565822578126],[116.213990507813,36.9727028632813],[116.211529570313,36.9893544746094],[116.224483671875,36.9993544746094],[116.220206328125,37.0283315253907],[116.227345,37.0338430000001],[116.237257109375,37.0194887519532],[116.26326296875,37.0097585273437],[116.28142703125,36.9979274726563],[116.30326296875,36.9897585273438],[116.32384890625,36.976352765625],[116.367345,36.9666017890626],[116.387345,36.9710842109375],[116.402345,36.9677223945313],[116.421676054688,36.9720558906251],[116.43142703125,36.9579274726563],[116.447345,36.9538430000001],[116.461295195313,36.943843],[116.439503203125,36.9282228828126],[116.443472929688,36.9081349921875],[116.414971953125,36.8971425605469],[116.411236601563,36.8782228828125],[116.424322539063,36.868843],[116.4089465625,36.8578249335937],[116.397345,36.813843]]]]}},{"type":"Feature","properties":{"name":"冠县","id":"371525"},"geometry":{"type":"MultiPolygon","coordinates":[[[[115.737345,36.703843],[115.742008085938,36.6656801582031],[115.763375273438,36.6491872382812],[115.751314726563,36.6184987617188],[115.767139921875,36.6062831855469],[115.761549101563,36.568452375],[115.78045046875,36.5371157050781],[115.72306765625,36.4928212714844],[115.70427859375,36.4469118476563],[115.68170046875,36.4294863105469],[115.677345,36.393843],[115.64595828125,36.4005483222657],[115.612345,36.3985451484375],[115.581954375,36.400356671875],[115.582652617188,36.3886464667969],[115.579429960938,36.3791237617188],[115.54224734375,36.3993300605469],[115.53209109375,36.3879640937501],[115.502345,36.3897365546875],[115.488521757813,36.3596181464844],[115.452628203125,36.3791237617188],[115.380357695313,36.3903859687501],[115.337345,36.3838430000001],[115.33326296875,36.3897585273438],[115.2979309375,36.4141518378906],[115.3067590625,36.4535341621094],[115.277345,36.473843],[115.27099734375,36.48929221875],[115.283170195313,36.4980178046875],[115.2916028125,36.5299782539063],[115.30947390625,36.5264455390626],[115.323170195313,36.5480178046875],[115.335186796875,36.6079616523438],[115.368995390625,36.6321926093751],[115.385694609375,36.655493390625],[115.403170195313,36.6680178046875],[115.411519804688,36.6796681953125],[115.437345,36.6938430000001],[115.447843046875,36.6606777167969],[115.5089075,36.6392751289063],[115.5657434375,36.6783827949219],[115.59216921875,36.6794301582031],[115.611011992188,36.6590944648438],[115.631812773438,36.6582692695313],[115.652178984375,36.669048078125],[115.662515898438,36.6686379218751],[115.704586210938,36.6975893378906],[115.737345,36.703843]]]]}},{"type":"Feature","properties":{"name":"临清市","id":"371581"},"geometry":{"type":"MultiPolygon","coordinates":[[[[115.767345,36.913843],[115.812345,36.9082204414063],[115.837345,36.9113307929688],[115.862345,36.9082216621094],[115.872628203125,36.9094997382813],[115.916334257813,36.892700421875],[115.957345,36.8875991035157],[115.972345,36.8894643378907],[115.997345,36.8863552070313],[116.050079375,36.892915265625],[116.057345,36.8838430000001],[116.042393828125,36.8735207343751],[116.03326296875,36.8379274726563],[116.0120715625,36.8053847480469],[116.007345,36.7638430000001],[115.99306765625,36.7528212714844],[115.967349882813,36.6899831367188],[115.93673953125,36.6774550605469],[115.92205203125,36.6796254707032],[115.907345,36.673843],[115.881793242188,36.6782900214844],[115.869342070313,36.6938356757813],[115.842144804688,36.6778481269531],[115.832896757813,36.6893959785157],[115.781793242188,36.6982900214844],[115.748546171875,36.7178322578125],[115.737345,36.703843],[115.704586210938,36.6975893378906],[115.662515898438,36.6686379218751],[115.652178984375,36.669048078125],[115.631812773438,36.6582692695313],[115.611011992188,36.6590944648438],[115.59216921875,36.6794301582031],[115.5657434375,36.6783827949219],[115.5089075,36.6392751289063],[115.447843046875,36.6606777167969],[115.437345,36.6938430000001],[115.46271609375,36.7384706855469],[115.467345,36.753843],[115.502017851563,36.7696303535157],[115.512735625,36.7680458808594],[115.533922148438,36.7808266425781],[115.552345,36.7781044746094],[115.562345,36.7795815253907],[115.576304960938,36.7775185371094],[115.63298953125,36.7981996894531],[115.65170046875,36.8094863105469],[115.68298953125,36.8181996894532],[115.698839140625,36.8751235175782],[115.73170046875,36.8994863105469],[115.767345,36.913843]]]]}},{"type":"Feature","properties":{"name":"阳谷县","id":"371521"},"geometry":{"type":"MultiPolygon","coordinates":[[[[116.047345,36.1938430000001],[116.035152617188,36.1904201484375],[116.043922148438,36.1816506171876],[116.059176054688,36.1856740546875],[116.07142703125,36.1379274726563],[116.09326296875,36.1297585273438],[116.097345,36.113843],[116.061441679688,36.1077443671875],[115.995201445313,36.0516005683594],[115.95170046875,36.0394863105469],[115.92298953125,36.0281996894531],[115.87170046875,36.0194863105469],[115.850767851563,36.0068593574219],[115.817345,36.0117983222656],[115.787838164063,36.0074379707032],[115.766324492188,35.9795644355469],[115.73673953125,35.9674550605469],[115.717345,35.9703212714844],[115.695264921875,35.9670571113282],[115.67298953125,35.9381996894532],[115.647345,35.9338430000001],[115.67177859375,35.9722475410157],[115.681793242188,36.0262587714844],[115.660748320313,36.0810048652344],[115.667315703125,36.1337978339844],[115.718453398438,36.1977370429688],[115.733604765625,36.2337026191407],[115.731724882813,36.248843],[115.732984648438,36.2590041328125],[115.727345,36.283843],[115.742056914063,36.2777980781251],[115.752345,36.2798305488282],[115.77802859375,36.2747548652344],[115.801910429688,36.2899172187501],[115.824635039063,36.2854262519531],[115.887935820313,36.3046547675781],[115.927345,36.2968666816406],[115.942413359375,36.2998439765625],[115.993170195313,36.2896681953126],[116.022095976563,36.2675771308595],[116.051519804688,36.2796681953126],[116.067345,36.283843],[116.083155546875,36.2284963203125],[116.06068484375,36.2105019355469],[116.047345,36.1938430000001]]]]}},{"type":"Feature","properties":{"name":"茌平县","id":"371523"},"geometry":{"type":"MultiPolygon","coordinates":[[[[116.397345,36.6538430000001],[116.397345,36.663843],[116.410152617188,36.6588430000001],[116.397345,36.6538430000001]]],[[[116.397345,36.6538430000001],[116.404991484375,36.6356410957032],[116.401221953125,36.6188430000001],[116.4058215625,36.5983449531251],[116.391143828125,36.5386025214844],[116.397345,36.523843],[116.38170046875,36.5194863105469],[116.354713164063,36.4845204902344],[116.328311796875,36.4403774238281],[116.265797148438,36.4147914863281],[116.2476575,36.3912953925781],[116.176553984375,36.3762905097656],[116.157345,36.3838430000001],[116.12197390625,36.4084706855469],[116.11271609375,36.4212404609375],[116.1327746875,36.4385195136719],[116.12779421875,36.5004860664063],[116.102022734375,36.4984157539063],[116.091300078125,36.5108571601563],[116.094400664063,36.54940940625],[116.062345,36.5468337226562],[116.023326445313,36.5499697089844],[116.00271609375,36.5384706855469],[115.968565703125,36.5292153144531],[115.93572390625,36.5673317695313],[115.894752226563,36.592993390625],[115.913150664063,36.6088430000001],[115.901905546875,36.618529279297],[115.907345,36.673843],[115.92205203125,36.6796254707032],[115.93673953125,36.6774550605469],[115.967349882813,36.6899831367188],[115.99306765625,36.7528212714844],[116.007345,36.7638430000001],[116.0327746875,36.759204328125],[116.0319153125,36.7484963203126],[116.05271609375,36.7392153144532],[116.094757109375,36.7062917304687],[116.1466809375,36.7205031562501],[116.187345,36.7172365546875],[116.212345,36.7192446113282],[116.222345,36.7184413886719],[116.232667265625,36.7192702460938],[116.252022734375,36.6968080878907],[116.282633085938,36.6992678046876],[116.36627078125,36.6470644355469],[116.397345,36.6538430000001]]]]}},{"type":"Feature","properties":{"name":"莘县","id":"371522"},"geometry":{"type":"MultiPolygon","coordinates":[[[[115.64595828125,36.4005483222657],[115.677345,36.393843],[115.685943632813,36.3881252265626],[115.680875273438,36.3680055976563],[115.7107434375,36.3571681953126],[115.700904570313,36.3181252265626],[115.713350859375,36.3098488593751],[115.721339140625,36.287837140625],[115.727345,36.283843],[115.732984648438,36.2590041328125],[115.731724882813,36.248843],[115.733604765625,36.2337026191407],[115.718453398438,36.1977370429688],[115.667315703125,36.1337978339844],[115.660748320313,36.0810048652344],[115.681793242188,36.0262587714844],[115.67177859375,35.9722475410157],[115.647345,35.9338430000001],[115.647345,35.9238430000001],[115.581158476563,35.9200307441406],[115.554718046875,35.9014675117188],[115.502511015625,35.883676984375],[115.493531523438,35.9100307441407],[115.478043242188,35.9176552558595],[115.4894934375,35.8808998847656],[115.451158476563,35.8600307441407],[115.383531523438,35.7976552558594],[115.357345,35.783843],[115.340704375,35.787202375],[115.327345,35.793843],[115.339605742188,35.8660109687501],[115.357891875,35.89632346875],[115.350865507813,35.943843],[115.354205351563,35.9664174628907],[115.38298953125,35.9781996894532],[115.387345,35.993843],[115.431422148438,36.0064443183594],[115.44490359375,36.0232802558594],[115.440611601563,36.0577797675782],[115.470435820313,36.0986098457032],[115.477345,36.1538430000001],[115.4700403125,36.1835732246094],[115.473468046875,36.1988430000001],[115.468980742188,36.218843],[115.473565703125,36.2392897773438],[115.453873320313,36.2695290351563],[115.423204375,36.2810048652344],[115.411651640625,36.3260268378906],[115.348443632813,36.3064333320313],[115.357496367188,36.3468325019532],[115.34142703125,36.3579274726563],[115.337345,36.3838430000001],[115.380357695313,36.3903859687501],[115.452628203125,36.3791237617188],[115.488521757813,36.3596181464844],[115.502345,36.3897365546875],[115.53209109375,36.3879640937501],[115.54224734375,36.3993300605469],[115.579429960938,36.3791237617188],[115.582652617188,36.3886464667969],[115.581954375,36.400356671875],[115.612345,36.3985451484375],[115.64595828125,36.4005483222657]]]]}}]}
var liaocheng = {"type": "FeatureCollection", "features": [{"type":"Feature","properties":{"name":"临清市","id":"371581"},"geometry":{"type":"MultiPolygon","coordinates":[[[[115.767345,36.913843],[115.812345,36.9082204414063],[115.837345,36.9113307929688],[115.862345,36.9082216621094],[115.872628203125,36.9094997382813],[115.916334257813,36.892700421875],[115.957345,36.8875991035157],[115.972345,36.8894643378907],[115.997345,36.8863552070313],[116.050079375,36.892915265625],[116.057345,36.8838430000001],[116.042393828125,36.8735207343751],[116.03326296875,36.8379274726563],[116.0120715625,36.8053847480469],[116.007345,36.7638430000001],[115.99306765625,36.7528212714844],[115.967349882813,36.6899831367188],[115.93673953125,36.6774550605469],[115.92205203125,36.6796254707032],[115.907345,36.673843],[115.881793242188,36.6782900214844],[115.869342070313,36.6938356757813],[115.842144804688,36.6778481269531],[115.832896757813,36.6893959785157],[115.781793242188,36.6982900214844],[115.748546171875,36.7178322578125],[115.737345,36.703843],[115.704586210938,36.6975893378906],[115.662515898438,36.6686379218751],[115.652178984375,36.669048078125],[115.631812773438,36.6582692695313],[115.611011992188,36.6590944648438],[115.59216921875,36.6794301582031],[115.5657434375,36.6783827949219],[115.5089075,36.6392751289063],[115.447843046875,36.6606777167969],[115.437345,36.6938430000001],[115.46271609375,36.7384706855469],[115.467345,36.753843],[115.502017851563,36.7696303535157],[115.512735625,36.7680458808594],[115.533922148438,36.7808266425781],[115.552345,36.7781044746094],[115.562345,36.7795815253907],[115.576304960938,36.7775185371094],[115.63298953125,36.7981996894531],[115.65170046875,36.8094863105469],[115.68298953125,36.8181996894532],[115.698839140625,36.8751235175782],[115.73170046875,36.8994863105469],[115.767345,36.913843]]]]}}]}

// 一个维度一个度量处理函数
// chart_type_need:waterWall,cake
function one_de_one_me_handle (chart_type_need,drill) {
  $("#main").css({
      "display":"block"
  });
  
  var mycharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
  if(!mycharts){
  mycharts =  echarts.init($("#main").get(0));
  }


  var need_handle_measureName = specialRemoveDataTypeHandle(drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]))[0];
  var need_handle_dimensionalityName = specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]))[0];

  //双击下钻
  mycharts.off("dblclick");
  mycharts.on("dblclick",function(params){
  	if(params.seriesType == "map") return;
    params.event.event.stopPropagation();
    clearTimeout(timeout);
    chartAPartDidClickedFunction(params,[need_handle_dimensionalityName]);
    
  });

  //单击下钻
  mycharts.off("click");
  mycharts.on("click",function(params){
    params.event.event.stopPropagation();
    //地图
    if(params.seriesType == "map"){
    	if(params.name == "临清市"){
    		var target =  $("#view_show_wrap").get(0);
			spinner.spin(target);
			$(".maskLayer").show();
    		if(params.color != "rgba(222,222,222,1)"){
    			address_map_fun("drill");
    		}else{
				address_map_fun();
    		}
    	}
    	return;
    }


    if($("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection").css("display") == "block"){
      $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection").hide();
      return;
    }

    if($(".peterMouse").length > 1 && (Number($(".clickActive").attr("datavalue")) + 1) < $(".peterMouse").length){
      clearTimeout(timeout);
      timeout = setTimeout(function(){
        chartPerterClickedFunction(params,[need_handle_dimensionalityName],"one");
      },300)
    }
    
  })


 //   if(currentChatType == chart_type_need && dirllConditions && dirllConditions.length > 0){
 //     console.log(saveDataAndView[saveDataAndView.length - 1]["viewdata"]["row"]["dimensionality"],)
  //  need_handle_dimensionalityName = specialRemoveDataTypeHandle(saveDataAndView[saveDataAndView.length - 1]["viewdata"]["row"]["dimensionality"].concat(saveDataAndView[saveDataAndView.length - 1]["viewdata"]["column"]["dimensionality"]))[0];
  // }
  // }else if(currentChatType != chart_type_need && dirllConditions && dirllConditions.length > 0){
  //  dirllConditions = [];
  // }

  
  if(currentChatType != chart_type_need){
    if(echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0))){
      echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0)).clear();
    }
  }

  $("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area #view_show_area_content #main").find("div").eq(0).add($("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area #view_show_area_content #main").find("div").eq(0).children("canvas")).css("height","100%");
  mycharts.resize();

   // 一个维度一个度量
  function waterWall_generate_fun(){

    measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,function(data){
      if(data.length == 0){
        return;
      }
      var dimensionality_need_show = [];
      var measure_need_show = [];
      var measure_help_show =[];
      var count_help = 0;
      for(var i =0 ; i < data.length;i++){
        var aData = data[i];
        var value = aData[drag_measureCalculateStyle[need_handle_measureName]];
        dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
        measure_need_show.push({"value":value / allValueUnitDict[valueUnitValue],"originValue":value,"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]},"tongbi":aData["同比"+drag_measureCalculateStyle[need_handle_measureName]],"huanbi":aData["环比"+drag_measureCalculateStyle[need_handle_measureName]]});
        measure_help_show.push({"value":count_help / allValueUnitDict[valueUnitValue],"originValue":count_help});
        count_help += value;
      }
      dimensionality_need_show.push("全部");
      measure_need_show.push({"value":count_help / allValueUnitDict[valueUnitValue],"originValue":count_help,"dirllInfo":{"currentField":"全部","currentValue":"全部"},"tongbi":0,"huanbi":0});
      measure_help_show.push({"value":0,"originValue":0});
      var option = {
        title: [{
            text: '瀑布图',
            show:false,
        },
        {
              text: "单位: "+valueUnitValue,
              show:false,
              bottom:40,
              textStyle:{
                fontSize:14,
                color:allColorsDict[currentColorGroupName][0]
              }
            }
        ],
          legend:{
            data:[drag_measureCalculateStyle[need_handle_measureName]],
            left:"center",
            // bottom:40,
            bottom:'6%',
            width:"60%",

          },
          color:allColorsDict[currentColorGroupName],
        tooltip : {
           trigger: 'axis',
           axisPointer : {            // 坐标轴指示器，坐标轴触发有效
               type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
           },
           backgroundColor:'rgba(255,255,255,0.95)',
           extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
           formatter: function (params) {
            // console.log(params);
               var tar;
               // if (params[1].value != '-') {
               //     tar = params[1];
               // }
               // else {
               //     tar = params[0];
               // }
              if(params[1]){
                if(params[1].value != '-'){
                  tar = params[1];
                }else{
                  tar = params[0];
                }
              }else{
                return ;
              }
          var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+need_handle_dimensionalityName+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+tar.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+tar.seriesName+":</span></p>";
               var needValue = tar.value;
               if(normalUnitValue != -1){
                needValue = needValue.toFixed(normalUnitValue);
               }
               var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+tar.name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";

               var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
               var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
               var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(tar.data.tongbi)*100).toFixed(2)+"%</p>";
               var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(tar.data.huanbi)*100).toFixed(2)+"%</p>";
               if(showTongbiMeasureArray.indexOf(need_handle_measureName)!=-1){
                 leftDiv += leftTongbi;
                 rightDiv += rightTongbi;
               }
               if(showHuanbiMeasureArray.indexOf(need_handle_measureName)!=-1){
                 leftDiv += leftHuanbi;
                 rightDiv += rightHuanbi;
               }
               leftDiv += "</div>";
               rightDiv += "</div>";

               return leftDiv + rightDiv;


           }
        },
          grid: {
              containLabel: true,
              left:80,
              // bottom:120
              bottom:'18%',
          },
          toolbox: {
              show: true,
              feature: {
                  // dataView: {readOnly: true},
                  restore: {},
                  saveAsImage: {
                    title:"保存为png"
                  }
              },
              orient:"vertical",
              right:20,
              top:"middle",
              itemSize:20,
              itemGap:30
          },

          xAxis: {
            // name:need_handle_dimensionalityName,
          nameLocation:"start",
          nameGap:25,
          nameRotate:-15,
              type : 'category',
              splitLine: {show:false},
          data:dimensionality_need_show,
          axisLabel:{
            // align:"right",
            // margin:20,
            rotate:-25,
            fontSize:10,
            interval:0,
            color:"black"
             // formatter:function(value)
       //                         {
       //                             return value.split("").join("\n");
       //                         }
          },
          },
          dataZoom:[
                {
              type: 'slider',
                  show: dimensionality_need_show.length > 15,
                  filterMode:"filter",
                  backgroundColor:"#f5f5f5",
                  fillerColor:"#dedede",
                  borderColor:"#f5f5f5",
                  showDataShadow:false,
                  xAxisIndex: [0],
                  height:10,
                  handleStyle:{
                      color:"#dedede"
                  },
                  bottom:0,
                  startValue:0,
                  endValue:dimensionality_need_show.length > 15 ? 15 : null,
                  handleSize:12,
                  maxValueSpan:15,
                  throttle:100,
                  handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
                },
                {
                type: 'slider',
                  show: false,
                  filterMode:"empty",
                  yAxisIndex: [0],
                }
          ],
          yAxis: {
              type : 'value'
          },
          series: [
              {
                  name: 'help',
                  type: 'bar',
                  stack: '总量',
                  itemStyle: {
                      normal: {
                          barBorderColor: 'rgba(0,0,0,0)',
                          color: 'rgba(0,0,0,0)'
                      },
                      emphasis: {
                          barBorderColor: 'rgba(0,0,0,0)',
                          color: 'rgba(0,0,0,0)'
                      }
                  },
            data:measure_help_show
              },
              {
                  name: drag_measureCalculateStyle[need_handle_measureName],
                  type: 'bar',
                  stack: '总量',
                  label: {
                      normal: {
                          show:dimensionality_need_show.length < 25 ,
                          position: 'top',
                          formatter:function(params){
                              if(normalUnitValue != -1){
                                return params.value.toFixed(normalUnitValue);
                              }
                              return params.value;
                          }
                      }
                  },
            data:measure_need_show
              },
          ]

        };
        //清除上一个图例
        mycharts.clear();

        mycharts.setOption(option);
        spinner.stop();
        $(".maskLayer").hide();
    });
  }

  // 地图
  function address_map_fun(drillChange){
    measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,function(data){
      if(data.length == 0){
        return;
      }
      var markPointData = [];
      var measure_need_show = [];
      var addressDateMax = [];
      for (var i = 0; i < data.length;i++) {
        var aData = data[i];
        var mapIndex = i;
        if(mapIndex > 9){
        	mapIndex = i - 10;
        }

        // measure_need_show.push({"name":aData[need_handle_dimensionalityName],"value":aData[drag_measureCalculateStyle[need_handle_measureName]] / allValueUnitDict[valueUnitValue],"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]},"originValue":aData[drag_measureCalculateStyle[need_handle_measureName]],"tongbi":aData["同比"+drag_measureCalculateStyle[need_handle_measureName]],"huanbi":aData["环比"+drag_measureCalculateStyle[need_handle_measureName]]});
        addressDateMax.push(aData[drag_measureCalculateStyle[need_handle_measureName]] / allValueUnitDict[valueUnitValue]);
      	markPointData.push({"name":aData[need_handle_dimensionalityName],"coord":[Number(qingshuiIP[aData[need_handle_dimensionalityName]].split(",")[0]),Number(qingshuiIP[aData[need_handle_dimensionalityName]].split(",")[1])],"value":aData[drag_measureCalculateStyle[need_handle_measureName]] / allValueUnitDict[valueUnitValue] > 0 ? aData[drag_measureCalculateStyle[need_handle_measureName]] / allValueUnitDict[valueUnitValue] : 0,"itemStyle":{"normal":{"color":"rgba("+hex2Rgb(allColorsDict[currentColorGroupName][mapIndex])+",0.4)","borderColor":allColorsDict[currentColorGroupName][mapIndex]}}})
      }

    if(drillChange == undefined){
    	echarts.registerMap(name,liaochengMap);
    }else{
    	echarts.registerMap(name,liaocheng);
    }
    
    //清除上一个图例
    mycharts.clear();
    linoption = {
            title: [{
                text: "地图",
                left: 'center',
                show:false
            },
            {
          text: "单位: "+valueUnitValue,
          bottom:40,
          show:false,
          textStyle:{
            fontSize:14,
            color:allColorsDict[currentColorGroupName][0]
          }
      }],
	    tooltip: {
	        show: true,
	        trigger: 'item',
	        backgroundColor:'rgba(255,255,255,0.95)',
	        extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
	        formatter:function(params){
	          var needValue = params.value;
	            if(normalUnitValue != -1){
	               needValue = needValue.toFixed(normalUnitValue);
	            }
	                var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+need_handle_dimensionalityName+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
	                var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
	                var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
	                var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
	                var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
	                var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
	                if(showTongbiMeasureArray.indexOf(params.data.measureName) != -1){
	                  leftDiv += leftTongbi;
	                  rightDiv += rightTongbi;
	                }
	                if(showHuanbiMeasureArray.indexOf(params.data.measureName) != -1){
	                  leftDiv += leftHuanbi;
	                  rightDiv += rightHuanbi;
	                }
	                leftDiv+= "</div>";
	                rightDiv+= "</div>";
	                 return leftDiv + rightDiv;
	        }
	    },

            visualMap: {
                min: addressDateMax.min(),
                max: addressDateMax.max(),
                left: 'left',
                top: 'bottom',
                text: ['高', '低'], // 文本，默认为数值文本
                calculable: true,
                show:false,
                inRange:{
                  color:["#DEDEDE"],
                }
            },
            toolbox: {
            show: true,
            feature: {
                // dataView: {readOnly: true},
                restore: {},
                saveAsImage: {
                  title:"保存为png"
                }
            },
            orient:"vertical",
            right:20,
            top:"middle",
            itemSize:20,
            itemGap:30
            },
            series: [{
            	name:drag_measureCalculateStyle[need_handle_measureName],
                type: 'map',
                mapType: name,
                label: {
                    normal: {
                  		show:true,
                  		fontSize:14,
            			color:"#000"
                    },
                    emphasis: {
                        textStyle: {
                            color: '#000000'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: '#DEDEDE',
                        areaColor: '#fff',

                    },
                    emphasis: {
                        areaColor: '#DEDEDE',
                        borderWidth: 0
                    }
                },
                animation: false,

                data:[{name:"临清市",value:addressDateMax.arrSum()}],
               	"markPoint": {
		            "symbol": "circle",
		            "symbolSize":function(s){
		            	return s/addressDateMax.min()*23
		            },
		            "animation":true,
		            "label": {
		                "normal": {
		                    "show": true,
		                    formatter:function(d){
		                    	return d.name;
		                    },
		                    "color":"rgba(0,0,0,1)",
		                    "fontSize":12,
		                    // "position":"bottom",
		                },
		                "emphasis": {
		                    show: false,
		                }
		            },
		            "itemStyle": {
		                "normal": {
		                    // "color":'rgba(12, 84, 163,0.6)',
		                    // "borderColor":"rgb(96, 204, 243)",
		                    "borderWidth":1,
		                }
		            },
		            "data": markPointData
	        },

	        hoverAnimation: true,
            }],

        };

         liaooption = {

            title: [{
                text: "地图",
                left: 'center',
                show:false
            },
            {
          text: "单位: "+valueUnitValue,
          bottom:40,
          show:false,
          textStyle:{
            fontSize:14,
            color:allColorsDict[currentColorGroupName][0]
          }
      }],
            tooltip: {
	            show: true,
	            trigger: 'item',
	            backgroundColor:'rgba(255,255,255,0.95)',
	            extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
	            formatter:function(params){
	              var needValue = params.value;
	                if(normalUnitValue != -1){
	                   needValue = needValue.toFixed(normalUnitValue);
	                }
	                    var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+need_handle_dimensionalityName+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
	                    var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
	                    var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
	                    var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
	                    var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
	                    var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
	                    if(showTongbiMeasureArray.indexOf(params.data.measureName) != -1){
	                      leftDiv += leftTongbi;
	                      rightDiv += rightTongbi;
	                    }
	                    if(showHuanbiMeasureArray.indexOf(params.data.measureName) != -1){
	                      leftDiv += leftHuanbi;
	                      rightDiv += rightHuanbi;
	                    }
	                    leftDiv+= "</div>";
	                    rightDiv+= "</div>";
	                     return leftDiv + rightDiv;
	            }
            },

            visualMap: {
                min: 0,
                max: addressDateMax.max(),
                left: 'left',
                top: 'bottom',
                text: ['高', '低'], // 文本，默认为数值文本
                calculable: true,
                show:false,
                inRange:{
                  color:[allColorsDict[currentColorGroupName][9],allColorsDict[currentColorGroupName][0]],
                }
            },
            toolbox: {
            show: true,
            feature: {
                // dataView: {readOnly: true},
                restore: {},
                saveAsImage: {
                  title:"保存为png"
                }
            },
            orient:"vertical",
            right:20,
            top:"middle",
            itemSize:20,
            itemGap:30
            },
            series: [{
            	name:drag_measureCalculateStyle[need_handle_measureName],
                type: 'map',
                mapType: name,
                label: {
                    normal: {
                  		show:true,
                  		fontSize:14,
            			color:"#000"
                    },
                    emphasis: {
                        textStyle: {
                            color: '#000000'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: '#000',
                        areaColor: '#fff',

                    },
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                },
                animation: false,

                data:[{name:"临清市",value:addressDateMax.arrSum()},{name:"冠县",value:0},{name:"莘县",value:0},{name:"阳谷县",value:0},{name:"东昌府区",value:0},{name:"东阿县",value:0},{name:"茌平县",value:0},{name:"高唐县",value:0}],

	        hoverAnimation: true,
            }],

        };



    if(drillChange == undefined){
    	 mycharts.setOption(liaooption);
    }else{
    	 mycharts.setOption(linoption);
   	}
      // -------------------------
      spinner.stop();
      $(".maskLayer").hide();

    });
  }

  //  饼图
  function  cake_generate_fun () {


    measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,function(data){
      if(data.length == 0){
        return;
      }
      var dimensionality_need_show = [];
      var measure_need_show = [];
      for (var i = 0; i < data.length;i++) {
        var aData = data[i];
        dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
        measure_need_show.push({"name":aData[need_handle_dimensionalityName],"value":aData[drag_measureCalculateStyle[need_handle_measureName]] / allValueUnitDict[valueUnitValue],"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]},"originValue":aData[drag_measureCalculateStyle[need_handle_measureName]],"tongbi":aData["同比"+drag_measureCalculateStyle[need_handle_measureName]],"huanbi":aData["环比"+drag_measureCalculateStyle[need_handle_measureName]]});
      }
        var option = {
          title: [{
            text: '饼图',
            show:false,
          },
            {
              text: "单位: "+valueUnitValue,
              bottom:40,
              show:false,
              textStyle:{
                fontSize:14,
                color:allColorsDict[currentColorGroupName][0]
              }
            }
          ],
          tooltip: {
            show:true,
            trigger: 'item',
            backgroundColor:'rgba(255,255,255,0.95)',
            extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
            formatter:function (params){
              var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+need_handle_dimensionalityName+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>占比:</p>";
              var needValue = params.value;
              if(normalUnitValue != -1){
                 needValue = needValue.toFixed(normalUnitValue);
              }
             var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>"+"<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.percent+"%</p>";
             var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
             var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
             var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
             var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
             if(showTongbiMeasureArray.indexOf(need_handle_measureName)!=-1){
               leftDiv += leftTongbi;
               rightDiv += rightTongbi;
             }
             if(showHuanbiMeasureArray.indexOf(need_handle_measureName)!=-1){
               leftDiv += leftHuanbi;
               rightDiv += rightHuanbi;
             }
             leftDiv += "</div>";
             rightDiv += "</div>";
             return leftDiv + rightDiv;
            }
          },
          toolbox: {
                show: true,
                feature: {
                    // dataView: {readOnly: true},
                    restore: {},
                    saveAsImage: {
                      title:"保存为png"
                    }
                },
                orient:"vertical",
                right:20,
                top:"middle",
                itemSize:20,
                itemGap:30
            },

          legend: {
            type: 'scroll',
            left: 'center',
            // bottom:40,
            bottom:'6%',
            data: dimensionality_need_show,
            width:"60%",
          },
          color:allColorsDict[currentColorGroupName],
          series: [{
            name: drag_measureCalculateStyle[need_handle_measureName],
            type: "pie",
            radius: "65%",
            center: ["50%", "45%"],
            data: measure_need_show,
            label: {
                      normal: {
                          show: dimensionality_need_show.length < 25,
                          position:dimensionality_need_show.length < 25 ? 'outside' : 'inside',
                          formatter:function(params){
                              if(normalUnitValue != -1){
                                return params.name+":"+params.value.toFixed(normalUnitValue);
                              }else{
                                return params.name+":"+params.value;
                              }
                          },
                      }
                  },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
          };
        //清除上一个图例
        mycharts.clear();

        mycharts.setOption(option);

        spinner.stop();
        $(".maskLayer").hide();
    });

  }

  // 4、面积图
  function area_generate_fun (argument) {

    measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,function(data){
      if(data.length == 0){
        return;
      }     
      var dimensionality_need_show = [];
      var  measure_need_show = [];
      for(var i = 0;i < data.length;i++){
        var aData = data[i];
        dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
        measure_need_show.push({"value":aData[drag_measureCalculateStyle[need_handle_measureName]] / allValueUnitDict[valueUnitValue],"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]},"originValue":aData[drag_measureCalculateStyle[need_handle_measureName]],"tongbi":aData["同比"+drag_measureCalculateStyle[need_handle_measureName]],"huanbi":aData["环比"+drag_measureCalculateStyle[need_handle_measureName]]});
      }
      var option = {
        title:[{
          text:"面积图",
          show:false
        },
        {
              text: "单位: "+valueUnitValue,
              bottom:40,
              show:false,
              textStyle:{
                fontSize:14,
                color:allColorsDict[currentColorGroupName][0]
              }
            }
        ],
        tooltip:{
          trigger:"axis",
          backgroundColor:'rgba(255,255,255,0.95)',
            extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
          formatter:function(params){

              var needValue = params[0].value;
              if(normalUnitValue != -1){
                 needValue = needValue.toFixed(normalUnitValue);
              }
              var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+need_handle_dimensionalityName+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params[0].color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params[0].seriesName+":</span></p>";
            var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params[0].name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
            var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
            var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
            var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params[0].data.tongbi)*100).toFixed(2)+"%</p>";
            var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params[0].data.huanbi)*100).toFixed(2)+"%</p>";
            if(showTongbiMeasureArray.indexOf(need_handle_measureName)!=-1){
              leftDiv += leftTongbi;
              rightDiv += rightTongbi;
            }
            if(showHuanbiMeasureArray.indexOf(need_handle_measureName)!=-1){
              leftDiv += leftHuanbi;
              rightDiv += rightHuanbi;
            }
            leftDiv += "</div>";
            rightDiv += "</div>";

                   return leftDiv + rightDiv;
          }
        },
        color:allColorsDict[currentColorGroupName],
        legend:{
          data:[drag_measureCalculateStyle[need_handle_measureName]],
          left: 'center',
          // bottom:40,
          bottom:'6%',
          width:"60%",
        },
        toolbox: {
              show: true,
              feature: {
                  // dataView: {readOnly: true},
                  restore: {},
                  saveAsImage: {
                    title:"保存为png"
                  }
              },
              orient:"vertical",
              right:20,
              top:"middle",
              itemSize:20,
              itemGap:30
        },
         grid: {
              containLabel: true,
              left:80,
              // bottom:120
              bottom:'18%'
          },
        xAxis:[
          {
            // name:need_handle_dimensionalityName,
            nameLocation:"start",
            nameGap:25,
            nameRotate:-15,
            type:"category",
            boundaryGap:false,
            data:dimensionality_need_show,
            axisLabel:{
              rotate:-15,
              fontSize:10,
              interval:0,
              color:"black"
          },
          }
        ],
         dataZoom:[
                {
              type: 'slider',
                  show: dimensionality_need_show.length > 15,
                  filterMode:"filter",
                  backgroundColor:"#f5f5f5",
                  fillerColor:"#dedede",
                  borderColor:"#f5f5f5",
                  showDataShadow:false,
                  xAxisIndex: [0],
                  height:10,
                  handleStyle:{
                      color:"#dedede"
                  },
                  bottom:0,
                  startValue:0,
                  endValue:dimensionality_need_show.length > 15 ? 15 : null,
                  handleSize:12,
                  maxValueSpan:15,
                  throttle:100,
                  handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
                },
                {
                type: 'slider',
                  show: false,
                  filterMode:"empty",
                  yAxisIndex: [0],
                }
          ],
        yAxis:[
          {
            type:"value"
          }
        ],
        series:[
          {
            name:drag_measureCalculateStyle[need_handle_measureName],
            type:"line",
            smooth:"true",
            areaStyle:{
              normal:{
                opacity:0.5,
              }
            },
            label:{
              normal:{
                show:dimensionality_need_show.length < 25,
                position:"top",
                formatter:function(params){
                              if(normalUnitValue != -1){
                                return params.value.toFixed(normalUnitValue);
                              }else{
                                return params.value;
                              }
                         },
              }
            },
            data:measure_need_show
          },
        ]
      }
      //清除上一个图例
      mycharts.clear();

      mycharts.setOption(option);
      spinner.stop();
      $(".maskLayer").hide();
    });


  }

  // area_generate_fun();

  // 甘特图
 function gantt_generate_fun(){

    measure_Hanlde([need_handle_dimensionalityName],[need_handle_measureName],null,function(data){
      if(data.length == 0){
        return;
      }       
        var dimensionality_need_show = [];
        var measure_need_show = [];
        var measure_help_show =[];
        var count_help = 0;
        for(var i = 0;i < data.length;i++){
          var aData = data[i];
          var value = aData[drag_measureCalculateStyle[need_handle_measureName]];
          dimensionality_need_show.push(aData[need_handle_dimensionalityName]);
          measure_need_show.push({"value":value / allValueUnitDict[valueUnitValue],"originValue":value,"dirllInfo":{"currentField":need_handle_dimensionalityName,"currentValue":aData[need_handle_dimensionalityName]},"tongbi":aData["同比"+drag_measureCalculateStyle[need_handle_measureName]],"huanbi":aData["环比"+drag_measureCalculateStyle[need_handle_measureName]]});
          measure_help_show.push({"value":count_help/allValueUnitDict[valueUnitValue],"originValue":count_help});
          count_help += value;
        }
        measure_help_show.unshift({"value":0,"originValue":0});
        measure_need_show.unshift({"value":count_help/allValueUnitDict[valueUnitValue],"originValue":count_help,"dirllInfo":{"currentField":"全部","currentValue":"全部"},"tongbi":0,"huanbi":0});
        dimensionality_need_show.unshift("全部");
        var option = {
            title: [{
                text: '甘特图',
                show:false
            },
              {
              text: "单位: "+valueUnitValue,
              bottom:40,
              show:false,
              textStyle:{
                fontSize:14,
                color:allColorsDict[currentColorGroupName][0]
              }
            }
            ],
            legend:{
                data:[drag_measureCalculateStyle[need_handle_measureName]],
                left:"center",
                // bottom:40,
                bottom:'6%',
                width:"60%",
            },
            color:allColorsDict[currentColorGroupName],
          toolbox: {
                show: true,
                feature: {
                    // dataView: {readOnly: true},
                    restore: {},
                    saveAsImage: {
                      title:"保存为png"
                    }
                },
                orient:"vertical",
                right:20,
                top:"middle",
                itemSize:20,
                itemGap:30
            },
          tooltip : {
             trigger: 'axis',
             axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                 type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
             },
             backgroundColor:'rgba(255,255,255,0.95)',
               extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
           formatter: function (params) {
            // console.log(params);
               var tar;
               // if (params[1].value != '-') {
               //     tar = params[1];
               // }
               // else {
               //     tar = params[0];
               // }
               if(params[1]){
                if(params[1].value != '-'){
                  tar = params[1];
                }else{
                  tar = params[0];
                }
               }else{
                return ;
               }
               var needValue = tar.value;
           if(normalUnitValue != -1){
             needValue = needValue.toFixed(normalUnitValue);
          }
                var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+need_handle_dimensionalityName+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+tar.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+tar.seriesName+":</span></p>";
            var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+tar.name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";

            var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
            var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
            var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(tar.data.tongbi)*100).toFixed(2)+"%</p>";
            var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(tar.data.huanbi)*100).toFixed(2)+"%</p>";
            if(showTongbiMeasureArray.indexOf(need_handle_measureName)!=-1){
              leftDiv += leftTongbi;
              rightDiv += rightTongbi;
            }
            if(showHuanbiMeasureArray.indexOf(need_handle_measureName)!=-1){
              leftDiv += leftHuanbi;
              rightDiv += rightHuanbi;
            }
            leftDiv += "</div>";
            rightDiv += "</div>";

               return leftDiv + rightDiv;
               }
          },
            xAxis: {
               type : 'value',
               // name:need_handle_measureName,
            nameGap:10,
            nameLocation:"end",
            },
            yAxis: {
                type : 'category',
                splitLine: {show:false},
            data:dimensionality_need_show,
            axisLabel:{
              fontSize:10,
              interval:0,
              color:"black"
            },
            // name:need_handle_dimensionalityName,
            nameGap:10,
            nameLocation:"end",
            },
            grid: {
                  containLabel: true,
                  left:50,
                  // bottom:120
                  bottom:'18%'
              },
              dataZoom:[
                {
                type: 'slider',
                    show: dimensionality_need_show.length > 15,
                    filterMode:"filter",
                    backgroundColor:"#f5f5f5",
                    fillerColor:"#dedede",
                    borderColor:"#f5f5f5",
                    showDataShadow:false,
                    yAxisIndex: [0],
                    height:10,
                    handleStyle:{
                        color:"#dedede"
                    },
                    startValue:0,
                    endValue:dimensionality_need_show.length > 15 ? 15 : null,
                    orient:"horizontal",
                    // bottom:35,
                    bottom:0,
                    handleSize:12,
                    maxValueSpan:15,
                    throttle:100,
                    handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
                },
                {
                type: 'slider',
                  show: false,
                  filterMode:"empty",
                  xAxisIndex: [0],
                }
           ],
            series: [
                {
                    name: 'help',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: 'rgba(0,0,0,0)'
                        },
                        emphasis: {
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: 'rgba(0,0,0,0)'
                        }
                    },
              data:measure_help_show
                },
                {
                    name: [drag_measureCalculateStyle[need_handle_measureName]],
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: dimensionality_need_show.length < 25,
                            position: 'right',
                            formatter:function(params){
                                if(normalUnitValue != -1){
                                  return params.value.toFixed(normalUnitValue);
                                }else{
                                  return params.value;
                                }
                             },
                        }
                    },
              data:measure_need_show
                },
            ]

          };
        //清除上一个图例
          mycharts.clear();

          mycharts.setOption(option);
          spinner.stop();
          $(".maskLayer").hide();
    });

 }
 // gantt_generate_fun();



//判断传入参数不同调用不同图形

switch(chart_type_need)
{
case "waterWall":
  //调用瀑布图
  waterWall_generate_fun();
  break;
case "cake":
  //调用饼图
    cake_generate_fun();
  break;
  case "scale":
  //调用范围图
//  scale_generate_fun();
    area_generate_fun();
  break;
  case "area":
  //调用面积图
    area_generate_fun();
  break;
  case "gantt":
  //调用甘特图
    gantt_generate_fun();
    break;
  // 地图
  case "addressMap":
   if(drill == undefined){
   	 address_map_fun();
   	}else{
   	address_map_fun("drill");
   	}
    break;
default:

}
// 记录当前图形的类型
currentChatType = chart_type_need;

}




// end------------------
// 多个维度多个度量
function many_de_many_me_handle(chart_type_need){
  $("#main").css({
      "display":"block",
  });


  //释放图表实例

  var mycharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
  if(!mycharts){
    mycharts =  echarts.init($("#main").get(0));
  }

  var all_dimensionality = specialRemoveDataTypeHandle(drag_row_column_data["row"]["dimensionality"].concat(drag_row_column_data["column"]["dimensionality"]));
  var all_measure = specialRemoveDataTypeHandle(drag_row_column_data["row"]["measure"].concat(drag_row_column_data["column"]["measure"]));

  mycharts.off("dblclick");
  mycharts.on("dblclick",function(params){
    params.event.event.stopPropagation();
    clearTimeout(manytimeout);
    if(currentChatType == "radarChart"){
      if(params.componentSubType == "radar"){
        chartAPartDidClickedFunction(params,all_dimensionality);
      }
    } else{
      chartAPartDidClickedFunction(params,all_dimensionality);
    }
  });


  //单击下钻
  mycharts.off("click");
  mycharts.on("click",function(params){
    params.event.event.stopPropagation();
    if($("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection").css("display") == "block"){
      $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection").hide();
      return;
    }

    if($(".peterMouse").length > 1 && (Number($(".clickActive").attr("datavalue")) + 1) < $(".peterMouse").length){
      clearTimeout(manytimeout);
      manytimeout = setTimeout(function(){
        if(currentChatType == "radarChart"){
          if(params.componentSubType == "radar"){
            chartPerterClickedFunction(params,all_dimensionality,"many");
          }
        }else{
          
          chartPerterClickedFunction(params,all_dimensionality,"many");
        }
        
      },300)
    }
    
  })




  var commonLegend = [];
  for (var k = 0;k <  all_measure.length;k++) {
    commonLegend.push(drag_measureCalculateStyle[all_measure[k]])
  }

  // if(currentChatType == chart_type_need && dirllConditions && dirllConditions.length > 0){

  //  all_dimensionality.splice(0,all_dimensionality.length,dirllConditions[dirllConditions.length - 1].drillField);


  // }
  // }else if(currentChatType != chart_type_need && dirllConditions && dirllConditions.length > 0){
  //  dirllConditions = [];

  // }

  if(currentChatType != chart_type_need){
    if(echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0))){
      echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0)).clear();
    }
  }

  $("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area #view_show_area_content #main").find("div").eq(0).add($("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area #view_show_area_content #main").find("div").eq(0).children("canvas")).css("height","100%");
  mycharts.resize();

  var last_dimensionaity = all_dimensionality[all_dimensionality.length - 1];

  // 1、折线图
  function polyLine_generate_fun(){
      measure_Hanlde(all_dimensionality,all_measure,null,function(data){
      if(data.length == 0){
        return;
      }
        var option = {
          title:[{
          text:"折线图",
          show:false
          },

          {
              text: "单位: "+valueUnitValue,
              bottom:40,
              show:false,
              textStyle:{
                fontSize:14,
                color:allColorsDict[currentColorGroupName][0]
              }
            }
          ],
          tooltip: {

              trigger: 'axis',
                axisPointer: {
                    type: 'cross',
              },
              textStyle:{
                fontSize:12
              },
              backgroundColor:'rgba(255,255,255,0.95)',
              extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
              formatter:function(params){
            var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'>";
            var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'>";
            for(var i = 0;i < all_dimensionality.length;i++){
              var aP = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_dimensionality[i]+":</p>";
              leftDiv+=aP;
            }
                for(var i = 0;i < params.length;i++){
                  var needValue = params[i].value;
                  if(normalUnitValue != -1){
                    needValue = needValue.toFixed(normalUnitValue);
                  }
                  leftDiv += "<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params[i].color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params[i].seriesName+":</span></p>";
                  if(i == 0){
                    for(var k = 0;k < params[i].data.theDimeInfo.length;k++){
                      rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params[i].data.theDimeInfo[k]+"</p>";
                    }
                  }
                  rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
                  var leftTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params[i].color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+"同比"+":</span></p>";
                  var leftHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params[i].color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+"环比"+":</span></p>";
                  var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params[i].data.tongbi)*100).toFixed(2)+"%</p>";
                  var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params[i].data.huanbi)*100).toFixed(2)+"%</p>";
                  if(showTongbiMeasureArray.indexOf(params[i].data.measureName) != -1){
                    leftDiv += leftTongbi;
                    rightDiv += rightTongbi;
                  }
                  if(showHuanbiMeasureArray.indexOf(params[i].data.measureName) != -1){
                    leftDiv += leftHuanbi;
                    rightDiv += rightHuanbi;
                  }
                }
                // for(var i = 0;i < params.length;i++){
                //
                // }
                leftDiv+= "</div>";
                rightDiv+= "</div>";
                return leftDiv + rightDiv;
          }
             },

            legend: {
              data:commonLegend,
              left:"center",
              // bottom:40,
              bottom:'6%',
              width:"60%",
            },
            grid: [],
          color:allColorsDict[currentColorGroupName],

        toolbox: {
              show: true,
              feature: {
                  // dataView: {readOnly: true},
                  restore: {},
                  saveAsImage: {
                    title:"保存为png"
                  }
              },
              orient:"vertical",
              right:20,
              top:"middle",
              itemSize:20,
              itemGap:30
        },
             xAxis:[],
             yAxis:[
//              {
//                type:"value"
//              },
             ],
             series:[]
        };
        var measure_show_data_arr = [];
        var dimensionality_show_data_arr = [];
        var  valueMax = data[0][drag_measureCalculateStyle[all_measure[0]]];
        for(var i = 0; i < data.length;i++){

          var aData = data[i];
          var theDimeInfo = [];
          for(var k = 0;k < all_dimensionality.length;k++){
            theDimeInfo.push(aData[all_dimensionality[k]]);
          }
          for(var measure_i = 0;measure_i < all_measure.length;measure_i++){
            var aMeasure = all_measure[measure_i];
            if(valueMax < aData[drag_measureCalculateStyle[aMeasure]]){
              valueMax = aData[drag_measureCalculateStyle[aMeasure]];
            }
            if(!measure_show_data_arr[measure_i]){
              measure_show_data_arr[measure_i] = [{"value":aData[drag_measureCalculateStyle[aMeasure]]/allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[aMeasure]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"theDimeInfo":theDimeInfo,"tongbi":aData["同比"+drag_measureCalculateStyle[aMeasure]],"huanbi":aData["环比"+drag_measureCalculateStyle[aMeasure]],"measureName":aMeasure}];
            }else{
              measure_show_data_arr[measure_i].push({"value":aData[drag_measureCalculateStyle[aMeasure]]/allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[aMeasure]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"theDimeInfo":theDimeInfo,"tongbi":aData["同比"+drag_measureCalculateStyle[aMeasure]],"huanbi":aData["环比"+drag_measureCalculateStyle[aMeasure]],"measureName":aMeasure});
            }
          }
          for(var dimensionality_i = 0;dimensionality_i < all_dimensionality.length;dimensionality_i++){
            var aDimensionality = all_dimensionality[dimensionality_i];
            if(!dimensionality_show_data_arr[dimensionality_i]){
              dimensionality_show_data_arr[dimensionality_i] = [aData[aDimensionality]];
            }else{
              //dimensionality_show_data_arr[dimensionality_i].push(aData[aDimensionality]);
            
              var index = dimensionality_show_data_arr[dimensionality_i].indexOf(aData[aDimensionality]);
              if(index == -1){
                dimensionality_show_data_arr[dimensionality_i].push(aData[aDimensionality]);
              }else if(index != -1){
                //dimensionality_show_data_arr[dimensionality_i].push("YZYPD" + aData[aDimensionality]);
                // if(all_dimensionality[dimensionality_show_data_arr.length - 1] != all_dimensionality[dimensionality_i]){
                //  dimensionality_show_data_arr[dimensionality_i].push("YZYPD" + aData[aDimensionality]);
                // }else{
                //  dimensionality_show_data_arr[dimensionality_i].push(aData[aDimensionality]);
                // }
                if(all_dimensionality[dimensionality_show_data_arr.length - 1] != all_dimensionality[dimensionality_i]){
                  var lastVal = dimensionality_show_data_arr[dimensionality_i][dimensionality_show_data_arr[dimensionality_i].length-1];
                  if(/YZYPD/.test(lastVal)){
                    lastVal = lastVal.split("YZYPD")[1];
                  }
                  if(lastVal == aData[aDimensionality]){
                  // if(dimensionality_show_data[k][dimensionality_show_data[k].length-1] == aData[all_dimensionality[k]]){
                    dimensionality_show_data_arr[dimensionality_i].push("YZYPD" + aData[aDimensionality]);
                  }else{
                    dimensionality_show_data_arr[dimensionality_i].push(aData[aDimensionality]);
                  }
                }else{
                  dimensionality_show_data_arr[dimensionality_i].push(aData[aDimensionality]);
                }
              }
            }
          }
        }
        var dataZoomXindexArray = [];
        for(var i = dimensionality_show_data_arr.length - 1;i >= 0;i--){
          var obj = {
            // name:all_dimensionality[i],
            nameLocation:"start",
            nameGap:25,
            nameRotate:-15,
            type: 'category',
            boundaryGap:false,
            data:dimensionality_show_data_arr[i],
            axisLabel:{
              rotate:-15,
              fontSize:10,
              interval:0,
              color:"black",
              interval:function(index,value){return !/^YZYPD/.test(value)},
              formatter:function(value){
                if(value.length > 6){
                  value = value.substring(0,6) + '...';
                }
                return value;
              }
            },
            gridIndex:dimensionality_show_data_arr.length - 1 - i
          }
          var aGrid = {
            containLabel:true,
          }
          // aGrid["left"] = "10%";
          // aGrid["bottom"] = 100 + 40 * i;
          aGrid["bottom"] = (18 + 8* i)+'%';
          aGrid["left"] = "7%";
          if(i != dimensionality_show_data_arr.length - 1){
            aGrid["tooltip"] = {show:false};
          }
          option["grid"].push(aGrid);
          option["xAxis"].push(obj);
          option["yAxis"].push({type:"value",show:i == dimensionality_show_data_arr.length - 1,min:0,max:valueMax,gridIndex:dimensionality_show_data_arr.length - 1 - i});
          dataZoomXindexArray.push(i);
        }
        for(var i = 0; i < measure_show_data_arr.length;i++){
          var measure = measure_show_data_arr[i];
                var obj = {name:drag_measureCalculateStyle[all_measure[i]],type:"line",smooth:true,data:measure,label:{
                  normal:{
                    show:dimensionality_show_data_arr[dimensionality_show_data_arr.length - 1].length < 25 && measure_show_data_arr.length < 3,
                    position:"top",
                    offset:[10,0],
                    formatter:function(params){
                            if(normalUnitValue != -1){
                              return params.value.toFixed(normalUnitValue);
                            }else{
                              return params.value;
                            }
                      },
                  }

                }}
                option["series"].push(obj);
        }

        option["dataZoom"] = [
          {
              type: 'slider',
                  show: dimensionality_show_data_arr[dimensionality_show_data_arr.length - 1].length > 15,
                  filterMode:"filter",
                  backgroundColor:"#f5f5f5",
                  fillerColor:"#dedede",
                  borderColor:"#f5f5f5",
                  showDataShadow:false,
                  xAxisIndex: dataZoomXindexArray,
                  height:10,
                  handleStyle:{
                      color:"#dedede"
                  },
                  bottom:0,
                  // orient:"horizontal",
                  startValue:0,
                  endValue:dimensionality_show_data_arr[dimensionality_show_data_arr.length - 1].length > 15 ? 15 : null,
                  handleSize:12,
                  maxValueSpan:15,
                  throttle:100,
                  handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
                },
                {
                type: 'slider',

                  show: false,
                  filterMode:"empty",
                  yAxisIndex: [0],
                }
        ]



        //清除上一个图例
        mycharts.clear();
        // console.log(option)

        mycharts.setOption(option);
        spinner.stop();
        $(".maskLayer").hide();

      });

  }

//2、对比条形图
function comparisonStrip_generate_fun(){

      measure_Hanlde(all_dimensionality,all_measure,null,function(data){
      if(data.length == 0){
        return;
      }       
        var measure_show_data = [];
        var dimensionality_show_data = [];
        for (var i = 0;i < data.length;i++) {
          var aData = data[i];
          dimensionality_show_data.push(aData[all_dimensionality[0]]);
          for (var j = 0;j < all_measure.length;j++) {
            var aMeasure = all_measure[j];
            if(!measure_show_data[j]){
              measure_show_data[j] = [{"value":aData[drag_measureCalculateStyle[aMeasure]] / allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[aMeasure]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle[aMeasure]],"huanbi":aData["环比"+drag_measureCalculateStyle[aMeasure]],"measureName":aMeasure}];
            }else{
              measure_show_data[j].push({"value":aData[drag_measureCalculateStyle[aMeasure]] / allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[aMeasure]],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle[aMeasure]],"huanbi":aData["环比"+drag_measureCalculateStyle[aMeasure]],"measureName":aMeasure});
            }
          }
        }
        var option = {
          title: [{
            text: "对比条形图",
            show:false
          },
          {
              text: "单位: "+valueUnitValue,
              bottom:40,
              show:false,
              textStyle:{
                fontSize:14,
                color:allColorsDict[currentColorGroupName][0]
              }
            }
          ],
          legend: {
            data: commonLegend,
            left:"center",
            // bottom:40,
            bottom:'6%',
            width:"60%",
            textStyle: {
              color: '#00000',
            },
          },
          color:allColorsDict[currentColorGroupName],
          toolbox: {
                show: true,
                feature: {
                    // dataView: {readOnly: true},
                    restore: {},
                    saveAsImage: {
                      title:"保存为png"
                    }
                },
                orient:"vertical",
                right:20,
                top:"middle",
                itemSize:20,
                itemGap:30
            },
          tooltip: {
            show: true,
            trigger: 'item',
            backgroundColor:'rgba(255,255,255,0.95)',
                  extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
            formatter:function(params){
              var needValue = params.value;
                if(normalUnitValue != -1){
                   needValue = needValue.toFixed(normalUnitValue);
                }
                    var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_dimensionality[0]+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
                    var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.name+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
                    var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
                    var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
                    var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
                    var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
                    if(showTongbiMeasureArray.indexOf(params.data.measureName) != -1){
                      leftDiv += leftTongbi;
                      rightDiv += rightTongbi;
                    }
                    if(showHuanbiMeasureArray.indexOf(params.data.measureName) != -1){
                      leftDiv += leftHuanbi;
                      rightDiv += rightHuanbi;
                    }
                    leftDiv+= "</div>";
                    rightDiv+= "</div>";
                     return leftDiv + rightDiv;
            }
          },
          grid: [{
            show: false,
            left: '4%',
            top: 60,
            // bottom: 60,
            // bottom:120,
            bottom:'18%',
            containLabel: true,
            width: '46%',
          }, {
            show: false,
            left: '50.5%',
            top: 80,
            // bottom: 60,
            // bottom:120,
            bottom:'18%',
            width: '0%',
          }, {
            show: false,
            right: '4%',
            top: 60,
            // bottom: 60,
            // bottom:120,
            bottom:'18%',
            containLabel: true,
            width: '46%',
          }, ],
          xAxis: [{
            gridIndex: 0,
            type: 'value',
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: 'top',
             axisLabel: {
                 show: true,
                 textStyle: {
                     color: '#B2B2B2',
                     fontSize: 12,
                 },
             },

          }, {
            gridIndex: 1,
            show: false,
          }, {
            gridIndex: 2,
            type: 'value',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            position: 'top',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#B2B2B2',
                fontSize: 12,
              },
            },
          }, ],

          yAxis: [{
              gridIndex: 0,
              type: 'category',
              inverse: true,
              position: 'right',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false,
                margin: 8,
                textStyle: {
                  color: '#9D9EA0',
                  fontSize: 12,
                },

              },
              data: dimensionality_show_data,
            }, {
              gridIndex: 1,
              type: 'category',
              inverse: true,
              position: 'left',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#9D9EA0',
                  fontSize: 12,
                },

              },
              data: dimensionality_show_data.map(function(value) {
                return {
                  value: value,
                  textStyle: {
                    align: 'center',
                  }
                }
              }),
            }, {
              gridIndex: 2,
              type: 'category',
              inverse: true,
              position: 'left',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false,
                textStyle: {
                  color: '#9D9EA0',
                  fontSize: 12,
                },

              },
              data: dimensionality_show_data,
            },

          ],
          dataZoom:[
          {
              type: 'slider',
                  show: dimensionality_show_data.length > 15,
                  filterMode:"filter",
                  backgroundColor:"#f5f5f5",
                  fillerColor:"#dedede",
                  borderColor:"#f5f5f5",
                  showDataShadow:false,
                  yAxisIndex: [0,1,2],
                  height:10,
                  handleStyle:{
                      color:"#dedede"
                  },
                  startValue:0,
                  endValue:dimensionality_show_data.length > 15 ? 15 : null,
                  orient:"horizontal",
                // bottom:35,
                bottom:0,
                left:"4%",
                right:"4%",
                  handleSize:12,
                  maxValueSpan:15,
                  throttle:100,
                  handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
                },
                {
              type: 'slider',
                  show: false,
                  filterMode:"empty",
                  xAxisIndex: [0,1,2],
                }
              ],
          series: [{
            name: drag_measureCalculateStyle[all_measure[0]],
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            barGap: 20,
            label: {
              normal: {
                show: dimensionality_show_data.length < 25,
                position:"left",
                formatter:function(params){
                              if(normalUnitValue != -1){
                                return params.value.toFixed(normalUnitValue);
                              }else{
                                return params.value;
                              }
                         },
              },
              emphasis: {
                show: true,
                position: 'left',
                offset: [0, 0],
                textStyle: {
                  color: '#fff',
                  fontSize: 14,
                },
              },
            },
            data: measure_show_data[0],
          }, {
            name: drag_measureCalculateStyle[all_measure[1]],
            type: 'bar',
            barGap: 20,
            xAxisIndex: 2,
            yAxisIndex: 2,
            label: {
              normal: {
                show: dimensionality_show_data.length < 25,
                position:"right",
                formatter:function(params){
                              if(normalUnitValue != -1){
                                return params.value.toFixed(normalUnitValue);
                              }else{
                                return params.value;
                              }
                         },
              },
              emphasis: {
                show: true,
                position: 'right',
                offset: [0, 0],
                textStyle: {
                  color: '#fff',
                  fontSize: 14,
                },
              },
            },
            data: measure_show_data[1],
          }],
        };
        //清除上一个图例
        mycharts.clear();

        mycharts.setOption(option);

        spinner.stop();
        $(".maskLayer").hide();
      });

}







 // 3、堆积柱状图 2-3个维度，1个度量
 // type：number_bar、number_liner、percentage_bar、percentage_liner
  function stackedBar_generate_fun(bar_type){

    var  chartTile = {"number_bar":"堆积柱状图","number_liner":"堆积条形图","percentage_bar":"百分比堆积柱","percentage_liner":"百分比堆积条形"}

      measure_Hanlde(all_dimensionality,all_measure,null,function(data){
      if(data.length == 0){
        return;
      }       
        var measureName = all_measure[0];
        var needMeasureData = data;
        var dimensionality_arr= []; // 各个维度的数组,绘制图形需要使用
        var need_show_dimensionality_arr = [];
        var need_show_dime_name_arr = all_dimensionality.slice(0,all_dimensionality.length-1);
        var preChangeData = null;
        var confir_max_obj = {};
        var max = 1;
        var groupArr = [];
        var measure_Data_arr = [];
        var valueMax = 0;
        for(var i =0; i <  data.length;i++){
          var aData = data[i];
          for(var j = 0;j < all_dimensionality.length - 1;j++){
            
            if(!need_show_dimensionality_arr[j]){
              need_show_dimensionality_arr[j] = [{"value":aData[all_dimensionality[j]],"count":1}];
            }else{
              var index = need_show_dimensionality_arr[j].hasObject("value",aData[all_dimensionality[j]]);

              if( index == -1){
                need_show_dimensionality_arr[j].push({"value":aData[all_dimensionality[j]],"count":1});
              }else{
                if(j < all_dimensionality.length - 2){
                  if(need_show_dimensionality_arr[j+1].hasObject("value",aData[all_dimensionality[j+1]]) == -1){
                    need_show_dimensionality_arr[j].push(({"value":"YZYPD"+aData[all_dimensionality[j]],"count":1}));
                  }
                }else{

                  if(j != 0 && need_show_dimensionality_arr[j-1].length > need_show_dimensionality_arr[j].length){
                    need_show_dimensionality_arr[j].push(({"value":aData[all_dimensionality[j]],"count":1}));
                  }
                  
                }
              }
            }
          }

          var dime = aData[all_dimensionality[all_dimensionality.length - 2]];
          var nowdime = aData[all_dimensionality[all_dimensionality.length - 1]];
          
          if(i > 0){
            var predime = data[i-1][all_dimensionality[all_dimensionality.length - 1]];
          }
          if (!confir_max_obj[dime]){
            confir_max_obj[dime] = 1;
            groupArr.push([nowdime]);
            preChangeData = aData[all_dimensionality[0]];
            measure_Data_arr.push([{"value":aData[drag_measureCalculateStyle[all_measure[0]]],"tongbi":aData["同比"+drag_measureCalculateStyle[all_measure[0]]],"huanbi":aData["环比"+drag_measureCalculateStyle[all_measure[0]]]}]);
          }else{
            if(i > 0){
              
              if(predime != nowdime){
                
                if(preChangeData != aData[all_dimensionality[0]]){
                  groupArr.push([nowdime]);
                  measure_Data_arr.push([{"value":aData[drag_measureCalculateStyle[all_measure[0]]],"tongbi":aData["同比"+drag_measureCalculateStyle[all_measure[0]]],"huanbi":aData["环比"+drag_measureCalculateStyle[all_measure[0]]]}]);
                  preChangeData = aData[all_dimensionality[0]];
                }else{
                  confir_max_obj[dime] ++;
                  groupArr[groupArr.length - 1].push(nowdime);
                  measure_Data_arr[measure_Data_arr.length - 1].push({"value":aData[drag_measureCalculateStyle[all_measure[0]]],"tongbi":aData["同比"+drag_measureCalculateStyle[all_measure[0]]],"huanbi":aData["环比"+drag_measureCalculateStyle[all_measure[0]]]});
                  max = max > confir_max_obj[dime] ? max:confir_max_obj[dime];
                }
                

                
              }
            }
          }
        }

        var option = {
          title:[{
            text:chartTile[bar_type],
            show:false
          },
            {
              text: "单位: "+valueUnitValue,
              bottom:40,
              show:false,
              textStyle:{
                fontSize:14,
                color:allColorsDict[currentColorGroupName][0]
              }
            }
          ],
          legend:{
            data:[drag_measureCalculateStyle[measureName]],
            left:'center',
            // bottom:40,
            bottom:'6%',
            width:"60%",
          },
           grid: [],
          toolbox: {
                show: true,
                feature: {
                    // dataView: {readOnly: true},
                    restore: {},
                    saveAsImage: {
                      title:"保存为png"
                    }
                },
                orient:"vertical",
                right:20,
                top:"middle",
                itemSize:20,
                itemGap:30
            },
            color:allColorsDict[currentColorGroupName],
          tooltip : {
                  trigger: 'item',
                  backgroundColor:'rgba(255,255,255,0.95)',
                  extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
                  formatter:function(params){
                    var val = params.value;
                    if (bar_type == "percentage_liner" || bar_type == "percentage_bar") {
                      val = (Number(val) * 100).toFixed(2) + "%";

                    }else{
                      if(normalUnitValue != -1){
                    val = val.toFixed(normalUnitValue);
                 }
                    }
              var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'>";
              var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'>";
              for(var i = 0;i < all_dimensionality.length;i++){
                var aP = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_dimensionality[i]+":</p>";
                leftDiv+=aP;
              }
                leftDiv += "<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
                for(var k = 0;k < params.data.theDimeInfo.length;k++){
                  rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.data.theDimeInfo[k]+"</p>";
                }
                rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+val+"</p>";
                var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
               var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
               var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
               var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
               if(showTongbiMeasureArray.indexOf(all_measure[0]) != -1){
                 leftDiv += leftTongbi;
                 rightDiv += rightTongbi;
               }
               if(showHuanbiMeasureArray.indexOf(all_measure[0]) != -1){
                 leftDiv += leftHuanbi;
                 rightDiv += rightHuanbi;
               }
                leftDiv+= "</div>";
                rightDiv+= "</div>";
                     return leftDiv + rightDiv;
                }
            },
               xAxis:[

               ],
               yAxis:[
               ],
               series:[]
        };
      //number_liner、percentage_bar、percentage_liner
      var axisLabelSetteing =   {type:"value",gridIndex:0,nameLocation:"end",nameGap:10};
      if(bar_type == "percentage_liner" || bar_type == "percentage_bar"){
        axisLabelSetteing["min"] = 0;
        axisLabelSetteing["max"] = 1;
        axisLabelSetteing["axisLabel"] = {};
        axisLabelSetteing["axisLabel"]["formatter"] = function(value,index){
          if (value > 0) {
            return (value * 100) + "%";
          }else{
            return 0;
          }

        }
      }
      if (bar_type == "number_bar" || bar_type == "percentage_bar") {
        option["yAxis"].push(axisLabelSetteing);
      }else{
        option["xAxis"].push(axisLabelSetteing);
      }

      // 造多少行数据(几个去堆叠)
      for (var i = 0;i < max;i++) {
        var name;
        var stack;
        var seriesdata = [];
        var helpSum = 0;
        name = drag_measureCalculateStyle[measureName];
        stack = "use";
        for (var j =0;j < groupArr.length;j++) {
            var val = null;
            var tongbiVal = null;
            var huanbiVal = null;
            if(measure_Data_arr[j][i]){
              val = measure_Data_arr[j][i].value;
              tongbiVal = measure_Data_arr[j][i].tongbi;
              huanbiVal = measure_Data_arr[j][i].huanbi;
            }
            var valueSum = calculateArraySpecialFieldSum(measure_Data_arr[j],"value");
            if (bar_type == "percentage_liner" || bar_type == "percentage_bar") {
              val = (val / valueSum.toFixed(4));
            }else{
              if(valueMax < valueSum){
                valueMax = valueSum;
              }
            }
            var theDimeInfo = [];
            for(var k =0;k < all_dimensionality.length;k++){
              var index = i;
              if(j > 0){
                for(var kk = 0;kk < j;kk ++){
                  index +=  groupArr[kk].length;
                }
              }
              if(data[index]){
                theDimeInfo.push(data[index][all_dimensionality[k]]);
              }
            }
            seriesdata.push({value:val / allValueUnitDict[valueUnitValue],"originValue":val,name:groupArr[j][i],"dirllInfo":{"currentField":last_dimensionaity,"currentValue":groupArr[j][i]},"theDimeInfo":theDimeInfo,"tongbi":tongbiVal,"huanbi":huanbiVal});
        }

        var obj = {
          name:name,
          type:"bar",
          stack:stack,
          xAxisIndex:0,
          yAxisIndex:0,
          itemStyle:{
            normal:{
              color:allColorsDict[currentColorGroupName][i % allColorsDict[currentColorGroupName].length]
            }
          },
          label:{
            normal:{
              show:false,
              position:"insideRight",
              formatter:function(params){
                              if(normalUnitValue != -1){
                                return params.value.toFixed(normalUnitValue);
                              }else{
                                return params.value;
                              }
                       },
            }
          },
          "data":seriesdata,
          z:3
        }
        option["series"].push(obj);
      }

//  坐标轴设置值
      for (var k = need_show_dimensionality_arr.length - 1;k >= 0;k--){

        var obj = {
          // name:need_show_dime_name_arr[k],
          // nameLocation:"start",
          // nameLocation:"end",
          nameGap:15,
          // nameRotate:-25,
          nameRotate:15,
          type: 'category',
          axisTick:{
            inside:false,
            interval:function(index,value){return !/^YZYPD/.test(value)}
          },
          axisLabel:{
            color:"black",
            rotate:25,
            fontSize:10,
            interval:function(index,value){return !/^YZYPD/.test(value)},
            formatter:function(value){
              if(value.length > 6){
                value = value.substring(0,6) + '...';
              }
              return value;
            }
          },
          data:need_show_dimensionality_arr[k],
          gridIndex:need_show_dimensionality_arr.length - 1 - k,
        }

        var aGrid = {
          show:false,
          containLabel:true,
        }

        if (bar_type == "number_bar" || bar_type == "percentage_bar") {
          obj["nameLocation"] = "start";
          obj["position"] = "bottom";
          option["xAxis"].push(obj);
          if(k > 0){
            var valueHelpAxis = {type:"value",show:false,min:0,gridIndex:need_show_dimensionality_arr.length  - k};
            if(bar_type == "percentage_bar"){
              valueMax = 1;
                valueHelpAxis["axisLabel"] = {"formatter":function(value,index){
                  if (value > 0) {
                      return (value * 100) + "%";
                    }else{
                      return 0;
                    }

                  }}
            }
            valueHelpAxis["max"] = valueMax;
            option["yAxis"].push(valueHelpAxis);


            var aSeriesData = {
              name:"help",
              type:"bar",
              xAxisIndex:k,
              yAxisIndex:k,
              "data":[{"value":valueMax / allValueUnitDict[valueUnitValue],"originValue":valueMax}],
              itemStyle:{
                normal:{
                  opacity:0
                }
              },
              cursor:"default"
            }
            option["series"].push(aSeriesData);

          }
          // aGrid["left"] = "10%";
          // aGrid["bottom"] = 60 + 40*k;
          aGrid["left"] = "5%";
          aGrid["bottom"] = (18 + 8 * k) + '%';
          // aGrid["bottom"] = 120 + 40 * k;


        }else{
          obj["nameLocation"] = "end";
          obj["position"] = "left";
          option["yAxis"].push(obj);
          if(k > 0){
            var valueHelpAxis = {type:"value",show:false,min:0,gridIndex:need_show_dimensionality_arr.length  - k};
            if(bar_type == "percentage_bar"){
              valueMax = 1;
                valueHelpAxis["axisLabel"] = {"formatter":function(value,index){
                  if (value > 0) {
                      return (value * 100) + "%";
                    }else{
                      return 0;
                    }

                  }}
            }
            valueHelpAxis["max"] = valueMax;
            option["xAxis"].push(valueHelpAxis);
            var aSeriesData = {
              name:"help",
              type:"bar",
              xAxisIndex:k,
              yAxisIndex:k,
              "barCategoryGap":5,
              "data":[{"value":valueMax / allValueUnitDict[valueUnitValue],"originValue":valueMax}],
              itemStyle:{
                normal:{
                  opacity:0
                }
              },
              cursor:"default"
            }
            option["series"].push(aSeriesData);
          }
          aGrid["containLabel"] = false;
          // aGrid["left"] =  60 + 70*k;
          // aGrid["left"] =  170 + 70*k;
          // aGrid["bottom"] = 60;

          aGrid["left"] =  120 + 80*k;
          aGrid["bottom"] = '18%';
          // aGrid["bottom"] = 120;

        }
        if(k != need_show_dimensionality_arr.length - 1){
          aGrid["tooltip"] = {show:false}
        }
        option["grid"].push(aGrid);
      }

        var dataZoomXindexArray = [];
        var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
        for(var k = 0; k < dimension_length -1;k++){
          dataZoomXindexArray.push(k);
        }
      if (bar_type == "number_bar" || bar_type == "percentage_bar"){

        option["dataZoom"] = [
          {
              type: 'slider',
                  show: need_show_dimensionality_arr[need_show_dimensionality_arr.length - 1].length >15,
                  filterMode:"filter",
                  backgroundColor:"#f5f5f5",
                  fillerColor:"#dedede",
                  borderColor:"#f5f5f5",
                  showDataShadow:false,
                  xAxisIndex: dataZoomXindexArray,
                  height:10,
                  bottom:0,
                  handleStyle:{
                      color:"#dedede"
                  },
                  startValue:0,
                  endValue:need_show_dimensionality_arr[need_show_dimensionality_arr.length - 1].length >15 ? 15 : null,
            handleSize:12,
                  maxValueSpan:15,
                  throttle:100,
                  handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
                },
                {
                type: 'slider',
                  show: false,
                  filterMode:"empty",
                  yAxisIndex: dataZoomXindexArray,
                }
        ]
      }else{
        option["dataZoom"] = [
          {
              type: 'slider',
                  show: need_show_dimensionality_arr[need_show_dimensionality_arr.length - 1].length >15,
                  filterMode:"filter",
                  backgroundColor:"#f5f5f5",
                  fillerColor:"#dedede",
                  borderColor:"#f5f5f5",
                  showDataShadow:false,
                  yAxisIndex: dataZoomXindexArray,
                  height:10,
                  handleStyle:{
                      color:"#dedede"
                  },
                  startValue:0,
                  endValue:need_show_dimensionality_arr[need_show_dimensionality_arr.length - 1].length >15 ? 15 : null,
                  orient:"horizontal",
                // bottom:25,
                bottom:0,
                  handleSize:12,
                  maxValueSpan:15,
                  throttle:100,
                  handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
                },
                {
                type: 'slider',
                  show: false,
                  filterMode:"empty",
                  xAxisIndex: dataZoomXindexArray,
                }
        ]
      }

        //清除上一个图例

        mycharts.clear();
        mycharts.setOption(option);
        spinner.stop();
        $(".maskLayer").hide();

      });


 }


// 关系图
  function reliationTree_generate_fun(){

    var categorys = [];// 分类，主要用作图例
    var need_all_nodes = []; // 所需要的所有节点
    var need_all_link = [];
    var count = 0;
    var theDimeInfo = [];
    var arr = [];
    for(var i =0;i < all_dimensionality.length;i++){
      (function(index){
        var need_dimensionality = all_dimensionality.slice(0,index+1);
        measure_Hanlde(need_dimensionality,all_measure,null,function(data){
          if(data.length == 0){
            return;
          }
          for(var j = 0;j < data.length;j++){
            // console.log(data.length);
            // var theDimeInfo = [];
            var aData = data[j];
            var name = "";
            var str = "";
            for(var k =0;k < need_dimensionality.length;k++){
              name += aData[need_dimensionality[k]] +"_YZYPD_";
              // console.log(name);
            }

            if(arr[arr.length-1] != name){
              arr.push(name);
              for(var l=0;l<arr.length;l++){
                str = arr[l];
              }
            }


            if(categorys.hasObject("name",aData[need_dimensionality[0]]) == -1){
              categorys.push({"name":aData[need_dimensionality[0]]});
            }
            if(index == all_dimensionality.length - 1){

              for(var m = 1;m < all_dimensionality.length;m++){
                var source = "";
                var target = "";
                for(var n = 0; n < m;n++){
                  source+= aData[all_dimensionality[n]] +"_YZYPD_";
                }

                for(var n = 0;n <= m;n++){
                  target+= aData[all_dimensionality[n]] +"_YZYPD_";
                }
                var obj = {"source":source,"target":target};
                need_all_link.push(obj);
              }

            }
            // theDimeInfo.push(aData[all_dimensionality[index]]);
            var aNode = {
              "value":aData[drag_measureCalculateStyle[all_measure[0]]]/allValueUnitDict[valueUnitValue],
              "originValue":aData[drag_measureCalculateStyle[all_measure[0]]],
              // "name":name,
              "name":str,
              "fixed":false,
              "draggable":true,
              "category":categorys.hasObject("name",aData[need_dimensionality[0]]),
              // "itemStyle":{
           //                  normal:{
           //                   //根节点不同色，子节点同色   根节点同色，子节点不同色
           //                   //color:allColorsDict[currentColorGroupName][categorys.length]
           //                   //每部分3种颜色
           //                   color:allColorsDict[currentColorGroupName][index]
           //                  }
           //              },
              "dirllInfo":{"currentField":all_dimensionality[index],"currentValue":aData[all_dimensionality[index]]},
              "tongbi":aData["同比"+drag_measureCalculateStyle[all_measure[0]]],
              "huanbi":aData["环比"+drag_measureCalculateStyle[all_measure[0]]],
              "viewtype":"relational",
              label:{
                normal:
                {
                  show:need_dimensionality.length < 25,
                  formatter:function(params){
                    var names = params["name"].split("_YZYPD_");
                    // console.log(names);
                    var needValue = params.value;
                      if(normalUnitValue != -1){
                        needValue = needValue.toFixed(normalUnitValue);
                      }
                    return names[names.length - 2]+":"+needValue;
                  }
                }
              }

            }
            // console.log(aNode);
            // need_all_nodes.push(aNode);
            if(aNode["name"] != ''){
              need_all_nodes.push(aNode);
            }
          }
          count++;
          if(count == all_dimensionality.length){
             draw();
          }
        },"graph");
      })(i);
    }

    function draw(){
      var option = {
        title:[{
          text:"关系图",
          show:false,
        },
          {
              text: "单位: "+valueUnitValue,
              bottom:40,
              show:false,
              textStyle:{
                fontSize:14,
                color:allColorsDict[currentColorGroupName][0]
              }
            }
        ],
        legend:[{
          data:categorys,
          left:"center",
          // bottom:40,
          bottom:'6%',
          type:'scroll',
          width:"60%",
        }],
        toolbox: {
              show: true,
              feature: {
                  // dataView: {readOnly: true},
                  restore: {},
                  saveAsImage: {
                    title:"保存为png"
                  }
              },
              orient:"vertical",
              right:20,
              top:"middle",
              itemSize:20,
              itemGap:30
        },
        color:allColorsDict[currentColorGroupName],
        tooltip:{
          backgroundColor:'rgba(255,255,255,0.95)',
              extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
          formatter:function(params){
            if(params["dataType"] == "edge"){
//              var name = params["name"];
//              var nameArr = name.split(" > ");
//              var ori = nameArr[0].split("_YZYPD_");
//              var target = nameArr[1].split("_YZYPD_");
//              return ori[ori.length - 2] + " > "+ target[target.length - 2];
            }else{
              var needValue = params.value;
              if(normalUnitValue != -1){
                 needValue = needValue.toFixed(normalUnitValue);
                }
              var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'><p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+params.data.dirllInfo.currentField+":</p><p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";

              var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.data.dirllInfo.currentValue+"</p><p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";

              var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
              var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
              var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
              var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
              if(showTongbiMeasureArray.indexOf(all_measure[0]) != -1){
                leftDiv += leftTongbi;
                rightDiv += rightTongbi;
              }
              if(showHuanbiMeasureArray.indexOf(all_measure[0]) != -1){
                leftDiv += leftHuanbi;
                rightDiv += rightHuanbi;
              }
              leftDiv+= "</div>";
              rightDiv+= "</div>";

              return leftDiv + rightDiv;

            }

          },
          textStyle:{
            fontSize:12
          }
        },

        series:[
          {
            name:drag_measureCalculateStyle[all_measure[0]],
            type:"graph",
            layout:"force",
            data:need_all_nodes,
            roam:true,
            links:need_all_link,
            categories:categorys,
            force:{
              repulsion: 100,
            },
            symbolSize:function(value,params){
              // console.log(params);
              var names = params["name"].split("_YZYPD_");
              var rs = names[names.length - 2]+":"+params.value;
              return [rs.visualLength(12)+15,20]
            },
          }
        ]
      }
      mycharts.clear();
      mycharts.setOption(option);
      spinner.stop();
      $(".maskLayer").hide();
    }
  }

// 柱状图
  function histogram_generate_fun(){

    measure_Hanlde(all_dimensionality,all_measure,null,function(data){
      if(data.length == 0){
        return;
      }
      var series = [];
      var dimensionality_show_data = [];
      var needXais = [];
      var gridArr = [];
      var needYais = [{
              show:true,
              type: "value",
              //name: commonLegend.join("/"),
              nameLocation:"middle",
              nameGap:60,
              gridIndex:0,
              z:1

          }];
       var valueMax = 0;
      for(var i = 0;i < data.length;i++){
        var aData = data[i];
        var theDimeInfo = [];
        for(var k = 0;k < all_dimensionality.length;k++){
          theDimeInfo.push(aData[all_dimensionality[k]]);
        }
        for(var j = 0;j < all_measure.length;j++){ // 计算出series
          if(valueMax < aData[drag_measureCalculateStyle[all_measure[j]]]){
            valueMax = aData[drag_measureCalculateStyle[all_measure[j]]];
          }
          if(!series[j]){
            series[j] = {
              "name":drag_measureCalculateStyle[all_measure[j]],
              "type":"bar",
              "xAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
              "yAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
              "data":[{"value":aData[drag_measureCalculateStyle[all_measure[j]]] / allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[all_measure[j]]],"theDimeInfo":theDimeInfo,"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle[all_measure[j]]],
              "huanbi":aData["环比"+drag_measureCalculateStyle[all_measure[j]]],"measureName":all_measure[j]}],
              label:{
                normal:{
                  show:all_dimensionality.length < 25 && all_measure.length < 3,
                  position:"top",
                  formatter:function(params){
                                if(normalUnitValue != -1){
                                  return params.value.toFixed(normalUnitValue);
                                }else{
                                  // if(params.value > 9999){
                                  //  return params.value/10000 + "万";
                                  // }
                                  return params.value;

                                }

                            },
                }
              },
              z:3
            };
          }else{
            series[j]["data"].push({"value":aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[all_measure[j]]],"theDimeInfo":theDimeInfo,"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle[all_measure[j]]],
            "huanbi":aData["环比"+drag_measureCalculateStyle[all_measure[j]]],"measureName":all_measure[j]});
          }
        }
        var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
        for(var k = 0;k < dimension_length;k++){
          if(!dimensionality_show_data[k]){
            dimensionality_show_data[k] = [aData[all_dimensionality[k]]];
          }else{
            var index = dimensionality_show_data[k].indexOf(aData[all_dimensionality[k]]);
            if(index == -1){
              dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
            }else if(index != -1){
              // dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
              //dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
              // if(all_dimensionality[dimensionality_show_data.length - 1] != all_dimensionality[k]){
              //  dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
              // }else{
              //  dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
              // }
              if(all_dimensionality[dimensionality_show_data.length - 1] != all_dimensionality[k]){
                var lastVal = dimensionality_show_data[k][dimensionality_show_data[k].length-1];
                if(/YZYPD/.test(lastVal)){
                  lastVal = lastVal.split("YZYPD")[1];
                }
                if(lastVal == aData[all_dimensionality[k]]){
                // if(dimensionality_show_data[k][dimensionality_show_data[k].length-1] == aData[all_dimensionality[k]]){
                  dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
                }else{
                  dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
                }
              }else{
                dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
              }
            }
          }
        }
      }

      for(var i = 0;i < dimensionality_show_data.length;i++){
        var aX = {
          "show":true,
          // "name":all_dimensionality[i],
          "nameGap":15,
          "nameLocation":"start",
          // "nameLocation":"end",
          "nameRotate":15,
          "type":"category",

          axisTick:{
            inside:false,
            interval:function(index,value){return !/^YZYPD/.test(value)}
          },
          axisLabel:{
            color:"black",
            rotate:25,
            // rotate:45,
            fontSize:10,
            interval:function(index,value){return !/^YZYPD/.test(value)},
            formatter:function(value){
              if(value.length > 6){
                value = value.substring(0,6) + '...';
              }
              if(value == 'undefi...'){
                return '';
              }else{
                return value;
              }
            }
          },
          position:"bottom",
          "data":dimensionality_show_data[i],
          gridIndex:dimensionality_show_data.length - i - 1
        }
        var aGrid = {
          containLabel:true,
        }
        aGrid["left"] = "8%";
        // aGrid["bottom"] = 120 + 45*(dimensionality_show_data.length - 1 - i);
        aGrid["bottom"] = (18 + 9 * (dimensionality_show_data.length - 1 - i)) + '%';
        if(i >0){
          aGrid["tooltip"] = {show:false}
          var obj = {
                show:false,
                type: "value",
                gridIndex:i,
                axisLine:{
                    lineStyle:{
                      color:'#fff'
                  }
                },
                min:0,
                max:valueMax,
                splitLine:{
                    show:false
                 },
          }
          needYais.unshift(obj);
          var aSeriesData = {
            name:"help",
            type:"bar",
            xAxisIndex:i -1,
            yAxisIndex:i -1,
            "data":[{"value":valueMax/allValueUnitDict[valueUnitValue],"originValue":valueMax}],
            itemStyle:{
              normal:{
                opacity:0
              }
            },
            cursor:"default"
          }
          series.push(aSeriesData);
        }
        gridArr.push(aGrid);
        needXais.push(aX);
      }

      var dataZoomXindexArray = [];
      var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
      for(var k = dimension_length - 1; k >= 0;k--){
        dataZoomXindexArray.push(k);
      }

      var option = {
          title: [{
              text: "柱状图",
              show:false
          },
            {
              text: "单位: "+valueUnitValue,
              bottom:40,
              show:false,
              textStyle:{
                fontSize:14,
                color:allColorsDict[currentColorGroupName][0]
              }
            }
          ],
          tooltip: {
              trigger: 'item',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              backgroundColor:'rgba(255,255,255,0.95)',
              extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
              formatter:function(params){
                  var needValue = params.value;
                  if(normalUnitValue != -1){
                     needValue = needValue.toFixed(normalUnitValue);
                  }
                  var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'>";
                  var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'>";
                  for(var i = 0;i < all_dimensionality.length;i++){
                    var aP = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_dimensionality[i]+":</p>";
                    leftDiv+=aP;
                  }
                  leftDiv+="<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
                  for(var k = 0;k < params.data.theDimeInfo.length;k++){
                     rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.data.theDimeInfo[k]+"</p>";
                  }
                  rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
                  var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
                  var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
                  var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
                  var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
                  if(showTongbiMeasureArray.indexOf(params.data.measureName) != -1){
                    leftDiv += leftTongbi;
                    rightDiv += rightTongbi;
                  }
                  if(showHuanbiMeasureArray.indexOf(params.data.measureName) != -1){
                    leftDiv += leftHuanbi;
                    rightDiv += rightHuanbi;
                  }
                  leftDiv+= "</div>";
                  rightDiv+= "</div>";
                 return leftDiv+rightDiv;
              },
              textStyle:{
                  fontSize:12
              }
          },
         legend: {
              data: commonLegend,
          left:"center",
          // bottom:40,
          bottom:'6%',
          width:"60%",
          },
            color:allColorsDict[currentColorGroupName],
          dataZoom:[
                {
              type: 'slider',
                  show: dimensionality_show_data[dimensionality_show_data.length - 1].length >15,
                  filterMode:"filter",
                  backgroundColor:"#f5f5f5",
                  fillerColor:"#dedede",
                  borderColor:"#f5f5f5",
                  showDataShadow:false,
                  xAxisIndex: dataZoomXindexArray,
                  height:10,
                  handleStyle:{
                      color:"#dedede"
                  },
                  bottom:0,
                  startValue:0,
                  endValue:dimensionality_show_data[dimensionality_show_data.length - 1].length >15 ? 15 : null,
                  handleSize:12,
                  maxValueSpan:15,
                  throttle:100,
                  handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
                },
                {
                type: 'slider',
                  show: false,
                  filterMode:"empty",
                  yAxisIndex:dataZoomXindexArray,
                }
          ],
        toolbox: {
              show: true,
              feature: {
                  // dataView: {readOnly: true},
                  restore: {},
                  saveAsImage: {
                    title:"保存为png"
                  }
              },
              orient:"vertical",
              right:20,
              top:"middle",
              itemSize:20,
              itemGap:30
        },
          grid:gridArr,
          xAxis: needXais,
          yAxis:needYais,
          series:series
      };

      mycharts.clear();
      mycharts.setOption(option);

      spinner.stop();
      $(".maskLayer").hide();

    });
  }

  // // 条形图
  // function barChart_generate_fun(){
  //  measure_Hanlde(all_dimensionality,all_measure,null,function(data){
  //    var series = [];
  //    var dimensionality_show_data = [];
  //    var needYais = [];
  //    var needXais = [
  //      {
  //          show:true,
  //            type: "value",
  //        gridIndex:all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
  //        // name: commonLegend.join("\n"),
  //            nameLocation:"end",
  //            nameGap:10,
  //            // offset:maxLength * 5,
  //        }
  //    ];
  //    var gridArr = [];
  //    var valueMax = 0;

  //    for(var i = 0;i < data.length;i++){
  //      var aData = data[i];
  //      var theDimeInfo = [];
  //      var theDimeData = [];
  //      for(var k = 0;k < all_dimensionality.length;k++){
  //        theDimeInfo.push(aData[all_dimensionality[k]]);
  //        // console.log(typeof(String(aData[all_dimensionality[k]])),String(aData[all_dimensionality[k]]))

  //      }
  //      for(var j = 0;j < all_measure.length;j++){ // 计算出series
  //        if(valueMax < aData[drag_measureCalculateStyle[all_measure[j]]]){
  //          valueMax = aData[drag_measureCalculateStyle[all_measure[j]]];
  //        }
  //        if(!series[j]){
  //          series[j] = {
  //            "name":drag_measureCalculateStyle[all_measure[j]],
  //            "type":"bar",
  //            "yAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
  //            "xAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
  //            "data":[{"value":aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[all_measure[j]]],"theDimeInfo":theDimeInfo,"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle[all_measure[j]]],"huanbi":aData["环比"+drag_measureCalculateStyle[all_measure[j]]],"measureName":all_measure[j]}],
  //            z:3,
  //            label:{
  //              normal:{
  //                show:dimensionality_show_data.length < 25 && all_measure.length < 3,
  //                position:"right",
  //                formatter:function(params){
  //                              if(normalUnitValue != -1){
  //                                return params.value.toFixed(normalUnitValue);
  //                              }else{
  //                                // console.log(params.name);
  //                                // console.log(params.value);
  //                                return params.value;
  //                              }
           

  //                           },
  //              }
  //            },
  //          };
  //        }else{
  //          series[j]["data"].push({"value":aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[all_measure[j]]],"theDimeInfo":theDimeInfo,"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle[all_measure[j]]],
  //          "huanbi":aData["环比"+drag_measureCalculateStyle[all_measure[j]]],"measureName":all_measure[j]});
  //        }
  //      }

  //      var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
  //      for(var k = 0;k < dimension_length;k++){
  //        if(!dimensionality_show_data[k]){       
  //          dimensionality_show_data[k] = [aData[all_dimensionality[k]]];
  //        }else{
  //          //dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
  //          var index = dimensionality_show_data[k].indexOf(aData[all_dimensionality[k]]);
  //          if(index == -1){
  //            dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
  //          }else if(index != -1){
  //            if(all_dimensionality[dimensionality_show_data.length - 1] != all_dimensionality[k]){
  //              var lastVal = dimensionality_show_data[k][dimensionality_show_data[k].length-1];
  //              if(/YZYPD/.test(lastVal)){
  //                lastVal = lastVal.split("YZYPD")[1];
  //              }
  //              if(lastVal == aData[all_dimensionality[k]]){
  //              // if(dimensionality_show_data[k][dimensionality_show_data[k].length-1] == aData[all_dimensionality[k]]){
  //                dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
  //              }else{
  //                dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
  //              }
  //            }else{
  //              dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
  //            }
  //          }

  //        }
  //      }
  //    }



  //    for(var i = 0;i < dimensionality_show_data.length;i++){
  //      //var arr = [];
  //      // for(var j = 0;j < dimensionality_show_data[i].length; j ++){
  //      //  // arr.push(dimensionality_show_data[i][j].length);
  //      //  var dataLen = dimensionality_show_data[i][j];
  //      //  if(dataLen){
  //      //    if(/YZYPD/.test(dataLen)){
  //      //      dataLen = dataLen.split("YZYPD")[1];
  //      //    }
  //      //    //arr.push(dataLen.length);
  //      //  }
  //      //  console.log(dataLen,dataLen.length);
  //      // }
  //      //var maxLength = Math.max.apply(null, arr);

        
  //      var aY = {
  //        "show":true,
  //        "name":all_dimensionality[i],
  //        "nameGap":10,
  //        "nameRotate":15,
  //        "nameLocation":"end",
  //        "type":"category",
  //        // "position":"left",
  //        // "offset":maxLength,
  //        //"boundaryGap": ['20%', '20%'],

  //        axisTick:{
  //          inside:false,
  //          interval:function(index,value){return !/^YZYPD/.test(value)}
  //        },
  //        axisLabel:{
  //          color:"black",
  //          rotate:15,
  //          fontSize:10,
  //          interval:function(index,value){return !/^YZYPD/.test(value)},
 //                 formatter:function(value){
 //                   //console.log(value);
 //                   if(value.length > 3){
  //              value = value.substring(0,3) + '...';
  //            }
  //            return value;

  //            //console.log(value);
 //                 }

  //        },
  //        "data":dimensionality_show_data[i],
  //        gridIndex:i
  //      }
  //      needYais.push(aY);

  //      var aGrid = {
  //        containLabel:false,
  //        show:false,
  //      }
  //      aGrid["left"] = 80 + i * (60 + i);
  //      // if(maxLength > 0){
  //      //  aGrid["left"] = 80 + (maxLength * 5) + i * (maxLength * 5 + 60);
  //      // }else{
  //      //  aGrid["left"] = 100 + i * (60 + i);
  //      // }

  //      // aGrid["bottom"] = 60;
  //      aGrid["bottom"] = 120;


  //      if(i != dimensionality_show_data.length - 1){
  //        aGrid["tooltip"] = {show:false}
  //      }
  //      if(i > 0){
  //        var obj = {
  //            show:false,
  //              type: "value",
  //              gridIndex:dimensionality_show_data.length - 1 - i,
  //              min:0,
  //              max:valueMax,
  //        }
  //        needXais.unshift(obj);

  //        var aSeriesData = {
  //          name:"help",
  //          type:"bar",
  //          xAxisIndex:i-1,
  //          yAxisIndex:i-1,
  //          "data":[{"value":valueMax/valueUnitValue,"originValue":valueMax}],
  //          itemStyle:{
  //            normal:{
  //              opacity:0
  //            }
  //          },
  //          cursor:"default"
  //        }
  //        series.push(aSeriesData);
  //      }

  //      gridArr.push(aGrid);

  //    }
  //    var dataZoomXindexArray = [];
  //    var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
  //    for(var k = dimension_length - 1; k >= 0;k--){
  //      dataZoomXindexArray.push(k);
  //    }
  //    var option = {
  //        title: [{
  //            text: "条形图",
  //            show:false
  //        },
  //          {
  //            text: "单位: "+valueUnitValue,
  //            bottom:40,
  //            // bottom:0,
  //            show:false,
  //            textStyle:{
  //              fontSize:14,
  //              color:allColorsDict[currentColorGroupName][0]
  //            }
  //          }
  //        ],
  //        tooltip: {
  //            trigger: 'item',
  //            axisPointer: { // 坐标轴指示器，坐标轴触发有效
  //                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
  //            },
  //           backgroundColor:'rgba(255,255,255,0.95)',
  //             extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
  //           formatter:function(params){
  //                var needValue = params.value;
  //                if(normalUnitValue != -1){
  //                   needValue = needValue.toFixed(normalUnitValue);
  //                }
  //                var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'>";
  //                var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'>";
  //                for(var i = 0;i < all_dimensionality.length;i++){
  //                  var aP = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_dimensionality[i]+":</p>";
  //                  leftDiv+=aP;
  //                }
  //                leftDiv+="<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
  //                for(var k = 0;k < params.data.theDimeInfo.length;k++){
  //                    rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.data.theDimeInfo[k]+"</p>";
  //                 }
 //                  rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
  //                var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
  //                 var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
  //                 var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
  //                 var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
  //                 if(showTongbiMeasureArray.indexOf(params.data.measureName) != -1){
  //                   leftDiv += leftTongbi;
  //                   rightDiv += rightTongbi;
  //                 }
  //                 if(showHuanbiMeasureArray.indexOf(params.data.measureName) != -1){
  //                   leftDiv += leftHuanbi;
  //                   rightDiv += rightHuanbi;
  //                 }
  //                 leftDiv+= "</div>";
  //                 rightDiv+= "</div>";
  //                  return leftDiv+rightDiv;
  //            },
  //            textStyle:{
  //                fontSize:12
  //            }
  //        },
  //        legend: {
  //            data: commonLegend,
  //            left:"center",
  //            // bottom:0,
  //            bottom:40,
  //            width:"60%",
  //        },
  //          color:allColorsDict[currentColorGroupName],
  //      toolbox: {
  //            show: true,
  //            feature: {
  //                // dataView: {readOnly: true},
  //                restore: {},
  //                saveAsImage: {
  //                  title:"保存为png"
  //                }
  //            },
  //            orient:"vertical",
  //            right:20,
  //            top:"middle",
  //            itemSize:20,
  //            itemGap:30
  //      },
  //        dataZoom:[
  //              {
  //              type: 'slider',
  //                    show: dimensionality_show_data[dimensionality_show_data.length - 1].length > 15,
  //                    filterMode:"filter",
  //                    // backgroundColor:"#dedede",
  //                    // fillerColor:"#ff7e00",
  //                    backgroundColor:"#f5f5f5",
  //                    filterColor:"#dedede",
  //                    showDataShadow:false,
  //                  yAxisIndex: dataZoomXindexArray,
  //                  height:10,
  //                  borderColor:"#f5f5f5",
  //                  handleStyle:{
  //                      // color:"#ff7e00"
  //                      color:"#dedede"
  //                  },
  //                  startValue:0,
  //                  endValue: dimensionality_show_data[dimensionality_show_data.length - 1].length > 15 ? 15:null,
  //                  orient:"horizontal",
  //                  // bottom:25,
  //                  bottom:0,
  //                  handleSize:12,
  //                  maxValueSpan:15,
  //                  throttle:100,
  //                  handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
  //              },
  //              {
  //              type: 'slider',
  //                    show: false,
  //                    filterMode:"empty",
  //                  xAxisIndex: dataZoomXindexArray,
  //              }
  //        ],
  //        grid: gridArr,
  //        yAxis: needYais,
  //        xAxis:needXais,
  //        series:series
  //    };

  //      //清除上一个图形的图例
  //      mycharts.clear();


  //      //使用刚指定的配置项和数据显示图标
  //      mycharts.setOption(option);
  //      spinner.stop();
  //      $(".maskLayer").hide();
  //  });
  // }


  // 条形图
  function barChart_generate_fun(){
    measure_Hanlde(all_dimensionality,all_measure,null,function(data){
      if(data.length == 0){
        return;
      }
      var series = [];
      var dimensionality_show_data = [];
      var needYais = [];
      var needXais = [
        {
            show:true,
              type: "value",
          gridIndex:all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
              nameLocation:"end",
              nameGap:10,
            axisLine: {
                  //lineStyle: {color: '#ccc'}
              },
              axisLabel: {
                //  textStyle: {color: '#777'}
              }
          }
      ];
      var gridArr = [];
      var valueMax = 0;

      for(var i = 0;i < data.length;i++){
        var aData = data[i];
        var theDimeInfo = [];
        var theDimeData = [];
        for(var k = 0;k < all_dimensionality.length;k++){
          theDimeInfo.push(aData[all_dimensionality[k]]); 
          // console.log(theDimeInfo);
          // console.log(theDimeInfo);  
        }
        for(var j = 0;j < all_measure.length;j++){ // 计算出series
          if(valueMax < aData[drag_measureCalculateStyle[all_measure[j]]]){
            valueMax = aData[drag_measureCalculateStyle[all_measure[j]]];
          }
          if(!series[j]){
            series[j] = {
              "name":drag_measureCalculateStyle[all_measure[j]],
              "type":"bar",
              "yAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
              "xAxisIndex":all_dimensionality.length-1 < 0 ? 0 : all_dimensionality.length-1,
              "data":[{"value":aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[all_measure[j]]],"theDimeInfo":theDimeInfo,"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle[all_measure[j]]],"huanbi":aData["环比"+drag_measureCalculateStyle[all_measure[j]]],"measureName":all_measure[j]}],
              z:3,
              label:{
                normal:{
                  show:dimensionality_show_data.length < 25 && all_measure.length < 3,
                  position:"right",
                  formatter:function(params){
                                if(normalUnitValue != -1){
                                  return params.value.toFixed(normalUnitValue);
                                }else{
                                  return params.value;
                                }
                             },
                }
              },
            };
          }else{
            series[j]["data"].push({"value":aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue],"originValue":aData[drag_measureCalculateStyle[all_measure[j]]],"theDimeInfo":theDimeInfo,"dirllInfo":{"currentField":last_dimensionaity,"currentValue":aData[last_dimensionaity]},"tongbi":aData["同比"+drag_measureCalculateStyle[all_measure[j]]],
            "huanbi":aData["环比"+drag_measureCalculateStyle[all_measure[j]]],"measureName":all_measure[j]});
          }
        }

        var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
        for(var k = 0;k < dimension_length;k++){
          if(!dimensionality_show_data[k]){       
            dimensionality_show_data[k] = [aData[all_dimensionality[k]]];
          }else{
            var index = dimensionality_show_data[k].indexOf(aData[all_dimensionality[k]]);
            if(index == -1){
              dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
            }else if(index != -1){
              if(all_dimensionality[dimensionality_show_data.length - 1] != all_dimensionality[k]){
                var lastVal = dimensionality_show_data[k][dimensionality_show_data[k].length-1];
                if(/YZYPD/.test(lastVal)){
                  lastVal = lastVal.split("YZYPD")[1];
                }
                if(lastVal == aData[all_dimensionality[k]]){
                  dimensionality_show_data[k].push("YZYPD"+ aData[all_dimensionality[k]]);
                }else{
                  dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
                }
              }else{
                dimensionality_show_data[k].push(aData[all_dimensionality[k]]);
              }
            }

          }
          
        }
      }


      
      for(var i = 0;i < dimensionality_show_data.length;i++){
        // console.log(dimensionality_show_data);
        // console.log(dimensionality_show_data[i]);

        var aY = {
          "show":true,
          // "name":all_dimensionality[i],
          "nameGap":10,
          "nameRotate":15,
          "nameLocation":"end",
          "type":"category",
          // "nameGap":50,
          // "nameLocation":"middle",
          axisTick:{
            inside:false,
            interval:function(index,value){return !/^YZYPD/.test(value)},
            // length:i == 0 ? 60 * dimensionality_show_data.length : 5,
            // length:dimensionality_show_data.length == 1 ? 5 : 60 + i,
            // length: /^YZYPD/.test(dimensionality_show_data[i])? 0 : 60 + i,
            // length:i == dimensionality_show_data.length-1 ? 60 * i + i : 0,
                  // lineStyle: {color: '#ccc'}   
          },
          axisLabel:{
            color:"black",
            rotate:15,
            fontSize:10,
            interval:function(index,value){return !/^YZYPD/.test(value)},
                formatter:function(value){
                  if(value.length > 6){
                value = value.substring(0,6) + '...';
              }
              // console.log(value);
              if(value == 'undefi...'){
                return '';
              }
              return value;
                }

          },
          axisLine: {
            show:true,   //去掉垂直线
                  // lineStyle: {color: '#ccc'}
              },
              splitLine:{
                show:false
              },
          "data":dimensionality_show_data[i],
          gridIndex:i
        }

        
        needYais.push(aY);
        // console.log(needYais);
        //console.log(needYais[i].data);

        var aGrid = {
          containLabel:false,
          show:false,
        }
        aGrid["left"] = 120 + 80 * i;           //6
        // aGrid["left"] = 100 + i * (60 + i);       //3
        // aGrid["bottom"] = 120;
        aGrid["bottom"] = '20%';


        if(i != dimensionality_show_data.length - 1){
          aGrid["tooltip"] = {show:false}
        }
        if(i > 0){
          var obj = {
              show:false,
                type: "value",
                gridIndex:dimensionality_show_data.length - 1 - i,
                min:0,
                max:valueMax,
          }
          needXais.unshift(obj);

          var aSeriesData = {
            name:"help",
            type:"bar",
            xAxisIndex:i-1,
            yAxisIndex:i-1,
            "data":[{"value":valueMax/valueUnitValue,"originValue":valueMax}],
            itemStyle:{
              normal:{
                opacity:0
              }
            },
            cursor:"default"
          }
          series.push(aSeriesData);
          //console.log(series);
        }

        gridArr.push(aGrid);

      }
      var dataZoomXindexArray = [];
      var dimension_length =  all_dimensionality.length <= 0 ? 1 : all_dimensionality.length;
      for(var k = dimension_length - 1; k >= 0;k--){
        dataZoomXindexArray.push(k);
      }
      var option = {
          title: [{
              text: "条形图",
              show:false
          },
            {
              text: "单位: "+valueUnitValue,
              bottom:40,
              show:false,
              textStyle:{
                fontSize:14,
                color:allColorsDict[currentColorGroupName][0]
              }
            }
          ],
          tooltip: {
              trigger: 'item',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
             backgroundColor:'rgba(255,255,255,0.95)',
               extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
             formatter:function(params){
                  var needValue = params.value;
                  if(normalUnitValue != -1){
                     needValue = needValue.toFixed(normalUnitValue);
                  }
                  var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'>";
                  var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'>";
                  for(var i = 0;i < all_dimensionality.length;i++){
                    var aP = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_dimensionality[i]+":</p>";
                    leftDiv+=aP;
                  }
                  leftDiv+="<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+params.seriesName+":</span></p>";
                  if(params.data.theDimeInfo != undefined){
                    for(var k = 0;k < params.data.theDimeInfo.length;k++){
                     rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+params.data.theDimeInfo[k]+"</p>";
                  	}              	
                  }

                  rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
                  var leftTongbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>同比:</p>";
                   var leftHuanbi = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>环比:</p>";
                   var rightTongbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.tongbi)*100).toFixed(2)+"%</p>";
                   var rightHuanbi = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+(Number(params.data.huanbi)*100).toFixed(2)+"%</p>";
                   if(showTongbiMeasureArray.indexOf(params.data.measureName) != -1){
                     leftDiv += leftTongbi;
                     rightDiv += rightTongbi;
                   }
                   if(showHuanbiMeasureArray.indexOf(params.data.measureName) != -1){
                     leftDiv += leftHuanbi;
                     rightDiv += rightHuanbi;
                   }
                   leftDiv+= "</div>";
                   rightDiv+= "</div>";
                   return leftDiv+rightDiv;
              },
              textStyle:{
                  fontSize:12
              }
          },
          legend: {
              data: commonLegend,
              left:"center",
              // bottom:0,
              // bottom:40,
              bottom:'6%',
              width:"60%",
          },
            color:allColorsDict[currentColorGroupName],
        toolbox: {
              show: true,
              feature: {
                  // dataView: {readOnly: true},
                  restore: {},
                  saveAsImage: {
                    title:"保存为png"
                  }
              },
              orient:"vertical",
              right:20,
              top:"middle",
              itemSize:20,
              itemGap:30
        },
          dataZoom:[
                {
                type: 'slider',
                    show: dimensionality_show_data[dimensionality_show_data.length - 1].length > 15,
                    filterMode:"filter",
                    backgroundColor:"#f5f5f5",
                    filterColor:"#dedede",
                    showDataShadow:false,
                    yAxisIndex: dataZoomXindexArray,
                    height:10,
                    borderColor:"#f5f5f5",
                    handleStyle:{
                        color:"#dedede"
                    },
                    startValue:0,
                    endValue: dimensionality_show_data[dimensionality_show_data.length - 1].length > 15 ? 15:null,
                    orient:"horizontal",
                    bottom:0,
                    handleSize:12,
                    maxValueSpan:15,
                    throttle:100,
                    handleIcon:"path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
                },
                {
                type: 'slider',
                    show: false,
                    filterMode:"empty",
                    xAxisIndex: dataZoomXindexArray,
                }
          ],
          grid: gridArr,
          yAxis: needYais,
          xAxis:needXais,
          series:series
      };

        //清除上一个图形的图例
        mycharts.clear();
        //使用刚指定的配置项和数据显示图标
        mycharts.setOption(option);
        spinner.stop();
        $(".maskLayer").hide();
    });
  }



//雷达图:
function radarChart_generate_fun(){
    measure_Hanlde(all_dimensionality,all_measure,null,function(data){
      if(data.length == 0){
        return;
      }
      radarDiemension = all_dimensionality[0];
      var indicator = [];
      var series = [
        {
          "name":all_measure.join("/"),
          "type":"radar",
          "data":[]
        }
      ];
      var recordArr = [];
      var maxArr = [];

      for(var i =0;i < data.length;i++){
        var aData = data[i];
        var max = aData[drag_measureCalculateStyle[all_measure[0]]] / allValueUnitDict[valueUnitValue];
        for(var j = 0;j <  all_measure.length;j++){
          if(!series[0]["data"][j]){
            series[0]["data"][j] = {
              "name":drag_measureCalculateStyle[all_measure[j]],
              "value":[aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue]]
              };
            recordArr[j] = [aData[drag_measureCalculateStyle[all_measure[j]]]];
          }else{
            series[0]["data"][j]["value"].push(aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue]);
            recordArr[j].push(aData[drag_measureCalculateStyle[all_measure[j]]]);
          }
          if(max < aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue]){
            max  = aData[drag_measureCalculateStyle[all_measure[j]]]/allValueUnitDict[valueUnitValue];
          }
        }

        // var str = "";
        // for(var k=0;k<all_dimensionality.length;k++){
        //  // console.log(all_dimensionality[k],aData[all_dimensionality[k]]);
        //  str +=  aData[all_dimensionality[k]] + "-";
        //  //console.log(str);
        //  var re = str.substring(0,str.length-1);
        //  // console.log(re);
        // }

        var maxVal = (max / allValueUnitDict[valueUnitValue]) * 1.2;
        maxArr.push(maxVal);
        // console.log(maxArr);
        // var maxNum = Math.max.apply(null, maxArr);
        // console.log(maxNum);

        // indicator.push({
        //  // "name":aData[all_dimensionality[0]],
        //  "name":re,
        //  "max":maxNum,
        //  // "max":(max/allValueUnitDict[valueUnitValue])*1.2,
        //  "originalMax":max
    //            });

      }

      var maxNum = Math.max.apply(null, maxArr);

      for(var i=0;i<data.length;i++){
        var aData = data[i];
        var max = aData[drag_measureCalculateStyle[all_measure[0]]] / allValueUnitDict[valueUnitValue];

        var str = "";
        for(var k=0;k<all_dimensionality.length;k++){
          str +=  aData[all_dimensionality[k]] + "-";
          var re = str.substring(0,str.length-1);
        }

        indicator.push({
          "name":re,
          "max":maxNum,
          "originalMax":max
              });
      }


    var option = {
        title: [{
            text: "雷达图",
            show:false
        },
          {
              text: "单位: "+valueUnitValue,
              right:70,
              top:10,
              show:false,
              textStyle:{
                fontSize:14,
                color:allColorsDict[currentColorGroupName][0]
              }
            }
        ],
        tooltip: {
            trigger:"axis",
            // trigger:"item",
            textStyle:{
              fontSize:12
            },
            // position:'inside',
       //     position: function (point, params, dom, rect, size) {     
          //     // return [point[0],point[1]];
          //     return [point[0],'50%'];
          // },
            backgroundColor:'rgba(255,255,255,0.95)',
            extraCssText: 'box-shadow: 0px 3px 5px 0px rgba(0, 49, 98, 0.2);border:1px solid #eeeeee;border-bottom:0',
        //    formatter:function(params){
            // var leftDiv = "<div style='float:left;color:#808080;font-size:10px;'>";
            // var rightDiv = "<div style='float:left;color:#202020;font-size:10px;padding-left:5px;'>";
            // for(var i = 0;i < all_measure.length;i++){
            //  var aP = "<p style='margin:0;margin-left:12px;padding:0 0 10px 0;height:10px;'>"+all_measure[i]+":</p>";
            //  leftDiv+=aP;
            //  var aStyle = "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+drag_measureCalculateStyle[all_measure[i]]+"</p>";
            //  rightDiv+=aStyle;
            // }

        //      for(var i = 0;i < params.value.length;i++){
        //        var needValue = params.value[i];
        //        if(normalUnitValue != -1){
           //       needValue = needValue.toFixed(normalUnitValue);
           //     }
            //  leftDiv+="<p style='padding:0 0 10px 0;height:10px;margin:0;'><span style=width:8px;height:8px;border-radius:50%;display:inline-block;margin-top:2px;line-height:8px;background:"+params.color + "></span>"+"<span style='display:inline-block;margin-left:5px;height:10px;line-height:10px;'>"+indicator[i].name+":</span></p>";
            //  rightDiv+= "<p style='padding:0 0 10px 0;height:10px;margin:0;'>"+needValue+"</p>";
        //      }
        //      leftDiv+="</div>";
       //                rightDiv+= "</div>";
        //        return leftDiv + rightDiv;

        //    }
  
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
            right:70,
            // top:40,
            // bottom:50,
            top:'6%',
            bottom:'8%',
            data: commonLegend,
            // left:"center",
            width:"60%", 
        },
        color:allColorsDict[currentColorGroupName],
      toolbox: {
            show: true,
            feature: {
                // dataView: {readOnly: true},
                restore: {},
                saveAsImage: {
                  title:"保存为png"
                }
            },
            orient:"vertical",
            right:20,
            top:"middle",
            itemSize:20,
            itemGap:30
      },
        radar: [{
//            shape: 'circle',
            indicator:indicator,
            triggerEvent:true,
            // radius:data.length > 400 ? '100%' : '80%',
            axisLine:{
              show:true
              // show:data.length < 80,
            },
            splitLine:{
              show:true,
            },
            name:{
              formatter:function(params){
                count++;  
                if(data.length > 20 && data.length < 80){
                  if(count % 4 == 0){
                    return params;
                  }else{
                    array.push(params);
                    return  '';
                  }
                }else if(data.length > 80 && data.length < 200){
                  if(count % 10 == 0){
                    return params;
                  }else{
                    array.push(params);
                    return '';
                  }
                }else if(data.length > 200){
                  if(count % 15 == 0){
                    return params;
                  }else{
                    array.push(params);
                    return '';
                  }
                }else{
                  return params;
                }
                // if(data.length > 20){
                //  if(count % 3 == 0){
                //    return params;
                //  }else{
                //    array.push(params);
                //  //  console.log(array);
                //    return '';
                //  }
                // }else{
                //  return params;
                // }
              }
            },  
        }],
        "record":recordArr,
        series: series
    };
    // console.log(option.series[0].data[0].value);
    // console.log(option);
    //清除上一个图例
    mycharts.clear();

    mycharts.setOption(option);

    spinner.stop();
    $(".maskLayer").hide();

    });
  }


  //判断传入参数不同调用不同图形
  switch(chart_type_need)
  {
    case "polyline":
      //调用折线图
      polyLine_generate_fun();
      break;
    case "comparisonStrip":
      //调用对比条形图
        comparisonStrip_generate_fun();
      break;
      case "number_bar":
      //调用堆积柱状图
        stackedBar_generate_fun("number_bar");
      break;
      case "number_liner":
      //调用堆积条形图
        stackedBar_generate_fun("number_liner");
      break;
      case "percentage_bar":
      //调用百分比堆积柱状图
        stackedBar_generate_fun("percentage_bar");
      break;
       case "percentage_liner":
      //调用百分比堆积条形图
        stackedBar_generate_fun("percentage_liner");
      break;
      case "reliationTree":
      //调用树状图
      reliationTree_generate_fun();
      break;
      //调用雷达图
      case "radarChart":
      radarChart_generate_fun();
      break;
      //调用条形图
      case "barChart":
      barChart_generate_fun();
      break;
      //调用柱状图
      case "histogram":
      histogram_generate_fun();
      break;

    default:

  }
  // 记录当前图形的类型
  currentChatType = chart_type_need;
}



// 设置面板，设置了颜色
function colorsPanelDidSelectedColor(){
  var mycharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
  var op = mycharts.getOption();
  
  //地图
  if(op.series[0].type == "map"){
  	if(op.visualMap[0].range[0] == 0){
  		one_de_one_me_handle("addressMap");	
  	}else{
  		one_de_one_me_handle("addressMap","drill");
  	}
  	
  	return;
  }



  op.title[1].textStyle.color = allColorsDict[currentColorGroupName][0];
  // op.title[1] = {
  //  text: "单位: "+valueUnitValue,
  //  bottom:0,
  //  show:true,
  //  textStyle:{
  //    fontSize:14,
  //    color:allColorsDict[currentColorGroupName][0]
  //  }
  // }
  mycharts.setOption({
    color:allColorsDict[currentColorGroupName],
    title:op.title
  });
  if(currentChatType == "number_bar" || currentChatType == "number_liner" || currentChatType == "percentage_bar" || currentChatType == "percentage_liner"){
    var op = mycharts.getOption();
    for(var i = 0;i < op.series.length;i++){
      var obj = op.series[i];
      obj.itemStyle ={
            normal:{
              color:allColorsDict[currentColorGroupName][i % allColorsDict[currentColorGroupName].length]
            }
        };
    }
    mycharts.setOption({"series":op.series});
  }
}
//设置面板，设置了单位（保留了几位小数)
function normalUnitDidChangeValue(){
  var mycharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
  if(mycharts == undefined) return;
  var op = mycharts.getOption();
  mycharts.setOption(op);
}
// 设置面板，设置了值单位
function valueUnitDidChangedValue(){
  var mycharts = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
  if(mycharts == undefined) return;
  var op = mycharts.getOption();
  //地图
  if(op.series[0].type == "map"){
  	if(op.visualMap[0].range[0] == 0){
  		one_de_one_me_handle("addressMap");	
  	}else{
  		one_de_one_me_handle("addressMap","drill");
  	}
  	
  	return;
  }


  op.title[1].text = "单位: "+valueUnitValue;

  if(currentChatType != "percentage_bar" && currentChatType != "percentage_liner"){
    if(currentChatType == "radarChart"){

      var allValueData = op.series[0].data;
      for(var i = 0;i < allValueData.length;i++){
        var theValues = allValueData[i].value;
        for(var j = 0;j < theValues.length;j++){
          theValues[j] = op.record[i][j] / allValueUnitDict[valueUnitValue];
        }
      }
      for(var i = 0; i <  op["radar"][0].indicator.length;i++){
        var obj = op.radar[0].indicator[i];
        obj.max = (obj.originalMax / allValueUnitDict[valueUnitValue]) *1.2;
      }
    }else{
      for(var i = 0;i < op.series.length;i++){
        var theDatas = op.series[i].data;
        for(var j = 0;j <  theDatas.length;j++){
          var aData = theDatas[j];
          aData.value = aData.originValue / allValueUnitDict[valueUnitValue];
        }
      }
    }
  }


  mycharts.setOption(op);

}


// 公共函数，处理层级字典
// values是度量值
// needobj 辅助对象
// keys，需要过滤的维度的数组
//arr1：过滤好的数组，包含维度的各个值
//arr2：维度的名字
//function object_key_hanlde(needobj,keys,arr1,arr2){
//  var i = 0;
//  function  handle (obj) {
//  if(!obj[keys[i]]){
//    obj[keys[i]] = {};
//    if(!arr1[i]){
//      arr1[i] = [];
//      arr2.push(keys[i].split("_equal_")[0]);
//    }
//    arr1[i].push(keys[i].split("_equal_")[1]);
//  }else{
//    if(i + 1 < keys.length){
//      arr1[i].push(" " + keys[i].split("_equal_")[1]);
//    }
//  }
//  i++;
//  if(i == keys.length){
//     return;
//  }
//  obj = handle(obj[keys[i - 1]]);
//
//}
// handle(needobj);
//}
//计算一个数组中对应字段的和
function calculateArraySpecialFieldSum(arr,field){
  var sum = 0;
  for(var i = 0; i < arr.length;i++){
    sum += arr[i][field];
  }
  return sum;
}


//记录下钻对应的下标
var valueCount = 0;

var freeTemp = null;


// 下钻公共方法
function drillDownCommonFunction(params,allDimensionality,tempSplitView,drillField,dataType,peter){

    var aDrillcondtion = null;


    if(currentChatType == "radarChart" && params.componentType == "radar"){
       aDrillcondtion = {"currentField":radarDiemension,"currentValue":params.name,"drillField":drillField};
       dirllConditions.push(aDrillcondtion);
    
    }else{
        for(var i = 0 ; i < allDimensionality.length; i++){
          if(allDimensionality.length == 1){
            aDrillcondtion = {"currentField":params.data.dirllInfo.currentField,"currentValue":params.data.dirllInfo.currentValue,"drillField":drillField};
          }else{
            aDrillcondtion = {"currentField":allDimensionality[i],"currentValue":params.data.theDimeInfo[i],"drillField":drillField};
          }
          
          dirllConditions.push(aDrillcondtion);
        }

    }

    if(peter == "peter" && saveDrillDownTemp[$(".clickActive").find("span").text()] != undefined){
      editView_change_color("默认_YZY_-1_YZY_个");
      drag_row_column_data = objectDeepCopy(saveDrillDownTemp[$(".clickActive").find("span").text()]["viewdata"]);
      if($(".clickActive").parents(".annotation_text").attr("id") == "drop_col_view"){
        remove_viewHandle("column","get");
      }else{
        remove_viewHandle("row","get");
      }
      saveDrillDownTemp[$(".clickActive").find("span").text()]["viewdata"] = objectDeepCopy(drag_row_column_data);
      freeTemp = "peter";
      drillNumHandle();
    }else{

      saveDataAndView.push({"viewdata":objectDeepCopy(drag_row_column_data),"viewType":save_now_show_view_text.attr("id")})
      if(saveDataAndView.length  == 1){
        saveDrillPreView = objectDeepCopy(saveDataAndView[0]);
      }

      if(drag_row_column_data["row"]["dimensionality"].length > 0){
        drag_row_column_data["row"]["dimensionality"].splice(0,drag_row_column_data["row"]["dimensionality"].length,dataType);
      }else{
        drag_row_column_data["column"]["dimensionality"].splice(0,drag_row_column_data["column"]["dimensionality"].length,dataType);
      }
      freeTemp = "null";
    }

    $("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow").show();

    var showList = $("<li datavalue="+valueCount+"><img src='/static/statements/img/jt.png' alt='jt'><p>"+tempSplitView+"</p></li>");

    if(!onlyGetDrillDown){
      showList.addClass("drillDownHandle");
    }else{
      showList.addClass("peterDownHandle");
    }
    $("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul").append(showList);
    if($("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul").find("li").length == 2){
      $("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area #view_show_area_content").height($("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area #view_show_area_content").height()-30);
    }
    showList.children("p").unbind("click");
    showList.children("P").click(function(event){
      event.stopPropagation();
      if($(".drillDownHandle").length == 0){
        freeTemp = "peter";
      }
      //记录当前上钻的数据
      drillDownClick(this,freeTemp);
    })
    loc_storage.removeItem("allTable_specialSelection");
      loc_storage.removeItem("allTable_notWorkedColumns");
      loc_storage.removeItem($("#lateral_bar #lateral_title .custom-select").val());
    switch_chart_handle_fun();


}




// 图形下钻功能
function chartAPartDidClickedFunction(params,allDimensionality){
  if(params.data.viewtype == "relational" || params.componentSubType == "radar"){
    return;
  }
  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillDown").css("background","#F5F5F5");
  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList").hide();
  $("#dashboard_content #view_show_area #view_show_area_content .drillUpAndDrillDownSelection .drillDownSearch .drillDownSearchInput").val("");
  if(params.seriesName == "help" || $("#dashboard_content #dimensionality #dimensionality_show ul li.dimensionality_li div.dimensionality_list_main div span.dimensionality_list_text_left").length == allDimensionality.unique3().length){
    $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillDown").removeClass("active");
    return;
  }

  //禁止图例的移入事件
  var mychartIndex = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
  var opt = mychartIndex.getOption();
  opt.tooltip[0]["show"] = false;
  mychartIndex.setOption(opt);

  var tempSplitView = "";
  if(params.data.theDimeInfo != undefined){
    //修改选择项对应的数据
    for(var drillDown = 0;drillDown < params.data.theDimeInfo.length;drillDown++){
      tempSplitView+=params.data.theDimeInfo[drillDown]+"-";
    }
    tempSplitView = tempSplitView.substring(0,tempSplitView.length -1);
  }else{
    tempSplitView = params.data.dirllInfo.currentValue;
  }

  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection p.selectDown span").eq(2).text(tempSplitView).attr("title",tempSplitView);

  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection p .drillValue").text(params.seriesName);

  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection p .drillData").text(params.value);

  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillDown").addClass("active");

  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList ul").empty();
  $("#dashboard_content #dimensionality #dimensionality_show ul li.dimensionality_li div.dimensionality_list_main div span.dimensionality_list_text_left").each(function(index,ele){
    if($.inArray($(ele).text(),allDimensionality) == -1){
      var li = $("<li title="+$(ele).text()+" class='drillDownShowLi' dataType="+$(ele).attr("dataType")+">"+$(ele).text()+"</li>");
      $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList ul").append(li);
    }

  });
  if(dirllConditions&&dirllConditions.length > 0 && $(".drillDownHandle").length > 0){
    $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillUp").addClass("active");
  }else{
    $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillUp").removeClass("active");
  }

  // if(currentChatType == "radarChart" && params.componentType == "radar"){
  //  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .levelTitle").html(params.name);
  // }else{
  //  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .levelTitle").html(params.data.dirllInfo.currentField);
  // }

  //判断点击显示是否超出可视区域范围
  if($("#view_show_area_content").height() - 180 < params.event.offsetY){
    drillDownWallPositionTop = $("#view_show_area_content").height() - 120;
  }else{
    drillDownWallPositionTop = params.event.offsetY + 60;
  }

  if($("#view_show_area_content").width() - 260 < params.event.offsetX){
    drillDownWallPositionLeft = $("#view_show_area_content").width() - 200;
  }else{
    drillDownWallPositionLeft = params.event.offsetX + 60;
  }


  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection").show().css({"left":drillDownWallPositionLeft + "px","top":drillDownWallPositionTop + "px"});
  // 下钻按钮点击的时候
  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillDown").unbind("click");
  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillDown").click(function(event){

    event.stopPropagation();

    if(valueCount == 0){
      viewClickChange = JSON.parse(JSON.stringify(drag_row_column_data));
    }

    onlyGetDrillDown = false;

    valueCount++;

    saveDimeData.push(allDimensionality.length);

    // $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList").css({"left":params.event.offsetX + "px","top":params.event.offsetY + "px"});
    $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList").toggle(0,function(){
      if($("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList").css("display") == "block"){
        $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillDown").css("background","#eaf4ff");
          //判断点击显示是否超出可视区域范围
        if($("#view_show_area_content").height() - 180 - $("#dashboard_content #view_show_area #view_show_area_content .drillUpAndDrillDownSelection .drillSelctionList").height() < params.event.offsetY){
          drillDownWallPositionTop = $("#view_show_area_content").height() - 120 - $("#dashboard_content #view_show_area #view_show_area_content .drillUpAndDrillDownSelection .drillSelctionList").height();
        }

        if($("#view_show_area_content").width() - 320  < params.event.offsetX){
          drillDownWallPositionLeft = $("#view_show_area_content").width() - 260;
        }

        $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection").css({"left":drillDownWallPositionLeft + "px","top":drillDownWallPositionTop + "px"});

      }else{
        $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillDown").css("background","#F5F5F5");
      }
    });
  });
  // 下钻具体选项选择的时候
  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList li").unbind("click");
  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList li").click(function(event){
    event.stopPropagation();
    $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList").hide();
    $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection").hide();
    drillDownCommonFunction(params,allDimensionality,tempSplitView,$(this).text(),$(this).attr("dataType"));

  });
  // 上钻按钮点击的时候
  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillUp").unbind("click");
  $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillUp").click(function(event){
    event.stopPropagation();
    if(dirllConditions&&dirllConditions.length > 0){
      
      dirllConditions.splice(dirllConditions.length - saveDimeData[saveDimeData.length -1]);
      
      valueCount--;
      //记录当前上钻的数据
      saveHandleViewData = JSON.parse(JSON.stringify(saveDataAndView[saveDataAndView.length-1]));
  
      saveDataAndView.pop();
      saveDimeData.pop();

      drag_row_column_data = saveHandleViewData["viewdata"];
      save_now_show_view_text = $("#"+saveHandleViewData["viewType"]+"");
      $("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul li").eq($("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul li").length -1).remove();
      if(saveDataAndView.length == 0 && $("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul").find(".drillDownHandle").length  == 0){
        if($("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow ul").find("li").length == 1){
          $("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area #view_show_area_content").height($("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area #view_show_area_content").height()+30);
          $("#pageDashboardModule #dashboard_content .handleAll_wrap #view_show_area .drillDownShow").hide();
          valueCount = 0;
          saveDimeData =[];
          dirllConditions = [];
          saveDataAndView = [];
        }else{
          freeTemp = "peter";
          onlyGetDrillDown = true;
        }



      }

      switch_chart_handle_fun();
    }
  });
  $(document).click(function(event){
    event.stopPropagation();
    // console.log(event.target);

    if($(event.target).parents(".drillUpAndDrillDownSelection").length == 0){
        $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection .drillSelctionList").hide();
        $("#dashboard_content #view_show_area #view_show_area_content  .drillUpAndDrillDownSelection").hide();
        //禁止图例的移入事件
        var mychartIndex = echarts.getInstanceByDom($("#view_show_area #view_show_area_content #view_show_wrap #main").get(0));
        
        if(mychartIndex.getOption().series.length > 0){
          var opt = mychartIndex.getOption();
          opt.tooltip[0]["show"] = true;
          mychartIndex.setOption(opt);
        }

    }

  });
}

//获取非分层结构维度下标
function getNodrillIndex(){
  if(saveDrillDownDict[$(".clickActive").find("span").text()] != undefined){
    saveDrillDownDict[$(".clickActive").find("span").text()] = [];
  }

  $(".peterMouse").parents(".annotation_text").find("li").each(function(index,ele){
    if($(ele).find(".peterMouse").length == 0){
      saveDrillCount.push(dirllConditions.length + index);
      saveDrillDownDict[$(".clickActive").find("span").text()] = saveDrillDownDict[$(".clickActive").find("span").text()] || [];
      saveDrillDownDict[$(".clickActive").find("span").text()].push($(ele).find(".drop_main span").attr("datatype")+"_YZYPD_"+ index);
      
    }else{
      nowDrillDownCount = index;
      drillElementCount[$(".clickActive").find("span").text()] = nowDrillDownCount;
    }
    
  })
  
}

//重新绘制下钻要显示的度量
function changeMiToHandle(eleArr,content){
  for(var i = 0; i < eleArr.length;i++){
    var tempList = $("<div class='list_wrap'><li class='drog_row_list date_list bj_information' id='measure:"+eleArr[i]+"'><div class='drop_main clear set_style measure_list_text ui-draggable ui-draggable-handle'><span class='measure_list_text_left' datatype="+eleArr[i]+">"+drag_measureCalculateStyle[eleArr[i].split(":")[0]]+"</span><div class='moreSelectBtn'><img src='/static/dashboard/img/select_tra.png' alt='dimensionality_list'></div></div></li></div>");
    content.append(tempList);
    tempList.find(".drog_row_list").data("field_name",eleArr[i].split(":")[0]).data("pop_data_handle",username+"_YZY_"+$("#lateral_bar #lateral_title .combo-select ul").find(".option-selected").text()+"_YZY__"+eleArr[i].split(":")[0]);
    tempList.find(".set_style").on("mouseenter",function(){$(this).find(".moreSelectBtn").show()});
    tempList.find(".set_style").on("mouseleave",function(){$(this).find(".moreSelectBtn").hide()});
    tempList.find("li .set_style").css("background","#ffcc9a").css("border","1px solid #ffbe7f");
      $(tempList).find("li").css({
      width: $(".annotation_text").width() * 0.91+ "px",
      margin: "5px auto 0",
      listStyle: "none",
    });
    $(tempList).find(".set_style").css({
      width: "94%",
      height: "23px",
      padding: "0px 5px",
      color: "black"
    });
    $(tempList).find(".set_style").find("span").css({
      float: "left",
      display: "block",
    });
    $(tempList).find("img").css({
      display: "block",
    })

    md_click_show(tempList.find("li").find(".moreSelectBtn"),{"编辑计算_YZY_edit_calculation":null,"度量_YZY_measure":["计数_YZY_pop_count_all","求和_YZY_pop_total","平均值_YZY_pop_mean","最大值_YZY_pop_max","最小值_YZY_pop_min"],"同比_YZY_compared":null,"环比_YZY_linkBack":null,"移除对比_YZY_deleteCompared":null,"移除_YZY_deleting":null});
  }
}



//判断分层下钻度量是否需要重绘
function handleMiChange(handleType){
  var oneMi = saveDrillDownTemp[$(".clickActive").find("span").text()]["calculateStyle"];
  var twoMi = objectDeepCopy(drag_measureCalculateStyle);
  if(!equalCompare(oneMi,twoMi)){
    drag_measureCalculateStyle = saveDrillDownTemp[$(".clickActive").find("span").text()]["calculateStyle"];
    if($("#drop_row_view").find(".measure_list_text").length > 0){
      $("#drop_row_view").html($("<span class='drag_text' style='display:none'>请拖入左边的字段</span>"));
      changeMiToHandle(saveDrillDownTemp[$(".clickActive").find("span").text()]["viewdata"]["row"]["measure"].concat(saveDrillDownTemp[$(".clickActive").find("span").text()]["viewdata"]["column"]["measure"]),$("#drop_row_view"));
    }else{
      $("#drop_col_view").html($("<span class='drag_text' style='display:none'>请拖入左边的字段</span>"));
      changeMiToHandle(saveDrillDownTemp[$(".clickActive").find("span").text()]["viewdata"]["row"]["measure"].concat(saveDrillDownTemp[$(".clickActive").find("span").text()]["viewdata"]["column"]["measure"]),$("#drop_col_view"));
    }
  }
}


//单击下钻
function chartPerterClickedFunction(params,allDimensionality,handleType){
  if(!onlyGetDrillDown || params.data.viewtype == "relational" || params.componentSubType == "radar"){
    return;
  }
  
  getNodrillIndex();
  saveDrillDownTemp[$(".clickActive").find("span").text()] = {"viewdata":JSON.parse(JSON.stringify(drag_row_column_data)),"viewType":save_now_show_view_text.attr("id"),"calculateStyle":objectDeepCopy(drag_measureCalculateStyle),"dragViewStyle":objectDeepCopy(currentColorGroupName)+"_YZY_"+objectDeepCopy(normalUnitValue)+"_YZY_"+objectDeepCopy(valueUnitValue)};
  if($(".peterMouse").parents(".annotation_text").find(".noPerter").length > 0){
    $(".noPerter").parents(".drog_row_list").remove();
    $(".peterMouse").parents(".annotation_text").find(".list_wrap").each(function(index,ele){
      if($(ele).find("li").length == 0){
        $(ele).remove();
      }
    })

    var freeDrill = params.data.theDimeInfo[nowDrillDownCount];

  }else{
    if(params.data.theDimeInfo == undefined){
      var freeDrill = params.name;
    }else{
      var freeDrill = params.data.theDimeInfo[nowDrillDownCount];
    }
    
  }

  
  valueCount++;
  saveDimeData.push(allDimensionality.length);
  var tempHandle = Number($(".clickActive").attr("datavalue"));

  if(saveDrillDownDict[$(".peterMouse[datavalue="+(Number($(".clickActive").attr("datavalue"))+1)+"]").find("span").text()] != undefined && saveDrillDownDict[$(".peterMouse[datavalue="+(Number($(".clickActive").attr("datavalue"))+1)+"]").find("span").text()].length > 0){
    for(var i =0 ; i < saveDrillDownDict[$(".peterMouse[datavalue="+(Number($(".clickActive").attr("datavalue"))+1)+"]").find("span").text()].length; i++){
      dragDrillDimen(saveDrillDownDict[$(".peterMouse[datavalue="+(Number($(".clickActive").attr("datavalue"))+1)+"]").find("span").text()][i].split("_YZYPD_")[0],saveDrillDownDict[$(".peterMouse[datavalue="+(Number($(".clickActive").attr("datavalue"))+1)+"]").find("span").text()][i].split("_YZYPD_")[1]);
    }
  }

  
  $(".peterMouse").removeClass("clickActive");
  $(".peterMouse[datavalue="+(tempHandle+1)+"]").addClass("clickActive");

  if(tempHandle == 0){
    if($(".perterWallContent").css("display") == "none"){
      $(".perterWallContent").show();
      $(".drop_main .downImgContent img").attr("src","/static/dashboard/img/dashboard_icon1.png");

    }
    drillDownNoClick();
  }else{
    if($(".perterThree").css("display") == "none"){
      $(".perterThree").show();
      $(".perterWallContentList .downImgContent img").attr("src","/static/dashboard/img/dashboard_icon1.png");
    }
    
  }

  //判断度量是否有改变是否重绘
  handleMiChange();
  
  drillDownCommonFunction(params,allDimensionality,freeDrill,$(".clickActive").find("span").text(),$(".peterMouse[datavalue="+(tempHandle+1)+"]").find("span").attr("datatype"),"peter");
  peterDrillDown();

}



// 下钻功能，需要记录当前的条件
function saveDrillConditions(key,drillCondictions){
  window.localStorage.setItem(key,JSON.stringify(drillCondictions));
}
// 获取下钻的条件
function getDrillConditions(key){
  return JSON.parse(window.localStorage.getItem(key));
}


function hex2Rgb(hex) { //十六进制转为RGB
	 var rgb = []; // 定义rgb数组
	 if (/^\#[0-9A-F]{3}$/i.test(hex)) { //判断传入是否为#三位十六进制数
	  let sixHex = '#';
	  hex.replace(/[0-9A-F]/ig, function(kw) {
	   sixHex += kw + kw; //把三位16进制数转化为六位
	  });
	  hex = sixHex; //保存回hex
	 }
	 if (/^#[0-9A-F]{6}$/i.test(hex)) { //判断传入是否为#六位十六进制数
	  hex.replace(/[0-9A-F]{2}/ig, function(kw) {
	   rgb.push(eval('0x' + kw)); //十六进制转化为十进制并存如数组
	  });
	  return `${rgb.join(',')}`; //输出RGB格式颜色
	 } else {
	  console.log(`Input ${hex} is wrong!`);
	  return '0,0,0';
	 }
}
