/**
 * 
 */

function showMessage(){
alert("Все ОК!");
}
//function for sort list
$(function() {
    $(".sortable").sortable();
});

//process by all methods  
function process(){
	var experts=document.getElementsByName("expert");
	var alternatives = [];
	for(i=0;i<experts.length;i++){
		alternatives[i]=[];
		var childNodes=experts[i].getElementsByTagName('li');
		for(j=0;j<childNodes.length;j++){
				alternatives[i][j]=childNodes[j].id;
			}
	}
	alert(alternatives);
	//TODO: add invocation of all methods
	
}