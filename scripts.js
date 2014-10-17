/**
 * 
 */
function init() {
	window.alternativeIndex = 0;
	window.expertIndex = 0;
	window.expertFormHeight = 0;
	window.addExpertFirstTime = true;
	window.alternativesCompleted = false;
	blockExperts();
	$('#resultButton').prop('disabled', true);
}

function addAlternative() {
    alternativeIndex = $("ul.sourceAlternatives li").length;
	$("ul.sourceAlternatives")
			.append(
					'<li id="alternative_'
							+ alternativeIndex
							+ '" class="form-inline" ><input type="text"class="form-control" value="Variant '
							+ alternativeIndex
							+ '"/><button type="button" id="del_alt_'
							+ alternativeIndex
							+ '" class="btn btn-danger btn-xs"  onclick="deleteAlternative('
							+ alternativeIndex + ')">X</button></li>');
	$("ul.alternatives").append(
			'<li id="alternative_' + alternativeIndex + '" >Item '
					+ alternativeIndex++ + '</li>');
}

function addAlternatives() {
	var counter = $("#addAltAmount").val();
	if (counter == "") {
		addAlternative();
	} else {
		for (var i = 0; i < counter; i++) {
			addAlternative();
		}
	}
}

function addExpert() {
	$("ul.experts")
			.append(
					'<li id="expert_'
							+ expertIndex
							+ '"><form id ="expertForm_'
							+ expertIndex
							+ '" role="form" class="form-inline"><input type="text" class="form-control"  placeholder="Виборець"><label type="label" name="expandLabel'
							+ expertIndex
							+ '" class="form-control" onclick="expand('
							+ expertIndex
							+ ')"> Ранжувати</label><button type="button" class="btn btn-danger btn-xs" onclick="deleteExpert('
							+ expertIndex
							+ ')">X</button><div id="alternativesOfEpert'
							+ expertIndex
							+ '" class="rating-block" style="display: none;"><ul name="alternatives" class="sortable alternatives"></ul></div></form></li>');
	if (addExpertFirstTime) {
		expertFormHeight = $('#expertForm_0').height();
	}
	var cloned = $('#sourceAlternatives').clone();
	cloned.find('li').each(function() {
		inputEl = $(this).children().first();
		var liCloned = $(this).clone();
		liCloned.empty();
		liCloned.append(inputEl.val());
		$('#alternativesOfEpert' + expertIndex + ' ul').append(liCloned);
	});
	$(".sortable").sortable();
	expertIndex++;
}
function addExpertBy(expertIndex,source) {
    $("ul.experts")
        .append(
            '<li id="expert_'
            + expertIndex
            + '"><form id ="expertForm_'
            + expertIndex
            + '" role="form" class="form-inline"><input type="text" class="form-control"  placeholder="Виборець"><label type="label" name="expandLabel'
            + expertIndex
            + '" class="form-control" onclick="expand('
            + expertIndex
            + ')"> Ранжувати</label><button type="button" class="btn btn-danger btn-xs" onclick="deleteExpert('
            + expertIndex
            + ')">X</button><div id="alternativesOfEpert'
            + expertIndex
            + '" class="rating-block" style="display: none;"><ul name="alternatives" class="sortable alternatives"></ul></div></form></li>');
    if (addExpertFirstTime) {
        expertFormHeight = $('#expertForm_0').height();
    }
    var alterMap = getSourceAlterntatives();
    var alternativesContent = getSourceAlternativesHtml(source);
   _.each(source,function(item) {
        var option = "<li id='"+item+"' class='form-inline'>"+alterMap[item]+"</li>";
        $('#alternativesOfEpert' + expertIndex + ' ul').append(option);
    });
    $(".sortable").sortable();
}

function addExperts() {
	var counter = $("#addExpAmount").val();
	if (counter == "") {
		addExpert();
	} else {
		for (var i = 0; i < counter; i++) {
			addExpert();
		}
	}
}

// function for sort list
$(function() {
	$(".sortable").sortable();
});

function expand(expertIndex) {
	var div = $('#alternativesOfEpert' + expertIndex);
	var form = $('#expertForm_' + expertIndex);
	if (div.css('display') == 'none') {
		div.show('fast');
	} else {
		div.hide('fast');
	}

}
function deleteAlternative(index) {
	var idForDelte = "alternative_" + index;
	document.getElementById(idForDelte).remove();
}
function deleteExpert(index) {
	var idForDelte = "expert_" + index;
	document.getElementById(idForDelte).remove();
}

