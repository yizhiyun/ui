// 给字符串类添加判断类型的方法
//1、判断是是否是字符类型
String.prototype.isTypeString = function(){
	var value = this.toString();
	var reg = /text|varchar|char|tinytext|mediumtext|longtext|binary|varbinary|tinyblob|blob|mediumblob|longblob|enum|set|StringType|BinaryType/i;
	return reg.test(value);
}

// 2.判断是否是数字类型
String.prototype.isTypeNumber = function(){
	var value = this.toString();
	var reg = /int|tinyint|smallint|mediumint|bigint|decimal|float|double|real|bit|serial|BooleanType|DecimalType|DoubleType|FloatType|ByteType|IntegerType|LongType|ShortType|number/i;
	return reg.test(value);
}
//3.判断是否是日期类型
String.prototype.isTypeDate = function(){
	var value = this.toString();
	var reg = /date|datetime|year|time|timestamp|DateType|TimestampType/i;
	return reg.test(value);
}
//4、判断是否是空间类型
String.prototype.isTypeSpace = function(){
	var value = this.toString();
	var reg = /point|geometry|linestring|polygon|multipoint|multilinestrin|multiplygon|geometrycollection|MapType/i;
	return reg.test(value);
}
//5、判断是否是null类型
String.prototype.isTypeNone = function(){
	var value = this.toString();
	var reg = /NullType|null|none/i;
	return reg.test(value);
}


//6、判断是否是维度还是度量
String.prototype.w_d_typeCat = function(){
	var value = this.toString();
	if (value.isTypeDate() || value.isTypeString() || value.isTypeSpace()) {
		return "dimensionality"; //dimension 维度
	}else{
		return "measure"; //measured 度量
	}
}


// 7.数据类型图片配对
String.prototype.image_Name_Find = function(measureOrDime){
	var value = this.toString();
	if (value.isTypeDate()) {
		return "/static/dataCollection/images/tableDataDetail/date.png";
	}else if (value.isTypeNumber()) {
		if(measureOrDime == "dimensionality"){
			return "/static/dataCollection/images/tableDataDetail/integer_weidu.png";
		}
		return "/static/dataCollection/images/tableDataDetail/integer_duliang.png";

	}else if (value.isTypeString()) {
		if(measureOrDime == "measure"){
			return "/static/dataCollection/images/tableDataDetail/string_duliang.png";
		}
		return "/static/dataCollection/images/tableDataDetail/string_weidu.png";
	}else if (value.isTypeSpace()) {
		return "/static/dataCollection/images/tableDataDetail/geography.png";
	}else{
		return "/static/dataCollection/images/tableDataDetail/string_weidu.png";
	}
}
// 检测输入的算法是否正确，有待完善，目前只是简单的检测
function  measureCalculateVertify (formula) {
	//1、剔除空白符号
	formula = formula.replace(/\s/g, '');
	//2、字符长度小于1
	if(formula.length < 1){
		return false;
	}
	//3、运算符连续
	if( /[\+\-\*\/]{2,}/.test(formula) ){
            return false;
    }
    //4、括号不匹配
     var leftbrackets = [];
     var rightbrackets = [];
    for(var i = 0; i < formula.length; i++){
        var item = formula.charAt(i);
        if('(' == item){
            leftbrackets.push('(');
        }else if(')' == item){
            rightbrackets.push(')');
        }
    }
    if(leftbrackets.length != rightbrackets.length){
    	return false;
    }
    //5、左小括号后面不能直接跟运算符号
	if(/\([\+\-\*\/]/.test(formula)){
	    return false;
	}
     //6、)前面是运算符
    if(/[\+\-\*\/]\)/.test(formula)){
        return false;
    }
    return true;
}
String.prototype.visualLength = function(fontSize)
{
	var ruler = $("#calculateTextWidth");
	ruler.css("font-size",fontSize);
	ruler.text(this);
	return ruler[0].offsetWidth;
}

// 根据数据库名字获得图片地址
String.prototype.dataBaseImgSrc = function(){
	var value = this.toString();
	switch (value) {
		case "ORACLE":
				return "/static/dataCollection/images/oracle.png";
		case "MYSQL":
				return "/static/dataCollection/images/mysql.png";
		case "SQLSERVER":
				return "/static/dataCollection/images/sqlserver.png";
		case"北京儿童医院辅助决策平台":
				return "/static/dataCollection/images/childHospital.png";
		case "朝阳医院精细化管理平台":
				return "/static/dataCollection/images/chaoyangHospital.png";
		default:

	}
}
