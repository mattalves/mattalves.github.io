$(function () {
  
	$('[data-toggle="tooltip"]').tooltip()

})

function showResult() {

	var textBox1 = document.getElementById("textBox1").value;
	var textArea1 = document.getElementById("textArea1").value;
	var textBox2 = document.getElementById("textBox2").value;
	var checkBox1 = document.getElementById("checkBox1").checked;
	    
    if(textBox1.length == 0) {
        
        $('#modal1').modal('show'); 
         event.preventDefault();
         return false; 
    
    }
    else
    	if(textArea1.length == 0) {

    		$('#modal1').modal('show'); 
         	event.preventDefault();
         	return false;

    	}
    	else
            if(textBox2.length == 0) {
        
                $('#modal1').modal('show'); 
                 event.preventDefault();
                 return false; 
            
            }
    		else
    		{

                var funcaoObjetivo = textBox1.split(' ');
                var restricoesSolucao = textArea1.split('\n');

                var linhaRestricao = [];

                for(var n = 0; n != restricoesSolucao.length; n++)
                    linhaRestricao[n] = restricoesSolucao[n].split(' ');

                var numeroLinhas = 1 + textArea1.split('\n').length; // 1 Linha da Função Objetivo + Total de Linhas das Restrições
                var numeroColunas = 2 + funcaoObjetivo.length + textArea1.split('\n').length + 1; // Linha + Base (2) + Incógnitas + Variáveis de Folga + Valor de B

                var dadosTabela = [[]];

                //dadosTabela[0].length -> Tamanho da Linha 1

                for(var numeroLinha = 0, numeroColuna = 0; numeroLinha != numeroLinhas; numeroLinha++) {

                    dadosTabela[numeroLinha][numeroColuna++] = "L" + numeroLinha;
                    dadosTabela[numeroLinha][numeroColuna++] = "F" + numeroLinha;

                    for(var n = 0; n != funcaoObjetivo.length; n++) {

                        if(linhaRestricao[numeroLinha].indexOf("x" + (n + 1)) > -1)
                          dadosTabela[numeroLinha][numeroColuna++] = linhaRestricao[numeroLinha].substr(0, 1); 

                    }     

                }

                alert(dadosTabela[0]);

				return true;

    		}

}