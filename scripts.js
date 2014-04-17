/**
 * 
 */

function showMessage(){
alert("Hello!");
}
//function for sort list
$(function() {
    $(".sortable").sortable();
});

//process by all methods  
function process(){
	var experts=document.getElementsByName("expert");
	var alternatives = [];
	var childNodes=[];
	for(var i=0;i<experts.length;i++){
		alternatives[i]=[];
		childNodes=experts[i].getElementsByTagName('li');
		for(var j=0;j<childNodes.length;j++){
				alternatives[i][childNodes[j].id]=childNodes[j].innerText;
		}
	}
	//result in double array[i][j]. i - methods, j - result by method 
	var result = getAllResults(alternatives, childNodes);
	alert(result);
}

function getAllResults(alternatives,childNodes){
	var resultAllMethods = [];
	var bordaResult = getBordaResult(alternatives);
	resultAllMethods=convertResult(resultAllMethods, 0, bordaResult, childNodes);
	var koplendaResult = getKoplendaResult(alternatives);
	resultAllMethods=convertResult(resultAllMethods, 1, koplendaResult, childNodes);
	//add all methods
	return resultAllMethods;
}
function convertResult(resultAllMethods,i,result,childNodes){
	resultAllMethods[i]=[];
	for (key in result) {
		resultAllMethods[i].push(childNodes[key].innerText);
	}
	return resultAllMethods;
}
function getBordaResult(alternatives){
	//TODO implement Method Borda
	return alternatives[0];
}
function getKoplendaResult(alternatives){
	//TODO implement Method Koplenda
	return alternatives[0];
}