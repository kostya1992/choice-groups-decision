/**
 * 
 */

function showMessage() {
	alert("Hello!");
}
// function for sort list
$(function() {
	$(".sortable").sortable();
});

// process by all methods
function process() {
	var experts = document.getElementsByName("alternatives");
	var alternatives = [];
	var childNodes = [];
	for (var i = 0; i < experts.length; i++) {
		alternatives[i] = [];
		childNodes = experts[i].getElementsByTagName('li');
		for (var j = 0; j < childNodes.length; j++) {
			alternatives[i][childNodes[j].id] = childNodes[j].innerText;
		}
	}
	// result in double array[i][j]. i - methods, j - result by method
	var result = getAllResults(alternatives);
	var s='';
	for (var i = 0; i < result.length; i++) {
		for (key in result[i]) {
			s+=key+' '+result[i][key]+" | ";
		}
	}
	
	alert(s);
}

function getAllResults(alternatives) {
	var resultAllMethods = [];
	var bordaResult = getBordaResult(alternatives);
	resultAllMethods = convertResult(resultAllMethods, 0, bordaResult,
			alternatives);
	var koplendaResult = getKoplendaResult(alternatives);
	resultAllMethods = convertResult(resultAllMethods, 1, koplendaResult,
			alternatives);
	// add all methods
	return resultAllMethods;
}
function convertResult(resultAllMethods, i, result, alternatives) {
	resultAllMethods[i] = [];
	if (alternatives.length > 0) {
		for (key in result) {
			resultAllMethods[i].push(alternatives[0][key]);
		}
	}
	return resultAllMethods;
}
function getBordaResult(alternatives) {
	var relultMark = [];
	var expertCount = alternatives.length;

	for (var i = 0; i < expertCount; i++) {
		var altCount = 1;
		var alternativeCount = arraySize(alternatives[i]);
		for (key in alternatives[i]) {
			if (!relultMark.hasOwnProperty(key)) {
				relultMark[key] = 0;
			}
			relultMark[key] += (alternativeCount - altCount);
			altCount++;
		}
	}
	return relultMark;
}
function getKoplendaResult(alternatives) {
	// TODO implement Method Koplenda
	return alternatives[0];
}
function arraySize(obj) {
	var size = 0;
	for (key in obj) {
		size++;
	}
	return size;
};