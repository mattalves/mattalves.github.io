var posicaoLinha = 0;
var posicaoColuna= 0;

var idTable = "";

var numeroLinhas = 0;
var numeroColunas = 0;
var minor = 9999;
var column = 0;

var tableCalc;

var arrayMinorValue = [];
var arrayB = [];
var arrayColumn;
var arrayRow;
var arrayValueNotNull = [];

var nColumn = -1;
var hLine   = 0;

var calc = true;
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
	var row = 0;	
	
	arrayRow = numeroLinhas - 1;
	arrayColumn = numeroColunas- 2;
	
	var nomeEntrada = "";
	
	// CRIANDO A MATRIZ A SER CALCULADA
	tableCalc = criarMatriz(arrayRow, arrayColumn);	
	
	// INSERINDO VALORES DOS INPUTS NA MATRIZ A SER CALCULADA
	for(var indexRow = 1; indexRow < numeroLinhas; indexRow++, row++) {			
		for(var indexCol = 2, col = 0; indexCol < numeroColunas; indexCol++, col++) {				
			nomeEntrada = "input" + indexRow + indexCol;
			if($("#"+nomeEntrada).val() == ""){
				tableCalc[row][col] = 0;
			} else {
				tableCalc[row][col] = parseInt($("#"+nomeEntrada).val());
			}
		}				
	}
	
	row--;
	arrayColumn--;

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
		
	// MONTAR VETOR DA COLUNA B
	for(var rows = 0; rows < arrayRow-1; rows++) {
		arrayB[rows] = tableCalc[rows][arrayColumn];
	}
	
	simplexCalc();
}

function simplexCalc() {
	/*
	alert(tableCalc);
	alert(arrayMinorValue);
	alert(arrayB);
	*/
	minor = 9999;
	var arrayDiv = [];
	
	for(var index = 0; index < arrayMinorValue.length; index++) {
		if(arrayMinorValue[index] != 0) {
			arrayDiv[index] = arrayB[index] / arrayMinorValue[index];
		}
	}
	
	for(var index = 0; index < arrayDiv.length; index++) {
		if(arrayDiv[index] < minor) {
			minor = arrayDiv[index];
			column = index;
		}
	} 
	
	hLine = column+1;
	$("#initialTable"+hLine+"1").text($("#initialTable"+hLine).text());
	
	var Pivo = arrayMinorValue[column];
	
	montarTabela("resultTable");	
	
	document.getElementById("result").style.display = "inline"
	document.getElementById("initial").style.display = "none"	
	
	$("#resultTable"+hLine+"1").text($("#resultTable"+hLine).text());
	
	// Linha / Pivo 
	for(var index = 0; index <= arrayColumn; index++) {
		if(tableCalc[column][index] != 0) {			
			tableCalc[column][index] = tableCalc[column][index] / Pivo;
		}
	}
	
	//ZERANDO A COLUNA (50%)	
	for(var index = 0; index < arrayMinorValue.length; index++) {					
		if(arrayMinorValue[index] != 0) {			
			for(var indexCol = 0; indexCol < tableCalc[0].length; indexCol++) {
				if(column != index) {
					tableCalc[index][indexCol] = parseInt(tableCalc[column][indexCol] * (-arrayMinorValue[index]) + tableCalc[index][indexCol]);

				}
			}			
		}
	}
	
	
	// MONTA A TABELA RESULTADO
	for(var indexRow = 1, row = 0; indexRow < numeroLinhas; indexRow++, row++) {			
		for(var indexCol = 2, col = 0; indexCol < numeroColunas; indexCol++, col++) {			
			$("#resultTable"+indexRow+indexCol).text(tableCalc[row][col]);
		}				
	}
	
	/*
	alert(Pivo);	
	alert("Divisao "+arrayDiv);
	alert("Menor Divisao "+minor);
	alert(column);
	*/
}