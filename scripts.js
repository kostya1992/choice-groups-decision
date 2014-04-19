/**
 * 
 */
function init() {
	window.alternativeIndex = 0;
	window.expertIndex = 0;
	window.expertFormHeight=0;
	window.addExpertFirstTime=true;
}

function addAlternative() {
	$("ul.alternatives").append(
			'<li id="alternative_' + alternativeIndex++ + '">Item '
					+ alternativeIndex + '</li>');
}
function addExpert() {
	$("ul.experts")
			.append(
					'<li id="expert_'
							+ expertIndex
							+ '"><form id ="expertForm_'
							+ expertIndex
							+ '" role="form" class="form-inline"><input type="text" class="form-control" value="Expert Name"><label type="label" name="expandLabel'
							+ expertIndex
							+ '" class="form-control" onclick="expand('
							+ expertIndex
							+ ')"> Expand</label><div id="alternativesOfEpert'
							+ expertIndex++
							+ '" class="form-control"style="display: none;"><ul name="alternatives" class="sortable alternatives"></ul></div></form></li>');
if(addExpertFirstTime){
	expertFormHeight=$('#expertForm_0').height();
}
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
	// result in double array[i][j]. i - methods, j - result by method (key -
	// alternative, value count of points)
	var result = getAllResults(alternatives);
	var s = '';
	for (var i = 0; i < result.length; i++) {
		for (key in result[i]) {
			s += key + ' ' + result[i][key] + " | ";
		}
	}

	console.log(s);
}

function getAllResults(alternatives) {
	var resultAllMethods = [];
	var bordaResult = getBordaResult(alternatives);
	resultAllMethods[0] = sortAssosiationArrayDesc(bordaResult);
	var koplendaResult = getKoplendaResult(alternatives);
	// resultAllMethods = sortAssosiationArrayDesc(koplendaResult);
	// add all methods
	return resultAllMethods;
}
function convertResult(result, alternatives) {
	var resultMethod = [];
	if (alternatives.length > 0) {
		var sortResult = sortAssosiationArrayDesc(result);
		for (key in sortResult) {
			resultMethod.push(alternatives[0][key]);
		}
	}
	console.log(sortResult);
	return resultMethod;
}
function getBordaResult(alternatives) {
	var relultMark = [];
	for (var i = 0; i < alternatives.length; i++) {
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
function arraySize(arr) {
	var size = 0;
	for (key in arr) {
		size++;
	}
	return size;
}
function sortAssosiationArrayDesc(arr) {
	var sortedKeys = [];
	var sortedObj = [];
	for (key in arr) {
		sortedKeys.push([ key, arr[key] ]);
	}
	sortedKeys.sort(function(a, b) {
		return b[1] - a[1];
	});
	for ( var i in sortedKeys) {
		sortedObj[sortedKeys[i][0]] = arr[sortedKeys[i][0]];
	}
	return sortedObj;
};

function expand(expertIndex) {
	var div = $('#alternativesOfEpert' + expertIndex);
	var form = $('#expertForm_' + expertIndex);
	if (div.css('display') == 'none') {
		div.show('slow');
		var alternLength = $('#sourceAlternatives li').length;
		form.height(form.height() + (alternLength * 25));
	} else {
		div.hide('slow');
		form.height(expertFormHeight);
	}

}