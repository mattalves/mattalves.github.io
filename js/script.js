posicaoLinha = 0;
posicaoColuna = 0;

var numeroLinhas = 0;
var numeroColunas = 0;
var minor = 9999;
var column = 0;

var tableCalc;
var arrayMinorValue = [];
var arrayB = [];

function criarMatriz(linhasMatriz, colunasMatriz) {
   
   var x = new Array(linhasMatriz);
   
   for (var n = 0; n < linhasMatriz; n++) {
       
	   x[n] = new Array(colunasMatriz);
   
   }
   
   return x;

}

function montarTabela() {

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
			tabelaResposta[posicaoLinha][posicaoColuna++] = "F" + posicaoLinha;
		}
		while(posicaoColuna != numeroColunas) {
		
			var nomeEntrada = "input" + posicaoLinha + posicaoColuna;
			
			tabelaResposta[posicaoLinha][posicaoColuna++] = '<input type="number" class="span1" id="' + nomeEntrada + '">';
		
		}
		
		posicaoColuna = 0;
		posicaoLinha++;
		
	}
	
	posicaoColuna = 0;
	
	var cabecalhoTabela = "<tr>";
	
	while(posicaoColuna != numeroColunas) {
	
		cabecalhoTabela = cabecalhoTabela + "<th>" + tabelaResposta[0][posicaoColuna++] + "</th>";
	
	}
	
	cabecalhoTabela = cabecalhoTabela + "</tr>";
	
	document.getElementById("table1").tHead.innerHTML = cabecalhoTabela;
	
	posicaoColuna = 0;
	posicaoLinha = 1;
	
	var corpoTabela = "";
	
	while(posicaoLinha != numeroLinhas) {
		
		corpoTabela = corpoTabela + "<tr>";
		
		while(posicaoColuna != numeroColunas) {
			
			corpoTabela = corpoTabela + "<td>" + tabelaResposta[posicaoLinha][posicaoColuna++] + "</td>";
			
		}
		
		corpoTabela = corpoTabela + "</tr>";
		
		posicaoColuna = 0;
		posicaoLinha++;
		
	}
	
	document.getElementById("table1").tBodies[0].innerHTML = corpoTabela;
		
	//alert(tabelaResposta);
	
	//document.getElementById("myTable").tHead.innerHTML -> <tr><th></th></tr>
	//document.getElementById("myTable").tBodies[0].innerHTML -> <tr><td></td></tr>

}

function getValues(){
	var row = 0;	
	
	var arrayRow = numeroLinhas - 1;
	var arrayColumn = numeroColunas- 2;
	
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
				tableCalc[row][col] = $("#"+nomeEntrada).val();
			}
		}				
	}
	
	row--;
	arrayColumn--;

	// MENOR VALOR DA COLUNA Z 
	for(var col = 0; col < arrayColumn; col++) {
		if(tableCalc[row][col] < minor) {
			minor = tableCalc[row][col];
			column = col;
		}	
	}
	
	// MONTA UM VETOR COM O MENOR VALOR DA COLUNA Z
	for(var row = 0; row < arrayRow; row++) {
		arrayMinorValue[row] = tableCalc[row][column];
	}
		
	// MONTAR VETOR DA COLUNA B
	for(var rows = 0; rows < arrayRow; rows++) {
		arrayB[rows] = tableCalc[rows][arrayColumn];
	}
	
	simplexCalc();
}

function simplexCalc() {
	
	alert(tableCalc);
	alert(arrayMinorValue);
	alert(arrayB);
	
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
	alert(arrayDiv);
	alert(minor);
	alert(column);
}