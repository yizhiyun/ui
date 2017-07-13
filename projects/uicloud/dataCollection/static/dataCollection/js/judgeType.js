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
	var reg = /int|tinyint|smallint|mediumint|bigint|decimal|float|double|real|bit|serial|BooleanType|DecimalType|DoubleType|FloatType|ByteType|IntegerType|LongType|ShortType/i;
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
String.prototype.image_Name_Find = function(){
	var value = this.toString();
	if (value.isTypeDate()) {
		return "/static/dataCollection/images/tableDataDetail/date.png";
	}else if (value.isTypeNumber()) {
		return "/static/dataCollection/images/tableDataDetail/Integer.png";
	}else if (value.isTypeString()) {
		return "/static/dataCollection/images/tableDataDetail/String.png";
	}else if (value.isTypeSpace()) {
		return "/static/dataCollection/images/tableDataDetail/geography.png";
	}else{
		return "/static/dataCollection/images/tableDataDetail/String.png";
	}
}
