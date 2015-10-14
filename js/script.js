
var idTable = "";

var numeroLinhas  =    0;
var numeroColunas =    0;
var minor         = 9999;
var column        =    0;

var tableCalc;

var arrayMinorValue = [];
var arrayB          = [];
var arrayColumn     = [];
var arrayRow        = [];
var arrayBase       = [];

var nColumn = -1;
var hLine   =  0;

var calc   = true;
var mTable = true;
var check  = true;

var agoraVai	 = 0;
var row     	 = 0;
var teste    	 = 0;
var idMatriz     = 0;
var posicaoLinha = 0;
var posicaoColuna= 0;
var cont         = 0;

function criarMatriz(linhasMatriz, colunasMatriz) {
   
   var x = new Array(linhasMatriz);
   
   for (var n = 0; n < linhasMatriz; n++) {
       
	   x[n] = new Array(colunasMatriz);
   
   }
   
   return x;

}

function montarTabela(idTable) {
	
	var numeroVariaveis = parseInt(document.getElementById("textBox1").value);
	var numeroRestricoes = parseInt(document.getElementById("textBox2").value);
	
	numeroLinhas = 2 + numeroRestricoes; //Cabeçalho + Função Objetivo + Número de Restrições
	numeroColunas = 3 + numeroVariaveis + numeroRestricoes;
	
	var tabelaResposta = criarMatriz(numeroLinhas, numeroColunas);
	
	tabelaResposta[posicaoLinha][posicaoColuna++] = "Linha";
	tabelaResposta[posicaoLinha][posicaoColuna++] = "Base";
	
	for(var n1 = 1; posicaoColuna != (numeroVariaveis + 2); n1++)
		tabelaResposta[posicaoLinha][posicaoColuna++] = "x" + n1;
	
	for(var n1 = 1, n2 = posicaoColuna + numeroRestricoes; posicaoColuna != n2; n1++)
		tabelaResposta[posicaoLinha][posicaoColuna++] = "f" + n1;
		
	tabelaResposta[posicaoLinha][posicaoColuna] = "b";
	
	posicaoColuna = 0;
	posicaoLinha++;
	
	while(posicaoLinha != numeroLinhas) {
		
		tabelaResposta[posicaoLinha][posicaoColuna++] = "L" + posicaoLinha;
		
		if(posicaoLinha == (numeroLinhas-1)) {
			tabelaResposta[posicaoLinha][posicaoColuna++] = "Z";
		} else {
			tabelaResposta[posicaoLinha][posicaoColuna++] = "f" + posicaoLinha;
		}
		if(calc) {
			while(posicaoColuna != numeroColunas) {
			
				var nomeEntrada = "input" + posicaoLinha + posicaoColuna;
				
				tabelaResposta[posicaoLinha][posicaoColuna++] = '<input type="number" class="span1" id="' + nomeEntrada + '">';
			}
		} 
		
		posicaoColuna = 0;
		posicaoLinha++;
		
	}
	
	posicaoColuna = 0;
	
	var cabecalhoTabela = "<tr>";
	
	while(posicaoColuna != numeroColunas) {
	
		cabecalhoTabela = cabecalhoTabela + "<th id="+idTable+nColumn+">" + tabelaResposta[0][posicaoColuna++] + "</th>";
		nColumn++;
	}
	
	cabecalhoTabela = cabecalhoTabela + "</tr>";
	
	document.getElementById(idTable).tHead.innerHTML = cabecalhoTabela;
	
	posicaoColuna = 0;
	posicaoLinha = 1;
	
	var corpoTabela = "";
	
	while(posicaoLinha != numeroLinhas) {
	
		corpoTabela = corpoTabela + "<tr>";
		
		while(posicaoColuna != numeroColunas) {
			
			corpoTabela = corpoTabela + "<td id="+idTable+posicaoLinha+posicaoColuna+">" + tabelaResposta[posicaoLinha][posicaoColuna++] + "</td>";
			
		}
		
		corpoTabela = corpoTabela + "</tr>";
		
		posicaoColuna = 0;
		posicaoLinha++;
		
	}
	
	document.getElementById(idTable).tBodies[0].innerHTML = corpoTabela;
	posicaoLinha  = 0;
	posicaoColuna = 0;
	nColumn = -1;
}


