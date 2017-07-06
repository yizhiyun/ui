// 给字符串类添加判断类型的方法
//1、判断是是否是字符类型
String.prototype.isTypeString = function(){
	var value = this.toString();
	var reg = /text|varchar|char|tinytext|mediumtext|longtext|binary|varbinary|tinyblob|blob|mediumblob|longblob|enum|set/i;
	return reg.test(value);

}

// 2.判断是否是数字类型
String.prototype.isTypeNumber = function(){
	var value = this.toString();
	var reg = /int|tinyint|smallint|mediumint|bigint|decimal|float|double|real|bit|serial/i;
	return reg.test(value);
}
//3.判断是否是日期类型
String.prototype.isTypeDate = function(){
	var value = this.toString();
	var reg = /date|datetime|year|time|timestamp/i;
	return reg.test(value);
}
//4、判断是否是空间类型
String.prototype.isTypeSpace = function(){
	var value = this.toString();
	var reg = /point|geometry|linestring|polygon|multipoint|multilinestrin|multiplygon|geometrycollection/i;
	return reg.test(value);
}