function msg(text) {
	var div = $("#msg");
	div.text(text);
	div.show('slow').delay(4000).fadeOut();
}

function blockAlternatives() {
	if (alternativesCompleted) {
		unBlockAlternatives();
		blockExperts();
		alternativesCompleted = false;
		$('#blockerButton').attr("class", "btn btn-info border");
		$('#blockerButton').text("Альтернативи обрано");
		$('#expertsList').empty();
		$('#resultButton').prop('disabled', true);
	} else {
		blockFirstStep();
		unBlockExperts();
		alternativesCompleted = true;
		addExpert();
	}
}

function blockFirstStep(){
    $('#initAlternativesDiv *').prop('disabled', true);
    $('#initAlternativesDivBlocker').addClass("blocker");
    $('#blockerButton').attr("class", "btn border btn-info blockerButton");
    $('#blockerButton')
        .text(
        "Повернутися до редагування альтернатив? Всі голоса виборців будуть видалені.");
    $('#resultButton').prop('disabled', false);
}

function unBlockAlternatives() {
	$('#initAlternativesDiv *').prop('disabled', false);
	$('#initAlternativesDivBlocker').removeClass("blocker");
}
function blockExperts() {
	$('#initExpertsDiv *').prop('disabled', true);
	$('#initExpertsDivBlocker').addClass("blocker");
}
function unBlockExperts() {
	$('#initExpertsDiv *').prop('disabled', false);
	$('#initExpertsDivBlocker').removeClass("blocker");
}
function getSourceAlterntatives() {
    var alterNames = {};
    var alterElem = $("#sourceAlternatives li");
    _.each(alterElem, function (elem) {
        var id = $(elem).attr("id");
        var value = $(elem).find("input").val();
        alterNames[id] =value
    });
    return alterNames;
}

function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];

    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            var contents = JSON.parse(e.target.result);
            var alters = _.values(contents.source);
            var content = getSourceAlternativesHtml(alters);
            $("ul.sourceAlternatives").html(content);
            blockFirstStep();
            unBlockExperts();
            alternativesCompleted = true;
            _.each(contents.ranged, function(item, index){
                addExpertBy(index,item)
            })
        }
        r.readAsText(f);
    } else {
        alert("Failed to load file");
    }
}
$(function() {
    $("#show-profile").click(function(){
        $("#profile .decorated").empty();
        var alternatives = getRangedAlternatives();
        var profile = getVotingProfile(alternatives).profile;
        var alterNames = getSourceAlterntatives();
//        $("#profile table").append('<tr class="warning"><th>Вподобання</th><th>Кількість виборців</th></tr>');
        var categories = [];
        var series = [];
        for(var i=0; i<alternatives.length; i++){
            var key = 'alternative_'+i;
            series.push({name:alterNames[key],data:[]});
        }
        for(var i=0; i<profile.length; i++){
            var pair = profile[i];
            var keys = _.keys(pair);
            var alter1 = keys[0];
            var alter2 = keys[1];
            var title = alterNames[alter1] +" - "+alterNames[alter2];
            categories.push(title);
            for(var j=0;j<series.length;j++){
                if(series[j].name == alterNames[alter1]){
                    series[j].data[i]= pair[alter1];
                    for(var k=0;k<series.length;k++){
                        if(series[k].name == alterNames[alter2] && series[k].name!=alterNames[alter1]){
                            series[k].data[i]= pair[alter2];
                        }
                    }
                }
                for(var k=0;k<series[j].data.length;k++){
                    if(series[j].data[k] == undefined){
                        series[j].data[k] = 0;
                    }
                }
            }
            var row1 = "<tr><td>" + alterNames[ alter1] +" > "+alterNames[ alter2]+ "</td><td>" +pair[alter1] +"</td></tr>";
            $("#profile tbody.decorated").append(row1);
            var row2 = "<tr><td>" + alterNames[alter2] +" > "+alterNames[alter1]+ "</td><td>" +pair[alter2] +"</td></tr>";
            $("#profile tbody.decorated").append(row2);
        }
        console.log(categories);
        console.log(series);
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Графік'
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -70,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {

            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            series: series
        });
        $("#profile").show();
    });

    $("#save").click(function(){
        var alternatives = getSourceAlterntatives();
        var rangedAlternatives = getRangedAlternatives();
//        var data = {a:1, b:2, c:3};
        var json = JSON.stringify({source:alternatives, ranged:rangedAlternatives});
        var blob = new Blob([json], {type: "application/json"});
        saveAs(blob, "voting.json");
    })

    $("#load-link").click(function(){
        $('#fileinput').click();
    })
    document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
});