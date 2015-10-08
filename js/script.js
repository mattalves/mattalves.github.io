posicaoLinha = 0;
posicaoColuna = 0;

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
	
	var numeroLinhas = 2 + numeroRestricoes; //Cabeçalho + Função Objetivo + Número de Restrições
	var numeroColunas = 3 + numeroVariaveis + numeroRestricoes;
	
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
		tabelaResposta[posicaoLinha][posicaoColuna++] = "F" + posicaoLinha;
		
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