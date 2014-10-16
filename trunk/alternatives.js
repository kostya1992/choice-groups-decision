var newOptions = {
	"list" : [
			{
				"key" : "Яка з дисциплін більш корисна?",
				"values" : [ "Теорія коллективного вибору",
						"Теорія алгоритмів", "Теорія систем управління",
						"Теорія нечітких множин" ]
			},
			{
				"key" : "Куди поїхати відпочивати в межах України?",
				"values" : [ "Львів", "Київ", "Карпаты" ]
			},
			{
				"key" : "Яка з дисциплін більш цікава?",
				"values" : [ "Теорія коллективного вибору",
						"Теорія алгоритмів", "Вища математика",
						"Чисельні методи" ]
			},
			{
				"key" : "Яка з кафедр краща?",
				"values" : [ "Кафедра інтелектуальних інформаційних систем",
						"Кафедра інформаційних технологій",
						"Кафедра прикладної та вищої математики" ]
			}]
};

function getSourceAlternativesHtml(alternatives) {
    var alt = '';
    if (alternatives != undefined) {
        for (var i = 0; i < alternatives.length; i++) {
            alt += '<li id="alternative_'
                + i
                + '" class="form-inline"><input type="text" class="form-control" value="'
                + alternatives[i]
                + '" /><button type="button" class="btn btn-danger btn-xs" onclick="deleteAlternative('
                + i + ')">X</button></li>';
        }
    }
    return alt;
}
$(document).ready(function() {
	console.log("ready!");
	var s = '';
	for (var i = 0; i < newOptions.list.length; i++) {
		s += "<option>" + newOptions.list[i].key + "</option> ";
	}
	$('#questions').html(s);
    var content = getSourceAlternativesHtml(newOptions.list[0].values);
    $("ul.sourceAlternatives").html(content);
});

$(function() {
	$('#question')
			.bind('input',
					function() {
						var selected = $('#question').val();
						console.log(selected);
						console.log(newOptions);
						var alternatives = [];
						for (var i = 0; i < newOptions.list.length; i++) {
							if (newOptions.list[i].key == selected) {
								alternatives = newOptions.list[i].values;
							}
						}
						console.log("===="+alternatives);
						if (alternatives != undefined) {
							var alt = '';
							for (var i = 0; i < alternatives.length; i++) {
								alt += '<li id="alternative_'
										+ i
										+ '" class="form-inline"><input type="text" class="form-control" value="'
										+ alternatives[i]
										+ '" /><button type="button" class="btn btn-danger btn-xs" onclick="deleteAlternative('
										+ i + ')">X</button></li>';
							}
							$("ul.sourceAlternatives").html(alt);
						}
					});
});