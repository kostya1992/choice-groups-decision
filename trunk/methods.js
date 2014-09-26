// process by all methods
function process() {
	var alternatives = getAlternatives();
	console.log(JSON.stringify(alternatives));
	var result = getAllResults(alternatives);
	var alternativesValue = [];
	for ( var i = 0; i < $("#sourceAlternatives li").length; i++) {
		alternativesValue["alternative_" + i] = $(
				"#alternative_" + i + " input").val();
	}
	console.log(JSON.stringify(result));
	var resultTable = "<table class='table table-bordered'>";
	resultTable += "<tr><th>Метод Борда</th><th>Метод Кондорсе</th><th>Метод Сімпсона</th><th>Метод Копленда</th></tr>";
	for ( var i = 0; i < result[0].length; i++) {
		resultTable += "<tr>";
		for ( var j = 0; j < 4; j++) {
			if (i == 0 && j == 2) {
				resultTable += "<td>";
				for ( var k = 0; k < result[j].length; k++) {
					resultTable+=alternativesValue[result[j][k]]+" ";
				}
				resultTable += "</td>";
			} else if (j == 2) {
				resultTable += "<td></td>";
			} else {
				resultTable += "<td>" + alternativesValue[result[j][i]]
						+ "</td>";
			}
		}
		resultTable += "</tr>";
	}
	resultTable += "</table>";
	$("#resultDiv").html(resultTable);
}

function getAllResults(alternatives) {
	var resultAllMethods = [];
	var bordaResult = getBordaResult(alternatives);
	resultAllMethods[0] = bordaResult;
	var kondorseResult = getKondorseResult(alternatives);
	resultAllMethods[1] = kondorseResult;
	var simpsonaResult = getSimpsonsResult(alternatives);
	resultAllMethods[2] = simpsonaResult;
	var koplandResult = getKoplandResult(alternatives);
	resultAllMethods[3] = koplandResult;
	return resultAllMethods;
}

function getKoplandResult(alternatives) {
	var pairs = [];
	makePairs(alternatives[0], pairs);
	var alternativeMarkMap = {};
	for ( var i = 0; i < alternatives[0].length; i++) {
		alternativeMarkMap[alternatives[0][i]] = 0;
	}
	for ( var j = 0; j < alternatives.length; j++) {
		var expert = alternatives[j];
		for ( var n = 0; n < pairs.length; n++) {
			if (expert.indexOf(pairs[n][0]) > expert.indexOf(pairs[n][1])) {
				alternativeMarkMap[pairs[n][0]] = alternativeMarkMap[pairs[n][0]] + 1;
				alternativeMarkMap[pairs[n][1]] = alternativeMarkMap[pairs[n][1]] - 1;
			} else if (expert.indexOf(pairs[n][0]) < expert
					.indexOf(pairs[n][1])) {
				alternativeMarkMap[pairs[n][0]] = alternativeMarkMap[pairs[n][0]] - 1;
				alternativeMarkMap[pairs[n][1]] = alternativeMarkMap[pairs[n][1]] + 1;
			}
		}
	}
	var sortedAlts = sortAssosiationArray(alternativeMarkMap, false);
	return sortedAlts;
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
	return sortAssosiationArray(relultMark, true);
}

function getSimpsonsResult(alternatives) {
	var pairs = [];
	makeSimpsonPairs(alternatives[0], pairs);
	for ( var i = 0; i < alternatives.length; i++) {
		var tmp = alternatives[i];
		var countPair = countSimpson(tmp, pairs);
		var tmpPair = _.findWhere(pairs, [ countPair[0], countPair[1] ]);
		var index = _.indexOf(pairs, tmp);
		tmpPair[2] = countPair[2];
		pairs[index] = countPair;
	}
	console.log(JSON.stringify(pairs));
	var compairs = [];
	var count = 0;
	for ( var i = 0; i < pairs.length; i++) {
		var currentPair = pairs[i];
		var pair = _.findWhere(pairs, [ currentPair[1], currentPair[0] ]);
		if (currentPair[2] <= pair[2]) {
			compairs[count] = currentPair;
			count++;
		}
	}
	var b = _.max(compairs, function(compairs) {
		return compairs[2];
	});
	var best = _.filter(compairs, function(compair) {
		return compair[2] == b[2];
	});
	var mass = [];
	for ( var i = 0; i < best.length; i++) {
		for ( var j = 0; j < 2; j++) {
			mass.push(best[i][j]);
		}
	}
	mass=_.uniq(mass);
	console.log(JSON.stringify(mass));
	var best = _.filter(mass, function(element) {
		for ( var i = 0; i < pairs.length; i++) {
			if(pairs[i][0]==element && pairs[i][2]==0){
				return false;
			}
		}
		return true;
	});
	console.log(JSON.stringify(best));
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

function getVotingProfile(alternatives) {
    var pairs = [];
    makePairs(alternatives[0], pairs);
    var comparisonResult = [];
    var comparisonArr = [];
    _.each(pairs, function (pair) {
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
        var sortedPairs = _.sortBy(_.pairs(comparedGroup), function (pair) {
            return -1 * pair[1];
        });
        comparisonArr.push([ sortedPairs[0][0], sortedPairs[1][0] ]);
    });
    return {comparisonArr:comparisonArr, profile:comparisonResult};
}

function getKondorseResult(alternatives) {

    var votingProfile = getVotingProfile(alternatives);
	var rating = [];
	rating.push(votingProfile.comparisonArr[0][0]);
	rating.push(votingProfile.comparisonArr[0][1]);
	kondorseBackward(_.rest(votingProfile.comparisonArr), votingProfile.comparisonArr[0], rating);
	kondorseForward(_.rest(votingProfile.comparisonArr), votingProfile.comparisonArr[0], rating);
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

function sortAssosiationArray(arr, isDesc) {
	var sortedKeys = [];
	var sortedObj = [];
	for (key in arr) {
		sortedKeys.push([ key, arr[key] ]);
	}
	if (isDesc) {
		sortedKeys.sort(function(a, b) {
			return b[1] - a[1];
		});
	} else {
		sortedKeys.sort(function(a, b) {
			return a[1] - b[1];
		});
	}
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
