// process by all methods
function process() {
	var alternatives = getAlternatives();
	var result = getAllResults(alternatives);
	console.log(result);
	alert(result);
}

function getAllResults(alternatives) {
	console.log(JSON.stringify(alternatives));
	var alternativesValue = [];
	for ( var i = 0; i < 4; i++) {
		alternativesValue["alternative_" + i] = $(
				"#alternative_" + i + " input").val();
	}
	var resultAllMethods = [];
	var bordaResult = getBordaResult(alternatives);
	resultAllMethods[0] = alternativesValue[bordaResult[0]];
	var kondorseResult = getKondorseResult(alternatives);
	resultAllMethods[1] = alternativesValue[kondorseResult[0]];
	var simpsonaResult = getSimpsonsResult(alternatives);
	resultAllMethods[2] = alternativesValue[simpsonaResult[0]];
	return resultAllMethods;
}

function getBordaResult(alternatives) {
	var relultMark = [];
	for ( var i = 0; i < alternatives.length; i++) {
		var altCount = 1;
		var alternativeCount = alternatives[i].length;
		for ( var j = 0; j < alternativeCount; j++) {
			var key = alternatives[i][j];
			if (!relultMark.hasOwnProperty(key)) {
				relultMark[key] = 0;
			}
			relultMark[key] += (alternativeCount - altCount);
			altCount++;
		}
	}
	return sortAssosiationArrayDesc(relultMark);
}
function getKoplendaResult(alternatives) {
	// TODO implement Method Koplenda
	return alternatives[0];
}

function getSimpsonsResult(alternatives) {
	var pairs = [];
	var alters = alternatives[0];
	makeSimpsonPairs(alternatives[0], pairs);
	for ( var i = 0; i < alternatives.length; i++) {
		var tmp = alternatives[i];
		// console.log("Current expert decision = " + tmp);
		var countPair = countSimpson(tmp, pairs);
		var tmpPair = _.findWhere(pairs, [ countPair[0], countPair[1] ]);
		var index = _.indexOf(pairs, tmp);
		tmpPair[2] = countPair[2];
		pairs[index] = countPair;
	}

	var compairs = [];
	var count = 0;
	for ( var i = 0; i < pairs.length; i++) {
		var currentPair = pairs[i];
		var pair = _.findWhere(pairs, [ currentPair[1], currentPair[0] ]);
		// console.log(currentPair + " vs " + pair);
		if (currentPair[2] <= pair[2]) {
			compairs[count] = currentPair;
			count++;
		}

	}
	for ( var i = 0; i < compairs.length; i++) {
		var currentPair = compairs[i];
		var pair = _.findWhere(compairs, [ currentPair[1], currentPair[0] ]);
		if (typeof (pair) != 'undefined') {
			compairs.splice(i, 1);
		}
	}

	var best = _.max(compairs, function(compairs) {
		return compairs[2];
	});
	return best;
}

function countSimpson(tmp, pairs) {
	var tmpPair = [];
	for ( var i = 0; i < tmp.length; i++) {
		for ( var j = 0; j < tmp.length; j++) {
			if (tmp[i] != tmp[j]) {
				// console.log("Current pair = " + tmp[i] + " vs " + tmp[j]);
				var indexI = _.indexOf(tmp, tmp[i]);
				var indexJ = _.indexOf(tmp, tmp[j]);
				tmpPair = _.findWhere(pairs, [ tmp[i], tmp[j] ]);
				if (indexI < indexJ) {
					tmpPair = _.findWhere(pairs, [ tmp[i], tmp[j] ]);
					tmpPair[2]++;
				}
				// console.log("Current pair in PAIRS = " + tmpPair[0] + " vs "
				// + tmpPair[1] + "; value = " + tmpPair[2]);
			}
		}
	}
	return tmpPair;
}
function makeSimpsonPairs(someArray, storage) {
	for ( var i = 0; i < someArray.length; i++) {
		for ( var j = 0; j < someArray.length; j++) {
			storage.push([ someArray[i], someArray[j], 0 ]);
		}
	}
	for ( var i = 0; i < storage.length; i++) {
		var tmp = storage[i];
		if (tmp[0] == tmp[1]) {
			storage.splice(i, 1);
		}
	}
}

function getKondorseResult(alternatives) {
	var pairs = [];
	makePairs(alternatives[0], pairs);
	// console.log("all possible pairs - " + JSON.stringify(pairs));
	var comparisonResult = [];
	var comparisonArr = [];
	_.each(pairs, function(pair) {
		var comparedGroup = compare(pair[0], pair[1], alternatives);
		if (!_.has(comparedGroup, pair[0])) {
			var obj = {};
			obj[pair[0]] = 0;
			_.extend(comparedGroup, obj);
		}
		if (!_.has(comparedGroup, pair[1])) {
			var obj = {};
			obj[pair[1]] = 0;
			_.extend(comparedGroup, obj);
		}
		comparisonResult.push(comparedGroup);
		var sortedPairs = _.sortBy(_.pairs(comparedGroup), function(pair) {
			return -1 * pair[1];
		});
		comparisonArr.push([ sortedPairs[0][0], sortedPairs[1][0] ]);
	});
	// console.log("Comparison result by Kondorse : "
	// + JSON.stringify(comparisonResult));
	var rating = [];
	rating.push(comparisonArr[0][0]);
	rating.push(comparisonArr[0][1]);
	kondorseBackward(_.rest(comparisonArr), comparisonArr[0], rating);
	kondorseForward(_.rest(comparisonArr), comparisonArr[0], rating);
	// alert("The winner is " + $("#" + rating[0] + " input").val());
	return rating;
}

function kondorseBackward(comparisonArr, pair, rating) {
	// console.log("backward =" + JSON.stringify(comparisonArr));
	var first = pair[0];
	var betterPair = _.find(comparisonArr, function(value) {
		return value[1] == first;
	});
	if (betterPair != undefined) {
		rating.splice(_.indexOf(rating, first), 0, betterPair[0]);
		var rest = _.without(comparisonArr, betterPair);
		kondorseBackward(rest, betterPair, rating);
	}
}

function kondorseForward(comparisonArr, pair, rating) {
	// console.log("forward=" + JSON.stringify(comparisonArr));
	var last = pair[1];
	var worsePair = _.find(comparisonArr, function(value) {
		return value[0] == last;
	});
	if (worsePair != undefined) {
		rating.push(worsePair[1]);
		var rest = _.without(comparisonArr, worsePair);
		kondorseForward(rest, worsePair, rating);
	}
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
		sortedObj.push(sortedKeys[i][0]);
	}
	return sortedObj;
};

function compare(alt1, alt2, results) {
	return _.countBy(results, function(vote) {
		return _.indexOf(vote, alt1) <= _.indexOf(vote, alt2) ? alt1 : alt2;
	});
}

function makePairs(someArray, storage) {
	var rest = _.rest(someArray, 1);
	for ( var i = 0; i < rest.length; i++) {
		storage.push([ someArray[0], rest[i] ]);
	}
	if (rest.length != 0)
		makePairs(rest, storage);
}

function getAlternatives() {
	var voteResults = [];
	if ($(".alternatives") != undefined) {
		$(".alternatives").each(function() {
			var alternativesList = [];
			$(this).find("li").each(function(index) {
				alternativesList.push($(this).attr("id"));
			});
			voteResults.push(alternativesList);
		});
	}
	return voteResults;
}
