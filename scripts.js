/**
 * 
 */
function init() {
	window.alternativeIndex = 4;
	window.expertIndex = 0;
	window.expertFormHeight = 0;
	window.addExpertFirstTime = true;
}

function addAlternative() {
	$("ul.sourceAlternatives").append(
			'<li id="alternative_' + alternativeIndex++
					+ '" ><input type="text"class="form-control" value="Item ' + alternativeIndex
					+ '"/></li>');
	$("ul.alternatives").append(
			'<li id="alternative_' + alternativeIndex
					+ '" >Item ' + alternativeIndex+'</li>');
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
							+ expertIndex
							+ '" class="form-control" style="display: none;"><ul name="alternatives" class="sortable alternatives"></ul></div></form></li>');
	if (addExpertFirstTime) {
		expertFormHeight = $('#expertForm_0').height();
	}
	var cloned = $('#sourceAlternatives').clone();
	cloned.find('li').each(function(){
	     inputEl = $(this).children().first();
	     var liCloned=$(this).clone();
	     liCloned.empty();
	     liCloned.append(inputEl.val());
	 	$('#alternativesOfEpert' + expertIndex + ' ul').append(liCloned);
	   });
	$(".sortable").sortable();
	expertIndex++;
}

// function for sort list
$(function() {
	$(".sortable").sortable();
});

function expand(expertIndex) {
	var div = $('#alternativesOfEpert' + expertIndex);
	var form = $('#expertForm_' + expertIndex);
	if (div.css('display') == 'none') {
		div.show('slow');
		var alternLength = $('#sourceAlternatives li').length;
		form.height(form.height() + (alternLength * 28));
	} else {
		div.hide('slow');
		form.height(expertFormHeight);
	}

}

function msg(text) {
	var div = $("#msg");
	div.text(text);
	div.show('slow').delay(4000).fadeOut();
}