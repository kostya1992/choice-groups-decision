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
			s += key + ' - ' + result[i][key][0] + " - " + result[i][key][1]
					+ " | ";
		}
		s += "\n";
	}
	alert(s);
	console.log(s);
}

function getAllResults(alternatives) {
	var resultAllMethods = [];
	var bordaResult = getBordaResult(alternatives);
	resultAllMethods[0] = convertResult(bordaResult, alternatives);// sortAssosiationArrayDesc(bordaResult);
	// var kondorseResult = getKondorseResult(alternatives);
	// resultAllMethods[1] = sortAssosiationArrayDesc(kondorseResult);
	// add all methods
	return resultAllMethods;
}
function convertResult(result, alternatives) {
	var resultMethod = [];
	if (alternatives.length > 0) {
		var sortResult = sortAssosiationArrayDesc(result);
		for (key in sortResult) {
			resultMethod.push([ alternatives[0][key], sortResult[key] ]);
		}
	}
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

function getSimpsonsResult(alternatives) {
	var pairs = [];
	makeSimpsonPairs(alternatives[0], pairs);
	for (var i = 0; i < alternatives.length; i++) {
		var tmp = alternatives[i];
		console.log("Current expert decision = " + tmp);
		var countPair = countSimpson(tmp, pairs);
		var tmpPair = _.findWhere(pairs, [ countPair[0], countPair[1] ]);
		var index = _.indexOf(pairs,tmp);
		tmpPair[2] = countPair[2];
		pairs[index] = countPair;
	}
	// alert(JSON.stringify(alternatives))
	 alert("all possible pairs - " + JSON.stringify(pairs));
}

function countSimpson(tmp, pairs) {
	var tmpPair;
	for (var i = 0; i < tmp.length; i++) {
		for (var j = 0; j < tmp.length; j++) {
			if (tmp[i] != tmp[j]) {
				console.log("Current pair = " + tmp[i] + " vs " + tmp[j]);
				var indexI = _.indexOf(tmp, tmp[i]);
				var indexJ = _.indexOf(tmp, tmp[j]);
				tmpPair = _.findWhere(pairs, [ tmp[i], tmp[j] ]);
				if (indexI < indexJ) {
					tmpPair = _.findWhere(pairs, [ tmp[i], tmp[j] ]);
					tmpPair[2]++;
				}
				console.log("Current pair in PAIRS = " + tmpPair[0] + " vs "
						+ tmpPair[1] + "; value = " + tmpPair[2]);
			}
		}
	}
	return tmpPair;
}
function makeSimpsonPairs(someArray, storage) {
	for (var i = 0; i < someArray.length; i++) {
		for (var j = 0; j < someArray.length; j++) {
			storage.push([ someArray[i], someArray[j], 0 ]);
		}
	}
	for (var i = 0; i < storage.length; i++) {
		var tmp = storage[i];
		if (tmp[0] == tmp[1]) {
			storage.splice(i, 1);
		}
	}
}

function getKondorseResult(alternatives) {
	var pairs = [];
	makePairs(alternatives[0], pairs);
	console.log("all possible pairs - " + JSON.stringify(pairs));
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
	console.log("Comparison result by Kondorse : "
			+ JSON.stringify(comparisonResult));
	var rating = [];
	rating.push(comparisonArr[0][0]);
	rating.push(comparisonArr[0][1]);
	kondorseBackward(_.rest(comparisonArr), comparisonArr[0], rating);
	kondorseForward(_.rest(comparisonArr), comparisonArr[0], rating);
	alert("The winner is " + $("#" + rating[0] + " input").val());
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
		return _.indexOf(vote, alt1) <= _.indexOf(vote, alt2) ? alt1 : alt2;
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
	$("#simpson")
			.on(
					"click",
					function() {
						var voteResults = [];
						if ($(".experts") != undefined) {
							$(".experts > li")
									.each(
											function(index) {
												var alternativesSelector = "#alternativesOfEpert"
														+ index + " li";
												var alternativesList = [];
												$(".experts")
														.find(
																alternativesSelector)
														.each(
																function() {
																	alternativesList
																			.push($(
																					this)
																					.attr(
																							"id"));
																})
												voteResults
														.push(alternativesList);
											})
						}
						console.log(JSON.stringify(voteResults));
						if (voteResults.length != 0) {
							getSimpsonsResult(voteResults);
						} else {
							alert("Vote results aren't specified");
						}
					});
});

$(function() {
	$("#kondorse")
			.on(
					"click",
					function() {
						var voteResults = [];
						if ($(".experts") != undefined) {
							$(".experts > li")
									.each(
											function(index) {
												var alternativesSelector = "#alternativesOfEpert"
														+ index + " li";
												var alternativesList = [];
												$(".experts")
														.find(
																alternativesSelector)
														.each(
																function() {
																	alternativesList
																			.push($(
																					this)
																					.attr(
																							"id"));
																})
												voteResults
														.push(alternativesList);
											})
						}
						console.log(JSON.stringify(voteResults));
						if (voteResults.length != 0) {
							getKondorseResult(voteResults);
						} else {
							alert("Vote results aren't specified");
						}
					});
});
$(function() {
	$("#borda").on("click", function() {
		var voteResults = [ {
			alternative_0 : "0",
			alternative_2 : "2",
			alternative_1 : "1"
		}, {
			alternative_1 : "1",
			alternative_0 : "0",
			alternative_2 : "2"
		}, {
			alternative_2 : "2",
			alternative_1 : "1",
			alternative_0 : "0"
		}, {
			alternative_0 : "0",
			alternative_1 : "1",
			alternative_2 : "2"
		} ];
		var result = getKonsorseResult(voteResults);
		console.log(result);
		var sort = sortAssosiationArrayDesc(result);
		console.log(sort);
		console.log("borda:");

		var result = getBordaResult(voteResults);
		console.log(result);
		var sort = sortAssosiationArrayDesc(result);
		console.log(sort);
	});
});
