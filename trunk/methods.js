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
		s+="\n";
	}

	console.log(s);
}

function getAllResults(alternatives) {
	var resultAllMethods = [];
	var bordaResult = getBordaResult(alternatives);
	resultAllMethods[0] = sortAssosiationArrayDesc(bordaResult);
	var kondorseResult = getKonsorseResult(alternatives);
	 resultAllMethods[1] = sortAssosiationArrayDesc(kondorseResult);
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
function getKonsorseResult(alternatives) {
	var keys = _.keys(alternatives[0]);
	console.log(keys);
	var pairs = [];
	makePairs(keys, pairs);
	console.log("all possible pairs - " + JSON.stringify(pairs));
	var newArr=[];
	for ( var i = 0; i < alternatives.length; i++) {
		var k=1;
		newArr[i]=[];
		for ( var key in alternatives[i] ) {
			newArr[i][key]=k;
			k++;
		}
	}
	var comparison = [];
	_.each(pairs, function(pair) {
		var res = compare(pair[0], pair[1], newArr);
		comparison.push(res);
		//console.log(JSON.stringify(res));
	});
	console.log(comparison);
	for ( var key in comparison) {
		for ( var k in comparison[key]) {
			console.log(key+" "+k+" "+comparison[key][k]);	
		}
	}
	return comparison;
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


function compare(alt1, alt2, results) {
	return _.countBy(results, function(vote) {
		return vote[alt1] <= vote[alt2] ? alt1 : alt2;
	});
}

function makePairs(someArray, storage) {
	var rest = _.rest(someArray, 1);
	for (var i = 0; i < rest.length; i++) {
		storage.push([ someArray[0], rest[i] ]);
	}
	if (rest.length != 0)
		makePairs(rest, storage);
}

$(function() {
	$("#kondorse").on("click", function() {
		var voteResults = [ {
			alternative_0 :"0",
			alternative_2: "2",
			alternative_1 :"1"
		}, {
			alternative_1 :"1",
			alternative_0: "0",
			alternative_2 :"2"
		}, {
			alternative_2 :"2",
			alternative_1: "1",
			alternative_0 :"0"
		}, {
			alternative_0 :"0",
			alternative_1: "1",
			alternative_2 :"2"
		}];
		var result=getKonsorseResult(voteResults);
		alert("People prefer:" + JSON.stringify(result));
	});
});
$(function() {
	$("#borda").on("click", function() {
		var voteResults = [ {
			alternative_0 :"0",
			alternative_2: "2",
			alternative_1 :"1"
		}, {
			alternative_1 :"1",
			alternative_0: "0",
			alternative_2 :"2"
		}, {
			alternative_2 :"2",
			alternative_1: "1",
			alternative_0 :"0"
		}, {
			alternative_0 :"0",
			alternative_1: "1",
			alternative_2 :"2"
		}];
		var result=getKonsorseResult(voteResults);
		console.log(result);
				var sort=sortAssosiationArrayDesc(result);
					console.log(sort);
					console.log("borda:");
					
		var result=getBordaResult(voteResults);
console.log(result);
		var sort=sortAssosiationArrayDesc(result);
			console.log(sort);
	});
});