function getValues(){
	calc = false;
	
	//alert(row);
	// CRIANDO A MATRIZ A SER CALCULADA			
	if(mTable){
		row = 0;
		arrayRow = numeroLinhas - 1;
		arrayColumn = numeroColunas- 2;
		
		var nomeEntrada = "";
		
		tableCalc = criarMatriz(arrayRow, arrayColumn);
		
		// INSERINDO VALORES DOS INPUTS NA MATRIZ A SER CALCULADA
		for(var indexRow = 1; indexRow < numeroLinhas; indexRow++, row++) {				
			for(var indexCol = 2, col = 0; indexCol < numeroColunas; indexCol++, col++) {
				nomeEntrada = "input" + indexRow + indexCol;				
				if($("#"+nomeEntrada).val() == ""){
					tableCalc[row][col] = 0;
				} else {
					tableCalc[row][col] = parseFloat($("#"+nomeEntrada).val());
				}
			}

		}
		arrayColumn--;		
	}
	
	mTable = false;
	row = numeroLinhas - 1;
	row--;
	
	// MENOR VALOR DA LINHA Z 
	for(var col = 0; col < arrayColumn-1; col++) {	
		minor = Math.min(tableCalc[row][col], minor);		
	}
	for(var col = 0; col < arrayColumn-1; col++) {
		if(tableCalc[row][col] == minor) {
			column = col;
			break;
		}
	}
	// MONTA UM VETOR COM O MENOR VALOR DA LINHA Z
	for(var row = 0; row < arrayRow; row++) {
		arrayMinorValue[row] = tableCalc[row][column];
	}
	//alert("4 " + agoraVai);
	// MONTAR VETOR DA COLUNA B
	for(var rows = 0; rows < arrayRow-1; rows++) {		
		arrayB[rows] = tableCalc[rows][arrayColumn];
	}	
	//alert("5 " + agoraVai);
	agoraVai = 0;
	//simplexCalc();
}

function simplexCalc() {
	cont = 0;
	if($("#nRepeat").val() != "") {
		var nRepeat = parseInt($("#nRepeat").val());
	}	
	do{		
		if(agoraVai == 0){			
			minor = 9999;
			agoraVai = 1;			
			getValues();
		}
	
		minor = 9999;
		var arrayDiv = [];
		hLine = column+1;

		// LINHA A SER TROCADA
		for(var index = 0; index < arrayMinorValue.length; index++) {
			if(arrayMinorValue[index] != 0 && arrayB[index] != 0) {
				arrayDiv[index] = arrayB[index] / arrayMinorValue[index];				
			}
		}		
		
		for(var index = 0; index < arrayDiv.length; index++) {
			if(arrayDiv[index] < minor) {
				minor = arrayDiv[index];
				column = index;
			}
		}

		var Pivo = arrayMinorValue[column];

	

		if(check){
		    var table = document.createElement("TABLE");
		    table.setAttribute("id", "resultTable"+cont);
		    var thead = document.createElement("THEAD");
		    var tbody = document.createElement("TBODY");
		    table.appendChild(thead);
		    table.appendChild(tbody);
		    table.className = "table";
		    document.getElementById('result').appendChild(table);

			montarTabela("resultTable"+cont);
		}


		if(document.getElementById('cbResult').checked){
			check = false;
			idMatriz = 0;
		} else {
			idMatriz = cont;
		}

		document.getElementById("result").style.display = "inline";
		document.getElementById("initial").style.display = "none";

		var hCol = column+1;
		if(cont != 0) {
			var c = cont - 1;
			for(var index = 0; index < numeroColunas; index++) {
				arrayBase[index] = $("#resultTable"+c+index+"1").text();
			}
			alert(arrayBase);
			for(var index = 0; index < numeroColunas; index++) {
				$("#resultTable"+cont+index+"1").text(arrayBase[index]);
			}
		}

		$("#resultTable"+idMatriz+hCol+"1").text($("#resultTable"+idMatriz+hLine).text());		
		
		// Linha / Pivo 
		for(var index = 0; index <= arrayColumn; index++) {
			if(tableCalc[column][index] != 0) {			
				tableCalc[column][index] = tableCalc[column][index] / Pivo;
			}
		}
		
		//ZERANDO A COLUNA
		for(var index = 0; index < arrayMinorValue.length; index++) {
			if(arrayMinorValue[index] != 0) {
				for(var indexCol = 0; indexCol < tableCalc[0].length; indexCol++) {
					if(column != index) {
						tableCalc[index][indexCol] = parseFloat((tableCalc[column][indexCol] * (-arrayMinorValue[index])) + tableCalc[index][indexCol]);						
					}
				}
			}
		}
				
		if(!document.getElementById('cbResult').checked) {
			idMatriz = cont;			
		}
		// MONTA A TABELA RESULTADO
		for(var indexRow = 1, row = 0; indexRow < numeroLinhas; indexRow++, row++) {
			for(var indexCol = 2, col = 0; indexCol < numeroColunas; indexCol++, col++) {	
				$("#resultTable"+idMatriz+indexRow+indexCol).text(tableCalc[row][col]);
			}				
		}
		
		teste = 0;

		for(var index = 0; index < numeroColunas-1; index++) {
			if(tableCalc[numeroLinhas-2][index] < 0) {
				//alert(tableCalc[numeroLinhas-2][index]);
				teste++;
			}
		}
		if(nRepeat == cont)	{
			break;
		}
		cont++;		
	}while(teste != 0);
}