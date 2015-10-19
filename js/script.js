
var idTable = "";

var nLines =    0;
var nCols  =    0;
var minor  = 9999;
var column =    0;

var arrayInitial    = [];
var arraySimplex    = [];
var arrayMinorValue = [];
var arrayB          = [];
var arrayColumn     = [];
var arrayRow        = [];
var arrayBase       = [];
var arrayDiv        = [];
var nColumn = -1;
var hLine   =  0;

var btClick= true;
var mTable = true;
var check  = true;

var cGetValues	= 0;
var row     	= 0;
var cStop    	= 0;
var idArray     = 0;
var positionRow = 0;
var positionCol = 0;
var cRepeat     = 0;
var Pivo        = 0;

$(document).ready(function(){
	$("#nVar").focus();
});

function doNothing(){
	return false;
}

function initializeArray(nLines, nCols) {
   
   var array = [nLines];
   
   for (var index = 0; index < nLines; index++) {
       
	   array[index] = [nCols];
   
   }
   
   return array;
}

function mountTable(idTable) {

	$('#btCalc').prop("disabled",false);

	var nVar		 = parseInt($('#nVar').val());
	var nRestritions = parseInt($('#nRestritions').val());

	nLines = 2 + nRestritions; //Cabeçalho + Função Objetivo + Número de Restrições
	nCols  = 3 + nVar + nRestritions;
	
	arrayInitial = initializeArray(nLines, nCols);
	
	arrayInitial[positionRow][positionCol++] = "Linha";
	arrayInitial[positionRow][positionCol++] = "Base";

	var control = (nVar + nRestritions) + positionCol;
	for(var indexX = 1, indexF = 1; positionCol < control; indexX++) {
		if(indexX <= nVar) {
			arrayInitial[positionRow][positionCol++] = "x" + indexX;
		} else {			
			arrayInitial[positionRow][positionCol++] = "f" + indexF;
			indexF++;
		}

	}
	
	arrayInitial[positionRow][positionCol] = "b";
	
	positionCol = 0;
	positionRow++;
	
	while(positionRow != nLines) {
		
		arrayInitial[positionRow][positionCol++] = "L" + positionRow;
		
		if(positionRow == (nLines-1)) {
			arrayInitial[positionRow][positionCol++] = "Z";
		} else {
			arrayInitial[positionRow][positionCol++] = "f" + positionRow;
		}
		if(btClick) {
			while(positionCol != nCols) {
			
				var inputName = "input" + positionRow + positionCol;
				
				arrayInitial[positionRow][positionCol++] = '<input type="number" class="span1" id="' + inputName + '">';
			}
		} 
		
		positionCol = 0;
		positionRow++;
		
	}
	
	positionCol = 0;
	
	var headTable = "<tr>";
	
	while(positionCol != nCols) {
	
		headTable = headTable + "<th id="+idTable+nColumn+">" + arrayInitial[0][positionCol++] + "</th>";
		nColumn++;
	}
	
	headTable = headTable + "</tr>";
	
	document.getElementById(idTable).tHead.innerHTML = headTable;
	
	positionCol = 0;
	positionRow = 1;
	
	var bodyTable = "";
	
	while(positionRow != nLines) {
	
		bodyTable = bodyTable + "<tr>";
		
		while(positionCol != nCols) {
			
			bodyTable = bodyTable + "<td id="+idTable+positionRow+positionCol+">" + arrayInitial[positionRow][positionCol++] + "</td>";
			
		}
		
		bodyTable = bodyTable + "</tr>";
		
		positionCol = 0;
		positionRow++;
		
	}
	
	document.getElementById(idTable).tBodies[0].innerHTML = bodyTable;
	positionRow  = 0;
	positionCol = 0;
	nColumn = -1;
}


function getValues(){
	btClick = false;
		
	// CRIANDO A MATRIZ A SER CALCULADA			
	if(mTable){
		row = 0;
		arrayRow = nLines - 1;
		arrayColumn = nCols- 2;
		
		var inputName = "";
		
		arraySimplex = initializeArray(arrayRow, arrayColumn);
		
		// INSERINDO VALORES DOS INPUTS NA MATRIZ A SER CALCULADA
		for(var indexRow = 1; indexRow < nLines; indexRow++, row++) {				
			for(var indexCol = 2, col = 0; indexCol < nCols; indexCol++, col++) {
				inputName = "input" + indexRow + indexCol;				
				if($("#"+inputName).val() == ""){
					arraySimplex[row][col] = 0;
				} else {
					arraySimplex[row][col] = parseFloat($("#"+inputName).val());
				}
			}

		}
		arrayColumn--;		
	}
	
	mTable = false;
	row = nLines - 1;
	row--;
	
	// MENOR VALOR DA LINHA Z 
	for(var col = 0; col < arrayColumn-1; col++) {	
		minor = Math.min(arraySimplex[row][col], minor);		
	}
	for(var col = 0; col < arrayColumn-1; col++) {
		if(arraySimplex[row][col] == minor) {
			column = col;
			break;
		}
	}
	// MONTA UM VETOR COM O MENOR VALOR DA LINHA Z
	for(var row = 0; row < arrayRow; row++) {
		arrayMinorValue[row] = arraySimplex[row][column];
	}

	// MONTAR VETOR DA COLUNA B
	for(var rows = 0; rows < arrayRow-1; rows++) {		
		arrayB[rows] = arraySimplex[rows][arrayColumn];
	}	
	
	cGetValues = 0;
}

