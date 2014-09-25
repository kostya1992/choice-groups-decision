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
		$('#blockerButton').text("Alternatives chosen");
		$('#expertsList').empty();
		$('#resultButton').prop('disabled', true);
	} else {
		$('#initAlternativesDiv *').prop('disabled', true);
		$('#initAlternativesDivBlocker').addClass("blocker");
		unBlockExperts();
		alternativesCompleted = true;
		$('#blockerButton').attr("class", "btn border btn-info blockerButton");
		$('#blockerButton')
				.text(
						"Повернутися до редагування альтернатив? Всі голоса виборців будуть видалені.");
		addExpert();
		$('#resultButton').prop('disabled', false);
	}
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
$(function() {
	$('#questions')
			.change(
					function() {
						var selected = $('#questions').val();
						var newOptions = [];
						newOptions['Яка з дисциплін більш корисна?'] = [
								"Теорія коллективного вибору",
								"Теорія алгоритмів" ];
						newOptions['Куди поїхати відпочивати в межах України?'] = [
								"Львів", "Київ", "Карпаты" ];
						newOptions['Яка з дисциплін більш цікава?'] = [
								"Теорія коллективного вибору",
								"Теорія алгоритмів" ];
						newOptions['Яка з кафедр краща?'] = [
								"Кафедра інтелектуальних інформаційних систем",
								"Кафедра інформаційних технологій",
								"Кафедра прикладної та вищої математики" ];
						newOptions['Яке авто обрати?'] = [
								"BMW",
								"Mitsubishi" ];
						var alternatives = newOptions[selected];
						console.log(alternatives);
						var alt = '';
						if (alternatives != undefined) {
							for (var i = 0; i < alternatives.length; i++) {
								alt += '<li id="alternative_'
										+ i
										+ '" class="form-inline"><input type="text" class="form-control" value="'
										+ alternatives[i]
										+ '" /><button type="button" class="btn btn-danger btn-xs" onclick="deleteAlternative('
										+ i + ')">X</button></li>'
							}
						}
						$("ul.sourceAlternatives").html(alt);

					});
});