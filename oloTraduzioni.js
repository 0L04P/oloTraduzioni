	$(document).ready(function(){	 
		pCreaLocalStorageVuoto();
		popolaElenco();
	});
	function pGetLocalStorage(){
		console.log(localStorage["olo_Traduzioni"]);
		
	}
	function pCreaLocalStorageVuoto(){
		if(localStorage["olo_Traduzioni"] === undefined || localStorage["olo_Traduzioni"] === 'undefined'){
			localStorage["olo_Traduzioni"] = JSON.stringify({"traduzioni" : []})
		}
	}
	function Traduzione(){
		$('#divAggTraduzioni').fadeIn();
		$('#divGioco').fadeOut();
		if($("#txtDaTrad").val()!=''){
			$('#lblTraduzione').val('');
			$('#lblTraduzione').fadeOut();
			pGetTraduzioni($("#txtDaTrad").val()); 
			//traduci1($("#txtDaTrad").val()); 
			$('#lblTraduzione').fadeIn();			
		}			
	}
	function ClearLS(){
		localStorage["olo_Traduzioni"] = undefined;
		 location.reload();
	}
	function traduci1(parola){
		$.ajax({
				"async": true,
				"crossDomain": true,
				"url": "https://api-free.deepl.com/v2/translate?auth_key=dc6eafa4-0e52-a48c-fd59-0be0dabbc96a:fx&text=" + parola +"&target_lang=IT",
				"method": "POST",			
				success: function(output, status, xhr) { 	
					arrTraduzione.push(output.translations[0].text)				
					console.log('DEEPL:' + output.translations[0].text);									
					//////traduci2($("#txtDaTrad").val());
					$('#lblTraduzione').text(arrTraduzione.toString().replace(',','\n'));	
					Aggiungi(); 
					popolaElenco();
				 },
				 error: function(output) {				  
					//console.log("Error in API call:" + output);
					alert("Error in API call" )
					}		
			  });
	}
	//non funziona più...
	/*function traduci2(parola, linguaDa = 'en', linguaA = 'it'){
		const settings = {
			'async': true,
			'crossDomain': true,
			'url': 'https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?langpair=' + linguaDa +'%7C'+ linguaA +'&q=' + parola + '&mt=1&onlyprivate=0&de=a%40b.c',
			'method': 'GET',
			'headers': {
				'X-RapidAPI-Key': '501224a88dmsh2fcbd7f640a6f54p123732jsn90242d2d745c',
				'X-RapidAPI-Host': 'translated-mymemory---translation-memory.p.rapidapi.com'
			}
		};

		$.ajax(settings).done(function (response) {
			arrTraduzione.push(response.responseData.translatedText);
			console.log('translated-mymemory:' + response.responseData.translatedText);	
			$('#lblTraduzione').text(arrTraduzione.toString().replace(',','\n'));			
			//SalvaParola()
		});
	}*/
	function Aggiungi(){		
		let i = 0;				
		let a = JSON.parse(localStorage["olo_Traduzioni"]);
		let lungh = JSON.parse(localStorage["olo_Traduzioni"]).length | 0;
		//for (let i = 0; i< a.length; ++i){
		while( i< lungh){
			if (a[i].parola == $('#txtDaTrad').val()){
			 
				a[i].traduzioni.push($('#txtNuovaTrad').val());
				localStorage["olo_Traduzioni"] = JSON.stringify(a);
				popolaElenco()
				return ''
			}
			++i;
		}	
		
		if(i == lungh){
			let objParola = {
				"parola": $('#txtDaTrad').val(),
				"traduzioni" : []
			}
			//objParola.traduzioni.push($('#txtNuovaTrad').val())
			objParola.traduzioni = arrTraduzione;
			if($('#txtNuovaTrad').val()!= ''){
				objParola.traduzioni.push($('#txtNuovaTrad').val())				
			}
			a.traduzioni.push(objParola);
			localStorage["olo_Traduzioni"] = JSON.stringify(a);
			popolaElenco()
			return ''
		}
	}
	
	function SalvaParola(){	 
		let objParola = {
			"parola": $('#txtDaTrad').val(),
			"traduzioni" : []
		}
		
		if($('#lblTraduzione').text() != '') objParola.traduzioni.push($('#lblTraduzione').text())
		if($('#lblTraduzione').text() != '') objParola.traduzioni.push($('#lblTraduzione').text())
					
		//leggo il local storage e creo un oggetto ad hoc
		debugger;
		let tradSalvate = JSON.parse(localStorage["olo_Traduzioni"]);
		
		tradSalvate.traduzioni.push(objParola)

		
		//rendo l'oggetto javascript una stringa
		localStorage["olo_Traduzioni"] = JSON.stringify(tradSalvate);		
	popolaElenco()
	}		
	
	function popolaElenco(){
		$('#divAggTraduzioni').fadeIn();
		$('#divGioco').fadeOut();
		return false;
		//$('#elenco').fadeOut()
		a = JSON.parse(localStorage["olo_Traduzioni"]);
		let sHTML = ''
		for (i=a.traduzioni.length -1; i>= 0; --i){
			sHTML += '<div class="col-xs-12 parolaCercata">'
			sHTML += '<b>' + a.traduzioni[i].parola  + '</b><br>'
			//sHTML += a[i].traduzione_1 +'<br>'
			//if(a[i].traduzione_2 != a[i].traduzione_1) sHTML +=  a[i].traduzione_2
			for (j = 0; j< a.traduzioni[i].traduzioni.length; ++j){
				sHTML += a.traduzioni[i].traduzioni[j] +'<br>'
			}
			sHTML += '</div>'						
		}
		 
		$('#elenco').html(sHTML)
		$('#elenco').fadeIn()
	}
	
	function Gioca(){ 
		let a = JSON.parse(localStorage["olo_Traduzioni"]).traduzioni;
		let i = Math.floor(Math.random() * a.length);
		$('#txtDaTrad').val(a[i].parola)
		$('#lblTraduzione').text(a[i].traduzioni)
		$('#lblTraduzione').css('display', 'none');
		
		$('#divAggTraduzioni').fadeOut();
		$('#divGioco').fadeIn();
	}
	
	function Visualizza(){
		$('#lblTraduzione').css('display', '');
	}
	
	function CLEAR_LS(){
		localStorage["olo_Traduzioni"] = undefined
		location.reload();
	
	}
	
	var arrTraduzione;
	function pGetTraduzioni(parola){
		arrTraduzione = []; 
		// deepl
		traduci1(parola);
		// translated-mymemory
		//traduci2(parola); --> chiamato nel success di traduci1!
		//$('#lblTraduzione').text(arrTraduzione.toString().replace(',','\n'));
		
	}
	
function Rispondi(){
	let daTradurre = $('#txtDaTrad').val().trim();
	let risposta = $('#txtRisposta').val().trim();
	let esatta = JSON.parse(localStorage["olo_Traduzioni"]).traduzioni.filter(el => el.parola == daTradurre)[0].traduzioni[0].trim();
	
	if(esatta == risposta){		
		alert('Esatta!')
	}else{
		alert('Sbagliato!')
	}
	$('#txtRisposta').val('');	
	$('#txtDaTrad').val('');	
}	