function simplexCalc() {

	// CONTROLE DE REPETIÇÃO
	cRepeat = 0;

	// CASO O USUARIO ENTROU COM UM NUMERO MAXIMO DE REPETIÇÃO ARMAZENA ESSE VALOR NA VARIAVEL nRepeat
	if($("#nRepeat").val() != "") {
		var nRepeat = parseInt($("#nRepeat").val());
	}	
	do{		

		// CONTROLE PARA PEGAR VALORES DA TABELA ANTERIOR
		if(cGetValues == 0){			
			minor = 9999;
			cGetValues = 1;			
			getValues();
		}

		minor = 9999;
		arrayDiv = [];
		hLine = column+1;

		// COLUNA B / COLUNA QUE IRÁ ENTRAR NA BASE
		for(var index = 0; index < arrayMinorValue.length; index++) {
			if(arrayMinorValue[index] != 0 && arrayB[index] != 0) {
				arrayDiv[index] = arrayB[index] / arrayMinorValue[index];				
			}
		}		

		// LINHA EM QUE A COLUNA IRÁ ENTRAR
		for(var index = 0; index < arrayDiv.length; index++) {
			if(arrayDiv[index] < minor) {
				minor = arrayDiv[index];
				column = index;
			}
		}

		// SETA O VALOR DO PIVO
		Pivo = arrayMinorValue[column];

	
		// CONSTRUÇÃO DAS TABELAS DE RESULTADO
		if(check){
		    var table = document.createElement("TABLE");
		    table.setAttribute("id", "resultTable"+cRepeat);
		    var thead = document.createElement("THEAD");
		    var tbody = document.createElement("TBODY");
		    table.appendChild(thead);
		    table.appendChild(tbody);
		    table.className = "table";
		    document.getElementById('result').appendChild(table);

			mountTable("resultTable"+cRepeat);
		}

		// VERIFICA SE O CHECKBOX cbResult ESTÁ MARCADO CASO SIM CONSTRUIRÁ APENAS UMA TABELA
		if(document.getElementById('cbResult').checked){
			check = false;
			idArray = 0;
		} else {
			idArray = cRepeat;
		}

		// HABILITADA A DIV DE RESULTADO
		document.getElementById("result").style.display = "inline";
		// DESABILITADA A DIV DE INICIAL
		document.getElementById("initial").style.display = "none";

		// PREENCHE A TABELA RESULTADO
		var hCol = column+1;
		if(cRepeat != 0) {
			var c = cRepeat - 1;
			for(var index = 0; index < nCols; index++) {
				arrayBase[index] = $("#resultTable"+c+index+"1").text();
			}			
			for(var index = 0; index < nCols; index++) {
				$("#resultTable"+cRepeat+index+"1").text(arrayBase[index]);
			}
		}

		$("#resultTable"+idArray+hCol+"1").text($("#resultTable"+idArray+hLine).text());		
		
		// Linha / Pivo 
		for(var index = 0; index <= arrayColumn; index++) {
			if(arraySimplex[column][index] != 0) {			
				arraySimplex[column][index] = arraySimplex[column][index] / Pivo;
			}
		}
		
		//ZERANDO A COLUNA
		for(var index = 0; index < arrayMinorValue.length; index++) {
			if(arrayMinorValue[index] != 0) {
				for(var indexCol = 0; indexCol < arraySimplex[0].length; indexCol++) {
					if(column != index) {
						arraySimplex[index][indexCol] = parseFloat((arraySimplex[column][indexCol] * (-arrayMinorValue[index])) + arraySimplex[index][indexCol]);						
					}
				}
			}
		}
		
		if(!document.getElementById('cbResult').checked) {
			idArray = cRepeat;			
		}

		// MONTA A TABELA RESULTADO
		for(var indexRow = 1, row = 0; indexRow < nLines; indexRow++, row++) {
			for(var indexCol = 2, col = 0; indexCol < nCols; indexCol++, col++) {	
				$("#resultTable"+idArray+indexRow+indexCol).text(arraySimplex[row][col]);
			}				
		}
		
		// VARIAVEL DE VERIFICAÇÃO DE PARADA.
		cStop = 0;

		for(var index = 0; index < nCols-1; index++) {
			if(arraySimplex[nLines-2][index] < 0) {				
				cStop++;
			}
		}
		
		// VERIFICA SE A QUATIDADE DE REPETIÇÃO DEFINIDA PELO O USUARIO FOI ATINGIDA CASO SIM O PROGRAMA É FINALIZADO.
		if(nRepeat == cRepeat)	{
			break;
		}

		cRepeat++;		

	}while(cStop != 0);
}