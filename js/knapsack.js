function knapsack() {
    // Tabela solução
    var tblSolution = document.getElementById('tblSolution');
    // Cabeçalho e corpo da tabela
    var thead = tblSolution.firstElementChild;
    var tbody = tblSolution.lastElementChild;
    // Limpa os valores atuais
    thead.innerHTML = '<tr></tr>';
    tbody.innerHTML = '';

    /**
     * CABEÇALHO
     */
    var thead_tr = thead.firstElementChild;
    // Coluna para o peso do item
    var itemWCell = thead_tr.appendChild(document.createElement('th'));
    itemWCell.innerHTML = 'Valor';
    // Coluna para o valor do item
    var itemVCell = thead_tr.appendChild(document.createElement('th'));
    itemVCell.innerHTML = 'Peso';
    // Cria uma coluna para cada capacidade possível, incluindo 0
    for(var index=0; index<= capacity; index++) {
      var capacityCell = thead_tr.appendChild(document.createElement('th'));
      capacityCell.innerHTML = index;
    }

  /**
   * CORPO DA TABELA
   */
   // Cria a row 0
   var zRow = tbody.appendChild(document.createElement('tr'));
   // Preenche a coluna do peso do item
   var zwcell = zRow.appendChild(document.createElement('td'));
   zwcell.innerHTML = 0;
   // Preenche a coluna do valor do item
   var zvcell = zRow.appendChild(document.createElement('td'));
   zvcell.innerHTML = 0;
   // Cria uma coluna para cada capacidade possível, incluindo 0
   for(var index=0; index <= capacity; index++) {
     var capacityCell = zRow.appendChild(document.createElement('td'));
     capacityCell.innerHTML = 0;
   }

   // Adiciona os itens
   for(var index=0; index < itens.length; index++){
		// Cria a row para o item
		var row = tbody.appendChild(document.createElement('tr'));
		// Pega a row anterior, será necessária para algumas operações
		var tblSolutionRows = tbody.querySelectorAll('tr');
		var backRow = tblSolutionRows[index].querySelectorAll('td');

		// Preenche a coluna do peso do item
		var wcell = row.appendChild(document.createElement('td'));
		wcell.innerHTML = itens[index][I_VALUE];
		// Preenche a coluna do valor do item
		var vcell = row.appendChild(document.createElement('td'));
		vcell.innerHTML = itens[index][I_WEIGHT];
		// Cria uma coluna para cada capacidade possível, incluindo 0
		for(var cIndex=0; cIndex <= capacity; cIndex++) {
		  // Cria a célula
		  var capacityCell = row.appendChild(document.createElement('td'));

		  // Valor da célula de cima
		  var upLineValue = Number(backRow[2 + cIndex].innerHTML);

		  // Caso o peso do produto seja maior que o peso máximo da coluna,
		  // pegaremos o valor da mesma coluna, na linha de cima
		  if(itens[index][I_WEIGHT] > cIndex) {
			capacityCell.innerHTML = upLineValue;
		  } else {
			// Caso o peso do produto seja menor ou igual o peso máximo da coluna
			// e seja escolhido, adicionamos o valor do mesmo à coluna,
			// e adicionamos o valor correspondente à linha anterior,
			// na coluna do peso restante.
			var leftWeight = (cIndex - itens[index][I_WEIGHT]) + 2;
			var selectedValue = itens[index][I_VALUE] + Number(backRow[leftWeight].innerHTML)

			// Temos também a possibilidade do produto não ser escolhido
			var unselectedValue = upLineValue;

			// Será adicionado o melhor (maior) resultado dentre escolhido e não escolhido
			capacityCell.innerHTML = Math.max(selectedValue, unselectedValue);
		  }
		}
	}

	  /**
	   * Solução final
	   */
	   // Linhas da tabela
	var tblSolutionRows = tbody.querySelectorAll('tr');
    //Vamos começar pela última coluna, considerando as duas primeiras
	// diminuindo conforme encontramos a solução
	var weight = capacity+2;
	// Variável que contém os valores a serem listados na solução final
	var finalSolution = document.getElementById('finalSolution');
	finalSolution.innerHTML = '';

	  // Com a tabela solução montada, iniciamos a resolução do problema
	for(var index = tblSolutionRows.length - 1; index > 0; index--) {
		// Pega as duas linhas necessárias para comparação
		var actualRow = tblSolutionRows[index].querySelectorAll('td');
		var upRow = tblSolutionRows[index-1].querySelectorAll('td');
		//Caso o valor da linha atual, na coluna atual,
		// seja igual a linha anterior, na mesma coluna,
		// significa que a linha não foi escolhida
		if(Number(actualRow[weight].innerHTML) == Number(upRow[weight].innerHTML)) {
		  tblSolutionRows[index].className = 'danger';
		} else {
		  // Caso seja diferente, a linha foi escolhida
		  tblSolutionRows[index].className = 'success';
		  // Como a linha foi escolhida, diminuimos o peso da mesma do peso total
		  weight = weight - Number(actualRow[1].innerHTML);


		  var p = document.createElement('p');
		  p.innerHTML = ' - ' + actualRow[1].innerHTML + '(' + actualRow[0].innerHTML + ')';

		  finalSolution.appendChild(p);
		}
	}
}